'use client';

import { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <svg
      className={styles.connector}
      width="112"
      height="42"
      viewBox="0 0 112 42"
      fill="none"
      aria-hidden
    >
      <line x1="4" y1="12" x2="92" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M88 8 L96 12 L88 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="108" y1="30" x2="20" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M24 26 L16 30 L24 34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="48" y="9" textAnchor="middle" className={styles.connectorLabel}>
        colder
      </text>
      <text x="64" y="27" textAnchor="middle" className={styles.connectorLabel}>
        warmer
      </text>
    </svg>
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
            ← Prev
          </button>
          <span className={shared.counter}>
            {idx + 1} / {steps.length}
          </span>
          <button
            className={shared.button}
            disabled={idx === steps.length - 1}
            onClick={() => setIdx((i) => i + 1)}
          >
            Next →
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
