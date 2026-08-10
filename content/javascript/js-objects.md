---
title: "Objects Fundamentals"
category: "javascript"
chapterId: "js-objects-arrays"
slug: "js-objects"
description: "Syntax, property types, access patterns, creation methods, iteration, cloning, meta-programming, and the prototype chain."
---

# Objects Fundamentals

## What is it?

An object is a collection of **key-value pairs** enclosed in `{}`. It is the core data structure in JavaScript — arrays, functions, dates, and classes are all objects under the hood.

- **Property** — when the value is data (string, number, array). Describes a *feature*.
- **Method** — when the value is a function. Describes an *action*.

```js
const user = {
  name: 'Alice',       // property — data
  age: 30,             // property — data
  greet() {            // method — action
    return `Hi, I'm ${this.name}`;
  },
};
```

---

## 1. Property Keys — Types & Sorting
*Every key has a type — integers, strings, or symbols — and JS auto-groups then sorts them in a fixed internal order.*

Three valid key types:

| Type | Example | Description |
|---|---|---|
| **Integer** | `"1"`, `"42"` | Numeric string keys |
| **String** | `"name"`, `"1.5"` | Any text key that is not a pure integer |
| **Symbol** | `Symbol('id')` | Unique, hidden identifiers |

**Internal sorting order — JS groups and orders automatically:**
1. Integers — ascending numeric order (1, 2, 10)
2. Strings — chronological insertion order
3. Symbols — chronological insertion order (hidden from most tools)

```js
const obj = {
  2: 'two',           // integer key
  1: 'one',           // integer key
  name: 'Alice',      // string key
  city: 'NYC',        // string key
  [Symbol('id')]: 99, // symbol key
};

console.log(Object.keys(obj)); // ['1', '2', 'name', 'city']
// Integers first (sorted numerically), then strings (insertion order).
// Symbols are completely hidden from Object.keys().
```

---

## 2. Property Access
*Two ways to read or write a property — dot for simple keys, brackets when the key is dynamic or has special characters.*

### Dot notation — standard, clean

```js
user.name;    // 'Alice'
user.greet(); // method call
```

Dot notation looks for the **exact literal name you type** — it ignores variables.

### Bracket notation — flexible, dynamic

```js
user['name'];            // 'Alice'

const key = 'age';
user[key];               // 30 — reads the variable first, then looks up the key

// Required when key has spaces, starts with a number, or is in a variable
const config = { 'content-type': 'json', '1start': true };
config['content-type'];  // 'json' ✅
config.content-type;     // SyntaxError ❌
```

### Property shorthand (ES6)

When the variable name matches the key name — write it once.

```js
const name = 'Alice';
const age = 30;

const user = { name: name, age: age }; // ❌ verbose
const user = { name, age };            // ✅ shorthand
```

### Computed property names — dynamic key at runtime

Use `[]` inside the object literal to calculate or read a key dynamically.

```js
const field = 'score';

const result = {
  [field]: 100,           // evaluates to  score: 100
  [`${field}_max`]: 200,  // evaluates to  score_max: 200
};
```

---

## 2. Object Creation Patterns
*Five ways to create objects — each with different trade-offs for privacy, performance, and inheritance.*

### Object literal — simplest, most common

```js
const car = { brand: 'Toyota', year: 2024 };
const empty = {};
```

### new Object() Constructor — empty object via global constructor

```js
const obj = new Object();
obj.name = 'Alice'; // add properties after
```

### Constructor function — `new` creates a fresh instance

When called with `new`, JS: creates a blank object → points `this` to it → runs the function → returns that object. Inside a constructor, `this` refers exclusively to the new instance being born.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() { return `Hi, I'm ${this.name}`; };

const alice = new Person('Alice', 30);
alice.greet(); // "Hi, I'm Alice"
```

### Factory function — no `new`, uses closures for privacy

A plain function that creates and returns a new object literal — without `new` or `this`.

Two key features:
- **Closure-based** — the function remembers variables around it even after it finishes running
- **Encapsulation** — sensitive variables are locked away; outside code cannot touch them directly

```js
function createUser(name) {
  let loginCount = 0; // private — locked inside via closure

  return {
    getName()   { return name; },
    login()     { loginCount++; },
    getLogins() { return loginCount; },
  };
}

const user = createUser('Alice');
user.login();
user.getLogins();  // 1
user.loginCount;   // undefined — private, inaccessible
```

### ES6 Classes — modern OOP blueprint

Modern blueprint syntax matching standard object-oriented programming. The moment you use `new`, the prototype is generated automatically.

```js
class Animal {
  #sound; // private field

  constructor(name, sound) {
    this.name = name;
    this.#sound = sound;
  }

  speak() { return `${this.name} says ${this.#sound}`; }
  static create(name, sound) { return new Animal(name, sound); }
}

