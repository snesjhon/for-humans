'use server'

import { createClient } from '@/lib/supabase/server'

export type ItemType = 'problem' | 'step' | 'section' | 'fundamentals' | 'fundamentals-level'

export async function toggleProgress(
  itemType: ItemType,
  itemId: string,
  currentlyCompleted: boolean,
): Promise<void> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  if (currentlyCompleted) {
    await supabase
      .from('progress')
      .delete()
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
  } else {
    await supabase
      .from('progress')
      .upsert({ user_id: user.id, item_type: itemType, item_id: itemId })
  }
}
