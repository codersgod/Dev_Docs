---
title: "Node.js Architecture"
category: "nodejs"
chapterId: "node-fundamentals"
slug: "node-overview-architecture"
description: "Single-threaded, event-driven model with non-blocking I/O and a background thread pool."
---

# Node.js Architecture

## The core idea

Node.js uses a **single-threaded, event-driven architecture with non-blocking I/O**.

While the main thread runs only one task at a time, it handles massive concurrency by immediately offloading slow work to a background worker pool rather than sitting idle and waiting.

## Why **single-threaded, event-driven architecture with non-blocking I/O** ?

| Restaurant Element| Technical Component | What it does |
|---|---|---|
| The Cashier | Single Thread | Handles all initial incoming requests from users. |
| The Kitchen Staff | Background Thread Pool | Does the heavy, slow work away from the main window. |
| Taking the next order | Non-Blocking I/O | The server keeps accepting new user traffic while old requests process. |
| The Kitchen Timer Ding | Event-Driven Signal | An asynchronous callback tells the main thread a file or database query is ready. |

---

## Visual overview

![Node.js Architecture](/nodejs_arch.png)

---
## Four key components

```
┌─────────────────────────────────────────┐
│           Your JavaScript Code          │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────▼──────────┐
        │     Main Thread     │  ← Single-threaded JS
        │    (Event Loop)     │  ← Orchestrates everything
        └──────────┬──────────┘
                   │ delegates slow tasks
        ┌──────────▼──────────┐
        │   libuv Thread Pool │  ← C++ background workers
        │  (file I/O, crypto) │  ← Default: 4 threads
        └─────────────────────┘
```

### 1. Main Thread
Runs all your JavaScript code. Manages the **Event Loop** — the scheduler that decides what runs next.

### 2. Event Loop
Listens for completed tasks, schedules callbacks, and delivers results back to your JS code. It is the heartbeat of Node.js.

### 3. Non-Blocking I/O
Instead of waiting for a database reply or file read, Node.js sends the request off and **immediately moves to the next task**. When the result arrives, the callback is queued and called later.

### 4. Worker Pool (libuv)
A C++ background pool that handles OS-level heavy work — file system operations, DNS lookups, cryptography. Results are handed back to the event loop when done.

## Why single-threaded works at scale

Node.js scales because it **never idles**. While one request waits for a database, the main thread is already serving ten more requests. I/O latency (milliseconds) is handled in the background; the JS thread only performs CPU work (nanoseconds).

## Folder Structure
- **Controller Layer**: Handles API routes (Express), validates input, returns HTTP responses.
- **Service Layer**: Executes core business logic; isolated from HTTP and database details.
- **Data Access Layer**: Defines schemas, manages ORMs (Prisma/Mongoose), runs database queries.
- **Utils Layer**: Contains utility functions and helpers used across the application.
- **Middleware Layer**: Contains Express middleware for authentication, logging, error handling, etc.
- **Config Layer**: Holds configuration files, environment variables, and constants used throughout the application.

**Overview**
- **package.json** – Stores project information and dependencies.
- **node_modules/** – Contains installed npm packages.
- **app.js / server.js** – Main entry point of the application.
- **routes/** – Contains all route files.
- **controllers/** – Handles request logic.
- **models/** – Defines database schema / structure.
- **middlewares/** – Custom middleware functions.
- **config/** – Database and environment configuration.
- **public/** – Static files (CSS, JS, images).
- **views/** – Templates (EJS, Pug, Handlebars).
- **.env** – Environment variables.
- **.gitignore** – Files ignored by git.