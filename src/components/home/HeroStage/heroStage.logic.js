'use client'

import { useEffect, useState } from 'react'
import { clamp01, stepFromProgress } from './scene/choreography'

/* ── Détections pures ── */

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/* Appareil modeste ou petit écran : scène allégée */
export function detectTier() {
  const small = window.matchMedia('(max-width: 768px)').matches
  const cores = navigator.hardwareConcurrency || 4
  return small || cores <= 4 ? 'low' : 'high'
}

/* Progression du scroll dans la section du hero (0 en haut, 1 à la fin de la descente) */
export function readProgress(section) {
  const rect = section.getBoundingClientRect()
  const travel = rect.height - window.innerHeight
  return travel > 0 ? clamp01(-rect.top / travel) : 0
}

/* ── Zone libre pour le globe ── */

const MOBILE_BREAKPOINT = 768
const TEXT_GAP = 32
const RAIL_SPACE = 56
/* Portée des arcs en rayons du globe (même valeur que la scène) */
const ARC_REACH = 1.27

function headerHeight() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 76
}

/* Boîte d'un bloc de texte dans le repère de la scène, sans tenir compte de son animation (transform) */
function boxOf(element, stageRect) {
  const parentRect = element.offsetParent.getBoundingClientRect()
  return {
    left: parentRect.left - stageRect.left + element.offsetLeft,
    top: parentRect.top - stageRect.top + element.offsetTop,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }
}

/**
 * Zone de l'écran où le globe et ses arcs peuvent s'inscrire sans toucher le texte :
 * - desktop / tablette paysage : à droite du bloc de texte le plus large (toutes étapes confondues,
 *   pour que le globe ne change pas de taille d'une étape à l'autre) ;
 * - mobile : entre le header et le haut du texte de l'étape affichée.
 */
export function measureSafeArea(stage, steps, activeIndex) {
  const width = stage.clientWidth
  const height = stage.clientHeight
  const top = headerHeight() + 12
  const stageRect = stage.getBoundingClientRect()
  const boxes = steps.map((element) => boxOf(element, stageRect))

  if (width > MOBILE_BREAKPOINT) {
    const x = Math.max(...boxes.map((box) => box.left + box.width)) + TEXT_GAP
    return { x, y: top, width: Math.max(0, width - RAIL_SPACE - x), height: Math.max(0, height - top - 28) }
  }

  const active = boxes[activeIndex] ?? boxes[0]
  return { x: 12, y: top, width: width - 24, height: Math.max(0, active.top - 20 - top) }
}

/* Variables CSS du fond de repli : même disque que la scène */
function applyFallbackFraming(section, area) {
  const radius = Math.min(area.width, area.height) / 2 / ARC_REACH
  section.style.setProperty('--globe-x', `${(area.x + area.width / 2).toFixed(1)}px`)
  section.style.setProperty('--globe-y', `${(area.y + area.height / 2).toFixed(1)}px`)
  section.style.setProperty('--globe-r', `${radius.toFixed(1)}px`)
}

/* Attend que la page soit affichée et que le navigateur soit au repos */
function whenIdle(callback) {
  let idleId = null
  let timeoutId = null
  const schedule = () => {
    if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(callback, { timeout: 2000 })
    else timeoutId = window.setTimeout(callback, 300)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })

  return () => {
    window.removeEventListener('load', schedule)
    if (idleId !== null) window.cancelIdleCallback(idleId)
    if (timeoutId !== null) window.clearTimeout(timeoutId)
  }
}

/**
 * Pilote du hero :
 * - synchronise l'étape de texte active et la variable CSS --hero-progress avec le scroll
 * - charge la scène Three.js après l'affichage (jamais avant : SEO et LCP préservés)
 * - « moins d'animations » : scène en images fixes, une par étape
 * - sans WebGL : repli décoratif en CSS
 * - met la scène en pause hors écran et quand l'onglet est masqué
 *
 * Retourne 'loading' | 'ready' | 'fallback'.
 */
export function useHeroStage(containerRef) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const container = containerRef.current
    const section = container?.closest('[data-hero]')
    if (!container || !section) return undefined

    const steps = Array.from(section.querySelectorAll('[data-hero-step]'))
    const reducedMotion = prefersReducedMotion()
    let scene = null
    let disposed = false
    let visible = true
    let ticking = false
    let currentStep = -1

    const syncFraming = (immediate = false) => {
      const area = measureSafeArea(container, steps, Math.max(0, currentStep))
      applyFallbackFraming(section, area)
      scene?.setSafeArea(area, immediate)
    }

    const syncStep = (progress) => {
      const step = stepFromProgress(progress)
      if (step === currentStep) return
      currentStep = step
      section.dataset.step = String(step)
      steps.forEach((element) => element.toggleAttribute('data-active', Number(element.dataset.heroStep) === step))
      syncFraming()
    }

    const update = () => {
      ticking = false
      const progress = readProgress(section)
      section.style.setProperty('--hero-progress', progress.toFixed(4))
      syncStep(progress)
      scene?.setProgress(progress)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    const onPointerMove = (event) => {
      scene?.setPointer((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1))
    }

    const syncRunning = () => {
      if (!scene) return
      if (visible && !document.hidden) scene.start()
      else scene.stop()
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncRunning()
    })
    observer.observe(section)

    const onResize = () => {
      onScroll()
      syncFraming(true)
    }

    update()
    syncFraming(true)
    document.fonts?.ready.then(() => !disposed && syncFraming(true))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', syncRunning)

    let cancelIdle = () => {}
    if (!supportsWebGL()) {
      setStatus('fallback')
    } else {
      cancelIdle = whenIdle(async () => {
        try {
          const { createHeroScene } = await import('./scene/createHeroScene')
          if (disposed) return
          const created = await createHeroScene(container, { reducedMotion, tier: detectTier() })
          if (disposed) {
            created.dispose()
            return
          }
          scene = created
          scene.setProgress(readProgress(section), true)
          syncFraming(true)
          syncRunning()
          setStatus('ready')
        } catch (error) {
          console.error('[CAPEO] Scène du hero indisponible :', error)
          setStatus('fallback')
        }
      })
    }

    return () => {
      disposed = true
      cancelIdle()
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', syncRunning)
      scene?.dispose()
    }
  }, [containerRef])

  return status
}
