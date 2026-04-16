'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
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
    let timerId: ReturnType<typeof globalThis.setTimeout> | null = null;
    let idleId: number | null = null;

    const start = () => {
      if (!cancelled) setIsReady(true);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(start, { timeout: 250 });
    } else {
      timerId = globalThis.setTimeout(start, 150);
    }

    return () => {
      cancelled = true;
      if (timerId !== null) globalThis.clearTimeout(timerId);
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
      <div>
        <p className="mb-4 text-xs font-semibold text-[var(--ms-text-body)]">
          Your Progress
        </p>
        <p className="text-xs leading-relaxed text-[var(--ms-text-subtle)]">
          Loading progress...
        </p>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div>
        <p className="mb-4 text-xs font-semibold text-[var(--ms-text-body)]">
          Your Progress
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(`/dsa/problems/${problemId}`)}`}
          className="text-xs leading-relaxed text-[var(--ms-text-subtle)] transition-colors no-underline hover:text-[var(--ms-text-body)]"
        >
          Sign in to track progress →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-xs font-semibold text-[var(--ms-text-body)]">
        Your Progress
      </p>
      <div className="space-y-0.5">
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
    </div>
  );
}
