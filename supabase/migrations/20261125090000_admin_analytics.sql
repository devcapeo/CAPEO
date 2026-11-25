-- ============================================
-- CAPEO — Espace admin (phase 5)
-- 1. Rôle administrateur et lecture back-office
-- 2. Mesure d'audience first-party (pages vues, clics, temps, défilement)
-- 3. Fonctions d'analyse agrégées (calculées en base, réservées aux admins)
-- 4. Modération des profils et des annonces
--
-- Mesure d'audience : aucune adresse IP stockée, aucun service tiers ;
-- identifiant de visiteur aléatoire (renouvelé tous les 13 mois), pays/ville
-- déduits par l'hébergeur ; conservation 25 mois maximum.
-- Le contenu des Business Rooms (messages, documents, intentions) n'est jamais
-- lisible par l'admin : seuls des compteurs sont exposés.
-- ============================================

-- ============================================
-- 1. RÔLE ADMIN
-- ============================================
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

create function public.assert_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès réservé à l''équipe CAPEO.' using errcode = '42501';
  end if;
  return true;
end;
$$;

create policy "Les admins lisent tous les profils"
  on public.profiles for select to authenticated
  using ((select public.is_admin()));

create policy "Les admins lisent toutes les annonces"
  on public.assets for select to authenticated
  using ((select public.is_admin()));

create policy "Les admins lisent les demandes d'accès"
  on public.room_members for select to authenticated
  using ((select public.is_admin()));

-- ============================================
-- 2. MESURE D'AUDIENCE
-- ============================================
create table public.analytics_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visitor_id uuid not null,
  session_id uuid not null,
  user_id uuid references auth.users (id) on delete set null,
  event text not null check (char_length(event) between 1 and 40),
  path text not null check (char_length(path) between 1 and 300),
  label text check (char_length(label) <= 120),
  target text check (char_length(target) <= 300),
  asset_slug text check (char_length(asset_slug) <= 160),
  referrer_host text check (char_length(referrer_host) <= 200),
  utm_source text check (char_length(utm_source) <= 100),
  utm_medium text check (char_length(utm_medium) <= 100),
  utm_campaign text check (char_length(utm_campaign) <= 100),
  device text check (device in ('mobile', 'tablet', 'desktop')),
  browser text check (char_length(browser) <= 40),
  os text check (char_length(os) <= 40),
  country text check (char_length(country) <= 2),
  region text check (char_length(region) <= 80),
  city text check (char_length(city) <= 80),
  viewport_w integer check (viewport_w between 0 and 10000),
  duration_ms integer check (duration_ms between 0 and 86400000),
  scroll_pct smallint check (scroll_pct between 0 and 100),
  is_new_visitor boolean not null default false,
  props jsonb
);

comment on table public.analytics_events is 'Mesure d''audience first-party : sans IP, sans service tiers. Écriture par le serveur uniquement, lecture réservée aux admins. Conservation 25 mois.';

create index analytics_events_created_idx on public.analytics_events (created_at);
create index analytics_events_event_created_idx on public.analytics_events (event, created_at);
create index analytics_events_session_idx on public.analytics_events (session_id, created_at);
create index analytics_events_visitor_idx on public.analytics_events (visitor_id);
create index analytics_events_user_idx on public.analytics_events (user_id) where user_id is not null;
create index analytics_events_asset_idx on public.analytics_events (asset_slug) where asset_slug is not null;

alter table public.analytics_events enable row level security;

create policy "Les admins lisent la mesure d'audience"
  on public.analytics_events for select to authenticated
  using ((select public.is_admin()));

revoke all on public.analytics_events from anon, authenticated;
grant select on public.analytics_events to authenticated;

/* Purge au-delà de 25 mois (appelée par le serveur de collecte) */
create function public.purge_old_analytics()
returns integer
language sql
security definer
set search_path = ''
as $$
  with deleted as (
    delete from public.analytics_events where created_at < now() - interval '25 months' returning 1
  )
  select count(*)::integer from deleted;
$$;

revoke execute on function public.purge_old_analytics() from public, anon, authenticated;

-- ============================================
-- 3. ANALYSES (admin uniquement)
-- Fuseau de référence : Europe/Paris.
-- ============================================

