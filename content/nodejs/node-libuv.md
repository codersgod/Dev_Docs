---
title: "Libuv & Thread Pool"
category: "nodejs"
chapterId: "node-architecture"
slug: "node-libuv"
description: "C++ I/O abstraction, async management, and the system thread pool."
---

# Libuv & Thread Pool

## What is it?

**libuv** is the C/C++ library under Node.js that powers async I/O and the event loop.

It handles:
- File system operations
- DNS lookups
- Some crypto operations
- Cross-platform async behavior

## Thread pool

libuv uses a worker pool (default: **4 threads**) for tasks that cannot be done directly in the event loop thread.

```bash
# Increase thread pool size (before starting Node)
set UV_THREADPOOL_SIZE=8
node app.js
```

## Quick mental model

- JavaScript runs on one main thread.
- Slow system tasks can run in libuv worker threads.
- Completion callbacks come back to the event loop.

## Why it matters

If many heavy fs/crypto tasks run together, the thread pool can become a bottleneck.
