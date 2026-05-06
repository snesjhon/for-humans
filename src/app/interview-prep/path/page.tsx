import Link from 'next/link';
import { ProgressToggle } from '@/components/ui/ProgressToggle/ProgressToggle';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import {
  PhaseBannerContent,
  StepGuideCard,
} from '@/components/ui/PathComponents/PathComponents';
import { pColor } from '@/components/ui/pathUtils';
import { createClient } from '@/lib/supabase/server';
import { JOURNEY } from '@/lib/interview-prep/journey';

type LessonEntry = {
  stepNum: number;
  lesson: (typeof JOURNEY)[number]['lessons'][number];
};

export default async function InterviewPrepPathPage() {
  const phase = JOURNEY[0];
  const color = pColor(phase.number);

  const entries: LessonEntry[] = phase.lessons.map((lesson, index) => ({
    lesson,
    stepNum: index + 1,
  }));

  const supabase = createClient();
  const { data: progressRows } = await supabase
    .from('progress')
    .select('item_type, item_id');

  const completedLessons = new Set(
    progressRows
      ?.filter(
        (row: { item_type: string; item_id: string }) => row.item_type === 'lesson',
      )
      .map((row: { item_type: string; item_id: string }) => row.item_id) ?? [],
  );

  return (
    <>
      <PageHero>
        <h1 className="font-display text-5xl text-[var(--ms-text-body)]">
          The Interview Prep Path
        </h1>
        <p className="mb-0 text-sm text-[var(--ms-text-faint)]">
          {entries.length} lessons to build and explain one React dashboard
        </p>
      </PageHero>

      <div
        id={`phase-zone-${phase.number}`}
        className="bg-[var(--ms-bg-pane-secondary)]"
      >
        <div className="mx-auto max-w-[1152px] px-6">
          <PhaseBannerContent
            phase={phase}
            color={color}
            chapterLabel={String(phase.number).padStart(2, '0')}
          />

          {entries.map(({ lesson, stepNum }, index) => {
            const isLast = index === entries.length - 1;

            return (
              <div
                key={lesson.slug}
                className={`grid grid-cols-2 items-start gap-7 ${
                  isLast ? 'pb-6' : 'pb-12'
                }`}
              >
                <div>
                  <StepGuideCard
                    href={`/interview-prep/lessons/${lesson.slug}`}
                    label={lesson.label}
                    hook={lesson.mentalModelHook}
                    stepNum={String(stepNum).padStart(2, '0')}
                    color={color}
                  />

                  <div className="mt-3 flex items-center justify-between rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] px-3 py-2">
                    <div className="text-xs text-[var(--ms-text-subtle)]">
                      Track progress for this lesson
                    </div>
                    <ProgressToggle
                      itemType="lesson"
                      itemId={lesson.slug}
                      initialCompleted={completedLessons.has(lesson.slug)}
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <p className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-text-faint)]">
                    Focus
                  </p>
                  <p className="m-0 max-w-[460px] text-[0.9375rem] leading-[1.75] text-[var(--ms-text-subtle)]">
                    {lesson.blurb}
                  </p>

                  <div className="mt-5">
                    <Link
                      href={`/interview-prep/lessons/${lesson.slug}`}
                      className="text-sm text-[var(--ms-blue)] no-underline transition-opacity hover:opacity-80"
                    >
                      Open lesson →
                    </Link>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-text-faint)]">
                      Concepts
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
