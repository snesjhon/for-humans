'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './HashMapTrace.module.css';

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

const CELL_STYLES: Record<string, string> = {
  'hm-cell-current': styles.cellCurrent,
  'hm-cell-visited': styles.cellVisited,
  'hm-cell-upcoming': styles.cellUpcoming,
};

const BADGE_STYLES: Record<NonNullable<HashMapStep['action']>, string> = {
  insert: styles.badgeInsert,
  found: styles.badgeFound,
  miss: styles.badgeMiss,
  update: styles.badgeUpdate,
  done: styles.badgeDone,
};

export default function HashMapTrace({ steps }: { steps: HashMapStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const isSetMode = step.map.some(([, v]) => v === null);

  return (
    <div className={shared.root}>
      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span><span className={`${shared.ptr} ${styles.ptrCurrent}`}>i</span> current</span>
        </div>
        <div className={shared.nav}>
          <button className={shared.button} disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>
            <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Prev
          </button>
          <span className={shared.counter}>{idx + 1} / {steps.length}</span>
          <button className={shared.button} disabled={idx === steps.length - 1} onClick={() => setIdx(i => i + 1)}>
            Next
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Body: visualization + badge + label ── */}
      <div className={shared.body}>
        <LayoutGroup>
          <div className={shared.array}>
            {step.input.map((val, i) => {
              const state = inputCellState(i, step.currentI);
              const isCurrent = i === step.currentI;
              return (
                <div key={i} className={shared.col}>
                  <div className={`${shared.cell} ${CELL_STYLES[state]}`}>{val}</div>
                  <div className={shared.idx}>{i}</div>
                  <div className={shared.ptrs}>
                    {isCurrent && <motion.span layoutId="hm-i" className={`${shared.ptr} ${styles.ptrCurrent}`}>i</motion.span>}
                  </div>
                </div>
              );
            })}
          </div>
        </LayoutGroup>

        {step.vars && step.vars.length > 0 && (
          <div className={styles.vars}>
            {step.vars.map((v) => (
              <span key={v.name} className={styles.var}>
                <span className={styles.varName}>{v.name}</span>
                <span className={styles.varEq}> = </span>
                <span className={styles.varVal}>{v.value}</span>
              </span>
            ))}
          </div>
        )}

        <div className={styles.map}>
          <span className={styles.mapLabel}>{isSetMode ? 'set' : 'map'}</span>
          <div className={styles.mapEntries}>
            <AnimatePresence mode="popLayout">
              {step.map.length === 0 ? (
                <span className={styles.mapEmpty}>empty</span>
              ) : (
                step.map.map(([key, value]) => {
                  const isHighlighted =
                    step.highlight !== undefined &&
                    step.highlight !== null &&
                    key === step.highlight;
                  const colorClass = isHighlighted
                    ? step.action === 'insert'
                      ? styles.entryInsert
                      : step.action === 'update'
                        ? styles.entryUpdate
                        : step.action === 'found'
                          ? styles.entryFound
                          : ''
                    : '';
                  return (
                    <motion.div
                      key={String(key)}
                      className={`${styles.entry}${colorClass ? ` ${colorClass}` : ''}`}
                      layout
                      initial={{ scale: 0.75, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.75, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    >
                      <span className={styles.entryKey}>{String(key)}</span>
                      {value !== null && (
                        <>
                          <MoveRight aria-hidden="true" className={styles.entryArrow} strokeWidth={1.9} />
                          <span className={styles.entryVal}>{String(value)}</span>
                        </>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
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
