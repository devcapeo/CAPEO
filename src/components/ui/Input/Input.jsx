import { useId } from 'react'
import { cx } from '@/lib/cx'
import styles from './Input.module.css'

/**
 * Champ de formulaire : label, aide, erreur.
 * multiline : rend un <textarea>.
 */
export default function Input({
  label,
  hint,
  error,
  multiline = false,
  id,
  className,
  ...rest
}) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const Field = multiline ? 'textarea' : 'input'

  return (
    <div className={cx(styles.field, error && styles.hasError, className)}>
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
        </label>
      )}
      <Field
        id={fieldId}
        className={cx(styles.control, multiline && styles.multiline)}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        {...rest}
      />
      {hint && !error && <p id={hintId} className={styles.hint}>{hint}</p>}
      {error && <p id={errorId} className={styles.error} role="alert">{error}</p>}
    </div>
  )
}
