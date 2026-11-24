-- ============================================
-- CAPEO — Business Room (phase 4)
-- Espace privé par actif : membres admis par le vendeur, échanges tracés,
-- documents partagés, intentions non engageantes.
--
-- Principes :
-- - accès réservé aux membres dont l'identité est vérifiée (KYC) ;
-- - le vendeur admet ou refuse chaque demande d'accès ;
-- - messages et documents sont horodatés et ne peuvent être ni modifiés ni supprimés (traçabilité) ;
-- - les intentions sont déclaratives et non engageantes ; aucune somme, aucun total,
--   aucun indicateur d'avancement n'est calculé (ligne rouge AMF) ;
-- - aucun flux financier ne transite par CAPEO.
-- ============================================

create type public.room_member_status as enum ('requested', 'active', 'declined', 'left');
create type public.room_intention_mode as enum ('seul', 'a_plusieurs');

-- ============================================
-- FONCTIONS D'ACCÈS
-- ============================================

/* Le membre connecté a-t-il une identité vérifiée ? */
create function public.is_verified_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.kyc_status = 'verified'
  );
$$;

-- ============================================
-- MEMBRES D'UNE BUSINESS ROOM
-- Le vendeur n'a pas de ligne : il est participant de droit.
-- ============================================
create table public.room_members (
  asset_id uuid not null references public.assets (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.room_member_status not null default 'requested',
  intro text not null default '' check (char_length(intro) <= 600),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  primary key (asset_id, user_id)
);

comment on table public.room_members is 'Acquéreurs ayant demandé ou obtenu l''accès à la Business Room d''un actif. Écritures via fonctions uniquement.';

create index room_members_user_idx on public.room_members (user_id);

alter table public.room_members enable row level security;

create policy "Un membre voit sa demande, le vendeur voit toutes les demandes de ses actifs"
  on public.room_members for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (select 1 from public.assets a where a.id = asset_id and a.seller_id = (select auth.uid()))
  );

revoke all on public.room_members from anon, authenticated;
grant select on public.room_members to authenticated;

/* Le membre connecté participe-t-il à la Business Room de cet actif (vendeur ou membre admis) ? */
create function public.can_access_room(p_asset uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.assets a
    where a.id = p_asset and a.seller_id = (select auth.uid())
  ) or exists (
    select 1 from public.room_members m
    where m.asset_id = p_asset and m.user_id = (select auth.uid()) and m.status = 'active'
  );
$$;

-- ============================================
-- ÉCHANGES (append-only)
-- ============================================
create table public.room_messages (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets (id) on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

comment on table public.room_messages is 'Messages d''une Business Room. Horodatés, ni modifiables ni supprimables.';

create index room_messages_asset_idx on public.room_messages (asset_id, created_at);

alter table public.room_messages enable row level security;

create policy "Les participants lisent les échanges"
  on public.room_messages for select to authenticated
  using ((select public.can_access_room(asset_id)));

create policy "Les participants vérifiés écrivent"
  on public.room_messages for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and (select public.can_access_room(asset_id))
    and (select public.is_verified_member())
  );

revoke all on public.room_messages from anon, authenticated;
grant select on public.room_messages to authenticated;
grant insert (asset_id, body) on public.room_messages to authenticated;

-- ============================================
-- INTENTIONS (déclaratives, non engageantes)
-- ============================================
create table public.room_intentions (
  asset_id uuid not null references public.assets (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  mode public.room_intention_mode not null,
  indicative_amount bigint check (indicative_amount is null or indicative_amount > 0),
  note text not null default '' check (char_length(note) <= 600),
  updated_at timestamptz not null default now(),
  primary key (asset_id, user_id)
);

comment on table public.room_intentions is 'Intention non engageante d''un acquéreur : seul ou à plusieurs, montant indicatif facultatif. Jamais agrégée.';

alter table public.room_intentions enable row level security;

create policy "Les participants lisent les intentions"
  on public.room_intentions for select to authenticated
  using ((select public.can_access_room(asset_id)));

create policy "Un acquéreur vérifié déclare son intention"
  on public.room_intentions for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (select public.can_access_room(asset_id))
    and (select public.is_verified_member())
    and not exists (select 1 from public.assets a where a.id = asset_id and a.seller_id = (select auth.uid()))
  );

create policy "Un acquéreur modifie son intention"
  on public.room_intentions for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and (select public.can_access_room(asset_id)));

create policy "Un acquéreur retire son intention"
  on public.room_intentions for delete to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.room_intentions from anon, authenticated;
