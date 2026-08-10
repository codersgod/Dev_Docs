---
title: "Server-Side Hydration"
category: "react"
chapterId: "core-engine-mechanics"
slug: "server-hydration"
description: "Reviving server-rendered HTML by attaching client-side event listeners."
---

# Server-Side Hydration

## What is it?

**Hydration** is the process of taking **static HTML rendered on the server** and making it interactive by attaching React's JavaScript event handlers and state management on the client. The server sends a fully-rendered page, and React "revives" it without re-rendering everything.

## How it works

1. **Server renders** — React runs on the server, generates HTML, sends it to the browser.
2. **Browser displays** — The user sees the page immediately (fast first paint).
3. **JavaScript loads** — React's bundle downloads.
4. **Hydration** — React walks the existing DOM, attaches event listeners, and initialises state.

After hydration, the app is fully interactive.

## Hydration vs. rendering

| | Rendering | Hydration |
|---|---|---|
| **What it does** | Creates DOM nodes from scratch | Reuses existing DOM nodes |
| **When it happens** | Client-side only apps | Server-rendered apps |
| **Speed** | Slower (build + paint) | Faster (HTML already visible) |

## How to hydrate

In React 18+, use `hydrateRoot` instead of `createRoot`:

```jsx
// client.jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(document.getElementById('root'), <App />);
```

React expects the HTML in the DOM to **exactly match** what the server rendered. If it does not, React logs a warning (hydration mismatch) and re-renders the mismatched parts.

## Common hydration mismatches

### 1. Different content on server vs. client

```jsx
function Time() {
  return <p>{new Date().toTimeString()}</p>; // Different every render!
}
```

Server renders one timestamp, client expects the same, but generates a new one → mismatch.

**Fix:** Use `useEffect` to update time-dependent values after hydration:

```jsx
function Time() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date().toTimeString());
  }, []);

  return <p>{time || 'Loading...'}</p>;
}
```

### 2. Conditional rendering based on client-only APIs

```jsx
function App() {
  if (typeof window !== 'undefined') {
    return <ClientOnlyComponent />; // Mismatch!
  }
  return <ServerComponent />;
}
```

Server renders `<ServerComponent>`, client renders `<ClientOnlyComponent>` → mismatch.

**Fix:** Use `useEffect` to detect client-side after hydration.

## Selective hydration (React 18)

React 18 introduced **selective hydration** with `<Suspense>`. Parts of the page wrapped in Suspense can hydrate **independently and out of order**.

```jsx
<Suspense fallback={<Spinner />}>
  <Comments /> {/* Can hydrate before or after Posts */}
</Suspense>
<Suspense fallback={<Spinner />}>
  <Posts />
</Suspense>
```

If `<Comments>` JavaScript loads first, React hydrates it immediately — even if `<Posts>` is still downloading.

## Hydration errors and debugging

React logs hydration warnings in the console:

```
Warning: Text content did not match. Server: "Hello" Client: "Hi"
```

To find the source:
1. Check for client-only values (window, localStorage, Date).
2. Ensure server and client render the same initial state.
3. Use `suppressHydrationWarning` on the element if the mismatch is intentional (rare).

> ⚠️ **Warning:** Hydration mismatches cause React to **discard the server HTML and re-render from scratch** — throwing away the performance benefit of SSR. Fix mismatches instead of ignoring them.
