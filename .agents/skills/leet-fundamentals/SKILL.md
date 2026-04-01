---
name: leet-fundamentals
description: Generate foundational concept guides for DSA topics with progressive learning structure
tags: [leetcode, dsa, fundamentals, learning]
---

# LeetCode Fundamentals Guide Generator

Generate comprehensive foundational guides for DSA topics that build deep conceptual understanding through progressive learning.

## When to Use

Use this skill when:

- Starting a new topic in your DSA learning path
- Need to build foundational understanding before solving problems
- Want concept maps and mental models for a topic
- Looking for annotated code templates and patterns

Example: `/leet-fundamentals Binary Trees` or `/leet-fundamentals Sliding Window`

## Instructions

You are generating a **foundational concept guide** that helps the user build deep understanding of a DSA topic through progressive learning.

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
4. If found, note the path for linking in the guide

### Step 3: Generate Comprehensive Guide

**Reference example**: `./app/fundamentals/graphs/graphs-fundamentals.md` and `./app/fundamentals/graph-traversal-dfs/graph-traversal-dfs-fundamentals.md` are the canonical examples of this style. Read them before generating to match the tone, depth, and structure.

Create a guide following this structure:

**Important**: Do NOT include a `# Title` heading or a `> Phase / Prerequisites` blockquote at the top of the guide. The page renders the title, phase, and prerequisites automatically from journey data. Start the guide directly with `## 1. Overview`.

**Horizontal rules (`---`)**: Use `---` in exactly two places in the generated guide: immediately before `## 3. Building Blocks` (signaling the shift from conceptual to hands-on) and immediately before `## 5. Decision Framework` (signaling the shift to reference material). Everywhere else, sections flow directly into one another with no divider. Never place `---` between subsections within a section.

#### 1. Overview

- 2-3 sentences: what this topic is and why it matters
- One sentence on what the user already knows that connects to this topic
- What the three building-block levels will cover

#### 2. Core Concept & Mental Model

Open with a concrete real-world analogy (city map, assembly line, maze, etc.) — 2-4 sentences establishing the core metaphor. Name what each algorithmic concept maps to in the analogy.

Then two subsections, modeled on `leet-mental`:

##### Understanding the Analogy

Named subsections — use the analogy vocabulary exclusively, no variable names or TypeScript:

- **The Setup** — what do we have, what are we trying to accomplish, what are the constraints?
- **[Key mechanism(s)]** — explain the central techniques through the analogy. Cover what makes each one work and what would go wrong without it. 1-2 subsections depending on how many techniques the topic has.
- **Why These Approaches** — why does this strategy work? What would be worse? What makes it efficient?

**This subsection has zero code.** It exists so the reader fully understands the approach conceptually before any implementation appears.

##### How I Think Through This

**Two logical blocks. No subsections. No code.**

**Block 1 — Recognition walkthrough:** First-person prose. When I see a problem of this type, here's what I ask myself. Name the key questions or signals inline. Walk through the decision process. End by stating which tool/approach the signals point to and why.

**Block 2 — Concrete trace:** Open with "Take `[example]`." on its own line (blank line above it). Then embed the appropriate trace component (`:::trace-lr`, `:::trace-ps`, or `:::trace`) to visualize the algorithm executing on that example. Always include a trace component here — never fall back to prose narration of each step.

---

#### 3. Building Blocks — Progressive Learning

Each level has this exact structure — do not skip any part:

**Level N: {Name}**

**Why this level matters**
One paragraph: why you need this concept, what problem it solves, how it connects to what came before.

**How to think about it**
One or two paragraphs: the mental model in plain language. No code yet. Explain what the algorithm is *doing*, not just what it *is*. Reference the analogy from Section 2.

**Walking through it**
A manual step-by-step trace on a small, concrete example. Show the state at every step — visited sets, queues, distances, paths, colors, etc. Use plain text tables or indented steps, not code. The reader should be able to follow along with pencil and paper.

**The one thing to get right**
One or two sentences identifying the single most important insight, gotcha, or ordering constraint for this level. Then show the consequence of getting it wrong (wrong output, infinite loop, etc.).

**Visualization** — instead of a TypeScript code block, use a trace component or mermaid chart to make the level's pattern visually obvious. See "Visualization Guidelines" below for which component to use. The StackBlitz embed is where the learner writes the code — the visualization primes their intuition before they open the editor.

