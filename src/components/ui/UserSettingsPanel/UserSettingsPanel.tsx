'use client';

import { useEffect, useState } from 'react';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher/ThemeSwitcher';
import { clearApiKey, getApiKey, maskApiKey, setApiKey } from '@/lib/claudeApiKey';

interface UserSettingsPanelProps {
  email: string;
}

export function UserSettingsPanel({ email }: UserSettingsPanelProps) {
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStoredKey(getApiKey());
  }, []);

  function handleSave() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setApiKey(trimmed);
    setStoredKey(trimmed);
    setInput('');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  function handleClear() {
    clearApiKey();
    setStoredKey(null);
    setSaved(false);
  }

  return (
    <main className="mx-auto mt-[80px] max-w-[720px] space-y-[2.25rem] px-6 pb-16">
      <section className="space-y-2">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ms-text-faint)]">
          User Settings
        </p>
        <h1 className="text-[1.8rem] font-extrabold tracking-[-0.03em] text-[var(--ms-text-body)]">
          Account, model access, and theme
        </h1>
        <p className="max-w-[56ch] text-[0.95rem] text-[var(--ms-text-subtle)]">
          Browser-only preferences for your account. Your Claude key and theme stay on this device.
        </p>
      </section>

      <section className="rounded-[16px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-6">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ms-text-faint)]">
          Account
        </p>
        <div className="mt-4 rounded-[12px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] px-4 py-3">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ms-text-faint)]">
            Signed in as
          </p>
          <p className="mt-1 text-[0.95rem] text-[var(--ms-text-body)]">{email}</p>
        </div>
      </section>

      <section className="rounded-[16px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-6">
        <div className="space-y-2">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ms-text-faint)]">
            Claude API Key
          </p>
          <p className="text-[0.9rem] text-[var(--ms-text-subtle)]">
            Used by chat and evaluation flows. Stored in local storage only.
          </p>
        </div>

        {storedKey && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[12px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] px-4 py-3">
            <span className="font-[ui-monospace,monospace] text-[0.875rem] text-[var(--ms-text-body)]">
              {maskApiKey(storedKey)}
            </span>
            <button
              onClick={handleClear}
              className="cursor-pointer border-none bg-transparent text-[0.8rem] text-[var(--ms-text-faint)]"
            >
              Clear
            </button>
          </div>
        )}

        <div className="mt-4 flex gap-[8px]">
          <input
            type="password"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSave()}
            placeholder={storedKey ? 'Replace API key…' : 'sk-ant-…'}
            className="flex-1 rounded-[10px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] px-[12px] py-[10px] text-[0.875rem] text-[var(--ms-text-body)]"
          />
          <button
            onClick={handleSave}
            className="cursor-pointer rounded-[10px] border-none bg-[var(--ms-blue)] px-[20px] py-[10px] text-[0.875rem] font-semibold text-white"
          >
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </section>

      <section className="rounded-[16px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-6">
        <div className="space-y-2">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ms-text-faint)]">
            Theme
          </p>
          <p className="text-[0.9rem] text-[var(--ms-text-subtle)]">
            Pick the interface flavor you want to use across the site.
          </p>
        </div>

        <div className="mt-4">
          <ThemeSwitcher />
        </div>
      </section>
    </main>
  );
}
