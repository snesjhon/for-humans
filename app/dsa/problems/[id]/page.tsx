import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllProblems,
  getProblemById,
  readMarkdownFile,
} from '@/lib/dsa/content';
import {
  getSectionsForProblem,
  getPhaseForSection,
  getDifficultyForProblem,
} from '@/lib/dsa/journey';
const DIFF_BG: Record<string, string> = {
  easy: 'var(--green-tint)',
  medium: 'var(--orange-tint)',
  hard: 'var(--red-tint)',
};
const DIFF_FG: Record<string, string> = {
  easy: 'var(--green)',
  medium: 'var(--orange)',
  hard: 'var(--red)',
};
import { extractHeadings } from '@/lib/dsa/headings';
import {
  collectStackBlitzFiles,
  loadReferencedDsaCodeFiles,
} from '@/lib/dsa/stackblitz';
import MarkdownRenderer from '@/components/dsa/MarkdownRenderer/MarkdownRenderer';
import TableOfContents from '@/components/ui/TableOfContents/TableOfContents';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { DsaPageLayout } from '@/components/ui/DsaPageLayout/DsaPageLayout';

const ProblemProgressPanel = dynamic(
  () => import('@/components/dsa/ProblemProgressPanel/ProblemProgressPanel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] p-4">
        <p className="mb-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--fg-gutter)]">
          Your Progress
        </p>
        <p className="text-sm text-[var(--fg-gutter)]">Loading progress...</p>
      </div>
    ),
  },
);

interface Props {
  params: { id: string };
}

const getStepNumbers = cache((problemSlug: string) => {
  const problemDir = path.join(process.cwd(), 'app', 'dsa', 'problems', problemSlug);
  return fs
    .readdirSync(problemDir)
    .filter((f) => /^step\d+-problem\.ts$/.test(f))
    .map((f) => parseInt(f.match(/^step(\d+)/)?.[1] ?? '0'))
    .sort((a, b) => a - b);
});

export function generateStaticParams() {
  return getAllProblems().map((p) => ({ id: p.id }));
}

export default function ProblemPage({ params }: Props) {
  const problem = getProblemById(params.id);
  if (!problem) notFound();

  const rawContent = problem.files.mentalModel
    ? readMarkdownFile(problem.files.mentalModel).content
    : null;

  // Strip the leading H1 from the markdown — the page already renders the problem title
  const mentalModelContent = rawContent
    ? rawContent.replace(/^#[^\n]*\n+/, '')
    : null;
  const hasStackBlitzEmbeds = mentalModelContent
    ? collectStackBlitzFiles(mentalModelContent).length > 0
    : false;
  const codeFiles = mentalModelContent
    ? hasStackBlitzEmbeds
      ? loadReferencedDsaCodeFiles(mentalModelContent, problem.slug, 'problems')
      : undefined
    : undefined;

  const headings = mentalModelContent
    ? extractHeadings(mentalModelContent)
    : [];
  const journeySections = getSectionsForProblem(params.id);
  const primarySection = journeySections[0];
  const phase = primarySection
    ? getPhaseForSection(primarySection.id)
    : undefined;
  const difficulty = getDifficultyForProblem(params.id);

  const stepNumbers = getStepNumbers(problem.slug);

  let prevProblem = null;
  let nextProblem = null;

  if (primarySection) {
    const allInSection = [
      ...primarySection.firstPass,
      ...primarySection.reinforce,
    ];
    const idx = allInSection.findIndex((p) => p.id === params.id);
    if (idx > 0)
      prevProblem =
        getAllProblems().find((p) => p.id === allInSection[idx - 1].id) || null;
    if (idx < allInSection.length - 1)
      nextProblem =
        getAllProblems().find((p) => p.id === allInSection[idx + 1].id) || null;
  }

  return (
    <DsaPageLayout
      hero={
        <PageHero>
          <h1 className="text-5xl font-display leading-tight text-[var(--fg)] mb-0">
            {problem.title}
          </h1>
          {primarySection && (
            <p className="text-lg italic leading-snug text-[var(--cyan)] mb-6">
              &ldquo;{primarySection.mentalModelHook}&rdquo;
            </p>
          )}

          <div className="flex items-center gap-2">
            {phase && (
              <mark className="text-xs bg-transparent border border-[var(--border)] rounded text-[var(--fg-alt)]">
                {phase.emoji} {phase.label}
              </mark>
            )}

            {difficulty && (
              <mark
                className="text-xs  border border-[var(--border)] rounded"
                style={{
                  background: DIFF_BG[difficulty],
                  color: DIFF_FG[difficulty],
                }}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </mark>
            )}
          </div>
        </PageHero>
      }
      progress={
        <ProblemProgressPanel problemId={params.id} stepNumbers={stepNumbers} />
      }
      aside={<TableOfContents headings={headings} title="Contents" />}
    >
        <section className="space-y-8">
          {mentalModelContent ? (
            <MarkdownRenderer
              content={mentalModelContent}
              problemSlug={problem.slug}
              codeFiles={codeFiles}
            />
          ) : (
            <p className="text-base text-[var(--fg-gutter)]">
              Mental model coming soon.
            </p>
          )}

          <div className="flex items-center justify-between border-t border-t-[var(--border)] pt-6">
            {prevProblem ? (
              <Link
                href={`/dsa/problems/${prevProblem.id}`}
                className="flex items-center gap-2 text-sm text-[var(--fg-comment)] transition-opacity hover:opacity-70"
              >
                ← {prevProblem.id}. {prevProblem.title}
              </Link>
            ) : (
              <div />
            )}
            {nextProblem ? (
              <Link
                href={`/dsa/problems/${nextProblem.id}`}
                className="flex items-center gap-2 text-sm text-[var(--fg-comment)] transition-opacity hover:opacity-70"
              >
                {nextProblem.id}. {nextProblem.title} →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
    </DsaPageLayout>
  );
}
