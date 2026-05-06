'use client';

import { useEffect, useState } from 'react';
import {
  clearProjectPath,
  getProjectPath,
  setProjectPath,
} from '@/lib/frontend/projectPath';

export default function FrontendSettingsPage() {
  const [storedPath, setStoredPath] = useState<string | null>(null);
  const [pathInput, setPathInput] = useState('');
  const [pathSaved, setPathSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStoredPath(getProjectPath());
  }, []);

  function handleSavePath() {
    if (!pathInput.trim()) return;
    setProjectPath(pathInput.trim());
    setStoredPath(pathInput.trim());
    setPathInput('');
    setPathSaved(true);
    setTimeout(() => setPathSaved(false), 2000);
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const scaffoldCmd = `curl -fsSL ${typeof window !== 'undefined' ? window.location.origin : ''}/scaffolds/plant-floor-monitor.sh | bash`;

  return (
    <main className="mx-auto mt-[80px] max-w-[600px] space-y-[3rem] px-6">
      <div>
        <h1 className="mb-[0.5rem] text-[1.5rem] font-extrabold">
          Frontend Settings
        </h1>
        <p className="text-[0.9375rem] text-[var(--ms-text-subtle)]">
          Project-specific settings for the Plant Floor Monitor build track.
        </p>
      </div>

      <section>
        <h2 className="mb-[0.5rem] text-[1rem] font-bold">Get Started</h2>
        <p className="mb-[1rem] text-[0.875rem] text-[var(--ms-text-subtle)]">
          Run this command to scaffold the Plant Floor Monitor project on your
          machine. It creates the directory, writes the starter files, and runs{' '}
          <code className="font-[ui-monospace,monospace]">pnpm install</code>.
        </p>
        <div className="flex items-center gap-[8px] rounded-[6px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-[12px] py-[10px]">
          <code className="flex-1 font-[ui-monospace,monospace] text-[0.8rem] text-[var(--ms-text-body)]">
            {scaffoldCmd}
          </code>
          <button
            onClick={() => handleCopy(scaffoldCmd)}
            className="cursor-pointer rounded border-none bg-transparent px-[8px] py-[4px] text-[0.75rem] text-[var(--ms-text-faint)] transition-colors hover:text-[var(--ms-text-body)]"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="mt-[0.75rem] text-[0.8rem] text-[var(--ms-text-faint)]">
          By default the project is created in{' '}
          <code className="font-[ui-monospace,monospace]">./plant-floor-monitor</code>.
          Pass a name to override:{' '}
          <code className="font-[ui-monospace,monospace]">… | bash -s -- my-dir</code>
        </p>
      </section>

      <section>
        <h2 className="mb-[0.5rem] text-[1rem] font-bold">
          Plant Floor Monitor Path
        </h2>
        <p className="mb-[1rem] text-[0.875rem] text-[var(--ms-text-subtle)]">
          Absolute path to your local Plant Floor Monitor directory. Used to
          read your code when checking work.
        </p>
        {storedPath && (
          <div className="mb-[1rem] flex items-center justify-between rounded-[6px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-[16px] py-[12px]">
            <span className="font-[ui-monospace,monospace] text-[0.875rem] text-[var(--ms-text-body)]">
              {storedPath}
            </span>
            <button
              onClick={() => {
                clearProjectPath();
                setStoredPath(null);
              }}
              className="cursor-pointer border-none bg-transparent text-[0.8rem] text-[var(--ms-text-faint)]"
            >
              Clear
            </button>
          </div>
        )}
        <div className="flex gap-[8px]">
          <input
            type="text"
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            placeholder="/Users/you/plant-floor-monitor"
            className="flex-1 rounded-[6px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-[12px] py-[8px] font-[ui-monospace,monospace] text-[0.875rem] text-[var(--ms-text-body)]"
            onKeyDown={(e) => e.key === 'Enter' && handleSavePath()}
          />
          <button
            onClick={handleSavePath}
            className="cursor-pointer rounded-[6px] border-none bg-[var(--ms-blue)] px-[20px] py-[8px] text-[0.875rem] font-semibold text-white"
          >
            {pathSaved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-[0.5rem] text-[1rem] font-bold">User Settings</h2>
        <p className="text-[0.875rem] text-[var(--ms-text-subtle)]">
          Claude API key and theme live in{' '}
          <a href="/settings" className="text-[var(--ms-blue)]">
            user settings
          </a>
          .
        </p>
      </section>
    </main>
  );
}
