---
title: "Static Site Generation (SSG)"
category: "react"
chapterId: "modern-architecture"
slug: "static-site-generation"
description: "Pre-rendering pages at build time for performance and SEO."
---

# Static Site Generation (SSG)

## What is it?

Static Site Generation means React runs your components **at build time** (not on the server per-request, not in the browser) and outputs plain HTML files. Those files are then served from a CDN — making them extremely fast, cheap to host, and SEO-friendly.

## When to use it?

For content that does not change per-user or per-request:
- Marketing pages, landing pages.
- Blog posts, documentation.
- Product catalogues with infrequent updates.

## SSG vs SSR vs SPA

| | SSG | SSR | SPA |
|---|---|---|---|
| Built | Build time | Per request | Browser |
| Speed | ✅ Fastest (CDN) | Fast | Slow first load |
| Freshness | Only on rebuild | Always fresh | Always fresh |
| SEO | ✅ Excellent | ✅ Excellent | Poor |

## How it works in Next.js

In the App Router, any Server Component that does not use dynamic APIs (cookies, headers, request object) is automatically statically generated:

```jsx
// app/blog/[slug]/page.tsx

// Tell Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  const posts = await fetch('/api/posts').then(r => r.json());
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await fetch(`/api/posts/${slug}`).then(r => r.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

Next.js pre-renders a separate HTML file for every slug returned by `generateStaticParams`.

## Incremental Static Regeneration (ISR)

SSG pages can be rebuilt in the background on a schedule — giving you static speed with fresh data:

```jsx
// Revalidate this page every 60 seconds
export const revalidate = 60;
```

> ⚠️ **Warning:** SSG does not work for personalised content (user dashboards, account pages) because every visitor gets the same HTML file. Use SSR or Client Components for anything user-specific.
