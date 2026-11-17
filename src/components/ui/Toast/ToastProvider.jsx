'use client'

import { cx } from '@/lib/cx'
import { ToastContext, useToastStore } from './toast.logic'
import styles from './Toast.module.css'

/* tone : 'neutral' | 'success' | 'danger' | 'gold' */
export default function ToastProvider({ children }) {
  const { toasts, api } = useToastStore()

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.viewport} aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div key={toast.id} className={cx(styles.toast, styles[toast.tone])} role="status">
            <span className={styles.bar} aria-hidden="true" />
            <div className={styles.content}>
              {toast.title && <p className={styles.title}>{toast.title}</p>}
              {toast.message && <p className={styles.message}>{toast.message}</p>}
            </div>
            <button
              type="button"
              className={styles.close}
              onClick={() => api.dismiss(toast.id)}
              aria-label="Fermer la notification"
            >
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
