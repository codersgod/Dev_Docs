---
title: "Real-Time Streams (WebSockets vs. SSE)"
category: "system-design"
chapterId: "fed-client-server-data"
slug: "fed-proto-websockets-sse-realtime"
description: "Choosing between bi-directional TCP communication (chat, collaboration) and one-way server-pushed HTTP streams (live feeds, telemetry).Long polling loops are inefficient and wasteful. Real-time streams allow servers to push data instantly to clients the millisecond an event occurs."
playgroundTemplate: "realtime-playground"
---

# Real-Time Streams (WebSockets vs. SSE)

## What is it?
Real-time streaming technologies **allow a backend server to push fresh data chunks to a client browser instantly the millisecond an event occurs**, completely eliminating the need for inefficient client-side periodic polling loops.

**WebSockets**: ( Bi-directional TCP (Transmission Control Protocol) Communication / Full Duplex )
- Initiated via an HTTP handshake (Upgrade: websocket) that upgrades the network layer to a permanent, raw TCP socket connection between the client and server for both upstream and downstream data frames.

**Server-Sent Events (SSE)**: ( Uni-directional HTTP Streaming / Half Duplex )
- A lightweight, one-way HTTP connection used by servers to push real-time text updates directly to the browser. The client handles this natively via the EventSource API, making it highly efficient and firewall-friendly.

