'use client'

import { useState } from 'react'
import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'

/* Détail complet d'une annonce et décisions de modération */
export function useListingReview(listing, onChanged) {
  const [note, setNote] = useState('')
  const [pending, setPending] = useState(null)
  const [message, setMessage] = useState(null)
  const detail = useAdminQuery(() => (listing ? adminApi.fetchListingDetail(listing.id) : Promise.resolve(null)), [listing?.id, listing?.status, listing?.featured])

  const run = async (key, task, success) => {
    setPending(key)
    setMessage(null)
    try {
      await task()
      setMessage({ tone: 'success', text: success })
      onChanged()
    } catch (error) {
      setMessage({ tone: 'error', text: error?.message ?? 'Action impossible.' })
    } finally {
      setPending(null)
    }
  }

  return {
    detail,
    note,
    setNote,
    pending,
    message,
    decide(action) {
      if (action === 'reject' && !note.trim()) {
        setMessage({ tone: 'error', text: 'Indiquez au vendeur le motif du refus.' })
        return
      }
      const labels = {
        publish: 'Annonce publiée. Le vendeur a été prévenu par e-mail.',
        reject: 'Annonce refusée. Le vendeur a reçu le motif par e-mail.',
        archive: 'Annonce archivée.',
        review: 'Annonce remise en examen.',
      }
      run(action, () => adminApi.reviewAsset(listing, action, note.trim() || null), labels[action])
    },
    feature(days) {
      run(`feature-${days}`, async () => {
        await adminApi.featureAsset(listing.id, days)
        await adminApi.revalidateCatalog(listing.slug)
      }, days ? `Mise en avant pour ${days} jours.` : 'Mise en avant retirée.')
    },
  }
}
