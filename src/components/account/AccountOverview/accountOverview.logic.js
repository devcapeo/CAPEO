'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserClient } from '@/lib/supabase/browserClient'
import { useAuth } from '@/components/auth/AuthProvider/auth.logic'

export const KYC_LABELS = {
  not_started: { tone: 'neutral', label: 'À faire', text: "La vérification d'identité ouvrira prochainement. Elle sera requise avant toute prise de contact." },
  pending: { tone: 'cobalt', label: 'En cours', text: 'Votre vérification est en cours de traitement par notre prestataire.' },
  verified: { tone: 'success', label: 'Vérifiée', text: 'Votre identité est vérifiée : vous pouvez contacter les autres membres.' },
  rejected: { tone: 'danger', label: 'À reprendre', text: "La vérification n'a pas abouti. Notre équipe vous contactera." },
}

export const REVIEW_LABELS = {
  pending: { tone: 'cobalt', label: 'En examen', text: 'Notre équipe examine votre profil, un par un.' },
  approved: { tone: 'success', label: 'Validé', text: 'Votre profil a été validé par notre équipe.' },
  rejected: { tone: 'danger', label: 'Non validé', text: 'Votre profil n’a pas été validé. Contactez-nous pour en savoir plus.' },
}

/* Espace membre : redirige vers la connexion si besoin, puis charge les compteurs du membre. */
export function useAccount() {
  const router = useRouter()
  const auth = useAuth()
  const [counts, setCounts] = useState({ assets: null, favorites: null })

  useEffect(() => {
    if (auth.status === 'anonymous') router.replace('/connexion?suite=/espace')
  }, [auth.status, router])

  useEffect(() => {
    if (auth.status !== 'authenticated') return
    const supabase = getBrowserClient()
    Promise.all([
      supabase.from('assets').select('id', { count: 'exact', head: true }).eq('seller_id', auth.user.id),
      supabase.from('favorites').select('asset_id', { count: 'exact', head: true }),
    ]).then(([assets, favorites]) => setCounts({ assets: assets.count ?? 0, favorites: favorites.count ?? 0 }))
  }, [auth.status, auth.user])

  return { ...auth, counts }
}
