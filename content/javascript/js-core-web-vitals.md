---
title: "Core Web Vitals"
category: "javascript"
chapterId: "js-web-vitals"
slug: "js-core-web-vitals"
description: "CLS, INP, and LCP — measuring and solving performance issues."
---

# Core Web Vitals

## What is it?

Google's set of real-world performance metrics that directly affect SEO ranking. Measured from real user data via Chrome UX Report (CrUX).

## The three metrics

### LCP — Largest Contentful Paint
Time until the largest visible content element is rendered.
- **Good**: < 2.5s | **Poor**: > 4s

**Common causes and fixes:**
```html
<!-- ❌ Slow — image not prioritized -->
<img src="hero.jpg" />

<!-- ✅ Fast — preload and priority hint -->
<link rel="preload" href="hero.jpg" as="image" />
<img src="hero.jpg" fetchpriority="high" />
```

### CLS — Cumulative Layout Shift
Sum of unexpected layout shifts — elements jumping around during load.
- **Good**: < 0.1 | **Poor**: > 0.25

**Common causes and fixes:**
```html
<!-- ❌ Causes shift — no dimensions -->
<img src="banner.jpg" />

<!-- ✅ Reserve space with aspect-ratio or explicit dimensions -->
<img src="banner.jpg" width="800" height="400" />

<!-- ✅ CSS approach -->
<style>
.hero-img { aspect-ratio: 16/9; width: 100%; }
</style>
```

### INP — Interaction to Next Paint
Worst-case delay from user interaction to visual response.
- **Good**: < 200ms | **Poor**: > 500ms

**Fixes:**
```js
// Break up long tasks — yield to the browser
async function processLargeData(items) {
  for (let i = 0; i < items.length; i++) {
    process(items[i]);
    if (i % 50 === 0) await new Promise(r => setTimeout(r, 0)); // yield
  }
}

// Defer non-urgent updates with useTransition (React)
startTransition(() => setExpensiveState(newData));
```

## Measuring

```js
import { getLCP, getCLS, getINP } from 'web-vitals';

getLCP(console.log);
getCLS(console.log);
getINP(console.log);
```

> ⚠️ **Warning:** Lab tools (Lighthouse) measure ideal conditions. Real user INP/CLS can differ greatly. Use field data from Search Console or CrUX for real decisions.
