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
import { extractHeadings } from '@/lib/dsa/headings';
import {
  collectStackBlitzFiles,
  loadReferencedDsaCodeFiles,
} from '@/lib/dsa/stackblitz';
import MarkdownRenderer from '@/components/dsa/MarkdownRenderer/MarkdownRenderer';
import TableOfContents from '@/components/ui/TableOfContents/TableOfContents';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { DsaPageLayout } from '@/components/ui/DsaPageLayout/DsaPageLayout';
import { ProgressProvider } from '@/components/ui/ProgressProvider/ProgressProvider';
import CompletionCTA from '@/components/dsa/CompletionCTA/CompletionCTA';

const DIFF_BG: Record<string, string> = {
  easy: 'var(--ms-green-surface)',
  medium: 'var(--ms-peach-surface)',
  hard: 'var(--ms-red-surface)',
};

const DIFF_FG: Record<string, string> = {
  easy: 'var(--ms-green)',
  medium: 'var(--ms-peach)',
  hard: 'var(--ms-red)',
};

const ProblemProgressPanel = dynamic(
  () => import('@/components/dsa/ProblemProgressPanel/ProblemProgressPanel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-2 rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-4">
        <p className="mb-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-text-faint)]">
          Your Progress
        </p>
        <p className="text-sm text-[var(--ms-text-faint)]">
          Loading progress...
        </p>
      </div>
    ),
  },
);

interface Props {
  params: { id: string };
}

const getStepNumbers = cache((problemSlug: string) => {
  const problemDir = path.join(
    process.cwd(),
    'app',
    'dsa',
    'problems',
    problemSlug,
  );
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
    <ProgressProvider
      items={[
        { itemType: 'problem', itemId: `dsa-${params.id}` },
        ...stepNumbers.map((n) => ({
          itemType: 'step' as const,
          itemId: `dsa-${params.id}-step-${n}`,
        })),
      ]}
    >
      <DsaPageLayout
        hero={
          <PageHero>
            <h1 className="text-5xl font-display leading-tight text-[var(--ms-text-body)] mb-0">
              {problem.title}
            </h1>
            {primarySection && (
              <p className="text-md italic leading-snug text-[var(--ms-primary)] mb-6">
                &ldquo;{primarySection.mentalModelHook}&rdquo;
              </p>
            )}

            <div className="flex items-center gap-2">
              {phase && (
                <mark className="text-xs bg-transparent border border-[var(--ms-surface)] rounded text-[var(--ms-text-muted)]">
                  {phase.emoji} {phase.label}
                </mark>
              )}

              {difficulty && (
                <mark
                  className="text-xs  border border-[var(--ms-surface)] rounded"
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
          <ProblemProgressPanel
            problemId={params.id}
            stepNumbers={stepNumbers}
          />
        }
        aside={<TableOfContents headings={headings} title="Contents" />}
      >
        <section className="space-y-8">
          {mentalModelContent ? (
            <MarkdownRenderer
              content={mentalModelContent}
              problemSlug={problem.slug}
              problemId={params.id}
              codeFiles={codeFiles}
            />
          ) : (
            <p className="text-base text-[var(--ms-text-faint)]">
              Mental model coming soon.
            </p>
          )}

          <div className="flex items-center justify-between border-t border-t-[var(--ms-surface)] pt-6">
            {prevProblem ? (
              <Link
                href={`/dsa/problems/${prevProblem.id}`}
                className="flex items-center gap-2 text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
              >
                ← {prevProblem.id}. {prevProblem.title}
              </Link>
            ) : (
              <div />
            )}
            <CompletionCTA
              itemType="problem"
              itemId={`dsa-${params.id}`}
              label="Complete Problem"
              completedLabel="Problem Completed"
              loginHref={`/login?next=${encodeURIComponent(`/dsa/problems/${params.id}`)}`}
            />
            {nextProblem ? (
              <Link
                href={`/dsa/problems/${nextProblem.id}`}
                className="flex items-center gap-2 text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
              >
                {nextProblem.id}. {nextProblem.title} →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </DsaPageLayout>
    </ProgressProvider>
  );
}
