'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppIcon } from '@/components/dsa/AppIcon/AppIcon';
import { SiteNav } from '@/components/ui/SiteNav/SiteNav';

const FULLWIDTH_ROUTES = new Set(['/', '/dsa', '/dsa/path']);

interface LayoutShellProps {
  children: React.ReactNode;
  availableProblemIds: string[];
  availableFundamentalsSlugs: string[];
}

export function LayoutShell({
  children,
  availableProblemIds,
  availableFundamentalsSlugs,
}: LayoutShellProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement | null>(null);
  const isFullwidth = FULLWIDTH_ROUTES.has(pathname);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  if (isFullwidth) {
    return (
      <>
        <header className="sticky top-0 z-50 bg-[var(--ms-bg-pane-secondary)] border-b border-b-[var(--ms-surface)]">
          <div className="max-w-[1152px] mx-auto px-6 h-14 flex items-center">
            <Link
              href="/"
              className="no-underline flex items-center gap-[10px] focus:outline-none"
            >
              <span className="text-[var(--ms-text-body)]">
                <AppIcon size={22} />
              </span>
              <span className="font-normal text-[1.05rem] text-[var(--ms-text-body)] tracking-[-0.01em] [font-family:var(--font-display)]">
                thinkdeep.systems
              </span>
            </Link>
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
        gridTemplateColumns: 'var(--sidebar-w, 260px) 1fr',
        transition: 'grid-template-columns 200ms ease',
      }}
    >
      <SiteNav
        availableProblemIds={availableProblemIds}
        availableFundamentalsSlugs={availableFundamentalsSlugs}
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
