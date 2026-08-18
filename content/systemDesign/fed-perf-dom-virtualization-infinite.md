---
title: "DOM Scalability & List Virtualization"
category: "system-design"
chapterId: "fed-ui-architecture-scaling"
slug: "fed-perf-dom-virtualization-infinite"
description: "."
playgroundTemplate: "dom-scalibility"
---

## What is DOM Scalability & List Virtualization?
**DOM Scalability** refers to a browser's ability to remain fast, responsive, and memory-efficient as a web application grows in size.

**List Virtualization** (also known as windowing) is the primary engineering pattern used to solve DOM scalability. It boosts performance for large data sets by rendering only the visible items in the viewport and recycling DOM nodes as the user scrolls.

## Problem: DOM Scalability
- **Memory Exhaustion**: Loading thousands of complex elements consumes excessive RAM, causing tabs to freeze or crash.
- **Style Calculation Overheads**: Large DOM trees force the browser layout engine to work harder, severely slowing down page transitions.
- **INP Lag**: A choked main thread delays visual feedback, making user interactions feel laggy and unresponsive.
> ***Interaction to Next Paint (INP)***: A Core Web Vitals metric that measures the time between a user interaction (like a click or scroll) and the next visual update on the screen. A high INP indicates poor responsiveness, leading to a frustrating user experience. 
## Solution: The Virtual Scroll Lifecycle
**Virtual scrolling** optimizes performance by rendering only visible items, using DOM node recycling to maintain a small, constant number of elements regardless of total dataset size. 
- This approach reduces memory usage and speeds up style calculations, ensuring a low Interaction to Next Paint (INP) for improved responsiveness.

![Virtual Scrolling Lifecycle](/virtual_scrolling.png)

## 🚀 What happens with Virtual Scrolling:
- The items only exist as raw text/data inside a standard JavaScript array (which takes up almost zero memory). 
- The browser only creates the actual physical HTML tags for the 4 or 5 items you can see right now.

> **As you scroll**:
>  - The item moving off-screen is completely deleted from the DOM.
>  - The item moving onto the screen is created and injected into the DOM.

## Other ways for DOM scalability:
 - **Canvas / WebGL Rendering**: Paints the entire interface onto a single HTML pixel grid, completely bypassing HTML tags to render millions of objects smoothly like Figma or Google Maps.
 > ***Example***: **Figma and Google Maps**. They can display millions of vector paths and shapes smoothly because they completely bypass the HTML layout engine.
 >
 > ***Tradeoff***: Canvas/WebGL is ***not accessible to screen readers***, and it requires a custom rendering engine for every UI component.

 - **Geometric Virtualization**: Extends windowing to a 2D grid, tracking both horizontal and vertical scrolling to only render visible cells in massive spreadsheets like Google Sheets.
 > ***Example***: **Google Sheets**. It can display millions of cells in a spreadsheet because it only renders the visible cells in the viewport, while recycling off-screen cells as you scroll.
>
> ***Tradeoff***: Geometric virtualization ***is more complex to implement*** than standard list virtualization, and it requires careful management of both horizontal and vertical scroll positions.

 - **Tree Virtualization**: Flattens deeply nested folder hierarchies into a single-level array behind the scenes, allowing standard list virtualization to easily scale file sidebars like VS Code.
 > ***Example***: **VS Code**. It can display thousands of files in a project because it flattens the folder structure into a single list, while only rendering the visible files in the viewport.
 >
 > ***Tradeoff***: Tree virtualization requires ***additional logic to manage the expansion and collapse of nested nodes***, and it may not be suitable for all types of hierarchical data.

 - **DOM Tesselation & Level of Detail**: Replaces complex elements with lightweight, simplified placeholders when zoomed out or moving fast, injecting full DOM details only when you zoom in.
 > ***Example***: **Google Maps**. It can display millions of roads and buildings because it uses simplified shapes when zoomed out, while only rendering detailed elements when you zoom in.
 >
 > ***Tradeoff***: Level of detail requires ***careful design of simplified representations***, and it may not be suitable for all types of content.

 ```js

 <!DOCTYPE html>
<html>
<body>

  <!-- 1. The visible window container (Holds exactly 5 visible items at 50px each) -->
  <div id="viewport" style="height: 250px; overflow-y: auto; border: 2px solid black;">
    <!-- 2. Fake high tracker to trick the scrollbar (1,000 items * 50px = 50,000px) -->
    <div id="spacer" style="height: 50000px; position: relative;">
      <!-- 3. Moving tray holding our small pool of visible items -->
      <div id="tray" style="position: absolute; width: 100%;"></div>
    </div>
  </div>

  <script>
    const viewport = document.getElementById('viewport');
    const tray = document.getElementById('tray');

    // Array containing 1,000 items (takes almost zero memory)
    const data = Array.from({ length: 1000 }, (_, i) => `Row data item #${i + 1}`);

    function scroll() {
      // Find out exactly where the user has scrolled
      const startIndex = Math.floor(viewport.scrollTop / 50);
      
      // Shift the visual tray downward so it matches the scroll position
      tray.style.transform = `translateY(${startIndex * 50}px)`;

      // Wipe out the old HTML and replace it with ONLY the next 5 items
      tray.innerHTML = data.slice(startIndex, startIndex + 5).map(item => `
        <div style="height: 50px; border-bottom: 1px solid ccc;">⚡ ${item}</div>
      `).join('');
    }

    // Run the loop every time the user scrolls, and run once at start
    viewport.onscroll = scroll;
    scroll();
  </script>

</body>
</html>

```