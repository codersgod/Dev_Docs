---
title: "Case Study: Collaborative Rich-Text Document Editor"
category: "system-design-case-study"
chapterId: "fed-case-studies-complex-state"
slug: "fed-interview-collaborative-text-editor"
description: "Designing an editor workspace handling highly concurrent inputs, cursor positions, and resolving editing conflict models (CRDTs/OT)."
type: "Both"
playgroundTemplate: "collaborative-editor"
---

# Case Study: Collaborative Rich-Text Document Editor

## 1. System Requirements & Scale Bounds

### Functional Requirements (FRs)
*   **Real-Time Collaborative Editing**: Multiple users can view and simultaneously edit the exact same rich-text document with sub-second update latencies.
*   **Presence & Cursor Tracking**: Display the real-time cursor positions, selections, and profile names of all active users inside the document.
*   **Offline Synchronization**: Allow users to keep typing while disconnected from the internet and merge their text edits cleanly once they reconnect.

### Non-Functional Requirements (NFRs)
*   **Absolute Convergence Guarantee**: Every user's browser must eventually converge to display identical text content, regardless of the order or latency of network updates.
*   **Zero Character Jitter**: Resolving text conflicts must happen silently behind the scenes without shifting the active user's current cursor position or deleting their text.
*   **Network Payload Minimization**: Broadcast compact character delta arrays over the network wire instead of transmitting the full document string repeatedly.

---

## 2. High-Level Design (HLD)

The system deploys a distributed mesh architecture over WebSockets to broadcast small character adjustments to a central synchronization coordinator:

```text
[ Client Editor 1 ] ──(Local Mutation)──> [ WebSocket Pipe ] ──┐
                                                               ▼
[ Client Editor 2 ] ────────────────────────────────────────> [ WebSocket Central Gateway Cluster ]
                                                               │            │
                                                      (Publish Delta) (Sync State)
                                                               ▼            ▼
[ In-Memory Global Cache (Redis) ] <──────────────────────────┴────────> [ Document Storage DB ]
```

### The Collaboration Pipeline
1.  **State Initialization**: The browser client fires a request to a BFF Gateway to fetch the current document content snapshot alongside metadata logs.
2.  **Duplex Message Gateway**: The client builds a permanent WebSocket link to a stateful gateway cluster.
3.  **Conflict Resolution Engine**: When a user presses a key, the change compiles into a lightweight delta packet. This packet passes down the WebSocket pipe, updates an in-memory document state cache, and broadcasts down to all other active peer channels instantly.

---

## 3. Low-Level Design (LLD)

### Operational Transformation (OT) vs. CRDTs
When two users type in the exact same index location at the same time, a system design conflict occurs. There are two primary architectural models used to handle this:

*   **Operational Transformation (OT)** (Used by Google Docs): Rely on a centralized server acting as a single source of truth. The server receives text operations (e.g., `Insert(index: 5, char: 'A')`), adjusts their index parameters based on concurrent history logs, and broadcasts the corrected operation back to the clients.
*   **Conflict-Free Replicated Data Types (CRDTs)** (Used by Figma): A decentralized approach where every character inserted is assigned a unique, immutable cryptographic or fractional ID string. Because IDs are globally unique, character nodes can be merged mathematically in any order on any machine without a centralized server broker, natively enabling offline compilation and decentralized syncing.

```text
[Operational Transformation]   Client Op ──> Server Adjusts Index ──> Absolute Synchronized Convergence
[CRDT Fractional Indexing]     Char 'X' assigned ID [1.5] ──> Safely inserted between ID [1.0] and [2.0]
```

### Granular Mutation Change Delta Contract
The collaboration pipeline avoids transmitting full document text strings, opting instead to broadcast compact event delta packets that describe specific modifications:

```json
{
  "action": "doc_edit",
  "payload": {
    "documentId": "doc_engineering_specs_2026",
    "userId": "usr_991",
    "operation": "insert",
    "characterId": "usr_991_timestamp_17918342",
    "targetPositionId": "usr_202_timestamp_14102", 
    "value": "W",
    "cursorOffset": 142
  }
}
```

---

## 4. Implementation Blueprint

The following low-level blueprint details a custom collaborative document synchronization manager utilizing a simplified **Fractional Indexing CRDT model** to ensure conflict-free convergence during live editing loops.

