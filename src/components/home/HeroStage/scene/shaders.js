/* ============================================
   Shaders GLSL de la scène du hero.
   Couleurs injectées en uniforms depuis la charte (navy, cobalt, or).
   ============================================ */

/* ── Liaisons : se tracent d'un nœud à l'autre, parcourues par des impulsions dorées ── */
export const edgeVertex = /* glsl */ `
  attribute float aT;
  attribute float aReveal;
  attribute float aSeed;
  varying float vT;
  varying float vReveal;
  varying float vSeed;
  varying float vDepth;

  void main() {
    vT = aT;
    vReveal = aReveal;
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

export const edgeFragment = /* glsl */ `
  uniform float uBuild;
  uniform float uTime;
  uniform float uGlow;
  uniform vec3 uCobalt;
  uniform vec3 uGold;
  varying float vT;
  varying float vReveal;
  varying float vSeed;
  varying float vDepth;

  void main() {
    float grow = clamp((uBuild - vReveal) / 0.07, 0.0, 1.0);
    if (vT > grow) discard;

    float pulsePos = fract(uTime * (0.12 + vSeed * 0.1) + vSeed);
    float pulse = smoothstep(0.1, 0.0, abs(vT - pulsePos)) * step(0.55, vSeed);
    float head = smoothstep(0.12, 0.0, abs(vT - grow)) * (1.0 - step(0.999, grow));
    float near = smoothstep(2.0, 5.0, vDepth);
    float far = smoothstep(70.0, 14.0, vDepth);

    vec3 color = mix(uCobalt * 2.2, uGold, clamp(0.18 + pulse + head, 0.0, 1.0));
    float alpha = (0.18 + 0.6 * pulse + 0.6 * head) * near * far * uGlow;
    gl_FragColor = vec4(color * (1.0 + pulse * 1.5 + head), alpha);
  }
`

/* ── Nœuds : poussière diffuse au départ, puis points dorés qui scintillent ── */
export const nodeVertex = /* glsl */ `
  attribute float aReveal;
  attribute float aSeed;
  attribute float aSize;
  uniform float uBuild;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vLit;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;

    float lit = smoothstep(aReveal - 0.04, aReveal + 0.02, uBuild);
    float twinkle = 0.78 + 0.22 * sin(uTime * 1.6 + aSeed * 40.0);
    vLit = lit;
    vAlpha = mix(0.12, 1.0, lit) * twinkle * smoothstep(1.5, 4.0, -mv.z);
    gl_PointSize = aSize * mix(0.55, 1.0, lit) * uPixelRatio * (34.0 / -mv.z);
  }
`

export const nodeFragment = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uMist;
  uniform float uGlow;
  varying float vAlpha;
  varying float vLit;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = pow(smoothstep(0.5, 0.0, d), 2.4);
    vec3 color = mix(uMist, uGold * 1.5, vLit);
    gl_FragColor = vec4(color, core * vAlpha * uGlow);
  }
`

/* ── Poussière dorée : dérive lente vers le haut ── */
export const dustVertex = /* glsl */ `
  attribute float aSpeed;
  attribute float aSeed;
  attribute float aSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * aSpeed + 20.0, 40.0) - 20.0;
    p.x += sin(uTime * 0.25 + aSeed * 6.2831) * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = (0.35 + 0.65 * fract(aSeed * 13.7)) * smoothstep(1.0, 6.0, -mv.z) * smoothstep(75.0, 25.0, -mv.z);
    gl_PointSize = aSize * uPixelRatio * (22.0 / -mv.z);
  }
`

export const dustFragment = /* glsl */ `
  uniform vec3 uGold;
  uniform float uGlow;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = pow(smoothstep(0.5, 0.0, d), 1.8);
    gl_FragColor = vec4(uGold * 1.2, core * vAlpha * 0.45 * uGlow);
  }
`

/* ── Cercle de confiance : un anneau d'or qui se trace ── */
export const ringVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const ringFragment = /* glsl */ `
  uniform float uDraw;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uGold;
  varying vec2 vUv;

  void main() {
    if (vUv.x > uDraw) discard;
    float head = smoothstep(0.035, 0.0, uDraw - vUv.x) * (1.0 - step(0.999, uDraw));
    float shimmer = 0.75 + 0.25 * sin(vUv.x * 60.0 - uTime * 1.5);
    gl_FragColor = vec4(uGold * (1.2 + head * 2.5), (0.55 * shimmer + head) * uOpacity);
  }
`

/* ── Verre : facettes à effet Fresnel (bords lumineux, cœur transparent) ── */
export const glassVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vHeight;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vHeight = position.y;
    gl_Position = projectionMatrix * mv;
  }
`

export const glassFragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  uniform vec3 uCobalt;
  uniform vec3 uGold;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vHeight;

  void main() {
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float fresnel = pow(1.0 - facing, 2.2);
    float sheen = smoothstep(0.6, 1.0, sin(vHeight * 1.4 + uTime * 0.6) * 0.5 + 0.5) * 0.25;
    vec3 color = mix(uCobalt * 1.5, uGold, fresnel + sheen);
    float alpha = (0.05 + fresnel * 0.42 + sheen * 0.22) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`
