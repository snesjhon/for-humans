You are evaluating a learner's work on TypeScript Interfaces & Union Types for API Contracts from the Plant Floor Monitor interview prep track.

Evaluate only the files listed for each level. Do not infer intent from comments or TODOs -- evaluate only implemented code.

## Level 1: Interfaces as Field Contracts

files:
  - step1-exercise1-problem.ts
  - step1-exercise2-problem.ts
  - step1-exercise3-problem.ts

Evaluate:
- [ ] `Device` interface is defined with `id: string`, `name: string`, and `isOnline: boolean`
- [ ] `formatDevice` accepts `Device` and returns `"Name (online)"` or `"Name (offline)"`
- [ ] `Device` is updated with `readonly id: string` and `createdAt: string`
- [ ] `createDevice` factory function returns a valid `Device` object
- [ ] `lastSeenAt?: string` is present as an optional field
- [ ] `getLastSeen` returns the field value when present and `'never'` when absent

Output strict JSON only:
{"level": 1, "pass": true, "feedback": "..."}

## Level 2: Union Types and Status Modeling

files:
  - step2-exercise1-problem.ts
  - step2-exercise2-problem.ts
  - step2-exercise3-problem.ts

Evaluate:
- [ ] `DeviceStatus` is defined as `'online' | 'offline' | 'maintenance'`
- [ ] `Device.status` uses `DeviceStatus` (not `boolean` or plain `string`)
- [ ] `formatDevice` uses the `status` field
- [ ] `getStatusLabel` uses a `switch` that covers all three variants
- [ ] `getStatusLabel` default branch assigns to `never` for exhaustiveness
- [ ] `AlarmEvent` is a discriminated union with `type: 'threshold'` and `type: 'connection'` variants
- [ ] `describeAlarm` narrows on `event.type` before accessing variant-specific fields

Output strict JSON only:
{"level": 2, "pass": true, "feedback": "..."}

## Level 3: Composing Contracts from Smaller Types

files:
  - step3-exercise1-problem.ts
  - step3-exercise2-problem.ts
  - step3-exercise3-problem.ts

Evaluate:
- [ ] `Tag` interface is defined with `id`, `name`, `unit`, and `value` fields
- [ ] `Device` interface includes `tags: Tag[]`
- [ ] `getTagNames` returns `string[]` by mapping `tag.name` through composed types
- [ ] `Alarm` interface includes `severity: 'critical' | 'warning' | 'info'` and `event: AlarmEvent`
- [ ] `getCriticalAlarms` returns only alarms with `severity === 'critical'`
- [ ] `ApiPayload` composes `devices: Device[]` and `alarms: Alarm[]`
- [ ] `summarizePayload` returns `{ deviceCount, onlineCount, criticalAlarmCount }` computed correctly

Output strict JSON only:
{"level": 3, "pass": true, "feedback": "..."}
