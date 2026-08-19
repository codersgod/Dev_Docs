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
- **The Edge Layer (The Edge Layer / CDN / Reverse Proxy)**: It handles requests from clients, caches content, and forwards requests to the backend if necessary.
- **Backend Microservices (The Backend / Data Storage Layer)**: The isolated, domain-specific server APIs that manage core data and business logic, interacting with databases and other backend services.
---
> An **Edge Layer** refers to a network architecture deployment strategy where data processing, storage, and computing are moved as close as possible to the user's physical location (the "edge" of the internet).

### CDN (Content Delivery Network) as an Edge Layer
> A **Content Delivery Network (CDN)** is a specific, highly common implementation of an edge layer. It ***is a geographically distributed network of proxy servers and data centers***.
> - A Content Delivery Network (CDN) sits between a user's browser and the backend server ***to improve performance and security*** through static asset caching, Anycast routing, and perimeter protection against DDoS attacks. It ***enhances load times*** by serving content from physically near servers and ***shields infrastructure*** by filtering malicious traffic at the edge.
>- **Working**: When a user requests a page, the **CDN checks if it has a cached copy of the content**. 
    > - If it does, it serves it directly to the user. 
    > - If not, it forwards the request to the backend server, retrieves the content, caches it for future requests, and then serves it to the user. This reduces latency and improves load times for users worldwide.
>***CDN usually caches static assets*** like images, CSS, and JavaScript files, but can also cache entire HTML pages for dynamic content if configured to do so.
>
>**Working Of CDN** : 
> When you visit a URL, your ***browser makes multiple requests at once***. The ***response comes from both the CDN and the Backend API***, depending on the type of data:
> - ***From the CDN***: You get the static skeleton of the website (images, logos, fonts, and design layout files) because it is identical for every user and stored nearby for speed.
> - ***From the Backend API***: You get the live, dynamic data (your personal profile, bank balances, or private text) because it must be fetched fresh from the database for security and accuracy.
---
## What happens behind the scenes, step-by-step, when a user types your website URL into their browser and presses Enter ?
- **Step 1 (DNS Redirect)**: The user types your URL, and the DNS system redirects the browser to the CDN’s network instead of your actual backend server.
- **Step 2 (Anycast Routing)**: The CDN uses Anycast routing to automatically send the request to the physically closest healthy CDN server (Edge Server).
- **Step 3 (Security Scrubbing)**: The Edge Server acts as a shield, instantly inspecting the traffic and blocking DDoS attacks or malicious bots before they reach your site.
- **Step 4 (The Cache Split)**: The Edge Server checks what the user is asking for:
>- **Cache Hit (Static Data)**: If it is an image, CSS, or JS file already stored there, the CDN hands it to the user instantly.
>- **Cache Miss / Dynamic Data (API Call)**: If it is a personal To-Do list or bank balance, the CDN forwards the request to your Origin Backend Server to fetch the live data.
- **Step 5 (Final Delivery)**: The browser receives the fast static assets from nearby and the live data from your backend, assembling the webpage seamlessly.

![CDN workflow](/CDN_workflow.png)

---

