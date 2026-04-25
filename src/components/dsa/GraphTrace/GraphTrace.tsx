'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './GraphTrace.module.css';

type GraphNodeTone =
  | 'default'
  | 'current'
  | 'frontier'
  | 'visited'
  | 'done'
  | 'blocked'
  | 'answer'
  | 'muted';

type GraphEdgeTone =
  | 'default'
  | 'active'
  | 'traversed'
  | 'queued'
  | 'blocked'
  | 'muted';

type FactTone = 'neutral' | 'blue' | 'orange' | 'green' | 'purple';

export interface GraphTraceNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  tone?: GraphNodeTone;
  badge?: string;
}

export interface GraphTraceEdge {
  from: string;
  to: string;
  directed?: boolean;
  tone?: GraphEdgeTone;
  label?: string;
}

export interface GraphTraceFact {
  name: string;
  value: string | number;
  tone?: FactTone;
}

export interface GraphTraceStep {
  nodes: GraphTraceNode[];
  edges: GraphTraceEdge[];
  facts?: GraphTraceFact[];
  action: 'visit' | 'queue' | 'expand' | 'mark' | 'cycle' | 'done' | null;
  label: string;
}

// SVG canvas size
const VW = 500;
const VH = 340;
const CX = VW / 2;
const CY = VH / 2;
const NR = 20; // node radius in SVG units

function circlePositions(ids: string[]): Map<string, { x: number; y: number }> {
  const n = ids.length;
  if (n === 0) return new Map();
  if (n === 1) return new Map([[ids[0], { x: CX, y: CY }]]);
  const radius = Math.min(120, Math.max(65, n * 18));
  return new Map(
    ids.map((id, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      return [id, { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) }];
    }),
  );
}

const EDGE_COLOR: Record<GraphEdgeTone, string> = {
  default: 'var(--ms-surface)',
  active: 'var(--ms-orange)',
  traversed: 'var(--ms-green)',
  queued: 'var(--ms-blue)',
  blocked: 'var(--ms-red)',
  muted: 'var(--ms-text-faint)',
};

const NODE_COLOR: Record<GraphNodeTone, { fill: string; stroke: string; text: string }> = {
  default:  { fill: 'var(--ms-bg-pane-secondary)', stroke: 'var(--ms-surface)',  text: 'var(--ms-text-body)'    },
  current:  { fill: 'var(--ms-orange-surface)',    stroke: 'var(--ms-orange)',   text: 'var(--ms-orange)'       },
  frontier: { fill: 'var(--ms-blue-surface)',      stroke: 'var(--ms-blue)',     text: 'var(--ms-blue)'         },
  visited:  { fill: 'var(--ms-green-surface)',     stroke: 'var(--ms-green)',    text: 'var(--ms-green)'        },
  done:     { fill: 'var(--ms-mauve-surface)',     stroke: 'var(--ms-mauve)',    text: 'var(--ms-mauve)'        },
  blocked:  { fill: 'var(--ms-red-surface)',       stroke: 'var(--ms-red)',      text: 'var(--ms-red)'          },
  answer:   { fill: 'var(--ms-peach-surface)',     stroke: 'var(--ms-peach)',    text: 'var(--ms-peach)'        },
  muted:    { fill: 'var(--ms-bg-pane-secondary)', stroke: 'var(--ms-surface)',  text: 'var(--ms-text-faint)'   },
};

function arrowHead(fx: number, fy: number, tx: number, ty: number): string {
  const dx = tx - fx;
  const dy = ty - fy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const tipX = tx - ux * NR;
  const tipY = ty - uy * NR;
  const bx = tipX - ux * 9;
  const by = tipY - uy * 9;
  return `${tipX},${tipY} ${bx - uy * 4},${by + ux * 4} ${bx + uy * 4},${by - ux * 4}`;
}

const ACTION_LABELS: Record<NonNullable<GraphTraceStep['action']>, string> = {
  visit: 'VISIT', queue: 'QUEUE', expand: 'EXPAND',
  mark: 'MARK', cycle: 'CYCLE', done: 'DONE',
};

const BADGE_STYLES: Record<NonNullable<GraphTraceStep['action']>, string> = {
  visit: styles.badgeVisit, queue: styles.badgeQueue, expand: styles.badgeExpand,
  mark: styles.badgeMark, cycle: styles.badgeCycle, done: shared.actionDone,
};

const FACT_STYLES: Record<FactTone, string> = {
  neutral: styles.factNeutral, blue: styles.factBlue, orange: styles.factOrange,
  green: styles.factGreen, purple: styles.factPurple,
};

