---
title: "Authentication Strategies"
category: "nodejs"
chapterId: "node-security"
slug: "node-authentication"
description: "JWT, session cookies, OAuth 2.0, and passport.js middleware."
---

# Authentication Strategies

## Session-based (stateful)

The server stores session data; the client holds only a session ID in a cookie.

```js
import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'strict' }
}));
```

## JWT (stateless)

The token carries the payload — no server-side storage needed.

```js
import jwt from 'jsonwebtoken';

// Sign
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Verify middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}
```

## OAuth 2.0

Delegate authentication to a third party (Google, GitHub, etc.) via redirect flows. The app receives an access token without handling the user's password.

## passport.js

Strategy-based middleware that works with sessions, JWT, and OAuth providers.

```js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.hash)) return done(null, false);
  return done(null, user);
}));

app.use(passport.initialize());
app.use(passport.session());
```

## When to use what

| Strategy | Best for |
|---|---|
| Sessions | Traditional web apps, server-rendered pages |
| JWT | Stateless APIs, microservices |
| OAuth 2.0 | "Login with Google/GitHub" flows |
