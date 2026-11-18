'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserClient } from '@/lib/supabase/browserClient'
import { authErrorMessage } from '@/lib/auth/errors'
import { emptyFigure, INITIAL_LISTING, LIMITS, toAssetRow, validateListing } from '@/lib/assets/listingForm'
import { useToast } from '@/components/ui/Toast/toast.logic'

/**
 * Dépôt d'annonce : état du formulaire, chiffres clés dynamiques, enregistrement.
 * L'insertion passe par les règles d'accès de la base : le vendeur ne peut créer
 * qu'un brouillon ou une annonce « en examen », jamais une annonce publiée.
 */
export function useListingForm() {
  const router = useRouter()
  const { notify } = useToast()
  const [values, setValues] = useState(INITIAL_LISTING)
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(null)
  const [serverError, setServerError] = useState(null)

  const setField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined, vocabulary: undefined }))
  }, [])

  const bind = useCallback(
    (name) => ({
      name,
      value: values[name],
      error: errors[name],
      onChange: (event) => setField(name, event.target.type === 'checkbox' ? event.target.checked : event.target.value),
    }),
    [values, errors, setField]
  )

  const setFigure = useCallback((index, name, value) => {
    setValues((current) => ({
      ...current,
      figures: current.figures.map((figure, i) => (i === index ? { ...figure, [name]: value } : figure)),
    }))
    setErrors((current) => ({ ...current, figures: undefined, vocabulary: undefined }))
  }, [])

  const addFigure = useCallback(() => {
    setValues((current) =>
      current.figures.length >= LIMITS.figures ? current : { ...current, figures: [...current.figures, emptyFigure()] }
    )
  }, [])

  const removeFigure = useCallback((index) => {
    setValues((current) => ({ ...current, figures: current.figures.filter((_, i) => i !== index) }))
  }, [])

  const save = useCallback(
    async (submitting) => {
      const nextErrors = validateListing(values, { submitting })
      setErrors(nextErrors)
      setServerError(null)
      if (Object.keys(nextErrors).length > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      setPending(submitting ? 'submit' : 'draft')
      const { error } = await getBrowserClient().from('assets').insert(toAssetRow(values, { submitting })).select('id').single()
      setPending(null)

      if (error) {
        setServerError(authErrorMessage(error))
        return
      }

      notify(
        submitting
          ? { title: 'Annonce soumise', message: 'Notre équipe va l’examiner avant publication.', tone: 'success' }
          : { title: 'Brouillon enregistré', message: 'Vous le retrouverez dans votre espace.', tone: 'gold' }
      )
      router.push('/espace')
    },
    [values, notify, router]
  )

  return { values, errors, pending, serverError, bind, setField, setFigure, addFigure, removeFigure, save }
}
