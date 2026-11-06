import { useEffect, useMemo, useRef } from 'react';

interface ChipLayout {
  name: string;
  /** Resting position in % of the container. */
  x: number;
  y: number;
  /** 0.6..1.4 — closer chips float more and react more strongly. */
  depth: number;
}

/**
 * Floating tech chips spread on a golden-angle spiral.
 * They drift idly and scatter away from the cursor like a force field.
 * Positions are written straight to the DOM inside a rAF loop — no React re-renders.
 */
export function Constellation({ items }: { items: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const layout = useMemo<ChipLayout[]>(() => {
    const n = items.length;
    return items.map((name, i) => {
      const angle = i * 2.39996; // golden angle in radians
      const radius = Math.sqrt((i + 0.6) / n);
      return {
        name,
        x: 50 + Math.cos(angle) * radius * 43,
        y: 50 + Math.sin(angle) * radius * 40,
        depth: 0.6 + ((i * 37) % 10) / 12,
      };
    });
  }, [items]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // On narrow screens the chips are laid out as a simple wrapped list via CSS.
    const narrow = window.matchMedia('(max-width: 640px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const mouse = { x: 0, y: 0, active: false };
    const offsets = layout.map(() => ({ x: 0, y: 0 }));
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (narrow.matches) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const time = reduced.matches ? 0 : t / 1000;

      layout.forEach((c, i) => {
        const el = chipRefs.current[i];
        if (!el) return;
        const bx = (c.x / 100) * w;
        const by = (c.y / 100) * h;

        // Idle floating.
        const fx = Math.sin(time * 0.6 + i) * 7 * c.depth;
        const fy = Math.cos(time * 0.5 + i * 1.3) * 9 * c.depth;

        // Repulsion from the cursor.
        let tx = 0;
        let ty = 0;
        if (mouse.active) {
          const dx = bx - mouse.x;
          const dy = by - mouse.y;
          const d = Math.hypot(dx, dy) || 1;
          const R = 170;
          if (d < R) {
            const f = (1 - d / R) ** 2 * 80 * c.depth;
            tx = (dx / d) * f;
            ty = (dy / d) * f;
          }
        }

        const o = offsets[i];
        o.x += (tx - o.x) * 0.12;
        o.y += (ty - o.y) * 0.12;
        el.style.transform = `translate(-50%, -50%) translate3d(${fx + o.x}px, ${fy + o.y}px, 0) scale(${0.85 + c.depth * 0.18})`;
      });
    };

    // Only animate while the constellation is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(wrap);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [layout]);

  return (
    <div className="constellation" ref={wrapRef}>
      {layout.map((c, i) => (
        <span
          key={c.name}
          ref={(el) => {
            chipRefs.current[i] = el;
          }}
          className="constellation__chip"
          data-cursor
          style={{ left: `${c.x}%`, top: `${c.y}%`, opacity: 0.55 + c.depth * 0.32 }}
        >
          {c.name}
        </span>
      ))}
    </div>
  );
}
