'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProgressProvider } from '@/components/ui/ProgressProvider/ProgressProvider';
import { ProgressToggleAsync } from '@/components/ui/ProgressToggleAsync/ProgressToggleAsync';

interface ProblemProgressPanelProps {
  problemId: string;
  stepNumbers: number[];
}

export default function ProblemProgressPanel({
  problemId,
  stepNumbers,
}: ProblemProgressPanelProps) {
  const [isReady, setIsReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timerId: number | null = null;
    let idleId: number | null = null;

    const start = () => {
      if (!cancelled) setIsReady(true);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(start, { timeout: 250 });
    } else {
      timerId = window.setTimeout(start, 150);
    }

    return () => {
      cancelled = true;
      if (timerId !== null) window.clearTimeout(timerId);
      if (idleId !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    let cancelled = false;

    async function checkSession() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;
      setHasSession(Boolean(session));
      setResolved(true);
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [isReady]);

  if (!resolved) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] p-4">
        <p className="mb-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--fg-gutter)]">
          Your Progress
        </p>
        <p className="text-sm text-[var(--fg-gutter)]">Loading progress...</p>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] p-4">
        <p className="mb-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--fg-gutter)]">
          Your Progress
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(`/dsa/problems/${problemId}`)}`}
          className="text-sm text-[var(--fg-comment)] transition-colors no-underline hover:text-[var(--fg)]"
        >
          Sign in to track progress →
        </Link>
      </div>
    );
  }

  return (
    <ProgressProvider
      items={[
        { itemType: 'problem', itemId: `dsa-${problemId}` },
        ...stepNumbers.map((n) => ({
          itemType: 'step' as const,
          itemId: `dsa-${problemId}-step-${n}`,
        })),
      ]}
    >
      <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] p-4">
        <p className="mb-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--fg-gutter)]">
          Your Progress
        </p>
        <ProgressToggleAsync
          itemType="problem"
          itemId={`dsa-${problemId}`}
          label="Problem complete"
        />
        {stepNumbers.map((n) => (
          <ProgressToggleAsync
            key={n}
            itemType="step"
            itemId={`dsa-${problemId}-step-${n}`}
            label={`Step ${n} complete`}
          />
        ))}
      </div>
    </ProgressProvider>
  );
}
