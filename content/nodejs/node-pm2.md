---
title: "PM2 Process Manager"
category: "nodejs"
chapterId: "node-devops"
slug: "node-pm2"
description: "Keeping apps alive in production with PM2 — clustering, log rotation, auto-restart."
---

# PM2 Process Manager

## What is PM2?

PM2 is a production process manager that keeps Node.js apps alive, restarts them on crash, manages logs, and can run multiple instances.

## Installation

```bash
npm install -g pm2
```

## Basic commands

```bash
pm2 start app.js             # start app
pm2 start app.js --name api  # with a name
pm2 stop api
pm2 restart api
pm2 delete api
pm2 list                     # list all processes
pm2 logs api                 # tail logs
pm2 monit                    # live dashboard
```

## Cluster mode — use all CPU cores

```bash
pm2 start app.js -i max      # one worker per CPU core
pm2 start app.js -i 4        # exactly 4 workers
```

## ecosystem.config.js — config file

```js
module.exports = {
  apps: [{
    name: 'api',
    script: './src/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'development', PORT: 3000 },
    env_production: { NODE_ENV: 'production', PORT: 3000 }
  }]
};
```

```bash
pm2 start ecosystem.config.js --env production
```

## Auto-start on server reboot

```bash
pm2 startup           # generates a startup script
pm2 save              # persists current process list
```

## Log rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```
