/* ============================================
   Scène Three.js du hero : le globe CAPEO.
   Module chargé à la demande, côté client uniquement.

   Composition :
   - globe en points (or sur les terres, cobalt discret sur les océans), carte hébergée par CAPEO
   - places d'affaires lumineuses
   - arcs dorés en boucle continue : une parabole part d'une place, atterrit sur une autre
     dans une onde, puis s'efface — la mise en relation entre acquéreurs, partout
   - halo atmosphérique et bloom (halo lumineux) en post-traitement

   Cadrage : la page fournit la zone libre de l'écran (setSafeArea) ; la scène y inscrit
   le globe ET la portée de ses arcs, sans jamais déborder sur le texte.

   API (après résolution) : setProgress(p, immediate) · setSafeArea(zone) · setPointer(x, y)
                            start() · stop() · dispose()
   ============================================ */

import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { arcState, clamp01, sampleChoreography } from './choreography'
import { buildDotSphere, buildHubPoints, createRandom, pickArc, spinToFace } from './geometry'
import {
  dotVertex, dotFragment,
  bodyVertex, bodyFragment, atmosphereFragment,
  arcVertex, arcFragment,
  impactVertex, impactFragment,
  hubVertex, hubFragment,
} from './shaders'

const PALETTE = {
  navy: '#070B18',
  navyBody: '#0A1022',
  cobalt: '#1B3A6B',
  gold: '#C9A84C',
}

const LAND_MAP_URL = '/textures/world-land.png'

const TIERS = {
  high: { dots: 26000, maxArcs: 14, maxPixelRatio: 1.75 },
  low: { dots: 14000, maxArcs: 9, maxPixelRatio: 1.3 },
}

/* L'Europe face à la caméra au chargement */
const START_LONGITUDE = 8
const AUTO_ROTATION_SPEED = 0.045
const ARC_RADIUS = 0.0034
const FOV = 35
/* Portée maximale des arcs, en rayons du globe : le globe est dimensionné pour que les arcs restent dans la zone */
const ARC_REACH = 1.27
/* Taille de référence des points (px CSS) pour un globe de 420 px de rayon */
const DOT_PX = 3.4
const HUB_PX = 8.5
const IMPACT_SIZE = 0.1
/* En mode « moins d'animations » : arcs figés, temps arrêté */
const STILL_ARCS = 7
const STILL_TIME = 4

/*
 * La cible de rendu du composer reçoit la couleur d'effacement sans conversion,
 * puis l'OutputPass l'encode en sRGB : on fournit donc les composantes linéaires
 * pour que le fond ressorte exactement en navy #070B18.
 */
function clearColorFor(hex) {
  const linear = new THREE.Color(hex)
  return new THREE.Color().setRGB(linear.r, linear.g, linear.b, THREE.SRGBColorSpace)
}

function toVector(array) {
  return new THREE.Vector3(array[0], array[1], array[2])
}

