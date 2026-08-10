---
title: "React Router"
category: "react"
chapterId: "ecosystem-and-routing"
slug: "react-router"
description: "Routes, links, dynamic routing, URL parameters, and nested routes."
playgroundTemplate: "react-router-basic"
---

# React Router

## What is it?

React Router is the standard library for adding **client-side navigation** to a React app. It lets you map URLs to components, so the page does not reload — only the relevant component changes.

## When to use it?

Any multi-page React app (not using Next.js or Remix, which handle routing for you).

## How to use it

```bash
npm install react-router-dom
```

```jsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function Home() {
  return <h1>Home Page</h1>;
}

function UserDetail() {
  const { id } = useParams(); // reads :id from the URL
  return <h1>User #{id}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/users/1">User 1</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Key hooks

| Hook | What it does |
|---|---|
| `useParams()` | Read dynamic URL segments (`:id`) |
| `useNavigate()` | Programmatically go to a URL |
| `useLocation()` | Read current URL path and query string |
| `useSearchParams()` | Read/write query string params (`?page=2`) |

> ⚠️ **Warning:** Do not use `<a href="/about">` for internal links — it reloads the whole page. Always use `<Link to="/about">` from React Router for client-side navigation.
