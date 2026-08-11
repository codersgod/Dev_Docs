---
title: "Scaling & Cluster"
category: "nodejs"
chapterId: "node-advanced-performance"
slug: "node-scaling"
description: "The cluster module for multi-core usage and reverse proxy patterns."
---

# Scaling & Cluster

## The problem

Node.js is single-threaded — one process only uses one CPU core.

## cluster module

Fork one worker per CPU core. The OS distributes incoming connections across workers.

```js
import cluster from 'cluster';
import http from 'http';
import os from 'os';

if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died — restarting`);
    cluster.fork();
  });
} else {
  http.createServer((req, res) => {
    res.end('Hello from worker ' + process.pid);
  }).listen(3000);
}
```

## Reverse proxy (Nginx)

Nginx sits in front of multiple Node.js processes and load-balances between them.

```
Client → Nginx (port 80/443) → Node process :3001
                              → Node process :3002
                              → Node process :3003
```

**Nginx config snippet:**

```nginx
upstream node_app {
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
  server 127.0.0.1:3003;
}

server {
  listen 80;
  location / {
    proxy_pass http://node_app;
  }
}
```

## PM2 cluster mode (easiest)

```bash
pm2 start app.js -i max   # fork one worker per CPU
```