export default function GraphTrace({ steps }: { steps: GraphTraceStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  // Stable layout derived once from first step's node order
  const nodeIds = steps[0].nodes.map((n) => n.id);
  const positions = circlePositions(nodeIds);

  return (
    <div className={shared.root}>
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span>
            <span className={`${shared.ptr} ${styles.legendCurrent}`}>C</span>
            current
          </span>
          <span>
            <span className={`${shared.ptr} ${styles.legendFrontier}`}>Q</span>
            frontier
          </span>
          <span>
            <span className={`${shared.ptr} ${styles.legendVisited}`}>V</span>
            visited
          </span>
        </div>
        <div className={shared.nav}>
          <button
            className={shared.button}
            disabled={idx === 0}
            onClick={() => setIdx((i) => i - 1)}
          >
            <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Prev
          </button>
          <span className={shared.counter}>
            {idx + 1} / {steps.length}
          </span>
          <button
            className={shared.button}
            disabled={idx === steps.length - 1}
            onClick={() => setIdx((i) => i + 1)}
          >
            Next
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={shared.body}>
        <div className={styles.map}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className={styles.canvas}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Edges */}
            {step.edges.map((edge, i) => {
              const from = positions.get(edge.from);
              const to = positions.get(edge.to);
              if (!from || !to) return null;
              const tone = edge.tone ?? 'default';
              const color = EDGE_COLOR[tone];
              const isMuted = tone === 'muted';

              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const len = Math.hypot(dx, dy) || 1;
              const ux = dx / len;
              const uy = dy / len;

              return (
                <g key={`${edge.from}-${edge.to}-${i}`}>
                  <line
                    x1={from.x + ux * NR}
                    y1={from.y + uy * NR}
                    x2={to.x - ux * NR}
                    y2={to.y - uy * NR}
                    stroke={color}
                    strokeWidth={tone === 'active' ? 2.5 : 1.5}
                    strokeDasharray={isMuted ? '6 4' : undefined}
                    opacity={isMuted ? 0.4 : 1}
                  />
                  {edge.directed && (
                    <polygon
                      points={arrowHead(from.x, from.y, to.x, to.y)}
                      fill={color}
                      opacity={isMuted ? 0.4 : 1}
                    />
                  )}
                  {edge.label && (
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 7}
                      textAnchor="middle"
                      className={styles.edgeLabel}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {step.nodes.map((node) => {
              const pos = positions.get(node.id);
              if (!pos) return null;
              const tone = node.tone ?? 'default';
              const { fill, stroke, text } = NODE_COLOR[tone];
              const isMuted = tone === 'muted';
              const showId = node.id !== node.label;
              const bw = node.badge ? Math.max(28, node.badge.length * 5.5 + 12) : 0;

              return (
                <g key={node.id} opacity={isMuted ? 0.45 : 1}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={NR}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2}
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={700}
                    fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                    fill={text}
                  >
                    {node.label}
                  </text>

                  {/* ID below node (only when different from label) */}
                  {showId && (
                    <text
                      x={pos.x}
                      y={pos.y + NR + 11}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={9}
                      fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                      fill="var(--ms-text-faint)"
                    >
                      {node.id}
                    </text>
                  )}

                  {/* Badge above node */}
                  {node.badge && (
                    <>
                      <rect
                        x={pos.x - bw / 2}
                        y={pos.y - NR - 17}
                        width={bw}
                        height={13}
                        rx={6.5}
                        fill="var(--ms-bg-pane-secondary)"
                        stroke="var(--ms-surface)"
                        strokeWidth={1}
                      />
                      <text
                        x={pos.x}
                        y={pos.y - NR - 10.5}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={8}
                        fontWeight={700}
                        fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                        fill="var(--ms-text-subtle)"
                      >
                        {node.badge}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {step.facts && step.facts.length > 0 ? (
          <div className={styles.facts}>
            {step.facts.map((fact) => (
              <span
                key={`${fact.name}-${fact.value}`}
                className={`${styles.fact} ${FACT_STYLES[fact.tone ?? 'neutral']}`}
              >
                <span className={styles.factName}>{fact.name}</span>
                <span className={styles.factValue}>{String(fact.value)}</span>
              </span>
            ))}
          </div>
        ) : null}

        <div className={shared.info}>
          <AnimatePresence mode="popLayout">
            {step.action ? (
              <motion.span
                key={step.action}
                className={`${shared.badge} ${BADGE_STYLES[step.action]}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                {ACTION_LABELS[step.action]}
              </motion.span>
            ) : null}
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
