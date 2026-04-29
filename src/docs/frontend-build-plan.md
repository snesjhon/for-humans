# Frontend Track — Build Plan

This document is the canonical reference for building out the frontend (TypeScript & React) track. Any agent picking up this work should read this file first, then the path doc at `src/docs/00-complete-frontend-path.md`.

---

## What We're Building

A new `frontend` track that lives alongside `dsa`, `fullstack`, and `system-design`. Same platform primitives, but adapted for TypeScript type system depth and React hook mechanics. No browser rendering required — all exercises run through the test runner (`jest` + `ts-jest`, with `@testing-library/react` for hook exercises).

The frontend track now has two distinct content layers:

- fundamentals guides under `src/app/frontend/fundamentals/{slug}/`
- standalone practice problem packages under `src/app/frontend/problems/{id}-{slug}/`

The path doc separates each section into:

- `Practice` — first-pass drills that reinforce the section's core mechanism
- `Advanced` — second-pass drills that come back later for edge cases, composition, or interview-style variants

An older version of this plan assumed the fundamentals exercises were enough and that no standalone `problems/` directory was needed. That assumption is no longer correct. The app already has a placeholder `src/app/frontend/problems/[id]/page.tsx` route, so frontend problems should be treated as first-class content.

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

The frontend journey model should carry both fundamentals and standalone problem references. These problem IDs do not need to be LeetCode numbers, but they do need to be stable keys that line up across journey wiring, route params, and content folders.

Use a shape like:

```ts
interface FrontendJourneySection {
  id: string;
  label: string;
  mentalModelHook: string;
  fundamentalsSlug: string;
  fundamentalsBlurb: string;
  practice: string[];
  advanced: string[];
}
```

Example:

```ts
{
  id: 'generics',
  label: 'Generics',
  mentalModelHook: 'A generic keeps input and output shapes linked across a call.',
  fundamentalsSlug: 'generics',
  fundamentalsBlurb: 'Inference, constraints, and when to add a type parameter.',
  practice: ['101-generics-pick', '102-generics-group-by', '103-generics-map-values'],
  advanced: ['151-generics-use-local-storage', '152-generics-overloads'],
}
```

The exact numbering scheme can change, but the relationship cannot:

- `practice` items are the first-pass drills attached to the section
- `advanced` items are the return-later drills attached to the section
- both arrays point to real folders under `src/app/frontend/problems/`

### 1.3 Content Loaders

Create `src/lib/frontend/fundamentals.ts` — same shape as `src/lib/dsa/fundamentals.ts` but reads from `src/app/frontend/fundamentals/{slug}/`.

Also add `src/lib/frontend/problems.ts`.

Responsibilities:

- load `mental-model.md` from `src/app/frontend/problems/{id}-{slug}/`
- expose step counts for a problem package
- enumerate available frontend problem IDs
- map a problem ID back to its owning section
- support the `frontend/problems/[id]` route

### 1.4 Content Directories

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

Frontend problem output path:
```
src/app/frontend/problems/{id}-{slug}/
  mental-model.md
  step1-problem.ts
  step1-solution.ts
  step2-problem.ts
  step2-solution.ts
  ...
  solution.ts
```

Keep the split clean:

- fundamentals teach the section concept in a broad, guided way
- practice problems package one narrower drill into a dedicated page
- advanced problems return later with harder variants, edge cases, or cross-topic composition

Do not fold advanced problems back into fundamentals files. The route structure and the learning-path structure should tell the same story.

---

## Part 2: Content Skills (thinkdeep-agents)

The frontend track needs two skill families:

- the fundamentals family for section guides
- the problem family for standalone frontend problem packages

The fundamentals family already exists in `thinkdeep-agents/skills/`. The missing piece is the frontend problem family.

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

### 2.6 `fe-problem` (orchestrator)

**File**: `skills/fe-problem/SKILL.md`

Owns the end-to-end workflow for one standalone frontend problem package:

`fe-problem` → `fe-problem-intuition` → `fe-problem-build` → `fe-problem`

This should mirror `dsa-problem` structurally, but the frontend problem types are different:

- TypeScript type-system drills
- React hook/debugging drills
- mixed frontend drills that combine a type-system idea with a React mechanism

Produces:

- `mental-model.md`
- `stepN-problem.ts`
- `stepN-solution.ts`
- `solution.ts`

Output path:

- `src/app/frontend/problems/{id}-{slug}/`

### 2.7 `fe-problem-intuition` (phase 1)

**File**: `skills/fe-problem-intuition/SKILL.md`

Owns the narrative and teaching half of a frontend problem package:

- `## The Problem`
- one analogy or one concrete mechanism model
- `## Understanding the Mechanism`
- `## How I Think Through This`
- `## Common Misconceptions`
- the handoff contract for `fe-problem-build`

Rules:

- TypeScript problems teach the type-level mechanism before any utility implementation
- React problems teach the render/closure/effect mechanism before any fix is scaffolded
- mixed problems pick one primary teaching axis so the package does not become two unrelated mini-lessons
- the narrative must be strong enough that the build phase does not need to rediscover the problem

### 2.8 `fe-problem-build` (phase 2)

**File**: `skills/fe-problem-build/SKILL.md`

Owns:

- `## Building the Solution`
- step decomposition
- `stepN-problem.ts`
- `stepN-solution.ts`
- `solution.ts`
- validation

Rules:

- each step must unlock one real new capability
- problem files must not pre-seed future scaffolding
- the learner should reproduce the bug or failure first, then repair it
- TypeScript problems validate with `tsc --noEmit`
- React problems validate with `jest`
- mixed problems may use both when the drill includes type and runtime behavior

### 2.9 `fe-validate-problems` (validator)

