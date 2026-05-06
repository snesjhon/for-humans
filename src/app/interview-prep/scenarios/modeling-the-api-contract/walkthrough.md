# Walkthrough: Modeling the API Contract

## How to Approach This

### The Core Insight

The API contract is the point where future code either becomes constrained or stays vague. If `Device.status` is just `string`, every hook and component downstream has to defend itself against values the real API was never supposed to send. If the contract is precise at the start, the rest of the project gets to trust it.

The most common mistake here is typing what feels convenient instead of typing what the payload actually guarantees. That usually shows up as broad `string` fields, mutable IDs, or an overdesigned discriminated union where a plain interface would have been easier to read and just as correct.

### The Mental Model

Treat `src/types/api.ts` like the legend printed beside a control panel. The panel is only useful if each label means one exact thing. A switch labeled "status" is not helpful if it could mean anything at all. It is helpful when it can only be `online`, `offline`, or `alarm`, because every person reading the panel knows the valid states in advance.

That is what your TypeScript contract does for the Plant Floor Monitor codebase. It labels each field with the narrowest truthful meaning the API can support, then forces the rest of the application to stay inside those boundaries.

### How to Decompose This

Before you write the interfaces, answer three questions:

1. Which fields identify a record and should never be reassigned after the payload arrives?
2. Which fields are drawn from a closed set of values and deserve literal unions instead of plain strings?
3. Does any payload branch into genuinely different shapes, or does one interface still describe it cleanly?

---

## Building It

No previous lesson exists yet, so the project state entering Lesson 1 is simple: there is no fetch layer, no React state, and no UI. This lesson creates the vocabulary the rest of the app will depend on by defining the API contract first and pairing it with realistic mock payloads.

### Step 1: Start with the narrowest truthful primitives

Before you model relationships, decide which values are fixed and which are open-ended. Device IDs, tag IDs, and timestamps are still plain strings because the app treats them as opaque values. Device status and alarm severity are different: the API is only supposed to emit a short known list of states, so unions make that closed set visible to the compiler.

This is the part many candidates skip. They write `status: string` because the JSON file contains strings anyway. That removes the compiler's ability to catch invalid comparisons like `device.status === 'connected'` and it makes later `switch` statements impossible to verify for completeness.

```ts
export type DeviceStatus = 'online' | 'offline' | 'alarm';

export type AlarmSeverity = 'warning' | 'critical';
```

The union buys you more than autocomplete. It turns every use of `status` and `severity` into a checked decision point. If someone adds `'maintenance'` later, TypeScript can surface every branch that now needs to be reconsidered.

### Step 2: Mark immutable identity fields as `readonly`

`readonly` belongs on fields whose meaning collapses if they are reassigned after the record is created. An API-provided `id` identifies one entity for the life of that entity. The UI can replace the whole object with fresher server data, but it should not mutate the identity of the existing object in place.

That is why `readonly` fits IDs and cross-record foreign keys better than display fields like `name` or numeric fields like `value`. `name` may legitimately change if the next payload is different. The `id` should not.

```ts
export interface Tag {
  readonly id: string;
  readonly deviceId: string;
  name: string;
  unit: string;
  value: number;
}
```

The important tradeoff is that `readonly` does not freeze the runtime object. It is a compile-time statement of intent. What you get back is protection against accidental reassignment in the application code, especially once arrays of records start moving through hooks and derived views.

### Step 3: Compose `Device`, `Tag`, and `Alarm` around the real relationships

Once the primitive decisions are clear, write the interfaces around how the records relate to each other. A device has identity, a human-readable name, a constrained status, and a last-seen timestamp. A tag belongs to one device. An alarm points at one device and, when relevant, one triggering tag.

Keep the first version of `Alarm` as a plain interface if every alarm record shares the same field set. A simple contract is easier to read, easier to mock, and easier to carry through the fetch layer. Reach for a discriminated union only when the payload genuinely splits into variants with different required fields.

