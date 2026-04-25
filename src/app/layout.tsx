import type { Metadata } from 'next';
import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono, Caveat } from 'next/font/google';
import { LayoutShell } from '@/components/ui/LayoutShell/LayoutShell';
import { getAllProblems } from '@/lib/dsa/content';
import { getAllFundamentalsSlugs } from '@/lib/dsa/fundamentals';
import { getSidebarStateInitScript } from '@/lib/sidebarState';
import { getAllScenarioSlugsFromDisk } from '@/lib/system-design/content';
import { getAllFundamentalsSlugs as getAllSystemDesignFundamentalsSlugs, getAllPracticeSlugs } from '@/lib/system-design/fundamentals';
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
  weight: ['400', '600'],
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
  const availableDsaProblemIds = getAllProblems().map((p) => p.id);
  const availableDsaFundamentalsSlugs = getAllFundamentalsSlugs();
  const availableSystemDesignScenarioSlugs = getAllScenarioSlugsFromDisk();
  const availableSystemDesignFundamentalsSlugs =
    getAllSystemDesignFundamentalsSlugs();
  const availableSystemDesignPracticeSlugs = getAllPracticeSlugs();

  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME_FLAVOR}
      className={`${newsreader.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
        <script dangerouslySetInnerHTML={{ __html: getSidebarStateInitScript() }} />
      </head>
      <body className="min-h-screen bg-[var(--ms-bg-pane)] text-[var(--ms-text-body)]">
        <LayoutShell
          availableDsaProblemIds={availableDsaProblemIds}
          availableDsaFundamentalsSlugs={availableDsaFundamentalsSlugs}
          availableSystemDesignScenarioSlugs={availableSystemDesignScenarioSlugs}
          availableSystemDesignFundamentalsSlugs={
            availableSystemDesignFundamentalsSlugs
          }
          availableSystemDesignPracticeSlugs={availableSystemDesignPracticeSlugs}
        >
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
