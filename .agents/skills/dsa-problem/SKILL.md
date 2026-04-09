---
name: dsa-problem
description: Orchestrate a complete DSA problem package by sequentially using dsa-intuition and then dsa-build-algorithm to generate the mental model, step files, solution, validation, and journey wiring
---

# DSA Problem Orchestrator

Use this skill when asked to generate or rebuild a full DSA problem package under `app/dsa/problems/{id}-{slug}/`.

## Responsibility

`dsa-problem` owns the end-to-end workflow:

1. Gather context from the target problem and adjacent problem packages
2. Run `dsa-intuition` first
3. Carry the resulting handoff contract forward
4. Run `dsa-build-algorithm` second
5. Validate outputs
6. Verify `lib/journey.ts`
7. Deliver the final result

This workflow is sequential, never parallel:

`dsa-problem` → `dsa-intuition` → `dsa-build-algorithm` → `dsa-problem`

## Files This Workflow Produces

- `mental-model.md`
- `stepN-problem.ts`
- `stepN-solution.ts`
- `solution.ts`

Do not create summary files such as `README.md`.

## Workflow

### Step 1: Read Local Conventions

Before generating anything:

- Read the target directory if it already exists
- Read nearby problems in `app/dsa/problems/` that match the same data structure or teaching style
- Read `lib/journey.ts`
- Read `00-complete-dsa-path.md` only if journey placement is missing or unclear
- Read the relevant trace component in `components/dsa/`

Prefer current repo examples over stale references in older skills.

### Step 1.5: Apply the Shared DSA Teaching Contract

The downstream skills already contain the detailed narrative and algorithm-building rules. As the orchestrator, enforce these global constraints:

- one analogy only
- conceptual understanding before code scaffolding
- `## How I Think Through This` is a pre-build bridge: short phase paragraphs plus a compact preview visualization, not a second full walkthrough
- trace components for execution, mermaid for conceptual structure
- if `## Tracing through an Example` exists, it comes after `## Building the Algorithm`, uses a different example from the preview trace, and runs the full algorithm
- no summary docs outside the problem package
- `mental-model.md` must match the step files exactly
- validations are required, not optional

### Step 2: Run `dsa-intuition`

Use `dsa-intuition` to produce the narrative half of the guide and the handoff contract for the algorithm builder.

`dsa-intuition` owns:

- `## The Problem`
- analogy choice
- `## Understanding the Analogy`
- `## How I Think Through This`
- `## Common Misconceptions`
- tracer selection and trace vocabulary
- the algorithm handoff contract

### Step 3: Preserve the Handoff Contract

Before switching to `dsa-build-algorithm`, retain this contract in working context:

- final problem statement and examples
- chosen analogy and vocabulary
- final algorithm choice
- core invariant
- the intended role of `## How I Think Through This` as a bridge into the build section
- primary data structure and exact trace component
- trace example input
- proposed step decomposition
- what each step must prove independently
- known edge cases

`dsa-build-algorithm` must inherit this contract. It should refine step boundaries if necessary, but it should not replace the analogy or rewrite the narrative sections from scratch.

### Step 4: Run `dsa-build-algorithm`

Use `dsa-build-algorithm` to produce:

- `## Building the Algorithm`
- `stepN-problem.ts`
- `stepN-solution.ts`
- `solution.ts`
- StackBlitz directives
- mermaid section if needed
- validation of all generated code files

### Step 5: Stitch and Validate

After both phases:

- ensure `mental-model.md` reads as one coherent document
- ensure section order is correct
- ensure step counts in markdown and files match
- run mermaid validation if the markdown contains mermaid
- run each step file in order
- run `solution.ts`
- fix any failures before finishing

### Step 6: Verify `journey.ts`

Check whether the problem ID is already present in `lib/journey.ts`.

- If present, report where it lives
- If absent, locate the correct section from `00-complete-dsa-path.md` and add it

## Orchestration Rules

- `dsa-problem` is the only skill that owns final delivery
- `dsa-intuition` and `dsa-build-algorithm` are subordinate phases, not peers
- Do not let `dsa-build-algorithm` invent a second analogy
- Do not let `dsa-intuition` write runnable step files
- Do not leave unresolved disagreement between the two phases; `dsa-problem` resolves it before finalizing

## Output Standard

A finished problem package must satisfy all of these:

- the analogy is strong and consistent
- the algorithm steps are independently teachable and testable
- if `## Tracing through an Example` exists, it uses a fresh example and earns its place as a full execution walkthrough
- every `stepN-problem.ts` exits 0 and prints only `TODO`, `PASS`, or `FAIL` lines
- every `stepN-solution.ts` exits 0 and prints only `PASS` lines
- `solution.ts` exits 0 and prints only `PASS` lines
- `mental-model.md` matches the generated files exactly
