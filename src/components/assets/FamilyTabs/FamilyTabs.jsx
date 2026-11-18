import Link from 'next/link'
import { ASSET_FAMILIES } from '@/config/site'
import { cx } from '@/lib/cx'
import styles from './FamilyTabs.module.css'

/*
 * Onglets des familles d'actifs : le multi-actifs reste visible partout.
 * current : slug de la famille affichée, ou 'tous' pour la liste complète.
 */
export default function FamilyTabs({ current = 'tous' }) {
  const tabs = [{ slug: 'tous', label: 'Tous les actifs', href: '/actifs', available: true }].concat(
    ASSET_FAMILIES.map((family) => ({ ...family, href: `/actifs/famille/${family.slug}` }))
  )

  return (
    <nav className={styles.tabs} aria-label="Familles d'actifs">
      {tabs.map((tab) => {
        const active = tab.slug === current
        return (
          <Link
            key={tab.slug}
            href={tab.href}
            className={cx(styles.tab, active && styles.active, !tab.available && styles.soon)}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
            {tab.slug !== 'tous' && (
              <span className={cx(styles.status, tab.available && styles.open)}>{tab.available ? 'Ouvert' : 'Bientôt'}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
