import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import * as THREE from 'three';

/** Shared, mutable interaction state read by the scene every frame (no React re-renders). */
export interface HeroInput {
  /** Raw pointer/finger position in normalised device coords (-1..1, y up). */
  target: THREE.Vector2;
  /** Smoothed version of `target` — what the scene actually uses. */
  pointer: THREE.Vector2;
  /** 0..1 — how strongly the scene should react to the pointer (0 when no finger is down). */
  engage: number;
  /** Spikes to 1 on tap/click, then decays — makes the core "breathe" on touch. */
  pulse: number;
  /** Extra Y-spin velocity (rad/s) added by dragging the core; decays with inertia. */
  spin: number;
  dragging: boolean;
  touching: boolean;
  hasMouse: boolean;
}

const clamp = THREE.MathUtils.clamp;
const SPIN_PER_PX = 0.012;
const MAX_SPIN = 7;

/**
 * Unified mouse + touch input for the hero scene.
 *
 * - Mouse / pen: `pointermove` anywhere on the page steers the scene.
 * - Touch: `touchstart` / `touchmove` / `touchend` on window, registered as *passive*
 *   so normal swipes still scroll the page while the scene follows the finger.
 * - Drag zone: an element over the 3D core (with `touch-action: pan-y`) where
 *   horizontal drags spin the core; vertical swipes there still scroll the page.
 *
 * Coordinates from `clientX/clientY` or `touches[0]` are normalised against the
 * canvas' bounding rect, so they stay correct regardless of scroll or layout.
 */
export function useHeroInput(dragZone: RefObject<HTMLElement>): MutableRefObject<HeroInput> {
  const gl = useThree((s) => s.gl);
  const input = useRef<HeroInput>({
    target: new THREE.Vector2(),
    pointer: new THREE.Vector2(),
    engage: 0,
    pulse: 0,
    spin: 0,
    dragging: false,
    touching: false,
    hasMouse: false,
  });

  useEffect(() => {
    const state = input.current;
    const canvas = gl.domElement;
    const hero = canvas.closest('.hero');
    let lastDragX = 0;

    /** clientX/Y → normalised device coordinates relative to the canvas. */
    const setTarget = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      state.target.set(
        clamp(((clientX - r.left) / r.width) * 2 - 1, -1.5, 1.5),
        clamp(-(((clientY - r.top) / r.height) * 2 - 1), -1.5, 1.5),
      );
    };

    const addSpin = (clientX: number) => {
      state.spin = clamp(state.spin + (clientX - lastDragX) * SPIN_PER_PX, -MAX_SPIN, MAX_SPIN);
      lastDragX = clientX;
    };

    const inHero = (t: EventTarget | null) => !!hero && t instanceof Node && hero.contains(t);
    const inDragZone = (t: EventTarget | null) => !!dragZone.current && t instanceof Node && dragZone.current.contains(t);

    /* ── Mouse & pen (touch is handled by the dedicated touch listeners below) ── */
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      state.hasMouse = true;
      setTarget(e.clientX, e.clientY);
      if (state.dragging) addSpin(e.clientX);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (inHero(e.target)) state.pulse = 1;
      if (inDragZone(e.target)) {
        state.dragging = true;
        lastDragX = e.clientX;
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      state.dragging = false;
    };

    /* ── Touch ── */
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      state.touching = true;
      setTarget(t.clientX, t.clientY);
      // Jump straight to the finger so the reaction feels immediate.
      state.pointer.copy(state.target);
      if (inHero(e.target)) state.pulse = 1;
      if (inDragZone(e.target)) {
        state.dragging = true;
        lastDragX = t.clientX;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      setTarget(t.clientX, t.clientY);
      if (state.dragging) addSpin(t.clientX);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length > 0) return;
      state.touching = false;
      state.dragging = false;
      // Let the core relax back to its resting pose.
      state.target.set(0, 0);
    };

    // Every listener is passive and nothing calls preventDefault: page scrolling is never blocked.
    // The drag zone's `touch-action: pan-y` lets the browser scroll vertically while
    // horizontal finger movement reaches these handlers and spins the core.
    const passive = { passive: true } as const;
    window.addEventListener('pointermove', onPointerMove, passive);
    window.addEventListener('pointerdown', onPointerDown, passive);
    window.addEventListener('pointerup', onPointerUp, passive);
    window.addEventListener('pointercancel', onPointerUp, passive);
    window.addEventListener('touchstart', onTouchStart, passive);
    window.addEventListener('touchmove', onTouchMove, passive);
    window.addEventListener('touchend', onTouchEnd, passive);
    window.addEventListener('touchcancel', onTouchEnd, passive);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [gl, dragZone]);

  useFrame((_, delta) => {
    const s = input.current;
    const dt = Math.min(delta, 0.05);
    // Fingers get a snappier follow than the mouse.
    s.pointer.lerp(s.target, s.touching ? 0.18 : 0.06);
    const engageTarget = s.touching || s.hasMouse ? 1 : 0;
    s.engage += (engageTarget - s.engage) * (engageTarget ? 0.2 : 0.05);
    s.pulse *= Math.exp(-dt * 2.5);
    if (!s.dragging) s.spin *= Math.exp(-dt * 1.6);
  });

  return input;
}
