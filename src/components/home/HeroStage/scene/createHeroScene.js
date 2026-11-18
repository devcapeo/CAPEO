/* ============================================
   Scène Three.js du hero — module chargé à la demande, côté client uniquement.

   Composition :
   - réseau de nœuds et de liaisons qui se construit du cœur vers l'extérieur
   - poussière dorée en suspension
   - cercle de confiance tracé en or
   - volumes de verre (cristal central et satellites : les Business Rooms)
   - bloom (halo lumineux) en post-traitement

   API : setProgress(p, immediate) · setPointer(x, y) · start() · stop() · dispose()
   ============================================ */

import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { sampleChoreography, clamp01 } from './choreography'
import { buildNetwork, buildDust } from './geometry'
import {
  edgeVertex, edgeFragment,
  nodeVertex, nodeFragment,
  dustVertex, dustFragment,
  ringVertex, ringFragment,
  glassVertex, glassFragment,
} from './shaders'

const PALETTE = {
  navy: '#070B18',
  cobalt: '#1B3A6B',
  gold: '#C9A84C',
  mist: '#9FB4DE',
}

const TIERS = {
  high: { nodes: 460, dust: 1600, maxPixelRatio: 1.75 },
  low: { nodes: 260, dust: 700, maxPixelRatio: 1.25 },
}

/* Temps figé utilisé en mode « moins d'animations » */
const STILL_TIME = 6.5

/*
 * La cible de rendu du composer reçoit la couleur d'effacement sans conversion,
 * puis l'OutputPass l'encode en sRGB : on fournit donc les composantes linéaires
 * pour que le fond ressorte exactement en navy #070B18.
 */
function clearColorFor(hex) {
  const linear = new THREE.Color(hex)
  return new THREE.Color().setRGB(linear.r, linear.g, linear.b, THREE.SRGBColorSpace)
}

/* Niveau de construction atteint par l'animation d'ouverture */
const OPENING_BUILD = 0.56

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function easeOutBack(t) {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}

function pointsGeometry(attributes) {
  const geometry = new THREE.BufferGeometry()
  for (const [name, [array, size]] of Object.entries(attributes)) {
    geometry.setAttribute(name, new THREE.BufferAttribute(array, size))
  }
  return geometry
}

