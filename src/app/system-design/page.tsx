import { JOURNEY } from '@/lib/system-design/journey';
import { createClient } from '@/lib/supabase/server';
import { PathCanvas } from '@/components/ui/PathCanvas/PathCanvas';
import type { CurriculumEntry } from '@/components/ui/PathCanvas/PathCanvas';
import { PageHero } from '@/components/ui/PageHero/PageHero';

function buildCurriculum(): CurriculumEntry[] {
  const entries: CurriculumEntry[] = [];
  let stepNum = 0;
  const phaseSubs = ['foundations', 'scaling', 'advanced'];

  JOURNEY.forEach(phase => {
    phase.sections.forEach(section => {
      stepNum++;
      entries.push({
        section: {
          id: section.id,
          sectionKey: `sd-section-${section.id}`,
          label: section.label,
          mentalModelHook: section.mentalModelHook,
          fundamentalsHref: section.fundamentalsSlug
            ? `/system-design/fundamentals/${section.fundamentalsSlug}`
            : null,
          chips: section.firstPass.map(s => ({
            href: `/system-design/scenarios/${s.slug}`,
            label: s.label,
          })),
        },
        phase: {
          number: phase.number,
          label: phase.label,
          sub: phaseSubs[phase.number - 1],
        },
        stepNum,
      });
    });
  });

  return entries;
}

export default async function PathPage() {
  const totalSections = JOURNEY.reduce((acc, p) => acc + p.sections.length, 0);
  const totalScenarios = JOURNEY.reduce(
    (acc, p) =>
      acc + p.sections.reduce((s, sec) => s + sec.firstPass.length + sec.reinforce.length, 0),
    0,
  );
  const curriculum = buildCurriculum();

  const supabase = createClient();
  const { data: progressRows } = await supabase
    .from('progress')
    .select('item_type, item_id');

  const completedProblems = new Set<string>(
    progressRows
      ?.filter((r: { item_type: string; item_id: string }) => r.item_type === 'problem')
      .map((r: { item_type: string; item_id: string }) => r.item_id) ?? [],
  );
  const completedSections = new Set<string>(
    progressRows
      ?.filter((r: { item_type: string; item_id: string }) => r.item_type === 'section')
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

      <PathCanvas
        curriculum={curriculum}
        completedSections={completedSections}
        solvedCount={completedProblems.size}
      />
    </>
  );
}
