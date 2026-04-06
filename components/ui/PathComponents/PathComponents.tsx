'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { pColor } from '../pathUtils';
import styles from './PathComponents.module.css';

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
    <div
      className="relative overflow-hidden pt-[56px] pb-10 [--accent:var(--ms-blue)]"
      style={{ '--accent': color } as React.CSSProperties}
    >
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none italic font-normal text-[13rem] leading-none tracking-[-0.05em] text-[var(--ms-surface)] [font-family:var(--font-display)]"
      >
        {chapterLabel}
      </div>

      <div className="inline-flex items-center gap-2 mb-[14px]">
        <span className="text-base leading-none">{phase.emoji}</span>
        <span className="font-mono text-[0.68rem] font-bold tracking-[0.12em] uppercase text-[var(--accent)]">
          Phase {phase.number}
        </span>
      </div>

      <h3 className="mb-[14px] text-[2.75rem] leading-[1.05] tracking-[-0.03em] text-[var(--ms-text-body)] italic font-normal [font-family:var(--font-display)]">
        {phase.label}
      </h3>

      <div className="mb-[14px] h-[3px] w-10 rounded-[2px] bg-[var(--accent)]" />

      <p className="text-[0.9375rem] leading-[1.65] m-0 max-w-[560px] text-[var(--ms-text-subtle)]">
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
      className="flex h-full flex-col box-border rounded-[0.875rem] border bg-transparent px-[22px] py-5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] backdrop-blur-[12px] [--accent:var(--ms-blue)] border-[var(--accent)]"
      style={{ '--accent': color } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 mb-[14px]">
        <span className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--ms-text-faint)]">
          Step {stepNum}
        </span>
        <span className="inline-block h-[9px] w-px bg-[var(--accent)]" />
        <span className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--accent)]">
          📖 Mental Model
        </span>
      </div>
      <div className="font-extrabold text-[1.25rem] leading-[1.2] tracking-[-0.02em] mb-3 text-[var(--ms-text-body)]">
        {label}
      </div>
      <p className="mb-5 flex-1 text-[0.9375rem] leading-[1.65] text-[var(--ms-text-subtle)] italic [font-family:var(--font-display)]">
        {hook}
      </p>
      <Link
        href={href}
        className={`${styles.guideButton} inline-block self-start rounded-[6px] bg-[var(--accent)] px-4 py-[7px] text-[0.8rem] font-semibold tracking-[0.01em] text-white no-underline`}
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
    <div className="flex h-full flex-col box-border rounded-[0.875rem] border border-dashed border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-[22px] py-5">
      <div className="flex items-center gap-2 mb-[14px]">
        <span className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--ms-text-faint)]">
          Step {stepNum}
        </span>
        <span className="w-px h-[9px] inline-block bg-[var(--ms-surface)]" />
        <span className="font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--ms-text-faint)]">
          📖 Mental Model
        </span>
      </div>
      <div className="font-extrabold text-[1.1875rem] leading-[1.2] tracking-[-0.02em] mb-3 text-[var(--ms-text-muted)]">
        {label}
      </div>
      <p className="mb-5 flex-1 text-[0.9rem] leading-[1.65] text-[var(--ms-text-faint)] italic [font-family:var(--font-display)]">
        {hook}
      </p>
      <div className="self-start py-[7px] px-4 rounded-[6px] text-[0.8rem] font-semibold select-none bg-[var(--ms-bg-pane-tertiary)] border border-[var(--ms-surface)] text-[var(--ms-text-faint)]">
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
      <p className="text-sm font-semibold mb-4 text-[var(--ms-text-body)]">Phases</p>
      <div className="space-y-0.5">
        {phases.map((phase) => {
          const color = pColor(phase.number);
          const isActive = activePhase === phase.number;
          return (
            <a
              key={phase.number}
              href={`#phase-zone-${phase.number}`}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors no-underline [--accent:var(--ms-blue)] ${
                isActive
                  ? 'bg-[var(--ms-bg-pane-secondary)] font-semibold text-[var(--accent)]'
                  : 'text-[var(--ms-text-subtle)]'
              }`}
              style={{ '--accent': color } as React.CSSProperties}
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
