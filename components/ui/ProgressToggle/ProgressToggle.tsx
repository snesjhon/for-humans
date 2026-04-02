'use client'

import { useState, useTransition } from 'react'
import { toggleProgress, type ItemType } from '@/lib/progress/actions'

interface Props {
  itemType: ItemType
  itemId: string
  initialCompleted: boolean
}

export function ProgressToggle({ itemType, itemId, initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    const wasCompleted = completed
    setCompleted(!wasCompleted) // optimistic
    startTransition(async () => {
      try {
        await toggleProgress(itemType, itemId, wasCompleted)
      } catch {
        setCompleted(wasCompleted) // rollback on error
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      className="shrink-0 w-5 h-5 rounded border transition-colors cursor-pointer bg-transparent flex items-center justify-center"
      style={{
        borderColor: completed ? 'var(--green)' : 'var(--border)',
        background: completed
          ? 'color-mix(in srgb, var(--green) 15%, transparent)'
          : 'transparent',
        opacity: isPending ? 0.5 : 1,
      }}
    >
      {completed && (
        <span className="text-[10px] leading-none" style={{ color: 'var(--green)' }}>
          ✓
        </span>
      )}
    </button>
  )
}
