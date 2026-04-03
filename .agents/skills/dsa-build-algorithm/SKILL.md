---
name: dsa-build-algorithm
description: Build the algorithm section and executable learning scaffold for a DSA problem package, including step decomposition, step files, cumulative tests, solution.ts, StackBlitz embeds, and validation
---

# DSA Algorithm Builder

Use this skill after `dsa-intuition` has already fixed the analogy, final algorithm, trace family, and handoff contract.

## Responsibility

`dsa-build-algorithm` owns:

- `## Building the Algorithm`
- step decomposition
- step titles
- `stepN-problem.ts`
- `stepN-solution.ts`
- `solution.ts`
- cumulative test design
- StackBlitz directives
- optional post-algorithm mermaid section
- validation of generated code files

`dsa-build-algorithm` does not own:

- selecting a new analogy
- rewriting the problem framing
- replacing the tracer family chosen by `dsa-intuition` unless the handoff contract is clearly wrong

## Core Principles

1. Each step must unlock a real new capability
2. The learner should build one correct algorithm incrementally, not replace a naive algorithm later
3. Markdown should guide thinking, not leak a copy-paste solution
4. Tests define the teaching boundary of each step
5. The final document must weave concept, trace, practice, and validation into one path

## Benchmark

The canonical benchmark for this skill is:

- `app/dsa/problems/146-lru-cache/mental-model.md`

When there is ambiguity about decomposition quality, woven teaching structure, or the standard for `## Building the Algorithm`, use `146-lru-cache` as the tie-breaker.

This benchmark applies to `dsa-build-algorithm` only. It does not redefine the contracts of `dsa-problem` or `dsa-intuition`.

## Inputs Required

Do not begin until these are available from `dsa-intuition`:

- chosen analogy
- final algorithm choice
- invariant
- trace component and example
- candidate step decomposition
- edge cases

If any of these are missing, stop and ask the orchestrator to resolve the missing handoff first.

## Workflow

### Step 1: Confirm Step Boundaries

Each step must be independently meaningful and independently testable.

Use this test:

- if step N can pass its test set without step N+1, it is a real step
- if two actions are coupled and neither works alone, keep them in one step

Every problem requires at least 2 steps.

Use these additional rules:

- do not split a step just because two lines of code exist
- if the step name needs "and" or "then", the boundary is probably wrong
- when an algorithm seems indivisible, look for a setup/gate phase and an expansion/computation phase
- step 1 tests should usually pass on empty or structurally simple cases that do not require later logic
- if a later step needs extra setup, variables, loop headers, or pointer movement that the learner has not built yet, add another step instead of silently inserting that scaffolding
- treat setup as real learner-owned progress: local variables, result arrays, stacks, pointers, loop headers, and traversal state are not free author scaffolding
- default to more steps when needed so the learner builds the function from the first line instead of inheriting a half-written algorithm
- if step 1 would need prewritten algorithm structure to make sense, the decomposition is wrong; introduce an earlier step

### Step 2: Write `## Building the Algorithm`

For each step:

1. explain one concept through the established analogy
2. include that step's own visualization
3. insert the StackBlitz directive
4. add a collapsed hints block

Do not introduce a second analogy.

Do not put full working implementation in markdown code blocks.

Additional markdown rules:

- steps should appear inline in the narrative flow, not as an appendix
- each step is concept → step-specific visualization → StackBlitz → hints
- use mermaid only after the full algorithm section, never inside a step
- traces show execution; mermaid shows conceptual structure
- hints should surface traps and patterns, not restate the solution
- the overall shape should feel comparable to `146-lru-cache`: one coherent teaching progression rather than a loose collection of implementation notes
- every step must have its own visualization; do not leave a step as prose plus embed only
- do not add a standalone `Tracing through an Example` section anywhere in the document

### Step 3: Generate Step Files

Create:

- `step1-problem.ts` through `stepM-problem.ts`
- `step1-solution.ts` through `stepM-solution.ts`
- `solution.ts`

Rules:

