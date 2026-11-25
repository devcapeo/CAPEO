import { FUNNEL_LABELS, formatNumber, formatPercent } from '@/lib/admin/period'
import styles from './Funnel.module.css'

/* Tunnel de conversion : chaque étape rapportée à la première et à la précédente */
export default function Funnel({ steps }) {
  if (!steps?.length) return null
  const first = Number(steps[0].value) || 0

  return (
    <ol className={styles.funnel}>
      {steps.map((step, index) => {
        const value = Number(step.value) || 0
        const previous = index > 0 ? Number(steps[index - 1].value) || 0 : null
        const share = first ? (value / first) * 100 : 0
        return (
          <li key={step.key} className={styles.step}>
            <div className={styles.row}>
              <span className={styles.label}>{FUNNEL_LABELS[step.key] ?? step.key}</span>
              <span className={styles.value}>{formatNumber(value)}</span>
            </div>
            <div className={styles.track}>
              <span className={styles.bar} style={{ width: `${Math.max(share, value ? 1.5 : 0)}%` }} />
            </div>
            <p className={styles.meta}>
              {index === 0 ? 'Base' : `${formatPercent(share)} des visiteurs`}
              {previous !== null && previous > 0 && ` · ${formatPercent((value / previous) * 100)} de l'étape précédente`}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
