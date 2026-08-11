---
title: "Testing"
category: "nodejs"
chapterId: "node-testing-debugging"
slug: "node-testing"
description: "Jest, Mocha, Chai, Supertest, and the native node:test runner."
---

# Testing

## Jest — most popular all-in-one

```bash
npm install -D jest
```

```js
// math.test.js
import { add } from './math.js';

describe('add()', () => {
  test('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('handles negatives', () => {
    expect(add(-1, 1)).toBe(0);
  });
});
```

### Mocking

```js
jest.mock('./db', () => ({
  findUser: jest.fn().mockResolvedValue({ id: 1, name: 'Alice' })
}));
```

## Supertest — HTTP endpoint testing

```bash
npm install -D supertest
```

```js
import request from 'supertest';
import app from './app.js'; // Express app

test('GET /users returns 200', async () => {
  const res = await request(app).get('/users');
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(3);
});
```

## Mocha + Chai

```bash
npm install -D mocha chai
```

```js
import { expect } from 'chai';
import { add } from './math.js';

describe('add()', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).to.equal(5);
  });
});
```

## Native node:test runner (Node 18+)

No install required:

```js
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('add()', () => {
  test('adds two numbers', () => {
    assert.equal(add(2, 3), 5);
  });
});
```

```bash
node --test
```

## Best practices

- Unit test pure functions; integration test routes via Supertest.
- Use `beforeEach` / `afterEach` to reset state between tests.
- Aim for fast tests — mock I/O (DB, network) in unit tests.
