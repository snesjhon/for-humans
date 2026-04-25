import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Only auth-aware routes use this middleware now, so session refresh stays
  // off the public browsing path.
  await supabase.auth.getUser()

  // Site is public — no auth required to browse
  return supabaseResponse
}

export const config = {
  matcher: [
    '/login',
    '/auth/callback',
    '/api/:path*',
    '/settings',
    '/fullstack/settings',
    '/system-design/settings',
  ],
}
