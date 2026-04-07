---
name: dsa-fundamentals-narrative
description: Generate the narrative and conceptual half of a DSA fundamentals guide, including the analogy, overview, core mental model, key patterns, decision framework, and a handoff contract for dsa-fundamentals-build
---

# DSA Fundamentals Narrative Builder

Use this skill to create the conceptual, analogy-driven half of a fundamentals guide before any progressive exercise scaffolding is written.

## Responsibility

`dsa-fundamentals-narrative` owns:

- Extracting topic metadata from `lib/journey.ts`
- Choosing and committing to one analogy
- `## 1. Overview`
- `## 2. Core Concept & Mental Model`
- `## 4. Key Patterns`
- `## 5. Decision Framework`
- Trace preflight and visualization approach
- The handoff contract for `dsa-fundamentals-build`

`dsa-fundamentals-narrative` does not own:

- `## 3. Building Blocks — Progressive Learning`
- `## 6. Common Gotchas & Edge Cases`
- Any `.ts` exercise files
- `journey.ts` updates

## Core Principles

1. Choose one analogy and commit to it completely — every section must reinforce it
2. Build the mental model before any exercise scaffolding exists
3. Stay inside the analogy in conceptual sections — no variable names, no code
4. Explain *why* each pattern or structure exists, not just what it is
5. Give `dsa-fundamentals-build` enough context that it does not need to rediscover the analogy vocabulary or progression

## Required Workflow

### Step 1: Extract Topic Information

1. Read `./lib/journey.ts` — this is the source of truth for the DSA path
2. Find the section matching the user's requested topic (case-insensitive match against `label` fields)
3. Extract:
   - Section `label` and `days` field
   - `patternIds` — the patterns covered
   - `firstPass` and `reinforce` problem IDs
   - `mentalModelHook` — core mental model for this topic
   - Prerequisites: sections that appear before this one in JOURNEY

### Step 2: Check for Existing Study Guides

1. Use Glob to search for study guides: `app/problems/**/mental-model.md`
2. Parse the directory names to match against the topic's problem IDs
3. For each problem in the topic, check if a mental model exists
4. If found, note the path — these become links in the guide

### Step 3: Trace Preflight

Choose the primary visualization family for this topic, then verify the backing component exists in `components/dsa/`.

Current mappings:

- `components/dsa/ArrayTrace/ArrayTrace.tsx` → `:::trace`
- `components/dsa/TwoPointerTrace/TwoPointerTrace.tsx` → `:::trace-lr`
- `components/dsa/PrefixSuffixTrace/PrefixSuffixTrace.tsx` → `:::trace-ps`
- `components/dsa/HashMapTrace/HashMapTrace.tsx` → `:::trace-map`
- `components/dsa/LinkedListTrace/LinkedListTrace.tsx` → `:::trace-ll`
- `components/dsa/DoublyLinkedListTrace/DoublyLinkedListTrace.tsx` → `:::trace-dll`
- `components/dsa/StackQueueTrace/StackQueueTrace.tsx` → `:::trace-sq`
- `components/dsa/SubsetTrace/SubsetTrace.tsx` → `:::trace-subset`

If the correct component or markdown-renderer support does not exist, build it before continuing:

- create the component in `components/dsa/`
- add any required CSS module
- wire the fence into `components/dsa/MarkdownRenderer/MarkdownRenderer.tsx`
- confirm the chosen fence now renders through the DSA markdown pipeline

Do not improvise with the wrong existing tracer just because it is already available.

### Step 4: Choose One Analogy

Pick one analogy and commit to it completely.

Choose an analogy only if:

- every major operation has a natural counterpart in the analogy
- the edge cases still make sense inside the metaphor
- the analogy vocabulary can carry through all three levels and into the exercise file comments
- the learner could plausibly remember it later

Do not mix metaphors.

### Step 5: Write the Narrative Sections

Write these four sections:

#### `## 1. Overview`

- 2-3 sentences: what this topic is and why it matters
- One sentence on what the user already knows that connects to this topic
- What the three building-block levels will cover

#### `## 2. Core Concept & Mental Model`

