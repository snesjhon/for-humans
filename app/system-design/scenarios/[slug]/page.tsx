import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadScenario, getAllScenarioSlugsFromDisk } from '@/lib/system-design/content';
import { getScenarioBySlug } from '@/lib/system-design/journey';
import { extractHeadings } from '@/lib/system-design/headings';
import TableOfContents from '@/components/ui/TableOfContents/TableOfContents';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { PageLayout } from '@/components/ui/PageLayout/PageLayout';
import MarkdownRenderer from '@/components/system-design/MarkdownRenderer/MarkdownRenderer';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllScenarioSlugsFromDisk().map((slug) => ({ slug }));
}

export default function ScenarioPage({ params }: Props) {
  const content = loadScenario(params.slug);
  if (!content) notFound();

  const match = getScenarioBySlug(params.slug);
  if (!match) notFound();

  const { scenario, section, phase } = match;
  const color = 'var(--primary)';

  // Strip leading h1 from brief and walkthrough
  const strippedBrief = content.brief.replace(/^#[^#].*\n+/, '').trimStart();
  const strippedWalkthrough = content.walkthrough
    ? content.walkthrough.replace(/^#[^#].*\n+/, '').trimStart()
    : null;

  // TOC: prefer walkthrough headings, fall back to brief
  const tocContent = strippedWalkthrough ?? strippedBrief;
  const headings = extractHeadings(tocContent);

  // Find prev/next scenario within section
  const allScenarios = [...section.firstPass, ...section.reinforce];
  const idx = allScenarios.findIndex((s) => s.slug === params.slug);
  const prevScenario = idx > 0 ? allScenarios[idx - 1] : null;
  const nextScenario =
    idx < allScenarios.length - 1 ? allScenarios[idx + 1] : null;

  return (
    <>
      <PageHero>
        <p className="text-xs font-mono mb-2 text-[var(--fg-gutter)]">
          {section.label}
        </p>
        <h1 className="text-5xl font-bold leading-tight text-[var(--fg)]">
          {scenario.label}
        </h1>
      </PageHero>

      <PageLayout
        accentColor={color}
        aside={
          <>
            <TableOfContents headings={headings} title="Contents" />
            {scenario.relatedFundamentalsSlugs.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold mb-3 text-[var(--fg)]">
                  Concepts
                </p>
                <div className="space-y-1">
                  {scenario.relatedFundamentalsSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/system-design/fundamentals/${slug}`}
                      className="block text-sm py-1.5 px-2 rounded-md transition-colors hover:opacity-80 text-[var(--fg-comment)] no-underline"
                    >
                      {slug.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        }
      >
        <section className="space-y-8">
          <div className="rounded-xl p-6 bg-[var(--bg-alt)] border border-[var(--border)]">
            <p className="text-xs font-semibold uppercase mb-4 text-[var(--fg-gutter)] font-[ui-monospace,monospace] tracking-[0.08em]">
              Requirements
            </p>
            <MarkdownRenderer
              content={strippedBrief}
              prompts={content.promptContent}
              phase={phase?.number ?? 1}
              storageKeyPrefix={`chat:${params.slug}`}
            />
          </div>

          {strippedWalkthrough && (
            <MarkdownRenderer
              content={strippedWalkthrough}
              prompts={content.promptContent}
              phase={phase.number}
              storageKeyPrefix={`chat:${params.slug}`}
            />
          )}

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-6 border-t border-t-[var(--border)]">
            {prevScenario ? (
              <Link
                href={`/system-design/scenarios/${prevScenario.slug}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 text-[var(--fg-comment)]"
              >
                ← {prevScenario.label}
              </Link>
            ) : (
              <Link
                href={
                  section.fundamentalsSlug
                    ? `/system-design/fundamentals/${section.fundamentalsSlug}`
                    : '/system-design/path'
                }
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 text-[var(--fg-comment)]"
              >
                ← {section.label} Fundamentals
              </Link>
            )}
            {nextScenario ? (
              <Link
                href={`/system-design/scenarios/${nextScenario.slug}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 text-[var(--fg-comment)]"
              >
                {nextScenario.label} →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </PageLayout>
    </>
  );
}
