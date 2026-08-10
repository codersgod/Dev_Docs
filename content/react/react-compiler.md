---
title: "The React Compiler"
category: "react"
chapterId: "core-engine-mechanics"
slug: "react-compiler"
description: "Automating optimizations by analyzing code and injecting memoization."
---

# The React Compiler

## What is it?

The **React Compiler** (formerly "React Forget") is an experimental compiler that automatically optimizes your React code. It analyses your components and injects `useMemo`, `useCallback`, and `React.memo` where needed — so you do not have to manually wrap everything to prevent re-renders.

As of React 19, it is still experimental but available for testing.

## How it works

The compiler:
1. Analyses your component's code at build time.
2. Tracks which values and functions are stable vs. changing.
3. Automatically wraps expensive computations in `useMemo`.
4. Automatically wraps callbacks in `useCallback`.
5. Memoizes entire components when their props do not change.

## Before vs. After

### Before (manual memoization)

```jsx
import { useMemo, useCallback, memo } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items, onSelect }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.price - b.price);
  }, [items]);

  const handleClick = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});
```

### After (React Compiler does this automatically)

```jsx
function ExpensiveList({ items, onSelect }) {
  const sortedItems = [...items].sort((a, b) => a.price - b.price);

  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item.id} onClick={() => onSelect(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

The compiler injects the memoization behind the scenes.

## Benefits

- **Less boilerplate** — no manual `useMemo` everywhere.
- **No over-optimisation** — the compiler only memoizes when it detects a performance benefit.
- **Easier code reviews** — less clutter, clearer intent.

## How to enable it (experimental)

Install the compiler plugin:

```bash
npm install babel-plugin-react-compiler
```

Add it to your Babel config:

```js
// babel.config.js
module.exports = {
  plugins: ['babel-plugin-react-compiler'],
};
```

Or use the Vite/Next.js plugins if available.

## Limitations

- **Experimental** — not production-ready yet (as of 2024).
- **Requires pure components** — side effects during render break the compiler's assumptions.
- **Does not fix all performance problems** — still need profiling and manual optimisations for complex cases.

## Why this matters

The React Compiler represents a shift toward **zero-cost abstractions** — write simple, clean code and let the compiler handle performance. Similar to how Svelte compiles away the framework, React is moving toward compiling away manual optimisations.

> ⚠️ **Warning:** The compiler is still experimental. Do not rely on it for production apps yet. Manual memoization still works and will continue to work — the compiler is additive, not a replacement.
