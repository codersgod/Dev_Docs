---
title: "Server-Side Rendering (SSR)"
category: "react"
chapterId: "modern-architecture"
slug: "server-side-rendering"
description: "Next.js, Remix, and benefits of SSR over SPA."
---

# Server-Side Rendering (SSR)

## What is it?

In a standard React SPA, the server sends an empty HTML shell and the browser runs JavaScript to build the page. With **Server-Side Rendering**, the server runs the React components and sends **fully-rendered HTML** to the browser. The page is visible immediately, before any JavaScript loads.

## When to use it?

- Public pages where SEO matters (marketing, blogs, e-commerce).
- Pages with data that must be up-to-date on every request.
- Any app where first-load performance is critical.

## SSR vs SPA

| | SPA (Create React App) | SSR (Next.js / Remix) |
|---|---|---|
| First HTML | Empty shell | Full page content |
| SEO | Poor (bots see empty page) | ✅ Excellent |
| First paint | Slow (wait for JS) | ✅ Fast |
| Data fetching | Client-side after load | Server-side before render |

## How it works in Next.js

```jsx
// app/products/page.tsx (Next.js App Router)
// This runs on the server — no browser needed

async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts(); // fetched on server

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

The browser receives the already-rendered HTML — fast first paint, full SEO.

> ⚠️ **Warning:** SSR is not always better. For dashboards, admin tools, or heavily interactive apps, a SPA is often simpler and faster. Match the rendering strategy to the product's actual needs.
