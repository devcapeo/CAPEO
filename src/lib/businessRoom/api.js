/* ============================================
   CAPEO — BUSINESS ROOM : ACCÈS AUX DONNÉES (navigateur)
   Toutes les autorisations sont garanties par les règles d'accès de la base ;
   ces fonctions ne font que lire et écrire au nom du membre connecté.
   ============================================ */

import { getBrowserClient } from '@/lib/supabase/browserClient'
import { buildStoragePath } from './rules'

const BUCKET = 'business-room'
const supabase = () => getBrowserClient()

function unwrap({ data, error }) {
  if (error) throw error
  return data
}

/* Annonce visible par le membre (publiée, ou la sienne) */
export async function fetchRoomAsset(slug) {
  return unwrap(
    await supabase()
      .from('assets')
      .select('id, slug, title, city, region, status, seller_id, co_acquisition, document_labels')
      .eq('slug', slug)
      .maybeSingle()
  )
}

export async function fetchMembership(assetId, userId) {
  const data = unwrap(
    await supabase().from('room_members').select('status').eq('asset_id', assetId).eq('user_id', userId).maybeSingle()
  )
  return data?.status ?? null
}

export const fetchParticipants = async (assetId) => unwrap(await supabase().rpc('room_participants', { p_asset: assetId })) ?? []

export const fetchMessages = async (assetId) =>
  unwrap(
    await supabase()
      .from('room_messages')
      .select('id, author_id, body, created_at')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: true })
      .limit(500)
  ) ?? []

export const fetchDocuments = async (assetId) =>
  unwrap(
    await supabase()
      .from('room_documents')
      .select('id, uploader_id, file_name, storage_path, size_bytes, mime_type, created_at')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: false })
  ) ?? []

export const fetchIntentions = async (assetId) =>
  unwrap(
    await supabase()
      .from('room_intentions')
      .select('user_id, mode, indicative_amount, note, updated_at')
      .eq('asset_id', assetId)
      .order('updated_at', { ascending: false })
  ) ?? []

export const requestAccess = async (assetId, intro) =>
  unwrap(await supabase().rpc('request_room_access', { p_asset: assetId, p_intro: intro }))

export const decideRequest = async (assetId, userId, accept) =>
  unwrap(await supabase().rpc('decide_room_request', { p_asset: assetId, p_user: userId, p_accept: accept }))

export const leaveRoom = async (assetId) => unwrap(await supabase().rpc('leave_room', { p_asset: assetId }))

export const sendMessage = async (assetId, body) =>
  unwrap(await supabase().from('room_messages').insert({ asset_id: assetId, body: body.trim() }))

export async function saveIntention(assetId, { mode, amount, note }, exists) {
  const values = { mode, indicative_amount: amount, note: note.trim() }
  const query = exists
    ? supabase().from('room_intentions').update(values).eq('asset_id', assetId).eq('user_id', (await currentUserId()))
    : supabase().from('room_intentions').insert({ asset_id: assetId, ...values })
  return unwrap(await query)
}

export const removeIntention = async (assetId) =>
  unwrap(await supabase().from('room_intentions').delete().eq('asset_id', assetId).eq('user_id', await currentUserId()))

/* Dépôt : fichier dans le stockage privé, puis trace en base */
export async function uploadDocument(assetId, userId, file) {
  const path = buildStoragePath(assetId, userId, file.name)
  unwrap(await supabase().storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false }))
  return unwrap(
    await supabase().from('room_documents').insert({
      asset_id: assetId,
      file_name: file.name.slice(0, 200),
      storage_path: path,
      size_bytes: file.size,
      mime_type: file.type,
    })
  )
}

/* Lien de téléchargement temporaire (1 minute) */
export async function documentUrl(path, fileName) {
  const data = unwrap(await supabase().storage.from(BUCKET).createSignedUrl(path, 60, { download: fileName }))
  return data.signedUrl
}

export const fetchMyRooms = async () => unwrap(await supabase().rpc('my_rooms')) ?? []

async function currentUserId() {
  const { data } = await supabase().auth.getUser()
  return data.user?.id
}

/* Prévient les participants par e-mail (best effort : un échec n'interrompt jamais l'action) */
export async function notifyRoom(assetId, event, targetUserId) {
  const { data } = await supabase().auth.getSession()
  const token = data.session?.access_token
  if (!token) return
  await fetch('/api/contact?action=room-event', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetId, event, targetUserId }),
  }).catch(() => null)
}
