'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react'

const DEFAULT_DURATION = 4500

export const ToastContext = createContext(null)

/* ── Réducteur pur : état de la pile de notifications ── */
export function toastReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.toast].slice(-4)
    case 'remove':
      return state.filter((toast) => toast.id !== action.id)
    default:
      return state
  }
}

/* ── État + minuteries, consommé par <ToastProvider> ── */
export function useToastStore() {
  const [toasts, dispatch] = useReducer(toastReducer, [])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    dispatch({ type: 'remove', id })
  }, [])

  const notify = useCallback(
    ({ title, message, tone = 'neutral', duration = DEFAULT_DURATION }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      dispatch({ type: 'add', toast: { id, title, message, tone } })
      timers.current.set(id, setTimeout(() => dismiss(id), duration))
      return id
    },
    [dismiss]
  )

  useEffect(() => {
    const activeTimers = timers.current
    return () => activeTimers.forEach(clearTimeout)
  }, [])

  const api = useMemo(() => ({ notify, dismiss }), [notify, dismiss])

  return { toasts, api }
}

/* ── Hook public : const { notify } = useToast() ── */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast doit être utilisé dans <ToastProvider>.')
  return context
}
