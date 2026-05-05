type Profile = {
  name: string;
  stats: {
    points: number;
  };
};

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

// Spread makes a fresh outer object, but nested references are still shared.
export function cloneProfile(profile: Profile): Profile {
  return { ...profile };
}

// Copy the mutation path so nested writes do not leak back into the original.
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

// Default only for missing values, not for valid falsy ones.
export function chooseValue<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}
