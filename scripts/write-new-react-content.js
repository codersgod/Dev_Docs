// Script to write all NEW React roadmap markdown files
const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('wrote:', filePath);
}

const base = path.join(__dirname, '..', 'content', 'react');

// ─── 1. React Fundamentals (NEW) ─────────────────────────────────────────────

write(path.join(base, 'fragments.md'), `---
title: "Fragments"
category: "react"
chapterId: "react-fundamentals"
slug: "fragments"
description: "Grouping children without adding extra wrapper nodes to the DOM."
playgroundTemplate: "react-fragments"
---

# Fragments

## What is it?

A Fragment is a special wrapper that lets you **group multiple JSX elements without adding an extra \`<div>\` to the DOM**. It is React's invisible container — your component returns multiple siblings, but the DOM stays clean.

## When to use it?

When you need to return multiple elements from a component but do not want to introduce an unnecessary wrapper \`<div>\` that could:
- Break CSS layouts (Flexbox, Grid).
- Violate HTML semantics (e.g., \`<tr>\` directly inside \`<table>\` without a \`<tbody>\` wrapper).
- Pollute the DOM tree with meaningless divs.

## How to use it

### Long syntax — \`<Fragment>\`

\`\`\`jsx
import { Fragment } from 'react';

function List() {
  return (
    <Fragment>
      <li>Item 1</li>
      <li>Item 2</li>
    </Fragment>
  );
}
\`\`\`

### Short syntax — \`<>...</>\` (most common)

\`\`\`jsx
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}
\`\`\`

Both produce the same result: no wrapper div in the actual DOM.

## When you MUST use the long syntax

If you need to pass a **key** prop (for example, when mapping inside a loop), use \`<Fragment key={id}>\` — the short syntax does not accept props.

\`\`\`jsx
items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.definition}</dd>
  </Fragment>
));
\`\`\`

> ⚠️ **Junior Warning:** You cannot add className, style, or any other props to a Fragment — it is not a real DOM element. If you need styling or attributes, use a real \`<div>\` instead.
`);

// ─── 3. All Built-In React Hooks & APIs (NEW) ────────────────────────────────

write(path.join(base, 'state-reducers.md'), `---
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

- **\`useState\`** — for simple, independent state values (a counter, a toggle, a form field).
- **\`useReducer\`** — for complex state that involves multiple related values or transitions driven by **actions** (like a shopping cart, a form with validation, or a state machine).

\`useReducer\` is inspired by Redux — you dispatch actions, and a reducer function computes the next state based on the action type.

## When to use each?

| Use \`useState\` when | Use \`useReducer\` when |
|---|---|
| State is a single primitive value | State is an object with multiple fields |
| Updates are simple assignments | Next state depends on action type |
| No complex logic between states | You need predictable state transitions |

## How to use useState

\`\`\`jsx
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
\`\`\`

## How to use useReducer

\`\`\`jsx
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
\`\`\`

## Benefits of useReducer

- **Centralised logic** — all state transitions live in one reducer function.
- **Predictable** — given the same state and action, you always get the same next state.
- **Testable** — you can test the reducer in isolation without rendering components.

> ⚠️ **Junior Warning:** Do not mutate state inside a reducer — always return a **new object**. \`state.items.push(x)\` will not trigger a re-render. Use \`[...state.items, x]\` instead.
`);

