---
name: dsa-fundamentals
description: Orchestrate a complete DSA fundamentals guide by sequentially using dsa-fundamentals-narrative and then dsa-fundamentals-build to generate the mental model, progressive building blocks, 18 exercise files, validation, and journey wiring
---

# DSA Fundamentals Orchestrator

Use this skill when asked to generate or rebuild a full DSA fundamentals guide under `app/dsa/fundamentals/{slug}/`.

## Responsibility

`dsa-fundamentals` owns the end-to-end workflow:

1. Gather context from `lib/journey.ts` and existing guides
2. Verify the topic's trace visualization support exists, and build it if missing
3. Run `dsa-fundamentals-narrative` first
4. Carry the resulting handoff contract forward
5. Run `dsa-fundamentals-build` second
6. Stitch and validate outputs
7. Update `lib/journey.ts`
8. Deliver the final result

This workflow is sequential, never parallel:

`dsa-fundamentals` → `dsa-fundamentals-narrative` → `dsa-fundamentals-build` → `dsa-fundamentals`

## Files This Workflow Produces

- `app/dsa/fundamentals/{slug}/{slug}-fundamentals.md`
- `app/dsa/fundamentals/{slug}/step1-exercise1-problem.ts` through `step3-exercise3-problem.ts`
- `app/dsa/fundamentals/{slug}/step1-exercise1-solution.ts` through `step3-exercise3-solution.ts`

Do not create summary files such as `README.md`.

## Workflow

### Step 1: Read Local Conventions

Before generating anything:

- Read `lib/journey.ts` and find the section matching the requested topic
- Check `app/dsa/fundamentals/` for any existing guide at this slug
- Read one or two existing guides (e.g. `arrays-strings-fundamentals.md`, `sliding-window-fundamentals.md`) to calibrate tone, depth, and structure
- Note which trace components are available in `components/dsa/`

### Step 1.25: Ensure Trace Visualization Support Exists

Before generating the guide, identify the trace family the topic actually needs and verify both pieces of support exist:

- the backing component in `components/dsa/`
- the matching fence handling in `components/dsa/MarkdownRenderer/MarkdownRenderer.tsx`

If the correct trace family is missing, build it first. Do not continue with narrative or build phases until the renderer can display the guide's intended visualization.

### Step 1.5: Apply the Shared DSA Teaching Contract

The downstream skills contain the detailed rules. As the orchestrator, enforce these global constraints:

- one analogy only — committed before any scaffold is written
- conceptual understanding before exercise scaffolding
- trace components for execution visualization, mermaid for conceptual structure
- the correct trace family must exist; if it does not, create it instead of substituting an incorrect tracer
- each Building Blocks level uses a `Visualization` subsection; do not generate a `Walking through it` subsection
- no TypeScript code blocks in the guide markdown
- `---` in exactly two places: before `## 3. Building Blocks` and before `## 5. Decision Framework`
- no `# Title` heading or `> Phase` blockquote at the top of the guide
- 18 exercise files (9 problem + 9 solution), all validated before finishing

### Step 2: Run `dsa-fundamentals-narrative`

Use `dsa-fundamentals-narrative` to produce:

- Topic metadata extraction
- Analogy choice and vocabulary map
- `## 1. Overview`
- `## 2. Core Concept & Mental Model`
- `## 4. Key Patterns`
- `## 5. Decision Framework`
- The handoff contract for `dsa-fundamentals-build`

### Step 3: Preserve the Handoff Contract

Before switching to `dsa-fundamentals-build`, retain this contract in working context:

- Topic slug (e.g. `binary-trees`)
- Analogy name and 1-sentence description
- Vocabulary map: analogy term → DSA term for all three levels
- Three-level progression labels and what each level unlocks
- Pattern names from Key Patterns
- Primary visualization family and example input for traces
- StackBlitz project name prefix

`dsa-fundamentals-build` must inherit this contract. It should refine level boundaries if necessary, but it must not replace the analogy or rewrite the narrative sections from scratch.

### Step 4: Run `dsa-fundamentals-build`

Use `dsa-fundamentals-build` to produce:

- `## 3. Building Blocks — Progressive Learning` (3 levels)
- `## 6. Common Gotchas & Edge Cases`
- All 18 exercise files
- StackBlitz directives
- Validation of all generated exercise files

### Step 5: Stitch and Validate

After both phases:

- Assemble the guide in section order: 1 → 2 → (---) → 3 → 4 → (---) → 5 → 6
- Save to `./app/dsa/fundamentals/{slug}/{slug}-fundamentals.md`
- Confirm section count and `---` placement match the rules
- Run mermaid validation if the guide contains mermaid:
  ```bash
  ./.claude/skills/leet-mental/validate-mermaid.sh app/dsa/fundamentals/{slug}/{slug}-fundamentals.md
  ```
- Confirm all 18 exercise files exist in `app/dsa/fundamentals/{slug}/`
- Fix any failures before finishing

### Step 6: Update `journey.ts`

After saving the guide and exercise files, wire it into the learning path.

1. Read `./lib/journey.ts`
2. Find the `JourneySection` where `section.id` matches the topic slug
   - Topic slug = same value used for the directory (lowercase, spaces → hyphens)
   - Example: "Arrays & Strings" → `arrays-strings`
3. Check whether `fundamentalsSlug` is already set and matches the slug
4. **If `fundamentalsSlug` is missing or wrong**: add it after the `analogies` array:
   ```
   fundamentalsSlug: '{slug}',
   ```
5. **If `fundamentalsBlurb` is also missing**: add a one-sentence description right after `fundamentalsSlug`:
   ```
   fundamentalsBlurb: '{one sentence — what the learner gets from this guide before writing problem code}',
   ```
6. Confirm the section now has both fields set.

**Note**: If both fields are already set correctly, skip — no edit needed.

## Orchestration Rules

- `dsa-fundamentals` is the only skill that owns final delivery
- `dsa-fundamentals-narrative` and `dsa-fundamentals-build` are subordinate phases, not peers
- Do not let `dsa-fundamentals-build` invent a second analogy
- Do not let `dsa-fundamentals-narrative` write exercise `.ts` files
- Do not leave unresolved disagreement between the two phases; `dsa-fundamentals` resolves it before finalizing

## Output Standard

A finished fundamentals guide must satisfy all of these:

- the analogy is consistent across all sections and all 18 exercise file headers
- the three levels are independently meaningful — each solves exactly one new problem
- there are no TypeScript code blocks in the guide markdown
- `---` appears in exactly two places in the guide
- all 9 `*-problem.ts` files exit 0 and print only `TODO` lines (no crashes)
- all 9 `*-solution.ts` files exit 0 and print only `PASS` lines
- every trace fence used by the guide is backed by a real component and markdown-renderer support
- `journey.ts` has `fundamentalsSlug` and `fundamentalsBlurb` set for this topic

## Example Invocations

```bash
/dsa-fundamentals Binary Trees
/dsa-fundamentals Sliding Window
/dsa-fundamentals Dynamic Programming
/dsa-fundamentals Two Pointers
/dsa-fundamentals Graphs
```
