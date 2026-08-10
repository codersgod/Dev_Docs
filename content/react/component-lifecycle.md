---
title: "Component Lifecycle"
category: "react"
chapterId: "state-and-lifecycle"
slug: "component-lifecycle"
description: "Mounting, updating, unmounting, and side effects."
playgroundTemplate: "react-lifecycle"
---

# Component Lifecycle

## What is it?

Every React component goes through three life stages:

- **Mounting** — the component appears on screen for the first time.
- **Updating** — the component re-renders because state or props changed.
- **Unmounting** — the component is removed from the screen.

In class components these stages had named methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`). In modern functional components, all three stages are handled by `useEffect`.

## When to use it?

Understanding the lifecycle helps you know **when** your code runs — crucial for fetching data, setting up subscriptions, or cleaning up timers.

## How to use it

```jsx
import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Runs after mounting (and after every update if no deps array)
    console.log('Component mounted');

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup runs on unmount (and before the next effect if deps change)
    return () => {
      clearInterval(interval);
      console.log('Component unmounted — interval cleared');
    };
  }, []); // Empty array = run once on mount only

  return <p>Time on screen: {seconds}s</p>;
}
```

## Lifecycle Map

| Stage | When it runs | `useEffect` equivalent |
|---|---|---|
| Mount | First render | `useEffect(() => {}, [])` |
| Update | State or props changed | `useEffect(() => {}, [dep])` |
| Unmount | Component removed from DOM | Return a cleanup function |

> ⚠️ **Warning:** Forgetting the cleanup function causes **memory leaks**. If you start a timer, subscription, or event listener inside `useEffect`, always return a cleanup function that cancels it.
