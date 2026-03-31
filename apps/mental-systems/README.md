# DSA-for-humans

A web platform for learning Data Structures & Algorithms through mental models and pattern recognition — built for humans, not machines.

---

## What is DSA-for-humans?

DSA-for-humans is an interactive study platform that teaches you to *see patterns*, not memorize solutions.

The core belief: most DSA content teaches you to produce code, not to think. Explanations are written for people who already understand the concept. DSA-for-humans inverts that — the mental model comes first, the code second.

---

## How the platform is laid out

Learning is organized into **Topics** — each one a focused area of DSA (Arrays & Strings, Hash Maps, Binary Trees, Graphs, etc.). Topics follow a deliberate two-phase progression from Novice to Studied.

### Topics → Fundamentals

Each topic starts with a **fundamentals guide**: a deep-dive into the concept before any problem is touched. These guides build intuition — diagrams, analogies, and worked examples that explain *why* the data structure or algorithm works the way it does.

### Topics → Problems

Every topic contains a curated set of problems, inspired by the Neetcode 150. Each problem has:

- A **mental model** — a human-readable analogy that makes the pattern stick ("think of it like X")
- A **code snippet** — a clean reference implementation
- An **embedded code environment** — run and modify the solution in-browser without leaving the page

Problems are split into two passes:
- **First Pass** — build the foundation, understand the pattern
- **Come Back & Reinforce** — deepen mastery once the concept is internalized

---

## The learning journey

Two phases, defined in `lib/journey.ts`:

**Phase 1 — Novice** 🌱 *(3–5 weeks)*
1. Arrays & Strings
2. Hash Maps
3. Two Pointers
4. Sliding Window
5. Linked Lists
6. Recursion & Backtracking
7. Binary Search

**Phase 2 — Studied** 📚
8. Binary Trees
9. Binary Search Trees
10. Graphs Fundamentals
11. Graph Traversal — DFS
12. Backtracking Deep Dive
13. Monotonic Stack & Greedy

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
