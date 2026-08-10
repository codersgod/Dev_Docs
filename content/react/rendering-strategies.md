---
title: "Rendering Strategies"
category: "react"
chapterId: "server-frameworks-deployment"
slug: "rendering-strategies"
description: "SSR, SSG, CSR, and Incremental Static Regeneration (ISR)."
---

# Rendering Strategies

## What is it?

Modern React apps can render in multiple ways, each with different trade-offs for performance, SEO, and freshness. Understanding the four main strategies is critical for choosing the right architecture.

## 1. Client-Side Rendering (CSR)

## How it works

The server sends an empty HTML shell. JavaScript downloads, executes, fetches data, and renders the UI in the browser.

```html
<!-- Server sends this -->
<div id="root"></div>
<script src="/bundle.js"></script>

<!-- Browser runs JS and fills the root -->
```

### Pros

- Simple deployment (static files only).
- Rich interactivity.
- No server infrastructure needed.

### Cons

- Slow first paint (wait for JS + data).
- Poor SEO (bots see empty page).
- Poor UX on slow networks.

### When to use it

- Dashboards, admin panels, internal tools.
- Apps behind authentication.
- Apps with no SEO requirements.

## 2. Server-Side Rendering (SSR)

## How it works

React runs on the server for **every request**, generates full HTML, and sends it to the browser. The browser displays the page immediately, then JavaScript hydrates it.

```jsx
// Next.js — renders on every request
export default async function Page() {
  const data = await fetch('/api/data').then(r => r.json());
  return <h1>{data.title}</h1>;
}
```

### Pros

- Fast first paint (HTML arrives immediately).
- Excellent SEO (bots see full content).
- Always fresh data (rendered per request).

### Cons

- Slower than static (server must render on every hit).
- Requires a server (cannot deploy to a static CDN).
- More expensive (server compute costs).

### When to use it

- E-commerce product pages.
- News sites, blogs with frequent updates.
- Personalized content (user-specific data).

## 3. Static Site Generation (SSG)

## How it works

React runs at **build time**, generates HTML for every page, and deploys static files to a CDN. No server needed at runtime.

```jsx
// Next.js — pre-rendered at build
export async function generateStaticParams() {
  const posts = await fetch('/api/posts').then(r => r.json());
  return posts.map(p => ({ slug: p.slug }));
}

export default async function BlogPost({ params }) {
  const post = await fetch(`/api/posts/${params.slug}`).then(r => r.json());
  return <article><h1>{post.title}</h1></article>;
}
```

### Pros

- Blazing fast (served from CDN).
- Cheapest hosting (static files).
- Excellent SEO.

### Cons

- Stale data (only updates on rebuild).
- Long build times for large sites (10,000+ pages).
- Not suitable for user-specific content.

### When to use it

- Marketing pages, landing pages.
- Documentation sites.
- Blogs with infrequent updates.

## 4. Incremental Static Regeneration (ISR)

## How it works

A hybrid of SSG and SSR. Pages are statically generated, but Next.js **regenerates them in the background** at a set interval. Users get instant static pages, and stale pages update automatically.

```jsx
// Next.js — revalidate every 60 seconds
export const revalidate = 60;

export default async function ProductPage({ params }) {
  const product = await fetch(`/api/products/${params.id}`).then(r => r.json());
  return <h1>{product.name}</h1>;
}
```

First request → serves cached static HTML.  
After 60 seconds → next request triggers a background rebuild.  
Subsequent requests → serve the updated static HTML.

### Pros

- Fast (CDN-cached).
- Fresh enough (updates in background).
- Scales like static (no server bottleneck).

### Cons

- Not real-time (stale window exists).
- Only available in Next.js (not a standard React feature).

### When to use it

- Product catalogs that update hourly/daily.
- News sites that need freshness but not instant updates.
- Any SSG site where you want automatic updates without rebuilds.

## Choosing the right strategy

| | CSR | SSR | SSG | ISR |
|---|---|---|---|---|
| **First paint** | Slow | Fast | Fastest | Fastest |
| **SEO** | Poor | Excellent | Excellent | Excellent |
| **Freshness** | Real-time | Real-time | Stale | Fresh-ish |
| **Hosting cost** | Cheap | Expensive | Cheapest | Cheap |
| **Use case** | Dashboards | Personalized pages | Marketing | E-commerce |

> ⚠️ **Warning:** You can mix strategies in one app. Use SSG for your homepage, SSR for user profiles, CSR for the dashboard. Next.js lets you choose per route.
