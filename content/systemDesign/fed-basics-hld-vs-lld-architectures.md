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
*   **High-Level Design (HLD)**: The **Macro Architecture Map** - `Systems outside the browser runtime`. It diagrams the system's ***topological boundaries, traffic routing pathways, network protocols, and core infrastructure building blocks*** 
- e.g., **CDN edges, load balancers, BFF proxies, microservices**.
  > It answers what components exist and how they interact globally.

*   **Low-Level Design (LLD)**: The **Micro Blueprint** - `Systems inside the browser runtime`. ***Zooms into individual components to define internal mechanics, code modules, and specific data structures***. It maps out detailed logical execution, class relationships, database schemas, local state hierarchies, caching strategies, and specific algorithms 
- e.g. **schema design, component state life cycles, sorting algorithms, encryption algorithms, etc.**.
  > It answers how the components are implemented and how they function internally (***Code level details***).

![HLD vs LLD](/HLD_vs_LLD.png)
> **ANALOGY**: 
> - **HLD** is like a city map showing **highways, bridges, and traffic flow**, while
> - **LLD** is like a blueprint of a house showing **room layouts, plumbing, and electrical wiring** .

## Why HLD and LLD are needed?
- **HLD (The Skeleton)**: `Prevents system crashes` by managing global traffic, scaling infrastructure, and defining component boundaries.  
- **LLD (The Organs)**: `Prevents buggy execution` by defining explicit logic, data structures, and clean code paths.
- **The Teamwork**: HLD gives your code a reliable environment to run in; LLD gives your infrastructure actual logic to execute.
- 
>- HLD provides the **big picture** and helps in **capacity planning**, while LLD ensures **code quality** and **performance optimization**.

| Stage 🗺️ | High-Level Design (HLD) 🔍 | Low-Level Design (LLD) 💻 | Actual Code |
| :--- | :--- | :--- | :--- |
| **The Analogy** | The city highway map. | The blueprint of one house. | Pouring the concrete. |
| **Primary Focus** | Global infrastructure and servers. | File structure and code architecture. | Line-by-line working software. |
| **The Main Questions** | "What external systems do we need, and how do they talk to each other?" | "How do we structure our files, modules, and database tables inside the app?" | "How do I write the specific functions, loops, and error-handling logic?" |
| **The Output** | Infrastructure & network diagrams. | Component trees & database schemas. | Executable files (.ts, .css). |

## 🗺️ The Goal of HLD and LLD:

**HLD (The Macro View)**: 
>- **Goal**: Ensure the entire ***system stays online, scales smoothly, and does not crash under heavy traffic.***
>- **Key Focus**: Global speed (***performance***), scaling up (***scalability***), backup plans (***reliability***), and lock-down defense (***security***).

**LLD (The Micro View)**: 
>- **Goal**: Ensure the ***internal code*** is easy for developers **to read, change, and test without breaking things.***
>- **Key Focus**: Organized folders (***code structure***), clean data setups (***data models***), smart logic loops (***algorithms***), and automated bug-checking (***testing***).

## The Architectural Mental Process: Writing HLD vs. LLD

## 🗺️ High-Level Design (HLD) Workflow
* **Asset Location & Routing**: Place files on global servers (CDNs) and route users to the nearest location to cut lag. (via ***load balancers and reverse proxies***).
* **Protocols & Payload**: Choose how data travels and use a gateway to pack backend answers into one neat package. (via ***HTTP/2, GraphQL, or REST***).
* **Traffic & Caching**: Split heavy traffic across multiple servers and save popular data nearby to prevent crashes. (via ***caching strategies like Redis, Memcached, or CDN edge caching***).
* **Safety & Monitoring**: Set up system health tracking and create automated backup plans to prevent data loss. (via ***monitoring tools like Prometheus, Grafana, or ELK stack***).
* **Scaling & Redundancy**: Plan for extra servers and backup systems to handle sudden traffic spikes and ensure continuous service. (via ***horizontal scaling, auto-scaling groups, or multi-region deployments***).
* **Load Balancing & Failover**: Implement load balancers to distribute traffic evenly and set up failover mechanisms to maintain service availability during server failures. (via ***round-robin, least connections, or IP hash load balancing techniques***).

