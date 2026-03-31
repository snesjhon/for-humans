# DSA for Humans — Claude Code Guide

## Project Overview

A Next.js 14 DSA learning platform. Content is organized into three directories:

- `app/problems/{id}-{slug}/` — Problem mental models and test cases
- `app/patterns/*.md` — Pattern concept guides
- `app/fundamentals/{slug}/{slug}-fundamentals.md` — Fundamentals guides

The learning path (phases, sections, problems) is defined in `lib/journey.ts`.

## Skills

This repo includes Claude skills for generating content. They live in `./.claude/skills/`:

| Skill | File | Purpose |
|-------|------|---------|
| `leet-mental` | `./.claude/skills/leet-mental/SKILL.md` | Generate mental model study guides for problems |
| `leet-fundamentals` | `./.claude/skills/leet-fundamentals/SKILL.md` | Generate foundational concept guides |

When asked to generate a mental model, study guide, or fundamentals guide — read the relevant skill file first before starting.

## Content Paths

When generating content, always use these project-relative paths:

- **Problem output**: `./app/problems/{id}-{slug}/`
- **Fundamentals output**: `./app/fundamentals/`
- **Mermaid validate script**: `./.claude/skills/leet-mental/validate-mermaid.sh`
- **DSA path reference**: `lib/journey.ts` (JOURNEY constant defines all phases/sections)

## Key Libraries

- `lib/journey.ts` — Curriculum structure (phases, sections, problem IDs)
- `lib/content.ts` — Loads problems from `app/problems/`, patterns from `app/patterns/`
- `lib/fundamentals.ts` — Loads guides from `app/fundamentals/`

## Dev

```bash
npm install
npm run dev
```
