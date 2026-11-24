/* ============================================
   CAPEO — SECRETS SERVEUR
   Lus uniquement dans les fonctions serverless (jamais dans le code client).
   À définir dans Vercel > Settings > Environment Variables.
   ============================================ */

import 'server-only'

const KEYS = {
  stripeSecretKey: 'STRIPE_SECRET_KEY',
  stripeWebhookSecret: 'STRIPE_WEBHOOK_SECRET',
  supabaseSecretKey: 'SUPABASE_SECRET_KEY',
  resendApiKey: 'RESEND_API_KEY',
}

/* Renvoie les valeurs demandées, ou la liste des variables manquantes */
export function readServerEnv(names) {
  const values = {}
  const missing = []
  for (const name of names) {
    const value = process.env[KEYS[name]]
    if (value) values[name] = value
    else missing.push(KEYS[name])
  }
  return { values, missing }
}
