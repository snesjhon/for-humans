---
name: dsa-fundamentals-build
description: Build the progressive learning scaffold for a DSA fundamentals guide, including the three-level building blocks, gotchas section, 18 exercise files, and validation
---

# DSA Fundamentals Builder

Use this skill after `dsa-fundamentals-narrative` has already fixed the analogy, vocabulary map, three-level progression, and handoff contract.

## Responsibility

`dsa-fundamentals-build` owns:

- `## 3. Building Blocks — Progressive Learning` (3 levels)
- `## 6. Common Gotchas & Edge Cases`
- `stepN-exerciseM-problem.ts` (9 files)
- `stepN-exerciseM-solution.ts` (9 files)
- StackBlitz directives
- trace-component completion for the inherited visualization family when renderer support is missing
- Validation of all generated exercise files

`dsa-fundamentals-build` does not own:

- Choosing a new analogy
- Rewriting `## 1. Overview`, `## 2. Core Concept & Mental Model`, `## 4. Key Patterns`, or `## 5. Decision Framework`
- Replacing the trace family chosen by `dsa-fundamentals-narrative` unless clearly wrong
- Updating `journey.ts`

## Core Principles

1. Each level must unlock a real new capability the previous level could not handle
2. The learner builds one coherent mental model incrementally across the three levels
3. Exercise files use the same analogy vocabulary as the guide — no divergence
4. Tests define what each level is teaching, not just what the function does
5. Prose in Building Blocks guides thinking; the StackBlitz embed is where the learner writes code
6. Never substitute the wrong trace family just because it already exists; if the right one is missing, build it first

## Inputs Required

Do not begin until these are available from `dsa-fundamentals-narrative`:

- Analogy name and 1-sentence description
- Vocabulary map: analogy term → DSA term for all three levels
- Three-level progression labels and what each level unlocks
- Pattern names from Key Patterns
- Primary visualization family and example input for traces
- StackBlitz project name prefix
- Topic slug

If any of these are missing, stop and ask the orchestrator to resolve the missing handoff first.

## Workflow

### Step 1: Confirm Level Boundaries

Each level must be independently meaningful.

Use this test:

- If a learner can complete all exercises at level N without level N+1 concepts, it is a real level
- If two capabilities are tightly coupled, keep them in the same level

Name each level using the analogy vocabulary from the handoff contract.

Use these rules:

- **Level 1**: Foundation — the single most important building block; works on simple, direct problems
- **Level 2**: Enhancement — adds the key variation that Level 1 can't handle
- **Level 3**: Advanced — combines or extends Level 1 + 2 to solve harder problems

The bridge between levels must name the concrete failure that the current level produces, not just say "more complex problems."

### Step 1.5: Verify Trace Support

Before writing any level prose, confirm that the inherited visualization family is fully usable:

- the backing component exists in `components/dsa/`
- `components/dsa/MarkdownRenderer/MarkdownRenderer.tsx` recognizes the matching fence
- the trace family actually matches the data structure or execution pattern being taught

If the correct trace family is missing, build it before continuing. Do not switch to an incorrect existing tracer just to avoid component work.

Minimum completion for a new trace family:

- create the new component directory under `components/dsa/` following the existing trace component shape
- add any needed CSS module alongside it
- wire the new fence into `components/dsa/MarkdownRenderer/MarkdownRenderer.tsx`
- verify the generated markdown fence for this fundamentals guide will render through the DSA markdown pipeline

### Step 2: Write `## 3. Building Blocks — Progressive Learning`

Each level has this exact structure — do not skip any part:

**Level N: {Name}**

**Why this level matters**
One paragraph: why you need this concept, what problem it solves, how it connects to what came before.

**How to think about it**
One or two paragraphs: the mental model in plain language. No code yet. Explain what the algorithm is *doing*, not just what it *is*. Reference the analogy from Section 2.

**The one thing to get right**
One or two sentences identifying the single most important insight, gotcha, or ordering constraint for this level. Then show the consequence of getting it wrong (wrong output, infinite loop, etc.).

