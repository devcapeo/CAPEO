-- ============================================
-- CAPEO — Temps moyen par page : somme du temps visible / nombre de vues
-- (une même vue peut produire plusieurs segments quand l'onglet est masqué puis réaffiché).
-- ============================================

create or replace function public.admin_pages(p_from timestamptz, p_to timestamptz)
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
           coalesce(sum(e.duration_ms) filter (where e.event = 'page_leave'), 0) as total_ms,
           max(e.scroll_pct) filter (where e.event = 'page_leave') as max_scroll,
           round(avg(e.scroll_pct) filter (where e.event = 'page_leave'), 0) as scr
      from ev e group by e.path
  )
  select pages.p, pages.nviews, pages.nvisitors,
         round(pages.total_ms / 1000.0 / nullif(pages.nviews, 0), 0),
         coalesce(pages.scr, 0),
         (select count(*) from sess where sess.entry = pages.p),
         (select count(*) from sess where sess.leave_path = pages.p),
         (select count(*) from sess where sess.entry = pages.p and sess.pv = 1 and sess.nclicks = 0)
    from pages
   where pages.nviews > 0
   order by pages.nviews desc
   limit 300;
end;
$$;
