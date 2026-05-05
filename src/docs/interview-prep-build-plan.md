# Interview Prep Track — Build Plan

This document is the canonical reference for building the `interview-prep` track. Any agent picking up this work should read this file first, then `STANDARDS.md` at `thinkdeep-agents/skills/STANDARDS.md`.

The track is a single project-progressive curriculum: 8 lessons that build one application from scratch. Unlike fundamentals guides (isolated concept drills) or standalone problems (one mechanism per package), each lesson here advances the same codebase. The learner exits with a working project and the vocabulary to walk through it in an interview.

---

## Project Context

The simulated project is a **Plant Floor Monitor** — a dashboard that fetches device and tag status from a mock REST API. The domain is chosen to match the kind of frontend work an automations company will test: status dashboards, device lists, alarm indicators, real-time-ish data. The REST API is mocked with static JSON (no backend required).

Never mention the company by name in any content. Use "an automations company" or "this domain" when framing is needed.

---

## App Structure

Mirror the conventions in `src/app/frontend/` and `src/app/fullstack/`. Do not invent new patterns.

### Routes

```
src/app/interview-prep/
  page.tsx                        # landing / track overview
  path/page.tsx                   # curriculum map with lesson progress
  lessons/
    [slug]/page.tsx               # individual lesson renderer
```

The `[slug]` route reads a lesson markdown file from `src/app/interview-prep/lessons/{slug}/`.

### Lib Files

```
src/lib/interview-prep/
  journey.ts                      # lesson definitions (Phase[] shape)
  lessons.ts                      # content loader (reads lesson markdown)
  types.ts                        # InterviewPrepLesson, Phase types
```

Mirror `src/lib/frontend/journey.ts` for the `journey.ts` shape. Mirror `src/lib/frontend/fundamentals.ts` for the `lessons.ts` loader shape.

### Content Directories

```
src/app/interview-prep/lessons/{slug}/
  lesson.md                       # full lesson content
  prompt.md                       # Socratic evaluator prompt for this lesson
```

Two files per lesson. No exercise files — the project code lives outside the content directory (see below).

### Project Codebase

The "Plant Floor Monitor" project code is embedded directly in `lesson.md` as copy-paste blocks. The learner builds it incrementally. There is no separate project scaffold in the repo. Each lesson's code section shows only the additions for that lesson, plus a "full file state after this lesson" block for the affected files.

---

## Journey Shape

The track has one phase with 8 lessons. Use the same `Phase[]` shape as `src/lib/frontend/journey.ts`, but adapted for this track.

```ts
// src/lib/interview-prep/types.ts

export interface InterviewPrepLesson {
  id: string;                     // stable route key, matches folder name
  slug: string;                   // same as id
  label: string;
  mentalModelHook: string;        // one sentence — the core insight of the lesson
  blurb: string;                  // 1-2 sentences shown on the path page
  conceptFocus: string[];         // skills this lesson exercises
}

export interface Phase {
  number: number;
  label: string;
  goal: string;
  lessons: InterviewPrepLesson[];
}
```

```ts
// src/lib/interview-prep/journey.ts (skeleton — agent fills content)

export const JOURNEY: Phase[] = [
  {
    number: 1,
    label: 'Plant Floor Monitor',
    goal: 'Build a typed React dashboard that consumes a REST API. Exit with code you can walk through in an interview.',
    lessons: [
      {
        id: 'modeling-the-api-contract',
        slug: 'modeling-the-api-contract',
        label: 'Modeling the API Contract',
        mentalModelHook: 'TypeScript interfaces are the contract between what the API sends and what the UI can trust.',
        blurb: 'Define the shape of device and tag payloads before writing any fetch code.',
        conceptFocus: ['TypeScript interfaces', 'API contract design', 'union types', 'readonly'],
      },
      // ... 7 more lessons
    ],
  },
];
```

Progress tracking uses the same Supabase pattern as other tracks. Key the progress rows on `item_type: 'lesson'` and `item_id: lesson.slug`.

---

## Lesson Format

Every `lesson.md` uses this exact structure. Agents must not add, remove, or reorder sections. Apply `STANDARDS.md` to all prose.

```markdown
## Where We Are

One paragraph. State of the project entering this lesson — what files exist, what the UI does so far (or that nothing exists yet for Lesson 1). One sentence naming what this lesson adds.

---

## What We're Building

Two to four sentences. The specific addition: what code goes in, what the user sees or can do after. Concrete — name the component, the hook, the utility, the CSS rule.

---

## The Code

### {filename}

Explanation paragraph (2-4 sentences): why this code is structured this way. Then the code block. For the first lesson this is the full file. For subsequent lessons show only the additions with a comment marking the insertion point, then a collapsed "full file after this lesson" block.

Repeat `### {filename}` for each file touched in this lesson.

