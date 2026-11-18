/* ============================================
   Libellés des familles et types d'actifs. Fonctions pures (sans accès aux données),
   utilisables dans les composants client comme serveur.
   ============================================ */

import { ASSET_FAMILIES } from '@/config/site'

export function getFamily(slug) {
  return ASSET_FAMILIES.find((family) => family.slug === slug) ?? null
}

export function getTypeLabel(asset) {
  return getFamily(asset.family)?.types.find((type) => type.slug === asset.type)?.label ?? ''
}
