'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { JOURNEY as DSA_JOURNEY } from '@/lib/dsa/journey';
import { PROBLEM_TITLES } from '@/lib/dsa/titles';
import { JOURNEY as SD_JOURNEY } from '@/lib/system-design/journey';
import { JOURNEY as FS_JOURNEY } from '@/lib/fullstack/journey';
import { JourneyPanel } from '../JourneyPanel/JourneyPanel';
import type { JourneyPanelPhase } from '../JourneyPanel/JourneyPanel';
import { SignOutButton } from '../SignOutButton/SignOutButton';

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

// ── System Design static lookups ──────────────────────────────────────────────

const SD_FUNDAMENTALS_TO_SECTION: Record<string, string> = {};
const SD_SCENARIO_TO_SECTION: Record<string, string> = {};

for (const phase of SD_JOURNEY) {
  for (const section of phase.sections) {
    if (section.fundamentalsSlug)
      SD_FUNDAMENTALS_TO_SECTION[section.fundamentalsSlug] = section.id;
    for (const s of section.firstPass)
      SD_SCENARIO_TO_SECTION[s.slug] = section.id;
  }
}

// ── Fullstack static lookups ──────────────────────────────────────────────────

const FS_FUNDAMENTALS_TO_SECTION: Record<string, string> = {};
const FS_SCENARIO_TO_SECTION: Record<string, string> = {};

