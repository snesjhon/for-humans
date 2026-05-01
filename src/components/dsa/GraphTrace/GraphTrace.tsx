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
const NODE_HEIGHT = 40;
const NODE_MIN_WIDTH = 40;
const NODE_MAX_WIDTH = 156;
const NODE_FONT_MAX = 12;
const NODE_FONT_MIN = 8.5;
const EDGE_LABEL_MAX_WIDTH = 104;
const EDGE_LABEL_FONT_MAX = 9;
const EDGE_LABEL_FONT_MIN = 8;

type NodeMetrics = {
  width: number;
  height: number;
  fontSize: number;
  idFontSize: number;
  badgeWidth: number;
  lines: string[];
};

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

function resolvePositions(nodes: GraphTraceNode[]): Map<string, { x: number; y: number }> {
  if (nodes.every((n) => n.x != null && n.y != null)) {
    return new Map(
      nodes.map((n) => {
        const rawX = (n.x! / 100) * VW;
        const rawY = (n.y! / 100) * VH;
        const spreadX = CX + (rawX - CX) * 1.12;
        const spreadY = CY + (rawY - CY) * 1.08;

        return [
          n.id,
          {
            x: clamp(spreadX, 34, VW - 34),
            y: clamp(spreadY, 30, VH - 30),
          },
        ];
      }),
    );
  }
  return circlePositions(nodes.map((n) => n.id));
}

const EDGE_COLOR: Record<GraphEdgeTone, string> = {
  default: 'var(--ms-surface)',
  active: 'var(--ms-peach)',
  traversed: 'var(--ms-green)',
  queued: 'var(--ms-blue)',
  blocked: 'var(--ms-red)',
  muted: 'var(--ms-text-faint)',
};

const NODE_COLOR: Record<GraphNodeTone, { fill: string; stroke: string; text: string }> = {
  default:  { fill: 'var(--ms-bg-pane-secondary)', stroke: 'var(--ms-surface)',  text: 'var(--ms-text-body)'    },
  current:  { fill: 'var(--ms-peach-surface)',     stroke: 'var(--ms-peach)',    text: 'var(--ms-peach)'        },
  frontier: { fill: 'var(--ms-blue-surface)',      stroke: 'var(--ms-blue)',     text: 'var(--ms-blue)'         },
  visited:  { fill: 'var(--ms-green-surface)',     stroke: 'var(--ms-green)',    text: 'var(--ms-green)'        },
  done:     { fill: 'var(--ms-mauve-surface)',     stroke: 'var(--ms-mauve)',    text: 'var(--ms-mauve)'        },
  blocked:  { fill: 'var(--ms-red-surface)',       stroke: 'var(--ms-red)',      text: 'var(--ms-red)'          },
  answer:   { fill: 'var(--ms-peach-surface)',     stroke: 'var(--ms-peach)',    text: 'var(--ms-peach)'        },
  muted:    { fill: 'var(--ms-bg-pane-secondary)', stroke: 'var(--ms-surface)',  text: 'var(--ms-text-faint)'   },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function estimateTextWidth(value: string, fontSize: number): number {
  return value.length * fontSize * 0.62;
}

function getNodeLines(label: string): string[] {
  if (label.length <= 16) return [label];

  const candidates = Array.from(
    label.matchAll(/ \[| |-|_/g),
    (match) => match.index ?? -1,
  ).filter((index) => index > 2 && index < label.length - 2);

  if (candidates.length === 0) return [label];

  const midpoint = label.length / 2;
  const splitIndex = candidates.reduce((best, index) =>
    Math.abs(index - midpoint) < Math.abs(best - midpoint) ? index : best,
  );

  const left = label.slice(0, splitIndex).trim();
  const right = label.slice(splitIndex).trim();

  if (!left || !right) return [label];
  return [left, right];
}

function getNodeMetrics(node: GraphTraceNode): NodeMetrics {
  const lines = getNodeLines(node.label);
  const longestLine = lines.reduce(
    (max, line) => Math.max(max, estimateTextWidth(line, NODE_FONT_MAX)),
    0,
  );
  const rawWidth = longestLine + 14;
  const width = clamp(rawWidth, NODE_MIN_WIDTH, NODE_MAX_WIDTH);
  const shrinkRatio =
    rawWidth <= width ? 1 : clamp(width / rawWidth, NODE_FONT_MIN / NODE_FONT_MAX, 1);
  const fontSize = clamp(NODE_FONT_MAX * shrinkRatio, NODE_FONT_MIN, NODE_FONT_MAX);
  const idFontSize = node.id !== node.label ? clamp(fontSize - 3, 8, 10) : 0;
  const badgeWidth = node.badge
    ? Math.max(28, estimateTextWidth(node.badge, 8) + 12)
    : 0;

  return {
    width,
    height: lines.length > 1 ? NODE_HEIGHT + 10 : NODE_HEIGHT,
    fontSize,
    idFontSize,
    badgeWidth,
    lines,
  };
}

function getEdgeLabelMetrics(label: string) {
  const rawWidth = estimateTextWidth(label, EDGE_LABEL_FONT_MAX);
  const shrinkRatio =
    rawWidth <= EDGE_LABEL_MAX_WIDTH
      ? 1
      : clamp(EDGE_LABEL_MAX_WIDTH / rawWidth, EDGE_LABEL_FONT_MIN / EDGE_LABEL_FONT_MAX, 1);

  return {
    fontSize: clamp(EDGE_LABEL_FONT_MAX * shrinkRatio, EDGE_LABEL_FONT_MIN, EDGE_LABEL_FONT_MAX),
    width: Math.min(rawWidth, EDGE_LABEL_MAX_WIDTH),
  };
}

function pointOnNodeBoundary(
  from: { x: number; y: number },
  to: { x: number; y: number },
  metrics: NodeMetrics,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const rx = metrics.width / 2;
  const ry = metrics.height / 2;
  const scale = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry));

  return {
    x: from.x + (dx / len) * len * scale,
    y: from.y + (dy / len) * len * scale,
  };
}

