---
title: "Docker & Containers"
category: "nodejs"
chapterId: "node-devops"
slug: "node-docker"
description: "Multi-stage Dockerfile layers optimised for minimal production Node.js images."
---

# Docker & Containers

## Multi-stage Dockerfile

Multi-stage builds compile/install in one stage and copy only what's needed to a lean production image.

```dockerfile
# ── Stage 1: Install dependencies ──────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ── Stage 2: Build (if TypeScript or bundling) ──────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 3: Production image ───────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy only prod deps and built output
COPY --from=deps     /app/node_modules ./node_modules
COPY --from=builder  /app/dist         ./dist
COPY package.json    .

# Run as non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000
CMD ["node", "dist/app.js"]
```

## .dockerignore

```
node_modules
.env
.git
dist
*.log
```

## Common commands

```bash
docker build -t my-api .
docker run -p 3000:3000 --env-file .env my-api

# With Docker Compose
docker compose up --build
docker compose down
```

## docker-compose.yml example

```yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [db, redis]

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: secret

  redis:
    image: redis:7-alpine
```

## Best practices

- Use `node:20-alpine` (small image, ~50 MB vs ~1 GB for full Debian).
- Never run the container as root — add a non-root user.
- Pin image versions (`node:20.15-alpine`) for reproducible builds.
- Pass secrets via environment variables, not baked into the image.