write(path.join(base, 'layout-timing-hooks.md'), `---
title: "Layout & Timing"
category: "react"
chapterId: "all-hooks-apis"
slug: "layout-timing-hooks"
description: "useLayoutEffect (synchronous) and useInsertionEffect (style injection)."
---

# Layout & Timing Hooks

React provides two specialised effect hooks for precise timing control: \`useLayoutEffect\` and \`useInsertionEffect\`.

## useLayoutEffect — synchronous DOM reads/writes

## What is it?

\`useLayoutEffect\` runs **synchronously after React updates the DOM but before the browser paints**. This is your hook for reading layout (element sizes, scroll positions) or making immediate DOM mutations that must happen before the user sees anything.

## When to use it?

- Measuring an element's size or position (tooltips, modals, dynamic layouts).
- Triggering animations that need exact starting positions.
- Preventing visual "flash" from a two-step render (measure → adjust).

Use \`useEffect\` for 99% of cases. Only reach for \`useLayoutEffect\` when you **observe a flicker** that you need to fix.

\`\`\`jsx
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
\`\`\`

## useInsertionEffect — inject styles before layout

## What is it?

\`useInsertionEffect\` runs **before all DOM mutations**, even before \`useLayoutEffect\`. It was added in React 18 specifically for CSS-in-JS libraries (like Styled Components, Emotion) to inject \`<style>\` tags before layout calculations happen.

## When to use it?

**Almost never — unless you are building a CSS-in-JS library.** Application code should not use this hook.

\`\`\`jsx
import { useInsertionEffect } from 'react';

function useCSS(rule) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = rule;
    document.head.appendChild(style);
    return () => style.remove();
  }, [rule]);
}
\`\`\`

## Execution order

\`\`\`
1. useInsertionEffect → inject styles
2. React updates DOM
3. useLayoutEffect → measure/adjust layout
4. Browser paints
5. useEffect → regular side effects
\`\`\`

> ⚠️ **Junior Warning:** \`useLayoutEffect\` blocks the browser from painting — use it sparingly. Slow code inside \`useLayoutEffect\` makes your app feel laggy because the screen freezes until it completes.
`);

write(path.join(base, 'concurrent-hooks.md'), `---
title: "Concurrent Rendering"
category: "react"
chapterId: "all-hooks-apis"
slug: "concurrent-hooks"
description: "useTransition for non-blocking transitions, useDeferredValue for slow UI."
playgroundTemplate: "react-concurrent"
---

# Concurrent Rendering Hooks

React 18 introduced **concurrent rendering** — the ability to pause and resume rendering work to keep the UI responsive. Two hooks expose this power to application code: \`useTransition\` and \`useDeferredValue\`.

## useTransition — mark a state update as non-urgent

## What is it?

\`useTransition\` tells React: "This state update is not urgent — if the user types or clicks, pause this work and handle that first." It splits your update into two phases:
- **Urgent** — the user's immediate action (typing in an input).
- **Non-urgent** — the slow computation triggered by that action (filtering a huge list).

## When to use it?

When a state update causes a slow re-render that freezes the UI. Common examples:
- Filtering or searching a large dataset.
- Switching tabs with heavy content.
- Real-time previews of user input.

\`\`\`jsx
import { useState, useTransition } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // Urgent — update input instantly

    startTransition(() => {
      // Non-urgent — can be interrupted
      setResults(expensiveFilter(e.target.value));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <p>Updating...</p> : <ResultList items={results} />}
    </>
  );
}
\`\`\`

The input stays responsive — typing never freezes — while the results update in the background.

## useDeferredValue — defer an expensive derived value

## What is it?

\`useDeferredValue\` takes a value and returns a **lagging copy** of it. React keeps the old value on screen while the new one renders in the background. When the new render finishes, React swaps it in.

This is useful when you **receive** a prop or state value but rendering it is slow.

\`\`\`jsx
import { useState, useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery lags behind query — old results stay visible
  // until the new expensive render completes
  return <HeavyList filter={deferredQuery} />;
}

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <SearchResults query={query} />
    </>
  );
}
\`\`\`

## useTransition vs useDeferredValue

| | \`useTransition\` | \`useDeferredValue\` |
|---|---|---|
| **Use when** | You control the state update | You receive a value (prop/state) |
| **What it defers** | A \`setState\` call | A value you render with |
| **Shows pending state** | Yes (\`isPending\` flag) | No (shows stale data) |

> ⚠️ **Junior Warning:** These hooks do NOT make your code faster — they make the UI **feel** faster by keeping it responsive. The work still happens; it just does not block urgent interactions.
`);

