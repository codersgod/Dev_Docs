---
title: "Variable Declarations"
category: "javascript"
chapterId: "js-core-fundamentals"
slug: "js-variable-declarations"
description: "var, let, const — scope, hoisting, and redeclaration rules."
---

# Variable Declarations

## What is it?

Three keywords to declare variables, each with different scoping and hoisting rules.

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisted | Yes (as `undefined`) | Yes (TDZ — unusable) | Yes (TDZ — unusable) |
| Re-declarable | Yes | No | No |
| Re-assignable | Yes | Yes | No |

## How to use it

```js
// var — function-scoped, leaks out of blocks
if (true) {
  var x = 10;
}
console.log(x); // 10 — accessible outside the block!

// let — block-scoped
if (true) {
  let y = 10;
}
console.log(y); // ReferenceError

// const — block-scoped, must be initialized
const PI = 3.14;
PI = 3; // TypeError — cannot reassign

// const with objects — the reference is fixed, not the contents
const user = { name: 'Alice' };
user.name = 'Bob'; // ✅ allowed — object contents can change
user = {};         // ❌ TypeError — cannot reassign the reference
```

## Hoisting behavior

```js
console.log(a); // undefined — var is hoisted as undefined
var a = 5;

console.log(b); // ReferenceError — let is in TDZ
let b = 5;
```

> ⚠️ **Warning:** Avoid `var` in modern code. Use `const` by default, `let` when you need to reassign.
