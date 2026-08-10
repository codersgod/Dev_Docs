---
title: "useState Hook"
category: "react"
chapterId: "state-and-lifecycle"
slug: "use-state-hook"
description: "Initializing state, updating state, and functional updates."
playgroundTemplate: "react-counter"
---

# useState Hook

## What is it?

`useState` lets you add a **reactive variable** to a functional component. When you update it, React automatically re-renders the component to show the new value. Without state, your UI would be a static snapshot that never changes.

## When to use it?

Any time a component needs to remember something between renders — a counter, form input value, toggle switch, modal open/closed status.

## How to use it

Call `useState(initialValue)`. It returns an array with two items: the current value and a setter function.

```jsx
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

## Functional Updates (safe pattern)

When the new state depends on the old state, use a function inside the setter. This prevents stale value bugs.

```jsx
// Safe — always uses the latest value
setCount(prev => prev + 1);

// Risky — may use a stale snapshot of count
setCount(count + 1);
```

> ⚠️ **Warning:** Never modify state directly — `count++` does nothing visible. Always call the setter function: `setCount(newValue)`. State updates are **asynchronous** — you will not see the new value immediately after calling the setter.
