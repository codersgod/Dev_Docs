// Script to write remaining React roadmap markdown files (chapters 6-9)
const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('wrote:', filePath);
}

const base = path.join(__dirname, '..', 'content', 'react');

// ─── 6. Component Design Patterns (NEW CHAPTER) ──────────────────────────────

write(path.join(base, 'compound-components.md'), `---
title: "Compound Components"
category: "react"
chapterId: "component-design-patterns"
slug: "compound-components"
description: "Component families sharing implicit state for flexible interfaces."
---

# Compound Components

## What is it?

Compound components are a pattern where **multiple components work together** by sharing implicit state. The parent component manages state, and child components access it automatically without explicit prop passing.

Think of HTML's \`<select>\` and \`<option>\` — they work together, and \`<option>\` knows about the parent \`<select>\`'s state. Compound components recreate this pattern in React.

## When to use it?

For flexible, composable UI components:
- Tabs and tab panels.
- Accordions.
- Dropdown menus.
- Wizards and multi-step forms.

## How to use it

### Using Context for implicit state sharing

\`\`\`jsx
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

export function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={isActive ? 'tab active' : 'tab'}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className="tab-panel">{children}</div>;
}
\`\`\`

### Usage — flexible and declarative

\`\`\`jsx
<Tabs defaultValue="profile">
  <TabList>
    <Tab value="profile">Profile</Tab>
    <Tab value="settings">Settings</Tab>
    <Tab value="billing">Billing</Tab>
  </TabList>

  <TabPanel value="profile">
    <h2>Your Profile</h2>
  </TabPanel>
  <TabPanel value="settings">
    <h2>Settings</h2>
  </TabPanel>
  <TabPanel value="billing">
    <h2>Billing Info</h2>
  </TabPanel>
</Tabs>
\`\`\`

The user can compose the UI however they want — reorder tabs, add wrappers, insert extra elements.

## Benefits

- **Flexible composition** — users control the structure.
- **Clean API** — no massive props object with \`activeTab\`, \`onTabChange\`, \`panels\`.
- **Implicit communication** — child components automatically access parent state.

> ⚠️ **Junior Warning:** Compound components tightly couple child components to their parent via context. They are not reusable outside that family — \`<Tab>\` only works inside \`<Tabs>\`. If you need standalone reusability, use plain props instead.
`);

write(path.join(base, 'control-props-pattern.md'), `---
title: "Control Props Pattern"
category: "react"
chapterId: "component-design-patterns"
slug: "control-props-pattern"
description: "Switching between uncontrolled and parent-driven controlled configurations."
---

# Control Props Pattern

## What is it?

The **Control Props Pattern** lets a component work in two modes:
1. **Uncontrolled** — the component manages its own state.
2. **Controlled** — the parent manages the state and the component is a "dumb" UI renderer.

The component checks: "Did the parent pass me a value? If yes, I am controlled. If no, I manage my own state."

## When to use it?

For reusable components where some users want full control (controlled) and others want plug-and-play simplicity (uncontrolled):
- Toggle switches.
- Modals (open/close state).
- Dropdowns.
- Custom inputs.

## How to use it

\`\`\`jsx
import { useState } from 'react';

export default function Toggle({ value, onChange, defaultValue = false }) {
  // Check if component is controlled
  const isControlled = value !== undefined;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Use controlled value if provided, otherwise use internal
  const currentValue = isControlled ? value : internalValue;

  function handleToggle() {
    const newValue = !currentValue;

    if (!isControlled) {
      setInternalValue(newValue); // Update internal state
    }

    onChange?.(newValue); // Notify parent if they provided onChange
  }

  return (
    <button onClick={handleToggle}>
      {currentValue ? 'ON' : 'OFF'}
    </button>
  );
}
\`\`\`

### Uncontrolled usage (component manages state)

\`\`\`jsx
<Toggle defaultValue={false} onChange={val => console.log(val)} />
\`\`\`

The component starts at \`false\` and updates its own state when clicked.

### Controlled usage (parent manages state)

\`\`\`jsx
function App() {
  const [isOn, setIsOn] = useState(false);

  return <Toggle value={isOn} onChange={setIsOn} />;
}
\`\`\`

The parent fully controls the toggle state — the component has no internal state.

## Key rules for controlled components

1. If \`value\` is provided, \`onChange\` **must** also be provided (otherwise the component is read-only).
2. Do not switch from uncontrolled to controlled or vice versa after mounting — React will warn you.
3. Use \`defaultValue\` for the initial uncontrolled value, not \`value\`.

## Benefits

- **Flexibility** — works for both use cases without duplicating code.
- **Progressive enhancement** — start uncontrolled, add control later when needed.

> ⚠️ **Junior Warning:** Mixing \`value\` and \`defaultValue\` in the same component at the same time is a bug — React ignores \`defaultValue\` when \`value\` is present. Pick one mode and stick with it.
`);

