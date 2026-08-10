---
title: "Temporal Dead Zone (TDZ)"
category: "javascript"
chapterId: "js-scope-closures"
slug: "js-tdz"
description: "The TDZ window for let and const before initialization."
---

# Temporal Dead Zone (TDZ)

## What is it?

The TDZ is the window between the **start of the block scope** and the point where a `let` or `const` variable is initialized. Accessing the variable in this window throws a `ReferenceError`.

The variable is hoisted (JS knows it exists), but it's not yet initialized — so it's "dead."

## How to use it

```js
{
  // TDZ begins for x here
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 10;     // TDZ ends here — x is initialized
  console.log(x); // 10
}
```

## TDZ vs var hoisting

```js
console.log(a); // undefined — var is hoisted and initialized to undefined
var a = 5;

console.log(b); // ReferenceError — let is in TDZ
let b = 5;
```

## TDZ in functions

```js
function example() {
  // TDZ for result starts here
  const compute = () => result * 2; // ← defines a closure, not called yet
  const result = 10;                // TDZ ends here
  return compute(); // 20 — called AFTER initialization, works fine
}
```

> ⚠️ **Warning:** TDZ errors appear at runtime, not at parse time. Declare all `let`/`const` variables at the top of their scope to avoid them.
