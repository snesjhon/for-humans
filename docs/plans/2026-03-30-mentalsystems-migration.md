# MentalSystems Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge three independent Next.js apps into a single `apps/mental-systems` app with a unified nav, per-app CSS theming via `data-app` attribute, and flat route structure under `/dsa/`, `/system-design/`, `/fullstack/`.

**Architecture:** Repurpose `apps/dsa-for-humans` as the unified app (already has the correct font pair). Routes are restructured flat — no route groups. Each section gets a `layout.tsx` that mounts an `AppTheme` client component, which sets `data-app` on `<html>`. All theme CSS is imported in the root `globals.css`; CSS vars are scoped per `[data-app]` selector. The `SiteHeader` detects the active app via `usePathname()` and applies the section's accent color to the active link.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, pnpm workspaces, `@for-humans/tokens`, `@for-humans/ui`

---

## File Map

**Created:**
- `apps/mental-systems/` (renamed from `apps/dsa-for-humans/`)
- `apps/mental-systems/components/AppTheme.tsx`
- `apps/mental-systems/app/dsa/layout.tsx`
- `apps/mental-systems/app/system-design/` (all routes from `apps/system-design-for-humans/app/`)
- `apps/mental-systems/app/system-design/layout.tsx`
- `apps/mental-systems/app/fullstack/` (all routes from `apps/fullstack-design-for-humans/app/`)
- `apps/mental-systems/app/fullstack/layout.tsx`
- `apps/mental-systems/lib/dsa/` (DSA lib files, namespaced)
- `apps/mental-systems/lib/system-design/` (SD lib files)
- `apps/mental-systems/lib/fullstack/` (Fullstack lib files)
- `apps/mental-systems/components/dsa/` (DSA-specific components)
- `apps/mental-systems/components/system-design/` (SD-specific components)
- `apps/mental-systems/components/fullstack/` (Fullstack-specific components)
- `packages/tokens/src/themes/fullstack.css`

**Modified:**
- `apps/mental-systems/package.json` (name, merged deps)
- `apps/mental-systems/app/layout.tsx` (unified MentalSystems nav)
- `apps/mental-systems/app/page.tsx` (redirect to /dsa)
- `apps/mental-systems/app/globals.css` (import all three themes)
- `apps/mental-systems/app/dsa/` (existing DSA routes moved here, imports updated)
- `packages/tokens/src/themes/dsa.css` (vars stay at `:root`, dark stays as `.dark`)
- `packages/tokens/src/themes/system-design.css` (`:root` → `[data-app="system-design"]`, `.dark` → `[data-app="system-design"].dark`)
- `packages/ui/src/SiteHeader.tsx` (active link detection)
- `packages/ui/src/index.ts` (export `isActivePath` if extracted)
- `root package.json` (add `dev` script)

**Deleted (after full migration verified):**
- `apps/dsa-for-humans/` (replaced by `apps/mental-systems/`)
- `apps/system-design-for-humans/`
- `apps/fullstack-design-for-humans/`

---

## Task 1: Rename the app directory and update package name

**Files:**
- Rename: `apps/dsa-for-humans/` → `apps/mental-systems/`
- Modify: `apps/mental-systems/package.json`

- [ ] **Step 1: Rename the directory**

```bash
mv apps/dsa-for-humans apps/mental-systems
```

- [ ] **Step 2: Update the package name**

In `apps/mental-systems/package.json`, change `"name"`:

```json
{
  "name": "mental-systems",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@10.32.1",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  }
}
```

- [ ] **Step 3: Verify pnpm workspace resolves the renamed app**