write(path.join(base, 'form-actions-hooks.md'), `---
title: "Modern Form Actions (React 19+)"
category: "react"
chapterId: "all-hooks-apis"
slug: "form-actions-hooks"
description: "useActionState, useFormStatus, and useOptimistic for immediate UI updates."
---

# Modern Form Actions (React 19+)

React 19 introduces three hooks designed specifically for modern form handling with server actions, optimistic updates, and built-in pending states.

## useActionState — managing form actions

## What is it?

\`useActionState\` replaces the old \`useFormState\` hook. It manages the lifecycle of an async action (like submitting a form) and tracks its result and pending state.

\`\`\`jsx
import { useActionState } from 'react';

async function createUserAction(prevState, formData) {
  const name = formData.get('name');
  // Simulate server call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: \`User \${name} created!\` };
}

export default function UserForm() {
  const [state, action, isPending] = useActionState(createUserAction, null);

  return (
    <form action={action}>
      <input name="name" required />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
\`\`\`

The form automatically calls \`action\` on submit — no \`onSubmit\` handler needed.

## useFormStatus — reading parent form status

## What is it?

\`useFormStatus\` reads the pending/submitting state of the **closest parent \`<form>\`**. This is useful for submit buttons or loading indicators inside a form — they can reactively show their state without prop drilling.

\`\`\`jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// Usage inside a form
<form action={myAction}>
  <input name="email" />
  <SubmitButton /> {/* automatically shows pending state */}
</form>
\`\`\`

## useOptimistic — instant UI updates

## What is it?

\`useOptimistic\` lets you update the UI **immediately** with an optimistic value while an async action runs in the background. If the action succeeds, the optimistic value becomes real. If it fails, React reverts to the original value.

Classic use case: instant "like" button feedback.

\`\`\`jsx
import { useOptimistic } from 'react';

export default function LikeButton({ postId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (current) => current + 1
  );

  async function handleLike() {
    addOptimisticLike(); // Show +1 instantly
    await fetch(\`/api/like/\${postId}\`, { method: 'POST' });
    // If successful, optimistic value becomes real
    // If failed, React reverts to initialLikes
  }

  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  );
}
\`\`\`

The button shows the new count immediately — no waiting for the server.

## Why these matter

These hooks shift React toward a **server-first** mental model:
- Forms submit directly to server actions (no client-side state).
- Pending states are built-in (no manual \`isLoading\` flags).
- Optimistic updates prevent waiting spinners.

> ⚠️ **Junior Warning:** \`useFormStatus\` only works inside a component that is a **child** of a \`<form>\`. Calling it outside a form returns \`{ pending: false }\` always.
`);

write(path.join(base, 'system-hooks.md'), `---
title: "System & Resource Reading"
category: "react"
chapterId: "all-hooks-apis"
slug: "system-hooks"
description: "useId, useSyncExternalStore, useDebugValue, and use for promises/context."
---

# System & Resource Reading Hooks

React provides several utility hooks for generating IDs, syncing with external data sources, debugging custom hooks, and consuming promises or context inline.

## useId — generating accessible IDs

## What is it?

\`useId\` generates a **unique ID** that is stable across server and client renders. Use it to link form labels with their inputs for accessibility.

\`\`\`jsx
import { useId } from 'react';

export default function EmailField() {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
\`\`\`

The ID is unique even if you render \`<EmailField />\` multiple times on the same page.

## useSyncExternalStore — subscribing to non-React stores

## What is it?

\`useSyncExternalStore\` lets you subscribe to an **external data source** (like a Redux store, a browser API, or a WebSocket) and automatically re-render when it changes.

\`\`\`jsx
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

export default function OnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <p>{isOnline ? '🟢 Online' : '🔴 Offline'}</p>;
}
\`\`\`

## useDebugValue — labeling custom hooks in DevTools

## What is it?

\`useDebugValue\` adds a **custom label** to your hook in React DevTools. It is purely for debugging — it has no effect on behavior.

\`\`\`jsx
import { useState, useDebugValue } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useDebugValue(isOnline ? 'Online' : 'Offline'); // Shows in DevTools
  return isOnline;
}
\`\`\`

## use — consuming promises or context inline (React 19)

## What is it?

\`use\` is a new primitive in React 19 that lets you **unwrap a promise or read context** directly inside your render function — even inside conditions or loops.

Unlike hooks, \`use\` does not follow the Rules of Hooks.

### Reading context

\`\`\`jsx
import { use } from 'react';
import { ThemeContext } from './ThemeContext';

function Button() {
  const theme = use(ThemeContext); // No useContext needed
  return <button style={{ background: theme.primary }}>Click</button>;
}
\`\`\`

### Reading a promise (Suspense required)

\`\`\`jsx
import { use, Suspense } from 'react';

function UserCard({ userPromise }) {
  const user = use(userPromise); // Suspends until resolved
  return <h1>{user.name}</h1>;
}

// Wrap with Suspense
<Suspense fallback={<p>Loading...</p>}>
  <UserCard userPromise={fetchUser(1)} />
</Suspense>
\`\`\`

The component pauses rendering until the promise resolves.

> ⚠️ **Junior Warning:** \`useSyncExternalStore\` is a low-level hook — most apps never need it directly. Libraries like Redux or Zustand use it internally. For custom data sources, consider a simpler \`useEffect\` + \`useState\` approach first.
`);

