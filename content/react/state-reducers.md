---
title: "State & Reducers"
category: "react"
chapterId: "all-hooks-apis"
slug: "state-reducers"
description: "useState, useReducer for complex action-driven state transitions."
playgroundTemplate: "react-reducers"
---

# State & Reducers

## What is it?

React provides two primary hooks for managing state:

- **`useState`** — for simple, independent state values (a counter, a toggle, a form field).
- **`useReducer`** — for complex state that involves multiple related values or transitions driven by **actions** (like a shopping cart, a form with validation, or a state machine).

`useReducer` is inspired by Redux — you dispatch actions, and a reducer function computes the next state based on the action type.

## When to use each?

| Use `useState` when | Use `useReducer` when |
|---|---|
| State is a single primitive value | State is an object with multiple fields |
| Updates are simple assignments | Next state depends on action type |
| No complex logic between states | You need predictable state transitions |

## How to use useState

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </>
  );
}
```

## How to use useReducer

```jsx
import { useReducer } from 'react';

// Reducer function — pure, returns new state
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export default function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  return (
    <>
      <p>{state.items.length} items in cart</p>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', item: { id: 1, name: 'Apple' } })}>
        Add Apple
      </button>
      <button onClick={() => dispatch({ type: 'CLEAR' })}>Clear Cart</button>
    </>
  );
}
```

## Benefits of useReducer

- **Centralised logic** — all state transitions live in one reducer function.
- **Predictable** — given the same state and action, you always get the same next state.
- **Testable** — you can test the reducer in isolation without rendering components.

> ⚠️ **Warning:** Do not mutate state inside a reducer — always return a **new object**. `state.items.push(x)` will not trigger a re-render. Use `[...state.items, x]` instead.
