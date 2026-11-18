/* ============================================
   CAPEO — RÈGLES DES FORMULAIRES D'AUTHENTIFICATION
   Fonctions pures : retournent un objet { champ: message } (vide si tout est valide).
   ============================================ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const PASSWORD_MIN_LENGTH = 10

export function validateEmail(email) {
  if (!email?.trim()) return 'Indiquez votre adresse e-mail.'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Cette adresse e-mail ne semble pas valide.'
  return null
}

export function validatePassword(password) {
  if (!password) return 'Choisissez un mot de passe.'
  if (password.length < PASSWORD_MIN_LENGTH) return `Au moins ${PASSWORD_MIN_LENGTH} caractères.`
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return 'Mélangez des lettres et des chiffres.'
  return null
}

function compact(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}

export function validateSignUp(values) {
  return compact({
    firstName: values.firstName?.trim() ? null : 'Indiquez votre prénom.',
    lastName: values.lastName?.trim() ? null : 'Indiquez votre nom.',
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    companyName:
      values.memberKind === 'professionnel' && !values.companyName?.trim() ? 'Indiquez le nom de votre société.' : null,
    terms: values.terms ? null : 'Vous devez accepter les CGU et la politique de confidentialité.',
  })
}

export function validateSignIn(values) {
  return compact({
    email: validateEmail(values.email),
    password: values.password ? null : 'Indiquez votre mot de passe.',
  })
}

export function validateNewPassword(values) {
  return compact({
    password: validatePassword(values.password),
    confirm: values.password === values.confirm ? null : 'Les deux mots de passe ne correspondent pas.',
  })
}

/* Redirection après connexion : chemins internes uniquement (pas de redirection ouverte). */
export function safeRedirect(path, fallback = '/espace') {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return fallback
  return path
}
