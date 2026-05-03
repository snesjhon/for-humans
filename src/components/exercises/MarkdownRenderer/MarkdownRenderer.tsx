'use client';

import dynamic from 'next/dynamic';
import BaseMarkdownRenderer, {
  type BaseSegment,
} from '@/components/ui/MarkdownRenderer/MarkdownRenderer';
import type { TraceStep } from '@/components/dsa/ArrayTrace/ArrayTrace';
import type { TwoPointerStep } from '@/components/dsa/TwoPointerTrace/TwoPointerTrace';
import type { PrefixSuffixStep } from '@/components/dsa/PrefixSuffixTrace/PrefixSuffixTrace';
import type { HashMapStep } from '@/components/dsa/HashMapTrace/HashMapTrace';
import type { LinkedListStep } from '@/components/dsa/LinkedListTrace/LinkedListTrace';
import type { DoublyLinkedListStep } from '@/components/dsa/DoublyLinkedListTrace/DoublyLinkedListTrace';
import type { StackQueueStep } from '@/components/dsa/StackQueueTrace/StackQueueTrace';
import type {
  SubsetTraceLabels,
  SubsetTraceStep,
} from '@/components/dsa/SubsetTrace/SubsetTrace';
import type { BinarySearchStep } from '@/components/dsa/BinarySearchTrace/BinarySearchTrace';
import type { BinaryTreeTraceStep } from '@/components/dsa/BinaryTreeTrace/BinaryTreeTrace';
import type { ParserTraceStep } from '@/components/dsa/ParserTrace/ParserTrace';
import type { GraphTraceStep } from '@/components/dsa/GraphTrace/GraphTrace';

const WebContainerEmbed = dynamic(
  () => import('../WebContainerEmbed/WebContainerEmbed'),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-4 text-sm text-[var(--ms-text-faint)]">
        Loading editor...
      </div>
    ),
  },
);

const ArrayTrace = dynamic(() => import('@/components/dsa/ArrayTrace/ArrayTrace'));
const TwoPointerTrace = dynamic(() => import('@/components/dsa/TwoPointerTrace/TwoPointerTrace'));
const PrefixSuffixTrace = dynamic(() => import('@/components/dsa/PrefixSuffixTrace/PrefixSuffixTrace'));
const HashMapTrace = dynamic(() => import('@/components/dsa/HashMapTrace/HashMapTrace'));
const LinkedListTrace = dynamic(() => import('@/components/dsa/LinkedListTrace/LinkedListTrace'));
const DoublyLinkedListTrace = dynamic(() => import('@/components/dsa/DoublyLinkedListTrace/DoublyLinkedListTrace'));
const StackQueueTrace = dynamic(() => import('@/components/dsa/StackQueueTrace/StackQueueTrace'));
const SubsetTrace = dynamic(() => import('@/components/dsa/SubsetTrace/SubsetTrace'));
const BinarySearchTrace = dynamic(() => import('@/components/dsa/BinarySearchTrace/BinarySearchTrace'));
const BinaryTreeTrace = dynamic(() => import('@/components/dsa/BinaryTreeTrace/BinaryTreeTrace'));
const ParserTrace = dynamic(() => import('@/components/dsa/ParserTrace/ParserTrace'));
const GraphTrace = dynamic(() => import('@/components/dsa/GraphTrace/GraphTrace'));

// Stackblitz segment types
interface StackBlitzSegment extends BaseSegment {
  type: 'stackblitz';
  file: string;
  step: number;
  total: number;
  solution: string;
}

interface StackBlitzMultiSegment extends BaseSegment {
  type: 'stackblitz-multi';
  step: number;
  total: number;
  exercises: string[];
  solutions: string[];
}

// Trace segment types
type TraceSegment = BaseSegment & { type: 'trace'; steps: TraceStep[] };
type TraceLRSegment = BaseSegment & { type: 'trace-lr'; steps: TwoPointerStep[] };
type TracePSSegment = BaseSegment & { type: 'trace-ps'; steps: PrefixSuffixStep[] };
type TraceMapSegment = BaseSegment & { type: 'trace-map'; steps: HashMapStep[] };
type TraceLLSegment = BaseSegment & { type: 'trace-ll'; steps: LinkedListStep[] };
type TraceDLLSegment = BaseSegment & { type: 'trace-dll'; steps: DoublyLinkedListStep[] };
type TraceSQSegment = BaseSegment & { type: 'trace-sq'; steps: StackQueueStep[] };
type TraceSubsetSegment = BaseSegment & { type: 'trace-subset'; steps: SubsetTraceStep[]; labels?: SubsetTraceLabels };
type TraceBSSegment = BaseSegment & { type: 'trace-bs'; steps: BinarySearchStep[] };
type TraceTreeSegment = BaseSegment & { type: 'trace-tree'; steps: BinaryTreeTraceStep[] };
type TraceParseSegment = BaseSegment & { type: 'trace-parse'; steps: ParserTraceStep[] };
type TraceGraphSegment = BaseSegment & { type: 'trace-graph'; steps: GraphTraceStep[] };

