/* ============================================
   CAPEO — VÉRIFICATION D'IDENTITÉ (STRIPE IDENTITY)

   - CAPEO crée une session de vérification et redirige le membre vers la page Stripe ;
   - Stripe vérifie la pièce d'identité et un selfie, puis prévient CAPEO par webhook ;
   - CAPEO ne conserve que le résultat (statut) et la référence de session :
     les pièces et images restent chez Stripe, jamais dans notre base.
   ============================================ */

import 'server-only'

/* Statut Stripe → statut CAPEO (profiles.kyc_status) */
const STATUS_BY_EVENT = {
  'identity.verification_session.processing': 'pending',
  'identity.verification_session.verified': 'verified',
  'identity.verification_session.requires_input': 'rejected',
  'identity.verification_session.canceled': 'not_started',
}

export const HANDLED_EVENTS = Object.keys(STATUS_BY_EVENT)

export async function createVerificationSession({ stripe, admin, user, origin }) {
  const session = await stripe.identity.verificationSessions.create({
    type: 'document',
    client_reference_id: user.id,
    metadata: { user_id: user.id },
    options: {
      document: {
        allowed_types: ['passport', 'id_card', 'driving_license'],
        require_matching_selfie: true,
        require_live_capture: true,
      },
    },
    return_url: `${origin}/espace?verification=retour`,
  })

  const { error } = await admin
    .from('profiles')
    .update({ kyc_status: 'pending', kyc_session_id: session.id, kyc_updated_at: new Date().toISOString() })
    .eq('id', user.id)
  if (error) throw new Error(`Mise à jour du profil impossible : ${error.message}`)

  return session.url
}

/* Applique un événement Stripe Identity au profil concerné. Renvoie true si l'événement a été traité. */
export async function applyVerificationEvent({ admin, event }) {
  const status = STATUS_BY_EVENT[event.type]
  const session = event.data?.object
  const userId = session?.metadata?.user_id
  if (!status || !userId) return false

  const now = new Date().toISOString()
  const update = { kyc_status: status, kyc_session_id: session.id, kyc_updated_at: now }
  if (status === 'verified') update.kyc_verified_at = now

  const { error } = await admin.from('profiles').update(update).eq('id', userId)
  if (error) throw new Error(`Mise à jour du profil impossible : ${error.message}`)
  return true
}
