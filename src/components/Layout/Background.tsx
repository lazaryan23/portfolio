import { useEffect, useRef } from 'react';

/**
 * Fixed decorative layer behind the whole page:
 *  - a faint engineering grid
 *  - a soft spotlight that follows the cursor (driven by CSS variables)
 *  - a film-grain noise overlay
 */
export function Background() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${e.clientX}px`);
        el.style.setProperty('--my', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={ref} className="page-bg" aria-hidden>
      <div className="page-bg__grid" />
      <div className="page-bg__spotlight" />
      <div className="page-bg__noise" />
    </div>
  );
}
