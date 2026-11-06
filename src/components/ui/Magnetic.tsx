import { useRef, type PropsWithChildren, type PointerEvent } from 'react';

interface MagneticProps {
  /** 0..1 — how strongly the element follows the cursor. */
  strength?: number;
  className?: string;
}

/**
 * Wraps an element so it is gently "pulled" towards the cursor while hovered,
 * then springs back (via a CSS transition) when the cursor leaves.
 */
export function Magnetic({ children, strength = 0.3, className = '' }: PropsWithChildren<MagneticProps>) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <span ref={ref} className={`magnetic ${className}`} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </span>
  );
}
