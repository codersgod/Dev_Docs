---
title: "Case Study: Frontend Web Analytics SDK"
category: "system-design-case-study"
chapterId: "fed-case-studies-infrastructure"
slug: "fed-interview-analytics-tracking-sdk"
description: "Building a lightweight script library capturing click streams and performance telemetry without blocking application main execution lines."
type: "Both"
playgroundTemplate: "analytics-sdk"
---

# Case Study: Frontend Web Analytics SDK
Designing a client-side Web Analytics SDK (similar to Google Analytics, Mixpanel, or Datadog RUM) requires a complete shift in engineering perspective. Instead of building user-facing UI components, your objective is to build an invisible, lightweight, and highly resilient utility library. The primary engineering challenge is to gather high-fidelity data while maintaining a near-zero footprint on the host application's bundle size and runtime performance.

## 1. Requirements Gathering

### Functional Requirements
- **Automated Event Tracking**: Auto-capture core system lifecycle transitions (page views, history state shifts, unhandled global JavaScript crashes).
- **Custom Event API**: Provide a clean, developer-facing initialization contract to track specialized user actions: `analytics.track('button_click', { target: 'checkout' })`.
- **Performance Diagnostics**: Gather standardized Core Web Vitals performance benchmarks directly from the browser environment.
- **User/Session Management**: Uniquely identify sessions, handle anonymous guest states, and rotate browser identities securely without leaking cross-domain fingerprints.

### Non-Functional Requirements (The FED System Constraints)
- **Host Isolation**: The SDK must remain entirely isolated. It must never alter global prototypes, bleed styles, or throw exceptions that crash the hosting web application.
- **Main-Thread Invisibility**: SDK tracking computational math must never cause frame drops or raise the host application's INP metrics.
- **Strict Footprint Cap**: The compressed, production-ready SDK distribution build size must remain strictly under <10KB gzipped.
- **Data Resiliency**: Retain and deliver critical captured events even if a user closes the browser tab or completely drops network connectivity.

## 2. High-Level Architecture (HLD)
The telemetry tracking architecture runs alongside the host platform application loop, using non-blocking queues to deliver events safely to ingestion streams:
![Analytics SDK System Architecture](/CS_sdk.png)
Here is a quick, high-level summary of how the SDK pipeline processes data:
- **Capture**: The browser detects user actions (clicks, scrolls) and performance drops via standard browser APIs (PerformanceObservers).
- **Clean**: The SDK Core cleans up the data by deleting accidental duplicate events and grouping single events into packages to save network bandwidth.
- **Buffer**: Packaged data moves into a Ring Buffer queue where session details (like device type and timestamps) are attached. If the user goes offline, this buffer saves data to the device storage until connection returns.
- **Send**: The system uses silent browser tasks (sendBeacon and requestIdleCallback) to transmit data packets during idle moments or page closures without slowing down the website.
- **Store**: An Edge Gateway receives and decompresses the data globally before saving it into a central Data Lake for final analysis.

## 3. Component & Low-Level Design (LLD)
### The Public API Interface Initialization Contract
The SDK initialization interface must provide non-blocking execution mechanics. It should safely encapsulate configuration states to shield itself from external runtime collisions:
```typescript
  interface SDKConfig {
  trackingId: string;
  endpoint: string;
  batchSizeLimit: number;
  flushIntervalMs: number;
}

class AnalyticsSDK {
  private queue: object[] = [];
  private config: SDKConfig;
  private sessionToken: string;

  constructor(config: SDKConfig) {
    this.config = config;
    this.sessionToken = this.initializeSession();
    this.setupGlobalListeners();
  }

  public track(eventName: string, metadata: object = {}): void {
    const payload = {
      event: eventName,
      properties: metadata,
      timestamp: Date.now(),
      session: this.sessionToken
    };
    this.queue.push(payload);
    
    if (this.queue.length >= this.config.batchSizeLimit) {
      this.flushQueue();
    }
  }
}
```
### Capturing Web Vitals Safely Without Layout Interruption
Never run heavy loops or continuously poll layout coordinates to compute performance scores. Leverage native browser PerformanceObserver instances to collect metrics in an event-driven style:

```js
function captureInteractionToNextPaint() {
  if (!PerformanceObserver.supportedEntryTypes.includes('event')) return;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      // Find the slowest interaction latency matching the INP window
      if (entry.duration && entry.interactionId) {
        window.analyticsSDK.track('core_web_vital_inp', {
          latencyMs: entry.duration,
          targetSelector: entry.target ? entry.target.tagName : 'unknown'
        });
      }
    });
  });

  // Observe user interaction timings natively
  observer.observe({ type: 'event', durationThreshold: 16, buffered: true });
}
```
### Non-Blocking Telemetry Batching Strategy
To prevent flooding the browser network layer with a new HTTP connection every single time a user clicks, batch events together. Use requestIdleCallback to defer processing until the main CPU thread is completely relaxed:
```javascript
function scheduleTelemetryFlush() {
  if ('requestIdleCallback' in window) {
    // Postpone the processing work until the browser's main thread is idle
    window.requestIdleCallback(() => this.flushQueue(), { timeout: 2000 });
  } else {
    // Fallback gracefully for older layout engines
    setTimeout(() => this.flushQueue(), 1000);
  }
}
```

## 🚀 4. Performance, Resiliency & Bottlenecks
### Last-Second Telemetry Loss during Tab Closure
- **The Bottleneck:** Standard asynchronous fetch or Axios connection pipelines are immediately canceled by the browser layout engine if a user clicks an external link or closes the current browser tab mid-flight. Essential conversions and funnel dropout logs are lost.
- **The Fix:** Deploy navigator.sendBeacon(). This native API transfers data payloads asynchronously to the ingestion server in the background, entirely unlinked from the active page instance context. It guarantees payload delivery even during immediate tab closure without stalling page transitions.
```javascript
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // Tab is closing or backgrounded: Synchronously flush queue via background beaconing
    const blob = new Blob([JSON.stringify(this.queue)], { type: 'application/json' });
    navigator.sendBeacon(this.config.endpoint, blob);
    this.queue = []; // Wipe local reference safely
  }
});
```
### Monopolizing Global Error Listeners
- **The Bottleneck**: Attaching destructive handlers via global methods like window.onerror = () => {} will break or overwrite previous diagnostics tracking configurations running inside the parent application ecosystem.
- **The Fix**: Always use progressive, non-destructive interception pipelines via window.addEventListener('error', callback) and window.addEventListener('unhandledrejection', callback). Ensure your error catcher filter checks for stack strings pointing specifically to the application's domain files, ignoring un-fixable errors injected by third-party browser extensions.
### Network Dropouts & Offline Outages
- **The Bottleneck**: When users browse on subterranean trains or spotty mobile connections, immediate API tracking updates fail and disappear forever.
- **The Fix**: If an ingestion sync fails due to zero network connectivity, trap the error sequence and serialize the pending event queue directly into browser IndexedDB or local fallback storage. Spin up an offline queue manager that listens to window.addEventListener('online') to safely clear and send the backlog once connectivity stabilizes.