import { cx } from '@/lib/cx'
import { formatPrice } from '@/lib/format'
import styles from './Price.module.css'

/* Prix en JetBrains Mono. size : 'sm' | 'md' | 'lg' · compact : "2,5 M €" */
export default function Price({ amount, compact = false, size = 'md', className }) {
  return (
    <span className={cx(styles.price, styles[size], className)}>
      {formatPrice(amount, { compact })}
    </span>
  )
}
