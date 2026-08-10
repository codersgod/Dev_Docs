---
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

```jsx
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
```

> ⚠️ **Warning:** Every component that calls `useContext(ThemeContext)` re-renders whenever the context value changes — even if it only uses one small piece of it. Split contexts by concern (e.g., separate `UserContext` and `ThemeContext`) to avoid unnecessary re-renders.
