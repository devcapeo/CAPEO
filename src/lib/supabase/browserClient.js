/* ============================================
   Client Supabase du navigateur (session dans des cookies, rafraîchie automatiquement).
   Une seule instance par onglet.
   ============================================ */

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '@/config/supabase'

let client = null

export function getBrowserClient() {
  if (!client) client = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  return client
}