**Visualization**
One short lead-in sentence, then use a trace component or mermaid chart to make the level's pattern visually obvious. If the level needs a concrete example, put that example here, immediately before the visualization. Do not create a separate `Walking through it` subsection. The StackBlitz embed is where the learner writes code — the visualization primes intuition before they open the editor.

**StackBlitz embed** — each level has exactly one multi-exercise embed:

:::stackblitz{step=N total=3 exercises="stepN-exercise1-problem.ts,stepN-exercise2-problem.ts,stepN-exercise3-problem.ts" solutions="stepN-exercise1-solution.ts,stepN-exercise2-solution.ts,stepN-exercise3-solution.ts"}

`step` is the level number (1, 2, or 3) and `total` is always 3.

**Mental anchor** — one sentence in a blockquote that the reader can memorize:
> "DFS = go deep, mark first, backtrack. The visited set is the only thing stopping cycles from looping forever."

**→ Bridge to Level N+1**
One sentence explaining *why* the next level exists: what problem the current level can't solve, and how the next level addresses it.

### Step 3: Write `## 6. Common Gotchas & Edge Cases`

- 3-5 mistakes, each with: what goes wrong, why it's tempting, how to fix it
- Edge cases list
- Debugging tips (what to print/trace, how to spot the failure)

All examples and vocabulary must stay consistent with the analogy from the handoff contract.

### Step 4: Generate Exercise Files

Create `./app/dsa/fundamentals/{topic-slug}/` with all 18 files:

- `step1-exercise1-problem.ts` through `step3-exercise3-problem.ts` (9 files)
- `step1-exercise1-solution.ts` through `step3-exercise3-solution.ts` (9 files)

With 3 levels × 3 exercises = **9 pairs (18 files total)** per guide.

**How the embed is wired**: The fundamentals page passes `fundamentalsSlug` to `MarkdownRenderer`, which passes `base="fundamentals"` to `WebContainerEmbed`, which fetches from `/api/step-file?slug={fundamentalsSlug}&file={file}&base=fundamentals`. Files are resolved as `app/dsa/fundamentals/{slug}/{file}`. No extra wiring needed — just place the files in the correct directory.

---

#### stepN-exerciseM-problem.ts structure

Each file contains **exactly one function** and its tests. Single responsibility — one concept, one exercise.

```typescript
// =============================================================================
// {Topic} — Level N, Exercise M: {Exercise Title}
// =============================================================================
// Goal: {one sentence describing what this exercise practices}
//
// {Function description}
//
// Example:
//   {functionName}({input})  → {expected output}
//   {functionName}({input2}) → {expected output2}
// =============================================================================
function {functionName}({params}): {returnType} {
  throw new Error('not implemented');
}

test('{description}', () => {functionName}({input}), {expected});
test('{description}', () => {functionName}({input2}), {expected2});
// ... 4-6 tests covering normal cases, edge cases, and boundary conditions

// ---Helpers
function test(desc: string, fn: () => unknown, expected: unknown): void {
  try {
    const actual = fn();
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
    if (!pass) {
      console.log(`  expected: ${JSON.stringify(expected)}`);
      console.log(`  received: ${JSON.stringify(actual)}`);
    }
  } catch (e) {
    if (e instanceof Error && e.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw e;
    }
  }
}
// ---End Helpers
```

**Rules for problem files**:
- One function per file — the file title, goal, and all tests are for that one exercise
- Function body throws `new Error('not implemented')` — the user fills it in
- Tests use the **thunk form** `() => functionName(input)` so `Error('not implemented')` is caught and prints `TODO`
- For void/in-place functions, put the mutation call inside the thunk: `() => { const a = [...]; fn(a); return a; }`
- Test cases: 4-6 per file, covering normal, edge (empty, single), and boundary conditions
- Wrap helper blocks with `// ---Helpers` and `// ---End Helpers` so the editor can fold them
- Exercises within a level progress: basic → variation → combined/harder
- **No LeetCode duplicates**: Before finalizing any exercise, check whether the same problem already exists in `app/problems/`. If a problem page covers it, replace that exercise with a novel variant — the exercises exist to build the mental model, not re-do problems the user will encounter later on the path.
- **Use the level's analogy vocabulary**: Comments in the exercise header must use the same language as the corresponding Building Block level in the guide (e.g. "scanner/stamper" for write-cursor levels, "left inspector/right inspector" for two-pointer levels, "left messenger/right messenger" for prefix-suffix levels). Technical names like `r`, `w`, `L`, `R` belong in code — not in the description prose. The exercise title should reflect the analogy (e.g. "Stamp the Keepers") not just the function name.

