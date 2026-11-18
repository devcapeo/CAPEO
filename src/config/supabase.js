/* ============================================
   CAPEO — CONFIGURATION SUPABASE (projet « capeo », région Paris)

   La clé publiable (sb_publishable_…) est conçue pour être exposée au navigateur :
   la sécurité repose sur les règles d'accès (RLS) de la base, pas sur le secret de cette clé.
   Les variables d'environnement Vercel, si elles sont définies, ont priorité.
   La clé secrète (service) ne doit JAMAIS figurer ici ni dans le code client.
   ============================================ */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nuqbhaufouezojhhcdwh.supabase.co'

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_5kfQjN8Kh7NWAMDYzu4jlw_TWMz551x'
