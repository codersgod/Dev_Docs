---
title: "Compilation Loop"
category: "typescript"
chapterId: "ts-introduction"
slug: "compilation-loop"
description: "How the TypeScript Compiler (tsc) transforms .ts code into vanilla .js."
playgroundTemplate: "typescript-concept"
---
## Compilation Loop
Because JavaScript engines do not understand TypeScript syntax, ***code must pass through the TypeScript Compiler (tsc) and `turn your JS code to TS`***. 
- This transformation loop executes two distinct responsibilities: **type analysis** and **code generation**.

### Here is what the compiler (tsc) actually does:
- **Type Stripping**: It ***checks*** your code ***for mistakes, then deletes all the TypeScript labels*** (like : string), leaving only clean JavaScript.
- **Downleveling**: It ***translates modern, fancy code into older JavaScript*** so your website works perfectly on ancient web browsers.
- **Zero Runtime Overhead**: Because all TypeScript parts are erased before running, your website runs at full speed without any lag or extra weight.

## Example of Compilation Loop
```ts
// TypeScript code
let message: string = "Hello, TypeScript!";
const greetUser = (name: string): string => {
  return `Hello, ${name}!`;
};


// JavaScript code after compilation
let message = "Hello, TypeScript!";
const greetUser = function (name) {
  return "Hello,"+ name + "!";
};
```