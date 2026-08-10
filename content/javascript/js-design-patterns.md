---
title: "Design Patterns"
category: "javascript"
chapterId: "js-oop-patterns"
slug: "js-design-patterns"
description: "Module, Singleton, Factory, and Observer (Pub/Sub) patterns."
---

# Design Patterns

## Module Pattern

Encapsulate private state using closures. The original ES5 approach to private scope.

```js
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
```

## Singleton Pattern

Ensure only one instance of an object exists.

```js
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
```

## Factory Pattern

Create objects without specifying the exact class.

```js
function createUser(type) {
  const base = { createdAt: new Date() };
  if (type === 'admin') return { ...base, role: 'admin', permissions: ['read', 'write', 'delete'] };
  if (type === 'guest') return { ...base, role: 'guest', permissions: ['read'] };
  return { ...base, role: 'user', permissions: ['read', 'write'] };
}

const admin = createUser('admin');
const guest = createUser('guest');
```

## Observer (Pub/Sub) Pattern

Components communicate without direct references.

```js
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
emitter.on('login', user => console.log(`Welcome ${user.name}`));
emitter.emit('login', { name: 'Alice' }); // 'Welcome Alice'
```

> ⚠️ **Warning:** Singletons make testing hard because they share state across tests. Reset or mock them in test setups.
