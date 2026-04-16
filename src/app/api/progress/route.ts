import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const itemType = searchParams.get('itemType')
  const itemIds = searchParams.getAll('itemId')

  if (!itemType || itemIds.length === 0) {
    return NextResponse.json({ completedIds: [] })
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ completedIds: [] })
  }

  const { data } = await supabase
    .from('progress')
    .select('item_id')
    .eq('user_id', user.id)
    .eq('item_type', itemType)
    .in('item_id', itemIds)

  const completedIds = data?.map((row: { item_id: string }) => row.item_id) ?? []
  return NextResponse.json({ completedIds })
}
