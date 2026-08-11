---
title: "Web Security"
category: "nodejs"
chapterId: "node-security"
slug: "node-web-security"
description: "OWASP Top 10 mitigations, SQL injection, XSS prevention, and helmet headers."
---

# Web Security

## helmet — HTTP security headers

```bash
npm install helmet
```

```js
import express from 'express';
import helmet from 'helmet';

const app = express();
app.use(helmet()); // sets CSP, HSTS, X-Frame-Options, etc.
```

## SQL Injection

Never interpolate user input into SQL strings.

```js
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE id = ${req.params.id}`;

// ✅ Safe — parameterised query
const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
```

## XSS (Cross-Site Scripting)

- Escape all user-generated content before rendering it in HTML.
- Use a library like `DOMPurify` (client-side) or `sanitize-html` (server-side).

```js
import sanitizeHtml from 'sanitize-html';

const clean = sanitizeHtml(req.body.content, {
  allowedTags: ['b', 'i', 'em', 'strong'],
});
```

## OWASP Top 10 quick reference

| Risk | Mitigation |
|---|---|
| Injection | Parameterised queries, ORMs |
| Broken Auth | Strong session management, MFA |
| Sensitive Data | Encrypt at rest + in transit (HTTPS) |
| XXE | Disable external XML entities |
| Broken Access | RBAC, least privilege |
| Misconfiguration | Helmet, disable debug in prod |
| XSS | Sanitise + escape output |
| Insecure Deserialise | Validate all input shapes |
| Vulnerable deps | `npm audit`, Dependabot |
| Insufficient Logging | Structured logs, alerting |

## Additional tips

- Set `Content-Security-Policy` to limit script sources.
- Use `httpOnly` and `Secure` flags on cookies.
- Validate and sanitise every piece of incoming data at the boundary.
