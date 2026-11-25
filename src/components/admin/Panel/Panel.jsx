import { cx } from '@/lib/cx'
import styles from './Panel.module.css'

/* Bloc du tableau de bord : titre, sous-titre, actions (export…), contenu */
export default function Panel({ title, subtitle, actions, children, className, wide }) {
  return (
    <section className={cx(styles.panel, wide && styles.wide, className)}>
      {(title || actions) && (
        <header className={styles.head}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      {children}
    </section>
  )
}