write(path.join(base, 'render-props.md'), `---
title: "Render Props"
category: "react"
chapterId: "component-design-patterns"
slug: "render-props"
description: "Passing rendering control to a child function prop (legacy pattern)."
---

# Render Props

## What is it?

The **Render Props Pattern** is a technique where a component accepts a **function as a prop** and calls that function with data, letting the caller decide what to render. It was a popular way to share stateful logic before React Hooks.

## When to use it?

Mostly legacy codebases. Modern React favours **custom hooks** for logic sharing. However, you will still encounter render props in:
- Old libraries (React Router v4, Downshift, Formik).
- When you need to share both logic **and** JSX structure.

## How to use it

\`\`\`jsx
import { useState } from 'react';

// Component with render prop
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    setPosition({ x: e.clientX, y: e.clientY });
  }

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh' }}>
      {render(position)} {/* Call the function with data */}
    </div>
  );
}

// Usage — caller controls rendering
export default function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <p>Mouse is at ({x}, {y})</p>
      )}
    />
  );
}
\`\`\`

The caller decides **what** to render, \`MouseTracker\` provides the **data**.

## Alternative: children as a function

Instead of a \`render\` prop, you can use \`children\` as a function:

\`\`\`jsx
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}>
      {children(position)}
    </div>
  );
}

// Usage
<MouseTracker>
  {({ x, y }) => <p>Mouse at ({x}, {y})</p>}
</MouseTracker>
\`\`\`

## Render Props vs. Custom Hooks

| | Render Props | Custom Hooks |
|---|---|---|
| Reuses | Logic + JSX structure | Logic only |
| Syntax | Nested function calls | Clean, top-level |
| Performance | Can cause extra re-renders | Better (no extra wrappers) |
| Modern? | Legacy | ✅ Preferred |

### Same example with a custom hook

\`\`\`jsx
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = e => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return position;
}

// Usage — cleaner
function App() {
  const { x, y } = useMousePosition();
  return <p>Mouse at ({x}, {y})</p>;
}
\`\`\`

> ⚠️ **Junior Warning:** Render props create extra components in the React tree (visible in DevTools) and can hurt performance if not memoized properly. For new code, prefer custom hooks.
`);

