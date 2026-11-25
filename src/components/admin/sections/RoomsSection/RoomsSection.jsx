'use client'

import Link from 'next/link'
import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'
import Panel from '@/components/admin/Panel/Panel'
import DataTable from '@/components/admin/DataTable/DataTable'
import Badge from '@/components/ui/Badge/Badge'
import SectionState from '@/components/admin/sections/SectionState/SectionState'
import { LISTING_LABELS, formatNumber, formatRelative } from '@/lib/admin/period'
import styles from './RoomsSection.module.css'

const count = (key, label) => ({ key, label, align: 'right', mono: true, sortValue: (row) => Number(row[key]), render: (row) => formatNumber(row[key]) })

const COLUMNS = [
  {
    key: 'title',
    label: 'Actif',
    searchValue: (row) => `${row.title} ${row.slug} ${row.seller}`,
    render: (row) => (
      <span className={styles.title}>
        <Link href={`/business-room/${row.slug}`} target="_blank" onClick={(event) => event.stopPropagation()}>{row.title}</Link>
        <small>Vendeur : {row.seller}</small>
      </span>
    ),
  },
  { key: 'status', label: 'Annonce', render: (row) => <Badge tone={LISTING_LABELS[row.status].tone}>{LISTING_LABELS[row.status].label}</Badge>, csv: (row) => LISTING_LABELS[row.status].label },
  count('members', 'Admis'),
  count('requests', 'En attente'),
  count('declined', 'Déclinés'),
  count('messages', 'Messages'),
  count('documents', 'Documents'),
  count('intentions', 'Intentions'),
  { key: 'last_activity', label: 'Dernière activité', sortValue: (row) => row.last_activity ?? '', render: (row) => formatRelative(row.last_activity), csv: (row) => row.last_activity ?? '' },
]

/* Activité des Business Rooms : compteurs uniquement, le contenu des échanges reste privé */
export default function RoomsSection({ refreshKey }) {
  const { data, loading, error, reload } = useAdminQuery(adminApi.fetchRooms, [refreshKey])
  if (!data) return <SectionState loading={loading} error={error} onRetry={reload} />

  return (
    <Panel
      title="Business Rooms"
      subtitle="Par confidentialité, l'espace admin ne montre que des compteurs : les messages, documents et intentions restent visibles des seuls participants."
      wide
    >
      <DataTable columns={COLUMNS} rows={data} rowKey={(row) => row.asset_id} exportName="business-rooms" initialSort={{ key: 'last_activity', dir: 'desc' }} empty="Aucune Business Room ouverte." />
    </Panel>
  )
}
