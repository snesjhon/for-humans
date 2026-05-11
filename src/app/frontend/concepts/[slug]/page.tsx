import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllConceptSlugs,
  getConceptContent,
  getConceptMatch,
  getConceptRef,
} from '@/lib/frontend/concepts';
import { extractHeadings } from '@/lib/frontend/headings';
import MarkdownRenderer from '@/components/frontend/MarkdownRenderer/MarkdownRenderer';
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
  return getAllConceptSlugs().map((slug) => ({ slug }));
}

export default function FrontendConceptPage({ params }: Props) {
  const concept = getConceptContent(params.slug);

  if (!concept) notFound();

  const match = getConceptMatch(params.slug);
  const conceptRef = getConceptRef(params.slug);

  if (!match || !conceptRef) notFound();

  const { phase, section } = match;
  const strippedConcept = concept.concept.replace(/^#[^#].*\n+/, '').trimStart();
  const headings = extractHeadings(strippedConcept);
  const loginHref = `/login?next=${encodeURIComponent(`/frontend/concepts/${params.slug}`)}`;

  return (
    <ProgressProvider
      items={[{ itemType: 'scenario' as const, itemId: `fe-concept-${params.slug}` }]}
    >
      <TDPageLayout
        progress={
          <TDProgressPanel
            loginHref={loginHref}
            items={[
              {
                itemType: 'scenario' as const,
                itemId: `fe-concept-${params.slug}`,
                label: 'Concept complete',
              },
            ]}
          />
        }
        hero={
          <PageHero>
            <h1 className="mb-0 font-display text-5xl leading-tight text-[var(--ms-text-body)]">
              {conceptRef.label}
            </h1>
            <p className="mb-6 text-lg italic leading-snug text-[var(--ms-primary)]">
              &ldquo;{section.mentalModelHook}&rdquo;
            </p>

            <div className="flex items-center gap-2">
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                {phase.emoji} {phase.label}
              </mark>
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                Frontend Concept
              </mark>
            </div>
          </PageHero>
        }
        aside={<TableOfContents headings={headings} title="Contents" />}
      >
        <section className="space-y-8 py-2">
          <div className="rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-5">
            <p className="mb-2 text-sm text-[var(--ms-text-muted)]">
              <span className="font-semibold text-[var(--ms-text-body)]">
                Related fundamentals:
              </span>
            </p>
            <Link
              href={`/frontend/fundamentals/${section.fundamentalsSlug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ms-blue)] bg-[var(--ms-blue-surface)] px-3 py-1.5 text-xs font-medium text-[var(--ms-blue)] no-underline transition-opacity hover:opacity-80"
            >
              {section.label} Fundamentals →
            </Link>
          </div>

          <MarkdownRenderer
            content={strippedConcept}
            prompts={concept.promptContent ?? ''}
            phase={phase.number}
            storageKeyPrefix={`chat:${params.slug}`}
          />

          <div className="flex items-center justify-between border-t border-t-[var(--ms-surface)] pt-8">
            <Link
              href="/frontend/path"
              className="text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
            >
              ← Back to Frontend Path
            </Link>
            <TDCompletionCTA
              itemType="scenario"
              itemId={`fe-concept-${params.slug}`}
              label="Complete Concept"
              completedLabel="Concept Completed"
              loginHref={loginHref}
            />
            <div />
          </div>
        </section>
      </TDPageLayout>
    </ProgressProvider>
  );
}