export interface ExerciseMarkdownRendererProps {
  content: string;
  className?: string;
  problemSlug?: string;
  problemId?: string;
  fundamentalsSlug?: string;
  codeFiles?: Record<string, string>;
  exercisePromptsByFile?: Record<string, string>;
  extraPreprocessors?: Array<(segments: BaseSegment[]) => BaseSegment[]>;
  renderExtraSegment?: (
    segment: BaseSegment,
    index: number,
  ) => React.ReactNode | null;
}

function splitStackBlitz(segments: BaseSegment[]): BaseSegment[] {
  const result: BaseSegment[] = [];
  const singleFence =
    /^:::stackblitz\{file="([^"]+)" step=(\d+) total=(\d+) solution="([^"]+)"\}$/gm;
  const multiFence =
    /^:::stackblitz\{step=(\d+) total=(\d+) exercises="([^"]+)" solutions="([^"]+)"\}$/gm;

  for (const seg of segments) {
    if (seg.type !== 'markdown') {
      result.push(seg);
      continue;
    }

    type RawMatch = { index: number; length: number; seg: BaseSegment };
    const matches: RawMatch[] = [];
    const text = 'text' in seg && typeof seg.text === 'string' ? seg.text : '';

    singleFence.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = singleFence.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        seg: {
          type: 'stackblitz',
          file: match[1],
          step: parseInt(match[2], 10),
          total: parseInt(match[3], 10),
          solution: match[4],
        },
      });
    }

    multiFence.lastIndex = 0;
    while ((match = multiFence.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        seg: {
          type: 'stackblitz-multi',
          step: parseInt(match[1], 10),
          total: parseInt(match[2], 10),
          exercises: match[3].split(','),
          solutions: match[4].split(','),
        },
      });
    }

    matches.sort((left, right) => left.index - right.index);

    let cursor = 0;
    for (const hit of matches) {
      if (hit.index > cursor) {
        result.push({ type: 'markdown', text: text.slice(cursor, hit.index) });
      }
      result.push(hit.seg);
      cursor = hit.index + hit.length;
    }

    if (cursor < text.length) {
      result.push({ type: 'markdown', text: text.slice(cursor) });
    }
  }

  return result.filter((segment) => {
    if (segment.type === 'stackblitz' || segment.type === 'stackblitz-multi') {
      return true;
    }
    return (
      segment.type !== 'markdown' ||
      !('text' in segment) ||
      typeof segment.text !== 'string' ||
      segment.text.trim().length > 0
    );
  });
}

