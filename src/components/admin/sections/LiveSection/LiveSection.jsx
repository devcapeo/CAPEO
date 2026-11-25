'use client'

import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'
import Panel from '@/components/admin/Panel/Panel'
import BarList from '@/components/admin/BarList/BarList'
import KpiCard from '@/components/admin/KpiCard/KpiCard'
import SectionState from '@/components/admin/sections/SectionState/SectionState'
import { DEVICE_LABELS, actionLabel, countryFlag, formatNumber, formatTime } from '@/lib/admin/period'
import { pageName } from '@/components/admin/sections/PagesSection/pagesSection.logic'
import styles from './LiveSection.module.css'

const REFRESH = 15000

/* Visiteurs actifs (5 dernières minutes) et flux des derniers événements, rafraîchis toutes les 15 secondes */
export default function LiveSection({ refreshKey }) {
  const { data, loading, error, reload } = useAdminQuery(adminApi.fetchLive, [refreshKey], { interval: REFRESH })
  if (!data) return <SectionState loading={loading} error={error} onRetry={reload} />

  const pages = (data.pages ?? []).map((row) => ({ key: row.path, label: pageName(row.path), value: Number(row.visitors) }))

  return (
    <div className={styles.stack}>
      <div className={styles.top}>
        <KpiCard label="Visiteurs actifs" value={formatNumber(data.active_visitors)} hint="5 dernières minutes · actualisé toutes les 15 s" highlight />
        <Panel title="Pages consultées en ce moment">
          <BarList items={pages} empty="Personne en ce moment." />
        </Panel>
      </div>

      <div className={styles.grid}>
        <Panel title="Visiteurs connectés au site">
          {data.visitors?.length ? (
            <ul className={styles.list}>
              {data.visitors.map((visitor) => (
                <li key={visitor.visitor_id} className={styles.item}>
                  <span className={styles.who}>{visitor.member ?? 'Visiteur anonyme'}</span>
                  <span className={styles.meta}>
                    {pageName(visitor.path)} · {DEVICE_LABELS[visitor.device] ?? '—'} · {countryFlag(visitor.country)} {visitor.city ?? ''}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Aucun visiteur actif.</p>
          )}
        </Panel>

        <Panel title="Flux d'activité" subtitle="80 derniers événements">
          <ol className={styles.feed}>
            {(data.events ?? []).map((event, index) => (
              <li key={`${event.at}-${index}`} className={styles.event}>
                <time className={styles.time}>{formatTime(event.at)}</time>
                <span className={styles.what}>
                  <strong>{actionLabel(event.event)}</strong>
                  {event.label ? ` « ${event.label} »` : ''} · {pageName(event.path)}
                </span>
                <span className={styles.meta}>
                  {event.member ?? 'Anonyme'} · {DEVICE_LABELS[event.device] ?? '—'} {countryFlag(event.country)}
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  )
}
