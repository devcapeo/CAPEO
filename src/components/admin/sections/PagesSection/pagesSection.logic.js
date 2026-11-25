'use client'

import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'
import { DEMO_ASSETS } from '@/data/demoAssets'

const DEMO_TITLES = new Map(DEMO_ASSETS.map((asset) => [asset.slug, asset.title]))

/* Nom lisible d'une page du site */
export function pageName(path) {
  const names = {
    '/': 'Accueil',
    '/actifs': 'Catalogue des actifs',
    '/comment-ca-marche': 'Comment ça marche',
    '/inscription': 'Inscription',
    '/connexion': 'Connexion',
    '/espace': 'Mon espace',
    '/deposer-un-actif': 'Publier un actif',
    '/mot-de-passe-oublie': 'Mot de passe oublié',
    '/cgu': 'CGU',
    '/confidentialite': 'Confidentialité',
    '/mentions-legales': 'Mentions légales',
  }
  if (names[path]) return names[path]
  const asset = path.match(/^\/actifs\/([^/]+)$/)
  if (asset && asset[1] !== 'famille') return `Fiche · ${DEMO_TITLES.get(asset[1]) ?? asset[1]}`
  const family = path.match(/^\/actifs\/famille\/([^/]+)$/)
  if (family) return `Famille · ${family[1]}`
  const room = path.match(/^\/business-room\/([^/]+)$/)
  if (room) return `Business Room · ${room[1]}`
  return path
}

export const assetTitle = (row) => row.title ?? DEMO_TITLES.get(row.slug) ?? row.slug

export function usePagesData(period, refreshKey) {
  return useAdminQuery(
    async () => {
      const [pages, assets] = await Promise.all([adminApi.fetchPages(period), adminApi.fetchAssetStats(period)])
      return { pages, assets }
    },
    [period.from, period.to, refreshKey]
  )
}
