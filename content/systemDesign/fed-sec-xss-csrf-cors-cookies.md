---
title: "Web Security Mitigations"
category: "system-design"
chapterId: "fed-security-mitigations"
slug: "fed-sec-xss-csrf-cors-cookies"
description: "Defending applications against XSS vectors, CSRF exploits, CORS preflight blocking, and implementing secure HttpOnly cookie configurations."
playgroundTemplate: "security-hardening"
---

# Client-Side Security: Web Security Mitigations

## What is it?
Web Security Mitigations are ***defensive programming practices, browser configurations, and network headers implemented by frontend developers to protect a web application from client-side attacks***. 
- Defensive programming practices, browser configurations, and network headers that ***protect web applications from client-side attacks like script injections, token theft, and UI hijacking***.

## The Problems (Vulnerabilities):   XSS, CSRF, CORS, and Cookies 
- **XSS (Cross-Site Scripting)**: Attackers ***inject malicious JavaScript*** to run in the user's browser, stealing data or hijacking sessions.
- **CSRF (Cross-Site Request Forgery)**: Malicious sites ***exploit automatic browser cookies to trick authenticated users*** into executing unauthorized server actions.
- **CORS Misconfiguration**: Using wildcard access headers (*) with credentials ***accidentally exposes private internal data to the public internet***.
- **Cookies**: Browser storage files used for identity tracking that are ***automatically attached to web requests, making them prime targets for exploitation***.

## The Solution (Defense Strategy)
- **Secure Cookie Management**: This is one of the main tools to fix or prevent these issues (e.g., using HttpOnly and SameSite flags to stop XSS theft and CSRF attacks).
- **Content Security Policy (CSP)**: A browser-enforced whitelist that ***blocks untrusted scripts and inline code*** from executing, preventing XSS attacks.
- **Subresource Integrity (SRI)**: A cryptographic hash that ***verifies the integrity of external scripts***, preventing malicious CDN modifications from executing in the browser.
- **Clickjacking Prevention**: Using the X-Frame-Options header to ***block malicious sites from embedding your application in invisible frames***, preventing UI hijacking.
- **CORS Preflight Restrictions**: Configuring the server to ***only allow trusted origins*** to access sensitive APIs, preventing data leaks from misconfigured cross-origin requests.
- **Input Validation and Sanitization**: Ensuring that all user inputs are properly validated and sanitized to prevent injection attacks, including XSS.
- **Security Headers**: Implementing additional HTTP security headers like `Strict-Transport-Security`, `X-Content-Type-Options`, and `Referrer-Policy` to enhance overall security.

## Why Web Security Mitigations are important
Web Security Mitigations are important because they help protect web applications from common client-side attacks that: 
![Web Security Mitigations](/web_security.png)

## Web Security Technical Implementation:
**Layer 1: Content Security Policy (CSP)**

Implement a strict Content Security Policy (CSP) by sending this exact HTTP response header from your server or CDN gateway.
```js
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://trusted-cdn.com; connect-src 'self' https://yourdomain.com; img-src 'self' data:; style-src 'self' 'nonce-rAnd0m123'; object-src 'none'; frame-ancestors 'none';"
  );
  next();
});
```
>- **Mechanism**: Restricts script sources to self/trusted CDNs, limits API calls, blocks dangerous plugins, and requires a dynamic single-use token (nonce) for inline styles and blocks clickjacking attempts.

## Layer 2: Secure Cookie Storage
Issue authentication tokens strictly via Set-Cookie headers with HttpOnly (blocks JavaScript read access), Secure (forces HTTPS), and SameSite=Strict (blocks CSRF).
```js
app.get('/login', (req, res) => {
  res.cookie('session_token', 'xyz123', {
    domain: 'yourdomain.com',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  res.send('Cookie set successfully!');
});

```
>- **Mechanism**: Keeps tokens completely invisible to JavaScript reading attempts (HttpOnly), forces transport exclusively over encrypted HTTPS (Secure), and cuts off CSRF request forgery vectors (SameSite=Strict).

## Layer 3: Anti-Framing / Clickjacking Defense
Inject the X-Frame-Options: DENY HTTP response header to completely block external sites from rendering your application inside an invisible layout `<iframe>`.
```js
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

```
>- **Mechanism**: Signals the browser layout engine to instantly refuse rendering if your page is nested inside a third-party `<iframe>`, stopping malicious visual overlays.

## Layer 4: Subresource Integrity (SRI)
***Append cryptographic integrity hashes directly to external `<script>` tags*** so the browser automatically blocks execution if a CDN asset is modified by a hacker.
```js
<!-- Secure loading of an external script with a cryptographic hash -->
<script 
  src="https://trusted-cdn.com" 
  integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" 
  crossorigin="anonymous">
</script>

<!-- You can also use SRI for external CSS files -->
<link 
  rel="stylesheet" 
  href="https://trusted-cdn.com" 
  integrity="sha384-o80XQ82p4l...truncated_example_hash..." 
  crossorigin="anonymous"
>

```
- **Critical Requirements**:
  - **integrity attribute**: Contains the hash type prefix (e.g., sha384-) followed by the base64-encoded cryptographic checksum of the exact file contents.
  - **crossorigin="anonymous" attribute**: Mandatory for cross-origin assets. If missing, the browser will block the script because of CORS rules

>- **Mechanism**: Runtime environment cryptographically hashes external assets upon download. It blocks execution immediately if the CDN file string is altered or compromised by a third party.

> ⚠️ **Warning:** Be cautious when using CORS preflight cache configurations (`Access-Control-Max-Age`). While setting this parameter avoids performance penalties by reducing repetitive `OPTIONS` requests, a large window delays how quickly you can deploy security rules or origin rejections down to active client viewports if an application domain is compromised.
