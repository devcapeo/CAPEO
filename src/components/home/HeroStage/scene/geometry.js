/* ============================================
   Génération procédurale de la structure : nœuds, liaisons, poussière dorée.
   Fonctions pures (tableaux typés), déterministes grâce à une graine.
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

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

/* Coquilles concentriques : la structure se construit du cœur vers l'extérieur. */
const SHELLS = [
  { radius: 4.4, share: 0.2 },
  { radius: 7.4, share: 0.34 },
  { radius: 10.6, share: 0.46 },
]

/**
 * Réseau de nœuds répartis sur trois sphères de Fibonacci légèrement aplaties,
 * reliés à leurs plus proches voisins.
 * Chaque nœud et chaque liaison reçoit un seuil d'apparition `reveal` (0 → 1).
 */
export function buildNetwork({ nodeCount = 420, neighbours = 3, seed = 11 } = {}) {
  const random = createRandom(seed)
  const nodes = []

  for (const shell of SHELLS) {
    const count = Math.round(nodeCount * shell.share)
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = GOLDEN_ANGLE * i + random() * 0.4
      const jitter = 1 + (random() - 0.5) * 0.12
      const x = Math.cos(theta) * r * shell.radius * jitter
      const z = Math.sin(theta) * r * shell.radius * jitter
      const yy = y * shell.radius * 0.78 * jitter
      nodes.push({ x, y: yy, z, radius: shell.radius })
    }
  }

  const maxRadius = SHELLS[SHELLS.length - 1].radius
  /* Apparition : du centre vers l'extérieur, balayée par l'angle autour de l'axe vertical */
  for (const node of nodes) {
    const radial = Math.hypot(node.x, node.y, node.z) / maxRadius
    const angular = (Math.atan2(node.z, node.x) + Math.PI) / (Math.PI * 2)
    node.reveal = Math.min(0.94, radial * 0.68 + angular * 0.22 + random() * 0.06)
  }

  /* Liaisons vers les plus proches voisins, sans doublon */
  const edgeKeys = new Set()
  const edges = []
  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i]
    const nearest = []
    for (let j = 0; j < nodes.length; j += 1) {
      if (i === j) continue
      const b = nodes[j]
      const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2
      nearest.push([d, j])
    }
    nearest.sort((m, n) => m[0] - n[0])
    for (let k = 0; k < neighbours; k += 1) {
      const [distance, j] = nearest[k]
      if (distance > 14) continue
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (edgeKeys.has(key)) continue
      edgeKeys.add(key)
      edges.push([i, j])
    }
  }

  /* Tableaux typés pour la carte graphique */
  const nodePositions = new Float32Array(nodes.length * 3)
  const nodeReveal = new Float32Array(nodes.length)
  const nodeSeed = new Float32Array(nodes.length)
  const nodeSize = new Float32Array(nodes.length)
  nodes.forEach((node, i) => {
    nodePositions.set([node.x, node.y, node.z], i * 3)
    nodeReveal[i] = node.reveal
    nodeSeed[i] = random()
    nodeSize[i] = node.radius === SHELLS[0].radius ? 3.2 + random() * 1.6 : 1.8 + random() * 1.6
  })

  const edgePositions = new Float32Array(edges.length * 6)
  const edgeT = new Float32Array(edges.length * 2)
  const edgeReveal = new Float32Array(edges.length * 2)
  const edgeSeed = new Float32Array(edges.length * 2)
  edges.forEach(([i, j], e) => {
    const a = nodes[i]
    const b = nodes[j]
    edgePositions.set([a.x, a.y, a.z, b.x, b.y, b.z], e * 6)
    edgeT.set([0, 1], e * 2)
    const reveal = Math.min(0.97, Math.max(a.reveal, b.reveal) + 0.02)
    edgeReveal.set([reveal, reveal], e * 2)
    const seed = random()
    edgeSeed.set([seed, seed], e * 2)
  })

  return {
    nodes: { positions: nodePositions, reveal: nodeReveal, seed: nodeSeed, size: nodeSize },
    edges: { positions: edgePositions, t: edgeT, reveal: edgeReveal, seed: edgeSeed },
  }
}

/* Poussière dorée en suspension dans un grand volume autour de la structure. */
export function buildDust({ count = 1400, seed = 23 } = {}) {
  const random = createRandom(seed)
  const positions = new Float32Array(count * 3)
  const speed = new Float32Array(count)
  const seeds = new Float32Array(count)
  const size = new Float32Array(count)

  for (let i = 0; i < count; i += 1) {
    positions.set([(random() - 0.5) * 60, (random() - 0.5) * 40, (random() - 0.5) * 70 - 5], i * 3)
    speed[i] = 0.08 + random() * 0.3
    seeds[i] = random()
    size[i] = 0.6 + random() * 1.4
  }

  return { positions, speed, seed: seeds, size }
}
