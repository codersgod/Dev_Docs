---
title: "Closures"
category: "javascript"
chapterId: "js-scope-closures"
slug: "js-closures"
description: "Functions retaining access to their lexical scope."
---

# Closures

## What is it?

A closure is a function that **remembers the variables from its outer scope** even after that outer function has returned. The inner function carries a reference to the surrounding environment.

## When to use it?

- Data privacy / encapsulation
- Factory functions that generate configured functions
- Memoization, counters, event handlers that need persistent state

## How to use it

```js
function makeCounter() {
  let count = 0; // private — not accessible from outside

  return {
    increment() { count++; },
    decrement() { count--; },
    value() { return count; },
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
console.log(counter.value()); // 2
console.log(count); // ReferenceError — count is private
```

## Factory function example

```js
function multiplier(factor) {
  return (number) => number * factor; // closes over factor
}

const double = multiplier(2);
const triple = multiplier(3);

double(5); // 10
triple(5); // 15
```

## Classic loop bug

```js
// ❌ Bug — all callbacks share the same i (var is function-scoped)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// ✅ Fix — let creates a new binding each iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}
```

> ⚠️ **Warning:** Closures holding large objects or DOM nodes prevent garbage collection. Clear references when the closure is no longer needed.
