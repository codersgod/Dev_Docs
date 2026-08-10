---
title: "Arrays Fundamentals"
category: "javascript"
chapterId: "js-objects-arrays"
slug: "js-arrays"
description: "Array creation, indexing, mutation, iteration, transformation, searching, and modern non-mutating methods."
---

# Arrays Fundamentals

## What is it?

An array is a global object used to store **ordered lists of data** — multiple values under a single variable name, indexable by integers starting at zero.

**Key traits:**
- **Zero-indexed** — first item is at `[0]`
- **Dynamic size** — grows or shrinks automatically
- **Mixed types** — holds strings, numbers, objects together
- `typeof []` returns `"object"` — arrays are objects under the hood

---

## 1. Creation Methods
*Four ways to create arrays — literal, constructor, `Array.from()`, and `Array.of()` — each with different edge cases.*

```js
// ✅ Array Literal (Recommended) — explicit, no surprises
const fruits = ['apple', 'banana', 'cherry'];
const empty = [];

// Array() Constructor
// ⚠️ Single number = sparse array (empty slots), NOT an array with that value
new Array(3);        // [ <3 empty slots> ] ← NOT [3]
new Array(1, 2, 3);  // [1, 2, 3] — multiple args = elements ✅

// Array.of() — always treats every argument as an element (no sparse trap)
Array.of(3);         // [3]       ← actual value, not empty slots
Array.of(1, 2, 3);   // [1, 2, 3]

// Array.from() — creates from any iterable or array-like object
// Accepts optional mapping function as second argument
Array.from('hello');                           // ['h','e','l','l','o']
Array.from({ length: 3 }, (_, i) => i * 2);   // [0, 2, 4]
Array.from(document.querySelectorAll('li'));   // NodeList → real Array

// Pre-populating with fill()
new Array(5).fill(0);    // [0, 0, 0, 0, 0]
new Array(3).fill(null); // [null, null, null]
```

---

## 2. Indexing & Length
*Access elements by position, modify in-place, and control size via the `.length` property.*

```js
const arr = ['a', 'b', 'c'];

// Accessing elements
arr[0];              // 'a' — first element
arr[arr.length - 1]; // 'c' — dynamic last-item access

// Modifying elements
arr[1] = 'B';  // overwrite: ['a', 'B', 'c']
arr[5] = 'f';  // beyond end → creates sparse: ['a','B','c',<2 empty>,'f']
```

**.length tricks:**

```js
arr.length;       // read: number of elements
arr.length = 2;   // truncate → ['a', 'B']
arr.length = 5;   // expand  → ['a', 'B', <3 empty slots>]
arr.length = 0;   // clear   → [] (fastest way to empty)
```

---

## 3. Type Checking
*`typeof []` returns `"object"` — always use `Array.isArray()` to reliably detect arrays.*

```js
// ❌ Problem — typeof cannot distinguish arrays from objects
typeof [];   // 'object'
typeof {};   // 'object' — indistinguishable!

// ✅ Solution — Array.isArray()
Array.isArray([1, 2, 3]); // true
Array.isArray({});         // false

// Alternative — instanceof (fails across iframes)
[] instanceof Array; // true

// Q: Is a String an Array? No — convert it first:
Array.from('hello'); // ['h','e','l','l','o']
'hello'.split('');   // ['h','e','l','l','o']
```

---

## 4. Basic Mutation Methods
*These permanently change the original array in memory — push/pop, shift/unshift, splice, fill, reverse, and sort.*

### Push & Pop — at the end

```js
const arr = [1, 2, 3];
arr.push(4, 5); // adds to end → returns new length (5). arr = [1,2,3,4,5]
arr.pop();      // removes last → returns removed element (5). Takes no args. arr = [1,2,3,4]
```

### Shift & Unshift — at the beginning

```js
arr.unshift(0); // adds to front → returns new length. arr = [0,1,2,3,4]
arr.shift();    // removes first → returns removed element. Takes no args. arr = [1,2,3,4]
```

