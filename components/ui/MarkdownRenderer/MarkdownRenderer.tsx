'use client';

import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/atom-one-light.css';

const MermaidChart = dynamic(() => import('../MermaidChart/MermaidChart'), {
  ssr: false,
  loading: () => (
    <div className="my-7 text-sm text-[var(--fg-gutter)]">Loading chart...</div>
  ),
});

export interface BaseSegment {
  type: string;
  [key: string]: unknown;
}

interface MermaidSegment extends BaseSegment {
  type: 'mermaid';
  chart: string;
}
interface MarkdownSegment extends BaseSegment {
  type: 'markdown';
  text: string;
}
type Segment = MermaidSegment | MarkdownSegment | BaseSegment;

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** DSA: additional segment splitters (e.g. splitTrace, splitStackBlitz) */
  extraPreprocessors?: Array<(segs: BaseSegment[]) => BaseSegment[]>;
  /** DSA: renders any segment type not handled by the base */
  renderExtraSegment?: (
    seg: BaseSegment,
    index: number,
  ) => React.ReactNode | null;
}

function headingId(children: React.ReactNode): string {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function splitMermaid(content: string): Segment[] {
  const segments: Segment[] = [];
  const fence = /^```mermaid[ \t]*\r?\n([\s\S]*?)\n```[ \t]*$/gm;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = fence.exec(content)) !== null) {
    if (match.index > cursor)
      segments.push({
        type: 'markdown',
        text: content.slice(cursor, match.index),
      });
    segments.push({ type: 'mermaid', chart: match[1] });
    cursor = match.index + match[0].length;
  }
  if (cursor < content.length)
    segments.push({ type: 'markdown', text: content.slice(cursor) });
  return segments.filter((s) =>
    s.type === 'mermaid'
      ? (s as MermaidSegment).chart.trim()
      : s.type === 'markdown' && (s as MarkdownSegment).text.trim(),
  );
}

const MD_COMPONENTS: React.ComponentProps<typeof ReactMarkdown>['components'] =
  {
    pre: ({ children }) => <pre className="dfh-pre">{children}</pre>,
    code: ({ className, children, ...props }) => {
      const isBlock = className?.includes('language-');
      if (isBlock)
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      return (
        <code className="dfh-code-inline" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 id={headingId(children)} className="scroll-mt-24">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 id={headingId(children)} className="scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 id={headingId(children)} className="scroll-mt-24">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 id={headingId(children)} className="scroll-mt-24">
        {children}
      </h4>
    ),
    table: ({ children }) => (
      <div className="dfh-table-wrap">
        <table>{children}</table>
      </div>
    ),
  };

export default function MarkdownRenderer({
  content,
  className = '',
  extraPreprocessors = [],
  renderExtraSegment,
}: MarkdownRendererProps) {
  let segments: BaseSegment[] = splitMermaid(content);
  for (const preprocess of extraPreprocessors) {
    segments = preprocess(segments);
  }

  return (
    <div className={`dfh-prose ${className}`}>
      {segments.map((seg, i) => {
        if (seg.type === 'mermaid') {
          return <MermaidChart key={i} chart={(seg as MermaidSegment).chart} />;
        }
        if (seg.type === 'markdown') {
          return (
            <ReactMarkdown
              key={i}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
              components={MD_COMPONENTS}
            >
              {(seg as MarkdownSegment).text}
            </ReactMarkdown>
          );
        }
        return renderExtraSegment ? (renderExtraSegment(seg, i) ?? null) : null;
      })}
    </div>
  );
}
