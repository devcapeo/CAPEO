import { formatFigure } from '@/lib/format'
import { cx } from '@/lib/cx'
import SellerDataNotice from '@/components/assets/SellerDataNotice/SellerDataNotice'
import styles from './SellerFigure.module.css'

/* Un chiffre d'annonce, toujours accompagné de la mention vendeur. */
export default function SellerFigure({ figure }) {
  const numeric = figure.unit !== 'text'

  return (
    <div className={cx(styles.figure, figure.financial && styles.financial)}>
      <dt className={styles.label}>{figure.label}</dt>
      <dd className={styles.value}>
        <span className={numeric ? styles.mono : undefined}>{formatFigure(figure)}</span>
        <SellerDataNotice className={styles.notice} />
      </dd>
    </div>
  )
}
