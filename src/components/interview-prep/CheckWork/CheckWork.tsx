'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Circle, CircleCheck } from 'lucide-react';
import { getApiKey } from '@/lib/claudeApiKey';
import { getProjectPath } from '@/lib/interview-prep/projectPath';

interface CheckResult {
  covered: string[];
  missed: string[];
  followUp: string | null;
}

interface Props {
  slug: string;
}

const POLL_INTERVAL_MS = 30_000;

export default function CheckWork({ slug }: Props) {
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [changesDetected, setChangesDetected] = useState(false);
  const lastHashRef = useRef<string>('');

  useEffect(() => {
    setProjectPath(getProjectPath());
    const stored = localStorage.getItem(`interview-prep-check-result:${slug}`);
    if (stored) setResult(JSON.parse(stored));
  }, [slug]);

  const fetchHash = useCallback(async () => {
    if (!projectPath) return;
    const res = await fetch('/interview-prep/api/check-work/hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, projectPath }),
    });
    const { hash } = await res.json();
    if (lastHashRef.current && hash !== lastHashRef.current) {
      setChangesDetected(true);
    }
    lastHashRef.current = hash;
  }, [slug, projectPath]);

  useEffect(() => {
    if (!projectPath) return;
    fetchHash();
    const id = setInterval(fetchHash, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchHash, projectPath]);

  async function handleCheck() {
    const apiKey = getApiKey();
    if (!apiKey || !projectPath) return;
    setChecking(true);
    setChangesDetected(false);
    const res = await fetch('/interview-prep/api/check-work', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, projectPath, apiKey }),
    });
    const data: CheckResult = await res.json();
    setResult(data);
    localStorage.setItem(
      `interview-prep-check-result:${slug}`,
      JSON.stringify(data),
    );
    setChecking(false);
    await fetchHash();
  }

  if (!projectPath) {
    return (
      <div className="mt-6 rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-4">
        <p className="text-sm text-[var(--ms-text-faint)]">
          Set your Plant Floor Monitor path in{' '}
          <a href="/interview-prep/settings" className="text-[var(--ms-blue)]">
            Settings
          </a>{' '}
          to enable work checking.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {changesDetected && (
        <div className="rounded-lg border border-[var(--ms-blue)] bg-[var(--ms-blue-surface)] px-4 py-3 text-sm text-[var(--ms-text-body)]">
          New changes detected, ready to check?
        </div>
      )}

      <button
        onClick={handleCheck}
        disabled={checking}
        className="w-full cursor-pointer rounded-[6px] border-0 bg-[var(--ms-blue)] px-[20px] py-[8px] text-sm font-semibold text-white disabled:opacity-50"
      >
        {checking ? 'Checking…' : 'Check my work'}
      </button>

      {result && (
        <div className="space-y-3 rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-4 text-sm">
          {result.covered.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-green)]">
                Covered
              </p>
              <ul className="space-y-1">
                {result.covered.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[var(--ms-text-muted)]"
                  >
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.2] text-[var(--ms-green)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.missed.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-peach)]">
                Missed
              </p>
              <ul className="space-y-1">
                {result.missed.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[var(--ms-text-muted)]"
                  >
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 stroke-2 text-[var(--ms-peach)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.followUp && (
            <div className="border-t border-[var(--ms-surface)] pt-2">
              <p className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-text-faint)]">
                Think about this
              </p>
              <p className="leading-relaxed text-[var(--ms-text-muted)]">
                {result.followUp}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
