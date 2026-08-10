---
title: "Custom Hooks"
category: "react"
chapterId: "hooks-in-depth"
slug: "custom-hooks"
description: "Extracting component logic into reusable JavaScript functions."
playgroundTemplate: "react-custom-hook"
---

# Custom Hooks

## What is it?

A custom hook is a **plain JavaScript function whose name starts with `use`** that calls other React hooks inside it. They let you extract and share stateful logic between multiple components — the same way you extract repeated code into a utility function.

## When to use it?

When two or more components share the same logic — fetching data, tracking window size, managing a form field, detecting online/offline status.

## How to use it

Extract the logic into a `use*` function and call it from any component.

```jsx
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
```

> ⚠️ **Warning:** The `use` prefix is mandatory — it tells React (and the linter) that this function contains hooks and must follow the Rules of Hooks. A function called `fetchData` that calls `useState` inside it will not be linted correctly and will behave unexpectedly.
