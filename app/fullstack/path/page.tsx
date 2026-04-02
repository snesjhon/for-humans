import Link from 'next/link'
import { JOURNEY, type JourneySection, type Phase } from '@/lib/fullstack/journey'
import { getAllFundamentalsSlugs } from '@/lib/fullstack/fundamentals'
import { getAllScenarioSlugsFromDisk } from '@/lib/fullstack/content'
import { createClient } from '@/lib/supabase/server'
import {
  PhaseTracker,
  PathTOC,
  PhaseBannerContent,
  StepGuideCard,
  PlaceholderGuideCard,
  ProgressToggle,
  SectionProgress,
  pColor,
  PageHero,
} from '@/components/ui'
import pathStyles from '@/components/ui/PathComponents/PathComponents.module.css'

type SectionEntry = {
  section: JourneySection
  phase: Phase
  revisitSlugs: { slug: string; label: string }[]
  revisitFromLabel: string
  stepNum: number
}

function buildCurriculum(): SectionEntry[] {
  const entries: SectionEntry[] = []
  let pendingSlugs: { slug: string; label: string }[] = []
  let pendingFrom = ''
  let stepNum = 0

  JOURNEY.forEach((phase) => {
    phase.sections.forEach((section) => {
      stepNum++
      entries.push({
        section,
        phase,
        revisitSlugs: pendingSlugs,
        revisitFromLabel: pendingFrom,
        stepNum,
      })
      pendingSlugs = section.reinforce.map((s) => ({ slug: s.slug, label: s.label }))
      pendingFrom = section.label
    })
  })

  if (pendingSlugs.length > 0 && entries.length > 0) {
    const last = entries[entries.length - 1]
    entries[entries.length - 1] = {
      ...last,
      revisitSlugs: [...last.revisitSlugs, ...pendingSlugs],
      revisitFromLabel: last.revisitFromLabel || pendingFrom,
    }
  }
  return entries
}

type PhaseGroup = { phase: Phase; entries: SectionEntry[] }

function buildPhaseGroups(): PhaseGroup[] {
  const curriculum = buildCurriculum()
  const groups: PhaseGroup[] = []
  for (const entry of curriculum) {
    const last = groups[groups.length - 1]
    if (!last || last.phase.number !== entry.phase.number) {
      groups.push({ phase: entry.phase, entries: [entry] })
    } else {
      last.entries.push(entry)
    }
  }
  return groups
}

