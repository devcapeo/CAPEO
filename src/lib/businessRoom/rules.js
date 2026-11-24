/* ============================================
   CAPEO — BUSINESS ROOM : RÈGLES ET LIBELLÉS (fonctions pures)
   Ligne rouge AMF : les intentions sont individuelles et non engageantes ;
   aucune somme, aucun total, aucun indicateur d'avancement n'est jamais calculé.
   ============================================ */

export const ROOM_LIMITS = {
  intro: 600,
  message: 4000,
  note: 600,
  fileSize: 20 * 1024 * 1024,
}

export const ALLOWED_FILE_TYPES = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
}

export const FILE_ACCEPT = Object.keys(ALLOWED_FILE_TYPES).join(',')

export const INTENTION_MODES = [
  { value: 'seul', label: 'Acquérir seul' },
  { value: 'a_plusieurs', label: 'Acquérir à plusieurs' },
]

export const intentionModeLabel = (mode) => INTENTION_MODES.find((item) => item.value === mode)?.label ?? mode

export const MEMBER_STATUS = {
  requested: { tone: 'cobalt', label: 'Demande envoyée' },
  active: { tone: 'success', label: 'Admis' },
  declined: { tone: 'danger', label: 'Déclinée' },
  left: { tone: 'neutral', label: 'A quitté' },
}

export function validateIntro(intro) {
  const value = intro.trim()
  if (value.length < 20) return 'Présentez-vous en quelques mots (20 caractères minimum).'
  if (value.length > ROOM_LIMITS.intro) return `${ROOM_LIMITS.intro} caractères maximum.`
  return null
}

export function validateMessage(body) {
  const value = body.trim()
  if (!value) return 'Écrivez votre message.'
  if (value.length > ROOM_LIMITS.message) return `${ROOM_LIMITS.message} caractères maximum.`
  return null
}

/* Montant indicatif facultatif, en euros entiers */
export function parseAmount(raw) {
  const digits = String(raw ?? '').replace(/[\s  €.]/g, '').replace(',', '')
  if (!digits) return { value: null, error: null }
  if (!/^\d+$/.test(digits)) return { value: null, error: 'Indiquez un montant en euros, sans décimales.' }
  const value = Number(digits)
  if (value <= 0 || value > 10_000_000_000) return { value: null, error: 'Montant hors limites.' }
  return { value, error: null }
}

export function validateIntention({ mode, amount, note }) {
  const errors = {}
  if (!INTENTION_MODES.some((item) => item.value === mode)) errors.mode = 'Choisissez une option.'
  const parsed = parseAmount(amount)
  if (parsed.error) errors.amount = parsed.error
  if (note.trim().length > ROOM_LIMITS.note) errors.note = `${ROOM_LIMITS.note} caractères maximum.`
  return { errors, amount: parsed.value }
}

export function validateFile(file) {
  if (!file) return 'Choisissez un fichier.'
  if (!ALLOWED_FILE_TYPES[file.type]) return 'Formats acceptés : PDF, JPG, PNG, WEBP, Word, Excel.'
  if (file.size > ROOM_LIMITS.fileSize) return 'Fichier trop lourd (20 Mo maximum).'
  return null
}

/* Nom de fichier sûr pour le stockage (le nom d'origine est conservé à part pour l'affichage) */
export function safeFileName(name) {
  const cleaned = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return (cleaned || 'document').slice(-120)
}

export function buildStoragePath(assetId, userId, fileName) {
  return `${assetId}/${userId}/${crypto.randomUUID()}-${safeFileName(fileName)}`
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`
}

const timeFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
export const formatTimestamp = (value) => timeFormatter.format(new Date(value))

/* Messages d'erreur de la base, traduits pour les membres */
export function roomErrorMessage(error, fallback = 'Une erreur est survenue. Réessayez dans un instant.') {
  const message = error?.message ?? ''
  if (/identité doit être vérifiée/i.test(message)) return 'Votre identité doit être vérifiée.'
  if (/décliné/i.test(message)) return 'Le vendeur a décliné votre demande.'
  if (/row-level security|violates row-level/i.test(message)) return "Action non autorisée dans cette Business Room."
  if (/mime|file type|not supported/i.test(message)) return 'Format de fichier non accepté.'
  if (/exceeded|too large|size/i.test(message)) return 'Fichier trop lourd (20 Mo maximum).'
  return fallback
}
