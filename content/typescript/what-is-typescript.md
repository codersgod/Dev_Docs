---
title: "What is Typescript"
category: "typescript"
chapterId: "what-is-typescript"
slug: "what-is-typescript"
description: "All about typescript"
playgroundTemplate: "typescript-concept"
---

## What is TypeScript?
TypeScript is an open-source, **strongly typed superset of JavaScript** developed by Microsoft. It **adds optional static typing to the language**.
> - **Adds Labels**: You define what your data type is (numbers, text, etc.).
> - **Catches Bugs Early**: It finds mistakes while you type, not after you launch.
> - **Translates Code**: TypeScript ***cannot be executed directly by browsers or runtime environments*** like Node.js; it ***must be compiled down to standard JavaScript****.

## Key features of TypeScript
- **Static Typing**: TypeScript ***allows you to define types for variables***, function parameters
- **Type Inference**: TypeScript can ***automatically assign types based on the assigned values***, reducing the need for explicit type annotations.
- **Classes and Objects**: TypeScript ***supports object-oriented programming*** features like classes, inheritance, and access modifiers.
- **Early Errors**: Spot bugs inside your code editor while you type.

## Why use TypeScript?
TypeScript is required because **it catches coding errors (related to data-types) instantly while you type**, preventing your website from crashing later when real users try to use it.

```ts
// JavaScript allows this dangerous reassignment
let total: any = 100;
total = "one hundred"; // No runtime error, but breaks math logic later

// TypeScript prevents type pollution
let price: number = 49.99;
price = "expensive"; // ❌ Compiler Error: Type 'string' is not assignable to type 'number'.
```
### Basic Types
TypeScript provides several built-in types that you can use to define the shape of your data. The most common basic types are:
```ts
// There are 3 BASIC TYPES in TypeScript
let isDone: boolean = false;
let lines: number = 42;
let name: string = "Anders";
```
### Functions
TypeScript allows you to define the types of function parameters and return values, which helps catch errors at compile time and improves code readability.
```ts
// writing a function with type annotations
function greet(person: string): string {
    return "Hello, " + person;
}
```
### Type Annotations
TypeScript allows you to explicitly specify the types of variables, function parameters, and return values using **type annotations**. This helps catch errors at compile time and improves code readability.
```ts
// For collections, there are typed arrays and generic arrays
let list: number[] = [1, 2, 3]; // Typed array
// Alternatively, using the generic array type
let list: Array<number> = [1, 2, 3];  // Generic array type
```
### Automatic Type Inference (TypeScript assigns types)
TypeScript can automatically infer the type of a variable based on the value assigned to it. This
```ts
// You just write normal JavaScript
// ✅ OK: TypeScript infers the type as 'string'.
let username = "Alex"; 
username = 42; // ❌ ERROR: Type 'number' is not assignable to type 'string'.

```