'use client'

import { useState } from 'react'
import Panel from '@/components/admin/Panel/Panel'
import Segmented from '@/components/admin/Segmented/Segmented'
import DataTable from '@/components/admin/DataTable/DataTable'
import BarList from '@/components/admin/BarList/BarList'
import Heatmap from '@/components/admin/Heatmap/Heatmap'
import SectionState from '@/components/admin/sections/SectionState/SectionState'
import { formatNumber, formatPercent } from '@/lib/admin/period'
import { DIMENSION_GROUPS, dimensionLabel, useAudienceSummary, useBreakdown } from './audienceSection.logic'
import styles from './AudienceSection.module.css'

function BreakdownPanel({ group, period, refreshKey }) {
  const [dimension, setDimension] = useState(group.dimensions[0].value)
  const { data, loading, error, reload } = useBreakdown(period, refreshKey, dimension)
  const rows = data ?? []
  const total = rows.reduce((sum, row) => sum + Number(row.sessions), 0)

  const columns = [
    { key: 'dim', label: group.dimensions.find((item) => item.value === dimension)?.label, render: (row) => dimensionLabel(dimension, row.dim), csv: (row) => dimensionLabel(dimension, row.dim) },
    { key: 'visitors', label: 'Visiteurs', align: 'right', mono: true, sortValue: (row) => Number(row.visitors), render: (row) => formatNumber(row.visitors) },
    { key: 'sessions', label: 'Sessions', align: 'right', mono: true, sortValue: (row) => Number(row.sessions), render: (row) => formatNumber(row.sessions) },
    { key: 'share', label: 'Part', align: 'right', mono: true, sortValue: (row) => Number(row.sessions), render: (row) => (total ? formatPercent((row.sessions / total) * 100, 1) : '—'), csv: (row) => (total ? ((row.sessions / total) * 100).toFixed(1) : '') },
    { key: 'pageviews', label: 'Pages vues', align: 'right', mono: true, sortValue: (row) => Number(row.pageviews), render: (row) => formatNumber(row.pageviews) },
  ]

  return (
    <Panel title={group.title} subtitle={group.subtitle} actions={<Segmented label={group.title} options={group.dimensions} value={dimension} onChange={setDimension} />} wide>
      {error || (loading && !data) ? (
        <SectionState loading={loading} error={error} onRetry={reload} />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.dim} exportName={`audience-${dimension}`} pageSize={15} />
      )}
    </Panel>
  )
}

export default function AudienceSection({ period, refreshKey }) {
  const summary = useAudienceSummary(period, refreshKey)

  return (
    <div className={styles.stack}>
      <div className={styles.grid}>
        <Panel title="Fidélité" subtitle="Nouveaux visiteurs (première visite sur la période) et récurrents.">
          {summary.data ? <BarList items={summary.loyalty} total={Number(summary.data.overview.visitors)} /> : <SectionState loading={summary.loading} error={summary.error} onRetry={summary.reload} />}
        </Panel>
        <Panel title="Moments de visite" subtitle="Pages vues par jour et par heure (heure de Paris).">
          {summary.data ? <Heatmap cells={summary.data.heatmap} /> : <SectionState loading={summary.loading} error={summary.error} onRetry={summary.reload} />}
        </Panel>
      </div>
      {DIMENSION_GROUPS.map((group) => (
        <BreakdownPanel key={group.key} group={group} period={period} refreshKey={refreshKey} />
      ))}
      <p className={styles.note}>
        Total visiteurs sur la période : {summary.data ? formatNumber(summary.data.overview.visitors) : '—'}. Une session est rattachée à la première source connue de la visite.
      </p>
    </div>
  )
}
