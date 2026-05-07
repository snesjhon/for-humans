# Walkthrough: App Shell

## How to Approach This

### The Core Insight

The first version of a UI teaches the rest of the codebase what counts as state. If loading, error, and data are not modeled explicitly now, later code will start pretending it can derive them from side effects: an empty array means loading, a missing object means error, and any truthy data means success. That is how impossible states sneak in. The fix is to make the branch itself a first-class value.

### The Mental Model

Treat the top-level screen like a control-room indicator board. The board does not guess whether a machine is healthy by counting how many numbers happen to be on the panel. It has an explicit mode light that says startup, fault, or running. Plant Floor Monitor needs the same clarity. The app shell should know which branch it is in because the state says so, not because the render function is reverse-engineering meaning from the payload.

### How to Decompose This

Before you write JSX, answer three questions:

1. What is the smallest state shape that can represent loading, error, and data without overlap?
2. Which information belongs to the branch itself, and which information belongs only inside the ready branch?
3. What shell styling makes this feel like a real application while still leaving dashboard layout work for a later scenario?

---

## Building It

Project state entering this scenario is intentionally minimal. The learner starts from the scaffolded Vite app: `src/App.tsx` renders only a heading, `src/App.css` is empty, and there are no hooks, shared types, fetch helpers, or generated mock files yet. That is why this scenario keeps everything local and focuses on the first durable UI decision: how the screen represents its current branch.

### Step 1: Name the screen states before you render anything

Do not start from JSX. Start from the states the screen must be able to represent. The branch list is fixed: loading, error, and data. If you begin by sketching cards and headings, you will be tempted to let the rendered data structure define the state model. That is backwards.

The simplest defensible shape here is a discriminated union or a single object with an explicit status field. The key is not the syntax. The key is that the branch is encoded directly.

```tsx
type DeviceStatus = 'online' | 'offline' | 'alarm';

type MockDevice = {
  id: string;
  name: string;
  area: string;
  status: DeviceStatus;
  lastUpdated: string;
};

type AppScreenState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; devices: MockDevice[] };
```

This buys you something concrete. The render path for `kind: 'error'` can require a message. The render path for `kind: 'ready'` can require device data. You no longer have a state where `devices` exists but the UI still claims it is loading, because that combination is not representable.

### Step 2: Keep mock data truthful, but local to the ready branch

This is not the API-contract lesson yet. You do not need `src/types/api.ts`, JSON fixtures, or a shared mock module. But you do need enough structure for the UI to feel real. A handful of devices with varied status values is enough to exercise the branch without dragging future architecture into the present lesson.

Use data that gives the screen something to say:

```tsx
const mockDevices: MockDevice[] = [
  {
    id: 'reactor-feed-01',
    name: 'Reactor Feed Pump',
    area: 'Mixing Hall',
    status: 'online',
    lastUpdated: '2 min ago',
  },
  {
    id: 'packaging-line-07',
    name: 'Packaging Line 7',
    area: 'East Wing',
    status: 'alarm',
    lastUpdated: 'Just now',
  },
];
```

Then place that data inside the explicit ready state instead of treating the array itself as the state model:

```tsx
const [screen, setScreen] = useState<AppScreenState>({
  kind: 'ready',
  devices: mockDevices,
});
```

Even if the initial branch is `ready`, the component still needs to prove it can represent the other two branches honestly. That is the whole interview tension. The reviewer is checking whether you understand the contract of the screen, not whether you can hardcode two cards.

### Step 3: Render each branch from the discriminant, not from incidental data

Once the state is explicit, the render logic becomes simple and defensible. Branch on `screen.kind`, not on array length, not on the truthiness of `screen.devices`, and not on whether some message string happens to exist.

```tsx
if (screen.kind === 'loading') {
  return <main className="app-shell">Loading plant floor data…</main>;
}

if (screen.kind === 'error') {
  return (
    <main className="app-shell">
      <section className="panel panel-error">
        <h1>Plant Floor Monitor</h1>
        <p>{screen.message}</p>
      </section>
    </main>
  );
}
```

That sequencing matters. It makes the branch contract visible at the top of the component, and it forces the ready branch to become the place where device rendering happens, instead of making every nested expression defend itself against absent data.

### Step 4: Use CSS to make the shell intentional, not final

This scenario includes CSS because the first real app shell should not look accidental. But the right move here is restraint. Do not jump to the full dashboard grid from a later lesson. Use a bounded shell, a clear header, and a readable stack of device rows or cards so the reviewer can see structure without you solving future layout work.

Before writing any CSS, wire the class names into the ready branch so you know exactly what you are targeting:

```tsx
return (
  <main className="app-shell">
    <div className="app-shell__inner">
      <h1>Plant Floor Monitor</h1>
      <ul className="device-list">
        {screen.devices.map((device) => (
          <li key={device.id} className="device-card">
            <strong>{device.name}</strong>
            <span>{device.area}</span>
            <span className={`status status--${device.status}`}>{device.status}</span>
            <span>{device.lastUpdated}</span>
          </li>
        ))}
      </ul>
    </div>
  </main>
);
```

With the markup in place, each CSS rule has a concrete home. Add all of the following to `src/App.css`, not `src/index.css`. The brief and the evaluator both target `App.css` specifically because these rules belong to the app shell component, not to global document resets.

One strong first-pass pattern is a centered container that scales without breakpoints:

```css
.app-shell {
  min-height: 100vh;
  padding: 2rem;
  background: #f4f7fb;
  color: #132033;
}

.app-shell__inner {
  width: min(100%, 72rem);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
```

`width: min(100%, 72rem)` is the useful idea here. It gives the page a readable maximum width without committing to the responsive grid system that `css-layout` will own later. That is a senior-engineer decision: solve the problem in front of you, and leave future problems unsolved on purpose.

For the device list itself, keep the styling honest and inspectable. A simple stack of cards is enough:

```css
.device-list {
  display: grid;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.device-card {
  border: 1px solid #d7dfeb;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  background: #ffffff;
}
```

The interviewer is not judging whether you can produce the final visual system in Step 1. They are judging whether you can give an app shell structure, hierarchy, and enough polish to support the next layer of work.

---

## Why This Way

An explicit branch state prevents accidental meaning from leaking into unrelated values. An empty device array might eventually mean "no matching filters" or "the API returned no devices." It should not also mean "still loading" just because that was convenient in the first draft. When the branch is explicit, future scenarios can add real fetching logic without rewriting the meaning of `devices`.

Keeping the mock data local is also deliberate. Shared type files, JSON fixtures, and reusable hooks are all valid later abstractions, but they would blur the lesson here. The point is to defend the state shape at the component boundary before the architecture grows around it.

The CSS should feel intentional without stealing work from `css-layout`. A bounded container and readable panels are enough to prove layout judgment. The richer dashboard structure, responsive columns, and denser interactions belong to later scenarios because those lessons need their own teaching surface.

---

## How to Explain It

I modeled loading, error, and ready as explicit branches because the screen state should describe what React is rendering directly, not force the component to infer meaning from whether data exists. I kept the mock device records local to `App.tsx` because this step is about the shell and the state contract, not the API layer yet. I used `App.css` to give the screen a real container and readable panels, but I stopped short of a full dashboard grid because that is separate layout work that belongs to a later scenario.

---

## Checkpoint

- Why is `devices.length === 0` a bad stand-in for loading state once filtering or empty API responses exist later?
- What impossible combination becomes unrepresentable when the error branch owns its message and the ready branch owns its devices?

:::evaluator
Defend the exact state shape you chose for the top-level screen. Why is that shape better than "just store an array and maybe an error string" in a component that does not fetch yet?
:::
