'use client'

import { useCallback, useEffect, useState } from 'react'

const SCROLL_THRESHOLD = 40

/* Un lien est actif sur sa page et sur ses sous-pages (/actifs/xxx). */
export function isLinkActive(pathname, href) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * État du header :
 * - transparent uniquement en haut de la Home, en verre partout ailleurs
 * - menu mobile fermé à chaque changement de page
 * - scroll de la page bloqué quand le menu mobile est ouvert
 */
export function useHeaderState(pathname) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const isHome = pathname === '/'
  const solid = !isHome || scrolled || menuOpen

  return { solid, menuOpen, toggleMenu, closeMenu }
}
