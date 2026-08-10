---
title: "Built-in Hooks"
category: "react"
chapterId: "hooks-in-depth"
slug: "built-in-hooks"
description: "useRef, useMemo, useCallback, useReducer, and useContext."
playgroundTemplate: "react-hooks"
---

# Built-in Hooks

React ships several hooks beyond `useState` and `useEffect`. Here is a plain-English guide to each.

## useRef — a box that persists across renders

Holds a mutable value that does **not** trigger a re-render when changed. Most commonly used to access a real DOM element.

```jsx
import { useRef } from 'react';

export default function FocusInput() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} placeholder="Type here" />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
```

## useMemo — cache an expensive calculation

Recomputes only when dependencies change. Use it for slow calculations, not for every value.

```jsx
import { useMemo } from 'react';

const sorted = useMemo(
  () => [...items].sort((a, b) => a.price - b.price),
  [items] // only re-sort when items changes
);
```

## useCallback — cache a function reference

Returns the same function instance between renders. Needed when passing callbacks to memoized child components.

```jsx
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

## useReducer — state machine for complex state

Like `useState` but state transitions are described by a reducer function. Great when next state depends on the action type.

```jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

## useContext — read context without prop drilling

```jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Button() {
  const theme = useContext(ThemeContext);
  return <button style={{ background: theme.primary }}>Click</button>;
}
```

> ⚠️ **Warning:** `useMemo` and `useCallback` add complexity. Only use them when you have a **measured** performance problem — premature optimisation makes code harder to read.
