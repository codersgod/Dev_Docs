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
Real-time streaming technologies **allow a backend server to push fresh data chunks to a client browser sequentially over a direct, open connection the millisecond an event occurs**, completely eliminating the need for inefficient client-side periodic polling loops (1 by 1).

**WebSockets**:  **Bi-directional TCP** (Transmission Control Protocol) Communication (Full Duplex)
- Starts with an `HTTP handshake` (Upgrade: websocket - from HTTP) that opens a ***permanent, two-way highway between client and server***. Both sides can send data frames to each other simultaneously at any time over a single connection.
> **Use WebSockets** if the ***client-server needs to talk back-and-forth constantly*** (Multiplayer Game, Figma Collaboration, Chat App,...etc).

**Server-Sent Events (SSE)**: **Uni-directional HTTP** (Half Duplex)
- A lightweight, `one-way HTTP connection` ***used by servers to push real-time text updates directly to the browser***. The client handles this natively via the `EventSource API`, making it highly efficient and firewall-friendly.
> **Use SSE** if the ***client just needs to sit back, watch, and listen*** (ChatGPT Generating a Response, live stock ticker, sports score updates, telemetry dashboards,...etc).

| Feature | WebSockets | Server-Sent Events (SSE) |
|---------|------------|--------------------------|
| Direction | 🔄 Two-Way (Client ⇄ Server) | ➡️ One-Way (Server ➡️ Client) |
| Protocol | Custom (ws:// / wss://) | Standard HTTP |
| Data Types | Text and Binary (Images/Files) | Text-only (JSON/Strings) |
| Reconnection | Must code it manually | Automatic (Built into browser) |
| Firewalls | Can be blocked by strict proxies | Firewall-friendly (Standard traffic) |
| Best For | Chat apps, gaming, Figma | AI text streaming, stock dashboards, sports scores |

##  Why is it needed?
Traditional HTTP is "client-first." The ***server is not allowed to talk unless the client asks a question first***. This breaks modern apps because of three major issues:

**PROBLEMS**:
* **Wasted Power & Bandwidth**: Clients must constantly ask, "Any new data?" over and over. Most answers are "No," which wastes battery and server power.
* **Lag & Delays**: New data sits trapped on the server until the client gets around to asking for it again.
* **Bad User Experience**: Users miss split-second updates like a dropping stock price, an incoming text, or a moving Uber driver.

**SOLUTION**: 
- `WebSockets` and `SSE` fix this by ***opening a permanent, open doorway***. 
- **zero-latency delivery**: The server can ***now instantly push data to the client*** the exact millisecond it happens).
- **Resource Efficiency**: ***Cuts out millions of wasteful, empty requests*** to save server power and phone battery.
- **Instant UI Synchronization**: Keeps the ***user's screen smoothly and perfectly synced*** with the database at all times.

## How Real-Time Streaming Works in 3 Steps?
A real-time stream **shifts the architectural responsibility from the client to the server** through a simple, three-step process:

- **Client Subscribes**: The client establishes a connection to the server, indicating interest in specific data streams.
- **Server Pushes Updates**: The server continuously monitors for relevant events and pushes updates to the client as they occur.
- **Client Processes Updates**: The client receives the updates in real-time and updates the UI or triggers other actions accordingly.

![Real-time streaming concept](/ws_sse.png)

>## 🚕 Case Study: Uber / Ola Client App
>Imagine you are looking at your phone screen after requesting a ride. Two distinct real-time features are active at the same time:

**Feature 1: The Live Driver Car Map Marker (Uses SSE)**
>
> **The Scenario:** You are watching the tiny car icon move smoothly down the street on your map as it approaches your pickup spot.
>
> **Why it uses SSE:** This is a pure sit back and listen scenario. ***The driver's phone sends GPS coordinates to the Uber backend, and the backend continuously pushes those coordinate chunks down to your map**. Your client app does not need to send anything back over this line; it is strictly consuming a stream of data. Using a lightweight SSE channel here saves massive server resources.

**Feature 2: The In-App Live Chat with the Driver (Uses WebSockets)**
>
> **The Scenario:** The driver gets stuck at a light and opens the text chat. They type: "I am at the main gate, where are you?" You instantly reply: "Walking out now, wearing a blue jacket."
>
> **Why it uses WebSockets:** This is a ***constant back-and-forth talk back scenario***. Both you and the driver are typing, sending, and receiving messages simultaneously. You need low-latency, full-duplex communication where messages can cross paths in mid-air instantly without checking headers.
![Uber Real-Time Streams](/CS_ws_sse.png)

## SSE USAGE in CODE LEVEL
```js
//SERVER SIDE ===============================================
app.get('/location/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    // Spontaneously push coordinates every 1 second
    const interval = setInterval(() => {
        const coords = { lat: 37.77, lng: -122.41, time: Date.now() };
        res.write(`data: ${JSON.stringify(coords)}\n\n`); // Must end in double newline
    }, 1000);

    req.on('close', () => clearInterval(interval)); // Stop loop on disconnect
    res.end(); // End the response when client disconnects
});

//CLIENT SIDE ===============================================
const eventSource = new EventSource('/location/stream');
eventSource.onmessage = (event) => {
    const coords = JSON.parse(event.data);
    updateMapMarker(coords.lat, coords.lng);
};
```
## Web Socket USAGE in CODE LEVEL
```js
// SERVER SIDE ===============================================
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Driver or Rider connected to chat room');
    // Handle incoming messages from either party
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Broadcast the message back to all connected parties in the room
        wss.clients.forEach(client => {
            if (client.readyState === 1) { // 1 means OPEN
                client.send(`Echo: ${message}`);
            }
        });
    });
});

// CLIENT SIDE ===============================================
// Native browser API for handling full-duplex WebSocket communication
const ws = new WebSocket('ws://localhost:8080');
// Send text data instantly over the persistent connection
function sendMessage(text) {
    ws.send(text);
}
// Handle incoming live responses from the driver
ws.onmessage = (event) => {
    console.log("New chat message appeared in UI:", event.data);
};
// Example usage
setTimeout(() => sendMessage("I am wearing a blue jacket"), 2000);
```
⚠️ **Warning:** **Real-Time Traps Summary** :-

> **The Traffic Jam (Head-of-Line Blocking):** One lost data packet freezes the entire single TCP internet pipe, stopping all app traffic in that browser tab.  
> - **The Fix:** Use HTTP/3 (UDP) so a dropped packet only slows down its own independent stream.  
>
> **The Memory Freeze (Stateful Server Drain):** Keeping connections open forever fills up the server's RAM, causing a silent crash even if CPU usage is low.  
> - **The Fix:** Offload open connections to dedicated proxy tools like Envoy or AWS API Gateway to keep main servers lightweight.