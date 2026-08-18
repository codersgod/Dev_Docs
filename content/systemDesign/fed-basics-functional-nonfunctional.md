---
title: "Functional vs. Non-Functional Requirements"
category: "system-design"
chapterId: "fed-sd-foundations"
slug: "fed-basics-functional-nonfunctional"
description: "Defining user actions vs. measuring performance targets (e.g., target bundle size, latency budgets, accessibility compliance)."
playgroundTemplate: "requirements-matrix"
---

# Functional vs. Non-Functional Requirements

## What is it?
In system design, requirements are divided into two distinct categories:
*   **Functional Requirements (FRs)**: Define **what the system must do**. These are the **VISIBLE** explicit features, user actions, and product workflows (e.g., "A user can upload an image").
*   **Non-Functional Requirements (NFRs)**: Define **how well the system must perform** those actions. These are the **NON-VISIBLE** technical qualities, operational benchmarks, and architectural boundaries (e.g., "The image must render on screen within 200ms globally").

### Some more examples of Functional vs. Non-Functional Requirements:
> - **Functional (FR)**: The user can log in using their email and password.
> - **Non-Functional (NFR)**: The login process must complete within 500ms with security measures in place, and the system must support 5,000 concurrent logins without crashing.

> - **Functional (FR)**: The user types a query in the search bar and sees a dropdown menu displaying matching suggestions.
> - **Non-Functional (NFR)**: The system must handle up to 10,000 concurrent search requests per second (throughput), and the UI must display suggestions within 150ms of the last keystroke (latency).

![Functional vs Non-Functional Requirements](/FR_and_NFR_concept.png)

## Why FR and NFR Are Needed ?
We need both **Functional (FR) and Non-Functional (NFR) requirements** because an **application must not only** have the correct features to **solve a problem, but it must also be stable, fast, and secure enough to survive real-world traffic and usage patterns**.
- A system that meets all functional requirements but fails to meet non-functional requirements will lead to poor user experience, increased costs, and potential security vulnerabilities. 
- And vice versa, a system that meets all non-functional requirements but lacks functional features will not fulfill its intended purpose.

## The Scoping Process: Extracting FRs and NFRs

To define requirements systematically during an architectural loop, execute this 4-step framework:

### 1. Feature Isolation (Isolating FRs)
* **Action**: Define and lock down the top 2-3 explicit user behaviors required by the business product.
* **Outcome**: Clear functional scope that prevents "scope creep" (adding unnecessary features).

### 2. Capacity Estimation (The Scale Bridge)
* **Action**: Mathematically calculate the data volume based on estimated Daily Active Users (DAU).
* **Metrics to Compute**:
  * **Throughput**: Read/Write requests per second (RPS).
  * **Bandwidth**: Data payload sizes moving over the wire per second.
  * **Storage Capacity**: Total gigabytes/terabytes of static asset storage needed over time.

### 3. Metric Enforcement (Establishing NFRs)
* **Action**: Convert your scale calculations into strict, non-negotiable performance benchmarks for the engineering team.
* **Outcome**: Setting precise constraints for initial bundle sizes (<50KB), user interaction scores (INP < 200ms), and global uptime guarantees.

### 4. Architectural Selection (The Trade-off Phase)
* **Action**: Choose the exact high-level design patterns (e.g., BFF layers, Edge CDNs, List Virtualization) required to mathematically meet the NFR targets.

> ## 🔬 Scenario Case Study: Search Autocomplete (Typeahead)
>### 🎙️ The Architectural Problem
Design a high-throughput search autocomplete input field that provides real-time matching suggestions while handling 10M DAU without overloading the backend infrastructure.

> - **DAU** stands for Daily Active Users
> - **High Throughput** means the system can handle a large number of requests per second (RPS) without crashing or slowing down.

### 📋 1. Functional Requirements (FRs)
* Render a search input field that displays a dropdown menu containing up to 5 real-time matching recommendations.
* Support full keyboard navigation accessibility (Up/Down arrow keys to browse, Enter to select).

### 📊 2. Capacity & Scale Estimation
* **Scale**: 10,000,000 Daily Active Users performing 5 searches / day.
* **Raw Throughput**: Averaging 10 keystrokes per search = ~5,787 requests / second (RPS) hitting backend databases if unoptimized.
* **System Bottleneck**: Excessive database search queries triggered by rapid typing speeds.

### ⚡ 3. Non-Functional Requirements (NFRs)
* **Latency Limit**: Dropdown recommendations must render within 150ms of a typing pause, showcasing lightning fast performance.
* **Network Budget**: Drastically minimize server requests per search using client runtime logic (means **caching** previous queries in-memory via JavaScript `object` and `Map/Set` and **debouncing** input using JavaScript's `setTimeout`, `clearTimeout` and `signal.abort()`).

### ⚖️ 4. Architectural Selection & Trade-offs
**Debouncing (Execution Delays)**
* **Gain**: Massive reduction in backend server throughput.
* **Trade-off**: Introduces a minor perceptual latency (300ms delay) that slow typists might perceive as UI lag.

**Client-Side Caching (Local Dictionary Stores)**
* **Gain**: Near-zero latency response times for historically repeated queries.
* **Trade-off**: Increases browser RAM consumption and introduces the risk of "stale data" where the user views outdated recommendations.

**AbortController (Network Request Cancellation)**
* **Gain**: Prevents data race conditions from corrupting the UI view layout.
* **Trade-off**: Elevates codebase complexity (handling aborted catch blocks) and still consumes backend database computation cycles if the request hits the server before the client cancels it.

![System Design for Autocomplete](/FSandNFS.png) 


### ⚠️ Traps to Avoid: Blending FR and NFR
* **The Illusion**: An NFR will often reference a functional feature (like typing in a search box), which makes it sound like an FR.
* **The Dissection**:
  * **FR Component**: "The user types and suggestions drop down." (The visible feature capability).
  * **NFR Component**: "Must appear in <150ms and reduce network traffic by 60%." (The strict technical performance constraint).
* **The System Impact**: The FR tells you what component to create; the NFR dictates the necessary architecture (Debouncing, Caching) required to prevent a backend crash at scale.


> ⚠️ **Warning:** Non-Functional Requirements are frequently in direct conflict with each other. For example, adding deep end-to-end payload encryption enhances your **Security NFR** but adds mathematical overhead that degrades your **Performance/Latency NFR**. Your core engineering responsibility is to intentionally balance these trade-offs based on business goals.
