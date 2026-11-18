'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserClient } from '@/lib/supabase/browserClient'
import { useAuthForm } from '@/lib/auth/useAuthForm'
import { validateNewPassword } from '@/lib/auth/validation'

/**
 * Nouveau mot de passe : le lien reçu ouvre une session de récupération (code PKCE),
 * puis le membre choisit son nouveau mot de passe.
 * linkStatus : 'checking' | 'ready' | 'invalid'
 */
export function useResetPassword() {
  const router = useRouter()
  const params = useSearchParams()
  const [linkStatus, setLinkStatus] = useState('checking')

  useEffect(() => {
    const code = params.get('code')
    const supabase = getBrowserClient()
    const check = code ? supabase.auth.exchangeCodeForSession(code) : supabase.auth.getSession()
    check.then(({ data, error }) => setLinkStatus(!error && data?.session ? 'ready' : 'invalid'))
  }, [params])

  const submit = useCallback(
    async ({ password }) => {
      const { error } = await getBrowserClient().auth.updateUser({ password })
      if (error) return { error }
      router.replace('/espace')
      return { message: 'Mot de passe mis à jour.' }
    },
    [router]
  )

  const form = useAuthForm({ initialValues: { password: '', confirm: '' }, validate: validateNewPassword, submit })
  return { ...form, linkStatus }
}