## 🔍 Low-Level Design (LLD) Workflow
* **Data Rules & Cleanup**: Lock down strict data formats (types) and straighten out raw data so code does not break. (via ***TypeScript interfaces, JSON schemas, or data validation libraries***).
* **Memory Management**: Decide exactly where data lives in the application memory to keep things organized.( via ***state management libraries like Redux, MobX, or Zustand***).
* **Speed & Logic**: Prevent screen lagging by controlling redraws and using smart, low-memory code steps.( via ***virtual DOM, memoization, or debouncing techniques***).
* **Bug Traps & Testing**: Build fallback paths so errors do not freeze the app, and write scripts to test functions automatically.( via ***unit testing frameworks like Jest, Mocha, or Cypress***).

>## 🔬 Basic Scenario: Image Upload & Preview Widget
> **The Goal**: Build a profile setting page where a user can select a heavy 5MB photo from their device, instantly see a local preview on their screen, and upload it securely without freezing their browser.

### 🗺️ High-Level Design (HLD) Focus: Infrastructure & File Pathways
* **Smart Routing**: Sends uploads straight to cloud storage, skipping the main app servers to prevent system slowdowns. (via ***S3, GCS, or Azure Blob Storage***).
* **Secure Access**: The browser gets a temporary, secure password (Presigned URL) from the server gateway to upload the photo safely. (via ***AWS S3 Presigned URLs, GCS Signed URLs, or Azure SAS Tokens***).
* **Fast Delivery**: Background servers automatically shrink the image to a lightweight format (WebP) and copy it to global edge servers (CDNs) for instant loading worldwide. (via ***CloudFront, Cloudflare, or Akamai***).

### 🔍 Low-Level Design (LLD) Focus: Client Runtime Memory & Validation
* **Instant Preview**: Use the browser's File API to create a quick local link (`URL.createObjectURL`) so the user sees their photo instantly without waiting for the upload.( via ***JavaScript File API, Blob URLs, or React state management***).
* **Background Upload**: Send the file to the server in the background using asynchronous code (`async/await`) so the screen does not freeze.( via ***Fetch API, Axios, or XMLHttpRequest***).
* **Size Safety**: Check the file size in the code immediately `event.target.files[0].size`, and show a helpful error message if the photo is larger than 5MB.( via ***JavaScript File API, Blob size checks, or client-side validation libraries***).

![HLD vs LLD for Image Upload](/hld_lld_imageUpload.png)


## Difference Between NFR and LLD
| Feature⚡ | Non-Functional Requirement (NFR)🔍 | Low-Level Design (LLD) |
|-----------|---------------------------------|---------------------------|
| **What is it?** | The Goal / Target (***A performance number***). | The Technical Solution (***The architectural code pattern***) |
| **The Analogy** | Mandating that a racing car must go from 0 to 60 mph in under 2 seconds. | Designing a special V8 engine block with precise cylinder measurements to hit that speed. |
| **Who defines it?** | The Product Manager and Lead Architect together. | The Senior Frontend Engineer inside the repository blueprints. |
| **What it sounds like** | "The app must stay responsive and have an INP score under 200ms during heavy scrolling." | "We will implement List Virtualization to reuse 20 DOM nodes and keep the Event Loop completely free." |

### 💡 Clearing the Confusion: NFR vs. LLD
* **Non-Functional Requirement (NFR)**: `The Performance Target` — the speed limit or performance rule requested by the business.
  * ***Example***: "The page must load in under 2 seconds" or "The app must use less than 50MB of memory."
* **Low-Level Design (LLD)**: `The code Solution to that Target` — the actual code layout, file structures, and algorithms you write to hit that target. 
  * ***Example***: Writing code that recycles off-screen items (List Virtualization) or delays heavy calculations (Debouncing) to keep the app fast.

> **Core Rule**: NFR tells you *how well* the app must perform; LLD is the blueprint showing *how your code* will achieve that performance.


> ⚠️ **Warning:** The most common mistake engineers make in interviews is spending too long on HLD boxes, running out of time to show any code or data design. Budget your architectural presentation time strictly: map out the high-level network block structure within the first 15 minutes, then spend the rest of the time deep-diving into schemas and implementation details.
