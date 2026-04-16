import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { DsaCodeBase } from '@/lib/dsa/codePersistence'

function readParams(request: NextRequest): {
  slug: string
  file: string
  base: DsaCodeBase
} | null {
  const slug = request.nextUrl.searchParams.get('slug')
  const file = request.nextUrl.searchParams.get('file')
  const base = (request.nextUrl.searchParams.get('base') ?? 'problems') as DsaCodeBase

  if (!slug || !file || !file.endsWith('.ts') || file.includes('/') || file.includes('..')) {
    return null
  }

  if (base !== 'problems' && base !== 'fundamentals') {
    return null
  }

  return { slug, file, base }
}

export async function GET(request: NextRequest) {
  const params = readParams(request)
  if (!params) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ snippet: null })
  }

  const { data, error } = await supabase
    .from('dsa_code_snippets')
    .select('code, updated_at')
    .eq('user_id', user.id)
    .eq('content_base', params.base)
    .eq('content_slug', params.slug)
    .eq('file_name', params.file)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    snippet: data?.code ?? null,
    updatedAt: data?.updated_at ?? null,
  })
}

export async function PUT(request: NextRequest) {
  const params = readParams(request)
  if (!params) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const body = (await request.json()) as { snippet?: unknown }
  if (typeof body.snippet !== 'string') {
    return NextResponse.json({ error: 'Invalid snippet' }, { status: 400 })
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { error } = await supabase.from('dsa_code_snippets').upsert(
    {
      user_id: user.id,
      content_base: params.base,
      content_slug: params.slug,
      file_name: params.file,
      code: body.snippet,
    },
    { onConflict: 'user_id,content_base,content_slug,file_name' },
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const params = readParams(request)
  if (!params) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { error } = await supabase
    .from('dsa_code_snippets')
    .delete()
    .eq('user_id', user.id)
    .eq('content_base', params.base)
    .eq('content_slug', params.slug)
    .eq('file_name', params.file)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
