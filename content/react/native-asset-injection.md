---
title: "Native Asset Injection"
category: "react"
chapterId: "advanced-concepts"
slug: "native-asset-injection"
description: "First-class support for loading stylesheets, scripts, and metadata."
---

# Native Asset Injection (React 19)

## What is it?

React 19 adds built-in components for injecting **document metadata, stylesheets, and scripts** directly from your React components — no more manually editing `index.html` or using third-party libraries like `react-helmet`.

React handles:
- Deduplication (same stylesheet loaded multiple times → only one `<link>` in the DOM).
- Insertion order (stylesheets load before the component renders).
- Cleanup (when a component unmounts, its assets are removed if no other component needs them).

## When to use it?

- Setting page titles, meta descriptions, Open Graph tags.
- Loading component-specific CSS files.
- Injecting third-party scripts (analytics, widgets).

## How to use it

### Document metadata

```jsx
export default function BlogPost({ post }) {
  return (
    <>
      <title>{post.title} — My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:image" content={post.coverImage} />

      <article>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </article>
    </>
  );
}
```

React automatically hoists `<title>` and `<meta>` tags into the `<head>` — you do not manually place them there.

### Loading stylesheets

```jsx
export default function Tooltip() {
  return (
    <>
      <link rel="stylesheet" href="/tooltip.css" precedence="default" />
      <div className="tooltip">Hover over me</div>
    </>
  );
}
```

React ensures `tooltip.css` loads **before** the component renders, preventing FOUC (flash of unstyled content). The `precedence` prop controls the order when multiple stylesheets compete.

### Injecting scripts

```jsx
export default function AnalyticsWrapper({ children }) {
  return (
    <>
      <script async src="https://analytics.example.com/tracker.js" />
      {children}
    </>
  );
}
```

React deduplicates the script — if 10 components load the same `src`, only one `<script>` tag appears in the DOM.

## Precedence for stylesheets

The `precedence` prop determines load order when multiple stylesheets exist:

```jsx
<link rel="stylesheet" href="/reset.css" precedence="reset" />
<link rel="stylesheet" href="/app.css" precedence="default" />
<link rel="stylesheet" href="/theme.css" precedence="high" />
```

React loads them in this order: `reset → default → high`.

> ⚠️ **Warning:** These features only work in React 19+ and require a compatible framework (Next.js 15+, Remix with React 19). They do not work in Create React App or plain Vite setups.
