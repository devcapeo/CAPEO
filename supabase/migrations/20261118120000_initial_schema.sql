-- ============================================
-- CAPEO — Schéma initial (phase 3)
-- profils, annonces d'actifs, favoris ; règles d'accès (RLS) et garde-fous.
--
-- Principes :
-- - chaque membre ne lit et ne modifie que ses propres données ;
-- - seules les annonces publiées sont visibles du public ;
-- - un vendeur ne peut ni publier, ni mettre en avant, ni valider lui-même :
--   ces actions relèvent du back-office (clé service, côté serveur uniquement) ;
-- - toute modification d'une annonce publiée la renvoie en examen.
-- Ligne rouge : aucune table ne stocke de flux financier lié à l'acquisition d'un actif.
-- ============================================

-- ── Types ──
create type public.member_kind as enum ('particulier', 'professionnel');
create type public.member_role as enum ('member', 'admin');
create type public.kyc_status as enum ('not_started', 'pending', 'verified', 'rejected');
create type public.review_status as enum ('pending', 'approved', 'rejected');
create type public.asset_status as enum ('draft', 'pending_review', 'published', 'rejected', 'archived');

-- ── Horodatage de mise à jour ──
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================
-- PROFILS
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '' check (char_length(first_name) <= 80),
  last_name text not null default '' check (char_length(last_name) <= 80),
  member_kind public.member_kind not null default 'particulier',
  company_name text check (char_length(company_name) <= 160),
  phone text check (char_length(phone) <= 32),
  role public.member_role not null default 'member',
  kyc_status public.kyc_status not null default 'not_started',
  kyc_verified_at timestamptz,
  review_status public.review_status not null default 'pending',
  reviewed_at timestamptz,
  terms_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil d''un membre CAPEO. Rôle, statut KYC et examen humain ne sont modifiables que par le back-office.';
comment on column public.profiles.kyc_status is 'Vérification d''identité (prestataire spécialisé). CAPEO conserve le résultat, jamais les pièces.';
comment on column public.profiles.review_status is 'Examen humain du profil par l''équipe CAPEO.';

alter table public.profiles enable row level security;

create policy "Un membre lit son propre profil"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Un membre modifie son propre profil"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Privilèges par colonne : un membre ne peut modifier que ses informations de contact.
revoke all on public.profiles from anon;
revoke insert, update, delete on public.profiles from authenticated;
grant update (first_name, last_name, member_kind, company_name, phone) on public.profiles to authenticated;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Création automatique du profil à l'inscription (métadonnées envoyées par le formulaire)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, member_kind, company_name, terms_accepted_at)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'first_name', ''), 80),
    left(coalesce(new.raw_user_meta_data ->> 'last_name', ''), 80),
    case
      when new.raw_user_meta_data ->> 'member_kind' = 'professionnel' then 'professionnel'::public.member_kind
      else 'particulier'::public.member_kind
    end,
    nullif(left(coalesce(new.raw_user_meta_data ->> 'company_name', ''), 160), ''),
    case when new.raw_user_meta_data ->> 'terms_accepted' = 'true' then now() end
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ANNONCES D'ACTIFS
-- ============================================
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  seller_kind public.member_kind not null default 'particulier',
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  family text not null
    check (family in ('immobilier', 'entreprises', 'startups', 'objets-rares')),
  type text not null check (char_length(type) between 1 and 60),
  title text not null check (char_length(title) between 5 and 140),
  summary text not null default '' check (char_length(summary) <= 300),
  description text[] not null default '{}',
  highlights text[] not null default '{}',
  document_labels text[] not null default '{}',
  city text not null check (char_length(city) between 1 and 120),
  region text not null default '' check (char_length(region) <= 120),
  country text not null default 'France' check (char_length(country) <= 80),
  price bigint check (price is null or price > 0),
  figures jsonb not null default '[]'::jsonb check (jsonb_typeof(figures) = 'array'),
  co_acquisition boolean not null default false,
  featured boolean not null default false,
  featured_until timestamptz,
  status public.asset_status not null default 'draft',
  review_note text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.assets is 'Annonce d''actif. Toutes les données (prix, chiffres) sont fournies par le vendeur et non vérifiées par CAPEO.';
