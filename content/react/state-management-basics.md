---
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

```jsx
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
```

## Controlled vs. Uncontrolled Components

| | Controlled | Uncontrolled |
|---|---|---|
| **What** | React state drives the input value | DOM manages its own value |
| **How** | `value={state}` + `onChange` handler | `defaultValue` + ref to read value |
| **Use when** | You need instant validation or sync | Simple forms where you only read on submit |

```jsx
// Controlled input (recommended)
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled input
const inputRef = useRef();
<input ref={inputRef} defaultValue="Alice" />
// Read with: inputRef.current.value
```

> ⚠️ **Warning:** Mixing `value` without an `onChange` creates a read-only input and React warns you about it. Always pair `value` with `onChange`.
