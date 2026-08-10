---
title: "Error Boundaries"
category: "react"
chapterId: "advanced-concepts"
slug: "error-boundaries"
description: "Catching JavaScript errors in child components using class components."
---

# Error Boundaries

## What is it?

An error boundary is a React component that **catches JavaScript errors in its child tree** and displays a fallback UI instead of crashing the whole page. Think of it like a try/catch block, but for your component tree.

## When to use it?

Wrap any part of your UI that might fail — especially third-party widgets, data-fetched sections, or routes. Do not wrap your entire app in one big boundary — use multiple boundaries so one section can fail without taking down everything else.

## How to use it

Error boundaries must be **class components** (there is no hook equivalent yet — use the `react-error-boundary` library for a hook-friendly version).

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Caught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please refresh.</p>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <SomeComponentThatMightCrash />
</ErrorBoundary>
```

## Easier: use react-error-boundary

```jsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <MyWidget />
</ErrorBoundary>
```

> ⚠️ **Warning:** Error boundaries only catch errors during **rendering** and in lifecycle methods. They do NOT catch errors inside event handlers — use regular try/catch for those.
