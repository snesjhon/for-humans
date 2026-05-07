# Walkthrough: Rendering the Data

## How to Approach This

### The Core Insight

The hook already owns the async state. The next architectural decision is not "how do I get the data?" but "where does each rendering responsibility stop?" If `App.tsx` owns the hook, the list mapping, the card markup, and the status styling, then the component tree is technically working but architecturally flat. The goal of this scenario is to separate collection rendering from single-record rendering, and separate status presentation from the rest of the card, before later scenarios add more UI pressure.

### The Mental Model

Treat `useDevices()` like the live feed coming into a control-room wall. `App.tsx` decides which screen the operator sees: loading, error, or data. `DeviceList` decides how a collection is presented. `DeviceCard` decides how one device is laid out. `StatusBadge` decides how the closed vocabulary of device status appears on screen. Each boundary translates one layer of meaning and then stops.

### How to Decompose This

Before you extract anything, answer three questions:

1. Which component owns async screen branches, and which components should never have to care where the data came from?
2. What collection responsibility belongs to `DeviceList`, and what single-record responsibility belongs to `DeviceCard`?
3. Why is device status different from the ordinary text fields on a device record, and therefore worth a smaller focused component?

---

## Building It

Project state entering this scenario is now specific. The codebase already has `src/types/api.ts`, a typed fetch boundary in `src/api/`, and `src/hooks/useDevices.ts` with `AbortController` cleanup. What it still does not have is an earned rendering split between async state ownership and presentation. Whether `App.tsx` is still mostly scaffolded or already holds placeholder markup, this lesson starts from the same missing boundary: the hook result needs a component structure that can grow without turning `App.tsx` into one long render function.

### Step 1: Let `App.tsx` own the async branch and hand off ready-state rendering

The top-level component should keep responsibility for the screen branch because it is the place that understands loading, error, and ready as mutually exclusive states. It should not also own the full markup for every device row or card. Once `useDevices()` returns data, `App.tsx` should hand the ready branch to a child component instead of mapping the array inline.

```tsx
import { DeviceList } from '@/components/devices/DeviceList';
import { useDevices } from '@/hooks/useDevices';

export default function App() {
  const { devices, isLoading, error } = useDevices();

  if (isLoading) {
    return <main className="app-shell">Loading plant floor data...</main>;
  }

  if (error) {
    return (
      <main className="app-shell">
        <section className="panel panel-error">
          <h1>Plant Floor Monitor</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="panel">
        <header className="panel__header">
          <h1>Plant Floor Monitor</h1>
          <p>Live device status across the production floor.</p>
        </header>
        <DeviceList devices={devices} />
      </section>
    </main>
  );
}
```

This boundary matters because `App.tsx` should know that data is still loading, but it should not know how one device card formats its timestamp or how a badge turns `alarm` into a visual treatment. The parent owns the branch. The children own the display.

### Step 2: Make `DeviceList` own collection structure, not device details

The list component earns its keep when it owns collection semantics. That includes the list wrapper, any empty-state message for an already-successful request, and the `map()` from data to child components. It does not need to know how a single device lays out its fields.

```tsx
import type { Device } from '@/types/api';
import { DeviceCard } from './DeviceCard';

type DeviceListProps = {
  devices: Device[];
};

export function DeviceList({ devices }: DeviceListProps) {
  if (devices.length === 0) {
    return <p className="device-list__empty">No devices are reporting yet.</p>;
  }

  return (
    <ul className="device-list">
      {devices.map((device) => (
        <li key={device.id} className="device-list__item">
          <DeviceCard device={device} />
        </li>
      ))}
    </ul>
  );
}
```

This is the point of the split. The list knows there are many devices. The card knows there is one device. If `App.tsx` maps the array directly and also renders every device field inline, then the parent has absorbed both responsibilities and the intermediate boundary is fake.

### Step 3: Make `DeviceCard` a typed presentational component, not a data-loading component

`DeviceCard` should couple to the shape of a device, because that is what it renders. It should not couple to the fetch layer, because it does not own transport or async lifecycle. Receiving a `Device` prop is not the same as depending on `fetchDevices()` or `useDevices()`.

```tsx
import type { Device } from '@/types/api';
import { StatusBadge } from './StatusBadge';

type DeviceCardProps = {
  device: Device;
};

export function DeviceCard({ device }: DeviceCardProps) {
  return (
    <article className="device-card">
      <div className="device-card__row">
        <div>
          <h2 className="device-card__name">{device.name}</h2>
          <p className="device-card__meta">Device ID: {device.id}</p>
        </div>
        <StatusBadge status={device.status} />
      </div>
      <p className="device-card__meta">Last seen: {device.lastSeenAt}</p>
    </article>
  );
}
```

This is the direct answer to the decoupling question interviewers care about. `DeviceCard` stays decoupled from the fetch layer by depending on stable data props and the shared type contract, not by pretending it should not know what a device looks like. Rendering a domain object is appropriate coupling. Reaching back into the hook or HTTP layer would be the wrong coupling.

