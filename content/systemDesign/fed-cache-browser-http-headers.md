---
title: "Client-Side & HTTP Caching"
category: "system-design"
chapterId: "fed-edge-infrastructure"
slug: "fed-cache-browser-http-headers"
description: "Mastering Cache-Control headers, ETag validation loops, Service Workers caching, IndexedDB, stale-while-revalidate and browser storage mechanics."
playgroundTemplate: "browser-storage"
---

# Client-Side & HTTP Caching

## What is it?
Client-side and HTTP caching mechanisms dictate how a ***web browser stores and revalidates assets locally*** to completely eliminate redundant network travel over the wire. This spans the entire browser storage hierarchy: from HTTP network cache headers down to programmatic ***offline storage mechanisms like Service Workers, IndexedDB, and LocalStorage***.
- So when the user visits the same site again, the browser loads those files instantly from local storage instead of downloading them from the internet over and over.

## Why It Is Needed
- **Instant Load Times**: Bypasses network traffic entirely. Reading a file directly from a local device takes 0 milliseconds.
- **Massive Data Savings**: Saves user mobile data plans and slashes server bandwidth costs by preventing repetitive downloads of unchanging assets (like logos or navigation menus).
- **Offline Resiliency**: Lets web apps work completely offline by storing critical assets and data in the browser's local storage tiers (Service Worker Cache, IndexedDB, LocalStorage).
- **Server Crash Protection**: Reduces load on the origin server by serving cached assets from the browser, preventing traffic spikes from overwhelming the backend.

## Browser Storage Comparison Table
Storage Tier | What It Stores | How Much It Holds | Best Used For
--- | --- | --- | ---
**HTTP Cache** | Website files (Images, CSS, JS, HTML) | Limited by computer disk space | Saving fixed website design files so pages load instantly on repeat visits.
**Service Worker** | Network links and pages via the Cache API | Shares available device storage | Letting web apps open and work completely offline like a mobile app.
**IndexedDB** | Large, complex data (Objects, lists, sync drafts) | Massive (Up to half of free disk space) | Storing offline databases, dashboard data, or unsaved drafts without internet.
**LocalStorage** | Simple text settings (Key/Value string maps) | Very small (Strict ~5 MB limit) | Remembering minor user preferences like theme: "dark" or settings flags.

## Step-by-Step Process: How It Works
![Browser Storage Hierarchy](/http_caching_process.png)


##  Client-Side Storage
```js 
// 1. LocalStorage (Stays forever until deleted)
localStorage.setItem('user', 'Alice');
const user = localStorage.getItem('user');

// 2. SessionStorage (Erased immediately when tab closes)
sessionStorage.setItem('tabId', '99');
const tab = sessionStorage.getItem('tabId');

// 3. Cookies (Automatically sent to backend servers)
document.cookie = "token=xyz123; max-age=3600; secure";
const cookies = document.cookie;

// 4. IndexedDB (Asynchronous storage for large datasets)
const req = indexedDB.open('DB', 1);
req.onsuccess = () => {
  const db = req.result;
  // Use db.transaction() here to read/write complex data objects
};

```

## Client-Side HTTP Cache Control
```js
// Force browser to use cache (No network request if file exists)
fetch('/api/data', { cache: 'force-cache' });

// Bypass cache completely (Force fresh network download)
fetch('/api/data', { cache: 'no-store' });

```

> ⚠️ **Warning:** Never store sensitive, unencrypted client personal information (PII), or private financial balances inside `LocalStorage`. LocalStorage is fully vulnerable to **XSS (Cross-Site Scripting)** attacks. If a malicious third-party script gets injected or executed inside your browser runtime, it can run `localStorage.getItem()` and immediately exfiltrate your user data secrets over an external socket. Use secure, HttpOnly cookies for authentication, and secure IndexedDB instances for complex client data models.
