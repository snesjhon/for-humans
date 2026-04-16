import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getFundamentalsGuide,
  getAllFundamentalsSlugs,
  getSectionForFundamentals,
  getPrecedingSection,
} from '@/lib/system-design/fundamentals';
import { extractHeadings } from '@/lib/system-design/headings';
import TableOfContents from '@/components/ui/TableOfContents/TableOfContents';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { PageLayout } from '@/components/ui/PageLayout/PageLayout';
import MarkdownRenderer from '@/components/system-design/MarkdownRenderer/MarkdownRenderer';

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
  const color = phase ? 'var(--ms-blue)' : null;

  // Strip the leading # h1 from the markdown so it doesn't duplicate the page header
  const strippedContent = guide.content.replace(/^#[^#].*\n+/, '').trimStart();

  const headings = extractHeadings(strippedContent);

  return (
    <>
      <PageHero>
        <div className="flex items-center gap-2 mb-3">
          {phase && (
            <span className="text-xs text-[var(--ms-text-faint)]">
              {phase.emoji} {phase.label}
            </span>
          )}
        </div>
        <h1 className="text-5xl font-bold leading-tight text-[var(--ms-text-body)] font-display">
          {section?.label ?? guide.title.replace(/\s*[–-]\s*Fundamentals/i, '')}
        </h1>
        {section && (
          <p className="mt-3 text-lg italic leading-snug text-[var(--ms-blue)]">
            &quot;{section.mentalModelHook}&quot;
          </p>
        )}
      </PageHero>

      <PageLayout
        accentColor={color}
        aside={
          <>
            <TableOfContents headings={headings} title="Contents" />
          </>
        }
      >
        <section className="space-y-8">
          {/* Prerequisites */}
          <div className="rounded-xl p-5 bg-[var(--ms-bg-pane-secondary)] border border-[var(--ms-surface)]">
            <p className="text-sm mb-1 text-[var(--ms-text-muted)]">
              <span className="font-semibold text-[var(--ms-text-body)]">
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
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80 mt-2 bg-[var(--ms-blue-surface)] text-[var(--ms-blue)] border border-[var(--ms-blue)]"
              >
                {prereq.label} Fundamentals
              </Link>
            ) : (
              <p className="text-sm italic mb-1 text-[var(--ms-text-subtle)]">
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

          {/* Footer */}
          <div className="flex items-center justify-between pt-8 border-t border-t-[var(--ms-surface)]">
            <Link
              href="/system-design/path"
              className="text-sm transition-opacity hover:opacity-70 text-[var(--ms-text-subtle)]"
            >
              ← Back to Learning Path
            </Link>
            {section && section.firstPass.length > 0 && (
              <Link
                href={`/system-design/scenarios/${section.firstPass[0].slug}`}
                className="text-sm px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 text-white bg-[var(--ms-blue)]"
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
