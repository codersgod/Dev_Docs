---
title: "Network & Asset Tuning"
category: "javascript"
chapterId: "js-web-vitals"
slug: "js-asset-optimization"
description: "WebP/AVIF, responsive images, code splitting, and bundle chunking."
---

# Network & Asset Tuning

## Modern image formats

```html
<!-- AVIF → WebP → JPEG fallback -->
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." width="800" height="400" />
</picture>
```

| Format | Compression vs JPEG |
|---|---|
| JPEG | baseline |
| WebP | ~30% smaller |
| AVIF | ~50% smaller |

## Responsive images

```html
<img
  src="photo-800.webp"
  srcset="photo-400.webp 400w, photo-800.webp 800w, photo-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
  alt="..."
  loading="lazy"
  decoding="async"
/>
```

## Code splitting and chunking

```js
// Route-level splitting — each route is a separate chunk
const About = lazy(() => import('./pages/About'));

// Vendor chunk — separate node_modules from app code
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        charts: ['recharts'],
      }
    }
  }
}
```

## Bundle analysis

```bash
# Vite
npx vite-bundle-visualizer

# Next.js
npx @next/bundle-analyzer
```

## Checklist

- ✅ Serve images in AVIF/WebP
- ✅ Use `loading="lazy"` for below-fold images
- ✅ Set explicit `width` and `height` on images (prevents CLS)
- ✅ Enable gzip/brotli compression on server
- ✅ Split routes with `React.lazy`
- ✅ Tree-shake unused imports (ES Modules + bundler)
- ✅ Use `fetchpriority="high"` on LCP image

> ⚠️ **Warning:** `loading="lazy"` on your LCP image delays it — only use lazy loading on below-the-fold images.