write(path.join(base, 'container-presentational.md'), `---
title: "Container & Presentational Components"
category: "react"
chapterId: "component-design-patterns"
slug: "container-presentational"
description: "Segregating data/logic from purely visual, UI-only components."
---

# Container & Presentational Components

## What is it?

This pattern splits components into two types:

- **Container (Smart) Components** — handle data fetching, state management, and business logic. They are connected to global state or APIs.
- **Presentational (Dumb) Components** — receive data via props and render UI. They are pure, reusable, and easy to test.

Coined by Dan Abramov in 2015, this pattern was dominant in the Redux era but has become less strict with Hooks.

## When to use it?

For clean separation of concerns in medium-to-large apps:
- When multiple screens show the same UI with different data.
- To make UI components testable in isolation (Storybook, design systems).
- When working with designers who need standalone component previews.

## How to use it

### Presentational Component (UI only)

\`\`\`jsx
// UserCard.jsx — presentational
export default function UserCard({ name, email, avatar, onEdit }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}
\`\`\`

No hooks, no API calls, no business logic — just props in, JSX out.

### Container Component (data & logic)

\`\`\`jsx
// UserCardContainer.jsx — container
import { useState, useEffect } from 'react';
import UserCard from './UserCard';

export default function UserCardContainer({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);

  function handleEdit() {
    // Business logic — open modal, navigate, etc.
    console.log('Editing user', user.id);
  }

  if (!user) return <p>Loading...</p>;

  return (
    <UserCard
      name={user.name}
      email={user.email}
      avatar={user.avatar}
      onEdit={handleEdit}
    />
  );
}
\`\`\`

The container fetches data, the presentational component displays it.

## Benefits

- **Reusability** — \`UserCard\` can be used anywhere with different data sources.
- **Testability** — test \`UserCard\` by passing mock props; no API mocking needed.
- **Design system friendly** — designers can work with presentational components in Storybook without backend dependencies.

## Modern React and the decline of strict separation

With Hooks, the line blurs:
- Small components often mix logic and UI (fine for simple cases).
- Custom hooks extract logic without needing separate container files.
- Server Components (Next.js) fetch data directly inside "presentational-looking" components.

The pattern is still useful for large apps, but is no longer a strict rule.

## Container/Presentational vs. Custom Hooks

| | Container/Presentational | Custom Hooks |
|---|---|---|
| Separates | Components | Logic |
| File structure | Two files per feature | One component + hook file |
| Modern? | Still valid but less strict | ✅ Preferred for logic reuse |

> ⚠️ **Junior Warning:** Do not over-architect — not every component needs to be split. A button with \`onClick\` logic inside it is fine. Use this pattern when you genuinely need reusability or testability, not by default.
`);

// ─── 7. Performance Optimization (UPDATE) ─────────────────────────────────────

write(path.join(base, 're-render-prevention.md'), `---
title: "Re-render Prevention"
category: "react"
chapterId: "performance-optimization"
slug: "re-render-prevention"
description: "React.memo alongside useCallback and useMemo for shallow prop comparison."
playgroundTemplate: "react-rerender"
---

# Re-render Prevention

## What is it?

React re-renders a component when:
1. Its state changes.
2. Its parent re-renders (even if props did not change).
3. Context it subscribes to changes.

**Re-render prevention** is about skipping unnecessary renders when a component's output would be identical to the previous render.

## When to use it?

Only when you have a **measured performance problem** — profile with React DevTools Profiler first. Premature optimization adds complexity without benefit.

## The tools

### React.memo — skip re-renders when props are the same

\`\`\`jsx
import { memo } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }) {
  console.log('Rendering list');
  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
});
\`\`\`

React does a **shallow comparison** of props. If all props are the same as last render (using \`Object.is\`), React skips rendering.

### useCallback — stabilize function references

Functions are re-created on every render:

\`\`\`jsx
function Parent() {
  const handleClick = () => console.log('Clicked'); // New function every render

  return <MemoizedChild onClick={handleClick} />; // Still re-renders — different function!
}
\`\`\`

Fix it with \`useCallback\`:

\`\`\`jsx
import { useCallback } from 'react';

function Parent() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Same function across renders

  return <MemoizedChild onClick={handleClick} />; // Now skips re-render
}
\`\`\`

### useMemo — cache expensive calculations

\`\`\`jsx
import { useMemo } from 'react';

function ProductList({ products }) {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.price - b.price),
    [products] // Only re-sort when products changes
  );

  return <ul>{sortedProducts.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
\`\`\`

## The memoization trifecta

\`\`\`jsx
const Child = memo(function Child({ data, onClick }) {
  // ...
});

function Parent() {
  const [count, setCount] = useState(0);

  // Stabilize the data object
  const memoizedData = useMemo(() => ({ value: 42 }), []);

  // Stabilize the callback
  const memoizedClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child data={memoizedData} onClick={memoizedClick} />
    </>
  );
}
\`\`\`

Now \`Child\` only re-renders when \`memoizedData\` or \`memoizedClick\` actually changes.

## When NOT to use memoization

- Component renders fast (<16ms).
- Component always renders with different props anyway.
- Parent and child both need to re-render together.

Memoization has a cost — memory to store cached values and time to compare props. Only use it when profiling proves it helps.

> ⚠️ **Junior Warning:** Wrapping everything in \`memo\`, \`useMemo\`, and \`useCallback\` is a code smell. Start simple, profile, then optimize the bottlenecks. Most components do not need memoization.
`);

