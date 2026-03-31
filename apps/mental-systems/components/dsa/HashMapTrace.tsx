'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { TraceLabel } from './TraceLabel';

export interface HashMapStep {
  input: (string | number)[];
  currentI: number;
  map: [string | number, string | number | null][];
  highlight?: string | number | null;
  action: 'insert' | 'found' | 'miss' | 'update' | 'done' | null;
  label: string;
  vars?: { name: string; value: string | number }[];
}

const ACTION_LABELS: Record<string, string> = {
  insert: 'INSERT',
  found: 'FOUND',
  miss: 'MISS',
  update: 'UPDATE',
  done: 'DONE',
};

function inputCellState(i: number, currentI: number): string {
  if (currentI === -2) return 'hm-cell-visited';
  if (i === currentI) return 'hm-cell-current';
  if (i < currentI) return 'hm-cell-visited';
  return 'hm-cell-upcoming';
}

export default function HashMapTrace({ steps }: { steps: HashMapStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const isSetMode = step.map.some(([, v]) => v === null);

  return (
    <div className="dfh-trace">
      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className="dfh-trace-topbar">
        <div className="dfh-trace-legend">
          <span><span className="dfh-ptr hm-ptr-cur">i</span> current</span>
        </div>
        <div className="dfh-trace-nav">
          <button className="dfh-trace-btn" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>← Prev</button>
          <span className="dfh-trace-counter">{idx + 1} / {steps.length}</span>
          <button className="dfh-trace-btn" disabled={idx === steps.length - 1} onClick={() => setIdx(i => i + 1)}>Next →</button>
        </div>
      </div>

      {/* ── Body: visualization + badge + label ── */}
      <div className="dfh-trace-body">
        <LayoutGroup>
          <div className="dfh-trace-array">
            {step.input.map((val, i) => {
              const state = inputCellState(i, step.currentI);
              const isCurrent = i === step.currentI;
              return (
                <div key={i} className="dfh-trace-col">
                  <div className={`dfh-trace-cell ${state}`}>{val}</div>
                  <div className="dfh-trace-idx">{i}</div>
                  <div className="dfh-trace-ptrs">
                    {isCurrent && <motion.span layoutId="hm-i" className="dfh-ptr hm-ptr-cur">i</motion.span>}
                  </div>
                </div>
              );
            })}
          </div>
        </LayoutGroup>

        {step.vars && step.vars.length > 0 && (
          <div className="hm-vars">
            {step.vars.map((v) => (
              <span key={v.name} className="hm-var">
                <span className="hm-var-name">{v.name}</span>
                <span className="hm-var-eq"> = </span>
                <span className="hm-var-val">{v.value}</span>
              </span>
            ))}
          </div>
        )}

        <div className="hm-map">
          <span className="hm-map-label">{isSetMode ? 'set' : 'map'}</span>
          <div className="hm-map-entries">
            <AnimatePresence mode="popLayout">
              {step.map.length === 0 ? (
                <span className="hm-map-empty">empty</span>
              ) : (
                step.map.map(([key, value]) => {
                  const isHighlighted =
                    step.highlight !== undefined &&
                    step.highlight !== null &&
                    key === step.highlight;
                  const colorClass = isHighlighted ? `hm-entry-${step.action ?? ''}` : '';
                  return (
                    <motion.div
                      key={String(key)}
                      className={`hm-entry ${colorClass}`}
                      layout
                      initial={{ scale: 0.75, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.75, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    >
                      <span className="hm-entry-key">{String(key)}</span>
                      {value !== null && (
                        <>
                          <span className="hm-entry-arrow">→</span>
                          <span className="hm-entry-val">{String(value)}</span>
                        </>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="dfh-trace-info">
          <AnimatePresence mode="popLayout">
            {step.action && (
              <motion.span
                key={step.action}
                className={`dfh-trace-badge hm-badge-${step.action}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                {ACTION_LABELS[step.action] ?? step.action.toUpperCase()}
              </motion.span>
            )}
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
