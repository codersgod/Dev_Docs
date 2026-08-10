---
title: "Debounce & Throttle"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-debounce-throttle"
description: "High-performance utilities for high-frequency events."
---

# Debounce & Throttle

## What is it?

Both limit how often a function runs. The difference is **when** the execution happens.

- **Debounce** — waits until the event stops for N ms, then fires once (good for search input)
- **Throttle** — fires at most once every N ms while events keep coming (good for scroll, resize)

## Debounce

```js
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const onSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

input.addEventListener('input', e => onSearch(e.target.value));
// API called only 300ms after user stops typing
```

## Throttle

```js
function throttle(fn, limit) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

const onScroll = throttle(() => {
  updateNavbar(window.scrollY);
}, 100);

window.addEventListener('scroll', onScroll);
// updateNavbar runs at most once every 100ms
```

## When to use which

| Scenario | Use |
|---|---|
| Search input — fire after user stops typing | Debounce |
| Window resize — update layout | Debounce |
| Scroll position — update sticky header | Throttle |
| Mouse move — drag or canvas drawing | Throttle |
| Button spam prevention | Debounce |

> ⚠️ **Warning:** Debounce can feel laggy for drag/scroll — users expect immediate visual feedback. Use throttle there.
