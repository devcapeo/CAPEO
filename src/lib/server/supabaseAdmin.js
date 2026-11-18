/* Client Supabase « back-office » (clé secrète) : contourne les règles d'accès. Serveur uniquement. */
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from '@/config/supabase'

export function createAdminClient(secretKey) {
  return createClient(SUPABASE_URL, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/* Identifie le membre à partir du jeton envoyé par le navigateur (en-tête Authorization: Bearer …) */
export async function getUserFromRequest(request, admin) {
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null
  const { data, error } = await admin.auth.getUser(token)
  return error ? null : data.user
}
