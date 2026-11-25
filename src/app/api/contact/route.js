/* ============================================
   CAPEO — FONCTION « CONTACT » (2 des 4 fonctions serverless)
   Domaine : mise en relation et e-mails transactionnels.

   POST /api/contact?action=room-event      → notifie les participants d'une Business Room
        corps : { assetId, event: 'request' | 'decision' | 'message' | 'document', targetUserId? }
   POST /api/contact?action=listing-review  → informe le vendeur de la décision de modération (admin)
        corps : { assetId }
   ============================================ */

import { readServerEnv } from '@/lib/server/env'
import { json, jsonError } from '@/lib/server/http'
import { createAdminClient, getUserFromRequest } from '@/lib/server/supabaseAdmin'
import { notifyRoomEvent, ROOM_EVENTS } from '@/lib/server/contact/roomNotifications'
import { sendEmail } from '@/lib/server/contact/resend'
import { listingReviewedEmail } from '@/lib/server/contact/templates'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

async function roomEvent(request) {
  const { values, missing } = readServerEnv(['supabaseSecretKey', 'resendApiKey'])
  if (missing.length) {
    console.warn(`[CAPEO api/contact] Variables d'environnement manquantes : ${missing.join(', ')}`)
    return json({ sent: 0, skipped: true })
  }

  const admin = createAdminClient(values.supabaseSecretKey)
  const user = await getUserFromRequest(request, admin)
  if (!user) return jsonError(401, 'Connexion requise.')

  const body = await request.json().catch(() => ({}))
  const { assetId, event, targetUserId } = body
  if (!UUID.test(assetId ?? '') || !ROOM_EVENTS.includes(event)) return jsonError(400, 'Requête invalide.')
  if (targetUserId && !UUID.test(targetUserId)) return jsonError(400, 'Requête invalide.')

  const origin = new URL(request.url).origin
  const result = await notifyRoomEvent({ admin, apiKey: values.resendApiKey, user, assetId, event, targetUserId, origin })
  return json(result)
}

async function listingReview(request) {
  const { values, missing } = readServerEnv(['supabaseSecretKey', 'resendApiKey'])
  if (missing.length) return json({ sent: 0, skipped: true })

  const admin = createAdminClient(values.supabaseSecretKey)
  const user = await getUserFromRequest(request, admin)
  if (!user) return jsonError(401, 'Connexion requise.')
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') return jsonError(403, 'Accès réservé à l’équipe CAPEO.')

  const { assetId } = await request.json().catch(() => ({}))
  if (!UUID.test(assetId ?? '')) return jsonError(400, 'Requête invalide.')

  const { data: asset } = await admin.from('assets').select('slug, title, status, review_note, seller_id').eq('id', assetId).maybeSingle()
  if (!asset || !['published', 'rejected', 'archived'].includes(asset.status)) return json({ sent: 0 })

  const { data: seller } = await admin.auth.admin.getUserById(asset.seller_id)
  if (!seller?.user?.email) return json({ sent: 0 })

  const origin = new URL(request.url).origin
  const url = asset.status === 'published' ? `${origin}/actifs/${asset.slug}` : `${origin}/espace`
  const mail = listingReviewedEmail({ assetTitle: asset.title, status: asset.status, note: asset.review_note, url })
  return json({ sent: Number(await sendEmail(values.resendApiKey, { to: seller.user.email, ...mail })) })
}

const ACTIONS = {
  'room-event': roomEvent,
  'listing-review': listingReview,
}

export async function POST(request) {
  const action = ACTIONS[new URL(request.url).searchParams.get('action')]
  if (!action) return jsonError(404, 'Action inconnue.')

  try {
    return await action(request)
  } catch (error) {
    console.error('[CAPEO api/contact]', error)
    return jsonError(500, 'Une erreur est survenue.')
  }
}
