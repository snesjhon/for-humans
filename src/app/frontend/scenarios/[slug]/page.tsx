import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getScenarioContent,
  getAllScenarioSlugs,
  getSectionForScenario,
  getScenarioRef,
} from '@/lib/frontend/scenarios';
import { extractHeadings } from '@/lib/frontend/headings';
import MarkdownRenderer from '@/components/fullstack/MarkdownRenderer/MarkdownRenderer';
import CheckWork from '@/components/frontend/CheckWork/CheckWork';
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

export default function FrontendScenarioPage({ params }: Props) {
  const scenario = getScenarioContent(params.slug);
  if (!scenario) notFound();

  const section = getSectionForScenario(params.slug);
  const scenarioRef = getScenarioRef(params.slug);
  const strippedBrief = scenario.brief.replace(/^#[^#].*\n+/, '').trimStart();
  const strippedWalkthrough = scenario.walkthrough
    ? scenario.walkthrough.replace(/^#[^#].*\n+/, '').trimStart()
    : null;
  const headings = extractHeadings(strippedWalkthrough ?? strippedBrief);
  const loginHref = `/login?next=${encodeURIComponent(`/frontend/scenarios/${params.slug}`)}`;

  return (
    <ProgressProvider
      items={[{ itemType: 'scenario' as const, itemId: `fe-scenario-${params.slug}` }]}
    >
      <TDPageLayout
        progress={
          <TDProgressPanel
            loginHref={loginHref}
            items={[
              {
                itemType: 'scenario' as const,
                itemId: `fe-scenario-${params.slug}`,
                label: 'Scenario complete',
              },
            ]}
          />
        }
        hero={
          <PageHero>
            <h1 className="mb-0 font-display text-5xl leading-tight text-[var(--ms-text-body)]">
              {scenarioRef?.label ?? params.slug.replace(/-/g, ' ')}
            </h1>
            {section && (
              <p className="mb-6 text-lg italic leading-snug text-[var(--ms-primary)]">
                &ldquo;{section.mentalModelHook}&rdquo;
              </p>
            )}

            <div className="flex items-center gap-2">
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                🏭 Plant Floor Monitor
              </mark>
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                Frontend Scenario
              </mark>
            </div>
          </PageHero>
        }
        aside={
          <>
            <TableOfContents headings={headings} title="Contents" />
            <CheckWork slug={params.slug} />
          </>
        }
      >
        <section className="space-y-8 py-2">
          {section?.fundamentalsSlug && (
            <div className="rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-5">
              <p className="mb-2 text-sm text-[var(--ms-text-muted)]">
                <span className="font-semibold text-[var(--ms-text-body)]">
                  Read before this scenario:
                </span>
              </p>
              <Link
                href={`/frontend/fundamentals/${section.fundamentalsSlug}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ms-blue)] bg-[var(--ms-blue-surface)] px-3 py-1.5 text-xs font-medium text-[var(--ms-blue)] no-underline transition-opacity hover:opacity-80"
              >
                {section.label} Fundamentals →
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-6">
            <p className="mb-4 font-[ui-monospace,monospace] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-text-faint)]">
              Your task
            </p>
            <MarkdownRenderer
              content={strippedBrief}
              prompts={scenario.promptContent ?? ''}
              phase={1}
              storageKeyPrefix={`chat:${params.slug}`}
            />
          </div>

          {strippedWalkthrough && (
            <MarkdownRenderer
              content={strippedWalkthrough}
              prompts={scenario.promptContent ?? ''}
              phase={1}
              storageKeyPrefix={`chat:${params.slug}`}
            />
          )}

          <div className="flex items-center justify-between border-t border-t-[var(--ms-surface)] pt-8">
            <Link
              href="/frontend/path"
              className="text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
            >
              ← Back to Frontend Path
            </Link>
            <TDCompletionCTA
              itemType="scenario"
              itemId={`fe-scenario-${params.slug}`}
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
