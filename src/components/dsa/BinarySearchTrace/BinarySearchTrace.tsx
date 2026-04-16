'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './BinarySearchTrace.module.css';

export interface BinarySearchStep {
  values: Array<number | string>;
  left: number | null;
  mid: number | null;
  right: number | null;
  action:
    | 'check'
    | 'discard-left'
    | 'discard-right'
    | 'found'
    | 'candidate'
    | 'done'
    | null;
  label: string;
}

function pointerCount(step: BinarySearchStep, i: number): number {
  return Number(step.left === i) + Number(step.mid === i) + Number(step.right === i);
}

function inActiveRange(step: BinarySearchStep, i: number): boolean {
  if (step.left === null || step.right === null) return false;
  return i >= step.left && i <= step.right;
}

function cellState(i: number, step: BinarySearchStep): string {
  if (step.action === 'found') return i === step.mid ? 'found' : inActiveRange(step, i) ? 'activeRange' : 'discarded';
  if (step.action === 'candidate') return i === step.mid ? 'candidate' : inActiveRange(step, i) ? 'activeRange' : 'discarded';
  if (step.action === 'done') return i === step.left ? 'candidate' : inActiveRange(step, i) ? 'activeRange' : 'discarded';

  if (!inActiveRange(step, i)) return 'discarded';

  const count = pointerCount(step, i);
  if (count === 3) return 'allThree';
  if (step.left === i && step.mid === i) return 'leftMid';
  if (step.right === i && step.mid === i) return 'rightMid';
  if (step.left === i && step.right === i) return 'leftRight';
  if (step.mid === i) return 'mid';
  if (step.left === i) return 'left';
  if (step.right === i) return 'right';
  return 'activeRange';
}

const CELL_STYLES: Record<string, string> = {
  discarded: styles.discarded,
  activeRange: styles.activeRange,
  left: styles.left,
  right: styles.right,
  mid: styles.mid,
  found: styles.found,
  candidate: styles.candidate,
  leftMid: styles.leftMid,
  rightMid: styles.rightMid,
  leftRight: styles.leftRight,
  allThree: styles.allThree,
};

const BADGE_STYLES: Record<NonNullable<BinarySearchStep['action']>, string> = {
  check: shared.actionMatch,
  'discard-left': shared.actionMismatch,
  'discard-right': shared.actionMismatch,
  found: shared.actionKeep,
  candidate: shared.actionKeep,
  done: shared.actionDone,
};

function badgeLabel(action: NonNullable<BinarySearchStep['action']>): string {
  switch (action) {
    case 'check':
      return 'CHECK';
    case 'discard-left':
      return 'DROP LEFT';
    case 'discard-right':
      return 'DROP RIGHT';
    case 'found':
      return 'FOUND';
    case 'candidate':
      return 'KEEP';
    case 'done':
      return 'DONE';
  }
}

export default function BinarySearchTrace({
  steps,
}: {
  steps: BinarySearchStep[];
}) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const isDone = step.action === 'done';

  return (
    <div className={shared.root}>
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span>
            <span className={`${shared.ptr} ${styles.leftPtr}`}>L</span>
            left
          </span>
          <span>
            <span className={`${shared.ptr} ${styles.midPtr}`}>M</span>
            mid
          </span>
          <span>
            <span className={`${shared.ptr} ${styles.rightPtr}`}>R</span>
            right
          </span>
          {isDone && step.left !== null ? (
            <span>
              <span className={`${shared.ptr} ${styles.candidatePtr}`}>A</span>
              answer
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
          {step.values.map((value, i) => {
            const state = cellState(i, step);
            const showLeft = !isDone && step.left === i;
            const showMid = !isDone && step.mid === i;
            const showRight = !isDone && step.right === i;
            const showAnswer = isDone && step.left === i;

            return (
              <div key={i} className={shared.col}>
                <div className={`${shared.cell} ${CELL_STYLES[state]}`}>{value}</div>
                <div className={shared.idx}>{i}</div>
                <div className={shared.ptrs}>
                  {showLeft ? <span className={`${shared.ptr} ${styles.leftPtr}`}>L</span> : null}
                  {showMid ? <span className={`${shared.ptr} ${styles.midPtr}`}>M</span> : null}
                  {showRight ? <span className={`${shared.ptr} ${styles.rightPtr}`}>R</span> : null}
                  {showAnswer ? (
                    <span className={`${shared.ptr} ${styles.candidatePtr}`}>A</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

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
                {badgeLabel(step.action)}
              </motion.span>
            ) : null}
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