// ─── 8. Global Ecosystem & Scaling (NEW) ──────────────────────────────────────

write(path.join(base, 'production-architecture.md'), `---
title: "Production Architecture"
category: "react"
chapterId: "global-ecosystem-scaling"
slug: "production-architecture"
description: "Feature-Sliced Design (FSD), Monorepos (Turborepo/Nx), and Micro-Frontends."
---

# Production Architecture

## What is it?

As React apps grow from 10 components to 10,000, file organization and build strategies become critical. **Production architecture** refers to the methodologies and tooling for structuring massive codebases so teams can work independently without stepping on each other.

## Feature-Sliced Design (FSD)

## What is it?

FSD is a frontend architecture methodology that organises code by **features** instead of technical layers.

### Traditional structure (by type)

\`\`\`
src/
  components/
    Button.jsx
    UserCard.jsx
    ProductCard.jsx
  hooks/
    useUser.js
    useProducts.js
  pages/
    Home.jsx
    Dashboard.jsx
\`\`\`

### FSD structure (by feature)

\`\`\`
src/
  features/
    auth/
      ui/
        LoginButton.jsx
      model/
        useAuth.js
      api/
        authApi.js
    product/
      ui/
        ProductCard.jsx
      model/
        useProducts.js
      api/
        productApi.js
\`\`\`

Each feature is self-contained — easier to find code, delete features, and assign ownership to teams.

## Monorepos (Turborepo / Nx)

## What is it?

A **monorepo** stores multiple related projects in a single Git repository. For React apps, this often means:
- Shared UI component library.
- Multiple apps (marketing site, admin panel, mobile web).
- Shared utilities and types.

### Tools

- **Turborepo** — fast, simple, great for small-to-medium monorepos.
- **Nx** — powerful, opinionated, great for enterprise-scale monorepos with code generation.

### Example monorepo structure

\`\`\`
monorepo/
  apps/
    web/          # Next.js marketing site
    admin/        # React admin panel
    mobile/       # React Native app
  packages/
    ui/           # Shared component library
    utils/        # Shared utilities
    tsconfig/     # Shared TypeScript configs
\`\`\`

### Benefits

- **Code sharing** — one source of truth for components.
- **Atomic changes** — update a shared component and all apps get the fix in one commit.
- **Unified tooling** — ESLint, TypeScript, tests configured once.

## Micro-Frontends

## What is it?

**Micro-frontends** split a large React app into smaller, independently deployable apps. Each team owns a "slice" of the UI and deploys it separately.

### Example

\`\`\`
myapp.com/           → Shell app (loads micro-frontends)
myapp.com/products   → Product team's micro-frontend
myapp.com/checkout   → Checkout team's micro-frontend
\`\`\`

### Approaches

1. **Module Federation (Webpack 5+)** — apps share code at runtime.
2. **Iframe isolation** — each micro-frontend runs in an iframe (simple but clunky).
3. **Web Components** — wrap React apps in custom elements.

### Pros

- **Team autonomy** — each team deploys independently.
- **Tech flexibility** — one team can use React 18, another React 19 or even Vue.

### Cons

- **Complexity** — requires orchestration, shared state is hard.
- **Bundle duplication** — React loaded multiple times unless shared carefully.
- **UX inconsistency** — teams need design system discipline.

## Choosing an architecture

| Scale | Recommended approach |
|---|---|
| Small app (<50 components) | Simple folder structure, no special tooling |
| Medium app (50-500 components) | FSD or feature folders |
| Large app (500+ components, one team) | FSD + Monorepo |
| Massive app (multiple teams) | Monorepo + Micro-frontends |

> ⚠️ **Junior Warning:** Do not prematurely adopt complex architecture. Start simple, refactor as you grow. Micro-frontends are overkill for 99% of apps — consider them only when you have multiple independent teams deploying on different schedules.
`);

