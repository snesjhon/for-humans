'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';

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

const CELL_STYLES: Record<string, string> = {
  confirmed: shared.confirmed,
  'write-target': shared.writeTarget,
  'reading-keep': shared.readingKeep,
  'reading-skip': shared.readingSkip,
  reading: shared.reading,
  graveyard: shared.graveyard,
  active: shared.active,
  unvisited: shared.unvisited,
  irrelevant: shared.irrelevant,
};

const BADGE_STYLES: Record<NonNullable<TraceStep['action']>, string> = {
  keep: shared.actionKeep,
  skip: shared.actionSkip,
  done: shared.actionDone,
};

export default function ArrayTrace({ steps }: { steps: TraceStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const isDone = step.action === 'done';

  return (
    <div className={shared.root}>
      {/* ── Topbar: legend (left) + nav (right) ── */}
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span><span className={`${shared.ptr} ${shared.reader}`}>R</span> reader</span>
          <span><span className={`${shared.ptr} ${shared.writer}`}>W</span> writer</span>
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
        <div className={shared.array}>
          {step.array.map((val, i) => {
            const state = cellState(i, step);
            const isReader = i === step.reader && !isDone;
            const isWriter = i === step.writer && !isDone;
            return (
              <div key={i} className={shared.col}>
                <div className={`${shared.cell} ${CELL_STYLES[state]}`}>{val}</div>
                <div className={shared.idx}>{i}</div>
                <div className={shared.ptrs}>
                  {isReader && isWriter && <span className={`${shared.ptr} ${shared.both}`}>R W</span>}
                  {isReader && !isWriter && <span className={`${shared.ptr} ${shared.reader}`}>R</span>}
                  {isWriter && !isReader && <span className={`${shared.ptr} ${shared.writer}`}>W</span>}
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
