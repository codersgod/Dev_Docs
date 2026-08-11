---
title: "What is Node.js"
category: "nodejs"
chapterId: "node-fundamentals"
slug: "node-what-is-nodejs"
description: "Open-source JS runtime built on V8 for running JavaScript outside the browser."
---

# What is Node.js

## Definition

Node.js is an **open-source, cross-platform runtime environment** that lets you run JavaScript outside the browser — primarily for building backend and server-side applications.

It is not a framework or a language. It is a **runtime** that wraps the V8 engine and exposes APIs for working with the file system, network, and OS.

## Built on V8

Node.js uses Google Chrome's **V8 JavaScript engine** to execute JavaScript:

1. V8 parses and compiles JavaScript into **native machine code**.
2. Machine code runs directly on the CPU — no interpreter in the middle.
3. Result: extremely fast JavaScript execution.

```
Your JS Code
    ↓
  V8 Engine  ←  Just-In-Time (JIT) compiler
    ↓
Machine Code → Executes on CPU
```

## What you can build with Node.js

- REST APIs and GraphQL servers
- Real-time apps (chat, live dashboards)
- CLI tools and build scripts
- Microservices
- Serverless functions

## What makes it different from browser JS

| | Browser JS | Node.js |
|---|---|---|
| Runtime | V8 + browser APIs | V8 + Node APIs |
| DOM access | Yes | No |
| File system | No | Yes (`fs` module) |
| OS access | No | Yes (`os`, `child_process`) |
| `window` / `document` | Yes | No |
| `process`, `Buffer` | No | Yes |
