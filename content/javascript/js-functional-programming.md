---
title: "Functional Programming"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-functional-programming"
description: "HOFs, currying, pure functions, and IIFEs."
---

# Functional Programming

## What is it?

A programming style treating computation as the evaluation of **pure functions**, avoiding shared state and mutable data.

## Higher-Order Functions (HOF)

A function that takes a function as an argument or returns a function.

```js
// Array HOFs
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);              // [2, 4, 6, 8, 10]
nums.filter(n => n % 2 === 0);     // [2, 4]
nums.reduce((acc, n) => acc + n, 0); // 15
```

## Pure Functions

Same input → same output. No side effects.

```js
// Pure — no external dependencies
function add(a, b) { return a + b; }

// Impure — depends on external state
let tax = 0.1;
function price(amount) { return amount + amount * tax; } // not pure
```

## Currying

Transforming a function of multiple args into a chain of single-arg functions.

```js
// Regular
const add = (a, b) => a + b;
add(2, 3); // 5

// Curried
const add = a => b => a + b;
add(2)(3);     // 5
const add2 = add(2);
add2(10); // 12 — partially applied
```

## IIFE (Immediately Invoked Function Expression)

Runs immediately at definition. Used to create a private scope.

```js
const result = (function() {
  const secret = 42; // private
  return secret * 2;
})();

console.log(result); // 84
console.log(secret); // ReferenceError
```

> ⚠️ **Warning:** Avoid overusing currying — it reduces readability. Use it where partial application genuinely simplifies repeated calls.
