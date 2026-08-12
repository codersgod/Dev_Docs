---
title: "Microtask Queues"
category: "nodejs"
chapterId: "node-architecture"
slug: "node-microtask-queues"
description: "process.nextTick() and Promise queues between every event loop phase."
---

# Microtask Queues

## What is it?

Node.js has two important microtask queues:

- **`process.nextTick()` Queue**: Holds callbacks scheduled by process.nextTick(). This has the absolute highest priority in the asynchronous lifecycle.
- **Promises Microtask Queue**: Holds resolved Promise callbacks (e.g., .then(), .catch(), async/await continuations)

These run between event loop phases.

---
## Priority

`process.nextTick()` runs before Promise microtasks.

```js
setTimeout(() => console.log('timer'), 0);

Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));

console.log('sync');
// sync -> nextTick -> promise -> timer
```
## process.nextTick()

It is an essential function that allows developers to schedule a callback to run immediately after the current operation completes, but before the event loop continues to the next phase. 

### Why Use process.nextTick()?
- **Error Handling**: It helps handle errors immediately after the current function finishes, without delaying the event loop. This can be crucial in handling errors in asynchronous operations.


```js
//without nextTick()
const e = new (require('events'))();
e.emit('error', new Error('Crash!')); // Fires immediately
e.on('error', (err) => console.log(err.message)); // Too late to catch it

//With nextTick()
const e = new (require('events'))();
process.nextTick(() => e.emit('error', new Error('Caught!'))); // Waits
e.on('error', (err) => console.log(err.message)); // Registered in time

```
- **Control Execution Order**: It allows you to control the execution of your callbacks. You can ensure that your callbacks run after the current call stack clears, but before the event loop continues to the next phase (like I/O operations).

```js
let bar;

function someAsyncApiCall(callback) {
  process.nextTick(callback); // sending it to the microtask waiting line instead of running it immediately
  //callback(); // 🔴 Runs instantly (synchronously)-> O/p bar is undefiend
}

someAsyncApiCall(() => {
  console.log('bar', bar); // Output: 1
});
bar = 1;
```
In this example, even though bar is assigned after the process.nextTick() call, the callback still executes with the updated value of bar because **process.nextTick() ensures the callback runs after the current function finishes**.

## nested process.nextTick() calls
```js
setTimeout(() => {
  console.log('6. setTimeout (Timers Phase)');
}, 0);

process.nextTick(() => {
  console.log('2. First nextTick');
  
  process.nextTick(() => {
    console.log('4. Nested nextTick');
    
    process.nextTick(() => {
      console.log('5. Deeply Nested nextTick');
    });
  });
});

process.nextTick(() => {
  console.log('3. Second nextTick');
});

console.log('1. Synchronous Main Script');

```

## Warning

Too many recursive `process.nextTick()` calls can starve I/O.
