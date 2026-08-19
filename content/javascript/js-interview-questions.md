---
title: "JS  Interview Questions"
category: "javascript"
chapterId: "js-interview-prep"
slug: "js-interview-questions"
description: "Frequently asked JavaScript questions and best practices for answering them."
---
##   

<details><summary><b>What is Debouncing in JavaScript?</b></summary>

Debouncing delays a function's execution until a specified period of inactivity has passed since the last trigger.
- It acts like a reset button on a timer, clearing previous countdowns with every new action so the code only runs once you pause.
```js
const debounce = (fn, delay) => {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), delay);
  };
};
```

</details>
<details><summary><b>What is Throttling in JavaScript?</b></summary>

Throttling limits a function to executing at most once during a target time window, no matter how many times you trigger it.
- Instead of waiting for a pause like debouncing, it forces a steady, rhythmic pulse of execution while the action is happening.

```js
function throttleInterval(callback, limit) {
  let timer = null;
  return function(...args) {
    // If the clock is already ticking, do nothing and block further execution
    if (timer) return;
    // Start a fixed-rate pulse clock
    timer = setInterval(() => {
      callback(...args);
      // Stop the clock immediately so it can be restarted on the next event
      clearInterval(timer);
      timer = null; 
    }, limit);
  };
}
//============================
function throttleTimeout(callback, limit) {
  let isWaiting = false;
  return function(...args) {
    // If we are currently locked out, ignore the action
    if (isWaiting) return;
    // Run the function immediately
    callback(...args);
    // Turn on the lockout flag
    isWaiting = true;
    // Turn off the lockout flag after the limit expires
    setTimeout(() => {
      isWaiting = false;
    }, limit);
  };
};
```
</details>
<details><summary><b>What is the difference between Async-Await and Promises?</b></summary>

### Async/Await vs. Promises
| Feature | Promises (.then() / .catch()) | Async/Await (async / await) |
|---------|-----------------------------|----------------------------|
| **Syntax Style** | ***Chained method calls*** (Callback-driven style). | ***Linear / Synchronous style*** (Cleaner, top-down structure). |
| **Under the Hood** | The core native API block. | Syntactic sugar wrapped directly around Promises. |
| **Error Handling** | Done via trailing `.catch()` blocks. | Done cleanly using standard `try / catch` blocks. |
| **Debugging** | Harder. Stack traces can be messy due to chained nested callbacks. | Easier. Code pauses execution linearly, making step-by-step breakpoints predictable. |
| **Conditionals / Loops** | Clunky inside chains. Requires nesting or nesting logic blocks. | Easy. Works natively with standard if statements and loops (for...of). |

</details>
<details><summary><b>Understanding all Promise methods?</b></summary>

| Method             | Succeeds When...         | Fails When...               | What it Returns            | Best For                   |
| ------------------ | ------------------------ | --------------------------- | -------------------------- | -------------------------- |
| **Promise.all**        | All succeed              | Any fails (instantly)       | Array of results           | All-or-nothing operations  |
| **Promise.allSettled** | All finish (win or lose) | Never fails                 | Array of outcome objects   | Independent batch tasks    |
| **Promise.any**        | First 1 succeeds         | All fail                    | First successful value     | Fastest success / Mirrors  |
| **Promise.race**       | First 1 finishes         | First 1 fails (if it loses) | First finished value/error | Timeouts / Race conditions |

