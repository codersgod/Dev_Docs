---
title: "Container & Presentational Components"
category: "react"
chapterId: "component-design-patterns"
slug: "container-presentational"
description: "Segregating data/logic from purely visual, UI-only components."
---

# Container & Presentational Components

## What is it?

This pattern splits components into two types:

- **Container (Smart) Components** — handle data fetching, state management, and business logic. They are connected to global state or APIs.
- **Presentational (Dumb) Components** — receive data via props and render UI. They are pure, reusable, and easy to test.

Coined by Dan Abramov in 2015, this pattern was dominant in the Redux era but has become less strict with Hooks.

## When to use it?

For clean separation of concerns in medium-to-large apps:
- When multiple screens show the same UI with different data.
- To make UI components testable in isolation (Storybook, design systems).
- When working with designers who need standalone component previews.

## How to use it

### Presentational Component (UI only)

```jsx
// UserCard.jsx — presentational
export default function UserCard({ name, email, avatar, onEdit }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}
```

No hooks, no API calls, no business logic — just props in, JSX out.

### Container Component (data & logic)

```jsx
// UserCardContainer.jsx — container
import { useState, useEffect } from 'react';
import UserCard from './UserCard';

export default function UserCardContainer({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);

  function handleEdit() {
    // Business logic — open modal, navigate, etc.
    console.log('Editing user', user.id);
  }

  if (!user) return <p>Loading...</p>;

  return (
    <UserCard
      name={user.name}
      email={user.email}
      avatar={user.avatar}
      onEdit={handleEdit}
    />
  );
}
```

The container fetches data, the presentational component displays it.

## Benefits

- **Reusability** — `UserCard` can be used anywhere with different data sources.
- **Testability** — test `UserCard` by passing mock props; no API mocking needed.
- **Design system friendly** — designers can work with presentational components in Storybook without backend dependencies.

## Modern React and the decline of strict separation

With Hooks, the line blurs:
- Small components often mix logic and UI (fine for simple cases).
- Custom hooks extract logic without needing separate container files.
- Server Components (Next.js) fetch data directly inside "presentational-looking" components.

The pattern is still useful for large apps, but is no longer a strict rule.

## Container/Presentational vs. Custom Hooks

| | Container/Presentational | Custom Hooks |
|---|---|---|
| Separates | Components | Logic |
| File structure | Two files per feature | One component + hook file |
| Modern? | Still valid but less strict | ✅ Preferred for logic reuse |

> ⚠️ **Warning:** Do not over-architect — not every component needs to be split. A button with `onClick` logic inside it is fine. Use this pattern when you genuinely need reusability or testability, not by default.