export default async function PathPage() {
  const availableFundamentalsSlugs = new Set(getAllFundamentalsSlugs())
  const availableScenarioSlugs = new Set(getAllScenarioSlugsFromDisk())

  const totalScenarios = JOURNEY.reduce(
    (acc, p) => acc + p.sections.reduce((s, sec) => s + sec.firstPass.length + sec.reinforce.length, 0),
    0
  )
  const totalSections = JOURNEY.reduce((acc, p) => acc + p.sections.length, 0)

  const phaseGroups = buildPhaseGroups()

  // Fetch progress
  const supabase = createClient()
  const { data: progressRows } = await supabase
    .from('progress')
    .select('item_type, item_id')

  const completedProblems = new Set(
    progressRows
      ?.filter((r: { item_type: string; item_id: string }) => r.item_type === 'problem')
      .map((r: { item_type: string; item_id: string }) => r.item_id) ?? [],
  )
  const completedSections = new Set(
    progressRows
      ?.filter((r: { item_type: string; item_id: string }) => r.item_type === 'section')
      .map((r: { item_type: string; item_id: string }) => r.item_id) ?? [],
  )

  return (
    <>
      <PageHero>
        <h1 className="text-5xl font-bold leading-tight text-[var(--fg)]">The Path</h1>
        <p className="text-sm text-[var(--fg-gutter)] mt-2">
          {totalSections} mental models · {totalScenarios} build tasks · 1 real app
        </p>
      </PageHero>

      <div className="relative">
        <aside
          className="hidden lg:block absolute top-0 left-0 h-full pl-10 pt-10 w-[calc(314px+2.5rem)]"
          style={{
            background: 'color-mix(in srgb, var(--active-phase-color) 8%, var(--bg))',
            transition: 'background 300ms ease',
          }}
        >
          <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <PathTOC phases={phaseGroups.map((g) => g.phase)} />
          </div>
        </aside>

        {phaseGroups.map(({ phase, entries }, groupIdx) => {
          const color = pColor(phase.number)
          const nextColor =
            groupIdx < phaseGroups.length - 1
              ? pColor(phaseGroups[groupIdx + 1].phase.number)
              : null

          const zoneBg = nextColor
            ? `linear-gradient(180deg,
                color-mix(in srgb, ${color} 8%, var(--bg)) 0%,
                color-mix(in srgb, ${color} 8%, var(--bg)) 60%,
                color-mix(in srgb, ${nextColor} 4%, var(--bg)) 100%)`
            : `color-mix(in srgb, ${color} 8%, var(--bg))`

          const chapterLabel = String(phase.number).padStart(2, '0')

          return (
            <div key={phase.number} id={`phase-zone-${phase.number}`} style={{ background: zoneBg }}>
              <div className="block lg:grid gap-12 px-10 lg:grid-cols-[0.3fr_minmax(250px,1fr)]">
                <div className="hidden lg:block" />
                <div className="min-w-0">
                  <PhaseBannerContent phase={phase} color={color} chapterLabel={chapterLabel} />

                  {entries.map((entry, entryIdx) => {
                    const { section, revisitSlugs, revisitFromLabel, stepNum } = entry
                    const stepLabel = String(stepNum).padStart(2, '0')
                    const availableFirstPass = section.firstPass.filter(({ slug }) => availableScenarioSlugs.has(slug))
                    const availableRevisits = revisitSlugs.filter(({ slug }) => availableScenarioSlugs.has(slug))
                    const hasNewScenarios = availableFirstPass.length > 0
                    const hasRevisits = availableRevisits.length > 0
                    const hasAnyScenarios = hasNewScenarios || hasRevisits
                    const isLast = entryIdx === entries.length - 1

                    const firstPassItemIds = section.firstPass.map((s) => `fs-${s.slug}`)

                    return (
                      <div
                        key={section.id}
                        className="grid grid-cols-2 gap-7 items-start"
                        style={{ paddingBottom: isLast ? 24 : 48 }}
                      >
                        {/* LEFT: Guide card + section progress */}
                        <div>
                          {section.fundamentalsSlug && availableFundamentalsSlugs.has(section.fundamentalsSlug) ? (
                            <StepGuideCard
                              href={`/fullstack/fundamentals/${section.fundamentalsSlug}`}
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
                            sectionItemId={`fs-section-${section.id}`}
                            problemItemIds={firstPassItemIds}
                            initialCompletedProblemIds={firstPassItemIds.filter((id) =>
                              completedProblems.has(id),
                            )}
                            initialSectionCompleted={completedSections.has(
                              `fs-section-${section.id}`,
                            )}
                          />
                        </div>

                        {/* RIGHT: Practice scenarios */}
                        <div className="pt-1">
                          {!hasAnyScenarios && (
                            <p
                              className="italic text-sm text-[var(--fg-gutter)] m-0"
                              style={{ fontFamily: 'var(--font-display, inherit)' }}
                            >
                              Scenarios coming soon.
                            </p>
                          )}

                          {hasNewScenarios && (
                            <div style={{ marginBottom: hasRevisits ? 20 : 0 }}>
                              <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase mb-2 text-[var(--fg-gutter)]">
                                Practice
                              </p>
                              {availableFirstPass.map(({ slug, label }) => {
                                const itemId = `fs-${slug}`
                                return (
                                  <div key={slug} className="flex items-center gap-1 py-[5px]">
                                    <ProgressToggle
                                      itemType="problem"
                                      itemId={itemId}
                                      initialCompleted={completedProblems.has(itemId)}
                                    />
                                    <Link
                                      href={`/fullstack/scenarios/${slug}`}
                                      className={`${pathStyles.problemLink} flex items-baseline`}
                                    >
                                      <span className="shrink-0 w-5" />
                                      <span className={`${pathStyles.problemTitle} text-[0.875rem] leading-[1.3] text-[var(--fg-alt)]`}>
                                        {label}
                                      </span>
                                    </Link>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {hasRevisits && (
                            <div>
                              <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase mb-2 text-[var(--orange)]">
                                Also revisit — from {revisitFromLabel}
                              </p>
                              {availableRevisits.map(({ slug, label }) => {
                                const itemId = `fs-${slug}`
                                return (
                                  <div key={`r-${slug}`} className="flex items-center gap-1 py-[5px]">
                                    <ProgressToggle
                                      itemType="problem"
                                      itemId={itemId}
                                      initialCompleted={completedProblems.has(itemId)}
                                    />
                                    <Link
                                      href={`/fullstack/scenarios/${slug}`}
                                      className={`${pathStyles.problemLink} flex items-baseline`}
                                    >
                                      <span className="text-xs shrink-0 w-5 leading-none text-[var(--orange)]">↩</span>
                                      <span className={`${pathStyles.problemTitle} text-[0.875rem] leading-[1.3] text-[var(--fg-comment)]`}>
                                        {label}
                                      </span>
                                    </Link>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}

        <div className="block lg:grid gap-12 px-10 lg:grid-cols-[0.3fr_minmax(250px,1fr)]">
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4 pt-8 pb-16">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[0.8rem] italic text-[var(--fg-gutter)] shrink-0 font-[var(--font-display)]">
              More guides coming
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
        </div>
      </div>

      <PhaseTracker phaseCount={phaseGroups.length} />
    </>
  )
}
