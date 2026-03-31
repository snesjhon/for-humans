'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceLabel } from './TraceLabel';

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

export default function TwoPointerTrace({ steps }: { steps: TwoPointerStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const isDone = step.action === 'done';

  return (
    <div className="dfh-trace">
      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className="dfh-trace-topbar">
        <div className="dfh-trace-legend">
          <span><span className="dfh-ptr tp-l-ptr">L</span> left</span>
          <span><span className="dfh-ptr tp-r-ptr">R</span> right</span>
        </div>
        <div className="dfh-trace-nav">
          <button className="dfh-trace-btn" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>← Prev</button>
          <span className="dfh-trace-counter">{idx + 1} / {steps.length}</span>
          <button className="dfh-trace-btn" disabled={idx === steps.length - 1} onClick={() => setIdx(i => i + 1)}>Next →</button>
        </div>
      </div>

      {/* ── Body: visualization + badge + label ── */}
      <div className="dfh-trace-body">
        <div className="dfh-trace-array">
          {step.chars.map((ch, i) => {
            const state = cellState(i, step);
            const isL = i === step.L && !isDone;
            const isR = i === step.R && !isDone;
            return (
              <div key={i} className="dfh-trace-col">
                <div className={`dfh-trace-cell ${state}`}>{ch}</div>
                <div className="dfh-trace-idx">{i}</div>
                <div className="dfh-trace-ptrs">
                  {isL && isR && <span className="dfh-ptr tp-both-ptr">L R</span>}
                  {isL && !isR && <span className="dfh-ptr tp-l-ptr">L</span>}
                  {isR && !isL && <span className="dfh-ptr tp-r-ptr">R</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="dfh-trace-info">
          <AnimatePresence mode="popLayout">
            {step.action && (
              <motion.span
                key={step.action}
                className={`dfh-trace-badge action-${step.action}`}
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
