/* Réponses JSON homogènes pour les route handlers */
export function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export function jsonError(status, message, details) {
  return json({ error: message, ...(details ? { details } : {}) }, status)
}
