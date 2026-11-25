'use client'

import { useMemo, useState } from 'react'
import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'

export const MEMBER_FILTERS = [
  { value: 'all', label: 'Tous' },
  { value: 'review', label: 'Profils à examiner' },
  { value: 'verified', label: 'Identité vérifiée' },
  { value: 'unverified', label: 'Non vérifiés' },
  { value: 'sellers', label: 'Vendeurs' },
  { value: 'admins', label: 'Admins' },
]

const MATCHERS = {
  all: () => true,
  review: (member) => member.review_status === 'pending',
  verified: (member) => member.kyc_status === 'verified',
  unverified: (member) => member.kyc_status !== 'verified',
  sellers: (member) => Number(member.listings) > 0,
  admins: (member) => member.role === 'admin',
}

export function useMembers(refreshKey) {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const query = useAdminQuery(adminApi.fetchMembers, [refreshKey])

  const members = query.data ?? []
  const filtered = useMemo(() => members.filter(MATCHERS[filter]), [members, filter])
  const counts = useMemo(
    () => Object.fromEntries(MEMBER_FILTERS.map((item) => [item.value, members.filter(MATCHERS[item.value]).length])),
    [members]
  )

  return {
    ...query,
    filter,
    setFilter,
    filtered,
    counts,
    selected: members.find((member) => member.id === selectedId) ?? null,
    select: setSelectedId,
  }
}

export const memberName = (member) => `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() || member.email
