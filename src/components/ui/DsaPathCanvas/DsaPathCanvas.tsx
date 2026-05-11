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
    <div style={{ background: 'var(--ms-bg-pane)' }}>
      <div
        id="cpf-root"
        style={{ display: 'grid', gridTemplateColumns: '220px 1fr', position: 'relative', maxWidth: 1280, margin: '0 auto' }}
      >

        {/* ── Sticky sidebar ── */}
        <aside
          className="cpf-side"
          style={{
            position: 'sticky', top: 20, alignSelf: 'start',
            padding: '28px 18px 28px 28px',
            display: 'flex', flexDirection: 'column', gap: 14,
            zIndex: 3,
          }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.32em', color: 'var(--ms-text-faint)', marginBottom: 4,
          }}>
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
                className="cpf-phase-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '14px',
                  padding: '14px 14px 12px',
                  border: '1px solid var(--ms-surface)',
                  borderRadius: 12,
                  background: 'var(--ms-bg-pane)',
                }}
                // inline hover via CSS class defined above + custom color
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ms-surface)'; }}
              >
                <span style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic',
                  fontSize: 34, lineHeight: '0.9', color,
                  alignSelf: 'center',
                }}>
                  {ROMANS[ph - 1]}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--ms-text-body)' }}>
                      {PHASE_NAMES[ph - 1]}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ms-text-faint)', letterSpacing: '0.04em' }}>
                      {phDone}/{phTotal}
                    </span>
                  </div>
                  <span style={{ display: 'block', height: 3, borderRadius: 2, background: 'var(--ms-surface0)', overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', background: color, borderRadius: 2, width: `${pct}%`, transition: 'width .3s' }} />
                  </span>
                </div>
              </a>
            );
          })}

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            marginTop: 6, paddingTop: 14,
            borderTop: '1px dashed var(--ms-surface)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 4px' }}>
              <b style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, color: 'var(--ms-text)', fontWeight: 400 }}>
                {solvedCount}
              </b>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--ms-text-faint)' }}>
                solved
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 4px' }}>
              <b style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, color: 'var(--ms-text)', fontWeight: 400 }}>
                {currentStep}
              </b>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--ms-text-faint)' }}>
                current ch.
              </span>
            </div>
          </div>
        </aside>

        {/* ── Canvas ── */}
        <div
          className="cpf-canvas"
          style={{
            position: 'relative',
            margin: '20px 24px 60px 0',
            border: '1px solid var(--ms-surface)',
            borderRadius: 16,
            background: 'var(--ms-bg-pane-secondary)',
            overflow: 'hidden',
            height: TOTAL_H,
          }}
        >
          {/* SVG edges */}
          <svg
            viewBox={`0 0 ${VBW} ${TOTAL_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
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
                style={{
                  position: 'absolute',
                  top: centerY,
                  ...(side === 'left' ? { left: '4%' } : { right: '4%' }),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  flexDirection: side === 'right' ? 'row-reverse' : 'row',
                  pointerEvents: 'none',
                  zIndex: 0,
                  transform: 'translateY(-50%)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300,
                  fontSize: 200, lineHeight: '0.85',
                  color: PHASE_COLORS[ph], opacity: 0.08,
                }}>
                  {ROMANS[ph - 1]}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.32em',
                    color: PHASE_COLORS[ph], opacity: 0.5,
                  }}>
                    {PHASE_NAMES[ph - 1].toUpperCase()}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18,
                    color: PHASE_COLORS[ph], opacity: 0.4,
                  }}>
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
              style={{
                position: 'absolute', left: '6%', right: '6%',
                top: phaseStarts[ph] - 56,
                display: 'flex', alignItems: 'center', gap: 12,
                zIndex: 1, pointerEvents: 'none',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.32em',
                color: PHASE_COLORS[ph], opacity: 0.85, whiteSpace: 'nowrap',
              }}>
                PHASE {ph}
              </span>
              <span style={{ flex: 1, height: 1, background: PHASE_COLORS[ph], opacity: 0.2 }} />
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
                <span className="cpf-title" style={{ fontSize: isCore ? 26 : 22 }}>
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
                              style={{
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: 'var(--ms-surface1)',
                                borderRadius: 999,
                                fontSize: 10,
                              }}
                            >
                              <span className="cpf-prob-id" style={{ fontSize: 10 }}>{prob.id}</span>
                              <span className="cpf-prob-title" style={{ fontSize: 11 }}>{problemTitles[prob.id] ?? prob.id}</span>
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
