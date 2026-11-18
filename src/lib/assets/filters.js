/* ============================================
   CAPEO — FILTRES ET CLASSEMENT DES ANNONCES
   Fonctions pures, partagées par le serveur et le client.

   Classement (conforme aux CGU, art. « Classement et référencement des annonces ») :
   annonces mises en avant d'abord, puis date de publication décroissante.
   Les filtres restreignent les résultats sans modifier cet ordre.
   ============================================ */

export const BUDGET_STEPS = [
  { value: '3000000', label: "Jusqu'à 3 M €" },
  { value: '5000000', label: "Jusqu'à 5 M €" },
  { value: '8000000', label: "Jusqu'à 8 M €" },
  { value: '12000000', label: "Jusqu'à 12 M €" },
]

export const FILTER_KEYS = ['type', 'region', 'budget']

/* Lit les filtres depuis des paramètres d'URL (URLSearchParams ou objet). */
export function parseFilters(params) {
  const read = (key) => (typeof params?.get === 'function' ? params.get(key) : params?.[key]) || ''
  return Object.fromEntries(FILTER_KEYS.map((key) => [key, read(key)]))
}

export function hasActiveFilters(filters) {
  return FILTER_KEYS.some((key) => Boolean(filters[key]))
}

export function sortAssets(assets) {
  return [...assets].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return b.publishedAt.localeCompare(a.publishedAt)
  })
}

export function applyFilters(assets, filters) {
  const budget = Number(filters.budget) || Infinity
  return sortAssets(
    assets.filter(
      (asset) =>
        (!filters.type || asset.type === filters.type) &&
        (!filters.region || asset.region === filters.region) &&
        asset.price <= budget
    )
  )
}

/* Régions présentes dans le catalogue, triées, pour alimenter le filtre. */
export function listRegions(assets) {
  return [...new Set(assets.map((asset) => asset.region))].sort((a, b) => a.localeCompare(b, 'fr'))
}

/* Construit la chaîne de requête correspondant aux filtres (sans les valeurs vides). */
export function toQueryString(filters) {
  const params = new URLSearchParams()
  FILTER_KEYS.forEach((key) => filters[key] && params.set(key, filters[key]))
  const query = params.toString()
  return query ? `?${query}` : ''
}
