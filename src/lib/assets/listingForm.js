/* ============================================
   CAPEO — FORMULAIRE DE DÉPÔT D'ANNONCE
   Fonctions pures : valeurs initiales, validation, contrôle du vocabulaire,
   conversion vers une ligne de la table `assets`.

   Ligne rouge AMF appliquée dès la saisie : pas de rendement, de plus-value,
   d'avantage fiscal ni de levée de fonds dans une annonce.
   ============================================ */

export const FRENCH_REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  "Provence-Alpes-Côte d'Azur",
  'Outre-mer',
]

export const FIGURE_UNITS = [
  { value: 'm2', label: 'm²' },
  { value: 'ha', label: 'ha' },
  { value: 'eur', label: '€' },
  { value: 'percent', label: '%' },
  { value: 'count', label: 'Nombre' },
  { value: 'text', label: 'Texte' },
]

export const LIMITS = { title: 140, summary: 300, figures: 8, highlights: 8, documents: 10 }

/* Termes refusés dans une annonce : ils la feraient sortir du cadre de la mise en relation. */
const FORBIDDEN_TERMS = [
  { pattern: /rendement/i, label: 'rendement' },
  { pattern: /rentabilit/i, label: 'rentabilité' },
  { pattern: /plus-?value/i, label: 'plus-value' },
  { pattern: /d[ée]fiscalis/i, label: 'défiscalisation' },
  { pattern: /avantage fiscal|r[ée]duction d'imp[ôo]t/i, label: 'avantage fiscal' },
  { pattern: /investiss/i, label: 'investissement / investisseur' },
  { pattern: /lev[ée]e de fonds/i, label: 'levée de fonds' },
  { pattern: /financement participatif|crowdfunding/i, label: 'financement participatif' },
]

export function emptyFigure() {
  return { label: '', value: '', unit: 'm2', financial: false }
}

export const INITIAL_LISTING = {
  family: 'immobilier',
  type: '',
  title: '',
  summary: '',
  city: '',
  region: '',
  price: '',
  priceOnRequest: false,
  description: '',
  highlights: '',
  documents: '',
  figures: [emptyFigure()],
  coAcquisition: false,
  certify: false,
}

/* Texte libre → liste de lignes non vides (une par ligne) */
export function toLines(text, max) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, max)
}

/* Texte libre → paragraphes (séparés par une ligne vide) */
export function toParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

export function parseAmount(value) {
  const digits = String(value).replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

/* Renvoie les termes interdits trouvés dans l'ensemble des textes de l'annonce. */
export function findForbiddenTerms(values) {
  const corpus = [
    values.title,
    values.summary,
    values.description,
    values.highlights,
    values.documents,
    ...values.figures.map((figure) => `${figure.label} ${figure.value}`),
  ].join(' \n ')
  return FORBIDDEN_TERMS.filter(({ pattern }) => pattern.test(corpus)).map(({ label }) => label)
}

/* submitting : true pour une soumission à l'examen (contrôles complets), false pour un brouillon */
export function validateListing(values, { submitting }) {
  const errors = {}
  if (values.title.trim().length < 5) errors.title = 'Un titre d’au moins 5 caractères.'
  if (values.title.length > LIMITS.title) errors.title = `${LIMITS.title} caractères au maximum.`
  if (!values.city.trim()) errors.city = 'Indiquez la ville ou le secteur.'

  if (submitting) {
    if (!values.type) errors.type = 'Choisissez un type d’actif.'
    if (!values.region) errors.region = 'Choisissez une région.'
    if (values.summary.trim().length < 20) errors.summary = 'Un résumé d’au moins 20 caractères.'
    if (!values.priceOnRequest && !parseAmount(values.price)) errors.price = 'Indiquez un prix, ou cochez « prix sur demande ».'
    if (toParagraphs(values.description).length === 0) errors.description = 'Décrivez l’actif.'
    if (!values.certify) errors.certify = 'Cette déclaration est nécessaire pour soumettre l’annonce.'
  }
  if (values.summary.length > LIMITS.summary) errors.summary = `${LIMITS.summary} caractères au maximum.`

  const incompleteFigure = values.figures.some(
    (figure) => (figure.label.trim() && !String(figure.value).trim()) || (!figure.label.trim() && String(figure.value).trim())
  )
  if (incompleteFigure) errors.figures = 'Chaque chiffre doit avoir un libellé et une valeur.'

  const forbidden = findForbiddenTerms(values)
  if (forbidden.length > 0) {
    errors.vocabulary = `Ces termes ne sont pas autorisés dans une annonce CAPEO : ${forbidden.join(', ')}. CAPEO met en relation des vendeurs et des acquéreurs ; les annonces décrivent l'actif, sans promesse financière.`
  }
  return errors
}

/* Identifiant d'URL : titre + ville + suffixe aléatoire court (unicité) */
export function buildSlug(title, city) {
  const base = `${title} ${city}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 90)
    .replace(/-$/, '')
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base || 'actif'}-${suffix}`
}

function figureValue(figure) {
  if (figure.unit === 'text') return String(figure.value).trim()
  const number = Number(String(figure.value).replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(number) ? number : String(figure.value).trim()
}

/* Valeurs du formulaire → ligne `assets`. Les champs réservés au back-office ne sont jamais envoyés. */
export function toAssetRow(values, { submitting }) {
  return {
    slug: buildSlug(values.title, values.city),
    family: values.family,
    type: values.type || 'non-precise',
    title: values.title.trim(),
    summary: values.summary.trim(),
    description: toParagraphs(values.description),
    highlights: toLines(values.highlights, LIMITS.highlights),
    document_labels: toLines(values.documents, LIMITS.documents),
    city: values.city.trim(),
    region: values.region,
    price: values.priceOnRequest ? null : parseAmount(values.price),
    figures: values.figures
      .filter((figure) => figure.label.trim() && String(figure.value).trim())
      .slice(0, LIMITS.figures)
      .map((figure) => ({
        label: figure.label.trim(),
        value: figureValue(figure),
        unit: figure.unit,
        financial: figure.unit === 'eur' || figure.unit === 'percent' ? true : Boolean(figure.financial),
      })),
    co_acquisition: values.coAcquisition,
    status: submitting ? 'pending_review' : 'draft',
  }
}