**File**: `skills/fe-validate-problems/SKILL.md`

Mirrors `dsa-validate-problems`, adapted for frontend problem packages. Checks:

- required files exist under `src/app/frontend/problems/{id}-{slug}/`
- markdown and step files agree on step count
- TypeScript solutions compile with `tsc --noEmit`
- React solutions pass `jest`
- the owning section exists in `src/lib/frontend/journey.ts`
- the problem ID appears in either `practice` or `advanced` for exactly one section

### 2.10 `fe-fix-problems` (fixer)

**File**: `skills/fe-fix-problems/SKILL.md`

Mirrors `dsa-fix-problems`. Patches shallow drift in-place, rebuilds deep failures via `fe-problem`.

### 2.11 Problem Metadata Contract

The skill family needs a small metadata contract so content generation and route wiring stay aligned.

Use a structure like:

```ts
interface FrontendProblemRef {
  id: string;
  slug: string;
  title: string;
  sectionId: string;
  tier: 'practice' | 'advanced';
  kind: 'typescript' | 'react' | 'mixed';
  prompt: string;
}
```

This can live in `src/lib/frontend/problems.ts` or adjacent to the frontend journey. One source of truth should define:

- the route key
- the owning section
- whether the problem is `practice` or `advanced`
- whether validation should run `tsc`, `jest`, or both

### 2.12 How the Problem Skill Family Should Work

The frontend problem skill family should not be a thin copy of `dsa-problem`. It needs frontend-specific generation rules.

Use this workflow:

1. Read the owning section in `src/lib/frontend/journey.ts`
2. Read the path entry in `src/docs/00-complete-frontend-path.md`
3. Read the sibling fundamentals guide for the section if it already exists
4. Decide whether the problem is `practice` or `advanced`
5. Decide whether the problem is `typescript`, `react`, or `mixed`
6. Generate the narrative contract first
7. Generate the step files second
8. Validate with the correct toolchain
9. Verify the problem ID is wired in the section metadata

The tier affects problem design:

- `practice` problems stay close to the section's core mechanism
- `advanced` problems widen the scope: edge cases, composition, tradeoffs, or interview-style twists

The kind affects validation and teaching style:

- `typescript`: compile-time failures and utility-type reasoning
- `react`: runtime behavior, stale closures, effect timing, or hook structure
- `mixed`: composition problems such as a typed hook with closure correctness and cleanup behavior

### 2.13 Example Mapping for One Section

For `generics`, the section could map like this:

```ts
{
  id: 'generics',
  practice: [
    '101-generics-pick',
    '102-generics-group-by',
    '103-generics-map-values',
  ],
  advanced: [
    '151-generics-use-local-storage',
    '152-generics-overloads',
  ],
}
```

This gives the skill family concrete targets:

- the three `Practice` bullets from the path become first-pass problem packages
- the two `Advanced` bullets become second-pass problem packages

Apply the same pattern section by section instead of inventing ad hoc problem sets later.

---

## Part 3: Build Order

Execute in this sequence. Each step depends on the previous.

### Step A: Platform scaffold (do once)

1. Extend `src/lib/frontend/journey.ts` so each section has `practice` and `advanced` arrays
2. Add `src/lib/frontend/problems.ts` as the frontend problem metadata and loader source
3. Create or finish `src/lib/frontend/fundamentals.ts`
4. Create or finish `src/app/frontend/problems/[id]/page.tsx` so it reads real problem content
5. Verify the frontend path page renders with fundamentals links and problem links
6. Verify one frontend problem page resolves from its route key

### Step B: Create skill files in thinkdeep-agents

1. Write `skills/fe-fundamentals-narrative/SKILL.md`
2. Write `skills/fe-fundamentals-build/SKILL.md`
3. Write `skills/fe-fundamentals/SKILL.md`
4. Write `skills/fe-validate-fundamentals/SKILL.md`
5. Write `skills/fe-fix-fundamentals/SKILL.md`
6. Write `skills/fe-problem-intuition/SKILL.md`
7. Write `skills/fe-problem-build/SKILL.md`
8. Write `skills/fe-problem/SKILL.md`
9. Write `skills/fe-validate-problems/SKILL.md`
10. Write `skills/fe-fix-problems/SKILL.md`
11. Update `thinkdeep-agents/AGENTS.md` skill table with all frontend skills

### Step C: Generate Phase 1 content (Novice)

Run fundamentals first so the vocabulary settles before the standalone problem packages:

```
/fe-fundamentals generics
/fe-fundamentals closure-captures
/fe-fundamentals effect-semantics
/fe-fundamentals conditional-types
/fe-fundamentals dependency-arrays
```

Then generate the Phase 1 practice and advanced problem packages referenced from the journey metadata.

Recommended rollout rule:

- create all `practice` problems for a section immediately after its fundamentals guide
- create that section's `advanced` problems next while the context is still local
- move to the next section only after both tiers are generated

### Step D: Generate Phase 2 content (Studied)

```
/fe-fundamentals mapped-types
/fe-fundamentals ref-vs-state
/fe-fundamentals template-literal-types
/fe-fundamentals custom-hook-composition
/fe-fundamentals branded-types
```

Then generate the Phase 2 practice and advanced problem packages referenced from the journey metadata.

### Step E: Generate Phase 3 content (Advanced)

```
/fe-fundamentals usereducer-patterns
/fe-fundamentals variance
/fe-fundamentals context-performance
/fe-fundamentals concurrent-mode
```

Then generate the Phase 3 practice and advanced problem packages referenced from the journey metadata.

### Step F: Validate and fix

```
/fe-validate-fundamentals all
/fe-validate-problems all
/fe-fix-fundamentals          # only if validation found drift
/fe-fix-problems              # only if validation found drift
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
