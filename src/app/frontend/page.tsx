import { JOURNEY } from '@/lib/frontend/journey';
import { createClient } from '@/lib/supabase/server';
import { PathCanvas } from '@/components/ui/PathCanvas/PathCanvas';
import type { CurriculumEntry } from '@/components/ui/PathCanvas/PathCanvas';
import { PageHero } from '@/components/ui/PageHero/PageHero';

function buildCurriculum(): CurriculumEntry[] {
  const entries: CurriculumEntry[] = [];
  let stepNum = 0;
  const phaseSubs = ['fundamentals', 'patterns', 'mastery'];

  JOURNEY.forEach(phase => {
    phase.sections.forEach(section => {
      stepNum++;
      entries.push({
        section: {
          id: section.id,
          sectionKey: `fe-section-${section.id}`,
          label: section.label,
          mentalModelHook: section.mentalModelHook,
          fundamentalsHref: `/frontend/fundamentals/${section.fundamentalsSlug}`,
          chips: section.practice.map(p => ({
            href: `/frontend/problems/${p.id}`,
            label: p.label,
            id: p.id,
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
        <h1 className="font-display text-5xl text-[var(--ms-text-body)]">
          The Frontend Path
        </h1>
        <p className="mb-0 text-sm text-[var(--ms-text-faint)]">
          {totalSections} mental models across TypeScript and React
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