function arrowHead(fx: number, fy: number, tx: number, ty: number): string {
  const dx = tx - fx;
  const dy = ty - fy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const tipX = tx;
  const tipY = ty;
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

  // Stable layout derived from first step — use explicit x/y when provided
  const positions = resolvePositions(steps[0].nodes);
  const nodeMetrics = new Map(
    steps[0].nodes.map((node) => [node.id, getNodeMetrics(node)]),
  );

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
              const fromMetrics = nodeMetrics.get(edge.from);
              const toMetrics = nodeMetrics.get(edge.to);
              if (!fromMetrics || !toMetrics) return null;
              const tone = edge.tone ?? 'default';
              const color = EDGE_COLOR[tone];
              const isMuted = tone === 'muted';
              const start = pointOnNodeBoundary(from, to, fromMetrics);
              const end = pointOnNodeBoundary(to, from, toMetrics);
              const labelMetrics = edge.label ? getEdgeLabelMetrics(edge.label) : null;

              return (
                <g key={`${edge.from}-${edge.to}-${i}`}>
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={color}
                    strokeWidth={tone === 'active' ? 2.5 : 1.5}
                    strokeDasharray={isMuted ? '6 4' : undefined}
                    opacity={isMuted ? 0.4 : 1}
                  />
                  {edge.directed && (
                    <polygon
                      points={arrowHead(start.x, start.y, end.x, end.y)}
                      fill={color}
                      opacity={isMuted ? 0.4 : 1}
                    />
                  )}
                  {edge.label && labelMetrics && (
                    <g>
                      <rect
                        x={(start.x + end.x) / 2 - labelMetrics.width / 2 - 5}
                        y={(start.y + end.y) / 2 - 16}
                        width={labelMetrics.width + 10}
                        height={16}
                        rx={8}
                        className={styles.edgeLabelBg}
                      />
                      <text
                        x={(start.x + end.x) / 2}
                        y={(start.y + end.y) / 2 - 8}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={styles.edgeLabel}
                        style={{ fontSize: `${labelMetrics.fontSize}px` }}
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {step.nodes.map((node) => {
              const pos = positions.get(node.id);
              if (!pos) return null;
              const metrics = nodeMetrics.get(node.id) ?? getNodeMetrics(node);
              const tone = node.tone ?? 'default';
              const { fill, stroke, text } = NODE_COLOR[tone];
              const isMuted = tone === 'muted';
              const showId = node.id !== node.label;
              const isCircle = metrics.width <= NODE_MIN_WIDTH;

              return (
                <g key={node.id} opacity={isMuted ? 0.45 : 1}>
                  {isCircle ? (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={NODE_HEIGHT / 2}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={2}
                    />
                  ) : (
                    <rect
                      x={pos.x - metrics.width / 2}
                      y={pos.y - metrics.height / 2}
                      width={metrics.width}
                      height={metrics.height}
                      rx={metrics.height / 2}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={2}
                    />
                  )}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    fontSize={metrics.fontSize}
                    fontWeight={700}
                    fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                    fill={text}
                  >
                    {metrics.lines.length === 1 ? (
                      <tspan x={pos.x} dy="0.35em">
                        {metrics.lines[0]}
                      </tspan>
                    ) : (
                      metrics.lines.map((line, lineIndex) => (
                        <tspan
                          key={`${node.id}-${lineIndex}`}
                          x={pos.x}
                          dy={lineIndex === 0 ? '-0.2em' : '1.2em'}
                        >
                          {line}
                        </tspan>
                      ))
                    )}
                  </text>

                  {/* ID below node (only when different from label) */}
                  {showId && (
                    <text
                      x={pos.x}
                      y={pos.y + metrics.height / 2 + 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={metrics.idFontSize}
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
                        x={pos.x - metrics.badgeWidth / 2}
                        y={pos.y - metrics.height / 2 - 17}
                        width={metrics.badgeWidth}
                        height={13}
                        rx={6.5}
                        fill="var(--ms-bg-pane-secondary)"
                        stroke="var(--ms-surface)"
                        strokeWidth={1}
                      />
                      <text
                        x={pos.x}
                        y={pos.y - metrics.height / 2 - 10.5}
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
