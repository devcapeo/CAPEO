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
