'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { pColor } from '../pathUtils'

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
            <div className="flex items-center gap-1.5 px-4 pb-1 pt-[10px]">
              <span className="text-[0.75rem] leading-none">
                {phase.emoji}
              </span>
              <span
                className={`font-mono text-[0.58rem] font-bold uppercase tracking-widest ${
                  hasActiveSectionInPhase
                    ? 'text-[var(--phase-accent)]'
                    : 'text-[var(--fg-gutter)]'
                }`}
              >
                {phase.label}
              </span>
            </div>

            {/* Sections */}
            {phase.sections.map((section) => {
              const isExpanded = expandedSections.has(section.id)
              const isThisActive = activeSectionId === section.id
              const sectionColor = isThisActive ? color : undefined
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
                        ? 'bg-[var(--bg-alt)] font-semibold text-[var(--phase-accent)]'
                        : 'font-normal text-[var(--fg-alt)]'
                    }`}
                  >
                    <span className="min-w-0 flex-1 pr-1.5">
                      {section.label}
                    </span>
                    <span
                      className={`inline-block shrink-0 text-[0.65rem] text-[var(--fg-gutter)] transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      ↓
                    </span>
                  </button>

                  {isExpanded && (
                    <div
                      className="mb-1 ml-5 border-l-2 border-l-[var(--phase-accent)]"
                    >
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
                              className={`flex items-center gap-2 px-[10px] py-[6px] text-[0.75rem] no-underline transition-[color,background] duration-150 focus:outline-none ${
                                isFundActive
                                  ? 'bg-[var(--bg-alt)] font-semibold text-[var(--phase-accent)]'
                                  : 'font-normal text-[var(--fg-comment)]'
                              }`}
                            >
                              <span className="shrink-0 text-[0.7rem]">
                                📖
                              </span>
                              <span>Guide</span>
                            </Link>
                          )
                        })()}

                      {/* Items */}
                      {availableItems.map((item) => {
                        const isActive = activeItemKey === item.key
                        return (
                          <Link
                            key={item.key}
                            ref={isActive ? activeItemRef : null}
                            href={getItemHref(item.key)}
                            className={`flex items-baseline gap-2 px-[10px] py-[6px] text-[0.75rem] no-underline transition-[color,background] duration-150 focus:outline-none ${
                              isActive
                                ? 'bg-[var(--bg-alt)] font-semibold text-[var(--phase-accent)]'
                                : 'font-normal text-[var(--fg-comment)]'
                            }`}
                          >
                            {item.prefix && (
                              <span
                                className={`min-w-[26px] shrink-0 font-mono text-[0.6rem] ${
                                  isActive
                                    ? 'text-[var(--phase-accent)]'
                                    : 'text-[var(--fg-gutter)]'
                                }`}
                              >
                                {item.prefix}
                              </span>
                            )}
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                              {item.label}
                            </span>
                          </Link>
                        )
                      })}

                      {/* Revisit items */}
                      {availableRevisits.length > 0 && (
                        <>
                          <div className="px-[10px] pb-[3px] pt-2 text-[0.58rem] font-bold uppercase tracking-[0.08em] text-[var(--orange)] [font-family:var(--font-body)]">
                            Also revisit
                          </div>
                          {availableRevisits.map((item) => {
                            const isActive = activeItemKey === item.key
                            return (
                              <Link
                                key={item.key}
                                ref={isActive ? activeItemRef : null}
                                href={getItemHref(item.key)}
                                className={`flex items-baseline gap-1.5 px-[10px] py-[6px] text-[0.75rem] no-underline transition-[color,background] duration-150 focus:outline-none ${
                                  isActive
                                    ? 'bg-[var(--bg-alt)] font-semibold text-[var(--phase-accent)]'
                                    : 'font-normal text-[var(--fg-comment)]'
                                }`}
                              >
                                <span className="shrink-0 text-[0.65rem] text-[var(--orange)]">
                                  ↩
                                </span>
                                {item.prefix && (
                                  <span
                                    className={`min-w-[26px] shrink-0 font-mono text-[0.6rem] ${
                                      isActive
                                        ? 'text-[var(--phase-accent)]'
                                        : 'text-[var(--fg-gutter)]'
                                    }`}
                                  >
                                    {item.prefix}
                                  </span>
                                )}
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
