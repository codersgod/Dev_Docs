---
title: "Proxy & Reflect"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-proxy-reflect"
description: "Intercepting and redefining object behaviors with meta-programming."
---

# Proxy & Reflect

## What is it?

**Proxy** wraps an object and intercepts fundamental operations (get, set, delete, call). **Reflect** provides default implementations of those same operations — used inside proxy handlers to preserve normal behavior.

## Basic Proxy

```js
const handler = {
  get(target, key) {
    console.log(`Getting ${key}`);
    return Reflect.get(target, key); // default get
  },
  set(target, key, value) {
    if (typeof value !== 'number') throw new TypeError('Only numbers allowed');
    return Reflect.set(target, key, value);
  }
};

const obj = new Proxy({}, handler);
obj.score = 42;   // sets fine
obj.score = 'hi'; // TypeError
console.log(obj.score); // logs 'Getting score', returns 42
```

## Validation proxy

```js
function createValidated(schema) {
  return new Proxy({}, {
    set(target, key, value) {
      if (schema[key] && typeof value !== schema[key]) {
        throw new TypeError(`${key} must be ${schema[key]}`);
      }
      return Reflect.set(target, key, value);
    }
  });
}

const user = createValidated({ name: 'string', age: 'number' });
user.name = 'Alice'; // ok
user.age = 'old';    // TypeError: age must be number
```

## Proxy traps

| Trap | Triggered by |
|---|---|
| `get` | `obj.prop`, `obj[key]` |
| `set` | `obj.prop = val` |
| `has` | `'key' in obj` |
| `deleteProperty` | `delete obj.prop` |
| `apply` | `fn()` — proxy on functions |
| `construct` | `new Fn()` |

> ⚠️ **Warning:** Proxies have a performance cost on every access. Don't wrap hot-path objects in a proxy without benchmarking first.
