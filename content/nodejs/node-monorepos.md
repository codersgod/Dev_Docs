---
title: "Monorepos & Workspaces"
category: "nodejs"
chapterId: "node-modules-tooling"
slug: "node-monorepos"
description: "Managing multiple packages in one repository with native workspaces."
---

# Monorepos & Workspaces

## What is a monorepo?

A single repository that holds multiple packages — e.g. `api`, `web`, `shared`.

## npm workspaces (npm 7+)

```json
// root package.json
{
  "name": "my-monorepo",
  "workspaces": ["packages/*"]
}
```

```
root/
  packages/
    api/       package.json
    web/       package.json
    shared/    package.json
```

Running `npm install` at the root installs all packages and hoists shared `node_modules`.

## Cross-package references

```json
// packages/api/package.json
{
  "dependencies": {
    "shared": "*"   // local package reference
  }
}
```

## Useful workspace commands

```bash
npm run build --workspace=packages/api
npm run test  --workspaces          # run in all packages
npm install lodash --workspace=packages/api
```

## pnpm workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

```bash
pnpm --filter api build
pnpm --filter web dev
```

## Why use a monorepo?

- Single lockfile and versioning.
- Shared code without publishing to npm.
- Atomic commits across multiple packages.