Each level has exactly one multi-exercise embed. The embed uses the `exercises` and `solutions` attributes (comma-separated filenames). This renders a single embed with tabs: `Exercise 1 | Exercise 1 Solution | Exercise 2 | Exercise 2 Solution | Exercise 3 | Exercise 3 Solution`.

`step` is the level number (1, 2, or 3) and `total` is always 3.

:::stackblitz{step=N total=3 exercises="stepN-exercise1-problem.ts,stepN-exercise2-problem.ts,stepN-exercise3-problem.ts" solutions="stepN-exercise1-solution.ts,stepN-exercise2-solution.ts,stepN-exercise3-solution.ts"}

**Mental anchor** — one sentence in a blockquote that the reader can memorize:
> "DFS = go deep, mark first, backtrack. The visited set is the only thing stopping cycles from looping forever."

**→ Bridge to Level N+1**
One sentence explaining *why* the next level exists: what problem the current level can't solve, and how the next level addresses it.

#### 4. Key Patterns

Cover 2 patterns that go beyond the building blocks — real problem variations the user will encounter. Follow this structure per pattern:

**Pattern: {Name}**

**When to use**: problem characteristics that indicate this pattern.

**How to think about it**: prose explanation of the key insight (not just what the code does, but *why* this approach works). Include a trace component or short mermaid chart if it makes the pattern visually clear — no TypeScript code blocks.

**Complexity**: Time and Space.

---

#### 5. Decision Framework

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

---

#### 6. Common Gotchas & Edge Cases

- 3-5 mistakes, each with: what goes wrong, why it's tempting, how to fix it
- Edge cases list
- Debugging tips (what to print/trace, how to spot the failure)

### Visualization Guidelines

**Decision rule:** When visualizing *how code executes* (pointer movement, array mutation, cursor advancing, pass direction), use a trace component. When visualizing *conceptual structure* (decision trees, algorithm topology, concept relationships), use mermaid. Never use mermaid to show step-by-step code execution — that's what trace components are for. Never use static TypeScript code blocks in the generated guide — StackBlitz is where the learner reads and writes code.

#### Trace Components (for step-by-step code execution)

Three components are available. Each is a fenced block: open with `:::trace`, `:::trace-lr`, or `:::trace-ps`, place a JSON array, close with `:::`.

**`:::trace-lr`** — Two-pointer / cursor scan over a sequence

Use when: one or two pointers move through a string or array (two-pointer, sliding window, cursor-based scan).

```
:::trace-lr
[
  {"chars": ["a","b","c"], "L": 0, "R": 2, "action": "match", "label": "..."},
  ...
]
:::
```

| Field | Type | Meaning |
|-------|------|---------|
| `chars` | `string[]` | The cells to display |
| `L` | `number` | Left pointer index |
| `R` | `number` | Right pointer index (set `L === R` for single cursor) |
| `action` | `"match" \| "mismatch" \| "done" \| null` | Visual state of highlighted cells |
| `label` | `string` | Analogy-based explanation of this step |

**`:::trace-ps`** — Prefix/suffix pass with accumulator

Use when: the algorithm makes two passes (forward then backward) building a result array.

```
:::trace-ps
[
  {"nums": [1,2,3,4], "result": [1,0,0,0], "currentI": 0, "pass": "forward", "accumulator": 1, "accName": "prefix", "label": "..."},
  ...
]
:::
```

| Field | Type | Meaning |
|-------|------|---------|
| `nums` | `number[]` | Input array |
| `result` | `number[]` | Output array being built |
| `currentI` | `number` | Active index (`-1` = no highlight) |
| `pass` | `"forward" \| "backward" \| "done"` | Pass direction badge |
| `accumulator` | `number` | Current running value |
| `accName` | `"prefix" \| "suffix" \| ""` | Label shown next to accumulator |
| `label` | `string` | Step description |

**`:::trace`** — Read/write cursor over an array

Use when: a reader pointer scans forward while a writer pointer lags behind, compacting an array in-place.

```
:::trace
[
  {"array": [1,1,2,3], "reader": 1, "writer": 1, "action": "skip", "label": "..."},
  ...
]
:::
```

| Field | Type | Meaning |
|-------|------|---------|
| `array` | `number[]` | The array being processed |
| `reader` | `number` | Read-head index |
| `writer` | `number` | Write-head index |
| `action` | `"keep" \| "skip" \| "done" \| null` | Disposition of the current element |
| `label` | `string` | Step description |

