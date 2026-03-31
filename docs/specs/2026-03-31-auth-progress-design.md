# Auth & Progress Tracking — Design Spec

**Date:** 2026-03-31
**Status:** Approved

## Overview

Add Supabase-backed authentication and per-user progress tracking to the MentalSystems platform. Users sign in via GitHub or Google OAuth and can mark problems, steps, and sections as complete across all three learning tracks (DSA, system design, fullstack). Progress is private — no public profiles.

---

## Auth & Session

**Provider:** Supabase Auth with GitHub and Google OAuth.

**Session management:** `@supabase/ssr` handles cookie-based session storage for the Next.js 14 App Router. A `middleware.ts` file intercepts every request, refreshes the Supabase session, and makes it available to server components via `createServerClient`.

**Login flow:**
- Unauthenticated users hitting a protected route are redirected to `/login`.
- `/login` renders GitHub and Google OAuth buttons.
- After OAuth callback, Supabase handles the token exchange and sets session cookies.
- User is redirected back to the originating page (or `/dsa/path` as default).

**Nav integration:** When logged out, the nav shows a "Sign in" link. When logged in, it shows the user's OAuth avatar and a sign-out option. No progress counts in the nav.

**Protected routes:** The path pages and problem pages require authentication. The login page and any public/static pages remain open.

---

## Database Schema

Single `progress` table in Supabase Postgres:

```sql
create table progress (
  user_id       uuid        references auth.users on delete cascade,
  item_type     text        not null,  -- 'problem' | 'step' | 'section'
  item_id       text        not null,  -- prefixed with track (see below)
  completed_at  timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);

alter table progress enable row level security;

create policy "users can manage their own progress"
  on progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

**Item ID conventions** (prefixed by track to prevent collisions):

| Track | Item type | Example item_id |
|-------|-----------|----------------|
| DSA | problem | `dsa-001` |
| DSA | step | `dsa-001-step-1` |
| DSA | section | `dsa-section-arrays-strings` |
| System Design | problem/scenario | `sd-design-url-shortener` |
| System Design | step | `sd-design-url-shortener-step-1` |
| System Design | section | `sd-section-scalability` |
| Fullstack | problem/scenario | `fs-build-auth-system` |
| Fullstack | step | `fs-build-auth-system-step-1` |
| Fullstack | section | `fs-section-rails-basics` |

RLS enforces that users can only read and write their own rows — no additional server-side auth checks needed for progress queries.

---

## Data Flow

**Reads (server-side):**
Path pages and problem pages are server components. On render, they fetch the current user's completed item IDs from Supabase and pass them as props to client components. No loading spinners — progress state is baked into the initial HTML.

```
Request → middleware (session refresh) → server component → Supabase query → render with progress
```

**Writes (Server Action):**
A single Server Action `toggleProgress(itemType, itemId)` handles all progress writes:
- If the row exists → delete it (mark incomplete).
- If the row doesn't exist → insert it (mark complete).

The UI applies **optimistic updates**: the checkbox flips immediately and rolls back on failure.

No dedicated API routes. The Server Action is the only write path.

---

## UI Integration

### Path pages (`/dsa/path`, `/system-design/path`, `/fullstack/path`)

- Each **problem link** shows a small checkmark icon when `item_type='problem'` and the problem's item_id is in the user's completed set.
- Each **section header** shows a completion fraction (`3/7`) counting completed first-pass problems in that section.
- Each **section** has a manual "mark section complete" toggle, independent of individual problems.

### Problem pages

- Each **step** has a "Mark complete" toggle (`item_type='step'`).
- The **problem** itself has a top-level completion toggle (`item_type='problem'`).

### Login page (`/login`)

- Minimal page with GitHub and Google OAuth buttons.
- On success, redirect to the return URL (stored in a query param before redirect) or `/dsa/path`.

---

## Out of Scope

- Public user profiles or leaderboards.
- Email/password auth.
- Progress sharing or export.
- Streaks, XP, or gamification.
- Admin views of user data.
