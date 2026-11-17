/* ============================================
   CAPEO — CONFIGURATION DU SITE
   Textes, navigation et constantes partagés.
   V1 : plateforme d'annonces et de mise en relation uniquement.
   ============================================ */

export const SITE = {
  name: 'CAPEO',
  meaning: 'Capital & Opportunities',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'fr_FR',
  slogan: {
    lead: 'Acquérir',
    accent: "l'exception.",
  },
  description:
    "CAPEO réunit les annonces d'actifs d'exception — immeubles, domaines, propriétés de prestige — et met en relation vendeurs et acquéreurs vérifiés, en toute discrétion.",
}

export const NAV_LINKS = [
  { href: '/actifs', label: 'Actifs' },
  { href: '/comment-ca-marche', label: 'Comment ça marche' },
  { href: '/deposer-un-actif', label: 'Publier un actif' },
]

export const AUTH_LINKS = {
  login: { href: '/connexion', label: 'Connexion' },
  register: { href: '/inscription', label: 'Rejoindre CAPEO' },
}

export const FOOTER_COLUMNS = [
  {
    title: 'Plateforme',
    links: [
      { href: '/actifs', label: 'Actifs disponibles' },
      { href: '/comment-ca-marche', label: 'Comment ça marche' },
      { href: '/deposer-un-actif', label: 'Publier un actif' },
    ],
  },
  {
    title: 'Compte',
    links: [
      { href: '/connexion', label: 'Connexion' },
      { href: '/inscription', label: 'Créer un compte' },
      { href: '/espace', label: 'Mon espace' },
    ],
  },
]

export const LEGAL_LINKS = [
  { href: '/cgu', label: 'CGU' },
  { href: '/confidentialite', label: 'Confidentialité' },
  { href: '/mentions-legales', label: 'Mentions légales' },
]

/* Mention affichée en pied de page. À faire relire par un conseil juridique avant la mise en production. */
export const LEGAL_NOTICE =
  "CAPEO est une plateforme de petites annonces et de mise en relation entre vendeurs et acquéreurs (règlement UE 2019/1150). CAPEO n'intervient pas dans la négociation, n'est pas prestataire de services de financement participatif et ne perçoit aucune commission sur les transactions. Le prix des actifs ne transite jamais par CAPEO : les ventes se concluent hors plateforme, entre les parties et leurs conseils. Les informations des annonces sont fournies par les vendeurs."

export const SOCIAL_LINKS = [
  { href: 'https://www.linkedin.com/', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://www.instagram.com/', label: 'Instagram', icon: 'instagram' },
]

export const ASSET_CATEGORIES = [
  { slug: 'residentiel', label: 'Résidentiel de prestige' },
  { slug: 'immeubles-de-rapport', label: 'Immeubles de rapport' },
  { slug: 'commercial', label: 'Immobilier commercial' },
  { slug: 'domaines', label: 'Domaines & propriétés' },
  { slug: 'hotellerie', label: 'Hôtellerie' },
]
