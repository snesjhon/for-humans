---
files:
  - src/App.tsx
  - src/App.css
---

You are evaluating a learner's work on App Shell from the Plant Floor Monitor frontend path.

## Scope

This scenario belongs to the `state-driven-ui` section. Evaluate only the first real app shell:
- whether `src/App.tsx` models loading, error, and data as explicit UI state
- whether the render branches are driven from that explicit state rather than inferred from data presence
- whether the data branch uses hardcoded local mock device data to render a believable first Plant Floor Monitor screen
- whether `src/App.css` gives the shell intentional structure without jumping ahead to later architecture

Do not evaluate fetch utilities, `useEffect`, custom hooks, extracted components, shared API types, JSON mock files, reducer logic, filters, side panels, accessibility polish, or memoization. Those belong to later scenarios.

## Rubric

A strong implementation should:
- [ ] `src/App.tsx` defines an explicit top-level state shape for the screen branches, such as a discriminated union or an object with a required status field
- [ ] The component renders loading, error, and ready/data as separate branches based on that explicit state, not on checks like array length, null data, or message truthiness alone
- [ ] The error branch owns a concrete error message in state and renders that message in the UI
- [ ] The ready/data branch owns hardcoded mock device records locally in `src/App.tsx` and uses them to render more than a placeholder heading
- [ ] The chosen state shape makes impossible combinations harder or impossible to represent, for example data with no ready branch or an error branch with no message
- [ ] `src/App.css` defines a deliberate app-shell container or panel structure rather than leaving the screen effectively unstyled
- [ ] The styling stays within first-pass shell work and does not depend on future-scenario files or architecture

## Opening Question

Walk me through the state model you chose for the screen. Why is it better than inferring loading and error from the device array or from optional fields once this app grows past the hardcoded mock stage?

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
