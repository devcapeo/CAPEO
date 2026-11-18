'use client'

import { useCallback } from 'react'
import { getBrowserClient } from '@/lib/supabase/browserClient'
import { useAuthForm } from '@/lib/auth/useAuthForm'
import { validateEmail } from '@/lib/auth/validation'

export function useForgotPassword() {
  const submit = useCallback(async ({ email }) => {
    const { error } = await getBrowserClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/connexion/nouveau-mot-de-passe`,
    })
    /* Même réponse que le compte existe ou non : on ne révèle pas les adresses inscrites */
    if (error && error.code !== 'user_not_found') return { error }
    return { message: 'Si un compte existe pour cette adresse, un lien de réinitialisation vient de lui être envoyé.' }
  }, [])

  const validate = useCallback(({ email }) => {
    const message = validateEmail(email)
    return message ? { email: message } : {}
  }, [])

  return useAuthForm({ initialValues: { email: '' }, validate, submit })
}
