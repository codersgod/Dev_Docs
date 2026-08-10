---
title: "Synthetic Events System"
category: "react"
chapterId: "core-engine-mechanics"
slug: "synthetic-events"
description: "Cross-browser normalization and event delegation for optimized memory usage."
---

# Synthetic Events System

## What is it?

React wraps browser events in a **SyntheticEvent** object — a cross-browser normalisation layer that ensures events behave identically in all browsers. React also uses **event delegation**: it attaches one event listener at the root of your app instead of one listener per element.

## Why React uses synthetic events

### 1. Cross-browser consistency

Browsers have subtle differences in event APIs. React abstracts them away:

```jsx
function handleClick(e) {
  e.preventDefault(); // Same API in all browsers
  e.stopPropagation();
  console.log(e.target.value); // Always works
}
```

### 2. Event pooling (legacy, removed in React 17)

In React 16 and earlier, SyntheticEvent objects were **reused** for performance. The event was nullified after the handler finished. React 17+ removed this — events are now regular JavaScript objects.

### 3. Event delegation (memory efficiency)

Instead of attaching individual listeners to every button, input, and div, React attaches **one listener per event type** to the root container. Events bubble up to the root, and React dispatches them to the correct handler.

```html
<!-- 1000 buttons in your app -->
<button onClick={handler1}>Click 1</button>
<button onClick={handler2}>Click 2</button>
...
<button onClick={handler1000}>Click 1000</button>

<!-- React attaches ONE click listener to the root -->
<div id="root"></div>
```

This saves memory and speeds up mounting/unmounting.

## Differences from native events

### SyntheticEvent properties

```jsx
function handleClick(e) {
  e.type           // "click"
  e.target         // The element that triggered the event
  e.currentTarget  // The element the listener is attached to
  e.nativeEvent    // The underlying browser event
}
```

### Accessing the native event

If you need browser-specific APIs, use `e.nativeEvent`:

```jsx
function handleClick(e) {
  console.log(e.nativeEvent.offsetX); // Browser-specific property
}
```

## Event delegation and stopPropagation

Because React uses delegation, `e.stopPropagation()` stops propagation **within the React tree**, but the native event still bubbles to the root in the real DOM.

If you add a native listener outside React, it will still fire:

```jsx
useEffect(() => {
  document.body.addEventListener('click', () => {
    console.log('Body clicked!'); // Still fires even if React handler calls stopPropagation
  });
}, []);
```

To prevent this, call `e.nativeEvent.stopImmediatePropagation()`.

## Passive event listeners

React automatically marks certain events as **passive** for better scroll performance:
- `onTouchStart`
- `onTouchMove`
- `onWheel`

This tells the browser: "I will not call `preventDefault()`, so feel free to scroll while my JavaScript runs."

> ⚠️ **Warning:** If you call `preventDefault()` inside a `setTimeout`, it will not work — the SyntheticEvent has already been processed. Call it synchronously inside the handler, or use `e.persist()` in React 16 (not needed in React 17+).
