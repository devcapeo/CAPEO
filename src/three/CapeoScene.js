/* ============================================
   CAPEO — SCÈNE THREE.JS
   Icosaèdre doré central + 4 acquéreurs qui
   convergent au scroll. Bloom, particules,
   parallax souris, chorégraphie de caméra.
   ============================================ */

import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const GOLD = 0xb8953f
const GOLD_LIGHT = 0xc9a84c
const GOLD_DEEP = 0x8b6a2a
const NAVY = 0x0f1e3d
const BG = 0x09090b

const lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (edge0, edge1, x) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

export function createCapeoScene(canvas) {
  const isMobile = window.innerWidth < 768
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(BG)
  scene.fog = new THREE.FogExp2(BG, 0.03)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0.2, 8.5)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  /* ── Lumières ── */
  const ambient = new THREE.AmbientLight(0x1a1620, 0.35)
  scene.add(ambient)

  const keyLight = new THREE.PointLight(GOLD_LIGHT, 4.5, 25)
  keyLight.position.set(3.2, 3.8, 3.4)
  scene.add(keyLight)

  const rimLight = new THREE.DirectionalLight(GOLD, 1.2)
  rimLight.position.set(-4.5, 1.8, -3)
  scene.add(rimLight)

  const navyLight = new THREE.PointLight(NAVY, 3, 20)
  navyLight.position.set(-4, -3, 2)
  scene.add(navyLight)

  /* ── Forme centrale (le bien) ── */
  const centralGroup = new THREE.Group()

  const centralGeo = new THREE.IcosahedronGeometry(1.05, 1)
  const centralMat = new THREE.MeshPhysicalMaterial({
    color: GOLD,
    metalness: 1.0,
    roughness: 0.22,
    emissive: GOLD_DEEP,
    emissiveIntensity: 0.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  })
  const central = new THREE.Mesh(centralGeo, centralMat)
  centralGroup.add(central)

  const outerGeo = new THREE.IcosahedronGeometry(1.55, 2)
  const outerWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(outerGeo),
    new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.22 })
  )
  centralGroup.add(outerWire)

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.9, 0.006, 8, 128),
    new THREE.MeshBasicMaterial({ color: GOLD_LIGHT, transparent: true, opacity: 0.5 })
  )
  ring.rotation.x = Math.PI / 2.4
  centralGroup.add(ring)

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.35, 0.004, 8, 128),
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.28 })
  )
  ring2.rotation.x = Math.PI / 3
  ring2.rotation.z = Math.PI / 5
  centralGroup.add(ring2)

  scene.add(centralGroup)

  /* ── Les 4 acquéreurs ── */
  const buyers = []
  const buyerConfigs = [
    { start: new THREE.Vector3(-9, 3.4, -1),  end: new THREE.Vector3(-2.4, 1.55, 0.6) },
    { start: new THREE.Vector3(9, 3.4, -1),   end: new THREE.Vector3(2.4, 1.55, 0.6) },
    { start: new THREE.Vector3(-9, -3.4, -1), end: new THREE.Vector3(-2.4, -1.55, 0.6) },
    { start: new THREE.Vector3(9, -3.4, -1),  end: new THREE.Vector3(2.4, -1.55, 0.6) },
  ]

  buyerConfigs.forEach((cfg, i) => {
    const g = new THREE.Group()

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: GOLD_LIGHT,
        metalness: 0.95,
        roughness: 0.18,
        emissive: GOLD,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0,
      })
    )
    g.add(sphere)

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.28, 0.31, 48),
      new THREE.MeshBasicMaterial({
        color: GOLD_LIGHT,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      })
    )
    g.add(halo)

    g.position.copy(cfg.start)
    g.userData = { start: cfg.start.clone(), end: cfg.end.clone(), index: i, sphere, halo }
    scene.add(g)
    buyers.push(g)
  })

  /* ── Lignes de connexion ── */
  const lines = []
  buyers.forEach((b) => {
    const points = [b.userData.end.clone(), new THREE.Vector3(0, 0, 0)]
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({ color: GOLD_LIGHT, transparent: true, opacity: 0 })
    const line = new THREE.Line(geo, mat)
    line.userData.buyer = b
    scene.add(line)
    lines.push(line)
  })

  /* ── Particules ── */
  const particleCount = isMobile ? 260 : 720
  const pGeo = new THREE.BufferGeometry()
  const pPositions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 34
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 22
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))

  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: GOLD,
      size: 0.025,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  )
  scene.add(particles)

  const fCount = isMobile ? 120 : 300
  const fGeo = new THREE.BufferGeometry()
  const fPos = new Float32Array(fCount * 3)
  for (let i = 0; i < fCount; i++) {
    fPos[i * 3] = (Math.random() - 0.5) * 60
    fPos[i * 3 + 1] = (Math.random() - 0.5) * 40
    fPos[i * 3 + 2] = -Math.random() * 30 - 10
  }
  fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3))

  const farParticles = new THREE.Points(
    fGeo,
    new THREE.PointsMaterial({
      color: 0x506080,
      size: 0.035,
      transparent: true,
      opacity: 0.25,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  )
  scene.add(farParticles)

  /* ── Post-processing (bloom) ── */
  const composer = new EffectComposer(renderer)
  composer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
  composer.setSize(window.innerWidth, window.innerHeight)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    isMobile ? 0.65 : 0.95,
    0.65,
    0.18
  )
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  /* ── Parallax souris ── */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  const onMouse = (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('mousemove', onMouse)

  /* ── Progression scroll ── */
  let scrollProgress = 0
  let smoothScroll = 0

  /* ── Boucle d'animation ── */
  const clock = new THREE.Clock()
  let raf
  let visible = true

  function animate() {
    raf = requestAnimationFrame(animate)
    if (!visible) return

    const elapsed = clock.getElapsedTime()

    smoothScroll = lerp(smoothScroll, scrollProgress, 0.08)
    const p = smoothScroll

    mouse.x = lerp(mouse.x, mouse.tx, 0.05)
    mouse.y = lerp(mouse.y, mouse.ty, 0.05)

    // Forme centrale
    centralGroup.rotation.y = elapsed * 0.18 + mouse.x * 0.35
    centralGroup.rotation.x = Math.sin(elapsed * 0.12) * 0.14 + mouse.y * 0.2
    const scale = 1 + smoothstep(0.28, 0.6, p) * 0.12 - smoothstep(0.7, 1.0, p) * 0.15
    centralGroup.scale.setScalar(scale)

    ring.rotation.z = elapsed * 0.35
    ring2.rotation.z = -elapsed * 0.2
    outerWire.rotation.y = -elapsed * 0.12
    outerWire.rotation.x = elapsed * 0.07

    // Caméra
    const zoomIn = smoothstep(0.15, 0.55, p)
    const pullBack = smoothstep(0.7, 1.0, p)
    camera.position.z = lerp(8.5, 5.2, zoomIn) + pullBack * 4.5
    camera.position.x = lerp(0, 0.4, smoothstep(0.55, 0.9, p)) + mouse.x * 0.35
    camera.position.y = lerp(0.2, -1.2, smoothstep(0.6, 1.0, p)) + mouse.y * 0.22
    camera.lookAt(0, lerp(0, -0.5, smoothstep(0.6, 1.0, p)), 0)

    // Convergence des acquéreurs — le moment signature
    const conv = smoothstep(0.28, 0.58, p)
    buyers.forEach((b, i) => {
      const s = b.userData.start
      const e = b.userData.end
      b.position.x = lerp(s.x, e.x, conv)
      b.position.y = lerp(s.y, e.y, conv) + Math.sin(elapsed * 1.6 + i * 1.3) * 0.04
      b.position.z = lerp(s.z, e.z, conv)
      b.lookAt(camera.position)
      b.userData.sphere.material.opacity = conv
      b.userData.halo.material.opacity = conv * (0.5 + Math.sin(elapsed * 2 + i) * 0.2)
      b.userData.halo.scale.setScalar(1 + Math.sin(elapsed * 1.8 + i) * 0.15)
    })

    // Lignes de connexion
    const lineOp = smoothstep(0.4, 0.62, p)
    const pulseOp = 0.65 + Math.sin(elapsed * 1.4) * 0.2
    lines.forEach((line) => {
      line.material.opacity = lineOp * pulseOp
      const b = line.userData.buyer
      line.geometry.setFromPoints([b.position.clone(), new THREE.Vector3(0, 0, 0)])
      line.geometry.attributes.position.needsUpdate = true
    })

    // Particules
    particles.rotation.y = elapsed * 0.025
    particles.rotation.x = elapsed * 0.012
    farParticles.rotation.y = -elapsed * 0.008

    // Bloom pulsant
    bloom.strength =
      (isMobile ? 0.6 : 0.85) + Math.sin(elapsed * 0.7) * 0.08 + conv * 0.35 - pullBack * 0.2

    // Température de couleur en fin de scroll
    const coolShift = smoothstep(0.75, 1.0, p)
    keyLight.intensity = 4.5 - coolShift * 1.5
    navyLight.intensity = 3 + coolShift * 2.5

    composer.render()
  }

  animate()

  /* ── Resize ── */
  const onResize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    composer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  /* ── Pause si onglet caché ── */
  const onVis = () => { visible = !document.hidden }
  document.addEventListener('visibilitychange', onVis)

  return {
    setScrollProgress: (p) => {
      scrollProgress = Math.min(Math.max(p, 0), 1)
    },
    dispose: () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('visibilitychange', onVis)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.())
          else obj.material.dispose?.()
        }
      })
      composer.dispose?.()
      renderer.dispose()
    },
  }
}
