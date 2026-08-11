---
title: "Relational Databases"
category: "nodejs"
chapterId: "node-databases"
slug: "node-relational-db"
description: "PostgreSQL, MySQL, SQLite with raw drivers and Knex.js query builder."
---

# Relational Databases

## pg — PostgreSQL raw driver

```bash
npm install pg
```

```js
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Parameterised query — safe from SQL injection
const { rows } = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);
```

## mysql2 — MySQL driver

```bash
npm install mysql2
```

```js
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL });
const [rows] = await conn.execute('SELECT * FROM users WHERE id = ?', [userId]);
```

## better-sqlite3 — synchronous SQLite (lightweight)

```bash
npm install better-sqlite3
```

```js
import Database from 'better-sqlite3';

const db = new Database('app.db');
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
```

## Knex.js — query builder

Write queries in JS instead of raw SQL strings. Works with PostgreSQL, MySQL, SQLite.

```bash
npm install knex pg
```

```js
import knex from 'knex';

const db = knex({ client: 'pg', connection: process.env.DATABASE_URL });

// Fluent API
const users = await db('users')
  .where({ active: true })
  .orderBy('created_at', 'desc')
  .limit(10);

// Transactions
await db.transaction(async (trx) => {
  const [id] = await trx('orders').insert({ user_id: 1, total: 99.99 });
  await trx('inventory').decrement('stock', 1).where({ product_id: 5 });
});
```

## Best practices

- Always use parameterised queries or a query builder — never string interpolation.
- Use connection pools, not a single connection.
- Run migrations (Knex, Flyway, or your ORM's migration tool) to version schema changes.
