'use client'

import Panel from '@/components/admin/Panel/Panel'
import Funnel from '@/components/admin/Funnel/Funnel'
import DataTable from '@/components/admin/DataTable/DataTable'
import SectionState from '@/components/admin/sections/SectionState/SectionState'
import { actionLabel, formatNumber } from '@/lib/admin/period'
import { pageName } from '@/components/admin/sections/PagesSection/pagesSection.logic'
import { useConversions } from './conversionsSection.logic'
import styles from './ConversionsSection.module.css'

const ACTION_COLUMNS = [
  { key: 'event', label: 'Action', render: (row) => actionLabel(row.event), searchValue: (row) => `${row.event} ${actionLabel(row.event)}`, csv: (row) => actionLabel(row.event) },
  { key: 'total', label: 'Nombre', align: 'right', mono: true, sortValue: (row) => Number(row.total), render: (row) => formatNumber(row.total) },
  { key: 'visitors', label: 'Visiteurs', align: 'right', mono: true, sortValue: (row) => Number(row.visitors), render: (row) => formatNumber(row.visitors) },
  { key: 'members', label: 'Membres', align: 'right', mono: true, sortValue: (row) => Number(row.members), render: (row) => formatNumber(row.members) },
]

const CLICK_COLUMNS = [
  { key: 'label', label: 'Élément cliqué', render: (row) => <strong className={styles.label}>{row.label}</strong> },
  { key: 'target', label: 'Destination', render: (row) => <span className={styles.mono}>{row.target || '—'}</span> },
  { key: 'path', label: 'Sur la page', render: (row) => pageName(row.path), searchValue: (row) => `${row.path} ${pageName(row.path)}`, csv: (row) => row.path },
  { key: 'clicks', label: 'Clics', align: 'right', mono: true, sortValue: (row) => Number(row.clicks), render: (row) => formatNumber(row.clicks) },
  { key: 'visitors', label: 'Visiteurs', align: 'right', mono: true, sortValue: (row) => Number(row.visitors), render: (row) => formatNumber(row.visitors) },
]

export default function ConversionsSection({ period, refreshKey }) {
  const { data, loading, error, reload } = useConversions(period, refreshKey)
  if (!data) return <SectionState loading={loading} error={error} onRetry={reload} />

  return (
    <div className={styles.stack}>
      <div className={styles.grid}>
        <Panel title="Tunnel de conversion" subtitle="De la visite à l'admission dans une Business Room. Les étapes à partir des comptes créés proviennent de la base (événements de la période).">
          <Funnel steps={data.funnel} />
        </Panel>
        <Panel title="Actions clés" subtitle="Inscriptions, connexions, vérifications, annonces, Business Rooms, filtres du catalogue.">
          <DataTable columns={ACTION_COLUMNS} rows={data.actions} rowKey={(row) => row.event} exportName="actions-cles" searchable={false} empty="Aucune action sur la période." />
        </Panel>
      </div>
      <Panel title="Clics" subtitle="Chaque bouton et lien cliqué, avec sa destination et la page d'origine. Le contenu des champs de saisie n'est jamais collecté." wide>
        <DataTable columns={CLICK_COLUMNS} rows={data.clicks} rowKey={(row) => `${row.label}|${row.target}|${row.path}`} exportName="clics" initialSort={{ key: 'clicks', dir: 'desc' }} searchPlaceholder="Rechercher un bouton, une page…" />
      </Panel>
    </div>
  )
}