// ─── 4. Advanced Component Concepts (NEW) ─────────────────────────────────────

write(path.join(base, 'suspense-api.md'), `---
title: "Suspense API"
category: "react"
chapterId: "advanced-concepts"
slug: "suspense-api"
description: "Suspense wrapper for fallback loaders during data fetching or code splitting."
---

# Suspense API

## What is it?

\`<Suspense>\` is a React component that shows a **fallback** (loading spinner, skeleton screen) while its children are waiting for something:
- **Code splitting** — a lazy-loaded component is downloading.
- **Data fetching** — a component is waiting for data from a server (using \`use(promise)\` in React 19 or libraries like Relay).
- **Server-side rendering** — a Server Component is streaming in.

## When to use it?

Any time you have async UI boundaries — parts of the page that load at different speeds.

## How to use it

### With code splitting (React.lazy)

\`\`\`jsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

export default function Dashboard() {
  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <HeavyChart data={stats} />
    </Suspense>
  );
}
\`\`\`

The fallback shows while \`HeavyChart.js\` is downloading. Once loaded, it swaps in.

### With data fetching (React 19 \`use\` hook)

\`\`\`jsx
import { use, Suspense } from 'react';

function User({ userPromise }) {
  const user = use(userPromise); // Suspends until promise resolves
  return <h1>{user.name}</h1>;
}

export default function App() {
  const userPromise = fetch('/api/user/1').then(r => r.json());

  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <User userPromise={userPromise} />
    </Suspense>
  );
}
\`\`\`

### Nested Suspense boundaries

You can nest multiple \`<Suspense>\` components to show different loading states for different parts of the UI.

\`\`\`jsx
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<SpinnerSmall />}>
    <Posts />
  </Suspense>
  <Suspense fallback={<SpinnerSmall />}>
    <Comments />
  </Suspense>
</Suspense>
\`\`\`

Each section loads independently — \`<Header />\` can appear before \`<Posts>\` finishes.

## Error boundaries + Suspense

Combine Suspense with an Error Boundary to handle both loading and error states:

\`\`\`jsx
<ErrorBoundary fallback={<p>Failed to load</p>}>
  <Suspense fallback={<p>Loading...</p>}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
\`\`\`

> ⚠️ **Junior Warning:** \`<Suspense>\` does NOT work with \`useEffect\` data fetching — the promise must be "thrown" (like \`use(promise)\`) or come from a Suspense-aware library like Relay. TanStack Query and SWR do not suspend by default.
`);

write(path.join(base, 'native-asset-injection.md'), `---
title: "Native Asset Injection"
category: "react"
chapterId: "advanced-concepts"
slug: "native-asset-injection"
description: "First-class support for loading stylesheets, scripts, and metadata."
---

# Native Asset Injection (React 19)

## What is it?

React 19 adds built-in components for injecting **document metadata, stylesheets, and scripts** directly from your React components — no more manually editing \`index.html\` or using third-party libraries like \`react-helmet\`.

React handles:
- Deduplication (same stylesheet loaded multiple times → only one \`<link>\` in the DOM).
- Insertion order (stylesheets load before the component renders).
- Cleanup (when a component unmounts, its assets are removed if no other component needs them).

## When to use it?

- Setting page titles, meta descriptions, Open Graph tags.
- Loading component-specific CSS files.
- Injecting third-party scripts (analytics, widgets).

## How to use it

### Document metadata

\`\`\`jsx
export default function BlogPost({ post }) {
  return (
    <>
      <title>{post.title} — My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:image" content={post.coverImage} />

      <article>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </article>
    </>
  );
}
\`\`\`

React automatically hoists \`<title>\` and \`<meta>\` tags into the \`<head>\` — you do not manually place them there.

### Loading stylesheets

\`\`\`jsx
export default function Tooltip() {
  return (
    <>
      <link rel="stylesheet" href="/tooltip.css" precedence="default" />
      <div className="tooltip">Hover over me</div>
    </>
  );
}
\`\`\`

React ensures \`tooltip.css\` loads **before** the component renders, preventing FOUC (flash of unstyled content). The \`precedence\` prop controls the order when multiple stylesheets compete.

### Injecting scripts

\`\`\`jsx
export default function AnalyticsWrapper({ children }) {
  return (
    <>
      <script async src="https://analytics.example.com/tracker.js" />
      {children}
    </>
  );
}
\`\`\`

React deduplicates the script — if 10 components load the same \`src\`, only one \`<script>\` tag appears in the DOM.

## Precedence for stylesheets

The \`precedence\` prop determines load order when multiple stylesheets exist:

\`\`\`jsx
<link rel="stylesheet" href="/reset.css" precedence="reset" />
<link rel="stylesheet" href="/app.css" precedence="default" />
<link rel="stylesheet" href="/theme.css" precedence="high" />
\`\`\`

React loads them in this order: \`reset → default → high\`.

> ⚠️ **Junior Warning:** These features only work in React 19+ and require a compatible framework (Next.js 15+, Remix with React 19). They do not work in Create React App or plain Vite setups.
`);

