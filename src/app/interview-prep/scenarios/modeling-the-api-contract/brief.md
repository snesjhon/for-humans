# Modeling the API Contract

## Overview

This is the first lesson in Plant Floor Monitor, the point before any fetch utility, hook, or component exists. Your job is to read the device payload shape, define the TypeScript contract the rest of the app will trust, and create the mock JSON files that later lessons will fetch from. If this contract is loose, every later layer inherits that looseness.

## What You Should Build

- [ ] Create `src/types/api.ts` with `Device`, `Tag`, and `Alarm` interfaces for the Plant Floor Monitor payload
- [ ] Use precise field types for identity fields, status values, and alarm severity values instead of broad `string` types
- [ ] Mark fields as `readonly` only where the application should treat them as immutable after the API returns them
- [ ] Add `src/mocks/devices.json` with a small set of realistic device records in mixed status states
- [ ] Add `src/mocks/tags.json` with tag records that belong to those devices and reflect the contract you defined

## Constraints

- Keep the lesson at the data-contract layer only, no fetch utilities, React components, hooks, or CSS
- The contract must match the mock payload shape you create, do not rely on `any`, type assertions, or placeholder fields
- Use unions only where the API is constrained to a fixed set of known values
- Do not turn `Alarm` into a discriminated union unless the payload actually contains shape variants that require one
- Assume later lessons will import these types directly, so the naming and field intent must stay stable
