'use client'

import KpiCard from '@/components/admin/KpiCard/KpiCard'
import Panel from '@/components/admin/Panel/Panel'
import TrendChart from '@/components/admin/TrendChart/TrendChart'
import BarList from '@/components/admin/BarList/BarList'
import Segmented from '@/components/admin/Segmented/Segmented'
import SectionState from '@/components/admin/sections/SectionState/SectionState'
import { formatDecimal, formatDuration, formatNumber, formatPercent } from '@/lib/admin/period'
import { CHART_METRICS, useOverview } from './overviewSection.logic'
import styles from './OverviewSection.module.css'

export default function OverviewSection({ period, refreshKey, navigate }) {
  const { view, loading, error, reload, metric, setMetric, metricConfig } = useOverview(period, refreshKey)
  if (!view) return <SectionState loading={loading} error={error} onRetry={reload} />

  const { current: c, previous: p } = view
  const kpi = (key, label, format = formatNumber, options = {}) => (
    <KpiCard key={key} label={label} value={format(c[key])} current={c[key]} previous={p[key]} {...options} />
  )

  return (
    <div className={styles.stack}>
      {(c.listings_to_review > 0 || c.profiles_to_review > 0) && (
        <div className={styles.todo}>
          {c.listings_to_review > 0 && (
            <KpiCard label="Annonces à examiner" value={formatNumber(c.listings_to_review)} hint="Ouvrir la modération" highlight onClick={() => navigate('listings')} />
          )}
          {c.profiles_to_review > 0 && (
            <KpiCard label="Profils à examiner" value={formatNumber(c.profiles_to_review)} hint="Ouvrir les membres" highlight onClick={() => navigate('members')} />
          )}
        </div>
      )}

      <div className={styles.kpis}>
        {kpi('visitors', 'Visiteurs uniques')}
        {kpi('sessions', 'Sessions')}
        {kpi('pageviews', 'Pages vues')}
        {kpi('pages_per_session', 'Pages / session', (value) => formatDecimal(value, 2))}
        {kpi('avg_engaged_s', 'Temps moyen / session', formatDuration)}
        {kpi('bounce_rate', 'Taux de rebond', (value) => formatPercent(value), { lowerIsBetter: true })}
        {kpi('new_visitors', 'Nouveaux visiteurs', formatNumber, { hint: `${formatNumber(c.visitors - c.new_visitors)} récurrents` })}
        {kpi('clicks', 'Clics')}
      </div>

      <Panel
        title="Évolution"
        subtitle="Comparaison automatique avec la période précédente de même durée sur les indicateurs."
        actions={<Segmented label="Indicateur" options={CHART_METRICS} value={metric} onChange={setMetric} />}
      >
        <TrendChart data={view.chart} series={metricConfig.series} type={metric === 'signups' ? 'bar' : 'area'} height={300} />
      </Panel>

      <h2 className={styles.heading}>Activité de la plateforme</h2>
      <div className={styles.kpis}>
        {kpi('signups', 'Inscriptions', formatNumber, { hint: `${formatNumber(c.members_total)} membres au total` })}
        {kpi('kyc_started', 'Vérifications lancées')}
        {kpi('kyc_verified', 'Identités vérifiées', formatNumber, { hint: `${formatNumber(c.kyc_verified_total)} au total` })}
        {kpi('listings_submitted', 'Annonces soumises')}
        {kpi('listings_published', 'Annonces publiées', formatNumber, { hint: `${formatNumber(c.listings_live)} en ligne` })}
        {kpi('room_requests', 'Demandes Business Room')}
        {kpi('room_admissions', 'Admissions')}
        {kpi('room_messages', 'Messages échangés')}
        {kpi('room_documents', 'Documents partagés')}
        {kpi('favorites', 'Favoris ajoutés')}
      </div>

      <div className={styles.grid}>
        <Panel title="Pages les plus vues" actions={<button type="button" className={styles.link} onClick={() => navigate('pages')}>Tout voir</button>}>
          <BarList items={view.topPages} />
        </Panel>
        <Panel title="Sources de trafic" subtitle="Sites d'où arrivent les sessions" actions={<button type="button" className={styles.link} onClick={() => navigate('audience')}>Détail</button>}>
          <BarList items={view.topSources} />
        </Panel>
        <Panel title="Appareils" subtitle="Répartition des sessions">
          <BarList items={view.topDevices} />
        </Panel>
      </div>
    </div>
  )
}
