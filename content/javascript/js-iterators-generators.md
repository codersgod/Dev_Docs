---
title: "Iterators & Generators"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-iterators-generators"
description: "Symbol.iterator, custom iterables, and function* with yield."
---

# Iterators & Generators

## What is an Iterator?

An object with a `next()` method that returns `{ value, done }`. Arrays, Strings, Maps, Sets are all iterable — they implement `Symbol.iterator`.

```js
const arr = [1, 2, 3];
const iter = arr[Symbol.iterator]();

iter.next(); // { value: 1, done: false }
iter.next(); // { value: 2, done: false }
iter.next(); // { value: 3, done: false }
iter.next(); // { value: undefined, done: true }
```

## Custom iterable

```js
const range = {
  from: 1, to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) console.log(n); // 1 2 3 4 5
```

## Generator functions

A `function*` that can pause at `yield` and resume later. Lazy evaluation — values produced on demand.

```js
function* count(start, end) {
  for (let i = start; i <= end; i++) {
    yield i; // pauses here, returns i
  }
}

const gen = count(1, 3);
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }

// Spread works too
[...count(1, 5)]; // [1, 2, 3, 4, 5]
```

## Infinite sequence (memory-efficient)

```js
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
fib.next().value; // 0
fib.next().value; // 1
fib.next().value; // 1
fib.next().value; // 2
// Never loads the whole sequence into memory
```

> ⚠️ **Warning:** Generators maintain state between calls — they are not pure. Avoid sharing a generator instance across multiple consumers.
