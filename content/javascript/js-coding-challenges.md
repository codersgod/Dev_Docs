---
title: "JS coding challenges"
category: "javascript"
chapterId: "js-interview-prep"
slug: "js-coding-challenges"
description: "Typical coding problems and strategies for solving them efficiently."
---

<details><summary><b>How will u merge const obj1 = { a: 1, b: { x: 10, y: 20 } };
const obj2 = { b: { y: 30, z: 40 }, c: 3 };</b></summary>

### Shallow Merge
```js
const obj1 = { a: 1, b: { x: 10, y: 20 } };
const obj2 = { b: { y: 30, z: 40 }, c: 3 };
const mergedShallow = { ...obj1, ...obj2 };
// Result: { a: 1, b: { y: 30, z: 40 }, c: 3 }
``` 

### Deep Merge
```js
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

const obj1 = { a: 1, b: { x: 10, y: 20 } };
const obj2 = { b: { y: 30, z: 40 }, c: 3 };

const mergedObj = deepMerge(obj1, obj2);

console.log(mergedObj);
// Output: { a: 1, b: { x: 10, y: 30, z: 40 }, c: 3 }
```

