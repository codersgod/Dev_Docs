---
title: "NoSQL Databases"
category: "nodejs"
chapterId: "node-databases"
slug: "node-nosql-db"
description: "MongoDB for documents and Redis for caching and session management."
---

# NoSQL Databases

## MongoDB — document store

```bash
npm install mongodb
```

```js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();

const db = client.db('myapp');
const users = db.collection('users');

// Insert
await users.insertOne({ name: 'Alice', age: 30 });

// Find with filter
const user = await users.findOne({ name: 'Alice' });

// Update
await users.updateOne({ name: 'Alice' }, { $set: { age: 31 } });

// Delete
await users.deleteOne({ name: 'Alice' });
```

## Redis — in-memory key-value store

Best for: caching, rate limiting, pub/sub, session storage.

```bash
npm install ioredis
```

```js
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache-aside pattern
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.findUserById(id);
  await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 3600); // TTL 1 hour
  return user;
}
```

## Redis pub/sub

```js
const publisher  = new Redis();
const subscriber = new Redis();

subscriber.subscribe('notifications');
subscriber.on('message', (channel, message) => {
  console.log(`[${channel}] ${message}`);
});

publisher.publish('notifications', JSON.stringify({ event: 'user.signup', id: 1 }));
```

## MongoDB vs Redis

| | MongoDB | Redis |
|---|---|---|
| Data model | Documents (JSON) | Key-value, lists, sets |
| Persistence | Yes (disk) | Optional |
| Best for | Primary data store | Cache, sessions, queues |
| Query power | Rich query language | Simple key lookups |
