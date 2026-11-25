'use client'

import Panel from '@/components/admin/Panel/Panel'
import DataTable from '@/components/admin/DataTable/DataTable'
import Badge from '@/components/ui/Badge/Badge'
import SectionState from '@/components/admin/sections/SectionState/SectionState'
import { LISTING_LABELS, formatDuration, formatNumber, formatPercent } from '@/lib/admin/period'
import { assetTitle, pageName, usePagesData } from './pagesSection.logic'
import styles from './PagesSection.module.css'

const num = (key, label, format = formatNumber) => ({
  key,
  label,
  align: 'right',
  mono: true,
  sortValue: (row) => Number(row[key]),
  render: (row) => format(row[key]),
})

const PAGE_COLUMNS = [
  { key: 'path', label: 'Page', render: (row) => <span className={styles.page}><span>{pageName(row.path)}</span><small>{row.path}</small></span>, searchValue: (row) => `${row.path} ${pageName(row.path)}` },
  num('views', 'Vues'),
  num('visitors', 'Visiteurs'),
  num('avg_seconds', 'Temps moyen', formatDuration),
  num('avg_scroll', 'Défilement', (value) => `${formatNumber(value)} %`),
  num('entries', 'Entrées'),
  num('exits', 'Sorties'),
  {
    key: 'bounce',
    label: 'Rebond',
    align: 'right',
    mono: true,
    sortValue: (row) => (row.entries > 0 ? row.bounces / row.entries : -1),
    render: (row) => (row.entries > 0 ? formatPercent((row.bounces / row.entries) * 100, 0) : '—'),
    csv: (row) => (row.entries > 0 ? ((row.bounces / row.entries) * 100).toFixed(0) : ''),
  },
]

const ASSET_COLUMNS = [
  { key: 'slug', label: 'Actif', render: (row) => <span className={styles.page}><span>{assetTitle(row)}</span><small>{row.slug}</small></span>, searchValue: (row) => `${row.slug} ${assetTitle(row)}`, csv: (row) => assetTitle(row) },
  {
    key: 'status',
    label: 'Statut',
    render: (row) => (row.status ? <Badge tone={LISTING_LABELS[row.status].tone}>{LISTING_LABELS[row.status].label}</Badge> : <Badge>Démo</Badge>),
    csv: (row) => (row.status ? LISTING_LABELS[row.status].label : 'Démo'),
  },
  num('views', 'Vues'),
  num('visitors', 'Visiteurs'),
  num('room_clicks', 'Clics Business Room'),
  {
    key: 'rate',
    label: 'Taux d’intérêt',
    align: 'right',
    mono: true,
    sortValue: (row) => (row.visitors > 0 ? row.room_clicks / row.visitors : -1),
    render: (row) => (row.visitors > 0 ? formatPercent((row.room_clicks / row.visitors) * 100, 0) : '—'),
    csv: (row) => (row.visitors > 0 ? ((row.room_clicks / row.visitors) * 100).toFixed(0) : ''),
  },
  num('room_requests', 'Demandes'),
  num('room_members', 'Admis'),
  num('favorites', 'Favoris'),
]

export default function PagesSection({ period, refreshKey }) {
  const { data, loading, error, reload } = usePagesData(period, refreshKey)
  if (!data) return <SectionState loading={loading} error={error} onRetry={reload} />

  return (
    <div className={styles.stack}>
      <Panel title="Toutes les pages" subtitle="Temps moyen = temps où l'onglet est visible. Entrées / sorties = première et dernière page des sessions. Rebond = session d'une seule page sans clic." wide>
        <DataTable columns={PAGE_COLUMNS} rows={data.pages} rowKey={(row) => row.path} exportName="pages" initialSort={{ key: 'views', dir: 'desc' }} />
      </Panel>
      <Panel title="Fiches d'actifs" subtitle="Intérêt suscité par chaque actif : vues, clics vers la Business Room, demandes d'accès, favoris." wide>
        <DataTable columns={ASSET_COLUMNS} rows={data.assets} rowKey={(row) => row.slug} exportName="fiches-actifs" initialSort={{ key: 'views', dir: 'desc' }} />
      </Panel>
    </div>
  )
}
