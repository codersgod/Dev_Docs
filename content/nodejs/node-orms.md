---
title: "ORMs"
category: "nodejs"
chapterId: "node-databases"
slug: "node-orms"
description: "Prisma, Sequelize, Mongoose, and TypeORM for database abstraction."
---

# ORMs

## Prisma — TypeScript-first, schema-driven

```bash
npm install prisma @prisma/client
npx prisma init
```

```prisma
// schema.prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  posts Post[]
}
```

```ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const user = await prisma.user.create({
  data: { name: 'Alice', email: 'alice@example.com' }
});

const users = await prisma.user.findMany({ where: { name: 'Alice' } });
```

## Sequelize — mature, multi-dialect

```bash
npm install sequelize pg
```

```js
import { Sequelize, DataTypes } from 'sequelize';

const db = new Sequelize(process.env.DATABASE_URL);

const User = db.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true }
});

await db.sync();
const user = await User.create({ name: 'Alice', email: 'alice@example.com' });
```

## Mongoose — MongoDB ODM

```bash
npm install mongoose
```

```js
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true }
});

const User = mongoose.model('User', userSchema);
const user = await User.create({ name: 'Alice', email: 'alice@example.com' });
```

## Comparison

| | Prisma | Sequelize | Mongoose | TypeORM |
|---|---|---|---|---|
| Database | SQL | SQL | MongoDB | SQL |
| Language | TypeScript | JS/TS | JS/TS | TypeScript |
| Migrations | Built-in | Built-in | Manual | Built-in |
| Type safety | Excellent | Moderate | Moderate | Good |
| Learning curve | Low | Medium | Low | Medium |
