import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import {
  PhaseBannerContent,
  StepGuideCard,
} from '@/components/ui/PathComponents/PathComponents';
import { pColor } from '@/components/ui/pathUtils';
import { JOURNEY } from '@/lib/interview-prep/journey';
import { getAllScenarioSlugs } from '@/lib/interview-prep/scenarios';

type ItemEntry = {
  stepNum: number;
  item: (typeof JOURNEY)[number]['items'][number];
};

export default function InterviewPrepPathPage() {
  const phase = JOURNEY[0];
  const color = pColor(phase.number);

  const entries: ItemEntry[] = phase.items.map((item, index) => ({
    item,
    stepNum: index + 1,
  }));

  const availableScenarioSlugs = new Set(getAllScenarioSlugs());

  return (
    <>
      <PageHero>
        <h1 className="font-display text-5xl text-[var(--ms-text-body)]">
          The Interview Prep Path
        </h1>
        <p className="mb-0 text-sm text-[var(--ms-text-faint)]">
          {entries.length} topics — each with a fundamentals guide and a scenario
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

          {entries.map(({ item, stepNum }, index) => {
            const isLast = index === entries.length - 1;
            const hasScenario =
              !!item.scenarioSlug &&
              availableScenarioSlugs.has(item.scenarioSlug);

            return (
              <div
                key={item.id}
                className={`grid grid-cols-2 items-start gap-7 ${
                  isLast ? 'pb-6' : 'pb-12'
                }`}
              >
                <div>
                  <StepGuideCard
                    href={
                      item.fundamentalsSlug
                        ? `/interview-prep/fundamentals/${item.fundamentalsSlug}`
                        : item.scenarioSlug
                          ? `/interview-prep/scenarios/${item.scenarioSlug}`
                          : '#'
                    }
                    label={item.label}
                    hook={item.mentalModelHook}
                    stepNum={String(stepNum).padStart(2, '0')}
                    color={color}
                  />
                </div>

                <div className="pt-1">
                  <p className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-text-faint)]">
                    Scenario
                  </p>
                  {item.scenarioBlurb && (
                    <p className="mb-2 m-0 max-w-[460px] text-[0.9375rem] leading-[1.75] text-[var(--ms-text-subtle)]">
                      {item.scenarioBlurb}
                    </p>
                  )}
                  {hasScenario ? (
                    <Link
                      href={`/interview-prep/scenarios/${item.scenarioSlug}`}
                      className="text-sm text-[var(--ms-blue)] no-underline transition-opacity hover:opacity-80"
                    >
                      Open scenario →
                    </Link>
                  ) : (
                    <p className="m-0 font-display text-sm italic text-[var(--ms-text-faint)]">
                      Scenario coming soon.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
