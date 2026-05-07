---
files:
  - src/types/api.ts
---

You are evaluating a learner's work on Modeling the API Contract from the Plant Floor Monitor frontend path.

## Scope

This scenario belongs to the `data-fetching` section. Evaluate only the shared TypeScript contract for the Plant Floor Monitor payload:
- whether `src/types/api.ts` defines explicit `Device`, `Tag`, and `Alarm` interfaces
- whether stable identity and relationship fields use `readonly` where appropriate
- whether constrained fields use literal unions instead of broad `string`
- whether `Alarm` stays a plain interface unless the learner introduces a real discriminant with branch-specific required fields

Do not evaluate fetch utilities, JSON mock files, React components, hooks, CSS, async state modeling, or runtime validation. Those belong to later scenarios.

## Rubric

A strong implementation should:
- [ ] `src/types/api.ts` exports explicit `Device`, `Tag`, and `Alarm` interfaces rather than relying on `any`, untyped object literals, or type assertions
- [ ] Identity fields such as `id`, and stable cross-record references such as `deviceId` or `tagId` when treated as durable references, are marked `readonly`
- [ ] `Device.status` is modeled as a literal union of the valid device states rather than a plain `string`
- [ ] Alarm severity, or any other clearly closed-set field in the contract, is modeled as a literal union rather than a plain `string`
- [ ] The contract leaves legitimately changeable fields such as display names, numeric readings, or messages mutable instead of marking every property `readonly`
- [ ] `Alarm` remains a plain interface unless the learner also introduces a real discriminant field and genuinely different branch-specific required fields

## Opening Question

Walk me through one field you made `readonly`, one field you left mutable, one field you narrowed to a union, and the exact payload change that would make a discriminated union necessary for `Alarm`.

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