### Step 4: Give `StatusBadge` the closed-set rendering rule

`StatusBadge` earns its own component because device status is not just another line of text. It is a closed vocabulary with display rules attached to it. The moment one field needs a stable label, a stable class name, and likely the same visual treatment everywhere the app shows status, that decision has become more specific than `DeviceCard`'s general layout job.

```tsx
import type { DeviceStatus } from '@/types/api';

type StatusBadgeProps = {
  status: DeviceStatus;
};

const STATUS_LABELS: Record<DeviceStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  alarm: 'Alarm',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
```

If you inline this inside `DeviceCard`, the immediate cost is small: one less file and one less import. The architectural cost appears later:

- every card now carries status label formatting and status class naming inline
- the rule for rendering status becomes harder to reuse anywhere else in the app
- a future accessibility or icon change now requires reopening every place that manually renders status
- `DeviceCard` stops being "layout for one device" and starts accumulating special-case UI logic for one field

That is why `StatusBadge` is not an over-extraction here. It owns a closed-set visual translation that is likely to repeat, while `DeviceCard` can stay focused on composing fields.

### Step 5: Put first-pass rendering CSS in `src/App.css`, and stop before layout work

This scenario includes CSS because extracted components still need a readable first pass on screen. The right target is `src/App.css`, not `src/index.css`, because these styles belong to the Plant Floor Monitor surface, not to global resets. The right level of ambition is also restrained: readable panels, list spacing, card structure, and a clear badge. Do not jump ahead to the full dashboard grid or responsive column system that `css-layout` will own later.

Wire the class names in JSX before writing the CSS so each selector points at real markup:

```tsx
<section className="panel">
  <header className="panel__header">
    <h1>Plant Floor Monitor</h1>
    <p>Live device status across the production floor.</p>
  </header>
  <DeviceList devices={devices} />
</section>
```

Then add the first-pass styles in `src/App.css`:

```css
.app-shell {
  min-height: 100vh;
  padding: 2rem;
  background: #f4f7fb;
  color: #162033;
}

.panel {
  width: min(100%, 64rem);
  margin: 0 auto;
  border: 1px solid #d8e1ee;
  border-radius: 20px;
  background: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.device-list {
  list-style: none;
  display: grid;
  gap: 1rem;
  padding: 0;
  margin: 1.5rem 0 0;
}

.device-card {
  display: grid;
  gap: 0.75rem;
  border: 1px solid #d8e1ee;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  background: #f9fbfd;
}

.device-card__row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.status-badge {
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.status-badge--online {
  background: #dcfce7;
  color: #166534;
}

.status-badge--offline {
  background: #e5e7eb;
  color: #374151;
}

.status-badge--alarm {
  background: #fee2e2;
  color: #b91c1c;
}
```

The interviewer is checking whether your CSS supports the component boundaries you created. `DeviceList` needs collection spacing. `DeviceCard` needs internal structure. `StatusBadge` needs a closed-set visual treatment. That is enough for this step. The full dashboard layout is still a separate problem.

---

## Why This Way

This split keeps responsibilities aligned with the questions each component can answer. `App.tsx` can answer "what screen branch are we in?" `DeviceList` can answer "how do we render a collection of devices?" `DeviceCard` can answer "how do we present one device?" `StatusBadge` can answer "how does device status appear?" When one component starts answering two of those questions, the boundary has usually collapsed.

`StatusBadge` is worth extracting because it owns a closed-set mapping between domain values and display rules. That is a stronger reason than "the file is shorter." Inlining it would work today, but it would mix one field's special rendering policy into the general card layout and make reuse harder the moment another screen wants the same status display.

`DeviceCard` is appropriately coupled to the shared `Device` type and appropriately decoupled from the fetch layer. Components render data shape. They should not own request orchestration just because the data originally arrived through a hook.

---

## How to Explain It

I kept `App.tsx` responsible for loading, error, and ready because that is the async screen boundary. I extracted `DeviceList` because the collection wrapper and the `map()` over devices are a different responsibility than rendering one device. I extracted `StatusBadge` because status is a closed-set display rule, not just another text field, and inlining it would push label formatting and status-specific class logic back into `DeviceCard`. `DeviceCard` stays decoupled from the fetch layer because it accepts a typed `Device` prop and never imports the hook or fetch helper directly.

---

## Checkpoint

- What responsibility does `DeviceList` own that `DeviceCard` should not?
- What exact logic would start duplicating if `StatusBadge` were inlined into every device card or future status surface?

:::evaluator
Defend the component boundaries in this solution. Why does `App.tsx` keep the async branch, why does `StatusBadge` earn its own file instead of staying inline, and why is `DeviceCard` still decoupled from the fetch layer even though it renders fetch-derived data?
:::
