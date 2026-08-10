---
title: "Concurrent Rendering Engine"
category: "react"
chapterId: "core-engine-mechanics"
slug: "concurrent-rendering-engine"
description: "Interruptible rendering that pauses to prioritize urgent user actions."
---

# Concurrent Rendering Engine

## What is it?

**Concurrent rendering** is React's ability to work on multiple versions of the UI simultaneously and pause rendering to handle higher-priority updates. Introduced in React 18, it makes apps feel faster by keeping the UI responsive during expensive operations.

Key idea: React can **start rendering a slow update, pause it when the user clicks something, handle that click, then resume the slow update**.

## How it differs from legacy rendering

| Legacy (React 17) | Concurrent (React 18+) |
|---|---|
| Rendering is **blocking** | Rendering is **interruptible** |
| One update at a time | Multiple updates in progress |
| Slow renders freeze the UI | Urgent work interrupts slow work |
| No time slicing | Renders in small chunks (time slices) |

## How to enable it

Concurrent rendering activates when you use:
- **`createRoot`** instead of `ReactDOM.render`.
- Concurrent features like `useTransition`, `useDeferredValue`, or `<Suspense>`.

```jsx
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />); // Concurrent mode enabled
```

## Time slicing

React splits rendering into **small chunks** (5ms each by default). Between chunks, React checks if something more urgent arrived:
- If yes → pause current work, handle urgent update, resume later.
- If no → continue rendering.

This prevents long-running renders from freezing the UI.

## Example: concurrent rendering in action

```jsx
function App() {
  const [urgent, setUrgent] = useState('');
  const [slow, setSlow] = useState('');

  return (
    <>
      <input
        value={urgent}
        onChange={e => {
          setUrgent(e.target.value); // High priority — instant
          startTransition(() => {
            setSlow(e.target.value); // Low priority — interruptible
          });
        }}
      />
      <ExpensiveList filter={slow} />
    </>
  );
}
```

The input stays responsive. If you type quickly, React **abandons** the incomplete `<ExpensiveList>` render from the previous keystroke and starts a fresh one for the latest value.

## Automatic batching

In React 18, all updates are batched automatically — even inside `setTimeout`, Promises, or native event handlers. This reduces re-renders.

```jsx
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(true);
  // React 18 → one re-render
  // React 17 → two re-renders
}, 1000);
```

## Tearing (and how React prevents it)

**Tearing** is when different parts of the UI show different versions of the same data. Concurrent rendering could cause this (top of screen shows old data, bottom shows new data) but React prevents it by ensuring a single consistent render for each commit.

> ⚠️ **Warning:** Concurrent rendering does NOT make your code faster — it makes the **UI feel** faster by prioritising what the user sees and interacts with. The same amount of JavaScript runs; it is just scheduled smarter.
