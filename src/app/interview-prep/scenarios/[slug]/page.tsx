import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getScenarioContent,
  getAllScenarioSlugs,
  getItemForScenario,
} from '@/lib/interview-prep/scenarios';
import { extractHeadings } from '@/lib/frontend/headings';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer/MarkdownRenderer';
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
  return getAllScenarioSlugs().map((slug) => ({ slug }));
}

export default function InterviewPrepScenarioPage({ params }: Props) {
  const scenario = getScenarioContent(params.slug);
  if (!scenario) notFound();

  const item = getItemForScenario(params.slug);
  const headings = extractHeadings(scenario.content);
  const loginHref = `/login?next=${encodeURIComponent(`/interview-prep/scenarios/${params.slug}`)}`;

  return (
    <ProgressProvider
      items={[{ itemType: 'scenario' as const, itemId: `fer-scenario-${params.slug}` }]}
    >
      <TDPageLayout
        progress={
          <TDProgressPanel
            loginHref={loginHref}
            items={[
              {
                itemType: 'scenario' as const,
                itemId: `fer-scenario-${params.slug}`,
                label: 'Scenario complete',
              },
            ]}
          />
        }
        hero={
          <PageHero>
            <h1 className="mb-0 font-display text-5xl leading-tight text-[var(--ms-text-body)]">
              {item?.scenarioLabel ?? params.slug.replace(/-/g, ' ')}
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
                Interview Prep Scenario
              </mark>
            </div>
          </PageHero>
        }
        aside={<TableOfContents headings={headings} title="Contents" />}
      >
        <section className="space-y-8 py-2">
          {item?.fundamentalsSlug && (
            <div className="rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-5">
              <p className="mb-2 text-sm text-[var(--ms-text-muted)]">
                <span className="font-semibold text-[var(--ms-text-body)]">
                  Read before this scenario:
                </span>
              </p>
              <Link
                href={`/interview-prep/fundamentals/${item.fundamentalsSlug}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ms-blue)] bg-[var(--ms-blue-surface)] px-3 py-1.5 text-xs font-medium text-[var(--ms-blue)] no-underline transition-opacity hover:opacity-80"
              >
                {item.fundamentalsLabel ?? 'Fundamentals'} →
              </Link>
            </div>
          )}

          <MarkdownRenderer content={scenario.content} />

          <div className="flex items-center justify-between border-t border-t-[var(--ms-surface)] pt-8">
            <Link
              href="/interview-prep/path"
              className="text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
            >
              ← Back to Interview Prep Path
            </Link>
            <TDCompletionCTA
              itemType="scenario"
              itemId={`fer-scenario-${params.slug}`}
              label="Complete Scenario"
              completedLabel="Scenario Completed"
              loginHref={loginHref}
            />
            <div />
          </div>
        </section>
      </TDPageLayout>
    </ProgressProvider>
  );
}
