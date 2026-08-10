---
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

```js
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
```

## Using as an API response cache

```js
const apiCache = new LRUCache(50);

async function fetchUser(id) {
  const cached = apiCache.get(id);
  if (cached !== -1) return cached;

  const user = await fetch(`/api/users/${id}`).then(r => r.json());
  apiCache.put(id, user);
  return user;
}
```

> ⚠️ **Warning:** JS `Map` iteration is guaranteed in insertion order — this is what makes the O(1) LRU implementation possible without a doubly-linked list.