```bash
pnpm --filter mental-systems exec echo "ok"
```

Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add apps/mental-systems/package.json
git commit -m "feat: rename dsa-for-humans to mental-systems"
```

---

## Task 2: Merge dependencies from all three apps

**Files:**
- Modify: `apps/mental-systems/package.json`

The unified app needs every dependency from all three apps merged. SD and Fullstack add: `@anthropic-ai/sdk`, `@excalidraw/excalidraw`. Fullstack also adds jest devDependencies.

- [ ] **Step 1: Update dependencies in `apps/mental-systems/package.json`**

Replace the `dependencies` and `devDependencies` sections:

```json
{
  "name": "mental-systems",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@10.32.1",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.36.3",
    "@codemirror/commands": "^6.10.3",
    "@codemirror/lang-javascript": "^6.2.5",
    "@codemirror/language": "^6.12.2",
    "@codemirror/state": "^6.6.0",
    "@codemirror/view": "^6.40.0",
    "@excalidraw/excalidraw": "^0.18.0",
    "@for-humans/tokens": "workspace:*",
    "@for-humans/ui": "workspace:*",
    "@lezer/highlight": "^1.2.3",
    "@replit/codemirror-vim": "^6.3.0",
    "@webcontainer/api": "^1.6.1",
    "codemirror": "^6.0.2",
    "framer-motion": "^12.38.0",
    "gray-matter": "^4.0.3",
    "highlight.js": "^11.9.0",
    "mermaid": "^11.13.0",
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "react-markdown": "^9.0.1",
    "rehype-highlight": "^7.0.0",
    "remark-gfm": "^4.0.0"
  },
  "devDependencies": {
    "@types/jest": "^29",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "jest": "^29",
    "jest-environment-jsdom": "^29",
    "postcss": "^8.4.38",
    "postcss-import": "^16.1.1",
    "tailwindcss": "^3.4.1",
    "ts-jest": "^29",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Install**

```bash
pnpm install
```

Expected: no errors; `apps/mental-systems/node_modules` updated.

- [ ] **Step 3: Copy jest config from fullstack**

```bash
cp apps/fullstack-design-for-humans/jest.config.ts apps/mental-systems/jest.config.ts
```

- [ ] **Step 4: Commit**

```bash
git add apps/mental-systems/package.json apps/mental-systems/jest.config.ts pnpm-lock.yaml
git commit -m "feat: merge all app dependencies into mental-systems"
```

---

## Task 3: Scope system-design.css under [data-app] selector

Currently `system-design.css` uses `:root` and `.dark`. Scope it to `[data-app="system-design"]` so it only activates when that attribute is present. DSA keeps `:root` as the default fallback — no change needed for `dsa.css`.

**Files:**
- Modify: `packages/tokens/src/themes/system-design.css`

- [ ] **Step 1: Replace `:root` with `[data-app="system-design"]` and `.dark` with `[data-app="system-design"].dark`**

Full replacement for `packages/tokens/src/themes/system-design.css`:

```css
/* ─────────────────────────────────────────────────────────────────────────────
   System Design for Humans — Bold palette
   Activated when data-app="system-design" is set on <html>
   ───────────────────────────────────────────────────────────────────────────── */
[data-app="system-design"] {
  --active-phase-color: var(--blue);

  --bg: #ffffff;
  --bg-alt: #f2f5f9;
  --bg-highlight: #e8ebf0;
  --sel-bg: #d4e0f0;
  --border: #d4d8e0;
  --border-dark: #b0b8c8;
  --fg: #060e0e;
  --fg-alt: #3a4a5a;
  --fg-comment: #6b7a8a;
  --fg-gutter: #8a9a9a;

  --blue: #004e89;
  --link: #004e89;
  --green: #038051;
  --orange: #ffd000;
  --red: #c11400;
  --purple: #004e89;
  --cyan: #f11250;

  --blue-tint: rgba(0, 78, 137, 0.09);
  --green-tint: rgba(3, 128, 81, 0.09);
  --orange-tint: rgba(255, 208, 0, 0.10);
  --purple-tint: rgba(0, 78, 137, 0.09);
}

[data-app="system-design"].dark {
  --bg: #060e0e;
  --bg-alt: #0e1a1a;
  --bg-highlight: #162424;
  --sel-bg: #1e3030;
  --border: #1e3030;
  --border-dark: #2a4040;
  --fg: #ffffff;
  --fg-alt: #c8d4d4;
  --fg-comment: #7a9090;
  --fg-gutter: #4a6060;

  --blue: #4a88d8;
  --link: #4a88d8;
  --green: #1a9940;
  --orange: #ffd000;
  --red: #c11400;
  --purple: #4a88d8;
  --cyan: #f11250;

  --blue-tint: rgba(74, 136, 216, 0.12);
  --green-tint: rgba(26, 153, 64, 0.12);
  --orange-tint: rgba(255, 208, 0, 0.10);
  --purple-tint: rgba(74, 136, 216, 0.12);
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/tokens/src/themes/system-design.css
git commit -m "feat(tokens): scope system-design theme to [data-app] selector"
```

---

## Task 4: Create fullstack.css theme

**Files:**
- Create: `packages/tokens/src/themes/fullstack.css`

A new teal/forest palette, distinct from DSA (purple) and SD (navy).

- [ ] **Step 1: Create `packages/tokens/src/themes/fullstack.css`**

```css
/* ─────────────────────────────────────────────────────────────────────────────
   Fullstack for Humans — Teal palette
   Activated when data-app="fullstack" is set on <html>
   ───────────────────────────────────────────────────────────────────────────── */
[data-app="fullstack"] {
  --active-phase-color: var(--green);

  --bg: #f6faf8;
  --bg-alt: #edf5f0;
  --bg-highlight: #e0ede6;
  --sel-bg: #c8e0d4;
  --border: #ccddd4;
  --border-dark: #a8c4b8;
  --fg: #0e1a14;
  --fg-alt: #2a4a38;
  --fg-comment: #5a7a68;
  --fg-gutter: #7a9a88;

  --blue: #1a6b9a;
  --link: #1a6b9a;
  --green: #1a7a4a;
  --orange: #c27520;
  --red: #b81800;
  --purple: #6040b0;
  --cyan: #0d8080;

  --blue-tint: rgba(26, 107, 154, 0.09);
  --green-tint: rgba(26, 122, 74, 0.09);
  --orange-tint: rgba(194, 117, 32, 0.10);
  --purple-tint: rgba(96, 64, 176, 0.09);
}

[data-app="fullstack"].dark {
  --bg: #0a1410;
  --bg-alt: #101e18;
  --bg-highlight: #162820;
  --sel-bg: #1e3828;
  --border: #1e3228;
  --border-dark: #2a4438;
  --fg: #ffffff;
  --fg-alt: #b8d4c4;
  --fg-comment: #6a9080;
  --fg-gutter: #4a6858;

  --blue: #4aa0d8;
  --link: #4aa0d8;
  --green: #3ab870;
  --orange: #d4a030;
  --red: #e05040;
  --purple: #a080e0;
  --cyan: #30c0c0;

  --blue-tint: rgba(74, 160, 216, 0.12);
  --green-tint: rgba(58, 184, 112, 0.12);
  --orange-tint: rgba(212, 160, 48, 0.10);
  --purple-tint: rgba(160, 128, 224, 0.12);
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/tokens/src/themes/fullstack.css
git commit -m "feat(tokens): add fullstack teal theme"
```

---

## Task 5: Update SiteHeader with active link detection

**Files:**
- Modify: `packages/ui/src/SiteHeader.tsx`

Extract `isActivePath` as a pure function first so it can be tested, then use it in the component.

- [ ] **Step 1: Write the failing test**

Create `packages/ui/src/SiteHeader.test.ts`:

```ts
import { isActivePath } from './SiteHeader'

describe('isActivePath', () => {
  it('matches exact path', () => {
    expect(isActivePath('/dsa', '/dsa')).toBe(true)
  })

  it('matches sub-path', () => {
    expect(isActivePath('/dsa/path', '/dsa')).toBe(true)
  })

  it('does not match different section', () => {
    expect(isActivePath('/system-design/path', '/dsa')).toBe(false)
  })

  it('does not partially match prefix (e.g. /dsa-extra vs /dsa)', () => {
    expect(isActivePath('/dsa-extra', '/dsa')).toBe(false)
  })

  it('handles root slash', () => {
    expect(isActivePath('/', '/dsa')).toBe(false)
  })
})
```

- [ ] **Step 2: Add jest config to `packages/ui/` and run to verify it fails**

Check if `packages/ui/package.json` has jest. If not, run the test from the mental-systems app instead by placing the test file there. For now, verify the function doesn't exist yet:

```bash
grep -r "isActivePath" packages/ui/src/
```

Expected: no output (function not defined yet).

- [ ] **Step 3: Implement `isActivePath` and update `SiteHeader.tsx`**

Replace the full content of `packages/ui/src/SiteHeader.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteHeaderProps {
  title: string;
  homeHref?: string;
  icon?: React.ReactNode;
  navLinks?: NavLink[];
}

export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function SiteHeader({
  title,
  homeHref = '/',
  icon,
  navLinks = [],
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const check = () => setScrolled(window.scrollY > 12);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
  };

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: scrolled
          ? 'color-mix(in srgb, var(--active-phase-color) 9%, color-mix(in srgb, var(--bg) 87%, transparent))'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.3)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.3)' : 'none',
        transition: 'background 500ms ease',
      }}
    >
      <div className="relative">
        <nav className="w-full flex items-center gap-6 h-[68px] px-10">
          <Link
            href={homeHref}
            className="no-underline flex items-center gap-[10px] shrink-0 focus:outline-none"
          >
            {icon}
            <span
              className="italic font-normal text-[1.125rem] text-[var(--fg)] tracking-[-0.01em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </span>
          </Link>

          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm no-underline transition-colors"
                style={
                  active
                    ? {
                        color: 'var(--active-phase-color)',
                        borderBottom: '2px solid var(--active-phase-color)',
                        paddingBottom: '2px',
                        fontWeight: 500,
                      }
                    : { color: 'var(--fg-comment)' }
                }
              >
                {link.label}
              </Link>
            );
          })}

          <div className="ml-auto" />

          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="bg-transparent border border-[var(--border)] rounded-[6px] px-[8px] py-[4px] cursor-pointer text-[var(--fg-comment)] text-[14px] leading-none shrink-0"
          >
            {dark ? '☀' : '◑'}
          </button>
        </nav>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              'color-mix(in srgb, var(--active-phase-color) 30%, transparent)',
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 450ms ease',
          }}
        />
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Export `isActivePath` from the ui package index**

In `packages/ui/src/index.ts`, add the export:

```ts
export { isActivePath } from './SiteHeader';
```

(Add this line alongside the existing exports — read the current `index.ts` first to preserve all existing exports.)

- [ ] **Step 5: Verify `isActivePath` function logic manually**

```bash
node -e "
function isActivePath(p, h) {
  if (h === '/') return p === '/';
  return p === h || p.startsWith(h + '/');
}
console.assert(isActivePath('/dsa', '/dsa') === true);
console.assert(isActivePath('/dsa/path', '/dsa') === true);
console.assert(isActivePath('/system-design/path', '/dsa') === false);
console.assert(isActivePath('/dsa-extra', '/dsa') === false);
console.assert(isActivePath('/', '/dsa') === false);
console.log('all assertions passed');
"
```

Expected: `all assertions passed`

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/SiteHeader.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add active link detection to SiteHeader"
```

---

## Task 6: Create AppTheme client component

**Files:**
- Create: `apps/mental-systems/components/AppTheme.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useEffect } from 'react';

interface AppThemeProps {
  app: 'dsa' | 'system-design' | 'fullstack';
}

export function AppTheme({ app }: AppThemeProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-app', app);
    return () => {
      document.documentElement.removeAttribute('data-app');
    };
  }, [app]);
  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/mental-systems/components/AppTheme.tsx
git commit -m "feat: add AppTheme client component for data-app scoping"
```

---

## Task 7: Update root layout.tsx and globals.css

**Files:**
- Modify: `apps/mental-systems/app/layout.tsx`
- Modify: `apps/mental-systems/app/globals.css`

- [ ] **Step 1: Replace `app/globals.css`**

```css
@import '@for-humans/tokens/src/base.css';
@import '@for-humans/tokens/src/themes/dsa.css';
@import '@for-humans/tokens/src/themes/system-design.css';
@import '@for-humans/tokens/src/themes/fullstack.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
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
```

- [ ] **Step 3: Replace `app/page.tsx` with a redirect**

```tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/dsa');
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/mental-systems/app/layout.tsx apps/mental-systems/app/globals.css apps/mental-systems/app/page.tsx
git commit -m "feat: unified MentalSystems root layout with nav and redirect"
```

---

## Task 8: Move DSA routes under /dsa/ and create DSA layout

**Files:**
- Create: `apps/mental-systems/app/dsa/layout.tsx`
- Move: all route dirs from `app/` → `app/dsa/` (path, problems, fundamentals, api)

The current `app/page.tsx` content (DSA home) moves to `app/dsa/page.tsx`. The current `app/layout.tsx` was already replaced in Task 7.

- [ ] **Step 1: Create the `app/dsa/` directory and move existing route folders**

```bash
cd apps/mental-systems
mkdir -p app/dsa
# Move DSA route directories into app/dsa/
mv app/path app/dsa/path
mv app/problems app/dsa/problems
mv app/fundamentals app/dsa/fundamentals
# Move DSA api directory if present
[ -d app/api ] && mv app/api app/dsa/api
```

- [ ] **Step 2: The current `app/page.tsx` is already the DSA homepage — move it**

```bash
mv apps/mental-systems/app/page.tsx apps/mental-systems/app/dsa/page.tsx
```

Note: The redirect page created in Task 7 should have been written to `app/page.tsx` after this move. Re-create it:

```bash
cat > apps/mental-systems/app/page.tsx << 'EOF'
import { redirect } from 'next/navigation';
export default function RootPage() { redirect('/dsa'); }
EOF
```

- [ ] **Step 3: Create `app/dsa/layout.tsx`**

```tsx
import { AppTheme } from '@/components/AppTheme';

export default function DsaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppTheme app="dsa" />
      {children}
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/mental-systems/app/
git commit -m "feat: move DSA routes under /dsa/ with AppTheme layout"
```

---

## Task 9: Namespace DSA lib files and update imports

**Files:**
- Move: `apps/mental-systems/lib/*.ts` → `apps/mental-systems/lib/dsa/`
- Modify: all files in `apps/mental-systems/app/dsa/` (update `@/lib/X` → `@/lib/dsa/X`)

- [ ] **Step 1: Create `lib/dsa/` and move all lib files**

```bash
cd apps/mental-systems
mkdir -p lib/dsa
mv lib/journey.ts lib/dsa/journey.ts
mv lib/content.ts lib/dsa/content.ts
mv lib/fundamentals.ts lib/dsa/fundamentals.ts
mv lib/headings.ts lib/dsa/headings.ts
mv lib/homepage-data.tsx lib/dsa/homepage-data.tsx
mv lib/types.ts lib/dsa/types.ts
```

- [ ] **Step 2: Update all `@/lib/` imports in DSA route and component files**

```bash
cd apps/mental-systems
# Update imports in app/dsa/ and components/
find app/dsa components -type f \( -name "*.ts" -o -name "*.tsx" \) | xargs sed -i '' \
  -e "s|from '@/lib/journey'|from '@/lib/dsa/journey'|g" \
  -e "s|from '@/lib/content'|from '@/lib/dsa/content'|g" \
  -e "s|from '@/lib/fundamentals'|from '@/lib/dsa/fundamentals'|g" \
  -e "s|from '@/lib/headings'|from '@/lib/dsa/headings'|g" \
  -e "s|from '@/lib/homepage-data'|from '@/lib/dsa/homepage-data'|g" \
  -e "s|from '@/lib/types'|from '@/lib/dsa/types'|g"
```

- [ ] **Step 3: Verify no remaining `@/lib/` references outside of namespaced paths**

```bash
grep -r "from '@/lib/journey'\|from '@/lib/content'\|from '@/lib/fundamentals'\|from '@/lib/types'" apps/mental-systems/app/dsa apps/mental-systems/components 2>/dev/null
```

Expected: no output.

- [ ] **Step 4: Update internal navigation links within DSA routes**

DSA routes have `href="/path"` links that must become `href="/dsa/path"`:

```bash
cd apps/mental-systems
find app/dsa components -type f \( -name "*.tsx" -o -name "*.ts" \) | xargs sed -i '' \
  -e "s|href=\"/path\"|href=\"/dsa/path\"|g" \
  -e "s|href=\"/problems\"|href=\"/dsa/problems\"|g" \
  -e "s|href=\"/fundamentals\"|href=\"/dsa/fundamentals\"|g" \
  -e "s|href='/path'|href='/dsa/path'|g" \
  -e "s|href='/problems'|href='/dsa/problems'|g" \
  -e "s|href='/fundamentals'|href='/dsa/fundamentals'|g"
```

- [ ] **Step 5: Commit**

```bash
git add apps/mental-systems/lib/ apps/mental-systems/app/dsa/ apps/mental-systems/components/
git commit -m "feat: namespace DSA lib files and update all imports"
```

---

## Task 10: Move DSA components into components/dsa/

**Files:**
- Move: `apps/mental-systems/components/*.tsx` (DSA-specific) → `apps/mental-systems/components/dsa/`
- Keep: `apps/mental-systems/components/AppTheme.tsx` at root level

- [ ] **Step 1: Create `components/dsa/` and move DSA-specific components**

```bash
cd apps/mental-systems
mkdir -p components/dsa
# Move all DSA-specific component files (exclude AppTheme which is shared)
mv components/AppIcon.tsx components/dsa/AppIcon.tsx
mv components/ArrayTrace.tsx components/dsa/ArrayTrace.tsx
mv components/HashMapTrace.tsx components/dsa/HashMapTrace.tsx
mv components/JourneyNav.tsx components/dsa/JourneyNav.tsx
mv components/LinkedListTrace.tsx components/dsa/LinkedListTrace.tsx
mv components/MarkdownRenderer.tsx components/dsa/MarkdownRenderer.tsx
mv components/PrefixSuffixTrace.tsx components/dsa/PrefixSuffixTrace.tsx
mv components/TraceLabel.tsx components/dsa/TraceLabel.tsx
mv components/TwoPointerTrace.tsx components/dsa/TwoPointerTrace.tsx
mv components/WebContainerEmbed.tsx components/dsa/WebContainerEmbed.tsx
# homepage subdirectory
mv components/homepage components/dsa/homepage
```

- [ ] **Step 2: Update imports that reference these components in DSA routes**

```bash
cd apps/mental-systems
find app/dsa -type f \( -name "*.tsx" -o -name "*.ts" \) | xargs sed -i '' \
  -e "s|from '@/components/AppIcon'|from '@/components/dsa/AppIcon'|g" \
  -e "s|from '@/components/ArrayTrace'|from '@/components/dsa/ArrayTrace'|g" \
  -e "s|from '@/components/HashMapTrace'|from '@/components/dsa/HashMapTrace'|g" \
  -e "s|from '@/components/JourneyNav'|from '@/components/dsa/JourneyNav'|g" \
  -e "s|from '@/components/LinkedListTrace'|from '@/components/dsa/LinkedListTrace'|g" \
  -e "s|from '@/components/MarkdownRenderer'|from '@/components/dsa/MarkdownRenderer'|g" \
  -e "s|from '@/components/PrefixSuffixTrace'|from '@/components/dsa/PrefixSuffixTrace'|g" \
  -e "s|from '@/components/TraceLabel'|from '@/components/dsa/TraceLabel'|g" \
  -e "s|from '@/components/TwoPointerTrace'|from '@/components/dsa/TwoPointerTrace'|g" \
  -e "s|from '@/components/WebContainerEmbed'|from '@/components/dsa/WebContainerEmbed'|g" \
  -e "s|from '@/components/homepage/|from '@/components/dsa/homepage/|g"
```

- [ ] **Step 3: Verify DSA build compiles without errors**

```bash
pnpm --filter mental-systems build 2>&1 | tail -20
```

Expected: Build succeeds (or only shows pre-existing type errors — the app had `typescript: { ignoreBuildErrors: true }` in `next.config.mjs`).

- [ ] **Step 4: Commit**

```bash
git add apps/mental-systems/components/
git commit -m "feat: move DSA components to components/dsa/ namespace"
```

---

## Task 11: Migrate system-design routes into /system-design/

**Files:**
- Copy: `apps/system-design-for-humans/app/**` → `apps/mental-systems/app/system-design/`
- Create: `apps/mental-systems/app/system-design/layout.tsx`
- Create: `apps/mental-systems/components/system-design/` (from SD components)
- Create: `apps/mental-systems/lib/system-design/` (from SD lib)

- [ ] **Step 1: Copy SD app routes**

```bash
cp -r apps/system-design-for-humans/app/path apps/mental-systems/app/system-design/path
cp -r apps/system-design-for-humans/app/scenarios apps/mental-systems/app/system-design/scenarios
cp -r apps/system-design-for-humans/app/fundamentals apps/mental-systems/app/system-design/fundamentals
cp -r apps/system-design-for-humans/app/settings apps/mental-systems/app/system-design/settings
# Copy SD home page
cp apps/system-design-for-humans/app/page.tsx apps/mental-systems/app/system-design/page.tsx
```

- [ ] **Step 2: Copy SD lib files into `lib/system-design/`**

```bash
mkdir -p apps/mental-systems/lib/system-design
cp apps/system-design-for-humans/lib/journey.ts apps/mental-systems/lib/system-design/journey.ts
cp apps/system-design-for-humans/lib/content.ts apps/mental-systems/lib/system-design/content.ts
cp apps/system-design-for-humans/lib/fundamentals.ts apps/mental-systems/lib/system-design/fundamentals.ts
cp apps/system-design-for-humans/lib/headings.ts apps/mental-systems/lib/system-design/headings.ts
cp apps/system-design-for-humans/lib/types.ts apps/mental-systems/lib/system-design/types.ts
cp apps/system-design-for-humans/lib/apiKey.ts apps/mental-systems/lib/system-design/apiKey.ts
cp apps/system-design-for-humans/lib/chat.ts apps/mental-systems/lib/system-design/chat.ts
```

- [ ] **Step 3: Copy SD components into `components/system-design/`**

```bash
mkdir -p apps/mental-systems/components/system-design
cp apps/system-design-for-humans/components/ChatSidebar.tsx apps/mental-systems/components/system-design/ChatSidebar.tsx
cp apps/system-design-for-humans/components/Evaluator.tsx apps/mental-systems/components/system-design/Evaluator.tsx
cp apps/system-design-for-humans/components/MarkdownRenderer.tsx apps/mental-systems/components/system-design/MarkdownRenderer.tsx
```

- [ ] **Step 4: Copy SD content docs**

```bash
[ -d apps/system-design-for-humans/docs ] && cp -r apps/system-design-for-humans/docs apps/mental-systems/docs/system-design
```

- [ ] **Step 5: Create `app/system-design/layout.tsx`**

```tsx
import { AppTheme } from '@/components/AppTheme';

export default function SystemDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppTheme app="system-design" />
      {children}
    </>
  );
}
```

- [ ] **Step 6: Update all imports in system-design route files**

```bash
cd apps/mental-systems
find app/system-design components/system-design lib/system-design -type f \( -name "*.ts" -o -name "*.tsx" \) | xargs sed -i '' \
  -e "s|from '@/lib/journey'|from '@/lib/system-design/journey'|g" \
  -e "s|from '@/lib/content'|from '@/lib/system-design/content'|g" \
  -e "s|from '@/lib/fundamentals'|from '@/lib/system-design/fundamentals'|g" \
  -e "s|from '@/lib/headings'|from '@/lib/system-design/headings'|g" \
  -e "s|from '@/lib/types'|from '@/lib/system-design/types'|g" \
  -e "s|from '@/lib/apiKey'|from '@/lib/system-design/apiKey'|g" \
  -e "s|from '@/lib/chat'|from '@/lib/system-design/chat'|g" \
  -e "s|from '@/components/ChatSidebar'|from '@/components/system-design/ChatSidebar'|g" \
  -e "s|from '@/components/Evaluator'|from '@/components/system-design/Evaluator'|g" \
  -e "s|from '@/components/MarkdownRenderer'|from '@/components/system-design/MarkdownRenderer'|g"
```

- [ ] **Step 7: Update internal navigation links within system-design routes**

```bash
cd apps/mental-systems
find app/system-design components/system-design -type f \( -name "*.tsx" -o -name "*.ts" \) | xargs sed -i '' \
  -e "s|href=\"/path\"|href=\"/system-design/path\"|g" \
  -e "s|href=\"/scenarios\"|href=\"/system-design/scenarios\"|g" \
  -e "s|href=\"/fundamentals\"|href=\"/system-design/fundamentals\"|g" \
  -e "s|href=\"/settings\"|href=\"/system-design/settings\"|g" \
  -e "s|href='/path'|href='/system-design/path'|g" \
  -e "s|href='/scenarios'|href='/system-design/scenarios'|g" \
  -e "s|href='/fundamentals'|href='/system-design/fundamentals'|g" \
  -e "s|href='/settings'|href='/system-design/settings'|g"
```

- [ ] **Step 8: Copy SD content data files (app/scenarios, app/fundamentals markdown)**

The SD app's `app/scenarios/` and `app/fundamentals/` directories contain markdown content files in addition to route files. The `cp -r` in Step 1 already captured these. Verify:

```bash
ls apps/mental-systems/app/system-design/scenarios/ | head -5
```

Expected: scenario directories (e.g. `design-url-shortener/`, etc.) present.

- [ ] **Step 9: Commit**

```bash
git add apps/mental-systems/app/system-design/ apps/mental-systems/lib/system-design/ apps/mental-systems/components/system-design/
git commit -m "feat: migrate system-design app into /system-design/ routes"
```

---

## Task 12: Migrate fullstack routes into /fullstack/

**Files:**
- Copy: `apps/fullstack-design-for-humans/app/**` → `apps/mental-systems/app/fullstack/`
- Create: `apps/mental-systems/app/fullstack/layout.tsx`
- Create: `apps/mental-systems/components/fullstack/`
- Create: `apps/mental-systems/lib/fullstack/`

- [ ] **Step 1: Copy fullstack app routes**

```bash
cp -r apps/fullstack-design-for-humans/app/path apps/mental-systems/app/fullstack/path
cp -r apps/fullstack-design-for-humans/app/scenarios apps/mental-systems/app/fullstack/scenarios
cp -r apps/fullstack-design-for-humans/app/fundamentals apps/mental-systems/app/fullstack/fundamentals
cp -r apps/fullstack-design-for-humans/app/settings apps/mental-systems/app/fullstack/settings
cp -r apps/fullstack-design-for-humans/app/api apps/mental-systems/app/fullstack/api
cp apps/fullstack-design-for-humans/app/page.tsx apps/mental-systems/app/fullstack/page.tsx
```

- [ ] **Step 2: Copy fullstack lib files into `lib/fullstack/`**

```bash
mkdir -p apps/mental-systems/lib/fullstack
cp apps/fullstack-design-for-humans/lib/journey.ts apps/mental-systems/lib/fullstack/journey.ts
cp apps/fullstack-design-for-humans/lib/content.ts apps/mental-systems/lib/fullstack/content.ts
cp apps/fullstack-design-for-humans/lib/fundamentals.ts apps/mental-systems/lib/fullstack/fundamentals.ts
cp apps/fullstack-design-for-humans/lib/headings.ts apps/mental-systems/lib/fullstack/headings.ts
cp apps/fullstack-design-for-humans/lib/types.ts apps/mental-systems/lib/fullstack/types.ts
cp apps/fullstack-design-for-humans/lib/apiKey.ts apps/mental-systems/lib/fullstack/apiKey.ts
cp apps/fullstack-design-for-humans/lib/chat.ts apps/mental-systems/lib/fullstack/chat.ts
cp apps/fullstack-design-for-humans/lib/checkWork.ts apps/mental-systems/lib/fullstack/checkWork.ts
cp apps/fullstack-design-for-humans/lib/projectPath.ts apps/mental-systems/lib/fullstack/projectPath.ts
```

- [ ] **Step 3: Copy fullstack components into `components/fullstack/`**

```bash
mkdir -p apps/mental-systems/components/fullstack
cp apps/fullstack-design-for-humans/components/ChatSidebar.tsx apps/mental-systems/components/fullstack/ChatSidebar.tsx
cp apps/fullstack-design-for-humans/components/CheckWork.tsx apps/mental-systems/components/fullstack/CheckWork.tsx
cp apps/fullstack-design-for-humans/components/Evaluator.tsx apps/mental-systems/components/fullstack/Evaluator.tsx
cp apps/fullstack-design-for-humans/components/MarkdownRenderer.tsx apps/mental-systems/components/fullstack/MarkdownRenderer.tsx
```

- [ ] **Step 4: Copy fullstack tests into `__tests__/fullstack/`**

```bash
mkdir -p apps/mental-systems/__tests__/fullstack
cp apps/fullstack-design-for-humans/__tests__/lib/checkWork.test.ts apps/mental-systems/__tests__/fullstack/checkWork.test.ts
cp apps/fullstack-design-for-humans/__tests__/lib/projectPath.test.ts apps/mental-systems/__tests__/fullstack/projectPath.test.ts
```

- [ ] **Step 5: Create `app/fullstack/layout.tsx`**

```tsx
import { AppTheme } from '@/components/AppTheme';

export default function FullstackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppTheme app="fullstack" />
      {children}
    </>
  );
}
```

- [ ] **Step 6: Update all imports in fullstack route files**

```bash
cd apps/mental-systems
find app/fullstack components/fullstack lib/fullstack -type f \( -name "*.ts" -o -name "*.tsx" \) | xargs sed -i '' \
  -e "s|from '@/lib/journey'|from '@/lib/fullstack/journey'|g" \
  -e "s|from '@/lib/content'|from '@/lib/fullstack/content'|g" \
  -e "s|from '@/lib/fundamentals'|from '@/lib/fullstack/fundamentals'|g" \
  -e "s|from '@/lib/headings'|from '@/lib/fullstack/headings'|g" \
  -e "s|from '@/lib/types'|from '@/lib/fullstack/types'|g" \
  -e "s|from '@/lib/apiKey'|from '@/lib/fullstack/apiKey'|g" \
  -e "s|from '@/lib/chat'|from '@/lib/fullstack/chat'|g" \
  -e "s|from '@/lib/checkWork'|from '@/lib/fullstack/checkWork'|g" \
  -e "s|from '@/lib/projectPath'|from '@/lib/fullstack/projectPath'|g" \
  -e "s|from '@/components/ChatSidebar'|from '@/components/fullstack/ChatSidebar'|g" \
  -e "s|from '@/components/CheckWork'|from '@/components/fullstack/CheckWork'|g" \
  -e "s|from '@/components/Evaluator'|from '@/components/fullstack/Evaluator'|g" \
  -e "s|from '@/components/MarkdownRenderer'|from '@/components/fullstack/MarkdownRenderer'|g"
```

Also update the test files:

```bash
cd apps/mental-systems
find __tests__/fullstack -type f \( -name "*.ts" -o -name "*.tsx" \) | xargs sed -i '' \
  -e "s|from '../../lib/checkWork'|from '@/lib/fullstack/checkWork'|g" \
  -e "s|from '../../lib/projectPath'|from '@/lib/fullstack/projectPath'|g"
```

- [ ] **Step 7: Update internal navigation links within fullstack routes**

```bash
cd apps/mental-systems
find app/fullstack components/fullstack -type f \( -name "*.tsx" -o -name "*.ts" \) | xargs sed -i '' \
  -e "s|href=\"/path\"|href=\"/fullstack/path\"|g" \
  -e "s|href=\"/scenarios\"|href=\"/fullstack/scenarios\"|g" \
  -e "s|href=\"/fundamentals\"|href=\"/fullstack/fundamentals\"|g" \
  -e "s|href=\"/settings\"|href=\"/fullstack/settings\"|g" \
  -e "s|href='/path'|href='/fullstack/path'|g" \
  -e "s|href='/scenarios'|href='/fullstack/scenarios'|g" \
  -e "s|href='/fundamentals'|href='/fullstack/fundamentals'|g" \
  -e "s|href='/settings'|href='/fullstack/settings'|g"
```

- [ ] **Step 8: Commit**

```bash
git add apps/mental-systems/app/fullstack/ apps/mental-systems/lib/fullstack/ apps/mental-systems/components/fullstack/ apps/mental-systems/__tests__/
git commit -m "feat: migrate fullstack app into /fullstack/ routes"
```

---

## Task 13: Update root package.json dev script

**Files:**
- Modify: `package.json` (root)

- [ ] **Step 1: Update root `package.json`**

```json
{
  "name": "for-humans",
  "private": true,
  "packageManager": "pnpm@10.32.1",
  "scripts": {
    "dev": "pnpm --filter mental-systems dev",
    "dev:dsa": "pnpm --filter mental-systems dev",
    "dev:sd": "pnpm --filter system-design-for-humans dev",
    "dev:fs": "pnpm --filter fullstack-design-for-humans dev",
    "build:dsa": "pnpm --filter mental-systems build",
    "build:sd": "pnpm --filter system-design-for-humans build",
    "build": "pnpm --filter mental-systems build"
  }
}
```

Note: `dev:sd` and `dev:fs` still point to old apps while they exist — they'll be removed in Task 14.

- [ ] **Step 2: Verify `pnpm run dev` resolves correctly**

```bash
pnpm run dev --dry-run 2>&1 | head -5
```

Expected: Shows `mental-systems dev` in the command.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add pnpm run dev command targeting mental-systems"
```

---

## Task 14: Smoke test all three sections

Before deleting old apps, verify the unified app works.

- [ ] **Step 1: Start the dev server**

```bash
pnpm run dev
```

- [ ] **Step 2: Verify each section loads**

Open in browser and confirm:
- `http://localhost:3000/` → redirects to `/dsa`
- `http://localhost:3000/dsa` → DSA home loads with purple accent in nav
- `http://localhost:3000/dsa/path` → DSA path page loads
- `http://localhost:3000/system-design` → SD home loads with navy accent in nav
- `http://localhost:3000/system-design/path` → SD path page loads
- `http://localhost:3000/fullstack` → Fullstack home loads with teal accent in nav
- `http://localhost:3000/fullstack/path` → Fullstack path page loads
- Nav active link underline changes color when switching sections

- [ ] **Step 3: Run jest tests**

```bash
pnpm --filter mental-systems test
```

Expected: all tests pass (fullstack's checkWork and projectPath tests).

---

## Task 15: Delete old apps and clean up root scripts

Only do this after Task 14 passes.

**Files:**
- Delete: `apps/dsa-for-humans/` (already renamed in Task 1 — should be gone)
- Delete: `apps/system-design-for-humans/`
- Delete: `apps/fullstack-design-for-humans/`
- Modify: `package.json` (root) — remove old per-app scripts

- [ ] **Step 1: Verify old apps are no longer needed**

Confirm the mental-systems app is running correctly (Task 14 complete).

- [ ] **Step 2: Delete old app directories**

```bash
rm -rf apps/system-design-for-humans
rm -rf apps/fullstack-design-for-humans
```

(`apps/dsa-for-humans` was renamed in Task 1 — if still present, remove it: `rm -rf apps/dsa-for-humans`)

- [ ] **Step 3: Update root `package.json` — remove dead scripts**

```json
{
  "name": "for-humans",
  "private": true,
  "packageManager": "pnpm@10.32.1",
  "scripts": {
    "dev": "pnpm --filter mental-systems dev",
    "build": "pnpm --filter mental-systems build"
  }
}
```

- [ ] **Step 4: Reinstall to clean lockfile**

```bash
pnpm install
```

- [ ] **Step 5: Final build verification**

```bash
pnpm build
```

Expected: Build completes without errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: remove old app directories, finalize MentalSystems migration"
```

---

## Self-Review Notes

- **Spec coverage:** All decisions from the spec are addressed: single app ✓, inline nav ✓, subtle theming via `--active-phase-color` ✓, Newsreader + Plus Jakarta ✓, `/` redirect ✓, `/dsa /system-design /fullstack` routes ✓, merged deps ✓, old apps deleted ✓.
- **DSA `app/dsa/page.tsx`**: The move in Task 8 has two steps (move the old page, then recreate the redirect). Order matters — do Step 3 before Step 2 in Task 8 is not an issue since the redirect was already created in Task 7 step 3. The file move in Task 8 step 2 replaces the redirect — recreate it as noted.
- **`isActivePath` edge case**: `pathname.startsWith(href + '/')` with the `/` suffix prevents `/dsa-extra` matching `/dsa`. The trailing slash handles it. Verified in Task 5 step 5.
- **CSS flash**: DSA's `:root` vars remain as the default fallback since `dsa.css` keeps `:root`. No flash on initial load.
- **Fullstack API route**: `app/api/check-work/` moves to `app/fullstack/api/check-work/` in Task 12 step 1 — covered.
- **Test import paths**: Fullstack tests use relative imports (`../../lib/checkWork`) that need updating — covered in Task 12 step 6.
