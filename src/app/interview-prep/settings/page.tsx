'use client';

import { useEffect, useState } from 'react';
import {
  clearProjectPath,
  getProjectPath,
  setProjectPath,
} from '@/lib/interview-prep/projectPath';

export default function SettingsPage() {
  const [storedPath, setStoredPath] = useState<string | null>(null);
  const [pathInput, setPathInput] = useState('');
  const [pathSaved, setPathSaved] = useState(false);

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

  return (
    <main className="mx-auto mt-[80px] max-w-[600px] space-y-[3rem] px-6">
      <div>
        <h1 className="mb-[0.5rem] text-[1.5rem] font-extrabold">
          Interview Prep Settings
        </h1>
        <p className="text-[0.9375rem] text-[var(--ms-text-subtle)]">
          Project-specific settings for Plant Floor Monitor work.
        </p>
      </div>

      <section>
        <h2 className="mb-[0.5rem] text-[1rem] font-bold">
          Plant Floor Monitor Path
        </h2>
        <p className="mb-[1rem] text-[0.875rem] text-[var(--ms-text-subtle)]">
          Absolute path to your local Plant Floor Monitor directory. Used to read
          your code when checking work.
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
