import { formatNumber, formatPercent } from '@/lib/admin/period'
import styles from './BarList.module.css'

/* Liste classée avec barres proportionnelles : items [{ key, label, value }] */
export default function BarList({ items, total, empty = 'Aucune donnée sur la période.', limit = 8 }) {
  if (!items?.length) return <p className={styles.empty}>{empty}</p>
  const shown = items.slice(0, limit)
  const max = Math.max(...shown.map((item) => item.value), 1)
  const sum = total ?? items.reduce((acc, item) => acc + item.value, 0)

  return (
    <ul className={styles.list}>
      {shown.map((item) => (
        <li key={item.key} className={styles.item}>
          <span className={styles.bar} style={{ width: `${(item.value / max) * 100}%` }} />
          <span className={styles.label} title={item.label}>{item.label}</span>
          <span className={styles.value}>{formatNumber(item.value)}</span>
          <span className={styles.share}>{sum ? formatPercent((item.value / sum) * 100, 0) : '—'}</span>
        </li>
      ))}
    </ul>
  )
}
