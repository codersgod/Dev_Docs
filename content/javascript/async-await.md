---
title: "Async / Await"
category: "javascript"
chapterId: "js-async"
slug: "async-await"
description: "Writing clean, readable asynchronous code with async/await syntax."
---

# Async / Await

`async/await` is syntactic sugar over Promises that lets you write asynchronous code that **reads like synchronous code**. Introduced in ES2017, it is the modern standard for handling asynchronous operations.

## 1. Definition

An `async` function always returns a Promise. Inside it, you can `await` any Promise — pausing execution at that line until the Promise resolves, without blocking the main thread.

## 2. Basic Syntax

```javascript
// Declare with the async keyword
async function fetchUser(userId) {
  // await pauses until the fetch Promise resolves
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return data; // This is automatically wrapped in a Promise
}

// Arrow function syntax
const getPost = async (id) => {
  const res = await fetch(`/api/posts/${id}`);
  return res.json();
};
```

## 3. Error Handling with try/catch

```javascript
async function loadDashboard(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (error) {
    // Handles network errors and non-ok responses
    console.error('Dashboard load failed:', error.message);
    return null;
  } finally {
    // Always runs — good for hiding loading spinners
    setLoading(false);
  }
}
```

## 4. Parallel Requests with Promise.all

When requests are **independent**, run them in parallel with `Promise.all` for maximum performance:

```javascript
// ❌ Sequential — takes totalTime = time1 + time2
const user = await fetchUser(id);
const posts = await fetchPosts(id);

// ✅ Parallel — takes totalTime = max(time1, time2)
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
]);
```

## 5. Real-World Fetch Pattern

```javascript
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`https://api.example.com${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    // Throw so the caller's catch block handles HTTP errors (4xx, 5xx)
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Usage
try {
  const data = await apiRequest('/users/1');
  console.log(data);
} catch (err) {
  console.error(err.message);
}
```

## 6. Common Pitfalls

> ⚠️ **`await` only works inside `async` functions.** Using it at the top level works in modern environments with ES Modules, but not in all contexts.

> ⚠️ **Unhandled Promise rejections.** Always wrap `await` calls in `try/catch` or attach `.catch()` to prevent silent failures.

> ⚠️ **Sequential awaits in loops.** `await` inside a `for...of` loop runs sequentially. For parallel execution, use `Promise.all(array.map(async item => ...))`.

> ⚠️ **`async` functions in `forEach` don't work as expected.** `forEach` ignores returned Promises. Use `for...of` or `Promise.all` with `.map()` instead.
