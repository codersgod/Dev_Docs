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

## Where to use it
- **Configuration**: Reading .json or .env files to boot up application settings.
- **Logging**: Writing real-time error messages and user activity logs into .log text files.
- **File Uploads**: Saving profile pictures, PDFs, or videos uploaded by users onto a web server.

```js
import fs from 'node:fs/promises';

// 1. Write data to a new file
await fs.writeFile('note.txt', 'Hello World!');

// 2. Read data back from the file (specify 'utf8' encoding to get text, not a raw Buffer!)
const content = await fs.readFile('note.txt', 'utf8');

console.log(content); // Output: Hello World!

```

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