// ─── 5. Core Engine Mechanics (NEW CHAPTER) ──────────────────────────────────

write(path.join(base, 'virtual-dom-reconciliation.md'), `---
title: "Virtual DOM & Reconciliation"
category: "react"
chapterId: "core-engine-mechanics"
slug: "virtual-dom-reconciliation"
description: "Virtual tree representation and efficient diffing algorithm."
---

# Virtual DOM & Reconciliation

## What is it?

The **Virtual DOM** is a lightweight JavaScript representation of the real DOM. When your component's state changes, React:
1. Creates a new Virtual DOM tree.
2. Compares it to the previous tree (**reconciliation**).
3. Calculates the minimal set of changes needed.
4. Updates only those specific parts in the real DOM.

This makes updates fast because DOM manipulation is slow, but JavaScript object comparison is fast.

## How reconciliation works

React's diffing algorithm follows three rules:

### 1. Different element types → full rebuild

If the root element type changes, React tears down the old tree and builds a new one from scratch.

\`\`\`jsx
// Before
<div><Counter /></div>

// After — React destroys <div> and <Counter>, builds <section> from scratch
<section><Counter /></section>
\`\`\`

### 2. Same element type → update attributes

If the type stays the same, React keeps the DOM node and only updates changed attributes.

\`\`\`jsx
// Before
<div className="red" />

// After — React keeps the <div>, only changes className
<div className="blue" />
\`\`\`

### 3. Keys identify list items

When rendering lists, React uses \`key\` props to match old and new elements. Without keys, React matches items by position — leading to bugs when items reorder.

\`\`\`jsx
// BAD — no keys, React matches by index
{items.map(item => <li>{item.name}</li>)}

// GOOD — keys let React track identity across renders
{items.map(item => <li key={item.id}>{item.name}</li>)}
\`\`\`

## Why the Virtual DOM?

Direct DOM manipulation is slow because:
- The browser must recalculate layout and repaint the screen.
- Each change triggers a synchronous reflow.

React batches updates and applies them in one efficient pass.

## Mental model

Think of the Virtual DOM as a **blueprint**. React compares the old blueprint with the new one, finds the differences, and sends a minimal change order to the real DOM construction crew.

> ⚠️ **Junior Warning:** The Virtual DOM is NOT faster than direct DOM updates in all cases — it is faster than **naive** re-rendering of the entire tree. Frameworks like Svelte compile away the Virtual DOM entirely and can be faster for simple apps.
`);

