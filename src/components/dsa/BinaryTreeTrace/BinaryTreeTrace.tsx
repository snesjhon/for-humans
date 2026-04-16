'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './BinaryTreeTrace.module.css';

type TreeNodeTone =
  | 'default'
  | 'active'
  | 'focus'
  | 'done'
  | 'frontier'
  | 'answer'
  | 'muted';

type FactTone = 'neutral' | 'blue' | 'orange' | 'green' | 'purple';

export interface BinaryTreeTraceNode {
  index: number;
  value: string | number;
  tone?: TreeNodeTone;
  badge?: string;
}

export interface BinaryTreeTraceFact {
  name: string;
  value: string | number;
  tone?: FactTone;
}

export interface BinaryTreeTraceStep {
  nodes: BinaryTreeTraceNode[];
  facts?: BinaryTreeTraceFact[];
  action: 'visit' | 'branch' | 'combine' | 'queue' | 'done' | null;
  label: string;
}

const NODE_STYLES: Record<TreeNodeTone, string> = {
  default: styles.nodeDefault,
  active: styles.nodeActive,
  focus: styles.nodeFocus,
  done: styles.nodeDone,
  frontier: styles.nodeFrontier,
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

const BADGE_STYLES: Record<NonNullable<BinaryTreeTraceStep['action']>, string> = {
  visit: shared.actionMatch,
  branch: styles.badgeBranch,
  combine: shared.actionKeep,
  queue: styles.badgeQueue,
  done: shared.actionDone,
};

const BADGE_LABELS: Record<NonNullable<BinaryTreeTraceStep['action']>, string> = {
  visit: 'VISIT',
  branch: 'BRANCH',
  combine: 'COMBINE',
  queue: 'QUEUE',
  done: 'DONE',
};

function depthForIndex(index: number): number {
  return Math.floor(Math.log2(index + 1));
}

function maxDepth(nodes: BinaryTreeTraceNode[]): number {
  const maxIndex = nodes.reduce((best, node) => Math.max(best, node.index), 0);
  return depthForIndex(maxIndex);
}

export default function BinaryTreeTrace({
  steps,
}: {
  steps: BinaryTreeTraceStep[];
}) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const tree = useMemo(() => {
    const byIndex = new Map(step.nodes.map((node) => [node.index, node]));
    const depth = maxDepth(step.nodes);
    const rows = Array.from({ length: depth + 1 }, (_, rowDepth) => {
      const width = 2 ** rowDepth;
      return Array.from({ length: width }, (_, pos) => {
        const index = 2 ** rowDepth - 1 + pos;
        return byIndex.get(index) ?? null;
      });
    });

    return { rows, depth };
  }, [step.nodes]);

  return (
    <div className={shared.root}>
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span>
            <span className={`${shared.ptr} ${styles.legendFocus}`}>F</span>
            focus
          </span>
          <span>
            <span className={`${shared.ptr} ${styles.legendDone}`}>R</span>
            resolved
          </span>
          <span>
            <span className={`${shared.ptr} ${styles.legendFrontier}`}>Q</span>
            frontier
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
        <div className={styles.tree}>
          {tree.rows.map((row, rowDepth) => (
            <div
              key={rowDepth}
              className={styles.row}
              style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
            >
              {row.map((node, slot) => (
                <div key={`${rowDepth}-${slot}`} className={styles.slot}>
                  {node ? (
                    <div className={styles.nodeWrap}>
                      <div
                        className={`${styles.node} ${
                          NODE_STYLES[node.tone ?? 'default']
                        }`}
                      >
                        {node.value}
                      </div>
                      <div className={styles.meta}>
                        <span className={styles.index}>
                          {`i${node.index}`}
                        </span>
                        {node.badge ? (
                          <span className={styles.nodeBadge}>{node.badge}</span>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.empty} aria-hidden />
                  )}
                </div>
              ))}
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
                {BADGE_LABELS[step.action]}
              </motion.span>
            ) : null}
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