class Dog extends Animal {
  constructor(name) { super(name, 'woof'); }
  fetch() { return `${this.name} fetches the ball!`; }
}

const rex = new Dog('Rex');
rex.speak(); // 'Rex says woof'
rex.fetch(); // 'Rex fetches the ball!'
```

### Object.create() — direct prototype link, no constructor

Bypasses constructors and classes entirely. Creates a brand-new object and immediately hooks its `[[Prototype]]` to an existing object.

```js
const personProto = {
  greet() { return `Hi, I'm ${this.name}`; },
};

const alice = Object.create(personProto); // alice's prototype = personProto
alice.name = 'Alice';
alice.greet(); // "Hi, I'm Alice"

Object.getPrototypeOf(alice) === personProto; // true
```

---

## 3. Iteration & Interrogation
*Tools to loop over, inspect, and verify properties — including how to find hidden non-enumerable and Symbol keys.*

### Enumerability

Every property has a hidden `enumerable` flag (plus `writable` and `configurable`):

| Flag | Meaning |
|---|---|
| `enumerable: true` | Visible — shows up in `for...in` and `Object.keys()` |
| `enumerable: false` | Hidden — built-in properties like `Array.length` |
| `writable` | Can the value be changed? |
| `configurable` | Can it be deleted or its descriptor changed? |

### The four iteration tools

```js
const user = { name: 'Alice', age: 30 };

// for...in — own + inherited enumerable keys (walks prototype chain!)
for (const key in user) console.log(key);

// Object.keys()    — own enumerable keys only (ignores prototype)
Object.keys(user);    // ['name', 'age']

// Object.values()  — own enumerable values only
Object.values(user);  // ['Alice', 30]

// Object.entries() — own enumerable [key, value] pairs (great with array methods)
Object.entries(user); // [['name','Alice'], ['age',30]]
```

### Property existence checking — 3 options

```js
const obj = { name: 'Alice' };

// in — checks own + prototype chain
'name' in obj;                  // true
'toString' in obj;              // true — found on Object.prototype

// hasOwnProperty — own only, ignores prototype
obj.hasOwnProperty('name');     // true
// ⚠️ Catch: crashes if object has no prototype (Object.create(null))

// Object.hasOwn — modern, bulletproof replacement ✅ (industry standard)
Object.hasOwn(obj, 'name');     // true — works on any object, even null-prototype
Object.hasOwn(obj, 'toString'); // false — prototype key, not own
```

### Property reflection — find hidden properties

Standard `Object.keys()` misses non-enumerable properties and Symbol keys. Use reflection to dig them up:

```js
const secret = Symbol('secret');
const obj = { visible: 1 };
Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false });
obj[secret] = 'shhh';

Object.keys(obj);                     // ['visible']           — misses both
Object.getOwnPropertyNames(obj);      // ['visible', 'hidden'] — finds non-enumerable
Object.getOwnPropertySymbols(obj);    // [Symbol(secret)]      — finds symbols
```

---

## 4. Memory Mechanics: References & Cloning
*Primitives are copied by value; objects are copied by reference — understanding this prevents accidental mutation bugs.*

### Value vs Reference — Stack and Heap

The computer uses two memory zones:

- **Stack (Value Storage)** — fast, fixed-size. Stores primitives. Assigning to a new variable creates a fully independent copy.
- **Heap (Reference Storage)** — large, flexible. Stores objects. The variable on the Stack holds a tiny pointer (memory address) to where the actual object lives in the Heap.

```js
// Primitives — copied by value (independent)
let a = 10;
let b = a;
b = 99;
console.log(a); // 10 — unchanged

// Objects — copied by reference (shared pointer)
const obj1 = { x: 1 };
const obj2 = obj1;    // both point to the same heap object
obj2.x = 99;
console.log(obj1.x);  // 99 — same object was mutated!
```

### Reference mutability — side effects in functions

Objects are passed as a **copy of the reference (pointer)**. Mutating inside a function modifies the original outside.

```js
function promote(user) {
  user.role = 'admin'; // modifies the original via shared pointer
}

const alice = { name: 'Alice', role: 'user' };
promote(alice);
console.log(alice.role); // 'admin' — original changed!
```

### Shallow copy — top level only

Duplicates the top-level properties. Nested objects still share the original pointer.

```js
const original = { name: 'Alice', address: { city: 'NYC' } };

const copy = { ...original };               // spread (modern ✅)
const copy2 = Object.assign({}, original);  // Object.assign (older)

copy.name = 'Bob';            // ✅ original untouched
copy.address.city = 'LA';     // ❌ nested object still shared!
console.log(original.address.city); // 'LA'
```

### Deep copy — fully independent

```js
// structuredClone (modern native tool ✅)
// Supports: Date, Map, Set, RegExp, ArrayBuffer
// ❌ Crashes on: functions, Symbols
const deep = structuredClone(original);
deep.address.city = 'Chicago';
console.log(original.address.city); // 'NYC' — fully independent!

