---
title: "Worker Threads"
category: "nodejs"
chapterId: "node-advanced-performance"
slug: "node-worker-threads"
description: "Offload CPU-intensive tasks with worker_threads without blocking the Event Loop."
---

# Worker Threads

## Why?

CPU-intensive work (image processing, cryptography, parsing) blocks the event loop. Worker threads run JS in parallel on separate threads with their own V8 instance.

## Basic usage

```js
// main.js
import { Worker } from 'worker_threads';

const worker = new Worker('./cpu-task.js', {
  workerData: { input: 42 }
});

worker.on('message', (result) => console.log('Result:', result));
worker.on('error', (err) => console.error(err));
worker.on('exit', (code) => console.log('Worker exited with code', code));
```

```js
// cpu-task.js
import { workerData, parentPort } from 'worker_threads';

function heavyCompute(n) {
  let sum = 0;
  for (let i = 0; i < n * 1_000_000; i++) sum += i;
  return sum;
}

parentPort.postMessage(heavyCompute(workerData.input));
```

## Shared memory

Workers can share memory via `SharedArrayBuffer` and synchronise with `Atomics`.

```js
const shared = new SharedArrayBuffer(4);
const arr = new Int32Array(shared);

// Worker and main thread both access arr[0]
Atomics.add(arr, 0, 1);
```

## Worker Thread vs cluster

| | `worker_threads` | `cluster` |
|---|---|---|
| Purpose | CPU tasks | Network I/O scaling |
| Memory | Shared (SharedArrayBuffer) | Separate process |
| Communication | `postMessage` | IPC |