comment on column public.assets.price is 'Prix demandé en euros, fourni par le vendeur. Null : prix sur demande.';
comment on column public.assets.figures is 'Chiffres fournis par le vendeur : [{label, value, unit, financial}]. Aucun rendement calculé.';
comment on column public.assets.co_acquisition is 'Le vendeur accepte d''échanger avec plusieurs acquéreurs en Business Room (mise en relation, aucune collecte).';
comment on column public.assets.featured is 'Mise en avant payante, signalée à l''affichage. Réservée au back-office.';
comment on column public.assets.seller_kind is 'Copie du type de vendeur au dépôt, affichée sur l''annonce sans exposer le profil.';

create index assets_listing_idx on public.assets (status, featured desc, published_at desc);
create index assets_seller_idx on public.assets (seller_id);
create index assets_family_type_idx on public.assets (family, type);

alter table public.assets enable row level security;

create policy "Annonces publiées visibles de tous, et le vendeur voit les siennes"
  on public.assets for select to anon, authenticated
  using (status = 'published' or (select auth.uid()) = seller_id);

create policy "Un membre dépose ses annonces"
  on public.assets for insert to authenticated
  with check ((select auth.uid()) = seller_id);

create policy "Un vendeur modifie ses annonces"
  on public.assets for update to authenticated
  using ((select auth.uid()) = seller_id)
  with check ((select auth.uid()) = seller_id);

create policy "Un vendeur supprime ses brouillons"
  on public.assets for delete to authenticated
  using ((select auth.uid()) = seller_id and status = 'draft');

revoke insert, update, delete on public.assets from anon;

/*
 * Garde-fou des annonces, appliqué aux requêtes des membres (rôles anon / authenticated).
 * Le back-office (clé service) n'est pas concerné.
 */
create function public.guard_asset_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.seller_id := (select auth.uid());
    new.seller_kind := coalesce(
      (select p.member_kind from public.profiles p where p.id = (select auth.uid())),
      'particulier'
    );
    new.featured := false;
    new.featured_until := null;
    new.review_note := null;
    new.reviewed_at := null;
    new.published_at := null;
    if new.status not in ('draft', 'pending_review') then
      new.status := 'draft';
    end if;
    return new;
  end if;

  -- UPDATE : champs réservés au back-office, figés
  new.id := old.id;
  new.seller_id := old.seller_id;
  new.seller_kind := old.seller_kind;
  new.slug := old.slug;
  new.featured := old.featured;
  new.featured_until := old.featured_until;
  new.review_note := old.review_note;
  new.reviewed_at := old.reviewed_at;
  new.published_at := old.published_at;
  new.created_at := old.created_at;

  if new.status not in ('draft', 'pending_review', 'archived') then
    raise exception 'Statut d''annonce non autorisé : %', new.status using errcode = '42501';
  end if;

  -- Une annonce publiée modifiée repasse en examen (sauf retrait)
  if old.status = 'published' and new.status <> 'archived' then
    new.status := 'pending_review';
  end if;

  return new;
end;
$$;

create trigger assets_guard
  before insert or update on public.assets
  for each row execute function public.guard_asset_changes();

create trigger assets_set_updated_at
  before update on public.assets
  for each row execute function public.set_updated_at();

-- ============================================
-- FAVORIS
-- ============================================
create table public.favorites (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  asset_id uuid not null references public.assets (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, asset_id)
);

create index favorites_asset_idx on public.favorites (asset_id);

alter table public.favorites enable row level security;

create policy "Un membre lit ses favoris"
  on public.favorites for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Un membre ajoute ses favoris"
  on public.favorites for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Un membre retire ses favoris"
  on public.favorites for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.favorites from anon;
revoke update on public.favorites from authenticated;
