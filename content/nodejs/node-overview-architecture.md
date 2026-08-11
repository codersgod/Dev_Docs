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

- **Single-Threaded**: Node.js **executes all JavaScript code on one single main thread** (using Google’s V8 engine). It avoids the high memory cost of creating a new thread for every user connection.
 
- **Non-Blocking I/O**: When a **request requires disk or network access** (I/O), Node.js offloads it to the OS or a background C++ thread pool (libuv). The **main thread immediately handles the next request** without waiting for the data to return.
 
- **Event-Driven**: The core engine runs a continuous Event Loop. This **loop constantly monitors for completed background tasks, system events, or incoming network requests, orchestrating when code executes**.
 
- **Callbacks**: When an **asynchronous task finishes, its completion function (the callback) is pushed into a queue**. As soon as the main execution stack is empty, the Event Loop pulls the callback from the queue to process the returned data.
---
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

## Node.js Working Mechanism: 
 
### **The Event Loop (The Coordinator)**
- **Thread**: Main JavaScript Thread.
- **Tasks**: **Runs your JavaScript logic**, handles if/else checks, manages timers (setTimeout), and **runs callbacks once background work finishes**.
### **The Worker Pool (The Local Heavy Lifters)**
- **Thread**: 4 background C++ threads (via libuv).
- **Tasks**: Handles slow, blocking operations that require high CPU or hard drive usage. This includes **file management (fs)**, **password hashing/encryption (crypto)**, and **data compression (zlib)**.
### **Libuv / OS Kernel (The Network Experts)**
- **Thread**: No Node.js threads used (delegated natively to the Operating System).
- **Tasks**: **Handles all network-based I/O**. This includes **database queries** (MySQL, MongoDB), external **API calls** (fetch), and maintaining active **web sockets**. 
- The OS handles these in the background and alerts Node.js when data arrives.
---
## Why single-threaded works at scale

Node.js scales because it **never idles**. While one request waits for a database, the main thread is already serving ten more requests. I/O latency (milliseconds) is handled in the background; the JS thread only performs CPU work (nanoseconds).

---
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