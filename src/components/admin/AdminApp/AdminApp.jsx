'use client'

import Button from '@/components/ui/Button/Button'
import Spinner from '@/components/ui/Spinner/Spinner'
import { cx } from '@/lib/cx'
import { PERIODS } from '@/lib/admin/period'
import Segmented from '@/components/admin/Segmented/Segmented'
import OverviewSection from '@/components/admin/sections/OverviewSection/OverviewSection'
import AudienceSection from '@/components/admin/sections/AudienceSection/AudienceSection'
import PagesSection from '@/components/admin/sections/PagesSection/PagesSection'
import ConversionsSection from '@/components/admin/sections/ConversionsSection/ConversionsSection'
import LiveSection from '@/components/admin/sections/LiveSection/LiveSection'
import MembersSection from '@/components/admin/sections/MembersSection/MembersSection'
import ListingsSection from '@/components/admin/sections/ListingsSection/ListingsSection'
import RoomsSection from '@/components/admin/sections/RoomsSection/RoomsSection'
import { SECTIONS, useAdminShell } from './adminApp.logic'
import styles from './AdminApp.module.css'

const VIEWS = {
  overview: OverviewSection,
  audience: AudienceSection,
  pages: PagesSection,
  conversions: ConversionsSection,
  live: LiveSection,
  members: MembersSection,
  listings: ListingsSection,
  rooms: RoomsSection,
}

const GROUPS = [...new Set(SECTIONS.map((section) => section.group))]

export default function AdminApp() {
  const shell = useAdminShell()

  if (shell.access === 'loading') {
    return (
      <div className={styles.center}>
        <Spinner />
      </div>
    )
  }

  if (shell.access !== 'granted') {
    return (
      <div className={styles.center}>
        <p className={styles.deniedTitle}>Espace réservé à l&apos;équipe CAPEO</p>
        <p className={styles.deniedText}>
          {shell.access === 'anonymous' ? 'Connectez-vous avec un compte administrateur.' : "Votre compte n'a pas les droits d'administration."}
        </p>
        {shell.access === 'anonymous' && <Button href="/connexion?suite=%2Fadmin">Se connecter</Button>}
      </div>
    )
  }

  const View = VIEWS[shell.section]
  const current = SECTIONS.find((section) => section.key === shell.section)

  return (
    <div className={styles.app} data-no-track>
      <nav className={styles.sidebar} aria-label="Navigation de l'espace admin">
        <p className={styles.brand}>
          Espace <em>admin</em>
        </p>
        {GROUPS.map((group) => (
          <div key={group} className={styles.group}>
            <p className={styles.groupLabel}>{group}</p>
            {SECTIONS.filter((section) => section.group === group).map((section) => (
              <button
                key={section.key}
                type="button"
                className={cx(styles.navItem, shell.section === section.key && styles.navActive)}
                onClick={() => shell.navigate(section.key)}
                aria-current={shell.section === section.key ? 'page' : undefined}
              >
                {section.label}
                {section.key === 'live' && <span className={styles.pulse} aria-hidden="true" />}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <h1 className={styles.title}>{current.label}</h1>
          {shell.showPeriod && (
            <div className={styles.period}>
              <Segmented
                label="Période"
                options={PERIODS.map((item) => ({ value: item.key, label: item.label }))}
                value={shell.periodKey}
                onChange={shell.setPeriodKey}
              />
              {shell.periodKey === 'custom' && (
                <div className={styles.dates}>
                  <input
                    type="date"
                    className={styles.date}
                    value={shell.custom.from}
                    max={shell.custom.to}
                    onChange={(event) => shell.setCustom((value) => ({ ...value, from: event.target.value }))}
                    aria-label="Du"
                  />
                  <span>au</span>
                  <input
                    type="date"
                    className={styles.date}
                    value={shell.custom.to}
                    min={shell.custom.from}
                    onChange={(event) => shell.setCustom((value) => ({ ...value, to: event.target.value }))}
                    aria-label="Au"
                  />
                </div>
              )}
              <button type="button" className={styles.refresh} onClick={shell.refresh} title="Actualiser" aria-label="Actualiser">
                ↻
              </button>
            </div>
          )}
        </header>

        <View period={shell.period} refreshKey={shell.refreshKey} navigate={shell.navigate} />
      </div>
    </div>
  )
}
