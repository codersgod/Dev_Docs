---
title: "Layout & Timing"
category: "react"
chapterId: "all-hooks-apis"
slug: "layout-timing-hooks"
description: "useLayoutEffect (synchronous) and useInsertionEffect (style injection)."
---

# Layout & Timing Hooks

React provides two specialised effect hooks for precise timing control: `useLayoutEffect` and `useInsertionEffect`.

## useLayoutEffect — synchronous DOM reads/writes

## What is it?

`useLayoutEffect` runs **synchronously after React updates the DOM but before the browser paints**. This is your hook for reading layout (element sizes, scroll positions) or making immediate DOM mutations that must happen before the user sees anything.

## When to use it?

- Measuring an element's size or position (tooltips, modals, dynamic layouts).
- Triggering animations that need exact starting positions.
- Preventing visual "flash" from a two-step render (measure → adjust).

Use `useEffect` for 99% of cases. Only reach for `useLayoutEffect` when you **observe a flicker** that you need to fix.

```jsx
import { useLayoutEffect, useRef, useState } from 'react';

export default function Tooltip() {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const rect = tooltipRef.current.getBoundingClientRect();
    // Calculate position before paint — no flicker
    setPosition({ top: rect.height, left: 0 });
  }, []);

  return <div ref={tooltipRef} style={position}>Tooltip content</div>;
}
```

## useInsertionEffect — inject styles before layout

## What is it?

`useInsertionEffect` runs **before all DOM mutations**, even before `useLayoutEffect`. It was added in React 18 specifically for CSS-in-JS libraries (like Styled Components, Emotion) to inject `<style>` tags before layout calculations happen.

## When to use it?

**Almost never — unless you are building a CSS-in-JS library.** Application code should not use this hook.

```jsx
import { useInsertionEffect } from 'react';

function useCSS(rule) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = rule;
    document.head.appendChild(style);
    return () => style.remove();
  }, [rule]);
}
```

## Execution order

```
1. useInsertionEffect → inject styles
2. React updates DOM
3. useLayoutEffect → measure/adjust layout
4. Browser paints
5. useEffect → regular side effects
```

> ⚠️ **Warning:** `useLayoutEffect` blocks the browser from painting — use it sparingly. Slow code inside `useLayoutEffect` makes your app feel laggy because the screen freezes until it completes.
