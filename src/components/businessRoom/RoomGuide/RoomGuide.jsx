import Card from '@/components/ui/Card/Card'
import { CO_ACQUISITION_GUIDE, GUIDE_DISCLAIMER } from '@/content/businessRoom'
import styles from './RoomGuide.module.css'

/* Repères génériques pour acquérir à plusieurs (information, pas de conseil) */
export default function RoomGuide() {
  return (
    <Card padding="lg" className={styles.card}>
      <details className={styles.details}>
        <summary className={styles.summary}>Acquérir à plusieurs : les repères</summary>
        <ol className={styles.list}>
          {CO_ACQUISITION_GUIDE.map((step) => (
            <li key={step.title}>
              <p className={styles.title}>{step.title}</p>
              <p className={styles.text}>{step.text}</p>
            </li>
          ))}
        </ol>
        <p className={styles.disclaimer}>{GUIDE_DISCLAIMER}</p>
      </details>
    </Card>
  )
}
