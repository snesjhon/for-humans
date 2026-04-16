import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(searchParams.next ?? '/dsa/path')
  }

  const next = searchParams.next ?? '/dsa/path'

  async function signInWithGitHub() {
    'use server'
    const supabase = createClient()
    const host = headers().get('host')!
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (data.url) {
      redirect(data.url)
    }
    if (error) console.error(error)
  }

  async function signInWithGoogle() {
    'use server'
    const supabase = createClient()
    const host = headers().get('host')!
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (data.url) {
      redirect(data.url)
    }
    if (error) console.error(error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ms-bg-pane)]">
      <div className="w-full max-w-sm px-8 py-10 border border-[var(--ms-surface)] rounded-xl bg-[var(--ms-bg-pane-secondary)]">
        <h1 className="mb-2 text-3xl italic font-normal text-[var(--ms-text-body)] [font-family:var(--font-display)]">
          MentalSystems
        </h1>
        <p className="text-sm text-[var(--ms-text-faint)] mb-8">
          Sign in to track your progress.
        </p>

        {searchParams.error && (
          <p className="text-sm text-[var(--ms-red)] mb-4">
            Sign in failed. Please try again.
          </p>
        )}

        <div className="flex flex-col gap-3">
          <form action={signInWithGitHub}>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] text-[var(--ms-text-body)] text-sm font-medium hover:bg-[var(--ms-bg-pane-tertiary)] transition-colors cursor-pointer"
            >
              Continue with GitHub
            </button>
          </form>

          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] text-[var(--ms-text-body)] text-sm font-medium hover:bg-[var(--ms-bg-pane-tertiary)] transition-colors cursor-pointer"
            >
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
