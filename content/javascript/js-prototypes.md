---
title: "Prototypes"
category: "javascript"
chapterId: "js-functions-objects"
slug: "js-prototypes"
description: "Prototype chain, __proto__, and prototypal inheritance."
---

# Prototypes

## What is it?

Every JavaScript object has an internal link to another object called its **prototype**. When you access a property, JS looks on the object first, then walks up the prototype chain until it finds it or hits `null`.

## How to use it

```js
const animal = {
  breathe() { console.log('breathing'); }
};

const dog = Object.create(animal); // dog's prototype = animal
dog.bark = function() { console.log('woof'); };

dog.bark();    // 'woof'     — found on dog
dog.breathe(); // 'breathing' — found on animal (via prototype chain)
```

## __proto__ and prototype

```js
function Person(name) { this.name = name; }
Person.prototype.greet = function() { return `Hi, I'm ${this.name}`; };

const alice = new Person('Alice');
alice.greet(); // "Hi, I'm Alice"

alice.__proto__ === Person.prototype // true
```

## Prototype chain

```js
// alice → Person.prototype → Object.prototype → null
alice.toString(); // found on Object.prototype
alice.nonExistent; // undefined — reached null, not found
```

## Class syntax (modern)

Classes are syntactic sugar over prototype-based inheritance:

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound.`; }
}

class Dog extends Animal {
  speak() { return `${this.name} barks.`; }
}

const d = new Dog('Rex');
d.speak(); // 'Rex barks.'
d instanceof Dog;    // true
d instanceof Animal; // true
```

> ⚠️ **Warning:** Avoid mutating `Object.prototype` — it affects all objects in the entire runtime.
