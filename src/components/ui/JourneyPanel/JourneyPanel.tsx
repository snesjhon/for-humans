'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import {
  ChevronRight,
  Leaf,
  Target,
  BookOpen,
  Circle,
  CircleCheck,
  AlignJustify,
  Hash,
  ArrowLeftRight,
  AppWindow,
  Link2,
  Layers,
  RotateCcw,
  Search,
  GitBranch,
  GitFork,
  ChevronUp,
  Network,
  GitMerge,
  Share2,
  Activity,
  Undo2,
  Zap,
  LayoutGrid,
  TrendingUp,
  Clock,
  Type,
  Compass,
  Code2,
  type LucideIcon,
  CircleChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
} from 'lucide-react';
import { pColor } from '../pathUtils';
import { ProgressMark } from '../ProgressMark/ProgressMark';

export interface JourneyPanelItem {
  key: string;
  label: string;
  /** Optional monospace prefix shown before the label (e.g. problem id) */
  prefix?: string;
}

export interface JourneyPanelSection {
  id: string;
  label: string;
  fundamentalsSlug?: string;
  items: JourneyPanelItem[];
  revisitItems?: JourneyPanelItem[];
  revisitFromLabel?: string;
  revisitPrerequisiteLabel?: string;
}

export interface JourneyPanelPhase {
  number: number;
  label: string;
  emoji: string;
  sections: JourneyPanelSection[];
}

export interface JourneyPanelProps {
  phases: JourneyPanelPhase[];
  pathname: string;
  activeSectionId: string | null;
  activeItemKey: string | null;
  activeFundamentalsSlug: string | null;
  availableItemKeys: Set<string>;
  availableFundamentalsSlugs: Set<string>;
  getItemHref: (key: string) => string;
  getFundamentalsHref: (slug: string) => string;
  compact?: boolean;
}

function phaseIcon(label: string): LucideIcon {
  switch (label) {
    case 'Novice':
      return Leaf;
    case 'Studied':
      return BookOpen;
    case 'Expert':
      return Target;
    default:
      return BookOpen;
  }
}

const SECTION_ICONS: Record<string, LucideIcon> = {
  'arrays-strings': AlignJustify,
  'hash-maps': Hash,
  'two-pointers': ArrowLeftRight,
  'sliding-window': AppWindow,
  'linked-lists': Link2,
  'stack-queue': Layers,
  'recursion-backtracking-intro': RotateCcw,
  'binary-search': Search,
  'binary-trees': GitBranch,
  'binary-search-trees': GitFork,
  'heaps-priority-queues': ChevronUp,
  graphs: Network,
  'graph-traversal-dfs': GitMerge,
  'graph-traversal-bfs': Share2,
  'advanced-graphs': Activity,
  'backtracking-deep': Undo2,
  'dp-1d': Zap,
  'dp-2d': LayoutGrid,
  greedy: TrendingUp,
  intervals: Clock,
  tries: Type,
  'math-geometry': Compass,
  'bit-manipulation': Code2,
};

// ── Shared nav primitives ─────────────────────────────────────────────────────

