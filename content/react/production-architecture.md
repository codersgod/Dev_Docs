---
title: "Production Architecture"
category: "react"
chapterId: "global-ecosystem-scaling"
slug: "production-architecture"
description: "Feature-Sliced Design (FSD), Monorepos (Turborepo/Nx), and Micro-Frontends."
---

# Production Architecture

## What is it?

As React apps grow from 10 components to 10,000, file organization and build strategies become critical. **Production architecture** refers to the methodologies and tooling for structuring massive codebases so teams can work independently without stepping on each other.

## Feature-Sliced Design (FSD)

## What is it?

FSD is a frontend architecture methodology that organises code by **features** instead of technical layers.

### Traditional structure (by type)

```
src/
  components/
    Button.jsx
    UserCard.jsx
    ProductCard.jsx
  hooks/
    useUser.js
    useProducts.js
  pages/
    Home.jsx
    Dashboard.jsx
```

### FSD structure (by feature)

```
src/
  features/
    auth/
      ui/
        LoginButton.jsx
      model/
        useAuth.js
      api/
        authApi.js
    product/
      ui/
        ProductCard.jsx
      model/
        useProducts.js
      api/
        productApi.js
```

Each feature is self-contained — easier to find code, delete features, and assign ownership to teams.

## Monorepos (Turborepo / Nx)

## What is it?

A **monorepo** stores multiple related projects in a single Git repository. For React apps, this often means:
- Shared UI component library.
- Multiple apps (marketing site, admin panel, mobile web).
- Shared utilities and types.

### Tools

- **Turborepo** — fast, simple, great for small-to-medium monorepos.
- **Nx** — powerful, opinionated, great for enterprise-scale monorepos with code generation.

### Example monorepo structure

```
monorepo/
  apps/
    web/          # Next.js marketing site
    admin/        # React admin panel
    mobile/       # React Native app
  packages/
    ui/           # Shared component library
    utils/        # Shared utilities
    tsconfig/     # Shared TypeScript configs
```

### Benefits

- **Code sharing** — one source of truth for components.
- **Atomic changes** — update a shared component and all apps get the fix in one commit.
- **Unified tooling** — ESLint, TypeScript, tests configured once.

## Micro-Frontends

## What is it?

**Micro-frontends** split a large React app into smaller, independently deployable apps. Each team owns a "slice" of the UI and deploys it separately.

### Example

```
myapp.com/           → Shell app (loads micro-frontends)
myapp.com/products   → Product team's micro-frontend
myapp.com/checkout   → Checkout team's micro-frontend
```

### Approaches

1. **Module Federation (Webpack 5+)** — apps share code at runtime.
2. **Iframe isolation** — each micro-frontend runs in an iframe (simple but clunky).
3. **Web Components** — wrap React apps in custom elements.

### Pros

- **Team autonomy** — each team deploys independently.
- **Tech flexibility** — one team can use React 18, another React 19 or even Vue.

### Cons

- **Complexity** — requires orchestration, shared state is hard.
- **Bundle duplication** — React loaded multiple times unless shared carefully.
- **UX inconsistency** — teams need design system discipline.

## Choosing an architecture

| Scale | Recommended approach |
|---|---|
| Small app (<50 components) | Simple folder structure, no special tooling |
| Medium app (50-500 components) | FSD or feature folders |
| Large app (500+ components, one team) | FSD + Monorepo |
| Massive app (multiple teams) | Monorepo + Micro-frontends |

> ⚠️ **Warning:** Do not prematurely adopt complex architecture. Start simple, refactor as you grow. Micro-frontends are overkill for 99% of apps — consider them only when you have multiple independent teams deploying on different schedules.
