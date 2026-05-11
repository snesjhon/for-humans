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
      <section style={{
        borderBottom: '1px solid var(--ms-surface)',
        background: 'var(--ms-bg-pane)',
        padding: '34px 0 28px',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: 40, alignItems: 'end',
        }}>
          <div>
            <p style={{
              margin: '0 0 12px',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.14em', color: 'var(--ms-text-faint)',
              textTransform: 'uppercase',
            }}>
              DSA &nbsp;·&nbsp;{' '}
              <strong style={{ color: 'var(--ms-blue)', fontWeight: 500 }}>THE PATH</strong>
            </p>
            <h1 style={{
              margin: '0 0 4px',
              fontFamily: 'var(--font-display)', fontWeight: 400,
              fontSize: 40, lineHeight: 1.05,
              letterSpacing: '-0.02em', color: 'var(--ms-text-body)',
            }}>
              The Path
            </h1>
            <p style={{
              margin: 0, color: 'var(--ms-text-faint)', fontSize: 13,
              fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
            }}>
              Novice → Studied → Expert · the {totalSections} mental models behind senior DSA reasoning
            </p>
          </div>

          <div style={{
            display: 'flex', gap: 28,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--ms-text-subtle)', letterSpacing: '0.04em',
          }}>
            {[
              { value: totalSections, label: 'mental models' },
              { value: totalProblems, label: 'problems' },
              { value: completedSectionCount, sub: `/${totalSections}`, label: 'complete' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <b style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)', fontStyle: 'italic',
                  fontWeight: 400, fontSize: 22, color: 'var(--ms-text-body)',
                  letterSpacing: 0, lineHeight: 1,
                }}>
                  {s.value}
                  {s.sub && (
                    <span style={{ fontSize: 12, color: 'var(--ms-text-faint)', fontStyle: 'normal', letterSpacing: '0.04em' }}>
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
