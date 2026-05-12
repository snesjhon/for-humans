'use client';

import Link from 'next/link';
import type { JourneySection, Phase } from '@/lib/dsa/journey';
import './DsaPathCanvas.css';

export interface CurriculumEntry {
  section: JourneySection;
  phase: Phase;
  stepNum: number;
}

interface Props {
  curriculum: CurriculumEntry[];
  completedProblems: Set<string>;
  completedSections: Set<string>;
  totalProblems: number;
  problemTitles: Record<string, string>;
}

// 22 entries: Phase1=0-7 (8), Phase2=8-16 (9), Phase3=17-21 (5)
const LAYOUT: { row: number; x: number; alt: 'L' | 'R' }[] = [
  { row: -0.05,  x: 56, alt: 'R' },
  { row: 1.2,  x: 44, alt: 'L' },
  { row: 2.0,  x: 58, alt: 'R' },
  { row: 2.9,  x: 41, alt: 'L' },
  { row: 3.7,  x: 55, alt: 'R' },
  { row: 4.6,  x: 43, alt: 'L' },
  { row: 5.5,  x: 57, alt: 'R' },
  { row: 6.3,  x: 46, alt: 'L' },
  { row: 7.6,  x: 54, alt: 'R' },
  { row: 8.5,  x: 42, alt: 'L' },
  { row: 9.3,  x: 58, alt: 'R' },
  { row: 10.2, x: 44, alt: 'L' },
  { row: 11.1, x: 56, alt: 'R' },
  { row: 11.9, x: 41, alt: 'L' },
  { row: 12.8, x: 59, alt: 'R' },
  { row: 13.7, x: 45, alt: 'L' },
  { row: 14.6, x: 55, alt: 'R' },
  { row: 15.9, x: 57, alt: 'R' },
  { row: 16.8, x: 43, alt: 'L' },
  { row: 17.7, x: 56, alt: 'R' },
  { row: 18.6, x: 44, alt: 'L' },
  { row: 19.4, x: 55, alt: 'R' },
];

const ROW_H   = 190;
const TOP_PAD = 180;
const BOT_PAD = 200;
const VBW     = 1000;

const ROMANS = ['I', 'II', 'III'];
const PHASE_NAMES  = ['Novice', 'Studied', 'Expert'];
const PHASE_SUBS   = ['foundations', 'patterns', 'mastery'];
const PHASE_COLORS: Record<number, string> = {
  1: 'var(--ms-green)',
  2: 'var(--ms-blue)',
  3: 'var(--ms-mauve)',
};

