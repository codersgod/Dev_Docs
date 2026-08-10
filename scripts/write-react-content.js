// one-off script to write all React markdown content files
const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('wrote:', filePath);
}

const base = path.join(__dirname, '..', 'content', 'react');

// ─── 1. React Fundamentals ────────────────────────────────────────────────────

write(path.join(base, 'jsx-syntax.md'), `---
title: "JSX (JavaScript XML)"
category: "react"
chapterId: "react-fundamentals"
slug: "jsx-syntax"
description: "Syntax rules, embedding expressions, and HTML differences."
playgroundTemplate: "react-jsx"
---

# JSX (JavaScript XML)

## What is it?

JSX is a syntax extension that lets you write HTML-like code inside JavaScript files. Your build tool converts it into plain \`React.createElement()\` calls — so it is just JavaScript in disguise.

## When to use it?

Always. Every React component returns JSX. It is the standard way to describe UI in React.

## Key Rules

- Every JSX block must have **one root parent** — wrap siblings in \`<>\` if needed.
- All tags must be **closed** — \`<img />\`, \`<br />\`, \`<input />\`.
- Use \`className\` instead of \`class\`, and \`htmlFor\` instead of \`for\`.
- Embed any JavaScript expression inside \`{ }\` curly braces.
- Attributes use **camelCase** — \`onClick\`, \`onChange\`, \`tabIndex\`.

## How to use it

\`\`\`jsx
import React from 'react';

export default function Greeting() {
  const name = 'Junior Dev';
  const isLoggedIn = true;

  return (
    <div className="card">
      <h1>Hello, {name}!</h1>
      <p>2 + 2 = {2 + 2}</p>
      {isLoggedIn && <span>Welcome back</span>}
      <img src="/avatar.png" alt="avatar" />
    </div>
  );
}
\`\`\`

> ⚠️ **Junior Warning:** Only **expressions** go inside \`{}\`. You cannot put \`if\` statements or \`for\` loops directly inside JSX. Use ternary operators or move logic above the \`return\`.
`);

write(path.join(base, 'functional-components.md'), `---
title: "Components"
category: "react"
chapterId: "react-fundamentals"
slug: "functional-components"
description: "Functional components, class components (legacy), and self-closing tags."
playgroundTemplate: "react-component"
---

# Components

## What is it?

A component is a **reusable piece of UI** — like a custom HTML tag you invent yourself. React apps are built by composing small components (buttons, cards, forms) into larger ones (pages, layouts).

Two styles exist:
- **Functional component** — a plain JavaScript function that returns JSX. Use this.
- **Class component** — an ES6 class extending \`React.Component\`. Legacy. Read it, but do not write new ones.

## When to use it?

Every time you have a piece of UI that appears more than once, or whenever you want to break a large page into smaller, focused pieces.

## How to use it

Name the function with a **capital first letter** and return JSX.

\`\`\`jsx
import React from 'react';

function UserCard({ name, role }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <UserCard name="Alice" role="Frontend Dev" />
      <UserCard name="Bob" role="Backend Dev" />
    </div>
  );
}
\`\`\`

> ⚠️ **Junior Warning:** Component names **must start with a capital letter**. \`<userCard />\` is treated as an unknown HTML tag — nothing renders and no error is thrown.
`);

write(path.join(base, 'props-passing.md'), `---
title: "Props"
category: "react"
chapterId: "react-fundamentals"
slug: "props-passing"
description: "Passing data, destructuring props, read-only nature, and children prop."
playgroundTemplate: "react-props"
---

# Props

## What is it?

Props (short for properties) are how you **pass data from a parent component to a child**. They work like HTML attributes but for your custom components. Props are **read-only** — a child can never modify the props it receives.

## When to use it?

Every time a component needs external data — a username, a list of items, a click handler. If data comes from outside the component, it comes via props.

## How to use it

Pass props like HTML attributes. Read them by destructuring the first function argument.

\`\`\`jsx
import React from 'react';

function Button({ label, color, onClick }) {
  return (
    <button style={{ backgroundColor: color }} onClick={onClick}>
      {label}
    </button>
  );
}

export default function App() {
  return (
    <Button
      label="Save"
      color="#2255FF"
      onClick={() => alert('Saved!')}
    />
  );
}
\`\`\`

## The children prop

Anything placed **between** component tags becomes \`props.children\`.

\`\`\`jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h2>Hello</h2>
  <p>This is inside the card.</p>
</Card>
\`\`\`

> ⚠️ **Junior Warning:** Never modify props inside a child (\`props.label = 'x'\`). Props are one-way and read-only. To send data back up, pass a **callback function** as a prop.
`);

write(path.join(base, 'rendering-conditional.md'), `---
title: "Rendering"
category: "react"
chapterId: "react-fundamentals"
slug: "rendering-conditional"
description: "Virtual DOM concept, root node, and conditional rendering."
playgroundTemplate: "react-rendering"
---

# Rendering

## What is it?

Rendering is how React turns your component code into actual pixels on screen. React keeps a lightweight copy of the DOM in memory called the **Virtual DOM**. When state changes, React re-runs your component, compares the new Virtual DOM with the old one (**diffing**), and only updates the real DOM where something actually changed — making updates fast.

## The Root Node

Your entire React app mounts into a single HTML element — usually \`<div id="root">\` in \`index.html\`.

\`\`\`js
// main.jsx — entry point
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
\`\`\`

## Conditional Rendering

Show or hide UI based on a condition.

### With \`&&\` — render only when true

\`\`\`jsx
function Inbox({ messages }) {
  return (
    <div>
      <h1>Inbox</h1>
      {messages.length > 0 && <p>{messages.length} unread messages</p>}
    </div>
  );
}
\`\`\`

### With ternary — render one or the other

\`\`\`jsx
function LoginStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
    </div>
  );
}
\`\`\`

> ⚠️ **Junior Warning:** \`{0 && <Component />}\` renders the number \`0\` on screen — a classic bug. Always coerce to boolean: \`{count > 0 && <Component />}\`.
`);

