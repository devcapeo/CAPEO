import { cx } from '@/lib/cx'
import styles from './Spinner.module.css'

/* size : 'sm' | 'md' | 'lg' */
export default function Spinner({ size = 'md', label = 'Chargement', className }) {
  return (
    <span className={cx(styles.spinner, styles[size], className)} role="status">
      <span className="visually-hidden">{label}</span>
    </span>
  )
}
