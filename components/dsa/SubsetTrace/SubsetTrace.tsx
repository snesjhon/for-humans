'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './SubsetTrace.module.css';

export interface SubsetTraceStep {
  nums: number[];
  start: number;    // index currently being examined; nums.length = all slots visited
  basket: number[]; // current subset contents
  action: 'add' | 'remove' | 'record' | 'done';
  label: string;
}

const BADGE_LABELS: Record<SubsetTraceStep['action'], string> = {
  add: 'ADD',
  remove: 'REMOVE',
  record: 'RECORD',
  done: 'DONE',
};

const BADGE_STYLES: Record<SubsetTraceStep['action'], string> = {
  add: styles.badgeAdd,
  remove: styles.badgeRemove,
  record: styles.badgeRecord,
  done: styles.badgeDone,
};

function numsCellClass(i: number, start: number): string {
  if (i < start) return shared.graveyard;
  if (i === start) return styles.slotActive;
  return shared.unvisited;
}

function basketCellClass(
  i: number,
  basket: number[],
  action: SubsetTraceStep['action'],
): string {
  const last = basket.length - 1;
  if (action === 'record') return shared.confirmed;
  if (action === 'add' && i === last) return shared.readingKeep;
  if (action === 'remove' && i === last) return styles.removing;
  return shared.confirmed;
}

export default function SubsetTrace({ steps }: { steps: SubsetTraceStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  return (
    <div className={shared.root}>
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span>
            <span className={`${shared.ptr} ${styles.ptrSlot}`}>slot</span>
            current
          </span>
          <span>
            <span className={`${shared.ptr} ${styles.ptrBasket}`}>basket</span>
            chosen
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
        {/* nums row */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>nums</span>
          <div className={shared.array}>
            {step.nums.map((val, i) => (
              <div key={i} className={shared.col}>
                <div className={`${shared.cell} ${numsCellClass(i, step.start)}`}>
                  {val}
                </div>
                <div className={shared.idx}>{i}</div>
                <div className={shared.ptrs}>
                  {i === step.start && (
                    <span className={`${shared.ptr} ${styles.ptrSlot}`}>
                      start
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* basket row */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>basket</span>
          <div className={styles.basket}>
            {step.basket.length === 0 ? (
              <div className={styles.emptyBasket}>[ ]</div>
            ) : (
              step.basket.map((val, i) => (
                <div key={i} className={shared.col}>
                  <div
                    className={`${shared.cell} ${basketCellClass(i, step.basket, step.action)}`}
                  >
                    {val}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={shared.info}>
          <AnimatePresence mode="popLayout">
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
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
