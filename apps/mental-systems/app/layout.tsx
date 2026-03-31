import type { Metadata } from 'next';
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import { SiteHeader } from '@for-humans/ui';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        <SiteHeader
          title="MentalSystems"
          homeHref="/dsa"
          navLinks={[
            { href: '/dsa', label: 'DSA' },
            { href: '/system-design', label: 'System Design' },
            { href: '/fullstack', label: 'Fullstack' },
          ]}
        />
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
