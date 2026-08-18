---
title: "High-Level Design vs. Low-Level Design"
category: "system-design"
chapterId: "fed-sd-foundations"
slug: "fed-basics-hld-vs-lld-architectures"
description: "Contrasting macro system topography layouts (CDNs, proxies, network lines) with granular micro engineering configurations (schemas, state stores, caching rules)."
playgroundTemplate: "design-depths"
---

# (HLD) vs. (LLD)

## What is it?
In system design, solutions are presented at two distinct zoom levels:
*   **High-Level Design (HLD)**: The **Macro Architecture Map** - `Systems outside the browser runtime`. It diagrams the system's topological boundaries, traffic routing pathways, network protocols, and infrastructure building blocks (e.g., CDN edges, load balancers, BFF proxies, microservices).
*   **Low-Level Design (LLD)**: The **Micro Blueprint** - `Systems inside the browser runtime`. It zooms in to define internal code modules, explicit component data models, local caching states, and execution algorithms (e.g., component state hierarchy, database schemas, token-bucket math loops).

![HLD vs LLD](/HLD_vs_LLD.png)

## Why HLD and LLD are needed?
- We need both **High-Level Design (HLD) and Low-Level Design (LLD)** because an **application must not only** have the correct infrastructure to **route traffic efficiently, but it must also have the correct internal logic to process data correctly and quickly**.
- Additionally, HLD and LLD are **complementary**: HLD defines the **network topology** and **data flow**, while LLD defines the **data structures** and **algorithms** that operate within that flow.
- HLD provides the **big picture** and helps in **capacity planning**, while LLD ensures **code quality** and **performance optimization**.

| Feature🗺️| High-Level Design (HLD)🔍| Low-Level Design (LLD)💻 |Actual Code (Implementation)|
| :--- | :--- | :--- | :--- |
The Analogy | The blueprint of the entire city's highway system. | The detailed layout of a single house's rooms. | Actually pouring the concrete and painting the walls.
Primary Focus | Global Infrastructure & Networks: **How data moves between servers**. | Code Architecture & Modules: **How files are structured in the app**. | Line-by-Line Logic: **Writing the working software engine**.
Key Questions Answered | "Where do we cache files globally? What API protocol do we use?" | "What do the TypeScript interfaces look like? How flows the local state?" | "How do I write this if/else statement or catch this specific error?"
Typical Artifacts | Infrastructure diagrams, network flows, BFF designs, CDN routing rules. | Component prop structures, folder directory trees, state machines. | Executable .js, .ts, .jsx, or .css files inside the repository.

## 🗺️ The Goal of High-Level Design (HLD) and Low-level Design (LLD)

- **HLD** is about **defining the system's architecture at a macro level**. It focuses on **how different components interact**, **where data flows**, and **how the system scales**. The goal is to ensure that the system can handle the expected load, maintain performance, and meet non-functional requirements.
- **Key Considerations**:
  - **Scalability**: How will the system handle increased load?
  - **Performance**: How will the system ensure low latency and high throughput?
  - **Reliability**: How will the system recover from failures?
  - **Security**: How will the system protect data and prevent unauthorized access?

- **LLD** is about **defining the system's architecture at a micro level**. It focuses on **how individual components are implemented**, **how data is structured**, and **how algorithms are designed**. The goal is to ensure that the system is maintainable, efficient, and meets functional requirements.
- **Key Considerations**:
  - **Code Structure**: How will the code be organized and modularized?
  - **Data Models**: How will data be represented and stored?
  - **Algorithms**: How will the system process data efficiently?
  - **Testing**: How will the system be tested for correctness and performance?

## The Architectural Mental Process: Writing HLD vs. LLD

### 🗺️ High-Level Design (HLD) Workflow
* **Asset Location**: Determine regional hosting layout (e.g., pushing static items like HTML, CSS, and JavaScript out to global Edge CDNs to reduce latency and improve load times).
* **Protocol Choice**: Select the correct data stream connection (HTTP/3 vs. WebSockets vs. SSE) so that data is transmitted efficiently and reliably.
* **Payload Trimming**: Put a BFF gateway middleware in place to combine downstream microservice responses into a single optimized payload.
- **Traffic Routing**: Establish a CDN and BFF proxy routing map to ensure that requests are served from the nearest edge location, reducing latency and improving user experience.
- **Load Balancing**: Implement load balancers to distribute incoming traffic across multiple servers, ensuring high availability and fault tolerance.
- **Caching Strategy**: Define caching policies for static and dynamic content to reduce server load and improve response times.
- **Monitoring and Logging**: Set up monitoring and logging systems to track performance, detect issues, and facilitate debugging.
- **Disaster Recovery**: Plan for backup and recovery strategies to ensure data integrity and availability in case of failures.

