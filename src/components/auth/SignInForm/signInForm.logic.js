'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserClient } from '@/lib/supabase/browserClient'
import { useAuthForm } from '@/lib/auth/useAuthForm'
import { safeRedirect, validateSignIn } from '@/lib/auth/validation'

export function useSignIn(next) {
  const router = useRouter()

  const submit = useCallback(
    async (values) => {
      const { error } = await getBrowserClient().auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      })
      if (error) return { error }
      router.replace(safeRedirect(next))
      return { message: 'Connexion réussie.' }
    },
    [router, next]
  )

  return useAuthForm({ initialValues: { email: '', password: '' }, validate: validateSignIn, submit })
}
