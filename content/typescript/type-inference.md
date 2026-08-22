---
title: "Type Inference"
category: "typescript"
chapterId: "ts-basics"
slug: "type-inference"
description: "How TypeScript automatically guesses types without explicit annotations."
playgroundTemplate: "typescript-concept"
---
## Type Inference
Type Inference means the ***TypeScript compiler automatically determines your data types*** so you do not have to write them manually.

### Example of Type Inference
```ts
//========================================
// 1. SIMPLE VALUES (Implicit Assignment)
//========================================

let totalScore = 100;         // Inferred as: number
// totalScore = "win";        // ❌ Error: type 'string' not allowed
let playerName = "Alice";     // Inferred as: string
// playerName = 42;             // ❌ Error: type 'number' not allowed

//========================================
// 2. BEST COMMON TYPE (Arrays)
//========================================

let mixedItems = [10, "apple", 20]; // Inferred as: (number | string)[]
mixedItems.push("banana");    // ✅ Allowed
// mixedItems.push(true);     // ❌ Error: type 'boolean' not allowed

//========================================
// 3. CONTEXTUAL TYPING  (Functions)
//========================================

window.onclick = (event) => {
  // TypeScript automatically knows 'event' is a MouseEvent
  console.log(event.button);  // ✅ Allowed (auto-completes mouse properties)
  // console.log(event.text); // ❌ Error: 'text' doesn't exist on MouseEvent
};
//========================================
// 4. TYPE WIDENING  (let vs const)
//========================================

let city = "London";          // Inferred widely as: string (can change to any text)
const country = "UK";         // Inferred strictly as literal: "UK" (can never change)
```