| Feature | WebSockets | Server-Sent Events (SSE) |
|---------|------------|--------------------------|
| Direction | 🔄 Two-Way (Client ⇄ Server) | ➡️ One-Way (Server ➡️ Client) |
| Protocol | Custom (ws:// / wss://) | Standard HTTP |
| Data Types | Text and Binary (Images/Files) | Text-only (JSON/Strings) |
| Reconnection | Must code it manually | Automatic (Built into browser) |
| Firewalls | Can be blocked by strict proxies | Firewall-friendly (Standard traffic) |
| Best For | Chat apps, gaming, Figma | AI text streaming, stock dashboards, sports scores |

> Use WebSockets if the client needs to talk back constantly.
> - Example: Multiplayer Game, Figma Collaboration, Chat App

> Use SSE if the client just needs to sit back, watch, and listen.
> - Example: ChatGPT Generating a Response, live stock ticker, sports score updates, telemetry dashboards.

##  Why is it needed?
Traditional web communication relies on Request-Response. The client must ask for data before the server can send it. This creates massive inefficiencies for dynamic apps:

* **The Polling Problem**: Clients waste network bandwidth and battery by repeatedly asking, "Any new data?"
* **High Latency**: Data sits on the server waiting for the next client request, causing noticeable delays.
* **Bad User Experience**: Users miss critical, split-second updates (e.g., stock price drops, rideshare driver movements, or urgent chat messages).
> Without real-time streams, your system is forced to rely on the traditional Request-Response model, where a server can never talk unless the client is spoken to first.

## What is the process?
A real-time stream **shifts the architectural responsibility from the client to the server** through a simple, three-step process:

- **Client Subscribes**: The client establishes a connection to the server, indicating interest in specific data streams.
- **Server Pushes Updates**: The server continuously monitors for relevant events and pushes updates to the client as they occur.
- **Client Processes Updates**: The client receives the updates in real-time and updates the UI or triggers other actions accordingly.

![Real-time streaming concept](/real_time_streaming.png)

## What is the goal?
The ultimate goals of implementing real-time streams in a system design are:

* **Zero-Latency Data Delivery**: Pushing fresh data to the UI the exact millisecond it happens on the backend.
* **Resource Efficiency**: Eliminating millions of redundant, empty HTTP request/response cycles to save server CPU and client battery life.
* **Instant UI Synchronization**: Keeping the client state perfectly and smoothly synced with the backend data graph at all times.

## 🚕 Case Study: Uber / Ola Client App
Imagine you are looking at your phone screen after requesting a ride. Two distinct real-time features are active at the same time:

> **Feature 1: The Live Driver Car Map Marker (Uses SSE)**
>
> **The Scenario:** You are watching the tiny car icon move smoothly down the street on your map as it approaches your pickup spot.
>
> **Why it uses SSE:** This is a pure sit back and listen scenario. The driver's phone sends GPS coordinates to the Uber backend, and the backend continuously pushes those coordinate chunks down to your map. Your client app does not need to send anything back over this line; it is strictly consuming a stream of data. Using a lightweight SSE channel here saves massive server resources.

> **Feature 2: The In-App Live Chat with the Driver (Uses WebSockets)**
>
> **The Scenario:** The driver gets stuck at a light and opens the text chat. They type: "I am at the main gate, where are you?" You instantly reply: "Walking out now, wearing a blue jacket."
>
> **Why it uses WebSockets:** This is a constant back-and-forth talk back scenario. Both you and the driver are typing, sending, and receiving messages simultaneously. You need low-latency, full-duplex communication where messages can cross paths in mid-air instantly without checking headers.
![Uber Real-Time Streams](/realTime_streaming_caseStudy.png)

- SSE USAGE in CODE LEVEL
```js
//SERVER SIDE ===============================================
app.get('/location/stream', (req, res) => {
    // Send standard HTTP streaming headers
    res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });

    // Spontaneously push coordinates every 1 second
    const interval = setInterval(() => {
        const coords = { lat: 37.77, lng: -122.41, time: Date.now() };
        res.write(`data: ${JSON.stringify(coords)}\n\n`); // Must end in double newline
    }, 1000);

    req.on('close', () => clearInterval(interval)); // Stop loop on disconnect
});
//CLIENT SIDE =================================================
const sse = new EventSource('/location/stream');

// Listen natively for server pushes
sse.onmessage = (event) => {
    const coords = JSON.parse(event.data);
    updateMapMarker(coords.lat, coords.lng);
};

```
### 🗒️  EventSource ?

* **Definition**: A native browser API used by clients to easily connect to a **Server-Sent Events (SSE)** stream over standard HTTP.
* **Core Job**: It opens a persistent, one-way connection to a server URL and listens for text updates pushed by the backend.

#### 🌟 Key Native Features:
* **Auto-Reconnect**: Automatically detects network drops (like entering an elevator) and continually retries the connection without extra code.
* **Event Tagging**: Can sort different streams based on custom server labels (e.g., separating `chat-msg` from `typing-indicator` events).
* **Light Footprint**: Processes data chunks instantly as they arrive and wipes them from short-term browser memory to prevent lag.

#### 🛠️ Code Snippet
```javascript
const stream = new EventSource('/api/live-stream');
stream.onmessage = (event) => console.log("Pushed Data:", JSON.parse(event.data));
```


- WEB SOCKET USAGE in CODE LEVEL
```js
//SERVER  ===========================================================
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
    // Listen for messages coming UP from the client
    ws.on('message', (rawBytes) => {
        const msg = JSON.parse(rawBytes);
        console.log(`Received: ${msg.text}`);
        
        // Push a reply back DOWN the same pipe
        ws.send(JSON.stringify({ text: "Message received!" }));
    });
});
//CLIENT  ===========================================================
const ws = new WebSocket('ws://localhost:8080');
// Send data up to the server anytime
function sendMessage(textMessage) {
    ws.send(JSON.stringify({ text: textMessage }));
}
// Listen for messages arriving down from the server
ws.onmessage = (event) => {
    const reply = JSON.parse(event.data);
    displayChatBubble(reply.text);
};
```

⚠️ **Warning:** **Real-Time Traps Summary** :-

> **The Traffic Jam (Head-of-Line Blocking):** One lost data packet freezes the entire single TCP internet pipe, stopping all app traffic in that browser tab.  
> - **The Fix:** Use HTTP/3 (UDP) so a dropped packet only slows down its own independent stream.  
>
> **The Memory Freeze (Stateful Server Drain):** Keeping connections open forever fills up the server's RAM, causing a silent crash even if CPU usage is low.  
> - **The Fix:** Offload open connections to dedicated proxy tools like Envoy or AWS API Gateway to keep main servers lightweight.