write(path.join(base, 'lists-keys.md'), `---
title: "Lists & Keys"
category: "react"
chapterId: "react-fundamentals"
slug: "lists-keys"
description: "Mapping arrays to JSX and the importance of unique key props."
playgroundTemplate: "react-lists"
---

# Lists & Keys

## What is it?

Lists are how you render an **array of data** as repeated JSX elements. You use \`.map()\` to loop over an array and return a JSX element for each item.

A **key** is a special string prop you must add to each item. React uses keys to track which items changed, were added, or were removed. Without them, React re-renders the whole list on every update.

## When to use it?

Any time you display a collection — a list of users, a feed of posts, a table of products.

## How to use it

\`\`\`jsx
import React from 'react';

const fruits = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
];

export default function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit.id}>{fruit.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

## Key Rules for Keys

- Keys must be **unique among siblings** (not globally).
- Use a stable ID from your data — not the array index if the list can reorder or filter.
- Keys are invisible to the child — you cannot read \`props.key\` inside a component.

> ⚠️ **Junior Warning:** \`key={index}\` causes bugs when items are reordered or deleted — React updates the wrong elements. Always use a real, stable ID from your data.
`);

// ─── 2. State & Lifecycle ─────────────────────────────────────────────────────

write(path.join(base, 'use-state-hook.md'), `---
title: "useState Hook"
category: "react"
chapterId: "state-and-lifecycle"
slug: "use-state-hook"
description: "Initializing state, updating state, and functional updates."
playgroundTemplate: "react-counter"
---

# useState Hook

## What is it?

\`useState\` lets you add a **reactive variable** to a functional component. When you update it, React automatically re-renders the component to show the new value. Without state, your UI would be a static snapshot that never changes.

## When to use it?

Any time a component needs to remember something between renders — a counter, form input value, toggle switch, modal open/closed status.

## How to use it

Call \`useState(initialValue)\`. It returns an array with two items: the current value and a setter function.

\`\`\`jsx
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\`

## Functional Updates (safe pattern)

When the new state depends on the old state, use a function inside the setter. This prevents stale value bugs.

\`\`\`jsx
// Safe — always uses the latest value
setCount(prev => prev + 1);

// Risky — may use a stale snapshot of count
setCount(count + 1);
\`\`\`

> ⚠️ **Junior Warning:** Never modify state directly — \`count++\` does nothing visible. Always call the setter function: \`setCount(newValue)\`. State updates are **asynchronous** — you will not see the new value immediately after calling the setter.
`);

write(path.join(base, 'component-lifecycle.md'), `---
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

In class components these stages had named methods (\`componentDidMount\`, \`componentDidUpdate\`, \`componentWillUnmount\`). In modern functional components, all three stages are handled by \`useEffect\`.

## When to use it?

Understanding the lifecycle helps you know **when** your code runs — crucial for fetching data, setting up subscriptions, or cleaning up timers.

## How to use it

\`\`\`jsx
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
\`\`\`

## Lifecycle Map

| Stage | When it runs | \`useEffect\` equivalent |
|---|---|---|
| Mount | First render | \`useEffect(() => {}, [])\` |
| Update | State or props changed | \`useEffect(() => {}, [dep])\` |
| Unmount | Component removed from DOM | Return a cleanup function |

> ⚠️ **Junior Warning:** Forgetting the cleanup function causes **memory leaks**. If you start a timer, subscription, or event listener inside \`useEffect\`, always return a cleanup function that cancels it.
`);

write(path.join(base, 'use-effect-hook.md'), `---
title: "useEffect Hook"
category: "react"
chapterId: "state-and-lifecycle"
slug: "use-effect-hook"
description: "Dependency arrays, clean-up functions, and skipping effects."
playgroundTemplate: "react-effect"
---

# useEffect Hook

## What is it?

\`useEffect\` lets you **run code after the component renders** — for things that happen outside the UI, like fetching data, reading from localStorage, setting up a timer, or subscribing to an event.

The name comes from "side effects" — any operation that reaches outside the component's own render cycle.

## When to use it?

- Fetching data from an API on load.
- Syncing with external systems (WebSocket, localStorage, analytics).
- Setting up or clearing timers and event listeners.

## How to use it

The dependency array controls **when** the effect re-runs.

\`\`\`jsx
import React, { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Runs after every render where userId changed
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Re-runs only when userId changes

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
\`\`\`

## Dependency Array Cheat Sheet

\`\`\`jsx
useEffect(() => { /* runs after every render */ });

useEffect(() => { /* runs once on mount only */ }, []);

useEffect(() => { /* runs when count changes */ }, [count]);

useEffect(() => {
  const sub = subscribe();
  return () => sub.unsubscribe(); // cleanup on unmount
}, []);
\`\`\`

> ⚠️ **Junior Warning:** Including a function or object in the deps array that is re-created on every render will cause an infinite loop. Wrap those in \`useCallback\` or \`useMemo\`, or define them outside the component.
`);

