import type { Metadata } from 'next';
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import { SiteNav } from '@/components/ui';
import { SignOutButton } from '@/components/ui/SignOutButton/SignOutButton';
import Link from 'next/link';
import { getAllProblems } from '@/lib/dsa/content';
import { getAllFundamentalsSlugs } from '@/lib/dsa/fundamentals';
import { getAllScenarioSlugsFromDisk as getSdScenarios } from '@/lib/system-design/content';
import { getAllFundamentalsSlugs as getSdFundamentals } from '@/lib/system-design/fundamentals';
import { getAllScenarioSlugsFromDisk as getFsScenarios } from '@/lib/fullstack/content';
import { getAllFundamentalsSlugs as getFsFundamentals } from '@/lib/fullstack/fundamentals';
import { createClient } from '@/lib/supabase/server';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  adjustFontFallback: false,
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'MentalSystems',
  description:
    'A structured learning platform for DSA, system design, and fullstack development.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const availableProblemIds = getAllProblems().map((p) => p.id);
  const availableFundamentalsSlugs = getAllFundamentalsSlugs();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakarta.variable}`}
    >
      <body
        className="min-h-screen bg-[var(--bg)] text-[var(--fg)]"
        style={{ paddingLeft: '260px' }}
      >
        <SiteNav
          availableProblemIds={availableProblemIds}
          availableFundamentalsSlugs={availableFundamentalsSlugs}
          availableSystemDesignScenarioSlugs={getSdScenarios()}
          availableSystemDesignFundamentalsSlugs={getSdFundamentals()}
          availableFullstackScenarioSlugs={getFsScenarios()}
          availableFullstackFundamentalsSlugs={getFsFundamentals()}
        />
        <div
          className="fixed bottom-0 left-0 z-50"
          style={{ width: '260px' }}
        >
          {user ? (
            <SignOutButton email={user.email ?? ''} />
          ) : (
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
              <Link
                href="/login"
                className="text-[0.75rem] text-[var(--fg-comment)] hover:text-[var(--fg)] transition-colors no-underline"
              >
                Sign in to track progress →
              </Link>
            </div>
          )}
        </div>
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
