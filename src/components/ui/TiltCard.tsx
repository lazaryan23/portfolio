import { useRef, type HTMLAttributes, type PointerEvent } from 'react';

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum tilt in degrees. */
  max?: number;
}

/**
 * A card that tilts in 3D towards the cursor and renders a soft spotlight
 * where the cursor is. All visuals are driven by CSS custom properties
 * (--rx, --ry, --px, --py) so React never re-renders on mouse move.
 */
export function TiltCard({ max = 7, className = '', children, ...rest }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--px', `${px * 100}%`);
    el.style.setProperty('--py', `${py * 100}%`);
    el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty('--rx', `${-(py - 0.5) * max * 2}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={ref} className={`tilt-card ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      <div className="tilt-card__spotlight" aria-hidden />
      {children}
    </div>
  );
}
