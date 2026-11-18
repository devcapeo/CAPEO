-- ============================================
-- CAPEO — Correctif du garde-fou des annonces
-- Une annonce publiée modifiée par son vendeur repasse en examen,
-- une annonce refusée modifiée repasse en brouillon : ces transitions
-- sont appliquées AVANT le contrôle des statuts autorisés.
-- ============================================

create or replace function public.guard_asset_changes()
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

  -- Transitions automatiques
  if old.status = 'published' and new.status <> 'archived' then
    new.status := 'pending_review';
  elsif old.status = 'rejected' and new.status = 'rejected' then
    new.status := 'draft';
  end if;

  -- Un vendeur ne peut viser que ces statuts ; publier ou refuser relève du back-office
  if new.status not in ('draft', 'pending_review', 'archived') then
    raise exception 'Statut d''annonce non autorisé : %', new.status using errcode = '42501';
  end if;

  return new;
end;
$$;