```ts
export interface Device {
  readonly id: string;
  name: string;
  status: DeviceStatus;
  lastSeenAt: string;
}

export interface Alarm {
  readonly id: string;
  readonly deviceId: string;
  readonly tagId: string | null;
  severity: AlarmSeverity;
  message: string;
  acknowledged: boolean;
  triggeredAt: string;
}
```

That distinction matters in interviews. "When does a discriminated union become necessary?" has a concrete answer: when one alarm shape needs fields another shape must not have, and a shared discriminant like `kind` or `type` is what tells TypeScript which branch it is looking at. If every alarm still has `deviceId`, `tagId`, `severity`, `message`, and `triggeredAt`, a discriminated union adds ceremony without adding truth.

### Step 4: Make the mock payload prove the contract is usable

The JSON files are not filler. They pressure-test whether your contract is honest. If the mock devices cover online, offline, and alarm states, you can already see whether the union is doing useful work. If the tags point back to real device IDs, the later fetch layer and UI lessons inherit coherent data instead of arbitrary samples.

Create device records that reflect the exact shape you typed:

```json
[
  {
    "id": "dev-reactor-01",
    "name": "Reactor Feed Pump",
    "status": "online",
    "lastSeenAt": "2026-05-05T14:22:00Z"
  },
  {
    "id": "dev-line-07",
    "name": "Packaging Line 7",
    "status": "alarm",
    "lastSeenAt": "2026-05-05T14:19:00Z"
  }
]
```

Then create tags that belong to those devices:

```json
[
  {
    "id": "tag-reactor-01-temp",
    "deviceId": "dev-reactor-01",
    "name": "Feed Temperature",
    "unit": "C",
    "value": 82.4
  },
  {
    "id": "tag-line-07-speed",
    "deviceId": "dev-line-07",
    "name": "Belt Speed",
    "unit": "m/min",
    "value": 0
  }
]
```

The goal is not volume. The goal is variety. Later lessons need enough shape diversity to render different states and talk about tradeoffs without inventing data on the fly.

---

## Why This Way

Typing the contract before writing the fetch layer keeps the trust boundary explicit. Raw JSON does not become safe just because it came from `fetch()`. The only moment the compiler can start protecting the app is when you decide what the payload is supposed to look like. That is why this lesson comes first.

`readonly` is a design signal more than a runtime mechanism. It tells future code that identity fields are not to be reassigned in place. I have seen codebases mutate IDs during optimistic UI updates or local remapping logic, and the bug is never obvious where it starts. The cost of `readonly` is low, and the failure mode it prevents is expensive to chase.

Literal unions are worth the friction when the domain is closed. A status field with three valid values should not accept a fourth one just because it is still a string. The union gives you invalid-state prevention, safer comparisons, and better future exhaustiveness checks when rendering or filtering logic appears in later lessons.

A discriminated union is not automatically "more advanced" and therefore better. It becomes necessary when a shared field like `type` selects between different required payload shapes. If threshold alarms need `threshold` and `actual`, while connection alarms need `reason` and no tag reference, then the branch shapes differ enough to model explicitly. Until that pressure exists, one interface stays clearer.

---

## How to Explain It

I started by typing the API contract before writing any fetch code because every later layer depends on those assumptions. I used `readonly` on identity fields like `id` and `deviceId` to signal that the UI can replace records but should not mutate their identity in place. I narrowed status and severity with unions because those values come from a closed set, and I would only promote `Alarm` to a discriminated union if the API started sending different alarm variants with different required fields.

---

## Checkpoint

- Why is `status: 'online' | 'offline' | 'alarm'` a stronger contract than `status: string` once the UI starts filtering devices?
- What specific change in the alarm payload would justify replacing one `Alarm` interface with a discriminated union?

:::evaluator
You marked some fields as `readonly` and others as mutable. Defend one field from each side of that decision. What bug does `readonly` prevent for the first field, and what legitimate update would it block on the second?
:::
