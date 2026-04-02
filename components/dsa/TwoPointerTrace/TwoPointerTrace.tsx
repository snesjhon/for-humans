'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './TwoPointerTrace.module.css';

export interface TwoPointerStep {
  chars: string[];
  L: number;
  R: number;
  action: 'match' | 'mismatch' | 'done' | null;
  label: string;
}

function cellState(i: number, step: TwoPointerStep): string {
  const { L, R, action } = step;
  if (action === 'done') {
    if (L === R && i === L) return 'tp-middle';
    return 'tp-verified';
  }
  if (action === 'mismatch') {
    if (i === L || i === R) return 'tp-mismatch';
    if (i < L || i > R) return 'tp-verified';
    return 'tp-unchecked';
  }
  if (i < L || i > R) return 'tp-verified';
  if (i === L && i === R) return 'tp-both';
  if (i === L) return 'tp-left';
  if (i === R) return 'tp-right';
  return 'tp-unchecked';
}

const CELL_STYLES: Record<string, string> = {
  'tp-verified': styles.verified,
  'tp-left': styles.left,
  'tp-right': styles.right,
  'tp-both': styles.both,
  'tp-unchecked': styles.unchecked,
  'tp-mismatch': styles.mismatch,
  'tp-middle': styles.middle,
};

const BADGE_STYLES: Record<NonNullable<TwoPointerStep['action']>, string> = {
  match: shared.actionMatch,
  mismatch: shared.actionMismatch,
  done: shared.actionDone,
};

export default function TwoPointerTrace({ steps }: { steps: TwoPointerStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const isDone = step.action === 'done';

  return (
    <div className={shared.root}>
      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span><span className={`${shared.ptr} ${styles.leftPtr}`}>L</span> left</span>
          <span><span className={`${shared.ptr} ${styles.rightPtr}`}>R</span> right</span>
        </div>
        <div className={shared.nav}>
          <button className={shared.button} disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>← Prev</button>
          <span className={shared.counter}>{idx + 1} / {steps.length}</span>
          <button className={shared.button} disabled={idx === steps.length - 1} onClick={() => setIdx(i => i + 1)}>Next →</button>
        </div>
      </div>

      {/* ── Body: visualization + badge + label ── */}
      <div className={shared.body}>
        <div className={shared.array}>
          {step.chars.map((ch, i) => {
            const state = cellState(i, step);
            const isL = i === step.L && !isDone;
            const isR = i === step.R && !isDone;
            return (
              <div key={i} className={shared.col}>
                <div className={`${shared.cell} ${CELL_STYLES[state]}`}>{ch}</div>
                <div className={shared.idx}>{i}</div>
                <div className={shared.ptrs}>
                  {isL && isR && <span className={`${shared.ptr} ${styles.bothPtr}`}>L R</span>}
                  {isL && !isR && <span className={`${shared.ptr} ${styles.leftPtr}`}>L</span>}
                  {isR && !isL && <span className={`${shared.ptr} ${styles.rightPtr}`}>R</span>}
                </div>
              </div>
            );
          })}
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
                {step.action === 'match' ? 'MATCH' : step.action === 'mismatch' ? 'MISMATCH' : 'DONE'}
              </motion.span>
            )}
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
