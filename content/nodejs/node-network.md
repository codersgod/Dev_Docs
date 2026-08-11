---
title: "Network Modules"
category: "nodejs"
chapterId: "node-core-modules"
slug: "node-network"
description: "Raw HTTP/HTTPS servers, TCP sockets, and UDP communication."
---

# Network Modules

## What is it?

Node provides built-in modules for network servers and clients.

- `http` / `https`: Low-level modules used to build raw web servers, parse incoming headers, and make external **web requests** without using heavy frameworks.
- `net` (TCP Sockets): Handles continuous, reliable, two-way connection streams. It is used for **real-time applications like chat protocols, database connections, and custom server-to-server networks.**
- `dgram` (UDP Communication): Handles fast, fire-and-forget message packets without checking if they arrive. It is **ideal for video streaming, online gaming, and live DNS lookups** where speed is more important than perfect data accuracy.

## HTTP server example

```js
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node');
});

server.listen(3000);
```

## TCP example

```js
const net = require('net');

const server = net.createServer((socket) => {
  console.log('Client connected!');
  
  // Received data arrives as a raw Buffer chunk
  socket.on('data', (data) => {
    socket.write(`Echo: ${data}`); 
  });
});

server.listen(8080, () => console.log('TCP Server listening on port 8080'));

```

## DGRAM example

```js
const dgram = require('dgram');

// 1. Server: Listens on port 41234
const server = dgram.createSocket('udp4');
server.on('message', (msg) => console.log(`Received: ${msg}`));
server.bind(41234);

// 2. Client: Blasts a single packet and closes
const client = dgram.createSocket('udp4');
client.send(Buffer.from('Hi'), 41234, 'localhost', () => client.close());

```
