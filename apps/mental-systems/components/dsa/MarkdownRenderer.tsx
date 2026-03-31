'use client';

import {
  MarkdownRenderer as BaseMarkdownRenderer,
  type BaseSegment,
} from '@for-humans/ui';
import WebContainerEmbed from './WebContainerEmbed';
import ArrayTrace from './ArrayTrace';
import type { TraceStep } from './ArrayTrace';
import TwoPointerTrace from './TwoPointerTrace';
import type { TwoPointerStep } from './TwoPointerTrace';
import PrefixSuffixTrace from './PrefixSuffixTrace';
import type { PrefixSuffixStep } from './PrefixSuffixTrace';
import HashMapTrace from './HashMapTrace';
import type { HashMapStep } from './HashMapTrace';
import LinkedListTrace from './LinkedListTrace';
import type { LinkedListStep } from './LinkedListTrace';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  problemSlug?: string;
  fundamentalsSlug?: string;
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
type StackBlitzSegment = BaseSegment & {
  type: 'stackblitz';
  file: string;
  step: number;
  total: number;
  solution: string;
};
type StackBlitzMultiSegment = BaseSegment & {
  type: 'stackblitz-multi';
  step: number;
  total: number;
  exercises: string[];
  solutions: string[];
};

function splitTrace(segments: BaseSegment[]): BaseSegment[] {
  const result: BaseSegment[] = [];
  const configs: Array<{
    fence: RegExp;
    type: 'trace' | 'trace-lr' | 'trace-ps' | 'trace-map' | 'trace-ll';
  }> = [
    { fence: /^:::trace\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace' },
    { fence: /^:::trace-lr\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-lr' },
    { fence: /^:::trace-ps\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-ps' },
    {
      fence: /^:::trace-map\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm,
      type: 'trace-map',
    },
    { fence: /^:::trace-ll\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, type: 'trace-ll' },
  ];

  for (const seg of segments) {
    if (seg.type !== 'markdown') {
      result.push(seg);
      continue;
    }

    type RawMatch = {
      index: number;
      length: number;
      json: string;
      type: 'trace' | 'trace-lr' | 'trace-ps' | 'trace-map' | 'trace-ll';
    };
    const matches: RawMatch[] = [];
    for (const { fence, type } of configs) {
      fence.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = fence.exec((seg as { text: string }).text)) !== null) {
        matches.push({ index: m.index, length: m[0].length, json: m[1], type });
      }
    }
    matches.sort((a, b) => a.index - b.index);

    const text = (seg as { text: string }).text;
    let cursor = 0;
    for (const hit of matches) {
      if (hit.index > cursor)
        result.push({
          type: 'markdown',
          text: text.slice(cursor, hit.index),
        });
      try {
        const steps = JSON.parse(hit.json);
        result.push({ type: hit.type, steps } as BaseSegment);
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
      s.type !== 'markdown' || (s as { text: string }).text.trim().length > 0,
  );
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

    // Build a combined list of all matches (single + multi) sorted by position
    type RawMatch = { index: number; length: number; seg: BaseSegment };
    const matches: RawMatch[] = [];
    const text = (seg as { text: string }).text;

    singleFence.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = singleFence.exec(text)) !== null) {
      matches.push({
        index: m.index,
        length: m[0].length,
        seg: {
          type: 'stackblitz',
          file: m[1],
          step: parseInt(m[2], 10),
          total: parseInt(m[3], 10),
          solution: m[4],
        },
      });
    }

    multiFence.lastIndex = 0;
    while ((m = multiFence.exec(text)) !== null) {
      matches.push({
        index: m.index,
        length: m[0].length,
        seg: {
          type: 'stackblitz-multi',
          step: parseInt(m[1], 10),
          total: parseInt(m[2], 10),
          exercises: m[3].split(','),
          solutions: m[4].split(','),
        },
      });
    }

    matches.sort((a, b) => a.index - b.index);

    let cursor = 0;
    for (const hit of matches) {
      if (hit.index > cursor) {
        const textBefore = text.slice(cursor, hit.index);
        result.push({ type: 'markdown', text: textBefore });
      }
      result.push(hit.seg);
      cursor = hit.index + hit.length;
    }
    if (cursor < text.length) {
      result.push({ type: 'markdown', text: text.slice(cursor) });
    }
  }

  return result.filter((s) => {
    if (s.type === 'stackblitz' || s.type === 'stackblitz-multi') return true;
    return (
      s.type !== 'markdown' || (s as { text: string }).text.trim().length > 0
    );
  });
}

export default function MarkdownRenderer({
  content,
  className,
  problemSlug,
  fundamentalsSlug,
}: MarkdownRendererProps) {
  return (
    <BaseMarkdownRenderer
      content={content}
      className={className}
      extraPreprocessors={[splitTrace, splitStackBlitz]}
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
        if (seg.type === 'stackblitz') {
          const s = seg as StackBlitzSegment;
          const slug = problemSlug ?? fundamentalsSlug;
          if (!slug) return null;
          const isSolutionOnly = s.file === s.solution;
          return (
            <WebContainerEmbed
              key={i}
              tabs={
                isSolutionOnly
                  ? [{ label: 'Solution', file: s.solution }]
                  : [
                      { label: `Step ${s.step}`, file: s.file },
                      { label: 'Solution', file: s.solution },
                    ]
              }
              step={s.step}
              total={s.total}
              problemSlug={slug}
              base={fundamentalsSlug ? 'fundamentals' : undefined}
            />
          );
        }
        if (seg.type === 'stackblitz-multi') {
          const s = seg as StackBlitzMultiSegment;
          const slug = problemSlug ?? fundamentalsSlug;
          if (!slug) return null;
          const tabs = s.exercises.flatMap((ex, idx) => [
            { label: `Exercise ${idx + 1}`, file: ex },
            { label: `Solution ${idx + 1}`, file: s.solutions[idx] ?? ex },
          ]);
          return (
            <WebContainerEmbed
              key={i}
              tabs={tabs}
              step={s.step}
              total={s.total}
              problemSlug={slug}
              base={fundamentalsSlug ? 'fundamentals' : undefined}
            />
          );
        }
        return null;
      }}
    />
  );
}
