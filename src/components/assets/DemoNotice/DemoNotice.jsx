import { cx } from '@/lib/cx'
import styles from './DemoNotice.module.css'

/* Bandeau affiché tant que le catalogue contient des annonces d'exemple fictives. */
export default function DemoNotice({ className }) {
  return (
    <p className={cx(styles.notice, className)} role="note">
      <strong>Annonces d&apos;exemple.</strong> Les actifs présentés ici sont fictifs et servent à la démonstration
      de la plateforme. Ils ne sont pas à vendre.
    </p>
  )
}