## Architectural Goals of a good System Design:
- **Scalability**: Works perfectly for millions of global users simultaneously.
- **Performance (Latency vs. Throughput)**: Loads lightning fast and handles massive data volumes efficiently.
>**Latency** (the time it takes to process a single request/how fast a page loads) against **Throughput** (the total number of requests a system can successfully handle per second). 
- **Resilience & Reliability (Availability & Fault Tolerance)**: Does not crash if individual components fail or the internet drops.
  > **Fault Tolerance** (the system's capacity to continue operating properly even if some internal servers or components crash).
- **Security**: Protects user data  and resists attacks (like DDoS, SQL injection, and XSS).
- **Maintainability**: Ensures the code is easy to debug, test and evolve over time.
- **Cost-efficiency**: Ensures hardware, cloud infrastructure, and network resources are used wisely (meaning achieving the best performance at the lowest cost).

## Core Architectural Pillars & Steps to design a system architecture:
Understanding the Core Architectural Pillars are the foundation of system design. They **define the limitations, expectations, and structures** of your application before you write any code.
- **System Designing Fundamentals**: Shifting your mindset ***from writing line-by-line code to evaluating engineering trade-offs (balancing speed, cost, and complexity)***.
- **Functional vs. Non-Functional Requirements**: Separating what the user ***can physically do on the app*** (Functional) from ***how fast, secure, and reliable the app runs behind the scenes*** (Non-Functional).
- **High-Level Design (HLD) vs. Low-Level Design (LLD)**:  
  - **HLD**: The big-picture macro blueprint that ***maps out the entire system network, how different services talk to each other***, and the core technology stack used.
  - **LLD**: The detailed micro blueprint that maps out the ***internal code logic, exact API data structures, and database fields*** for each individual component.
---
## Example: ( FR/NFR/HLD/LLD )-- The WhatsApp / iMessage Chat Feature.
**Functional Requirements — The Product Feature Checklist** 
>- **Message Delivery**: Users can successfully send and receive text messages.
>- **Read Receipts**: Users can see real-time message statuses via blue checkmarks.
>- **Media Sharing**: Users can upload and transmit photos or videos.
  
**Non-Functional Requirements — The System Quality/Performance Checklist**: 
>- **Performance**: Messages must be delivered in under 1 second, even with millions of concurrent users.
>- **Reliability**: The system must ensure messages are not lost, even if a server crashes or the network is unstable.
>- **Scalability**: The system must handle a growing user base and increased message volume without degradation in performance.
>- **Security**: Messages must be end-to-end encrypted to protect user privacy.
>- **Maintainability**: The system should be designed for easy updates and bug fixes without significant downtime.

**High-Level Design (HLD) — The Global Architecture**
>- **Frontend Client**: The app on your phone that maintains a live, open connection.
>- **API Gateway**: The front door that authenticates users and blocks malicious traffic.
>- **Chat Service (WebSockets)**: The specialized server maintaining constant two-way connections to push messages instantly.
>- **Notification Service**: Triggers Apple (APNs) or Google (FCM) push alerts if the recipient is offline.
>- **Database & Cache**: A NoSQL database (like Cassandra) to store millions of chats, and RAM cache (Redis) to track who is currently "Online".
>- **Media Storage (S3/CDN)**: Cloud storage that compresses and serves photos and videos instantly via nearby servers.
![HLD for WhatsApp](/chat_hld.png)

**Low-Level Design (LLD) — The Code & Data Blueprint**
>- **API Contract**: The exact code format used to send a message payload: `{ "sender_id": "123", "receiver_id": "789", "text_encrypted": "xyz", "timestamp": 1718872000 }`
>- **Database Schema**: The exact table fields (`chat_id`, `message_id`, `body`) organized to load conversation histories in chronological order.
>- **Offline Delivery Logic**: The internal code sequence: If user is online, send via WebSocket. If offline, push to a temporary queue and trigger a mobile push notification.
>- **Encryption Module**: The precise code functions executing cryptographic handshakes between devices to secure text before it leaves the phone.
![LLD for WhatsApp](/chat_lld.png)

### ⚠️ The Golden Rule: System designing Architecture is => Trade-offs not solutions
* **No Perfect Systems**: Solving one problem (like adding a cache for speed) always creates another (like extra server costs and data sync complexity).
* **The Engineering Goal**: Never to build a flawless, infinite system, but to build and engineer the most cost-effective, maintainable, and scalable solution for your specific business constraints.

> A **trade-off** is a situational decision where you **give up one quality or advantage to gain another**. In simple terms, it means you cannot have everything perfect at the same time—to get more of Thing A, you must accept less of Thing B.

> ⚠️ **Warning:** System design is entirely governed by trade-offs. Elevating performance by adding cache layers or proxy servers increases your infrastructure costs and debugging complexity. Your goal is never to build the "perfect" system, but the most cost-effective, scalable system for your specific product constraints.
----
# The core system design Layers / building blocks:

## Core System Design Layers
![System Design Layers](/layers_systemDesigning.png)

## Building Blocks of System Design: -
![System Design Building Blocks](/building_blocks.png)

>================================================================


# Other Terminology & Patterns in System Design:(for reference)
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