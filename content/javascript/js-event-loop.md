---
title: "Event Loop"
category: "javascript"
chapterId: "js-async-runtime"
slug: "js-event-loop"
description: "Call Stack, Web APIs, Macrotask Queue, and Microtask Queue."
---

# Event Loop

## What is it?

The **Event Loop** is the mechanism that lets JavaScript perform non-blocking async tasks despite being **single-threaded** — it can only execute one piece of code at a time.

---

## How it works — step by step

1. JS executes synchronous code on the **Call Stack**.
2. Async tasks (API calls, timers) are handed off to the **browser (Web APIs)**.
3. Once completed, their callbacks are placed into queues.
4. The Event Loop constantly checks: *is the Call Stack empty?* If yes, it moves the next callback from a queue onto the Stack to execute.

---

## Visual overview

![Event Loop diagram](/event_loop.png)

---

## The Step-by-Step Loop Cycle

The Event Loop is a continuous, never-ending `while` loop. It follows a strict 4-step ritual:

```
[ Call Stack ]  ◄─── (If Empty, Move First Item) ───┐
      │                                               │
 (Executes Code)                           [ Microtask Queue ]
      │                                       (VIP Line: Promises)
      ▼                                               ▲
[ Web APIs ] ──── (When Done, Push Callback) ─────────┤
 (Timers/Fetch)                                       │
      │                                               │
 (When Done, Push Callback) ──────────────────────────┘
      ▼
[ Macrotask Queue ]
 (Regular Line: setTimeout / setInterval)
```

**Reading it:**
1. Sync code runs on the **Call Stack** first
2. Async work is offloaded to **Web APIs** (browser runtime)
3. When Web APIs finish, callbacks go into the **Microtask Queue** (Promises) or **Macrotask Queue** (timers)
4. The Event Loop picks from **Microtask Queue first** (entire queue) → then one item from **Macrotask Queue**
---

**Note**:  
- **Microtask Queue**: The Event Loop will drain the `entire queue` until it is completely empty. If a microtask adds another microtask, the loop will stay there and run that one too.
- **Macrotask Queue**: The Event Loop picks `exactly one item`, executes it on the Call Stack, and then immediately stops to re-check the Microtask Queue again.

---

## The components

| Component | Role |
|---|---|
| **Call Stack** | Executes sync code — LIFO (last in, first out) |
| **Web APIs** | Browser handles async ops (fetch, setTimeout, DOM events) |
| **Microtask Queue** | Promise callbacks (`.then`, `.catch`, `await`) |
| **Macrotask Queue** | `setTimeout`, `setInterval`, DOM event callbacks |

---

## The critical rule — Microtasks vs Macrotasks

> The Event Loop **always clears the entire Microtask Queue** before picking the next single task from the Macrotask Queue.

```js
console.log('1 — sync');

setTimeout(() => console.log('4 — macrotask'), 0);

Promise.resolve()
  .then(() => console.log('2 — microtask'))
  .then(() => console.log('3 — microtask 2'));

// Output: 1, 2, 3, 4
```

**Why:** Sync runs first → all microtasks drain → only then does setTimeout fire.

---

## Full execution order example

```js
console.log('start');

setTimeout(() => console.log('timeout'), 0);        // → Macrotask Queue

fetch('/api')
  .then(r => r.json())
  .then(() => console.log('fetch done'));            // → Microtask Queue

Promise.resolve().then(() => console.log('micro')); // → Microtask Queue

console.log('end');

// start → end → micro → fetch done → timeout
```

---

## Interview tip — Execution order rule

When given a mixed snippet, remember:

1. **Synchronous code** runs first (Call Stack)
2. **Microtasks** run next — Promises, `await` continuations
3. **Macrotasks** run last — `setTimeout`, `setInterval`

---

## Senior pitfall — Microtask Queue Starvation

**The problem:** If a microtask recursively schedules another microtask (e.g., infinite promise loop or `queueMicrotask()` calling itself), the Macrotask Queue is never reached.

**The impact:** The browser freezes. Elements become unclickable, animations stop — because user interactions and rendering are handled alongside macrotasks.

```js
// ❌ Starves the macrotask queue — browser freezes
function infiniteMicrotask() {
  Promise.resolve().then(infiniteMicrotask);
}
infiniteMicrotask();
```

> ⚠️ **Warning:** Long-running sync code also blocks the Call Stack — no events, clicks, or renders happen. Break heavy work into chunks with `setTimeout(fn, 0)` or `requestIdleCallback`.