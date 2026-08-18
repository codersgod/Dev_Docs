---
title: "General Interview Questions - System Designing"
category: "system-design"
chapterId: "fed-ui-general-questions"
slug: "general-interview-question-asked"
description: "Frontend System Design Case Studies: Architectural Summary Handbook - Interviews questions generally asked"
playgroundTemplate: "system-design"
---

# 📘 Senior Frontend System Design: Case Studies Summary Handbook

## 1. The High-Throughput E-Commerce Homepage
* **What is it**: A modular, server-driven dashboard mapping high-volume inventory assets and promotional elements dynamically through edge rendering pipelines and localized caching systems.
![ECOM-System-design](/HLD_ecom.png)

### LLD Patterns & Tech Stack
*   **Server-Driven UI (SDUI)**: Strictly typed schemas dictating layout structures, components, and tracking identifiers via dynamic payloads.
*   **Module Federation**: Compilation and loading of decoupled remote Micro-Frontend micro-apps at application runtime.
*   **Rigid Responsive Asset Slots**: Component structures using `aspect-ratio` rules combined with `content-visibility: auto` to prevent render-tree calculations until they cross the user's viewport boundary.
*   **Edge Stitched Pipelines**: Edge compute handlers compiling fragment segments into a unified, lightweight streaming response.

### Problem Depth & Solution Implementation
*   **Problem**: High Cumulative Layout Shift (CLS) and slow time-to-interactive (TTI) caused by heavy, volatile seasonal marketing widgets injecting late into the DOM tree, causing major repaints.
*   **Solution**: We embedded explicit component placeholders mapped to strict configuration rules. The initial response structure is intercepted at the Cloudflare Edge Worker level, where the system executes parallel requests to specialized downstream catalog services. Using the readable streams api, the edge layer stitches the HTML skeleton payload chunks on the fly. This architecture ensures metadata and layout constraints hit the browser simultaneously, achieving near-zero CLS and driving Time to First Byte (TTFB) to an absolute minimum.

---

## 2. Real-Time Delivery Tracking & Live Dashboard

### Architectural Definition
A live telemetry view handling high-frequency location data streams via persistent connections to render smooth coordinates across dynamic client-side canvas layouts.
![Real-time delivery trakcing](/HLD_real_time_tracking.png)
### LLD Patterns & Tech Stack
*   **Server-Sent Events (SSE)**: Unidirectional `EventSource` pipeline maintaining a continuous HTTP chunk streaming link.
*   **HTML5 Canvas 2D Engine**: Directly processing explicit `CanvasRenderingContext2D` redraw arrays, avoiding the main browser layout thread.
*   **Linear Interpolation (Lerp)**: Coordinate mathematical normalization smoothing spatial frame variations over timeline metrics.
*   **Offscreen Canvas Context**: Off-thread bitmap pre-rendering abstraction utilizing dedicated background execution boundaries.

### Problem Depth & Solution Implementation
*   **Problem**: Frequent WebSocket connection renegotiations and continuous DOM repaint operations choke the main browser thread, degrading interaction metrics on low-powered mobile devices.
*   **Solution**: We transitioned the networking infrastructure from heavy bidirectional WebSockets to memory-efficient, unidirectional SSE. To eliminate browser reflows, tracking icons were completely migrated away from DOM nodes into a dedicated `<canvas>` paint canvas layer. Coordinates arriving over the network are pushed straight into a background thread using `OffscreenCanvas`. The rendering thread applies a standard Lerp calculation loop synced with `requestAnimationFrame` to smoothly draw movement paths between coordinate points, ensuring consistent performance.

---

## 3. Multi-Tenant Payment Checkout SDK / Google Pay/UPI

### Architectural Definition
An embeddable payment gateway module configured with strict iframe sandbox boundaries, dynamic cross-origin token exchanges, and offline-ready processing states.
![Multi-Tenant Payment Checkout SDK](/HLD_UPI_1.png)
## ====================  OR  ========================
![Multi-Tenant Payment Checkout SDK](/HLD_UPI_2.png)
### LLD Patterns & Tech Stack
*   **HTML5 Sandbox iframes**: Enforcing isolated browser instances with explicit `allow-scripts` constraints and blocked parent access.
*   **Cryptographic PostMessage Router**: Secure communication wrapper utilizing `window.postMessage` backed by strict source URL checks.
*   **State Machine Tokenizer**: A Finite State Machine (FSM) capturing checkout lifecycle metrics to prevent out-of-order action tracking.

