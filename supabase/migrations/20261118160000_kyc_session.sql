-- ============================================
-- CAPEO — Vérification d'identité (Stripe Identity)
-- On conserve uniquement la référence de la session Stripe et le résultat,
-- jamais les pièces d'identité (elles restent chez Stripe).
-- Colonnes modifiables uniquement par le back-office (clé service) :
-- les privilèges par colonne des membres ne les incluent pas.
-- ============================================

alter table public.profiles
  add column kyc_session_id text check (char_length(kyc_session_id) <= 120),
  add column kyc_updated_at timestamptz;

comment on column public.profiles.kyc_session_id is 'Référence de la dernière session Stripe Identity (vs_…). Aucune donnée d''identité stockée.';
