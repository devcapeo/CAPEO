/* ============================================
   CAPEO — FONCTION « COMPTE » (1 des 4 fonctions serverless)
   Domaine : compte des membres.

   POST /api/compte?action=verification     → démarre une vérification d'identité (membre connecté)
   POST /api/compte?action=stripe-webhook   → reçoit les événements Stripe Identity (signés)
   ============================================ */

import Stripe from 'stripe'
import { readServerEnv } from '@/lib/server/env'
import { json, jsonError } from '@/lib/server/http'
import { createAdminClient, getUserFromRequest } from '@/lib/server/supabaseAdmin'
import { applyVerificationEvent, createVerificationSession } from '@/lib/server/compte/verification'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/* Variables manquantes : détaillées dans les journaux du serveur, jamais dans la réponse */
function notConfigured(message, missing) {
  console.warn(`[CAPEO api/compte] Variables d'environnement manquantes : ${missing.join(', ')}`)
  return jsonError(503, message)
}

async function startVerification(request) {
  const { values, missing } = readServerEnv(['stripeSecretKey', 'supabaseSecretKey'])
  if (missing.length) return notConfigured('La vérification d’identité n’est pas encore activée.', missing)

  const admin = createAdminClient(values.supabaseSecretKey)
  const user = await getUserFromRequest(request, admin)
  if (!user) return jsonError(401, 'Connectez-vous pour vérifier votre identité.')

  const { data: profile } = await admin.from('profiles').select('kyc_status').eq('id', user.id).single()
  if (profile?.kyc_status === 'verified') return jsonError(409, 'Votre identité est déjà vérifiée.')

  const stripe = new Stripe(values.stripeSecretKey)
  const origin = new URL(request.url).origin
  const url = await createVerificationSession({ stripe, admin, user, origin })
  return json({ url })
}

async function receiveStripeWebhook(request) {
  const { values, missing } = readServerEnv(['stripeSecretKey', 'stripeWebhookSecret', 'supabaseSecretKey'])
  if (missing.length) return notConfigured('Webhook non configuré.', missing)

  const stripe = new Stripe(values.stripeSecretKey)
  const signature = request.headers.get('stripe-signature')
  const payload = await request.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, values.stripeWebhookSecret)
  } catch {
    return jsonError(400, 'Signature invalide.')
  }

  const handled = await applyVerificationEvent({ admin: createAdminClient(values.supabaseSecretKey), event })
  return json({ received: true, handled })
}

const ACTIONS = {
  verification: startVerification,
  'stripe-webhook': receiveStripeWebhook,
}

export async function POST(request) {
  const action = ACTIONS[new URL(request.url).searchParams.get('action')]
  if (!action) return jsonError(404, 'Action inconnue.')

  try {
    return await action(request)
  } catch (error) {
    console.error('[CAPEO api/compte]', error)
    return jsonError(500, 'Une erreur est survenue. Réessayez dans un instant.')
  }
}
