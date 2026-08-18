---
title: "What is System Design"
category: "system-design"
chapterId: "fed-sd-foundations"
slug: "fed-basics-what-is-system-design"
description: "System design is the process of defining the architecture, components, modules, and interfaces of a software application to meet specific business and technical requirements."
playgroundTemplate: "architecture-map"
---

## What is it?
System design is the **process of defining a system's architecture**—meaning its **structure, high-level modules, and the interfaces (APIs)** they use to communicate. This architectural blueprint ensures the application satisfies both **business logic** and **technical requirements**.

![System design concept](/system_design_concept.png)

It means planning how the **user's browser (client), fast middleman servers (edge), and main databases (backend)** work together :
- **The Client Runtime (Presentation Layer)**: The browser executing your JavaScript.
- **The Edge Layer (The Edge Layer / CDN / Reverse Proxy)**: Distributed networks (CDNs) executing computing logic close to the user.
- **Backend Microservices (The Backend / Data Storage Layer)**: The isolated, domain-specific server APIs that manage core data.

```text
//How the system works together:
[Browser] ──(1. Asks for Page)──> [Edge Server] ──(2. Misses Cache?)──> [Backend Database]

[Backend Database] <──(3. Returns Data)─── [Edge Server] <──(4. Renders Page)─── [Browser]
```
![System Design Main Picture](/system_design_mainPic.png) 

## Architectural Goals of a good System Design:
- **Scalability**: Works perfectly for millions of global users.
- **Performance**: Loads lightning fast.
- **Resilience / Reliability**: Does not crash if the internet drops.
- **Security**: Protects user data and resists attacks.
- **Maintainability**: Ensures the code is easy to debug and evolve.
- **Cost-efficiency**: Ensures resources are used wisely.

## Core Architectural Pillars
Understanding the Core Architectural Pillars are the foundation of system design. They **define the boundaries, expectations, and structures** of your application before you write any code.
- **System Designing Fundamentals**: Shifting your mindset from writing line-by-line code to evaluating engineering trade-offs (balancing speed, cost, and complexity).
- **Functional vs. Non-Functional Requirements**: Separating visible features user can see (Functional) from hidden technical performance metrics like bundle budgets, latency budgets, and accessibility (Non-Functional).
- **High-Level Design (HLD) vs. Low-Level Design (LLD)**: Establishing the macro network blueprint, cross-service communication, and core technology stacks (HLD) versus detailing the micro internal logic, API specifications, and data models of individual client modules (LLD).

## The Core Concepts of System Design
When engineers design a system (like Netflix, Uber, or WhatsApp), they balance several core pillars:
- **Scalability**: The ability of a system to handle growing amounts of work (e.g., a sudden spike in users during a Black Friday sale) by adding resources.
- **Availability**: Ensuring the system remains up and operational. High availability means the app rarely goes down (often targeted as "99.999% uptime").
- **Fault Tolerance**: The system's capacity to continue operating properly even if some of its internal components or servers fail.
- **Latency vs. Throughput**: Latency is the time it takes to process a single request (how fast a page loads). Throughput is the number of requests a system can handle per second.

# The core system design Layers / building blocks:

## Core System Design Layers
- **Client Layer**: The user's browser or mobile app that interacts with the system.
- **Edge Layer**: A distributed network of servers (like CDNs) that cache content and perform computations close to the user to reduce latency.
- **Backend Layer**: The core server-side logic and databases that handle business rules, data storage, and complex computations.   
- **Database Layer**: The storage systems that persist data for the backend services, ensuring durability and consistency.
- **Communication Layer**: The protocols and APIs that facilitate data exchange between the client, edge, and backend layers (e.g., REST, GraphQL, gRPC).
- **Security Layer**: Mechanisms to protect data and ensure secure communication, including authentication, authorization, and encryption.
- **Monitoring & Logging Layer**: Tools and systems that track the health, performance, and errors of the application, enabling proactive maintenance and debugging.
- **Caching Layer**: Systems that store frequently accessed data temporarily to reduce load on the backend and improve response times (e.g., Redis, Memcached).
- **Load Balancing Layer**: Distributes incoming network traffic across multiple servers to ensure no single server becomes a bottleneck, enhancing performance and reliability.
- **Orchestration Layer**: Manages the deployment, scaling, and operation of containerized applications (e.g., Kubernetes), ensuring that services run smoothly and efficiently across different environments.
- **Message Queue Layer**: Facilitates asynchronous communication between services, allowing for decoupled and scalable architectures (e.g., RabbitMQ, Kafka).
- **Configuration Management Layer**: Manages application settings and environment variables, ensuring consistent behavior across different environments (e.g., development, staging, production).
- **Testing & Quality Assurance Layer**: Ensures that the system meets functional and non-functional requirements through automated tests, performance testing, and user acceptance testing.
- **Continuous Integration/Continuous Deployment (CI/CD) Layer**: Automates the process of integrating code changes, running tests, and deploying applications to production, enabling rapid and reliable software delivery.
---
## Building Blocks of System Design: -
![System Design Building Blocks](/systemDesign_block1.png)

