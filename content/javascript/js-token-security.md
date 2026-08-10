---
title: "Secure Token Management"
category: "javascript"
chapterId: "js-security"
slug: "js-token-security"
description: "Access/refresh tokens — HttpOnly cookies vs LocalStorage risks."
---

# Secure Token Management

## What is it?

Where you store auth tokens determines your attack surface. The two main options are **LocalStorage** (accessible to JS) and **HttpOnly cookies** (not accessible to JS).

## The attack vectors

### XSS (Cross-Site Scripting)
Attacker injects JS that reads `localStorage.getItem('token')`.

### CSRF (Cross-Site Request Forgery)
Malicious site tricks the browser into sending a request with the user's cookies.

## Comparison

| | LocalStorage | HttpOnly Cookie |
|---|---|---|
| Readable by JS | ✅ Yes | ❌ No |
| Sent automatically | ❌ No | ✅ Yes |
| XSS risk | ❌ High | ✅ Low |
| CSRF risk | ✅ Low | ❌ Needs protection |

## Recommended pattern

**Short-lived access token in memory** + **HttpOnly refresh token cookie**

```js
// In-memory store — not persistent, gone on page refresh
let accessToken = null;

async function login(credentials) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    credentials: 'include', // send/receive cookies
  });
  const data = await res.json();
  accessToken = data.accessToken; // store in memory only
}

async function apiCall(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });
  if (res.status === 401) {
    await refreshToken(); // use HttpOnly cookie to get new access token
  }
  return res.json();
}

async function refreshToken() {
  const res = await fetch('/auth/refresh', {
    method: 'POST',
    credentials: 'include', // HttpOnly cookie sent automatically
  });
  const data = await res.json();
  accessToken = data.accessToken;
}
```

## CSRF protection for cookies

```http
Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh
```

`SameSite=Strict` prevents the cookie from being sent on cross-site requests — defeating CSRF.

> ⚠️ **Warning:** Never store tokens in LocalStorage for sensitive apps. In-memory access tokens are lost on refresh — that's intentional. The HttpOnly refresh cookie silently re-issues them.
