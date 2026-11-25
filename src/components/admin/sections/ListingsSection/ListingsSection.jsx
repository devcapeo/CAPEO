'use client'

import Panel from '@/components/admin/Panel/Panel'
import DataTable from '@/components/admin/DataTable/DataTable'
import Segmented from '@/components/admin/Segmented/Segmented'
import Badge from '@/components/ui/Badge/Badge'
import SectionState from '@/components/admin/sections/SectionState/SectionState'
import ListingDrawer from '@/components/admin/sections/ListingDrawer/ListingDrawer'
import { formatPrice } from '@/lib/format'
import { getFamily } from '@/lib/assets/labels'
import { KYC_LABELS, LISTING_LABELS, formatDate } from '@/lib/admin/period'
import { LISTING_TABS, useListings } from './listingsSection.logic'
import styles from './ListingsSection.module.css'

const COLUMNS = [
  {
    key: 'title',
    label: 'Annonce',
    searchValue: (row) => `${row.title} ${row.slug} ${row.city} ${row.seller_name} ${row.seller_email}`,
    render: (row) => (
      <span className={styles.title}>
        <span>{row.title} {row.featured && <Badge tone="gold">En avant</Badge>}</span>
        <small>{getFamily(row.family)?.label ?? row.family} · {row.city}</small>
      </span>
    ),
  },
  { key: 'price', label: 'Prix', align: 'right', mono: true, sortValue: (row) => Number(row.price ?? -1), render: (row) => formatPrice(row.price, { compact: true }), csv: (row) => row.price ?? '' },
  {
    key: 'seller_name',
    label: 'Vendeur',
    render: (row) => (
      <span className={styles.title}>
        <span>{row.seller_name || '—'}</span>
        <small>{row.seller_email} · {KYC_LABELS[row.seller_kyc].label}</small>
      </span>
    ),
    csv: (row) => `${row.seller_name} <${row.seller_email}>`,
  },
  { key: 'status', label: 'Statut', render: (row) => <Badge tone={LISTING_LABELS[row.status].tone}>{LISTING_LABELS[row.status].label}</Badge>, csv: (row) => LISTING_LABELS[row.status].label },
  { key: 'updated_at', label: 'Mise à jour', sortValue: (row) => row.updated_at, render: (row) => formatDate(row.updated_at), csv: (row) => row.updated_at },
]

export default function ListingsSection({ refreshKey }) {
  const listings = useListings(refreshKey)
  if (!listings.data) return <SectionState loading={listings.loading} error={listings.error} onRetry={listings.reload} />

  return (
    <>
      <Panel
        title="Modération des annonces"
        subtitle="Chaque annonce est examinée par l'équipe avant publication. Le vendeur est prévenu par e-mail de la décision."
        actions={
          <Segmented
            label="Statut"
            options={LISTING_TABS.map((item) => ({ ...item, count: listings.counts[item.value] }))}
            value={listings.tab}
            onChange={listings.setTab}
          />
        }
        wide
      >
        <DataTable
          columns={COLUMNS}
          rows={listings.rows}
          rowKey={(row) => row.id}
          onRowClick={(row) => listings.select(row.id)}
          exportName="annonces"
          searchPlaceholder="Titre, ville, vendeur…"
          empty="Aucune annonce dans cette catégorie."
        />
      </Panel>
      <ListingDrawer listing={listings.selected} onClose={() => listings.select(null)} onChanged={() => listings.reload(true)} />
    </>
  )
}
