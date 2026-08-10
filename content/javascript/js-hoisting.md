---
title: "Hoisting"
category: "javascript"
chapterId: "js-scope-closures"
slug: "js-hoisting"
description: "Variable and function declaration elevation at compile phase."
---

# Hoisting

## What is it?

Before JS executes your code it does a compile pass and **moves declarations to the top of their scope**. Only the declaration is hoisted — not the initialization.

## How to use it

```js
// Function declarations — fully hoisted
sayHi(); // 'Hi!' — works before the declaration
function sayHi() { console.log('Hi!'); }

// var — declaration hoisted, value is undefined
console.log(x); // undefined
var x = 5;
console.log(x); // 5

// let/const — declaration hoisted but NOT usable (TDZ)
console.log(y); // ReferenceError
let y = 5;

// Function expressions — NOT hoisted
greet(); // TypeError: greet is not a function
var greet = function() { console.log('Hello'); };
```

## Function declarations vs expressions

```js
// Declaration — hoisted completely
function add(a, b) { return a + b; }

// Expression — only var is hoisted
const multiply = (a, b) => a * b; // not hoisted
```

> ⚠️ **Warning:** Relying on hoisting makes code unpredictable. Declare variables and functions before using them.