### Problem Depth & Solution Implementation
*   **Problem**: Malicious code or security vulnerabilities in third-party host applications reading credit card fields (XSS data theft) or injecting clickjacking tracking overlays.
*   **Solution**: We isolated the sensitive forms inside an isolated cross-origin iframe context running on separate payment domains. Communication with the host page is restricted to a structured message bridge using `window.postMessage`. Both the host framework and the embedded frame validate the explicit message origin before running any state shifts. Additionally, the system implements a strict token handshake protocol that issues temporary, single-use public session tokens, entirely preventing any exposure of raw sensitive payment data to the parent document.

---

## 4. URL Shortener Portal

### Architectural Definition
A configuration portal engineered to process high-volume link mapping, handle instant client-side redirection lookups, and execute low-overhead URL state persistence.
![URL shortner](/url_shortner.png)
### LLD Patterns & Tech Stack
*   **Base62 Hash Translators**: Custom high-speed string encoding and decoding transformations mapping integer unique keys to URL pathways.
*   **Localized Prefix Tree (Trie)**: Fast character tree structures built directly in memory for lightning-fast router matching.
*   **Service Worker Interceptor**: Custom client proxy caches implementing a robust `stale-while-revalidate` caching strategy.

### Problem Depth & Solution Implementation
*   **Problem**: Sluggish client-side redirection routines and continuous backend API roundtrips forcing noticeable blank-screen routing delays during high-traffic navigation events.
*   **Solution**: We integrated a highly optimized local Prefix-Tree (Trie) match structure directly inside a Service Worker context to evaluate routing fragments client-side. The routing engine intercepts the `fetch` hook for matched paths, reading directly from local memory indexes. If a hash mismatch occurs, the Service Worker safely falls back to a background network lookup while immediately rendering a lightweight shell. This strategy bypasses standard browser network blocking queues, dropping redirection latency down to sub-millisecond ranges.

---

## 5. Notification System

### Architectural Definition
A real-time notification engine utilizing Server-Sent Events to aggregate client system triggers, handle instant banner updates, and optimize background alert priority queues.
![Notification System](/notification.png)

- **Event Sources** → Applications, services, databases, or users that generate business events and requests. Usually backend systems, applications, databases, or external services
- **Ingestion & Normalization** → Captures incoming events, validates them, and converts them into a standardized format. Backend layer (Kafka, Event Hub, APIs, etc.).
- **Real-Time Notification Engine** → Processes events, applies business rules, and triggers notifications or actions instantly. Backend service that processes events and decides what notifications to send.
- **Client (Browser)** → Receives updates/notifications and presents them to the end user in real time. Runs on the user's machine and only receives/displays notifications.

### LLD Patterns & Tech Stack
*   **SharedWorker Central Channel**: Single instance background tab coordination layer grouping background tasks to conserve device network interfaces.
*   **BroadcastChannel Link**: Multiplexed messaging pipe synchronizing localized user action states between open browser tabs.
*   **Web Storage Ring Buffer**: Circular index queue structures handling fixed-size telemetry persistence locally.

### Problem Depth & Solution Implementation
*   **Problem**: Opening multiple browser tabs floods the client's network layer with redundant data connections, causing out-of-order alerts and rapidly draining mobile device batteries.
*   **Solution**: We centralized the real-time data streaming model by running a single `SharedWorker` instance that establishes one unified network channel for all open browser windows. Incoming message bursts are passed downstream to active tabs via a `BroadcastChannel` layer. The worker saves alerts to a local ring buffer managed in `IndexedDB`. If the primary tab closes, the worker automatically migrates state processing to the next active tab, maintaining continuous delivery without duplicate network overhead.

---

## 6. Google Drive Ecosystem

### Architectural Definition
A comprehensive digital asset ecosystem coordinating multi-threaded file slicing, resilient background chunk streaming queues, and local system catalog sync states.
![MGoogle drive ecosystem](/google_drive_HLD.png)

### LLD Patterns & Tech Stack
*   **FileReader Slicing API**: Memory-safe file stream manipulation breaking large binary assets into deterministic block sizes.
*   **Multi-Threaded Web Workers**: Background task threads handling checksum processing without blocking UI render cycles.
*   **IndexedDB Transactional Sync**: Client-side object database mapping block indexes, tracking progress, and enabling reliable offline work state transitions.

### Problem Depth & Solution Implementation
*   **Problem**: Massive multi-gigabyte binary asset uploads freezing the main user interface or throwing network memory errors when connections drop mid-stream.
*   **Solution**: We offloaded the entire binary ingestion workflow to a dedicated Web Worker thread that cuts files into uniform sequential chunks using the `Blob.prototype.slice()` API. The worker calculates a hash for each chunk and registers them into an IndexedDB processing queue. The system uploads these chunks in parallel through a pool of background concurrent worker requests. If the network drops, a retry manager reads the IndexedDB state to resume uploading precisely where it failed, ensuring zero main-thread memory leakage.

