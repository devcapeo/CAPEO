/* ============================================
   CAPEO — ACCÈS AU CATALOGUE D'ACTIFS
   Point d'entrée unique pour lire les annonces. Aujourd'hui : données d'exemple.
   En phase 3, ces fonctions liront Supabase sans changer de signature.
   ============================================ */

import { DEMO_ASSETS, IS_DEMO_CATALOG } from '@/data/demoAssets'
import { sortAssets } from './filters'

export const isDemoCatalog = IS_DEMO_CATALOG

export async function getAssets({ family } = {}) {
  const assets = family ? DEMO_ASSETS.filter((asset) => asset.family === family) : DEMO_ASSETS
  return sortAssets(assets)
}

export async function getAssetBySlug(slug) {
  return DEMO_ASSETS.find((asset) => asset.slug === slug) ?? null
}

export async function getAssetSlugs() {
  return DEMO_ASSETS.map((asset) => asset.slug)
}

/* Actifs proches : même famille, même type d'abord, hors l'actif courant. */
export async function getRelatedAssets(asset, limit = 3) {
  return sortAssets(DEMO_ASSETS.filter((other) => other.id !== asset.id && other.family === asset.family))
    .sort((a, b) => Number(b.type === asset.type) - Number(a.type === asset.type))
    .slice(0, limit)
}
