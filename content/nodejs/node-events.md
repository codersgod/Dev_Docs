---
title: "Events & EventEmitter"
category: "nodejs"
chapterId: "node-core-modules"
slug: "node-events"
description: "Custom event listeners, .on(), .once(), and listener memory leaks."
---

# Events & EventEmitter

## What is it?

`EventEmitter` lets you publish and subscribe to custom events.
- **Publish (emit)**: Triggers a named event and sends data to any listeners.
- **Subscribe (on)**: Listens for a named event and runs a callback function when it is triggered.

## Example

```js
import { EventEmitter } from 'node:events';

const bus = new EventEmitter();

bus.on('ready', () => console.log('ready with .on'));
bus.once('init', () => console.log('init once'));

bus.emit('ready');
bus.emit('init');
bus.emit('init'); // not called again
```

## Memory leak caution

If listeners are added repeatedly and never removed, memory usage grows.

```js
bus.removeListener('ready', handler);
// or
bus.off('ready', handler);
```

## Listening to Events (Subscribing)
- **on(event, listener)**: Adds a listener function that runs every time the event is emitted.
- **once(event, listener)**: Adds a one-time listener that runs only the next time the event fires, then removes itself.
- **prependListener(event, listener)**: Adds a listener to the very front of the listeners queue, forcing it to run before existing listeners.

## Triggering Events (Publishing)
- **emit(event, ...args)**: Synchronously calls each listener registered for the named event, passing them the supplied arguments.

## Removing Listeners (Unsubscribing)
- **off(event, listener) / removeListener(event, listener)**: Removes a specific listener function from the named event.
- **removeAllListeners([event])**: Deletes all listeners from a specific event, or clears all events on the emitter if no event name is provided.

## Utility & Inspection
- **listenerCount(event)**: Returns the total number of listeners attached to a specific event name.
- **eventNames()**: Returns an array listing all active event names that currently have listeners attached.
