---
title: "Tuples"
category: "typescript"
chapterId: "ts-complex-structures"
slug: "tuples"
description: "Working with fixed-length arrays containing strict ordered data types."
playgroundTemplate: "typescript-concept"
---
## Tuples

A Tuple is a **specialized array with a `fixed length` where every single `position` has a strict, pre-defined data type.**

While a standard array holds an unlimited list of the same type, a tuple acts like a rigid row of boxes where position `[0]` might be text and position `[1]` must be a number.

### 1. Basic Tuple Syntax
You declare a tuple by passing the exact types inside square brackets, separated by commas.

```typescript
// Position 0 MUST be a number, Position 1 MUST be a string
let userSession: [number, string];

userSession = [101, "admin"]; // ✅ Allowed
// userSession = ["admin", 101]; // ❌ ERROR: Type 'string' is not assignable to type 'number'.
// userSession = [101, "admin", true]; // ❌ ERROR: Source has 3 element(s) but target allows only 2.
```

### 2. Optional Elements inside Tuples
You can make specific trailing positions optional by appending a question mark (`?`) to the type label.

```typescript
// The third coordinate value is optional
let graphicPoint: [number, string, boolean?];

graphicPoint =[2 , "name"];      // ✅ Allowed (2 elements)
graphicPoint =[2, "name", false];  // ✅ Allowed (3 elements)
graphicPoint =[2]; // ❌ ERROR: Source has 1 element(s) but target requires only 2 or 3.
graphicPoint =[2, "name", false, 42]; // ❌ ERROR: Source has 4 element(s) but target allows only 3.
```

### 3. Named Tuple Elements (Clean Documentation)
For better teamwork readability, you can provide descriptive labels to the elements inside the tuple definition. These labels appear directly inside code-editor auto-complete tooltips.

```typescript
// Named fields explain exactly what the values represent
type ResponseLog = [statusCode: number, statusMessage: string];

const loginSuccess: ResponseLog = [200, "OK"];
```

---

### ⚠️ The Dangerous Array Method Loophole
By default, plain JavaScript array operations like `.push()` or `.pop()` can bypass TypeScript's tuple size checks at runtime.

```typescript
let strictPair: [number, string] = [1, "one"];

strictPair.push(true); // ❌ TypeScript will catch mixed type additions
strictPair.push("two"); // ⚠️ CAUTION: TypeScript allows this push, but it breaks the fixed-length concept!
```
*To completely block this loophole and freeze your tuple from being altered, pair it with a `readonly` modifier: `let pair: readonly [number, string] = [1, "one"];`*

---

### Key Summary Rule for Notes
Use Tuples when you need to group related key-value data points that always follow a strict structure, such as latitude/longitude coordinates `[number, number]` or React State outputs `[value, setValue]`.

Would you like to move on to generating the `.md` file for **Enums** next, or look into the newly added **Readonly Arrays & Tuples**?
