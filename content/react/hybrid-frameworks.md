---
title: "Hybrid Frameworks"
category: "react"
chapterId: "server-frameworks-deployment"
slug: "hybrid-frameworks"
description: "Next.js and Remix for full-stack React applications."
---

# Hybrid Frameworks

## What is it?

**Hybrid frameworks** are React meta-frameworks that handle both server and client rendering, file-based routing, data fetching, and deployment optimizations out of the box. They blur the line between frontend and backend — letting you write React components that run on the server, call databases directly, and stream HTML to the browser.

The two dominant players: **Next.js** and **Remix**.

## Next.js

## What is it?

Next.js by Vercel is the most popular React framework. It supports:
- **App Router** (React Server Components, streaming).
- **Pages Router** (classic SSR/SSG).
- File-based routing.
- Built-in API routes.
- Automatic code splitting and image optimization.

### When to use it?

For any production React app. Next.js handles 90% of configuration, performance, and deployment concerns.

### Example — Server Component

```jsx
// app/users/page.tsx (Next.js App Router)
import db from '@/lib/db';

export default async function UsersPage() {
  const users = await db.query('SELECT * FROM users'); // Direct DB access

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

This runs **only on the server** — no API route needed.

### Deployment

Deploy to Vercel (zero config) or self-host on any Node.js server.

## Remix

## What is it?

Remix by Shopify is a full-stack React framework focused on **web fundamentals** — progressive enhancement, native HTML forms, and edge computing. It feels more "web native" than Next.js.

### Key differences from Next.js

| | Next.js | Remix |
|---|---|---|
| Philosophy | Server Components, hybrid | Web standards, forms |
| Data fetching | `async` components, `fetch` | `loader` functions |
| Mutations | Server Actions | `action` functions |
| Routing | File-based, nested layouts | File-based, nested routes |
| Edge-first | Optional | Built-in |

### Example — Remix loader

```jsx
// app/routes/users.tsx
import { useLoaderData } from '@remix-run/react';

// Runs on the server
export async function loader() {
  const users = await db.query('SELECT * FROM users');
  return users;
}

// Runs on the client
export default function UsersPage() {
  const users = useLoaderData();
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

Remix automatically serializes data from `loader` and injects it into the component.

### Deployment

Deploy to Vercel, Netlify, Cloudflare Workers, or any Node.js host.

## Next.js vs. Remix

| Use Next.js if | Use Remix if |
|---|---|
| You want the largest ecosystem and community | You prefer web standards and progressive enhancement |
| You need image optimization and ISR | You are deploying to the edge (Cloudflare Workers) |
| You want React Server Components | You want explicit data loading with loaders/actions |
| You are building a marketing site, e-commerce, or SaaS | You are building a form-heavy app or dashboard |

## Why not plain Create React App / Vite?

Hybrid frameworks handle:
- SEO (server-rendered HTML).
- Performance (automatic code splitting, prefetching).
- Data fetching (colocated with routes).
- Deployment (optimized builds, CDN integration).

Plain CRA/Vite is fine for internal tools or prototypes, but production apps benefit massively from a framework.

> ⚠️ **Warning:** Next.js 13+ App Router is a paradigm shift from the Pages Router. Do not mix both in one project — pick one and commit. The App Router is the future, but the Pages Router still works and is simpler for beginners.
