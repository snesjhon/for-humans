'use client'

import { useState, useTransition } from 'react'
import { Circle, CircleCheck } from 'lucide-react'
import { toggleProgress, type ItemType } from '@/lib/progress/actions'

interface Props {
  itemType: ItemType
  itemId: string
  initialCompleted: boolean
}

export function ProgressToggle({ itemType, itemId, initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [isPending, startTransition] = useTransition()
  const Icon = completed ? CircleCheck : Circle

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
      className={`shrink-0 bg-transparent p-0 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}
    >
      <Icon
        aria-hidden="true"
        className={`h-3.5 w-3.5 shrink-0 ${completed ? 'text-[var(--ms-primary)]' : 'text-[var(--ms-text-subtle)]'}`}
      />
    </button>
  )
}
