'use client'

import { useCallback } from 'react'
import { getBrowserClient } from '@/lib/supabase/browserClient'
import { useAuthForm } from '@/lib/auth/useAuthForm'
import { safeRedirect, validateSignUp } from '@/lib/auth/validation'
import { trackAction } from '@/lib/analytics/tracker'

const INITIAL_VALUES = {
  firstName: '',
  lastName: '',
  memberKind: 'particulier',
  companyName: '',
  email: '',
  password: '',
  terms: false,
}

/* Inscription : crée le compte, le profil est créé côté base par trigger à partir des métadonnées. */
export function useSignUp(next) {
  const submit = useCallback(
    async (values) => {
      const redirect = `${window.location.origin}/connexion/confirmation?suite=${encodeURIComponent(safeRedirect(next))}`
      const { error } = await getBrowserClient().auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          emailRedirectTo: redirect,
          data: {
            first_name: values.firstName.trim(),
            last_name: values.lastName.trim(),
            member_kind: values.memberKind,
            company_name: values.memberKind === 'professionnel' ? values.companyName.trim() : '',
            terms_accepted: 'true',
          },
        },
      })
      if (error) return { error }
      trackAction('signup', { label: values.memberKind })
      return {
        message: `Un e-mail de confirmation vient d'être envoyé à ${values.email.trim()}. Cliquez sur le lien qu'il contient pour activer votre compte.`,
      }
    },
    [next]
  )

  return useAuthForm({ initialValues: INITIAL_VALUES, validate: validateSignUp, submit })
}
