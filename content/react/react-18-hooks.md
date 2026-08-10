---
title: "React 18/19 Hooks"
category: "react"
chapterId: "hooks-in-depth"
slug: "react-18-hooks"
description: "useTransition, useDeferredValue, useOptimistic, and use."
---

# React 18/19 Hooks

## useTransition — mark a state update as non-urgent

Lets you keep the UI responsive while a slow state update happens in the background. React processes the transition update at lower priority.

```jsx
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
```

## useDeferredValue — defer an expensive derived value

Similar to `useTransition` but for values you receive (not state you set). React defers updating the value until higher-priority work is done.

```jsx
import { useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery lags behind query — avoids blocking the input
  return <HeavyList filter={deferredQuery} />;
}
```

## useOptimistic — instant UI before server confirms (React 19)

Update the UI immediately with an optimistic value, then revert or confirm when the async action completes.

```jsx
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
```

## use — read a promise or context inside render (React 19)

`use(promise)` suspends the component until the promise resolves. Unlike hooks, it can be called inside conditions and loops.

```jsx
import { use, Suspense } from 'react';

function UserCard({ userPromise }) {
  const user = use(userPromise); // suspends until resolved
  return <h1>{user.name}</h1>;
}

// Wrap with Suspense
<Suspense fallback={<p>Loading...</p>}>
  <UserCard userPromise={fetchUser(1)} />
</Suspense>
```

> ⚠️ **Warning:** `useTransition` and `useDeferredValue` are performance tools — reach for them only when you have a measured lag problem. Most apps do not need them.
