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
