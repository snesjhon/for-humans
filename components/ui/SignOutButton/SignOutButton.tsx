'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function SignOutButton({ email }: { email: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div
    // style={{
    //   padding: '10px 16px',
    //   borderTop: '1px solid var(--border)',
    //   flexShrink: 0,
    // }}
    >
      <p className="text-[0.7rem] text-[var(--fg-gutter)] truncate mb-2">
        {email}
      </p>
      <button
        onClick={handleSignOut}
        className="text-[0.75rem] text-[var(--fg-comment)] hover:text-[var(--fg)] transition-colors bg-transparent border-none cursor-pointer p-0"
      >
        Sign out
      </button>
    </div>
  );
}
