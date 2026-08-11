---
title: "REST APIs"
category: "nodejs"
chapterId: "node-frameworks-api"
slug: "node-rest-apis"
description: "Routing, HTTP methods, status codes, query params, and body parsing."
---

# REST APIs

## HTTP method semantics

| Method | Action | Idempotent |
|---|---|---|
| GET | Read | Yes |
| POST | Create | No |
| PUT | Replace | Yes |
| PATCH | Partial update | No |
| DELETE | Delete | Yes |

Note: Idempotent means that making the same request multiple times has the same effect as making it once.

- **POST instead of PUT**: Breaks retries. Browsers block automatic retries on network drops to prevent duplicate actions or double-charging.
- **PUT instead of POST**: Breaks security/caching. PUT targets specific URIs (e.g., /users/45). Using it on general endpoints risks accidental data overwrites.

## Status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No content |
| 400 | Bad request |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 422 | Unprocessable entity |
| 500 | Internal server error |

## Express example — full CRUD

```js
import express from 'express';

const app = express();
app.use(express.json()); // body parser

// Query params: GET /posts?page=2&limit=10
app.get('/posts', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  res.json({ page, limit, data: [] });
});

// Route params: GET /posts/42
app.get('/posts/:id', (req, res) => {
  res.json({ id: req.params.id });
});

// Create
app.post('/posts', (req, res) => {
  const post = req.body; // parsed JSON
  res.status(201).json(post);
});

// Update
app.patch('/posts/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

// Delete
app.delete('/posts/:id', (req, res) => {
  res.sendStatus(204);
});

app.listen(3000);
```

## Best practices

- Version your API: `/api/v1/posts`.
- Return consistent error shapes: `{ error: string, code?: string }`.
- Validate request bodies before processing (use `zod` or `joi`).
- Never expose internal error messages to clients in production.
