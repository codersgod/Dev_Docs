---
title: "module.exports vs exports"
category: "nodejs"
chapterId: "node-modules-tooling"
slug: "node-module-exports"
description: "The difference between module.exports (the real thing) and exports (a shortcut reference)."
---

# module.exports vs exports

## What is module.exports?

`module.exports` is the **actual object** returned by `require()` when another file imports this module.
- **module.exports**: The actual object returned by `require()`.
- **exports**: A shorthand helper pointing to `module.exports`.

```js
// greeter.js
module.exports = {
  greet: (name) => `Hello, ${name}!`
};

// main.js
const greeter = require('./greeter');
console.log(greeter.greet('Alice')); // Hello, Alice!
```

## What is exports?

`exports` is a **shortcut reference** that initially points to the same object as `module.exports`.

```js
// Both of these start pointing at the same object:
// exports === module.exports  →  true  (at startup)
```

This lets you attach properties without repeating `module.exports`:

```js
// greeter.js — using the exports shortcut
exports.greet = (name) => `Hello, ${name}!`;
exports.bye   = (name) => `Goodbye, ${name}!`;
```

## The critical difference — reassignment breaks the link

If you **reassign** `exports`, you break the reference to `module.exports`. The new value will **not** be returned by `require()`.

```js
// ❌ BROKEN — reassigning exports detaches it from module.exports
exports = function() { return 'hello'; };
// require('./this') returns {} — empty object, not your function
```

```js
// ✅ CORRECT — reassign module.exports directly
module.exports = function() { return 'hello'; };
// require('./this') returns the function
```

## Named exports vs default export

```js
// Named exports — use exports shortcut
exports.add      = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// Default export (function, class, value) — must use module.exports
module.exports = class UserService { ... };
```

## Quick rule

| Goal | Use |
|---|---|
| Export multiple named things | `exports.name = value` |
| Export a single function/class | `module.exports = value` |
| Never do | `exports = value` (reassignment) |

## The Golden Rule

Use `exports.name = ...` to attach multiple properties or functions.
Use `module.exports = ...` to export a single entity (like a class, function, or object). 

```js
// exports: Named exports
exports.PI = 3.14159;
exports.TAX_RATE = 0.18;
exports.calculateTotal = (price) => price + (price * exports.TAX_RATE);
//==============================================================================
// module.exports: Default export
//class example
module.exports = class ShoppingCart {
  constructor() {
    this.items = [];
  }
  addItem(item) {
    this.items.push(item);
  }
};

//function example() { return 'This is a default export'; }
const crypto = require('node:crypto');
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
module.exports = hashPassword;

//object example
const config = {
  port: 3000,
  dbUrl: 'mongodb://localhost:27017/myapp',
  secretKey: 'supersecret'
};
module.exports = config;
```