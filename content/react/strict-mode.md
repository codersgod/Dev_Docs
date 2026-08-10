---
title: "Strict Mode"
category: "react"
chapterId: "performance-optimization"
slug: "strict-mode"
description: "Identifying unsafe lifecycles and unexpected side effects in development."
---

# Strict Mode

## What is it?

`React.StrictMode` is a wrapper component that **activates extra development-only checks and warnings**. It renders nothing visible but helps you catch bugs early.

Key things it does in development:
- Calls your component's render function and effects **twice** (intentionally) to detect impure code that accidentally has side effects during render.
- Warns about deprecated APIs.
- Warns about effects missing cleanup functions.

Strict Mode has **zero effect in production** — it only runs in development.

## When to use it?

Always. Keep it wrapped around your entire app (or the parts you are actively developing) to catch bugs before they reach production.

## How to use it

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## What the double-render reveals

If your component has state or side effects that run during rendering, Strict Mode's double invocation will expose them:

```jsx
// This is impure — it modifies an external variable during render
let count = 0;
function Bad() {
  count++; // ← runs twice in StrictMode — count becomes 2 instead of 1
  return <p>{count}</p>;
}

// This is pure — same input, same output, no side effects
function Good({ name }) {
  return <p>Hello {name}</p>; // safe to call twice
}
```

> ⚠️ **Warning:** If you see `useEffect` cleanup running immediately after mount in development — that is Strict Mode working correctly, not a bug. Your cleanup logic is being tested. Do not remove StrictMode to fix it; fix the cleanup logic.
