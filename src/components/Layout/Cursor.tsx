import { useEffect, useRef } from 'react';
import { useFinePointer } from '../../hooks/useMediaQuery';
import './Cursor.css';

const INTERACTIVE = 'a, button, [data-cursor], input, textarea, select, label';

/**
 * Custom two-part cursor:
 *  - a small dot that follows the pointer exactly
 *  - a ring that trails behind with easing, grows over interactive elements,
 *    and can display a label via `data-cursor-label="…"`.
 * Only enabled on devices with a precise pointer (mouse/trackpad).
 */
export function Cursor() {
  const fine = useFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fine) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!ring.classList.contains('is-visible')) {
        trail.x = target.x;
        trail.y = target.y;
        dot.classList.add('is-visible');
        ring.classList.add('is-visible');
      }

      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      const text = el?.getAttribute('data-cursor-label') ?? '';
      ring.classList.toggle('is-hover', !!el);
      ring.classList.toggle('has-label', !!text);
      dot.classList.toggle('is-hover', !!el);
      if (label.textContent !== text) label.textContent = text;
    };

    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onLeave = () => {
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    };

    const tick = () => {
      trail.x += (target.x - trail.x) * 0.18;
      trail.y += (target.y - trail.y) * 0.18;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden>
        <div className="cursor-ring__circle" />
        <span ref={labelRef} className="cursor-ring__label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
