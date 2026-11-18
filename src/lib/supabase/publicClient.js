/* ============================================
   Client Supabase sans session, pour les lectures publiques au build
   (annonces publiées). Soumis aux mêmes règles d'accès qu'un visiteur anonyme.
   ============================================ */

import { createClient } from '@supabase/supabase-js'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '@/config/supabase'

export function getPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
