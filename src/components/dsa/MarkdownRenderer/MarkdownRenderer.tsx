'use client';

import dynamic from 'next/dynamic';
import ExerciseMarkdownRenderer from '@/components/exercises/MarkdownRenderer/MarkdownRenderer';
import {
  type BaseSegment,
} from '@/components/ui/MarkdownRenderer/MarkdownRenderer';
import type { TraceStep } from '../ArrayTrace/ArrayTrace';
import type { TwoPointerStep } from '../TwoPointerTrace/TwoPointerTrace';
import type { PrefixSuffixStep } from '../PrefixSuffixTrace/PrefixSuffixTrace';
import type { HashMapStep } from '../HashMapTrace/HashMapTrace';
import type { LinkedListStep } from '../LinkedListTrace/LinkedListTrace';
import type { DoublyLinkedListStep } from '../DoublyLinkedListTrace/DoublyLinkedListTrace';
import type { StackQueueStep } from '../StackQueueTrace/StackQueueTrace';
import type {
  SubsetTraceLabels,
  SubsetTraceStep,
} from '../SubsetTrace/SubsetTrace';
import type { BinarySearchStep } from '../BinarySearchTrace/BinarySearchTrace';
import type { BinaryTreeTraceStep } from '../BinaryTreeTrace/BinaryTreeTrace';
import type { ParserTraceStep } from '../ParserTrace/ParserTrace';
import type { GraphTraceStep } from '../GraphTrace/GraphTrace';

const ArrayTrace = dynamic(() => import('../ArrayTrace/ArrayTrace'));
const TwoPointerTrace = dynamic(() => import('../TwoPointerTrace/TwoPointerTrace'));
const PrefixSuffixTrace = dynamic(
  () => import('../PrefixSuffixTrace/PrefixSuffixTrace'),
);
const HashMapTrace = dynamic(() => import('../HashMapTrace/HashMapTrace'));
const LinkedListTrace = dynamic(
  () => import('../LinkedListTrace/LinkedListTrace'),
);
const DoublyLinkedListTrace = dynamic(
  () => import('../DoublyLinkedListTrace/DoublyLinkedListTrace'),
);
const StackQueueTrace = dynamic(
  () => import('../StackQueueTrace/StackQueueTrace'),
);
const SubsetTrace = dynamic(() => import('../SubsetTrace/SubsetTrace'));
const BinarySearchTrace = dynamic(
  () => import('../BinarySearchTrace/BinarySearchTrace'),
);
const BinaryTreeTrace = dynamic(() => import('../BinaryTreeTrace/BinaryTreeTrace'));
const ParserTrace = dynamic(() => import('../ParserTrace/ParserTrace'));
const GraphTrace = dynamic(() => import('../GraphTrace/GraphTrace'));

interface MarkdownRendererProps {
  content: string;
  className?: string;
  problemSlug?: string;
  problemId?: string;
  fundamentalsSlug?: string;
  codeFiles?: Record<string, string>;
  exercisePromptsByFile?: Record<string, string>;
}

// Segment types added by DSA
type TraceSegment = BaseSegment & { type: 'trace'; steps: TraceStep[] };
type TraceLRSegment = BaseSegment & {
  type: 'trace-lr';
  steps: TwoPointerStep[];
};
type TracePSSegment = BaseSegment & {
  type: 'trace-ps';
  steps: PrefixSuffixStep[];
};
type TraceMapSegment = BaseSegment & {
  type: 'trace-map';
  steps: HashMapStep[];
};
type TraceLLSegment = BaseSegment & {
  type: 'trace-ll';
  steps: LinkedListStep[];
};
type TraceDLLSegment = BaseSegment & {
  type: 'trace-dll';
  steps: DoublyLinkedListStep[];
};
type TraceSQSegment = BaseSegment & {
  type: 'trace-sq';
  steps: StackQueueStep[];
};
type TraceSubsetSegment = BaseSegment & {
  type: 'trace-subset';
  steps: SubsetTraceStep[];
  labels?: SubsetTraceLabels;
};
type TraceBSSegment = BaseSegment & {
  type: 'trace-bs';
  steps: BinarySearchStep[];
};
type TraceTreeSegment = BaseSegment & {
  type: 'trace-tree';
  steps: BinaryTreeTraceStep[];
};
type TraceParseSegment = BaseSegment & {
  type: 'trace-parse';
  steps: ParserTraceStep[];
};
type TraceGraphSegment = BaseSegment & {
  type: 'trace-graph';
  steps: GraphTraceStep[];
};
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
    {
      fence: /^:::trace-map\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm,
      type: 'trace-map',
    },
    { fence: /^:::trace-ll\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-ll' },
    { fence: /^:::trace-dll\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-dll' },
    { fence: /^:::trace-sq\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-sq' },
    { fence: /^:::trace-subset\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-subset' },
    { fence: /^:::trace-bs\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-bs' },
    { fence: /^:::trace-tree\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-tree' },
    { fence: /^:::trace-parse\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-parse' },
    {
      fence: /^:::trace-graph\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm,
      type: 'trace-graph',
    },
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
        result.push({
          type: 'markdown',
          text: text.slice(cursor, hit.index),
        });
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
        result.push({
          type: 'markdown',
          text: text.slice(hit.index, hit.index + hit.length),
        });
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
}: MarkdownRendererProps) {
  return (
    <ExerciseMarkdownRenderer
      content={content}
      className={className}
      extraPreprocessors={[splitTrace]}
      fundamentalsSlug={fundamentalsSlug}
      problemSlug={problemSlug}
      problemId={problemId}
      codeFiles={codeFiles}
      exercisePromptsByFile={exercisePromptsByFile}
      renderExtraSegment={(seg, i) => {
        if (seg.type === 'trace')
          return <ArrayTrace key={i} steps={(seg as TraceSegment).steps} />;
        if (seg.type === 'trace-lr')
          return (
            <TwoPointerTrace key={i} steps={(seg as TraceLRSegment).steps} />
          );
        if (seg.type === 'trace-ps')
          return (
            <PrefixSuffixTrace key={i} steps={(seg as TracePSSegment).steps} />
          );
        if (seg.type === 'trace-map')
          return (
            <HashMapTrace key={i} steps={(seg as TraceMapSegment).steps} />
          );
        if (seg.type === 'trace-ll')
          return (
            <LinkedListTrace key={i} steps={(seg as TraceLLSegment).steps} />
          );
        if (seg.type === 'trace-dll')
          return (
            <DoublyLinkedListTrace
              key={i}
              steps={(seg as TraceDLLSegment).steps}
            />
          );
        if (seg.type === 'trace-sq')
          return (
            <StackQueueTrace key={i} steps={(seg as TraceSQSegment).steps} />
          );
        if (seg.type === 'trace-subset')
          return (
            <SubsetTrace
              key={i}
              steps={(seg as TraceSubsetSegment).steps}
              labels={(seg as TraceSubsetSegment).labels}
            />
          );
        if (seg.type === 'trace-bs')
          return (
            <BinarySearchTrace key={i} steps={(seg as TraceBSSegment).steps} />
          );
        if (seg.type === 'trace-tree')
          return (
            <BinaryTreeTrace key={i} steps={(seg as TraceTreeSegment).steps} />
          );
        if (seg.type === 'trace-parse')
          return (
            <ParserTrace key={i} steps={(seg as TraceParseSegment).steps} />
          );
        if (seg.type === 'trace-graph')
          return <GraphTrace key={i} steps={(seg as TraceGraphSegment).steps} />;
        return null;
      }}
    />
  );
}