// JSON trick (old, limited ❌)
// ❌ Loses: undefined, functions, Date, Map, Set, Symbol, circular refs
const risky = JSON.parse(JSON.stringify(original));
```

### Memory lifecycle — Garbage Collection

You never manually free memory — JS handles it automatically.

- **Reachability** — the engine watches if an object is still reachable via a running variable. If no path exists, the garbage collector wipes it.
- **Memory Leaks** — happen when code accidentally holds onto old unused references (active event listener, global variable), preventing GC from freeing memory. Slows down your app over time.

### Weak References — WeakMap & WeakSet

**The issue:** A standard `Map` or `Set` holds a **tight grip** on objects inside it. Even if every other reference to those objects is deleted, GC cannot free them — they are trapped.

**The fix:** `WeakMap` and `WeakSet` hold objects with a **loose grip**. When the rest of your code deletes its references, GC automatically frees the entry.

```js
// Standard Map — holds tight reference (potential leak)
let el = document.getElementById('btn');
const map = new Map();
map.set(el, { clicks: 0 });
el = null; // still in memory — Map holds it!

// WeakMap — loose reference (GC-friendly ✅)
const weakMap = new WeakMap();
weakMap.set(el, { clicks: 0 });
el = null; // GC can now free both el and the WeakMap entry
```

### Map & Set — when to use over plain objects

```js
// Map — keyed collection, any key type
const roles = new Map();
roles.set('Alice', 'admin');
roles.set(42, 'answer');       // number as key ✅ (impossible with plain object)
roles.size;                    // 2 — built-in size property
roles.get('Alice');            // 'admin'

// Set — unique values only, duplicate entries ignored
const tags = new Set(['js', 'react', 'js']); // 'js' deduplicated
[...tags];                     // ['js', 'react']

// Remove duplicates from array
const unique = [...new Set([1,1,2,2,3])]; // [1, 2, 3]
```

**When to use:**

| Use | Tool |
|---|---|
| Need to loop over entries | `Map` |
| Keys are not strings (objects, numbers) | `Map` |
| Frequently look up / delete by key | `Map` |
| Store list with no duplicates | `Set` |
| Fast existence check | `Set` |
| Deduplicate an array | `Set` |
| Attach data to DOM node, GC-friendly | `WeakMap` |

---

## 5. Meta-Programming & Object Control
*Fine-tune how individual properties behave — make them read-only, hidden, computed, or completely lock the entire object.*

### Property descriptors — 4 hidden settings per property

Every property has four hidden configuration attributes:

| Setting | Meaning |
|---|---|
| `value` | The actual data stored |
| `writable` | `true` = changeable, `false` = read-only |
| `enumerable` | `true` = visible in loops / `Object.keys()` |
| `configurable` | `true` = can be deleted or redefined |

```js
const obj = {};

// Define single property with custom settings
Object.defineProperty(obj, 'id', {
  value: 42,
  writable: false,      // read-only
  enumerable: true,
  configurable: false,  // cannot delete or redefine
});

obj.id = 99;      // silently fails (throws in strict mode)
console.log(obj.id); // 42

// Define multiple properties at once
Object.defineProperties(obj, {
  name: { value: 'Alice', writable: true, enumerable: true, configurable: true },
  role: { value: 'admin', writable: false, enumerable: true, configurable: false },
});
```

> **Note:** Properties created via `defineProperty` default to `false` for writable, enumerable, and configurable unless explicitly set to `true`.

### Getters & Setters — computed accessors

Instead of a raw value, link a property to functions that run automatically on read or write.

- **`get`** — executes when you *read* the property (returns a computed value)
- **`set`** — executes when you *assign* a new value
- **Rule:** A property can have `value` OR `get`/`set` — **never both**

```js
const user = {
  firstName: 'Alice',
  lastName: 'Smith',

  get fullName() {
    return `${this.firstName} ${this.lastName}`; // runs on read
  },

  set fullName(val) {
    [this.firstName, this.lastName] = val.split(' '); // runs on write
  },
};

user.fullName;             // 'Alice Smith'
user.fullName = 'Bob Jones';
user.firstName;            // 'Bob'
```

Use case: keeps code clean by exposing derived values like regular properties instead of calling functions.

### Object integrity — 3 escalating lock levels

All three are **shallow** — only top-level properties are locked. Nested objects are NOT affected.

```js
const obj = { x: 1, y: 2 };

// preventExtensions — soft lock: modify/delete existing, no new properties
Object.preventExtensions(obj);
obj.z = 3;       // ❌ silently fails
obj.x = 99;      // ✅ allowed
delete obj.y;    // ✅ allowed

