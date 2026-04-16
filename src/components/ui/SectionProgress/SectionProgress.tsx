'use client'

import { useState, useTransition } from 'react'
import { Circle, CircleCheck } from 'lucide-react'
import { toggleProgress } from '@/lib/progress/actions'

interface Props {
  sectionItemId: string
  problemItemIds: string[]
  initialCompletedProblemIds: string[]
  initialSectionCompleted: boolean
}

export function SectionProgress({
  sectionItemId,
  problemItemIds,
  initialCompletedProblemIds,
  initialSectionCompleted,
}: Props) {
  const completedSet = new Set(initialCompletedProblemIds)
  const completedCount = problemItemIds.filter((id) => completedSet.has(id)).length
  const total = problemItemIds.length

  const [sectionDone, setSectionDone] = useState(initialSectionCompleted)
  const [isPending, startTransition] = useTransition()
  const Icon = sectionDone ? CircleCheck : Circle

  function handleSectionToggle() {
    const wasDone = sectionDone
    setSectionDone(!wasDone)
    startTransition(async () => {
      try {
        await toggleProgress('section', sectionItemId, wasDone)
      } catch {
        setSectionDone(wasDone)
      }
    })
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      {total > 0 && (
        <span className="font-mono text-[0.6rem] text-[var(--ms-text-faint)]">
          {completedCount}/{total}
        </span>
      )}
      <button
        onClick={handleSectionToggle}
        disabled={isPending}
        aria-label={sectionDone ? 'Mark section incomplete' : 'Mark section complete'}
        className={`shrink-0 bg-transparent p-0 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}
      >
        <Icon
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 ${sectionDone ? 'text-[var(--ms-primary)]' : ''}`}
        />
      </button>
    </div>
  )
}
