---
title: "Concurrent Rendering"
category: "react"
chapterId: "all-hooks-apis"
slug: "concurrent-hooks"
description: "useTransition for non-blocking transitions, useDeferredValue for slow UI."
playgroundTemplate: "react-concurrent"
---

# Concurrent Rendering Hooks

React 18 introduced **concurrent rendering** — the ability to pause and resume rendering work to keep the UI responsive. Two hooks expose this power to application code: `useTransition` and `useDeferredValue`.

## useTransition — mark a state update as non-urgent

## What is it?

`useTransition` tells React: "This state update is not urgent — if the user types or clicks, pause this work and handle that first." It splits your update into two phases:
- **Urgent** — the user's immediate action (typing in an input).
- **Non-urgent** — the slow computation triggered by that action (filtering a huge list).

## When to use it?

When a state update causes a slow re-render that freezes the UI. Common examples:
- Filtering or searching a large dataset.
- Switching tabs with heavy content.
- Real-time previews of user input.

```jsx
import { useState, useTransition } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // Urgent — update input instantly

    startTransition(() => {
      // Non-urgent — can be interrupted
      setResults(expensiveFilter(e.target.value));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <p>Updating...</p> : <ResultList items={results} />}
    </>
  );
}
```

The input stays responsive — typing never freezes — while the results update in the background.

## useDeferredValue — defer an expensive derived value

## What is it?

`useDeferredValue` takes a value and returns a **lagging copy** of it. React keeps the old value on screen while the new one renders in the background. When the new render finishes, React swaps it in.

This is useful when you **receive** a prop or state value but rendering it is slow.

```jsx
import { useState, useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery lags behind query — old results stay visible
  // until the new expensive render completes
  return <HeavyList filter={deferredQuery} />;
}

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <SearchResults query={query} />
    </>
  );
}
```

## useTransition vs useDeferredValue

| | `useTransition` | `useDeferredValue` |
|---|---|---|
| **Use when** | You control the state update | You receive a value (prop/state) |
| **What it defers** | A `setState` call | A value you render with |
| **Shows pending state** | Yes (`isPending` flag) | No (shows stale data) |

> ⚠️ **Warning:** These hooks do NOT make your code faster — they make the UI **feel** faster by keeping it responsive. The work still happens; it just does not block urgent interactions.
