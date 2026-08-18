---
title: "API Paradigms"
category: "system-design"
chapterId: "fed-client-server-data"
slug: "fed-proto-rest-graphql-tradeoffs"
description: "Evaluating architectural trade-offs between REST, GraphQL over-fetching and under-fetching, query cost modeling, schema definitions, and client-side payload sizing."
playgroundTemplate: "api-playground"
---

# API Paradigms (REST vs. GraphQL vs gRPC-web vs tRPC / RPC.)

## What is API Paradigms?
An API paradigm is a **set of rules and conventions that define how a client (like a web browser) communicates with a server**.
- It determines the structure of requests and responses , the way data is fetched, and how clients interact with backend services.
- Common paradigms **include REST, GraphQL, gRPC-web, and tRPC/RPC**.

## Why API Paradigms Needed ?
Choosing the right API paradigm is **crucial for performance, scalability, and maintainability** of web applications. Choosing the right API paradigm **directly impacts your system architecture, loading speeds, and cloud costs**.
- **Payload Size Control**: Keeps files small to avoid wasting user mobile data.
- **Network Latency Impact**: Prevents slow, back-to-back requests that freeze the screen.
- **Caching Layout Strategy**: Lets fast Edge CDNs handle traffic instead of expensive databases.
- **Client Runtime Defense**: Saves phone battery life by keeping browser memory clean.

![API Paradigms Concept](/API_paradigm.png)

## ⚙️ The Architectural Mental Process: Selecting an API Paradigm
* **Check the Data Shape**: Select REST for simple, isolated resources, or GraphQL/gRPC-web for deeply nested, interconnected relational models.
* **Check the Network Speed**: Choose field-specific queries (GraphQL) or compressed binary payloads (gRPC-web) to defend weak mobile networks against heavy text bloat.
* **Check the Caching Needs**: Prioritize REST to leverage native, public Edge CDN reverse-proxy caching layers for highly repetitive public content.
* **Check the Code Repository**. Propose tRPC/RPC inside single-repo TypeScript monorepos to eliminate integration bugs via compile-time type safety.

## 🔌 The 4 Core API Paradigms Matrix

### 🏛️ 1. REST (Resource-Based Isolation)
* **Concept**: Maps data entities to unique individual URL endpoints (e.g., `/api/users`).
* **Win**: Flawless native Edge CDN and browser cacheability via unique request targets.
* **Flaw**: Suffers from over-fetching (bloated payloads) and under-fetching (multiple sequential network loops).

### 🧬 2. GraphQL (Declarative Field Requests)
* **Concept**: Routes all queries via an HTTP POST gateway to a single `/graphql` engine.
* **Win**: The client specifies exact attributes, completely neutralizing payload data waste.
* **Flaw**: Breaks native HTTP caching rules, requiring memory-heavy client-side normalization stores.

### 🔌 3. gRPC-web (Binary Protocol Buffers)
* **Concept**: Transmits serialized binary byte chunks over active HTTP/2 network streams.
* **Win**: Minimal network file footprint and near-zero browser CPU parsing overhead.
* **Flaw**: Payload obscurity makes debugging and inspecting network traffic highly difficult.

### 🚂 4. tRPC / RPC (Shared Compile-Time Type Channels)
* **Concept**: Imports backend type definitions directly into client components inside a Monorepo.
* **Win**: Eliminates API integration bugs at the compiler level with zero manual schema upkeep.
* **Flaw**: Tightly couples services; restricted strictly to single-repo TypeScript codebases.

![API Paradigms Matrix](/four_api_paradigm.png)

| Feature | 🏛️ REST | 🧬 GraphQL | 🔌 gRPC-web | 🚂 tRPC / RPC |
|---------|---------|------------|-------------|----------------|
| **Primary Focus** | Isolated Resources (URLs match nouns). | Flexible Data Shapes (Client asks for exact fields). | High-Speed Binary (Tightly packed data). | Developer Velocity (Shared types, no endpoint guessing). |
| **Data Format** | JSON Text | JSON Text | Compressed Binary (Protocol Buffers) | JSON Text |
| **Network Endpoints** | Multiple URLs (e.g., /api/users, /api/posts) | One Single URL (e.g., /graphql) | One Single URL (e.g., /rpc.UserService/Get) | Virtual Routes generated automatically by code. |
| **Caching Level** | Excellent / Native (Handled cheaply by browsers & Edge CDNs). | Complex / Custom (Must be built inside browser memory stores). | None at the Edge (Strictly dynamic server-to-client operations). | Complex / Custom (Relies heavily on local state queries). |
| **Code Setup Requirement** | Works with any language or repository structure. | Requires a specialized GraphQL schema engine on the server. | Requires an Envoy Proxy server to translate browser code. | Mandates a single TypeScript Monorepo for full-stack. |
>
> - **gRPC-web = Google Remote Procedure Call for browsers**. It is a binary protocol that uses Protocol Buffers to serialize structured data, enabling efficient communication between client and server.
> - **tRPC = TypeScript Remote Procedure Call**. It is a framework that allows developers to define and consume APIs in TypeScript, enabling type-safe communication between client and server without the need for manual schema definitions.

## 🍔 Food Delivery App Case Study: Paradigm Allocations

- **REST (The Menu Page):** Used for public food menus. Because menus rarely change, fast Edge CDNs can save copies and serve them instantly to **millions of users** without hitting the database.
- **GraphQL (The Checkout Screen):** Used for the final payment screen. It lets the phone grab the user's address, credit card, and food items **all in one single request** instead of making multiple slow network trips.
- **gRPC-web (The Live GPS Tracker):** Used for **streaming live GPS locations** 10 times a second. It shrinks coordinates into tiny binary files, travels at high speed, which helps save phone battery and data plans.
- **tRPC / RPC (The Kitchen dashboard):** Used for the internal kitchen dashboard. It allows the frontend to import backend **type definitions / safety** directly, eliminating integration bugs and speeding up development.

![Food Delivery App Case Study](/Api_paradigm_case.png)

> ⚠️ **Warning:** Never allow unrestricted nested queries (e.g., `user { friends { friends { friends } } }`) to run on a production GraphQL engine. A malicious user or a bug in a loop can weaponize this to trigger thousands of automated database queries, crashing your server instantly. Always implement **Query Depth Limiting** and **Query Cost Analyzers** on your server gateways.
