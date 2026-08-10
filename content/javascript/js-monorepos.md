---
title: "Monorepos"
category: "javascript"
chapterId: "js-system-design"
slug: "js-monorepos"
description: "Turborepo, Lerna, Nx for multi-package dependency graphs."
---

# Monorepos

## What is it?

A monorepo stores multiple related packages (apps, libraries, config) in a single Git repository. Instead of many repos, you have one — with shared tooling, atomic commits across packages, and easy cross-package refactoring.

## Structure

```
my-monorepo/
├── apps/
│   ├── web/          ← Next.js app
│   └── mobile/       ← React Native app
├── packages/
│   ├── ui/           ← shared component library
│   ├── config/       ← shared ESLint, TypeScript config
│   └── utils/        ← shared utilities
├── package.json      ← workspace root
└── turbo.json        ← Turborepo config
```

## Turborepo (recommended)

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],   // build dependencies first
      "outputs": [".next/**", "dist/**"]
    },
    "test": { "dependsOn": ["build"] },
    "lint": {}
  }
}
```

```bash
npx turbo run build  # builds all packages in correct order, caches results
npx turbo run test --filter=web  # run only for the web app
```

## Tool comparison

| | Turborepo | Nx | Lerna |
|---|---|---|---|
| Speed | ✅ Fastest (Rust) | Fast | Slow |
| Caching | ✅ Local + remote | ✅ Local + remote | ❌ |
| Complexity | Low | High | Low |
| Best for | Build pipeline speed | Enterprise, generators | Legacy projects |

> ⚠️ **Warning:** Monorepos require discipline — poor dependency boundaries make the entire repo slower to build. Define clear package ownership and minimize circular dependencies.
