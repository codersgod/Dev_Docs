---
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

```jsx
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
```

**Client Component** (add `'use client'` directive):

```jsx
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
```

## The rule: push interactivity to the leaves

Keep pages and data-heavy components as Server Components. Only add `'use client'` for the small interactive pieces (buttons, forms, toggles) at the edges of the component tree.

> ⚠️ **Warning:** You cannot import a Server Component inside a Client Component. But you CAN pass a Server Component as `children` to a Client Component — that pattern keeps the data-fetching on the server while the wrapper has interactivity.
