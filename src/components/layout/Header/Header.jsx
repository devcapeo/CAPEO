'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, AUTH_LINKS } from '@/config/site'
import { cx } from '@/lib/cx'
import Logo from '@/components/layout/Logo/Logo'
import MobileMenu from '@/components/layout/MobileMenu/MobileMenu'
import Button from '@/components/ui/Button/Button'
import { isLinkActive, useHeaderState } from './header.logic'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()
  const { solid, menuOpen, toggleMenu, closeMenu } = useHeaderState(pathname)

  /* Le menu mobile est rendu hors du <header> : le backdrop-filter du header
     créerait sinon un bloc conteneur qui piège le position: fixed du menu. */
  return (
    <>
      <header className={cx(styles.header, solid && styles.solid)}>
        <div className={cx('container', styles.inner)}>
          <Logo onClick={closeMenu} />

          <nav className={styles.nav} aria-label="Navigation principale">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cx(styles.link, active && styles.active)}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className={styles.actions}>
            <Link href={AUTH_LINKS.login.href} className={styles.login}>
              {AUTH_LINKS.login.label}
            </Link>
            <Button href={AUTH_LINKS.register.href} size="sm">
              {AUTH_LINKS.register.label}
            </Button>
          </div>

          <button
            type="button"
            className={cx(styles.burger, menuOpen && styles.burgerOpen)}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <MobileMenu id="menu-mobile" open={menuOpen} pathname={pathname} onNavigate={closeMenu} />
    </>
  )
}
