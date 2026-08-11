---
title: "Real-time Web"
category: "nodejs"
chapterId: "node-frameworks-api"
slug: "node-realtime"
description: "WebSockets, native ws package, and Socket.io for bi-directional communication."
---

# Real-time Web

## WebSocket basics

WebSocket is a persistent, bi-directional connection between client and server — unlike HTTP which is request/response only.

Use cases: chat, live dashboards, collaborative editing, game state.

## Native `ws` package

```bash
npm install ws
```

```js
// Server
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    console.log('Received:', data.toString());
    socket.send('Echo: ' + data);
  });

  socket.on('close', () => console.log('Client disconnected'));
});
```

```js
// Browser client
const ws = new WebSocket('ws://localhost:8080');
ws.onopen    = () => ws.send('Hello server!');
ws.onmessage = (e) => console.log(e.data);
```

## Socket.io — higher-level abstraction

Adds rooms, namespaces, auto-reconnect, and fallback to HTTP polling.

```bash
npm install socket.io
```

```js
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000' }
});

io.on('connection', (socket) => {
  socket.join('room-1');

  socket.on('chat:message', (msg) => {
    io.to('room-1').emit('chat:message', msg); // broadcast to room
  });
});

httpServer.listen(3001);
```

```js
// Browser
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');
socket.emit('chat:message', { text: 'Hello!' });
socket.on('chat:message', (msg) => console.log(msg));
```

## ws vs Socket.io

| | `ws` | `socket.io` |
|---|---|---|
| Weight | Minimal | Heavier |
| Rooms | Manual | Built-in |
| Reconnect | Manual | Built-in |
| Fallback | None | HTTP polling |
