/* ============================================
   Notifications e-mail de la Business Room.
   Chaque événement est revérifié en base (clé serveur) avant tout envoi :
   le navigateur ne peut pas faire écrire CAPEO à n'importe qui.
   ============================================ */

import 'server-only'
import { sendEmail } from './resend'
import { accessDecidedEmail, accessRequestedEmail, roomActivityEmail } from './templates'

/* Un e-mail d'activité au plus toutes les 30 minutes, par membre et par Business Room */
const ACTIVITY_COOLDOWN_MS = 30 * 60 * 1000

export const ROOM_EVENTS = ['request', 'decision', 'message', 'document']

async function emailOf(admin, userId) {
  const { data } = await admin.auth.admin.getUserById(userId)
  return data?.user?.email ?? null
}

function displayName(profile) {
  if (!profile) return 'Un membre'
  const initial = profile.last_name ? ` ${profile.last_name[0]}.` : ''
  return `${profile.first_name || 'Un membre'}${initial}`
}

async function loadAsset(admin, assetId) {
  const { data } = await admin.from('assets').select('id, slug, title, seller_id, status').eq('id', assetId).maybeSingle()
  return data
}

async function membership(admin, assetId, userId) {
  const { data } = await admin
    .from('room_members')
    .select('status')
    .eq('asset_id', assetId)
    .eq('user_id', userId)
    .maybeSingle()
  return data?.status ?? null
}

/* Demande d'accès : prévient le vendeur */
async function onRequest({ admin, apiKey, user, asset, roomUrl }) {
  if ((await membership(admin, asset.id, user.id)) !== 'requested') return { sent: 0 }
  const [{ data: profile }, sellerEmail] = await Promise.all([
    admin.from('profiles').select('first_name, last_name').eq('id', user.id).maybeSingle(),
    emailOf(admin, asset.seller_id),
  ])
  if (!sellerEmail) return { sent: 0 }
  const mail = accessRequestedEmail({ assetTitle: asset.title, requesterName: displayName(profile), url: roomUrl })
  return { sent: Number(await sendEmail(apiKey, { to: sellerEmail, ...mail })) }
}

/* Décision du vendeur : prévient l'acquéreur concerné */
async function onDecision({ admin, apiKey, user, asset, targetUserId, roomUrl, origin }) {
  if (asset.seller_id !== user.id || !targetUserId) return { sent: 0 }
  const status = await membership(admin, asset.id, targetUserId)
  if (status !== 'active' && status !== 'declined') return { sent: 0 }
  const to = await emailOf(admin, targetUserId)
  if (!to) return { sent: 0 }
  const accepted = status === 'active'
  const mail = accessDecidedEmail({ assetTitle: asset.title, accepted, url: accepted ? roomUrl : `${origin}/actifs` })
  return { sent: Number(await sendEmail(apiKey, { to, ...mail })) }
}

/* Message ou document : prévient les autres participants, avec anti-rafale */
async function onActivity({ admin, apiKey, user, asset, kind, roomUrl }) {
  const { data: members } = await admin.from('room_members').select('user_id').eq('asset_id', asset.id).eq('status', 'active')
  const participants = [asset.seller_id, ...(members ?? []).map((member) => member.user_id)]
  if (!participants.includes(user.id)) return { sent: 0 }

  const recipients = participants.filter((id) => id !== user.id)
  if (recipients.length === 0) return { sent: 0 }

  const { data: recent } = await admin
    .from('room_notifications')
    .select('user_id, last_sent_at')
    .eq('asset_id', asset.id)
    .eq('kind', kind)
    .in('user_id', recipients)
  const lastSent = new Map((recent ?? []).map((row) => [row.user_id, new Date(row.last_sent_at).getTime()]))
  const due = recipients.filter((id) => Date.now() - (lastSent.get(id) ?? 0) > ACTIVITY_COOLDOWN_MS)

  const mail = roomActivityEmail({ assetTitle: asset.title, kind, url: roomUrl })
  let sent = 0
  for (const recipient of due) {
    const to = await emailOf(admin, recipient)
    if (to && (await sendEmail(apiKey, { to, ...mail }))) {
      sent += 1
      await admin
        .from('room_notifications')
        .upsert({ asset_id: asset.id, user_id: recipient, kind, last_sent_at: new Date().toISOString() })
    }
  }
  return { sent }
}

export async function notifyRoomEvent({ admin, apiKey, user, assetId, event, targetUserId, origin }) {
  const asset = await loadAsset(admin, assetId)
  if (!asset) return { sent: 0 }
  const roomUrl = `${origin}/business-room/${asset.slug}`
  const context = { admin, apiKey, user, asset, targetUserId, roomUrl, origin }

  if (event === 'request') return onRequest(context)
  if (event === 'decision') return onDecision(context)
  return onActivity({ ...context, kind: event })
}
