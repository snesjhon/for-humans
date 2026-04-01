---
name: system-scenario
description: Use when asked to generate a system design scenario — a design challenge with brief, walkthrough, and evaluator prompt
tags: [system-design, scenario, learning]
---

# System Design Scenario Generator

Generate three files for a system design scenario: a requirements brief, a teaching walkthrough, and an evaluator prompt.

## When to Use

- Asked to generate a system design scenario or challenge
- Adding a new scenario to the system design learning path
- Rebuilding a missing scenario

Example: `/system-scenario Yogurt Ordering System` or `/system-scenario URL Shortener`

## Instructions

### Step 1: Read the Curriculum

1. Read `./lib/journey.ts` — find the scenario matching the request
2. Note which phase this scenario belongs to (determines difficulty and scope)
3. Read `./docs/00-complete-system-design-path.md` — understand prerequisite fundamentals the learner should know

### Step 2: Read Reference Examples

Read existing scenarios to match tone and structure:
- `./app/scenarios/yogurt-ordering-system/brief.md` — canonical brief example
- `./app/scenarios/yogurt-ordering-system/walkthrough.md` — canonical walkthrough example
- `./app/scenarios/yogurt-ordering-system/prompt.md` — canonical evaluator prompt example

### Step 3: Generate `brief.md`

**File**: `brief.md` — save to `./app/scenarios/{slug}/`

**Structure:**

```markdown
# {Scenario Title}

## Overview

{2-3 sentences: what is being built, what domain it lives in, why the design challenge is interesting}

- {key constraint or requirement 1}
- {key constraint or requirement 2}
- {key constraint or requirement 3}

## Functional Requirements

- {what the system must do — specific, concrete, numbered or bulleted}
- {include volume/scale hints only if they drive design decisions}

## What You Should Design

- {specific deliverable 1 — e.g., "An entity-relationship diagram covering..."}
- {specific deliverable 2 — e.g., "API endpoints for..."}
- {specific deliverable 3}

## Constraints

- {what is explicitly out of scope}
- {simplifying assumptions the learner can make}
```

Keep the brief tight — a real interview prompt. No hints, no walkthroughs, no answers.

### Step 4: Generate `walkthrough.md`

**File**: `walkthrough.md` — save to `./app/scenarios/{slug}/`

**Structure:**

```markdown
# {Scenario Title} — Walkthrough

## How to Approach This

### The Core Insight

{1-2 paragraphs: what's the non-obvious part of this design? What do most candidates get wrong? What's the key insight that separates a solid answer from a great one?}

### The Mental Model

{2-3 paragraphs: a concrete analogy that makes the design intuitive. Name what each system component maps to in the analogy. The analogy should make the tricky part (the core insight) obvious.}

### How to Decompose This in an Interview

Before drawing anything, ask yourself:
1. {key question 1}
2. {key question 2}
3. {key question 3}

{1 paragraph: what to start with and why — entities before API before scale}

## Building the Design

### Step 1: {First Design Decision}

{Teach the step. Explain why this comes first. Reference the analogy.}

> **What you're learning:** {one sentence on the transferable insight — the general principle this step teaches}

### Step 2: {Second Design Decision}

...

### Step N: {Final Step}

...
```

Teaching voice throughout. Each step explains the *why*, not just the *what*. Reference the analogy from the mental model section. End with a reflective question inside an `:::evaluator` block:

```
:::evaluator
You've {completed the scenario}. Before checking your work: {a conceptual question that prompts reflection on the core insight}.
:::
```

### Step 5: Generate `prompt.md`

**File**: `prompt.md` — save to `./app/scenarios/{slug}/`

**No frontmatter** for system design scenarios (unlike fullstack scenarios).

**Structure:**

```markdown
You are evaluating a learner's {scenario title} system design.

## Scope

This is a Phase {N} ({Phase Name}) scenario. Evaluate:
- {what is in scope — specific design elements}
- {what is in scope}

Do not evaluate {what is explicitly out of scope}.

## Rubric

A strong design should cover:
- [ ] {criterion 1 — specific, checkable}
- [ ] {criterion 2}
- [ ] {criterion 3}
- [ ] {criterion 4}
- [ ] {criterion 5}

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
```

The rubric checkboxes must be specific enough to check unambiguously — not "good database design" but "uses a junction table for the Order-Topping relationship". The `followUp` is a question to ask the learner based on what they got right or nearly right.

### Step 6: Confirm Output

Report:
```
✅ Generated: {Scenario Title}
📁 Files:
   - app/scenarios/{slug}/brief.md
   - app/scenarios/{slug}/walkthrough.md
   - app/scenarios/{slug}/prompt.md
```

## Content Guidelines

- **Brief is the challenge**: no hints, no answers, no structure hints — treat it like a real interview prompt
- **Walkthrough teaches transferable principles**: each step surfaces a general insight, not just "here's the answer to this specific problem"
- **Rubric is unambiguous**: each checkbox is a concrete, verifiable claim about the design
- **JSON output format is strict**: the evaluator responds ONLY with valid JSON — no prose, no markdown
- **Analogy consistency**: use the same analogy throughout brief → walkthrough → prompt
