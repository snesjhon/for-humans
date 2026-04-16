'use client';

import { useTransition } from 'react';
import { useProgress } from '../ProgressProvider/ProgressProvider';
import { ProgressMark } from '../ProgressMark/ProgressMark';
import type { ItemType } from '@/lib/progress/actions';

interface Props {
  itemType: ItemType;
  itemId: string;
  label?: string;
}

export function ProgressToggleAsync({ itemType, itemId, label }: Props) {
  const { isCompleted, toggle, isLoading } = useProgress();
  const [isPending, startTransition] = useTransition();

  const loading = isLoading(itemType);
  const completed = isCompleted(itemType, itemId);

  function handleToggle() {
    startTransition(() => {
      toggle(itemType, itemId);
    });
  }

  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-[var(--ms-bg-pane-secondary)]">
      <button
        onClick={handleToggle}
        disabled={isPending || loading}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        className={`mt-0.5 appearance-none rounded border-0 bg-transparent p-0 shadow-none focus:outline-none ${isPending || loading ? 'opacity-50' : 'opacity-100'}`}
      >
        <ProgressMark completed={completed} />
      </button>
      {label && (
        <span
          className={`text-xs leading-snug text-[var(--ms-text-subtle)] ${
            loading ? 'opacity-30' : 'opacity-100'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
