'use client';

import { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './LinkedListTrace.module.css';

export interface LinkedListStep {
  nodes: Array<{ val: string | number }>;
  pointers: Array<{
    /** Node index. -1 = null before the list. nodes.length = null terminus. */
    index: number;
    label: string;
    color?: 'blue' | 'orange' | 'green' | 'purple';
  }>;
  action: 'rewire' | 'found' | 'done' | 'delete' | null;
  label: string;
}

const colorCls = (color?: string): string => {
  switch (color) {
    case 'orange': return 'orange';
    case 'green':  return 'green';
    case 'purple': return 'purple';
    default:       return 'blue';
  }
};

function Arrow() {
  return <MoveRight aria-hidden="true" className={styles.arrow} strokeWidth={1.75} />;
}

const POINTER_STYLES: Record<string, string> = {
  blue: styles.ptrBlue,
  orange: styles.ptrOrange,
  green: styles.ptrGreen,
  purple: styles.ptrPurple,
};

const NODE_STYLES: Record<string, string> = {
  blue: styles.nodeBlue,
  orange: styles.nodeOrange,
  green: styles.nodeGreen,
  purple: styles.nodePurple,
};

const BADGE_STYLES: Record<NonNullable<LinkedListStep['action']>, string> = {
  rewire: styles.badgeRewire,
  found: styles.badgeFound,
  delete: styles.badgeDelete,
  done: styles.badgeDone,
};

export default function LinkedListTrace({ steps }: { steps: LinkedListStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const hasLeftNull    = step.pointers.some(p => p.index === -1);
  const leftNullPtrs   = step.pointers.filter(p => p.index === -1);
  const nullTermPtrs   = step.pointers.filter(p => p.index === step.nodes.length);

  // Unique pointer descriptors for the legend (first occurrence per label wins)
  const legendPtrs = Array.from(
    new Map(
      steps.flatMap(s => s.pointers).map(p => [p.label, p])
    ).values()
  );

  const actionLabel: Record<string, string> = {
    rewire: 'REWIRE',
    found:  'FOUND',
    delete: 'DELETE',
    done:   'DONE',
  };

  return (
    <div className={shared.root}>

      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className={shared.topbar}>
        <div className={shared.legend}>
          {legendPtrs.map(p => (
            <span key={p.label}>
              <span className={`${shared.ptr} ${POINTER_STYLES[colorCls(p.color)]}`}>{p.label}</span>
            </span>
          ))}
        </div>
        <div className={shared.nav}>
          <button
            className={shared.button}
            disabled={idx === 0}
            onClick={() => setIdx(i => i - 1)}
          >
            <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Prev
          </button>
          <span className={shared.counter}>{idx + 1} / {steps.length}</span>
          <button
            className={shared.button}
            disabled={idx === steps.length - 1}
            onClick={() => setIdx(i => i + 1)}
          >
            Next
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Body: linked list + badge + label ── */}
      <div className={shared.body}>
        <div className={styles.row}>

          {/* Left null column — only rendered when a pointer is at index -1 */}
          {hasLeftNull && (
            <div className={styles.colUnit}>
              <div className={styles.nodeCol}>
                <div className={styles.ptrsAbove}>
                  {leftNullPtrs.map((p, pi) => (
                    <span key={pi} className={`${shared.ptr} ${POINTER_STYLES[colorCls(p.color)]}`}>
                      {p.label}
                    </span>
                  ))}
                </div>
                <div className={styles.nullBox}>null</div>
              </div>
              <Arrow />
            </div>
          )}

          {/* Node columns */}
          {step.nodes.map((node, i) => {
            const nodePtrs     = step.pointers.filter(p => p.index === i);
            const primaryColor = nodePtrs.length > 0 ? colorCls(nodePtrs[0].color) : null;
            return (
              <Fragment key={i}>
                <div className={styles.colUnit}>
                  <div className={styles.nodeCol}>
                    <div className={styles.ptrsAbove}>
                      {nodePtrs.map((p, pi) => (
                        <span key={pi} className={`${shared.ptr} ${POINTER_STYLES[colorCls(p.color)]}`}>
                          {p.label}
                        </span>
                      ))}
                    </div>
                    <div className={`${styles.node}${primaryColor ? ` ${NODE_STYLES[primaryColor]}` : ''}`}>
                      {node.val}
                    </div>
                  </div>
                  <Arrow />
                </div>
              </Fragment>
            );
          })}

          {/* Null terminus */}
          <div className={styles.colUnit}>
            <div className={styles.nodeCol}>
              <div className={styles.ptrsAbove}>
                {nullTermPtrs.map((p, pi) => (
                  <span key={pi} className={`${shared.ptr} ${POINTER_STYLES[colorCls(p.color)]}`}>
                    {p.label}
                  </span>
                ))}
              </div>
              <div className={styles.nullBox}>null</div>
            </div>
          </div>

        </div>

        {/* Badge + label */}
        <div className={shared.info}>
          <AnimatePresence mode="popLayout">
            {step.action && (
              <motion.span
                key={step.action}
                className={`${shared.badge} ${BADGE_STYLES[step.action]}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                {actionLabel[step.action] ?? step.action.toUpperCase()}
              </motion.span>
            )}
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>

    </div>
  );
}
