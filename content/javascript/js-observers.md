---
title: "Observability APIs"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-observers"
description: "IntersectionObserver, MutationObserver, and ResizeObserver."
---

# Observability APIs

## IntersectionObserver — element visibility

Fires a callback when an element enters or leaves the viewport. No scroll listener needed.

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // stop watching once visible
    }
  });
}, {
  threshold: 0.2,      // fires when 20% visible
  rootMargin: '0px 0px -50px 0px' // trigger 50px before bottom edge
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
```

**Use for:** lazy loading images, infinite scroll, scroll animations, analytics visibility tracking.

## MutationObserver — DOM changes

Fires when nodes are added/removed or attributes change.

```js
const observer = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType === 1) console.log('Element added:', node);
    });
  });
});

observer.observe(document.body, {
  childList: true,  // watch for add/remove
  subtree: true,    // watch descendants too
  attributes: true, // watch attribute changes
});

// Stop observing
observer.disconnect();
```

**Use for:** tracking third-party DOM injections, custom component polyfills, auto-reinitializing plugins.

## ResizeObserver — element size changes

Fires when an element's size changes — more reliable than window resize for component-level layout.

```js
const observer = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(`New size: ${width}x${height}`);
  });
});

observer.observe(document.getElementById('chart-container'));
```

**Use for:** responsive charts, re-measuring text, container queries polyfills.

> ⚠️ **Warning:** Always call `observer.disconnect()` or `observer.unobserve(el)` when the component unmounts — otherwise the callback fires forever, leaking memory.