```javascript
// client-collaborative-editor.js - Low-Level Design (LLD) Implementation
export class CollaborativeEditorManager {
  constructor(documentId, editableDomNode, socketConnection) {
    this.docId = documentId;
    this.editorNode = editableDomNode;
    this.ws = socketConnection;
    
    // In-memory CRDT model: ordered list of character structures
    // Format: { id: "user_timestamp", value: "H", indexScore: 1.0 }
    this.documentModel = []; 
  }

  initialize() {
    this.editorNode.setAttribute('contenteditable', 'true');

    // 1. Intercept raw user key inputs inside the DOM view tree
    this.editorNode.addEventListener('beforeinput', (event) => this.handleLocalInputMutation(event));

    // 2. Setup incoming real-time socket packet listeners
    this.ws.addEventListener('message', (event) => {
      try {
        const networkPacket = JSON.parse(event.data);
        if (networkPacket.action === "doc_edit") {
          this.applyRemoteMutation(networkPacket.payload);
        }
      } catch (err) {
        console.error(`[CRDT Core Error Parsing]: ${err.message}`);
      }
    });
  }

  handleLocalInputMutation(event) {
    if (event.inputType !== 'insertText') return; // Simplified logic targeting character injections
    
    const charToInsert = event.data;
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const nativeCursorIndex = selection.getRangeAt(0).startOffset;

    // 3. CRDT Fractional Indexing Allocation Math
    // Find surrounding item scores to calculate a precise unique score in between them
    const previousNode = this.documentModel[nativeCursorIndex - 1];
    const nextNode = this.documentModel[nativeCursorIndex];

    const prevScore = previousNode ? previousNode.indexScore : 0.0;
    const nextScore = nextNode ? nextNode.indexScore : 2.0;
    
    // Calculate fractional midpoint score to prevent document-wide index collisions
    const dynamicAllocatedScore = prevScore + (nextScore - prevScore) / 2;
    const characterId = `char_${Math.random().toString(36).substring(2)}_${Date.now()}`;

    const crdtNodeItem = {
      id: characterId,
      value: charToInsert,
      indexScore: dynamicAllocatedScore
    };

    // 4. Inject structural item into the local memory data track model
    this.documentModel.splice(nativeCursorIndex, 0, crdtNodeItem);

    // 5. Fire compact action delta down the real-time network pipe
    this.ws.send(JSON.stringify({
      action: "doc_edit",
      payload: {
        documentId: this.docId,
        operation: "insert",
        node: crdtNodeItem
      }
    }));
  }

  applyRemoteMutation(remotePayload) {
    const { operation, node } = remotePayload;

    if (operation === "insert") {
      // 6. ABSOLUTE CONVERGENCE LOOP: Find the precise score slot to insert the character
      let targetInsertionIndex = this.documentModel.findIndex(item => item.indexScore > node.indexScore);
      if (targetInsertionIndex === -1) targetInsertionIndex = this.documentModel.length;

      // Ensure item identity isn't duplicated across race conditions
      const nodeExists = this.documentModel.some(item => item.id === node.id);
      if (nodeExists) return;

      this.documentModel.splice(targetInsertionIndex, 0, node);
      
      // 7. Re-render visual presentation layout based on the updated data model
      this.refreshEditorLayoutDom();
    }
  }

  refreshEditorLayoutDom() {
    // Capture user selection offset parameters to protect cursor position context
    const cachedSelectionOffset = window.getSelection().getRangeAt(0).startOffset;

    // Reconstruct the text string from the sorted CRDT model array rows
    const consolidatedString = this.documentModel.map(item => item.value).join('');
    this.editorNode.innerText = consolidatedString;

    // LLD Cursor Correction Rule: Re-apply visual selection indices to eradicate text jump layout flickers
    this.restoreUserCursorIndex(cachedSelectionOffset);
  }

  restoreUserCursorIndex(targetOffset) {
    const range = document.createRange();
    const selection = window.getSelection();
    
    if (this.editorNode.childNodes.length > 0) {
      const safeOffset = Math.min(targetOffset, this.editorNode.childNodes[0].length);
      range.setStart(this.editorNode.childNodes[0], safeOffset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}
```

> ⚠️ **Warning:**: When handling rich-text synchronization, be extremely cautious about letting layout operations execute indiscriminately on large document structures. Processing massive arrays of characters via JavaScript on a single thread can quickly saturate mobile CPU registers. This causes user input execution paths to stall, resulting in severe interaction latency (INP degradation). To protect performance, chunk document structures into isolated paragraphs and restrict synchronization loops exclusively to active block text models.