---
title: "Higher-Order Components (HOC)"
category: "react"
chapterId: "advanced-concepts"
slug: "higher-order-components"
description: "Reusing component logic — mostly legacy, replaced by hooks."
---

# Higher-Order Components (HOC)

## What is it?

A Higher-Order Component is a **function that takes a component and returns a new, enhanced component**. It was the primary pattern for reusing component logic before React Hooks. You will encounter HOCs in older codebases and libraries like `connect()` from Redux, or `withRouter` from React Router v4.

## When to use it?

Mostly when you are working with a legacy codebase that has not been migrated to hooks, or when a third-party library requires it. For new code, prefer custom hooks.

## How to use it

```jsx
import React from 'react';

// HOC — wraps any component with loading logic
function withLoadingSpinner(WrappedComponent) {
  return function WithLoading({ isLoading, ...props }) {
    if (isLoading) return <p>Loading...</p>;
    return <WrappedComponent {...props} />;
  };
}

// Original component
function UserList({ users }) {
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}

// Enhanced component
const UserListWithLoading = withLoadingSpinner(UserList);

// Usage
<UserListWithLoading isLoading={false} users={data} />
```

## HOC vs Custom Hook

| | HOC | Custom Hook |
|---|---|---|
| Reuses | Rendering logic | Stateful logic |
| Can wrap JSX | Yes | No |
| Adds wrapper to DOM | Yes (extra div) | No |
| Modern? | Legacy | ✅ Preferred |

> ⚠️ **Warning:** HOCs can make your React DevTools component tree hard to read because they add wrapper components. When you have a choice, prefer a custom hook.