write(path.join(base, 'fiber-architecture.md'), `---
title: "Fiber Architecture"
category: "react"
chapterId: "core-engine-mechanics"
slug: "fiber-architecture"
description: "React's core engine redesign enabling incremental, interruptible rendering."
---

# Fiber Architecture

## What is it?

**Fiber** is React's internal reimplementation of its core rendering algorithm, introduced in React 16. The old "stack" reconciler was synchronous and blocking — once React started rendering, it could not stop until the entire tree finished. Fiber makes rendering **interruptible**, allowing React to pause, prioritise, and resume work.

Fiber is the foundation that enables:
- Concurrent rendering.
- Time slicing (pausing rendering to handle urgent events).
- Suspense and lazy loading.
- Error boundaries.

## How it works

Fiber treats rendering as **units of work**. Each component is a "fiber" node in a linked tree. React processes fibers incrementally:

1. **Begin work** — render a component, create its Virtual DOM.
2. **Pause if needed** — if a high-priority event (user click, typing) arrives, pause the current render.
3. **Resume later** — pick up where it left off.
4. **Commit** — once the entire tree is ready, apply changes to the real DOM in one synchronous pass.

## Why this matters

Before Fiber, a slow component could freeze the entire UI. Now React can pause rendering that component and handle the user's click first, making the app feel responsive even during heavy computation.

## Phases of rendering with Fiber

### Render phase (interruptible)

React walks the component tree, calls your components, and builds the Virtual DOM. This phase is **pure** — no side effects, no DOM mutations. React can pause and restart it.

### Commit phase (synchronous)

React applies all DOM changes, calls \`useLayoutEffect\`, and updates refs. This phase is **not interruptible** — once it starts, React finishes it.

## Fiber nodes

Every component has a corresponding **fiber** object with metadata:

\`\`\`js
{
  type: 'div',              // Component type
  props: { className: 'box' },
  child: fiberNode,         // First child
  sibling: fiberNode,       // Next sibling
  return: fiberNode,        // Parent
  alternate: fiberNode,     // Previous version (for diffing)
  effectTag: 'UPDATE',      // What changed
}
\`\`\`

React walks this tree using a **depth-first traversal** with pointers to child, sibling, and parent.

## Priority levels

Fiber assigns priorities to updates:
- **Immediate** — typing, clicking, focus changes.
- **User-blocking** — hover, scroll.
- **Normal** — data fetching.
- **Low** — analytics, logging.

React works on high-priority updates first and defers low-priority work.

> ⚠️ **Junior Warning:** You do not interact with Fiber directly — it is an internal implementation detail. But understanding it helps you reason about why React 18+ behaves differently (concurrent features, automatic batching, Suspense).
`);

write(path.join(base, 'concurrent-rendering-engine.md'), `---
title: "Concurrent Rendering Engine"
category: "react"
chapterId: "core-engine-mechanics"
slug: "concurrent-rendering-engine"
description: "Interruptible rendering that pauses to prioritize urgent user actions."
---

# Concurrent Rendering Engine

## What is it?

**Concurrent rendering** is React's ability to work on multiple versions of the UI simultaneously and pause rendering to handle higher-priority updates. Introduced in React 18, it makes apps feel faster by keeping the UI responsive during expensive operations.

Key idea: React can **start rendering a slow update, pause it when the user clicks something, handle that click, then resume the slow update**.

## How it differs from legacy rendering

| Legacy (React 17) | Concurrent (React 18+) |
|---|---|
| Rendering is **blocking** | Rendering is **interruptible** |
| One update at a time | Multiple updates in progress |
| Slow renders freeze the UI | Urgent work interrupts slow work |
| No time slicing | Renders in small chunks (time slices) |

## How to enable it

Concurrent rendering activates when you use:
- **\`createRoot\`** instead of \`ReactDOM.render\`.
- Concurrent features like \`useTransition\`, \`useDeferredValue\`, or \`<Suspense>\`.

\`\`\`jsx
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />); // Concurrent mode enabled
\`\`\`

## Time slicing

React splits rendering into **small chunks** (5ms each by default). Between chunks, React checks if something more urgent arrived:
- If yes → pause current work, handle urgent update, resume later.
- If no → continue rendering.

This prevents long-running renders from freezing the UI.

## Example: concurrent rendering in action

\`\`\`jsx
function App() {
  const [urgent, setUrgent] = useState('');
  const [slow, setSlow] = useState('');

  return (
    <>
      <input
        value={urgent}
        onChange={e => {
          setUrgent(e.target.value); // High priority — instant
          startTransition(() => {
            setSlow(e.target.value); // Low priority — interruptible
          });
        }}
      />
      <ExpensiveList filter={slow} />
    </>
  );
}
\`\`\`

The input stays responsive. If you type quickly, React **abandons** the incomplete \`<ExpensiveList>\` render from the previous keystroke and starts a fresh one for the latest value.

## Automatic batching

In React 18, all updates are batched automatically — even inside \`setTimeout\`, Promises, or native event handlers. This reduces re-renders.

\`\`\`jsx
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(true);
  // React 18 → one re-render
  // React 17 → two re-renders
}, 1000);
\`\`\`

## Tearing (and how React prevents it)

**Tearing** is when different parts of the UI show different versions of the same data. Concurrent rendering could cause this (top of screen shows old data, bottom shows new data) but React prevents it by ensuring a single consistent render for each commit.

> ⚠️ **Junior Warning:** Concurrent rendering does NOT make your code faster — it makes the **UI feel** faster by prioritising what the user sees and interacts with. The same amount of JavaScript runs; it is just scheduled smarter.
`);

