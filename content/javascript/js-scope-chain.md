---
title: "Scope Chain"
category: "javascript"
chapterId: "js-scope-closures"
slug: "js-scope-chain"
description: "Global, function, and block scopes with lexical scoping."
---

# Scope Chain

## What is it?

**Scope** determines where a variable is accessible. **Lexical scoping** means scope is determined by where the code is written, not where it runs. When JS can't find a variable, it walks up the scope chain to parent scopes.

## Three scope types

```js
// Global scope — accessible everywhere
const SITE_NAME = 'FED Notes';

function outer() {
  // Function scope — accessible inside outer and nested functions
  const x = 10;

  if (true) {
    // Block scope — accessible only inside this {}
    let y = 20;
    const z = 30;
    console.log(x); // 10 — walks up to function scope
    console.log(SITE_NAME); // walks up to global scope
  }

  console.log(y); // ReferenceError — y is block-scoped
}
```

## Scope chain lookup

```js
const a = 'global';

function outer() {
  const b = 'outer';

  function inner() {
    const c = 'inner';
    console.log(a); // found in global scope
    console.log(b); // found in outer scope
    console.log(c); // found in inner scope
  }
  inner();
}
```

JS walks: inner → outer → global → ReferenceError.

> ⚠️ **Warning:** Global variables pollute the global scope and can be accidentally overwritten. Always use `const`/`let` inside functions or modules.
