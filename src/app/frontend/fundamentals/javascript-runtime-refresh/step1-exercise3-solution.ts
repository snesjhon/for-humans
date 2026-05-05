export {};
// Runtime Ledger, Level 1: Shared Identity
// Update a nested path without mutating the existing nested object.

interface Settings {
  locale: string;
  preferences: {
    theme: 'light' | 'dark';
    density: 'comfortable' | 'compact';
  };
}

function setTheme(settings: Settings, nextTheme: 'light' | 'dark'): Settings {
  return {
    ...settings,
    preferences: {
      ...settings.preferences,
      theme: nextTheme,
    },
  };
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const originalSettings: Settings = {
  locale: 'en-US',
  preferences: { theme: 'light', density: 'compact' },
};
const updated = setTheme(originalSettings, 'dark');

assert(updated.preferences.theme === 'dark', 'theme is updated in the returned object');
assert(updated.preferences.density === 'compact', 'other nested fields stay the same');
assert(originalSettings.preferences.theme === 'light', 'original nested object stays unchanged');
assert(updated !== originalSettings, 'outer object is new');
assert(updated.preferences !== originalSettings.preferences, 'nested object on the write path is new');
// ---End Tests