function splitTrace(segments: BaseSegment[]): BaseSegment[] {
  const result: BaseSegment[] = [];
  const configs: Array<{
    fence: RegExp;
    type:
      | 'trace'
      | 'trace-lr'
      | 'trace-ps'
      | 'trace-map'
      | 'trace-ll'
      | 'trace-dll'
      | 'trace-sq'
      | 'trace-subset'
      | 'trace-bs'
      | 'trace-tree'
      | 'trace-parse'
      | 'trace-graph';
  }> = [
    { fence: /^:::trace\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace' },
    { fence: /^:::trace-lr\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-lr' },
    { fence: /^:::trace-ps\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-ps' },
    { fence: /^:::trace-map\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-map' },
    { fence: /^:::trace-ll\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-ll' },
    { fence: /^:::trace-dll\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-dll' },
    { fence: /^:::trace-sq\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-sq' },
    { fence: /^:::trace-subset\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-subset' },
    { fence: /^:::trace-bs\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-bs' },
    { fence: /^:::trace-tree\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-tree' },
    { fence: /^:::trace-parse\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-parse' },
    { fence: /^:::trace-graph\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-graph' },
  ];

  for (const seg of segments) {
    if (seg.type !== 'markdown') {
      result.push(seg);
      continue;
    }

    const text = 'text' in seg && typeof seg.text === 'string' ? seg.text : '';

    type RawMatch = {
      index: number;
      length: number;
      json: string;
      type: (typeof configs)[number]['type'];
    };
    const matches: RawMatch[] = [];
    for (const { fence, type } of configs) {
      fence.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = fence.exec(text)) !== null) {
        matches.push({ index: m.index, length: m[0].length, json: m[1], type });
      }
    }
    matches.sort((a, b) => a.index - b.index);

    let cursor = 0;
    for (const hit of matches) {
      if (hit.index > cursor)
        result.push({ type: 'markdown', text: text.slice(cursor, hit.index) });
      try {
        const parsed = JSON.parse(hit.json);
        if (
          hit.type === 'trace-subset' &&
          parsed &&
          !Array.isArray(parsed) &&
          typeof parsed === 'object' &&
          'steps' in parsed
        ) {
          result.push({
            type: hit.type,
            steps: (parsed as { steps: SubsetTraceStep[] }).steps,
            labels: (parsed as { labels?: SubsetTraceLabels }).labels,
          } as BaseSegment);
        } else {
          result.push({ type: hit.type, steps: parsed } as BaseSegment);
        }
      } catch {
        result.push({ type: 'markdown', text: text.slice(hit.index, hit.index + hit.length) });
      }
      cursor = hit.index + hit.length;
    }
    if (cursor < text.length)
      result.push({ type: 'markdown', text: text.slice(cursor) });
  }
  return result.filter(
    (s) =>
      s.type !== 'markdown' ||
      !('text' in s) ||
      typeof s.text !== 'string' ||
      s.text.trim().length > 0,
  );
}

export default function MarkdownRenderer({
  content,
  className,
  problemSlug,
  problemId,
  fundamentalsSlug,
  codeFiles,
  exercisePromptsByFile,
  extraPreprocessors = [],
  renderExtraSegment,
}: ExerciseMarkdownRendererProps) {
  return (
    <BaseMarkdownRenderer
      content={content}
      className={className}
      extraPreprocessors={[...extraPreprocessors, splitTrace, splitStackBlitz]}
      renderExtraSegment={(seg, i) => {
        // Stackblitz embeds
        if (seg.type === 'stackblitz') {
          const stackBlitz = seg as StackBlitzSegment;
          const slug = problemSlug ?? fundamentalsSlug;
          if (!slug) return null;

          const isSolutionOnly = stackBlitz.file === stackBlitz.solution;
          return (
            <WebContainerEmbed
              key={i}
              tabs={
                isSolutionOnly
                  ? [{ label: 'Solution', file: stackBlitz.solution }]
                  : [
                      { label: `Step ${stackBlitz.step}`, file: stackBlitz.file },
                      { label: 'Solution', file: stackBlitz.solution },
                    ]
              }
              step={stackBlitz.step}
              total={stackBlitz.total}
              contentSlug={slug}
              progressStepId={
                !isSolutionOnly && problemId
                  ? `dsa-${problemId}-step-${stackBlitz.step}`
                  : undefined
              }
              base={fundamentalsSlug ? 'fundamentals' : undefined}
              initialFiles={codeFiles}
              exercisePromptsByFile={exercisePromptsByFile}
            />
          );
        }

        if (seg.type === 'stackblitz-multi') {
          const stackBlitz = seg as StackBlitzMultiSegment;
          const slug = problemSlug ?? fundamentalsSlug;
          if (!slug) return null;

          const tabs = stackBlitz.exercises.flatMap((exercise, index) => [
            { label: `Exercise ${index + 1}`, file: exercise },
            {
              label: `Solution ${index + 1}`,
              file: stackBlitz.solutions[index] ?? exercise,
            },
          ]);

          return (
            <WebContainerEmbed
              key={i}
              tabs={tabs}
              step={stackBlitz.step}
              total={stackBlitz.total}
              contentSlug={slug}
              progressStepId={
                problemId ? `dsa-${problemId}-step-${stackBlitz.step}` : undefined
              }
              base={fundamentalsSlug ? 'fundamentals' : undefined}
              initialFiles={codeFiles}
              exercisePromptsByFile={exercisePromptsByFile}
            />
          );
        }

        // Trace visualizations
        if (seg.type === 'trace')
          return <ArrayTrace key={i} steps={(seg as TraceSegment).steps} />;
        if (seg.type === 'trace-lr')
          return <TwoPointerTrace key={i} steps={(seg as TraceLRSegment).steps} />;
        if (seg.type === 'trace-ps')
          return <PrefixSuffixTrace key={i} steps={(seg as TracePSSegment).steps} />;
        if (seg.type === 'trace-map')
          return <HashMapTrace key={i} steps={(seg as TraceMapSegment).steps} />;
        if (seg.type === 'trace-ll')
          return <LinkedListTrace key={i} steps={(seg as TraceLLSegment).steps} />;
        if (seg.type === 'trace-dll')
          return <DoublyLinkedListTrace key={i} steps={(seg as TraceDLLSegment).steps} />;
        if (seg.type === 'trace-sq')
          return <StackQueueTrace key={i} steps={(seg as TraceSQSegment).steps} />;
        if (seg.type === 'trace-subset')
          return (
            <SubsetTrace
              key={i}
              steps={(seg as TraceSubsetSegment).steps}
              labels={(seg as TraceSubsetSegment).labels}
            />
          );
        if (seg.type === 'trace-bs')
          return <BinarySearchTrace key={i} steps={(seg as TraceBSSegment).steps} />;
        if (seg.type === 'trace-tree')
          return <BinaryTreeTrace key={i} steps={(seg as TraceTreeSegment).steps} />;
        if (seg.type === 'trace-parse')
          return <ParserTrace key={i} steps={(seg as TraceParseSegment).steps} />;
        if (seg.type === 'trace-graph')
          return <GraphTrace key={i} steps={(seg as TraceGraphSegment).steps} />;

        return renderExtraSegment ? (renderExtraSegment(seg, i) ?? null) : null;
      }}
    />
  );
}
