# Frontend Track — Build Plan

This document is the canonical reference for building out the frontend (TypeScript & React) track. Any agent picking up this work should read this file first, then the path doc at `src/docs/00-complete-frontend-path.md`.

---

## What We're Building

A new `frontend` track that lives alongside `dsa`, `fullstack`, and `system-design`. Same platform primitives (fundamentals guides + exercise files + journey wiring), but adapted for TypeScript type system depth and React hook mechanics. No browser rendering required — all exercises run through the test runner (`jest` + `ts-jest`, with `@testing-library/react` for hook exercises).

---

## Part 1: Platform Wiring (thinkdeep)

These are the structural changes needed in the main `thinkdeep` repo before any content can be loaded.

### 1.1 App Routes

Create the page scaffold for the frontend section, mirroring the dsa structure:

```
src/app/frontend/
  page.tsx                          # frontend landing / path overview
  path/page.tsx                     # journey map (same as dsa/path)
  fundamentals/
    [slug]/page.tsx                 # fundamentals guide viewer
  problems/
    [id]/page.tsx                   # problem viewer (exercises)
```

Reference: `src/app/dsa/` for the exact page shape to copy.

### 1.2 Journey Definition

Create `src/lib/frontend/journey.ts` with the same `Phase[]` shape as `src/lib/dsa/journey.ts`.

Phases and sections (from `src/docs/00-complete-frontend-path.md`):

```ts
Phase 1: Novice
  sections:
    - generics              (Step 1)  — TypeScript
    - closure-captures      (Step 2)  — React
    - effect-semantics      (Step 3)  — React
    - conditional-types     (Step 4)  — TypeScript
    - dependency-arrays     (Step 5)  — React

Phase 2: Studied
  sections:
    - mapped-types          (Step 6)  — TypeScript
    - ref-vs-state          (Step 7)  — React
    - template-literal-types (Step 8) — TypeScript
    - custom-hook-composition (Step 9) — React
    - branded-types         (Step 10) — TypeScript

Phase 3: Advanced
  sections:
    - usereducer-patterns   (Step 11) — React
    - variance              (Step 12) — TypeScript
    - context-performance   (Step 13) — React
    - concurrent-mode       (Step 14) — React
```

The `JourneySection` interface for the frontend track does not need `firstPass`/`reinforce` problem arrays (no LeetCode IDs). It needs:

```ts
interface FrontendJourneySection {
  id: string;
  label: string;
  mentalModelHook: string;
  fundamentalsSlug: string;
  fundamentalsBlurb: string;
}
```

### 1.3 Content Loader

Create `src/lib/frontend/fundamentals.ts` — same shape as `src/lib/dsa/fundamentals.ts` but reads from `src/app/frontend/fundamentals/{slug}/`.

### 1.4 Content Directory

Fundamentals output path:
```
src/app/frontend/fundamentals/{slug}/
  {slug}-fundamentals.md
  step1-exercise1-problem.ts
  step1-exercise1-solution.ts
  ...
  step3-exercise3-problem.ts
  step3-exercise3-solution.ts
```

No `problems/` directory for now — the fundamentals exercises cover the same ground.

---

## Part 2: Content Skills (thinkdeep-agents)

Two new skill families need to be created in `thinkdeep-agents/skills/`. They mirror `dsa-fundamentals` and `dsa-problem` exactly, adapted for the frontend content domain.

### 2.1 `fe-fundamentals` (orchestrator)

**File**: `skills/fe-fundamentals/SKILL.md`

Owns end-to-end workflow: `fe-fundamentals` → `fe-fundamentals-narrative` → `fe-fundamentals-build` → `fe-fundamentals`

Differences from `dsa-fundamentals`:
- Output path: `src/app/frontend/fundamentals/{slug}/`
- Journey file: `src/lib/frontend/journey.ts`
- No trace components — exercises are pure `.ts` files
- React exercises use `renderHook` from `@testing-library/react`
- TypeScript exercises use `// @ts-expect-error` assertions and `tsc --noEmit` validation
- Still 9 exercise pairs (step1-exercise1 through step3-exercise3)
- Guide markdown has no mermaid trace fences (TypeScript type layouts can use mermaid for structure diagrams only)

### 2.2 `fe-fundamentals-narrative` (phase 1)

**File**: `skills/fe-fundamentals-narrative/SKILL.md`

Produces the teaching half of the guide:

- `## Overview`
- `## Core Concept & Mental Model`
- `## Key Patterns`
- `## Decision Framework`
- Handoff contract for `fe-fundamentals-build`

Domain-specific rules:
- TypeScript sections: the analogy maps language concepts (e.g. "a conditional type is a function at the type level")
- React sections: the analogy maps to a physical/mechanical system (e.g. "a closure is a backpack — it carries the environment where it was zipped up")
- No code blocks in the overview or mental model sections
- Every Key Pattern must include: when to reach for it, what it costs, what it prevents

### 2.3 `fe-fundamentals-build` (phase 2)

**File**: `skills/fe-fundamentals-build/SKILL.md`

Produces the scaffold half:

- `## Building Blocks: Progressive Learning` (3 levels)
- `## Common Gotchas & Edge Cases`
- 9 exercise pairs

Exercise rules (front-end specific):
- Level 1 exercises: reproduce the bug or surprising behavior
- Level 2 exercises: fix the bug or implement the pattern correctly
- Level 3 exercises: compose two patterns or handle the edge case

