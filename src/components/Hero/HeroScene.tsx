import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { blobFragment, blobVertex, pointFragment, pointVertex, wireFragment } from './shaders';

type Vec2Ref = MutableRefObject<THREE.Vector2>;

/**
 * Hero background: a noise-displaced "morphing core" surrounded by a
 * living node network — a nod to the node-based design engines I build.
 * Everything reacts to the mouse.
 *
 * Loaded lazily (see Hero.tsx) so Three.js never blocks the first paint.
 */
export default function HeroScene({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      // Pause rendering entirely when the hero is scrolled out of view.
      frameloop={active ? 'always' : 'never'}
      // The scene is purely decorative: never let it capture touches/scroll gestures.
      style={{ pointerEvents: 'none', touchAction: 'pan-y' }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Scene speed={reduced ? 0.25 : 1} />
    </Canvas>
  );
}

/** Tracks the pointer relative to the canvas (normalised to -1..1) and smooths it. */
function useSmoothedPointer(): Vec2Ref {
  const gl = useThree((s) => s.gl);
  const target = useRef(new THREE.Vector2());
  const smooth = useRef(new THREE.Vector2());

  useEffect(() => {
    // The canvas sits *behind* the hero copy, so listen on window instead of the canvas.
    const onMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      target.current.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [gl]);

  useFrame(() => {
    smooth.current.lerp(target.current, 0.06);
  });

  return smooth;
}

function Scene({ speed }: { speed: number }) {
  const { size, viewport } = useThree();
  const pointer = useSmoothedPointer();
  const parallax = useRef<THREE.Group>(null);

  // On wide screens the core floats to the right of the copy; on smaller screens
  // it shrinks into the top-right corner so it never fights with the text.
  const isWide = size.width >= 960;
  const offsetX = isWide ? viewport.width * 0.2 : viewport.width * 0.22;
  const offsetY = isWide ? 0 : viewport.height * 0.3;
  const scale = isWide ? 1 : size.width < 600 ? 0.5 : 0.65;

  useFrame(() => {
    const g = parallax.current;
    if (!g) return;
    // Gentle parallax tilt towards the cursor.
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.current.x * 0.45, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.3, 0.05);
  });

  return (
    <>
      <Dust speed={speed} />
      <group position={[offsetX, offsetY, 0]} scale={scale}>
        <group ref={parallax}>
          <MorphingCore pointer={pointer} speed={speed} />
          <NodeNetwork pointer={pointer} speed={speed} />
        </group>
      </group>
    </>
  );
}

/* ────────────────────────── Morphing core ────────────────────────── */

function MorphingCore({ pointer, speed }: { pointer: Vec2Ref; speed: number }) {
  const spin = useRef<THREE.Group>(null);

  const { geometry, solid, wire, uniforms } = useMemo(() => {
    // Both materials share one uniforms object so they stay in sync.
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
    };
    return {
      uniforms,
      geometry: new THREE.IcosahedronGeometry(1.45, 36),
      solid: new THREE.ShaderMaterial({
        vertexShader: blobVertex,
        fragmentShader: blobFragment,
        uniforms,
      }),
      wire: new THREE.ShaderMaterial({
        vertexShader: blobVertex,
        fragmentShader: wireFragment,
        uniforms,
        wireframe: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      solid.dispose();
      wire.dispose();
    },
    [geometry, solid, wire],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05) * speed;
    uniforms.uTime.value += dt;
    uniforms.uMouse.value.copy(pointer.current);
    if (spin.current) {
      spin.current.rotation.y += dt * 0.12;
      spin.current.rotation.z += dt * 0.04;
    }
  });

  return (
    <group ref={spin}>
      <mesh geometry={geometry} material={solid} />
      <mesh geometry={geometry} material={wire} scale={1.015} />
    </group>
  );
}

/* ────────────────────────── Node network ────────────────────────── */

const NODE_COUNT = 70;
const LINK_DISTANCE = 1.45;
const CURSOR_RADIUS = 1.5;
const SHELL_MIN = 2.1;
const SHELL_MAX = 3.9;

/**
 * Points drifting in a spherical shell. Nearby nodes link up with fading lines,
 * and nodes close to the cursor ray are pushed away and wired to the cursor.
 */
function NodeNetwork({ pointer, speed }: { pointer: Vec2Ref; speed: number }) {
  const group = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  const sim = useMemo(() => {
    const positions = new Float32Array(NODE_COUNT * 3);
    const velocities = new Float32Array(NODE_COUNT * 3);
    const sizes = new Float32Array(NODE_COUNT);
    const v = new THREE.Vector3();
    for (let i = 0; i < NODE_COUNT; i++) {
      v.randomDirection().multiplyScalar(THREE.MathUtils.randFloat(SHELL_MIN, SHELL_MAX));
      v.toArray(positions, i * 3);
      new THREE.Vector3().randomDirection().multiplyScalar(0.12).toArray(velocities, i * 3);
      sizes[i] = THREE.MathUtils.randFloat(0.7, 1.8);
    }
    return { positions, velocities, sizes };
  }, []);

  const pointsGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(sim.positions, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSize', new THREE.BufferAttribute(sim.sizes, 1));
    return g;
  }, [sim]);

  const pointsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        uniforms: {
          uPixelRatio: { value: gl.getPixelRatio() },
          uColor: { value: new THREE.Color('#67e8f9') },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [gl],
  );

  // Pre-allocate room for every possible node pair plus one cursor link per node.
  const maxSegments = (NODE_COUNT * (NODE_COUNT - 1)) / 2 + NODE_COUNT;
  const linesGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(maxSegments * 6), 3).setUsage(THREE.DynamicDrawUsage),
    );
    g.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(maxSegments * 6), 3).setUsage(THREE.DynamicDrawUsage),
    );
    g.setDrawRange(0, 0);
    return g;
  }, [maxSegments]);

  const linesMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(
    () => () => {
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
    },
    [pointsGeometry, pointsMaterial, linesGeometry, linesMaterial],
  );

  // Scratch objects reused every frame to avoid garbage-collection hiccups.
  const scratch = useMemo(
    () => ({
      raycaster: new THREE.Raycaster(),
      origin: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      tmp: new THREE.Vector3(),
      linkColor: new THREE.Color('#8b5cf6'),
      cursorColor: new THREE.Color('#22d3ee'),
    }),
    [],
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05) * speed;
    const { positions: pos, velocities: vel } = sim;
    const { raycaster, origin, dir, tmp, linkColor, cursorColor } = scratch;

    g.rotation.y += dt * 0.05;
    g.updateMatrixWorld();

    // Cursor ray expressed in the network's local space.
    raycaster.setFromCamera(pointer.current, camera);
    origin.copy(raycaster.ray.origin);
    tmp.copy(origin).add(raycaster.ray.direction);
    g.worldToLocal(origin);
    g.worldToLocal(tmp);
    dir.copy(tmp).sub(origin).normalize();

    const linePos = linesGeometry.attributes.position.array as Float32Array;
    const lineCol = linesGeometry.attributes.color.array as Float32Array;
    let seg = 0;

    const pushSegment = (
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
      color: THREE.Color, alpha: number,
    ) => {
      const o = seg * 6;
      linePos[o] = ax; linePos[o + 1] = ay; linePos[o + 2] = az;
      linePos[o + 3] = bx; linePos[o + 4] = by; linePos[o + 5] = bz;
      // With additive blending a darker colour reads as more transparent.
      for (let k = 0; k < 2; k++) {
        lineCol[o + k * 3] = color.r * alpha;
        lineCol[o + k * 3 + 1] = color.g * alpha;
        lineCol[o + k * 3 + 2] = color.b * alpha;
      }
      seg++;
    };

    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = i * 3;
      let x = pos[ix], y = pos[ix + 1], z = pos[ix + 2];

      // Keep nodes inside the shell with a soft radial spring.
      const r = Math.hypot(x, y, z) || 1;
      const radial = r > SHELL_MAX ? -0.25 : r < SHELL_MIN ? 0.25 : 0;
      vel[ix] += (x / r) * radial * dt;
      vel[ix + 1] += (y / r) * radial * dt;
      vel[ix + 2] += (z / r) * radial * dt;

      // Closest point on the cursor ray to this node.
      const along = (x - origin.x) * dir.x + (y - origin.y) * dir.y + (z - origin.z) * dir.z;
      const cx = origin.x + dir.x * along, cy = origin.y + dir.y * along, cz = origin.z + dir.z * along;
      const dx = x - cx, dy = y - cy, dz = z - cz;
      const d = Math.hypot(dx, dy, dz);

      if (d < CURSOR_RADIUS && d > 0.0001) {
        const f = (1 - d / CURSOR_RADIUS) * 2.2 * dt;
        vel[ix] += (dx / d) * f;
        vel[ix + 1] += (dy / d) * f;
        vel[ix + 2] += (dz / d) * f;
        pushSegment(x, y, z, cx, cy, cz, cursorColor, (1 - d / CURSOR_RADIUS) * 0.55);
      }

      // Damping keeps the motion calm.
      vel[ix] *= 0.985;
      vel[ix + 1] *= 0.985;
      vel[ix + 2] *= 0.985;

      x += vel[ix] * dt;
      y += vel[ix + 1] * dt;
      z += vel[ix + 2] * dt;
      pos[ix] = x; pos[ix + 1] = y; pos[ix + 2] = z;
    }

    // Link nearby nodes.
    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = i * 3;
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const jx = j * 3;
        const d = Math.hypot(pos[ix] - pos[jx], pos[ix + 1] - pos[jx + 1], pos[ix + 2] - pos[jx + 2]);
        if (d < LINK_DISTANCE) {
          pushSegment(
            pos[ix], pos[ix + 1], pos[ix + 2],
            pos[jx], pos[jx + 1], pos[jx + 2],
            linkColor, (1 - d / LINK_DISTANCE) * 0.6,
          );
        }
      }
    }

    linesGeometry.setDrawRange(0, seg * 2);
    linesGeometry.attributes.position.needsUpdate = true;
    linesGeometry.attributes.color.needsUpdate = true;
    pointsGeometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={linesGeometry} material={linesMaterial} frustumCulled={false} />
      <points geometry={pointsGeometry} material={pointsMaterial} frustumCulled={false} />
    </group>
  );
}

/* ────────────────────────── Background dust ────────────────────────── */

/** A sparse, slowly rotating star field that adds depth behind everything. */
function Dust({ speed }: { speed: number }) {
  const ref = useRef<THREE.Points>(null);
  const gl = useThree((s) => s.gl);

  const { geometry, material } = useMemo(() => {
    const count = 380;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = THREE.MathUtils.randFloatSpread(26);
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(16);
      positions[i * 3 + 2] = THREE.MathUtils.randFloat(-10, 2);
      sizes[i] = THREE.MathUtils.randFloat(0.25, 0.8);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    const material = new THREE.ShaderMaterial({
      vertexShader: pointVertex,
      fragmentShader: pointFragment,
      uniforms: {
        uPixelRatio: { value: gl.getPixelRatio() },
        uColor: { value: new THREE.Color('#a78bfa') },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry, material };
  }, [gl]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * 0.015 * speed;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}