---
## 7. Uber Dispatch Terminal

### Architectural Definition
A real-time ride orchestration terminal syncing live driver coordinates, executing complex localized vector map path renders, and coordinating location streams.
![ Uber real time tracking](/UBER_HLD.png)
### LLD Patterns & Tech Stack
*   **Geolocation Watch API**: Native high-precision client device tracking interfaces mapping stream parameters dynamically.
*   **Bidirectional WebSockets**: Low-overhead frame transfer protocols facilitating persistent, duplex streaming pipelines between client and dispatcher.
*   **Viewport Spatial Filters (Bounding Box)**: Geohash grid boundaries filtering out real-time telemetry updates outside of the user's active map viewport.
*   **WebGL Matrix Layer**: GPU-accelerated path paint contexts designed to render dense vector map canvas arrays without blocking CPU layout tasks.

### Problem Depth & Solution Implementation
*   **Problem**: Hundreds of active vehicle vectors tracking updates simultaneously over a dense metropolitan area render the browser canvas interface sluggish, causing frame rates to drop below 20 FPS and freezing interactions.
*   **Solution**: We optimized the client data ingestion pipeline by calculating a dynamic bounding box using the map's current zoom and center coordinates. The system transmits this boundary to the backend, ensuring the WebSocket only receives coordinates for visible entities. To bypass the performance costs of standard DOM nodes or 2D canvas contexts, we built a custom WebGL rendering layer. Incoming position coordinates are streamed directly into flat, pre-allocated Float32Arrays. This completely avoids object creation overhead, eliminates garbage collection pauses, and maintains a locked 60 FPS update loop.

---

## 8. Spotify Audio Pipeline

### Architectural Definition
A media streaming engine optimizing audio chunk caching, configuring responsive audio bitrates against shaky networks, and managing virtualized playlist metadata pools.
![  Spotify Audio Pipeline](/spotify_HLD.png)

### LLD Patterns & Tech Stack
*   **MediaSource Extensions (MSE)**: Low-level browser buffer controllers feeding custom raw audio segments directly into HTML5 audio tags.
*   **Web Audio AudioContext**: Digital audio processing networks providing precise runtime control over hardware gain, analysis nodes, and routing channels.
*   **1D DOM Virtualization**: List mounting structures maintaining a fixed count of visible structural DOM elements regardless of total data volume.
*   **IndexedDB Chunk Allocator**: Client-side binary storage cache managing encrypted audio blocks for immediate offline playback.

### Problem Depth & Solution Implementation
*   **Problem**: Sudden audio playback gaps and stutters caused by mobile network switching, combined with extreme browser memory usage when users scroll infinite playlists containing over 50,000 tracks.
*   **Solution**: We architected a custom buffering engine using MediaSource Extensions (MSE). A background Web Worker continuously monitors network download speed and pre-fetches the next three audio chunks, automatically downgrading or upgrading the bitrate tier mid-stream before the active buffer runs dry. For the UI, we implemented a strict 1D virtualization list. The component calculates item heights and retains only `viewport items + 3 buffer nodes` in the DOM tree. As the user scrolls, track metadata is mapped to existing DOM nodes, keeping memory use flat and completely preventing browser crashes.

---

## 9. Bookmyshow Reservation Canvas

### Architectural Definition
A high-concurrency event reservation canvas rendering massive structural seating layout grids and managing rapid real-time seat lock state synchronization models.
![ Book My Show](/BookMyShow_HLD.png)
### LLD Patterns & Tech Stack
*   **Canvas Interactivity Engine**: Quadtree geometric lookup trees mapping click coordinate vectors directly to complex stadium layout indices.
*   **Short-Polling Transaction Lock**: High-speed, lightweight REST-based synchronization queues processing optimistic reservation locks.
*   **Normalized Flat Grid Map**: One-dimensional multi-array bitmask structures formatting seat configurations as single continuous binary strings.

### Problem Depth & Solution Implementation
*   **Problem**: Rendering a 10,000-seat stadium map as individual DOM elements causes massive memory bloat and slow interactions, while simultaneous clicks by thousands of users cause frequent cart collisions at checkout.
*   **Solution**: We removed the DOM from the rendering equation entirely, drawing the entire stadium seating chart inside a single interactive `<canvas>` tag. To make clicks instantaneous, seat coordinates are indexed in a client-side Quadtree, dropping click hit-testing time to $O(\log N)$. To solve the concurrency race condition, clicking a seat immediately triggers an optimistic local state change while spawning a high-priority, non-blocking lock request. The UI balances this via short-polling state queries every 1.5 seconds. If a collision is caught, the canvas re-renders the cell with a locked indicator, safely knocking it out of the user's cart before payment.

