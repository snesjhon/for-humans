import { notFound } from 'next/navigation';
import Link from 'next/link';
import TableOfContents from '@/components/ui/TableOfContents/TableOfContents';
import TDCompletionCTA from '@/components/ui/TDCompletionCTA/TDCompletionCTA';
import { TDPageLayout } from '@/components/ui/TDPageLayout/TDPageLayout';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { ProgressProvider } from '@/components/ui/ProgressProvider/ProgressProvider';
import TDProgressPanel from '@/components/ui/TDProgressPanel/TDProgressPanel';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer/MarkdownRenderer';
import { extractHeadings } from '@/lib/frontend/headings';
import {
  getAdjacentLessons,
  getLessonContext,
} from '@/lib/interview-prep/journey';
import {
  getAllLessonSlugs,
  getLessonContent,
} from '@/lib/interview-prep/lessons';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export default function InterviewPrepLessonPage({ params }: Props) {
  const lessonContent = getLessonContent(params.slug);
  const context = getLessonContext(params.slug);

  if (!lessonContent || !context) notFound();

  const { phase, lesson, index } = context;
  const { previous, next } = getAdjacentLessons(params.slug);
  const strippedContent = lessonContent.lessonContent.replace(/^#[^#].*\n+/, '').trimStart();
  const headings = extractHeadings(strippedContent);
  const loginHref = `/login?next=${encodeURIComponent(`/interview-prep/lessons/${params.slug}`)}`;

  return (
    <ProgressProvider
      items={[{ itemType: 'lesson', itemId: lesson.slug }]}
    >
      <TDPageLayout
        hero={
          <PageHero>
            <h1 className="mb-0 font-display text-5xl leading-tight text-[var(--ms-text-body)]">
              {lesson.label}
            </h1>
            <p className="mb-6 text-md italic leading-snug text-[var(--ms-primary)]">
              &ldquo;{lesson.mentalModelHook}&rdquo;
            </p>

            <div className="flex items-center gap-2">
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                {phase.emoji} {phase.label}
              </mark>
              <mark className="rounded border border-[var(--ms-surface)] bg-transparent text-xs text-[var(--ms-text-muted)]">
                Lesson {index + 1}
              </mark>
            </div>
          </PageHero>
        }
        progress={
          <TDProgressPanel
            loginHref={loginHref}
            items={[
              {
                itemType: 'lesson',
                itemId: lesson.slug,
                label: 'Lesson complete',
              },
            ]}
          />
        }
        aside={<TableOfContents headings={headings} title="Contents" />}
      >
        <section className="space-y-8">
          {!lessonContent.hasLessonFile && (
            <div className="rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-5">
              <p className="mb-1 text-sm text-[var(--ms-text-muted)]">
                Scaffold route only
              </p>
              <p className="m-0 text-sm leading-[1.75] text-[var(--ms-text-subtle)]">
                This lesson page is wired and routable. The full `lesson.md` and
                `prompt.md` content will be added in the next build step.
              </p>
            </div>
          )}

          <MarkdownRenderer content={strippedContent} />

          <div className="rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-5">
            <p className="mb-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[var(--ms-text-faint)]">
              Concept focus
            </p>
            <div className="flex flex-wrap gap-2">
              {lesson.conceptFocus.map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] px-3 py-1 text-xs text-[var(--ms-text-subtle)]"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-t-[var(--ms-surface)] pt-6">
            {previous ? (
              <Link
                href={`/interview-prep/lessons/${previous.slug}`}
                className="flex items-center gap-2 text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
              >
                ← {previous.label}
              </Link>
            ) : (
              <Link
                href="/interview-prep/path"
                className="flex items-center gap-2 text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
              >
                ← Back to the path
              </Link>
            )}

            <TDCompletionCTA
              itemType="lesson"
              itemId={lesson.slug}
              label="Complete Lesson"
              completedLabel="Lesson Completed"
              loginHref={loginHref}
            />

            {next ? (
              <Link
                href={`/interview-prep/lessons/${next.slug}`}
                className="flex items-center gap-2 text-sm text-[var(--ms-text-subtle)] transition-opacity hover:opacity-70"
              >
                {next.label} →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </TDPageLayout>
    </ProgressProvider>
  );
}
