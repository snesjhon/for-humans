'use client';

import { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceLabel } from './TraceLabel';

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
  return (
    <svg
      className="ll-arrow"
      width="28"
      height="20"
      viewBox="0 0 28 20"
      fill="none"
      aria-hidden
    >
      <line x1="1" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M17 5 L23 10 L17 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    <div className="dfh-trace">

      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className="dfh-trace-topbar">
        <div className="dfh-trace-legend">
          {legendPtrs.map(p => (
            <span key={p.label}>
              <span className={`dfh-ptr ll-ptr-${colorCls(p.color)}`}>{p.label}</span>
            </span>
          ))}
        </div>
        <div className="dfh-trace-nav">
          <button
            className="dfh-trace-btn"
            disabled={idx === 0}
            onClick={() => setIdx(i => i - 1)}
          >← Prev</button>
          <span className="dfh-trace-counter">{idx + 1} / {steps.length}</span>
          <button
            className="dfh-trace-btn"
            disabled={idx === steps.length - 1}
            onClick={() => setIdx(i => i + 1)}
          >Next →</button>
        </div>
      </div>

      {/* ── Body: linked list + badge + label ── */}
      <div className="dfh-trace-body">
        <div className="ll-row">

          {/* Left null column — only rendered when a pointer is at index -1 */}
          {hasLeftNull && (
            <div className="ll-col-unit">
              <div className="ll-node-col">
                <div className="ll-ptrs-above">
                  {leftNullPtrs.map((p, pi) => (
                    <span key={pi} className={`dfh-ptr ll-ptr-${colorCls(p.color)}`}>
                      {p.label}
                    </span>
                  ))}
                </div>
                <div className="ll-null-box">null</div>
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
                <div className="ll-col-unit">
                  <div className="ll-node-col">
                    <div className="ll-ptrs-above">
                      {nodePtrs.map((p, pi) => (
                        <span key={pi} className={`dfh-ptr ll-ptr-${colorCls(p.color)}`}>
                          {p.label}
                        </span>
                      ))}
                    </div>
                    <div className={`ll-node${primaryColor ? ` ll-node-${primaryColor}` : ''}`}>
                      {node.val}
                    </div>
                  </div>
                  <Arrow />
                </div>
              </Fragment>
            );
          })}

          {/* Null terminus */}
          <div className="ll-col-unit">
            <div className="ll-node-col">
              <div className="ll-ptrs-above">
                {nullTermPtrs.map((p, pi) => (
                  <span key={pi} className={`dfh-ptr ll-ptr-${colorCls(p.color)}`}>
                    {p.label}
                  </span>
                ))}
              </div>
              <div className="ll-null-box">null</div>
            </div>
          </div>

        </div>

        {/* Badge + label */}
        <div className="dfh-trace-info">
          <AnimatePresence mode="popLayout">
            {step.action && (
              <motion.span
                key={step.action}
                className={`dfh-trace-badge ll-badge-${step.action}`}
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