#### Mermaid (for conceptual/mental structure only)

**USE MERMAID FOR:**
- Concept maps (Section 2, Section 5)
- Decision trees for pattern recognition (Section 5)
- Algorithm topology (tree shape, graph structure, state machines)

**DO NOT use mermaid** to show a pointer moving through an array or a cursor advancing — use a trace component instead. Do not use mermaid to show "what the code does step by step."

### Step 4: Save the Guide

1. Create slug and filename from topic:
   - Convert to lowercase
   - Replace spaces with hyphens
   - Slug example: "Binary Trees" → `binary-trees`
   - Filename: `{slug}-fundamentals.md` → `binary-trees-fundamentals.md`

2. Save to: `./app/fundamentals/{slug}/{filename}`
   - Example: `./app/fundamentals/binary-trees/binary-trees-fundamentals.md`

4. Confirm successful save

---

### Step 5: Generate Paired Step Files

For each building-block level, create a **paired** `stepN-problem.ts` + `stepN-solution.ts` in a subdirectory named after the topic slug.

**Directory**: `./app/fundamentals/{topic-slug}/`
- Example: "Graph Traversal DFS" → `./app/fundamentals/graph-traversal-dfs/`
- The slug must exactly match the `fundamentalsSlug` field in `journey.ts` — this is what the platform uses to serve files via the API.

**File naming**: `stepN-exerciseM-problem.ts` + `stepN-exerciseM-solution.ts`

- N = level number (1, 2, 3 — matches the Building Block level)
- M = exercise number within that level (1, 2, 3)
- Example for Level 1: `step1-exercise1-problem.ts`, `step1-exercise1-solution.ts`, `step1-exercise2-problem.ts`, etc.

With 3 levels × 3 exercises = **9 pairs (18 files total)** per guide.

**How the embed is wired**: The fundamentals page passes `fundamentalsSlug` to `MarkdownRenderer`, which passes `base="fundamentals"` to `WebContainerEmbed`, which fetches from `/api/step-file?slug={fundamentalsSlug}&file={file}&base=fundamentals`. Files are resolved as `app/fundamentals/{slug}/{file}`. No extra wiring needed — just place the files in the correct directory.

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
```

**Rules for problem files**:
- One function per file — the file title, goal, and all tests are for that one exercise
- Function body throws `new Error('not implemented')` — the user fills it in
- Tests use the **thunk form** `() => functionName(input)` so `Error('not implemented')` is caught and prints `TODO`
- For void/in-place functions, put the mutation call inside the thunk: `() => { const a = [...]; fn(a); return a; }`
- Test cases: 4-6 per file, covering normal, edge (empty, single), and boundary conditions
- The `test()` helper goes under `// ─── Helpers ───` at the bottom (auto-folded in the editor)
- Exercises within a level progress: basic → variation → combined/harder
- **No LeetCode duplicates**: Before finalizing any exercise, check whether the same problem already exists in `app/problems/`. If a problem page covers it, replace that exercise with a novel variant — the exercises exist to build the mental model, not re-do problems the user will encounter later on the path.
- **Use the level's analogy vocabulary**: Comments in the exercise header must use the same language as the corresponding Building Block level in the guide (e.g. "scanner/stamper" for write-cursor levels, "left inspector/right inspector" for two-pointer levels, "left messenger/right messenger" for prefix-suffix levels). Technical names like `r`, `w`, `L`, `R` belong in code — not in the description prose. The exercise title should also reflect the analogy (e.g. "Stamp the Keepers", "Swap the Inspectors") not just the function name.

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function test(...) { /* identical to problem file */ }
```

---

### Step 5b: Validate Step Files

Run all pairs from the topic subdirectory. All must exit 0.

```bash
cd app/fundamentals/{topic-slug}/

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
# ... repeat for all 9 pairs