## 🌐 Traffic & Routing

### 1. DNS (Domain Name System)
>* **What it does**: Acts as the phonebook of the internet by converting human-readable names (`google.com`) into machine-readable IP addresses (`142.250.190.46`).
>* **When to use**: Always used as the very first entry point for any web-based application.

### 2. Load Balancer
>* **What it does**: Sits in front of your servers and routes incoming user requests evenly across them. 
>* **Why it matters**: It prevents any single server from becoming a bottleneck and automatically reroutes traffic away from failed servers (high availability).

### 3. API Gateway
>* **What it does**: Acts as a single reverse-proxy entry point that sits in front of backend microservices.
>* **Key features**: It handles central tasks like user authentication, SSL termination, protocol translation, and request routing so individual microservices don't have to.

### 4. Rate Limiter
>* **What it does**: Tracks and limits the number of requests a user or IP address can make in a given timeframe (e.g., max 100 requests per minute).
>* **Why it matters**: Protects your system from brute-force attacks, Denial of Service (DoS) attacks, and accidental scraping loops.


## 💾 Data & Storage

### 1. SQL (Relational) Databases
>* **What it does**: Stores data in structured tables with strict schemas and predefined relationships (e.g., PostgreSQL, MySQL).
>* **When to use**: Best when data integrity is critical, and you need **ACID** properties (Atomicity, Consistency, Isolation, Durability), such as in banking or checkout systems.

### 2. NoSQL (Non-Relational) Databases
>* **What it does**: Stores data flexibly without rigid tables, using structures like documents (MongoDB) or wide-columns (Cassandra).
>* **When to use**: Best for massive volumes of unstructured or semi-structured data requiring high write speeds and easy horizontal scaling.

### 3. Key-Value Store
>* **What it does**: A specialized, ultra-fast NoSQL database that stores and retrieves data purely using key-value pairs (e.g., Redis).
>* **When to use**: Ideal for tracking simple, highly accessed data like user sessions, shopping carts, or real-time leaderboards.

### 4. Blob Storage (Object Storage)
>* **What it does**: Unstructured storage designed for massive binary files rather than structured text data (e.g., AWS S3).
>* **When to use**: Essential for storing raw files like user avatars, uploaded videos, system logs, and large database backups.

## ⚡ Performance & Speed

### 1. Cache
>* **What it does**: Stores copies of frequently accessed data directly in super-fast RAM rather than fetching it from a slow hard-drive database.
>* **Why it matters**: Drastically reduces read latency and lowers the computing strain on your primary database.

### 2. CDN (Content Delivery Network)
>* **What it does**: A network of geographically distributed proxy servers that store copies of your static files (images, videos, HTML).
>* **Why it matters**: Delivers content to users from the closest physical server location, cutting down website load times globally.

## 🔄 Communication & IDs

### 1. Message Queues (and Pub/Sub)
>* **What it does**: Allows different services to talk to each other asynchronously via messages (e.g., RabbitMQ, Kafka). 
>* **Why it matters**: Decouples services. For example, when a user buys an item, the Order Service drops a message in the queue and finishes instantly, while the Email Service picks up the message and sends the receipt later.

### 2. Unique ID Generator
>* **What it does**: Generates highly unique, ordered numbers across a massive cluster of independent servers (e.g., Twitter’s Snowflake algorithm).
>* **Why it matters**: Prevents primary key collisions when auto-incrementing IDs across multiple databases distributed around the world.
---
## Steps for System Designing (Architecture blueprints):
- **Requirement Gathering**: Understand the business and technical requirements. You separate what features you need (**Functional**) from how fast they must run (**Non-Functional**).
- **High-level Design**: Define the overall architecture, major components, and their interactions ( Browser Layer, Edge CDN/BFF Proxy, and Backend Services connect ).
- **Low-level Design**: Detail the internal workings of individual modules, APIs, and data models (Component APIs, TypeScript contracts, State Management, and DOM scalability).

> While phases like Implementation, Testing, and Monitoring are part of the broader development lifecycle to validate and run the app, the core System Design process is entirely about evaluating architectural trade-offs across these three pillars at the drawing board."

### ❓ Why System Design is Important
* **The Problem**: Small-scale code collapses when pushed to millions of global users with varying device capabilities and weak networks.
* **The Consequences of Poor Design**: 
    1. Massive JavaScript bundles that freeze mobile phone processors (performance).
    2. Lack of caching layouts that overload databases usage and inflate cloud bills (cost).
    3. Brittle data sync models that display corrupted or stale states (showing old data on the UI).
