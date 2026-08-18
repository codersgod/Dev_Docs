---
title: "Real User Monitoring (RUM) & User Telemetry"
category: "system-design"
chapterId: "fed-dx-observability-ops"
slug: "fed-ops-rum-telemetry-cwv"
description: "Tracking and auditing real production Core Web Vitals (LCP, INP, CLS) and monitoring client errors via global error tracking frameworks."
playgroundTemplate: "rum-observability"
---

# Real User Monitoring (RUM) & User Telemetry

## What is it?
**Real User Monitoring (RUM)** is a passive observability strategy that records and analyzes every single interaction made by real visitors on your live web application. Instead of relying on simulated lab tests (like local Lighthouse scores), RUM uses lightweight browser hooks to capture real-world performance timelines, runtime exceptions, and layout stabilities straight from user viewports.

## 1. Requirements Gathering
### Functional Requirements
- **Performance Tracking**: Automate the collection of Core Web Vitals (LCP, CLS, INP) directly from actual user session contexts.
- **Error & Exception Logging** : Capture unhandled JavaScript exceptions, network request failures, and unhandled promise rejections alongside their full stack traces.
- **User Session Context**: Group telemetry events by anonymous session IDs, device categories (mobile, desktop), operating systems, and geographic regions.- - **Behavioral Diagnostics (Rage Clicks)**: Track patterns indicative of user frustration, such as clicking the same un-reactive DOM node more than 3 times within 1 second.

### Non-Functional Requirements (The FED System Constraints)
- **Zero Core Performance Impact**: The RUM data script must execute entirely asynchronously, ensuring its measurement math never degrades the host page's INP or LCP scores.
- **Strict Security & Privacy Compliance**: The telemetry engine must strip out and anonymize all Personally Identifiable Information (PII) before transmission to satisfy GDPR, HIPAA, and CCPA standards.
- **Bandwidth Conservation**: Limit data consumption on mobile data connections through strict client-side event throttling, data compression, and batching.

## 📐 2. High-Level Architecture (HLD)
The telemetry tracking architecture captures raw environmental logs from browser event hooks, processes them through a memory queue, and flushes structured data payloads out to ingestion gateways:
![eal User Monitoring (RUM) & User Telemetry](/CS_RUM.png)

## 🧱 3. Component & Low-Level Design (LLD)
### The PerformanceObserver Engine Blueprint
To collect metrics reliably without taxing the host system's layout thread, instantiate a non-blocking PerformanceObserver pattern to capture structural layout metrics (like Cumulative Layout Shift) natively:
```js
class RUMTelemetryAgent {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.eventBuffer = [];
    this.clsScore = 0;
    this.initCoreWebVitalsObservers();
  }

  private initCoreWebVitalsObservers() {
    // 1. Observe Layout Shifts natively to measure Cumulative Layout Shift (CLS)
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Ignore shifts caused directly by explicit user input actions
          if (!entry.hadRecentInput) {
            this.clsScore += entry.value;
            this.pushToBuffer('CLS_UPDATE', { currentTotalCls: this.clsScore });
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
  }

  private pushToBuffer(type, data) {
    this.eventBuffer.push({
      type,
      payload: data,
      timestamp: Date.now(),
      url: window.location.href
    });
  }
}
```
### Safe Non-Destructive Error Interception
To implement global exception catching without accidentally overwriting pre-existing log utilities running inside the application ecosystem, utilize additive event registration:
```js 
function registerSecureErrorCatcher() {
  window.addEventListener('error', (event) => {
    // Extract metadata safely, ignoring third-party browser extension files
    if (event.filename && event.filename.includes(window.location.hostname)) {
      window.rumAgent.pushToBuffer('JAVASCRIPT_EXCEPTION', {
        message: event.message,
        sourceFile: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        stackTrace: event.error ? event.error.stack : null
      });
    }
  }, true); // Use capture phase to catch resource loading failures (e.g., failed <img> loads)
}
```
## 🚀 4. Performance, Resiliency & Bottlenecks
### High CPU Overhead during Object Serialization
- **The Bottleneck**: Deeply copying and serializing heavy data objects or converting long stack trace arrays inside the main UI loop locks the browser execution thread, triggering immediate frame drops and driving up INP scores.
- **The Fix**: Defer processing actions by using requestIdleCallback to run tasks exclusively during spare browser cycles. For high-volume data computation, transfer the raw event array directly into a background Web Worker thread to execute heavy calculations outside the main thread.

### PII Exposure Risks (Compliance Failures)
- **The Bottleneck**: Capturing a global text click event or logging network payload request variables can accidentally harvest names, passwords, or credit card numbers typed into input tags, violating international privacy laws.
- **The Fix**: Build an automated sanitization step directly into your intake logging hook. Strip all query parameter values from URL strings, and scrub values extracted from target DOM tags. Ensure you parse any logged strings using strict regular expressions to replace matching card patterns or emails with static fallback strings (e.g., [REDACTED]).
### Data Flooding on High-Traffic Systems
- **The Bottleneck**: If your website gets 100 million page views per day, having every single browser tab constantly stream performance logs will overwhelm your data storage ingestion layer and drive up server costs.
- **The Fix**: Apply a dynamic Client-Side Sample Rate Rule. Configure your SDK to generate a pseudo-random hash unique to each session. Only enable active performance and event capture if that hash value falls within a strict percentage target (e.g., only log telemetry for a random 2% sample of users).