---

## Why This Way

Two to four paragraphs. The tradeoff reasoning a senior engineer would articulate. Cover:
- why this approach over the obvious alternative
- what breaks if you skip the pattern (race condition, type unsafety, layout collapse, etc.)
- one concrete "what I have seen go wrong" observation

No bullet lists in this section. Prose only.

---

## How to Explain It

A sample verbal answer in interview register. Two to four sentences. First person. Written as if the learner is speaking to a technical interviewer.

This is not a transcript — it models the register and specificity, not a script to memorize.

---

## Checkpoint

One or two questions the learner should be able to answer cold after this lesson. No answers provided. These become the seed for `prompt.md`.
```

---

## Evaluator Prompt Format

Every `prompt.md` uses this structure. It is a system prompt fed to an AI evaluator.

```markdown
You are evaluating a learner's understanding of {lesson topic}.

## Scope

Ask only about {what this lesson covers}. Redirect if the learner raises topics from later lessons.

## Rubric

A strong answer should:
- [ ] {criterion — specific and verifiable}
- [ ] {criterion}
- [ ] {criterion}
- [ ] {criterion}

## Opening Question

{One Socratic question that opens the evaluation. Should not be answerable by recitation — it should require the learner to reason.}
```

---

## The 8 Lessons

### Lesson 1: Modeling the API Contract

**Slug**: `modeling-the-api-contract`

**Concept focus**: TypeScript interfaces, union types, `readonly`, discriminated unions

**What gets built**: Three TypeScript files defining the API contract — `Device`, `Tag`, and `Alarm` types — plus a mock JSON file that the fetch layer will use. No React, no fetch, no CSS.

**Code files touched**:
- `src/types/api.ts` — Device, Tag, Alarm interfaces
- `src/mocks/devices.json` — 6 mock devices in varied status states
- `src/mocks/tags.json` — 12 tags belonging to the mock devices

**Why this lesson matters**: An interview grader notices immediately whether the candidate types API responses before wiring them to state. This lesson establishes the vocabulary used in every subsequent lesson and forces the learner to read the mock payload before writing a single fetch call.

**Interview angle**: Explain why you typed the API response before writing the fetch, and what the `readonly` modifier costs vs prevents.

**Checkpoint questions**:
- Why is `status: 'online' | 'offline' | 'alarm'` better than `status: string`?
- When would you reach for a discriminated union over a simple interface?

---

### Lesson 2: Writing the Fetch Layer

**Slug**: `writing-the-fetch-layer`

**Concept focus**: `fetch`, `async/await`, `Response.ok`, typed return values, generic fetch wrapper

**What gets built**: `src/api/devices.ts` — a `fetchDevices()` function that returns `Promise<Device[]>`. Includes `Response.ok` check, typed error throw, and the generic `apiFetch<T>()` wrapper it delegates to.

**Code files touched**:
- `src/api/client.ts` — `apiFetch<T>(url: string): Promise<T>` utility
- `src/api/devices.ts` — `fetchDevices()` using `apiFetch`

**Why this lesson matters**: Most candidates write fetch inline in a component. The interview tests whether they separate the fetch layer from the component, type the response at the boundary, and handle non-200 responses explicitly.

**Interview angle**: Explain why `apiFetch<T>` exists, what it prevents, and why `Response.ok` is checked before parsing JSON.

**Checkpoint questions**:
- What does `Response.ok` check that `response.json()` does not?
- Why is the generic on `apiFetch<T>` useful rather than casting the result at the call site?

---

### Lesson 3: Async State in React

**Slug**: `async-state-in-react`

**Concept focus**: `useEffect`, `useState`, loading/error/success state shape, `AbortController`, cleanup

**What gets built**: `src/hooks/useDevices.ts` — a custom hook wrapping `fetchDevices()` with the four-phase async state model: idle, loading, success, error. Includes `AbortController` and cleanup return.

**Code files touched**:
- `src/hooks/useDevices.ts` — the hook
- `src/App.tsx` (or root component) — first render using `useDevices`

**Why this lesson matters**: Race conditions and missing cleanup are the two most common async bugs in React. This lesson installs both patterns before the UI grows complex enough to hide them.

**Interview angle**: Explain what the cleanup function does, what happens without it when a component unmounts mid-fetch, and why the abort signal goes into the fetch options rather than into the state setter.

**Checkpoint questions**:
- What is a race condition in this fetch context and how does `AbortController` prevent it?
- Why does the hook expose `{ data, loading, error }` instead of a single `status` enum?

---

### Lesson 4: Rendering the Data

**Slug**: `rendering-the-data`

**Concept focus**: Component decomposition, props, conditional rendering, typed component props

**What gets built**: Three components — `DeviceList`, `DeviceCard`, `StatusBadge` — rendering the data returned by `useDevices`. Includes typed props, conditional rendering for the loading and error states, and an empty-state message.

**Code files touched**:
- `src/components/DeviceList.tsx`
- `src/components/DeviceCard.tsx`
- `src/components/StatusBadge.tsx`
- `src/App.tsx` — wired to `useDevices` result

**Why this lesson matters**: Component decomposition is evaluated in interviews both by reading the structure and by asking the candidate to explain it. This lesson forces the learner to make and defend a decomposition decision, not just render a list in one big component.

**Interview angle**: Explain why `StatusBadge` is its own component, what that decision costs, and what it enables.

**Checkpoint questions**:
- At what point does a JSX expression earn its own component?
- How does `DeviceCard` stay decoupled from the fetch layer?

---

### Lesson 5: CSS Layout

**Slug**: `css-layout`

**Concept focus**: CSS Grid for dashboard layout, Flexbox within cards, status indicator color tokens, responsive columns

**What gets built**: Stylesheet additions that produce a responsive device grid, a card with a left-aligned status indicator, and color tokens for the three device states. No CSS-in-JS — plain CSS modules or a single stylesheet (match the existing project convention).

**Code files touched**:
- `src/styles/dashboard.css` (or `.module.css`) — grid, card, badge styles
- `src/components/DeviceCard.tsx` — className additions
- `src/components/StatusBadge.tsx` — className additions

**Why this lesson matters**: Many senior engineers can write the JavaScript for this project but reach for a component library the moment layout is needed. This lesson tests whether the learner can produce a working CSS Grid layout and articulate why grid fits this use case over flex.

**Interview angle**: Explain why `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` produces a responsive grid without a media query.

**Checkpoint questions**:
- When does a layout call for Grid versus Flex?
- What is the role of the `minmax()` function in the auto-fill pattern?

---

### Lesson 6: Interactivity

**Slug**: `interactivity`

**Concept focus**: Controlled inputs, derived state, filtering without mutating server data, event handler typing

**What gets built**: A status filter (dropdown) and a name search (text input) that narrow the device list client-side. Derived filtered list is computed from `data` without a second fetch or a copy of the array stored in state.

**Code files touched**:
- `src/components/FilterBar.tsx` — status select + name input
- `src/App.tsx` — filter state, derived filtered list, wired to `DeviceList`

**Why this lesson matters**: The interviewer is checking whether the candidate reaches for `useEffect` to compute derived state — a common mistake. This lesson draws the line between server state (what `useDevices` owns) and UI state (what the component owns) and derives from both without mixing them.

**Interview angle**: Explain why the filtered list is computed inline rather than stored in a separate `useState`, and what would break if you used `useEffect` to sync it instead.

**Checkpoint questions**:
- What is derived state and how is it different from managed state?
- Why is it a mistake to put the filtered list into `useState`?

---

### Lesson 7: Extracting the Hook

**Slug**: `extracting-the-hook`

**Concept focus**: Custom hook extraction, what a hook should own, the hook/component boundary, return shape design

**What gets built**: `useDeviceList.ts` — a hook that encapsulates `useDevices`, filter state, and the derived filtered list. `App.tsx` is simplified to only rendering. The lesson walks through the before/after diff and the decision criteria.

**Code files touched**:
- `src/hooks/useDeviceList.ts` — new hook
- `src/App.tsx` — simplified, now calls `useDeviceList`
- `src/hooks/useDevices.ts` — unchanged, called by `useDeviceList`

**Why this lesson matters**: Custom hook extraction is the highest-signal refactor in a React interview. The question is not just "can you extract a hook" but "do you know when to and what it should own." This lesson forces a deliberate decision, not an automatic refactor.

**Interview angle**: Explain what `useDeviceList` owns versus what it delegates to `useDevices`, and what would be wrong with merging them into one hook.

**Checkpoint questions**:
- What is the rule for when logic belongs in a hook versus in the component?
- What would break if `useDeviceList` also handled the fetch directly instead of calling `useDevices`?

---

### Lesson 8: Polish and Walkthrough

**Slug**: `polish-and-walkthrough`

**Concept focus**: `useMemo` for expensive derivations, ARIA roles for the device list, keyboard accessibility for the filter controls, verbal project walkthrough

**What gets built**: `useMemo` wrapping the filtered list derivation, `role="list"` and `role="listitem"` on the device grid components, `aria-label` on the filter inputs, and a structured verbal walkthrough script for the full project.

**Code files touched**:
- `src/hooks/useDeviceList.ts` — `useMemo` added
- `src/components/DeviceList.tsx` — ARIA roles
- `src/components/FilterBar.tsx` — ARIA labels

**The walkthrough section** (unique to this lesson): A structured script showing how to narrate the full project to an interviewer in under 3 minutes. Covers: what it does, the data contract, the fetch layer, the state model, the component tree, the interactivity, and one tradeoff made deliberately.

**Why this lesson matters**: `useMemo` is widely misused — it should wrap derivations that are genuinely expensive, not ones that feel like they should be. This lesson installs the correct instinct. The walkthrough section is the capstone: the learner should exit able to explain every file, every decision, and at least one alternative they considered.

**Interview angle**: Explain when `useMemo` helps and when it costs more than it saves.

**Checkpoint questions**:
- When does a derived computation earn a `useMemo`?
- What ARIA role makes a visually styled grid readable as a list to a screen reader?

---

## Existing Skills — Where to Use Them

This track does not use the `fe-fundamentals` or `fe-problem` skill families directly. The lesson format is different enough that those skills would produce wrong output shapes.

The following existing skills are still relevant:

| Skill | When to invoke |
|---|---|
| `fe-fundamentals` | If a learner needs a standalone deeper reference for one of the concept areas (e.g., a separate `data-fetching` guide). Do not invoke during lesson generation. |
| `fe-problem` | If isolated drills are added later as supplements to specific lessons. Not part of the initial 8-lesson build. |
| `fullstack-fundamentals` | Reference only — its two-file format (lesson.md + prompt.md) is the model for this track's file shape. |

All prose written by an agent must pass `STANDARDS.md`. Read that file before generating any lesson content.

---

## Execution Order

An agent executing this build plan should follow this sequence exactly.

### Step 1: Platform Scaffold

Work in `thinkdeep`.

1. Create `src/lib/interview-prep/types.ts`
2. Create `src/lib/interview-prep/journey.ts` with all 8 lessons wired
3. Create `src/lib/interview-prep/lessons.ts` — content loader (mirror `src/lib/frontend/fundamentals.ts`)
4. Create `src/app/interview-prep/page.tsx` — track landing (mirror `src/app/frontend/page.tsx`)
5. Create `src/app/interview-prep/path/page.tsx` — curriculum map (mirror `src/app/frontend/path/page.tsx`)
6. Create `src/app/interview-prep/lessons/[slug]/page.tsx` — lesson renderer (mirror `src/app/fullstack/fundamentals/[slug]/page.tsx`)
7. Verify the path page renders with lesson cards and no broken routes

Do not generate lesson content until the scaffold renders cleanly.

### Step 2: Lesson Content — Pass 1 (Lessons 1–4)

Work in `thinkdeep`. For each lesson:

1. Read this file for the lesson spec
2. Read `STANDARDS.md`
3. Read the previous lesson's `lesson.md` to keep the project state continuous
4. Write `lesson.md` and `prompt.md` into `src/app/interview-prep/lessons/{slug}/`
5. Confirm the route resolves before moving to the next lesson

Lessons 1–4 build the functional core. Do not skip to CSS or interactivity until the fetch layer is verified working in the lesson narrative.

### Step 3: Lesson Content — Pass 2 (Lessons 5–8)

Same process. These lessons depend on the code state established in Lessons 1–4. The "Where We Are" section of Lesson 5 must accurately describe the component tree from Lesson 4.

### Step 4: Validate

1. Confirm all 8 `lesson.md` files exist under their slug folders
2. Confirm all 8 `prompt.md` files exist
3. Confirm `journey.ts` wires all 8 lessons
4. Confirm the path page renders progress for each lesson
5. Read the "Where We Are" opening of each lesson against the "What We're Building" closing of the previous lesson — they must describe the same project state

---

## Content Rules

These apply to every agent generating content for this track.

- Do not mention the company name. Use "an automations company" when context is needed.
- All code must be TypeScript. No implicit `any`.
- CSS is plain — no Tailwind, no CSS-in-JS — unless the existing project uses one of those (check before writing).
- The mock API is static JSON. Do not introduce a backend, a library like `msw`, or any runtime server.
- The "How to Explain It" section uses first person and interview register. It models the answer, not a script.
- Follow `STANDARDS.md`: no em dashes, no filler openers, no generic AI prose.
- The project codebase must stay simple enough that a candidate could type all of it from memory in 45 minutes. Resist scope creep in individual lessons.
