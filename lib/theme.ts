export const THEME_STORAGE_KEY = 'theme-flavor';
export const THEME_CHANGE_EVENT = 'theme-flavor-change';

export const THEME_FLAVORS = ['latte', 'mocha'] as const;

export type ThemeFlavor = (typeof THEME_FLAVORS)[number];

export const DEFAULT_THEME_FLAVOR: ThemeFlavor = 'latte';

export function isThemeFlavor(value: unknown): value is ThemeFlavor {
  return (
    typeof value === 'string' && THEME_FLAVORS.includes(value as ThemeFlavor)
  );
}

export function isDarkTheme(flavor: ThemeFlavor): boolean {
  return flavor === 'mocha';
}

export function getStoredThemeFlavor(): ThemeFlavor {
  if (typeof window === 'undefined') return DEFAULT_THEME_FLAVOR;

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeFlavor(stored) ? stored : DEFAULT_THEME_FLAVOR;
  } catch {
    return DEFAULT_THEME_FLAVOR;
  }
}

export function getActiveThemeFlavor(): ThemeFlavor {
  if (typeof document === 'undefined') return DEFAULT_THEME_FLAVOR;

  const applied = document.documentElement.getAttribute('data-theme');
  return isThemeFlavor(applied) ? applied : DEFAULT_THEME_FLAVOR;
}

export function applyThemeFlavor(flavor: ThemeFlavor): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-theme', flavor);
  root.classList.toggle('dark', isDarkTheme(flavor));

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, flavor);
  } catch {
    // localStorage unavailable; keep the theme for the current session only.
  }

  window.dispatchEvent(
    new CustomEvent<ThemeFlavor>(THEME_CHANGE_EVENT, { detail: flavor }),
  );
}

export function getThemeInitScript(): string {
  return `
    (function () {
      var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
      var defaultTheme = ${JSON.stringify(DEFAULT_THEME_FLAVOR)};
      var root = document.documentElement;
      var theme = defaultTheme;

      try {
        var stored = window.localStorage.getItem(storageKey);
        if (stored === 'latte' || stored === 'mocha') {
          theme = stored;
        }
      } catch (error) {}

      root.setAttribute('data-theme', theme);
      root.classList.toggle('dark', theme === 'mocha');
    })();
  `;
}
