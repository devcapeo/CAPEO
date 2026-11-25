'use client'

import { useMemo, useState } from 'react'
import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'
import { DEVICE_LABELS, slotLabel } from '@/lib/admin/period'
import { pageName } from '@/components/admin/sections/PagesSection/pagesSection.logic'

export const CHART_METRICS = [
  { value: 'traffic', label: 'Visiteurs et pages vues', series: [{ key: 'visitors', label: 'Visiteurs' }, { key: 'pageviews', label: 'Pages vues' }] },
  { value: 'sessions', label: 'Sessions', series: [{ key: 'sessions', label: 'Sessions' }] },
  { value: 'clicks', label: 'Clics', series: [{ key: 'clicks', label: 'Clics' }] },
  { value: 'signups', label: 'Inscriptions', series: [{ key: 'signups', label: 'Inscriptions' }] },
]

export function useOverview(period, refreshKey) {
  const [metric, setMetric] = useState('traffic')

  const query = useAdminQuery(
    async () => {
      const [current, previous, series, pages, sources, devices] = await Promise.all([
        adminApi.fetchOverview(period),
        adminApi.fetchOverview(period.previous),
        adminApi.fetchSeries(period),
        adminApi.fetchPages(period),
        adminApi.fetchBreakdown(period, 'referrer_host', 10),
        adminApi.fetchBreakdown(period, 'device', 5),
      ])
      return { current, previous, series, pages, sources, devices }
    },
    [period.from, period.to, refreshKey]
  )

  const view = useMemo(() => {
    const data = query.data
    if (!data) return null
    return {
      ...data,
      chart: data.series.map((row) => ({
        label: slotLabel(row.t, period.bucket),
        visitors: Number(row.visitors),
        sessions: Number(row.sessions),
        pageviews: Number(row.pageviews),
        clicks: Number(row.clicks),
        signups: Number(row.signups),
      })),
      topPages: data.pages.slice(0, 8).map((row) => ({ key: row.path, label: pageName(row.path), value: Number(row.views) })),
      topSources: data.sources.map((row) => ({
        key: row.dim,
        label: row.dim === '(non renseigné)' ? 'Accès direct / inconnu' : row.dim,
        value: Number(row.sessions),
      })),
      topDevices: data.devices.map((row) => ({ key: row.dim, label: DEVICE_LABELS[row.dim] ?? row.dim, value: Number(row.sessions) })),
    }
  }, [query.data, period.bucket])

  return { ...query, view, metric, setMetric, metricConfig: CHART_METRICS.find((item) => item.value === metric) }
}
