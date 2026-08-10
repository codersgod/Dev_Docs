---
title: "Portals"
category: "react"
chapterId: "advanced-concepts"
slug: "portals"
description: "Rendering children into a DOM node outside the parent DOM hierarchy."
---

# Portals

## What is it?

A portal lets you render a component's output into a **different DOM node** than its parent — while keeping it logically part of the same React tree (so events and context still flow normally).

## When to use it?

For modals, tooltips, dropdowns, and toast notifications — UI that needs to visually escape a parent with `overflow: hidden` or `z-index` constraints, but still needs to react to the same state.

## How to use it

```jsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-box">
        <button onClick={onClose}>✕</button>
        {children}
      </div>
    </div>,
    document.body // render into <body> directly
  );
}

// Usage — the modal DOM renders at <body> level
export default function App() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <p>This renders in document.body, not inside App.</p>
      </Modal>
    </>
  );
}
```

> ⚠️ **Warning:** Even though the modal renders inside `document.body`, React events still bubble up through the **React component tree** (not the real DOM tree). A click inside the modal will still trigger React onClick handlers on ancestor components.
