'use client';

import { useEffect, useRef, useState } from 'react';
import { Layers3, Moon, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  applyThemeFlavor,
  getActiveThemeFlavor,
  THEME_CHANGE_EVENT,
  type ThemeFlavor,
} from '@/lib/theme';

interface ThemeSwitcherProps {
  collapsed?: boolean;
  compact?: boolean;
}

const FLAVOR_LABELS: Record<ThemeFlavor, string> = {
  latte: 'Latte',
  mocha: 'Mocha',
  'github-light': 'GitHub Light',
  'github-dark': 'GitHub Dark',
  'tokyo-light': 'Light',
  'tokyo-storm': 'Storm',
};

const FLAVOR_ICONS: Record<ThemeFlavor, LucideIcon> = {
  latte: Sun,
  mocha: Moon,
  'github-light': Sun,
  'github-dark': Moon,
  'tokyo-light': Sun,
  'tokyo-storm': Moon,
};

const FLAVOR_ORDER = [
  'latte',
  'mocha',
  'github-light',
  'github-dark',
  'tokyo-light',
  'tokyo-storm',
] as const satisfies readonly ThemeFlavor[];

function nextFlavor(flavor: ThemeFlavor): ThemeFlavor {
  const index = FLAVOR_ORDER.indexOf(flavor);
  return FLAVOR_ORDER[(index + 1) % FLAVOR_ORDER.length];
}

export function ThemeSwitcher({
  collapsed = false,
  compact = false,
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<ThemeFlavor>('latte');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!compact) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [compact]);

  if (collapsed) {
    const next = nextFlavor(theme);

    return (
      <button
        onClick={() => applyThemeFlavor(next)}
        aria-label={`Switch to ${FLAVOR_LABELS[next]} theme`}
        title={`Switch to ${FLAVOR_LABELS[next]}`}
        className="appearance-none shadow-none cursor-pointer border-none bg-transparent px-2 py-1 text-[var(--ms-text-subtle)] outline-none ring-0 transition-colors hover:text-[var(--ms-text-body)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
      >
        {theme === 'mocha' ||
        theme === 'github-dark' ||
        theme === 'tokyo-storm' ? (
          <Sun aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Moon aria-hidden="true" className="h-4 w-4" />
        )}
      </button>
    );
  }

  if (compact) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((value) => !value)}
          aria-label={`Theme: ${FLAVOR_LABELS[theme]}`}
          title={`Theme: ${FLAVOR_LABELS[theme]}`}
          className="flex h-6 w-6 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-[var(--ms-text-body)] outline-none transition-colors hover:text-[var(--ms-blue)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <Layers3 aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
        </button>

        {open && (
          <div className="absolute bottom-full right-0 z-[100] mb-2 min-w-[160px] overflow-hidden rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] shadow-lg">
            {FLAVOR_ORDER.map((flavor) => {
              const active = theme === flavor;
              const Icon = FLAVOR_ICONS[flavor];

              return (
                <button
                  key={flavor}
                  onClick={() => {
                    applyThemeFlavor(flavor);
                    setOpen(false);
                  }}
                  aria-pressed={active}
                  className={`flex w-full cursor-pointer items-center gap-2 border-none px-3 py-2 text-left text-[0.72rem] font-semibold uppercase tracking-[0.08em] transition-colors focus:outline-none ${
                    active
                      ? 'bg-[var(--ms-bg-pane-secondary)] text-[var(--ms-text-body)]'
                      : 'bg-transparent text-[var(--ms-text-subtle)] hover:bg-[var(--ms-bg-pane-secondary)] hover:text-[var(--ms-text-body)]'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  {FLAVOR_LABELS[flavor]}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex rounded-md border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-1">
      {FLAVOR_ORDER.map((flavor) => {
        const active = theme === flavor;
        const Icon = FLAVOR_ICONS[flavor];

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
            <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            {FLAVOR_LABELS[flavor]}
          </button>
        );
      })}
    </div>
  );
}
