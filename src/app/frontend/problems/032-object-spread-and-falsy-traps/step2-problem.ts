type Settings = {
  name: string;
  preferences: {
    theme: 'light' | 'dark';
    compact: boolean;
  };
  counters: {
    visits: number;
  };
};

// Goal: update preferences.theme without mutating the original settings object.
export function setTheme(
  settings: Settings,
  theme: Settings['preferences']['theme'],
): Settings {
  const next = { ...settings };
  next.preferences.theme = theme;
  return next;
}

// ---Tests
test('returns the updated theme in the new object', () => {
  const original: Settings = {
    name: 'Dashboard',
    preferences: { theme: 'light', compact: false },
    counters: { visits: 3 },
  };

  const next = setTheme(original, 'dark');

  expect(next.preferences.theme).toBe('dark');
});

test('does not mutate the original nested preferences object', () => {
  const original: Settings = {
    name: 'Dashboard',
    preferences: { theme: 'light', compact: false },
    counters: { visits: 3 },
  };

  const next = setTheme(original, 'dark');

  expect(original.preferences.theme).toBe('light');
  expect(next.preferences).not.toBe(original.preferences);
});

test('preserves references for unchanged sibling branches', () => {
  const original: Settings = {
    name: 'Dashboard',
    preferences: { theme: 'light', compact: false },
    counters: { visits: 3 },
  };

  const next = setTheme(original, 'dark');

  expect(next.counters).toBe(original.counters);
});
// ---End Tests
