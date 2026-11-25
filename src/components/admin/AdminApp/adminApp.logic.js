'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider/auth.logic'
import { computeRange, toInputDate } from '@/lib/admin/period'

export const SECTIONS = [
  { key: 'overview', label: "Vue d'ensemble", group: 'Analyse' },
  { key: 'audience', label: 'Audience', group: 'Analyse' },
  { key: 'pages', label: 'Pages et fiches', group: 'Analyse' },
  { key: 'conversions', label: 'Clics et conversions', group: 'Analyse' },
  { key: 'live', label: 'En direct', group: 'Analyse' },
  { key: 'members', label: 'Membres', group: 'Gestion' },
  { key: 'listings', label: 'Annonces', group: 'Gestion' },
  { key: 'rooms', label: 'Business Rooms', group: 'Gestion' },
]

const WITHOUT_PERIOD = new Set(['live', 'members', 'listings', 'rooms'])

const sectionFromHash = () => {
  if (typeof window === 'undefined') return 'overview'
  const key = window.location.hash.replace('#', '')
  return SECTIONS.some((section) => section.key === key) ? key : 'overview'
}

/* Accès (admin uniquement), section affichée (synchronisée avec l'ancre de l'URL) et période d'analyse */
export function useAdminShell() {
  const { status, profile } = useAuth()
  const [section, setSection] = useState('overview')
  const [periodKey, setPeriodKey] = useState('30d')
  const [custom, setCustom] = useState(() => ({ from: toInputDate(Date.now() - 29 * 864e5), to: toInputDate(Date.now()) }))
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setSection(sectionFromHash())
    const onHash = () => setSection(sectionFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((key) => {
    window.history.replaceState(null, '', `#${key}`)
    setSection(key)
    window.scrollTo({ top: 0 })
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const period = useMemo(() => computeRange(periodKey, custom), [periodKey, custom.from, custom.to, refreshKey])

  const access =
    status === 'loading' || (status === 'authenticated' && !profile)
      ? 'loading'
      : status === 'anonymous'
        ? 'anonymous'
        : profile?.role === 'admin'
          ? 'granted'
          : 'denied'

  return {
    access,
    profile,
    section,
    navigate,
    period,
    periodKey,
    setPeriodKey,
    custom,
    setCustom,
    refresh: () => setRefreshKey((value) => value + 1),
    refreshKey,
    showPeriod: !WITHOUT_PERIOD.has(section),
  }
}
