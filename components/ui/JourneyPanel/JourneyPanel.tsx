'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { BookOpen, ChevronRight, Leaf, Target, type LucideIcon } from 'lucide-react'
import { pColor } from '../pathUtils'
import { ProgressMark } from '../ProgressMark/ProgressMark'

export interface JourneyPanelItem {
  key: string
  label: string
  /** Optional monospace prefix shown before the label (e.g. problem id) */
  prefix?: string
}

export interface JourneyPanelSection {
  id: string
  label: string
  fundamentalsSlug?: string
  items: JourneyPanelItem[]
  revisitItems?: JourneyPanelItem[]
}

export interface JourneyPanelPhase {
  number: number
  label: string
  emoji: string
  sections: JourneyPanelSection[]
}

export interface JourneyPanelProps {
  phases: JourneyPanelPhase[]
  pathname: string
  activeSectionId: string | null
  activeItemKey: string | null
  activeFundamentalsSlug: string | null
  availableItemKeys: Set<string>
  availableFundamentalsSlugs: Set<string>
  getItemHref: (key: string) => string
  getFundamentalsHref: (slug: string) => string
}

function phaseIcon(label: string): LucideIcon {
  switch (label) {
    case 'Novice':
      return Leaf
    case 'Studied':
      return BookOpen
    case 'Expert':
      return Target
    default:
      return BookOpen
  }
}

export function JourneyPanel({
  phases,
  pathname,
  activeSectionId,
  activeItemKey,
  activeFundamentalsSlug,
  availableItemKeys,
  availableFundamentalsSlugs,
  getItemHref,
  getFundamentalsHref,
}: JourneyPanelProps) {
  const problemIds = Array.from(availableItemKeys).sort()
  const progressParams = new URLSearchParams({ itemType: 'problem' })
  problemIds.forEach((id) => progressParams.append('itemId', `dsa-${id}`))
  const progressKey = problemIds.length
    ? `/api/progress?${progressParams.toString()}`
    : null
  const { data: progressData } = useSWR<{ completedIds: string[] }>(
    progressKey,
    (url: string) => fetch(url).then((response) => response.json()),
  )
  const completedProblemIds = new Set(
    (progressData?.completedIds ?? [])
      .map((id) => id.match(/^dsa-(.+)$/)?.[1] ?? null)
      .filter((id): id is string => Boolean(id)),
  )

  const [expandedSections, setExpandedSections] = useState<Set<string>>(() =>
    activeSectionId ? new Set([activeSectionId]) : new Set(),
  )

  useEffect(() => {
    if (!activeSectionId) return
    setExpandedSections((prev) => {
      if (prev.has(activeSectionId)) return prev
      const next = new Set(prev)
      next.add(activeSectionId)
      return next
    })
  }, [activeSectionId])

  const activeItemRef = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [pathname])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  return (
    <>
      {phases.map((phase) => {
        const color = pColor(phase.number)
        const PhaseIcon = phaseIcon(phase.label)
        const hasActiveSectionInPhase = phase.sections.some(
          (s) => s.id === activeSectionId,
        )

        return (
          <div
            key={phase.number}
            className="[--phase-accent:var(--primary)]"
            style={{ '--phase-accent': color } as React.CSSProperties}
          >
            {/* Phase label */}
            <div className="flex items-center gap-1.5 px-4 pb-1 pt-3">
              <PhaseIcon aria-hidden="true" className="h-3.5 w-3.5 text-[var(--fg-gutter)]" />
              <span className="font-mono text-[0.58rem] font-bold uppercase tracking-widest text-[var(--fg-gutter)]">
                {phase.label}
              </span>
            </div>

            {/* Sections */}
            {phase.sections.map((section) => {
              const isExpanded = expandedSections.has(section.id)
              const isThisActive = activeSectionId === section.id
              const availableItems = section.items.filter((i) =>
                availableItemKeys.has(i.key),
              )
              const availableRevisits = (section.revisitItems ?? []).filter(
                (i) => availableItemKeys.has(i.key),
              )

              return (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`flex w-full items-center justify-between border-none bg-transparent px-4 py-[6px] text-left text-[0.775rem] leading-[1.4] transition-[background,color] duration-150 focus:outline-none ${
                      isThisActive
                        ? 'font-semibold text-[var(--fg)]'
                        : 'font-normal text-[var(--fg-alt)]'
                    }`}
                  >
                    <span className="min-w-0 flex-1 pr-1.5">
                      {section.label}
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90 text-[var(--fg-alt)]' : 'text-[var(--fg-gutter)]'
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mb-1 ml-4 border-l border-l-[var(--border)]">
                      {/* Fundamentals guide link */}
                      {section.fundamentalsSlug &&
                        availableFundamentalsSlugs.has(section.fundamentalsSlug) &&
                        (() => {
                          const isFundActive =
                            activeFundamentalsSlug === section.fundamentalsSlug
                          return (
                            <Link
                              ref={isFundActive ? activeItemRef : null}
                              href={getFundamentalsHref(section.fundamentalsSlug!)}
                              className={`flex items-center gap-2 px-[10px] py-[6px] text-[0.75rem] no-underline transition-[color,background] duration-150 focus:outline-none hover:bg-[var(--bg-alt)] ${
                                isFundActive
                                  ? 'font-semibold text-[var(--fg)]'
                                  : 'font-normal text-[var(--fg-comment)]'
                              }`}
                            >
                              <BookOpen aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                              <span>Guide</span>
                            </Link>
                          )
                        })()}

                      {/* Items */}
                      {availableItems.map((item) => {
                        const isActive = activeItemKey === item.key
                        const isCompleted = completedProblemIds.has(item.key)
                        return (
                          <Link
                            key={item.key}
                            ref={isActive ? activeItemRef : null}
                            href={getItemHref(item.key)}
                            className={`flex items-center gap-2 px-[10px] py-[6px] text-[0.75rem] no-underline transition-[color,background] duration-150 focus:outline-none hover:bg-[var(--bg-alt)] ${
                              isActive
                                ? 'font-semibold text-[var(--fg)]'
                                : 'font-normal text-[var(--fg-comment)]'
                            }`}
                          >
                            <ProgressMark completed={isCompleted} />
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                              {item.label}
                            </span>
                          </Link>
                        )
                      })}

                      {/* Revisit items */}
                      {availableRevisits.length > 0 && (
                        <>
                          <div className="px-[10px] pb-[3px] pt-2 text-[0.58rem] font-bold uppercase tracking-[0.08em] text-[var(--fg-gutter)] [font-family:var(--font-body)]">
                            Also revisit
                          </div>
                          {availableRevisits.map((item) => {
                            const isActive = activeItemKey === item.key
                            const isCompleted = completedProblemIds.has(item.key)
                            return (
                              <Link
                                key={item.key}
                                ref={isActive ? activeItemRef : null}
                                href={getItemHref(item.key)}
                                className={`flex items-center gap-2 px-[10px] py-[6px] text-[0.75rem] no-underline transition-[color,background] duration-150 focus:outline-none hover:bg-[var(--bg-alt)] ${
                                  isActive
                                    ? 'font-semibold text-[var(--fg)]'
                                    : 'font-normal text-[var(--fg-comment)]'
                                }`}
                              >
                                <ProgressMark completed={isCompleted} />
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                  {item.label}
                                </span>
                              </Link>
                            )
                          })}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
