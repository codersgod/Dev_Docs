---
title: "State Batching"
category: "react"
chapterId: "performance-optimization"
slug: "state-batching"
description: "Automatic batching of multiple state updates."
---

# State Batching

## What is it?

Batching means React **groups multiple state updates together and triggers only one re-render** instead of re-rendering for each individual update. This is a performance optimisation that happens automatically.

## React 17 vs React 18

In React 17, batching only happened inside React event handlers. State updates inside `setTimeout`, Promises, or native event listeners triggered separate re-renders.

In **React 18**, batching is **automatic everywhere** — event handlers, timeouts, Promises, and async code all batch automatically.

```jsx
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  function handleSubmit() {
    // React 18 — these two updates are batched into ONE re-render
    setName('Alice');
    setAge(30);
    // Component re-renders once, not twice
  }

  return <button onClick={handleSubmit}>Set User</button>;
}
```

## Opting out of batching

If you ever need a state update to trigger an immediate, separate render (rare), use `flushSync` from `react-dom`:

```jsx
import { flushSync } from 'react-dom';

flushSync(() => setName('Alice')); // re-renders immediately
flushSync(() => setAge(30));       // re-renders again
```

> ⚠️ **Warning:** You almost never need `flushSync`. Its main use case is measuring DOM layout right after a state update. Using it unnecessarily defeats the purpose of batching and hurts performance.