export async function createHeroScene(container, { reducedMotion = false, tier = 'high' } = {}) {
  const settings = TIERS[tier] ?? TIERS.high

  const landMap = await new THREE.TextureLoader().loadAsync(LAND_MAP_URL)
  landMap.colorSpace = THREE.NoColorSpace
  landMap.generateMipmaps = false
  landMap.minFilter = THREE.LinearFilter

  /* ── Rendu ── */
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, settings.maxPixelRatio))
  renderer.setClearColor(clearColorFor(PALETTE.navy), 1)
  renderer.toneMapping = THREE.NoToneMapping
  renderer.domElement.setAttribute('aria-hidden', 'true')
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 80)

  /* pivot : inclinaison vers le nord · spinner : rotation autour de l'axe des pôles */
  const pivot = new THREE.Group()
  const spinner = new THREE.Group()
  pivot.add(spinner)
  scene.add(pivot)

  const colors = {
    gold: new THREE.Color(PALETTE.gold),
    cobalt: new THREE.Color(PALETTE.cobalt),
    navyBody: new THREE.Color(PALETTE.navyBody),
  }

  const uTime = { value: reducedMotion ? STILL_TIME : 0 }
  const uGlow = { value: 1 }
  const uDotSize = { value: 6 }
  const uHubSize = { value: 14 }
  const glowBlend = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }

  /* ── Corps du globe : masque l'arrière des points et des arcs ── */
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.996, 96, 64),
    new THREE.ShaderMaterial({
      vertexShader: bodyVertex,
      fragmentShader: bodyFragment,
      uniforms: { uNavy: { value: colors.navyBody }, uCobalt: { value: colors.cobalt } },
    })
  )
  spinner.add(body)

  /* ── Points du globe ── */
  const sphere = buildDotSphere({ count: settings.dots })
  const dotGeometry = new THREE.BufferGeometry()
  dotGeometry.setAttribute('position', new THREE.BufferAttribute(sphere.positions, 3))
  dotGeometry.setAttribute('uv', new THREE.BufferAttribute(sphere.uvs, 2))
  dotGeometry.setAttribute('aSeed', new THREE.BufferAttribute(sphere.seeds, 1))
  const dots = new THREE.Points(
    dotGeometry,
    new THREE.ShaderMaterial({
      vertexShader: dotVertex,
      fragmentShader: dotFragment,
      uniforms: {
        uLandMap: { value: landMap },
        uDotSize,
        uTime,
        uGlow,
        uGold: { value: colors.gold },
        uCobalt: { value: colors.cobalt },
      },
      ...glowBlend,
    })
  )
  spinner.add(dots)

  /* ── Places d'affaires ── */
  const hubGeometry = new THREE.BufferGeometry()
  hubGeometry.setAttribute('position', new THREE.BufferAttribute(buildHubPoints(), 3))
  spinner.add(
    new THREE.Points(
      hubGeometry,
      new THREE.ShaderMaterial({
        vertexShader: hubVertex,
        fragmentShader: hubFragment,
        uniforms: { uSize: uHubSize, uTime, uGold: { value: colors.gold } },
        ...glowBlend,
      })
    )
  )

  /* ── Halo atmosphérique ── */
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.16, 96, 64),
    new THREE.ShaderMaterial({
      vertexShader: bodyVertex,
      fragmentShader: atmosphereFragment,
      uniforms: { uCobalt: { value: colors.cobalt }, uGlow },
      side: THREE.BackSide,
      ...glowBlend,
    })
  )
  pivot.add(atmosphere)

  /* ── Arcs et ondes d'arrivée : un réservoir d'emplacements recyclés ── */
  const random = createRandom(reducedMotion ? 3 : Math.floor(Math.random() * 1e6))
  const impactGeometry = new THREE.PlaneGeometry(1, 1)
  const zAxis = new THREE.Vector3(0, 0, 1)

  const slots = Array.from({ length: settings.maxArcs }, () => {
    const arcMaterial = new THREE.ShaderMaterial({
      vertexShader: arcVertex,
      fragmentShader: arcFragment,
      uniforms: { uHead: { value: 0 }, uTail: { value: 0 }, uOpacity: { value: 0 }, uGold: { value: colors.gold } },
      ...glowBlend,
    })
    const arc = new THREE.Mesh(new THREE.BufferGeometry(), arcMaterial)
    arc.visible = false
    arc.frustumCulled = false
    spinner.add(arc)

    const impactMaterial = new THREE.ShaderMaterial({
      vertexShader: impactVertex,
      fragmentShader: impactFragment,
      uniforms: { uProgress: { value: 0 }, uOpacity: { value: 0 }, uGold: { value: colors.gold } },
      ...glowBlend,
      side: THREE.DoubleSide,
    })
    const impact = new THREE.Mesh(impactGeometry, impactMaterial)
    impact.scale.setScalar(IMPACT_SIZE)
    impact.visible = false
    spinner.add(impact)

    return { arc, impact, age: 0, duration: 1, active: false }
  })

  function launch(slot, initialAge = 0) {
    const { controls, length } = pickArc(random)
    const curve = new THREE.CubicBezierCurve3(...controls.map(toVector))
    slot.arc.geometry.dispose()
    slot.arc.geometry = new THREE.TubeGeometry(curve, 96, ARC_RADIUS, 5, false)

    const landing = toVector(controls[3]).normalize()
    slot.impact.position.copy(landing).multiplyScalar(1.004)
    slot.impact.quaternion.setFromUnitVectors(zAxis, landing)

    slot.duration = 2.2 + length * 1.4
    slot.age = initialAge
    slot.active = true
    slot.arc.visible = true
  }

  function updateSlot(slot) {
    const state = arcState(slot.age, slot.duration)
    const arcUniforms = slot.arc.material.uniforms
    arcUniforms.uHead.value = state.head
    arcUniforms.uTail.value = state.tail
    arcUniforms.uOpacity.value = state.opacity

    const impactUniforms = slot.impact.material.uniforms
    slot.impact.visible = state.impact > 0
    impactUniforms.uProgress.value = state.impact
    impactUniforms.uOpacity.value = state.opacity

    if (state.done) {
      slot.active = false
      slot.arc.visible = false
      slot.impact.visible = false
    }
  }

  /* Premiers arcs déjà en vol, pour que la scène soit vivante dès l'affichage */
  if (reducedMotion) {
    slots.slice(0, STILL_ARCS).forEach((slot) => {
      launch(slot)
      slot.age = slot.duration * 0.5
      updateSlot(slot)
    })
  } else {
    slots.slice(0, 4).forEach((slot, i) => {
      launch(slot)
      slot.age = slot.duration * (0.15 + i * 0.18)
      updateSlot(slot)
    })
  }

  /* ── Post-traitement : bloom ── */
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.7, 0.45, 0.42)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  /* ── État ── */
  let targetProgress = 0
  let progress = 0
  let spawnBudget = 0
  let autoRotation = 0
  const pointerTarget = { x: 0, y: 0 }
  const pointer = { x: 0, y: 0 }
  let running = false
  let frame = 0
  let lastTime = 0
  const baseSpin = spinToFace(START_LONGITUDE)

  /* ── Cadrage : centre et rayon du globe en pixels CSS, lissés vers la cible ── */
  let safeArea = null
  const framingTarget = { cx: 0, cy: 0, r: 0 }
  const framing = { cx: 0, cy: 0, r: 0 }

  function computeFramingTarget() {
    const width = container.clientWidth || 1
    const height = container.clientHeight || 1
    const area = safeArea ?? { x: width * 0.5, y: 0, width: width * 0.5, height }
    framingTarget.r = Math.max(40, Math.min(area.width, area.height) / 2 / ARC_REACH)
    framingTarget.cx = area.x + area.width / 2
    framingTarget.cy = area.y + area.height / 2
  }

  function snapFraming() {
    Object.assign(framing, framingTarget)
  }

  /* Distance de caméra telle que le disque du globe mesure exactement `framing.r` pixels */
  function applyFraming() {
    const width = container.clientWidth || 1
    const height = container.clientHeight || 1
    const focal = height / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const distance = Math.sqrt(1 + (focal / framing.r) ** 2)

    camera.position.set(0, 0, distance)
    camera.lookAt(0, 0, 0)
    camera.setViewOffset(width, height, width / 2 - framing.cx, height / 2 - framing.cy, width, height)
    camera.updateProjectionMatrix()

    /* Les points suivent la taille du globe (avec un plancher pour rester lisibles) */
    const scale = renderer.getPixelRatio() * Math.max(0.6, framing.r / 420) * (distance - 1)
    uDotSize.value = DOT_PX * scale
    uHubSize.value = HUB_PX * scale
  }

  function applyState(state) {
    uGlow.value = state.glow
    pivot.rotation.x = state.tilt + pointer.y * 0.05
    spinner.rotation.y = baseSpin + state.spin + autoRotation + pointer.x * 0.08
    bloom.strength = 0.55 + state.glow * 0.25
  }

  function renderFrame() {
    applyFraming()
    applyState(sampleChoreography(progress))
    composer.render()
  }

  function resize() {
    const width = container.clientWidth || 1
    const height = container.clientHeight || 1
    camera.aspect = width / height
    renderer.setSize(width, height, false)
    composer.setSize(width, height)
    computeFramingTarget()
    snapFraming()
    if (reducedMotion || !running) renderFrame()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  function tick(now) {
    frame = requestAnimationFrame(tick)
    const delta = Math.min(0.05, (now - (lastTime || now)) / 1000)
    lastTime = now
    uTime.value += delta
    autoRotation += delta * AUTO_ROTATION_SPEED

    const follow = 1 - Math.pow(0.002, delta)
    progress += (targetProgress - progress) * follow
    pointer.x += (pointerTarget.x - pointer.x) * follow * 0.4
    pointer.y += (pointerTarget.y - pointer.y) * follow * 0.4
    framing.cx += (framingTarget.cx - framing.cx) * follow * 0.6
    framing.cy += (framingTarget.cy - framing.cy) * follow * 0.6
    framing.r += (framingTarget.r - framing.r) * follow * 0.6

    /* Lancement des arcs selon le rythme de l'étape en cours */
    spawnBudget += delta * sampleChoreography(progress).rate
    for (const slot of slots) {
      if (slot.active) {
        slot.age += delta
        updateSlot(slot)
      } else if (spawnBudget >= 1) {
        spawnBudget -= 1
        launch(slot)
        updateSlot(slot)
      }
    }
    spawnBudget = Math.min(spawnBudget, 2)

    renderFrame()
  }

  return {
    setProgress(value, immediate = false) {
      targetProgress = clamp01(value)
      if (immediate || reducedMotion) {
        progress = targetProgress
        if (reducedMotion || !running) renderFrame()
      }
    },
    /* Zone libre de l'écran pour le globe : { x, y, width, height } en pixels CSS */
    setSafeArea(area, immediate = false) {
      safeArea = area
      computeFramingTarget()
      if (immediate || reducedMotion || !running) {
        snapFraming()
        renderFrame()
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
        renderFrame()
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
      landMap.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}
