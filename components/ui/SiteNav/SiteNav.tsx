'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { JOURNEY as DSA_JOURNEY } from '@/lib/dsa/journey';
import { PROBLEM_TITLES } from '@/lib/dsa/titles';
import { JourneyPanel } from '../JourneyPanel/JourneyPanel';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
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

function sectionIcon(label: string): string {
  const words = label
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

type AppKey = 'dsa';

function appFromPath(path: string): AppKey | null {
  if (path.startsWith('/dsa')) return 'dsa';
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
      className={`appearance-none shadow-none flex w-full items-center border-none border-t border-t-[var(--ms-surface)] bg-transparent px-4 py-[7px] text-left text-[0.825rem] transition-colors outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
        active
          ? 'font-semibold tracking-[-0.01em] text-[var(--active-phase-color)]'
          : 'font-normal text-[var(--ms-text-muted)]'
      }`}
    >
      <span className="flex-1">{label}</span>
      <ChevronDown
        aria-hidden="true"
        className={`h-3.5 w-3.5 shrink-0 text-[var(--ms-text-faint)] transition-transform duration-200 ${
          open ? 'rotate-180' : 'rotate-0'
        }`}
      />
    </button>
  );
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
  const [collapsed, setCollapsed] = useState(false);
  const [openApps, setOpenApps] = useState<Set<AppKey>>(() => {
    const app = appFromPath(pathname);
    return app ? new Set([app]) : new Set();
  });

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed') === 'true';
    setCollapsed(saved);
    document.documentElement.style.setProperty(
      '--sidebar-w',
      saved ? '44px' : '260px',
    );
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

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
    document.documentElement.style.setProperty(
      '--sidebar-w',
      next ? '44px' : '260px',
    );
  };

  const activeSectionId = dsaActiveSection(pathname);

  if (collapsed) {
    return (
      <nav className="sticky left-0 top-0 z-50 flex h-screen w-[44px] flex-col border-r border-r-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)]">
        <div className="flex shrink-0 items-center justify-center border-b border-b-[var(--ms-surface)] py-[18px]">
          <span className="text-[0.85rem] italic font-normal text-[var(--ms-text-body)] [font-family:var(--font-display)]">
            M
          </span>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto py-2">
          {DSA_PHASES.map((phase) =>
            phase.sections.map((section) => {
              const isActive = activeSectionId === section.id;
              return (
                <button
                  key={section.id}
                  title={section.label}
                  onClick={toggleCollapsed}
                  className={`appearance-none shadow-none flex w-full cursor-pointer items-center justify-center border-none bg-transparent py-[6px] transition-colors outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                    isActive
                      ? 'font-bold text-[var(--ms-primary)]'
                      : 'text-[var(--ms-text-faint)] hover:text-[var(--ms-text-body)]'
                  }`}
                >
                  <span className="text-[0.6rem] font-mono font-bold leading-none">
                    {sectionIcon(section.label)}
                  </span>
                </button>
              );
            }),
          )}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2 border-t border-t-[var(--ms-surface)] py-3">
          <ThemeSwitcher collapsed />
          <button
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            className="appearance-none shadow-none cursor-pointer rounded border border-[var(--ms-surface)] bg-transparent px-1.5 py-1 text-[0.65rem] leading-none text-[var(--ms-text-faint)] outline-none ring-0 hover:text-[var(--ms-text-body)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky left-0 top-0 z-50 flex h-screen w-full flex-col border-r border-r-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)]">
      {/* Branding */}
      <div className="shrink-0 border-b border-b-[var(--ms-surface)] px-4 pb-[14px] pt-[18px]">
        <Link href="/" className="no-underline block focus:outline-none">
          <span className="text-[1.05rem] italic font-normal tracking-[-0.01em] text-[var(--ms-text-body)] [font-family:var(--font-display)]">
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
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-t-[var(--ms-surface)] px-3 py-3">
        <ThemeSwitcher />
        <button
          onClick={toggleCollapsed}
          aria-label="Collapse sidebar"
          className="appearance-none shadow-none cursor-pointer rounded border border-[var(--ms-surface)] bg-transparent px-1.5 py-1 text-[0.65rem] leading-none text-[var(--ms-text-faint)] outline-none ring-0 hover:text-[var(--ms-text-body)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    </nav>
  );
}