Core Differences at a Glance
- **all vs allSettled:** all explodes on the first error; allSettled waits for everything no matter what.
- **any vs race:** any cares about the first success; race cares only about the first to finish (even if it's an error).
</details>

<details><summary><b>What is `Event Emitters` in JavaScript?</b></summary>

**Definition**: A design pattern (Observer Pattern) that triggers actions when named events occur.
**Internal Structure**: A plain JavaScript object where keys are event names and values are arrays of callback functions.
**Core API**:
- `.on()` – Subscribes a listener (adds to array).
- `.off()` – Unsubscribes a listener (removes from array).
- `.emit()` – Triggers the event (loops through and executes the callbacks).
- `.once()` – Subscribes a listener that auto-deletes after firing once.

**Primary Use**: Used for decoupling architecture, streams/servers in Node.js, and cross-component Event Buses in frontend frameworks.

**Risk**: Leaving listeners active when components unmount causes memory leaks.
```js
// 1. Create an instance of the class we wrote
const emitter = new EventEmitter();

// 2. Define a listener callback
const greet = (name) => console.log(`Hello, ${name}!`);

// 3. Subscribe to the 'userLogin' event - `userLogin` is the CUSTOM event name, `greet` is the callback
emitter.on('userLogin', greet);

// 4. Emit/Trigger the event with data
emitter.emit('userLogin', 'Alice'); // Output: "Hello, Alice!"
emitter.emit('userLogin', 'Bob');   // Output: "Hello, Bob!"

// 5. Unsubscribe from the event
emitter.off('userLogin', greet);

// 6. Emitting now does nothing
emitter.emit('userLogin', 'Charlie'); // No output
```
</details>

<details><summary><b>Merging data structures Object / Array in JavaScript?</b></summary>

### 👥 Merging Objects
| Approach                         | Code Example                                       | Side Effects / Notes                                                                                       |
| -------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Spread Operator (...)**        | const merged = { ...obj1, ...obj2 };               | Best choice. Shallow copy. Properties on the right overwrite properties on the left.                       |
| **Object.assign()**              | Object.assign(target, obj1, obj2);                 | Mutates the target object. To prevent mutation, pass an empty object first: Object.assign({}, obj1, obj2). |
| **Deep Merge (structuredClone)** | Requires custom helper loop combined with cloning. | Built-in methods only merge top-level properties (shallow). Nested objects remain linked by reference.     |

### ⛓️ Merging Arrays
| Approach                  | Code Example                       | Side Effects / Notes                                                  |
| ------------------------- | ---------------------------------- | --------------------------------------------------------------------- |
| **Spread Operator (...)** | const merged = [...arr1, ...arr2]; | Best choice. Creates a clean, shallow-copied new array.               |
| **.concat()**             | const merged = arr1.concat(arr2);  | Traditional approach. Returns a new array without mutating originals. |
| **.push() with Spread**   | arr1.push(...arr2);                | Mutates arr1 in place. Highly memory efficient for very large arrays. |

### ⚠️ Critical Interview Edge Cases
| Issue                | Description                                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shallow Copy Warning | Both spread (...) and Object.assign() perform shallow merges. If your inner objects or arrays are nested, changing a value in the merged structure will modify the original structure. |
| Duplicate Keys       | When objects share duplicate keys, the last object specified in the sequence always wins and overrides previous values.                                                                |
</details>

<details><summary><b>What is Hoisting in JavaScript?</b></summary>
Hoisting is a JavaScript mechanism where variable and function declarations are moved to the top of their containing scope during the compilation phase. This means that you can use variables and functions before they are declared in the code.

| Construct                     | Hoisted?                    | Initial Value            | Accessing Before Line of Declaration Results In...   |
| ----------------------------- | --------------------------- | ------------------------ | ---------------------------------------------------- |
| function (Declaration)        | Yes                         | The actual function body | Success (Can invoke safely anywhere in scope).       |
| var                           | Yes                         | undefined                | Returns undefined (No crash, but value is missing).  |
| let / const                   | Yes                         | None                     | ReferenceError (Trapped inside Temporal Dead Zone).  |
| function (Expression / Arrow) | No (Follows variable rules) | undefined or None        | TypeError (if var) or ReferenceError (if let/const). |
| class                         | Yes                         | None                     | ReferenceError (Trapped inside Temporal Dead Zone).  |

- **Temporal Dead Zone (TDZ)**: The period between the start of a scope and the point where a variable is declared. Accessing a variable in this zone results in a ReferenceError for let/const and undefined for var.
```js
// Variable Hoisting
console.log(myVar); // undefined
var myVar = 10;
// Let Hoisting
console.log(myLet); // ReferenceError: Cannot access 'myLet' before initialization
let myLet = 20;
// Constant Hoisting
console.log(myConst); // ReferenceError: Cannot access 'myConst' before initialization
const myConst = 30;
// Function Declaration Hoisting
console.log(myFunc()); // "Hello"
function myFunc() {
  return "Hello";
}
// Function Expression Hoisting
console.log(myFuncExpr()); // TypeError: myFuncExpr is not a function
const myFuncExpr = function() {
  return "Hello";
};
// class Hoisting
const myInstance = new MyClass(); // ReferenceError: Cannot access 'MyClass' before initialization
class MyClass {
  constructor() {
    this.name = "MyClass";
  }
}
```
</details>

<details><summary><b>What are the differences between JavaScript variables created using `let`, `var`, and `const`?</b></summary>

**Scope**
- `var` variables are function-scoped or global, while `let` and `const` are block-scoped (confined to the nearest {} block).
- 
- **Initialization**
- `var` and `let` can be declared without initialization, but `const` requires an initial value.
- 
- **Redeclaration**
- Variables declared with `var` can be redeclared, but `let` and `const`   cannot.
- 
**Reassignment**
- `var` and `let` allow reassignment, while `const` does not.
- 
**Access before declaration**
- All variables are hoisted, but `var` initializes to undefined, whereas `let` and `const` exist in a "temporal dead zone" until the declaration is reached.

**Best practices**
- Use `const` for variables that don't change to ensure immutability.
- Use `let` when reassignment is needed.
- Avoid `var` due to its hoisting and scoping issues.
</details>
<details><summary><b>Understanding the Event Loop in JavaScript?</b></summary>

The event loop is the backbone of JavaScript's asynchronous behavior, enabling single-threaded execution without blocking.
### Key components
- **Call stack**: Tracks function executions in a Last-In-First-Out (LIFO) order
- **Web APIs/Node.js APIs**: Handle asynchronous tasks like setTimeout and HTTP requests on separate threads
- **Task queue (Macrotask queue)**: Queues tasks like setTimeout and UI events
- **Microtask queue**: Prioritizes tasks like Promise callbacks, executed before macrotasks

### How it works
- **Synchronous code execution**: Functions are pushed and popped from the call stack.
- **Asynchronous tasks**: Offloaded to APIs for processing.
- **Task completion**: Completed tasks are queued.
- **Event loop execution**: Executes microtasks until the queue is empty. Processes one macrotask and checks the microtask queue again.

```js
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);

Promise.resolve().then(() => console.log('Promise 1'));

setTimeout(() => console.log('Timeout 2'), 0);

console.log('End');
// output order: start, end, promise 1, timeout 1, timeout 2
``` 
</details>

<details><summary><b>How Objects/Arrays can be created in JavaScript?</b></summary>

### 👥 Object Creation Methods
| Method               | Syntax Example                            | Best Used For...                                       |
| -------------------- | ----------------------------------------- | ------------------------------------------------------ |
| **Literal Notation**     | const obj = { name: 'Alice' };            | Standard. Fastest, cleanest, and most common way.      |
| **new Object()**         | const obj = new Object();                 | Explicit creation. Rarely used over standard literals. |
| **Object.create()**      | const child = Object.create(parent);      | Creating an object with a specific prototype link.     |
| **Constructor Function** | function User() {}; const u = new User(); | Creating instances before ES6 classes existed.         |
| **ES6 Classes**          | class User {}; const u = new User();      | Modern Object-Oriented Programming (OOP).              |

### ⛓️ Array Creation Methods
| Method                | Syntax Example                    | Best Used For...                                                  |
| --------------------- | --------------------------------- | ----------------------------------------------------------------- |
| **Literal Notation**      | const arr = [1, 2, 3];            | Standard. Easiest and most optimized method.                      |
| **new Array()**           | const arr = new Array(5);         | Creating an empty array with a fixed length (e.g., [empty × 5]).  |
| **Array.from()**          | const arr = Array.from(iterable); | Converting array-like structures (e.g., NodeList, Set) to arrays. |
| **Array.of()**            | const arr = Array.of(1, 2, 3);    | Safely creating arrays when arguments are dynamic numbers.        |
| **Spread Operator (...)** | const arr = [...anotherArray];    | Duplicating, copying, or cloning an existing array.               |

</details>

<details><summary><b>What is Event delegation?</b></summary>
Event Delegation is a performance-optimization technique where you attach a single event listener to a parent element instead of adding separate listeners to every individual child.

### Event Delegation (The Technique)
**What it is**: Attaching one single listener to a parent container instead of separate listeners to dozens of individual children.
**How it works**: It lets child events bubble up to the parent. The parent uses `e.target.closest()` to identify which child was clicked.
**Why use it**: 
- Saves massive amounts of memory. 
- Works automatically on dynamically added elements without needing new listeners.

### Crucial Control Methods
- **.target**: The exact, nested element that triggered the event (e.g., the specific `<li>` or `<span>`).
- **.currentTarget**: The element that owns the listener currently executing (the parent container).
- **.stopPropagation()**: Freezes the event instantly, stopping it from traveling any further up or down the phase chain.

### The Click Timeline
`Capturing` → `Target` → `Bubbling`
```js
div.addEventListener('click', () => console.log('Div Capturing'), true); // Capturing
button.addEventListener('click', () => console.log('Button Clicked'));  // Target
div.addEventListener('click', () => console.log('Div Bubbling'));       // Bubbling
//Output order: Div Capturing, Button Clicked, Div Bubbling
```
</details>
<details><summary><b>How `this` works in JavaScript?</b></summary>

**Rule**: The value of this is not fixed. It is not determined by where a function is declared, but how the function is called (its execution context).

### The 4 Core Rules of `this`
When evaluating what this points to, look at how the function is invoked, following this order of priority:
| Scenario / Rule     | Example Syntax                                     | What this Points To                                       |
| ------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| **1. new Binding**      | const user = new User();                           | this refers to the newly created object.                  |
| **2. Explicit Binding** | func.call(obj); func.apply(obj); func.bind(obj)(); | The exact object (obj) passed into the method.            |
| **3. Implicit Binding** | userObj.greet();                                   | The object to the left of the dot (userObj).              |
| **4. Default Binding**  | greet(); (Standalone call)                         | The window / global object (or undefined in strict mode). |

### The Big Exception: Arrow Functions
Arrow functions do not have their own `this`. They capture the `this` value of the lexical (surrounding) scope at the exact time they are created. Methods like `.call()`, `.apply()`, or `.bind()` are completely ignored by arrow functions.

```js
// ❌ REGULAR FUNCTION: 'this' breaks
function TimerRegular() {
  this.seconds = 0;
  setInterval(function() {
    this.seconds++; // Error: 'this' falls back to the global window object
    console.log(this.seconds); // Output: NaN (undefined + 1)
  }, 1000);
}

//  ARROW FUNCTION: 'this' is fixed lexically
function TimerArrow() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++; // Success: 'this' inherits cleanly from TimerArrow context
    console.log(this.seconds); // Output: 1, 2, 3...
  }, 1000);
}

new TimerRegular();
new TimerArrow();

```

- When you pass an object method as a callback (e.g., inside setTimeout or an event listener), ***it loses its implicit binding and falls back to default binding***.
- The rule is always the same: ***If a regular function is executed as a callback without a dot (.) directly to its left,** `this` ***slips away. Arrow functions permanently fix this by capturing the context where they were born***.
```js
const userReg = {
  name: 'Alice',
  greet: function() { console.log(`Hello, ${this.name}`); },
  // Surrounding global/window scope has no 'name'
  greetArrow: () => { console.log(`Hello, ${this.name}`); }
};

//  With a dot: Implicit binding works
userReg.greet(); // Output: "Hello, Alice"
// ❌ With a dot: Fails anyway because it looks outside the object
userReg.greetArrow(); // Output: "Hello, undefined"

// ❌ Without a dot: Passed as a callback, context is lost
const looseReg = userReg.greet;
looseReg(); // Output: "Hello, undefined"

// ❌ Without a dot: Fails the exact same way
const looseArrow = userReg.greetArrow;
looseArrow(); // Output: "Hello, undefined"
```
</details>

<details><summary><b>What sets `Cookies`, `sessionStorage`, and `localStorage` apart?</b></summary>

### Browser Storage Summary
|Feature|LocalStorage|SessionStorage|Cookies|
|---|---|---|---|
|Capacity|~5MB – 10MB|~5MB|~4KB (Very small)|
|Lifespan|Permanent (Until manually deleted)|Tab Specific (Deleted when tab closes)|Custom Expiry (Set via code/server)|
|Server Access|No (Client side only)|No (Client side only)|Yes (Sent automatically with every HTTP request)|
|Security Risk|Vulnerable to XSS|Vulnerable to XSS|Vulnerable to CSRF (Mitigated via HttpOnly and SameSite flags)|
|Best For...|User settings, theme preferences, offline caching.|Temporary form data, single-session checkouts.|

</details>
<details><summary><b>How do `script`, `script async`, and `script defer` differ?</b></summary>
 
 |Attribute|HTML Parsing Interruption|Download Timing|Execution Timing|Execution Order|Best Used For|
 |---|---|---|---|---|---|
 | `<script>`|Yes (Blocks parsing)|Immediate|Immediately after download completes|Strict document order|Critical scripts that must modify the DOM immediately.|
 |`<script async>`|Partial (Blocks only during execution)|Parallel (In background)|Immediately after download completes|First ready, first executed (Order is completely random)|Third-party independent scripts (e.g., Google Analytics, tracking pixels).|
 |`<script defer>`|No (Never blocks)|Parallel (In background)|Only after HTML parsing finishes|Strict document order|App-critical code that depends on the full DOM structure or other scripts.|

![script execution timing diagram](/script_execution.png)

</details>
<details><summary><b>What is the difference between Explicit Binding Methods (call vs apply vs bind) in JavaScript?</b></summary>

|Method|Invokes Function Immediately?|How Arguments are Passed|Return Value|Common Use Case|
|---|---|---|---|---|
|`.call()`|Yes|Comma-separated list|`func.call(obj, arg1, arg2)`|The return value of the function. Borrowing a method from another object when arguments are known.|
|`.apply()`|Yes|Single Array|`func.apply(obj, [arg1, arg2])`|The return value of the function. Borrowing a method when arguments are dynamic or inside an array (e.g., `Math.max.apply`).|
|`.bind()`|No (Creates a copy)|Comma-separated list|`const newF = func.bind(obj, arg1)`|A brand-new bound function copy. Passing callbacks to Event Listeners or `setTimeout` without losing context.|

```js
const user = { name: 'Alice' };

function greet(greeting, punctuation) {
  console.log(`${greeting}, my name is ${this.name}${punctuation}`);
}

// 1. .call() passes arguments one by one
greet.call(user, 'Hello', '!'); // Output: "Hello, my name is Alice!"

// 2. .apply() passes arguments inside an array [ ]
greet.apply(user, ['Hi', '.']); // Output: "Hi, my name is Alice."

// 3. .bind() returns a new function to be executed later
const laterGreet = greet.bind(user, 'Hey', '...');
laterGreet();                   // Output: "Hey, my name is Alice..."
```
</details>

<details><summary><b>How does prototypal inheritance work?</b></summary>

### Key concepts:
Prototypes: Each object has a prototype, from which it inherits properties and methods.
Prototype chain: JavaScript looks for properties/methods up the chain until it finds them or reaches null.
Constructor functions: Functions used with new to create objects.
```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayName = function () {
  console.log(`My name is ${this.name}`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.bark = function () {
  console.log('Woof!');
};

let fido = new Dog('Fido', 'Labrador');
fido.bark(); // "Woof!"
fido.sayName(); // "My name is Fido"
```
</details>
<details><summary><b>Differences between: function Person(){}, const person = Person(), and const person = new Person()</b></summary>

- **function Person(){}**: A `function declaration`, typically used for constructors if written in PascalCase.
- **const person = Person()**: `A function expression`. Calls the function normally and assigns the result to person. No object creation happens unless explicitly returned.
- **const person = new Person()**: Invokes the function as a constructor, creating a new object and setting its prototype to Person.prototype.
</details>

<details><summary><b>What are the differences between XMLHttpRequest and fetch() in JavaScript?</b></summary>

### XMLHttpRequest
- **Syntax: Event-driven; requires listeners for response handling.**
- **Progress tracking**: Supports progress tracking via onprogress.
- **Error handling**: Uses onerror event.
```js
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://example.com/api', true);
xhr.onload = function () {
  if (xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();
```
### fetch()
- **Syntax: Promise-based; simpler and more readable.**
- **Error handling**: Uses .catch() for better error management.
- **Modern features**: Built-in support for AbortController for cancellations.
```js
fetch('https://example.com/api')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```
</details>
<details><summary><b>How do you iterate over object properties and array items?</b></summary>

### Object Iteration Methods:
| Method | Syntax Example | What it Returns / Iterates Over | Best For |
|--------|----------------|---------------------------------|----------|
| for...in | for (let key in obj) { ... } | Iterates over all enumerable keys (including prototype properties). | Simple legacy loops (requires hasOwnProperty check for safety). |
| Object.keys() | Object.keys(obj).forEach(key => ...) | Array of the object's own key names. | Modifying keys or standard key-based looping. |
| Object.values() | Object.values(obj).forEach(val => ...) | Array of the object's own property values. | Extracted calculations (e.g., summing up price values). |
| Object.entries() | for (let [k, v] of Object.entries(obj)) | Array of [key, value] pairs. | Modern Standard. Best for accessing keys and values together. |

### Array Iteration Methods:
| Method | Syntax Example | Characteristics | Best For |
|--------|----------------|----------------|----------|
| for...of | for (let item of arr) { ... } | Supports break, continue, and async/await. | Short-circuiting or pausing loops early. |
| forEach() | arr.forEach(item => ...) | Cannot be broken or exited early. Returns undefined. | Executing side-effects for every single item. |
| map() | const newArr = arr.map(x => x * 2); | Returns a brand-new array of the same length. | Transforming data structures without changing originals. |
| Traditional for | for (let i = 0; i < arr.length; i++) | Fast manual index tracking. Heavy boilerplate syntax. | Complex custom multi-index manipulation. |

### ⚠️ Crucial Interview Trap: for...in vs for...of
- **for...in** loops over keys/indices (Strings). Never use this for arrays because it iterates through index strings and unexpected custom prototype properties.
- **for...of** loops over values (Iterables). Use this for arrays, sets, and strings.
</details>

<details><summary><b>What is the difference between `==` and `===` in JavaScript?</b></summary>