'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceLabel } from './TraceLabel';

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
    <div className="dfh-trace">
      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className="dfh-trace-topbar">
        <div className="dfh-trace-legend">
          <span className="ps-legend-fwd">■ prefix stored</span>
          <span className="ps-legend-bwd">■ final value</span>
        </div>
        <div className="dfh-trace-nav">
          <button className="dfh-trace-btn" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>← Prev</button>
          <span className="dfh-trace-counter">{idx + 1} / {steps.length}</span>
          <button className="dfh-trace-btn" disabled={idx === steps.length - 1} onClick={() => setIdx(i => i + 1)}>Next →</button>
        </div>
      </div>

      {/* ── Body: pass badge + acc, then grid, then label ── */}
      <div className="dfh-trace-body">
        <div className="ps-header">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={passBadge.label}
              className={`dfh-trace-badge ${passBadge.cls}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              {passBadge.label} PASS
            </motion.span>
          </AnimatePresence>

          {step.accName && (
            <span className="ps-acc">
              <span className="ps-acc-name">{step.accName}</span>
              <span className="ps-acc-eq">=</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={step.accumulator}
                  className="ps-acc-val"
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

        <div className="ps-grid">
          <div className="ps-row-labels">
            <span className="ps-row-label ps-cursor-spacer" />
            <span className="ps-row-label">nums</span>
            <span className="ps-row-label">result</span>
          </div>
          <div className="ps-cols">
            {Array.from({ length: n }, (_, i) => (
              <div key={i} className="ps-col">
                <div className="ps-cursor-slot">
                  <AnimatePresence>
                    {isActive(i) && (
                      <motion.span
                        key={`cursor-${i}`}
                        className="ps-cursor-pin"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >i</motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className={`dfh-trace-cell ps-nums-cell${isActive(i) ? ' ps-nums-active' : ''}`}>
                  {step.nums[i]}
                </div>
                <div className={`dfh-trace-cell ${resultCellState(i, step)}`}>
                  {step.result[i]}
                </div>
                <div className="dfh-trace-idx">{i}</div>
              </div>
            ))}
          </div>
        </div>

        <TraceLabel raw={step.label} />
      </div>
    </div>
  );
}
