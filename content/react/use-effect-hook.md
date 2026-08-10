---
title: "useEffect Hook"
category: "react"
chapterId: "state-and-lifecycle"
slug: "use-effect-hook"
description: "Dependency arrays, clean-up functions, and skipping effects."
playgroundTemplate: "react-effect"
---

# useEffect Hook

## What is it?

`useEffect` lets you **run code after the component renders** — for things that happen outside the UI, like fetching data, reading from localStorage, setting up a timer, or subscribing to an event.

The name comes from "side effects" — any operation that reaches outside the component's own render cycle.

## When to use it?

- Fetching data from an API on load.
- Syncing with external systems (WebSocket, localStorage, analytics).
- Setting up or clearing timers and event listeners.

## How to use it

The dependency array controls **when** the effect re-runs.

```jsx
import React, { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Runs after every render where userId changed
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Re-runs only when userId changes

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

## Dependency Array Cheat Sheet

```jsx
useEffect(() => { /* runs after every render */ });

useEffect(() => { /* runs once on mount only */ }, []);

useEffect(() => { /* runs when count changes */ }, [count]);

useEffect(() => {
  const sub = subscribe();
  return () => sub.unsubscribe(); // cleanup on unmount
}, []);
```

> ⚠️ **Warning:** Including a function or object in the deps array that is re-created on every render will cause an infinite loop. Wrap those in `useCallback` or `useMemo`, or define them outside the component.
