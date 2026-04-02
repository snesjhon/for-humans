import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getFundamentalsGuide,
  getAllFundamentalsSlugs,
  getSectionForFundamentals,
  getPrecedingSection,
} from '@/lib/fullstack/fundamentals';
import { extractHeadings } from '@/lib/fullstack/headings';
import { TableOfContents, PageHero, PageLayout } from '@/components/ui';
import MarkdownRenderer from '@/components/fullstack/MarkdownRenderer/MarkdownRenderer';

const PHASE_COLORS = [
  'var(--purple)',
  'var(--blue)',
  'var(--green)',
  'var(--orange)',
  'var(--cyan)',
];
const phaseColor = (n: number) => PHASE_COLORS[(n - 1) % PHASE_COLORS.length];

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllFundamentalsSlugs().map((slug) => ({ slug }));
}

export default function FundamentalsPage({ params }: Props) {
  const guide = getFundamentalsGuide(params.slug);
  if (!guide) notFound();

  const context = getSectionForFundamentals(params.slug);
  const section = context?.section;
  const phase = context?.phase;
  const prereq = getPrecedingSection(params.slug);
  const color = phase ? phaseColor(phase.number) : null;

  const strippedContent = guide.content.replace(/^#[^#].*\n+/, '').trimStart();
  const headings = extractHeadings(strippedContent);

  return (
    <>
      <PageHero>
        <h1 className="text-5xl font-bold leading-tight text-[var(--fg)] font-display">
          {section?.label ?? guide.title.replace(/\s*[–-]\s*Fundamentals/i, '')}
        </h1>
        {section && (
          <p className="text-lg italic leading-snug text-[var(--purple)]">
            &quot;{section.mentalModelHook}&quot;
          </p>
        )}
        <div className="flex items-center gap-2">
          {phase && (
            <mark className="text-xs bg-transparent border border-[var(--border)] rounded text-[var(--fg-alt)]">
              {phase.emoji} {phase.label}
            </mark>
          )}
          <mark className="text-xs bg-transparent border border-[var(--border)] rounded text-[var(--fg-alt)]">
            Fundamentals
          </mark>
        </div>
      </PageHero>

      <PageLayout
        accentColor={color}
        aside={<TableOfContents headings={headings} title="Contents" />}
      >
        <section className="space-y-8">
          <div className="rounded-xl p-5 bg-[var(--bg-alt)] border border-[var(--border)]">
            <p className="text-sm mb-1 text-[var(--fg-alt)]">
              <span className="font-semibold text-[var(--fg)]">
                Prerequisites:
              </span>
            </p>
            {prereq ? (
              <Link
                href={
                  prereq.fundamentalsSlug
                    ? `/fundamentals/${prereq.fundamentalsSlug}`
                    : '/path'
                }
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80 mt-2 bg-[var(--purple-tint)] text-[var(--purple)]"
                style={{
                  border:
                    '1px solid color-mix(in srgb, var(--purple) 20%, transparent)',
                }}
              >
                {prereq.label} Fundamentals
              </Link>
            ) : (
              <p className="text-sm italic mb-1 text-[var(--fg-comment)]">
                None — this is the starting point of the path.
              </p>
            )}
          </div>

          <MarkdownRenderer
            content={strippedContent}
            prompts={guide.levelPrompts}
            phase={phase?.number ?? 1}
            storageKeyPrefix={`chat:${params.slug}`}
          />

          <div className="flex items-center justify-between pt-8 border-t border-t-[var(--border)]">
            <Link
              href="/fullstack/path"
              className="text-sm transition-opacity hover:opacity-70 text-[var(--fg-comment)]"
            >
              ← Back to The Path
            </Link>
            {section && section.firstPass.length > 0 && (
              <Link
                href={`/fullstack/scenarios/${section.firstPass[0].slug}`}
                className="text-sm px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 text-white bg-[var(--blue)]"
              >
                Start First Scenario →
              </Link>
            )}
          </div>
        </section>
      </PageLayout>
    </>
  );
}