function NavSection({
  icon: Icon,
  label,
  isCollapsed,
  onToggle,
  compact = false,
  children,
}: {
  icon?: LucideIcon;
  label: string;
  isCollapsed: boolean;
  onToggle: () => void;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`appearance-none shadow-none flex w-full items-center gap-2 justify-between rounded-md border-none bg-transparent px-4 text-left text-xs font-semibold transition-[background,color] duration-150 outline-none ring-0 hover:bg-[var(--ms-primary-surface)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
          compact
            ? 'py-2 text-[var(--ms-text-muted)]'
            : 'py-3 text-[var(--ms-text-body)]'
        }`}
      >
        {Icon && (
          <Icon
            aria-hidden="true"
            className={`shrink-0 text-[var(--ms-text-muted)] ${compact ? 'h-3 w-3' : 'h-3.5 w-3.5'}`}
          />
        )}
        <span className="min-w-0 flex-1 pr-1.5">{label}</span>
        <ChevronRight
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            isCollapsed
              ? 'text-[var(--ms-text-faint)]'
              : 'rotate-90 text-[var(--ms-text-muted)]'
          }`}
        />
      </button>

      {!isCollapsed && children && (
        <div className="mb-1 ml-4 flex flex-col">{children}</div>
      )}
    </div>
  );
}

function NavItem({
  href,
  isActive,
  mark,
  label,
  itemRef,
}: {
  href: string;
  isActive: boolean;
  mark: React.ReactNode;
  label: string;
  itemRef?: React.RefObject<HTMLAnchorElement>;
}) {
  return (
    <div className="border-l py-1 border-l-[var(--ms-surface)]">
      <Link
        ref={itemRef}
        href={href}
        className={`flex items-center gap-2 rounded-md px-[10px] py-[6px] text-xs no-underline transition-[color,background] duration-150 focus:outline-none hover:bg-[var(--ms-primary-surface)] ${
          isActive
            ? 'font-semibold text-[var(--ms-primary)]'
            : 'font-normal text-[var(--ms-text-subtle)]'
        }`}
      >
        {mark}
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </span>
      </Link>
    </div>
  );
}

// ── JourneyPanel ──────────────────────────────────────────────────────────────

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
  compact = false,
}: JourneyPanelProps) {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  // Problem progress
  const problemIds = Array.from(availableItemKeys).sort();
  const progressParams = new URLSearchParams({ itemType: 'problem' });
  problemIds.forEach((id) => progressParams.append('itemId', `dsa-${id}`));
  const progressKey = problemIds.length
    ? `/api/progress?${progressParams.toString()}`
    : null;
  const { data: progressData } = useSWR<{ completedIds: string[] }>(
    progressKey,
    fetcher,
  );
  const completedProblemIds = new Set(
    (progressData?.completedIds ?? [])
      .map((id) => id.match(/^dsa-(.+)$/)?.[1] ?? null)
      .filter((id): id is string => Boolean(id)),
  );

  // Fundamentals progress — single item per slug
  const fundSlugs = Array.from(availableFundamentalsSlugs).sort();
  const fundParams = new URLSearchParams({ itemType: 'fundamentals' });
  fundSlugs.forEach((slug) =>
    fundParams.append('itemId', `dsa-fundamentals-${slug}`),
  );
  const fundKey = fundSlugs.length
    ? `/api/progress?${fundParams.toString()}`
    : null;
  const { data: fundData } = useSWR<{ completedIds: string[] }>(
    fundKey,
    fetcher,
  );
  const completedFundIds = new Set(fundData?.completedIds ?? []);

  const isFundamentalsComplete = (slug: string) =>
    completedFundIds.has(`dsa-fundamentals-${slug}`);

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => new Set(),
  );
  const [collapsedPhases, setCollapsedPhases] = useState<Set<number>>(
    () => new Set(),
  );

  const [collapsedRevisits, setCollapsedRevisits] = useState<Set<string>>(
    () => new Set(phases.flatMap((p) => p.sections.map((s) => s.id))),
  );

  const toggleRevisit = (sectionId: string) => {
    setCollapsedRevisits((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const activeItemRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [pathname]);

  const toggleSection = (sectionId: string, phaseNumber: number) => {
    const phaseIsCollapsed = collapsedPhases.has(phaseNumber);

    if (phaseIsCollapsed) {
      setCollapsedPhases((prev) => {
        const next = new Set(prev);
        next.delete(phaseNumber);
        return next;
      });
      setCollapsedSections((prev) => {
        const next = new Set(prev);
        phases
          .find((phase) => phase.number === phaseNumber)
          ?.sections.forEach((section) => {
            if (section.id === sectionId) next.delete(section.id);
            else next.add(section.id);
          });
        return next;
      });
      return;
    }

    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const togglePhase = (phaseNumber: number) => {
    const phase = phases.find((item) => item.number === phaseNumber);
    if (!phase) return;

    const phaseIsCollapsed = collapsedPhases.has(phaseNumber);

    setCollapsedPhases((prev) => {
      const next = new Set(prev);
      if (phaseIsCollapsed) next.delete(phaseNumber);
      else next.add(phaseNumber);
      return next;
    });

    setCollapsedSections((prev) => {
      const next = new Set(prev);
      phase.sections.forEach((section) => {
        if (phaseIsCollapsed) next.delete(section.id);
        else next.add(section.id);
      });
      return next;
    });
  };

  return (
    <>
      {phases.map((phase) => {
        const color = pColor(phase.number);
        const PhaseIcon = phaseIcon(phase.label);
        const isPhaseCollapsed = compact || collapsedPhases.has(phase.number);

        return (
          <div
            key={phase.number}
            className="[--phase-accent:var(--ms-primary)]"
            style={{ '--phase-accent': color } as React.CSSProperties}
          >
            <div
              className={`flex items-center gap-2 pl-4 pr-2 pb-1 pt-4 ${compact ? 'justify-center' : ''}`}
            >
              <PhaseIcon
                aria-hidden="true"
                className="h-3.5 w-3.5 text-[var(--ms-success)]"
              />
              {!compact && (
                <>
                  <span className="flex-1 text-sm font-bold">
                    {phase.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePhase(phase.number)}
                    aria-label={
                      isPhaseCollapsed
                        ? `Expand ${phase.label}`
                        : `Collapse ${phase.label}`
                    }
                    aria-expanded={!isPhaseCollapsed}
                    className="appearance-none shadow-none flex items-center justify-between rounded-md border-none bg-transparent font-semibold transition-[background,color] duration-150 outline-none ring-0 hover:bg-[var(--ms-primary-surface)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 p-2 text-[var(--ms-text-body)] mb-0 "
                  >
                    {isPhaseCollapsed ? (
                      <ChevronsUpDown
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-[var(--ms-text-faint)`}
                      />
                    ) : (
                      <ChevronsDownUp
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-[var(--ms-text-faint)`}
                      />
                    )}
                  </button>
                </>
              )}
            </div>

            {phase.sections.map((section) => {
              const availableItems = section.items.filter((i) =>
                availableItemKeys.has(i.key),
              );
              const availableRevisits = (section.revisitItems ?? []).filter(
                (i) => availableItemKeys.has(i.key),
              );
              const SectionIcon = SECTION_ICONS[section.id];
              const sectionHref =
                section.fundamentalsSlug &&
                availableFundamentalsSlugs.has(section.fundamentalsSlug)
                  ? getFundamentalsHref(section.fundamentalsSlug)
                  : availableItems[0]
                    ? getItemHref(availableItems[0].key)
                    : null;

              if (compact) {
                const compactClasses = `flex h-7 w-7 items-center justify-center rounded-md no-underline transition-colors ${
                  activeSectionId === section.id
                    ? 'bg-[var(--ms-primary-surface)] text-[var(--phase-accent)]'
                    : 'text-[var(--ms-text-muted)] hover:bg-[var(--ms-primary-surface)] hover:text-[var(--ms-primary)]'
                }`;

                const iconContent = SectionIcon ? (
                  <SectionIcon
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    strokeWidth={2.1}
                  />
                ) : (
                  <span className="text-[0.6rem] font-semibold">
                    {section.label.slice(0, 2)}
                  </span>
                );

                return (
                  <div key={section.id} className="flex justify-center py-1">
                    {sectionHref ? (
                      <Link
                        href={sectionHref}
                        title={section.label}
                        aria-label={section.label}
                        aria-current={
                          activeSectionId === section.id ? 'page' : undefined
                        }
                        className={compactClasses}
                      >
                        {iconContent}
                      </Link>
                    ) : (
                      <span
                        title={section.label}
                        aria-label={section.label}
                        className={compactClasses}
                      >
                        {iconContent}
                      </span>
                    )}
                  </div>
                );
              }

              const isCollapsed =
                isPhaseCollapsed || collapsedSections.has(section.id);

              return (
                <NavSection
                  key={section.id}
                  icon={SectionIcon}
                  label={section.label}
                  isCollapsed={isCollapsed}
                  onToggle={() => toggleSection(section.id, phase.number)}
                >
                  {section.fundamentalsSlug &&
                    availableFundamentalsSlugs.has(
                      section.fundamentalsSlug,
                    ) && (
                      <NavItem
                        itemRef={
                          activeFundamentalsSlug === section.fundamentalsSlug
                            ? activeItemRef
                            : undefined
                        }
                        href={getFundamentalsHref(section.fundamentalsSlug)}
                        isActive={
                          activeFundamentalsSlug === section.fundamentalsSlug
                        }
                        mark={
                          <ProgressMark
                            completed={isFundamentalsComplete(
                              section.fundamentalsSlug,
                            )}
                            fundamentals
                          />
                        }
                        label="Fundamentals"
                      />
                    )}
                  {availableItems.map((item) => (
                    <NavItem
                      key={item.key}
                      itemRef={
                        activeItemKey === item.key ? activeItemRef : undefined
                      }
                      href={getItemHref(item.key)}
                      isActive={activeItemKey === item.key}
                      mark={
                        <ProgressMark
                          completed={completedProblemIds.has(item.key)}
                        />
                      }
                      label={item.label}
                    />
                  ))}

                  {availableRevisits.length > 0 && (
                    <div
                      className={
                        collapsedRevisits.has(section.id)
                          ? 'border-l border-l-[var(--ms-surface)]'
                          : ''
                      }
                    >
                      <button
                        onClick={() => toggleRevisit(section.id)}
                        className="appearance-none flex w-full items-center gap-2 rounded-md border-none bg-transparent px-[10px] py-[6px] text-left outline-none hover:bg-[var(--ms-primary-surface)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      >
                        <CircleChevronRight
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 shrink-0 text-[var(--ms-text-body)] transition-transform duration-200 ${
                            collapsedRevisits.has(section.id) ? '' : 'rotate-90'
                          }`}
                        />
                        <span className="text-xs font-normal text-[var(--ms-text-muted)]">
                          Advanced
                        </span>
                      </button>
                      {!collapsedRevisits.has(section.id) &&
                        availableRevisits.map((item) => (
                          <div className="pl-4">
                            <NavItem
                              key={item.key}
                              itemRef={
                                activeItemKey === item.key
                                  ? activeItemRef
                                  : undefined
                              }
                              href={getItemHref(item.key)}
                              isActive={activeItemKey === item.key}
                              mark={
                                <ProgressMark
                                  completed={completedProblemIds.has(item.key)}
                                />
                              }
                              label={item.label}
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </NavSection>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
