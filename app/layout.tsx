import type { Metadata } from 'next';
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import { LayoutShell } from '@/components/ui/LayoutShell/LayoutShell';
import { getAllProblems } from '@/lib/dsa/content';
import { getAllFundamentalsSlugs } from '@/lib/dsa/fundamentals';
import { DEFAULT_THEME_FLAVOR, getThemeInitScript } from '@/lib/theme';
import '../styles/globals.css';

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
  title: 'thinkdeep',
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

  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME_FLAVOR}
      className={`${newsreader.variable} ${plusJakarta.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body className="min-h-screen bg-[var(--ms-bg-pane)] text-[var(--ms-text-body)]">
        <LayoutShell
          availableProblemIds={availableProblemIds}
          availableFundamentalsSlugs={availableFundamentalsSlugs}
        >
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
