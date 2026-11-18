import { useId } from 'react'
import { cx } from '@/lib/cx'
import styles from './Checkbox.module.css'

/* Case à cocher avec libellé riche (liens possibles) et message d'erreur. */
export default function Checkbox({ label, error, className, id, value, ...rest }) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={fieldId} className={styles.row}>
        <input
          id={fieldId}
          type="checkbox"
          className={styles.box}
          checked={Boolean(value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...rest}
        />
        <span className={styles.label}>{label}</span>
      </label>
      {error && <p id={errorId} className={styles.error} role="alert">{error}</p>}
    </div>
  )
}