write(path.join(base, 'state-management-basics.md'), `---
title: "State Management Basics"
category: "react"
chapterId: "state-and-lifecycle"
slug: "state-management-basics"
description: "Lifting state up and controlled vs. uncontrolled components."
playgroundTemplate: "react-state-basics"
---

# State Management Basics

## Lifting State Up

## What is it?

When two sibling components need to share the same data, you **lift state up** to their closest common parent. The parent owns the state and passes it down to both children via props.

## When to use it?

When two components need to stay in sync — e.g., a search input and a results list, or a quantity input and a price display.

\`\`\`jsx
import React, { useState } from 'react';

function SearchInput({ query, onChange }) {
  return (
    <input
      value={query}
      onChange={e => onChange(e.target.value)}
      placeholder="Search..."
    />
  );
}

function Results({ query }) {
  const items = ['Apple', 'Banana', 'Cherry'];
  return (
    <ul>
      {items
        .filter(i => i.toLowerCase().includes(query.toLowerCase()))
        .map(i => <li key={i}>{i}</li>)}
    </ul>
  );
}

// Parent owns the shared state
export default function App() {
  const [query, setQuery] = useState('');
  return (
    <div>
      <SearchInput query={query} onChange={setQuery} />
      <Results query={query} />
    </div>
  );
}
\`\`\`

## Controlled vs. Uncontrolled Components

| | Controlled | Uncontrolled |
|---|---|---|
| **What** | React state drives the input value | DOM manages its own value |
| **How** | \`value={state}\` + \`onChange\` handler | \`defaultValue\` + ref to read value |
| **Use when** | You need instant validation or sync | Simple forms where you only read on submit |

\`\`\`jsx
// Controlled input (recommended)
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled input
const inputRef = useRef();
<input ref={inputRef} defaultValue="Alice" />
// Read with: inputRef.current.value
\`\`\`

> ⚠️ **Junior Warning:** Mixing \`value\` without an \`onChange\` creates a read-only input and React warns you about it. Always pair \`value\` with \`onChange\`.
`);

// ─── 3. Hooks in Depth ────────────────────────────────────────────────────────

write(path.join(base, 'built-in-hooks.md'), `---
title: "Built-in Hooks"
category: "react"
chapterId: "hooks-in-depth"
slug: "built-in-hooks"
description: "useRef, useMemo, useCallback, useReducer, and useContext."
playgroundTemplate: "react-hooks"
---

# Built-in Hooks

React ships several hooks beyond \`useState\` and \`useEffect\`. Here is a plain-English guide to each.

## useRef — a box that persists across renders

Holds a mutable value that does **not** trigger a re-render when changed. Most commonly used to access a real DOM element.

\`\`\`jsx
import { useRef } from 'react';

export default function FocusInput() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} placeholder="Type here" />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
\`\`\`

## useMemo — cache an expensive calculation

Recomputes only when dependencies change. Use it for slow calculations, not for every value.

\`\`\`jsx
import { useMemo } from 'react';

const sorted = useMemo(
  () => [...items].sort((a, b) => a.price - b.price),
  [items] // only re-sort when items changes
);
\`\`\`

## useCallback — cache a function reference

Returns the same function instance between renders. Needed when passing callbacks to memoized child components.

\`\`\`jsx
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
\`\`\`

## useReducer — state machine for complex state

Like \`useState\` but state transitions are described by a reducer function. Great when next state depends on the action type.

\`\`\`jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
\`\`\`

## useContext — read context without prop drilling

\`\`\`jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Button() {
  const theme = useContext(ThemeContext);
  return <button style={{ background: theme.primary }}>Click</button>;
}
\`\`\`

> ⚠️ **Junior Warning:** \`useMemo\` and \`useCallback\` add complexity. Only use them when you have a **measured** performance problem — premature optimisation makes code harder to read.
`);

write(path.join(base, 'rules-of-hooks.md'), `---
title: "Rules of Hooks"
category: "react"
chapterId: "hooks-in-depth"
slug: "rules-of-hooks"
description: "Only call at the top level, only call from React functions."
---

# Rules of Hooks

## What is it?

React Hooks have two hard rules enforced by a lint plugin (\`eslint-plugin-react-hooks\`). Break them and your app will have subtle, hard-to-find bugs.

## Rule 1 — Only call hooks at the top level

Never call hooks inside loops, conditions, or nested functions. React relies on hooks always being called in the **same order** every render.

\`\`\`jsx
// ✅ Correct
function Component({ show }) {
  const [value, setValue] = useState(0); // always called

  if (!show) return null; // condition after hooks
  return <p>{value}</p>;
}

// ❌ Wrong — hook inside an if-block
function Component({ show }) {
  if (show) {
    const [value, setValue] = useState(0); // skipped sometimes!
  }
}
\`\`\`

## Rule 2 — Only call hooks from React functions

You can call hooks from:
- React functional components.
- Custom hooks (functions whose names start with \`use\`).

Never call them from plain JavaScript utility functions, class components, or event handlers.

\`\`\`jsx
// ✅ Custom hook — allowed
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

// ❌ Wrong — calling a hook from a plain function
function getWidth() {
  return useState(0); // This will crash
}
\`\`\`

> ⚠️ **Junior Warning:** Install and enable \`eslint-plugin-react-hooks\` in your project. It catches rule violations automatically before they cause bugs at runtime.
`);

