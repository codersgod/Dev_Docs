---
title: "Node Philosophy"
category: "nodejs"
chapterId: "node-fundamentals"
slug: "node-philosophy"
description: "Small core, fast startup, modular design — complexity lives in npm packages."
---

# Node Philosophy

## Keep the core small

Node.js intentionally keeps its runtime minimal — only V8, libuv, and a small set of built-in APIs. This means:

- **Fast startup time** — less to initialise on boot.
- **Small memory footprint** — less built-in code loaded into RAM.
- **Stable, audited core** — fewer moving parts = fewer bugs.

Everything else (HTTP frameworks, ORMs, loggers, validators) lives in **npm packages**.

## Do one thing well

Each module should have a single, well-defined purpose. This is inherited from the Unix philosophy:

```
Small tool A | Small tool B | Small tool C
```

A Node.js app is composed of many small, focused modules rather than one large, monolithic library.

## npm as the extension mechanism

The npm registry (~3 million packages) is the escape hatch for everything the core doesn't provide:

```
Node core → provides: fs, http, path, crypto, events…
npm       → provides: express, lodash, zod, prisma, socket.io…
```

## Practical implications

```js
// Node core handles the basics
import { readFile } from 'fs/promises';
import { createServer } from 'http';

// npm handles everything else
import express from 'express';    // routing
import zod from 'zod';            // validation
import pino from 'pino';          // structured logging
```

## Trade-offs

| Benefit | Trade-off |
|---|---|
| Small, fast core | More npm dependencies per project |
| Modular composition | Dependency management complexity |
| Stable built-ins | npm ecosystem quality varies |
| Flexible stack | No enforced best practices |

The philosophy enables freedom and speed but requires developers to make thoughtful choices about which packages to trust.
