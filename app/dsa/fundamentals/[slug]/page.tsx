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
import { PageLayout } from '@/components/ui/PageLayout/PageLayout';

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
  const color = phase ? 'var(--primary)' : null;
  const headings = extractHeadings(guide.content);
  const codeFiles = loadReferencedDsaCodeFiles(
    guide.content,
    params.slug,
    'fundamentals',
  );

  return (
    <>
      <PageHero>
          <h1 className="text-5xl leading-tight text-[var(--fg)] font-display mb-0">
            {section?.label ??
              guide.title.replace(/\s*[–-]\s*Fundamentals/i, '')}
          </h1>
          {section && (
            <p className="text-lg italic leading-snug text-[var(--cyan)] mb-6">
              &ldquo;{section.mentalModelHook}&rdquo;
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

      <PageLayout accentColor={color} aside={<TableOfContents headings={headings} title="Contents" />}>
          <section className="space-y-8 py-2">
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
                      : '/'
                  }
                  className="inline-flex 
                  items-center gap-1.5 text-xs 
                  font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80 mt-2 bg-[var(--primary-tint)] text-[var(--primary)] no-underline border border-[var(--primary)]"
                >
                  {prereq.label} Fundamentals
                </Link>
              ) : (
                <p className="text-sm italic mt-1 text-[var(--fg-comment)] mb-0">
                  None — this is the starting point of the path.
                </p>
              )}
            </div>
            <MarkdownRenderer
              content={guide.content}
              fundamentalsSlug={params.slug}
              codeFiles={codeFiles}
            />
            <div className="flex items-center justify-between pt-8 border-t border-t-[var(--border)]">
              <Link
                href="/"
                className="text-sm transition-opacity hover:opacity-70 text-[var(--fg-comment)]"
              >
                ← Back to Learning Path
              </Link>
              {section && section.firstPass.length > 0 && (
                <Link
                  href={`/dsa/problems/${section.firstPass[0].id}`}
                  className="text-sm px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 text-white bg-[var(--primary)]"
                >
                  Start First Problem →
                </Link>
              )}
            </div>
          </section>
      </PageLayout>
    </>
  );
}