# Level 3
npx tsx step3-exercise3-problem.ts
npx tsx step3-exercise3-solution.ts
```

If any solution file exits non-zero or prints FAIL lines, fix it before proceeding.

---

### Step 6: Update journey.ts

After saving the guide and exercise files, wire it into the learning path so the homepage shows a live "Read the guide" card instead of "Coming soon".

1. Read `./lib/journey.ts`
2. Find the `JourneySection` where `section.id` matches the topic slug
   - Topic slug = the same value used for the filename (lowercase, spaces → hyphens)
   - Example: "Arrays & Strings" → `arrays-strings`; "Graph Traversal — DFS" → `graph-traversal-dfs`
3. Check whether `fundamentalsSlug` is already set on that section and matches the slug
4. **If `fundamentalsSlug` is missing or wrong**: use the Edit tool to add it after the `analogies` array:
   ```
   fundamentalsSlug: '{slug}',
   ```
5. **If `fundamentalsBlurb` is also missing**: add a one-sentence description of what the guide covers right after `fundamentalsSlug`:
   ```
   fundamentalsBlurb: '{one sentence — what the learner gets from this guide before writing problem code}',
   ```
6. Confirm the section now has both fields set. The platform will immediately show the guide card on the homepage.

**Note**: If the section already has both fields set correctly, skip — no edit needed.

---

### Validating Mermaid Charts

**CRITICAL: Always validate charts before completion**

After creating a mental model with mermaid charts, you MUST validate them:

```bash
# Run the validation script on your mental-model.md file
./.claude/skills/leet-mental/validate-mermaid.sh {filename}.md
```

The script will:

1. Extract all mermaid blocks from the markdown file
2. Validate basic syntax (diagram type, structure, common errors)
3. Report which charts pass syntax validation
4. Exit with error code if any chart has syntax errors

**Validation workflow:**

1. Create mental-model.md with mermaid charts
2. Run validation script
3. If errors found: fix the mermaid syntax and re-run
4. Only consider the file complete when all charts pass validation

**Note:** This performs basic syntax validation without rendering. Charts should still be visually verified in GitHub, Obsidian, or other markdown viewers.

---

## Output After Generation

After generating and saving the guide, provide:

```markdown
✅ **Generated**: {topic} Fundamentals Guide

📁 **Saved to**: `app/fundamentals/{slug}/{filename}`

📊 **Guide Includes**:

- {n} Key Patterns with annotated templates
- {n} Mermaid diagrams (concept maps & decision trees)
- {n} Practice problems from your DSA path
- {n} Existing study guides linked

🎯 **Prerequisites**: {list them}

💡 **Next Steps**:

1. Read through "Core Concept & Mental Model" to build intuition
2. Work through "Building Blocks" progressively
3. Study the key patterns and their templates
4. Practice with the problems in suggested order

Ready to dive in? Start with the 'Building Blocks' section! 🚀
```

---

## Important Guidelines

- **Prose first, visualizations second**: the explanations ("Why this level matters", "How to think about it", "Walking through it") do the teaching. Trace components make the steps visible — no static TypeScript code blocks in the guide. The learner writes code in StackBlitz, not reads it on the page.
- **No TypeScript code blocks in the generated guide**: do not include ` ```typescript ` blocks anywhere in the markdown output. Visualizations use trace components; conceptual structure uses mermaid. Code lives exclusively in the StackBlitz exercise files.
- **No `---` between sections**: horizontal rules appear in exactly two places — before `## 3. Building Blocks` and before `## 5. Decision Framework`. All other sections flow directly into one another.
- **Trace components over prose traces**: for Building Blocks levels, use `:::trace`, `:::trace-lr`, or `:::trace-ps` to show pointer movement, pass direction, and array state — not a text table or indented bullet list.
- **Depth**: focused fundamentals (aim for 30-45 min read time)
- **Code Language**: TypeScript (exercise files only)
- **Visualizations**: Use trace components for algorithm execution. Use mermaid for concept maps (Section 2) and decision trees (Section 5) only. See "Visualization Guidelines" above.
- **Tone**: plain, direct, progressive. Build confidence with each level.
- **Links**: always link to existing fundamentals guides for prerequisites, and to existing study guides for practice problems
- **Progression**: each level solves exactly one new problem the previous level couldn't handle. Name that problem explicitly in the bridge sentence.
- **Step files**: always generate paired `stepN-problem.ts` + `stepN-solution.ts` alongside the markdown guide (Step 5). Leave all problem file implementations as `throw new Error('not implemented')` — never fill them in. Solution files must all print PASS.

---

## Example Invocations

```bash
/leet-fundamentals Binary Trees
/leet-fundamentals Sliding Window
/leet-fundamentals Dynamic Programming
/leet-fundamentals Two Pointers
/leet-fundamentals Graphs
```

The skill will:

1. Find the topic in the DSA path
2. Extract all relevant information
3. Check for existing study guides
4. Generate a comprehensive, progressive guide
5. Save to `ysk/fundamentals/`
6. Provide a summary and next steps
