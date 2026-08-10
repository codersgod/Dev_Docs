---
title: "Resource Prioritization"
category: "javascript"
chapterId: "js-web-vitals"
slug: "js-resource-hints"
description: "preload, prefetch, preconnect, and prerender asset hints."
---

# Resource Prioritization

## What is it?

HTML hints that tell the browser what to fetch and when — before it naturally discovers the resource. Used to eliminate render-blocking delays and speed up navigation.

## preload — fetch NOW, high priority

Use for critical resources needed in the current page (fonts, hero image, LCP element).

```html
<!-- Preload the LCP hero image -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />

<!-- Preload a font to prevent FOIT (flash of invisible text) -->
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin />

<!-- Preload a critical JS chunk -->
<link rel="preload" href="/chunk-critical.js" as="script" />
```

## prefetch — fetch LATER, low priority

For resources needed on the NEXT page navigation.

```html
<!-- User is likely to click "About" next -->
<link rel="prefetch" href="/about.js" as="script" />
```

## preconnect — establish TCP/TLS connection early

For third-party origins your page will request (fonts, APIs, CDNs).

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://api.example.com" crossorigin />
```

## dns-prefetch — DNS lookup only (cheaper fallback)

```html
<link rel="dns-prefetch" href="https://analytics.example.com" />
```

## Summary

| Hint | When | Priority |
|---|---|---|
| `preload` | Critical resource, current page | High |
| `prefetch` | Likely next page resource | Low |
| `preconnect` | Third-party origin you'll use | Medium |
| `dns-prefetch` | Third-party origin, DNS only | Very low |

> ⚠️ **Warning:** Over-preloading competes for bandwidth and can slow the LCP element. Only preload 2-3 critical resources maximum.