// ─── 9. Server Frameworks & Deployment (NEW) ──────────────────────────────────

write(path.join(base, 'hybrid-frameworks.md'), `---
title: "Hybrid Frameworks"
category: "react"
chapterId: "server-frameworks-deployment"
slug: "hybrid-frameworks"
description: "Next.js and Remix for full-stack React applications."
---

# Hybrid Frameworks

## What is it?

**Hybrid frameworks** are React meta-frameworks that handle both server and client rendering, file-based routing, data fetching, and deployment optimizations out of the box. They blur the line between frontend and backend — letting you write React components that run on the server, call databases directly, and stream HTML to the browser.

The two dominant players: **Next.js** and **Remix**.

## Next.js

## What is it?

Next.js by Vercel is the most popular React framework. It supports:
- **App Router** (React Server Components, streaming).
- **Pages Router** (classic SSR/SSG).
- File-based routing.
- Built-in API routes.
- Automatic code splitting and image optimization.

### When to use it?

For any production React app. Next.js handles 90% of configuration, performance, and deployment concerns.

### Example — Server Component

\`\`\`jsx
// app/users/page.tsx (Next.js App Router)
import db from '@/lib/db';

export default async function UsersPage() {
  const users = await db.query('SELECT * FROM users'); // Direct DB access

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
\`\`\`

This runs **only on the server** — no API route needed.

### Deployment

Deploy to Vercel (zero config) or self-host on any Node.js server.

## Remix

## What is it?

Remix by Shopify is a full-stack React framework focused on **web fundamentals** — progressive enhancement, native HTML forms, and edge computing. It feels more "web native" than Next.js.

### Key differences from Next.js

| | Next.js | Remix |
|---|---|---|
| Philosophy | Server Components, hybrid | Web standards, forms |
| Data fetching | \`async\` components, \`fetch\` | \`loader\` functions |
| Mutations | Server Actions | \`action\` functions |
| Routing | File-based, nested layouts | File-based, nested routes |
| Edge-first | Optional | Built-in |

### Example — Remix loader

\`\`\`jsx
// app/routes/users.tsx
import { useLoaderData } from '@remix-run/react';

// Runs on the server
export async function loader() {
  const users = await db.query('SELECT * FROM users');
  return users;
}

// Runs on the client
export default function UsersPage() {
  const users = useLoaderData();
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
\`\`\`

Remix automatically serializes data from \`loader\` and injects it into the component.

### Deployment

Deploy to Vercel, Netlify, Cloudflare Workers, or any Node.js host.

## Next.js vs. Remix

| Use Next.js if | Use Remix if |
|---|---|
| You want the largest ecosystem and community | You prefer web standards and progressive enhancement |
| You need image optimization and ISR | You are deploying to the edge (Cloudflare Workers) |
| You want React Server Components | You want explicit data loading with loaders/actions |
| You are building a marketing site, e-commerce, or SaaS | You are building a form-heavy app or dashboard |

## Why not plain Create React App / Vite?

Hybrid frameworks handle:
- SEO (server-rendered HTML).
- Performance (automatic code splitting, prefetching).
- Data fetching (colocated with routes).
- Deployment (optimized builds, CDN integration).

Plain CRA/Vite is fine for internal tools or prototypes, but production apps benefit massively from a framework.

> ⚠️ **Junior Warning:** Next.js 13+ App Router is a paradigm shift from the Pages Router. Do not mix both in one project — pick one and commit. The App Router is the future, but the Pages Router still works and is simpler for beginners.
`);

