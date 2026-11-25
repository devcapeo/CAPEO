'use client'

import { useMemo } from 'react'
import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'
import { DEVICE_LABELS, countryFlag, countryName } from '@/lib/admin/period'

export const DIMENSION_GROUPS = [
  {
    key: 'sources',
    title: 'Provenance',
    subtitle: "D'où viennent les sessions : site référent et campagnes (paramètres utm_ dans vos liens).",
    dimensions: [
      { value: 'referrer_host', label: 'Sites référents' },
      { value: 'utm_source', label: 'Source (utm)' },
      { value: 'utm_medium', label: 'Support (utm)' },
      { value: 'utm_campaign', label: 'Campagne (utm)' },
    ],
  },
  {
    key: 'geo',
    title: 'Géographie',
    subtitle: "Localisation approximative déduite par l'hébergeur, sans adresse IP conservée.",
    dimensions: [
      { value: 'country', label: 'Pays' },
      { value: 'region', label: 'Région' },
      { value: 'city', label: 'Ville' },
    ],
  },
  {
    key: 'tech',
    title: 'Équipement',
    subtitle: 'Appareil, navigateur et système des visiteurs.',
    dimensions: [
      { value: 'device', label: 'Appareil' },
      { value: 'browser', label: 'Navigateur' },
      { value: 'os', label: 'Système' },
    ],
  },
]

export function dimensionLabel(dimension, value) {
  if (value === '(non renseigné)') return dimension === 'referrer_host' ? 'Accès direct / inconnu' : 'Non renseigné'
  if (dimension === 'country') return `${countryFlag(value)} ${countryName(value)}`.trim()
  if (dimension === 'device') return DEVICE_LABELS[value] ?? value
  return value
}

export function useBreakdown(period, refreshKey, dimension) {
  return useAdminQuery(() => adminApi.fetchBreakdown(period, dimension, 200), [period.from, period.to, refreshKey, dimension])
}

export function useAudienceSummary(period, refreshKey) {
  const query = useAdminQuery(
    async () => {
      const [overview, heatmap] = await Promise.all([adminApi.fetchOverview(period), adminApi.fetchHeatmap(period)])
      return { overview, heatmap }
    },
    [period.from, period.to, refreshKey]
  )

  const loyalty = useMemo(() => {
    const overview = query.data?.overview
    if (!overview) return []
    return [
      { key: 'new', label: 'Nouveaux visiteurs', value: Number(overview.new_visitors) },
      { key: 'returning', label: 'Visiteurs récurrents', value: Math.max(0, Number(overview.visitors) - Number(overview.new_visitors)) },
      { key: 'logged', label: 'dont membres connectés', value: Number(overview.logged_visitors) },
    ]
  }, [query.data])

  return { ...query, loyalty }
}
