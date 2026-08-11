---
title: "Async Patterns"
category: "nodejs"
chapterId: "node-async-control"
slug: "node-async-patterns"
description: "Callbacks, Promises, and async/await — and escaping Callback Hell."
---

# Async Patterns

## Callbacks

The original Node.js async style. Functions accept a `(err, result)` callback.
- **Error-first callbacks** – Node standard pattern in all of its core modules. The first argument is always an error object (or `null` if no error), and the second argument is the result.

```js
const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

**Callback Hell** happens when callbacks nest deeply:

```js
getUser(id, (err, user) => {
  getPosts(user.id, (err, posts) => {
    getComments(posts[0].id, (err, comments) => {
      // deeply nested and hard to maintain
    });
  });
});
```

## Promises

Flatten the nesting and chain operations cleanly.

```js
getUser(id)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err));
```

## async / await

Syntactic sugar over Promises — reads like synchronous code.

```js
async function loadData(id) {
  const user = await getUser(id);
  const posts = await getPosts(user.id);
  const comments = await getComments(posts[0].id);
  return comments;
}
```

## Key rules

- Always handle rejections (`.catch()` or `try/catch`).
- Never mix `await` and `.then()` on the same value — pick one style.
- `await` only pauses the current `async` function, not the event loop.
