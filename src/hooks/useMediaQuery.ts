import { useEffect, useState } from 'react';

/** Subscribes to a CSS media query and returns whether it currently matches. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/** True when the user asked the OS to minimise animations. */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** True for mouse/trackpad devices — custom cursor & hover effects only make sense here. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
