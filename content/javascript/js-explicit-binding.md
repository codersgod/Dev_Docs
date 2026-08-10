---
title: "Explicit Binding"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-explicit-binding"
description: "call(), apply(), and bind() invocation patterns."
---

# Explicit Binding

## What is it?

Three methods on `Function.prototype` that let you **manually set what `this` refers to** when calling a function.

| Method | Calls immediately? | Args format |
|---|---|---|
| `call(ctx, a, b)` | Yes | Spread args |
| `apply(ctx, [a, b])` | Yes | Array of args |
| `bind(ctx, a, b)` | No — returns new fn | Spread args |

## How to use it

```js
function introduce(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: 'Alice' };

introduce.call(person, 'Hello', '!');   // "Hello, I'm Alice!"
introduce.apply(person, ['Hi', '.']);   // "Hi, I'm Alice."
const fn = introduce.bind(person, 'Hey'); // returns new function
fn('?'); // "Hey, I'm Alice?"
```

## Real-world uses

```js
// Borrowing array methods for array-like objects
const nodeList = document.querySelectorAll('div');
const arr = Array.prototype.slice.call(nodeList);

// Partial application with bind
function multiply(a, b) { return a * b; }
const double = multiply.bind(null, 2); // pre-fills a = 2
double(5); // 10

// Math.max on an array
const nums = [1, 9, 3, 7];
Math.max.apply(null, nums); // 9
// Modern equivalent:
Math.max(...nums); // 9
```

> ⚠️ **Warning:** `bind` creates a new function every time it's called. In React, avoid calling `bind` inside `render` — do it in the constructor or use arrow functions instead.
