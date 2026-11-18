/* ============================================
   Shaders GLSL du globe.
   Le principe du globe en points (masque de carte lu dans une texture) s'inspire
   du travail de Ksenia Kondrashova (CodePen, licence MIT) ; il est réécrit pour CAPEO.
   ============================================ */

/* ── Points du globe : or sur les terres, voile cobalt discret sur les océans ── */
export const dotVertex = /* glsl */ `
  uniform sampler2D uLandMap;
  uniform float uDotSize;
  uniform float uTime;
  attribute float aSeed;
  varying float vAlpha;
  varying float vLand;

  void main() {
    vLand = step(0.5, texture2D(uLandMap, uv).r);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;

    /* Les points s'estompent vers le bord du disque et disparaissent à l'arrière */
    vec3 normalView = normalize(normalMatrix * position);
    float facing = dot(normalView, normalize(-mv.xyz));
    float twinkle = 0.82 + 0.18 * sin(uTime * 1.2 + aSeed * 40.0);
    vAlpha = smoothstep(0.0, 0.4, facing) * twinkle;

    gl_PointSize = mix(0.45, 1.0, vLand) * uDotSize / -mv.z;
  }
`

export const dotFragment = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uCobalt;
  uniform float uGlow;
  varying float vAlpha;
  varying float vLand;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float disc = 1.0 - smoothstep(0.32, 0.5, d);
    vec3 color = mix(uCobalt * 3.2, uGold, vLand);
    float strength = mix(0.3, 0.95, vLand);
    gl_FragColor = vec4(color, disc * vAlpha * strength * uGlow);
  }
`

/* ── Corps du globe : sphère sombre qui masque l'arrière, liseré cobalt ── */
export const bodyVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

export const bodyFragment = /* glsl */ `
  uniform vec3 uNavy;
  uniform vec3 uCobalt;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.0);
    gl_FragColor = vec4(uNavy + uCobalt * rim * 0.9, 1.0);
  }
`

/* ── Atmosphère : halo autour du disque (sphère plus grande, faces arrière) ── */
export const atmosphereFragment = /* glsl */ `
  uniform vec3 uCobalt;
  uniform float uGlow;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    /* Faces arrière : facing vaut ≈ -0.5 au ras du globe et 0 au bord extérieur du halo */
    float facing = dot(vNormal, vView);
    float halo = pow(clamp(-facing / 0.5, 0.0, 1.0), 2.5);
    gl_FragColor = vec4(uCobalt * 2.4, halo * 0.32 * uGlow);
  }
`

/* ── Arc : la tête trace la parabole, la traîne s'estompe derrière elle ── */
export const arcVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const arcFragment = /* glsl */ `
  uniform float uHead;
  uniform float uTail;
  uniform float uOpacity;
  uniform vec3 uGold;
  varying vec2 vUv;

  void main() {
    float x = vUv.x;
    if (x > uHead || x < uTail) discard;
    float k = (x - uTail) / max(uHead - uTail, 0.0001);
    float body = pow(k, 1.8);
    float spark = smoothstep(0.035, 0.0, uHead - x) * (1.0 - step(0.999, uHead));
    vec3 color = uGold * (1.0 + body * 1.4 + spark * 3.0);
    gl_FragColor = vec4(color, (0.1 + 0.9 * body + spark) * uOpacity);
  }
`

/* ── Onde d'arrivée : un anneau qui s'élargit et s'efface au point d'atterrissage ── */
export const impactVertex = arcVertex

export const impactFragment = /* glsl */ `
  uniform float uProgress;
  uniform float uOpacity;
  uniform vec3 uGold;
  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float ring = smoothstep(0.12, 0.0, abs(d - uProgress));
    float core = smoothstep(0.25, 0.0, d) * (1.0 - uProgress);
    float alpha = (ring * (1.0 - uProgress) + core) * uOpacity;
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(uGold * 1.6, alpha);
  }
`

/* ── Places d'affaires : points lumineux fixes ── */
export const hubVertex = /* glsl */ `
  uniform float uSize;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vec3 normalView = normalize(normalMatrix * position);
    float facing = dot(normalView, normalize(-mv.xyz));
    vAlpha = smoothstep(0.05, 0.35, facing) * (0.75 + 0.25 * sin(uTime * 2.0 + position.x * 20.0));
    gl_PointSize = uSize / -mv.z;
  }
`

export const hubFragment = /* glsl */ `
  uniform vec3 uGold;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = pow(1.0 - smoothstep(0.0, 0.5, d), 2.0);
    gl_FragColor = vec4(uGold * 1.8, core * vAlpha);
  }
`
