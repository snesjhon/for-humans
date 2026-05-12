import Link from 'next/link';
import { JOURNEY } from '@/lib/system-design/journey';
import { createClient } from '@/lib/supabase/server';
import type { JourneySection, Phase } from '@/lib/system-design/types';
import {
  PhaseBannerContent,
  StepGuideCard,
  PlaceholderGuideCard,
} from '@/components/ui/PathComponents/PathComponents';
import { ProgressToggle } from '@/components/ui/ProgressToggle/ProgressToggle';
import { SectionProgress } from '@/components/ui/SectionProgress/SectionProgress';
import { PhaseTracker } from '@/components/ui/PhaseTracker/PhaseTracker';
import { pColor } from '@/components/ui/pathUtils';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import pathStyles from '@/components/ui/PathComponents/PathComponents.module.css';

type SectionEntry = {
  section: JourneySection;
  phase: Phase;
  revisitSlugs: { slug: string; label: string }[];
  revisitFromLabel: string;
  stepNum: number;
};

function buildCurriculum(): SectionEntry[] {
  const entries: SectionEntry[] = [];
  let pendingSlugs: { slug: string; label: string }[] = [];
  let pendingFrom = '';
  let stepNum = 0;

  JOURNEY.forEach((phase) => {
    phase.sections.forEach((section) => {
      stepNum++;
      entries.push({
        section,
        phase,
        revisitSlugs: pendingSlugs,
        revisitFromLabel: pendingFrom,
        stepNum,
      });
      pendingSlugs = section.reinforce.map((s) => ({
        slug: s.slug,
        label: s.label,
      }));
      pendingFrom = section.label;
    });
  });

  if (pendingSlugs.length > 0 && entries.length > 0) {
    const last = entries[entries.length - 1];
    entries[entries.length - 1] = {
      ...last,
      revisitSlugs: [...last.revisitSlugs, ...pendingSlugs],
      revisitFromLabel: last.revisitFromLabel || pendingFrom,
    };
  }
  return entries;
}

