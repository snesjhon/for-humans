'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { pColor } from '../pathUtils';

// Minimal phase shape needed by path components
export interface PathPhase {
  number: number;
  label: string;
  emoji: string;
  goal: string;
}

// ── Phase banner ─────────────────────────────────────────────────────────────

export function PhaseBannerContent({
  phase,
  color,
  chapterLabel,
}: {
  phase: PathPhase;
  color: string;
  chapterLabel: string;
}) {
  return (
    <div className="relative overflow-hidden pt-[56px] pb-10">
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 italic font-normal text-[13rem] leading-none tracking-[-0.05em] select-none pointer-events-none"
        style={{
          fontFamily: 'var(--font-display, inherit)',
          color: `color-mix(in srgb, ${color} 12%, transparent)`,
        }}
      >
        {chapterLabel}
      </div>

      <div className="inline-flex items-center gap-2 mb-[14px]">
        <span className="text-base leading-none">{phase.emoji}</span>
        <span
          className="font-mono text-[0.68rem] font-bold tracking-[0.12em] uppercase"
          style={{ color }}
        >
          Phase {phase.number}
        </span>
      </div>

      <h3
        className="italic font-normal text-[2.75rem] leading-[1.05] tracking-[-0.03em] mb-[14px] text-[var(--fg)]"
        style={{ fontFamily: 'var(--font-display, inherit)' }}
      >
        {phase.label}
      </h3>

      <div
        className="w-10 h-[3px] rounded-[2px] mb-[14px]"
        style={{ background: color }}
      />

      <p className="text-[0.9375rem] leading-[1.65] m-0 max-w-[560px] text-[var(--fg-comment)]">
        {phase.goal}
      </p>
    </div>
  );
}

// ── Step guide card ───────────────────────────────────────────────────────────

export function StepGuideCard({
  href,
  label,
  hook,
  stepNum,
  color,
}: {
  href: string;
  label: string;
  hook: string;
  stepNum: string;
  color: string;
}) {
  return (
    <div
      className="flex flex-col h-full box-border bg-transparent backdrop-blur-[12px] rounded-[0.875rem] py-5 px-[22px]"
      style={{
        border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`,
        boxShadow: `0 4px 24px color-mix(in srgb, ${color} 10%, transparent), 0 1px 4px rgba(0,0,0,0.08)`,
      }}
    >
      <div className="flex items-center gap-2 mb-[14px]">
        <span className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--fg-gutter)]">
          Step {stepNum}
        </span>
        <span
          className="w-px h-[9px] inline-block"
          style={{
            background: `color-mix(in srgb, ${color} 35%, transparent)`,
          }}
        />
        <span
          className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase"
          style={{ color }}
        >
          📖 Mental Model
        </span>
      </div>
      <div className="font-extrabold text-[1.25rem] leading-[1.2] tracking-[-0.02em] mb-3 text-[var(--fg)]">
        {label}
      </div>
      <p
        className="italic text-[0.9375rem] leading-[1.65] text-[var(--fg-comment)] mb-5 flex-1"
        style={{ fontFamily: 'var(--font-display, inherit)' }}
      >
        {hook}
      </p>
      <Link
        href={href}
        className="guide-btn self-start py-[7px] px-4 rounded-[6px] text-white text-[0.8rem] font-semibold tracking-[0.01em] no-underline inline-block"
        style={{ background: color }}
      >
        Read the guide →
      </Link>
    </div>
  );
}

// ── Placeholder guide card ────────────────────────────────────────────────────

export function PlaceholderGuideCard({
  label,
  hook,
  stepNum,
}: {
  label: string;
  hook: string;
  stepNum: string;
}) {
  return (
    <div
      className="flex flex-col h-full box-border border border-dashed border-[var(--border)] rounded-[0.875rem] py-5 px-[22px]"
      style={{ background: 'color-mix(in srgb, var(--bg) 60%, var(--bg-alt))' }}
    >
      <div className="flex items-center gap-2 mb-[14px]">
        <span className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--fg-gutter)]">
          Step {stepNum}
        </span>
        <span className="w-px h-[9px] inline-block bg-[var(--border)]" />
        <span className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--fg-gutter)]">
          📖 Mental Model
        </span>
      </div>
      <div className="font-extrabold text-[1.1875rem] leading-[1.2] tracking-[-0.02em] mb-3 text-[var(--fg-alt)]">
        {label}
      </div>
      <p
        className="italic text-[0.9rem] leading-[1.65] text-[var(--fg-gutter)] mb-5 flex-1"
        style={{ fontFamily: 'var(--font-display, inherit)' }}
      >
        {hook}
      </p>
      <div className="self-start py-[7px] px-4 rounded-[6px] text-[0.8rem] font-semibold select-none bg-[var(--bg-highlight)] border border-[var(--border)] text-[var(--fg-gutter)]">
        Coming soon
      </div>
    </div>
  );
}

// ── Path TOC ──────────────────────────────────────────────────────────────────

export function PathTOC({ phases }: { phases: PathPhase[] }) {
  const [activePhase, setActivePhase] = useState(1);

  useEffect(() => {
    const zones = phases
      .map((p) => ({
        el: document.getElementById(`phase-zone-${p.number}`),
        num: p.number,
      }))
      .filter((z): z is { el: HTMLElement; num: number } => z.el !== null);

    const onScroll = () => {
      const y = window.scrollY + 120;
      let active = phases[0]?.number ?? 1;
      for (const { el, num } of zones) {
        if (y >= el.offsetTop) active = num;
      }
      setActivePhase(active);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [phases]);

  return (
    <nav>
      <p className="text-sm font-semibold mb-4 text-[var(--fg)]">Phases</p>
      <div className="space-y-0.5">
        {phases.map((phase) => {
          const color = pColor(phase.number);
          const isActive = activePhase === phase.number;
          return (
            <a
              key={phase.number}
              href={`#phase-zone-${phase.number}`}
              className="flex items-center gap-2 text-sm py-1.5 px-2 rounded-md transition-colors no-underline"
              style={{
                color: isActive ? color : 'var(--fg-comment)',
                background: isActive
                  ? `color-mix(in srgb, ${color} 10%, transparent)`
                  : 'transparent',
                fontWeight: isActive ? '600' : '400',
              }}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(`phase-zone-${phase.number}`)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActivePhase(phase.number);
              }}
            >
              <span className="text-base leading-none">{phase.emoji}</span>
              <span>{phase.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
