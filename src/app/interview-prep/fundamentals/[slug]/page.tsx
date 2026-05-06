import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getFundamentalsGuide,
  getAllFundamentalsSlugs,
  getItemForFundamentals,
  getFundamentalsStepNumbers,
  loadReferencedCodeFiles,
} from '@/lib/interview-prep/fundamentals';
import { extractHeadings } from '@/lib/frontend/headings';
import MarkdownRenderer from '@/components/exercises/MarkdownRenderer/MarkdownRenderer';
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

export default function InterviewPrepFundamentalsPage({ params }: Props) {
  const guide = getFundamentalsGuide(params.slug);
  if (!guide) notFound();

  const item = getItemForFundamentals(params.slug);
  const stepNumbers = getFundamentalsStepNumbers(params.slug);
  const headings = extractHeadings(guide.content);
  const codeFiles = loadReferencedCodeFiles(guide.content, params.slug);

  return (
    <ProgressProvider
      items={[
        {
          itemType: 'fundamentals' as const,
          itemId: `fer-fundamentals-${params.slug}`,
        },
        ...stepNumbers.map((stepNum) => ({
          itemType: 'fundamentals-level' as const,
          itemId: `fer-fundamentals-${params.slug}-step-${stepNum}`,
        })),
      ]}
    >
      <TDPageLayout
        progress={
          stepNumbers.length > 0 ? (
            <TDProgressPanel
              loginHref={`/login?next=${encodeURIComponent(`/interview-prep/fundamentals/${params.slug}`)}`}
              items={[
                {
                  itemType: 'fundamentals',
                  itemId: `fer-fundamentals-${params.slug}`,
                  label: 'Fundamentals complete',
                },
                ...stepNumbers.map((stepNum) => ({
                  itemType: 'fundamentals-level' as const,
                  itemId: `fer-fundamentals-${params.slug}-step-${stepNum}`,
                  label: `Level ${stepNum} complete`,
                })),
              ]}
            />
          ) : undefined
        }
        hero={
          <PageHero>
            <h1 className="mb-0 font-display text-5xl leading-tight text-[var(--ms-text-body)]">
              {item?.fundamentalsLabel ?? params.slug.replace(/-/g, ' ')}
            </h1>
            {item && (
              <p className="mb-6 text-lg italic leading-snug text-[var(--ms-primary)]">
                &ldquo;{item.mentalModelHook}&rdquo;
              </p>
            )}

            <div className="flex items-center gap-2">
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                🏭 Plant Floor Monitor
              </mark>
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                Interview Prep Fundamentals
              </mark>
            </div>
          </PageHero>
        }
        aside={<TableOfContents headings={headings} title="Contents" />}
      >
        <section className="space-y-8 py-2">
          {item?.scenarioSlug && (
            <div className="rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-5">
              <p className="mb-2 text-sm text-[var(--ms-text-muted)]">
                <span className="font-semibold text-[var(--ms-text-body)]">
                  Associated scenario:
                </span>
              </p>
              <Link
                href={`/interview-prep/scenarios/${item.scenarioSlug}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ms-blue)] bg-[var(--ms-blue-surface)] px-3 py-1.5 text-xs font-medium text-[var(--ms-blue)] no-underline transition-opacity hover:opacity-80"
              >
                {item.scenarioLabel ?? item.label} →
              </Link>
            </div>
          )}

          <MarkdownRenderer
            content={guide.content}
            fundamentalsSlug={params.slug}
            codeFiles={codeFiles}
          />

          <div className="flex items-center justify-between border-t border-t-[var(--ms-surface)] pt-8">
            <Link
              href="/interview-prep/path"
              className="text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
            >
              ← Back to Interview Prep Path
            </Link>
            <TDCompletionCTA
              itemType="fundamentals"
              itemId={`fer-fundamentals-${params.slug}`}
              label="Complete Foundation"
              completedLabel="Foundation Completed"
              loginHref={`/login?next=${encodeURIComponent(`/interview-prep/fundamentals/${params.slug}`)}`}
            />
            <div />
          </div>
        </section>
      </TDPageLayout>
    </ProgressProvider>
  );
}
