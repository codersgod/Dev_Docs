---
title: "Debugging"
category: "nodejs"
chapterId: "node-testing-debugging"
slug: "node-debugging"
description: "Chrome DevTools integration, VS Code debugger, and console methods."
---

# Debugging

## Chrome DevTools — node --inspect

```bash
node --inspect app.js
# or break on first line:
node --inspect-brk app.js
```

Open `chrome://inspect` in Chrome → click **"Open dedicated DevTools for Node"**.

- Set breakpoints in the Sources panel.
- Inspect call stacks and local variables.
- Take heap snapshots for memory profiling.

## VS Code debugger

Add a launch configuration in `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug App",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/app.js"
    }
  ]
}
```

Press **F5** to start. Set breakpoints by clicking the gutter in any `.js` file.

## Core console methods

```js
console.log('Info message');
console.warn('Warning');
console.error('Error');

// Inspect objects deeply
console.dir(obj, { depth: null });

// Measure elapsed time
console.time('fetch');
await fetchData();
console.timeEnd('fetch'); // fetch: 123ms

// Stack trace
console.trace('Where was this called?');
```

## Useful flags

```bash
# Print pending async operations keeping the process alive
node --pending-deprecation app.js

# Show deprecation warnings with stack traces
node --trace-deprecation app.js

# Watch mode (Node 18+) — restarts on file change
node --watch app.js
```
