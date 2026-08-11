---
title: "Crypto & Encryption"
category: "nodejs"
chapterId: "node-security"
slug: "node-crypto"
description: "Hashing, salting, bcrypt/argon2, and symmetric/asymmetric encryption."
---

# Crypto & Encryption

## Built-in `crypto` module

```js
import { createHash, randomBytes } from 'crypto';

// SHA-256 hash
const hash = createHash('sha256').update('hello').digest('hex');

// Secure random token
const token = randomBytes(32).toString('hex');
```

## Password hashing — bcrypt

Never store plain-text passwords. Use a slow, salted hash.

```bash
npm install bcrypt
```

```js
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hash on registration
const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);

// Compare on login
const match = await bcrypt.compare(plainPassword, hash);
```

## Password hashing — argon2 (stronger)

```bash
npm install argon2
```

```js
import argon2 from 'argon2';

const hash = await argon2.hash(password);
const valid = await argon2.verify(hash, password);
```

## Symmetric encryption (AES-256-GCM)

Same key for encrypt and decrypt — used for data at rest.

```js
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const key = randomBytes(32);  // store securely, not in code
const iv  = randomBytes(12);

const cipher = createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update('secret data', 'utf8', 'hex');
encrypted += cipher.final('hex');
const tag = cipher.getAuthTag();
```

## Asymmetric encryption (RSA)

Different keys for encrypt (public) and decrypt (private) — used for JWT signing, TLS.

```js
import { generateKeyPairSync, sign, verify } from 'crypto';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

const sig = sign('sha256', Buffer.from('message'), privateKey);
const ok  = verify('sha256', Buffer.from('message'), publicKey, sig);
```
