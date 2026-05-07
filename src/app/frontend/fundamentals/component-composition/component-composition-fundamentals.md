## Overview

Component composition is about separating **who owns the state** from **who decides the layout**. The bugs in this section show up when those responsibilities blur together: each child keeps its own copy of the same decision, a wrapper component gets extracted but still does not define a real protocol, or a portal makes the DOM move and tricks you into thinking the React ownership changed too.

**The lifting-state problem:** sibling UI pieces that should agree, like a trigger and a panel, cannot coordinate if each child owns its own local truth.

**The compound-component problem:** once one parent owns the state, the children should be free to arrange the visuals. The boundary earns its keep when it gives those children a shared protocol instead of just hiding JSX in another file.

**The portal problem:** a portal moves DOM output, not React ownership. A dialog rendered in `document.body` should still read and update the same parent-owned state.

**Level 1** teaches how to find the lowest common owner when several visual pieces need the same state.

**Level 2** teaches how compound components let children choose structure while the parent keeps the behavior.

**Level 3** teaches that a good boundary survives DOM relocation and recursive depth because it owns a protocol, not just a chunk of markup.

## Core Concept & Mental Model

The problem from the overview is this: a component boundary is only useful when it gives one place ownership over a decision and gives the children a reliable way to participate in that decision.

### The Control Booth

Imagine a stage production with one control booth and many screens, lights, and buttons on stage.

- **control booth** = the component that owns the state
- **stage pieces** = the children that render buttons, labels, panels, or other visuals
- **shared cue line** = props or context that let children read the state and send events back
- **remote screen** = a portal target somewhere else in the DOM
- **mini control booth** = a recursive child boundary that owns its own repeated local rule

The important rule is that the cue line and the control booth belong together. You can move a screen to another part of the building, but if it still listens to the same booth, the ownership did not change.

### Why "Each Child Tracks Itself" Breaks Down

Suppose an accordion wants exactly one answer open at a time. If every row owns its own `isOpen`, then each row can only answer "am I open?" for itself. No row can answer the actual product question, which is "which row is open right now?"

That mismatch is the signal that state is living too low.

```ts
// Child-local state answers the wrong question.
function FaqItem() {
  const [isOpen, setIsOpen] = useState(false);
}

// Parent-owned state answers the real question.
function FaqList() {
  const [openId, setOpenId] = useState<string | null>(null);
}
```

The fix is not "move state upward because that is what React people say." The fix is to put the state where the real decision can be expressed once.

### What A Good Boundary Actually Provides

After the parent owns the state, the next question is whether a separate component boundary is doing real work or merely relocating JSX.

A good boundary provides a protocol:

- which state exists
- which events can update it
- which children may read it
- which visual parts can be arranged independently

That is what a compound component gives you. `Dialog.Root`, `Dialog.Trigger`, and `Dialog.Content` are not useful because the names look clean. They are useful because they all speak the same protocol: one root-owned `open` state and one set of actions around it.

### Why Portals Do Not Change Ownership

A portal changes where DOM nodes are inserted. It does not detach those nodes from the React tree that created them.

```ts
// Root owns the state.
const [open, setOpen] = useState(false);

// Content renders elsewhere in the DOM, but still reads `open`
// and still calls `setOpen` through the same React tree.
createPortal(dialogBody, document.body);
```

That is why a close button inside a portal can still update state owned by the dialog root. The screen moved. The control booth did not.

### When A Recursive Boundary Earns Its Keep

Some boundaries repeat the same protocol at every depth. A tree node is the clearest example. Each folder node owns one local rule, "am I expanded?", and when open it renders more nodes of the same shape.

That boundary earns its keep because:

- the same state-and-render contract repeats at every level
- the recursive component hides the self-similar protocol
- the parent tree only has to hand the next node its data

That is very different from extracting a `LayoutWrapper` whose only job is to move five lines of JSX into another file.

---

## Building Blocks: Progressive Learning

### Level 1: Find The Lowest Common Owner

The first capability is diagnosing when several visual pieces are trying to answer one shared question with several local state values. If the trigger, list, and panel all need to agree, the answer cannot live inside only one of them.

#### **Exercise 1**

An FAQ should keep exactly one answer open at a time, but each row currently owns its own `isOpen`. That lets two rows stay expanded together because no parent owns the real decision. Lift the state to the list component so the rows become controlled views of one `openId`.

:::stackblitz{file="step1-exercise1-problem.ts" step=1 total=3 solution="step1-exercise1-solution.ts"}

#### **Exercise 2**

The tab buttons can switch locally, but the preview panel still renders the original document because the active tab state lives inside the wrong child. Move the ownership to the parent so the buttons and the panel both read the same `activeId`.

:::stackblitz{file="step1-exercise2-problem.ts" step=1 total=3 solution="step1-exercise2-solution.ts"}

#### **Exercise 3**

The contact list can highlight a clicked row, but the details pane still shows the old contact because it is reading different state than the rows. Split the responsibility correctly: one parent owns `selectedId`, the rows display that selection, and the details pane renders from it.

:::stackblitz{file="step1-exercise3-problem.ts" step=1 total=3 solution="step1-exercise3-solution.ts"}

> **Mental anchor**: "If two visual pieces must agree, the state belongs to their lowest common owner."

**→ Bridge to Level 2**: Once the right parent owns the state, the next challenge is avoiding a giant monolith component. The children still need freedom to arrange the markup without taking state ownership back.

### Level 2: Let Children Choose Structure, Not Ownership

