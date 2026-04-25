const API_KEY_STORAGE_KEY = 'td_claude_api_key';
const LEGACY_API_KEY_STORAGE_KEYS = ['sdh_claude_api_key', 'fdh_claude_api_key'];

function readLocalStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
}

export function getApiKey(): string | null {
  const stored = readLocalStorage(API_KEY_STORAGE_KEY);
  if (stored) return stored;

  for (const legacyKey of LEGACY_API_KEY_STORAGE_KEYS) {
    const legacyValue = readLocalStorage(legacyKey);
    if (legacyValue) {
      window.localStorage.setItem(API_KEY_STORAGE_KEY, legacyValue);
      window.localStorage.removeItem(legacyKey);
      return legacyValue;
    }
  }

  return null;
}

export function setApiKey(key: string): void {
  window.localStorage.setItem(API_KEY_STORAGE_KEY, key);

  for (const legacyKey of LEGACY_API_KEY_STORAGE_KEYS) {
    window.localStorage.removeItem(legacyKey);
  }
}

export function clearApiKey(): void {
  window.localStorage.removeItem(API_KEY_STORAGE_KEY);

  for (const legacyKey of LEGACY_API_KEY_STORAGE_KEYS) {
    window.localStorage.removeItem(legacyKey);
  }
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return key.slice(0, 7) + '••••••••' + key.slice(-4);
}
