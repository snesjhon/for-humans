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
        className="shrink-0 w-5 h-5 rounded border transition-colors cursor-pointer bg-transparent flex items-center justify-center"
        style={{
          borderColor: completed ? 'var(--green)' : 'var(--border)',
          background: completed
            ? 'color-mix(in srgb, var(--green) 15%, transparent)'
            : 'transparent',
          opacity: isPending || loading ? 0.5 : 1,
        }}
      >
        {completed && (
          <span className="text-[10px] leading-none" style={{ color: 'var(--green)' }}>
            ✓
          </span>
        )}
      </button>
      {label && (
        <span
          className="text-sm"
          style={{
            color: 'var(--fg-comment)',
            opacity: loading ? 0.3 : 1,
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
