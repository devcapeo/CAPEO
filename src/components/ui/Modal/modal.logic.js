'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Comportement d'une modale accessible :
 * - montage côté client uniquement (portail)
 * - fermeture sur Échap
 * - blocage du scroll de la page
 * - focus déplacé dans la modale puis rendu à l'élément d'origine
 */
export function useModalBehavior(open, onClose) {
  const dialogRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return undefined

    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  /* Ferme uniquement si le clic vise le fond, pas le contenu */
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose?.()
  }

  return { dialogRef, mounted, handleBackdropClick }
}
