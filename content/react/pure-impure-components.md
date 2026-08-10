---
title: "Pure vs. Impure Components"
category: "react"
chapterId: "performance-optimization"
slug: "pure-impure-components"
description: "Understanding component purity for predictable rendering and memoization."
playgroundTemplate: "react-purity"
---

# Pure vs. Impure Components

## What is it?

A **pure component** is one where the output (rendered JSX) is determined **only by its props and state**. Same inputs → same output. No side effects during render. An **impure component** reads or modifies external variables, performs side effects during render, or produces different output from the same inputs.

## When does it matter?

React 19's compiler and `React.memo` depend on purity to safely skip re-renders. If your component is impure, React cannot optimize it, and you will see stale UI, hard-to-reproduce bugs, or infinite loops.

## How to use it

### ✅ Pure component

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Same input → same output
<Greeting name="Alice" /> // Always renders "Hello, Alice!"
```

**Rules:**
1. Render logic must not modify variables that existed before the render.
2. Output determined solely by props and state.
3. No side effects — no API calls, no DOM mutations, no timers.

### ❌ Impure component

```jsx
let globalCounter = 0; // External variable

function Counter() {
  globalCounter++; // Mutating external state during render
  return <p>Rendered {globalCounter} times</p>;
}

// In Strict Mode, React renders twice → count is off
```

**Why this breaks:**
- React may call your component multiple times for a single update.
- Concurrent rendering can pause and restart renders.
- `React.memo` might skip a render, making the count inaccurate.

### Another impure example

```jsx
function ProductCard({ product }) {
  // ❌ Side effect during render
  fetch(`/api/track?id=${product.id}`);
  return <div>{product.name}</div>;
}

// Fix: move side effects to useEffect
function ProductCard({ product }) {
  useEffect(() => {
    fetch(`/api/track?id=${product.id}`);
  }, [product.id]);
  return <div>{product.name}</div>;
}
```

## Pure component checklist

| Question | Pure ✅ | Impure ❌ |
|----------|---------|-----------|
| Same props → same JSX? | Yes | No |
| Reads/modifies global variables? | No | Yes |
| Makes API calls during render? | No | Yes |
| Uses `Math.random()` or `Date.now()` in JSX? | No | Yes |
| Mutates props or objects? | No | Yes |

## Common pure patterns

```jsx
// ✅ Computing derived data (pure)
function ShoppingCart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <p>Total: ${total}</p>;
}

// ✅ Conditional rendering (pure)
function Status({ isOnline }) {
  return isOnline ? <span>Online</span> : <span>Offline</span>;
}

// ✅ Mapping arrays (pure)
function List({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```

## When components can be "impure"

Side effects are fine in:
- Event handlers (`onClick`, `onSubmit`)
- `useEffect`, `useLayoutEffect`
- `useCallback`, `useMemo` (but be careful)

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');

  // ✅ Side effect in event handler
  function handleSearch() {
    fetch(`/api/search?q=${query}`).then(/* ... */);
  }

  return (
    <input value={query} onChange={(e) => setQuery(e.target.value)} />
    <button onClick={handleSearch}>Search</button>
  );
}
```

## React.memo and purity

`React.memo` only works correctly with pure components.

```jsx
const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  console.log('Rendering...');
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
});

// If ExpensiveList is pure and items don't change → React skips render
```

If the component is impure (mutates globals, uses random values), memoization will cache stale results.

## ⚠️ Warning

**"Why did my component render with old data?"**  
→ You mutated a prop or state object instead of creating a new one. React compares references, not deep values.

```jsx
// ❌ Impure mutation
function addItem(items, newItem) {
  items.push(newItem); // Mutates the array
  return items; // Same reference
}

// ✅ Pure immutable update
function addItem(items, newItem) {
  return [...items, newItem]; // New array
}
```

**"My API is being called 10 times on mount!"**  
→ You put `fetch()` in the component body. Move it to `useEffect`.

**"Why does Strict Mode make my counter wrong?"**  
→ Strict Mode intentionally renders twice in development to catch impurity. If your counter increments twice, you are mutating external state during render — fix by moving the logic to `useEffect` or an event handler.
