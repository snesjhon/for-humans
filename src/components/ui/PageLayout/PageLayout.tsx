import React from 'react';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

interface PageLayoutProps {
  aside: React.ReactNode;
  children: React.ReactNode;
  accentColor?: string | null;
}

export function PageLayout({ aside, children, accentColor }: PageLayoutProps) {
  void accentColor;
  return (
    <div data-dfh-page-layout className="bg-[var(--ms-bg-pane)]">
      <div className="block xl:grid items-start gap-12 pr-8 py-10 xl:grid-cols-[1fr_220px]">
        <div data-dfh-page-main className="min-w-0 pl-24">
          {children}
        </div>
        <aside
          data-dfh-page-aside
          className="hidden xl:block sticky top-8 self-start max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          <div className="space-y-4">
            <ThemeSwitcher />
            {aside}
          </div>
        </aside>
      </div>
    </div>
  );
}
