---
name: fullstack-fundamentals
description: Use when asked to generate a foundations guide for a Rails/fullstack topic on the fullstack learning path
tags: [fullstack, rails, fundamentals, learning]
---

# Fullstack Foundations Guide Generator

Generate a foundations concept guide + Socratic evaluator prompt for a Rails/fullstack topic. Two output files per topic.

## When to Use

- Asked to generate a foundations guide for a Rails or fullstack topic (rails new, ActiveRecord, routing, etc.)
- Adding a new topic to the fullstack learning path
- Rebuilding a missing foundations guide

Example: `/fullstack-fundamentals ActiveRecord Associations` or `/fullstack-fundamentals Rails Routing`

## Instructions

### Step 1: Read the Curriculum

1. Read `./lib/journey.ts` — find the section matching the requested topic
2. Note which phase (Novice / Studied / Expert) and what prerequisites apply
3. Understand the chess app context: this is a Rails API backend for a chess learning application — all examples should connect to building the chess app

### Step 2: Read a Reference Guide

Read an existing guide to match tone and structure:
- `./app/fundamentals/rails-new/rails-new-fundamentals.md` — canonical reference

### Step 3: Generate the Foundations Guide

**File**: `{slug}-fundamentals.md` — save to `./app/fundamentals/{slug}/`

**Do NOT** include a `# Title` heading at the top — the page renders the title automatically. Start directly with `## Overview`.

**Structure:**

#### Overview
2-3 sentences: what this topic is, why it matters for building the chess app, what the three building-block levels will cover.

#### Core Concept & Mental Model

Open with a concrete real-world analogy (2-4 sentences) that makes the topic intuitive. Name what each Rails concept maps to in the analogy. The analogy should persist throughout all three building-block levels.

Two subsections:

**Understanding the Analogy**
Named subsections using analogy vocabulary — no Rails/Ruby terminology:
- **The Setup** — what we have, what we're trying to accomplish
- **[Key mechanism(s)]** — the central concept through the analogy
- **Why This Approach** — why does this design work?

Zero code in this subsection.

**How I Think Through This**
Two blocks. First-person prose.

Block 1 — Recognition walkthrough: when I encounter this situation in the chess app, here's what I ask myself and decide.

Block 2 — Concrete trace: "Take `[chess app example]`." then show the decision/process step by step.

---

#### Building Blocks — Progressive Learning

Three levels. Each level uses this exact structure:

**Level N: {Name}**

**Why this level matters**
One paragraph: why you need this concept, what it enables in the chess app.

**How to think about it**
One or two paragraphs: the mental model. No code yet. Reference the analogy. Connect explicitly to the chess app.

**Walking through it**
Step-by-step trace on a concrete chess app example. Show the exact commands or steps. Use a code block where a command is the clearest explanation (e.g., `rails new chess-learning --api -d postgresql`).

**The one thing to get right**
One or two sentences: the key insight or common mistake for this level. Show the consequence of getting it wrong.

**Diagram or Example** (optional but preferred)
A Mermaid diagram for structural concepts (model relationships, request flow), or a labeled directory tree for filesystem concepts.

**Mental anchor**
One sentence in a blockquote:
> "The mental anchor for this level."

**→ Bridge to Level N+1**
One sentence: what problem this level can't solve, and how the next level addresses it.

---

#### Key Patterns

2-3 patterns beyond the building blocks — real Rails patterns the learner will use when building the chess app.

**Pattern: {Name}**

**When to use**: situation in the chess app where this pattern applies.

**How to think about it**: prose + code block showing the pattern. Keep code concrete — use chess app models and controllers.

**Common mistake**: what goes wrong without this pattern.

---

#### Decision Framework

**Concept Map** (Mermaid `graph TD`): how the key concepts of this topic relate to each other.

**Quick Reference**: a table or bullet list of the most common operations for this topic (commands, methods, flags).

**When to use each approach**: comparison of the main options with trade-offs.

---

#### Common Mistakes

3-5 mistakes, each with:
- What goes wrong
- Why it's tempting  
- How to fix it

Edge cases specific to the chess app context.

---

### Step 4: Generate the Evaluator Prompt

**File**: `prompt.md` — save to `./app/fundamentals/{slug}/`

**No frontmatter** — plain markdown.

**Structure — one `## Level N:` section per building-block level:**

```markdown
## Level 1: {Level Name}

You are evaluating a learner's understanding of {specific concept at this level}.

## Scope
Ask only about {what's in scope for this level}. Do not ask about {what's out of scope} — redirect if the user raises those topics.

## Rubric
A strong answer should:
- [ ] {criterion 1 — specific and verifiable}
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

Each level's rubric has 4-6 checkboxes. Scope is strictly bounded — the evaluator redirects if the user goes outside the current level. Questions should be Socratic — prompt the learner to explain their reasoning, not just recite facts.

### Step 5: Confirm Output

Report:
```
✅ Generated: {Topic} Foundations Guide
📁 Files:
   - app/fundamentals/{slug}/{slug}-fundamentals.md
   - app/fundamentals/{slug}/prompt.md
```

## Content Guidelines

- **Chess app context**: all examples connect to the chess learning app — use chess-specific models, routes, and commands in traces
- **Commands are code**: use code blocks for `rails` commands and Ruby/Rails syntax — this is a build topic, code is essential
- **Analogies carry through**: the analogy from the Core Concept section must appear in every Building Block level
- **Progressive difficulty**: Novice level = the basic command or concept; Studied = configuration and options; Expert = edge cases and internals
- **Tone**: plain, direct — treat the learner as someone who has programmed before but hasn't used Rails
- **Prose explains why**: every code block or command should be surrounded by prose that explains why it works that way, not just what it does
