'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * Charge des données admin et gère chargement, erreur, rafraîchissement.
 * loader : fonction asynchrone ; deps : relance quand elles changent ; interval : rafraîchissement auto (ms).
 */
export function useAdminQuery(loader, deps = [], { interval } = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const loaderRef = useRef(loader)
  loaderRef.current = loader

  const load = useCallback(async (silent = false) => {
    if (!silent) setState((previous) => ({ ...previous, loading: true, error: null }))
    try {
      const data = await loaderRef.current()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState((previous) => ({ ...previous, loading: false, error: error?.message ?? 'Erreur de chargement.' }))
    }
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    if (!interval) return undefined
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') load(true)
    }, interval)
    return () => clearInterval(timer)
  }, [interval, load])

  return { ...state, reload: load }
}
