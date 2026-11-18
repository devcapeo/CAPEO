import Link from 'next/link'
import { ASSET_FAMILIES } from '@/config/site'
import Badge from '@/components/ui/Badge/Badge'
import Card from '@/components/ui/Card/Card'
import styles from './AssetFamilies.module.css'

/* Familles d'actifs : le catalogue V1 ouvre en immobilier, les autres sont annoncées. */
export default function AssetFamilies() {
  return (
    <ul className={styles.grid}>
      {ASSET_FAMILIES.map((family, index) => {
        const content = (
          <Card padding="lg" interactive={family.available} className={styles.card}>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            <h3 className={styles.title}>{family.label}</h3>
            <p className={styles.text}>{family.description}</p>
            <Badge tone={family.available ? 'gold' : 'neutral'} dot={family.available} className={styles.badge}>
              {family.available ? 'Ouvert' : 'Bientôt'}
            </Badge>
          </Card>
        )

        return (
          <li key={family.slug}>
            {family.available ? (
              <Link href={`/actifs?famille=${family.slug}`} className={styles.link}>{content}</Link>
            ) : (
              content
            )}
          </li>
        )
      })}
    </ul>
  )
}
