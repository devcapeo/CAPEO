'use client'

import { useCallback, useState } from 'react'
import { authErrorMessage } from './errors'

/**
 * Gestion commune des formulaires d'authentification.
 * submit(values) renvoie { error } (erreur Supabase) ou { message } (succès à afficher).
 * status : 'idle' | 'submitting' | 'success' | 'error'
 */
export function useAuthForm({ initialValues, validate, submit }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState(null)

  const setField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }, [])

  /* Raccourci pour les champs texte et cases à cocher */
  const bind = useCallback(
    (name) => ({
      name,
      value: values[name] ?? '',
      error: errors[name],
      onChange: (event) => setField(name, event.target.type === 'checkbox' ? event.target.checked : event.target.value),
    }),
    [values, errors, setField]
  )

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      const nextErrors = validate ? validate(values) : {}
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length > 0) return

      setStatus('submitting')
      setMessage(null)
      const result = (await submit(values)) ?? {}
      if (result.error) {
        setStatus('error')
        setMessage(authErrorMessage(result.error))
      } else {
        setStatus('success')
        setMessage(result.message ?? null)
      }
    },
    [validate, submit, values]
  )

  return { values, errors, status, message, setField, bind, handleSubmit }
}
