import { cx } from '@/lib/cx'
import styles from './Badge.module.css'

/* tone : 'gold' | 'cobalt' | 'neutral' | 'success' | 'danger' */
export default function Badge({ tone = 'neutral', dot = false, className, children }) {
  return (
    <span className={cx(styles.badge, styles[tone], className)}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  )
}
