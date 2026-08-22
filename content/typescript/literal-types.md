---
title: "Literal Types"
category: "typescript"
chapterId: "ts-basics"
slug: "literal-types"
description: "Restricting values to exact strings, numbers, or booleans."
playgroundTemplate: "typescript-concept"
---
## Literal Types

Literal Types **allow you to lock a variable down to an `exact, specific value` rather than a broad category like `string` or `number`.**

> Instead of allowing any text, you tell the compiler that a variable **can only accept precise values**.

### 1. Concrete String Literals
**You can restrict a variable to specific hardcoded strings**, paired with the pipe symbol (`|`), which acts as an **"OR"** operator to create a custom choice list.

```typescript
let currentStatus: "loading" | "success" | "error";

currentStatus = "success"; // ✅ Allowed
// currentStatus = "failed";  // ❌ ERROR: Type '"failed"' is not assignable to type '"loading" | "success" | "error"'.
```

### 2. Numeric & Boolean Literals
Literal types apply to numbers and true/false conditions just like strings. This is highly useful for specific system values, configurations, or response codes.

```typescript
// Numeric literals for game choices
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6;
diceRoll = 4; // ✅ Allowed
// diceRoll = 7; // ❌ ERROR: Type '7' is not assignable to type '1 | 2 | 3 | 4 | 5 | 6'.

// Boolean literals forcing an absolute value
let strictTrue: true;
strictTrue = true; // ✅ Allowed
// strictTrue = false; // ❌ ERROR: Type 'false' is not assignable to type 'true'.
```

### 3. Combining with Type Aliases
To avoid re-typing literal lists across your codebase, you can save them with a custom nickname using a **Type Alias**.

```typescript
type AllowedMethods = "GET" | "POST" | "DELETE";

function sendRequest(url: string, method: AllowedMethods) {
  // Logic here...
}

sendRequest("/api/users", "GET");  // ✅ Allowed
// sendRequest("/api/users", "PUT");  // ❌ ERROR: Argument of type '"PUT"' is not assignable to parameter of type 'AllowedMethods'.
```

---

### Key Summary Rule for Notes
Literal types turn standard types into strict value constraints. They transform an infinite data type (like all numbers) into a small, predictable finite set of choices that TypeScript checks at compile time.