write(path.join(base, 'synthetic-events.md'), `---
title: "Synthetic Events System"
category: "react"
chapterId: "core-engine-mechanics"
slug: "synthetic-events"
description: "Cross-browser normalization and event delegation for optimized memory usage."
---

# Synthetic Events System

## What is it?

React wraps browser events in a **SyntheticEvent** object — a cross-browser normalisation layer that ensures events behave identically in all browsers. React also uses **event delegation**: it attaches one event listener at the root of your app instead of one listener per element.

## Why React uses synthetic events

### 1. Cross-browser consistency

Browsers have subtle differences in event APIs. React abstracts them away:

\`\`\`jsx
function handleClick(e) {
  e.preventDefault(); // Same API in all browsers
  e.stopPropagation();
  console.log(e.target.value); // Always works
}
\`\`\`

### 2. Event pooling (legacy, removed in React 17)

In React 16 and earlier, SyntheticEvent objects were **reused** for performance. The event was nullified after the handler finished. React 17+ removed this — events are now regular JavaScript objects.

### 3. Event delegation (memory efficiency)

Instead of attaching individual listeners to every button, input, and div, React attaches **one listener per event type** to the root container. Events bubble up to the root, and React dispatches them to the correct handler.

\`\`\`html
<!-- 1000 buttons in your app -->
<button onClick={handler1}>Click 1</button>
<button onClick={handler2}>Click 2</button>
...
<button onClick={handler1000}>Click 1000</button>

<!-- React attaches ONE click listener to the root -->
<div id="root"></div>
\`\`\`

This saves memory and speeds up mounting/unmounting.

## Differences from native events

### SyntheticEvent properties

\`\`\`jsx
function handleClick(e) {
  e.type           // "click"
  e.target         // The element that triggered the event
  e.currentTarget  // The element the listener is attached to
  e.nativeEvent    // The underlying browser event
}
\`\`\`

### Accessing the native event

If you need browser-specific APIs, use \`e.nativeEvent\`:

\`\`\`jsx
function handleClick(e) {
  console.log(e.nativeEvent.offsetX); // Browser-specific property
}
\`\`\`

## Event delegation and stopPropagation

Because React uses delegation, \`e.stopPropagation()\` stops propagation **within the React tree**, but the native event still bubbles to the root in the real DOM.

If you add a native listener outside React, it will still fire:

\`\`\`jsx
useEffect(() => {
  document.body.addEventListener('click', () => {
    console.log('Body clicked!'); // Still fires even if React handler calls stopPropagation
  });
}, []);
\`\`\`

To prevent this, call \`e.nativeEvent.stopImmediatePropagation()\`.

## Passive event listeners

React automatically marks certain events as **passive** for better scroll performance:
- \`onTouchStart\`
- \`onTouchMove\`
- \`onWheel\`

This tells the browser: "I will not call \`preventDefault()\`, so feel free to scroll while my JavaScript runs."

> ⚠️ **Junior Warning:** If you call \`preventDefault()\` inside a \`setTimeout\`, it will not work — the SyntheticEvent has already been processed. Call it synchronously inside the handler, or use \`e.persist()\` in React 16 (not needed in React 17+).
`);