export function createHeroScene(container, { reducedMotion = false, tier = 'high' } = {}) {
  const settings = TIERS[tier] ?? TIERS.high

  /* ── Rendu ── */
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, settings.maxPixelRatio))
  renderer.setClearColor(clearColorFor(PALETTE.navy), 1)
  /* Pas de mappage tonal : les couleurs de la charte ressortent telles quelles */
  renderer.toneMapping = THREE.NoToneMapping
  renderer.domElement.setAttribute('aria-hidden', 'true')
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200)
  const structure = new THREE.Group()
  structure.rotation.x = 0.14
  scene.add(structure)

  const colors = {
    gold: new THREE.Color(PALETTE.gold),
    cobalt: new THREE.Color(PALETTE.cobalt),
    mist: new THREE.Color(PALETTE.mist),
  }

  /* Uniforms partagés entre matériaux */
  const uTime = { value: reducedMotion ? STILL_TIME : 0 }
  const uGlow = { value: 1 }
  const uBuild = { value: 0 }
  const uPixelRatio = { value: renderer.getPixelRatio() }

  const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }

  /* ── Réseau : liaisons + nœuds ── */
  const network = buildNetwork({ nodeCount: settings.nodes })

  const edges = new THREE.LineSegments(
    pointsGeometry({
      position: [network.edges.positions, 3],
      aT: [network.edges.t, 1],
      aReveal: [network.edges.reveal, 1],
      aSeed: [network.edges.seed, 1],
    }),
    new THREE.ShaderMaterial({
      vertexShader: edgeVertex,
      fragmentShader: edgeFragment,
      uniforms: { uBuild, uTime, uGlow, uCobalt: { value: colors.cobalt }, uGold: { value: colors.gold } },
      ...additive,
    })
  )
  structure.add(edges)

  const nodes = new THREE.Points(
    pointsGeometry({
      position: [network.nodes.positions, 3],
      aReveal: [network.nodes.reveal, 1],
      aSeed: [network.nodes.seed, 1],
      aSize: [network.nodes.size, 1],
    }),
    new THREE.ShaderMaterial({
      vertexShader: nodeVertex,
      fragmentShader: nodeFragment,
      uniforms: { uBuild, uTime, uGlow, uPixelRatio, uGold: { value: colors.gold }, uMist: { value: colors.mist } },
      ...additive,
    })
  )
  structure.add(nodes)

  /* ── Poussière dorée (hors structure : ne tourne pas avec elle) ── */
  const dustData = buildDust({ count: settings.dust })
  const dust = new THREE.Points(
    pointsGeometry({
      position: [dustData.positions, 3],
      aSpeed: [dustData.speed, 1],
      aSeed: [dustData.seed, 1],
      aSize: [dustData.size, 1],
    }),
    new THREE.ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      uniforms: { uTime, uGlow, uPixelRatio, uGold: { value: colors.gold } },
      ...additive,
    })
  )
  scene.add(dust)

  /* ── Cercle de confiance : deux anneaux d'or qui se tracent ── */
  const ringUniforms = { uDraw: { value: 0 }, uOpacity: { value: 0 }, uTime, uGold: { value: colors.gold } }
  const innerRingUniforms = { uDraw: { value: 0 }, uOpacity: { value: 0 }, uTime, uGold: { value: colors.gold } }

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(13, 0.028, 6, 420),
    new THREE.ShaderMaterial({ vertexShader: ringVertex, fragmentShader: ringFragment, uniforms: ringUniforms, ...additive })
  )
  ring.rotation.set(Math.PI / 2.25, 0, 0.3)
  structure.add(ring)

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(8.9, 0.018, 6, 320),
    new THREE.ShaderMaterial({ vertexShader: ringVertex, fragmentShader: ringFragment, uniforms: innerRingUniforms, ...additive })
  )
  innerRing.rotation.set(Math.PI / 1.7, 0.4, -0.5)
  structure.add(innerRing)

  /* ── Volumes de verre : cristal central + satellites reliés ── */
  const glassUniforms = { uOpacity: { value: 0 }, uTime, uCobalt: { value: colors.cobalt }, uGold: { value: colors.gold } }
  const glassMaterial = new THREE.ShaderMaterial({
    vertexShader: glassVertex,
    fragmentShader: glassFragment,
    uniforms: glassUniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const glassEdgeMaterial = new THREE.LineBasicMaterial({ color: colors.gold, ...additive, opacity: 0 })

  const glassGroup = new THREE.Group()
  structure.add(glassGroup)

  const volumes = [
    { geometry: new THREE.IcosahedronGeometry(1.8, 0), position: [0, 0, 0], spin: 0.18 },
    { geometry: new THREE.OctahedronGeometry(0.85, 0), position: [5.6, 2.1, 2.4], spin: -0.32 },
    { geometry: new THREE.OctahedronGeometry(0.7, 0), position: [-5.9, -2.2, 1.2], spin: 0.27 },
    { geometry: new THREE.OctahedronGeometry(0.6, 0), position: [1.4, 3.6, -5.4], spin: 0.4 },
  ].map(({ geometry, position, spin }) => {
    const holder = new THREE.Group()
    holder.position.set(...position)
    holder.add(new THREE.Mesh(geometry, glassMaterial))
    holder.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), glassEdgeMaterial))
    glassGroup.add(holder)
    return { holder, spin }
  })

  /* Fils d'or entre le cristal et les satellites : « ensemble » */
  const linkPositions = new Float32Array((volumes.length - 1) * 6)
  volumes.slice(1).forEach(({ holder }, i) => linkPositions.set([0, 0, 0, ...holder.position.toArray()], i * 6))
  const linkMaterial = new THREE.LineBasicMaterial({ color: colors.gold, ...additive, opacity: 0 })
  glassGroup.add(new THREE.LineSegments(pointsGeometry({ position: [linkPositions, 3] }), linkMaterial))

  /* ── Post-traitement : bloom ── */
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.8, 0.5, 0.22)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  /* ── État ── */
  let targetProgress = 0
  let progress = 0
  const pointerTarget = { x: 0, y: 0 }
  const pointer = { x: 0, y: 0 }
  let running = false
  let frame = 0
  let lastTime = 0
  /* Construction d'ouverture : le cœur du réseau se déploie à l'arrivée, sans attendre le scroll */
  let intro = reducedMotion ? 1 : 0
  const INTRO_DURATION = 3.2

  function applyState(state, time) {
    uBuild.value = Math.max(state.build, OPENING_BUILD) * easeOutCubic(intro)
    uGlow.value = state.glow

    ringUniforms.uDraw.value = state.ring
    ringUniforms.uOpacity.value = clamp01(state.ring * 4)
    const inner = clamp01((state.ring - 0.15) / 0.85)
    innerRingUniforms.uDraw.value = inner
    innerRingUniforms.uOpacity.value = clamp01(inner * 4) * 0.6

    const glass = clamp01(state.glass)
    const scale = Math.max(0.0001, easeOutBack(glass))
    glassUniforms.uOpacity.value = glass
    glassEdgeMaterial.opacity = glass * 0.85
    linkMaterial.opacity = glass * 0.35
    volumes.forEach(({ holder, spin }, i) => {
      holder.scale.setScalar(i === 0 ? scale : scale * clamp01(glass * 1.4 - i * 0.12))
      holder.rotation.set(time * spin * 0.6, time * spin, 0)
    })

    structure.rotation.y = state.spin + time * 0.025

    camera.position.set(pointer.x * 1.4, state.camY + pointer.y * 0.8, state.camZ)
    camera.lookAt(0, state.camY * 0.25, 0)

    bloom.strength = 0.45 + state.glow * 0.4
  }

  function renderFrame(time) {
    applyState(sampleChoreography(progress), time)
    composer.render()
  }

  function resize() {
    const width = container.clientWidth || 1
    const height = container.clientHeight || 1
    camera.aspect = width / height
    camera.fov = camera.aspect < 0.9 ? 62 : 45
    /* Décentrage optique : la structure à droite du texte (desktop), au-dessus (mobile) */
    if (camera.aspect >= 0.9) camera.setViewOffset(width, height, -width * 0.14, 0, width, height)
    else camera.setViewOffset(width, height, 0, height * 0.16, width, height)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    composer.setSize(width, height)
    uPixelRatio.value = renderer.getPixelRatio()
    if (reducedMotion || !running) renderFrame(uTime.value)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  /* Boucle d'animation : lissage indépendant de la fréquence d'images */
  function tick(now) {
    frame = requestAnimationFrame(tick)
    const delta = Math.min(0.05, (now - (lastTime || now)) / 1000)
    lastTime = now
    uTime.value += delta
    intro = Math.min(1, intro + delta / INTRO_DURATION)

    const follow = 1 - Math.pow(0.002, delta)
    progress += (targetProgress - progress) * follow
    pointer.x += (pointerTarget.x - pointer.x) * follow * 0.5
    pointer.y += (pointerTarget.y - pointer.y) * follow * 0.5

    renderFrame(uTime.value)
  }

  return {
    setProgress(value, immediate = false) {
      targetProgress = clamp01(value)
      if (immediate || reducedMotion) {
        progress = targetProgress
        if (reducedMotion || !running) renderFrame(uTime.value)
      }
    },
    setPointer(x, y) {
      if (reducedMotion) return
      pointerTarget.x = x
      pointerTarget.y = y
    },
    start() {
      if (running) return
      running = true
      if (reducedMotion) {
        renderFrame(uTime.value)
        return
      }
      lastTime = 0
      frame = requestAnimationFrame(tick)
    },
    stop() {
      running = false
      cancelAnimationFrame(frame)
    },
    dispose() {
      running = false
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      scene.traverse((object) => {
        object.geometry?.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material?.dispose())
      })
      composer.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}
