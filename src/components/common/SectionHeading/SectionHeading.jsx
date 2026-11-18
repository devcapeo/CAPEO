import { cx } from '@/lib/cx'
import styles from './SectionHeading.module.css'

/**
 * En-tête de section : sur-titre, titre (partie en italique or via `accent`), introduction.
 * as : niveau de titre ('h1' pour un en-tête de page, 'h2' par défaut).
 */
export default function SectionHeading({ eyebrow, title, accent, intro, as: Tag = 'h2', align = 'left', className }) {
  return (
    <header className={cx(styles.heading, styles[align], Tag === 'h1' && styles.page, className)}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Tag className={styles.title}>
        {title}
        {accent && <> <em className={styles.accent}>{accent}</em></>}
      </Tag>
      {intro && <p className={styles.intro}>{intro}</p>}
    </header>
  )
}