grant select, delete on public.room_intentions to authenticated;
grant insert (asset_id, mode, indicative_amount, note) on public.room_intentions to authenticated;
grant update (mode, indicative_amount, note) on public.room_intentions to authenticated;

create trigger room_intentions_set_updated_at
  before update on public.room_intentions
  for each row execute function public.set_updated_at();

-- ============================================
-- DOCUMENTS (stockage privé, append-only)
-- Chemin : <asset_id>/<user_id>/<uuid>-<nom>
-- ============================================
create table public.room_documents (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets (id) on delete cascade,
  uploader_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  file_name text not null check (char_length(file_name) between 1 and 200),
  storage_path text not null unique check (char_length(storage_path) <= 400),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 20971520),
  mime_type text not null check (char_length(mime_type) <= 120),
  created_at timestamptz not null default now()
);

comment on table public.room_documents is 'Documents déposés dans une Business Room. Fournis par les membres, non vérifiés par CAPEO.';

create index room_documents_asset_idx on public.room_documents (asset_id, created_at desc);

alter table public.room_documents enable row level security;

create policy "Les participants voient les documents"
  on public.room_documents for select to authenticated
  using ((select public.can_access_room(asset_id)));

create policy "Les participants vérifiés déposent"
  on public.room_documents for insert to authenticated
  with check (
    uploader_id = (select auth.uid())
    and (select public.can_access_room(asset_id))
    and (select public.is_verified_member())
    and storage_path like asset_id::text || '/' || (select auth.uid())::text || '/%'
  );

revoke all on public.room_documents from anon, authenticated;
grant select on public.room_documents to authenticated;
grant insert (asset_id, file_name, storage_path, size_bytes, mime_type) on public.room_documents to authenticated;

-- ============================================
-- ANTI-RAFALE DES E-MAILS (serveur uniquement)
-- ============================================
create table public.room_notifications (
  asset_id uuid not null references public.assets (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('message', 'document')),
  last_sent_at timestamptz not null default now(),
  primary key (asset_id, user_id, kind)
);

alter table public.room_notifications enable row level security;
revoke all on public.room_notifications from anon, authenticated;

-- ============================================
-- FONCTIONS MÉTIER
-- ============================================

/* Un acquéreur vérifié demande l'accès à la Business Room d'un actif publié. */
create function public.request_room_access(p_asset uuid, p_intro text default '')
returns public.room_member_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_seller uuid;
  v_status public.room_member_status;
begin
  if v_uid is null then
    raise exception 'Connexion requise.' using errcode = '42501';
  end if;
  if not public.is_verified_member() then
    raise exception 'Votre identité doit être vérifiée.' using errcode = '42501';
  end if;

  select a.seller_id into v_seller from public.assets a where a.id = p_asset and a.status = 'published';
  if v_seller is null then
    raise exception 'Annonce introuvable.' using errcode = 'P0002';
  end if;
  if v_seller = v_uid then
    raise exception 'Vous êtes le vendeur de cet actif.' using errcode = '42501';
  end if;

  select m.status into v_status from public.room_members m where m.asset_id = p_asset and m.user_id = v_uid;
  if v_status = 'declined' then
    raise exception 'Le vendeur a décliné votre demande.' using errcode = '42501';
  end if;
  if v_status in ('requested', 'active') then
    return v_status;
  end if;

  insert into public.room_members (asset_id, user_id, status, intro, requested_at, decided_at)
  values (p_asset, v_uid, 'requested', left(btrim(coalesce(p_intro, '')), 600), now(), null)
  on conflict (asset_id, user_id) do update
    set status = 'requested', intro = excluded.intro, requested_at = now(), decided_at = null;

  return 'requested';
end;
$$;

/* Le vendeur admet ou décline une demande. */
create function public.decide_room_request(p_asset uuid, p_user uuid, p_accept boolean)
returns public.room_member_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.room_member_status := case when p_accept then 'active' else 'declined' end;
begin
  if not exists (select 1 from public.assets a where a.id = p_asset and a.seller_id = (select auth.uid())) then
    raise exception 'Seul le vendeur peut répondre aux demandes.' using errcode = '42501';
  end if;

  update public.room_members
    set status = v_status, decided_at = now()
    where asset_id = p_asset and user_id = p_user and status = 'requested';

  if not found then
    raise exception 'Demande introuvable ou déjà traitée.' using errcode = 'P0002';
  end if;
  return v_status;
end;
$$;

