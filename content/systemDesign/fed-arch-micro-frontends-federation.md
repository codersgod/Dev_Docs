---
title: "Micro-Frontends & Module Federation"
category: "system-design"
chapterId: "fed-ui-architecture-scaling"
slug: "fed-arch-micro-frontends-federation"
description: "Splitting massive applications into autonomous, domain-driven micro-apps using runtime integration, Module Federation, and shared dependency orchestration."
playgroundTemplate: "micro-frontends"
---

# Micro-Frontends & Module Federation

## What is it?
**Micro-Frontends**: A Micro-Frontend is an architectural pattern where a massive web application is split up into a ***collection of smaller, completely independent, self-contained mini-websites*** that are stitched together seamlessly inside the user's browser. 
- The system is divided into autonomous, loosely coupled sub-applications organized by business domains (e.g., a Checkout App, a Search App, and an Auth App). 
> **Problem**: In a monolithic frontend, a single codebase is shared across multiple teams, **creating bottlenecks in deployment**, build times, and version control. **A bug in one feature can block the entire application** from being deployed.

**Module Federation** is a specific compilation technology (native to modern bundlers like Webpack 5, Rspack, and Vite) that allows these independent sub-applications to dynamically import code from one another at **runtime**, without requiring build-time compilation dependencies or npm package nesting. (**Allows sub-modules to talk to each other and share code at runtime**).
> **The Problem It Solves**: Historically, sharing code required static npm dependencies, forcing team-wide application rebuilds and redeploys every time a single shared asset or bug fix was updated.
>- **The Breakthrough (Module Federation)**: Webpack 5 introduced the ability to dynamically stream compiled code from independent URLs at runtime, completely eliminating local code installation requirements.

## Why is it needed?
- **Micro-Frontends (The Team Solution)**: Grants separate engineering teams absolute deployment independence, preventing a single monolithic code conflict or team bug from paralyzing the entire company's website.
- **Module Federation (The Tech Solution)**: Optimizes browser performance by streaming code over the live network and deduplicating shared assets (like React) at runtime, preventing the browser from loading duplicate files.

## How to Implement Micro-Frontends with Module Federation
To implement Micro-Frontends using Module Federation, you configure a Host App (the main shell) to pull a component dynamically over the network from a Remote App (the micro-frontend) at runtime [Red Hat OpenShift, AWS Greengrass].

## 1. Implementation Blueprint (Vite Workflow)

### Repository A: The Remote App (`cart-mfe` on Port 5001)
This setup bundles and exposes a specific component into a remote network manifest file named `remoteEntry.js`.

```javascript
// vite.config.js (Cart Micro-Frontend)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'cartApp',
      filename: 'remoteEntry.js',
      exposes: {
        './CartButton': './src/components/CartButton.jsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: { port: 5001 },
  preview: { port: 5001 }
});
```

### Repository B: The Host Shell (`host-shell` on Port 5000)
This configuration tells the main application container shell exactly where to look over the live network to stream the remote application files.

```javascript
// vite.config.js (Host Shell)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'appShell',
      remotes: {
        cartRemote: 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: { port: 5000 }
});
```
- The ***remoteEntry.js*** file is a lightweight, auto-generated manifest file that acts as the "lookup directory" or "waiter" for Module Federation.

### Consuming Code (Host Shell Implementation)
Inside the host shell source files, load the network-streamed module asynchronously using lazy-loading conventions combined with network fallback interfaces.

```jsx
// src/App.jsx (Host Shell Application)
import React, { lazy, Suspense } from 'react';

// 1. Asynchronously stream the component over the live network
const RemoteCartButton = lazy(() => import('cartRemote/CartButton'));

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to the Main Application Shell</h1>
      <p>This baseline structural layout is managed by the Core Infrastructure Team.</p>

      {/* 2. Mount safely with structural fallback layers */}
      <Suspense fallback={<div>Streaming Cart module from Network...</div>}>
        <RemoteCartButton />
      </Suspense>
    </div>
  );
}
```

## 2. Operational Implementation Rules
* **No Local Compilation Dependencies:** The remote component must never be installed via local `npm` commands inside the host project.
* **Shared Engine Singletons:** Libraries declared in the `shared` arrays (like `react`) are cross-checked at runtime by Module Federation to ensure only one root instance runs in the browser memory.
* **Asynchronous Resilience:** Always protect remote network endpoints using `<Suspense>` components to gracefully shield the core UI layout during temporary cloud network disconnects or remote asset delays.

![Micro-Frontends & Module Federation](/microFE_module_federation.png)

> ⚠️ **Warning:** Module Federation shifts integration bugs from compile time to runtime. If a Remote team introduces a breaking change to their exposed function signatures or data structures without changing their module name or coordinating with the Host team, your app will experience silent, critical runtime crashes in production. You must enforce strict global contract testing, automated TypeScript type schema synchronization, or semantic versioning boundaries inside your deployment gates to mitigate this risk.
