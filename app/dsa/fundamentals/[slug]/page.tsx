import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getFundamentalsGuide,
  getAllFundamentalsSlugs,
  getSectionForFundamentals,
  getPrecedingSection,
} from '@/lib/dsa/fundamentals';
import { extractHeadings } from '@/lib/dsa/headings';
import { loadReferencedDsaCodeFiles } from '@/lib/dsa/stackblitz';
import MarkdownRenderer from '@/components/dsa/MarkdownRenderer/MarkdownRenderer';
import TableOfContents from '@/components/ui/TableOfContents/TableOfContents';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { DsaPageLayout } from '@/components/ui/DsaPageLayout/DsaPageLayout';

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
  const headings = extractHeadings(guide.content);
  const codeFiles = loadReferencedDsaCodeFiles(
    guide.content,
    params.slug,
    'fundamentals',
  );

  return (
    <DsaPageLayout
      hero={
        <PageHero>
          <h1 className="text-5xl leading-tight text-[var(--ms-text-body)] font-display mb-0">
            {section?.label ??
              guide.title.replace(/\s*[–-]\s*Fundamentals/i, '')}
          </h1>
          {section && (
            <p className="text-lg italic leading-snug text-[var(--ms-mauve)] mb-6">
              &ldquo;{section.mentalModelHook}&rdquo;
            </p>
          )}

          <div className="flex items-center gap-2">
            {phase && (
              <mark className="text-xs bg-transparent border border-[var(--ms-surface)] rounded text-[var(--ms-text-muted)]">
                {phase.emoji} {phase.label}
              </mark>
            )}
            <mark className="text-xs bg-transparent border border-[var(--ms-surface)] rounded text-[var(--ms-text-muted)]">
              Fundamentals
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
              href={
                prereq.fundamentalsSlug
                  ? `/fundamentals/${prereq.fundamentalsSlug}`
                  : '/'
              }
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[var(--ms-blue)] bg-[var(--ms-blue-surface)] px-3 py-1.5 text-xs font-medium text-[var(--ms-blue)] transition-opacity no-underline hover:opacity-80"
            >
              {prereq.label} Fundamentals
            </Link>
          ) : (
            <p className="mb-0 mt-1 text-sm italic text-[var(--ms-text-subtle)]">
              None — this is the starting point of the path.
            </p>
          )}
        </div>
        <MarkdownRenderer
          content={guide.content}
          fundamentalsSlug={params.slug}
          codeFiles={codeFiles}
        />
        <div className="flex items-center justify-between border-t border-t-[var(--ms-surface)] pt-8">
          <Link
            href="/"
            className="text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
          >
            ← Back to Learning Path
          </Link>
          {section && section.firstPass.length > 0 && (
            <Link
              href={`/dsa/problems/${section.firstPass[0].id}`}
              className="rounded-lg bg-[var(--ms-blue)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Start First Problem →
            </Link>
          )}
        </div>
      </section>
    </DsaPageLayout>
  );
}
