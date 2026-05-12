# Walkthrough: Modeling the API Contract

## How to Approach This

### The Core Insight

The API contract is the first place where the Plant Floor Monitor either becomes precise or stays vague. If `Device.status` is typed as `string`, every later hook, component, and filter has to defend itself against values the API was never supposed to send. If the contract is narrow at the boundary, the rest of the app gets to trust it.

### The Mental Model

Treat `src/types/api.ts` like the legend printed beside a control panel. A label is only useful when it means one exact thing. `status` is not helpful if it could be any string at all. It becomes useful when it can only be `online`, `offline`, or `alarm`, because every later reader knows the valid states before they write a branch.

That is the job of this scenario. You are not making the payload "fancy." You are deciding which meanings the rest of the codebase is allowed to rely on.

### How to Decompose This

Before you write the interfaces, answer three questions:

1. Which fields identify a record or link one record to another, and should therefore not be reassigned in application code?
2. Which fields come from a closed set of values, and therefore deserve a literal union instead of plain `string`?
3. Does `Alarm` really branch into different payload shapes yet, or are you reaching for a discriminated union before the payload has earned it?

---

## Building It

Project state entering this scenario is intentionally empty. There is no fetch layer yet, no mock JSON, no `useDevices` hook, and no UI. That makes this a clean boundary lesson: define the vocabulary now so every later file inherits a tighter contract instead of cleaning up a loose one.

### Step 1: Narrow the closed-set fields first

Start by separating open-ended strings from constrained strings. IDs, names, and timestamps are still strings because the app treats them as opaque values. Device status and alarm severity are different. Those fields come from a short known list, so they should advertise that fact directly.

```ts
export type DeviceStatus = 'online' | 'offline' | 'alarm';

export type AlarmSeverity = 'warning' | 'critical';
```

That union buys more than autocomplete. It turns every comparison into a checked decision point. If someone later writes `device.status === 'connected'`, TypeScript can reject it immediately. If the API adds a new state later, the compiler can help you find every branch that now needs attention.

This is the concrete answer to "what does a literal union buy over `string`?" It prevents impossible comparisons, improves exhaustiveness, and keeps filtering and rendering code aligned with the real domain instead of with guesswork.

### Step 2: Use `readonly` to protect identity, not everything

`readonly` is most useful on fields whose meaning collapses if they are reassigned after the payload arrives. An API-provided `id` identifies one record for the life of that record. A `deviceId` on `Tag` or `Alarm` is the stable link back to the device it belongs to. Those are exactly the fields where accidental reassignment creates bugs that are hard to explain later.

```ts
export interface Tag {
  readonly id: string;
  readonly deviceId: string;
  name: string;
  unit: string;
  value: number;
}
```

The important tradeoff is that `readonly` is not a prize for being strict. It is a statement of intent. It belongs on stable identity and cross-record reference fields because the UI may replace a record with a fresher payload, but it should not mutate that record's identity in place.

Fields like `name`, `value`, or `message` usually stay mutable in the type because a later payload can legitimately change them. Marking every property `readonly` does not make the contract more truthful, it just makes normal updates harder to express.

### Step 3: Model the shared shape plainly before inventing variants

Once the primitive decisions are clear, write the interfaces around the actual relationships. A device has identity, a status, and a last-seen timestamp. A tag belongs to one device. An alarm belongs to one device, may point at a specific tag, and carries severity plus a human-readable message.

```ts
export interface Device {
  readonly id: string;
  name: string;
  status: DeviceStatus;
  lastSeenAt: string;
}

export interface Tag {
  readonly id: string;
  readonly deviceId: string;
  name: string;
  unit: string;
  value: number;
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

This is also where you answer the discriminated-union question cleanly. A plain interface is correct when every alarm record still shares one required shape. A discriminated union becomes necessary only when the payload genuinely splits into variants with different required fields.

For example, if the API later sends:

- threshold alarms with `threshold` and `actual`
- connectivity alarms with `reason` and no `tagId`

then one `Alarm` interface would start lying. At that point a discriminant like `kind: 'threshold' | 'connectivity'` would be useful because it tells TypeScript which branch-specific fields must exist. Until that pressure exists, one interface is clearer and more truthful.

### Step 4: Optimize for downstream use, not just local correctness

This file is not isolated. The fetch layer will import it. The async-state hook will carry arrays of these records. Rendering code will branch on `status`, badge styling will likely derive from it, and alarm views will depend on whether the payload has one shared shape or variant-specific shapes.

That is why `src/types/api.ts` should export the supporting unions alongside the interfaces. The downstream code should not have to re-create `'online' | 'offline' | 'alarm'` in a component just because the first version of the contract hid it inside one interface.

The best version of this scenario leaves later lessons with three advantages:

- the valid status and severity values are explicit
- identity and relationship fields are protected from accidental reassignment
- `Alarm` stays simple until the real payload shape requires more structure

---

## Why This Way

Typing the contract before writing the fetch layer keeps the trust boundary explicit. Raw JSON does not become safe just because it came from `fetch()`. The app only becomes typed when you decide what the payload is supposed to look like and encode that decision in one shared module.

`readonly` is valuable when it protects identity and references from accidental reassignment. It is not valuable when it freezes fields that the server may legitimately update in the next payload. The question is not "where can I be stricter?" The question is "which mutations would be lies?"

Literal unions are worth the friction when the domain is closed. They let the compiler reject invalid comparisons, make future render branches safer, and force later code to stay aligned with the actual API vocabulary.

A discriminated union is not inherently better than an interface. It becomes better when one branch needs fields another branch must not have. Until then, a plain interface communicates the payload more directly.

---

## How to Explain It

I typed the API contract before the fetch layer because every later module depends on those assumptions. I used `readonly` on identity and foreign-key fields like `id` and `deviceId` because the app may replace a record, but it should not mutate its identity in place. I narrowed status and severity with literal unions because those values come from a closed set, and I kept `Alarm` as a plain interface because the payload does not yet split into branch-specific shapes with different required fields.

---

## Checkpoint

- Why is `status: 'online' | 'offline' | 'alarm'` a stronger contract than `status: string` once the UI starts filtering devices and rendering badges?
- Which `readonly` field would be most dangerous to mutate locally after the payload arrives, and what bug would that mutation create?

:::evaluator
Defend three decisions from your contract: one field you marked `readonly`, one field you intentionally left mutable, and one place where you chose a literal union over `string`. Then tell me the exact payload change that would force `Alarm` to stop being a plain interface and become a discriminated union.
:::