type PhaseGroup = { phase: Phase; entries: SectionEntry[] };

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
  const totalScenarios = JOURNEY.reduce(
    (acc, p) =>
      acc +
      p.sections.reduce(
        (s, sec) => s + sec.firstPass.length + sec.reinforce.length,
        0,
      ),
    0,
  );
  const totalSections = JOURNEY.reduce((acc, p) => acc + p.sections.length, 0);

  const phaseGroups = buildPhaseGroups();

  const supabase = createClient();
  const { data: progressRows } = await supabase
    .from('progress')
    .select('item_type, item_id');

  const completedProblems = new Set(
    progressRows
      ?.filter(
        (r: { item_type: string; item_id: string }) => r.item_type === 'problem',
      )
      .map((r: { item_type: string; item_id: string }) => r.item_id) ?? [],
  );
  const completedSections = new Set(
    progressRows
      ?.filter(
        (r: { item_type: string; item_id: string }) => r.item_type === 'section',
      )
      .map((r: { item_type: string; item_id: string }) => r.item_id) ?? [],
  );

  return (
    <>
      <PageHero>
        <h1 className="text-5xl text-[var(--ms-text-body)] font-display">
          The Path
        </h1>
        <p className="text-sm text-[var(--ms-text-faint)] mb-0">
          {totalSections} mental models · {totalScenarios} scenarios
        </p>
      </PageHero>
      <div>
        {phaseGroups.map(({ phase, entries }, groupIdx) => {
          const color = pColor(phase.number);
          void groupIdx;
          const chapterLabel = String(phase.number).padStart(2, '0');

          return (
            <div
              key={phase.number}
              id={`phase-zone-${phase.number}`}
              className="bg-[var(--ms-bg-pane-secondary)]"
            >
              <div className="max-w-[1152px] mx-auto px-6">
                <PhaseBannerContent
                  phase={phase}
                  color={color}
                  chapterLabel={chapterLabel}
                />

                {entries.map((entry, entryIdx) => {
                  const { section, revisitSlugs, revisitFromLabel, stepNum } =
                    entry;
                  const stepLabel = String(stepNum).padStart(2, '0');
                  const hasNewScenarios = section.firstPass.length > 0;
                  const hasRevisits = revisitSlugs.length > 0;
                  const hasAnyScenarios = hasNewScenarios || hasRevisits;
                  const isLast = entryIdx === entries.length - 1;

                  const firstPassItemIds = section.firstPass.map(
                    (s) => `sd-${s.slug}`,
                  );

                  return (
                    <div
                      key={section.id}
                      className={`grid grid-cols-2 items-start gap-7 ${
                        isLast ? 'pb-6' : 'pb-12'
                      }`}
                    >
                      <div>
                        {section.fundamentalsSlug ? (
                          <StepGuideCard
                            href={`/system-design/fundamentals/${section.fundamentalsSlug}`}
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
                          sectionItemId={`sd-section-${section.id}`}
                          problemItemIds={firstPassItemIds}
                          initialCompletedProblemIds={firstPassItemIds.filter((id) =>
                            completedProblems.has(id),
                          )}
                          initialSectionCompleted={completedSections.has(
                            `sd-section-${section.id}`,
                          )}
                        />
                      </div>

                      <div className="pt-1">
                        {!hasAnyScenarios && (
                          <p className="font-display italic text-sm text-[var(--ms-text-faint)] m-0">
                            Scenarios coming soon.
                          </p>
                        )}

                        {hasNewScenarios && (
                          <div className={hasRevisits ? 'mb-5' : ''}>
                            <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase mb-2 text-[var(--ms-text-faint)]">
                              Practice
                            </p>
                            {section.firstPass.map(({ slug, label }) => {
                              const itemId = `sd-${slug}`;
                              return (
                                <div
                                  key={slug}
                                  className="flex items-center gap-1 py-[5px]"
                                >
                                  <ProgressToggle
                                    itemType="problem"
                                    itemId={itemId}
                                    initialCompleted={completedProblems.has(itemId)}
                                  />
                                  <Link
                                    href={`/system-design/scenarios/${slug}`}
                                    className={`${pathStyles.problemLink} flex items-baseline`}
                                  >
                                    <span className="shrink-0 min-w-[30px] font-mono text-[0.65rem] text-[var(--ms-text-faint)]">
                                      SD
                                    </span>
                                    <span className={`${pathStyles.problemTitle} text-[0.875rem] leading-[1.3] text-[var(--ms-text-muted)]`}>
                                      {label}
                                    </span>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {hasRevisits && (
                          <div>
                            <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase mb-2 text-[var(--ms-peach)]">
                              Revisit from {revisitFromLabel}
                            </p>
                            {revisitSlugs.map(({ slug, label }) => {
                              const itemId = `sd-${slug}`;
                              return (
                                <div
                                  key={slug}
                                  className="flex items-center gap-1 py-[5px]"
                                >
                                  <ProgressToggle
                                    itemType="problem"
                                    itemId={itemId}
                                    initialCompleted={completedProblems.has(itemId)}
                                  />
                                  <Link
                                    href={`/system-design/scenarios/${slug}`}
                                    className={`${pathStyles.problemLink} flex items-baseline`}
                                  >
                                    <span className="shrink-0 min-w-[30px] font-mono text-[0.65rem] text-[var(--ms-peach)]">
                                      ↺
                                    </span>
                                    <span className={`${pathStyles.problemTitle} text-[0.875rem] leading-[1.3] text-[var(--ms-text-muted)]`}>
                                      {label}
                                    </span>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="max-w-[1152px] mx-auto px-6 py-4">
          <PhaseTracker phaseCount={phaseGroups.length} />
        </div>
      </div>
    </>
  );
}
