'use client'

import { useId } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '@/lib/cx'
import { useModalBehavior } from './modal.logic'
import styles from './Modal.module.css'

/* size : 'sm' | 'md' | 'lg' */
export default function Modal({ open, onClose, title, size = 'md', footer, children }) {
  const titleId = useId()
  const { dialogRef, mounted, handleBackdropClick } = useModalBehavior(open, onClose)

  if (!mounted || !open) return null

  return createPortal(
    <div className={styles.backdrop} onMouseDown={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={cx(styles.dialog, styles[size])}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        <header className={styles.header}>
          {title && <h2 id={titleId} className={styles.title}>{title}</h2>}
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fermer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body
  )
}
