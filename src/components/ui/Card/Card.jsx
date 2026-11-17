import { cx } from '@/lib/cx'
import styles from './Card.module.css'

/**
 * Surface en verre dépoli.
 * as : balise rendue ('div', 'article', 'section'…) · padding : 'none' | 'sm' | 'md' | 'lg'
 * interactive : survol accentué (cartes cliquables) · accent : liseré or
 */
export default function Card({
  as: Tag = 'div',
  padding = 'md',
  interactive = false,
  accent = false,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cx(
        styles.card,
        styles[`pad-${padding}`],
        interactive && styles.interactive,
        accent && styles.accent,
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
