'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  applyThemeFlavor,
  getActiveThemeFlavor,
  THEME_CHANGE_EVENT,
  type ThemeFlavor,
} from '@/lib/theme';

interface ThemeSwitcherProps {
  collapsed?: boolean;
}

const FLAVOR_LABELS: Record<ThemeFlavor, string> = {
  latte: 'Latte',
  mocha: 'Mocha',
};

function nextFlavor(flavor: ThemeFlavor): ThemeFlavor {
  return flavor === 'latte' ? 'mocha' : 'latte';
}

export function ThemeSwitcher({
  collapsed = false,
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<ThemeFlavor>('latte');

  useEffect(() => {
    const syncTheme = () => {
      setTheme(getActiveThemeFlavor());
    };

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    window.addEventListener('storage', syncTheme);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
      window.removeEventListener('storage', syncTheme);
    };
  }, []);

  if (collapsed) {
    const next = nextFlavor(theme);

    return (
      <button
        onClick={() => applyThemeFlavor(next)}
        aria-label={`Switch to ${FLAVOR_LABELS[next]} theme`}
        title={`Switch to ${FLAVOR_LABELS[next]}`}
        className="appearance-none shadow-none cursor-pointer border-none bg-transparent px-2 py-1 text-[var(--ms-text-subtle)] outline-none ring-0 transition-colors hover:text-[var(--ms-text-body)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
      >
        {theme === 'mocha' ? (
          <Sun aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Moon aria-hidden="true" className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <div className="inline-flex rounded-md border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-1">
      {(['latte', 'mocha'] as const).map((flavor) => {
        const active = theme === flavor;

        return (
          <button
            key={flavor}
            onClick={() => applyThemeFlavor(flavor)}
            aria-pressed={active}
            className={`appearance-none shadow-none inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] outline-none ring-0 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
              active
                ? 'bg-[var(--ms-bg-pane)] text-[var(--ms-text-body)]'
                : 'bg-transparent text-[var(--ms-text-subtle)] hover:text-[var(--ms-text-body)]'
            }`}
          >
            {flavor === 'latte' ? (
              <Sun aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <Moon aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            {FLAVOR_LABELS[flavor]}
          </button>
        );
      })}
    </div>
  );
}
