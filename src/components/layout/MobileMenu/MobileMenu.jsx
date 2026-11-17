'use client'

import Link from 'next/link'
import { NAV_LINKS, AUTH_LINKS } from '@/config/site'
import { cx } from '@/lib/cx'
import Button from '@/components/ui/Button/Button'
import { isLinkActive } from '@/components/layout/Header/header.logic'
import styles from './MobileMenu.module.css'

export default function MobileMenu({ id, open, pathname, onNavigate }) {
  return (
    <div id={id} className={cx(styles.menu, open && styles.open)} aria-hidden={!open} inert={!open}>
      <nav className={styles.nav} aria-label="Navigation mobile">
        {NAV_LINKS.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cx(styles.link, isLinkActive(pathname, link.href) && styles.active)}
            style={{ '--delay': `${80 + index * 60}ms` }}
          >
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.actions}>
        <Button href={AUTH_LINKS.register.href} size="lg" fullWidth onClick={onNavigate}>
          {AUTH_LINKS.register.label}
        </Button>
        <Button href={AUTH_LINKS.login.href} variant="glass" size="lg" fullWidth onClick={onNavigate}>
          {AUTH_LINKS.login.label}
        </Button>
      </div>
    </div>
  )
}