* **The Goal**: Architecting an infrastructure that scales predictably, handles network degradation gracefully, and maintains high performance under heavy traffic loads.

### ⚠️ The Golden Rule: System designing Architecture is => Trade-offs not solutions
* **No Perfect Systems**: Solving one problem (like adding a cache for speed) always creates another (like extra server costs and data sync complexity).
* **The Engineering Goal**: Never to build a flawless, infinite system, but to build and engineer the most cost-effective, maintainable, and scalable solution for your specific business constraints.

> A **trade-off** is a situational decision where you **give up one quality or advantage to gain another**. In simple terms, it means you cannot have everything perfect at the same time—to get more of Thing A, you must accept less of Thing B.

> ⚠️ **Warning:** System design is entirely governed by trade-offs. Elevating performance by adding cache layers or proxy servers increases your infrastructure costs and debugging complexity. Your goal is never to build the "perfect" system, but the most cost-effective, scalable system for your specific product constraints.

![System Design Building Blocks](/systemDesign_block2.png)

## Other Terminology & Patterns in System Design
- **Monolith vs. Microservices**: A monolith is a single, tightly-coupled application, while microservices are a collection of small, independent services that communicate over APIs. Microservices offer better scalability and maintainability but introduce complexity in communication and deployment.
- **Synchronous vs. Asynchronous Communication**: Synchronous communication requires the sender to wait for a response (e.g., HTTP requests), while asynchronous communication allows the sender to continue processing without waiting (e.g., message queues). Asynchronous systems can improve performance and resilience but may introduce complexity in handling eventual consistency.

**Scalability**
The ability of a system to handle growing amounts of traffic or data without degrading performance.
>- **Horizontal Scaling (Scale-Out)**: Adding more machine instances to distribute the load across a network.
>- **Vertical Scaling (Scale-Up)**: Adding physical power (CPU, RAM) to an existing single machine.

**Reliability and Availability**
Metrics that measure how effectively a system functions over time and resists failures.
>- **Reliability**: The probability that a system runs accurately without errors or unexpected failures.
>- **Availability**: The percentage of operational uptime when a system is reachable and accessible to process requests.

**Consistency and Partition Tolerance (CAP Theorem)**
The architectural trade-off that occurs when a distributed network faces communication errors.
>- **Consistency**: Every reading operation returns the absolute latest, updated written data.
>- **Partition Tolerance**: The system continues operating safely despite dropped or delayed messages between nodes.
>- **The Rule**: In a network failure (Partition), you must choose between immediate correctness (Consistency) or system uptime (Availability).

**Latency vs. Throughput**
The two key dimensions used to calculate and assess overall system speed.
>- **Latency**: The time delay it takes for a single individual request to complete (measured in milliseconds).
>- **Throughput**: The total volume of network transactions processed within a specific time unit (measured in Requests Per Second/QPS).
 
**Load Balancing, Caching, and Sharding**
The foundational mechanics utilized to optimize data distribution and performance.
>- **Load Balancing**: Distributing incoming internet traffic evenly across an array of healthy servers.
>- **Caching**: Storing highly duplicated or frequent read data in fast temporary memory (RAM).
>- **Sharding**: Splitting a massive database horizontal row-wise into smaller, isolated server chunks.
 
**Database Types and Storage Models**
Choosing a storage pattern based on data schema requirements and access habits.
>- **Relational (SQL)**: Tabular datasets enforcing strict ACID compliance for transactional safety.
>- **NoSQL (Non-Relational)**: Scalable, schema-less models optimized for unstructured documents or wide columns.
>- **Object Store (Blob)**: Highly flat, infinitely scaling storage engines meant for unparsed binary files (videos, images).
 
**Communication Protocols**
The systematic rules governing how physical devices establish connections and pass data.
>- **HTTP/REST**: Stateless, request-response communication standard using standard text methods (GET, POST).
>- **gRPC / RPC**: High-performance, low-overhead binary execution system utilizing HTTP/2 transport.
>- **WebSockets**: Permanent, open bi-directional connection pipeline meant for real-time streaming data.
  
**Microservices, Events, and Messaging**
Decoupling application logic to maximize engineering agility and prevent cascading faults.
>- **Microservices**: Breaking a heavy architecture into independently deployed, single-purpose services.
>- **Event-Driven Architecture**: Designing internal behaviors triggered primarily by state changes (events).
>- **Messaging Systems**: Brokers (like Kafka) storing data asynchronously to bridge slow workers.

**Security Fundamentals**
Preserving the system integrity, customer data privacy, and defensive boundaries.
>- **Authentication vs. Authorization**: Verifying the user identity (AuthN) vs. granting permission access (AuthZ).
>- **Encryption**: Shuffling data-at-rest or data-in-transit (TLS/SSL) into unreadable text without keys.
>- **Zero Trust**: A security stance assuming threats exist everywhere, enforcing continuous verification for every access attempt.