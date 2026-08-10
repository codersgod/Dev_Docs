---
title: "JSX (JavaScript XML)"
category: "react"
chapterId: "react-fundamentals"
slug: "jsx-syntax"
description: "Syntax rules, embedding expressions, and HTML differences."
playgroundTemplate: "react-jsx"
---

# JSX (JavaScript XML)

## What is it?

JSX is a syntax extension that lets you write HTML-like code inside JavaScript files. Your build tool converts it into plain `React.createElement()` calls — so it is just JavaScript in disguise.

## When to use it?

Always. Every React component returns JSX. It is the standard way to describe UI in React.

## Key Rules

- Every JSX block must have **one root parent** — wrap siblings in `<>` if needed.
- All tags must be **closed** — `<img />`, `<br />`, `<input />`.
- Use `className` instead of `class`, and `htmlFor` instead of `for`.
- Embed any JavaScript expression inside `{ }` curly braces.
- Attributes use **camelCase** — `onClick`, `onChange`, `tabIndex`.

## How to use it

```jsx
import React from 'react';

export default function Greeting() {
  const name = 'Junior Dev';
  const isLoggedIn = true;

  return (
    <div className="card">
      <h1>Hello, {name}!</h1>
      <p>2 + 2 = {2 + 2}</p>
      {isLoggedIn && <span>Welcome back</span>}
      <img src="/avatar.png" alt="avatar" />
    </div>
  );
}
```

> ⚠️ **Warning:** Only **expressions** go inside `{}`. You cannot put `if` statements or `for` loops directly inside JSX. Use ternary operators or move logic above the `return`.