write(path.join(base, 'custom-hooks.md'), `---
title: "Custom Hooks"
category: "react"
chapterId: "hooks-in-depth"
slug: "custom-hooks"
description: "Extracting component logic into reusable JavaScript functions."
playgroundTemplate: "react-custom-hook"
---

# Custom Hooks

## What is it?

A custom hook is a **plain JavaScript function whose name starts with \`use\`** that calls other React hooks inside it. They let you extract and share stateful logic between multiple components — the same way you extract repeated code into a utility function.

## When to use it?

When two or more components share the same logic — fetching data, tracking window size, managing a form field, detecting online/offline status.

## How to use it

Extract the logic into a \`use*\` function and call it from any component.

\`\`\`jsx
import { useState, useEffect } from 'react';

// Custom hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(err => { setError(err); setLoading(false); });
  }, [url]);

  return { data, loading, error };
}

// Use in any component
export default function Posts() {
  const { data, loading, error } = useFetch('/api/posts');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <ul>
      {data.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
\`\`\`

> ⚠️ **Junior Warning:** The \`use\` prefix is mandatory — it tells React (and the linter) that this function contains hooks and must follow the Rules of Hooks. A function called \`fetchData\` that calls \`useState\` inside it will not be linted correctly and will behave unexpectedly.
`);

write(path.join(base, 'react-18-hooks.md'), `---
title: "React 18/19 Hooks"
category: "react"
chapterId: "hooks-in-depth"
slug: "react-18-hooks"
description: "useTransition, useDeferredValue, useOptimistic, and use."
---

# React 18/19 Hooks

## useTransition — mark a state update as non-urgent

Lets you keep the UI responsive while a slow state update happens in the background. React processes the transition update at lower priority.

\`\`\`jsx
import { useState, useTransition } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // urgent — update input immediately

    startTransition(() => {
      setResults(heavyFilter(e.target.value)); // non-urgent — can wait
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

## useDeferredValue — defer an expensive derived value

Similar to \`useTransition\` but for values you receive (not state you set). React defers updating the value until higher-priority work is done.

\`\`\`jsx
import { useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery lags behind query — avoids blocking the input
  return <HeavyList filter={deferredQuery} />;
}
\`\`\`

## useOptimistic — instant UI before server confirms (React 19)

Update the UI immediately with an optimistic value, then revert or confirm when the async action completes.

\`\`\`jsx
import { useOptimistic } from 'react';

function LikeButton({ post }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    post.likes,
    (current) => current + 1
  );

  async function handleLike() {
    addOptimisticLike(); // instantly show +1
    await likePost(post.id); // confirm with server
  }

  return <button onClick={handleLike}>❤️ {optimisticLikes}</button>;
}
\`\`\`

## use — read a promise or context inside render (React 19)

\`use(promise)\` suspends the component until the promise resolves. Unlike hooks, it can be called inside conditions and loops.

\`\`\`jsx
import { use, Suspense } from 'react';

function UserCard({ userPromise }) {
  const user = use(userPromise); // suspends until resolved
  return <h1>{user.name}</h1>;
}

// Wrap with Suspense
<Suspense fallback={<p>Loading...</p>}>
  <UserCard userPromise={fetchUser(1)} />
</Suspense>
\`\`\`

> ⚠️ **Junior Warning:** \`useTransition\` and \`useDeferredValue\` are performance tools — reach for them only when you have a measured lag problem. Most apps do not need them.
`);

// ─── 4. Advanced Concepts ─────────────────────────────────────────────────────

write(path.join(base, 'context-api.md'), `---
title: "Context API"
category: "react"
chapterId: "advanced-concepts"
slug: "context-api"
description: "Creating context, providers, consumers, and avoiding prop drilling."
playgroundTemplate: "react-context"
---

# Context API

## What is it?

Context lets you share data across many components without passing props at every level — this is called **avoiding prop drilling**. Think of context as a global variable that only the components you choose can access.

## When to use it?

For data that is genuinely **global** within a subtree: the current user, theme (dark/light), selected language, or authentication status. Do not use it for everything — it makes components harder to reuse.

## How to use it

Three steps: Create → Provide → Consume.

\`\`\`jsx
import React, { createContext, useContext, useState } from 'react';

// 1. Create
const ThemeContext = createContext('light');

// 2. Provide — wrap the subtree that needs access
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Consume — anywhere inside the Provider tree
function ToggleButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
\`\`\`

> ⚠️ **Junior Warning:** Every component that calls \`useContext(ThemeContext)\` re-renders whenever the context value changes — even if it only uses one small piece of it. Split contexts by concern (e.g., separate \`UserContext\` and \`ThemeContext\`) to avoid unnecessary re-renders.
`);

write(path.join(base, 'refs-dom.md'), `---
title: "Refs & DOM"
category: "react"
chapterId: "advanced-concepts"
slug: "refs-dom"
description: "Accessing DOM elements, forwarding refs, and useImperativeHandle."
playgroundTemplate: "react-refs"
---

# Refs & DOM

## What is it?

A ref is a way to hold a reference to a real DOM element (or any mutable value) that persists across renders without causing re-renders. React normally manages the DOM for you — refs are your escape hatch when you need to interact with it directly.

## When to use it?

- Moving focus to an input.
- Triggering animations or measuring element size.
- Integrating a third-party DOM library (like a chart or map).

## Basic DOM ref

\`\`\`jsx
import { useRef } from 'react';

export default function TextInput() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={() => inputRef.current.focus()}>Focus Input</button>
    </>
  );
}
\`\`\`

## Forwarding Refs — expose a child's DOM node to a parent

\`\`\`jsx
import { forwardRef, useRef } from 'react';

// Child exposes its internal input ref
const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} className="fancy" {...props} />;
});

// Parent can now focus the child's input directly
export default function Form() {
  const ref = useRef(null);
  return (
    <>
      <FancyInput ref={ref} placeholder="Type here" />
      <button onClick={() => ref.current.focus()}>Focus</button>
    </>
  );
}
\`\`\`

## useImperativeHandle — control what the parent can do

Lets you customise the ref value exposed to the parent — instead of exposing the raw DOM node, expose only specific methods.

\`\`\`jsx
import { forwardRef, useRef, useImperativeHandle } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer(props, ref) {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
  }));

  return <video ref={videoRef} src={props.src} />;
});
\`\`\`

> ⚠️ **Junior Warning:** Overusing refs to manipulate the DOM directly fights against React's model. If you are using a ref to change styles or content, ask yourself whether state would be cleaner.
`);

