---
title: "Streams"
category: "nodejs"
chapterId: "node-core-modules"
slug: "node-streams"
description: "Readable, Writable, Duplex, Transform streams with backpressure basics."
---

# Streams

## What is it?

Streams **process data in chunks** instead of loading everything into memory.

## Why to use streams
- **Memory efficiency**: Streams handle large files without consuming excessive memory.
- **Performance**: Streams allow for faster data processing by working with chunks as they arrive.

## Types

- **Readable**: read from source (`fs.createReadStream`)
- **Writable**: write at destination (`fs.createWriteStream`)
- **Duplex**: read + write (`net.Socket`)
- **Transform**: modifies data (`zlib`, custom transforms)

```js
const fs = require('fs');
const http = require('http');

http.createServer((req, res) => {
  // 1. Open a steady, chunked reading pipeline
  const stream = fs.createReadStream('huge-movie.mp4');
  
  // 2. Pour chunks straight to the network response as they load
  stream.pipe(res); 
}).listen(8080);

```
## Example with backpressure-safe piping

```js
import { createReadStream, createWriteStream } from 'node:fs';

createReadStream('large.log')
  .pipe(createWriteStream('copy.log'));
```

`pipe()` helps manage backpressure automatically.

## Common mistakes

- Reading huge files with `readFile` unnecessarily
- Forgetting to handle stream errors

## Buffer vs. Stream Comparison

| Feature | Buffer 📦 | Stream 🌊 |
|---|---|---|
| What it is | A temporary holding container (physical memory space) for raw binary bytes. | The moving pipeline that transfers data piece-by-piece over time. |
| Data Size | Handles a fixed size of data that must fit inside the allocated space. | Handles infinite sizes of data by chopping it into small chunks. |
| Memory Limit | Limited by available system RAM (can crash your app if data is too big). | Virtually no limit because it loads, processes, and discards chunks. |
| Analogy | A bucket holding a fixed amount of water. | The hose/river continuously moving water from a tap to a drain. |
| Best Used For | Inspecting or altering specific bytes, strings, or image headers. | Moving massive files, video broadcasting, or handling ongoing network data. |

- **Buffer**: A temporary bucket in memory that holds a fixed amount of raw data.
- **Stream**: The pipeline that continuously moves that data piece-by-piece over time.
- **How they work together**: A stream reads data in small chunks, parks each chunk in a buffer, processes it, and moves to the next chunk.