---
title: "Rules of Hooks"
category: "react"
chapterId: "hooks-in-depth"
slug: "rules-of-hooks"
description: "Only call at the top level, only call from React functions."
---

# Rules of Hooks

## What is it?

React Hooks have two hard rules enforced by a lint plugin (`eslint-plugin-react-hooks`). Break them and your app will have subtle, hard-to-find bugs.

## Rule 1 — Only call hooks at the top level

Never call hooks inside loops, conditions, or nested functions. React relies on hooks always being called in the **same order** every render.

```jsx
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
```

## Rule 2 — Only call hooks from React functions

You can call hooks from:
- React functional components.
- Custom hooks (functions whose names start with `use`).

Never call them from plain JavaScript utility functions, class components, or event handlers.

```jsx
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
```

> ⚠️ **Warning:** Install and enable `eslint-plugin-react-hooks` in your project. It catches rule violations automatically before they cause bugs at runtime.
