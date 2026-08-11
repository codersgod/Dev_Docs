---
title: "Framework Ecosystem"
category: "nodejs"
chapterId: "node-frameworks-api"
slug: "node-frameworks"
description: "Express, Koa, Fastify, and NestJS — when to use each."
---

# Framework Ecosystem

## Express.js — minimalist, most popular

```js
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Hello'));
app.listen(3000);
```

- Huge middleware ecosystem (passport, multer, helmet, cors…).
- Flexible with no opinions on structure.
- Callback-based — async errors must be passed to `next(err)`.

## Koa.js — modern Express successor

```js
import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => { ctx.body = 'Hello'; });
app.use(router.routes());
app.listen(3000);
```

- Uses `async/await` natively — no callback hell.
- Smaller core; bring your own middleware for body parsing, routing.

## Fastify — high-performance

```js
import Fastify from 'fastify';

const app = Fastify();

app.get('/', async () => ({ hello: 'world' }));
app.listen({ port: 3000 });
```

- Up to 2× faster than Express on benchmarks.
- Built-in JSON schema validation and serialisation.
- TypeScript-friendly out of the box.

## NestJS — enterprise / structured

```ts
@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string { return 'All cats'; }
}
```

- TypeScript-first with decorators.
- Dependency Injection, modules, guards, interceptors, pipes.
- Opinionated structure similar to Angular.

## Quick comparison

| | Express | Koa | Fastify | NestJS |
|---|---|---|---|---|
| Speed | Moderate | Moderate | Very fast | Moderate |
| Learning curve | Low | Low | Low | High |
| Structure | None | None | None | Enforced |
| TypeScript | Manual | Manual | Good | Native |
| Best for | General | APIs | Performance | Enterprise |