/* Un acquéreur quitte la Business Room (ses messages restent, pour la traçabilité). */
create function public.leave_room(p_asset uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.room_members
    set status = 'left', decided_at = now()
    where asset_id = p_asset and user_id = (select auth.uid()) and status in ('requested', 'active');
  delete from public.room_intentions where asset_id = p_asset and user_id = (select auth.uid());
end;
$$;

/*
 * Participants affichables : prénom + initiale du nom, jamais l'e-mail.
 * Le vendeur voit aussi les demandes en attente et leur message de présentation.
 */
create function public.room_participants(p_asset uuid)
returns table (
  user_id uuid,
  display_name text,
  member_kind public.member_kind,
  is_seller boolean,
  status public.room_member_status,
  intro text,
  since timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_is_seller boolean;
begin
  if not public.can_access_room(p_asset) then
    return;
  end if;
  select a.seller_id = v_uid into v_is_seller from public.assets a where a.id = p_asset;

  return query
    select p.id,
           btrim(p.first_name || ' ' || left(p.last_name, 1) || case when p.last_name <> '' then '.' else '' end),
           p.member_kind,
           true,
           'active'::public.room_member_status,
           ''::text,
           a.created_at
      from public.assets a
      join public.profiles p on p.id = a.seller_id
     where a.id = p_asset
    union all
    select p.id,
           btrim(p.first_name || ' ' || left(p.last_name, 1) || case when p.last_name <> '' then '.' else '' end),
           p.member_kind,
           false,
           m.status,
           case when v_is_seller then m.intro else '' end,
           coalesce(m.decided_at, m.requested_at)
      from public.room_members m
      join public.profiles p on p.id = m.user_id
     where m.asset_id = p_asset
       and (m.status = 'active' or (v_is_seller and m.status = 'requested'));
end;
$$;

/* Business Rooms du membre : celles qu'il a rejointes ou demandées, et celles de ses actifs. */
create function public.my_rooms()
returns table (
  asset_id uuid,
  slug text,
  title text,
  city text,
  is_seller boolean,
  status public.room_member_status,
  pending_requests integer,
  last_activity timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select a.id, a.slug, a.title, a.city, false, m.status, 0,
         coalesce((select max(x.created_at) from public.room_messages x where x.asset_id = a.id and m.status = 'active'), m.requested_at)
    from public.room_members m
    join public.assets a on a.id = m.asset_id
   where m.user_id = (select auth.uid()) and m.status in ('requested', 'active')
  union all
  select a.id, a.slug, a.title, a.city, true, 'active'::public.room_member_status,
         (select count(*)::integer from public.room_members r where r.asset_id = a.id and r.status = 'requested'),
         coalesce((select max(x.created_at) from public.room_messages x where x.asset_id = a.id), a.published_at)
    from public.assets a
   where a.seller_id = (select auth.uid()) and a.status = 'published'
   order by 8 desc nulls last;
$$;

revoke execute on function public.is_verified_member() from public, anon;
revoke execute on function public.can_access_room(uuid) from public, anon;
revoke execute on function public.request_room_access(uuid, text) from public, anon;
revoke execute on function public.decide_room_request(uuid, uuid, boolean) from public, anon;
revoke execute on function public.leave_room(uuid) from public, anon;
revoke execute on function public.room_participants(uuid) from public, anon;
revoke execute on function public.my_rooms() from public, anon;

grant execute on function public.is_verified_member() to authenticated;
grant execute on function public.can_access_room(uuid) to authenticated;
grant execute on function public.request_room_access(uuid, text) to authenticated;
grant execute on function public.decide_room_request(uuid, uuid, boolean) to authenticated;
grant execute on function public.leave_room(uuid) to authenticated;
grant execute on function public.room_participants(uuid) to authenticated;
grant execute on function public.my_rooms() to authenticated;

-- ============================================
-- STOCKAGE PRIVÉ DES DOCUMENTS
-- ============================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-room',
  'business-room',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do nothing;

/* Premier dossier du chemin = identifiant de l'actif (contrôlé avant conversion). */
create function public.room_folder_asset(p_name text)
returns uuid
language sql
immutable
set search_path = ''
as $$
  select case
    when split_part(p_name, '/', 1) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then split_part(p_name, '/', 1)::uuid
  end;
$$;

grant execute on function public.room_folder_asset(text) to authenticated;

create policy "Business Room : lecture des documents par les participants"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'business-room'
    and (select public.can_access_room(public.room_folder_asset(name)))
  );

create policy "Business Room : dépôt par un participant vérifié, dans son dossier"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'business-room'
    and split_part(name, '/', 2) = (select auth.uid())::text
    and (select public.can_access_room(public.room_folder_asset(name)))
    and (select public.is_verified_member())
  );
