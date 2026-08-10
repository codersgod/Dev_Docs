---
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

Your entire React app mounts into a single HTML element — usually `<div id="root">` in `index.html`.

```js
// main.jsx — entry point
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

## Conditional Rendering

Show or hide UI based on a condition.

### With `&&` — render only when true

```jsx
function Inbox({ messages }) {
  return (
    <div>
      <h1>Inbox</h1>
      {messages.length > 0 && <p>{messages.length} unread messages</p>}
    </div>
  );
}
```

### With ternary — render one or the other

```jsx
function LoginStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
    </div>
  );
}
```

> ⚠️ **Warning:** `{0 && <Component />}` renders the number `0` on screen — a classic bug. Always coerce to boolean: `{count > 0 && <Component />}`.
