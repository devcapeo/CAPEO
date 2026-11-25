'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider/auth.logic'
import { DEMO_ASSETS } from '@/data/demoAssets'
import * as roomApi from '@/lib/businessRoom/api'
import { roomErrorMessage } from '@/lib/businessRoom/rules'
import { trackAction } from '@/lib/analytics/tracker'

const POLL_INTERVAL = 10000

/*
 * État d'une Business Room.
 * phase : 'loading' | 'anonymous' | 'demo' | 'not_found' | 'unverified' | 'request' | 'requested' | 'declined' | 'room' | 'error'
 */
export function useBusinessRoom(slug) {
  const { status: authStatus, user, profile, refreshProfile } = useAuth()
  const [phase, setPhase] = useState('loading')
  const [asset, setAsset] = useState(null)
  const [data, setData] = useState({ participants: [], messages: [], documents: [], intentions: [] })
  const [error, setError] = useState(null)

  const isSeller = Boolean(asset && user && asset.seller_id === user.id)
  const isVerified = profile?.kyc_status === 'verified'

  const loadRoomData = useCallback(async (assetId) => {
    const [participants, messages, documents, intentions] = await Promise.all([
      roomApi.fetchParticipants(assetId),
      roomApi.fetchMessages(assetId),
      roomApi.fetchDocuments(assetId),
      roomApi.fetchIntentions(assetId),
    ])
    setData({ participants, messages, documents, intentions })
  }, [])

  const resolve = useCallback(async () => {
    if (authStatus === 'loading') return
    if (authStatus === 'anonymous') {
      setPhase('anonymous')
      return
    }
    if (!profile) return

    try {
      const found = await roomApi.fetchRoomAsset(slug)
      if (!found) {
        setPhase(DEMO_ASSETS.some((demo) => demo.slug === slug) ? 'demo' : 'not_found')
        return
      }
      setAsset(found)

      if (found.seller_id === user.id) {
        await loadRoomData(found.id)
        setPhase('room')
        return
      }
      if (profile.kyc_status !== 'verified') {
        setPhase('unverified')
        return
      }

      const membership = await roomApi.fetchMembership(found.id, user.id)
      if (membership === 'active') {
        await loadRoomData(found.id)
        setPhase('room')
      } else if (membership === 'requested' || membership === 'declined') {
        setPhase(membership)
      } else {
        setPhase('request')
      }
    } catch (cause) {
      setError(roomErrorMessage(cause))
      setPhase('error')
    }
  }, [authStatus, profile, slug, user, loadRoomData])

  useEffect(() => {
    resolve()
  }, [resolve])

  /* Rafraîchissement régulier tant que la Business Room est ouverte et visible */
  useEffect(() => {
    if (phase !== 'room' || !asset) return undefined
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') loadRoomData(asset.id).catch(() => null)
    }, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [phase, asset, loadRoomData])

  /* Une demande en attente : on revérifie de temps en temps si le vendeur a répondu */
  useEffect(() => {
    if (phase !== 'requested') return undefined
    const timer = setInterval(() => resolve(), POLL_INTERVAL * 3)
    return () => clearInterval(timer)
  }, [phase, resolve])

  const names = useMemo(() => {
    const map = new Map(data.participants.map((participant) => [participant.user_id, participant]))
    return (userId) => map.get(userId)?.display_name || 'Ancien participant'
  }, [data.participants])

  const reload = useCallback(() => asset && loadRoomData(asset.id), [asset, loadRoomData])

  const actions = useMemo(
    () => ({
      async requestAccess(intro) {
        await roomApi.requestAccess(asset.id, intro.trim())
        roomApi.notifyRoom(asset.id, 'request')
        trackAction('room_request', { asset: asset.slug })
        setPhase('requested')
      },
      async decide(userId, accept) {
        await roomApi.decideRequest(asset.id, userId, accept)
        roomApi.notifyRoom(asset.id, 'decision', userId)
        trackAction(accept ? 'room_admit' : 'room_decline', { asset: asset.slug })
        await reload()
      },
      async postMessage(body) {
        await roomApi.sendMessage(asset.id, body)
        roomApi.notifyRoom(asset.id, 'message')
        trackAction('room_message', { asset: asset.slug })
        await reload()
      },
      async addDocument(file) {
        await roomApi.uploadDocument(asset.id, user.id, file)
        roomApi.notifyRoom(asset.id, 'document')
        trackAction('room_document', { asset: asset.slug })
        await reload()
      },
      async openDocument(doc) {
        const url = await roomApi.documentUrl(doc.storage_path, doc.file_name)
        window.open(url, '_blank', 'noopener')
      },
      async saveIntention(values, exists) {
        await roomApi.saveIntention(asset.id, values, exists)
        trackAction('room_intention', { asset: asset.slug, label: values.mode })
        await reload()
      },
      async withdrawIntention() {
        await roomApi.removeIntention(asset.id)
        await reload()
      },
      async leave() {
        await roomApi.leaveRoom(asset.id)
        trackAction('room_leave', { asset: asset.slug })
        setPhase('request')
      },
    }),
    [asset, user, reload]
  )

  return {
    phase,
    asset,
    user,
    profile,
    isSeller,
    isVerified,
    error,
    refreshProfile,
    ...data,
    nameOf: names,
    actions,
  }
}

/* Exécute une action asynchrone avec état de chargement et message d'erreur lisible */
export function useAsyncAction() {
  const [state, setState] = useState({ pending: false, error: null })

  const run = useCallback(async (task, fallback) => {
    setState({ pending: true, error: null })
    try {
      await task()
      setState({ pending: false, error: null })
      return true
    } catch (cause) {
      setState({ pending: false, error: roomErrorMessage(cause, fallback) })
      return false
    }
  }, [])

  return { ...state, run }
}
