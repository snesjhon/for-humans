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
  x: number;
  y: number;
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

const NODE_STYLES: Record<GraphNodeTone, string> = {
  default: styles.nodeDefault,
  current: styles.nodeCurrent,
  frontier: styles.nodeFrontier,
  visited: styles.nodeVisited,
  done: styles.nodeDone,
  blocked: styles.nodeBlocked,
  answer: styles.nodeAnswer,
  muted: styles.nodeMuted,
};

const FACT_STYLES: Record<FactTone, string> = {
  neutral: styles.factNeutral,
  blue: styles.factBlue,
  orange: styles.factOrange,
  green: styles.factGreen,
  purple: styles.factPurple,
};

const ACTION_LABELS: Record<NonNullable<GraphTraceStep['action']>, string> = {
  visit: 'VISIT',
  queue: 'QUEUE',
  expand: 'EXPAND',
  mark: 'MARK',
  cycle: 'CYCLE',
  done: 'DONE',
};

const BADGE_STYLES: Record<NonNullable<GraphTraceStep['action']>, string> = {
  visit: styles.badgeVisit,
  queue: styles.badgeQueue,
  expand: styles.badgeExpand,
  mark: styles.badgeMark,
  cycle: styles.badgeCycle,
  done: shared.actionDone,
};

const EDGE_COLORS: Record<GraphEdgeTone, string> = {
  default: 'var(--ms-surface)',
  active: 'var(--ms-orange)',
  traversed: 'var(--ms-green)',
  queued: 'var(--ms-blue)',
  blocked: 'var(--ms-red)',
  muted: 'var(--ms-text-faint)',
};

function arrowPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const tipX = x2 - ux * 24;
  const tipY = y2 - uy * 24;
  const baseX = tipX - ux * 10;
  const baseY = tipY - uy * 10;
  const perpX = -uy;
  const perpY = ux;
  const leftX = baseX + perpX * 5;
  const leftY = baseY + perpY * 5;
  const rightX = baseX - perpX * 5;
  const rightY = baseY - perpY * 5;
  return `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`;
}

export default function GraphTrace({ steps }: { steps: GraphTraceStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const positions = new Map(step.nodes.map((node) => [node.id, node]));

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
            className={styles.canvas}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {step.edges.map((edge, edgeIndex) => {
              const from = positions.get(edge.from);
              const to = positions.get(edge.to);
              if (!from || !to) return null;
              const tone = edge.tone ?? 'default';
              const color = EDGE_COLORS[tone];
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;

              return (
                <g key={`${edge.from}-${edge.to}-${edgeIndex}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={color}
                    strokeWidth={tone === 'active' ? 3 : 2}
                    strokeDasharray={tone === 'muted' ? '4 3' : undefined}
                    opacity={tone === 'muted' ? 0.45 : 1}
                  />
                  {edge.directed ? (
                    <polygon points={arrowPoints(from.x, from.y, to.x, to.y)} fill={color} />
                  ) : null}
                  {edge.label ? (
                    <text x={midX} y={midY - 2} textAnchor="middle" className={styles.edgeLabel}>
                      {edge.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>

          {step.nodes.map((node) => (
            <div
              key={node.id}
              className={styles.nodeWrap}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className={`${styles.node} ${NODE_STYLES[node.tone ?? 'default']}`}>
                {node.label}
              </div>
              <div className={styles.meta}>
                <span className={styles.nodeId}>{node.id}</span>
                {node.badge ? <span className={styles.nodeBadge}>{node.badge}</span> : null}
              </div>
            </div>
          ))}
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