for (const phase of FS_JOURNEY) {
  for (const section of phase.sections) {
    if (section.fundamentalsSlug)
      FS_FUNDAMENTALS_TO_SECTION[section.fundamentalsSlug] = section.id;
    for (const s of section.firstPass)
      FS_SCENARIO_TO_SECTION[s.slug] = section.id;
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

const SD_PHASES: JourneyPanelPhase[] = SD_JOURNEY.map((phase) => ({
  number: phase.number,
  label: phase.label,
  emoji: phase.emoji,
  sections: phase.sections.map((section) => ({
    id: section.id,
    label: section.label,
    fundamentalsSlug: section.fundamentalsSlug,
    items: section.firstPass.map((s) => ({ key: s.slug, label: s.label })),
    revisitItems: section.reinforce.map((s) => ({
      key: s.slug,
      label: s.label,
    })),
  })),
}));

const FS_PHASES: JourneyPanelPhase[] = FS_JOURNEY.map((phase) => ({
  number: phase.number,
  label: phase.label,
  emoji: phase.emoji,
  sections: phase.sections.map((section) => ({
    id: section.id,
    label: section.label,
    fundamentalsSlug: section.fundamentalsSlug,
    items: section.firstPass.map((s) => ({ key: s.slug, label: s.label })),
    revisitItems: section.reinforce.map((s) => ({
      key: s.slug,
      label: s.label,
    })),
  })),
}));

// ── Active state helpers ──────────────────────────────────────────────────────

function dsaActiveSection(path: string): string | null {
  const fund = path.match(/^\/dsa\/fundamentals\/([^/]+)/)?.[1];
  if (fund) return DSA_FUNDAMENTALS_TO_SECTION[fund] ?? null;
  const prob = path.match(/^\/dsa\/problems\/([^/]+)/)?.[1];
  if (prob) return DSA_PROBLEM_TO_SECTION[prob] ?? null;
  return null;
}

function sdActiveSection(path: string): string | null {
  const fund = path.match(/^\/system-design\/fundamentals\/([^/]+)/)?.[1];
  if (fund) return SD_FUNDAMENTALS_TO_SECTION[fund] ?? null;
  const scen = path.match(/^\/system-design\/scenarios\/([^/]+)/)?.[1];
  if (scen) return SD_SCENARIO_TO_SECTION[scen] ?? null;
  return null;
}

function fsActiveSection(path: string): string | null {
  const fund = path.match(/^\/fullstack\/fundamentals\/([^/]+)/)?.[1];
  if (fund) return FS_FUNDAMENTALS_TO_SECTION[fund] ?? null;
  const scen = path.match(/^\/fullstack\/scenarios\/([^/]+)/)?.[1];
  if (scen) return FS_SCENARIO_TO_SECTION[scen] ?? null;
  return null;
}

// ── App key ───────────────────────────────────────────────────────────────────

type AppKey = 'dsa' | 'system-design' | 'fullstack';

function appFromPath(path: string): AppKey | null {
  if (path.startsWith('/dsa')) return 'dsa';
  if (path.startsWith('/system-design')) return 'system-design';
  if (path.startsWith('/fullstack')) return 'fullstack';
  return null;
}

// ── AppHeader — accordion toggle button for each top-level app ────────────────

function AppHeader({
  label,
  active,
  open,
  onToggle,
}: {
  label: string;
  active: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center border-none border-t border-t-[var(--border)] bg-transparent px-4 py-[7px] text-left text-[0.825rem] transition-colors focus:outline-none ${
        active
          ? 'font-semibold tracking-[-0.01em] text-[var(--active-phase-color)]'
          : 'font-normal text-[var(--fg-alt)]'
      }`}
    >
      <span className="flex-1">{label}</span>
      <span
        className={`inline-block shrink-0 text-[0.65rem] text-[var(--fg-gutter)] transition-transform duration-200 ${
          open ? 'rotate-180' : 'rotate-0'
        }`}
      >
        ↓
      </span>
    </button>
  );
}

// ── SiteNav ───────────────────────────────────────────────────────────────────

interface SiteNavProps {
  availableProblemIds: string[];
  availableFundamentalsSlugs: string[];
  availableSystemDesignScenarioSlugs: string[];
  availableSystemDesignFundamentalsSlugs: string[];
  availableFullstackScenarioSlugs: string[];
  availableFullstackFundamentalsSlugs: string[];
  email?: string;
}

export function SiteNav({
  availableProblemIds: availableProblemIdsArr,
  availableFundamentalsSlugs: availableDsaFundamentalsArr,
  email,
  // availableSystemDesignScenarioSlugs,
  // availableSystemDesignFundamentalsSlugs,
  // availableFullstackScenarioSlugs,
  // availableFullstackFundamentalsSlugs,
}: SiteNavProps) {
  const availableProblemIds = new Set(availableProblemIdsArr);
  const availableDsaFundamentals = new Set(availableDsaFundamentalsArr);
  // const availableSDScenarios = new Set(availableSystemDesignScenarioSlugs);
  // const availableSDFundamentals = new Set(
  //   availableSystemDesignFundamentalsSlugs,
  // );
  // const availableFSScenarios = new Set(availableFullstackScenarioSlugs);
  // const availableFSFundamentals = new Set(availableFullstackFundamentalsSlugs);

  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [openApps, setOpenApps] = useState<Set<AppKey>>(() => {
    const app = appFromPath(pathname);
    return app ? new Set([app]) : new Set();
  });

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Auto-open the current app's section when navigating
  useEffect(() => {
    const app = appFromPath(pathname);
    if (!app) return;
    setOpenApps((prev) => {
      if (prev.has(app)) return prev;
      const next = new Set(prev);
      next.add(app);
      return next;
    });
  }, [pathname]);

  const toggleApp = (app: AppKey) => {
    setOpenApps((prev) => {
      const next = new Set(prev);
      if (next.has(app)) next.delete(app);
      else next.add(app);
      return next;
    });
  };

  const toggleDark = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
  };

  return (
    <nav className="sticky left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-r-[var(--border)] bg-[var(--bg-alt)]">
      {/* Branding */}
      <div className="shrink-0 border-b border-b-[var(--border)] px-4 pb-[14px] pt-[18px]">
        <Link href="/" className="no-underline block focus:outline-none">
          <span className="text-[1.05rem] italic font-normal tracking-[-0.01em] text-[var(--fg)] [font-family:var(--font-display)]">
            MentalSystems
          </span>
        </Link>
      </div>

      {/* Accordion body — all headers flex-shrink:0, expanded content fills remaining space */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── DSA ── */}
        <AppHeader
          label="DSA"
          active={pathname.startsWith('/dsa')}
          open={openApps.has('dsa')}
          onToggle={() => toggleApp('dsa')}
        />
        {openApps.has('dsa') && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <JourneyPanel
              phases={DSA_PHASES}
              pathname={pathname}
              activeSectionId={dsaActiveSection(pathname)}
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
        )}

        {/* ── System Design ── */}
        {/* <AppHeader */}
        {/*   label="System Design" */}
        {/*   active={pathname.startsWith('/system-design')} */}
        {/*   open={openApps.has('system-design')} */}
        {/*   onToggle={() => toggleApp('system-design')} */}
        {/* /> */}
        {/* {openApps.has('system-design') && ( */}
        {/*   <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}> */}
        {/*     <JourneyPanel */}
        {/*       phases={SD_PHASES} */}
        {/*       pathname={pathname} */}
        {/*       activeSectionId={sdActiveSection(pathname)} */}
        {/*       activeItemKey={ */}
        {/*         pathname.match(/^\/system-design\/scenarios\/([^/]+)/)?.[1] ?? null */}
        {/*       } */}
        {/*       activeFundamentalsSlug={ */}
        {/*         pathname.match(/^\/system-design\/fundamentals\/([^/]+)/)?.[1] ?? null */}
        {/*       } */}
        {/*       availableItemKeys={availableSDScenarios} */}
        {/*       availableFundamentalsSlugs={availableSDFundamentals} */}
        {/*       getItemHref={(slug) => `/system-design/scenarios/${slug}`} */}
        {/*       getFundamentalsHref={(slug) => `/system-design/fundamentals/${slug}`} */}
        {/*     /> */}
        {/*   </div> */}
        {/* )} */}

        {/* ── Fullstack ── */}
        {/* <AppHeader */}
        {/*   label="Fullstack" */}
        {/*   active={pathname.startsWith('/fullstack')} */}
        {/*   open={openApps.has('fullstack')} */}
        {/*   onToggle={() => toggleApp('fullstack')} */}
        {/* /> */}
        {/* {openApps.has('fullstack') && ( */}
        {/*   <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}> */}
        {/*     <JourneyPanel */}
        {/*       phases={FS_PHASES} */}
        {/*       pathname={pathname} */}
        {/*       activeSectionId={fsActiveSection(pathname)} */}
        {/*       activeItemKey={ */}
        {/*         pathname.match(/^\/fullstack\/scenarios\/([^/]+)/)?.[1] ?? null */}
        {/*       } */}
        {/*       activeFundamentalsSlug={ */}
        {/*         pathname.match(/^\/fullstack\/fundamentals\/([^/]+)/)?.[1] ?? null */}
        {/*       } */}
        {/*       availableItemKeys={availableFSScenarios} */}
        {/*       availableFundamentalsSlugs={availableFSFundamentals} */}
        {/*       getItemHref={(slug) => `/fullstack/scenarios/${slug}`} */}
        {/*       getFundamentalsHref={(slug) => `/fullstack/fundamentals/${slug}`} */}
        {/*     /> */}
        {/*   </div> */}
        {/* )} */}
      </div>

      <div className="flex px-2 py-4 justify-between border-t border-t-[var(--border)]">
        <div>
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="bg-transparent cursor-pointer text-[var(--fg-comment)] text-sm leading-none px-2 py-2"
          >
            {dark ? '☀' : '◑'}
          </button>
        </div>
        {email ? (
          <SignOutButton email={email ?? ''} />
        ) : (
          <div>
            <Link
              href="/login"
              className="text-[0.75rem] text-[var(--fg-comment)] hover:text-[var(--fg)] transition-colors no-underline"
            >
              Sign in to track progress →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
