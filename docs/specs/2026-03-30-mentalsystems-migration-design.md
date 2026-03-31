# MentalSystems Migration Design

**Date:** 2026-03-30  
**Status:** Approved

## Overview

Migrate the three independent Next.js apps (`dsa-for-humans`, `system-design-for-humans`, `fullstack-design-for-humans`) into a single unified Next.js app called `mental-systems`. The platform is renamed MentalSystems. The repo will be renamed separately.

## Goals

- Single app, single `pnpm run dev`, single domain
- Unified navigation across all three learning tools
- Per-app color theming preserved via CSS scoping
- Content migrated as-is — no redesign of existing pages
- Foundation for a future `/dashboard` page

## Decisions

| Decision | Choice |
|---|---|
| Structure | Single Next.js app (flat, no route groups) |
| Nav model | Inline links — DSA, System Design, Fullstack |
| Nav theming | Subtle — active link underline + scrolled backdrop tint via `--active-phase-color` |
| Fonts | Newsreader (display) + Plus Jakarta Sans (body) platform-wide |
| Homepage | `/` redirects to `/dsa` |
| URL structure | `/dsa/...`, `/system-design/...`, `/fullstack/...` |
| Base app | Repurpose `apps/dsa-for-humans` (fonts already correct) |

## App Structure

```
apps/mental-systems/
  app/
    layout.tsx              ← root layout: unified SiteHeader, Newsreader + Plus Jakarta, no data-app
    page.tsx                ← redirect to /dsa
    dsa/
      layout.tsx            ← sets data-app="dsa" on <html>, imports dsa.css
      page.tsx
      path/
      problems/
      fundamentals/
      api/
    system-design/
      layout.tsx            ← sets data-app="system-design" on <html>, imports system-design.css
      page.tsx
      path/
      scenarios/
      fundamentals/
      settings/
      api/
    fullstack/
      layout.tsx            ← sets data-app="fullstack" on <html>, imports fullstack.css
      page.tsx
      path/
      scenarios/
      fundamentals/
      settings/
      api/
  components/               ← merge all three apps' components, namespace by app where needed
  lib/                      ← merge all three apps' lib files, namespace by app where needed
  docs/                     ← merge content docs
```

## Theme Scoping

Each section layout sets `data-app` on `<html>` via a small client component (`AppTheme`). CSS in `@for-humans/tokens` is scoped to the attribute selector.

```tsx
// apps/mental-systems/app/dsa/layout.tsx
import { AppTheme } from '@/components/AppTheme'
import 'path/to/dsa.css'

export default function DsaLayout({ children }) {
  return <>
    <AppTheme app="dsa" />
    {children}
  </>
}
```

```tsx
// components/AppTheme.tsx
'use client'
import { useEffect } from 'react'
export function AppTheme({ app }: { app: string }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-app', app)
    return () => document.documentElement.removeAttribute('data-app')
  }, [app])
  return null
}
```

```css
/* packages/tokens/src/themes/dsa.css */
[data-app="dsa"] {
  --active-phase-color: var(--purple);
  --bg: #fafaff;
  /* ... rest of existing dsa.css vars */
}
[data-app="dsa"].dark {
  --bg: #28262b;
  /* ... */
}
```

A `fullstack.css` theme file needs to be created in `@for-humans/tokens`. Fullstack currently uses the system-design theme implicitly — a dedicated palette should be defined.

## Navigation

Root `layout.tsx` renders `SiteHeader` with three nav links:

```tsx
<SiteHeader
  title="MentalSystems"
  homeHref="/dsa"
  navLinks={[
    { href: '/dsa', label: 'DSA' },
    { href: '/system-design', label: 'System Design' },
    { href: '/fullstack', label: 'Fullstack' },
  ]}
/>
```

`SiteHeader` needs active-link detection: compare each `href` against `usePathname()` using `pathname.startsWith(href)`. Active link renders with `color: var(--active-phase-color)` and a matching underline. This replaces the current static title display.

## Packages

### `@for-humans/ui`
- `SiteHeader`: add `usePathname()`-based active link detection. Active link style: `color: var(--active-phase-color)`, `borderBottom: 2px solid var(--active-phase-color)`.

### `@for-humans/tokens`
- Scope `dsa.css` vars under `[data-app="dsa"]` and `[data-app="dsa"].dark`
- Scope `system-design.css` vars under `[data-app="system-design"]` and `[data-app="system-design"].dark`
- Add `fullstack.css` with a new palette scoped to `[data-app="fullstack"]`

### `globals.css`
The unified app has a single `app/globals.css` that imports only `base.css` from `@for-humans/tokens`. Per-app theme CSS (`dsa.css`, `system-design.css`, `fullstack.css`) is imported in each section's `layout.tsx` — not in `globals.css`. This ensures theme vars are only active when the matching `data-app` attribute is present.

### Old apps
- `apps/dsa-for-humans` — renamed to `apps/mental-systems`; becomes the unified app
- `apps/system-design-for-humans` — deleted after content migration
- `apps/fullstack-design-for-humans` — deleted after content migration

## Dev Commands

Root `package.json` gets a primary `dev` script:

```json
"dev": "pnpm --filter mental-systems dev"
```

Existing per-app dev scripts remain for isolated work during migration.

## Content Migration

Content is moved as-is — no page redesigns. Each app's `app/`, `components/`, `lib/`, and `docs/` are copied into the unified app under their respective namespace paths. Conflicting filenames (e.g. `lib/journey.ts` exists in all three) are resolved by prefixing: `lib/dsa/journey.ts`, `lib/system-design/journey.ts`, `lib/fullstack/journey.ts`.

## Out of Scope

- Redesign of any existing page content
- `/dashboard` page (future work — will be its own design)
- Deployment / domain configuration
