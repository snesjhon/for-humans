'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useProgress } from '@/components/ui/ProgressProvider/ProgressProvider';
import type { ItemType } from '@/lib/progress/actions';

interface CompletionCTAProps {
  itemType: ItemType;
  itemId: string;
  label: string;
  completedLabel: string;
  loginHref: string;
}

export default function CompletionCTA({
  itemType,
  itemId,
  label,
  completedLabel,
  loginHref,
}: CompletionCTAProps) {
  const { isCompleted, toggle, isLoading } = useProgress();
  const [isPending, startTransition] = useTransition();
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
      <div className="h-10 w-[11.5rem] rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)]" />
    );
  }

  if (!hasSession) {
    return (
      <Link
        href={loginHref}
        className="inline-flex items-center justify-center rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-4 py-2 text-sm font-medium text-[var(--ms-text-muted)] transition-[background,color,border-color] hover:bg-[var(--ms-bg-pane-tertiary)] hover:text-[var(--ms-text-body)]"
      >
        {label}
      </Link>
    );
  }

  const loading = isLoading(itemType);
  const completed = isCompleted(itemType, itemId);

  function handleToggle() {
    startTransition(() => {
      toggle(itemType, itemId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading || isPending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-[background,color,border-color,opacity] ${
        completed
          ? 'border border-[var(--ms-green)] bg-[var(--ms-green-surface)] text-[var(--ms-green)]'
          : 'border border-[var(--ms-blue)] bg-[var(--ms-blue)] text-white'
      } ${loading || isPending ? 'opacity-60' : 'hover:opacity-90'}`}
    >
      <Check className="h-4 w-4" strokeWidth={2.5} />
      {isPending ? 'Saving…' : completed ? completedLabel : label}
    </button>
  );
}