- `step1-problem.ts` starts from a blank body with `throw new Error('not implemented')`
- `step1-solution.ts` should be the smallest meaningful slice of the final algorithm that makes the step 1 tests pass
- build the function from the first line outward; do not prefill algorithm structure ahead of the learner
- later problem files lock prior steps and expose only the next learner-owned chunk as `throw new Error('not implemented')`
- each file is self-contained
- generated step files and `solution.ts` are self-executing scripts, not modules; do not add `export {}` or any other module marker just to satisfy TypeScript
- do not add decorative banner titles at the top of generated files; start directly with the `Goal:` comment and then the code or helper blocks
- helper blocks are wrapped with `// ---Helpers` and `// ---End Helpers`
- test blocks are wrapped with `// ---Tests` and `// ---End Tests` so they can be folded like helpers
- tests are cumulative
- problem files must catch `Error('not implemented')` and print `TODO`
- solution files must print only `PASS` lines when correct
- in-place or `void` problems must call the mutation inside the test thunk so unimplemented code prints `TODO` instead of crashing
- helper code should be foldable and present in both problem and solution files when needed
- do not prefill bridge scaffolding between steps; if step N+1 needs new local variables, traversal state, a loop header, or another structural setup that was not built in step N, that setup must become its own learner step
- the diff from `stepN-problem.ts` to `stepN+1-problem.ts` should reflect only previously completed learner code becoming locked plus one new TODO-owned chunk, not hidden author-added progress
- if you catch yourself inserting code before the new `throw new Error('not implemented')` and that code was not already learner-built in the prior step, the step boundary is wrong
- never pre-seed a problem file with result arrays, stacks, maps, counters, loop headers, pointer initialization, or traversal direction unless those exact lines were learned in an earlier step
- for many array/string algorithms, expect one or more early setup steps before the main loop logic exists
- a valid step sequence should read like this: blank function -> first structural line(s) -> next structural line(s) -> loop/traversal shell -> core loop behavior -> final answer wiring
- if a local helper type would collide with a global DOM type such as `Node`, rename the local helper type instead of turning the file into a module

### Step 4: Design Cumulative Tests

For each step:

- include tests that prove exactly what this step unlocks
- preserve earlier passing behavior
- avoid tests that require future steps
- include edge cases when they are the reason a step exists

The final `solution.ts` should cover the prompt example and the most important edge cases.

Avoid these failure modes:

- step tests that secretly depend on future logic
- a step 1 scaffold that already gives away the real implementation shape
- a step 2 or step 3 scaffold that suddenly inserts setup the learner never wrote
- brute-force step 1 followed by optimized step 2
- tests that validate the wrong concept for the declared step title
- adding hidden scaffolding in a later problem file so the learner skips an intermediate construction step

### Step 5: Add Final Document Sections

If the algorithm benefits from a high-level flowchart or state machine, add one optional section after `## Building the Algorithm` and before `## Common Misconceptions`.

Use mermaid only for conceptual structure, never for step-by-step execution.

Always finish the markdown with:

`## Complete Solution`

and the final StackBlitz embed for `solution.ts`.

If one technique deserves extra depth, add one optional post-algorithm section with subsections instead of multiple peer sections.

### Step 6: Validate

Run all required validation before finishing:

- mermaid validation if mermaid exists
- each `stepN-problem.ts`
- each `stepN-solution.ts`
- `solution.ts`

Fix failures before handing control back to `dsa-problem`.

## Trace Rules

Use the exact trace family inherited from `dsa-intuition` unless it is objectively inconsistent with the actual core data structure.

Supported fences:

- `:::trace`
- `:::trace-lr`
- `:::trace-ps`
- `:::trace-map`
- `:::trace-ll`
- `:::trace-dll`

If the correct trace component is missing, stop and ask exactly:

`Should we create the visualization component first`

## Quality Bar

The build phase is complete only if:

- step boundaries feel inevitable rather than arbitrary
- tests prove the incremental learning path
- markdown and file set agree on step count and step names
- the learner can move from the analogy directly into executable practice
- no markdown code block above an embed is enough to pass the tests by copy-paste
- the final step leaves the learner with the complete correct solution
- the finished `## Building the Algorithm` would feel at home next to `app/dsa/problems/146-lru-cache/mental-model.md`
- each step has its own visualization
- no standalone `Tracing through an Example` section exists
- no `stepN-problem.ts` introduces new non-helper scaffolding that the learner did not build in an earlier step
- the first executable problem file is literally a blank function body with only `throw new Error('not implemented')`
- each later executable problem file grows the function only by previously learned lines plus one new learner-owned chunk
- generated files remain plain self-executing scripts with no module marker workaround
- generated files omit top-of-file decorative titles and keep only the `Goal:` comment plus relevant hints
