import Link from 'next/link'
import { cx } from '@/lib/cx'
import styles from './Button.module.css'

/**
 * Bouton CAPEO.
 * - `href` fourni  -> rendu en lien Next (navigation)
 * - sinon          -> <button>
 * variant : 'gold' | 'glass' | 'ghost'  ·  size : 'sm' | 'md' | 'lg'
 */
export default function Button({
  href,
  variant = 'gold',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className,
  children,
  type = 'button',
  ...rest
}) {
  const classes = cx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className
  )

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  )
}