> **Note:** `shift`/`unshift` are slower than `push`/`pop` — every remaining element must shift its index.

### Splice — insert, remove, or replace at any index

```js
// splice(startIndex, deleteCount, ...itemsToInsert)
const arr = ['a', 'b', 'c', 'd'];

arr.splice(1, 2);           // remove 2 from index 1 → returns ['b','c'], arr = ['a','d']
arr.splice(1, 0, 'x', 'y'); // insert at index 1 → arr = ['a','x','y','d']
arr.splice(2, 1, 'Z');      // replace 1 at index 2 → arr = ['a','x','Z','d']

// Negative start index counts backward from the end
arr.splice(-1, 1); // removes last element
```

### Fill — overwrite a range with a static value

```js
// fill(value, startIndex, endIndexExclusive)
[1,2,3,4,5].fill(0, 1, 4);  // [1, 0, 0, 0, 5]
new Array(3).fill(7);         // [7, 7, 7]
```

> ⚠️ **Object reference trap:** `new Array(3).fill({})` puts the **same object** in every slot — modifying one modifies all. Use `Array.from` for unique instances:
```js
new Array(3).fill({});                      // ❌ same reference everywhere
Array.from({ length: 3 }, () => ({}));      // ✅ unique object per slot
```

### Reverse & Sort

```js
[1, 2, 3].reverse(); // [3, 2, 1] — mutates original

// ⚠️ sort() converts to strings by default — breaks numbers!
[10, 9, 2].sort();                  // [10, 2, 9] ← WRONG
[10, 9, 2].sort((a, b) => a - b);  // [2, 9, 10] ← ascending  ✅
[10, 9, 2].sort((a, b) => b - a);  // [10, 9, 2] ← descending ✅
```

**3 sort issues and fixes:**

**Fix 1 — Mutation:** Both `reverse()` and `sort()` mutate the original.  
→ Use `toReversed()` / `toSorted()` for non-mutating copies.

**Fix 2 — Case sensitivity:** Default sort uses ASCII values — uppercase ('A' = 65) sorts before lowercase ('a' = 97).
```js
['banana','Apple','cherry'].sort();                          // ['Apple','banana','cherry'] ← wrong feel
['banana','Apple','cherry'].sort((a, b) => a.localeCompare(b)); // ✅ case-insensitive
```

**Fix 3 — Undefined/empty slots:** `undefined` and holes always move to the end — the compare function is skipped entirely for them.

---

## 5. Search Methods (Non-Mutating)
*Look up elements without touching the array — returns an index, boolean, or element depending on the method.*

### indexOf & lastIndexOf — strict equality `===`

```js
const arr = [1, 2, 3, 2, 1];
arr.indexOf(2);      // 1  — first match, left to right
arr.lastIndexOf(2);  // 3  — last match, right to left
arr.indexOf(99);     // -1 — not found

// ⚠️ Cannot find NaN
[NaN].indexOf(NaN);  // -1 — fails
```

### includes — simple boolean, handles NaN correctly

```js
[1, 2, 3].includes(2); // true
[NaN].includes(NaN);   // true ✅ — unlike indexOf
```

### find & findIndex — first match by condition

`find()` returns the **element**, `findIndex()` returns the **index**. Both return `undefined`/`-1` when not found.

```js
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

users.find(u => u.id === 2);       // { id: 2, name: 'Bob' }
users.findIndex(u => u.id === 2);  // 1
users.find(u => u.id === 99);      // undefined
users.findIndex(u => u.id === 99); // -1
```

### findLast & findLastIndex — last match, scans right to left

Exactly like `find`/`findIndex` but **scans backward** — more efficient than reversing first.

```js
[5, 12, 8, 130, 44].findLast(n => n > 10);      // 44
[5, 12, 8, 130, 44].findLastIndex(n => n > 10); // 4
```

---

## 6. Iteration & Looping
*Step through every element — from classic `for` loops to functional `forEach` and built-in iterators.*

