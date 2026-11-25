'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider/auth.logic'
import { beforeLeave, initTracker, markStaff, trackClick, trackPageLeave, trackPageView } from '@/lib/analytics/tracker'

const CLICKABLE = 'a, button, summary, [role="button"], [data-track]'
const IGNORED_PATHS = /^\/admin(\/|$)/

const cleanText = (value) => (value ?? '').replace(/\s+/g, ' ').trim().slice(0, 80)

/* Libellé lisible d'un élément cliqué (jamais la valeur d'un champ de saisie) */
function describe(element) {
  const label =
    element.dataset.track ||
    element.getAttribute('aria-label') ||
    cleanText(element.innerText || element.textContent) ||
    element.getAttribute('title') ||
    element.querySelector('img')?.getAttribute('alt') ||
    element.tagName.toLowerCase()

  let target = null
  if (element.tagName === 'A' && element.href) {
    try {
      const url = new URL(element.href)
      target = url.origin === window.location.origin ? url.pathname : url.hostname
    } catch {
      target = null
    }
  } else if (element.type === 'submit') {
    target = 'formulaire'
  }
  return { label: cleanText(label), target }
}

function scrollPercent() {
  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  if (scrollable <= 0) return 100
  return Math.min(100, Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100))
}

/* Pages vues, temps passé (onglet visible), défilement et clics */
export function useAnalyticsTracker() {
  const pathname = usePathname()
  const { profile } = useAuth()
  const page = useRef({ path: null, visibleMs: 0, since: 0, maxScroll: 0 })

  useEffect(() => {
    if (profile?.role === 'admin') markStaff()
  }, [profile])

  useEffect(() => {
    initTracker()

    const flushTime = () => {
      const current = page.current
      if (!current.path) return
      const now = performance.now()
      const total = current.visibleMs + (current.since ? now - current.since : 0)
      trackPageLeave(current.path, total, current.maxScroll)
      current.visibleMs = 0
      current.since = document.visibilityState === 'visible' ? now : 0
    }

    const onVisibility = () => {
      const current = page.current
      if (document.visibilityState === 'visible') current.since = performance.now()
    }
    const onScroll = () => {
      page.current.maxScroll = Math.max(page.current.maxScroll, scrollPercent())
    }
    const onClick = (event) => {
      if (IGNORED_PATHS.test(window.location.pathname)) return
      const element = event.target.closest?.(CLICKABLE)
      if (!element || element.closest('[data-no-track]')) return
      const { label, target } = describe(element)
      trackClick(window.location.pathname, label, target)
    }

    const removeHook = beforeLeave(flushTime)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick, { capture: true })

    return () => {
      removeHook()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick, { capture: true })
    }
  }, [])

  /* Changement de page : on clôt la précédente, on ouvre la suivante */
  useEffect(() => {
    const current = page.current
    const now = performance.now()

    if (current.path && !IGNORED_PATHS.test(current.path)) {
      trackPageLeave(current.path, current.visibleMs + (current.since ? now - current.since : 0), current.maxScroll)
    }

    current.path = pathname
    current.visibleMs = 0
    current.since = document.visibilityState === 'visible' ? now : 0
    current.maxScroll = 0

    if (!IGNORED_PATHS.test(pathname)) {
      trackPageView(pathname)
      requestAnimationFrame(() => {
        current.maxScroll = scrollPercent()
      })
    } else {
      current.path = null
    }
  }, [pathname])
}