// seal — medium lock: modify values, no add or delete
Object.seal(obj);
obj.x = 100;     // ✅ allowed
delete obj.x;    // ❌ blocked
obj.z = 3;       // ❌ blocked  (sets configurable: false on all)

// freeze — hard lock: completely immutable
Object.freeze(obj);
obj.x = 999;     // ❌ silently fails (throws in strict mode)
```

| Method | Add | Modify | Delete |
|---|---|---|---|
| `preventExtensions` | ❌ | ✅ | ✅ |
| `seal` | ❌ | ✅ | ❌ |
| `freeze` | ❌ | ❌ | ❌ |

### Integrity verification — check lock status

```js
Object.isExtensible(obj); // false if preventExtensions/seal/freeze was called
Object.isSealed(obj);     // true if sealed or frozen
Object.isFrozen(obj);     // true only if fully frozen
```

---

## 6. The Prototype Chain
*Objects borrow shared methods from a hidden blueprint chain — understanding this explains how inheritance and lookup work.*

### What is it?

A prototype is a **shared template object**. Instead of every instance duplicating identical methods, objects borrow them via a hidden `[[Prototype]]` link — forming a chain.

Every `{}` literal automatically links to `Object.prototype` — that is why `.toString()`, `.hasOwnProperty()` etc. are available on every object without you writing them.

```
alice → Person.prototype → Object.prototype → null
```

The JavaScript engine handles the entire prototype system automatically. You set it up via two modern approaches:
- `Object.create()` — Object-Driven
- `class` syntax — the moment you use `new`, the prototype link is generated

### The three prototype concepts

| Concept | Lives on | Job | How to access |
|---|---|---|---|
| `prototype` | Functions / Classes | Master warehouse of shared methods for instances | `Person.prototype` |
| `[[Prototype]]` | Objects (instances) | Secret engine link used to climb the chain | Cannot type directly |
| `__proto__` | Objects (instances) | Old, deprecated public window to view that link | `obj.__proto__` — avoid |

### Property lookup — traversal and shadowing

When you access `obj.color`, the engine searches bottom-up through the chain until found or `null` is reached.

```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} makes a sound`; };

const dog = new Animal('Rex');
dog.speak(); // found on Animal.prototype ← 'Rex makes a sound'

// Shadowing — instance property blocks prototype property of same name
dog.speak = function() { return `${this.name} barks`; };
dog.speak();       // 'Rex barks' — instance shadow hides prototype
delete dog.speak;
dog.speak();       // 'Rex makes a sound' — prototype visible again
```

The original prototype remains completely unchanged — it is only hidden during lookups on that specific instance.

### Prototype mutation — read and write

```js
// ✅ Read — safe and standard
Object.getPrototypeOf(dog) === Animal.prototype; // true

// ⚠️ Write — dangerous, avoid at runtime (breaks engine optimizations)
Object.setPrototypeOf(dog, newProto); // dynamically re-links — slow

// Best practice: set prototype at creation time via Object.create()
const child = Object.create(parentProto);
```

---

## 7. Object Utility Methods
*Handy static methods for transforming, comparing, and building objects from arrays.*

### Object.entries() and Object.fromEntries()

`Object.entries()` breaks the object into an array so you can manipulate it.  
`Object.fromEntries()` pieces the array back together into a clean object — they are inverses.

```js
const prices = { apple: 1.5, banana: 0.75, cherry: 3.0 };

// Transform values using the entries → manipulate → fromEntries pipeline
const discounted = Object.fromEntries(
  Object.entries(prices).map(([item, price]) => [item, price * 0.9])
);
// { apple: 1.35, banana: 0.675, cherry: 2.7 }
```

### Object.is() — precise equality (2 edge cases fixed)

Behaves like `===` except for two notorious bugs:

```js
NaN === NaN        // false ← wrong!
Object.is(NaN, NaN) // true  ← correct ✅

+0 === -0          // true  ← misleading
Object.is(+0, -0)  // false ← correct ✅
```

### The Global Type Hierarchy

All high-level data structures (`Array`, `Function`, `Date`, `RegExp`, `Map`, `Set`) are **specialized object configurations** — not separate isolated types.

```
Array instance → Array.prototype → Object.prototype → null
```

When you create an Array, it gets array-specific methods (like `.map()`) from `Array.prototype`. But `Array.prototype` itself inherits from `Object.prototype` — so `.toString()`, `.hasOwnProperty()` etc. are available on arrays too.

This means `typeof []` returns `"object"` — because an array IS a specialized object.

> ⚠️ **Warning:** `for...in` walks the prototype chain — use `Object.hasOwn(obj, key)` inside the loop to guard against inherited properties, or use `Object.keys()` / `Object.entries()` instead, which only return own properties.