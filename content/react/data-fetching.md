---
title: "Data Fetching"
category: "react"
chapterId: "ecosystem-and-routing"
slug: "data-fetching"
description: "Axios, Fetch API, TanStack Query (React Query), and SWR."
playgroundTemplate: "react-fetch"
---

# Data Fetching

## What is it?

Data fetching is how your React app loads data from an API. You can fetch data manually with the browser's built-in `fetch`, or use a library like Axios, TanStack Query, or SWR that handles loading states, caching, and refetching for you.

## Option 1: fetch + useEffect (manual, simple)

```jsx
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
```

## Option 2: TanStack Query (recommended for real apps)

Handles caching, background refetching, loading/error states, and pagination automatically.

```bash
npm install @tanstack/react-query
```

```jsx
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
```

## Comparison

| | Fetch + useEffect | Axios | TanStack Query | SWR |
|---|---|---|---|---|
| Caching | Manual | Manual | ✅ Automatic | ✅ Automatic |
| Deduplication | No | No | ✅ Yes | ✅ Yes |
| Background refetch | No | No | ✅ Yes | ✅ Yes |
| Bundle size | 0kb | ~14kb | ~13kb | ~4kb |

> ⚠️ **Warning:** Writing your own data-fetching logic with `useEffect` quickly becomes a mess of loading/error/stale states. Use TanStack Query or SWR for anything beyond a simple demo.
