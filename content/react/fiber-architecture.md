---
title: "Fiber Architecture"
category: "react"
chapterId: "core-engine-mechanics"
slug: "fiber-architecture"
description: "React's core engine redesign enabling incremental, interruptible rendering."
---

# Fiber Architecture

## What is it?

**Fiber** is React's internal reimplementation of its core rendering algorithm, introduced in React 16. The old "stack" reconciler was synchronous and blocking — once React started rendering, it could not stop until the entire tree finished. Fiber makes rendering **interruptible**, allowing React to pause, prioritise, and resume work.

Fiber is the foundation that enables:
- Concurrent rendering.
- Time slicing (pausing rendering to handle urgent events).
- Suspense and lazy loading.
- Error boundaries.

## How it works

Fiber treats rendering as **units of work**. Each component is a "fiber" node in a linked tree. React processes fibers incrementally:

1. **Begin work** — render a component, create its Virtual DOM.
2. **Pause if needed** — if a high-priority event (user click, typing) arrives, pause the current render.
3. **Resume later** — pick up where it left off.
4. **Commit** — once the entire tree is ready, apply changes to the real DOM in one synchronous pass.

## Why this matters

Before Fiber, a slow component could freeze the entire UI. Now React can pause rendering that component and handle the user's click first, making the app feel responsive even during heavy computation.

## Phases of rendering with Fiber

### Render phase (interruptible)

React walks the component tree, calls your components, and builds the Virtual DOM. This phase is **pure** — no side effects, no DOM mutations. React can pause and restart it.

### Commit phase (synchronous)

React applies all DOM changes, calls `useLayoutEffect`, and updates refs. This phase is **not interruptible** — once it starts, React finishes it.

## Fiber nodes

Every component has a corresponding **fiber** object with metadata:

```js
{
  type: 'div',              // Component type
  props: { className: 'box' },
  child: fiberNode,         // First child
  sibling: fiberNode,       // Next sibling
  return: fiberNode,        // Parent
  alternate: fiberNode,     // Previous version (for diffing)
  effectTag: 'UPDATE',      // What changed
}
```

React walks this tree using a **depth-first traversal** with pointers to child, sibling, and parent.

## Priority levels

Fiber assigns priorities to updates:
- **Immediate** — typing, clicking, focus changes.
- **User-blocking** — hover, scroll.
- **Normal** — data fetching.
- **Low** — analytics, logging.

React works on high-priority updates first and defers low-priority work.

> ⚠️ **Warning:** You do not interact with Fiber directly — it is an internal implementation detail. But understanding it helps you reason about why React 18+ behaves differently (concurrent features, automatic batching, Suspense).
