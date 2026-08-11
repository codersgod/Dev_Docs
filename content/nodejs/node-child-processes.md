---
title: "Child Processes"
category: "nodejs"
chapterId: "node-advanced-performance"
slug: "node-child-processes"
description: "spawn, exec, execFile, and fork for running external commands."
---

# Child Processes

## Four methods

| Method | Shell | Stream output | Use for |
|---|---|---|---|
| `spawn()` | No | Yes | Long-running, large output |
| `exec()` | Yes | No (buffer) | Short commands |
| `execFile()` | No | No (buffer) | Executable files directly |
| `fork()` | No | No | Another Node.js script |

## spawn — streaming output

```js
import { spawn } from 'child_process';

const ls = spawn('ls', ['-lh', '/tmp']);

ls.stdout.on('data', (data) => process.stdout.write(data));
ls.stderr.on('data', (data) => process.stderr.write(data));
ls.on('close', (code) => console.log('Exited with code', code));
```

## exec — buffered output

```js
import { exec } from 'child_process';

exec('git log --oneline -5', (err, stdout, stderr) => {
  if (err) return console.error(err);
  console.log(stdout);
});
```

## fork — separate Node.js process with IPC

```js
// main.js
import { fork } from 'child_process';
const child = fork('./worker.js');
child.send({ task: 'compute' });
child.on('message', (msg) => console.log('Got:', msg));

// worker.js
process.on('message', (msg) => {
  process.send({ result: 42 });
});
```

## Security note

Never pass unsanitised user input to `exec()` — it runs in a shell and is vulnerable to command injection. Prefer `execFile()` or `spawn()` with argument arrays.
