/* ============================================
   Chorégraphie de la descente : progression du scroll (0 → 1) → état de la scène.
   Fonctions pures, sans dépendance à Three.js.
   ============================================ */

export const HERO_STEP_COUNT = 5

/*
 * Images clés, placées au centre de chaque étape de texte (0.1, 0.3, 0.5, 0.7, 0.9).
 * camZ / camY : position caméra · build : construction du réseau (0 → 1)
 * ring : tracé du cercle de confiance · glass : apparition des volumes de verre
 * spin : rotation de la structure · glow : intensité lumineuse globale
 */
const KEYFRAMES = [
  { at: 0.0, camZ: 32, camY: 2.0, build: 0.56, ring: 0, glass: 0, spin: 0.0, glow: 0.75 },
  { at: 0.1, camZ: 30, camY: 1.8, build: 0.56, ring: 0, glass: 0, spin: 0.1, glow: 0.8 },
  { at: 0.3, camZ: 25, camY: 1.2, build: 0.8, ring: 0, glass: 0, spin: 0.45, glow: 0.9 },
  { at: 0.5, camZ: 21, camY: 0.6, build: 1.0, ring: 1, glass: 0, spin: 0.8, glow: 1.0 },
  { at: 0.7, camZ: 13, camY: 0.1, build: 1.0, ring: 1, glass: 1, spin: 1.15, glow: 1.1 },
  { at: 0.9, camZ: 6, camY: -0.3, build: 1.0, ring: 0.85, glass: 1, spin: 1.5, glow: 1.2 },
  { at: 1.0, camZ: 4.2, camY: -0.4, build: 1.0, ring: 0.8, glass: 1, spin: 1.6, glow: 1.2 },
]

const KEYS = ['camZ', 'camY', 'build', 'ring', 'glass', 'spin', 'glow']

export function clamp01(value) {
  return Math.min(1, Math.max(0, value))
}

/* Lissage doux entre deux images clés */
function ease(t) {
  return t * t * (3 - 2 * t)
}

export function sampleChoreography(progress) {
  const p = clamp01(progress)
  let index = 0
  while (index < KEYFRAMES.length - 2 && p > KEYFRAMES[index + 1].at) index += 1

  const from = KEYFRAMES[index]
  const to = KEYFRAMES[index + 1]
  const t = ease(clamp01((p - from.at) / (to.at - from.at)))

  const state = {}
  for (const key of KEYS) state[key] = from[key] + (to[key] - from[key]) * t
  return state
}

export function stepFromProgress(progress, count = HERO_STEP_COUNT) {
  return Math.min(count - 1, Math.floor(clamp01(progress) * count))
}
