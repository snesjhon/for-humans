# Modeling the API Contract

## Overview

This is the first Plant Floor Monitor scenario, before any fetch utility, hook, or component exists. An automations company wants to see whether you can read a device payload and turn it into a TypeScript contract the rest of the app can trust. Your job is to define the shape for `Device`, `Tag`, and `Alarm` in one shared module, then be ready to defend why each field is typed the way it is.

## What You Should Build

- [ ] Create `src/types/api.ts` with explicit `Device`, `Tag`, and `Alarm` interfaces for the Plant Floor Monitor payload
- [ ] Use narrow field types where the API is constrained, especially for device status and alarm severity, instead of defaulting those fields to broad `string`
- [ ] Mark fields as `readonly` only where the application should treat them as stable identity or stable cross-record references after the payload arrives
- [ ] Keep `Alarm` as a plain interface unless the payload shape actually splits into variants that require a discriminant and different required fields
- [ ] Export any supporting type aliases the interfaces need so later scenarios can import the contract directly without re-declaring unions

## Constraints

- Stay at the data-contract layer only; do not introduce fetch utilities, React components, hooks, CSS, or reducer logic
- Put the contract in `src/types/api.ts`; do not scatter the interfaces across multiple files
- Do not use `any`, type assertions, placeholder fields, or unions that are broader than the payload requires
- Do not add mock JSON files in this scenario; the fetch-layer step owns the static payloads
- Assume later scenarios will import these names directly, so the types should be stable, readable, and precise enough to support filtering, rendering, and alarm handling
