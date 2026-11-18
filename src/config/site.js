/* ============================================
   CAPEO — CONFIGURATION DU SITE
   Textes, navigation et constantes partagés.

   Cadre (ligne rouge AMF) : CAPEO est une plateforme de mise en relation
   (règlement UE 2019/1150), pas un PSFP. Aucun fonds lié à l'acquisition
   d'un actif ne transite par CAPEO ; les transactions se concluent hors plateforme.
   Vocabulaire : acquisition / acquéreur / actif — jamais investissement / investisseur.
   ============================================ */

/* URL publique : variable explicite, sinon domaine de production Vercel, sinon local. */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}

export const SITE = {
  name: 'CAPEO',
  meaning: 'Capital & Opportunities',
  url: resolveSiteUrl(),
  locale: 'fr_FR',
  slogan: {
    lead: 'Acquérir',
    accent: "l'exception.",
  },
  tagline: "Place de marché d'actifs rares",
  pitch:
    "CAPEO n'est pas un mur d'annonces : c'est un cercle de confiance vérifié où des acquéreurs sérieux se rencontrent pour acquérir, seuls ou ensemble, des actifs rares. Mise en relation pure, zéro commission.",
  description:
    "Place de marché d'actifs rares — immobilier, entreprises à céder, startups, objets d'exception. Profils et annonces vérifiés par notre équipe, identité contrôlée avant tout contact. Mise en relation pure, zéro commission.",
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
  "CAPEO est une plateforme de mise en relation entre vendeurs et acquéreurs d'actifs (règlement UE 2019/1150). CAPEO n'est pas prestataire de services de financement participatif, n'organise aucune collecte, ne fournit aucun conseil et ne perçoit aucune commission sur les transactions. Aucun fonds lié à l'acquisition d'un actif ne transite par CAPEO : les transactions se concluent hors plateforme, entre les parties et leurs propres conseils. Les informations des annonces sont fournies par les vendeurs et ne sont pas vérifiées par CAPEO."

/* Mention à accoler à tout indicateur financier (prix, chiffre d'affaires, loyers…). */
export const SELLER_DATA_NOTICE = 'Fourni par le vendeur, non vérifié par CAPEO'

export const SOCIAL_LINKS = [
  { href: 'https://www.linkedin.com/', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://www.instagram.com/', label: 'Instagram', icon: 'instagram' },
]

/*
 * Familles d'actifs. Le catalogue V1 démarre en immobilier (available: true) ;
 * les autres familles sont affichées comme « bientôt » pour assumer le multi-actifs.
 * Entreprises et startups : cession (rachat) uniquement, jamais de levée de fonds.
 * `types` : sous-catégories proposées dans les filtres et au dépôt d'annonce.
 */
export const ASSET_FAMILIES = [
  {
    slug: 'immobilier',
    label: 'Immobilier',
    description: 'Immeubles, domaines, murs commerciaux, résidences d\u2019exception.',
    intro:
      "Immeubles de rapport, domaines, murs commerciaux, hôtellerie, résidences d'exception : des biens rares, présentés par des vendeurs dont l'identité est vérifiée, et des annonces examinées une par une par notre équipe.",
    available: true,
    types: [
      { slug: 'immeuble-de-rapport', label: 'Immeuble de rapport' },
      { slug: 'residence', label: 'Résidence d\u2019exception' },
      { slug: 'domaine', label: 'Domaine & propriété' },
      { slug: 'murs-commerciaux', label: 'Murs commerciaux' },
      { slug: 'hotellerie', label: 'Hôtellerie' },
    ],
  },
  {
    slug: 'entreprises',
    label: 'Entreprises à céder',
    description: 'Fonds de commerce, PME, sociétés en transmission.',
    intro:
      "Fonds de commerce, PME et sociétés en transmission : la même exigence de vérification, appliquée à la reprise d'entreprise. Il s'agit exclusivement de cessions, jamais de levées de fonds.",
    available: false,
    types: [],
  },
  {
    slug: 'startups',
    label: 'Startups',
    description: 'Jeunes sociétés et projets technologiques à reprendre.',
    intro:
      "Jeunes sociétés, actifs technologiques, projets à reprendre : CAPEO mettra en relation cédants et repreneurs vérifiés. Il s'agit exclusivement de cessions, jamais de levées de fonds.",
    available: false,
    types: [],
  },
  {
    slug: 'objets-rares',
    label: 'Objets rares',
    description: 'Collections, véhicules, œuvres et pièces atypiques.',
    intro:
      "Collections, véhicules d'exception, œuvres et pièces atypiques : des objets rares, présentés par des vendeurs identifiés, à des acquéreurs dont l'identité est vérifiée.",
    available: false,
    types: [],
  },
]
