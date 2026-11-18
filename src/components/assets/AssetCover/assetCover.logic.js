/* ============================================
   Visuel génératif d'une annonce, en attendant les photos du vendeur.
   Fonctions pures et déterministes : un même actif donne toujours le même visuel.
   ============================================ */

export const COVER_WIDTH = 400
export const COVER_HEIGHT = 260

/* Pictogrammes au trait par type d'actif (repère 0–100, centrés). */
const ICONS = {
  'immeuble-de-rapport':
    'M22 92V22h56v70M22 22l28-12 28 12M30 32h8v8h-8zM46 32h8v8h-8zM62 32h8v8h-8zM30 48h8v8h-8zM46 48h8v8h-8zM62 48h8v8h-8zM30 64h8v8h-8zM62 64h8v8h-8zM44 92V70h12v22',
  residence: 'M12 90h76M18 90V52h64v38M10 52h80M30 52V38h40v14M30 66h16v12H30zM54 66h16v24',
  domaine:
    'M6 74c16-14 30-18 44-10s30 6 44-8M6 88c18-10 34-12 48-6s28 4 40-4M30 60V44l14-10 14 10v16M38 60v-8h12v8M70 38a6 6 0 1 0 0.1 0',
  'murs-commerciaux': 'M14 90V40h72v50M10 40l8-14h64l8 14M10 40h80M24 52h22v26H24zM54 52h22v38M14 90h72',
  hotellerie: 'M26 92V18h48v74M20 18h60M34 28h8v8h-8zM58 28h8v8h-8zM34 44h8v8h-8zM58 44h8v8h-8zM34 60h8v8h-8zM58 60h8v8h-8zM42 92V76a8 8 0 0 1 16 0v16',
}

const DEFAULT_ICON = 'M50 12l34 20v36L50 88 16 68V32z'

/* Hachage FNV-1a → graine entière */
function hash(text) {
  let h = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function createRandom(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), a | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Décrit la composition : halo, champ de points, arc doré, pictogramme du type.
 * Tout est exprimé dans le repère COVER_WIDTH × COVER_HEIGHT.
 */
export function buildCover(seedText, type) {
  const random = createRandom(hash(seedText))

  const glow = { cx: 120 + random() * 160, cy: 60 + random() * 80, r: 180 + random() * 60 }

  const dots = Array.from({ length: 70 }, () => ({
    cx: +(random() * COVER_WIDTH).toFixed(1),
    cy: +(random() * COVER_HEIGHT).toFixed(1),
    r: +(0.6 + random() * 1.2).toFixed(2),
    opacity: +(0.12 + random() * 0.4).toFixed(2),
  }))

  /* Arc de mise en relation : une parabole d'un bord à l'autre */
  const startY = 180 + random() * 50
  const endY = 150 + random() * 60
  const peak = 30 + random() * 50
  const arc = `M-10 ${startY.toFixed(1)} Q${(150 + random() * 100).toFixed(1)} ${peak.toFixed(1)} ${COVER_WIDTH + 10} ${endY.toFixed(1)}`

  return {
    glow,
    dots,
    arc,
    icon: ICONS[type] ?? DEFAULT_ICON,
    gradientId: `cover-${hash(seedText).toString(36)}`,
  }
}