write(path.join(base, 'error-boundaries.md'), `---
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

Error boundaries must be **class components** (there is no hook equivalent yet — use the \`react-error-boundary\` library for a hook-friendly version).

\`\`\`jsx
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
\`\`\`

## Easier: use react-error-boundary

\`\`\`jsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <MyWidget />
</ErrorBoundary>
\`\`\`

> ⚠️ **Junior Warning:** Error boundaries only catch errors during **rendering** and in lifecycle methods. They do NOT catch errors inside event handlers — use regular try/catch for those.
`);

write(path.join(base, 'portals.md'), `---
title: "Portals"
category: "react"
chapterId: "advanced-concepts"
slug: "portals"
description: "Rendering children into a DOM node outside the parent DOM hierarchy."
---

# Portals

## What is it?

A portal lets you render a component's output into a **different DOM node** than its parent — while keeping it logically part of the same React tree (so events and context still flow normally).

## When to use it?

For modals, tooltips, dropdowns, and toast notifications — UI that needs to visually escape a parent with \`overflow: hidden\` or \`z-index\` constraints, but still needs to react to the same state.

## How to use it

\`\`\`jsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-box">
        <button onClick={onClose}>✕</button>
        {children}
      </div>
    </div>,
    document.body // render into <body> directly
  );
}

// Usage — the modal DOM renders at <body> level
export default function App() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <p>This renders in document.body, not inside App.</p>
      </Modal>
    </>
  );
}
\`\`\`

> ⚠️ **Junior Warning:** Even though the modal renders inside \`document.body\`, React events still bubble up through the **React component tree** (not the real DOM tree). A click inside the modal will still trigger React onClick handlers on ancestor components.
`);

write(path.join(base, 'higher-order-components.md'), `---
title: "Higher-Order Components (HOC)"
category: "react"
chapterId: "advanced-concepts"
slug: "higher-order-components"
description: "Reusing component logic — mostly legacy, replaced by hooks."
---

# Higher-Order Components (HOC)

## What is it?

A Higher-Order Component is a **function that takes a component and returns a new, enhanced component**. It was the primary pattern for reusing component logic before React Hooks. You will encounter HOCs in older codebases and libraries like \`connect()\` from Redux, or \`withRouter\` from React Router v4.

## When to use it?

Mostly when you are working with a legacy codebase that has not been migrated to hooks, or when a third-party library requires it. For new code, prefer custom hooks.

## How to use it

\`\`\`jsx
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
\`\`\`

## HOC vs Custom Hook

| | HOC | Custom Hook |
|---|---|---|
| Reuses | Rendering logic | Stateful logic |
| Can wrap JSX | Yes | No |
| Adds wrapper to DOM | Yes (extra div) | No |
| Modern? | Legacy | ✅ Preferred |

> ⚠️ **Junior Warning:** HOCs can make your React DevTools component tree hard to read because they add wrapper components. When you have a choice, prefer a custom hook.
`);

// ─── 5. Performance Optimization ─────────────────────────────────────────────

write(path.join(base, 'memoization.md'), `---
title: "Memoization"
category: "react"
chapterId: "performance-optimization"
slug: "memoization"
description: "React.memo, useMemo, and useCallback to prevent unnecessary re-renders."
playgroundTemplate: "react-memo"
---

# Memoization

## What is it?

Memoization is **caching the result of a computation so it is not repeated unnecessarily**. In React, this means skipping re-renders or re-calculations when nothing has actually changed.

React gives you three tools:

## React.memo — skip re-rendering a component

Wraps a component and tells React: only re-render if the props actually changed.

\`\`\`jsx
import { memo } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }) {
  console.log('rendered!');
  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
});

// ExpensiveList only re-renders when items changes,
// not when the parent re-renders for other reasons.
\`\`\`

## useMemo — cache an expensive calculated value

\`\`\`jsx
import { useMemo } from 'react';

function ProductPage({ products, category }) {
  // Only re-filters when products or category changes
  const filtered = useMemo(
    () => products.filter(p => p.category === category),
    [products, category]
  );

  return <ProductList items={filtered} />;
}
\`\`\`

## useCallback — cache a function so its reference stays stable

\`\`\`jsx
import { useCallback, memo } from 'react';

// Without useCallback, handleDelete is a new function every render,
// causing ChildButton (memo'd) to re-render anyway.
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []); // stable — no deps that change
\`\`\`

## When should you actually use these?

Only when you have a **real, measured performance problem**. The overhead of memoization itself is not free. Profile first with React DevTools Profiler, then optimise.

| Tool | Use when |
|---|---|
| \`React.memo\` | Child re-renders too often with the same props |
| \`useMemo\` | A calculation is provably slow (large sorts, filters) |
| \`useCallback\` | Passing a callback to a \`memo\`'d child that keeps re-rendering |

> ⚠️ **Junior Warning:** Wrapping everything in \`memo\` and \`useMemo\` is a common beginner mistake. It adds cognitive overhead and can actually hurt performance. Start without it — add it only when profiling proves you need it.
`);

