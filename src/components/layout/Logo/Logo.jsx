import Link from 'next/link'
import { cx } from '@/lib/cx'
import styles from './Logo.module.css'

export default function Logo({ className, onClick }) {
  return (
    <Link href="/" className={cx(styles.logo, className)} aria-label="CAPEO — accueil" onClick={onClick}>
      CAP<span className={styles.accent}>E</span>O
    </Link>
  )
}