write(path.join(base, 'rendering-strategies.md'), `---
title: "Rendering Strategies"
category: "react"
chapterId: "server-frameworks-deployment"
slug: "rendering-strategies"
description: "SSR, SSG, CSR, and Incremental Static Regeneration (ISR)."
---

# Rendering Strategies

## What is it?

Modern React apps can render in multiple ways, each with different trade-offs for performance, SEO, and freshness. Understanding the four main strategies is critical for choosing the right architecture.

## 1. Client-Side Rendering (CSR)

## How it works

The server sends an empty HTML shell. JavaScript downloads, executes, fetches data, and renders the UI in the browser.

\`\`\`html
<!-- Server sends this -->
<div id="root"></div>
<script src="/bundle.js"></script>

<!-- Browser runs JS and fills the root -->
\`\`\`

### Pros

- Simple deployment (static files only).
- Rich interactivity.
- No server infrastructure needed.

### Cons

- Slow first paint (wait for JS + data).
- Poor SEO (bots see empty page).
- Poor UX on slow networks.

### When to use it

- Dashboards, admin panels, internal tools.
- Apps behind authentication.
- Apps with no SEO requirements.

## 2. Server-Side Rendering (SSR)

## How it works

React runs on the server for **every request**, generates full HTML, and sends it to the browser. The browser displays the page immediately, then JavaScript hydrates it.

\`\`\`jsx
// Next.js — renders on every request
export default async function Page() {
  const data = await fetch('/api/data').then(r => r.json());
  return <h1>{data.title}</h1>;
}
\`\`\`

### Pros

- Fast first paint (HTML arrives immediately).
- Excellent SEO (bots see full content).
- Always fresh data (rendered per request).

### Cons

- Slower than static (server must render on every hit).
- Requires a server (cannot deploy to a static CDN).
- More expensive (server compute costs).

### When to use it

- E-commerce product pages.
- News sites, blogs with frequent updates.
- Personalized content (user-specific data).

## 3. Static Site Generation (SSG)

## How it works

React runs at **build time**, generates HTML for every page, and deploys static files to a CDN. No server needed at runtime.

\`\`\`jsx
// Next.js — pre-rendered at build
export async function generateStaticParams() {
  const posts = await fetch('/api/posts').then(r => r.json());
  return posts.map(p => ({ slug: p.slug }));
}

export default async function BlogPost({ params }) {
  const post = await fetch(\`/api/posts/\${params.slug}\`).then(r => r.json());
  return <article><h1>{post.title}</h1></article>;
}
\`\`\`

### Pros

- Blazing fast (served from CDN).
- Cheapest hosting (static files).
- Excellent SEO.

### Cons

- Stale data (only updates on rebuild).
- Long build times for large sites (10,000+ pages).
- Not suitable for user-specific content.

### When to use it

- Marketing pages, landing pages.
- Documentation sites.
- Blogs with infrequent updates.

## 4. Incremental Static Regeneration (ISR)

## How it works

A hybrid of SSG and SSR. Pages are statically generated, but Next.js **regenerates them in the background** at a set interval. Users get instant static pages, and stale pages update automatically.

\`\`\`jsx
// Next.js — revalidate every 60 seconds
export const revalidate = 60;

export default async function ProductPage({ params }) {
  const product = await fetch(\`/api/products/\${params.id}\`).then(r => r.json());
  return <h1>{product.name}</h1>;
}
\`\`\`

First request → serves cached static HTML.  
After 60 seconds → next request triggers a background rebuild.  
Subsequent requests → serve the updated static HTML.

### Pros

- Fast (CDN-cached).
- Fresh enough (updates in background).
- Scales like static (no server bottleneck).

### Cons

- Not real-time (stale window exists).
- Only available in Next.js (not a standard React feature).

### When to use it

- Product catalogs that update hourly/daily.
- News sites that need freshness but not instant updates.
- Any SSG site where you want automatic updates without rebuilds.

## Choosing the right strategy

| | CSR | SSR | SSG | ISR |
|---|---|---|---|---|
| **First paint** | Slow | Fast | Fastest | Fastest |
| **SEO** | Poor | Excellent | Excellent | Excellent |
| **Freshness** | Real-time | Real-time | Stale | Fresh-ish |
| **Hosting cost** | Cheap | Expensive | Cheapest | Cheap |
| **Use case** | Dashboards | Personalized pages | Marketing | E-commerce |

> ⚠️ **Junior Warning:** You can mix strategies in one app. Use SSG for your homepage, SSR for user profiles, CSR for the dashboard. Next.js lets you choose per route.
`);

