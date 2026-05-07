'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { TDIcon } from '@/components/ui/TDIcon/TDIcon';
import { JOURNEY as DSA_JOURNEY } from '@/lib/dsa/journey';
import { JOURNEY as FRONTEND_JOURNEY } from '@/lib/frontend/journey';
import { PROBLEM_TITLES } from '@/lib/dsa/titles';
import { JOURNEY as SYSTEM_DESIGN_JOURNEY } from '@/lib/system-design/journey';
import type { JourneyPanelConcept } from '../JourneyPanel/JourneyPanel';
import { JourneyPanel } from '../JourneyPanel/JourneyPanel';
import type { JourneyPanelPhase } from '../JourneyPanel/JourneyPanel';

// ── DSA static lookups ────────────────────────────────────────────────────────

const DSA_FUNDAMENTALS_TO_SECTION: Record<string, string> = {};
const DSA_PROBLEM_TO_SECTION: Record<string, string> = {};
for (const phase of DSA_JOURNEY) {
  for (const section of phase.sections) {
    for (const slug of section.fundamentalsSlugs ?? [])
      DSA_FUNDAMENTALS_TO_SECTION[slug] = section.id;
    for (const p of section.firstPass)
      DSA_PROBLEM_TO_SECTION[p.id] = section.id;
    for (const p of section.reinforce)
      DSA_PROBLEM_TO_SECTION[p.id] = section.id;
  }
}

// ── Normalized phases ─────────────────────────────────────────────────────────

const DSA_PHASES: JourneyPanelPhase[] = DSA_JOURNEY.map((phase) => ({
  number: phase.number,
  label: phase.label,
  emoji: phase.emoji,
  sections: phase.sections.map((section, idx) => {
    const nextSection = phase.sections[idx + 1];
    return {
      id: section.id,
      label: section.label,
      fundamentalsSlugs: section.fundamentalsSlugs,
      fundamentalsLabels: section.fundamentalsLabels,
      items: section.firstPass.map((p) => ({
        key: p.id,
        label: PROBLEM_TITLES[p.id] ?? `Problem ${p.id}`,
        prefix: p.id,
      })),
      revisitItems: section.reinforce.map((p) => ({
        key: p.id,
        label: PROBLEM_TITLES[p.id] ?? `Problem ${p.id}`,
        prefix: p.id,
      })),
      revisitFromLabel: section.label,
      revisitPrerequisiteLabel:
        section.reinforcePrerequisiteLabel ?? nextSection?.label,
    };
  }),
}));

const FRONTEND_FUNDAMENTALS_TO_SECTION: Record<string, string> = {};
const FRONTEND_PROBLEM_TO_SECTION: Record<string, string> = {};
const FRONTEND_SCENARIO_TO_SECTION: Record<string, string> = {};
for (const phase of FRONTEND_JOURNEY) {
  for (const section of phase.sections) {
    FRONTEND_FUNDAMENTALS_TO_SECTION[section.fundamentalsSlug] = section.id;
    for (const f of section.additionalFundamentals ?? []) {
      FRONTEND_FUNDAMENTALS_TO_SECTION[f.slug] = section.id;
    }
    for (const scenario of section.scenarios ?? []) {
      FRONTEND_SCENARIO_TO_SECTION[scenario.slug] = section.id;
    }
    for (const problem of section.practice) {
      FRONTEND_PROBLEM_TO_SECTION[problem.id] = section.id;
    }
    for (const problem of section.explorations) {
      FRONTEND_PROBLEM_TO_SECTION[problem.id] = section.id;
    }
  }
}

const FRONTEND_PHASES: JourneyPanelPhase[] = FRONTEND_JOURNEY.map((phase) => ({
  number: phase.number,
  label: phase.label,
  emoji: phase.emoji,
  sections: phase.sections.map((section) => ({
    id: section.id,
    label: section.label,
    fundamentalsSlugs: [
      section.fundamentalsSlug,
      ...(section.additionalFundamentals?.map((f) => f.slug) ?? []),
    ],
    fundamentalsLabels: [
      'Fundamentals',
      ...(section.additionalFundamentals?.map((f) => {
        const slug = f.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return slug;
      }) ?? []),
    ],
    items: (section.scenarios ?? []).map((scenario) => ({
      key: scenario.slug,
      label: scenario.label,
    })),
    revisitItems: [
      ...section.practice.map((problem) => ({
        key: problem.id,
        label: problem.label,
        prefix: problem.id,
      })),
      ...section.explorations.map((problem) => ({
        key: problem.id,
        label: problem.label,
        prefix: problem.id,
      })),
    ],
    revisitLabel: 'Problems',
  })),
}));

