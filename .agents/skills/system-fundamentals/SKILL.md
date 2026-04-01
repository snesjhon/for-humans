---
name: system-fundamentals
description: Use when asked to generate a system design fundamentals guide for a topic on the system design learning path
tags: [system-design, fundamentals, learning]
---

# System Design Fundamentals Guide Generator

Generate a fundamentals guide + evaluator prompt for a system design topic. Two output files per topic.

## When to Use

- Asked to generate a fundamentals guide for a system design topic (API design, databases, caching, etc.)
- Adding a new topic to the system design learning path
- Rebuilding a missing fundamentals guide

Example: `/system-fundamentals API Design` or `/system-fundamentals Data Modeling`

## Instructions

### Step 1: Read the Curriculum

1. Read `./lib/journey.ts` — find the section matching the requested topic
2. Read `./docs/00-complete-system-design-path.md` — understand where the topic sits in the full path
3. Note prerequisites (sections that appear before this one in JOURNEY)

### Step 2: Read a Reference Guide

Read an existing fundamentals guide before writing to match tone and structure. Use:
- `./app/fundamentals/api-design/api-design-fundamentals.md` — canonical reference

### Step 3: Generate the Fundamentals Guide

**File**: `{slug}-fundamentals.md` — save to `./app/fundamentals/{slug}/`

**Do NOT** include a `# Title` heading at the top. The page renders the title automatically. Start directly with `## Overview`.

**Structure:**

#### Overview
2-3 sentences: what this topic is, why it matters in system design, what the three building-block levels will cover.

#### Core Concept & Mental Model
Open with a concrete real-world analogy (2-4 sentences). Name what each system design concept maps to in the analogy.

Two subsections:

**Understanding the Analogy**
Named subsections using analogy vocabulary only — no technical jargon:
- **The Setup** — what we have, what we're trying to accomplish, what the constraints are
- **[Key mechanism(s)]** — explain the central concepts through the analogy
- **Why This Approach** — why does this design work? what would be worse?

Zero code in this subsection. Pure conceptual understanding.

**How I Think Through This**
Two blocks, no subsections, no code.

Block 1 — Recognition walkthrough: First-person prose. When I see a problem of this type, here's what I ask myself. Walk through the decision process.

Block 2 — Concrete trace: "Take `[example]`." then show the design decision playing out step by step.

---

#### Building Blocks — Progressive Learning

Three levels. Each level uses this exact structure:

**Level N: {Name}**

**Why this level matters**
One paragraph: why you need this concept, what problem it solves.

**How to think about it**
One or two paragraphs: the mental model in plain language. No code. Reference the analogy from the Core Concept section.

**Walking through it**
Manual trace on a small, concrete example. Show state at each decision point. Plain prose or a table — the reader should be able to follow along without any tools.

**The one thing to get right**
One or two sentences identifying the key insight or gotcha for this level. Show the consequence of getting it wrong.

**Concept diagram** (Mermaid)
A diagram that makes this level's pattern visually clear — use `graph TD` or `graph LR`. Show relationships, not step-by-step execution.

**Mental anchor**
One sentence in a blockquote:
> "The mental anchor for this level."

**→ Bridge to Level N+1**
One sentence: what problem the current level can't solve, and how the next level addresses it.

---

#### Key Patterns

2-3 patterns that go beyond the building blocks — real design variations candidates encounter.

**Pattern: {Name}**

**When to use**: problem characteristics that indicate this pattern.

**How to think about it**: prose explanation of the key insight. Include a mermaid diagram if helpful.

**Trade-offs**: what you gain, what you give up.

---

#### Decision Framework

**Concept Map** (Mermaid `graph TD`): relationships between the core ideas of this topic — not a flowchart of steps.

**Comparison table**: key options for this topic (e.g., SQL vs NoSQL, REST vs GraphQL) with trade-offs.

**Decision tree** (Mermaid): how to choose between approaches. Each leaf names a specific technique or design choice.

**Recognition signals**: problem characteristics → recommended approach (table or bullet list).

**When NOT to use this approach**: clear contrast with the alternative.

---

#### Common Mistakes

3-5 mistakes, each with:
- What goes wrong
- Why it's tempting
- How to fix it

Edge cases and debugging tips.

---

### Step 4: Generate the Evaluator Prompt

**File**: `prompt.md` — save to `./app/fundamentals/{slug}/`

**No frontmatter** — plain markdown.

**Structure — one `## Level N:` section per building-block level:**

```markdown
## Level 1: {Level Name}

You are evaluating a learner's understanding of {specific concept at this level}.

## Scope
Ask only about {what's in scope}. Do not ask about {what's out of scope} — redirect if the user raises those topics.

## Rubric
A strong answer should:
- [ ] {criterion 1}
- [ ] {criterion 2}
- [ ] {criterion 3}
- [ ] {criterion 4}
- [ ] {criterion 5}

---

## Level 2: {Level Name}

...

---

## Level 3: {Level Name}

...
```

Each level's rubric has 4-6 checkboxes covering the key concepts a strong answer must demonstrate. Scope is strictly bounded — the evaluator redirects if the user goes outside the current level.

### Step 5: Confirm Output

Report:
```
✅ Generated: {Topic} Fundamentals Guide
📁 Files:
   - app/fundamentals/{slug}/{slug}-fundamentals.md
   - app/fundamentals/{slug}/prompt.md
```

## Content Guidelines

- **Prose first**: explanations do the teaching, diagrams make it visual
- **No code blocks in the guide**: system design fundamentals are conceptual — diagrams and prose only
- **Analogy vocabulary throughout**: use the analogy from Section 2 consistently across all three Building Block levels
- **Progressive difficulty**: each level solves exactly one new problem the previous level couldn't handle
- **Concrete examples**: always trace through a real-world scenario, not an abstract one
- **Tone**: plain, direct, progressive — build confidence with each level
