'use client';

import Link from 'next/link';
import './PathCanvas.css';

export interface CanvasChip {
  href: string;
  label: string;
  id?: string;
}

export interface CanvasSection {
  id: string;
  sectionKey: string;
  label: string;
  mentalModelHook: string;
  fundamentalsHref: string | null;
  chips: CanvasChip[];
}

export interface CanvasPhase {
  number: number;
  label: string;
  sub?: string;
}

export interface CurriculumEntry {
  section: CanvasSection;
  phase: CanvasPhase;
  stepNum: number;
}

interface Props {
  curriculum: CurriculumEntry[];
  completedSections: Set<string>;
  solvedCount: number;
}

const ROMANS = ['I', 'II', 'III', 'IV', 'V'];
const PHASE_COLORS: Record<number, string> = {
  1: 'var(--ms-green)',
  2: 'var(--ms-blue)',
  3: 'var(--ms-mauve)',
  4: 'var(--ms-peach)',
  5: 'var(--ms-red)',
};

const ROW_H   = 190;
const TOP_PAD = 180;
const BOT_PAD = 200;
const VBW     = 1000;

function generateLayout(
  curriculum: CurriculumEntry[],
): { row: number; x: number; alt: 'L' | 'R' }[] {
  const layout: { row: number; x: number; alt: 'L' | 'R' }[] = [];
  let row = -0.05;
  for (let i = 0; i < curriculum.length; i++) {
    const alt: 'L' | 'R' = i % 2 === 0 ? 'R' : 'L';
    const baseX = alt === 'R' ? 56 : 43;
    const variation = ((i * 7 + 3) % 9) - 4;
    const x = Math.max(39, Math.min(62, baseX + variation));
    layout.push({ row, x, alt });
    const next = curriculum[i + 1];
    const isPhaseEnd = next != null && next.phase.number !== curriculum[i].phase.number;
    row += isPhaseEnd ? 1.3 : 0.9;
  }
  return layout;
}

function generateChords(
  nodes: Array<{ phase: { number: number } }>,
): [number, number][] {
  const chords: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    const j = i + 2;
    if (j < nodes.length && nodes[j].phase.number === nodes[i].phase.number) {
      chords.push([i, j]);
    }
  }
  return chords;
}