const SYSTEM_DESIGN_FUNDAMENTALS_TO_SECTION: Record<string, string> = {};
const SYSTEM_DESIGN_SCENARIO_TO_SECTION: Record<string, string> = {};
const SYSTEM_DESIGN_PRACTICE_TO_SECTION: Record<string, string> = {};
const SYSTEM_DESIGN_CONCEPT_TO_SECTION: Record<string, string> = {};
for (const phase of SYSTEM_DESIGN_JOURNEY) {
  for (const section of phase.sections) {
    if (section.fundamentalsSlug) {
      SYSTEM_DESIGN_FUNDAMENTALS_TO_SECTION[section.fundamentalsSlug] =
        section.id;
    }
    if (section.practiceSlug) {
      SYSTEM_DESIGN_PRACTICE_TO_SECTION[section.practiceSlug] = section.id;
    }
    for (const concept of section.concepts ?? []) {
      SYSTEM_DESIGN_CONCEPT_TO_SECTION[concept.slug] = section.id;
    }
    for (const scenario of section.firstPass) {
      SYSTEM_DESIGN_SCENARIO_TO_SECTION[scenario.slug] = section.id;
    }
    for (const scenario of section.reinforce) {
      SYSTEM_DESIGN_SCENARIO_TO_SECTION[scenario.slug] = section.id;
    }
  }
}

const SYSTEM_DESIGN_PHASES: JourneyPanelPhase[] = SYSTEM_DESIGN_JOURNEY.map(
  (phase) => ({
    number: phase.number,
    label: phase.label,
    emoji: phase.emoji,
    sections: phase.sections.map((section, idx) => {
      const nextSection = phase.sections[idx + 1];
      return {
        id: section.id,
        label: section.label,
        fundamentalsSlug: section.fundamentalsSlug,
        practiceSlug: section.practiceSlug,
        concepts: section.concepts as JourneyPanelConcept[] | undefined,
        items: section.firstPass.map((scenario) => ({
          key: scenario.slug,
          label: scenario.label,
          prefix: 'SD',
        })),
        revisitItems: section.reinforce.map((scenario) => ({
          key: scenario.slug,
          label: scenario.label,
          prefix: 'SD',
        })),
        revisitFromLabel: section.label,
        revisitPrerequisiteLabel: nextSection?.label,
      };
    }),
  }),
);

// ── Active state helpers ──────────────────────────────────────────────────────

function dsaActiveSection(path: string): string | null {
  const fund = path.match(/^\/dsa\/fundamentals\/([^/]+)/)?.[1];
  if (fund) return DSA_FUNDAMENTALS_TO_SECTION[fund] ?? null;
  const prob = path.match(/^\/dsa\/problems\/([^/]+)/)?.[1];
  if (prob) return DSA_PROBLEM_TO_SECTION[prob] ?? null;
  return null;
}

function systemDesignActiveSection(path: string): string | null {
  const practice = path.match(/^\/system-design\/fundamentals\/practice\/([^/]+)/)?.[1];
  if (practice) return SYSTEM_DESIGN_PRACTICE_TO_SECTION[practice] ?? null;
  const fund = path.match(/^\/system-design\/fundamentals\/([^/]+)/)?.[1];
  if (fund) return SYSTEM_DESIGN_FUNDAMENTALS_TO_SECTION[fund] ?? null;
  const concept = path.match(/^\/system-design\/concepts\/([^/]+)/)?.[1];
  if (concept) return SYSTEM_DESIGN_CONCEPT_TO_SECTION[concept] ?? null;
  const scenario = path.match(/^\/system-design\/scenarios\/([^/]+)/)?.[1];
  if (scenario) return SYSTEM_DESIGN_SCENARIO_TO_SECTION[scenario] ?? null;
  return null;
}

function frontendActiveSection(path: string): string | null {
  const fund = path.match(/^\/frontend\/fundamentals\/([^/]+)/)?.[1];
  if (fund) return FRONTEND_FUNDAMENTALS_TO_SECTION[fund] ?? null;
  const problem = path.match(/^\/frontend\/problems\/([^/]+)/)?.[1];
  if (problem) return FRONTEND_PROBLEM_TO_SECTION[problem] ?? null;
  const scenario = path.match(/^\/frontend\/scenarios\/([^/]+)/)?.[1];
  if (scenario) return FRONTEND_SCENARIO_TO_SECTION[scenario] ?? null;
  return null;
}

