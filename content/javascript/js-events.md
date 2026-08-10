---
title: "Event Architecture"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-events"
description: "Bubbling, capturing, and scaling with Event Delegation."
---

# Event Architecture

## Event Propagation — 3 phases

1. **Capture phase** — event travels down from document to target
2. **Target phase** — event reaches the target element
3. **Bubble phase** — event travels back up to document (default)

```js
// Bubble phase (default: useCapture = false)
element.addEventListener('click', handler);

// Capture phase
element.addEventListener('click', handler, true);
// or
element.addEventListener('click', handler, { capture: true });
```

## Stopping propagation

```js
element.addEventListener('click', (e) => {
  e.stopPropagation();  // stop bubbling up
  e.preventDefault();   // stop default browser behavior (links, form submit)
});
```

## Event Delegation — one listener for many elements

Instead of attaching listeners to every child, attach one to the parent and check the target.

```js
// ❌ Inefficient — 1000 listeners for 1000 rows
rows.forEach(row => row.addEventListener('click', handleClick));

// ✅ Event delegation — 1 listener, works for dynamically added rows too
table.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row) return;
  handleRowClick(row);
});
```

## Custom events

```js
// Dispatch
const event = new CustomEvent('order:placed', {
  detail: { orderId: 123, total: 99.99 },
  bubbles: true,
});
document.dispatchEvent(event);

// Listen
document.addEventListener('order:placed', (e) => {
  console.log(e.detail.orderId); // 123
});
```

> ⚠️ **Warning:** Event delegation breaks with `stopPropagation`. If a child element stops propagation, the delegated listener on the parent never fires.
