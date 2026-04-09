# thinkdeep — Claude Code Guide

## Project Overview

A Next.js 14 DSA learning platform. Content is organized into three directories:

- `app/dsa/problems/{id}-{slug}/` — Problem mental models and test cases
- `app/patterns/*.md` — Pattern concept guides
- `app/dsa/fundamentals/{slug}/{slug}-fundamentals.md` — Fundamentals guides

The learning path (phases, sections, problems) is defined in `lib/journey.ts`.

## Skills

This repo includes Claude skills for generating content. They live in `./.claude/skills/`:

| Skill | File | Purpose |
|-------|------|---------|
| `leet-mental` | `./.claude/skills/leet-mental/SKILL.md` | **Deprecated** — use `dsa-problem` |
| `leet-fundamentals` | `./.claude/skills/leet-fundamentals/SKILL.md` | **Deprecated** — use `dsa-fundamentals` |
| `dsa-problem` | `./.claude/skills/dsa-problem/SKILL.md` | Orchestrate full problem packages (mental model + steps + solution) |
| `dsa-intuition` | `./.claude/skills/dsa-intuition/SKILL.md` | Narrative phase for problems (analogy, trace, misconceptions) |
| `dsa-build-algorithm` | `./.claude/skills/dsa-build-algorithm/SKILL.md` | Builder phase for problems (steps, solution, validation) |
| `dsa-fundamentals` | `./.claude/skills/dsa-fundamentals/SKILL.md` | Orchestrate full fundamentals guides (narrative + scaffold + validation) |
| `dsa-fundamentals-narrative` | `./.claude/skills/dsa-fundamentals-narrative/SKILL.md` | Narrative phase for fundamentals (analogy, overview, patterns, decision framework) |
| `dsa-fundamentals-build` | `./.claude/skills/dsa-fundamentals-build/SKILL.md` | Builder phase for fundamentals (3 levels, 18 exercise files, validation) |

When asked to generate a mental model, study guide, or fundamentals guide — read the relevant skill file first before starting.

## Content Paths

When generating content, always use these project-relative paths:

- **Problem output**: `./app/dsa/problems/{id}-{slug}/`
- **Fundamentals output**: `./app/dsa/fundamentals/`
- **Mermaid validate script**: `./.claude/skills/leet-mental/validate-mermaid.sh`
- **DSA path reference**: `lib/journey.ts` (JOURNEY constant defines all phases/sections)

## Key Libraries

- `lib/journey.ts` — Curriculum structure (phases, sections, problem IDs)
- `lib/content.ts` — Loads problems from `app/dsa/problems/`, patterns from `app/patterns/`
- `lib/fundamentals.ts` — Loads guides from `app/dsa/fundamentals/`

## Dev

```bash
npm install
npm run dev
```