/* Indicateurs clés de la période (site + activité métier) */
create function public.admin_overview(p_from timestamptz, p_to timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  perform public.assert_admin();

  with ev as (
    select * from public.analytics_events where created_at >= p_from and created_at < p_to
  ),
  sess as (
    select session_id,
           count(*) filter (where event = 'page_view') as pv,
           count(*) filter (where event = 'click') as clicks,
           coalesce(sum(duration_ms) filter (where event = 'page_leave'), 0) as engaged
      from ev group by session_id
  ),
  vis as (
    select visitor_id, bool_or(is_new_visitor) as is_new from ev group by visitor_id
  )
  select jsonb_build_object(
    'visitors', (select count(*) from vis),
    'new_visitors', (select count(*) from vis where is_new),
    'logged_visitors', (select count(distinct visitor_id) from ev where user_id is not null),
    'sessions', (select count(*) from sess where pv > 0),
    'pageviews', (select coalesce(sum(pv), 0) from sess),
    'clicks', (select coalesce(sum(clicks), 0) from sess),
    'pages_per_session', (select coalesce(round(avg(pv)::numeric, 2), 0) from sess where pv > 0),
    'avg_engaged_s', (select coalesce(round(avg(engaged) / 1000.0), 0) from sess where pv > 0),
    'bounce_rate', (select coalesce(round(100.0 * count(*) filter (where pv = 1 and clicks = 0) / nullif(count(*) filter (where pv > 0), 0), 1), 0) from sess),
    'signups', (select count(*) from public.profiles where created_at >= p_from and created_at < p_to),
    'members_total', (select count(*) from public.profiles),
    'kyc_started', (select count(*) from public.profiles where kyc_updated_at >= p_from and kyc_updated_at < p_to),
    'kyc_verified', (select count(*) from public.profiles where kyc_verified_at >= p_from and kyc_verified_at < p_to),
    'kyc_verified_total', (select count(*) from public.profiles where kyc_status = 'verified'),
    'profiles_to_review', (select count(*) from public.profiles where review_status = 'pending'),
    'listings_submitted', (select count(*) from public.assets where created_at >= p_from and created_at < p_to and status <> 'draft'),
    'listings_published', (select count(*) from public.assets where published_at >= p_from and published_at < p_to),
    'listings_live', (select count(*) from public.assets where status = 'published'),
    'listings_to_review', (select count(*) from public.assets where status = 'pending_review'),
    'room_requests', (select count(*) from public.room_members where requested_at >= p_from and requested_at < p_to),
    'room_admissions', (select count(*) from public.room_members where status = 'active' and decided_at >= p_from and decided_at < p_to),
    'room_messages', (select count(*) from public.room_messages where created_at >= p_from and created_at < p_to),
    'room_documents', (select count(*) from public.room_documents where created_at >= p_from and created_at < p_to),
    'favorites', (select count(*) from public.favorites where created_at >= p_from and created_at < p_to)
  ) into result;

  return result;
end;
$$;

/* Série temporelle : visiteurs, sessions, pages vues, clics, inscriptions par heure / jour / semaine / mois */
create function public.admin_timeseries(p_from timestamptz, p_to timestamptz, p_bucket text)
returns table (t timestamp, visitors bigint, sessions bigint, pageviews bigint, clicks bigint, signups bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  if p_bucket not in ('hour', 'day', 'week', 'month') then
    raise exception 'Granularité inconnue.';
  end if;

  return query
  with slots as (
    select generate_series(
      date_trunc(p_bucket, p_from at time zone 'Europe/Paris'),
      date_trunc(p_bucket, (p_to - interval '1 second') at time zone 'Europe/Paris'),
      ('1 ' || p_bucket)::interval
    ) as slot
  ),
  agg as (
    select date_trunc(p_bucket, e.created_at at time zone 'Europe/Paris') as slot,
           count(distinct e.visitor_id) as v,
           count(distinct e.session_id) filter (where e.event = 'page_view') as s,
           count(*) filter (where e.event = 'page_view') as pv,
           count(*) filter (where e.event = 'click') as c
      from public.analytics_events e
     where e.created_at >= p_from and e.created_at < p_to
     group by 1
  ),
  su as (
    select date_trunc(p_bucket, p.created_at at time zone 'Europe/Paris') as slot, count(*) as n
      from public.profiles p
     where p.created_at >= p_from and p.created_at < p_to
     group by 1
  )
  select slots.slot, coalesce(agg.v, 0), coalesce(agg.s, 0), coalesce(agg.pv, 0), coalesce(agg.c, 0), coalesce(su.n, 0)
    from slots
    left join agg on agg.slot = slots.slot
    left join su on su.slot = slots.slot
   order by slots.slot;
end;
$$;

/*
 * Répartition des sessions selon une dimension (attribut de la session : 1re valeur connue).
 * Dimensions : device, browser, os, country, region, city, referrer_host, utm_source,
 * utm_medium, utm_campaign, entry_path, exit_path.
 */
create function public.admin_breakdown(p_from timestamptz, p_to timestamptz, p_dimension text, p_limit integer default 50)
returns table (dim text, visitors bigint, sessions bigint, pageviews bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_column text;
  v_order text := 'created_at';
  v_filter text := 'true';
begin
  perform public.assert_admin();

  if p_dimension in ('device', 'browser', 'os', 'country', 'region', 'city', 'referrer_host', 'utm_source', 'utm_medium', 'utm_campaign') then
    v_column := p_dimension;
  elsif p_dimension = 'entry_path' then
    v_column := 'path';
    v_filter := 'event = ''page_view''';
  elsif p_dimension = 'exit_path' then
    v_column := 'path';
    v_filter := 'event = ''page_view''';
    v_order := 'created_at desc';
  else
    raise exception 'Dimension inconnue.';
  end if;

  return query execute format(
    $q$
      with s as (
        select session_id, visitor_id,
               (array_agg(%1$I order by %2$s) filter (where %1$I is not null and %3$s))[1] as k,
               count(*) filter (where event = 'page_view') as pv
          from public.analytics_events
         where created_at >= $1 and created_at < $2
         group by session_id, visitor_id
      )
      select coalesce(k, '(non renseigné)')::text, count(distinct visitor_id), count(*), coalesce(sum(pv), 0)::bigint
        from s
       where pv > 0
       group by 1
       order by 3 desc, 1
       limit $3
    $q$,
    v_column, v_order, v_filter
  ) using p_from, p_to, greatest(1, least(p_limit, 500));
end;
$$;

/* Pages : vues, visiteurs, temps moyen, défilement moyen, entrées, sorties, rebonds */
create function public.admin_pages(p_from timestamptz, p_to timestamptz)
returns table (
  path text, views bigint, visitors bigint, avg_seconds numeric, avg_scroll numeric,
  entries bigint, exits bigint, bounces bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();

  return query
  with ev as (
    select * from public.analytics_events e where e.created_at >= p_from and e.created_at < p_to
  ),
  sess as (
    select e.session_id,
           (array_agg(e.path order by e.created_at) filter (where e.event = 'page_view'))[1] as entry,
           (array_agg(e.path order by e.created_at desc) filter (where e.event = 'page_view'))[1] as leave_path,
           count(*) filter (where e.event = 'page_view') as pv,
           count(*) filter (where e.event = 'click') as nclicks
      from ev e group by e.session_id
  ),
  pages as (
    select e.path as p,
           count(*) filter (where e.event = 'page_view') as nviews,
           count(distinct e.visitor_id) filter (where e.event = 'page_view') as nvisitors,
           round(avg(e.duration_ms) filter (where e.event = 'page_leave') / 1000.0, 0) as secs,
           round(avg(e.scroll_pct) filter (where e.event = 'page_leave'), 0) as scr
      from ev e group by e.path
  )
  select pages.p, pages.nviews, pages.nvisitors, coalesce(pages.secs, 0), coalesce(pages.scr, 0),
         (select count(*) from sess where sess.entry = pages.p),
         (select count(*) from sess where sess.leave_path = pages.p),
         (select count(*) from sess where sess.entry = pages.p and sess.pv = 1 and sess.nclicks = 0)
    from pages
   where pages.nviews > 0
   order by pages.nviews desc
   limit 300;
end;
$$;

/* Clics : libellé, destination, page d'origine */
create function public.admin_clicks(p_from timestamptz, p_to timestamptz)
returns table (label text, target text, path text, clicks bigint, visitors bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  return query
  select coalesce(e.label, '(sans libellé)'), coalesce(e.target, ''), e.path, count(*), count(distinct e.visitor_id)
    from public.analytics_events e
   where e.created_at >= p_from and e.created_at < p_to and e.event = 'click'
   group by 1, 2, 3
   order by 4 desc
   limit 300;
end;
$$;

/* Actions clés (événements métier envoyés par le site) */
create function public.admin_actions(p_from timestamptz, p_to timestamptz)
returns table (event text, total bigint, visitors bigint, members bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  return query
  select e.event, count(*), count(distinct e.visitor_id), count(distinct e.user_id)
    from public.analytics_events e
   where e.created_at >= p_from and e.created_at < p_to
     and e.event not in ('page_view', 'page_leave', 'click')
   group by 1
   order by 2 desc;
end;
$$;

/* Carte de chaleur : pages vues par jour de semaine (1 = lundi) et par heure */
create function public.admin_heatmap(p_from timestamptz, p_to timestamptz)
returns table (dow integer, hour integer, pageviews bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  return query
  select extract(isodow from e.created_at at time zone 'Europe/Paris')::integer,
         extract(hour from e.created_at at time zone 'Europe/Paris')::integer,
         count(*)
    from public.analytics_events e
   where e.created_at >= p_from and e.created_at < p_to and e.event = 'page_view'
   group by 1, 2;
end;
$$;

/* Tunnel : de la visite à l'admission en Business Room */
create function public.admin_funnel(p_from timestamptz, p_to timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  perform public.assert_admin();

  with ev as (
    select * from public.analytics_events where created_at >= p_from and created_at < p_to and event = 'page_view'
  )
  select jsonb_build_array(
    jsonb_build_object('key', 'visitors', 'value', (select count(distinct visitor_id) from ev)),
    jsonb_build_object('key', 'asset_viewers', 'value', (select count(distinct visitor_id) from ev where asset_slug is not null)),
    jsonb_build_object('key', 'signup_page', 'value', (select count(distinct visitor_id) from ev where path = '/inscription')),
    jsonb_build_object('key', 'signups', 'value', (select count(*) from public.profiles where created_at >= p_from and created_at < p_to)),
    jsonb_build_object('key', 'kyc_started', 'value', (select count(*) from public.profiles where kyc_updated_at >= p_from and kyc_updated_at < p_to)),
    jsonb_build_object('key', 'kyc_verified', 'value', (select count(*) from public.profiles where kyc_verified_at >= p_from and kyc_verified_at < p_to)),
    jsonb_build_object('key', 'room_requesters', 'value', (select count(distinct user_id) from public.room_members where requested_at >= p_from and requested_at < p_to)),
    jsonb_build_object('key', 'room_admitted', 'value', (select count(distinct user_id) from public.room_members where status = 'active' and decided_at >= p_from and decided_at < p_to))
  ) into result;

  return result;
end;
$$;

/* Fiches d'actifs : vues, visiteurs, clics vers la Business Room, demandes, favoris */
create function public.admin_asset_stats(p_from timestamptz, p_to timestamptz)
returns table (
  slug text, title text, status public.asset_status, views bigint, visitors bigint,
  room_clicks bigint, room_requests bigint, room_members bigint, favorites bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  return query
  with ev as (
    select e.asset_slug, e.event, e.visitor_id, e.target
      from public.analytics_events e
     where e.created_at >= p_from and e.created_at < p_to and e.asset_slug is not null
  ),
  vw as (
    select ev.asset_slug,
           count(*) filter (where ev.event = 'page_view') as v,
           count(distinct ev.visitor_id) filter (where ev.event = 'page_view') as u,
           count(*) filter (where ev.event = 'click' and ev.target like '/business-room/%') as rc
      from ev group by ev.asset_slug
  ),
  slugs as (
    select vw.asset_slug as s from vw
    union
    select a.slug from public.assets a
  )
  select slugs.s, a.title, a.status,
         coalesce(vw.v, 0), coalesce(vw.u, 0), coalesce(vw.rc, 0),
         (select count(*) from public.room_members m where m.asset_id = a.id and m.requested_at >= p_from and m.requested_at < p_to),
         (select count(*) from public.room_members m where m.asset_id = a.id and m.status = 'active'),
         (select count(*) from public.favorites f where f.asset_id = a.id)
    from slugs
    left join vw on vw.asset_slug = slugs.s
    left join public.assets a on a.slug = slugs.s
   order by coalesce(vw.v, 0) desc, slugs.s
   limit 300;
end;
$$;

/* Temps réel : visiteurs actifs (5 dernières minutes) et derniers événements */
create function public.admin_live()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  perform public.assert_admin();

  with recent as (
    select * from public.analytics_events where created_at >= now() - interval '5 minutes'
  ),
  current_pages as (
    select distinct on (visitor_id) visitor_id, path, device, country, city, user_id, created_at
      from recent where event = 'page_view'
     order by visitor_id, created_at desc
  )
  select jsonb_build_object(
    'active_visitors', (select count(distinct visitor_id) from recent),
    'pages', coalesce((
      select jsonb_agg(row_to_json(x) order by x.visitors desc)
        from (select path, count(*) as visitors from current_pages group by path) x
    ), '[]'::jsonb),
    'visitors', coalesce((
      select jsonb_agg(jsonb_build_object(
        'visitor_id', c.visitor_id, 'path', c.path, 'device', c.device, 'country', c.country, 'city', c.city,
        'member', nullif(btrim(coalesce(p.first_name, '') || ' ' || coalesce(p.last_name, '')), ''), 'at', c.created_at
      ) order by c.created_at desc)
        from current_pages c left join public.profiles p on p.id = c.user_id
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'at', e.created_at, 'event', e.event, 'path', e.path, 'label', e.label, 'device', e.device,
        'country', e.country, 'city', e.city, 'visitor_id', e.visitor_id,
        'member', nullif(btrim(coalesce(p.first_name, '') || ' ' || coalesce(p.last_name, '')), '')
      ) order by e.created_at desc)
        from (select * from public.analytics_events order by created_at desc limit 80) e
        left join public.profiles p on p.id = e.user_id
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

/* Membres : profil, e-mail, statuts, activité */
create function public.admin_members()
returns table (
  id uuid, email text, first_name text, last_name text, member_kind public.member_kind,
  company_name text, phone text, role public.member_role, kyc_status public.kyc_status,
  review_status public.review_status, created_at timestamptz, email_confirmed_at timestamptz,
  last_sign_in_at timestamptz, last_seen timestamptz, pageviews bigint, listings bigint, rooms bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  return query
  select p.id, u.email::text, p.first_name, p.last_name, p.member_kind, p.company_name, p.phone, p.role,
         p.kyc_status, p.review_status, p.created_at, u.email_confirmed_at, u.last_sign_in_at,
         (select max(e.created_at) from public.analytics_events e where e.user_id = p.id),
         (select count(*) from public.analytics_events e where e.user_id = p.id and e.event = 'page_view'),
         (select count(*) from public.assets a where a.seller_id = p.id),
         (select count(*) from public.room_members m where m.user_id = p.id and m.status in ('requested', 'active'))
    from public.profiles p
    join auth.users u on u.id = p.id
   order by p.created_at desc;
end;
$$;

/* Parcours d'un membre : ses événements, y compris ceux de ses visites avant connexion (même navigateur) */
create function public.admin_member_journey(p_user uuid, p_limit integer default 500)
returns table (
  created_at timestamptz, event text, path text, label text, target text, device text,
  browser text, os text, country text, city text, referrer_host text, duration_ms integer, scroll_pct smallint, logged boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  return query
  select e.created_at, e.event, e.path, e.label, e.target, e.device, e.browser, e.os, e.country, e.city,
         e.referrer_host, e.duration_ms, e.scroll_pct, e.user_id is not null
    from public.analytics_events e
   where e.user_id = p_user
      or e.visitor_id in (select distinct x.visitor_id from public.analytics_events x where x.user_id = p_user)
   order by e.created_at desc
   limit greatest(1, least(p_limit, 2000));
end;
$$;

/* Business Rooms : compteurs uniquement (le contenu reste privé) */
create function public.admin_rooms()
returns table (
  asset_id uuid, slug text, title text, status public.asset_status, seller text,
  members bigint, requests bigint, declined bigint, messages bigint, documents bigint,
  intentions bigint, last_activity timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  return query
  select a.id, a.slug, a.title, a.status,
         btrim(p.first_name || ' ' || p.last_name),
         (select count(*) from public.room_members m where m.asset_id = a.id and m.status = 'active'),
         (select count(*) from public.room_members m where m.asset_id = a.id and m.status = 'requested'),
         (select count(*) from public.room_members m where m.asset_id = a.id and m.status = 'declined'),
         (select count(*) from public.room_messages x where x.asset_id = a.id),
         (select count(*) from public.room_documents x where x.asset_id = a.id),
         (select count(*) from public.room_intentions x where x.asset_id = a.id),
         greatest(
           (select max(x.created_at) from public.room_messages x where x.asset_id = a.id),
           (select max(x.created_at) from public.room_documents x where x.asset_id = a.id),
           (select max(m.requested_at) from public.room_members m where m.asset_id = a.id)
         )
    from public.assets a
    join public.profiles p on p.id = a.seller_id
   where a.status = 'published'
      or exists (select 1 from public.room_members m where m.asset_id = a.id)
   order by 12 desc nulls last;
end;
$$;

/* Annonces avec vendeur (pour la modération) */
create function public.admin_listings()
returns table (
  id uuid, slug text, title text, family text, type text, city text, region text, price bigint,
  status public.asset_status, review_note text, co_acquisition boolean, featured boolean,
  featured_until timestamptz, created_at timestamptz, updated_at timestamptz, published_at timestamptz,
  seller_id uuid, seller_name text, seller_email text, seller_kyc public.kyc_status
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  return query
  select a.id, a.slug, a.title, a.family, a.type, a.city, a.region, a.price, a.status, a.review_note,
         a.co_acquisition, a.featured, a.featured_until, a.created_at, a.updated_at, a.published_at,
         a.seller_id, btrim(p.first_name || ' ' || p.last_name), u.email::text, p.kyc_status
    from public.assets a
    join public.profiles p on p.id = a.seller_id
    join auth.users u on u.id = a.seller_id
   order by case a.status when 'pending_review' then 0 when 'published' then 1 else 2 end, a.updated_at desc;
end;
$$;

-- ============================================
-- 4. MODÉRATION
-- ============================================

/* Décision sur une annonce : publish | reject | archive | review */
create function public.admin_review_asset(p_asset uuid, p_action text, p_note text default null)
returns public.asset_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.asset_status;
begin
  perform public.assert_admin();

  if p_action = 'reject' and coalesce(btrim(p_note), '') = '' then
    raise exception 'Indiquez le motif du refus au vendeur.';
  end if;

  v_status := case p_action
    when 'publish' then 'published'
    when 'reject' then 'rejected'
    when 'archive' then 'archived'
    when 'review' then 'pending_review'
  end;
  if v_status is null then
    raise exception 'Action inconnue.';
  end if;

  update public.assets
     set status = v_status,
         review_note = nullif(btrim(coalesce(p_note, '')), ''),
         reviewed_at = now(),
         published_at = case when v_status = 'published' then coalesce(published_at, now()) else published_at end
   where id = p_asset;

  if not found then
    raise exception 'Annonce introuvable.';
  end if;
  return v_status;
end;
$$;

/* Mise en avant d'une annonce (0 jour = retirer) */
create function public.admin_feature_asset(p_asset uuid, p_days integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  update public.assets
     set featured = p_days > 0,
         featured_until = case when p_days > 0 then now() + make_interval(days => least(p_days, 365)) end
   where id = p_asset;
end;
$$;

/* Examen humain d'un profil */
create function public.admin_review_profile(p_user uuid, p_status public.review_status)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  update public.profiles set review_status = p_status, reviewed_at = now() where id = p_user;
  if not found then
    raise exception 'Membre introuvable.';
  end if;
end;
$$;

/* Rôle d'un membre (un admin ne peut pas se retirer lui-même ses droits) */
create function public.admin_set_role(p_user uuid, p_role public.member_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_admin();
  if p_user = (select auth.uid()) and p_role <> 'admin' then
    raise exception 'Vous ne pouvez pas retirer vos propres droits.';
  end if;
  update public.profiles set role = p_role where id = p_user;
end;
$$;

-- Droits d'exécution : membres connectés (chaque fonction vérifie le rôle admin)
do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.is_admin()',
    'public.assert_admin()',
    'public.admin_overview(timestamptz, timestamptz)',
    'public.admin_timeseries(timestamptz, timestamptz, text)',
    'public.admin_breakdown(timestamptz, timestamptz, text, integer)',
    'public.admin_pages(timestamptz, timestamptz)',
    'public.admin_clicks(timestamptz, timestamptz)',
    'public.admin_actions(timestamptz, timestamptz)',
    'public.admin_heatmap(timestamptz, timestamptz)',
    'public.admin_funnel(timestamptz, timestamptz)',
    'public.admin_asset_stats(timestamptz, timestamptz)',
    'public.admin_live()',
    'public.admin_members()',
    'public.admin_member_journey(uuid, integer)',
    'public.admin_rooms()',
    'public.admin_listings()',
    'public.admin_review_asset(uuid, text, text)',
    'public.admin_feature_asset(uuid, integer)',
    'public.admin_review_profile(uuid, public.review_status)',
    'public.admin_set_role(uuid, public.member_role)'
  ] loop
    execute format('revoke execute on function %s from public, anon', fn);
    execute format('grant execute on function %s to authenticated', fn);
  end loop;
end;
$$;

-- Les premiers comptes admin sont désignés à la main (SQL) ; ensuite depuis l'espace admin (admin_set_role).
