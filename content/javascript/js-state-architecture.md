---
title: "State Management Architecture"
category: "javascript"
chapterId: "js-system-design"
slug: "js-state-architecture"
description: "Normalized state, trade-offs between Redux, Zustand, and Signals."
---

# State Management Architecture

## What is it?

At scale, how you structure client-side state matters as much as how you fetch data. Two key problems: **normalization** (avoiding duplicate data) and **performance** (avoiding unnecessary re-renders).

## Normalized state shape

Flat, database-like structure indexed by ID — eliminates duplication and simplifies updates.

```js
// ❌ Denormalized — user repeated in every post
{ posts: [{ id: 1, user: { id: 1, name: 'Alice' }, title: '...' }] }

// ✅ Normalized — user stored once, referenced by ID
{
  users: { 1: { id: 1, name: 'Alice' } },
  posts: { 1: { id: 1, userId: 1, title: '...' } },
  postIds: [1, 2, 3],
}
```

## Tool comparison

| | Context API | Zustand | Redux Toolkit | Signals (Preact/Solid) |
|---|---|---|---|---|
| Bundle size | 0kb | ~1kb | ~10kb | ~2kb |
| Boilerplate | Low | Very low | Medium | Very low |
| DevTools | ❌ | ✅ | ✅ Best | Limited |
| Re-render control | Poor | Good | Good | Excellent |
| Server state | ❌ | ❌ | ❌ | ❌ (use TanStack Query) |
| Best for | Simple/infrequent | Most apps | Large teams | Fine-grained UI |

## Zustand normalized store example

```js
import { create } from 'zustand';

const useStore = create((set) => ({
  users: {},
  posts: {},
  addPost: (post) => set(state => ({
    posts: { ...state.posts, [post.id]: post },
    users: { ...state.users, [post.user.id]: post.user },
  })),
}));
```

> ⚠️ **Warning:** Don't put server state (API responses) in Redux/Zustand — use TanStack Query or SWR. Global stores are for client-side UI state (modals, selected items, preferences).
