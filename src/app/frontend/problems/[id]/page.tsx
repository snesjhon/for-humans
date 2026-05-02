import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllFrontendProblems,
  getFrontendProblemById,
  readFrontendMarkdownFile,
} from '@/lib/frontend/problems';
import { JOURNEY } from '@/lib/frontend/journey';
import { extractHeadings } from '@/lib/frontend/headings';
import { loadReferencedFrontendCodeFiles } from '@/lib/frontend/stackblitz';
import MarkdownRenderer from '@/components/exercises/MarkdownRenderer/MarkdownRenderer';
import TableOfContents from '@/components/ui/TableOfContents/TableOfContents';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { TDPageLayout } from '@/components/ui/TDPageLayout/TDPageLayout';
import { ProgressProvider } from '@/components/ui/ProgressProvider/ProgressProvider';
import TDCompletionCTA from '@/components/ui/TDCompletionCTA/TDCompletionCTA';
import TDProgressPanel from '@/components/ui/TDProgressPanel/TDProgressPanel';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllFrontendProblems().map((problem) => ({ id: problem.id }));
}

const DIFFICULTY_TONE: Record<string, string> = {
  easy: 'var(--ms-green)',
  medium: 'var(--ms-peach)',
  hard: 'var(--ms-red)',
};

function getStepNumbers(problemSlug: string) {
  const problemDir = path.join(
    process.cwd(),
    'src',
    'app',
    'frontend',
    'problems',
    problemSlug,
  );

  if (!fs.existsSync(problemDir)) return [];

  return fs
    .readdirSync(problemDir)
    .filter((file) => /^step\d+-problem\.tsx?$/.test(file))
    .map((file) => parseInt(file.match(/^step(\d+)/)?.[1] ?? '0', 10))
    .filter((step) => step > 0)
    .sort((left, right) => left - right);
}

function getJourneySection(sectionId: string) {
  for (const phase of JOURNEY) {
    const section = phase.sections.find((entry) => entry.id === sectionId);
    if (section) return { phase, section };
  }

  return null;
}

export default function FrontendProblemPage({ params }: Props) {
  const problem = getFrontendProblemById(params.id);
  if (!problem) notFound();

  const mentalModelContent = problem.files.mentalModel
    ? readFrontendMarkdownFile(problem.files.mentalModel).content
    : null;
  const headings = mentalModelContent ? extractHeadings(mentalModelContent) : [];
  const codeFiles = mentalModelContent
    ? loadReferencedFrontendCodeFiles(mentalModelContent, problem.slug, 'problems')
    : undefined;
  const stepNumbers = getStepNumbers(problem.slug);
  const journeyContext = getJourneySection(problem.sectionId);
  const loginHref = `/login?next=${encodeURIComponent(`/frontend/problems/${params.id}`)}`;

  return (
    <ProgressProvider
      items={[
        { itemType: 'problem', itemId: `fe-problem-${params.id}` },
        ...stepNumbers.map((stepNum) => ({
          itemType: 'step' as const,
          itemId: `fe-problem-${params.id}-step-${stepNum}`,
        })),
      ]}
    >
      <TDPageLayout
        progress={
          <TDProgressPanel
            loginHref={loginHref}
            items={[
              {
                itemType: 'problem',
                itemId: `fe-problem-${params.id}`,
                label: 'Problem complete',
              },
              ...stepNumbers.map((stepNum) => ({
                itemType: 'step' as const,
                itemId: `fe-problem-${params.id}-step-${stepNum}`,
                label: `Step ${stepNum} complete`,
              })),
            ]}
          />
        }
        hero={
          <PageHero>
            <h1 className="mb-0 font-display text-5xl leading-tight text-[var(--ms-text-body)]">
              {problem.title}
            </h1>
            {journeyContext && (
              <p className="mb-6 text-lg italic leading-snug text-[var(--ms-primary)]">
                &ldquo;{journeyContext.section.mentalModelHook}&rdquo;
              </p>
            )}

            <p className="max-w-[720px] text-base leading-[1.75] text-[var(--ms-text-subtle)]">
              {problem.prompt}
            </p>

            <div className="flex items-center gap-2">
              {journeyContext && (
                <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                  {journeyContext.phase.emoji} {journeyContext.phase.label}
                </mark>
              )}
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                {problem.tier === 'practice' ? 'Practice' : 'Advanced'}
              </mark>
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                {problem.kind === 'react'
                  ? 'React'
                  : problem.kind === 'mixed'
                    ? 'Mixed'
                    : 'TypeScript'}
              </mark>
              <mark
                className="rounded border border-[var(--ms-surface)] bg-transparent text-xs"
                style={{ color: DIFFICULTY_TONE[problem.difficulty] }}
              >
                {problem.difficulty.charAt(0).toUpperCase() +
                  problem.difficulty.slice(1)}
              </mark>
            </div>
          </PageHero>
        }
        aside={<TableOfContents headings={headings} title="Contents" />}
      >
        <section className="space-y-8 py-2">
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

          <div className="flex items-center justify-between border-t border-t-[var(--ms-surface)] pt-8">
            <Link
              href="/frontend/path"
              className="text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
            >
              ← Back to Frontend Path
            </Link>
            <TDCompletionCTA
              itemType="problem"
              itemId={`fe-problem-${params.id}`}
              label="Complete Problem"
              completedLabel="Problem Completed"
              loginHref={loginHref}
            />
            <div />
          </div>
        </section>
      </TDPageLayout>
    </ProgressProvider>
  );
}
