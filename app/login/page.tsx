import { createClient } from '@/lib/supabase/server'
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
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback?next=${encodeURIComponent(next)}`,
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
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (data.url) {
      redirect(data.url)
    }
    if (error) console.error(error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-sm px-8 py-10 border border-[var(--border)] rounded-xl bg-[var(--bg-alt)]">
        <h1 className="mb-2 text-3xl italic font-normal text-[var(--fg)] [font-family:var(--font-display)]">
          MentalSystems
        </h1>
        <p className="text-sm text-[var(--fg-gutter)] mb-8">
          Sign in to track your progress.
        </p>

        {searchParams.error && (
          <p className="text-sm text-[var(--red)] mb-4">
            Sign in failed. Please try again.
          </p>
        )}

        <div className="flex flex-col gap-3">
          <form action={signInWithGitHub}>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] text-sm font-medium hover:bg-[var(--bg-highlight)] transition-colors cursor-pointer"
            >
              Continue with GitHub
            </button>
          </form>

          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] text-sm font-medium hover:bg-[var(--bg-highlight)] transition-colors cursor-pointer"
            >
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
