'use client';

import { useEffect } from 'react';

// Must match PHASE_COLORS order in page.tsx
const PHASE_COLORS = [
  'var(--purple)',
  'var(--blue)',
  'var(--green)',
  'var(--orange)',
  'var(--cyan)',
];

export function PhaseTracker({ phaseCount }: { phaseCount: number }) {
  useEffect(() => {
    const entries = Array.from({ length: phaseCount }, (_, i) => ({
      el: document.getElementById(`phase-zone-${i + 1}`),
      color: PHASE_COLORS[i % PHASE_COLORS.length],
    })).filter((e): e is { el: HTMLElement; color: string } => e.el !== null);

    const set = (color: string) =>
      document.documentElement.style.setProperty('--active-phase-color', color);

    const onScroll = () => {
      // Find the last phase whose top has crossed the activation line
      // (header height + small buffer so the phase feels "locked in")
      const activationY = window.scrollY + 90;

      let active: string | null = null;
      for (const { el, color } of entries) {
        if (activationY >= el.offsetTop) active = color;
      }

      // No phase reached yet — still in hero/how-it-works zone, default to purple
      set(active ?? PHASE_COLORS[0]);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set correct color on mount (e.g. after navigation)

    return () => window.removeEventListener('scroll', onScroll);
  }, [phaseCount]);

  return null;
}

export function PhaseColorSync({ color }: { color: string }) {
  useEffect(() => {
    document.documentElement.style.setProperty('--active-phase-color', color);
    return () => {
      document.documentElement.style.removeProperty('--active-phase-color');
    };
  }, [color]);

  return null;
}
