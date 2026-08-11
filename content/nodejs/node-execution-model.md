---
title: "Execution Model"
category: "nodejs"
chapterId: "node-architecture"
slug: "node-execution-model"
description: "Single-threaded JS execution with multi-threaded background system tasks."
---

# Execution Model

## What is it?

Node.js executes JavaScript in a **single thread**, but uses OS + libuv worker threads behind the scenes for async system work.

## Simple breakdown

- JS logic: one main thread (event loop)
- I/O and some heavy tasks: handled outside that thread
- Callbacks/promises: scheduled back onto the event loop

## Example pattern

```js
import { readFile } from 'node:fs/promises';

console.log('A');
readFile('data.txt', 'utf8').then(() => console.log('B'));
console.log('C');

// A -> C -> B
```

## Why it matters

- CPU-heavy JS still blocks requests.
- Async I/O keeps servers responsive.
- For CPU jobs, use `worker_threads` or external services.
