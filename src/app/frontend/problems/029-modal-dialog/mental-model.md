## The Problem

Build a reusable `Modal` component that renders its children in a dialog overlay. The component accepts three props:

```tsx
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
```

When `isOpen` is false, the modal must not appear in the DOM. When it is true, it must render a backdrop and a `role="dialog"` container holding `children`. Clicking the backdrop calls `onClose`. The final version uses a portal to attach the modal to `document.body` instead of wherever `<Modal>` sits in the component tree.

## Overview

The obvious first move is to render the modal directly inside the component that opens it. That works for simple demos but breaks in real apps when any ancestor has `overflow: hidden` or a CSS stacking context. The modal gets clipped or buried, and no amount of `z-index` tweaking fixes it because the problem is structural: the modal is trapped inside a subtree that the browser will not let it escape.

The fix is not a CSS workaround. It is a rendering location change. React's `createPortal` lets a component stay in the component tree while sending its DOM output somewhere else — in this case, straight to `document.body`, which sits outside every application stacking context.

## Core Concept and Mental Model

### The two trees

React maintains two trees at the same time. The component tree is the hierarchy React uses to track ownership, context, and re-render propagation. The DOM tree is the physical document structure the browser uses for layout and painting.

Normally these mirror each other. A component that renders inside a sidebar will have its DOM output inside the sidebar's DOM node. That coupling is useful for most content, but a problem for modals and tooltips, where the visual placement needs to be independent of the structural position.

`createPortal(children, container)` breaks that coupling. The component stays where it is in the React tree, so props flow down normally and context is still available. The rendered output appears under `container` in the DOM instead.

```
Component tree:               DOM tree (with portal):

  App                           <body>
    Header                        <div id="root">
    Main                            ...Header...
      Sidebar                       ...Main...
      Modal (isOpen=true)         </div>
                                    <div>  <-- portal output
                                      <div role="dialog">
                                        children
                                      </div>
                                    </div>
                                  </body>
```

### State still lives at the owner

The portal changes where content renders, not who controls it. The component that holds `isOpen` still decides whether the modal appears. It still passes `onClose` down. When `isOpen` changes, React re-renders the modal and updates the portal output. The portal is a rendering escape hatch, not an ownership transfer.

### Why returning null beats hiding with CSS

A modal that hides with `display: none` or `visibility: hidden` still exists in the DOM. It still occupies memory and still gets read by screen readers in some configurations. Returning `null` when `isOpen` is false removes the modal from the DOM entirely. Nothing is there until the user opens it.

## How I Think Through This

Start with the controlled open/close mechanic before touching the portal. The modal needs to appear and disappear based on `isOpen`, call `onClose` when the backdrop is clicked, and render children in a dialog element. Get all of that working inline first. Once the open/close behavior is solid, the portal step is purely a rendering target swap. The component logic does not change.

When reasoning about the backdrop click, think about event propagation. The backdrop is the outer wrapper. The dialog is the inner element. A click inside the dialog should not close the modal. A click on the backdrop should. `stopPropagation` on the dialog element handles this: it lets clicks inside the dialog die there without bubbling up to the backdrop's `onClick`.

The portal step feels smaller than it looks. One import, one function call wrapping the existing JSX. The observable change is where the output lands in the DOM.

---

## Building the Solution

### Step 1: Build the controlled modal shell

The first move is the open/close mechanic. When `isOpen` is false, nothing should exist in the DOM. When it is true, the component should render a backdrop and a `role="dialog"` container with the children inside.

Think about what `isOpen` controls here. It is not a class, not visibility — it is whether anything exists at all. If you return `null` when closed, the modal leaves the DOM entirely. That is the cleaner model compared to hiding it with CSS, both for accessibility and for reasoning about what state is active.

Once the modal is visible, think through what the backdrop click needs to do without also closing when someone clicks inside the dialog.

:::stackblitz{file="step1-problem.tsx" step=1 total=2 solution="step1-solution.tsx"}

**Hints**

- Return `null` when `isOpen` is false.
- The outer wrapper calls `onClose` on click. The inner dialog element calls `e.stopPropagation()` to prevent that click from bubbling to the backdrop.
- Render `children` inside a `role="dialog"` element.

### Step 2: Escape the DOM tree with a portal

The modal now works, but it renders inline wherever `<Modal>` sits in the component tree. Any ancestor with `overflow: hidden` or a stacking context can clip or bury it.

Move the modal's rendered output to `document.body` using `createPortal`. The component logic stays exactly the same — the `isOpen` guard, the backdrop click, the `stopPropagation`. The only change is that the JSX you return passes through `createPortal(..., document.body)` instead of being returned directly.

One verifiable consequence of adding the portal: the dialog element's immediate grandparent in the DOM becomes `document.body` instead of the testing library container. That is the observable goal for this step.

:::stackblitz{file="step2-problem.tsx" step=2 total=2 solution="step2-solution.tsx"}

**Hints**

- `import { createPortal } from 'react-dom'`
- Wrap the entire backdrop and dialog JSX in `createPortal(content, document.body)`.
- The `if (!isOpen) return null` guard stays in place — return null before reaching `createPortal`.

### Final Solution

The finished modal controls its visibility, handles backdrop dismissal, and renders into `document.body` via a portal. The component tree position of `<Modal>` no longer matters for visual placement. Any parent's `overflow` or stacking context is bypassed.

:::stackblitz{file="solution.tsx" step=2 total=2 solution="solution.tsx"}
