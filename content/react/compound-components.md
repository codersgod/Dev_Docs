---
title: "Compound Components"
category: "react"
chapterId: "component-design-patterns"
slug: "compound-components"
description: "Component families sharing implicit state for flexible interfaces."
---

# Compound Components

## What is it?

Compound components are a pattern where **multiple components work together** by sharing implicit state. The parent component manages state, and child components access it automatically without explicit prop passing.

Think of HTML's `<select>` and `<option>` — they work together, and `<option>` knows about the parent `<select>`'s state. Compound components recreate this pattern in React.

## When to use it?

For flexible, composable UI components:
- Tabs and tab panels.
- Accordions.
- Dropdown menus.
- Wizards and multi-step forms.

## How to use it

### Using Context for implicit state sharing

```jsx
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

export function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={isActive ? 'tab active' : 'tab'}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className="tab-panel">{children}</div>;
}
```

### Usage — flexible and declarative

```jsx
<Tabs defaultValue="profile">
  <TabList>
    <Tab value="profile">Profile</Tab>
    <Tab value="settings">Settings</Tab>
    <Tab value="billing">Billing</Tab>
  </TabList>

  <TabPanel value="profile">
    <h2>Your Profile</h2>
  </TabPanel>
  <TabPanel value="settings">
    <h2>Settings</h2>
  </TabPanel>
  <TabPanel value="billing">
    <h2>Billing Info</h2>
  </TabPanel>
</Tabs>
```

The user can compose the UI however they want — reorder tabs, add wrappers, insert extra elements.

## Benefits

- **Flexible composition** — users control the structure.
- **Clean API** — no massive props object with `activeTab`, `onTabChange`, `panels`.
- **Implicit communication** — child components automatically access parent state.

> ⚠️ **Warning:** Compound components tightly couple child components to their parent via context. They are not reusable outside that family — `<Tab>` only works inside `<Tabs>`. If you need standalone reusability, use plain props instead.
