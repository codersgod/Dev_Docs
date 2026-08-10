---
title: "This Keyword"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-this-keyword"
description: "Dynamic binding in methods, arrow functions, and global scope."
---

# This Keyword

## What is it?

`this` refers to the **object that is currently executing the function**. It is determined at call time, not definition time (except for arrow functions).

## The 4 binding rules

```js
// 1. Default binding — global object (or undefined in strict mode)
function greet() { console.log(this); }
greet(); // window (browser) | undefined (strict mode)

// 2. Implicit binding — the object before the dot
const user = {
  name: 'Alice',
  greet() { console.log(this.name); },
};
user.greet(); // 'Alice' — this = user

// 3. Explicit binding — call / apply / bind
function greet() { console.log(this.name); }
greet.call({ name: 'Bob' });  // 'Bob'
greet.apply({ name: 'Bob' }); // 'Bob'
const bound = greet.bind({ name: 'Carol' });
bound(); // 'Carol'

// 4. new binding — fresh object created
function Person(name) { this.name = name; }
const p = new Person('Dave');
p.name; // 'Dave'
```

## Arrow functions — no own this

Arrow functions inherit `this` from the surrounding lexical scope. They never have their own.

```js
const obj = {
  name: 'Alice',
  greetLater() {
    setTimeout(() => {
      console.log(this.name); // 'Alice' — arrow inherits from greetLater
    }, 100);
  },
  greetBroken() {
    setTimeout(function() {
      console.log(this.name); // undefined — regular function, this = window
    }, 100);
  },
};
```

> ⚠️ **Warning:** Extracting a method from an object loses its `this` binding: `const fn = obj.method; fn();` — `this` is no longer `obj`. Use `bind` or an arrow wrapper.
