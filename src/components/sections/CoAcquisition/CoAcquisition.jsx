import { CO_ACQUISITION } from '@/content/howItWorks'
import Card from '@/components/ui/Card/Card'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import styles from './CoAcquisition.module.css'

/* Co-acquisition présentée comme une mise en relation entre co-acquéreurs, jamais comme une collecte. */
export default function CoAcquisition() {
  const { eyebrow, title, text, does, doesNot, note } = CO_ACQUISITION

  return (
    <div className={styles.wrapper}>
      <SectionHeading eyebrow={eyebrow} title={title} intro={text} />

      <div className={styles.columns}>
        <Card padding="lg" accent>
          <p className={styles.columnTitle}>Ce que fait CAPEO</p>
          <ul className={styles.list}>
            {does.map((item) => <li key={item} className={styles.yes}>{item}</li>)}
          </ul>
        </Card>
        <Card padding="lg">
          <p className={styles.columnTitle}>Ce que CAPEO ne fait pas</p>
          <ul className={styles.list}>
            {doesNot.map((item) => <li key={item} className={styles.no}>{item}</li>)}
          </ul>
        </Card>
      </div>

      <p className={styles.note}>{note}</p>
    </div>
  )
}
