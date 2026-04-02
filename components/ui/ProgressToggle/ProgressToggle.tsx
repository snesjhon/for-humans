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
      className={`shrink-0 flex h-5 w-5 items-center justify-center rounded border bg-transparent transition-colors ${
        completed
          ? 'border-[var(--green)] bg-[var(--green-tint)]'
          : 'border-[var(--border)]'
      } ${isPending ? 'opacity-50' : 'opacity-100'}`}
    >
      {completed && (
        <span className="text-[10px] leading-none text-[var(--green)]">
          ✓
        </span>
      )}
    </button>
  )
}
