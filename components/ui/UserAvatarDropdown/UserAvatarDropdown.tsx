'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function UserAvatarDropdown() {
  const [email, setEmail] = useState('');
  const [resolved, setResolved] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;
      setEmail(session?.user.email ?? '');
      setResolved(true);
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  if (!resolved) {
    return <div className="h-[41px] border-b border-b-[var(--ctp-surface)]" />;
  }

  if (!email) {
    return (
      <div className="flex items-center border-b border-b-[var(--ctp-surface)] px-3 py-2.5">
        <Link
          href="/login"
          className="text-[0.75rem] text-[var(--ctp-text-subtle)] transition-colors no-underline hover:text-[var(--ctp-text-body)]"
        >
          Sign in to track progress →
        </Link>
      </div>
    );
  }

  const initial = email[0]?.toUpperCase() ?? '?';

  return (
    <div
      ref={dropdownRef}
      className="relative border-b border-b-[var(--ctp-surface)]"
    >
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-2 transition-colors hover:bg-[var(--ctp-bg-pane-secondary)] focus:outline-none"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ctp-blue)] text-[0.65rem] font-bold text-white">
          {initial}
        </span>
        <span className="min-w-0 flex-1 truncate text-left text-[0.72rem] text-[var(--ctp-text-subtle)]">
          {email}
        </span>
        <span
          className={`text-[0.6rem] text-[var(--ctp-text-faint)] transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border border-[var(--ctp-surface)] bg-[var(--ctp-bg-pane)] shadow-md">
          <button
            onClick={handleSignOut}
            className="flex w-full cursor-pointer items-center border-none bg-transparent px-3 py-2 text-left text-[0.75rem] text-[var(--ctp-text-subtle)] transition-colors hover:bg-[var(--ctp-bg-pane-secondary)] hover:text-[var(--ctp-text-body)] focus:outline-none"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
