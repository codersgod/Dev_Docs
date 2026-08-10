---
title: "Micro-Frontends"
category: "javascript"
chapterId: "js-system-design"
slug: "js-micro-frontends"
description: "Build-time vs run-time integration with Module Federation."
---

# Micro-Frontends

## What is it?

Micro-frontends split a large frontend app into **independently deployable pieces**, each owned by a separate team. Similar to microservices, but for the UI layer.

## Integration approaches

| Approach | How | When to use |
|---|---|---|
| **Build-time** | npm packages, Webpack Module Federation at build | Shared libraries, design systems |
| **Run-time (iframes)** | `<iframe src="app2.example.com">` | Strong isolation needed |
| **Run-time (JS bundles)** | Load remote scripts dynamically | Independent deployments |
| **Module Federation** | Webpack 5 shares live modules across apps | Full micro-frontend architecture |

## Webpack Module Federation (conceptual)

**Host app** (shell):
```js
// webpack.config.js
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    cart: 'cart@http://localhost:3001/remoteEntry.js',
  },
});

// In the app
const CartWidget = React.lazy(() => import('cart/CartWidget'));
```

**Remote app** (cart):
```js
new ModuleFederationPlugin({
  name: 'cart',
  filename: 'remoteEntry.js',
  exposes: { './CartWidget': './src/CartWidget' },
  shared: ['react', 'react-dom'], // share to avoid duplicates
});
```

## Trade-offs

| Pros | Cons |
|---|---|
| Independent deployments | Complex setup |
| Team autonomy | Shared state is hard |
| Tech diversity possible | Performance overhead |
| Isolated failures | CSS conflicts |

> ⚠️ **Warning:** Micro-frontends add significant operational overhead. Only adopt them when you have multiple large, independent teams — not for small projects.
