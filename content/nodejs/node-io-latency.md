---
title: "RAM vs I/O Latency"
category: "nodejs"
chapterId: "node-fundamentals"
slug: "node-io-latency"
description: "Why Node.js is optimized for I/O-heavy tasks — eliminating CPU idle time."
---

# RAM vs I/O Latency

## The latency gap

Operations have vastly different speeds. Understanding this explains why the non-blocking model matters so much.

| Operation | Approx. time | Relative |
|---|---|---|
| CPU register access | 0.3 ns | 1× |
| L1 cache | 1 ns | 3× |
| RAM access | 100 ns | 300× |
| SSD read | 100 µs | 300,000× |
| Network round-trip (LAN) | 500 µs | 1,500,000× |
| DB query (network) | 1–10 ms | 3,000,000–30,000,000× |
| HTTP API call | 50–500 ms | up to 1,500,000,000× |

## Why this matters for Node.js

In a traditional **blocking thread** model:

```
Thread 1: [JS] → [waiting for DB 10ms] → [JS]
Thread 2: [JS] → [waiting for DB 10ms] → [JS]
Thread 3: [JS] → [waiting for DB 10ms] → [JS]
```

Each thread wastes millions of CPU cycles just waiting. You need many threads to stay busy.

In Node.js **non-blocking model**:

```
Thread:  [JS] → [hand DB req to libuv] → [JS] → [JS] → [JS]
libuv:            [DB waiting ............. result] → callback queued
```

The single thread never waits. It does useful JS work while I/O completes in the background.

## The key insight

Node.js is optimized for **I/O-heavy** workloads because it eliminates the CPU idle time caused by slow data transfers.

- Network I/O = milliseconds of waiting = libuv handles it
- JavaScript on RAM = nanoseconds = main thread handles it

The JS thread does only the fast work; the slow work is completely offloaded.

## Not a good fit for CPU-heavy work

If a task burns CPU instead of waiting (video encoding, image processing, cryptography), it **blocks the thread** just as badly as blocking I/O. For those cases, use `worker_threads`.
