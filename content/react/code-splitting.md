---
title: "Code Splitting"
category: "react"
chapterId: "performance-optimization"
slug: "code-splitting"
description: "React.lazy, Suspense, and dynamic imports."
---

# Code Splitting

## What is it?

Code splitting breaks your JavaScript bundle into smaller chunks that are loaded **on demand**, instead of sending the entire app to the user upfront. This makes the initial page load faster because the browser only downloads the code it needs right now.

## What is React.lazy?

`React.lazy()` is a built-in function that lets you **load a component dynamically** — its code is only fetched from the network the first time that component is rendered.

```jsx
const Chart = lazy(() => import('./Chart'));
```

**What it accepts:** a function that returns a `Promise` — specifically a dynamic `import()` call that resolves to a module with a `default` export.

**What it returns:** a special lazy component that React knows to suspend while the import is in flight.

**Behaviour rules:**
- The import is triggered the **first time the component renders**, not when `lazy()` is called.
- Once loaded, the chunk is **cached** — it is never re-downloaded on subsequent renders.
- It **must** be wrapped in `<Suspense>` — without it, React throws an error.
- The default export of the imported module **must be a React component**.
- Named exports are not directly supported — re-export as default if needed.

## How Suspense works with lazy

While the dynamic import is pending, React renders the `fallback` prop of the nearest `<Suspense>` ancestor. Once the import resolves, React swaps the fallback with the real component.

```jsx
import { lazy, Suspense } from 'react';

const Chart = lazy(() => import('./Chart'));

export default function Dashboard() {
  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <Chart data={stats} />
    </Suspense>
  );
}
```

## Handling load errors

If the dynamic import fails (network error, chunk not found), it throws. Wrap with an Error Boundary to catch it gracefully:

```jsx
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const HeavyMap = lazy(() => import('./HeavyMap'));

export default function Page() {
  return (
    <ErrorBoundary fallback={<p>Failed to load map.</p>}>
      <Suspense fallback={<p>Loading map...</p>}>
        <HeavyMap />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## Route-level splitting with React Router

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/Home'));
const SettingsPage = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}
```

## When to split

| Split here ✅ | Don't split here ❌ |
|---|---|
| Routes / pages | Small buttons or icons |
| Heavy chart / map libraries | Components rendered on every page |
| Admin panels users rarely visit | Anything needed for the first paint |
| Rich text editors | Simple list items or cards |

> ⚠️ **Warning:** Do not lazy-load tiny components — the network round-trip cost outweighs the savings. Split at the **route or large-feature level**, not at the button level.
