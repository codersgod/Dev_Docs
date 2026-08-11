---
title: "Logging & APM"
category: "nodejs"
chapterId: "node-testing-debugging"
slug: "node-logging"
description: "Structured logging with Winston or Pino and APM with Datadog or New Relic."
---

# Logging & APM

## Why structured logging?

Plain `console.log` outputs unstructured strings. Structured logging outputs JSON so log aggregators (Datadog, Splunk, CloudWatch) can filter and query logs.

## Winston

```bash
npm install winston
```

```js
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

logger.info('Server started', { port: 3000 });
logger.error('DB connection failed', { error: err.message });
```

## Pino — faster alternative

```bash
npm install pino pino-pretty
```

```js
import pino from 'pino';

const logger = pino({ level: 'info' });

logger.info({ userId: 42 }, 'User logged in');
logger.error({ err }, 'Unexpected error');
```

Dev pretty-printing:

```bash
node app.js | pino-pretty
```

## Log levels

| Level | When to use |
|---|---|
| `error` | Unrecoverable failures |
| `warn` | Recoverable issues |
| `info` | Normal operational events |
| `debug` | Detailed diagnostic info (dev only) |

## APM (Application Performance Monitoring)

APM agents auto-instrument your app and send metrics, traces, and errors to a dashboard.

**Datadog:**
```bash
npm install dd-trace
```
```js
// Must be first import
import 'dd-trace/init';
```

**New Relic:**
```bash
npm install newrelic
```
```js
import 'newrelic'; // reads newrelic.js config
```

Both agents capture: request latency, error rates, slow DB queries, and distributed traces across microservices.
