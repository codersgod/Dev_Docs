---
title: "Operators & Coercion"
category: "javascript"
chapterId: "js-core-fundamentals"
slug: "js-operators-coercion"
description: "== vs ===, implicit/explicit casting, and truthy/falsy."
---

# Operators & Coercion

## What is it?

**Coercion** is JS automatically converting one type to another during an operation. It happens with `==`, arithmetic, and conditional checks.

## `==` vs `===`

`==` (loose equality) coerces types before comparing. `===` (strict equality) never coerces — both value and type must match.

```js
0 == false     // true  — false coerced to 0
0 === false    // false — different types

'' == false    // true
'' === false   // false

null == undefined  // true  — special case
null === undefined // false

1 == '1'   // true  — '1' coerced to 1
1 === '1'  // false
```

## Falsy values

These are the only 8 values that evaluate to false in a boolean context:

```js
false, 0, -0, 0n, '', null, undefined, NaN
```

Everything else is truthy — including `[]`, `{}`, and `'0'`.

## Explicit conversion

```js
Number('42')     // 42
Number('')       // 0
Number(null)     // 0
Number(undefined)// NaN
Number(true)     // 1

String(42)       // '42'
String(null)     // 'null'

Boolean(0)       // false
Boolean('hello') // true
Boolean([])      // true ← not false!
```

## Logical operators

```js
// || returns first truthy value (or last value)
'Alice' || 'default'  // 'Alice'
null || 'default'     // 'default'

// && returns first falsy value (or last value)
true && 'hello'  // 'hello'
null && 'hello'  // null

// ?? (nullish coalescing) — only falls back on null/undefined, not 0 or ''
0 ?? 'default'   // 0  ← treats 0 as valid!
null ?? 'default' // 'default'
```

> ⚠️ **Warning:** Use `??` instead of `||` when you want to allow `0` or empty string as valid values.
