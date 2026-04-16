'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TraceLabel } from '../TraceLabel/TraceLabel';
import shared from '../TraceShared/TraceShared.module.css';
import styles from './SubsetTrace.module.css';

export interface SubsetTraceStep {
  nums: number[];
  start: number;    // index currently being examined; nums.length = all slots visited
  basket: number[]; // current subset contents
  action: 'add' | 'remove' | 'record' | 'done';
  label: string;
}

export interface SubsetTraceLabels {
  position?: string;
  selection?: string;
  source?: string;
  pointer?: string;
}

const BADGE_LABELS: Record<SubsetTraceStep['action'], string> = {
  add: 'ADD',
  remove: 'REMOVE',
  record: 'RECORD',
  done: 'DONE',
};

const BADGE_STYLES: Record<SubsetTraceStep['action'], string> = {
  add: styles.badgeAdd,
  remove: styles.badgeRemove,
  record: styles.badgeRecord,
  done: styles.badgeDone,
};

interface DecisionNode {
  basket: number[];
  start: number;
  key: string;
  children: DecisionNode[];
}

interface TraceTreeState {
  root: DecisionNode | null;
  activeNodeKey: string | null;
  previewChild?: {
    parentKey: string;
    basket: number[];
  };
}

function nodeKeyFromBasket(stepIndex: number, basket: number[]): string {
  return `${stepIndex}:${basket.join(',')}`;
}

function buildTraceTree(
  steps: SubsetTraceStep[],
  activeIdx: number,
): TraceTreeState {
  const stack: DecisionNode[] = [];
  let root: DecisionNode | null = null;
  let activeNodeKey: string | null = null;
  let previewChild: TraceTreeState['previewChild'];

  steps.slice(0, activeIdx + 1).forEach((traceStep, stepIndex) => {
    if (traceStep.action === 'record') {
      const node: DecisionNode = {
        basket: [...traceStep.basket],
        start: traceStep.start,
        key: nodeKeyFromBasket(stepIndex, traceStep.basket),
        children: [],
      };

      if (stack.length === 0) {
        root = node;
      } else {
        stack[stack.length - 1].children.push(node);
      }

      stack.push(node);
      activeNodeKey = node.key;
      previewChild = undefined;
      return;
    }

    if (traceStep.action === 'add') {
      activeNodeKey = stack[stack.length - 1]?.key ?? null;

      if (stepIndex === activeIdx && stack.length > 0) {
        previewChild = {
          parentKey: stack[stack.length - 1].key,
          basket: [...traceStep.basket],
        };
      }
      return;
    }

    if (traceStep.action === 'remove') {
      if (stack.length > 1) stack.pop();
      activeNodeKey = stack[stack.length - 1]?.key ?? null;
      previewChild = undefined;
      return;
    }

    activeNodeKey = stack[0]?.key ?? activeNodeKey;
    previewChild = undefined;
  });

  return { root, activeNodeKey, previewChild };
}

function formatSubset(values: number[]): string {
  if (values.length === 0) return '{}';
  return `{ ${values.join(', ')} }`;
}

function edgeLabel(parent: number[], child: number[]): string {
  const next = child[child.length - 1];
  if (next === undefined || child.length <= parent.length) return 'recurse';
  return `+${next}`;
}

function isLeaf(node: DecisionNode, numsLength: number): boolean {
  return node.start === numsLength;
}

export default function SubsetTrace({
  steps,
  labels,
}: {
  steps: SubsetTraceStep[];
  labels?: SubsetTraceLabels;
}) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const selectionLabel = labels?.selection ?? 'basket';
  const sourceLabel = labels?.source ?? 'nums';
  const tree = buildTraceTree(steps, idx);

  function renderNode(node: DecisionNode): JSX.Element {
    const current = node.key === tree.activeNodeKey;
    const leaf = isLeaf(node, step.nums.length);
    const children = [...node.children];
    const preview =
      tree.previewChild?.parentKey === node.key ? tree.previewChild : undefined;

    return (
      <div className={styles.subtree} key={node.key}>
        <div className={styles.nodeWrap}>
          <div className={`${styles.nodeCard} ${current ? styles.nodeCurrent : ''}`}>
            <div className={styles.nodeMeta}>{sourceLabel}[{node.start}]</div>
            <div className={styles.nodeSubset}>
              {selectionLabel} = {formatSubset(node.basket)}
            </div>
            {leaf && (
              <div className={styles.subsetText}>
                subset recorded
              </div>
            )}
          </div>
        </div>

        {(children.length > 0 || preview) && (
          <div className={styles.children}>
            {children.map((child) => (
              <div className={styles.child} key={child.key}>
                <div className={`${styles.branchLabel} ${styles.branchInclude}`}>
                  {edgeLabel(node.basket, child.basket)}
                </div>
                {renderNode(child)}
              </div>
            ))}
            {preview && (
              <div className={styles.child}>
                <div className={`${styles.branchLabel} ${styles.branchPreview}`}>
                  {edgeLabel(node.basket, preview.basket)}
                </div>
                <div className={styles.previewNode}>
                  <div className={styles.nodeMeta}>next call</div>
                  <div className={styles.nodeSubset}>
                    {selectionLabel} = {formatSubset(preview.basket)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={shared.root}>
      <div className={shared.topbar}>
        <div className={shared.legend}>
          <span>
            <span className={`${shared.ptr} ${styles.ptrIncluded}`}>in</span>
            included
          </span>
          <span>
            <span className={`${shared.ptr} ${styles.ptrExcluded}`}>out</span>
            excluded
          </span>
          <span>
            <span className={`${shared.ptr} ${styles.ptrCurrent}`}>now</span>
            current node
          </span>
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
        <div className={styles.treeScroller}>
          <div className={styles.tree}>
            <div className={styles.treeTitle}>{sourceLabel} recursion tree</div>
            {tree.root ? renderNode(tree.root) : null}
          </div>
        </div>

        <div className={shared.info}>
          <AnimatePresence mode="popLayout">
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
          </AnimatePresence>
          <TraceLabel raw={step.label} />
        </div>
      </div>
    </div>
  );
}
