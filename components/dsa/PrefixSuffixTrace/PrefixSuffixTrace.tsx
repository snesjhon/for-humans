'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './PrefixSuffixTrace.module.css';

export interface PrefixSuffixStep {
  nums: number[];
  result: number[];
  currentI: number; // -1 = no specific index highlighted
  pass: 'forward' | 'backward' | 'done';
  accumulator: number;
  accName: 'prefix' | 'suffix' | '';
  label: string;
}

// ─── Cell state helpers ───────────────────────────────────────────────────────

function resultCellState(i: number, step: PrefixSuffixStep): string {
  const { currentI, pass } = step;
  if (pass === 'done') return 'ps-final';
  if (pass === 'forward') {
    if (currentI === -1) return 'ps-empty';
    if (i < currentI) return 'ps-filled';
    if (i === currentI) return 'ps-active-fwd';
    return 'ps-empty';
  }
  if (currentI === -1) return 'ps-filled';
  if (i > currentI) return 'ps-final';
  if (i === currentI) return 'ps-active-bwd';
  return 'ps-filled';
}

const CELL_STYLES: Record<string, string> = {
  'ps-empty': styles.empty,
  'ps-filled': styles.filled,
  'ps-active-fwd': styles.activeForward,
  'ps-active-bwd': styles.activeBackward,
  'ps-final': styles.final,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PrefixSuffixTrace({ steps }: { steps: PrefixSuffixStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const n = step.nums.length;

  const passBadge = step.pass === 'forward'
    ? { label: 'FORWARD', cls: 'ps-fwd' }
    : step.pass === 'backward'
      ? { label: 'BACKWARD', cls: 'ps-bwd' }
      : { label: 'DONE', cls: 'ps-done' };

  const isActive = (i: number) => i === step.currentI && step.currentI !== -1;

  return (
    <div className={shared.root}>
      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span className={styles.legendForward}>■ prefix stored</span>
          <span className={styles.legendBackward}>■ final value</span>
        </div>
        <div className={shared.nav}>
          <button className={shared.button} disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>← Prev</button>
          <span className={shared.counter}>{idx + 1} / {steps.length}</span>
          <button className={shared.button} disabled={idx === steps.length - 1} onClick={() => setIdx(i => i + 1)}>Next →</button>
        </div>
      </div>

      {/* ── Body: pass badge + acc, then grid, then label ── */}
      <div className={shared.body}>
        <div className={styles.header}>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={passBadge.label}
              className={`${shared.badge} ${
                passBadge.cls === 'ps-fwd'
                  ? styles.forwardBadge
                  : passBadge.cls === 'ps-bwd'
                    ? styles.backwardBadge
                    : styles.doneBadge
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              {passBadge.label} PASS
            </motion.span>
          </AnimatePresence>

          {step.accName && (
            <span className={styles.acc}>
              <span className={styles.accName}>{step.accName}</span>
              <span className={styles.accEq}>=</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={step.accumulator}
                  className={styles.accVal}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.14 }}
                >
                  {step.accumulator}
                </motion.span>
              </AnimatePresence>
            </span>
          )}
        </div>

        <div className={styles.grid}>
          <div className={styles.rowLabels}>
            <span className={`${styles.rowLabel} ${styles.cursorSpacer}`} />
            <span className={styles.rowLabel}>nums</span>
            <span className={styles.rowLabel}>result</span>
          </div>
          <div className={styles.cols}>
            {Array.from({ length: n }, (_, i) => (
              <div key={i} className={styles.col}>
                <div className={styles.cursorSlot}>
                  <AnimatePresence>
                    {isActive(i) && (
                      <motion.span
                        key={`cursor-${i}`}
                        className={styles.cursorPin}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >i</motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className={`${shared.cell} ${styles.numsCell}${isActive(i) ? ` ${styles.numsActive}` : ''}`}>
                  {step.nums[i]}
                </div>
                <div className={`${shared.cell} ${CELL_STYLES[resultCellState(i, step)]}`}>
                  {step.result[i]}
                </div>
                <div className={shared.idx}>{i}</div>
              </div>
            ))}
          </div>
        </div>

        <TraceLabel raw={step.label} />
      </div>
    </div>
  );
}
