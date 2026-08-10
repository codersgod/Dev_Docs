---
title: "Array Methods — map, filter, reduce and more"
category: "javascript"
chapterId: "js-arrays"
slug: "array-methods"
description: "Master the essential higher-order array methods for transforming data."
---

# Array Methods

JavaScript's built-in array methods let you transform, filter, and aggregate data without mutating the original array. They are the **backbone of modern functional JavaScript**.

## 1. Definition

Higher-order array methods accept a **callback function** and apply it to each element. They return new arrays or values — they never modify the original (immutability).

## 2. map — Transform Each Element

Creates a **new array** by applying a function to every element:

```javascript
const prices = [10, 20, 30];

// Add 10% tax to each price
const withTax = prices.map(price => price * 1.1);
// [11, 22, 33]

// Transform an array of objects
const users = [{ name: 'Alice', age: 28 }, { name: 'Bob', age: 22 }];
const names = users.map(user => user.name);
// ['Alice', 'Bob']
```

## 3. filter — Keep Matching Elements

Creates a new array with only elements where the callback returns `true`:

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6]

const adults = users.filter(user => user.age >= 18);
```

## 4. reduce — Accumulate to a Single Value

The most powerful method. Reduces an array to **any single value** — a number, string, or even a new object:

```javascript
const cart = [
  { item: 'Book', price: 12 },
  { item: 'Pen', price: 3 },
  { item: 'Notebook', price: 8 },
];

const total = cart.reduce((accumulator, current) => accumulator + current.price, 0);
// 23

// Group items by first letter
const grouped = ['apple', 'avocado', 'banana', 'blueberry'].reduce((acc, fruit) => {
  const key = fruit[0];
  acc[key] = acc[key] ? [...acc[key], fruit] : [fruit];
  return acc;
}, {});
// { a: ['apple', 'avocado'], b: ['banana', 'blueberry'] }
```

## 5. find & findIndex

```javascript
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

const alice = users.find(u => u.id === 1);        // { id: 1, name: 'Alice' }
const aliceIdx = users.findIndex(u => u.id === 1); // 0
```

## 6. some & every

```javascript
const scores = [75, 82, 61, 90, 55];

const anyPassed = scores.some(s => s >= 60);   // true
const allPassed = scores.every(s => s >= 60);  // false
```

## 7. Chaining Methods

The real power is in **chaining** — each method returns a new array, so you can compose them:

```javascript
const topEarnerNames = employees
  .filter(e => e.salary > 80000)
  .sort((a, b) => b.salary - a.salary)
  .slice(0, 3)
  .map(e => e.name);
```

## 8. Common Pitfalls

> ⚠️ **`map` always returns an array of the same length.** To filter AND transform, chain `.filter().map()` or use `.reduce()`.

> ⚠️ **Don't forget the initial value in `.reduce()`** when the array could be empty, or it will throw a TypeError.

> ⚠️ **`find` returns `undefined`** if no match is found — always check before accessing properties on the result.
