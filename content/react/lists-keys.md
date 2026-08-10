---
title: "Lists & Keys"
category: "react"
chapterId: "react-fundamentals"
slug: "lists-keys"
description: "Mapping arrays to JSX and the importance of unique key props."
playgroundTemplate: "react-lists"
---

# Lists & Keys

## What is it?

Lists are how you render an **array of data** as repeated JSX elements. You use `.map()` to loop over an array and return a JSX element for each item.

A **key** is a special string prop you must add to each item. React uses keys to track which items changed, were added, or were removed. Without them, React re-renders the whole list on every update.

## When to use it?

Any time you display a collection — a list of users, a feed of posts, a table of products.

## How to use it

```jsx
import React from 'react';

const fruits = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
];

export default function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit.id}>{fruit.name}</li>
      ))}
    </ul>
  );
}
```

## Key Rules for Keys

- Keys must be **unique among siblings** (not globally).
- Use a stable ID from your data — not the array index if the list can reorder or filter.
- Keys are invisible to the child — you cannot read `props.key` inside a component.

> ⚠️ **Warning:** `key={index}` causes bugs when items are reordered or deleted — React updates the wrong elements. Always use a real, stable ID from your data.
