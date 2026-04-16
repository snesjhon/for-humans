'use client';

import { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoveLeft, MoveRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './DoublyLinkedListTrace.module.css';

export interface DoublyLinkedListStep {
  nodes: Array<{ val: string | number }>;
  pointers: Array<{
    /** Node index. -1 = null before the list. nodes.length = null after the list. */
    index: number;
    label: string;
    color?: 'blue' | 'orange' | 'green' | 'purple';
  }>;
  action: 'rewire' | 'found' | 'done' | 'delete' | null;
  label: string;
}

const colorCls = (color?: string): string => {
  switch (color) {
    case 'orange':
      return 'orange';
    case 'green':
      return 'green';
    case 'purple':
      return 'purple';
    default:
      return 'blue';
  }
};

function tagClassName(color?: string) {
  const tone = colorCls(color);
  return styles[`tag${tone[0].toUpperCase()}${tone.slice(1)}`];
}

function BidirectionalConnector() {
  return (
    <div className={styles.connector} aria-hidden="true">
      <div className={styles.connectorLane}>
        <MoveRight className={styles.connectorIcon} strokeWidth={1.75} />
        <span className={styles.connectorLabel}>colder</span>
      </div>
      <div className={`${styles.connectorLane} ${styles.connectorLaneReverse}`}>
        <MoveLeft className={styles.connectorIcon} strokeWidth={1.75} />
        <span className={styles.connectorLabel}>warmer</span>
      </div>
    </div>
  );
}

const NODE_STYLES: Record<string, string> = {
  blue: styles.nodeBlue,
  orange: styles.nodeOrange,
  green: styles.nodeGreen,
  purple: styles.nodePurple,
};

const BADGE_STYLES: Record<NonNullable<DoublyLinkedListStep['action']>, string> = {
  rewire: styles.badgeRewire,
  found: styles.badgeFound,
  delete: styles.badgeDelete,
  done: styles.badgeDone,
};

export default function DoublyLinkedListTrace({
  steps,
}: {
  steps: DoublyLinkedListStep[];
}) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const hasLeftNull = step.pointers.some((p) => p.index === -1);
  const hasRightNull = step.pointers.some((p) => p.index === step.nodes.length);
  const leftNullPtrs = step.pointers.filter((p) => p.index === -1);
  const rightNullPtrs = step.pointers.filter((p) => p.index === step.nodes.length);

  const actionLabel: Record<string, string> = {
    rewire: 'REWIRE',
    found: 'FOUND',
    delete: 'DELETE',
    done: 'DONE',
  };

  return (
    <div className={shared.root}>
      <div className={shared.topbar}>
        <div />
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
        <div className={styles.row}>
          {hasLeftNull && (
            <div className={styles.colUnit}>
              <div className={styles.nodeCol}>
                <div className={styles.ptrsAbove}>
                  {leftNullPtrs.map((p, pi) => (
                    <span key={pi} className={`${styles.nodeTag} ${tagClassName(p.color)}`}>
                      {p.label}
                    </span>
                  ))}
                </div>
                <div className={styles.nullBox}>NULL</div>
              </div>
              {step.nodes.length > 0 && <BidirectionalConnector />}
            </div>
          )}

          {step.nodes.map((node, i) => {
            const nodePtrs = step.pointers.filter((p) => p.index === i);
            const primaryColor = nodePtrs.length > 0 ? colorCls(nodePtrs[0].color) : null;
            const showConnector = i < step.nodes.length - 1 || hasRightNull;

            return (
              <Fragment key={i}>
                <div className={styles.colUnit}>
                  <div className={styles.nodeCol}>
                    <div className={styles.ptrsAbove}>
                      {nodePtrs.map((p, pi) => (
                        <span key={pi} className={`${styles.nodeTag} ${tagClassName(p.color)}`}>
                          {p.label}
                        </span>
                      ))}
                    </div>
                    <div
                      className={`${styles.node}${primaryColor ? ` ${NODE_STYLES[primaryColor]}` : ''}`}
                    >
                      <div className={styles.slot} />
                      <div className={styles.valueCell}>{node.val}</div>
                      <div className={styles.slot} />
                    </div>
                  </div>
                  {showConnector && <BidirectionalConnector />}
                </div>
              </Fragment>
            );
          })}

          {hasRightNull && (
            <div className={styles.colUnit}>
              <div className={styles.nodeCol}>
                <div className={styles.ptrsAbove}>
                  {rightNullPtrs.map((p, pi) => (
                    <span key={pi} className={`${styles.nodeTag} ${tagClassName(p.color)}`}>
                      {p.label}
                    </span>
                  ))}
                </div>
                <div className={styles.nullBox}>NULL</div>
              </div>
            </div>
          )}
        </div>

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
