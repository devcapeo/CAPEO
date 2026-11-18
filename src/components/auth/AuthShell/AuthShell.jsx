import Card from '@/components/ui/Card/Card'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import styles from './AuthShell.module.css'

/* Mise en page commune des écrans de compte : en-tête, carte de verre, pied de carte. */
export default function AuthShell({ eyebrow, title, accent, intro, footer, aside, children }) {
  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.intro}>
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} accent={accent} intro={intro} />
        {aside}
      </div>
      <Card padding="lg" accent className={styles.card}>
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </Card>
    </div>
  )
}
