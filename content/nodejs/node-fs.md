---
title: "File System (fs)"
category: "nodejs"
chapterId: "node-core-modules"
slug: "node-fs"
description: "Sync vs async methods, directory streams, and fs.watch()."
---

# File System (fs)

## What is it?

`fs` and `fs/promises` provide file and directory operations in Node.js (allows you to interact with your computer's files). 
- supports both `synchronous (blocking)` and `asynchronous (non-blocking)` methods to read, write, update, rename, copy, and delete files.

## Sync vs Async

- Sync APIs block the event loop (`readFileSync`).
- Async APIs keep the app responsive (`readFile`, `fs/promises`).

```js
import { readFile } from 'node:fs/promises';

const text = await readFile('notes.txt', 'utf8');
console.log(text);
```

## Directory streams

Use `opendir`/async iteration for large folders without loading everything at once.

```js
import { opendir } from 'node:fs/promises';

const dir = await opendir('.');
for await (const entry of dir) {
  console.log(entry.name);
}
```
## Methods breakdown:
- `readFile` / `writeFile` / `appendFile`: Reads, overwrites, or adds text to a file.
- `copyFile` / `rename` / `unlink`: Copies, renames, or completely deletes (unlink) a file.
- `mkdir` / `readdir` / `rmdir` / `rm`: Creates, lists, or destroys folders and nested items.
- `truncate`: Chops down or resizes a file's content to a specific length.

## Watching files

`fs.watch()` listens for change events, but behavior can vary by OS.
