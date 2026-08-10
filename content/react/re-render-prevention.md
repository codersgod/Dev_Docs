---
title: "Re-render Prevention"
category: "react"
chapterId: "performance-optimization"
slug: "re-render-prevention"
description: "React.memo alongside useCallback and useMemo for shallow prop comparison."
playgroundTemplate: "react-rerender"
---

# Re-render Prevention

## What is it?

React re-renders a component when:
1. Its state changes.
2. Its parent re-renders (even if props did not change).
3. Context it subscribes to changes.

**Re-render prevention** is about skipping unnecessary renders when a component's output would be identical to the previous render.

## When to use it?

Only when you have a **measured performance problem** — profile with React DevTools Profiler first. Premature optimization adds complexity without benefit.

## The tools

### React.memo — skip re-renders when props are the same

```jsx
import { memo } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }) {
  console.log('Rendering list');
  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
});
```

React does a **shallow comparison** of props. If all props are the same as last render (using `Object.is`), React skips rendering.

### useCallback — stabilize function references

Functions are re-created on every render:

```jsx
function Parent() {
  const handleClick = () => console.log('Clicked'); // New function every render

  return <MemoizedChild onClick={handleClick} />; // Still re-renders — different function!
}
```

Fix it with `useCallback`:

```jsx
import { useCallback } from 'react';

function Parent() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Same function across renders

  return <MemoizedChild onClick={handleClick} />; // Now skips re-render
}
```

### useMemo — cache expensive calculations

```jsx
import { useMemo } from 'react';

function ProductList({ products }) {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.price - b.price),
    [products] // Only re-sort when products changes
  );

  return <ul>{sortedProducts.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

## The memoization trifecta

```jsx
const Child = memo(function Child({ data, onClick }) {
  // ...
});

function Parent() {
  const [count, setCount] = useState(0);

  // Stabilize the data object
  const memoizedData = useMemo(() => ({ value: 42 }), []);

  // Stabilize the callback
  const memoizedClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child data={memoizedData} onClick={memoizedClick} />
    </>
  );
}
```

Now `Child` only re-renders when `memoizedData` or `memoizedClick` actually changes.

## When NOT to use memoization

- Component renders fast (<16ms).
- Component always renders with different props anyway.
- Parent and child both need to re-render together.

Memoization has a cost — memory to store cached values and time to compare props. Only use it when profiling proves it helps.

> ⚠️ **Warning:** Wrapping everything in `memo`, `useMemo`, and `useCallback` is a code smell. Start simple, profile, then optimize the bottlenecks. Most components do not need memoization.