write(path.join(base, 'code-splitting.md'), `---
title: "Code Splitting"
category: "react"
chapterId: "performance-optimization"
slug: "code-splitting"
description: "React.lazy, Suspense, and dynamic imports."
---

# Code Splitting

## What is it?

Code splitting breaks your JavaScript bundle into smaller chunks that are loaded **on demand**, instead of sending the entire app to the user upfront. This makes the initial page load faster because the browser only downloads the code it needs right now.

## When to use it?

- Large pages or routes the user may never visit (admin panel, settings).
- Heavy third-party libraries (chart libraries, rich text editors, map widgets).
- Anything not needed for the first paint.

## How to use it

### React.lazy + Suspense (built-in)

\`\`\`jsx
import React, { lazy, Suspense } from 'react';

// The chart bundle is only downloaded when this component is rendered
const Chart = lazy(() => import('./Chart'));

export default function Dashboard() {
  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <Chart data={stats} />
    </Suspense>
  );
}
\`\`\`

### Route-level splitting with React Router

\`\`\`jsx
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
\`\`\`

> ⚠️ **Junior Warning:** Do not lazy-load tiny components — the network round-trip cost outweighs the savings. Split at the **route or large-feature level**, not at the button level.
`);

write(path.join(base, 'strict-mode.md'), `---
title: "Strict Mode"
category: "react"
chapterId: "performance-optimization"
slug: "strict-mode"
description: "Identifying unsafe lifecycles and unexpected side effects in development."
---

# Strict Mode

## What is it?

\`React.StrictMode\` is a wrapper component that **activates extra development-only checks and warnings**. It renders nothing visible but helps you catch bugs early.

Key things it does in development:
- Calls your component's render function and effects **twice** (intentionally) to detect impure code that accidentally has side effects during render.
- Warns about deprecated APIs.
- Warns about effects missing cleanup functions.

Strict Mode has **zero effect in production** — it only runs in development.

## When to use it?

Always. Keep it wrapped around your entire app (or the parts you are actively developing) to catch bugs before they reach production.

## How to use it

\`\`\`jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
\`\`\`

## What the double-render reveals

If your component has state or side effects that run during rendering, Strict Mode's double invocation will expose them:

\`\`\`jsx
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
\`\`\`

> ⚠️ **Junior Warning:** If you see \`useEffect\` cleanup running immediately after mount in development — that is Strict Mode working correctly, not a bug. Your cleanup logic is being tested. Do not remove StrictMode to fix it; fix the cleanup logic.
`);

write(path.join(base, 'state-batching.md'), `---
title: "State Batching"
category: "react"
chapterId: "performance-optimization"
slug: "state-batching"
description: "Automatic batching of multiple state updates."
---

# State Batching

## What is it?

Batching means React **groups multiple state updates together and triggers only one re-render** instead of re-rendering for each individual update. This is a performance optimisation that happens automatically.

## React 17 vs React 18

In React 17, batching only happened inside React event handlers. State updates inside \`setTimeout\`, Promises, or native event listeners triggered separate re-renders.

In **React 18**, batching is **automatic everywhere** — event handlers, timeouts, Promises, and async code all batch automatically.

\`\`\`jsx
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  function handleSubmit() {
    // React 18 — these two updates are batched into ONE re-render
    setName('Alice');
    setAge(30);
    // Component re-renders once, not twice
  }

  return <button onClick={handleSubmit}>Set User</button>;
}
\`\`\`

## Opting out of batching

If you ever need a state update to trigger an immediate, separate render (rare), use \`flushSync\` from \`react-dom\`:

\`\`\`jsx
import { flushSync } from 'react-dom';

flushSync(() => setName('Alice')); // re-renders immediately
flushSync(() => setAge(30));       // re-renders again
\`\`\`

> ⚠️ **Junior Warning:** You almost never need \`flushSync\`. Its main use case is measuring DOM layout right after a state update. Using it unnecessarily defeats the purpose of batching and hurts performance.
`);

// ─── 6. Ecosystem & Routing ───────────────────────────────────────────────────

write(path.join(base, 'react-router.md'), `---
title: "React Router"
category: "react"
chapterId: "ecosystem-and-routing"
slug: "react-router"
description: "Routes, links, dynamic routing, URL parameters, and nested routes."
playgroundTemplate: "react-router-basic"
---

# React Router

## What is it?

React Router is the standard library for adding **client-side navigation** to a React app. It lets you map URLs to components, so the page does not reload — only the relevant component changes.

## When to use it?

Any multi-page React app (not using Next.js or Remix, which handle routing for you).

## How to use it

\`\`\`bash
npm install react-router-dom
\`\`\`

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function Home() {
  return <h1>Home Page</h1>;
}

function UserDetail() {
  const { id } = useParams(); // reads :id from the URL
  return <h1>User #{id}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/users/1">User 1</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Key hooks

| Hook | What it does |
|---|---|
| \`useParams()\` | Read dynamic URL segments (\`:id\`) |
| \`useNavigate()\` | Programmatically go to a URL |
| \`useLocation()\` | Read current URL path and query string |
| \`useSearchParams()\` | Read/write query string params (\`?page=2\`) |

> ⚠️ **Junior Warning:** Do not use \`<a href="/about">\` for internal links — it reloads the whole page. Always use \`<Link to="/about">\` from React Router for client-side navigation.
`);

