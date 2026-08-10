---
title: "Memoization"
category: "react"
chapterId: "performance-optimization"
slug: "memoization"
description: "React.memo, useMemo, and useCallback to prevent unnecessary re-renders."
playgroundTemplate: "react-memo"
---

# Memoization

## What is it?

Memoization is **caching the result of a computation so it is not repeated unnecessarily**. In React, this means skipping re-renders or re-calculations when nothing has actually changed.

React gives you three tools:

## React.memo — skip re-rendering a component

Wraps a component and tells React: only re-render if the props actually changed.

```jsx
import { memo } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }) {
  console.log('rendered!');
  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
});

// ExpensiveList only re-renders when items changes,
// not when the parent re-renders for other reasons.
```

## useMemo — cache an expensive calculated value

```jsx
import { useMemo } from 'react';

function ProductPage({ products, category }) {
  // Only re-filters when products or category changes
  const filtered = useMemo(
    () => products.filter(p => p.category === category),
    [products, category]
  );

  return <ProductList items={filtered} />;
}
```

## useCallback — cache a function so its reference stays stable

```jsx
import { useCallback, memo } from 'react';

// Without useCallback, handleDelete is a new function every render,
// causing ChildButton (memo'd) to re-render anyway.
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []); // stable — no deps that change
```

## When should you actually use these?

Only when you have a **real, measured performance problem**. The overhead of memoization itself is not free. Profile first with React DevTools Profiler, then optimise.

| Tool | Use when |
|---|---|
| `React.memo` | Child re-renders too often with the same props |
| `useMemo` | A calculation is provably slow (large sorts, filters) |
| `useCallback` | Passing a callback to a `memo`'d child that keeps re-rendering |

> ⚠️ **Warning:** Wrapping everything in `memo` and `useMemo` is a common beginner mistake. It adds cognitive overhead and can actually hurt performance. Start without it — add it only when profiling proves you need it.
