---
title: "Memory Management"
category: "nodejs"
chapterId: "node-advanced-performance"
slug: "node-memory-management"
description: "Identifying memory leaks with heap snapshots, diagnostic reports, and V8 flags."
---

# Memory Management

## How Node.js allocates memory

- **V8 Heap**: JS objects, strings, closures.
- **Off-heap**: Buffers, native bindings.
- Default heap limit: ~1.5 GB (adjustable with `--max-old-space-size`).

## Common causes of memory leaks

- Event listeners never removed (growing `EventEmitter` subscriptions).
- Global variables accumulating data.
- Closures holding references to large objects.
- Timers (`setInterval`) never cleared.

## Detecting leaks

### Heap snapshot in Chrome DevTools

```bash
node --inspect app.js
```

Open `chrome://inspect` → take two heap snapshots and compare allocations.

### Diagnostic report

```bash
node --report-uncaught-exception app.js
# or programmatically:
process.report.writeReport();
```

### Monitor memory at runtime

```js
setInterval(() => {
  const { heapUsed, heapTotal } = process.memoryUsage();
  console.log(`Heap: ${(heapUsed / 1024 / 1024).toFixed(1)} MB`);
}, 5000);
```

## V8 flags

```bash
# Increase heap limit for memory-heavy apps
node --max-old-space-size=4096 app.js

# Expose GC for manual triggering (dev only)
node --expose-gc app.js
```

```js
if (global.gc) global.gc(); // force GC (--expose-gc required)
```

## Best practices

- Remove event listeners when no longer needed (`.removeListener()` / `.off()`).
- Use `WeakMap` / `WeakRef` for caches that should not prevent GC.
- Keep long-lived objects small — avoid storing entire request objects.