Now the capability is turning one owner plus many visual pieces into a reusable protocol. Compound components are the pattern for this: a root owns the behavior, and the children read or update that behavior through context while staying free to appear in different places in the JSX tree.

#### **Exercise 1**

Build a popover compound component with `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, and `PopoverClose`. The trigger and content are separated by wrapper markup on purpose. The goal is not to pass props through wrappers manually, it is to let both children talk to the same root-owned `open` state.

:::stackblitz{file="step2-exercise1-problem.ts" step=2 total=3 solution="step2-exercise1-solution.ts"}

#### **Exercise 2**

Build a tabs compound component where the triggers and panels can live in different parts of the JSX layout. The boundary should earn its keep by defining one shared `activeId` protocol, not by wrapping a fixed layout.

:::stackblitz{file="step2-exercise2-problem.ts" step=2 total=3 solution="step2-exercise2-solution.ts"}

#### **Exercise 3**

Build an accordion compound component that coordinates `AccordionItem`, `AccordionTrigger`, and `AccordionPanel`. The root owns which item is open, each item contributes its ID, and the trigger and panel collaborate through that shared protocol.

:::stackblitz{file="step2-exercise3-problem.ts" step=2 total=3 solution="step2-exercise3-solution.ts"}

> **Mental anchor**: "A compound component keeps one control booth and gives every child the same cue line."

**→ Bridge to Level 3**: A real protocol should keep working even when the DOM location changes or when the same component boundary repeats at deeper levels.

### Level 3: Keep The Protocol Through Portals And Recursive Trees

The final capability is recognizing that a strong component boundary is location-agnostic and depth-agnostic. A portal does not change ownership, and a recursive component earns its boundary because the same protocol repeats at each node.

#### **Exercise 1**

Move a dialog body into `#modal-root` with a portal while keeping `open` state in the dialog root. The close button inside the portal should still dismiss the dialog because React ownership did not move with the DOM.

:::stackblitz{file="step3-exercise1-problem.ts" step=3 total=3 solution="step3-exercise1-solution.ts"}

#### **Exercise 2**

Build a toast compound component that portals its viewport into `#toast-root`. The trigger lives in the normal layout, the dismiss button lives in the portal, and both should still collaborate through one root-owned state protocol.

:::stackblitz{file="step3-exercise2-problem.ts" step=3 total=3 solution="step3-exercise2-solution.ts"}

#### **Exercise 3**

Render a recursive file tree where each folder node owns its own expanded state and, when open, renders more `TreeNode` components of the same shape. This boundary earns its keep because it captures a repeating state-and-render rule, not because it hides miscellaneous markup.

:::stackblitz{file="step3-exercise3-problem.ts" step=3 total=3 solution="step3-exercise3-solution.ts"}

> **Mental anchor**: "Moving DOM or going deeper in the tree does not change who owns the protocol."

## Key Patterns

### Lift State To The Smallest Shared Owner

Move state upward only as far as the shared decision requires.

- **When to use it:** tabs plus panel, selected row plus details pane, one-open-at-a-time accordions
- **What it prevents:** duplicated truth where siblings drift apart

### Extract Boundaries Around Protocols, Not Around Markup

A separate component should define shared state, events, or repeated semantics.

- **When to use it:** roots with triggers, panels, items, close buttons, or repeated node contracts
- **What it prevents:** wrapper components that only rearrange JSX without clarifying responsibility

### Use Context To Free The Visual Structure

Context is the tool that lets triggers, panels, and close buttons sit in different places while still reading one owner.

- **When to use it:** compound components whose children are separated by layout wrappers
- **What it prevents:** prop threading that re-couples state to one rigid markup shape

### Remember That Portals Relocate DOM, Not Ownership

If a component renders through a portal, its state and context still come from the same React tree.

- **When to use it:** dialogs, toasts, menus, overlays
- **What it prevents:** mistaken rewrites where state is moved unnecessarily just because DOM output moved

### Let Recursive Components Own Repeating Local Rules

Some boundaries earn local state because the same behavior repeats at each node.

- **When to use it:** trees, nested menus, comment branches, outline explorers
- **What it prevents:** giant parent components that manually thread expansion state through every depth without a local protocol

---

## Decision Framework

1. What is the actual question the UI is trying to answer?
   If several children need the answer, find their lowest common owner.

2. Do the extracted children share a real protocol?
   If they need shared state, events, or repeated semantics, the boundary is probably earning its keep.

3. Are you only moving JSX into another file without changing ownership or API?
   That is a weak boundary. Keep the code together until a real protocol appears.

4. Do the children need to appear in flexible positions in the layout?
   Use a compound component with context so structure stays flexible while ownership stays centralized.

5. Did the DOM move because of a portal?
   Keep the same owner unless the actual product decision changed.

6. Does one local rule repeat at every node in a recursive structure?
   Give that node its own component boundary. That is exactly the kind of repetition a component should capture.

## Common Gotchas & Edge Cases

- "Lifting state up" does not mean "move everything to the top of the app." It means "move this decision to the nearest component that can express it once."
- A child with local highlight state can look correct while a sibling details pane is already drifting. Visual feedback alone does not prove ownership is correct.
- A wrapper component is not automatically a compound component. Without a shared protocol, it is often just renamed JSX.
- Context should free layout, not hide unrelated state. Keep each compound protocol narrow and specific.
- A portal target like `document.body` or `#modal-root` changes DOM placement only. Event handlers and context still come from the same React tree.
- Recursive components are valuable when the same behavior repeats per node. They are not valuable when every level has different rules and the abstraction only adds indirection.
