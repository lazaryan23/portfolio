/**
 * GLSL for the hero "morphing core".
 * 3D simplex noise by Ian McEwan / Ashima Arts (MIT licence).
 */
const simplexNoise = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x  = x_ * ns.x + ns.yyyy;
  vec4 y  = y_ * ns.x + ns.yyyy;
  vec4 h  = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

/** Displaces an icosphere along its normals with layered noise, nudged by the mouse. */
export const blobVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uPulse;
varying float vDisp;
varying vec3 vNormal;
varying vec3 vViewDir;

${simplexNoise}

void main() {
  vec3 p = position;
  float energy = 1.0 + length(uMouse) * 0.6 + uPulse * 0.9;
  float n1 = snoise(p * 0.85 + vec3(uTime * 0.32, uTime * 0.18, uMouse.x * 0.8));
  float n2 = snoise(p * 2.1 - vec3(uTime * 0.22) + vec3(0.0, uMouse.y * 0.8, 0.0));
  float disp = (n1 * 0.3 + n2 * 0.07) * energy;
  vDisp = disp;

  vec4 mv = modelViewMatrix * vec4(p + normal * disp, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

/** Iridescent violet → cyan → pink shading with a fresnel rim. */
export const blobFragment = /* glsl */ `
varying float vDisp;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec3 violet = vec3(0.545, 0.361, 0.965);
  vec3 cyan   = vec3(0.133, 0.827, 0.933);
  vec3 pink   = vec3(0.957, 0.447, 0.714);
  vec3 deep   = vec3(0.035, 0.028, 0.085);

  float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 2.4);
  float t = smoothstep(-0.32, 0.32, vDisp);
  vec3 col = mix(violet, cyan, t);
  col = mix(col, pink, smoothstep(0.12, 0.38, vDisp) * 0.65);

  vec3 base = mix(deep, col, 0.18 + t * 0.22);
  base += col * fres * 1.25;
  gl_FragColor = vec4(base, 1.0);
}
`;

/** Faint additive wireframe overlay — gives the "engineering / CAD" vibe. */
export const wireFragment = /* glsl */ `
varying float vDisp;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec3 violet = vec3(0.545, 0.361, 0.965);
  vec3 cyan   = vec3(0.133, 0.827, 0.933);
  float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 1.5);
  vec3 col = mix(violet, cyan, smoothstep(-0.3, 0.3, vDisp));
  gl_FragColor = vec4(col, 0.08 + fres * 0.22);
}
`;

/** Soft round sprites for the node network and the background dust. */
export const pointVertex = /* glsl */ `
attribute float aSize;
uniform float uPixelRatio;
varying float vAlpha;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (34.0 / -mv.z);
  vAlpha = smoothstep(14.0, 5.0, -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

export const pointFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.6);
  vec3 col = mix(uColor, vec3(1.0), a * 0.55);
  gl_FragColor = vec4(col, a * vAlpha);
}
`;
