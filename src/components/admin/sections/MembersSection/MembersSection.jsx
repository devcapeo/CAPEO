'use client'

import Panel from '@/components/admin/Panel/Panel'
import DataTable from '@/components/admin/DataTable/DataTable'
import Segmented from '@/components/admin/Segmented/Segmented'
import Badge from '@/components/ui/Badge/Badge'
import SectionState from '@/components/admin/sections/SectionState/SectionState'
import MemberDrawer from '@/components/admin/sections/MemberDrawer/MemberDrawer'
import { KYC_LABELS, REVIEW_LABELS, formatDate, formatNumber, formatRelative } from '@/lib/admin/period'
import { MEMBER_FILTERS, memberName, useMembers } from './membersSection.logic'
import styles from './MembersSection.module.css'

const COLUMNS = [
  {
    key: 'name',
    label: 'Membre',
    sortValue: memberName,
    searchValue: (row) => `${memberName(row)} ${row.email} ${row.company_name ?? ''} ${row.phone ?? ''}`,
    render: (row) => (
      <span className={styles.member}>
        <span>{memberName(row)} {row.role === 'admin' && <Badge tone="gold">Admin</Badge>}</span>
        <small>{row.email}</small>
      </span>
    ),
    csv: memberName,
  },
  { key: 'email', label: 'E-mail', render: (row) => row.email, csv: (row) => row.email, sortable: true },
  { key: 'member_kind', label: 'Type', render: (row) => (row.member_kind === 'professionnel' ? `Pro${row.company_name ? ` · ${row.company_name}` : ''}` : 'Particulier'), csv: (row) => row.member_kind },
  { key: 'kyc_status', label: 'Identité', render: (row) => <Badge tone={KYC_LABELS[row.kyc_status].tone}>{KYC_LABELS[row.kyc_status].label}</Badge>, csv: (row) => KYC_LABELS[row.kyc_status].label },
  { key: 'review_status', label: 'Examen', render: (row) => <Badge tone={REVIEW_LABELS[row.review_status].tone}>{REVIEW_LABELS[row.review_status].label}</Badge>, csv: (row) => REVIEW_LABELS[row.review_status].label },
  { key: 'created_at', label: 'Inscription', sortValue: (row) => row.created_at, render: (row) => formatDate(row.created_at), csv: (row) => row.created_at },
  { key: 'last_seen', label: 'Dernière visite', sortValue: (row) => row.last_seen ?? row.last_sign_in_at ?? '', render: (row) => formatRelative(row.last_seen ?? row.last_sign_in_at), csv: (row) => row.last_seen ?? row.last_sign_in_at ?? '' },
  { key: 'pageviews', label: 'Pages vues', align: 'right', mono: true, sortValue: (row) => Number(row.pageviews), render: (row) => formatNumber(row.pageviews) },
  { key: 'listings', label: 'Annonces', align: 'right', mono: true, sortValue: (row) => Number(row.listings), render: (row) => formatNumber(row.listings) },
  { key: 'rooms', label: 'Rooms', align: 'right', mono: true, sortValue: (row) => Number(row.rooms), render: (row) => formatNumber(row.rooms) },
]

const TABLE_COLUMNS = COLUMNS.filter((column) => column.key !== 'email')

export default function MembersSection({ refreshKey }) {
  const members = useMembers(refreshKey)
  if (!members.data) return <SectionState loading={members.loading} error={members.error} onRetry={members.reload} />

  return (
    <>
      <Panel
        title="Membres"
        subtitle="Cliquez sur un membre pour voir sa fiche complète, son parcours sur le site et le valider."
        actions={
          <Segmented
            label="Filtrer les membres"
            options={MEMBER_FILTERS.map((item) => ({ ...item, count: members.counts[item.value] }))}
            value={members.filter}
            onChange={members.setFilter}
          />
        }
        wide
      >
        <DataTable
          columns={TABLE_COLUMNS}
          rows={members.filtered}
          rowKey={(row) => row.id}
          onRowClick={(row) => members.select(row.id)}
          exportName="membres"
          searchPlaceholder="Nom, e-mail, société, téléphone…"
          initialSort={{ key: 'created_at', dir: 'desc' }}
          empty="Aucun membre dans ce filtre."
        />
      </Panel>
      <MemberDrawer member={members.selected} onClose={() => members.select(null)} onChanged={() => members.reload(true)} />
    </>
  )
}
