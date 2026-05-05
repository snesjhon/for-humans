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

// Copy the exact mutation path: the outer object and preferences.
export function setTheme(
  settings: Settings,
  theme: Settings['preferences']['theme'],
): Settings {
  return {
    ...settings,
    preferences: {
      ...settings.preferences,
      theme,
    },
  };
}
