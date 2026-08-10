---
title: "Control Props Pattern"
category: "react"
chapterId: "component-design-patterns"
slug: "control-props-pattern"
description: "Switching between uncontrolled and parent-driven controlled configurations."
---

# Control Props Pattern

## What is it?

The **Control Props Pattern** lets a component work in two modes:
1. **Uncontrolled** — the component manages its own state.
2. **Controlled** — the parent manages the state and the component is a "dumb" UI renderer.

The component checks: "Did the parent pass me a value? If yes, I am controlled. If no, I manage my own state."

## When to use it?

For reusable components where some users want full control (controlled) and others want plug-and-play simplicity (uncontrolled):
- Toggle switches.
- Modals (open/close state).
- Dropdowns.
- Custom inputs.

## How to use it

```jsx
import { useState } from 'react';

export default function Toggle({ value, onChange, defaultValue = false }) {
  // Check if component is controlled
  const isControlled = value !== undefined;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Use controlled value if provided, otherwise use internal
  const currentValue = isControlled ? value : internalValue;

  function handleToggle() {
    const newValue = !currentValue;

    if (!isControlled) {
      setInternalValue(newValue); // Update internal state
    }

    onChange?.(newValue); // Notify parent if they provided onChange
  }

  return (
    <button onClick={handleToggle}>
      {currentValue ? 'ON' : 'OFF'}
    </button>
  );
}
```

### Uncontrolled usage (component manages state)

```jsx
<Toggle defaultValue={false} onChange={val => console.log(val)} />
```

The component starts at `false` and updates its own state when clicked.

### Controlled usage (parent manages state)

```jsx
function App() {
  const [isOn, setIsOn] = useState(false);

  return <Toggle value={isOn} onChange={setIsOn} />;
}
```

The parent fully controls the toggle state — the component has no internal state.

## Key rules for controlled components

1. If `value` is provided, `onChange` **must** also be provided (otherwise the component is read-only).
2. Do not switch from uncontrolled to controlled or vice versa after mounting — React will warn you.
3. Use `defaultValue` for the initial uncontrolled value, not `value`.

## Benefits

- **Flexibility** — works for both use cases without duplicating code.
- **Progressive enhancement** — start uncontrolled, add control later when needed.

> ⚠️ **Warning:** Mixing `value` and `defaultValue` in the same component at the same time is a bug — React ignores `defaultValue` when `value` is present. Pick one mode and stick with it.
