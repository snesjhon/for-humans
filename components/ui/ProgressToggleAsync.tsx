'use client'

import { useEffect, useState } from 'react'
import { ProgressToggle } from './ProgressToggle'
import type { ItemType } from '@/lib/progress/actions'

interface Props {
  itemType: ItemType
  itemId: string
  label?: string
}

export function ProgressToggleAsync({ itemType, itemId, label }: Props) {
  const [initialCompleted, setInitialCompleted] = useState<boolean | null>(null)

  useEffect(() => {
    fetch(`/api/progress?itemType=${itemType}&itemId=${encodeURIComponent(itemId)}`)
      .then((r) => r.json())
      .then(({ completedIds }: { completedIds: string[] }) => {
        setInitialCompleted(completedIds.includes(itemId))
      })
      .catch(() => setInitialCompleted(false))
  }, [itemType, itemId])

  if (initialCompleted === null) {
    return (
      <div className="flex items-center gap-2">
        <span className="shrink-0 w-5 h-5 rounded border border-[var(--border)] inline-block opacity-30" />
        {label && (
          <span className="text-sm text-[var(--fg-comment)] opacity-30">{label}</span>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <ProgressToggle itemType={itemType} itemId={itemId} initialCompleted={initialCompleted} />
      {label && <span className="text-sm text-[var(--fg-comment)]">{label}</span>}
    </div>
  )
}
