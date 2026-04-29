import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getFundamentalsGuide,
  getAllFundamentalsSlugs,
  getSectionForFundamentals,
  getPrecedingSection,
  getFundamentalsStepNumbers,
} from '@/lib/frontend/fundamentals';
import { extractHeadings } from '@/lib/frontend/headings';
import MarkdownRenderer from '@/components/dsa/MarkdownRenderer/MarkdownRenderer';
import TableOfContents from '@/components/ui/TableOfContents/TableOfContents';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { TDPageLayout } from '@/components/ui/TDPageLayout/TDPageLayout';
import { ProgressProvider } from '@/components/ui/ProgressProvider/ProgressProvider';
import TDCompletionCTA from '@/components/ui/TDCompletionCTA/TDCompletionCTA';
import TDProgressPanel from '@/components/ui/TDProgressPanel/TDProgressPanel';

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
  const stepNumbers = getFundamentalsStepNumbers(params.slug);
  const headings = extractHeadings(guide.content);

  return (
    <ProgressProvider
      items={[
        {
          itemType: 'fundamentals' as const,
          itemId: `fe-fundamentals-${params.slug}`,
        },
        ...stepNumbers.map((stepNum) => ({
          itemType: 'fundamentals-level' as const,
          itemId: `fe-fundamentals-${params.slug}-step-${stepNum}`,
        })),
      ]}
    >
      <TDPageLayout
        progress={
          stepNumbers.length > 0 ? (
            <TDProgressPanel
              loginHref={`/login?next=${encodeURIComponent(`/frontend/fundamentals/${params.slug}`)}`}
              items={[
                {
                  itemType: 'fundamentals',
                  itemId: `fe-fundamentals-${params.slug}`,
                  label: 'Fundamentals complete',
                },
                ...stepNumbers.map((stepNum) => ({
                  itemType: 'fundamentals-level' as const,
                  itemId: `fe-fundamentals-${params.slug}-step-${stepNum}`,
                  label: `Step ${stepNum} complete`,
                })),
              ]}
            />
          ) : undefined
        }
        hero={
          <PageHero>
            <h1 className="mb-0 font-display text-5xl leading-tight text-[var(--ms-text-body)]">
              {section?.label ??
                guide.title.replace(/\s*[–-]\s*Fundamentals/i, '')}
            </h1>
            {section && (
              <p className="mb-6 text-lg italic leading-snug text-[var(--ms-primary)]">
                &ldquo;{section.mentalModelHook}&rdquo;
              </p>
            )}

            <div className="flex items-center gap-2">
              {phase && (
                <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                  {phase.emoji} {phase.label}
                </mark>
              )}
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                Frontend Fundamentals
              </mark>
            </div>
          </PageHero>
        }
        aside={<TableOfContents headings={headings} title="Contents" />}
      >
        <section className="space-y-8 py-2">
          <div className="rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-5">
            <p className="mb-1 text-sm text-[var(--ms-text-muted)]">
              <span className="font-semibold text-[var(--ms-text-body)]">
                Prerequisites:
              </span>
            </p>
            {prereq ? (
              <Link
                href={`/frontend/fundamentals/${prereq.fundamentalsSlug}`}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[var(--ms-blue)] bg-[var(--ms-blue-surface)] px-3 py-1.5 text-xs font-medium text-[var(--ms-blue)] no-underline transition-opacity hover:opacity-80"
              >
                {prereq.label} Fundamentals
              </Link>
            ) : (
              <p className="mb-0 mt-1 text-sm italic text-[var(--ms-text-subtle)]">
                None — this is the starting point of the path.
              </p>
            )}
          </div>

          <MarkdownRenderer content={guide.content} />

          <div className="flex items-center justify-between border-t border-t-[var(--ms-surface)] pt-8">
            <Link
              href="/frontend/path"
              className="text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
            >
              ← Back to Frontend Path
            </Link>
            <TDCompletionCTA
              itemType="fundamentals"
              itemId={`fe-fundamentals-${params.slug}`}
              label="Complete Foundation"
              completedLabel="Foundation Completed"
              loginHref={`/login?next=${encodeURIComponent(`/frontend/fundamentals/${params.slug}`)}`}
            />
            <div />
          </div>
        </section>
      </TDPageLayout>
    </ProgressProvider>
  );
}
