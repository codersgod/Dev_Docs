---
title: "Components"
category: "react"
chapterId: "react-fundamentals"
slug: "functional-components"
description: "Functional components, class components (legacy), and self-closing tags."
playgroundTemplate: "react-component"
---

# Components

## What is it?

A component is a **reusable piece of UI** — like a custom HTML tag you invent yourself. React apps are built by composing small components (buttons, cards, forms) into larger ones (pages, layouts).

Two styles exist:
- **Functional component** — a plain JavaScript function that returns JSX. Use this.
- **Class component** — an ES6 class extending `React.Component`. Legacy. Read it, but do not write new ones.

## When to use it?

Every time you have a piece of UI that appears more than once, or whenever you want to break a large page into smaller, focused pieces.

## How to use it

Name the function with a **capital first letter** and return JSX.

```jsx
import React from 'react';

function UserCard({ name, role }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <UserCard name="Alice" role="Frontend Dev" />
      <UserCard name="Bob" role="Backend Dev" />
    </div>
  );
}
```

> ⚠️ **Warning:** Component names **must start with a capital letter**. `<userCard />` is treated as an unknown HTML tag — nothing renders and no error is thrown.
