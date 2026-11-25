'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserClient } from '@/lib/supabase/browserClient'
import { useAuth } from '@/components/auth/AuthProvider/auth.logic'
import { fetchMyRooms } from '@/lib/businessRoom/api'
import { flush as flushAnalytics, trackAction } from '@/lib/analytics/tracker'

export const KYC_LABELS = {
  not_started: { tone: 'neutral', label: 'À faire', text: "Vérifiez votre identité pour pouvoir contacter les autres membres. Pièce d'identité et selfie, en quelques minutes, via notre prestataire Stripe Identity." },
  pending: { tone: 'cobalt', label: 'En cours', text: 'Votre vérification est en cours de traitement. Cette page se met à jour automatiquement.' },
  verified: { tone: 'success', label: 'Vérifiée', text: 'Votre identité est vérifiée : vous pouvez contacter les autres membres.' },
  rejected: { tone: 'danger', label: 'À reprendre', text: "La vérification n'a pas abouti (document illisible ou incomplet). Vous pouvez la recommencer." },
}

export const REVIEW_LABELS = {
  pending: { tone: 'cobalt', label: 'En examen', text: 'Notre équipe examine votre profil, un par un.' },
  approved: { tone: 'success', label: 'Validé', text: 'Votre profil a été validé par notre équipe.' },
  rejected: { tone: 'danger', label: 'Non validé', text: 'Votre profil n’a pas été validé. Contactez-nous pour en savoir plus.' },
}

export const LISTING_STATUS = {
  draft: { tone: 'neutral', label: 'Brouillon' },
  pending_review: { tone: 'cobalt', label: 'En examen' },
  published: { tone: 'success', label: 'Publiée' },
  rejected: { tone: 'danger', label: 'Refusée' },
  archived: { tone: 'neutral', label: 'Retirée' },
}

const POLL_INTERVAL = 4000
const POLL_DURATION = 90000

/* Espace membre : redirige vers la connexion si besoin, charge annonces et favoris, gère la vérification. */
export function useAccount() {
  const router = useRouter()
  const params = useSearchParams()
  const auth = useAuth()
  const [listings, setListings] = useState(null)
  const [favoritesCount, setFavoritesCount] = useState(null)
  const [rooms, setRooms] = useState(null)
  const [verification, setVerification] = useState({ status: 'idle', message: null })

  useEffect(() => {
    if (auth.status === 'anonymous') router.replace('/connexion?suite=/espace')
  }, [auth.status, router])

  useEffect(() => {
    if (auth.status !== 'authenticated') return
    const supabase = getBrowserClient()
    Promise.all([
      supabase
        .from('assets')
        .select('id, slug, title, city, status, updated_at')
        .eq('seller_id', auth.user.id)
        .order('updated_at', { ascending: false }),
      supabase.from('favorites').select('asset_id', { count: 'exact', head: true }),
      fetchMyRooms().catch(() => []),
    ]).then(([assets, favorites, myRooms]) => {
      setListings(assets.data ?? [])
      setFavoritesCount(favorites.count ?? 0)
      setRooms(myRooms)
    })
  }, [auth.status, auth.user])

  /* Retour de Stripe : on rafraîchit le profil quelques instants, le temps que le webhook arrive */
  const { refreshProfile } = auth
  useEffect(() => {
    if (params.get('verification') !== 'retour' || auth.status !== 'authenticated') return undefined
    const started = Date.now()
    const timer = setInterval(() => {
      refreshProfile()
      if (Date.now() - started > POLL_DURATION) clearInterval(timer)
    }, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [params, auth.status, refreshProfile])

  const startVerification = useCallback(async () => {
    setVerification({ status: 'loading', message: null })
    const { data } = await getBrowserClient().auth.getSession()
    const response = await fetch('/api/compte?action=verification', {
      method: 'POST',
      headers: { Authorization: `Bearer ${data.session?.access_token ?? ''}` },
    }).catch(() => null)

    const body = response ? await response.json().catch(() => ({})) : {}
    if (response?.ok && body.url) {
      trackAction('kyc_start')
      flushAnalytics(true)
      window.location.assign(body.url)
      return
    }
    setVerification({ status: 'error', message: body.error ?? 'Le service de vérification est indisponible pour le moment.' })
  }, [])

  return { ...auth, listings, favoritesCount, rooms, verification, startVerification }
}
