---
title: "requestAnimationFrame"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-raf"
description: "Synchronizing animations with the browser's repaint cycle."
---

# requestAnimationFrame

## What is it?

`requestAnimationFrame(callback)` schedules your callback to run just before the browser's next repaint — synced to the display's refresh rate (typically 60fps = every 16ms). This produces smooth animations without tearing or wasted frames.

## When to use it?

Any visual animation or DOM manipulation that needs to look smooth — canvas drawing, progress bars, scroll-linked animations, game loops.

## How to use it

```js
// Basic animation loop
let x = 0;

function animate(timestamp) {
  x += 2;
  element.style.transform = `translateX(${x}px)`;

  if (x < 500) {
    requestAnimationFrame(animate); // schedule next frame
  }
}

requestAnimationFrame(animate); // kick off
```

## Stopping an animation

```js
let rafId;

function start() {
  function loop() {
    draw();
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);
}

function stop() {
  cancelAnimationFrame(rafId);
}
```

## raf vs setTimeout

```js
// ❌ setTimeout — fires regardless of repaint, can tear, wastes frames in bg tab
setInterval(() => { element.style.left = x++ + 'px'; }, 16);

// ✅ rAF — synced to display, pauses in background tabs, no wasted frames
function loop() {
  element.style.left = x++ + 'px';
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

> ⚠️ **Warning:** Never do heavy computation inside a `requestAnimationFrame` callback — you only have ~16ms. Move data processing to a Web Worker and use rAF only for rendering.
