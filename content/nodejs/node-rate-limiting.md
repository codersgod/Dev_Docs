---
title: "Rate Limiting & CORS"
category: "nodejs"
chapterId: "node-security"
slug: "node-rate-limiting"
description: "Preventing DDoS/brute-force attacks and managing Cross-Origin Resource Sharing."
---

# Rate Limiting & CORS

## Rate limiting

Caps the number of requests a client can make in a time window — defends against brute-force and DDoS.

```bash
npm install express-rate-limit
```

```js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later.' }
});

app.use('/api', limiter);
```

For stricter endpoints (login, password reset):

```js
const authLimiter = rateLimit({ windowMs: 60_000, max: 5 });
app.use('/api/auth', authLimiter);
```

## CORS (Cross-Origin Resource Sharing)

Controls which origins can call your API from a browser.

```bash
npm install cors
```

```js
import cors from 'cors';

// Allow all origins (not recommended for production)
app.use(cors());

// Restrict to specific origins
app.use(cors({
  origin: ['https://myapp.com', 'https://staging.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true   // allow cookies / auth headers
}));
```

## Key rules

- Always set `cors()` before route definitions.
- Do not use `origin: '*'` with `credentials: true` — browsers reject it.
- Use environment variables for allowed origins so they differ between dev and prod.
- Pair rate limiting with a reverse proxy (Nginx) for IP-level blocking at scale.
