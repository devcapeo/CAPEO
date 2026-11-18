'use client'

import { useRef } from 'react'
import { useHeroStage } from './heroStage.logic'
import styles from './HeroStage.module.css'

/**
 * Fond génératif du hero. Purement décoratif (aria-hidden) :
 * le contenu indexable est rendu côté serveur par <Hero>.
 * Le repli CSS reste visible jusqu'à ce que la scène soit prête, puis la scène s'y fond.
 */
export default function HeroStage() {
  const containerRef = useRef(null)
  const status = useHeroStage(containerRef)

  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.fallback} />
      <div ref={containerRef} className={styles.canvas} data-status={status} />
      <div className={styles.vignette} />
    </div>
  )
}
