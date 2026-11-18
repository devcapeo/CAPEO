/* Traduction des erreurs Supabase Auth en messages clairs. Fonction pure. */
const MESSAGES = {
  invalid_credentials: 'Adresse e-mail ou mot de passe incorrect.',
  email_not_confirmed: 'Confirmez d’abord votre adresse e-mail grâce au lien reçu.',
  user_already_exists: 'Un compte existe déjà avec cette adresse e-mail.',
  email_exists: 'Un compte existe déjà avec cette adresse e-mail.',
  weak_password: 'Ce mot de passe est trop faible.',
  over_email_send_rate_limit: 'Trop d’e-mails envoyés. Réessayez dans quelques minutes.',
  over_request_rate_limit: 'Trop de tentatives. Réessayez dans quelques minutes.',
  same_password: 'Le nouveau mot de passe doit être différent de l’ancien.',
  otp_expired: 'Ce lien a expiré. Demandez-en un nouveau.',
  flow_state_not_found: 'Ce lien n’est plus valide sur ce navigateur.',
  email_address_not_authorized:
    "L'envoi d'e-mails vers cette adresse n'est pas encore activé sur la plateforme. Réessayez plus tard.",
}

export function authErrorMessage(error) {
  if (!error) return null
  return MESSAGES[error.code] ?? 'Une erreur est survenue. Réessayez dans un instant.'
}
