'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraceLabel } from '../TraceLabel/TraceLabel';

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
  if (active) return `sq-cell-${color}`;
  return 'sq-cell-muted';
}

function renderStack(structure: StackQueueStructure) {
  const items = structure.items;
  const pointers = structure.pointers ?? [];
  const topIndex = items.length - 1;
  const orderedIndices = Array.from({ length: items.length }, (_, i) => topIndex - i);

  return (
    <div className="sq-structure sq-structure-stack">
      <div className="sq-structure-header">
        <span className="sq-structure-title">{structure.label}</span>
        <span className="sq-structure-kind">stack</span>
      </div>

      <div className="sq-stack-shell">
        {items.length === 0 ? (
          <div className="sq-empty">{structure.emptyLabel ?? 'empty'}</div>
        ) : (
          <div className="sq-stack-col">
            {orderedIndices.map((itemIndex) => {
              const item = items[itemIndex];
              const itemPointers = pointers.filter((pointer) => pointer.index === itemIndex);
              const isTop = itemIndex === topIndex;
              return (
                <div key={`${structure.label}-${itemIndex}`} className="sq-stack-slot">
                  <div className="sq-pointer-row">
                    {itemPointers.map((pointer) => (
                      <span
                        key={`${structure.label}-${pointer.label}-${pointer.index}`}
                        className={`dfh-ptr sq-ptr-${colorCls(structure.color)}`}
                      >
                        {pointer.label}
                      </span>
                    ))}
                    {isTop && itemPointers.length === 0 && (
                      <span className="sq-pointer-placeholder" aria-hidden />
                    )}
                  </div>
                  <div className={`dfh-trace-cell ${itemClass(structure, itemIndex)}`}>
                    {item}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="sq-footnote">bottom → top</div>
    </div>
  );
}

function renderQueue(structure: StackQueueStructure) {
  const items = structure.items;
  const pointers = structure.pointers ?? [];

  return (
    <div className="sq-structure sq-structure-queue">
      <div className="sq-structure-header">
        <span className="sq-structure-title">{structure.label}</span>
        <span className="sq-structure-kind">queue</span>
      </div>

      <div className="sq-queue-shell">
        {items.length === 0 ? (
          <div className="sq-empty">{structure.emptyLabel ?? 'empty'}</div>
        ) : (
          <div className="sq-queue-row">
            {items.map((item, itemIndex) => {
              const itemPointers = pointers.filter((pointer) => pointer.index === itemIndex);
              return (
                <div key={`${structure.label}-${itemIndex}`} className="sq-queue-slot">
                  <div className="sq-pointer-row">
                    {itemPointers.map((pointer) => (
                      <span
                        key={`${structure.label}-${pointer.label}-${pointer.index}`}
                        className={`dfh-ptr sq-ptr-${colorCls(structure.color)}`}
                      >
                        {pointer.label}
                      </span>
                    ))}
                  </div>
                  <div className={`dfh-trace-cell ${itemClass(structure, itemIndex)}`}>
                    {item}
                  </div>
                  <div className="sq-queue-idx">{itemIndex}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="sq-footnote">front → back</div>
    </div>
  );
}

export default function StackQueueTrace({ steps }: { steps: StackQueueStep[] }) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  return (
    <div className="dfh-trace">
      <div className="dfh-trace-topbar">
        <div className="dfh-trace-legend">
          <span><span className="dfh-ptr sq-ptr-blue">LIFO</span> stack order</span>
          <span><span className="dfh-ptr sq-ptr-green">FIFO</span> queue order</span>
        </div>
        <div className="dfh-trace-nav">
          <button
            className="dfh-trace-btn"
            disabled={idx === 0}
            onClick={() => setIdx((i) => i - 1)}
          >
            ← Prev
          </button>
          <span className="dfh-trace-counter">{idx + 1} / {steps.length}</span>
          <button
            className="dfh-trace-btn"
            disabled={idx === steps.length - 1}
            onClick={() => setIdx((i) => i + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="dfh-trace-body">
        <div className="sq-grid">
          {step.structures.map((structure) =>
            structure.kind === 'stack'
              ? (
                <div key={structure.label} className="sq-grid-item sq-grid-item-stack">
                  {renderStack(structure)}
                </div>
              )
              : (
                <div key={structure.label} className="sq-grid-item sq-grid-item-queue">
                  {renderQueue(structure)}
                </div>
              ),
          )}
        </div>

        <div className="dfh-trace-info">
          <AnimatePresence mode="popLayout">
            {step.action && (
              <motion.span
                key={step.action}
                className={`dfh-trace-badge sq-badge-${step.action}`}
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
