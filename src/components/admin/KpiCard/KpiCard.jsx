import { cx } from '@/lib/cx'
import { delta } from '@/lib/admin/period'
import styles from './KpiCard.module.css'

/*
 * Indicateur clé avec variation par rapport à la période précédente.
 * lowerIsBetter : une baisse est une bonne nouvelle (ex. taux de rebond).
 */
export default function KpiCard({ label, value, current, previous, hint, lowerIsBetter, onClick, highlight }) {
  const change = previous === undefined ? null : delta(current, previous)
  const good = change?.value === null ? true : lowerIsBetter ? change?.value < 0 : change?.value > 0
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag type={onClick ? 'button' : undefined} className={cx(styles.card, highlight && styles.highlight, onClick && styles.clickable)} onClick={onClick}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      <p className={styles.foot}>
        {change && change.label !== '=' && (
          <span className={cx(styles.delta, good ? styles.up : styles.down)}>{change.label}</span>
        )}
        {hint && <span className={styles.hint}>{hint}</span>}
      </p>
    </Tag>
  )
}
