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
An API paradigm is a **set of rules and conventions that define how a client** (like a web browser) **talks with the server** (like a web server or backend service).
- It dictates **how requests are structured**, how data is **formatted**, and how a **client interacts with backend services**.
- Common paradigms **include REST, GraphQL, gRPC-web, and tRPC/RPC**.
> `gRPC` = Google Remote Procedure Call, and `tRPC` = TypeScript Remote Procedure Call.

## Why API Paradigms Needed ?
Choosing the right API paradigm ***directly impacts*** your platform's ***loading speeds, server costs, and developer speed***. 
> **It dictates how efficiently (`fastest, cheapest path`) your data travels over the wire between the client and the server**.

- **Payload Size Control**: Keeps data packets tiny so users don’t waste mobile data or wait for heavy downloads.
- **Network Latency Protection**: Drops the number of round-trip requests required to load a page, preventing a lagging UI.
- **Caching Strategy**: Allows global edge networks (CDNs) to instantly serve saved data, keeping heavy traffic away from expensive databases.
- **Device Performance**: Keeps data streams clean and structured so the user's phone or computer uses less battery and memory.

![API Paradigms Concept](/api_paradigm_image.png)

## ⚙️ The Architectural Mental Process: Selecting an API Paradigm
* **Check the Data Shape**: Pick `REST` for simple, independent data objects. Choose `GraphQL` or `gRPC-web` for deeply nested, highly connected relational data models.
* **Check the Network Speed**: Force field-specific queries (`GraphQL`) or compressed binary streams (`gRPC-web`) to protect weak mobile networks from heavy plain-text bloat.
* **Check the Caching Needs**: Prioritize `REST` to instantly leverage standard, public Edge CDN reverse-proxy caching layers for highly repetitive public content.
* **Check the Code Repository**: Choose `tRPC` / `RPC` inside shared codebases (TypeScript monorepos) to quickly eliminate API integration bugs through automated, compile-time type safety.

## 🔌 The 4 Core API Paradigms Matrix

![API Paradigms Matrix](/four_api_paradigm.png)

|Feature|🏛️ REST|🧬 GraphQL|🔌 gRPC-web|🚂 tRPC / RPC|
|---|---|---|---|---|
|**Main Focus**|Simple, separate data objects.|Flexible data (ask for exact fields).|Maximum speed (tiny binary files).|Fast coding (shared types, zero endpoints).|
|**Data Format**|JSON Text|JSON Text|Compressed Binary|JSON Text|
|**URLs / Endpoints**|Multiple URLs (/users, /posts).|One single URL (/graphql).|One single URL (/rpc.UserService/Get).|Virtual routes handled automatically in code.|
|**Edge Caching**|Excellent: Works out-of-the-box with cheap browser and CDN setups.|Complex: Must be built inside browser state memory stores.|None: Strictly live data streams between server and client.|Complex: Relies heavily on local app-side query caches.|
|**Code Limits**|Works with any language or project setup.|Needs a setup server engine to parse custom queries.|Needs a middleman server (Envoy Proxy) to translate browser data.|Requires both frontend and backend to share one TypeScript project.|

> - **gRPC-web = Google Remote Procedure Call for browsers**. It is a binary protocol that uses Protocol Buffers to serialize structured data, enabling efficient communication between client and server.
> - **tRPC = TypeScript Remote Procedure Call**. It is a framework that allows developers to define and consume APIs in TypeScript, enabling type-safe communication between client and server without the need for manual schema definitions.

>## Case Study: 🍔 Food Delivery App - Paradigm Allocations
> What API paradigm should be used for each part of a food delivery app? and why?:

- **REST (The Menu Page):** Used for public food menus. Because ***menus rarely change***, fast Edge ***CDNs can save copies (static assets)*** and serve them instantly to **millions of users** without hitting the database.
- **GraphQL (The Checkout Screen):** Used for the final payment screen. It lets the phone grab the ***user's address, credit card, and food items all in one single request*** instead of making multiple slow network trips.
- **gRPC-web (The Live GPS Tracker):** Used for **streaming live GPS locations** 10 times a second. It shrinks coordinates into tiny binary files, ***travels at high speed***, which helps save phone battery and data plans.
- **tRPC / RPC (The Kitchen dashboard):** Used for the internal kitchen dashboard. It allows the ***frontend to import backend type definitions / safety*** directly, eliminating integration bugs and speeding up development.

![Food Delivery App Case Study](/Api_paradigm_case.png)

> ⚠️ **Warning:** Never allow unrestricted nested queries (e.g., `user { friends { friends { friends } } }`) to run on a production GraphQL engine. A malicious user or a bug in a loop can weaponize this to trigger thousands of automated database queries, crashing your server instantly. Always implement **Query Depth Limiting** and **Query Cost Analyzers** on your server gateways.
