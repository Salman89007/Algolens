import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 0.9, smoothWheel: true, touchMultiplier: 1 });
    let frame = 0;
    const tick = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
