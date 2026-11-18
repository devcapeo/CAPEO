import { JOURNEYS } from '@/content/howItWorks'
import styles from './Journeys.module.css'

/* Parcours acquéreur et vendeur, côte à côte. */
export default function Journeys() {
  return (
    <div className={styles.grid}>
      {JOURNEYS.map((journey) => (
        <section key={journey.id} id={journey.id} className={styles.journey} aria-labelledby={`${journey.id}-titre`}>
          <h3 id={`${journey.id}-titre`} className={styles.label}>{journey.label}</h3>
          <ol className={styles.steps}>
            {journey.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className={styles.title}>{step.title}</p>
                  <p className={styles.text}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
