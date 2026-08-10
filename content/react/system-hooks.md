---
title: "System & Resource Reading"
category: "react"
chapterId: "all-hooks-apis"
slug: "system-hooks"
description: "useId, useSyncExternalStore, useDebugValue, and use for promises/context."
---

# System & Resource Reading Hooks

React provides several utility hooks for generating IDs, syncing with external data sources, debugging custom hooks, and consuming promises or context inline.

## useId — generating accessible IDs

## What is it?

`useId` generates a **unique ID** that is stable across server and client renders. Use it to link form labels with their inputs for accessibility.

```jsx
import { useId } from 'react';

export default function EmailField() {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
```

The ID is unique even if you render `<EmailField />` multiple times on the same page.

## useSyncExternalStore — subscribing to non-React stores

## What is it?

`useSyncExternalStore` lets you subscribe to an **external data source** (like a Redux store, a browser API, or a WebSocket) and automatically re-render when it changes.

```jsx
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

export default function OnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <p>{isOnline ? '🟢 Online' : '🔴 Offline'}</p>;
}
```

## useDebugValue — labeling custom hooks in DevTools

## What is it?

`useDebugValue` adds a **custom label** to your hook in React DevTools. It is purely for debugging — it has no effect on behavior.

```jsx
import { useState, useDebugValue } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useDebugValue(isOnline ? 'Online' : 'Offline'); // Shows in DevTools
  return isOnline;
}
```

## use — consuming promises or context inline (React 19)

## What is it?

`use` is a new primitive in React 19 that lets you **unwrap a promise or read context** directly inside your render function — even inside conditions or loops.

Unlike hooks, `use` does not follow the Rules of Hooks.

### Reading context

```jsx
import { use } from 'react';
import { ThemeContext } from './ThemeContext';

function Button() {
  const theme = use(ThemeContext); // No useContext needed
  return <button style={{ background: theme.primary }}>Click</button>;
}
```

### Reading a promise (Suspense required)

```jsx
import { use, Suspense } from 'react';

function UserCard({ userPromise }) {
  const user = use(userPromise); // Suspends until resolved
  return <h1>{user.name}</h1>;
}

// Wrap with Suspense
<Suspense fallback={<p>Loading...</p>}>
  <UserCard userPromise={fetchUser(1)} />
</Suspense>
```

The component pauses rendering until the promise resolves.

> ⚠️ **Warning:** `useSyncExternalStore` is a low-level hook — most apps never need it directly. Libraries like Redux or Zustand use it internally. For custom data sources, consider a simpler `useEffect` + `useState` approach first.
