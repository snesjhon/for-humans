import Link from 'next/link'
import { JOURNEY, type JourneySection, type Phase } from '@/lib/dsa/journey'
import { getAllProblems } from '@/lib/dsa/content'

// Each step gets a unique accent color, cycling through the palette
const STEP_COLORS = ['var(--purple)', 'var(--blue)', 'var(--green)', 'var(--orange)', 'var(--cyan)']
const stepColor = (idx: number) => STEP_COLORS[idx % STEP_COLORS.length]

interface JourneyNavProps {
  activeProblemId?: string
  activeFundamentalsSlug?: string
}

// Mirror homepage's buildCurriculum: reinforce problems from section N
// appear as "Also Revisit" under section N+1, not under section N.
type NavEntry = {
  section: JourneySection
  phase: Phase
  revisitIds: string[]
  revisitFromLabel: string
}

function buildNavEntries(): NavEntry[] {
  const entries: NavEntry[] = []
  let pendingIds: string[] = []
  let pendingFrom = ''

  JOURNEY.forEach(phase => {
    phase.sections.forEach(section => {
      entries.push({ section, phase, revisitIds: pendingIds, revisitFromLabel: pendingFrom })
      pendingIds = section.reinforce.map(p => p.id)
      pendingFrom = section.label
    })
  })

  // Remaining revisits attach to the last entry
  if (pendingIds.length > 0 && entries.length > 0) {
    const last = entries[entries.length - 1]
    entries[entries.length - 1] = {
      ...last,
      revisitIds: [...last.revisitIds, ...pendingIds],
      revisitFromLabel: last.revisitFromLabel || pendingFrom,
    }
  }

  return entries
}

function ProblemRow({ id, isActive, dimmed, activeColor, problemMap }: {
  id: string
  isActive: boolean
  dimmed?: boolean
  activeColor: string
  problemMap: Record<string, { title: string }>
}) {
  const p = problemMap[id]
  if (!p) return null
  return (
    <Link
      href={`/dsa/problems/${id}`}
      className="flex items-center gap-2 py-1 rounded px-1 -mx-1 transition-colors"
      style={{ background: isActive ? `color-mix(in srgb, ${activeColor} 12%, var(--bg))` : 'transparent' }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: isActive ? activeColor : dimmed ? 'var(--fg-gutter)' : 'var(--green)' }}
      />
      <span
        className="text-xs truncate"
        style={{
          color: isActive ? activeColor : dimmed ? 'var(--fg-gutter)' : 'var(--fg-comment)',
          fontWeight: isActive ? '600' : '400',
        }}
      >
        {id}. {p.title}
      </span>
    </Link>
  )
}

export default function JourneyNav({ activeProblemId, activeFundamentalsSlug }: JourneyNavProps) {
  const allProblems = getAllProblems()
  const problemMap = Object.fromEntries(allProblems.map(p => [p.id, { title: p.title }]))

  const entries = buildNavEntries()

  // Find which entry the active problem belongs to — either as practice or as a revisit
  const activeEntry = activeProblemId
    ? entries.find(e =>
        e.section.firstPass.some(p => p.id === activeProblemId) ||
        e.revisitIds.includes(activeProblemId)
      ) ?? entries.find(e =>
        e.section.fundamentalsSlug === activeFundamentalsSlug
      )
    : entries.find(e => e.section.fundamentalsSlug === activeFundamentalsSlug)

  let lastPhaseNum = -1

  return (
    <div className="space-y-3 pr-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-gutter)]">
        Your Path
      </p>

      {entries.map((entry, idx) => {
        const { section, phase, revisitIds, revisitFromLabel } = entry
        const isCurrentSection = activeEntry?.section.id === section.id
        const isNewPhase = phase.number !== lastPhaseNum
        if (isNewPhase) lastPhaseNum = phase.number

        const hasFirstPass = section.firstPass.length > 0
        const hasRevisits = revisitIds.length > 0
        const color = stepColor(idx)

        return (
          <div key={section.id}>
            {/* Phase label — only on first section of each phase */}
            {isNewPhase && (
              <div className="flex items-center gap-1.5 mb-1.5" style={{ marginTop: idx === 0 ? 0 : 8 }}>
                <span className="text-sm">{phase.emoji}</span>
                <p className="text-xs font-semibold text-[var(--fg-alt)]">
                  Phase {phase.number}: {phase.label}
                </p>
              </div>
            )}

            <div
              className="rounded-lg overflow-hidden ml-1"
              style={{
                border: `1px solid ${isCurrentSection ? color : 'var(--border)'}`,
              }}
            >
              {/* Section header */}
              <div
                className="px-3 pt-2.5 pb-2"
                style={{
                  background: isCurrentSection
                    ? `color-mix(in srgb, ${color} 10%, var(--bg))`
                    : 'var(--bg-alt)',
                }}
              >
                <p
                  className="text-xs font-semibold leading-snug"
                  style={{ color: isCurrentSection ? color : 'var(--fg-alt)' }}
                >
                  {section.label}
                </p>
                {section.fundamentalsSlug && (
                  <Link
                    href={`/dsa/fundamentals/${section.fundamentalsSlug}`}
                    className="inline-flex items-center gap-1 mt-1.5 transition-opacity hover:opacity-80 text-[0.68rem] font-semibold no-underline"
                    style={{ color: isCurrentSection ? color : 'var(--fg-gutter)' }}
                  >
                    <span>📖</span>
                    <span>Read the guide →</span>
                  </Link>
                )}
              </div>

              {/* Practice — this section's firstPass problems */}
              {hasFirstPass && (
                <div className="px-3 pt-2 pb-1.5 border-t border-t-[var(--border)] bg-[var(--bg)]">
                  <p className="font-[ui-monospace,monospace] text-[0.58rem] font-bold tracking-[0.09em] uppercase text-[var(--fg-gutter)] mb-[4px]">
                    Practice
                  </p>
                  <div className="space-y-0.5">
                    {section.firstPass.map(({ id }) => (
                      <ProblemRow key={id} id={id} isActive={activeProblemId === id} activeColor={color} problemMap={problemMap} />
                    ))}
                  </div>
                </div>
              )}

              {/* Also Revisit — previous section's reinforce problems */}
              {hasRevisits && (
                <div className="px-3 pt-2 pb-1.5 border-t border-t-[var(--border)] bg-[var(--bg)]">
                  <p className="font-[ui-monospace,monospace] text-[0.58rem] font-bold tracking-[0.09em] uppercase text-[var(--orange)] mb-[4px]">
                    Also revisit — from {revisitFromLabel}
                  </p>
                  <div className="space-y-0.5">
                    {revisitIds.map(id => (
                      <ProblemRow key={`r-${id}`} id={id} isActive={activeProblemId === id} dimmed activeColor={color} problemMap={problemMap} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