---

#### stepN-exerciseM-solution.ts structure

Identical layout to the problem file but the function body is **fully implemented** and all tests print PASS.

```typescript
// =============================================================================
// {Topic} — Level N, Exercise M: {Exercise Title} — SOLUTION
// =============================================================================
// Goal: {one sentence}

function {functionName}({params}): {returnType} {
  // working implementation
}

test('{description}', () => {functionName}({input}), {expected});
// ... all tests

// ---Helpers
function test(...) { /* identical to problem file */ }
// ---End Helpers
```

### Step 5: Validate Exercise Files

Run all 18 files from the topic subdirectory. All must exit 0.

```bash
cd app/dsa/fundamentals/{topic-slug}/

# Level 1
npx tsx step1-exercise1-problem.ts   # Expected: TODO lines, no crashes
npx tsx step1-exercise1-solution.ts  # Expected: PASS lines only
npx tsx step1-exercise2-problem.ts
npx tsx step1-exercise2-solution.ts
npx tsx step1-exercise3-problem.ts
npx tsx step1-exercise3-solution.ts

# Level 2
npx tsx step2-exercise1-problem.ts
npx tsx step2-exercise1-solution.ts
npx tsx step2-exercise2-problem.ts
npx tsx step2-exercise2-solution.ts
npx tsx step2-exercise3-problem.ts
npx tsx step2-exercise3-solution.ts

# Level 3
npx tsx step3-exercise1-problem.ts
npx tsx step3-exercise1-solution.ts
npx tsx step3-exercise2-problem.ts
npx tsx step3-exercise2-solution.ts
npx tsx step3-exercise3-problem.ts
npx tsx step3-exercise3-solution.ts
```

If any solution file exits non-zero or prints FAIL lines, fix it before handing control back to `dsa-fundamentals`.

## Visualization Rules

**Decision rule:** When visualizing *how code executes* (pointer movement, array mutation, cursor advancing, pass direction), use a trace component. When visualizing *conceptual structure* (decision trees, algorithm topology, concept relationships), use mermaid. Never use mermaid to show step-by-step code execution. Never use static TypeScript code blocks in the guide — StackBlitz is where the learner reads and writes code.

Use the exact trace family inherited from the handoff contract unless it is objectively inconsistent with the actual data structure being taught.

Supported trace fences:

- `:::trace` — read/write cursor (array compaction)
- `:::trace-lr` — two-pointer or cursor scan over a sequence
- `:::trace-ps` — prefix/suffix pass with accumulator
- `:::trace-map` — hash map key/value state
- `:::trace-ll` — singly linked list
- `:::trace-dll` — doubly linked list
- `:::trace-sq` — stack/queue state transitions and call-stack style execution
- `:::trace-subset` — choose-explore-undo / subset-style branching traces

For any new fence that this guide genuinely needs and the renderer does not yet support, implement the component and markdown-renderer wiring before generating the guide content. Do not fall back to prose traces or the wrong existing fence.

## Quality Bar

The build phase is complete only if:

- the three-level progression feels inevitable — each level solves exactly one new problem the previous level couldn't handle
- analogy vocabulary from the handoff contract is used verbatim in exercise file comments
- all 9 problem files exit 0 and print only `TODO` lines (no crashes)
- all 9 solution files exit 0 and print only `PASS` lines
- markdown and file set agree on level count and level names
- every trace fence used by the guide is backed by a real component and renderer support
- no TypeScript code blocks appear in the guide sections written here
- no `Walking through it` subsections appear in the guide
- the bridge sentence between levels names a concrete failure, not just "more complex problems"
