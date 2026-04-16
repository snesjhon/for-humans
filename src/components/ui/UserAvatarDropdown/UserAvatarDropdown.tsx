'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleUserRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserAvatarDropdownProps {
  compact?: boolean;
}

export function UserAvatarDropdown({
  compact = false,
}: UserAvatarDropdownProps) {
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
    return compact ? (
      <div className="h-6 w-6" />
    ) : (
      <div className="h-[41px] border-b border-b-[var(--ms-surface)]" />
    );
  }

  if (compact) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((value) => !value)}
          aria-label={email ? 'User menu' : 'Account menu'}
          className="flex h-6 w-6 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-[var(--ms-text-body)] outline-none transition-colors hover:text-[var(--ms-blue)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <CircleUserRound
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={1.9}
          />
        </button>

        {open && (
          <div className="absolute bottom-full right-0 z-[100] mb-2 min-w-[220px] overflow-hidden rounded-xl border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] shadow-lg">
            {email ? (
              <>
                <div className="border-b border-b-[var(--ms-surface)] px-3 py-2 text-[0.72rem] text-[var(--ms-text-subtle)]">
                  {email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex w-full cursor-pointer items-center border-none bg-transparent px-3 py-2 text-left text-[0.75rem] text-[var(--ms-text-subtle)] transition-colors hover:bg-[var(--ms-bg-pane-secondary)] hover:text-[var(--ms-text-body)] focus:outline-none"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 text-[0.75rem] text-[var(--ms-text-subtle)] transition-colors no-underline hover:bg-[var(--ms-bg-pane-secondary)] hover:text-[var(--ms-text-body)]"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center border-b border-b-[var(--ms-surface)] px-3 py-2.5">
        <Link
          href="/login"
          className="text-[0.75rem] text-[var(--ms-text-subtle)] transition-colors no-underline hover:text-[var(--ms-text-body)]"
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
      className="relative border-b border-b-[var(--ms-surface)]"
    >
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-2 transition-colors hover:bg-[var(--ms-bg-pane-secondary)] focus:outline-none"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ms-blue)] text-[0.65rem] font-bold text-white">
          {initial}
        </span>
        <span className="min-w-0 flex-1 truncate text-left text-[0.72rem] text-[var(--ms-text-subtle)]">
          {email}
        </span>
        <span
          className={`text-[0.6rem] text-[var(--ms-text-faint)] transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] shadow-md">
          <button
            onClick={handleSignOut}
            className="flex w-full cursor-pointer items-center border-none bg-transparent px-3 py-2 text-left text-[0.75rem] text-[var(--ms-text-subtle)] transition-colors hover:bg-[var(--ms-bg-pane-secondary)] hover:text-[var(--ms-text-body)] focus:outline-none"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
