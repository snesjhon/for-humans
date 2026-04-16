'use client'

import { createContext, useContext, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { toggleProgress, type ItemType } from '@/lib/progress/actions'

interface ProgressItem {
  itemType: ItemType
  itemId: string
}

interface ProgressContextValue {
  isCompleted: (itemType: ItemType, itemId: string) => boolean
  toggle: (itemType: ItemType, itemId: string) => Promise<void>
  isLoading: (itemType: ItemType) => boolean
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function buildKey(itemType: ItemType, itemIds: string[]): string {
  const sorted = [...itemIds].sort()
  const params = new URLSearchParams({ itemType })
  sorted.forEach((id) => params.append('itemId', id))
  return `/api/progress?${params.toString()}`
}

function isMatchingProgressKey(
  cacheKey: unknown,
  itemType: ItemType,
  itemId: string,
): cacheKey is string {
  if (typeof cacheKey !== 'string' || !cacheKey.startsWith('/api/progress?')) {
    return false
  }

  const params = new URLSearchParams(cacheKey.split('?')[1])
  return (
    params.get('itemType') === itemType &&
    params.getAll('itemId').includes(itemId)
  )
}

function updateCompletedIds(
  current: { completedIds?: string[] } | undefined,
  itemId: string,
  completed: boolean,
) {
  const completedIds = new Set(current?.completedIds ?? [])

  if (completed) completedIds.add(itemId)
  else completedIds.delete(itemId)

  return { completedIds: Array.from(completedIds).sort() }
}

interface Props {
  items: ProgressItem[]
  children: React.ReactNode
}

export function ProgressProvider({ items, children }: Props) {
  const { mutate } = useSWRConfig()

  // Group itemIds by type
  const byType = items.reduce<Record<string, string[]>>((acc, { itemType, itemId }) => {
    if (!acc[itemType]) acc[itemType] = []
    acc[itemType].push(itemId)
    return acc
  }, {})

  const types = Object.keys(byType) as ItemType[]

  // One SWR fetch per itemType
  const swrResults = types.map((itemType) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const key = buildKey(itemType, byType[itemType])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading } = useSWR<{ completedIds: string[] }>(key, fetcher)
    return { itemType, key, completedIds: data?.completedIds ?? [], isLoading }
  })

  // Optimistic state: tracks in-flight toggles
  const [optimistic, setOptimistic] = useState<Record<string, boolean>>({})

  const stateKey = (itemType: ItemType, itemId: string) => `${itemType}:${itemId}`

  function isCompleted(itemType: ItemType, itemId: string): boolean {
    const key = stateKey(itemType, itemId)
    if (key in optimistic) return optimistic[key]
    const result = swrResults.find((r) => r.itemType === itemType)
    return result?.completedIds.includes(itemId) ?? false
  }

  function isTypeLoading(itemType: ItemType): boolean {
    return swrResults.find((r) => r.itemType === itemType)?.isLoading ?? true
  }

  async function toggle(itemType: ItemType, itemId: string) {
    const key = stateKey(itemType, itemId)
    const wasCompleted = isCompleted(itemType, itemId)
    const nextCompleted = !wasCompleted

    // Optimistic update
    setOptimistic((prev) => ({ ...prev, [key]: nextCompleted }))
    await mutate(
      (cacheKey) => isMatchingProgressKey(cacheKey, itemType, itemId),
      (current) => updateCompletedIds(current, itemId, nextCompleted),
      { revalidate: false },
    )

    try {
      await toggleProgress(itemType, itemId, wasCompleted)

      await mutate((cacheKey) => isMatchingProgressKey(cacheKey, itemType, itemId))
    } catch {
      // Rollback
      setOptimistic((prev) => ({ ...prev, [key]: wasCompleted }))
      await mutate(
        (cacheKey) => isMatchingProgressKey(cacheKey, itemType, itemId),
        (current) => updateCompletedIds(current, itemId, wasCompleted),
        { revalidate: false },
      )
    } finally {
      // Clear optimistic override after SWR settles
      setOptimistic((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  return (
    <ProgressContext.Provider value={{ isCompleted, toggle, isLoading: isTypeLoading }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider')
  return ctx
}

export function useOptionalProgress(): ProgressContextValue | null {
  return useContext(ProgressContext)
}