export function PathCanvas({ curriculum, completedSections, solvedCount }: Props) {
  const layout = generateLayout(curriculum);
  const MAX_ROW = Math.max(...layout.map(l => l.row));
  const TOTAL_H = TOP_PAD + MAX_ROW * ROW_H + BOT_PAD;

  const completedSteps = new Set(
    curriculum
      .filter(e => completedSections.has(e.section.sectionKey))
      .map(e => e.stepNum),
  );
  const firstIncomplete = curriculum.find(e => !completedSteps.has(e.stepNum));
  const currentStep = firstIncomplete?.stepNum ?? 1;

  const nodeState = (stepNum: number) =>
    completedSteps.has(stepNum) ? 'done' : stepNum === currentStep ? 'core' : 'upcoming';

  const nodes = curriculum.map((e, i) => ({
    ...e,
    x: layout[i].x,
    y: TOP_PAD + layout[i].row * ROW_H,
    alt: layout[i].alt,
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
  const chords = generateChords(nodes);

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

  const phases = Array.from(
    new Map(curriculum.map(e => [e.phase.number, e.phase])).values(),
  ).sort((a, b) => a.number - b.number);

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

          {phases.map(ph => {
            const phNodes = nodes.filter(n => n.phase.number === ph.number);
            const phDone  = phNodes.filter(n => n.state === 'done').length;
            const phTotal = phNodes.length;
            const pct     = phTotal > 0 ? (phDone / phTotal) * 100 : 0;
            const color   = PHASE_COLORS[ph.number] ?? 'var(--ms-text-faint)';
            return (
              <a
                key={ph.number}
                href={`#cpf-phase-${ph.number}`}
                className="cpf-phase-card grid gap-3.5 pt-3.5 px-3.5 pb-3 border border-[var(--ms-surface)] rounded-xl bg-[var(--ms-bg-pane)]"
                style={{ gridTemplateColumns: 'auto 1fr' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ms-surface)'; }}
              >
                <span
                  className="font-display italic text-4xl leading-[0.9] self-center"
                  style={{ color }}
                >
                  {ROMANS[ph.number - 1]}
                </span>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-body text-sm font-medium text-[var(--ms-text-body)]">
                      {ph.label}
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
          {phases.map(ph => {
            const startY  = phaseStarts[ph.number];
            const endY    = phaseEnds[ph.number];
            const centerY = (startY + endY) / 2;
            const side    = ph.number === 2 ? 'right' : 'left';
            const color   = PHASE_COLORS[ph.number] ?? 'var(--ms-text-faint)';
            return (
              <div
                key={ph.number}
                id={`cpf-phase-${ph.number}`}
                className={`absolute flex items-center gap-4 pointer-events-none z-0 -translate-y-1/2 ${side === 'right' ? 'flex-row-reverse right-[4%]' : 'left-[4%]'}`}
                style={{ top: centerY }}
              >
                <span
                  className="font-display italic font-light text-[200px] leading-[0.85] opacity-10"
                  style={{ color }}
                >
                  {ROMANS[ph.number - 1]}
                </span>
                <div className="flex flex-col gap-1">
                  <span
                    className="font-mono text-xs tracking-[0.32em] opacity-50"
                    style={{ color }}
                  >
                    {ph.label.toUpperCase()}
                  </span>
                  {ph.sub && (
                    <span
                      className="font-display italic text-lg opacity-40"
                      style={{ color }}
                    >
                      {ph.sub}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Phase header rules */}
          {phases.map(ph => (
            <div
              key={ph.number}
              className="absolute left-[6%] right-[6%] flex items-center gap-3 z-[1] pointer-events-none"
              style={{ top: phaseStarts[ph.number] - 56 }}
            >
              <span
                className="font-mono text-xs tracking-[0.32em] opacity-85 whitespace-nowrap"
                style={{ color: PHASE_COLORS[ph.number] ?? 'var(--ms-text-faint)' }}
              >
                PHASE {ph.number}
              </span>
              <span
                className="flex-1 h-px opacity-20"
                style={{ background: PHASE_COLORS[ph.number] ?? 'var(--ms-text-faint)' }}
              />
            </div>
          ))}

          {/* Chapter nodes */}
          {nodes.map(n => {
            const isCore = n.state === 'core';
            const isDone = n.state === 'done';
            const idLbl  = String(n.stepNum).padStart(2, '0');
            const check  = isDone ? ' ✓' : '';
            const stateLine = isCore ? 'currently studying' : isDone ? 'complete' : 'upcoming';
            const sample = n.section.chips.slice(0, 3);
            const moreCount = n.section.chips.length - sample.length;
            const dotSize = isCore ? 14 : 10;

            const labelContent = (
              <>
                <span className="cpf-head">
                  <span className="cpf-num">{idLbl}</span>
                  <span className="cpf-state">{stateLine}</span>
                </span>
                <span className={`cpf-title ${isCore ? 'text-2xl' : 'text-xl'}`}>
                  {n.section.label}{check}
                </span>
                <span className="cpf-hook">{n.section.mentalModelHook}</span>
                <span className="cpf-fund-cta">Read the fundamentals →</span>
              </>
            );

            return (
              <div
                key={n.stepNum}
                className={`cpf-node cpf-node-${n.state}`}
                style={{ left: `${n.x}%`, top: n.y }}
              >
                <span className="cpf-dot" style={{ width: dotSize, height: dotSize }} />

                <div className={`cpf-label cpf-label-${n.alt.toLowerCase()}`}>
                  {n.section.fundamentalsHref ? (
                    <Link href={n.section.fundamentalsHref} className="cpf-fund-link">
                      {labelContent}
                    </Link>
                  ) : (
                    <div className="cpf-fund-link">{labelContent}</div>
                  )}

                  {sample.length > 0 && (
                    <div className="cpf-probs">
                      {sample.map((chip, idx) => {
                        const isLast = idx === sample.length - 1;
                        return (
                          <div key={chip.href} className="cpf-prob-row">
                            <Link href={chip.href} className="cpf-prob-chip">
                              {chip.id && <span className="cpf-prob-id">{chip.id}</span>}
                              <span className="cpf-prob-title">{chip.label}</span>
                            </Link>
                            {isLast && moreCount > 0 && n.section.fundamentalsHref && (
                              <Link href={n.section.fundamentalsHref} className="cpf-more">
                                +{moreCount} more
                              </Link>
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
