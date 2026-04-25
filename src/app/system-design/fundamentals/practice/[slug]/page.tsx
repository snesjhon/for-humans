import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getFundamentalsPractice,
  getAllPracticeSlugs,
  getSectionForFundamentals,
} from '@/lib/system-design/fundamentals';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { TDPageLayout } from '@/components/ui/TDPageLayout/TDPageLayout';
import MarkdownRenderer from '@/components/system-design/MarkdownRenderer/MarkdownRenderer';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPracticeSlugs().map((slug) => ({ slug }));
}

export default function PracticePage({ params }: Props) {
  const guide = getFundamentalsPractice(params.slug);
  if (!guide) notFound();

  const context = getSectionForFundamentals(params.slug);
  const phase = context?.phase;
  const section = context?.section;

  const strippedContent = guide.content.replace(/^#[^#].*\n+/, '').trimStart();

  return (
    <TDPageLayout
      hero={
        <PageHero>
          <h1 className="text-5xl leading-tight text-[var(--ms-text-body)] font-display mb-0">
            {section?.label ?? guide.title}
          </h1>
          <div className="flex items-center gap-2 mt-3">
            {phase && (
              <mark className="text-xs bg-transparent border border-[var(--ms-surface)] rounded text-[var(--ms-text-muted)]">
                {phase.emoji} {phase.label}
              </mark>
            )}
            <mark className="text-xs bg-transparent border border-[var(--ms-surface)] rounded text-[var(--ms-text-muted)]">
              Practice
            </mark>
          </div>
        </PageHero>
      }
      aside={
        <div className="space-y-4">
          <Link
            href={`/system-design/fundamentals/${params.slug}`}
            className="block text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70 no-underline"
          >
            ← Back to Fundamentals
          </Link>
        </div>
      }
    >
      <section className="space-y-8 py-2">
        <MarkdownRenderer
          content={strippedContent}
          prompts={guide.exercisePrompts}
          phase={phase?.number ?? 1}
          storageKeyPrefix={`practice:${params.slug}`}
        />

        <div className="border-t border-t-[var(--ms-surface)] pt-8">
          <Link
            href={`/system-design/fundamentals/${params.slug}`}
            className="text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
          >
            ← Back to {section?.label ?? guide.title} Fundamentals
          </Link>
        </div>
      </section>
    </TDPageLayout>
  );
}