write(path.join(base, 'global-state-management.md'), `---
title: "Global State Management"
category: "react"
chapterId: "ecosystem-and-routing"
slug: "global-state-management"
description: "Redux Toolkit, Zustand, Recoil, or MobX."
---

# Global State Management

## What is it?

Global state management is for data that needs to be accessible by **many components across the app** — shopping cart, logged-in user, notification list. React's built-in Context API works for simple cases, but dedicated libraries offer better performance, devtools, and patterns for complex apps.

## The main options

### Zustand (recommended for most apps — simple, tiny)

\`\`\`bash
npm install zustand
\`\`\`

\`\`\`jsx
import { create } from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }),
}));

// In any component — no provider needed
function Cart() {
  const { items, clearCart } = useCartStore();
  return (
    <>
      <p>{items.length} items in cart</p>
      <button onClick={clearCart}>Clear</button>
    </>
  );
}
\`\`\`

### Redux Toolkit (for large teams, complex flows, strong devtools)

\`\`\`bash
npm install @reduxjs/toolkit react-redux
\`\`\`

\`\`\`jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
  },
});

const store = configureStore({ reducer: { counter: counterSlice.reducer } });
const { increment } = counterSlice.actions;

function Counter() {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(increment())}>{count}</button>;
}

// Wrap app with Provider
<Provider store={store}><Counter /></Provider>
\`\`\`

## Choosing a library

| Library | Best for |
|---|---|
| Context API | Simple, infrequently-updated global data (theme, user) |
| Zustand | Most apps — minimal boilerplate, great performance |
| Redux Toolkit | Large teams, complex business logic, time-travel debugging |
| Jotai / Recoil | Atomic state (fine-grained subscriptions) |

> ⚠️ **Junior Warning:** Do not reach for Redux just because the app has global state. Zustand solves 90% of use cases with 10% of the code. Add Redux when your team size and complexity actually demands it.
`);

write(path.join(base, 'data-fetching.md'), `---
title: "Data Fetching"
category: "react"
chapterId: "ecosystem-and-routing"
slug: "data-fetching"
description: "Axios, Fetch API, TanStack Query (React Query), and SWR."
playgroundTemplate: "react-fetch"
---

# Data Fetching

## What is it?

Data fetching is how your React app loads data from an API. You can fetch data manually with the browser's built-in \`fetch\`, or use a library like Axios, TanStack Query, or SWR that handles loading states, caching, and refetching for you.

## Option 1: fetch + useEffect (manual, simple)

\`\`\`jsx
import { useState, useEffect } from 'react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false); });
  }, []);

  if (loading) return <p>Loading...</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
\`\`\`

## Option 2: TanStack Query (recommended for real apps)

Handles caching, background refetching, loading/error states, and pagination automatically.

\`\`\`bash
npm install @tanstack/react-query
\`\`\`

\`\`\`jsx
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <ul>{data.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}

// Wrap your app
<QueryClientProvider client={queryClient}>
  <Posts />
</QueryClientProvider>
\`\`\`

## Comparison

| | Fetch + useEffect | Axios | TanStack Query | SWR |
|---|---|---|---|---|
| Caching | Manual | Manual | ✅ Automatic | ✅ Automatic |
| Deduplication | No | No | ✅ Yes | ✅ Yes |
| Background refetch | No | No | ✅ Yes | ✅ Yes |
| Bundle size | 0kb | ~14kb | ~13kb | ~4kb |

> ⚠️ **Junior Warning:** Writing your own data-fetching logic with \`useEffect\` quickly becomes a mess of loading/error/stale states. Use TanStack Query or SWR for anything beyond a simple demo.
`);

write(path.join(base, 'styling-approaches.md'), `---
title: "Styling Approaches"
category: "react"
chapterId: "ecosystem-and-routing"
slug: "styling-approaches"
description: "CSS Modules, Styled Components, Tailwind CSS, and Vanilla CSS."
---

# Styling Approaches

## What is it?

There are several ways to style React components. Each has trade-offs — here is a plain-English breakdown.

## 1. Vanilla CSS (global stylesheets)

Import a \`.css\` file and use \`className\`. Simple, but class names are global — collisions happen in large apps.

\`\`\`jsx
import './Button.css';

function Button({ label }) {
  return <button className="btn btn-primary">{label}</button>;
}
\`\`\`

## 2. CSS Modules (scoped class names)

Each class name is automatically scoped to its file — no collisions.

\`\`\`css
/* Button.module.css */
.primary { background: #2255FF; color: white; }
\`\`\`
\`\`\`jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.primary}>Click</button>;
}
\`\`\`

## 3. Tailwind CSS (utility classes)

Apply small, single-purpose classes directly in JSX. No separate CSS file needed.

\`\`\`jsx
function Button() {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Click
    </button>
  );
}
\`\`\`

## 4. Styled Components (CSS-in-JS)

Write real CSS inside your JavaScript file, scoped to a single component.

\`\`\`bash
npm install styled-components
\`\`\`
\`\`\`jsx
import styled from 'styled-components';

const Button = styled.button\`
  background: #2255FF;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
\`;

function App() {
  return <Button>Click</Button>;
}
\`\`\`

## Choosing an approach

| | Best for |
|---|---|
| Vanilla CSS | Simple projects or teams used to plain CSS |
| CSS Modules | Medium projects wanting scoped styles without a new syntax |
| Tailwind | Rapid UI development, design-system-first teams |
| Styled Components | Teams wanting dynamic styles tied to props, large design systems |

> ⚠️ **Junior Warning:** Tailwind class strings get long fast. Extract repeated combinations into a component — do not copy-paste 20 Tailwind classes across your app.
`);

