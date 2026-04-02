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
          <div key={phase.number}>
            {/* Phase label */}
            <div
              style={{
                padding: '10px 16px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '0.75rem', lineHeight: 1 }}>
                {phase.emoji}
              </span>
              <span
                className="font-mono font-bold tracking-widest uppercase"
                style={{
                  fontSize: '0.58rem',
                  color: hasActiveSectionInPhase ? color : 'var(--fg-gutter)',
                }}
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
                    className="w-full text-left focus:outline-none flex items-center justify-between"
                    style={{
                      padding: '6px 16px',
                      fontSize: '0.775rem',
                      fontWeight: isThisActive ? 600 : 400,
                      color: sectionColor ?? 'var(--fg-alt)',
                      background: isThisActive
                        ? `color-mix(in srgb, ${color} 8%, transparent)`
                        : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 150ms, color 150ms',
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0, paddingRight: '6px' }}>
                      {section.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: 'var(--fg-gutter)',
                        flexShrink: 0,
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 200ms',
                        display: 'inline-block',
                      }}
                    >
                      ↓
                    </span>
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        borderLeft: `2px solid color-mix(in srgb, ${color} 25%, var(--border))`,
                        marginLeft: '20px',
                        marginBottom: '4px',
                      }}
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
                              className="no-underline flex items-center gap-2 focus:outline-none"
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.75rem',
                                color: isFundActive ? color : 'var(--fg-comment)',
                                fontWeight: isFundActive ? 600 : 400,
                                background: isFundActive
                                  ? `color-mix(in srgb, ${color} 10%, transparent)`
                                  : 'transparent',
                                transition: 'color 150ms, background 150ms',
                              }}
                            >
                              <span style={{ fontSize: '0.7rem', flexShrink: 0 }}>
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
                            className="no-underline flex items-baseline gap-2 focus:outline-none"
                            style={{
                              padding: '6px 10px',
                              fontSize: '0.75rem',
                              color: isActive ? color : 'var(--fg-comment)',
                              fontWeight: isActive ? 600 : 400,
                              background: isActive
                                ? `color-mix(in srgb, ${color} 10%, transparent)`
                                : 'transparent',
                              transition: 'color 150ms, background 150ms',
                            }}
                          >
                            {item.prefix && (
                              <span
                                className="font-mono shrink-0"
                                style={{
                                  fontSize: '0.6rem',
                                  color: isActive ? color : 'var(--fg-gutter)',
                                  minWidth: '26px',
                                }}
                              >
                                {item.prefix}
                              </span>
                            )}
                            <span
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.label}
                            </span>
                          </Link>
                        )
                      })}

                      {/* Revisit items */}
                      {availableRevisits.length > 0 && (
                        <>
                          <div
                            style={{
                              padding: '8px 10px 3px',
                              fontSize: '0.58rem',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: 'var(--orange)',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            Also revisit
                          </div>
                          {availableRevisits.map((item) => {
                            const isActive = activeItemKey === item.key
                            return (
                              <Link
                                key={item.key}
                                ref={isActive ? activeItemRef : null}
                                href={getItemHref(item.key)}
                                className="no-underline flex items-baseline gap-1.5 focus:outline-none"
                                style={{
                                  padding: '6px 10px',
                                  fontSize: '0.75rem',
                                  color: isActive ? color : 'var(--fg-comment)',
                                  fontWeight: isActive ? 600 : 400,
                                  background: isActive
                                    ? `color-mix(in srgb, ${color} 10%, transparent)`
                                    : 'transparent',
                                  transition: 'color 150ms, background 150ms',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    color: 'var(--orange)',
                                    flexShrink: 0,
                                  }}
                                >
                                  ↩
                                </span>
                                {item.prefix && (
                                  <span
                                    className="font-mono shrink-0"
                                    style={{
                                      fontSize: '0.6rem',
                                      color: isActive ? color : 'var(--fg-gutter)',
                                      minWidth: '26px',
                                    }}
                                  >
                                    {item.prefix}
                                  </span>
                                )}
                                <span
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
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
