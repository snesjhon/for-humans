'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './StackQueueTrace.module.css';

type StructureColor = 'blue' | 'orange' | 'green' | 'purple';

export interface StackQueuePointer {
  index: number;
  label: string;
}

export interface StackQueueStructure {
  kind: 'stack' | 'queue';
  label: string;
  items: Array<string | number>;
  color?: StructureColor;
  pointers?: StackQueuePointer[];
  activeIndices?: number[];
  emptyLabel?: string;
}

export interface StackQueueStep {
  structures: StackQueueStructure[];
  action:
    | 'push'
    | 'pop'
    | 'peek'
    | 'transfer'
    | 'enqueue'
    | 'dequeue'
    | 'done'
    | null;
  label: string;
}

const badgeLabel: Record<NonNullable<StackQueueStep['action']>, string> = {
  push: 'PUSH',
  pop: 'POP',
  peek: 'PEEK',
  transfer: 'TRANSFER',
  enqueue: 'ENQUEUE',
  dequeue: 'DEQUEUE',
  done: 'DONE',
};

function colorCls(color?: StructureColor): StructureColor {
  return color ?? 'blue';
}

function itemClass(
  structure: StackQueueStructure,
  itemIndex: number,
): string {
  const color = colorCls(structure.color);
  const active = structure.activeIndices?.includes(itemIndex);
  if (active) {
    return color === 'blue'
      ? styles.cellBlue
      : color === 'orange'
        ? styles.cellOrange
        : color === 'green'
          ? styles.cellGreen
          : styles.cellPurple;
  }
  return styles.cellMuted;
}

function renderStack(structure: StackQueueStructure) {
  const items = structure.items;
  const pointers = structure.pointers ?? [];
  const topIndex = items.length - 1;
  const orderedIndices = Array.from({ length: items.length }, (_, i) => topIndex - i);

  return (
    <div className={styles.structure}>
      <div className={styles.structureHeader}>
        <span className={styles.structureTitle}>{structure.label}</span>
        <span className={styles.structureKind}>stack</span>
      </div>

      <div className={styles.stackShell}>
        {items.length === 0 ? (
          <div className={styles.empty}>{structure.emptyLabel ?? 'empty'}</div>
        ) : (
          <div className={styles.stackCol}>
            {orderedIndices.map((itemIndex) => {
              const item = items[itemIndex];
              const itemPointers = pointers.filter((pointer) => pointer.index === itemIndex);
              const isTop = itemIndex === topIndex;
              return (
                <div key={`${structure.label}-${itemIndex}`} className={styles.stackSlot}>
                  <div className={styles.pointerRow}>
                    {itemPointers.map((pointer) => (
                      <span
                        key={`${structure.label}-${pointer.label}-${pointer.index}`}
                        className={`${shared.ptr} ${
                          colorCls(structure.color) === 'blue'
                            ? styles.ptrBlue
                            : colorCls(structure.color) === 'orange'
                              ? styles.ptrOrange
                              : colorCls(structure.color) === 'green'
                                ? styles.ptrGreen
                                : styles.ptrPurple
                        }`}
                      >
                        {pointer.label}
                      </span>
                    ))}
                    {isTop && itemPointers.length === 0 && (
                      <span className={styles.pointerPlaceholder} aria-hidden />
                    )}
                  </div>
                  <div className={`${shared.cell} ${itemClass(structure, itemIndex)}`}>
                    {item}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.footnote}>bottom → top</div>
    </div>
  );
}

function renderQueue(structure: StackQueueStructure) {
  const items = structure.items;
  const pointers = structure.pointers ?? [];

  return (
    <div className={styles.structure}>
      <div className={styles.structureHeader}>
        <span className={styles.structureTitle}>{structure.label}</span>
        <span className={styles.structureKind}>queue</span>
      </div>

      <div className={styles.queueShell}>
        {items.length === 0 ? (
          <div className={styles.empty}>{structure.emptyLabel ?? 'empty'}</div>
        ) : (
          <div className={styles.queueRow}>
            {items.map((item, itemIndex) => {
              const itemPointers = pointers.filter((pointer) => pointer.index === itemIndex);
              return (
                <div key={`${structure.label}-${itemIndex}`} className={styles.queueSlot}>
                  <div className={styles.pointerRow}>
                    {itemPointers.map((pointer) => (
                      <span
                        key={`${structure.label}-${pointer.label}-${pointer.index}`}
                        className={`${shared.ptr} ${
                          colorCls(structure.color) === 'blue'
                            ? styles.ptrBlue
                            : colorCls(structure.color) === 'orange'
                              ? styles.ptrOrange
                              : colorCls(structure.color) === 'green'
                                ? styles.ptrGreen
                                : styles.ptrPurple
                        }`}
                      >
                        {pointer.label}
                      </span>
                    ))}
                  </div>
                  <div className={`${shared.cell} ${itemClass(structure, itemIndex)}`}>
                    {item}
                  </div>
                  <div className={styles.queueIdx}>{itemIndex}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.footnote}>front → back</div>
    </div>
  );
}

function pointerColorClass(color?: StructureColor): string {
  const resolved = colorCls(color);
  return resolved === 'blue'
    ? styles.ptrBlue
    : resolved === 'orange'
      ? styles.ptrOrange
      : resolved === 'green'
        ? styles.ptrGreen
        : styles.ptrPurple;
}

const BADGE_STYLES: Record<NonNullable<StackQueueStep['action']>, string> = {
  push: styles.badgePush,
  pop: styles.badgePop,
  peek: styles.badgePeek,
  transfer: styles.badgeTransfer,
  enqueue: styles.badgeEnqueue,
  dequeue: styles.badgeDequeue,
  done: styles.badgeDone,
};

export default function StackQueueTrace({ steps }: { steps: StackQueueStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  return (
    <div className={shared.root}>
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span><span className={`${shared.ptr} ${styles.ptrBlue}`}>LIFO</span> stack order</span>
          <span><span className={`${shared.ptr} ${styles.ptrGreen}`}>FIFO</span> queue order</span>
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
          <span className={shared.counter}>{idx + 1} / {steps.length}</span>
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
        <div className={styles.grid}>
          {step.structures.map((structure) =>
            structure.kind === 'stack'
              ? (
                <div key={structure.label}>
                  {renderStack(structure)}
                </div>
              )
              : (
                <div key={structure.label} className={styles.gridItemQueue}>
                  {renderQueue(structure)}
                </div>
              ),
          )}
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
                {badgeLabel[step.action]}
              </motion.span>
            )}
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
