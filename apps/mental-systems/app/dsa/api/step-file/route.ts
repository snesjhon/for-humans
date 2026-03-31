import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  const file = request.nextUrl.searchParams.get('file')
  const base = request.nextUrl.searchParams.get('base') || 'problems'

  // Only allow .ts files, no path traversal
  if (!slug || !file || !file.endsWith('.ts') || file.includes('/') || file.includes('..')) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }
  if (base !== 'problems' && base !== 'fundamentals') {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'app', base, slug, file)

  try {
    const content = await readFile(filePath, 'utf-8')
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
