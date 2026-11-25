import { cx } from '@/lib/cx'
import styles from './Segmented.module.css'

/* Sélecteur à onglets compact : options [{ value, label }] */
export default function Segmented({ options, value, onChange, label }) {
  return (
    <div className={styles.group} role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className={cx(styles.option, option.value === value && styles.active)}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined && <span className={styles.count}>{option.count}</span>}
        </button>
      ))}
    </div>
  )
}
