/* ============================================
   CAPEO — ACCÈS AU CATALOGUE D'ACTIFS
   Point d'entrée unique pour lire les annonces.

   Source choisie par la variable CATALOG_SOURCE :
   - 'demo' (défaut) : annonces d'exemple fictives, signalées et non indexées ;
   - 'supabase'      : annonces publiées de la base (lecture publique, règles d'accès d'un visiteur).
   Les pages sont générées au build : une nouvelle annonce publiée apparaît au déploiement suivant
   (la revalidation automatique viendra avec le back-office).
   ============================================ */

import { DEMO_ASSETS, IS_DEMO_CATALOG } from '@/data/demoAssets'
import { getPublicClient } from '@/lib/supabase/publicClient'
import { sortAssets } from './filters'
import { mapAssetRow, PUBLIC_ASSET_COLUMNS } from './mapper'

const SOURCE = process.env.CATALOG_SOURCE === 'supabase' ? 'supabase' : 'demo'

export const isDemoCatalog = SOURCE === 'demo' && IS_DEMO_CATALOG

async function loadAssets() {
  if (SOURCE === 'demo') return DEMO_ASSETS

  const { data, error } = await getPublicClient()
    .from('assets')
    .select(PUBLIC_ASSET_COLUMNS)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })

  if (error) throw new Error(`Lecture du catalogue impossible : ${error.message}`)
  return data.map(mapAssetRow)
}

export async function getAssets({ family } = {}) {
  const assets = await loadAssets()
  return sortAssets(family ? assets.filter((asset) => asset.family === family) : assets)
}

export async function getAssetBySlug(slug) {
  const assets = await loadAssets()
  return assets.find((asset) => asset.slug === slug) ?? null
}

export async function getAssetSlugs() {
  const assets = await loadAssets()
  return assets.map((asset) => asset.slug)
}

/* Actifs proches : même famille, même type d'abord, hors l'actif courant. */
export async function getRelatedAssets(asset, limit = 3) {
  const assets = await loadAssets()
  return sortAssets(assets.filter((other) => other.id !== asset.id && other.family === asset.family))
    .sort((a, b) => Number(b.type === asset.type) - Number(a.type === asset.type))
    .slice(0, limit)
}
