import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pathname.startsWith('/visualize') || isTouch || reduced) return;

    const lenis = new Lenis({ duration: 0.9, smoothWheel: true });
    let frame = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}