---
title: "Styling Approaches"
category: "react"
chapterId: "ecosystem-and-routing"
slug: "styling-approaches"
description: "CSS Modules, Styled Components, Tailwind CSS, and Vanilla CSS."
---

# Styling Approaches

## What is it?

There are several ways to style React components. Each has trade-offs — here is a plain-English breakdown.

## 1. Vanilla CSS (global stylesheets)

Import a `.css` file and use `className`. Simple, but class names are global — collisions happen in large apps.

```jsx
import './Button.css';

function Button({ label }) {
  return <button className="btn btn-primary">{label}</button>;
}
```

## 2. CSS Modules (scoped class names)

Each class name is automatically scoped to its file — no collisions.

```css
/* Button.module.css */
.primary { background: #2255FF; color: white; }
```
```jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.primary}>Click</button>;
}
```

## 3. Tailwind CSS (utility classes)

Apply small, single-purpose classes directly in JSX. No separate CSS file needed.

```jsx
function Button() {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Click
    </button>
  );
}
```

## 4. Styled Components (CSS-in-JS)

Write real CSS inside your JavaScript file, scoped to a single component.

```bash
npm install styled-components
```
```jsx
import styled from 'styled-components';

const Button = styled.button`
  background: #2255FF;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
`;

function App() {
  return <Button>Click</Button>;
}
```

## Choosing an approach

| | Best for |
|---|---|
| Vanilla CSS | Simple projects or teams used to plain CSS |
| CSS Modules | Medium projects wanting scoped styles without a new syntax |
| Tailwind | Rapid UI development, design-system-first teams |
| Styled Components | Teams wanting dynamic styles tied to props, large design systems |

> ⚠️ **Warning:** Tailwind class strings get long fast. Extract repeated combinations into a component — do not copy-paste 20 Tailwind classes across your app.