```js
const arr = ['a', 'b', 'c'];

// Traditional for — use when you need index control or early exit
for (let i = 0; i < arr.length; i++) console.log(arr[i]);

// for...of (Recommended) — reads values directly, supports break/continue
for (const item of arr) console.log(item);

// ❌ for...in — AVOID on arrays
// Treats indices as strings ("0","1"), also picks up prototype properties
for (const key in arr) console.log(key); // '0','1','2' — strings, not numbers
```

### forEach — the functional loop

```js
arr.forEach((item, index, array) => {
  console.log(index, item);
});
```

**3 important quirks:**
- **Skips holes** — empty slots in sparse arrays are completely ignored
- **`return` ≠ `break`** — `return` only exits that iteration (like `continue`), it does NOT stop the loop
- **Always returns `undefined`** — cannot chain off `forEach`

### Built-in iterators — for use with `for...of`

```js
for (const i of arr.keys())         console.log(i);    // 0, 1, 2  — indices only
for (const v of arr.values())       console.log(v);    // 'a','b','c' — values only
for (const [i, v] of arr.entries()) console.log(i, v); // 0 'a', 1 'b', 2 'c'
```

---

## 7. Functional Transformation (Non-Mutating)
*The data-processing pipeline — map, filter, reduce, flat — each returns a new array, original untouched.*

### map — transform every element, same length output

Callback receives `(value, index, array)`.

```js
[1, 2, 3].map(n => n * 2);             // [2, 4, 6]
[1, 2, 3].map((v, i) => `${i}:${v}`); // ['0:1','1:2','2:3']
```

> ⚠️ **Object reference trap:** `map()` creates a new outer array but copies object references inside. Mutating a property in the callback mutates the original.
```js
users.map(u => { u.name = 'Bob'; return u; }); // ❌ mutates original
users.map(u => ({ ...u, name: 'Bob' }));        // ✅ new object per item
```

### filter — keep only elements that pass the test

```js
[1, 2, 3, 4, 5].filter(n => n % 2 === 0);       // [2, 4]
[0, '', null, 1, 'hi'].filter(Boolean);          // [1, 'hi']
```

> **Note:** Like `map`, `filter` creates a new outer array but still copies object references inside.

### reduce — collapse into a single value

```js
// reduce((accumulator, currentValue, currentIndex?, array?) => ..., initialValue)
[1, 2, 3, 4].reduce((acc, n) => acc + n, 0); // 10

['a','b','c'].reduce((acc, v, i) => { acc[v] = i; return acc; }, {});
// { a: 0, b: 1, c: 2 }
```

> ⚠️ **Always supply an initial value** when the array could be empty — `[].reduce(fn)` throws TypeError.  
> Without initial value: accumulator = index 0, loop starts at index 1.

### reduceRight — same as reduce but right to left

```js
[[1,2],[3,4],[5,6]].reduceRight((acc, arr) => acc.concat(arr), []);
// [5, 6, 3, 4, 1, 2]
```

### flat & flatMap — de-nest sub-arrays

```js
[1, [2, [3, [4]]]].flat();           // [1, 2, [3,[4]]] — depth 1 (default)
[1, [2, [3, [4]]]].flat(Infinity);   // [1, 2, 3, 4]    — all levels

// flatMap = map() + flat(1) in one efficient pass
['hello world', 'foo bar'].flatMap(s => s.split(' '));
// ['hello', 'world', 'foo', 'bar']
```

---

## 8. Combining & Slicing (Non-Mutating)
*Merge, extract, and convert arrays to strings without touching any source arrays.*

### concat — combine arrays or values

```js
[1, 2].concat([3, 4], [5, 6]); // [1,2,3,4,5,6]
[1, 2].concat([3, [4, 5]]);    // [1,2,3,[4,5]] — only 1 level flat

// Modern tip: spread operator is cleaner
[...onlineUsers, ...offlineUsers];
```

### slice — extract a section

