---
title: "Rendering Strategies"
category: "javascript"
chapterId: "js-system-design"
slug: "js-rendering-strategies"
description: "CSR, SSR, SSG, and ISR trade-offs and when to use each."
---

# Rendering Strategies

## What is it?

Where and when HTML is generated — this decision impacts SEO, performance, and infrastructure complexity.

## The four strategies

### CSR — Client-Side Rendering (SPA)
Server sends an empty HTML shell. React/JS runs in the browser and builds the UI.
- ✅ Cheap hosting (static files)
- ✅ Rich interactivity
- ❌ Slow first load, poor SEO

### SSR — Server-Side Rendering
Server runs React on every request and sends full HTML.
- ✅ Always fresh data
- ✅ Good SEO
- ❌ Slower TTFB, higher server cost

### SSG — Static Site Generation
React runs at build time. HTML files pre-built and served from CDN.
- ✅ Fastest possible — CDN delivery
- ✅ Excellent SEO
- ❌ Stale data until rebuild

### ISR — Incremental Static Regeneration (Next.js)
Like SSG but pages can revalidate in the background after N seconds.
- ✅ Static speed + near-fresh data
- ❌ First visitor after expiry may see stale page

## Choosing a strategy

| Page type | Use |
|---|---|
| Dashboard / authenticated UI | CSR |
| Blog post, product page | SSG + ISR |
| User profile, personalized content | SSR |
| Marketing landing page | SSG |
| Real-time feed | CSR or SSR + streaming |

> ⚠️ **Warning:** These are not mutually exclusive — mix per route. Next.js App Router lets each page choose independently.
