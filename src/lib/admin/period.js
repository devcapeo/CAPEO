/* ============================================
   CAPEO ADMIN — PÉRIODES ET MISE EN FORME (fonctions pures)
   Les bornes sont calculées dans le fuseau du navigateur (Europe/Paris pour l'équipe).
   ============================================ */

export const PERIODS = [
  { key: 'today', label: "Aujourd'hui" },
  { key: '7d', label: '7 jours' },
  { key: '30d', label: '30 jours' },
  { key: '90d', label: '90 jours' },
  { key: '12m', label: '12 mois' },
  { key: 'custom', label: 'Personnalisée' },
]

const DAY = 24 * 3600 * 1000

const startOfDay = (date) => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const addDays = (date, days) => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

export const toInputDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function bucketFor(from, to) {
  const span = to - from
  if (span <= 2 * DAY) return 'hour'
  if (span <= 120 * DAY) return 'day'
  if (span <= 400 * DAY) return 'week'
  return 'month'
}

/* Plage courante, granularité du graphique et plage précédente de même durée (comparaison) */
export function computeRange(key, custom = {}) {
  const now = new Date()
  let from
  let to = now
  let bucket

  switch (key) {
    case 'today':
      from = startOfDay(now)
      bucket = 'hour'
      break
    case '7d':
      from = startOfDay(addDays(now, -6))
      bucket = 'day'
      break
    case '90d':
      from = startOfDay(addDays(now, -89))
      bucket = 'day'
      break
    case '12m': {
      from = startOfDay(addDays(now, -364))
      from.setDate(1)
      bucket = 'month'
      break
    }
    case 'custom': {
      from = custom.from ? startOfDay(new Date(`${custom.from}T00:00:00`)) : startOfDay(addDays(now, -29))
      const end = custom.to ? addDays(startOfDay(new Date(`${custom.to}T00:00:00`)), 1) : now
      to = end > now ? now : end
      if (to <= from) to = addDays(from, 1)
      bucket = bucketFor(from, to)
      break
    }
    default:
      from = startOfDay(addDays(now, -29))
      bucket = 'day'
  }

  const duration = to - from
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    bucket,
    previous: { from: new Date(from - duration).toISOString(), to: from.toISOString() },
  }
}

/* ---------- Mise en forme ---------- */

const numberFormat = new Intl.NumberFormat('fr-FR')
export const formatNumber = (value) => numberFormat.format(Math.round(Number(value) || 0))

export const formatDecimal = (value, digits = 1) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: digits }).format(Number(value) || 0)

export const formatPercent = (value, digits = 1) => `${formatDecimal(value, digits)} %`

export function formatDuration(seconds) {
  const total = Math.round(Number(seconds) || 0)
  if (total < 60) return `${total} s`
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  if (minutes < 60) return `${minutes} min ${String(rest).padStart(2, '0')}`
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')}`
}

const dateTime = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
const dateOnly = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const timeOnly = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
export const formatDateTime = (value) => (value ? dateTime.format(new Date(value)) : '—')
export const formatDate = (value) => (value ? dateOnly.format(new Date(value)) : '—')
export const formatTime = (value) => (value ? timeOnly.format(new Date(value)) : '—')

export function formatRelative(value) {
  if (!value) return 'jamais'
  const diff = Date.now() - new Date(value).getTime()
  if (diff < 60_000) return "à l'instant"
  if (diff < 3600_000) return `il y a ${Math.round(diff / 60_000)} min`
  if (diff < DAY) return `il y a ${Math.round(diff / 3600_000)} h`
  if (diff < 30 * DAY) return `il y a ${Math.round(diff / DAY)} j`
  return formatDate(value)
}

/* Étiquette d'axe pour un créneau renvoyé par la base (heure locale de Paris, sans fuseau) */
export function slotLabel(slot, bucket) {
  const [datePart, timePart = '00:00'] = String(slot).replace('T', ' ').split(' ')
  const [, month, day] = datePart.split('-')
  if (bucket === 'hour') return `${timePart.slice(0, 2)}h`
  if (bucket === 'month') {
    const names = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
    return `${names[Number(month) - 1]} ${datePart.slice(2, 4)}`
  }
  return bucket === 'week' ? `sem. ${day}/${month}` : `${day}/${month}`
}

/* Variation par rapport à la période précédente */
export function delta(current, previous) {
  const a = Number(current) || 0
  const b = Number(previous) || 0
  if (b === 0) return a === 0 ? { value: 0, label: '=' } : { value: null, label: 'nouveau' }
  const value = ((a - b) / b) * 100
  return { value, label: `${value > 0 ? '+' : ''}${formatDecimal(value, 0)} %` }
}

/* ---------- Libellés ---------- */

let regionNames = null
export function countryName(code) {
  if (!code || code === '(non renseigné)') return 'Non renseigné'
  try {
    regionNames ??= new Intl.DisplayNames(['fr'], { type: 'region' })
    return regionNames.of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

export function countryFlag(code) {
  if (!code || code.length !== 2) return ''
  return code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
}

export const DEVICE_LABELS = { mobile: 'Mobile', tablet: 'Tablette', desktop: 'Ordinateur' }

export const ACTION_LABELS = {
  signup: 'Inscription',
  login: 'Connexion',
  kyc_start: "Vérification d'identité lancée",
  listing_submit: 'Annonce soumise',
  listing_draft: 'Brouillon enregistré',
  filter: 'Filtre du catalogue',
  room_request: "Demande d'accès Business Room",
  room_admit: 'Acquéreur admis',
  room_decline: 'Demande déclinée',
  room_message: 'Message Business Room',
  room_document: 'Document déposé',
  room_intention: 'Intention déclarée',
  room_leave: 'Business Room quittée',
  page_view: 'Page vue',
  page_leave: 'Fin de page',
  click: 'Clic',
}

export const actionLabel = (event) => ACTION_LABELS[event] ?? event

export const FUNNEL_LABELS = {
  visitors: 'Visiteurs',
  asset_viewers: "Ont consulté une fiche d'actif",
  signup_page: "Ont ouvert l'inscription",
  signups: 'Comptes créés',
  kyc_started: 'Vérification lancée',
  kyc_verified: 'Identité vérifiée',
  room_requesters: 'Ont demandé une Business Room',
  room_admitted: 'Admis en Business Room',
}

export const KYC_LABELS = {
  not_started: { label: 'Non commencée', tone: 'neutral' },
  pending: { label: 'En cours', tone: 'cobalt' },
  verified: { label: 'Vérifiée', tone: 'success' },
  rejected: { label: 'Refusée', tone: 'danger' },
}

export const REVIEW_LABELS = {
  pending: { label: 'À examiner', tone: 'gold' },
  approved: { label: 'Validé', tone: 'success' },
  rejected: { label: 'Refusé', tone: 'danger' },
}

export const LISTING_LABELS = {
  draft: { label: 'Brouillon', tone: 'neutral' },
  pending_review: { label: 'À examiner', tone: 'gold' },
  published: { label: 'Publiée', tone: 'success' },
  rejected: { label: 'Refusée', tone: 'danger' },
  archived: { label: 'Archivée', tone: 'neutral' },
}
