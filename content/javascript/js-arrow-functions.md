---
title: "Arrow Functions"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-arrow-functions"
description: "Syntax constraints, no this/arguments/super binding."
---

# Arrow Functions

## What is it?

Arrow functions (`=>`) are a shorter syntax for functions. They have no own `this`, `arguments`, `super`, or `new.target`. This makes them ideal as callbacks but unsuitable as methods or constructors.

## Syntax

```js
// Traditional
function add(a, b) { return a + b; }

// Arrow — explicit return with body
const add = (a, b) => { return a + b; };

// Arrow — implicit return (no curly braces)
const add = (a, b) => a + b;

// Single param — no parens needed
const double = n => n * 2;

// No params
const greet = () => 'Hello!';

// Returning an object literal — wrap in parens
const makeUser = (name) => ({ name, role: 'user' });
```

## What arrow functions cannot do

```js
// ❌ Cannot use as a constructor
const Person = (name) => { this.name = name; };
new Person('Alice'); // TypeError: Person is not a constructor

// ❌ No arguments object
const fn = () => { console.log(arguments); }; // ReferenceError

// ✅ Use rest params instead
const fn = (...args) => { console.log(args); };

// ❌ Cannot be used as object methods (this is wrong)
const obj = {
  name: 'Alice',
  greet: () => console.log(this.name), // undefined — this = outer scope
};

// ✅ Use regular method syntax
const obj = {
  name: 'Alice',
  greet() { console.log(this.name); }, // 'Alice'
};
```

> ⚠️ **Warning:** Never use arrow functions as object methods or event listener callbacks where you need `this` to refer to the object/element.
