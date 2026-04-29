import Link from 'next/link';
import { JOURNEY } from '@/lib/frontend/journey';
import { getAllFundamentalsSlugs } from '@/lib/frontend/fundamentals';
import { createClient } from '@/lib/supabase/server';
import type { FrontendJourneySection, Phase } from '@/lib/frontend/types';
import {
  PhaseBannerContent,
  StepGuideCard,
  PlaceholderGuideCard,
} from '@/components/ui/PathComponents/PathComponents';
import { SectionProgress } from '@/components/ui/SectionProgress/SectionProgress';
import { PhaseTracker } from '@/components/ui/PhaseTracker/PhaseTracker';
import { pColor } from '@/components/ui/pathUtils';
import { PageHero } from '@/components/ui/PageHero/PageHero';

type SectionEntry = {
  section: FrontendJourneySection;
  phase: Phase;
  stepNum: number;
};

type PhaseGroup = {
  phase: Phase;
  entries: SectionEntry[];
};

function buildCurriculum(): SectionEntry[] {
  const entries: SectionEntry[] = [];
  let stepNum = 0;

  JOURNEY.forEach((phase) => {
    phase.sections.forEach((section) => {
      stepNum += 1;
      entries.push({ section, phase, stepNum });
    });
  });

  return entries;
}

function buildPhaseGroups(): PhaseGroup[] {
  const curriculum = buildCurriculum();
  const groups: PhaseGroup[] = [];

  for (const entry of curriculum) {
    const last = groups[groups.length - 1];
    if (!last || last.phase.number !== entry.phase.number) {
      groups.push({ phase: entry.phase, entries: [entry] });
    } else {
      last.entries.push(entry);
    }
  }

  return groups;
}

export default async function PathPage() {
  const availableFundamentalsSlugs = new Set(getAllFundamentalsSlugs());
  const totalSections = JOURNEY.reduce(
    (count, phase) => count + phase.sections.length,
    0,
  );
  const phaseGroups = buildPhaseGroups();

  const supabase = createClient();
  const { data: progressRows } = await supabase
    .from('progress')
    .select('item_type, item_id');

  const completedSections = new Set(
    progressRows
      ?.filter(
        (row: { item_type: string; item_id: string }) => row.item_type === 'section',
      )
      .map((row: { item_type: string; item_id: string }) => row.item_id) ?? [],
  );

  return (
    <>
      <PageHero>
        <h1 className="font-display text-5xl text-[var(--ms-text-body)]">
          The Frontend Path
        </h1>
        <p className="mb-0 text-sm text-[var(--ms-text-faint)]">
          {totalSections} mental models across TypeScript and React
        </p>
      </PageHero>

      <div>
        {phaseGroups.map(({ phase, entries }) => {
          const color = pColor(phase.number);
          const chapterLabel = String(phase.number).padStart(2, '0');

          return (
            <div
              key={phase.number}
              id={`phase-zone-${phase.number}`}
              className="bg-[var(--ms-bg-pane-secondary)]"
            >
              <div className="mx-auto max-w-[1152px] px-6">
                <PhaseBannerContent
                  phase={phase}
                  color={color}
                  chapterLabel={chapterLabel}
                />

                {entries.map((entry, index) => {
                  const { section, stepNum } = entry;
                  const isLast = index === entries.length - 1;
                  const stepLabel = String(stepNum).padStart(2, '0');
                  const hasGuide = availableFundamentalsSlugs.has(
                    section.fundamentalsSlug,
                  );

                  return (
                    <div
                      key={section.id}
                      className={`grid grid-cols-2 items-start gap-7 ${
                        isLast ? 'pb-6' : 'pb-12'
                      }`}
                    >
                      <div>
                        {hasGuide ? (
                          <StepGuideCard
                            href={`/frontend/fundamentals/${section.fundamentalsSlug}`}
                            label={section.label}
                            hook={section.mentalModelHook}
                            stepNum={stepLabel}
                            color={color}
                          />
                        ) : (
                          <PlaceholderGuideCard
                            label={section.label}
                            hook={section.mentalModelHook}
                            stepNum={stepLabel}
                          />
                        )}

                        <SectionProgress
                          sectionItemId={`fe-section-${section.id}`}
                          problemItemIds={[]}
                          initialCompletedProblemIds={[]}
                          initialSectionCompleted={completedSections.has(
                            `fe-section-${section.id}`,
                          )}
                        />
                      </div>

                      <div className="pt-1">
                        <p className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-text-faint)]">
                          Focus
                        </p>
                        <p className="m-0 max-w-[460px] text-[0.9375rem] leading-[1.75] text-[var(--ms-text-subtle)]">
                          {section.fundamentalsBlurb}
                        </p>

                        <div className="mt-5">
                          {hasGuide ? (
                            <Link
                              href={`/frontend/fundamentals/${section.fundamentalsSlug}`}
                              className="text-sm text-[var(--ms-blue)] no-underline transition-opacity hover:opacity-80"
                            >
                              Open fundamentals →
                            </Link>
                          ) : (
                            <p className="m-0 font-display text-sm italic text-[var(--ms-text-faint)]">
                              Guide coming soon.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <PhaseTracker phaseCount={phaseGroups.length} />
    </>
  );
}
