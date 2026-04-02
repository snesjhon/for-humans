import fs from 'fs';
import path from 'path';
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

const PHASE_COLORS = [
  'var(--purple)',
  'var(--blue)',
  'var(--green)',
  'var(--orange)',
  'var(--cyan)',
];
const phaseColor = (n: number) => PHASE_COLORS[(n - 1) % PHASE_COLORS.length];
const DIFF_BG: Record<string, string> = {
  easy: 'var(--green-tint)',
  medium: 'var(--orange-tint)',
  hard: 'color-mix(in srgb, var(--red) 12%, var(--bg))',
};
const DIFF_FG: Record<string, string> = {
  easy: 'var(--green)',
  medium: 'var(--orange)',
  hard: 'var(--red)',
};
import { extractHeadings } from '@/lib/dsa/headings';
import { loadReferencedDsaCodeFiles } from '@/lib/dsa/stackblitz';
import MarkdownRenderer from '@/components/dsa/MarkdownRenderer/MarkdownRenderer';
import { TableOfContents, PhaseColorSync, PageHero, PageLayout, ProgressToggleAsync, ProgressProvider } from '@/components/ui';

interface Props {
  params: { id: string };
}

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
  const codeFiles = mentalModelContent
    ? loadReferencedDsaCodeFiles(mentalModelContent, problem.slug, 'problems')
    : undefined;

  const headings = mentalModelContent
    ? extractHeadings(mentalModelContent)
    : [];
  const journeySections = getSectionsForProblem(params.id);
  const primarySection = journeySections[0];
  const phase = primarySection
    ? getPhaseForSection(primarySection.id)
    : undefined;
  const color = phase ? phaseColor(phase.number) : null;
  const difficulty = getDifficultyForProblem(params.id);

  // Detect available steps from the problem directory
  const problemDir = path.join(process.cwd(), 'app', 'dsa', 'problems', problem.slug);
  const stepFiles = fs.readdirSync(problemDir).filter((f) => /^step\d+-problem\.ts$/.test(f));
  const stepNumbers = stepFiles
    .map((f) => parseInt(f.match(/^step(\d+)/)?.[1] ?? '0'))
    .sort((a, b) => a - b);

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
    <>
      {color && <PhaseColorSync color={color} />}
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

      <PageLayout accentColor={color} aside={<TableOfContents headings={headings} title="Contents" />}>
        <section className="space-y-8">
            {/* Progress section */}
            <ProgressProvider
              items={[
                { itemType: 'problem', itemId: `dsa-${params.id}` },
                ...stepNumbers.map((n) => ({
                  itemType: 'step' as const,
                  itemId: `dsa-${params.id}-step-${n}`,
                })),
              ]}
            >
              <div className="flex flex-col gap-2 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)]">
                <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase text-[var(--fg-gutter)] mb-1">
                  Your Progress
                </p>
                <ProgressToggleAsync
                  itemType="problem"
                  itemId={`dsa-${params.id}`}
                  label="Problem complete"
                />
                {stepNumbers.map((n) => (
                  <ProgressToggleAsync
                    key={n}
                    itemType="step"
                    itemId={`dsa-${params.id}-step-${n}`}
                    label={`Step ${n} complete`}
                  />
                ))}
              </div>
            </ProgressProvider>

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

            <div className="flex items-center justify-between pt-6 border-t border-t-[var(--border)]">
              {prevProblem ? (
                <Link
                  href={`/dsa/problems/${prevProblem.id}`}
                  className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 text-[var(--fg-comment)]"
                >
                  ← {prevProblem.id}. {prevProblem.title}
                </Link>
              ) : (
                <div />
              )}
              {nextProblem ? (
                <Link
                  href={`/dsa/problems/${nextProblem.id}`}
                  className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 text-[var(--fg-comment)]"
                >
                  {nextProblem.id}. {nextProblem.title} →
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
