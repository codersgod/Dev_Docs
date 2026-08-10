---
title: "Content Security Policy (CSP)"
category: "javascript"
chapterId: "js-security"
slug: "js-csp"
description: "Fine-tuning CSP headers to mitigate injection attacks."
---

# Content Security Policy (CSP)

## What is it?

CSP is an HTTP response header that tells the browser **which sources are allowed to load scripts, styles, images, and other resources**. It's your primary defense against XSS — even if an attacker injects a script tag, the browser won't execute it if the source isn't whitelisted.

## How to use it

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://images.example.com;
  connect-src 'self' https://api.example.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'none';
```

## Key directives

| Directive | Controls |
|---|---|
| `default-src` | Fallback for all resource types |
| `script-src` | JavaScript sources |
| `style-src` | CSS sources |
| `img-src` | Image sources |
| `connect-src` | XHR, fetch, WebSocket |
| `frame-src` | iframes |

## Common values

| Value | Meaning |
|---|---|
| `'self'` | Same origin only |
| `'none'` | Nothing allowed |
| `'unsafe-inline'` | Inline scripts/styles allowed (weakens CSP) |
| `'nonce-{value}'` | Allow specific inline scripts with matching nonce |
| `https://cdn.example.com` | Specific external domain |

## Nonce-based CSP (best practice for inline scripts)

```html
<!-- Server generates a random nonce per request -->
<meta http-equiv="Content-Security-Policy"
      content="script-src 'nonce-abc123'" />

<!-- Only this inline script is allowed -->
<script nonce="abc123">
  console.log('trusted');
</script>
```

## Report-only mode (testing)

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-violations
```

> ⚠️ **Warning:** `'unsafe-inline'` and `'unsafe-eval'` defeat most of CSP's protection. Avoid them. Use nonces or hashes for legitimate inline scripts.
