---
title: "Custom Polyfills"
category: "javascript"
chapterId: "js-polyfills-machine-coding"
slug: "js-polyfills"
description: "Promise.all, Array.flat, Function.bind, deep clone from scratch."
---

# Custom Polyfills

## What is it?

A polyfill re-implements a native method from scratch — used in interviews to prove you understand internals, not just the API surface.

## Promise.all

```js
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let settled = 0;
    if (promises.length === 0) return resolve([]);

    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (++settled === promises.length) resolve(results);
      }).catch(reject);
    });
  });
};
```

## Function.prototype.bind

```js
Function.prototype.myBind = function(ctx, ...outerArgs) {
  const fn = this;
  return function(...innerArgs) {
    return fn.apply(ctx, [...outerArgs, ...innerArgs]);
  };
};
```

## Array.prototype.flat

```js
Array.prototype.myFlat = function(depth = 1) {
  return depth > 0
    ? this.reduce((acc, val) =>
        acc.concat(Array.isArray(val) ? val.myFlat(depth - 1) : val), [])
    : this.slice();
};
```

## Array.prototype.reduce

```js
Array.prototype.myReduce = function(fn, initialValue) {
  let acc = initialValue !== undefined ? initialValue : this[0];
  const start = initialValue !== undefined ? 0 : 1;
  for (let i = start; i < this.length; i++) {
    acc = fn(acc, this[i], i, this);
  }
  return acc;
};
```

## Deep Clone

```js
function deepClone(val, seen = new WeakMap()) {
  if (val === null || typeof val !== 'object') return val;
  if (seen.has(val)) return seen.get(val); // handle circular refs
  const clone = Array.isArray(val) ? [] : {};
  seen.set(val, clone);
  for (const key of Object.keys(val)) {
    clone[key] = deepClone(val[key], seen);
  }
  return clone;
}
```

## EventEmitter class

```js
class EventEmitter {
  constructor() { this._events = {}; }

  on(event, listener) {
    (this._events[event] ??= []).push(listener);
    return this;
  }

  off(event, listener) {
    this._events[event] = (this._events[event] || []).filter(l => l !== listener);
    return this;
  }

  emit(event, ...args) {
    (this._events[event] || []).forEach(l => l(...args));
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => { listener(...args); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }
}
```

> ⚠️ **Warning:** In interviews, always handle edge cases — empty arrays, undefined initial values, and circular references score extra points.
