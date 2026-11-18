'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserClient } from '@/lib/supabase/browserClient'
import { safeRedirect } from '@/lib/auth/validation'

/**
 * Retour du lien de confirmation e-mail (flux PKCE) :
 * échange le code contre une session, puis redirige vers la page demandée.
 * Si le lien est ouvert sur un autre appareil, l'adresse est confirmée mais la session
 * ne peut pas être ouverte ici : on invite simplement à se connecter.
 * status : 'working' | 'done' | 'confirmed-elsewhere' | 'error'
 */
export function useEmailConfirmation() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState('working')

  useEffect(() => {
    const code = params.get('code')
    const next = safeRedirect(params.get('suite'))

    if (params.get('error_code') || !code) {
      setStatus(params.get('error_code') === 'otp_expired' ? 'error' : 'confirmed-elsewhere')
      return
    }

    getBrowserClient()
      .auth.exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          setStatus('confirmed-elsewhere')
          return
        }
        setStatus('done')
        router.replace(next)
      })
  }, [params, router])

  return status
}
