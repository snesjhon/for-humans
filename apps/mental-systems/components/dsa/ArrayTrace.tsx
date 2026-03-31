'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceLabel } from './TraceLabel';

export interface TraceStep {
  array: number[];
  reader: number;
  writer: number;
  action: 'keep' | 'skip' | 'done' | null;
  label: string;
}

function cellState(i: number, step: TraceStep): string {
  const { reader, writer, action } = step;
  if (action === 'done') return i < writer ? 'confirmed' : 'irrelevant';
  if (i < writer) return 'confirmed';
  if (i === writer && i === reader) return 'active';
  if (i === writer) return 'write-target';
  if (i < reader) return 'graveyard';
  if (i === reader) return action === 'keep' ? 'reading-keep' : action === 'skip' ? 'reading-skip' : 'reading';
  return 'unvisited';
}

export default function ArrayTrace({ steps }: { steps: TraceStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const isDone = step.action === 'done';

  return (
    <div className="dfh-trace">
      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className="dfh-trace-topbar">
        <div className="dfh-trace-legend">
          <span><span className="dfh-ptr reader">R</span> reader</span>
          <span><span className="dfh-ptr writer">W</span> writer</span>
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
          {step.array.map((val, i) => {
            const state = cellState(i, step);
            const isReader = i === step.reader && !isDone;
            const isWriter = i === step.writer && !isDone;
            return (
              <div key={i} className="dfh-trace-col">
                <div className={`dfh-trace-cell ${state}`}>{val}</div>
                <div className="dfh-trace-idx">{i}</div>
                <div className="dfh-trace-ptrs">
                  {isReader && isWriter && <span className="dfh-ptr both">R W</span>}
                  {isReader && !isWriter && <span className="dfh-ptr reader">R</span>}
                  {isWriter && !isReader && <span className="dfh-ptr writer">W</span>}
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
                {step.action.toUpperCase()}
              </motion.span>
            )}
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