export function DsaPathCanvas({ curriculum, completedProblems, completedSections, problemTitles }: Props) {
  const MAX_ROW = Math.max(...LAYOUT.map(l => l.row));
  const TOTAL_H = TOP_PAD + MAX_ROW * ROW_H + BOT_PAD;

  const completedSteps = new Set(
    curriculum
      .filter(e => completedSections.has(`dsa-section-${e.section.id}`))
      .map(e => e.stepNum)
  );
  const firstIncomplete = curriculum.find(e => !completedSteps.has(e.stepNum));
  const currentStep = firstIncomplete?.stepNum ?? 1;

  const nodeState = (stepNum: number) =>
    completedSteps.has(stepNum) ? 'done' : stepNum === currentStep ? 'core' : 'upcoming';

  const nodes = curriculum.map((e, i) => ({
    ...e,
    x: LAYOUT[i].x,
    y: TOP_PAD + LAYOUT[i].row * ROW_H,
    alt: LAYOUT[i].alt,
    state: nodeState(e.stepNum),
  }));

  const xPx = (pct: number) => (pct / 100) * VBW;

  const seqEdges: [number, number][] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    if (nodes[i].phase.number === nodes[i + 1].phase.number) seqEdges.push([i, i + 1]);
  }
  const bridgeEdges: [number, number][] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    if (nodes[i].phase.number !== nodes[i + 1].phase.number) bridgeEdges.push([i, i + 1]);
  }
  const chords: [number, number][] = [
    [0,2],[1,4],[3,6],[5,7],
    [8,10],[9,12],[11,13],[12,15],[14,16],
    [17,19],[18,21],[20,21],
  ];

  const pathFor = (a: typeof nodes[0], b: typeof nodes[0]) =>
    `M ${xPx(a.x)} ${a.y} L ${xPx(b.x)} ${b.y}`;

  const walked = seqEdges.filter(([, b]) => nodes[b].state === 'done' || nodes[b].state === 'core');
  const ahead  = seqEdges.filter(([, b]) => !(nodes[b].state === 'done' || nodes[b].state === 'core'));

  const phaseStarts: Record<number, number> = {};
  const phaseEnds: Record<number, number>   = {};
  nodes.forEach(n => {
    const ph = n.phase.number;
    if (phaseStarts[ph] === undefined) phaseStarts[ph] = n.y;
    phaseEnds[ph] = n.y;
  });

  const solvedCount = completedProblems.size;

  return (
    <div className="bg-[var(--ms-bg-pane)]">
      <div
        id="cpf-root"
        className="grid relative max-w-[1280px] mx-auto"
        style={{ gridTemplateColumns: '220px 1fr' }}
      >

        {/* ── Sticky sidebar ── */}
        <aside className="cpf-side sticky top-5 self-start pt-7 pb-7 pl-7 pr-4 flex flex-col gap-3.5 z-[3]">
          <div className="font-mono text-xs tracking-[0.32em] text-[var(--ms-text-faint)] mb-1">
            THE PATH
          </div>

          {[1, 2, 3].map(ph => {
            const phNodes  = nodes.filter(n => n.phase.number === ph);
            const phDone   = phNodes.filter(n => n.state === 'done').length;
            const phTotal  = phNodes.length;
            const pct      = phTotal > 0 ? (phDone / phTotal) * 100 : 0;
            const color    = PHASE_COLORS[ph];
            return (
              <a
                key={ph}
                href={`#cpf-phase-${ph}`}
                className="cpf-phase-card grid gap-3.5 pt-3.5 px-3.5 pb-3 border border-[var(--ms-surface)] rounded-xl bg-[var(--ms-bg-pane)]"
                style={{ gridTemplateColumns: 'auto 1fr' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ms-surface)'; }}
              >
                <span
                  className="font-display italic text-4xl leading-[0.9] self-center"
                  style={{ color }}
                >
                  {ROMANS[ph - 1]}
                </span>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-body text-sm font-medium text-[var(--ms-text-body)]">
                      {PHASE_NAMES[ph - 1]}
                    </span>
                    <span className="font-mono text-xs text-[var(--ms-text-faint)] tracking-[0.04em]">
                      {phDone}/{phTotal}
                    </span>
                  </div>
                  <span className="block h-1 rounded-sm bg-[var(--ms-surface0)] overflow-hidden">
                    <span
                      className="block h-full rounded-sm transition-[width] duration-300"
                      style={{ background: color, width: `${pct}%` }}
                    />
                  </span>
                </div>
              </a>
            );
          })}

          <div className="grid grid-cols-2 gap-2.5 mt-1.5 pt-3.5 border-t border-dashed border-[var(--ms-surface)]">
            <div className="flex flex-col gap-0.5 px-1">
              <b className="font-display text-2xl leading-none text-[var(--ms-text)] font-normal">
                {solvedCount}
              </b>
              <span className="font-mono text-xs tracking-[0.12em] text-[var(--ms-text-faint)]">
                solved
              </span>
            </div>
            <div className="flex flex-col gap-0.5 px-1">
              <b className="font-display text-2xl leading-none text-[var(--ms-text)] font-normal">
                {currentStep}
              </b>
              <span className="font-mono text-xs tracking-[0.12em] text-[var(--ms-text-faint)]">
                current ch.
              </span>
            </div>
          </div>
        </aside>

        {/* ── Canvas ── */}
        <div
          className="cpf-canvas relative mt-5 mr-6 mb-16 ml-0 border border-[var(--ms-surface)] rounded-2xl bg-[var(--ms-bg-pane-secondary)] overflow-hidden"
          style={{ height: TOTAL_H }}
        >
          {/* SVG edges */}
          <svg
            viewBox={`0 0 ${VBW} ${TOTAL_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <g stroke="var(--ms-surface1)" strokeWidth="0.8" fill="none" opacity="0.55">
              {chords.map(([a, b], i) => (
                <path key={i} d={pathFor(nodes[a], nodes[b])} />
              ))}
            </g>
            <g stroke="var(--ms-surface1)" strokeWidth="1" strokeDasharray="2 6" fill="none" opacity="0.7">
              {bridgeEdges.map(([a, b], i) => (
                <path key={i} d={pathFor(nodes[a], nodes[b])} />
              ))}
            </g>
            <g stroke="var(--ms-surface)" strokeWidth="1.2" fill="none">
              {ahead.map(([a, b], i) => (
                <path key={i} d={pathFor(nodes[a], nodes[b])} />
              ))}
            </g>
            <g stroke="var(--ms-peach)" strokeWidth="1.8" fill="none" opacity="0.95">
              {walked.map(([a, b], i) => (
                <path key={i} d={pathFor(nodes[a], nodes[b])} />
              ))}
            </g>
          </svg>

          {/* Phase watermarks */}
          {[1, 2, 3].map(ph => {
            const startY  = phaseStarts[ph];
            const endY    = phaseEnds[ph];
            const centerY = (startY + endY) / 2;
            const side    = ph === 2 ? 'right' : 'left';
            return (
              <div
                key={ph}
                id={`cpf-phase-${ph}`}
                className={`absolute flex items-center gap-4 pointer-events-none z-0 -translate-y-1/2 ${side === 'right' ? 'flex-row-reverse right-[4%]' : 'left-[4%]'}`}
                style={{ top: centerY }}
              >
                <span
                  className="font-display italic font-light text-[200px] leading-[0.85] opacity-10"
                  style={{ color: PHASE_COLORS[ph] }}
                >
                  {ROMANS[ph - 1]}
                </span>
                <div className="flex flex-col gap-1">
                  <span
                    className="font-mono text-xs tracking-[0.32em] opacity-50"
                    style={{ color: PHASE_COLORS[ph] }}
                  >
                    {PHASE_NAMES[ph - 1].toUpperCase()}
                  </span>
                  <span
                    className="font-display italic text-lg opacity-40"
                    style={{ color: PHASE_COLORS[ph] }}
                  >
                    {PHASE_SUBS[ph - 1]}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Phase header rules */}
          {[1, 2, 3].map(ph => (
            <div
              key={ph}
              className="absolute left-[6%] right-[6%] flex items-center gap-3 z-[1] pointer-events-none"
              style={{ top: phaseStarts[ph] - 56 }}
            >
              <span
                className="font-mono text-xs tracking-[0.32em] opacity-85 whitespace-nowrap"
                style={{ color: PHASE_COLORS[ph] }}
              >
                PHASE {ph}
              </span>
              <span className="flex-1 h-px opacity-20" style={{ background: PHASE_COLORS[ph] }} />
            </div>
          ))}

          {/* Chapter nodes */}
          {nodes.map(n => {
            const isCore = n.state === 'core';
            const isDone = n.state === 'done';
            const idLbl  = String(n.stepNum).padStart(2, '0');
            const check  = isDone ? ' ✓' : '';
            const stateLine = isCore ? 'currently studying' : isDone ? 'complete' : 'upcoming';
            const sample = n.section.firstPass.slice(0, 3);
            const moreCount = n.section.firstPass.length - sample.length;
            const fundamentalsHref = n.section.fundamentalsSlugs?.[0]
              ? `/dsa/fundamentals/${n.section.fundamentalsSlugs[0]}`
              : null;

            const dotSize = isCore ? 14 : 10;

            const labelContent = (
              <>
                {/* Step + state */}
                <span className="cpf-head">
                  <span className="cpf-num">{idLbl}</span>
                  <span className="cpf-state">{stateLine}</span>
                </span>

                {/* Title */}
                <span className={`cpf-title ${isCore ? 'text-2xl' : 'text-xl'}`}>
                  {n.section.label}{check}
                </span>

                {/* Hook */}
                <span className="cpf-hook">{n.section.mentalModelHook}</span>

                {/* CTA */}
                <span className="cpf-fund-cta">Read the fundamentals →</span>
              </>
            );

            return (
              <div
                key={n.stepNum}
                className={`cpf-node cpf-node-${n.state}`}
                style={{ left: `${n.x}%`, top: n.y }}
              >
                <span
                  className="cpf-dot"
                  style={{ width: dotSize, height: dotSize }}
                />

                <div className={`cpf-label cpf-label-${n.alt.toLowerCase()}`}>
                  {fundamentalsHref ? (
                    <Link href={fundamentalsHref} className="cpf-fund-link">
                      {labelContent}
                    </Link>
                  ) : (
                    <div className="cpf-fund-link">
                      {labelContent}
                    </div>
                  )}

                  {/* Problem chips — stacked vertically, "+N more" inline on last row */}
                  {sample.length > 0 && (
                    <div className="cpf-probs">
                      {sample.map((prob, idx) => {
                        const isLast = idx === sample.length - 1;
                        return (
                          <div key={prob.id} className="cpf-prob-row">
                            <Link
                              href={`/dsa/problems/${prob.id}`}
                              className="cpf-prob-chip"
                            >
                              <span className="cpf-prob-id">{prob.id}</span>
                              <span className="cpf-prob-title">{problemTitles[prob.id] ?? prob.id}</span>
                            </Link>
                            {isLast && moreCount > 0 && fundamentalsHref && (
                              <Link href={fundamentalsHref} className="cpf-more">+{moreCount} more</Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
