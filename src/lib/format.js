/* ============================================
   CAPEO — FORMATAGE
   Fonctions pures, utilisables côté serveur comme côté client.
   ============================================ */

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const compactPriceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

/* 2450000 -> "2 450 000 €" · compact -> "2,5 M €" */
export function formatPrice(amount, { compact = false } = {}) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return 'Prix sur demande'
  return (compact ? compactPriceFormatter : priceFormatter).format(Number(amount))
}

/* 1250 -> "1 250 m²" */
export function formatSurface(value) {
  if (!value) return null
  return `${new Intl.NumberFormat('fr-FR').format(value)} m²`
}

/* Chiffre d'annonce selon son unité : 'eur' | 'm2' | 'ha' | 'percent' | 'count' | 'text' */
export function formatFigure({ value, unit }) {
  const number = new Intl.NumberFormat('fr-FR')
  switch (unit) {
    case 'eur':
      return formatPrice(value)
    case 'm2':
      return formatSurface(value)
    case 'ha':
      return `${number.format(value)} ha`
    case 'percent':
      return `${number.format(value)} %`
    case 'count':
      return number.format(value)
    default:
      return String(value)
  }
}

/* "2026-11-12" -> "12 novembre 2026" */
export function formatDate(isoDate) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(isoDate))
}