---

## 10. Netflix Media Player Interface

### Architectural Definition
An advanced multimedia streaming interface applying dynamic video chunk decoding, context-aware network bitrate optimizations, and memory-insulated playback buffers.
![ Netflix Media Player Interface](/HLD_netflix.png)

### LLD Patterns & Tech Stack
*   **Encrypted Media Extensions (EME)**: Content decryption frameworks controlling secure digital rights management (DRM) pipelines between CDM and hardware decoding layers.
*   **Adaptive HLS/DASH Handlers**: Custom playback engine wrappers tracking chunk metadata manifest files to swap stream profiles on the fly.
*   **requestVideoFrameCallback Loop**: Precision hardware-locked render hooks exposing exact video frame drop telemetry metrics during playback.

### Problem Depth & Solution Implementation
*   **Problem**: Noticeable visual frame drops (jank) and playback stalls when users transit between cellular data networks and home Wi-Fi connections, breaking user immersion.
*   **Solution**: We built an adaptive bitrate manager that pairs the browser's `NetworkInformation API` with instant frame-drop telemetry from `requestVideoFrameCallback`. The player engine runs a continuous sliding-window average of download throughput. When a sudden network transition is detected, the engine calculates the remaining time in the forward buffer and shifts downstream segment requests to a matching resolution profile *before* the active buffer is exhausted. This guarantees a continuous, smooth playback stream with zero visible loading spinners during network switches.

---

## 11. Stock Exchange Real-Time Terminal

### Architectural Definition
A hyper-frequent market telemetry terminal rendering real-time ticker feeds, optimizing visual rendering cycles via requestAnimationFrame, and preserving low INP thresholds.
![Stock Exchange Real-Time Terminal](/HLD_stock.png)

### LLD Patterns & Tech Stack
*   **Binary WebSockets**: Compact network pipelines processing lightweight binary payloads (e.g., Protocol Buffers, ArrayBuffers) to minimize data frame size.
*   **rAF Render Batcher**: A centralized state manager schedule layer grouping incoming UI writes into single, display-synchronized updates.
*   **Normalized State Index**: High-speed lookup structures utilizing flat key-value pairs to prevent deep object traversal lags.

### Problem Depth & Solution Implementation
*   **Problem**: High-velocity data feeds (100+ updates per second per ticker) overwhelm the browser's single thread, causing major Interaction to Next Paint (INP) delays and frozen user controls.
*   **Solution**: We built a binary streaming pipeline that reads WebSocket updates straight into flat array structures. Instead of pushing updates to the DOM immediately—which triggers continuous layout thrashing—incoming states are collected into a local memory pool. A scheduler uses a `requestAnimationFrame` loop to process this pool, batching DOM updates and painting them to the screen exactly once per refresh cycle (e.g., every 16.6ms for a 60Hz display). This approach clears up the main thread's event loop, dropping INP metrics down to a highly responsive 15ms.

---

## 12. Zoom Meeting Room

### Architectural Definition
An enterprise-grade real-time video communications interface running multi-peer media stream topologies, layout allocation matrices, and intelligent pipeline optimization systems.
![Zoom Meeting Room](/HLD_zoom_call.png)
### LLD Patterns & Tech Stack
*   **WebRTC Stream Pipeline**: Framework controlling secure audio, video, and data channels across active network sessions.
*   **RTCPeerConnection Orchestrator**: Session management logic handling ICE candidate negotiation and dynamic network path routing.
*   **Audio Track Analyzer Loop**: High-frequency real-time audio analysis evaluating absolute decibel limits across active streams to determine the active speaker.

### Problem Depth & Solution Implementation
*   **Problem**: Decoding and rendering 30+ simultaneous live WebRTC video elements completely overloads the client CPU, causing mobile devices to overheat and the browser tab to crash.
*   **Solution**: We built a dynamic grid rendering manager that heavily optimizes resource allocation. A high-speed audio analyzer loop tracks incoming audio track decibels to isolate the primary speaker. The layout engine ties directly into the WebRTC stream interface: any video track that scrolls off-screen or shrinks into a minor sidebar thumbnail is modified via its `RTCRtlReceiver`. We either downsample the target resolution or pause the track's execution entirely at the connection layer. This optimization cuts CPU decoding usage by more than 70%, keeping the application perfectly stable on low-end hardware.
