---
title: "Package Json and build tools"
category: "typescript"
chapterId: "ts-introduction"
slug: "package-json-build-tools"
description: "How to set up a TypeScript project with package.json and build tools."
playgroundTemplate: "typescript-concept"
---
#  Package.json Integration & Build Tools

Browsers cannot run TypeScript directly. Your `package.json` file is the master dashboard where you install the translation tools and create shortcut commands to run them.

## 1. The Dependencies Configuration
TypeScript is only needed while you type and build your application. It is completely removed before going live, so it goes inside the `devDependencies` block.

```json
{
  "name": "my-typescript-app",
  "version": "1.0.0",
  "type": "module",
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}
```

## 2. The Shortcut Scripts Configuration
Instead of typing long commands in your terminal, you define easy shortcuts inside the `scripts` object.

```json
{
  "scripts": {
    "start": "ts-node src/index.ts",
    "build": "tsc",
    "watch": "tsc --watch"
  }
}
```
*   **`npm run start`**: Uses `ts-node` to instantly run your TypeScript code in memory for quick testing (no files created).
*   **`npm run build`**: Uses `tsc` to permanently turn all your code into a `dist/` folder of normal JavaScript for production.
*   **`npm run watch`**: Automatically re-translates your code every single time you hit save.

## 3. Connecting to Bundlers (Vite Example)
Modern tools like **Vite** or **Webpack** need a small configuration file to know how to handle your TypeScript files. Vite makes this incredibly easy with an automated plugin system.

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000 // Opens your live preview on port 3000
  }
  // Vite automatically reads your tsconfig.json behind the scenes!
});
```

---

### ⚠️ One-Line Warning for Notes
Modern bundlers (like Vite) prioritize speed and often **skip checking for type errors** when running your dev server. Always use the script shortcut command **`tsc --noEmit`** to force a full safety bug check before launching!
