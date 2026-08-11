---
title: "Node REPL"
category: "nodejs"
chapterId: "node-runtime-env"
slug: "node-repl"
description: "Interactive Read-Eval-Print-Loop for rapid prototyping and API exploration."
---

# Node REPL

## What is it?

REPL stands for **Read-Eval-Print-Loop**. It is an interactive shell that:

1. **Reads** your input
2. **Evaluates** it through V8
3. **Prints** the result
4. **Loops** back to wait for the next input

It creates a live Node.js process in your terminal — no file needed.

## Starting the REPL

```bash
node
```

```
Welcome to Node.js v20.x.x
Type ".help" for more information.
>
```

## Basic usage

```
> 2 + 2
4
> 'hello'.toUpperCase()
'HELLO'
> const arr = [1, 2, 3]
undefined
> arr.map(x => x * 2)
[ 2, 4, 6 ]
```

## Useful REPL commands

| Command | Action |
|---|---|
| `.help` | List all REPL commands |
| `.exit` | Exit the REPL (or Ctrl+C twice) |
| `.clear` | Reset the REPL context |
| `.load file.js` | Load and execute a JS file |
| `.save file.js` | Save the current session to a file |
| `_` | Special variable — holds the last evaluated value |

```
> 10 * 5
50
> _ + 10
60
```

## Multi-line input

Press **Enter** at the end of an incomplete expression — REPL enters multi-line mode (shown by `...`):

```
> function greet(name) {
...   return `Hello, ${name}!`;
... }
undefined
> greet('Node')
'Hello, Node!'
```

## Require modules in the REPL

```
> const fs = require('fs')
undefined
> fs.readdirSync('.')
[ 'package.json', 'src', 'node_modules', ... ]
```

## Use cases

- Quick API exploration without writing a file.
- Testing small code snippets.
- Scratchpad debugging during development.