write(path.join(base, 'testing-deployment.md'), `---
title: "Testing & Deployment"
category: "react"
chapterId: "server-frameworks-deployment"
slug: "testing-deployment"
description: "Unit, integration, and E2E tests with Jest, React Testing Library, Playwright, or Cypress."
---

# Testing & Deployment

## What is it?

Testing ensures your React app works correctly before users see it. Deployment is the process of pushing your app to production. Both are critical for professional React development.

## Types of testing

### 1. Unit Tests — test individual functions/components

Use **Jest** (test runner) and **React Testing Library** (component testing).

\`\`\`bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
\`\`\`

\`\`\`jsx
// Button.test.jsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with label', () => {
  render(<Button label="Click me" />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
\`\`\`

**When to use:** Test pure components, utility functions, and hooks.

### 2. Integration Tests — test multiple components together

Test how components interact — forms submitting, modals opening, data flowing.

\`\`\`jsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

test('submits form with correct data', async () => {
  const mockSubmit = jest.fn();
  render(<LoginForm onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText('Login'));

  expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
\`\`\`

**When to use:** Test user flows that span multiple components.

### 3. End-to-End (E2E) Tests — test the entire app in a real browser

Use **Playwright** (recommended) or **Cypress**.

\`\`\`bash
npm install --save-dev @playwright/test
\`\`\`

\`\`\`js
// tests/login.spec.js
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Dashboard')).toBeVisible();
});
\`\`\`

**When to use:** Test critical user journeys (signup, checkout, login).

## Testing philosophy

- **Unit tests** → fast, isolated, test logic.
- **Integration tests** → test component interactions.
- **E2E tests** → slow, expensive, test the whole app like a user.

Aim for:
- 70% unit tests.
- 20% integration tests.
- 10% E2E tests.

## Deployment strategies

### 1. Static Hosting (CSR / SSG)

Deploy static files to a CDN.

**Providers:**
- Vercel (best for Next.js).
- Netlify (great DX, automatic deploys from Git).
- Cloudflare Pages (fast edge network).
- GitHub Pages (free for open-source).

**Steps:**
1. Run \`npm run build\`.
2. Upload \`build/\` or \`dist/\` to the provider.
3. Done — automatic CDN distribution.

### 2. Server Hosting (SSR / Next.js)

Deploy a Node.js server.

**Providers:**
- Vercel (zero-config for Next.js).
- Railway, Render, Fly.io (simple Node.js hosts).
- AWS, Google Cloud, Azure (enterprise-scale).

**Steps:**
1. Build the app (\`npm run build\`).
2. Deploy to a server that runs \`npm start\`.
3. Configure environment variables (API keys, database URLs).

### 3. Edge Deployment (ISR / Remix)

Deploy to edge networks (servers close to users worldwide).

**Providers:**
- Cloudflare Workers (fastest edge network).
- Vercel Edge Functions.
- Netlify Edge Functions.

## CI/CD — Continuous Integration / Deployment

Automate testing and deployment with **GitHub Actions**, **GitLab CI**, or **CircleCI**.

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run build
      - run: vercel --prod
\`\`\`

Every push to \`main\` → tests run → if pass, deploy to production.

## Deployment checklist

- [ ] Run tests before deploying.
- [ ] Set environment variables (never commit secrets).
- [ ] Enable HTTPS (automatic on Vercel/Netlify).
- [ ] Configure custom domain.
- [ ] Set up analytics (Vercel Analytics, Google Analytics).
- [ ] Monitor errors (Sentry, LogRocket).

> ⚠️ **Junior Warning:** Never commit \`.env\` files to Git. Use \`.gitignore\` and set environment variables in your hosting provider's dashboard. Leaked API keys can cost you thousands in cloud bills or security breaches.
`);

console.log('\nAll remaining files written successfully!');
