/* ============================================
   CAPEO ADMIN — ACCÈS AUX DONNÉES (navigateur)
   Chaque fonction de la base vérifie le rôle admin : rien n'est lisible sans lui.
   ============================================ */

import { getBrowserClient } from '@/lib/supabase/browserClient'

const supabase = () => getBrowserClient()

function unwrap({ data, error }) {
  if (error) throw error
  return data
}

const rpc = async (name, params) => unwrap(await supabase().rpc(name, params))
const range = ({ from, to }) => ({ p_from: from, p_to: to })

export const fetchOverview = (period) => rpc('admin_overview', range(period))
export const fetchSeries = (period) => rpc('admin_timeseries', { ...range(period), p_bucket: period.bucket })
export const fetchBreakdown = (period, dimension, limit = 50) =>
  rpc('admin_breakdown', { ...range(period), p_dimension: dimension, p_limit: limit })
export const fetchPages = (period) => rpc('admin_pages', range(period))
export const fetchClicks = (period) => rpc('admin_clicks', range(period))
export const fetchActions = (period) => rpc('admin_actions', range(period))
export const fetchHeatmap = (period) => rpc('admin_heatmap', range(period))
export const fetchFunnel = (period) => rpc('admin_funnel', range(period))
export const fetchAssetStats = (period) => rpc('admin_asset_stats', range(period))
export const fetchLive = () => rpc('admin_live')
export const fetchMembers = () => rpc('admin_members')
export const fetchJourney = (userId) => rpc('admin_member_journey', { p_user: userId, p_limit: 800 })
export const fetchRooms = () => rpc('admin_rooms')
export const fetchListings = () => rpc('admin_listings')

export const fetchListingDetail = async (id) =>
  unwrap(await supabase().from('assets').select('*').eq('id', id).maybeSingle())

export const reviewProfile = (userId, status) => rpc('admin_review_profile', { p_user: userId, p_status: status })
export const setRole = (userId, role) => rpc('admin_set_role', { p_user: userId, p_role: role })
export const featureAsset = (assetId, days) => rpc('admin_feature_asset', { p_asset: assetId, p_days: days })

async function authorizedPost(url, body) {
  const { data } = await supabase().auth.getSession()
  const token = data.session?.access_token
  if (!token) return null
  return fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => null)
}

/* Décision de modération : statut en base, régénération du catalogue, e-mail au vendeur */
export async function reviewAsset(asset, action, note) {
  const status = await rpc('admin_review_asset', { p_asset: asset.id, p_action: action, p_note: note ?? null })
  await authorizedPost('/api/admin?action=revalidate', { slug: asset.slug })
  if (['publish', 'reject'].includes(action)) {
    await authorizedPost('/api/contact?action=listing-review', { assetId: asset.id })
  }
  return status
}

export const revalidateCatalog = (slug) => authorizedPost('/api/admin?action=revalidate', { slug })