// ── SiteNav ───────────────────────────────────────────────────────────────────

interface SiteNavProps {
  availableDsaProblemIds: string[];
  availableFrontendProblemIds: string[];
  availableFrontendScenarioSlugs: string[];
  availableDsaFundamentalsSlugs: string[];
  availableFrontendFundamentalsSlugs: string[];
  availableSystemDesignScenarioSlugs: string[];
  availableSystemDesignFundamentalsSlugs: string[];
  availableSystemDesignPracticeSlugs: string[];
  availableSystemDesignConceptSlugs: string[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function SiteNav({
  availableDsaProblemIds: availableDsaProblemIdsArr,
  availableFrontendProblemIds: availableFrontendProblemIdsArr,
  availableFrontendScenarioSlugs: availableFrontendScenarioSlugsArr,
  availableDsaFundamentalsSlugs: availableDsaFundamentalsArr,
  availableFrontendFundamentalsSlugs: availableFrontendFundamentalsArr,
  availableSystemDesignScenarioSlugs: availableSystemDesignScenarioSlugsArr,
  availableSystemDesignFundamentalsSlugs:
    availableSystemDesignFundamentalsSlugsArr,
  availableSystemDesignPracticeSlugs: availableSystemDesignPracticeSlugsArr,
  availableSystemDesignConceptSlugs: availableSystemDesignConceptSlugsArr,
  collapsed,
  onToggleCollapsed,
}: SiteNavProps) {
  const availableDsaProblemIds = new Set(availableDsaProblemIdsArr);
  const availableFrontendScenarioSlugs = new Set(availableFrontendScenarioSlugsArr);
  const availableFrontendItemKeys = new Set([
    ...availableFrontendScenarioSlugsArr,
    ...availableFrontendProblemIdsArr,
  ]);
  const availableDsaFundamentals = new Set(availableDsaFundamentalsArr);
  const availableFrontendFundamentals = new Set(
    availableFrontendFundamentalsArr,
  );
  const availableSystemDesignScenarios = new Set(
    availableSystemDesignScenarioSlugsArr,
  );
  const availableSystemDesignFundamentals = new Set(
    availableSystemDesignFundamentalsSlugsArr,
  );
  const availableSystemDesignPractice = new Set(
    availableSystemDesignPracticeSlugsArr,
  );
  const availableSystemDesignConcepts = new Set(
    availableSystemDesignConceptSlugsArr,
  );

  const pathname = usePathname();
  const isDsaPage = pathname.startsWith('/dsa');
  const isFrontendPage = pathname.startsWith('/frontend');
  const isSystemDesignPage = pathname.startsWith('/system-design');
  const activeSectionId = isSystemDesignPage
    ? systemDesignActiveSection(pathname)
    : isFrontendPage
      ? frontendActiveSection(pathname)
      : dsaActiveSection(pathname);

  return (
    <nav className="sticky left-0 top-0 z-50 flex h-screen w-full flex-col border-r border-r-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)]">
      <div
        data-left-sidebar-brand
        className={`shrink-0 pb-[14px] pt-[18px] ${collapsed ? 'px-3' : 'px-4'}`}
      >
        <Link
          href="/"
          data-left-sidebar-brand-link
          className={`no-underline flex items-center focus:outline-none ${collapsed ? 'justify-center' : 'gap-[10px]'}`}
        >
          <span className="text-[var(--ms-text-body)]">
            <TDIcon size={26} />
          </span>
          {!collapsed && (
            <span
              data-left-sidebar-brand-text
              className="text-[1.05rem] font-normal tracking-[-0.01em] text-[var(--ms-text-body)] [font-family:var(--font-display)]"
            >
              thinkdeep
            </span>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {(isDsaPage || isFrontendPage || isSystemDesignPage) && (
          <>
            <div
              data-left-sidebar-header
              className={`${collapsed ? 'px-3 ' : 'pl-4 pr-2'} py-3`}
              style={{ boxShadow: 'inset 0 -1px 0 var(--ms-surface)' }}
            >
              <div
                data-left-sidebar-header-row
                className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-2'}`}
              >
                {!collapsed && (
                  <Link
                    href={
                      isSystemDesignPage
                        ? '/system-design/path'
                        : isFrontendPage
                          ? '/frontend/path'
                          : '/dsa/path'
                    }
                    data-left-sidebar-back-link
                    className="flex min-w-0 items-center gap-2 text-[0.775rem] font-normal text-[var(--ms-text-body)] no-underline transition-colors visited:text-[var(--ms-text-body)] hover:text-[var(--ms-primary)] focus:outline-none focus-visible:outline-none active:outline-none"
                  >
                    <ChevronLeft
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0"
                    />
                    <span>Back to Path</span>
                  </Link>
                )}
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggleCollapsed();
                  }}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  className="appearance-none shadow-none flex items-center justify-between rounded-md border-none bg-transparent font-semibold transition-[background,color] duration-150 outline-none ring-0 hover:bg-[var(--ms-primary-surface)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 p-2 text-[var(--ms-text-fainted)] mb-0"
                >
                  {collapsed ? (
                    <ChevronsRight className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronsLeft className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <JourneyPanel
                phases={
                  isSystemDesignPage
                    ? SYSTEM_DESIGN_PHASES
                    : isFrontendPage
                      ? FRONTEND_PHASES
                      : DSA_PHASES
                }
                pathname={pathname}
                activeSectionId={activeSectionId}
                activeItemKey={
                  isSystemDesignPage
                    ? pathname.match(/^\/system-design\/scenarios\/([^/]+)/)?.[1] ??
                      null
                    : isFrontendPage
                      ? pathname.match(/^\/frontend\/scenarios\/([^/]+)/)?.[1] ??
                        null
                    : pathname.match(/^\/dsa\/problems\/([^/]+)/)?.[1] ?? null
                }
                activeFundamentalsSlug={
                  isSystemDesignPage
                    ? pathname.match(/^\/system-design\/fundamentals\/(?!practice\/)([^/]+)/)?.[1] ??
                      null
                    : isFrontendPage
                      ? pathname.match(/^\/frontend\/fundamentals\/([^/]+)/)?.[1] ??
                        null
                    : pathname.match(/^\/dsa\/fundamentals\/([^/]+)/)?.[1] ?? null
                }
                activePracticeSlug={
                  isSystemDesignPage
                    ? pathname.match(/^\/system-design\/fundamentals\/practice\/([^/]+)/)?.[1] ??
                      null
                    : null
                }
                activeConceptSlug={
                  isSystemDesignPage
                    ? pathname.match(/^\/system-design\/concepts\/([^/]+)/)?.[1] ??
                      null
                    : null
                }
                availableItemKeys={
                  isSystemDesignPage
                    ? availableSystemDesignScenarios
                    : isFrontendPage
                      ? availableFrontendItemKeys
                    : availableDsaProblemIds
                }
                availableFundamentalsSlugs={
                  isSystemDesignPage
                    ? availableSystemDesignFundamentals
                    : isFrontendPage
                      ? availableFrontendFundamentals
                    : availableDsaFundamentals
                }
                availablePracticeSlugs={
                  isSystemDesignPage
                    ? availableSystemDesignPractice
                    : new Set<string>()
                }
                availableConceptSlugs={
                  isSystemDesignPage
                    ? availableSystemDesignConcepts
                    : new Set<string>()
                }
                getItemHref={(key) =>
                  isSystemDesignPage
                    ? `/system-design/scenarios/${key}`
                    : isFrontendPage
                      ? availableFrontendScenarioSlugs.has(key)
                        ? `/frontend/scenarios/${key}`
                        : `/frontend/problems/${key}`
                    : `/dsa/problems/${key}`
                }
                getFundamentalsHref={(slug) =>
                  isSystemDesignPage
                    ? `/system-design/fundamentals/${slug}`
                    : isFrontendPage
                      ? `/frontend/fundamentals/${slug}`
                    : `/dsa/fundamentals/${slug}`
                }
                getPracticeHref={(slug) =>
                  `/system-design/fundamentals/practice/${slug}`
                }
                getConceptHref={(slug) =>
                  `/system-design/concepts/${slug}`
                }
                progressItemIdPrefix={
                  isSystemDesignPage
                    ? 'sd-'
                    : isFrontendPage
                      ? 'fe-problem-'
                      : 'dsa-'
                }
                progressFundamentalsIdPrefix={
                  isSystemDesignPage
                    ? 'sd-fundamentals-'
                    : isFrontendPage
                      ? 'fe-fundamentals-'
                      : 'dsa-fundamentals-'
                }
                compact={collapsed}
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
