import { useId } from 'react'
import { cx } from '@/lib/cx'
import styles from './Select.module.css'

/* Liste déroulante avec libellé et erreur. options : [{ value, label, disabled }] */
export default function Select({ label, error, hint, options, placeholder, id, className, ...rest }) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div className={cx(styles.field, error && styles.hasError, className)}>
      {label && <label htmlFor={fieldId} className={styles.label}>{label}</label>}
      <select id={fieldId} className={styles.control} aria-invalid={error ? true : undefined} aria-describedby={errorId} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p id={errorId} className={styles.error} role="alert">{error}</p>}
    </div>
  )
}
