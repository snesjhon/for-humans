# App Shell

## Overview

You are starting Plant Floor Monitor from the scaffolded Vite app, before any fetch utility, custom hook, or shared API contract exists. Build the first real `App.tsx` using hardcoded mock device data and an explicit top-level UI state that can represent loading, error, and data as three separate branches. The point of the exercise is to show that UI state should be modeled directly, not guessed from whether an array happens to be empty.

## What You Should Build

- [ ] Replace the scaffolded `src/App.tsx` with a real Plant Floor Monitor app shell that renders a loading branch, an error branch, and a data branch
- [ ] Model those three branches as explicit state in `src/App.tsx`, not as checks like `devices.length === 0` or `errorMessage ? ... : ...`
- [ ] Keep the mock device records local to this scenario and render them only through the explicit data branch
- [ ] Include enough device information in the data branch for the UI to feel like the first real version of Plant Floor Monitor, not a placeholder heading
- [ ] Use `src/App.css` for the app-shell styling so the screen reads as a deliberate first pass rather than unstyled HTML
- [ ] Make the error branch carry a concrete message that is rendered in the UI instead of a generic fallback string

## Constraints

- Stay inside `src/App.tsx` and `src/App.css`; do not introduce fetch utilities, hooks, extracted components, or shared type files yet
- Do not infer the current branch from data presence, null checks, or empty arrays; the branch itself must be represented explicitly in state
- Use hardcoded mock data only, no JSON imports, network calls, or `setTimeout`-based fake fetching
- Keep the layout simple and production-minded; the richer dashboard grid and later interactions belong to future scenarios
- Do not solve future lessons here: no filtering, no selected-device side panel, no reducer, no accessibility pass, and no memoization work
