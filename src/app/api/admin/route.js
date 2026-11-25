/* ============================================
   CAPEO — FONCTION « ADMIN » (3 des 4 fonctions serverless)
   Domaine : back-office et mesure d'audience.

   POST /api/admin?action=collect      → reçoit les événements de mesure d'audience (pages, clics, actions)
   POST /api/admin?action=revalidate   → régénère les pages du catalogue après une décision de modération (admin)
   ============================================ */

import { revalidatePath } from 'next/cache'
import { readServerEnv } from '@/lib/server/env'
import { json, jsonError } from '@/lib/server/http'
import { createAdminClient, getUserFromRequest } from '@/lib/server/supabaseAdmin'
import { isBot, readBatch, toRows } from '@/lib/server/admin/collect'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const noContent = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })

async function isAdmin(admin, userId) {
  const { data } = await admin.from('profiles').select('role').eq('id', userId).maybeSingle()
  return data?.role === 'admin'
}

async function collect(request) {
  if (isBot(request.headers.get('user-agent'))) return noContent()

  const { values, missing } = readServerEnv(['supabaseSecretKey'])
  if (missing.length) return noContent()

  const body = await readBatch(request)
  if (!body) return noContent()

  const admin = createAdminClient(values.supabaseSecretKey)

  /* Rattachement au membre : uniquement sur jeton vérifié. Les admins ne sont pas comptés. */
  let userId = null
  if (typeof body.t === 'string' && body.t.length < 4000) {
    const { data } = await admin.auth.getUser(body.t)
    if (data?.user) {
      if (await isAdmin(admin, data.user.id)) return noContent()
      userId = data.user.id
    }
  }

  const rows = toRows(request, body, userId)
  if (rows.length) {
    const { error } = await admin.from('analytics_events').insert(rows)
    if (error) console.error('[CAPEO api/admin collect]', error.message)
  }

  /* Conservation limitée à 25 mois : purge occasionnelle */
  if (Math.random() < 0.005) await admin.rpc('purge_old_analytics')

  return noContent()
}

async function revalidate(request) {
  const { values, missing } = readServerEnv(['supabaseSecretKey'])
  if (missing.length) return jsonError(503, 'Service indisponible.')

  const admin = createAdminClient(values.supabaseSecretKey)
  const user = await getUserFromRequest(request, admin)
  if (!user || !(await isAdmin(admin, user.id))) return jsonError(403, 'Accès réservé à l’équipe CAPEO.')

  const body = await request.json().catch(() => ({}))
  revalidatePath('/')
  revalidatePath('/actifs')
  revalidatePath('/actifs/famille/[famille]', 'page')
  revalidatePath('/actifs/[slug]', 'page')
  if (typeof body.slug === 'string' && /^[a-z0-9-]{1,160}$/.test(body.slug)) revalidatePath(`/actifs/${body.slug}`)
  revalidatePath('/sitemap.xml')
  return json({ revalidated: true })
}

const ACTIONS = { collect, revalidate }

export async function POST(request) {
  const action = ACTIONS[new URL(request.url).searchParams.get('action')]
  if (!action) return jsonError(404, 'Action inconnue.')

  try {
    return await action(request)
  } catch (error) {
    console.error('[CAPEO api/admin]', error)
    return jsonError(500, 'Une erreur est survenue.')
  }
}
