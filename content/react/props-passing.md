---
title: "Props"
category: "react"
chapterId: "react-fundamentals"
slug: "props-passing"
description: "Passing data, destructuring props, read-only nature, and children prop."
playgroundTemplate: "react-props"
---

# Props

## What is it?

Props (short for properties) are how you **pass data from a parent component to a child**. They work like HTML attributes but for your custom components. Props are **read-only** — a child can never modify the props it receives.

## When to use it?

Every time a component needs external data — a username, a list of items, a click handler. If data comes from outside the component, it comes via props.

## How to use it

Pass props like HTML attributes. Read them by destructuring the first function argument.

```jsx
import React from 'react';

function Button({ label, color, onClick }) {
  return (
    <button style={{ backgroundColor: color }} onClick={onClick}>
      {label}
    </button>
  );
}

export default function App() {
  return (
    <Button
      label="Save"
      color="#2255FF"
      onClick={() => alert('Saved!')}
    />
  );
}
```

## The children prop

Anything placed **between** component tags becomes `props.children`.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h2>Hello</h2>
  <p>This is inside the card.</p>
</Card>
```

> ⚠️ **Warning:** Never modify props inside a child (`props.label = 'x'`). Props are one-way and read-only. To send data back up, pass a **callback function** as a prop.
