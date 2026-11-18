'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase/browserClient'

export const AuthContext = createContext(null)

const PROFILE_COLUMNS = 'first_name, last_name, member_kind, company_name, phone, kyc_status, review_status, role, created_at'

/**
 * État d'authentification du navigateur :
 * status : 'loading' | 'anonymous' | 'authenticated', utilisateur et profil CAPEO.
 * Sert à l'affichage ; les décisions sensibles sont toujours garanties par les règles d'accès de la base.
 */
export function useAuthStore() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')

  const loadProfile = useCallback(async (userId) => {
    const { data } = await getBrowserClient().from('profiles').select(PROFILE_COLUMNS).eq('id', userId).maybeSingle()
    setProfile(data ?? null)
  }, [])

  useEffect(() => {
    const supabase = getBrowserClient()

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setStatus(nextSession ? 'authenticated' : 'anonymous')
      /* Requête différée : un appel Supabase dans ce rappel bloquerait le client */
      if (nextSession) setTimeout(() => loadProfile(nextSession.user.id), 0)
      else setProfile(null)
    })

    return () => data.subscription.unsubscribe()
  }, [loadProfile])

  const signOut = useCallback(() => getBrowserClient().auth.signOut(), [])
  const refreshProfile = useCallback(() => session && loadProfile(session.user.id), [session, loadProfile])

  return useMemo(
    () => ({ status, user: session?.user ?? null, profile, signOut, refreshProfile }),
    [status, session, profile, signOut, refreshProfile]
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans <AuthProvider>.')
  return context
}
