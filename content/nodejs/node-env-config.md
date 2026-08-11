---
title: "Environment Configuration"
category: "nodejs"
chapterId: "node-modules-tooling"
slug: "node-env-config"
description: "process.env, .env file security, and native loadEnvFile (Node 20+)."
---

# Environment Configuration

## process.env

Node.js exposes environment variables through `process.env`.

```js
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

## .env files

Store secrets and config outside source code. Never commit `.env` to git.

```
# .env
PORT=3000
DATABASE_URL=postgres://localhost:5432/mydb
JWT_SECRET=supersecret
```

Add `.env` to `.gitignore`:

```
.env
.env.local
.env.production
```

## dotenv (traditional)

```bash
npm install dotenv
```

```js
import 'dotenv/config';   // ESM
// or
require('dotenv').config(); // CJS

console.log(process.env.PORT); // 3000
```

## Native loadEnvFile (Node 20+)

No external package needed:

```js
process.loadEnvFile('.env');
console.log(process.env.PORT); // 3000
```

## Best practices

- Use different `.env` files per environment: `.env.development`, `.env.production`.
- Validate required env vars at startup — fail fast if they are missing.
- Never log `process.env` directly (it may expose secrets).

```js
const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
}
```