### 🔍 Low-Level Design (LLD) Workflow
* **Type Contracts**: Establish rigid TypeScript schema interfaces for application APIs.
* **State Hierarchy**: Organize browser memory limits (UI component state vs. global state vs. server caches).
* **Runtime Protection**: Plan viewport rendering defenses like debouncing or DOM virtualization.
- **Data Normalization**: Define how data will be transformed and normalized before being stored or processed, ensuring consistency and integrity.
- **Algorithm Design**: Develop efficient algorithms for data processing, ensuring optimal performance and resource utilization.
- **Error Handling**: Implement robust error handling mechanisms to gracefully handle exceptions and maintain system stability.
- **Testing and Validation**: Create unit tests, integration tests, and end-to-end tests to ensure the system behaves as expected and meets functional requirements.

>## 🔬 Basic Scenario: Image Upload & Preview Widget
> **The Goal**: Build a profile setting page where a user can select a heavy 5MB photo from their device, instantly see a local preview on their screen, and upload it securely without freezing their browser.

### 🗺️ High-Level Design (HLD) Focus: Infrastructure & File Pathways
* **Architecture**: Direct-to-Storage pattern bypassing the core application servers to prevent traffic bottlenecks.
* **Security Flow**: Browser requests short-lived Presigned URLs from a BFF server gate to securely write objects directly to cloud storage buckets (e.g., AWS S3).
* **Delivery Routing**: Background server workers intercept the raw upload, optimize the asset, and distribute compressed WebP formats across global Edge CDN nodes.

### 🔍 Low-Level Design (LLD) Focus: Client Runtime Memory & Validation
* **Data Contract**: Enforcing strict structural boundaries using `interface ImageUploaderProps { maxSizeBytes: number; allowedTypes: string[]; }`.
* **Memory Optimization**: Generating transient in-memory pathways using `URL.createObjectURL` to paint instant visual previews in the viewport before network execution completes.
* **Client Guard Rails**: Implementing client-side binary size checking and file-type schema filters inside the upload module to preemptively block unoptimized or hostile payloads from leaving the user device.

![HLD vs LLD for Image Upload](/HLD_LLD_scenario.png)

## HLD to LLD (Read Path) and LLD to HLD (Write Path) data loops
![HLD to LLD and LLD to HLD data loops](/HLD_LLD_loop.png)

## Difference Between NFR and LLD
| Feature⚡ | Non-Functional Requirement (NFR)🔍 | Low-Level Design (LLD) |
|-----------|---------------------------------|---------------------------|
| What is it? | The Goal / Target (A performance number). | The Technical Solution (The architectural code pattern). |
| The Analogy | Mandating that a racing car must go from 0 to 60 mph in under 2 seconds. | Designing a special V8 engine block with precise cylinder measurements to hit that speed. |
| Who defines it? | The Product Manager and Lead Architect together. | The Senior Frontend Engineer inside the repository blueprints. |
| What it sounds like | "The app must stay responsive and have an INP score under 200ms during heavy scrolling." | "We will implement List Virtualization to reuse 20 DOM nodes and keep the Event Loop completely free." |

### 💡 Clearing the Confusion: NFR vs. LLD
* **Non-Functional Requirement (NFR) = The Target Metric**
  * *Definition*: The performance constraint, speed limit, or security boundary requested by the business (e.g., "Page must load in under 2 seconds," or "Memory footprint must stay under 50MB").
* **Low-Level Design (LLD) = The Architectural Code Solution**
  * *Definition*: The specific structural code patterns, TypeScript interfaces, and algorithms you design to mathematically hit those NFR targets (e.g., Implementing List Virtualization or Debounce wrappers).

> **Core Rule**: NFR tells you *how well* the app must perform; LLD is the blueprint showing *how your code* will achieve that performance.


> ⚠️ **Warning:** The most common mistake engineers make in interviews is spending too long on HLD boxes, running out of time to show any code or data design. Budget your architectural presentation time strictly: map out the high-level network block structure within the first 15 minutes, then spend the rest of the time deep-diving into schemas and implementation details.
