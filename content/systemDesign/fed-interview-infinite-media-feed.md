---
title: "Case Study: Image/Video Social Media Feed"
category: "system-design-case-study"
chapterId: "fed-case-studies-infrastructure"
slug: "fed-interview-infinite-media-feed"
description: "Architecting an infinite-scroll feed layout optimizing lazy media loading, responsive images, content prefetching, and progressive degradation."
type: "Both"
playgroundTemplate: "media-feed"
---

# Case Study: Image/Video Social Media Feed
Designing a high-throughput social media feed (like Instagram, TikTok, or LinkedIn) is an aggressive test of frontend systems. The core engineering challenge centers on scroll fluency (60fps), intelligent asset prefetching, memory constraints under heavy media loading, and deterministic data synchronization.

## 1. Requirements Gathering

### Functional Requirements
- **Infinite Scroll**: Continually append new posts (text, single images, image carousels, or auto-playing videos) as the user scrolls.
- **Inline Media Playback**: Auto-play muted video content when it occupies more than 50% of the active viewport area.
- **User Interactions**: Enable instantaneous liking, bookmarking, and inline commenting.
- **Multi-Format Rendering**: Deterministically layout varied payload templates without shifting neighboring elements.
### Non-Functional Requirements (The FED System Constraints)
- **Zero Layout Shift**: Prevent jarring visual jumping as new images or text blocks finish downloading.
- **Fluid Scrolling (INP < 200ms, 60fps)**: Completely eliminate main-thread stuttering during aggressive scroll gestures.
- **Memory Bound Cap**: Enforce strict client-side RAM ceilings to stop mobile browsers from crashing due to thousands of un-garbage-collected high-resolution image nodes.
- **Network Thriftiness**: Intelligently prefetch upcoming assets without wasting user data bandwidth on content they never scroll down to see.

## 2. High-Level Architecture (HLD)
The data and rendering synchronization flow maps feed data requests from the layout engine down through background workers and edge gateways:
![Infinite Media Feed System Architecture](/CS_mobile_feed.png)

## 3. Component & Low-Level Design (LLD)

### The Data Structure: Normalized Local Cache
To ensure instant updates across the UI (e.g., liking a post from a modal updates it instantly in the main feed timeline), store feed data inside a normalized data model instead of an unstructured, deeply nested JSON array:
```typescript
interface NormalizedFeedState {
  posts: {
    [postId: string]: {
      id: string;
      authorId: string;
      mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
      mediaUrls: string[];
      likeCount: number;
      hasLiked: boolean;
      aspectRatio: number; // Critical for anchoring heights!
    }
  };
  feedOrder: string[]; // Order of post IDs currently displayed
}
```
### Enforcing Aspect Ratios to Stop Layout Shift (CLS)
Never let an image or video tag render without pre-defined geometric boundaries. Use the backend-provided aspect ratio to reserve the exact visual slot in CSS before the asset downloads:
```js
<!-- The component template forces the ratio layout natively -->
<article class="feed-post-card">
  <div class="media-container" style="aspect-ratio: 1.7778; background-color: #efefef;">
    <!-- Aspect-ratio preserves exact height dynamically, preventing CLS -->
    <img src="high-res-photo.jpg" loading="lazy" alt="User content" />
  </div>
</article>
```

### Media Viewport Management Loop
To automatically trigger video play/pause loops without crashing performance via expensive scrolling event listeners, wrap container observations inside an efficient `IntersectionObserver`:
```javascript
const videoObserverOptions = {
  root: null, // Tracks view relative to browser viewport
  threshold: 0.6 // Fires when 60% of the element is physically visible
};

const videoPlaybackObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const videoElement = entry.target.querySelector('video');
    if (!videoElement) return;

    if (entry.isIntersecting) {
      // Asset occupies >60% of visible window -> Play
      videoElement.play().catch(err => console.log("Autoplay blocked:", err));
    } else {
      // Asset scrolled out of frame -> Pause immediately to reclaim CPU/RAM
      videoElement.pause();
    }
  });
}, videoObserverOptions);

// Usage: Execute during the LLD instantiation of each post component card
// videoPlaybackObserver.observe(postDOMNode);
```
## 4. Performance, Resiliency & Bottlenecks
### Memory Leaks via Media Node Overload
- **The Bottleneck**: Leaving 200 heavy image nodes and 50 un-paused media structures attached to the DOM layout tree consumes huge quantities of hardware RAM. Mobile browsers will forcibly terminate the execution tab.
- **The Fix**: Deploy 1D List Virtualization (Windowing). As posts scroll out of a specific buffer range (e.g., 5 visible viewports away), completely remove their inner HTML structures from the DOM tree, replacing them with a completely empty layout wrapper <div> of the exact same physical height to preserve scrollbar position.

### Video Buffering Stutters
- **The Bottleneck**: Streaming massive raw .mp4 files raw over shaky networks creates massive user buffering delays and consumes excessive bandwidth.
- **The Fix**: Mandate HTTP Live Streaming (HLS) or DASH chunk streaming using standard media tools like video.js or hls.js. Break videos down into micro 2-second chunks (.ts format). The frontend dynamically tracks the user's connection speeds and swaps bitrates down to lower resolutions seamlessly mid-stream if the network drops.

### Optimistic UI Lag & Race Conditions
- **The Bottleneck**: When a user double-taps to like a post, waiting for a round-trip network response from the server before turning the heart icon red creates a sluggish, unresponsive interface.
- **The Fix**: Apply Optimistic Rendering. Immediately toggle the visual state, increment the counter value locally in your normalized store, and kick off the API payload background connection request. If the backend fails after retry loops, capture the error, silently revert the store parameter, and display an understated alert banner.