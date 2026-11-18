/* ============================================
   Chorégraphie de la descente : progression du scroll (0 → 1) → état du globe.
   Fonctions pures, sans dépendance à Three.js.
   ============================================ */

export const HERO_STEP_COUNT = 5

/*
 * Images clés, placées au centre de chaque étape de texte (0.1, 0.3, 0.5, 0.7, 0.9).
 * tilt : inclinaison vers le nord (le cadrage du globe, lui, est calculé selon la place libre à l'écran)
 * spin : rotation ajoutée par le scroll (radians) : de l'Europe vers les Amériques
 * rate : arcs lancés par seconde
 * glow : intensité lumineuse globale
 */
const KEYFRAMES = [
  { at: 0.0, tilt: 0.42, spin: 0.0, rate: 1.4, glow: 0.92 },
  { at: 0.1, tilt: 0.41, spin: 0.08, rate: 1.5, glow: 0.94 },
  { at: 0.3, tilt: 0.38, spin: 0.4, rate: 1.9, glow: 0.97 },
  { at: 0.5, tilt: 0.34, spin: 0.75, rate: 2.4, glow: 1.0 },
  { at: 0.7, tilt: 0.31, spin: 1.1, rate: 3.0, glow: 1.05 },
  { at: 0.9, tilt: 0.28, spin: 1.4, rate: 3.6, glow: 1.12 },
  { at: 1.0, tilt: 0.28, spin: 1.5, rate: 3.6, glow: 1.12 },
]

const KEYS = ['tilt', 'spin', 'rate', 'glow']

export function clamp01(value) {
  return Math.min(1, Math.max(0, value))
}

/* Lissage doux */
export function smoothstep(t) {
  return t * t * (3 - 2 * t)
}

export function sampleChoreography(progress) {
  const p = clamp01(progress)
  let index = 0
  while (index < KEYFRAMES.length - 2 && p > KEYFRAMES[index + 1].at) index += 1

  const from = KEYFRAMES[index]
  const to = KEYFRAMES[index + 1]
  const t = smoothstep(clamp01((p - from.at) / (to.at - from.at)))

  const state = {}
  for (const key of KEYS) state[key] = from[key] + (to[key] - from[key]) * t
  return state
}

export function stepFromProgress(progress, count = HERO_STEP_COUNT) {
  return Math.min(count - 1, Math.floor(clamp01(progress) * count))
}

/*
 * Cycle de vie d'un arc, en fraction de sa durée (0 → 1) :
 * la tête trace la parabole, la traîne la suit et l'efface, une onde marque l'arrivée.
 */
const HEAD_END = 0.55
const TAIL_START = 0.3
const TAIL_SPAN = 0.62

export function arcState(age, duration) {
  const t = clamp01(age / duration)
  return {
    head: smoothstep(clamp01(t / HEAD_END)),
    tail: smoothstep(clamp01((t - TAIL_START) / TAIL_SPAN)),
    opacity: 1 - smoothstep(clamp01((t - 0.86) / 0.14)),
    impact: clamp01((t - HEAD_END) / (1 - HEAD_END)),
    done: t >= 1,
  }
}