write(path.join(base, 'server-hydration.md'), `---
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

In React 18+, use \`hydrateRoot\` instead of \`createRoot\`:

\`\`\`jsx
// client.jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(document.getElementById('root'), <App />);
\`\`\`

React expects the HTML in the DOM to **exactly match** what the server rendered. If it does not, React logs a warning (hydration mismatch) and re-renders the mismatched parts.

## Common hydration mismatches

### 1. Different content on server vs. client

\`\`\`jsx
function Time() {
  return <p>{new Date().toTimeString()}</p>; // Different every render!
}
\`\`\`

Server renders one timestamp, client expects the same, but generates a new one → mismatch.

**Fix:** Use \`useEffect\` to update time-dependent values after hydration:

\`\`\`jsx
function Time() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date().toTimeString());
  }, []);

  return <p>{time || 'Loading...'}</p>;
}
\`\`\`

### 2. Conditional rendering based on client-only APIs

\`\`\`jsx
function App() {
  if (typeof window !== 'undefined') {
    return <ClientOnlyComponent />; // Mismatch!
  }
  return <ServerComponent />;
}
\`\`\`

Server renders \`<ServerComponent>\`, client renders \`<ClientOnlyComponent>\` → mismatch.

**Fix:** Use \`useEffect\` to detect client-side after hydration.

## Selective hydration (React 18)

React 18 introduced **selective hydration** with \`<Suspense>\`. Parts of the page wrapped in Suspense can hydrate **independently and out of order**.

\`\`\`jsx
<Suspense fallback={<Spinner />}>
  <Comments /> {/* Can hydrate before or after Posts */}
</Suspense>
<Suspense fallback={<Spinner />}>
  <Posts />
</Suspense>
\`\`\`

If \`<Comments>\` JavaScript loads first, React hydrates it immediately — even if \`<Posts>\` is still downloading.

## Hydration errors and debugging

React logs hydration warnings in the console:

\`\`\`
Warning: Text content did not match. Server: "Hello" Client: "Hi"
\`\`\`

To find the source:
1. Check for client-only values (window, localStorage, Date).
2. Ensure server and client render the same initial state.
3. Use \`suppressHydrationWarning\` on the element if the mismatch is intentional (rare).

> ⚠️ **Junior Warning:** Hydration mismatches cause React to **discard the server HTML and re-render from scratch** — throwing away the performance benefit of SSR. Fix mismatches instead of ignoring them.
`);

write(path.join(base, 'react-compiler.md'), `---
title: "The React Compiler"
category: "react"
chapterId: "core-engine-mechanics"
slug: "react-compiler"
description: "Automating optimizations by analyzing code and injecting memoization."
---

# The React Compiler

## What is it?

The **React Compiler** (formerly "React Forget") is an experimental compiler that automatically optimizes your React code. It analyses your components and injects \`useMemo\`, \`useCallback\`, and \`React.memo\` where needed — so you do not have to manually wrap everything to prevent re-renders.

As of React 19, it is still experimental but available for testing.

## How it works

The compiler:
1. Analyses your component's code at build time.
2. Tracks which values and functions are stable vs. changing.
3. Automatically wraps expensive computations in \`useMemo\`.
4. Automatically wraps callbacks in \`useCallback\`.
5. Memoizes entire components when their props do not change.

## Before vs. After

### Before (manual memoization)

\`\`\`jsx
import { useMemo, useCallback, memo } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items, onSelect }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.price - b.price);
  }, [items]);

  const handleClick = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});
\`\`\`

### After (React Compiler does this automatically)

\`\`\`jsx
function ExpensiveList({ items, onSelect }) {
  const sortedItems = [...items].sort((a, b) => a.price - b.price);

  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item.id} onClick={() => onSelect(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

The compiler injects the memoization behind the scenes.

## Benefits

- **Less boilerplate** — no manual \`useMemo\` everywhere.
- **No over-optimisation** — the compiler only memoizes when it detects a performance benefit.
- **Easier code reviews** — less clutter, clearer intent.

## How to enable it (experimental)

Install the compiler plugin:

\`\`\`bash
npm install babel-plugin-react-compiler
\`\`\`

Add it to your Babel config:

\`\`\`js
// babel.config.js
module.exports = {
  plugins: ['babel-plugin-react-compiler'],
};
\`\`\`

Or use the Vite/Next.js plugins if available.

## Limitations

- **Experimental** — not production-ready yet (as of 2024).
- **Requires pure components** — side effects during render break the compiler's assumptions.
- **Does not fix all performance problems** — still need profiling and manual optimisations for complex cases.

## Why this matters

The React Compiler represents a shift toward **zero-cost abstractions** — write simple, clean code and let the compiler handle performance. Similar to how Svelte compiles away the framework, React is moving toward compiling away manual optimisations.

> ⚠️ **Junior Warning:** The compiler is still experimental. Do not rely on it for production apps yet. Manual memoization still works and will continue to work — the compiler is additive, not a replacement.
`);

console.log('\nAll new files written successfully!');
