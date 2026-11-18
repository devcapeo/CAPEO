/* ============================================
   Géométrie du globe : points répartis sur la sphère, places d'affaires, tracé des arcs.
   Fonctions pures (tableaux typés), déterministes grâce à une graine.
   Convention : rayon 1, nord = +y, longitude 0 sur +x, longitude 90° E sur -z.
   ============================================ */

/* Générateur pseudo-aléatoire déterministe (mulberry32) */
export function createRandom(seed = 7) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DEG = Math.PI / 180
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

export function latLonToVector(lat, lon, radius = 1) {
  const phi = lat * DEG
  const lambda = lon * DEG
  return [
    Math.cos(phi) * Math.cos(lambda) * radius,
    Math.sin(phi) * radius,
    -Math.cos(phi) * Math.sin(lambda) * radius,
  ]
}

/* Rotation (autour de l'axe nord) qui place une longitude face à la caméra. */
export function spinToFace(lon) {
  return -(Math.PI / 2 + lon * DEG)
}

/**
 * Points régulièrement répartis sur la sphère (spirale de Fibonacci).
 * Chaque point porte ses coordonnées de texture équirectangulaires :
 * le shader y lit la carte pour distinguer terres et océans.
 */
export function buildDotSphere({ count = 26000, seed = 5 } = {}) {
  const random = createRandom(seed)
  const positions = new Float32Array(count * 3)
  const uvs = new Float32Array(count * 2)
  const seeds = new Float32Array(count)

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (2 * (i + 0.5)) / count
    const lat = Math.asin(y) / DEG
    let lon = ((i * GOLDEN_ANGLE) % (Math.PI * 2)) / DEG - 180
    if (lon < -180) lon += 360

    positions.set(latLonToVector(lat, lon), i * 3)
    uvs.set([(lon + 180) / 360, (lat + 90) / 180], i * 2)
    seeds[i] = random()
  }

  return { positions, uvs, seeds }
}

/* Places où se rencontrent vendeurs et acquéreurs : les arcs relient ces points. */
export const HUBS = [
  { name: 'Paris', lat: 48.86, lon: 2.35 },
  { name: 'Londres', lat: 51.51, lon: -0.13 },
  { name: 'Genève', lat: 46.2, lon: 6.14 },
  { name: 'Luxembourg', lat: 49.61, lon: 6.13 },
  { name: 'Monaco', lat: 43.74, lon: 7.42 },
  { name: 'Milan', lat: 45.46, lon: 9.19 },
  { name: 'Madrid', lat: 40.42, lon: -3.7 },
  { name: 'Lisbonne', lat: 38.72, lon: -9.14 },
  { name: 'Bruxelles', lat: 50.85, lon: 4.35 },
  { name: 'Lyon', lat: 45.76, lon: 4.84 },
  { name: 'Marseille', lat: 43.3, lon: 5.37 },
  { name: 'Casablanca', lat: 33.57, lon: -7.59 },
  { name: 'Dubaï', lat: 25.2, lon: 55.27 },
  { name: 'Lagos', lat: 6.52, lon: 3.38 },
  { name: 'Le Cap', lat: -33.92, lon: 18.42 },
  { name: 'Mumbai', lat: 19.08, lon: 72.88 },
  { name: 'Singapour', lat: 1.35, lon: 103.82 },
  { name: 'Hong Kong', lat: 22.32, lon: 114.17 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69 },
  { name: 'Sydney', lat: -33.87, lon: 151.21 },
  { name: 'New York', lat: 40.71, lon: -74.01 },
  { name: 'Montréal', lat: 45.5, lon: -73.57 },
  { name: 'Miami', lat: 25.76, lon: -80.19 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  { name: 'Mexico', lat: 19.43, lon: -99.13 },
]

export function buildHubPoints() {
  const positions = new Float32Array(HUBS.length * 3)
  HUBS.forEach((hub, i) => positions.set(latLonToVector(hub.lat, hub.lon, 1.002), i * 3))
  return positions
}

/* Angle (radians) entre deux vecteurs unitaires */
function angleBetween(a, b) {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  return Math.acos(Math.min(1, Math.max(-1, dot)))
}

/* Interpolation sphérique entre deux vecteurs unitaires, remise à l'échelle */
function slerp(a, b, t, scale) {
  const omega = angleBetween(a, b)
  const sin = Math.sin(omega) || 1
  const wa = Math.sin((1 - t) * omega) / sin
  const wb = Math.sin(t * omega) / sin
  return [(a[0] * wa + b[0] * wb) * scale, (a[1] * wa + b[1] * wb) * scale, (a[2] * wa + b[2] * wb) * scale]
}

const MIN_ARC = 14 * DEG
const MAX_ARC = 118 * DEG

/**
 * Tire un trajet entre deux places, ni trop court ni trop long, avec un léger décalage
 * pour que deux arcs entre les mêmes villes ne se superposent pas exactement.
 * Retourne les 4 points de contrôle d'une courbe de Bézier cubique (parabole au-dessus du globe).
 */
export function pickArc(random) {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const from = HUBS[Math.floor(random() * HUBS.length)]
    const to = HUBS[Math.floor(random() * HUBS.length)]
    if (from === to) continue

    const jitter = () => (random() - 0.5) * 2.4
    const a = latLonToVector(from.lat + jitter(), from.lon + jitter(), 1.002)
    const b = latLonToVector(to.lat + jitter(), to.lon + jitter(), 1.002)
    const omega = angleBetween(a, b)
    if (omega < MIN_ARC || omega > MAX_ARC) continue

    const height = 1 + 0.08 + (omega / Math.PI) * 0.62
    return {
      controls: [a, slerp(a, b, 0.25, height), slerp(a, b, 0.75, height), b],
      length: omega,
    }
  }
  /* Repli : Paris → New York */
  const a = latLonToVector(HUBS[0].lat, HUBS[0].lon, 1.002)
  const b = latLonToVector(HUBS[20].lat, HUBS[20].lon, 1.002)
  return { controls: [a, slerp(a, b, 0.25, 1.4), slerp(a, b, 0.75, 1.4), b], length: angleBetween(a, b) }
}