// ─── 7. Modern Frameworks & Architecture ─────────────────────────────────────

write(path.join(base, 'server-side-rendering.md'), `---
title: "Server-Side Rendering (SSR)"
category: "react"
chapterId: "modern-architecture"
slug: "server-side-rendering"
description: "Next.js, Remix, and benefits of SSR over SPA."
---

# Server-Side Rendering (SSR)

## What is it?

In a standard React SPA, the server sends an empty HTML shell and the browser runs JavaScript to build the page. With **Server-Side Rendering**, the server runs the React components and sends **fully-rendered HTML** to the browser. The page is visible immediately, before any JavaScript loads.

## When to use it?

- Public pages where SEO matters (marketing, blogs, e-commerce).
- Pages with data that must be up-to-date on every request.
- Any app where first-load performance is critical.

## SSR vs SPA

| | SPA (Create React App) | SSR (Next.js / Remix) |
|---|---|---|
| First HTML | Empty shell | Full page content |
| SEO | Poor (bots see empty page) | ✅ Excellent |
| First paint | Slow (wait for JS) | ✅ Fast |
| Data fetching | Client-side after load | Server-side before render |

## How it works in Next.js

\`\`\`jsx
// app/products/page.tsx (Next.js App Router)
// This runs on the server — no browser needed

async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts(); // fetched on server

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
\`\`\`

The browser receives the already-rendered HTML — fast first paint, full SEO.

> ⚠️ **Junior Warning:** SSR is not always better. For dashboards, admin tools, or heavily interactive apps, a SPA is often simpler and faster. Match the rendering strategy to the product's actual needs.
`);

write(path.join(base, 'react-server-components.md'), `---
title: "React Server Components"
category: "react"
chapterId: "modern-architecture"
slug: "react-server-components"
description: "Server vs. Client components and hybrid rendering."
---

# React Server Components (RSC)

## What is it?

React Server Components (RSC) are components that run **exclusively on the server** — they never ship to the browser. They can directly access databases, file systems, and secret API keys. They send their rendered output as a special data format to the client, reducing the JavaScript bundle the user has to download.

This is a Next.js 13+ App Router concept (not available in plain Create React App).

## Server vs. Client components

| | Server Component | Client Component |
|---|---|---|
| Runs on | Server only | Browser (+ server for initial render) |
| Can use hooks? | ❌ No | ✅ Yes |
| Can read DB directly? | ✅ Yes | ❌ No |
| Adds to JS bundle? | ❌ No | ✅ Yes |
| Default in Next.js App Router | ✅ Yes | No — must opt in |

## How to use them

**Server Component** (default — no directive needed):

\`\`\`jsx
// app/users/page.tsx — runs on server
import db from '@/lib/db';

export default async function UsersPage() {
  const users = await db.query('SELECT * FROM users'); // direct DB access

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
\`\`\`

**Client Component** (add \`'use client'\` directive):

\`\`\`jsx
'use client'; // ← this makes it a Client Component

import { useState } from 'react';

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️ Liked' : '🤍 Like'}
    </button>
  );
}
\`\`\`

## The rule: push interactivity to the leaves

Keep pages and data-heavy components as Server Components. Only add \`'use client'\` for the small interactive pieces (buttons, forms, toggles) at the edges of the component tree.

> ⚠️ **Junior Warning:** You cannot import a Server Component inside a Client Component. But you CAN pass a Server Component as \`children\` to a Client Component — that pattern keeps the data-fetching on the server while the wrapper has interactivity.
`);

write(path.join(base, 'static-site-generation.md'), `---
title: "Static Site Generation (SSG)"
category: "react"
chapterId: "modern-architecture"
slug: "static-site-generation"
description: "Pre-rendering pages at build time for performance and SEO."
---

# Static Site Generation (SSG)

## What is it?

Static Site Generation means React runs your components **at build time** (not on the server per-request, not in the browser) and outputs plain HTML files. Those files are then served from a CDN — making them extremely fast, cheap to host, and SEO-friendly.

## When to use it?

For content that does not change per-user or per-request:
- Marketing pages, landing pages.
- Blog posts, documentation.
- Product catalogues with infrequent updates.

## SSG vs SSR vs SPA

| | SSG | SSR | SPA |
|---|---|---|---|
| Built | Build time | Per request | Browser |
| Speed | ✅ Fastest (CDN) | Fast | Slow first load |
| Freshness | Only on rebuild | Always fresh | Always fresh |
| SEO | ✅ Excellent | ✅ Excellent | Poor |

## How it works in Next.js

In the App Router, any Server Component that does not use dynamic APIs (cookies, headers, request object) is automatically statically generated:

\`\`\`jsx
// app/blog/[slug]/page.tsx

// Tell Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  const posts = await fetch('/api/posts').then(r => r.json());
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await fetch(\`/api/posts/\${slug}\`).then(r => r.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
\`\`\`

Next.js pre-renders a separate HTML file for every slug returned by \`generateStaticParams\`.

## Incremental Static Regeneration (ISR)

SSG pages can be rebuilt in the background on a schedule — giving you static speed with fresh data:

\`\`\`jsx
// Revalidate this page every 60 seconds
export const revalidate = 60;
\`\`\`

> ⚠️ **Junior Warning:** SSG does not work for personalised content (user dashboards, account pages) because every visitor gets the same HTML file. Use SSR or Client Components for anything user-specific.
`);

console.log('\\nAll files written successfully!');
