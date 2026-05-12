import { JOURNEY } from '@/lib/dsa/journey';
import { getAllProblems } from '@/lib/dsa/content';
import { createClient } from '@/lib/supabase/server';
import { DsaPathCanvas } from '@/components/ui/DsaPathCanvas/DsaPathCanvas';
import type { CurriculumEntry } from '@/components/ui/DsaPathCanvas/DsaPathCanvas';

function buildCurriculum(): CurriculumEntry[] {
  const entries: CurriculumEntry[] = [];
  let stepNum = 0;
  JOURNEY.forEach(phase => {
    phase.sections.forEach(section => {
      stepNum++;
      entries.push({ section, phase, stepNum });
    });
  });
  return entries;
}

export default async function PathPage() {
  const allProblems = getAllProblems();
  const totalProblems = allProblems.length;
  const problemTitles: Record<string, string> = Object.fromEntries(
    allProblems.map(p => [p.id, p.title])
  );

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

  const completedSectionCount = curriculum.filter(e =>
    completedSections.has(`dsa-section-${e.section.id}`)
  ).length;

  return (
    <>
      {/* ── Page head ── */}
      <section className="border-b border-b-[var(--ms-surface)] bg-[var(--ms-bg-pane)] pt-[34px] pb-7">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-[var(--ms-text-faint)] uppercase">
              DSA &nbsp;·&nbsp;{' '}
              <strong className="text-[var(--ms-blue)] font-medium">THE PATH</strong>
            </p>
            <h1 className="mb-1 font-display font-normal text-[40px] leading-[1.05] tracking-[-0.02em] text-[var(--ms-text-body)]">
              The Path
            </h1>
            <p className="m-0 text-[var(--ms-text-faint)] text-[13px] font-mono tracking-[0.02em]">
              Novice → Studied → Expert · the {totalSections} mental models behind senior DSA reasoning
            </p>
          </div>

          <div className="flex gap-7 font-mono text-[11px] text-[var(--ms-text-subtle)] tracking-[0.04em]">
            {[
              { value: totalSections, label: 'mental models' },
              { value: totalProblems, label: 'problems' },
              { value: completedSectionCount, sub: `/${totalSections}`, label: 'complete' },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <b className="block font-display italic font-normal text-[22px] text-[var(--ms-text-body)] tracking-normal leading-none">
                  {s.value}
                  {s.sub && (
                    <span className="text-xs text-[var(--ms-text-faint)] not-italic tracking-[0.04em]">
                      {s.sub}
                    </span>
                  )}
                </b>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <DsaPathCanvas
        curriculum={curriculum}
        completedProblems={completedProblems}
        completedSections={completedSections}
        totalProblems={totalProblems}
        problemTitles={problemTitles}
      />
    </>
  );
}