For TypeScript exercises:
- Use `tsc --noEmit` for validation (not `ts-node` execution)
- Use `// @ts-expect-error` on lines that should be type errors
- Problem files have TODOs at the type level (missing generic, wrong constraint)
- Solution files compile cleanly and the `@ts-expect-error` lines suppress real errors

For React hook exercises:
- Use `renderHook` from `@testing-library/react`
- Problem files have the broken implementation; the test shows the expected behavior
- Solution files make the test pass
- Validation: `npx jest {slug}` exits 0 for all solution files

### 2.4 `fe-validate-fundamentals` (validator)

**File**: `skills/fe-validate-fundamentals/SKILL.md`

Mirrors `dsa-validate-fundamentals`. Checks:

- All 18 exercise files exist
- TypeScript exercises: `tsc --noEmit` exits 0 on all solution files
- React exercises: `jest` exits 0 on all solution files
- Problem files have at least one `TODO` comment or `@ts-expect-error` with a described expectation
- `journey.ts` has `fundamentalsSlug` set for the section

### 2.5 `fe-fix-fundamentals` (fixer)

**File**: `skills/fe-fix-fundamentals/SKILL.md`

Mirrors `dsa-fix-fundamentals`. Patches shallow drift in-place, rebuilds deep failures via `fe-fundamentals`. Same shallow vs deep threshold logic.

---

## Part 3: Build Order

Execute in this sequence. Each step depends on the previous.

### Step A: Platform scaffold (do once)

1. Create `src/lib/frontend/journey.ts` with all 14 sections stubbed (no fundamentalsSlug yet)
2. Create `src/lib/frontend/fundamentals.ts` content loader
3. Create `src/app/frontend/` page scaffold
4. Verify the frontend path page renders (no content yet, just the route)

### Step B: Create skill files in thinkdeep-agents

1. Write `skills/fe-fundamentals-narrative/SKILL.md`
2. Write `skills/fe-fundamentals-build/SKILL.md`
3. Write `skills/fe-fundamentals/SKILL.md`
4. Write `skills/fe-validate-fundamentals/SKILL.md`
5. Write `skills/fe-fix-fundamentals/SKILL.md`
6. Update `thinkdeep-agents/CLAUDE.md` skill table with all five

### Step C: Generate Phase 1 content (Novice)

Run in order — each section's level calibration informs the next:

```
/fe-fundamentals generics
/fe-fundamentals closure-captures
/fe-fundamentals effect-semantics
/fe-fundamentals conditional-types
/fe-fundamentals dependency-arrays
```

### Step D: Generate Phase 2 content (Studied)

```
/fe-fundamentals mapped-types
/fe-fundamentals ref-vs-state
/fe-fundamentals template-literal-types
/fe-fundamentals custom-hook-composition
/fe-fundamentals branded-types
```

### Step E: Generate Phase 3 content (Advanced)

```
/fe-fundamentals usereducer-patterns
/fe-fundamentals variance
/fe-fundamentals context-performance
/fe-fundamentals concurrent-mode
```

### Step F: Validate and fix

```
/fe-validate-fundamentals all
/fe-fix-fundamentals          # only if validation found drift
```

---

## Exercise Format Reference

### TypeScript exercise pair

`step2-exercise1-problem.ts`:
```ts
// Step 2 · Exercise 1: Extract the return type without using ReturnType<T>
// TODO: complete the MyReturnType<T> conditional type

type MyReturnType<T> = unknown; // fix this

// These should compile
type A = MyReturnType<() => string>; // expect: string
type B = MyReturnType<(x: number) => boolean>; // expect: boolean

// This line should be a type error — the result is 'string', not 'number'
// @ts-expect-error
const _test: number = null as MyReturnType<() => string>;
```

`step2-exercise1-solution.ts`:
```ts
// Step 2 · Exercise 1 — Solution

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type A = MyReturnType<() => string>; // string ✓
type B = MyReturnType<(x: number) => boolean>; // boolean ✓

// @ts-expect-error — correct: MyReturnType<() => string> is string, not number
const _test: number = null as MyReturnType<() => string>;
```

### React hook exercise pair

`step2-exercise1-problem.ts`:
```ts
// Step 2 · Exercise 1: Fix the stale closure in useCounter
// The interval always logs 0 instead of the current count.

import { useEffect, useRef, useState } from 'react';

export function useCounter(interval: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // TODO: this is always 0 — why?
      setCount(count + 1); // TODO: fix this without removing the interval
    }, interval);
    return () => clearInterval(id);
  }, [interval]); // TODO: is this dep array correct?

  return count;
}
```

`step2-exercise1-solution.ts`:
```ts
// Step 2 · Exercise 1 — Solution

import { useEffect, useRef, useState } from 'react';

export function useCounter(interval: number) {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  countRef.current = count;

  useEffect(() => {
    const id = setInterval(() => {
      console.log(countRef.current);
      setCount(c => c + 1);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return count;
}
```

---

## Notes for Content Generators

- Target: senior engineers. No "what is a hook" explanations. Start at the mechanism.
- Every exercise should have a sentence in the comment explaining the non-obvious thing it's testing.
- TypeScript exercises: prefer showing the surprising behavior over asking for rote implementation.
- React exercises: prefer "reproduce the bug first, then fix it" over "implement this from scratch."
- The analogy in each guide must persist through all three building-block levels — do not introduce a second analogy.
- Tone: professional and direct. No filler. No cheerleading. Sound like a senior engineer wrote it.
