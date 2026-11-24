/* ============================================
   Envoi d'e-mails transactionnels via l'API Resend (domaine capeo.org).
   Serveur uniquement.
   ============================================ */

import 'server-only'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
export const SENDER = 'CAPEO <no-reply@capeo.org>'

/* Envoie un e-mail ; renvoie true si Resend l'a accepté. Une erreur d'envoi n'interrompt jamais l'action du membre. */
export async function sendEmail(apiKey, { to, subject, html, text }) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: SENDER, to: [to], subject, html, text }),
  }).catch(() => null)

  if (!response?.ok) {
    const detail = response ? await response.text().catch(() => '') : 'réseau'
    console.error(`[CAPEO e-mail] Échec d'envoi (${response?.status ?? '—'}) : ${detail.slice(0, 300)}`)
    return false
  }
  return true
}
