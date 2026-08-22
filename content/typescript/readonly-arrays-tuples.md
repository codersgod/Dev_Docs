---
title: "Readonly Arrays & Tuples"
category: "typescript"
chapterId: "ts-complex-structures"
slug: "readonly-arrays-tuples"
description: "Using readonly array variations and const assertions to freeze collections against mutation."
playgroundTemplate: "typescript-concept"
---
## Readonly Arrays & Tuples

**Readonly collections allow you to completely freeze arrays and tuples, blocking any operations that alter their size or content.**

By default, standard JavaScript methods like `.push()`, `.pop()`, or direct index modification can mutate lists. TypeScript lets you lock these down at compile time to create completely immutable data structures.

### 1. Readonly Arrays
You can protect an array by adding the `readonly` modifier keyword before the type, or by wrapping it in the `ReadonlyArray<type>` generic utility. This strips away all mutating array methods.

```typescript
let activeCodes: readonly number[] =;
// Alternatively: let activeCodes: ReadonlyArray<number> =;

// ❌ ERROR: All mutation operations are completely blocked by the compiler
// activeCodes.push(104);       // Property 'push' does not exist on type 'readonly number[]'.
// activeCodes[0] = 999;        // Index signature in type 'readonly number[]' only permits reading.

let copy = activeCodes.map(x => x * 2); // ✅ Allowed (Non-mutating methods that return a new array work perfectly)
```

### 2. Readonly Tuples
Tuples can also be frozen using the exact same `readonly` prefix modifier. This is incredibly useful for configuration pairs like coordinate sets or fixed data matrices that must never be altered.

```typescript
let locationPoint: readonly [latitude: number, longitude: number] = [12.97, 77.59];

// ❌ ERROR: Prevents accidental resizing or coordinate overriding
// locationPoint[0] = 13.05; // Index signature only permits reading.
// locationPoint.push(0);    // Property 'push' does not exist on type 'readonly [number, number]'.
```

### 3. Deep Freezing via Const Assertions (`as const`)
When working with complex object configurations or arrays, adding `as const` to the end of the assignment tells TypeScript to automatically make every single internal value, array, and nested item recursively `readonly`. It also narrows items to their exact literal types.

```typescript
const systemConfig = [8080, "PRODUCTION"] as const; 
// Inferred strictly as: readonly [8080, "PRODUCTION"]

// systemConfig[0] = 3000; // ❌ ERROR: Cannot assign to '0' because it is a read-only property.
```

---

### Key Summary Rule for Notes
Use **`readonly`** modifiers or **`as const`** assertions to eliminate runtime collection mutations. They transform volatile lists into immutable, read-only data domains, ensuring your core configurations, lookup tables, and structured coordinates remain pure throughout application runtime loops.
