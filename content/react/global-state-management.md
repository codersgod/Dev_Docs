---
title: "Global State Management"
category: "react"
chapterId: "ecosystem-and-routing"
slug: "global-state-management"
description: "Redux Toolkit, Zustand, Recoil, or MobX."
---

# Global State Management

## What is it?

Global state management is for data that needs to be accessible by **many components across the app** — shopping cart, logged-in user, notification list. React's built-in Context API works for simple cases, but dedicated libraries offer better performance, devtools, and patterns for complex apps.

## The main options

### Zustand (recommended for most apps — simple, tiny)

```bash
npm install zustand
```

```jsx
import { create } from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }),
}));

// In any component — no provider needed
function Cart() {
  const { items, clearCart } = useCartStore();
  return (
    <>
      <p>{items.length} items in cart</p>
      <button onClick={clearCart}>Clear</button>
    </>
  );
}
```

### Redux Toolkit (for large teams, complex flows, strong devtools)

```bash
npm install @reduxjs/toolkit react-redux
```

```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
  },
});

const store = configureStore({ reducer: { counter: counterSlice.reducer } });
const { increment } = counterSlice.actions;

function Counter() {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(increment())}>{count}</button>;
}

// Wrap app with Provider
<Provider store={store}><Counter /></Provider>
```

## Choosing a library

| Library | Best for |
|---|---|
| Context API | Simple, infrequently-updated global data (theme, user) |
| Zustand | Most apps — minimal boilerplate, great performance |
| Redux Toolkit | Large teams, complex business logic, time-travel debugging |
| Jotai / Recoil | Atomic state (fine-grained subscriptions) |

> ⚠️ **Warning:** Do not reach for Redux just because the app has global state. Zustand solves 90% of use cases with 10% of the code. Add Redux when your team size and complexity actually demands it.
