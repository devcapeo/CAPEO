import { cx } from '@/lib/cx'
import styles from './FormStatus.module.css'

/* Message de résultat d'un formulaire. tone : 'error' | 'success' | 'info' */
export default function FormStatus({ tone = 'info', children }) {
  if (!children) return null
  return (
    <p className={cx(styles.status, styles[tone])} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}
