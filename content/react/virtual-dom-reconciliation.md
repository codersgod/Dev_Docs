---
title: "Virtual DOM & Reconciliation"
category: "react"
chapterId: "core-engine-mechanics"
slug: "virtual-dom-reconciliation"
description: "Virtual tree representation and efficient diffing algorithm."
---

# Virtual DOM & Reconciliation

## What is it?

The **Virtual DOM** is a lightweight JavaScript representation of the real DOM. When your component's state changes, React:
1. Creates a new Virtual DOM tree.
2. Compares it to the previous tree (**reconciliation**).
3. Calculates the minimal set of changes needed.
4. Updates only those specific parts in the real DOM.

This makes updates fast because DOM manipulation is slow, but JavaScript object comparison is fast.

## How reconciliation works

React's diffing algorithm follows three rules:

### 1. Different element types → full rebuild

If the root element type changes, React tears down the old tree and builds a new one from scratch.

```jsx
// Before
<div><Counter /></div>

// After — React destroys <div> and <Counter>, builds <section> from scratch
<section><Counter /></section>
```

### 2. Same element type → update attributes

If the type stays the same, React keeps the DOM node and only updates changed attributes.

```jsx
// Before
<div className="red" />

// After — React keeps the <div>, only changes className
<div className="blue" />
```

### 3. Keys identify list items

When rendering lists, React uses `key` props to match old and new elements. Without keys, React matches items by position — leading to bugs when items reorder.

```jsx
// BAD — no keys, React matches by index
{items.map(item => <li>{item.name}</li>)}

// GOOD — keys let React track identity across renders
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

## Why the Virtual DOM?

Direct DOM manipulation is slow because:
- The browser must recalculate layout and repaint the screen.
- Each change triggers a synchronous reflow.

React batches updates and applies them in one efficient pass.

## Mental model

Think of the Virtual DOM as a **blueprint**. React compares the old blueprint with the new one, finds the differences, and sends a minimal change order to the real DOM construction crew.

> ⚠️ **Warning:** The Virtual DOM is NOT faster than direct DOM updates in all cases — it is faster than **naive** re-rendering of the entire tree. Frameworks like Svelte compile away the Virtual DOM entirely and can be faster for simple apps.
