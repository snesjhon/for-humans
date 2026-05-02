'use client';

import dynamic from 'next/dynamic';
import BaseMarkdownRenderer, {
  type BaseSegment,
} from '@/components/ui/MarkdownRenderer/MarkdownRenderer';

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
    if (
      segment.type === 'stackblitz' ||
      segment.type === 'stackblitz-multi'
    ) {
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
      extraPreprocessors={[...extraPreprocessors, splitStackBlitz]}
      renderExtraSegment={(seg, i) => {
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

        return renderExtraSegment ? (renderExtraSegment(seg, i) ?? null) : null;
      }}
    />
  );
}
