'use client'

import { useState, useTransition } from 'react'
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
        <span className="font-mono text-[0.6rem] text-[var(--fg-gutter)]">
          {completedCount}/{total}
        </span>
      )}
      <button
        onClick={handleSectionToggle}
        disabled={isPending}
        aria-label={sectionDone ? 'Mark section incomplete' : 'Mark section complete'}
        className="shrink-0 w-4 h-4 rounded border transition-colors cursor-pointer bg-transparent flex items-center justify-center"
        style={{
          borderColor: sectionDone ? 'var(--green)' : 'var(--border)',
          background: sectionDone
            ? 'color-mix(in srgb, var(--green) 15%, transparent)'
            : 'transparent',
          opacity: isPending ? 0.5 : 1,
        }}
      >
        {sectionDone && (
          <span className="text-[8px] leading-none" style={{ color: 'var(--green)' }}>
            ✓
          </span>
        )}
      </button>
    </div>
  )
}
