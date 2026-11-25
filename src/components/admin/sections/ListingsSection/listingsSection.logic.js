'use client'

import { useMemo, useState } from 'react'
import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'

export const LISTING_TABS = [
  { value: 'pending_review', label: 'À examiner' },
  { value: 'published', label: 'Publiées' },
  { value: 'rejected', label: 'Refusées' },
  { value: 'draft', label: 'Brouillons' },
  { value: 'archived', label: 'Archivées' },
  { value: 'all', label: 'Toutes' },
]

export function useListings(refreshKey) {
  const [tab, setTab] = useState('pending_review')
  const [selectedId, setSelectedId] = useState(null)
  const query = useAdminQuery(adminApi.fetchListings, [refreshKey])
  const listings = query.data ?? []

  const counts = useMemo(
    () => Object.fromEntries(LISTING_TABS.map((item) => [item.value, item.value === 'all' ? listings.length : listings.filter((row) => row.status === item.value).length])),
    [listings]
  )
  const rows = useMemo(() => (tab === 'all' ? listings : listings.filter((row) => row.status === tab)), [listings, tab])

  return {
    ...query,
    tab,
    setTab,
    rows,
    counts,
    selected: listings.find((row) => row.id === selectedId) ?? null,
    select: setSelectedId,
  }
}