Open with a concrete real-world analogy — 2-4 sentences establishing the core metaphor. Name what each algorithmic concept maps to in the analogy.

Then two subsections:

##### Understanding the Analogy

Named subsections — use the analogy vocabulary exclusively, no variable names or TypeScript:

- **The Setup** — what do we have, what are we trying to accomplish, what are the constraints?
- **[Key mechanism(s)]** — explain the central techniques through the analogy. Cover what makes each one work and what would go wrong without it. 1-2 subsections depending on how many techniques the topic has.
- **Why These Approaches** — why does this strategy work? What would be worse? What makes it efficient?

**This subsection has zero code.** It exists so the reader fully understands the approach conceptually before any implementation appears.

##### How I Think Through This

**Two logical blocks. No subsections. No code.**

**Block 1 — Recognition walkthrough:** First-person prose. When I see a problem of this type, here's what I ask myself. Name the key questions or signals inline. Walk through the decision process. End by stating which tool/approach the signals point to and why.

**Block 2 — Concrete trace:** Open with `Take \`[example]\`.` on its own line (blank line above it). Then embed the appropriate trace component (`:::trace-lr`, `:::trace-ps`, `:::trace`, `:::trace-map`, or `:::trace-ll`) to visualize the algorithm executing on that example. Always include a trace component here — never fall back to prose narration of each step.

#### `## 4. Key Patterns`

Cover 2 patterns that go beyond the building blocks — real problem variations the user will encounter. Follow this structure per pattern:

**Pattern: {Name}**

**When to use**: problem characteristics that indicate this pattern.

**How to think about it**: prose explanation of the key insight (not just what the code does, but *why* this approach works). Include a trace component or short mermaid chart if it makes the pattern visually clear — no TypeScript code blocks.

**Complexity**: Time and Space.

#### `## 5. Decision Framework`

**Concept Map** (Mermaid): show relationships between the core ideas of this topic — not a flowchart of steps.

```mermaid
graph TD
    {core idea} --> {property 1}
    {core idea} --> {property 2}
    ...
```

**Complexity table**: one table covering all key operations for this topic.

**Decision tree** (Mermaid): how to recognize which pattern applies. Should be actionable — each leaf names a specific technique.

**Recognition signals table**: problem keywords → technique.

**When NOT to use**: clear contrast with the alternative.

### Step 6: Validate Mermaid Charts

After writing sections with mermaid, run the validation script:

```bash
./.claude/skills/leet-mental/validate-mermaid.sh {slug}-fundamentals.md
```

Fix any syntax errors before producing the handoff contract.

### Step 7: Produce the Handoff Contract

Before handing off to `dsa-fundamentals-build`, produce a concise internal contract in working context with:

- Topic slug (lowercase, spaces → hyphens, e.g. `binary-trees`)
- Analogy name and 1-sentence description
- Vocabulary map: analogy term → DSA term for all three levels
- Three-level progression labels and what each level unlocks
- Pattern names from Section 4
- Primary visualization family (e.g. `:::trace-lr`) and example input for traces
- StackBlitz project name prefix

This contract is for orchestration, not a user-facing file.

## Writing Rules

- Stay in the analogy for all conceptual sections
- Do not generate TypeScript code blocks anywhere in the guide
- Do not draft step files or exercise `.ts` files
- Do not write `## 3. Building Blocks` or `## 6. Common Gotchas & Edge Cases`
- Do not introduce `Walking through it` subsections in generated fundamentals guides
- Do not add `# Title` heading or `> Phase / Prerequisites` blockquote at top — these render automatically
- `---` appears in exactly two places in the full guide: before `## 3. Building Blocks` and before `## 5. Decision Framework`. Do not use `---` within any section you write.
- Do not update `journey.ts`

## Quality Bar

The narrative is complete only if:

- someone can understand the topic and its core patterns before seeing any code
- the analogy supports every major operation naturally
- the trace component in `## 2` matches the actual primary data structure being taught
- the trace family chosen for the handoff contract is backed by a real component and markdown-renderer support
- the vocabulary map is concrete enough that `dsa-fundamentals-build` can use it verbatim in exercise file comments
- the three-level progression is implied by the mental model, even though it is not yet scaffolded
