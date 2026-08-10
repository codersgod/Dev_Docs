---
title: "Refs & DOM"
category: "react"
chapterId: "advanced-concepts"
slug: "refs-dom"
description: "Accessing DOM elements, forwarding refs, and useImperativeHandle."
playgroundTemplate: "react-refs"
---

# Refs & DOM

## What is it?

A ref is a way to hold a reference to a real DOM element (or any mutable value) that persists across renders without causing re-renders. React normally manages the DOM for you — refs are your escape hatch when you need to interact with it directly.

## When to use it?

- Moving focus to an input.
- Triggering animations or measuring element size.
- Integrating a third-party DOM library (like a chart or map).

## Basic DOM ref

```jsx
import { useRef } from 'react';

export default function TextInput() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={() => inputRef.current.focus()}>Focus Input</button>
    </>
  );
}
```

## Forwarding Refs — expose a child's DOM node to a parent

```jsx
import { forwardRef, useRef } from 'react';

// Child exposes its internal input ref
const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} className="fancy" {...props} />;
});

// Parent can now focus the child's input directly
export default function Form() {
  const ref = useRef(null);
  return (
    <>
      <FancyInput ref={ref} placeholder="Type here" />
      <button onClick={() => ref.current.focus()}>Focus</button>
    </>
  );
}
```

## useImperativeHandle — control what the parent can do

Lets you customise the ref value exposed to the parent — instead of exposing the raw DOM node, expose only specific methods.

```jsx
import { forwardRef, useRef, useImperativeHandle } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer(props, ref) {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
  }));

  return <video ref={videoRef} src={props.src} />;
});
```

> ⚠️ **Warning:** Overusing refs to manipulate the DOM directly fights against React's model. If you are using a ref to change styles or content, ask yourself whether state would be cleaner.
