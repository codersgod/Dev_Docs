---
title: "Case Study: Real-Time Chat Application"
category: "system-design-case-study"
chapterId: "fed-case-studies-complex-state"
slug: "fed-interview-chat-ui-architecture"
description: "Architecting persistent communication states handling socket reconnections, message delivery queues, and local state management counters."
type: "Both"
playgroundTemplate: "chat-system"
---

# Case Study: Real-Time Chat Application
Designing a real-time chat application (like WhatsApp, Messenger, or Slack) requires a complete shift in engineering perspective. Instead of building static UI components, your objective is to build a highly resilient, low-latency communication system. The primary engineering challenge is to maintain persistent connection states while ensuring message delivery guarantees and local state management.
- The major engineering challenge shifts from standard layout rendering to ***state synchronization, connection lifecycle orchestration, and persistent local storage synchronization***.

## 1. Requirements Gathering

### Functional Requirements
- **Real-Time Message Delivery:** Deliver incoming text messages instantly (<50ms) to active chat windows without forcing manual polling.
- **Connection State Indicators:** Display live global network presence markers (Online, Offline, Typing...) for all visible users.
- **Delivery Status Receipts:** Track and update individual message states dynamically (Sending, Sent, Delivered, Read).
- **Offline Message Access:** Allow users to fully browse and search previously loaded channels and threads while completely offline.

### Non-Functional Requirements (The FED System Constraints)
- **State-to-UI Sync Fluency:** Prevent UI freezing or list stuttering when deep chat histories are flooded with highly rapid bursts of inbound group messages.
- **Reconnection Elasticity:** Seamlessly heal connection dropouts on spotty networks, automatically backfilling missing sequence gaps without breaking conversational order.
- **Optimistic Responsiveness:** Ensure user messages register instantly in the scroll view before the server confirms receiving them.
- **Battery & CPU Conservation:** Avoid polling patterns that drain device hardware batteries and lock up layout frames.

## 2. High-Level Architecture (HLD)
The live bidirectional layout bridges the browser's persistent local storage layer and background event streams directly to the real-time websocket cluster gateways:
![Real-Time Chat System Architecture](/CS_realTimeChat.png)

##  3. Component & Low-Level Design (LLD)
### The Offline-First Data Schema: 
To support high-performance local search, sorting, and immediate offline loads, manage client state via a relational database schema layout inside browser IndexedDB instead of using floating arrays:
```js
// Define clean schemas inside local IndexedDB storage
interface ChatDatabaseSchema {
  channels: {
    key: string; // channelId
    name: string;
    lastMessageTimestamp: number;
  };
  messages: {
    key: string; // messageId (UUID generated on client)
    channelId: string;
    senderId: string;
    text: string;
    timestamp: number;
    status: 'SENDING' | 'SENT' | 'DELIVERED' | 'READ';
  };
}
```
### Orchestrating the Connection Manager with Heartbeats
To prevent the client from holding onto dead connections or leaking socket memory, establish an automated heartbeat pattern within your low-level connection controller wrapper:

```js
class RealTimeConnectionManager {
  private socket: WebSocket | null = null;
  private pingInterval: any;
  private reconnectTimeout: any;
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  public connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.startHeartbeat();
      this.flushOfflineQueue();
      updateGlobalUIState('CONNECTED');
    };

    this.socket.onmessage = (event) => {
      const serverEvent = JSON.parse(event.data);
      this.handleInboundPayload(serverEvent);
    };

    this.socket.onclose = () => {
      this.handleDisconnection();
    };
  }

  private startHeartbeat() {
    clearInterval(this.pingInterval);
    this.pingInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'PING' }));
      }
    }, 30000); // Send PING frame every 30 seconds
  }

  private handleDisconnection() {
    updateGlobalUIState('DISCONNECTED');
    clearInterval(this.pingInterval);
    
    // Exponential backoff reconnection loop logic
    clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
  }
}
```
## 🚀 4. Performance, Resiliency & Bottlenecks
### Message Ordering & Serialization Breaks (Race Conditions)
- **The Bottleneck**: On flaky networks, if a user sends message A and then immediately message B, a temporary dropout can cause message B to hit the server database first. Conversations display completely out of order, fracturing context.
- **The Fix**: Attach a deterministic client-side Logical Sequence ID or vector clock timestamp onto every message payload before delivery. The receiving client uses this local sequence ID to enforce strict chronological sorting inside the active chat layout, decoupled from the unpredictable order of server delivery confirmation frames.

### Infinite Scroll Stutters inside Dense Chat Channels
- **The Bottleneck**: As users aggressively scroll upward into deep chat history, appending 5,000 old chat rows simultaneously blows up the browser DOM footprint, introducing layout lag and raising INP scores on incoming keystrokes.
- **The Fix**: Deploy Bidirectional List Virtualization (Windowing). Maintain a fixed container pool of active DOM elements on screen. As the user scrolls upward, unmount bottom message elements, mount older history items on top, and dynamically adjust scroll offset calculations to anchor the scrollbar securely without creating disorienting visual jumps.

### Reconnection State Flooding (The Thundering Herd)
- **The Bottleneck**: When an office building loses internet connection for 5 minutes, 500 active client instances drop offline. The instant connectivity returns, all 500 apps trigger simultaneous bulk API synchronization queries to backfill missed logs, completely crashing your server gateways.
- **The Fix**: Implement Jittered Exponential Backoff. When the connection drops, space reconnection cycles using a randomized scale formula (\(RetryDelay = Base \times 2^{attempt} + Jitter\)). This disperses client request spikes smoothly, preventing immediate cluster overloads.