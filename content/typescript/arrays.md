---
title: "Arrays"
category: "typescript"
chapterId: "ts-complex-structures"
slug: "arrays"
description: "Typing homogenous structural lists using syntax like number[] or Array<string>."
playgroundTemplate: "typescript-concept"
---
## Arrays

Arrays in TypeScript **allow you to define strict `type rules for lists of data`, ensuring all elements inside the list match the exact same category.**

Unlike plain JavaScript, which lets you mix any data inside a list, TypeScript keeps your collections predictable.

### 1. Square Bracket Syntax (`type[]`)
This is the most common, industry-standard way to type a simple list. You specify the data type followed immediately by square brackets.

```typescript
let prices: number[] =;
let tags: string[] = ["new", "sale"];

prices.push(45);     // ✅ Allowed
// prices.push("free"); // ❌ ERROR: Argument of type 'string' is not assignable to parameter of type 'number'.
```

### 2. Generic Array Syntax (`Array<type>`)
This achieves the exact same result using a different look called **Generics**. It is functionally identical to the square bracket syntax but is preferred by some style guides.

```typescript
let scores: Array<number> =;
let users: Array<string> = ["Alice", "Bob"];

scores.push(92); // ✅ Allowed
```
> **Note:**: The choice between `Array<type>` and `type[]` comes down to cosmetic ***readability and team code preferences***, but ***both enforce the same type safety rules***.

### 3. Mixed Collections (Union Arrays)
If a list genuinely requires multiple distinct data types, you can group them inside parentheses separated by a pipe symbol (`|`).

```typescript
let accountLog: (string | number)[] = ["Created", 101, "Updated", 102];

accountLog.push("Deleted"); // ✅ Allowed
accountLog.push(404);       // ✅ Allowed
// accountLog.push(true);   // ❌ ERROR: Argument of type 'boolean' is not assignable...
```

---

### Key Summary Rule for Notes
Arrays protect you from runtime errors caused by unexpected list values. They force every item added via methods like `.push()` or `.unshift()` to adhere strictly to the list's defined structure.
