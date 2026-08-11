---
title: "Concurrency Model"
category: "nodejs"
chapterId: "node-fundamentals"
slug: "node-concurrency-model"
description: "How one thread handles thousands of concurrent requests without blocking."
---

# Concurrency Model

## The myth: "Node.js can only do one thing at a time"

The **JavaScript thread** does only one thing at a time — but the **system** does many things in parallel in the background. Node.js delegates slow work and keeps the main thread free to accept new requests continuously.

## How it works in practice

```
Request 1 → read DB → [handed to libuv] → main thread free
Request 2 → read DB → [handed to libuv] → main thread free
Request 3 → read DB → [handed to libuv] → main thread free

          ... time passes ...

libuv: DB result for Request 1 → callback queued
libuv: DB result for Request 2 → callback queued
libuv: DB result for Request 3 → callback queued

Event loop picks up each callback and sends responses.
```

At no point did the main thread sit idle waiting. It handled three requests and their responses on a single thread.

## Analogy

Think of a **waiter in a restaurant**:
- Takes Order 1 → hands it to the kitchen (non-blocking)
- Takes Order 2 → hands it to the kitchen
- Takes Order 3 → hands it to the kitchen
- Kitchen (libuv) prepares all orders in parallel
- Waiter delivers each order when it's ready

The waiter never cooks — they only orchestrate. That's the Node.js event loop.

## Limits of the model

| Task type | Good fit? | Why |
|---|---|---|
| I/O-heavy (APIs, DBs, files) | Yes | Waiting is offloaded |
| CPU-heavy (video encode, ML) | No | Blocks the main thread |
| High concurrency web servers | Yes | Single thread, no context-switching overhead |
| Parallel computation | No | Use `worker_threads` or a different runtime |

For CPU-heavy work, use **worker_threads** to move computation off the main thread.
