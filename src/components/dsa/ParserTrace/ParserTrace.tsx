'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './ParserTrace.module.css';

type ParserRegionTone =
  | 'consumed'
  | 'label'
  | 'separator'
  | 'payload'
  | 'active'
  | 'upcoming';

type ParserPointerTone = 'blue' | 'orange' | 'green' | 'purple';
type ParserFactTone = 'neutral' | 'blue' | 'orange' | 'green' | 'purple';

export interface ParserTraceRegion {
  start: number;
  end: number;
  tone: ParserRegionTone;
}

export interface ParserTracePointer {
  index: number;
  label: string;
  tone?: ParserPointerTone;
}

export interface ParserTraceFact {
  name: string;
  value: string | number;
  tone?: ParserFactTone;
}

export interface ParserTraceStep {
  tape: Array<string | number>;
  regions?: ParserTraceRegion[];
  pointers?: ParserTracePointer[];
  facts?: ParserTraceFact[];
  action: 'scan' | 'read' | 'take' | 'emit' | 'jump' | 'done' | null;
  label: string;
}

const REGION_PRIORITY: ParserRegionTone[] = [
  'consumed',
  'upcoming',
  'label',
  'payload',
  'active',
  'separator',
];

const CELL_STYLES: Record<ParserRegionTone, string> = {
  consumed: styles.cellConsumed,
  label: styles.cellLabel,
  separator: styles.cellSeparator,
  payload: styles.cellPayload,
  active: styles.cellActive,
  upcoming: styles.cellUpcoming,
};

const POINTER_STYLES: Record<ParserPointerTone, string> = {
  blue: styles.ptrBlue,
  orange: styles.ptrOrange,
  green: styles.ptrGreen,
  purple: styles.ptrPurple,
};

const FACT_STYLES: Record<ParserFactTone, string> = {
  neutral: styles.factNeutral,
  blue: styles.factBlue,
  orange: styles.factOrange,
  green: styles.factGreen,
  purple: styles.factPurple,
};

const BADGE_STYLES: Record<NonNullable<ParserTraceStep['action']>, string> = {
  scan: shared.actionMatch,
  read: styles.badgeRead,
  take: shared.actionKeep,
  emit: styles.badgeEmit,
  jump: styles.badgeJump,
  done: shared.actionDone,
};

const BADGE_LABELS: Record<NonNullable<ParserTraceStep['action']>, string> = {
  scan: 'SCAN',
  read: 'READ',
  take: 'TAKE',
  emit: 'EMIT',
  jump: 'JUMP',
  done: 'DONE',
};

function cellState(i: number, step: ParserTraceStep): ParserRegionTone {
  const regions = step.regions ?? [];

  for (let p = REGION_PRIORITY.length - 1; p >= 0; p -= 1) {
    const tone = REGION_PRIORITY[p];
    if (regions.some((region) => region.tone === tone && i >= region.start && i <= region.end)) {
      return tone;
    }
  }

  return 'upcoming';
}

function pointerStyle(tone?: ParserPointerTone): string {
  return POINTER_STYLES[tone ?? 'blue'];
}

function factStyle(tone?: ParserFactTone): string {
  return FACT_STYLES[tone ?? 'neutral'];
}

export default function ParserTrace({ steps }: { steps: ParserTraceStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const legend = useMemo(() => {
    const regions = new Set<ParserRegionTone>();
    let hasPointers = false;

    for (const traceStep of steps) {
      for (const region of traceStep.regions ?? []) regions.add(region.tone);
      if ((traceStep.pointers?.length ?? 0) > 0) hasPointers = true;
    }

    return {
      hasPointers,
      hasLabel: regions.has('label'),
      hasSeparator: regions.has('separator'),
      hasPayload: regions.has('payload') || regions.has('active'),
      hasConsumed: regions.has('consumed'),
    };
  }, [steps]);

  return (
    <div className={shared.root}>
      <div className={shared.topbar}>
        <div className={shared.legend}>
          {legend.hasPointers ? (
            <span>
              <span className={`${shared.ptr} ${styles.ptrBlue}`}>P</span>
              pointer
            </span>
          ) : null}
          {legend.hasLabel ? (
            <span>
              <span className={`${shared.ptr} ${styles.legendLabel}`}>L</span>
              label
            </span>
          ) : null}
          {legend.hasSeparator ? (
            <span>
              <span className={`${shared.ptr} ${styles.legendSeparator}`}>#</span>
              boundary
            </span>
          ) : null}
          {legend.hasPayload ? (
            <span>
              <span className={`${shared.ptr} ${styles.legendPayload}`}>V</span>
              payload
            </span>
          ) : null}
          {legend.hasConsumed ? (
            <span>
              <span className={`${shared.ptr} ${styles.legendConsumed}`}>D</span>
              done
            </span>
          ) : null}
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
        <div className={shared.array}>
          {step.tape.map((value, i) => {
            const pointers = (step.pointers ?? []).filter((pointer) => pointer.index === i);
            return (
              <div key={i} className={shared.col}>
                <div className={`${shared.cell} ${CELL_STYLES[cellState(i, step)]}`}>
                  {value === '' ? '""' : value}
                </div>
                <div className={shared.idx}>{i}</div>
                <div className={shared.ptrs}>
                  {pointers.map((pointer) => (
                    <span
                      key={`${pointer.label}-${pointer.index}`}
                      className={`${shared.ptr} ${pointerStyle(pointer.tone)}`}
                    >
                      {pointer.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {step.facts && step.facts.length > 0 ? (
          <div className={styles.facts}>
            {step.facts.map((fact) => (
              <span
                key={`${fact.name}-${fact.value}`}
                className={`${styles.fact} ${factStyle(fact.tone)}`}
              >
                <span className={styles.factName}>{fact.name}</span>
                <span className={styles.factValue}>{String(fact.value)}</span>
              </span>
            ))}
          </div>
        ) : null}

        <div className={shared.info}>
          <AnimatePresence mode="popLayout">
            {step.action ? (
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
            ) : null}
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
