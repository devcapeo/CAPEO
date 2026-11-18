/* ============================================
   Conversion d'une ligne de la table `assets` (Supabase) vers le format d'annonce du site.
   Fonctions pures : les composants ne connaissent qu'un seul format.
   ============================================ */

/* Colonnes lues pour l'affichage public (jamais les champs de modération) */
export const PUBLIC_ASSET_COLUMNS = [
  'id',
  'slug',
  'family',
  'type',
  'title',
  'summary',
  'description',
  'highlights',
  'document_labels',
  'city',
  'region',
  'country',
  'price',
  'figures',
  'co_acquisition',
  'featured',
  'seller_kind',
  'published_at',
].join(', ')

const SELLER_KIND_LABELS = { particulier: 'Particulier', professionnel: 'Professionnel' }

export function mapAssetRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    family: row.family,
    type: row.type,
    title: row.title,
    summary: row.summary,
    description: row.description ?? [],
    highlights: row.highlights ?? [],
    documents: row.document_labels ?? [],
    city: row.city,
    region: row.region,
    country: row.country,
    price: row.price,
    figures: Array.isArray(row.figures) ? row.figures : [],
    coAcquisition: row.co_acquisition,
    featured: row.featured,
    /* Une annonce publiée émane toujours d'un vendeur dont l'identité a été vérifiée */
    seller: { kind: SELLER_KIND_LABELS[row.seller_kind] ?? 'Particulier', verified: true },
    publishedAt: (row.published_at ?? '').slice(0, 10),
  }
}
