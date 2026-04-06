'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { JOURNEY as DSA_JOURNEY } from '@/lib/dsa/journey';
import { PROBLEM_TITLES } from '@/lib/dsa/titles';
import { JourneyPanel } from '../JourneyPanel/JourneyPanel';
import type { JourneyPanelPhase } from '../JourneyPanel/JourneyPanel';

// ── DSA static lookups ────────────────────────────────────────────────────────

const DSA_FUNDAMENTALS_TO_SECTION: Record<string, string> = {};
const DSA_PROBLEM_TO_SECTION: Record<string, string> = {};
const DSA_SECTION_REVISIT: Record<
  string,
  { ids: string[]; fromLabel: string }
> = {};

let _dsaPrev: { reinforce: { id: string }[]; label: string } | null = null;
for (const phase of DSA_JOURNEY) {
  for (const section of phase.sections) {
    if (section.fundamentalsSlug)
      DSA_FUNDAMENTALS_TO_SECTION[section.fundamentalsSlug] = section.id;
    for (const p of section.firstPass)
      DSA_PROBLEM_TO_SECTION[p.id] = section.id;
    if (_dsaPrev && _dsaPrev.reinforce.length > 0) {
      DSA_SECTION_REVISIT[section.id] = {
        ids: _dsaPrev.reinforce.map((p) => p.id),
        fromLabel: _dsaPrev.label,
      };
    }
    _dsaPrev = section;
  }
}

// ── Normalized phases ─────────────────────────────────────────────────────────

const DSA_PHASES: JourneyPanelPhase[] = DSA_JOURNEY.map((phase) => ({
  number: phase.number,
  label: phase.label,
  emoji: phase.emoji,
  sections: phase.sections.map((section) => {
    const revisit = DSA_SECTION_REVISIT[section.id];
    return {
      id: section.id,
      label: section.label,
      fundamentalsSlug: section.fundamentalsSlug,
      items: section.firstPass.map((p) => ({
        key: p.id,
        label: PROBLEM_TITLES[p.id] ?? `Problem ${p.id}`,
        prefix: p.id,
      })),
      revisitItems: revisit?.ids.map((id) => ({
        key: id,
        label: PROBLEM_TITLES[id] ?? `Problem ${id}`,
        prefix: id,
      })),
    };
  }),
}));

// ── Active state helpers ──────────────────────────────────────────────────────

function dsaActiveSection(path: string): string | null {
  const fund = path.match(/^\/dsa\/fundamentals\/([^/]+)/)?.[1];
  if (fund) return DSA_FUNDAMENTALS_TO_SECTION[fund] ?? null;
  const prob = path.match(/^\/dsa\/problems\/([^/]+)/)?.[1];
  if (prob) return DSA_PROBLEM_TO_SECTION[prob] ?? null;
  return null;
}

// ── SiteNav ───────────────────────────────────────────────────────────────────

interface SiteNavProps {
  availableProblemIds: string[];
  availableFundamentalsSlugs: string[];
}

export function SiteNav({
  availableProblemIds: availableProblemIdsArr,
  availableFundamentalsSlugs: availableDsaFundamentalsArr,
}: SiteNavProps) {
  const availableProblemIds = new Set(availableProblemIdsArr);
  const availableDsaFundamentals = new Set(availableDsaFundamentalsArr);

  const pathname = usePathname();
  const activeSectionId = dsaActiveSection(pathname);
  const isDsaPage = pathname.startsWith('/dsa');

  return (
    <nav className="sticky left-0 top-0 z-50 flex h-screen w-full flex-col border-r border-r-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)]">
      {/* Branding */}
      <div className="shrink-0 px-4 pb-[14px] pt-[18px]">
        <Link href="/" className="no-underline block focus:outline-none">
          <span className="text-[1.05rem] italic font-normal tracking-[-0.01em] text-[var(--ms-text-body)] [font-family:var(--font-display)]">
            MentalSystems
          </span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {isDsaPage && (
          <>
            <Link
              href="/dsa/path"
              className="flex w-full items-center gap-2 px-4 py-3 text-[0.775rem] font-normal text-[var(--ms-text-body)] no-underline transition-colors visited:text-[var(--ms-text-body)] hover:text-[var(--ms-primary)] focus:outline-none focus-visible:outline-none active:outline-none"
              style={{ boxShadow: 'inset 0 -1px 0 var(--ms-surface)' }}
            >
              <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span>Back to Path</span>
            </Link>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <JourneyPanel
                phases={DSA_PHASES}
                pathname={pathname}
                activeSectionId={activeSectionId}
                activeItemKey={
                  pathname.match(/^\/dsa\/problems\/([^/]+)/)?.[1] ?? null
                }
                activeFundamentalsSlug={
                  pathname.match(/^\/dsa\/fundamentals\/([^/]+)/)?.[1] ?? null
                }
                availableItemKeys={availableProblemIds}
                availableFundamentalsSlugs={availableDsaFundamentals}
                getItemHref={(key) => `/dsa/problems/${key}`}
                getFundamentalsHref={(slug) => `/dsa/fundamentals/${slug}`}
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
