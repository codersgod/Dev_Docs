---
title: "Fragments"
category: "react"
chapterId: "react-fundamentals"
slug: "fragments"
description: "Grouping children without adding extra wrapper nodes to the DOM."
playgroundTemplate: "react-fragments"
---

# Fragments

## What is it?

A Fragment is a special wrapper that lets you **group multiple JSX elements without adding an extra `<div>` to the DOM**. It is React's invisible container — your component returns multiple siblings, but the DOM stays clean.

## When to use it?

When you need to return multiple elements from a component but do not want to introduce an unnecessary wrapper `<div>` that could:
- Break CSS layouts (Flexbox, Grid).
- Violate HTML semantics (e.g., `<tr>` directly inside `<table>` without a `<tbody>` wrapper).
- Pollute the DOM tree with meaningless divs.

## How to use it

### Long syntax — `<Fragment>`

```jsx
import { Fragment } from 'react';

function List() {
  return (
    <Fragment>
      <li>Item 1</li>
      <li>Item 2</li>
    </Fragment>
  );
}
```

### Short syntax — `<>...</>` (most common)

```jsx
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}
```

Both produce the same result: no wrapper div in the actual DOM.

## When you MUST use the long syntax

If you need to pass a **key** prop (for example, when mapping inside a loop), use `<Fragment key={id}>` — the short syntax does not accept props.

```jsx
items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.definition}</dd>
  </Fragment>
));
```

> ⚠️ **Warning:** You cannot add className, style, or any other props to a Fragment — it is not a real DOM element. If you need styling or attributes, use a real `<div>` instead.
