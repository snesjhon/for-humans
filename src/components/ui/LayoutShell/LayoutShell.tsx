'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TDIcon } from '@/components/ui/TDIcon/TDIcon';
import { SiteNav } from '@/components/ui/SiteNav/SiteNav';
import {
  LEFT_SIDEBAR_COLLAPSED_STORAGE_KEY,
  readStoredBoolean,
  writeStoredBoolean,
} from '@/lib/sidebarState';

const FULLWIDTH_ROUTES = new Set([
  '/',
  '/dsa',
  '/dsa/path',
  '/settings',
  '/system-design',
  '/system-design/path',
]);

interface LayoutShellProps {
  children: React.ReactNode;
  availableDsaProblemIds: string[];
  availableDsaFundamentalsSlugs: string[];
  availableSystemDesignScenarioSlugs: string[];
  availableSystemDesignFundamentalsSlugs: string[];
  availableSystemDesignPracticeSlugs: string[];
}

export function LayoutShell({
  children,
  availableDsaProblemIds,
  availableDsaFundamentalsSlugs,
  availableSystemDesignScenarioSlugs,
  availableSystemDesignFundamentalsSlugs,
  availableSystemDesignPracticeSlugs,
}: LayoutShellProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasLoadedSidebarState, setHasLoadedSidebarState] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isFullwidth = FULLWIDTH_ROUTES.has(pathname);
  const isHome = pathname === '/';
  const topLevelNavLinks = [
    { href: '/dsa', label: 'DSA', active: pathname.startsWith('/dsa') },
    {
      href: '/system-design',
      label: 'System Design',
      active: pathname.startsWith('/system-design'),
    },
  ];

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  useEffect(() => {
    setSidebarCollapsed(
      readStoredBoolean(LEFT_SIDEBAR_COLLAPSED_STORAGE_KEY, false),
    );
    setHasLoadedSidebarState(true);
  }, []);

  useEffect(() => {
    setScrolled(false);
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!hasLoadedSidebarState) return;

    writeStoredBoolean(
      LEFT_SIDEBAR_COLLAPSED_STORAGE_KEY,
      sidebarCollapsed,
    );
  }, [hasLoadedSidebarState, sidebarCollapsed]);

  if (isFullwidth) {
    return (
      <>
        <header
          className="sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500"
          style={{
            backgroundColor:
              isHome && !scrolled
                ? 'transparent'
                : 'var(--ms-bg-pane-secondary)',
            borderBottom:
              isHome && !scrolled
                ? '1px solid transparent'
                : '1px solid var(--ms-surface)',
            backdropFilter: isHome && !scrolled ? 'none' : 'blur(8px)',
          }}
        >
          <div className="max-w-[1152px] mx-auto px-6 min-h-14 py-3 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="no-underline flex items-center gap-[10px] focus:outline-none"
              >
                <span className="text-[var(--ms-text-body)]">
                  <TDIcon size={22} />
                </span>
                <span className="font-normal text-[1.05rem] text-[var(--ms-text-body)] tracking-[-0.01em] [font-family:var(--font-display)]">
                  thinkdeep
                </span>
              </Link>

              <nav
                aria-label="Primary"
                className="flex items-center gap-4 text-sm"
              >
                {topLevelNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`no-underline transition-colors focus:outline-none ${
                      link.active
                        ? 'text-[var(--ms-text-body)]'
                        : 'text-[var(--ms-text-faint)] hover:text-[var(--ms-text-body)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          className="w-full focus:outline-none"
        >
          {children}
        </main>
      </>
    );
  }

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: 'var(--layout-shell-columns, 260px 1fr)',
        transition: 'grid-template-columns 200ms ease',
      }}
    >
      <SiteNav
        availableDsaProblemIds={availableDsaProblemIds}
        availableDsaFundamentalsSlugs={availableDsaFundamentalsSlugs}
        availableSystemDesignScenarioSlugs={availableSystemDesignScenarioSlugs}
        availableSystemDesignFundamentalsSlugs={
          availableSystemDesignFundamentalsSlugs
        }
        availableSystemDesignPracticeSlugs={availableSystemDesignPracticeSlugs}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
      />
      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="w-full focus:outline-none"
      >
        {children}
      </main>
    </div>
  );
}
