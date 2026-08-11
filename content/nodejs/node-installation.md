---
title: "Node Installation"
category: "nodejs"
chapterId: "node-runtime-env"
slug: "node-installation"
description: "What installing Node.js deploys — V8, libuv, and the node executable."
---

# Node Installation

## What gets installed

Installing Node.js deploys three core components onto your operating system:

| Component | Role |
|---|---|
| **V8 engine** | Compiles and executes JavaScript |
| **libuv** | C++ async I/O layer and thread pool |
| **`node` executable** | CLI command to run JS files |

```bash
node --version    # v20.x.x
npm --version     # 10.x.x  (bundled package manager)
```

## Installation options

### Option 1 — Official installer (nodejs.org)
Download the LTS installer for your OS. Simple, but hard to switch versions.

### Option 2 — nvm (recommended for development)

nvm lets you install and switch between multiple Node.js versions per project.

```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install a Node version
nvm install 20
nvm install 22

# Use a specific version
nvm use 20

# Set a default
nvm alias default 20
```

### Option 3 — fnm (faster alternative to nvm)

```bash
# Windows
winget install Schniz.fnm

fnm install 20
fnm use 20
```

### Option 4 — Package managers

```bash
# macOS
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## .nvmrc — pin version per project

```bash
# .nvmrc
20
```

```bash
nvm use   # reads .nvmrc automatically
```

## LTS vs Current

| Channel | Stability | Use for |
|---|---|---|
| **LTS** (even numbers: 20, 22) | High | Production |
| **Current** (odd numbers: 21, 23) | Latest features | Experimentation |
