---
title: "Suspense API"
category: "react"
chapterId: "advanced-concepts"
slug: "suspense-api"
description: "Suspense wrapper for fallback loaders during data fetching or code splitting."
---

# Suspense API

## What is it?

`<Suspense>` is a React component that shows a **fallback** (loading spinner, skeleton screen) while its children are waiting for something:
- **Code splitting** — a lazy-loaded component is downloading.
- **Data fetching** — a component is waiting for data from a server (using `use(promise)` in React 19 or libraries like Relay).
- **Server-side rendering** — a Server Component is streaming in.

## When to use it?

Any time you have async UI boundaries — parts of the page that load at different speeds.

## How to use it

### With code splitting (React.lazy)

```jsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

export default function Dashboard() {
  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <HeavyChart data={stats} />
    </Suspense>
  );
}
```

The fallback shows while `HeavyChart.js` is downloading. Once loaded, it swaps in.

### With data fetching (React 19 `use` hook)

```jsx
import { use, Suspense } from 'react';

function User({ userPromise }) {
  const user = use(userPromise); // Suspends until promise resolves
  return <h1>{user.name}</h1>;
}

export default function App() {
  const userPromise = fetch('/api/user/1').then(r => r.json());

  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <User userPromise={userPromise} />
    </Suspense>
  );
}
```

### Nested Suspense boundaries

You can nest multiple `<Suspense>` components to show different loading states for different parts of the UI.

```jsx
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<SpinnerSmall />}>
    <Posts />
  </Suspense>
  <Suspense fallback={<SpinnerSmall />}>
    <Comments />
  </Suspense>
</Suspense>
```

Each section loads independently — `<Header />` can appear before `<Posts>` finishes.

## Error boundaries + Suspense

Combine Suspense with an Error Boundary to handle both loading and error states:

```jsx
<ErrorBoundary fallback={<p>Failed to load</p>}>
  <Suspense fallback={<p>Loading...</p>}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
```

> ⚠️ **Warning:** `<Suspense>` does NOT work with `useEffect` data fetching — the promise must be "thrown" (like `use(promise)`) or come from a Suspense-aware library like Relay. TanStack Query and SWR do not suspend by default.
