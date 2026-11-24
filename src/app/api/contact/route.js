/* ============================================
   CAPEO — FONCTION « CONTACT » (2 des 4 fonctions serverless)
   Domaine : mise en relation et e-mails transactionnels.

   POST /api/contact?action=room-event   → notifie les participants d'une Business Room
        corps : { assetId, event: 'request' | 'decision' | 'message' | 'document', targetUserId? }
   ============================================ */

import { readServerEnv } from '@/lib/server/env'
import { json, jsonError } from '@/lib/server/http'
import { createAdminClient, getUserFromRequest } from '@/lib/server/supabaseAdmin'
import { notifyRoomEvent, ROOM_EVENTS } from '@/lib/server/contact/roomNotifications'

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

const ACTIONS = {
  'room-event': roomEvent,
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
