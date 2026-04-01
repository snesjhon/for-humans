---
name: fullstack-scenario
description: Use when asked to generate a fullstack scenario — a real Rails build task for the chess app with brief, walkthrough, and evaluator prompt
tags: [fullstack, rails, scenario, chess, learning]
---

# Fullstack Scenario Generator

Generate three files for a chess app build scenario: a build task brief, a teaching walkthrough, and a CheckWork evaluator prompt. The evaluator reads actual files from the learner's local chess app directory.

## When to Use

- Asked to generate a fullstack scenario or build task
- Adding a new scenario to the fullstack learning path
- Rebuilding a missing scenario

Example: `/fullstack-scenario Set Up the Rails API` or `/fullstack-scenario Add User Authentication`

## Key Difference from System Design Scenarios

The `prompt.md` for fullstack scenarios has **YAML frontmatter** with a `files:` list. The `CheckWork` component reads those files from the learner's local chess app directory and sends them to Claude for evaluation. Always include the exact file paths the evaluator needs to read.

## Instructions

### Step 1: Read the Curriculum

1. Read `./lib/journey.ts` — find the scenario matching the request
2. Note the phase (Novice / Studied / Expert) — determines scope and complexity
3. Identify what fundamentals the learner should have completed before this scenario

### Step 2: Read Reference Examples

Read existing scenarios to match tone and structure:
- `./app/scenarios/setup-rails-api/brief.md` — canonical brief
- `./app/scenarios/setup-rails-api/walkthrough.md` — canonical walkthrough
- `./app/scenarios/setup-rails-api/prompt.md` — canonical evaluator prompt with `files:` frontmatter

### Step 3: Generate `brief.md`

**File**: `brief.md` — save to `./app/scenarios/{slug}/`

**Structure:**

```markdown
# {Scenario Title}

## Overview

{2-3 sentences: what the learner is building, why it matters for the chess app, what's interesting about this task}

- {key requirement or constraint 1}
- {key requirement or constraint 2}
- {key requirement or constraint 3}

## What You Should Build

- {specific deliverable 1 — concrete and checkable}
- {specific deliverable 2}
- {specific deliverable 3}

## Constraints

- {what is explicitly out of scope — "do not add X yet — that comes in the next scenario"}
- {simplifying assumptions}
- {naming or configuration conventions to follow}
```

Keep it tight — a real task brief. No hints, no walkthroughs, no answers. The constraint section often prevents scope creep into future scenarios.

### Step 4: Generate `walkthrough.md`

**File**: `walkthrough.md` — save to `./app/scenarios/{slug}/`

**Structure:**

```markdown
# {Scenario Title} — Walkthrough

## How to Approach This

### The Core Insight

{1-2 paragraphs: what's the non-obvious part of this build task? What do most learners get wrong? What's the key insight that separates a careful setup from a sloppy one?}

### The Mental Model

{2-3 paragraphs: a concrete analogy that makes the task intuitive. Connect to the chess app context. The analogy should make the core insight obvious.}

### How to Decompose This

Before running a single command, ask yourself:
1. {key question 1}
2. {key question 2}
3. {key question 3}

{1 paragraph: what to start with and why}

## Building the Setup

### Step 1: {First Action}

{Teach the step. Explain why this step comes before others. Show the exact command if applicable.}

> **What you're learning:** {one sentence on the transferable principle this step teaches}

### Step 2: {Second Action}

...

### Step N: {Final Step}

...
```

Close with a reflective question inside an `:::evaluator` block:

```
:::evaluator
You've {completed the scenario}. Before checking your work: {a conceptual question prompting reflection on the core insight — not a "did you do X" question, but a "why does X work this way" question}.
:::
```

Teaching voice throughout. Each step explains the *why*. Reference the analogy from the mental model. The `:::evaluator` question should make the learner think before they hit "Check Work".

### Step 5: Generate `prompt.md`

**File**: `prompt.md` — save to `./app/scenarios/{slug}/`

**YAML frontmatter is required.** List every file the evaluator needs to read from the learner's chess app. Use paths relative to the chess app root:

```markdown
---
files:
  - {relative/path/to/file1}
  - {relative/path/to/file2}
  - {relative/path/to/file3}
---

You are evaluating a learner's {scenario title} implementation for the chess learning app.

## Scope

This is a Phase {N} ({Phase Name}) task. Evaluate:
- {what is in scope — specific files and behaviors}
- {what is in scope}

Do not evaluate {what is explicitly out of scope}.

## Rubric

A strong setup should cover:
- [ ] {criterion 1 — specific, checkable from the listed files}
- [ ] {criterion 2}
- [ ] {criterion 3}
- [ ] {criterion 4}
- [ ] {criterion 5}

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
```

**Files frontmatter rules:**
- Include only files that exist after this scenario is complete
- Use exact paths relative to the chess app root (e.g., `config/database.yml`, `app/controllers/health_controller.rb`)
- Include the files that most directly demonstrate whether the rubric criteria are met
- Typically 3-6 files — enough to evaluate, not so many the context is wasted

**Rubric rules:**
- Each checkbox must be verifiable from the listed files — not "good code quality" but "health action renders JSON with a status key"
- Scope is strictly bounded — the evaluator should not penalize for missing things from future scenarios
- The `followUp` question in the JSON output is asked when the learner gets most things right — it deepens understanding of the core insight

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

- **Chess app context throughout**: every example, command, and explanation connects to building the chess learning app
- **Brief is a task, not a tutorial**: no hints, no structure suggestions, no walkthroughs — treat it like a real ticket
- **Walkthrough teaches transferable Rails principles**: each step surfaces a general insight, not just "here's what to type"
- **Files frontmatter is load-bearing**: the `CheckWork` component reads exactly these files — wrong paths = broken evaluator
- **Rubric criteria are file-checkable**: each criterion must be verifiable by reading the listed files
- **JSON output is strict**: the evaluator responds ONLY with valid JSON — no prose, no markdown
- **:::evaluator block**: always end the walkthrough with one reflective question — it runs before the learner clicks "Check Work"
