'use client'

import { useTransition } from 'react'
import { useProgress } from '../ProgressProvider/ProgressProvider'
import type { ItemType } from '@/lib/progress/actions'

interface Props {
  itemType: ItemType
  itemId: string
  label?: string
}

export function ProgressToggleAsync({ itemType, itemId, label }: Props) {
  const { isCompleted, toggle, isLoading } = useProgress()
  const [isPending, startTransition] = useTransition()

  const loading = isLoading(itemType)
  const completed = isCompleted(itemType, itemId)

  function handleToggle() {
    startTransition(() => {
      toggle(itemType, itemId)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={isPending || loading}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        className={`shrink-0 flex h-5 w-5 items-center justify-center rounded border bg-transparent transition-colors ${
          completed
            ? 'border-[var(--green)] bg-[var(--green-tint)]'
            : 'border-[var(--border)]'
        } ${isPending || loading ? 'opacity-50' : 'opacity-100'}`}
      >
        {completed && (
          <span className="text-[10px] leading-none text-[var(--green)]">
            ✓
          </span>
        )}
      </button>
      {label && (
        <span className={`text-sm text-[var(--fg-comment)] ${loading ? 'opacity-30' : 'opacity-100'}`}>
          {label}
        </span>
      )}
    </div>
  )
}
