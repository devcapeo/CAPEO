import { SELLER_DATA_NOTICE } from '@/config/site'
import { cx } from '@/lib/cx'
import styles from './SellerDataNotice.module.css'

/* Mention obligatoire sur tout chiffre d'annonce : « Fourni par le vendeur, non vérifié par CAPEO ». */
export default function SellerDataNotice({ plural = false, className }) {
  const text = plural ? 'Chiffres fournis par le vendeur, non vérifiés par CAPEO' : SELLER_DATA_NOTICE

  return (
    <span className={cx(styles.notice, className)}>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5.2" stroke="currentColor" strokeWidth="1" />
        <path d="M6 5.3v3.2M6 3.6v.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
      {text}
    </span>
  )
}
