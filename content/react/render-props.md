---
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

```jsx
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
```

The caller decides **what** to render, `MouseTracker` provides the **data**.

## Alternative: children as a function

Instead of a `render` prop, you can use `children` as a function:

```jsx
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
```

## Render Props vs. Custom Hooks

| | Render Props | Custom Hooks |
|---|---|---|
| Reuses | Logic + JSX structure | Logic only |
| Syntax | Nested function calls | Clean, top-level |
| Performance | Can cause extra re-renders | Better (no extra wrappers) |
| Modern? | Legacy | ✅ Preferred |

### Same example with a custom hook

```jsx
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
```

> ⚠️ **Warning:** Render props create extra components in the React tree (visible in DevTools) and can hurt performance if not memoized properly. For new code, prefer custom hooks.
