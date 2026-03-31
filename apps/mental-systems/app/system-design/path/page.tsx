import Link from 'next/link';
import { JOURNEY, type JourneySection, type Phase } from '@/lib/system-design/journey';
import {
  PhaseTracker,
  PathTOC,
  PhaseBannerContent,
  StepGuideCard,
  PlaceholderGuideCard,
  pColor,
  PageHero,
} from '@for-humans/ui';

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

export default function PathPage() {
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

  return (
    <>
      <PageHero>
        <h1 className="text-5xl font-bold leading-tight text-[var(--fg)]">
          The Path
        </h1>
        <p className="text-sm text-[var(--fg-gutter)] mt-2">
          {totalSections} mental models · {totalScenarios} scenarios
        </p>
      </PageHero>

      {/* ─────────────────────────────────────────── PHASE ZONES + sticky TOC */}
      <div className="relative">
        {/* Sticky TOC — absolutely spans all phase zones */}
        <aside
          className="hidden lg:block absolute top-0 left-0 h-full pl-10 pt-10 w-[calc(314px+2.5rem)]"
          style={{
            background:
              'color-mix(in srgb, var(--active-phase-color) 8%, var(--bg))',
            transition: 'background 300ms ease',
          }}
        >
          <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <PathTOC phases={phaseGroups.map((g) => g.phase)} />
          </div>
        </aside>

        {phaseGroups.map(({ phase, entries }, groupIdx) => {
          const color = pColor(phase.number);
          const nextColor =
            groupIdx < phaseGroups.length - 1
              ? pColor(phaseGroups[groupIdx + 1].phase.number)
              : null;
          const chapterLabel = String(phase.number).padStart(2, '0');

          const zoneBg = nextColor
            ? `linear-gradient(180deg,
                color-mix(in srgb, ${color} 8%, var(--bg)) 0%,
                color-mix(in srgb, ${color} 8%, var(--bg)) 60%,
                color-mix(in srgb, ${nextColor} 4%, var(--bg)) 100%)`
            : `color-mix(in srgb, ${color} 8%, var(--bg))`;

          return (
            <div
              key={phase.number}
              id={`phase-zone-${phase.number}`}
              style={{ background: zoneBg }}
            >
              <div className="block lg:grid items-start gap-12 px-10 py-10 lg:grid-cols-[0.3fr_minmax(250px,1fr)] xl:grid-cols-[0.3fr_1fr_0.2fr]">
                <div className="hidden lg:block" /> {/* TOC column spacer */}
                <div className="min-w-0">
                  <PhaseBannerContent
                    phase={phase}
                    color={color}
                    chapterLabel={chapterLabel}
                  />

                  {entries.map((entry, entryIdx) => {
                    const { section, revisitSlugs, revisitFromLabel, stepNum } =
                      entry;
                    const accent = color;
                    const stepLabel = String(stepNum).padStart(2, '0');
                    const hasNewScenarios = section.firstPass.length > 0;
                    const hasRevisits = revisitSlugs.length > 0;
                    const hasAnyScenarios = hasNewScenarios || hasRevisits;
                    const isLast = entryIdx === entries.length - 1;

                    return (
                      <div
                        key={section.id}
                        className="grid grid-cols-2 gap-7 items-start"
                        style={{ paddingBottom: isLast ? 24 : 48 }}
                      >
                        {/* LEFT: Guide card */}
                        {section.fundamentalsSlug ? (
                          <StepGuideCard
                            href={`/system-design/fundamentals/${section.fundamentalsSlug}`}
                            label={section.label}
                            hook={section.mentalModelHook}
                            stepNum={stepLabel}
                            color={accent}
                          />
                        ) : (
                          <PlaceholderGuideCard
                            label={section.label}
                            hook={section.mentalModelHook}
                            stepNum={stepLabel}
                          />
                        )}

                        {/* RIGHT: Practice scenarios + revisit */}
                        <div className="pt-1">
                          {!hasAnyScenarios && (
                            <p
                              className="italic text-sm text-[var(--fg-gutter)] m-0"
                              style={{
                                fontFamily: 'var(--font-display, inherit)',
                              }}
                            >
                              Scenarios coming soon.
                            </p>
                          )}

                          {hasNewScenarios && (
                            <div style={{ marginBottom: hasRevisits ? 20 : 0 }}>
                              <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase mb-2 text-[var(--fg-gutter)]">
                                Practice
                              </p>
                              {section.firstPass.map(({ slug, label }) => (
                                <Link
                                  key={slug}
                                  href={`/system-design/scenarios/${slug}`}
                                  className="problem-link flex items-baseline py-[5px]"
                                >
                                  <span className="shrink-0 w-5" />
                                  <span className="problem-title text-[0.875rem] leading-[1.3] text-[var(--fg-alt)]">
                                    {label}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}

                          {hasRevisits && (
                            <div>
                              <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase mb-2 text-[var(--orange)]">
                                Also revisit — from {revisitFromLabel}
                              </p>
                              {revisitSlugs.map(({ slug, label }) => (
                                <Link
                                  key={`r-${slug}`}
                                  href={`/system-design/scenarios/${slug}`}
                                  className="problem-link flex items-baseline py-[5px]"
                                >
                                  <span className="text-xs shrink-0 w-5 leading-none text-[var(--orange)]">
                                    ↩
                                  </span>
                                  <span className="problem-title text-[0.875rem] leading-[1.3] text-[var(--fg-comment)]">
                                    {label}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Footer strip */}
        <div className="block lg:grid gap-12 px-10 lg:grid-cols-[0.3fr_minmax(250px,1fr)]">
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4 pt-8 pb-16">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[0.8rem] italic text-[var(--fg-gutter)] shrink-0 font-[var(--font-display)]">
              More mental models coming
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
        </div>
      </div>

      <PhaseTracker phaseCount={phaseGroups.length} />
    </>
  );
}