```js
// slice(start, end) — start inclusive, end exclusive
const arr = ['a','b','c','d','e'];
arr.slice(1, 3);  // ['b','c']
arr.slice(-2);    // ['d','e'] — negative counts from end
arr.slice();      // shallow copy of entire array
```

### join — array to string

```js
['a','b','c'].join('-');  // 'a-b-c'
['a','b','c'].join('');   // 'abc'
['a','b','c'].join();     // 'a,b,c' — default comma

// null, undefined, and empty slots → converted to empty string ""
[1, null, undefined, 2].join('-'); // '1--2'
```

### slice vs splice

| | `slice(start, end)` | `splice(start, deleteCount, ...)` |
|---|---|---|
| Mutates original | ❌ No | ✅ Yes |
| Returns | New extracted array | Array of deleted elements |
| Original array | Untouched | Permanently changed |
| Use for | Safe copy/extract | Insert, remove, replace in-place |

---

## 9. Modern Non-Mutating Alternatives (ES2023)
*ES2023 immutable counterparts to `reverse`, `sort`, `splice`, and index assignment — same result, original always preserved.*

```js
const arr = [3, 1, 2];

arr.toReversed();               // [2, 1, 3] — original unchanged
arr.toSorted((a, b) => a - b); // [1, 2, 3] — original unchanged
arr.toSpliced(1, 1, 9);        // [3, 9, 2] — original unchanged
arr.with(0, 99);               // [99, 1, 2] — replace single index, original unchanged

console.log(arr); // [3, 1, 2] — always untouched
```

| Mutating | Non-Mutating | What it does |
|---|---|---|
| `reverse()` | `toReversed()` | Flip order |
| `sort()` | `toSorted()` | Sort elements |
| `splice()` | `toSpliced()` | Insert/remove |
| `arr[i] = x` | `with(i, x)` | Replace one element |

---

## 10. Destructuring
*Unpack array values into named variables — supports skipping, defaults, and rest capture.*

```js
const [a, b, c] = [1, 2, 3];

// Skipping elements — leave blank between commas
const [first, , third] = [1, 2, 3]; // first=1, third=3

// Default values — used when index is undefined or empty
const [x = 0, y = 0] = [10]; // x=10, y=0

// Rest — captures remaining into a new array. Must be last.
const [head, ...tail] = [1, 2, 3, 4]; // head=1, tail=[2,3,4]

// Swap variables without a temp variable
let m = 1, n = 2;
[m, n] = [n, m]; // m=2, n=1
```

---

## 11. Sparse Arrays
*Arrays with intentional gaps — holes behave differently from `undefined` and can silently break certain methods.*

A sparse array has **holes** — indices that literally don't exist in memory (not even set to `undefined`).

```js
const sparse = [1, , , 4]; // indices 1 and 2 are holes
sparse.length; // 4
sparse[1];     // undefined — but the property key doesn't exist
1 in sparse;   // false — the slot is truly absent
```

**Method behavior on holes:**

| Behavior | Methods |
|---|---|
| **Skips holes** | `forEach`, `map`, `filter`, `indexOf` |
| **Treats as `undefined`** | `includes`, `find`, `findIndex`, `[...spread]`, `toSorted`, `toReversed` |

---

## 12. Multi-dimensional Arrays
*JS uses arrays-of-arrays for grids — be careful with `fill([])` which puts the same reference in every row.*

```js
const matrix = [[1,2,3],[4,5,6],[7,8,9]];
matrix[1][2]; // 6 — row 1, column 2

// ❌ Reference bug — all rows point to the SAME array
const bad = new Array(3).fill([]);
bad[0].push(1);
console.log(bad); // [[1],[1],[1]] — all rows changed!

// ✅ Safe — unique array per row
const good = Array.from({ length: 3 }, () => []);
good[0].push(1);
console.log(good); // [[1],[],[]]
```

> ⚠️ **Warning:** `sort()` without a compare function converts numbers to strings — `[10, 9, 2].sort()` gives `[10, 2, 9]`. Always pass `(a, b) => a - b` for numeric sort.