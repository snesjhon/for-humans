---
name: dsa-intuition
description: Generate the narrative and intuition half of a DSA problem package, including the analogy, conceptual explanation, trace framing, misconceptions, and a handoff contract for dsa-build-algorithm
---

# DSA Intuition Builder

Use this skill to create the teaching narrative for a DSA problem before any step-by-step implementation scaffolding is written.

## Responsibility

`dsa-intuition` owns:

- `## The Problem`
- the single analogy
- `## Understanding the Analogy`
- `## How I Think Through This`
- `## Common Misconceptions`
- trace preflight and trace vocabulary
- the handoff contract for `dsa-build-algorithm`

`dsa-intuition` does not own:

- `## Building the Algorithm`
- step files
- `solution.ts`
- step-by-step cumulative test design

## Core Principles

1. Choose one analogy and commit to it completely
2. Build the mental model before any implementation scaffolding exists
3. Stay inside the analogy in conceptual sections
4. Explain why each structure or invariant exists
5. Use traces for execution, not prose narration of every move
6. Give `dsa-build-algorithm` enough structure that it does not need to rediscover the solution

## Required Workflow

### Step 1: Trace Preflight

Choose the teaching visualization from the problem's primary data structure first, then verify the backing component exists in `components/dsa/`.

Current mappings:

- `components/dsa/ArrayTrace.tsx` → `:::trace`
- `components/dsa/TwoPointerTrace.tsx` → `:::trace-lr`
- `components/dsa/PrefixSuffixTrace.tsx` → `:::trace-ps`
- `components/dsa/HashMapTrace.tsx` → `:::trace-map`
- `components/dsa/LinkedListTrace.tsx` → `:::trace-ll`
- `components/dsa/DoublyLinkedListTrace/DoublyLinkedListTrace.tsx` → `:::trace-dll`
- `components/dsa/ParserTrace/ParserTrace.tsx` → `:::trace-parse`

Use `:::trace-parse` for cursor-based parsing problems where the learner reads structure from a local boundary, derives metadata such as a length or token type, and then jumps forward by a computed amount. Typical fits:

- length-prefixed string decoding
- delimiter parsing where only the current delimiter matters
- tokenization / lexer-style scans
- deserialize / decode walks over one linear buffer
- compression formats that read a header then consume a payload span

If the correct component does not exist, stop and ask exactly:

`Should we create the visualization component first`

### Step 2: Choose One Analogy

Pick one analogy and commit to it completely. Everything in this skill must reinforce that analogy.

Do not mix metaphors.

Choose an analogy only if:

- every major operation has a natural counterpart
- the edge cases still make sense inside the metaphor
- the analogy will survive all the way through misconceptions and trace labels
- the learner could plausibly remember it later

### Step 3: Write the Narrative Sections

Create these sections in this order:

1. `## The Problem`
2. `## The [Analogy Name] Analogy`
3. `## Understanding the Analogy`
4. `## How I Think Through This`

Requirements:

- `## The Problem` contains the verbatim problem statement and examples only
- `## Understanding the Analogy` is concept-only, no code
- `## How I Think Through This` contains:
  - a short bridge from the analogy into the build section
  - a whiteboard walkthrough in short paragraph phases
  - one compact trace block introduced by `Take \`[example]\`.`

The trace here is a compact preview, not the full teaching walkthrough for every step.

Use these section rules:

- `## The [Analogy Name] Analogy` is 2-4 paragraphs with no code
- `## Understanding the Analogy` must include:
  - `### The Setup`
  - one or more key mechanism subsections
  - `### Why This Approach`
- `## How I Think Through This` sits before `## Building the Algorithm` and should feel like a bridge, not a second full algorithm lesson
- `## How I Think Through This` block 1 names important variables inline in prose, but never uses code blocks
- each algorithmic phase gets its own paragraph; if the algorithm changes direction or starts a new pass, start a new paragraph
- keep block 1 to short paragraph phases only; do not turn it into a wall of text or a pseudo-implementation
- the goal is to give the learner the mental checklist and invariant they should carry into the build section
- the trace block is mandatory; never replace it with prose like "index 0 does X, then index 1 does Y"
- the trace block must be visually compact: prefer a single-state or otherwise lightweight snapshot that reinforces the analogy and structural boundaries
- do not use the `## How I Think Through This` trace to walk through the entire algorithm end-to-end; save the detailed execution walkthrough for `## Building the Algorithm` or a later full-example section
- if the problem package later includes `## Tracing through an Example`, the preview trace here should use a different example from that full walkthrough

### Step 4: Write `## Common Misconceptions`

Write 3-5 misconception bullets using the analogy vocabulary throughout.

This section should appear after `## Building the Algorithm` in the final document, but `dsa-intuition` still owns its content. If you are drafting the markdown before the algorithm section exists, keep the content ready for later insertion rather than forcing the wrong section order.

Each misconception must:

- state a believable wrong belief
- explain why it is wrong in the analogy
- end with the correct mental model

### Step 5: Produce the Handoff Contract

Before handing off to `dsa-build-algorithm`, produce a concise internal contract in working context with:

- problem ID and slug
- final algorithm choice
- one-sentence invariant
- chosen analogy and vocabulary
- primary data structure
- exact trace component and fence
- example input for traces
- candidate step decomposition
- critical edge cases
- any naming conventions that should carry into code

This contract is for orchestration, not a user-facing file.

## Writing Rules

- Stay in the analogy for conceptual sections
- Use variable names naturally only in `## How I Think Through This`
- Do not generate runnable implementation code
- Do not draft `stepN-problem.ts`, `stepN-solution.ts`, or `solution.ts`
- Do not decide step tests in detail beyond the handoff contract
- Prefer current repo examples in `app/dsa/problems/` over old references
- Do not introduce a second analogy to "clarify" the first
- Do not compare multiple solution approaches; teach one final algorithm
- Do not use math-heavy notation before intuition is established
- Do not break the problem section with commentary or analysis
- Do not create a post-hoc recap section that duplicates the trace already given in `## How I Think Through This`

## Quality Bar

The narrative is complete only if:

- someone can understand the final algorithm before seeing code
- the analogy supports every major operation naturally
- the trace component matches the actual data structure being taught
- the handoff contract is concrete enough that `dsa-build-algorithm` can continue without re-deriving the whole solution
- the narrative already implies the eventual step decomposition, even though it does not implement it
