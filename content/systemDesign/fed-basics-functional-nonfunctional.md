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

> **Simplified Naming Trick**
>- **(FR)** = What the system does (**The Feature**).
>- **(NFR)** = How well it does it (**The Experience/ Quality / Performance**).

### Some more examples of Functional vs. Non-Functional Requirements:
> **The Login Feature**
> - **Functional (FR)**: The user can log in using their email and password, and the system will validate the credentials and grant access to the dashboard.
> - **Non-Functional (NFR)**: The login process must complete within `500ms` with security measures in place, and the system must support `5,000 concurrent logins` without crashing.

> **The Search Autocomplete Feature**
> - **Functional (FR)**: The user types a query in the search bar and sees a dropdown menu displaying matching suggestions.
> - **Non-Functional (NFR)**: The system must handle up to `10,000 concurrent search requests per second (throughput)`, and the UI must display suggestions within `150ms` of the last keystroke (latency).

### Analogy: Car Example to understand Functional vs. Non-Functional Requirements
> **Functional (FR)**: The car can ***accelerate, brake, and steer***.
> 
> **Non-Functional (NFR)**: The car can ***accelerate from 0 to 60 mph in under 5 seconds***, has a ***top speed of 150 mph***, and achieves a ***fuel efficiency of 30 miles per gallon***.

![Functional vs Non-Functional Requirements](/FR_and_NFR_concept.png)

## Why FR and NFR Are Needed ?
We need both **Functional (FR) and Non-Functional (NFR) requirements** because an **application must not only** have the correct features to **solve a problem, but it must also be stable, fast, and secure enough to survive real-world traffic and usage patterns**.
- **FR is your purpose**: Without features, your app is useless because it does nothing for the user.
- **NFR is your survival**: Without speed, safety, and stability, your app will crash, bleed money, or get hacked in the real world.

## The Scoping Process: Extracting FRs and NFRs from Requirements

To define requirements systematically during an architectural loop, execute this 4-step framework:

### Step 1: Lock the Features (Isolation) - FR
- Pick and freeze only the ***top 2–3 actions a user must be able to do***, cutting out any unnecessary feature bloat.

### Step 2: Do the Math (Estimation) - NFR
- Look at your daily user count and calculate the numbers— ***how many requests hit your servers per second, how much data travels over the wire, and how much hard drive storage you need***.

### Step 3: Set the Rules (Enforcement) - NFR
- ***Turn those math calculations into strict performance goals*** for your team, like a web page loading under 200ms or staying online 99.99% of the time.

### Step 4: Pick the Tools (Selection) - NFR
- ***Choose the exact engineering tech stack and patterns*** (like a CDN or a specific database) that are proven ***to hit your performance goals*** within your budget.
---

## 🔬 Scenario Case Study: Search Autocomplete (Typeahead)
>### 🎙️ The Architectural Problem
Design a high-throughput search autocomplete input field that provides real-time matching suggestions while handling 10M DAU without overloading the backend infrastructure.
> - **DAU** stands for Daily Active Users
> - **High Throughput** means the system can handle a large number of requests per second (RPS) without crashing or slowing down.

**Functional Requirements (FR) — The Features**
>- **Dropdown Input**: Displays a dropdown list containing up to 5 matching search terms.
>- **Accessibility**: Fully navigates using Up/Down arrow keys and Enter to select.

**Capacity & Scale (NFR Math) — The Volume**
>- **Average Traffic**: 10M active users executing ~5,787 requests per second (RPS).
>- **Peak Traffic**: Spikes up to ~17,000 RPS during busy hours.
>- **The Bottleneck**: Rapid typing triggers millions of unnecessary database queries.

**Metric Enforcement (NFR Rules) — The Performance Limits**
>- **Latency Budget**: Dropdown recommendations must display within 150ms of typing.
>- **Memory Budget**: Client-side local memory caching must not cause browser memory leaks.

**Architectural Trade-offs (NFR Selection) — The Engineering Choices**
> **Debouncing (300ms delay)**: 
  >- Gain: Drastically cuts down backend server traffic.
  >- Trade-off: Slow typists might experience a tiny, visible pause before results load.
>
> **Client Caching (Local Map/Set Storage)**:
  >- Gain: Instant, zero-latency feedback for repeated search words.
  >- Trade-off: Consumes more browser RAM and risks displaying stale data.
>
> **Network AbortController (Request Cancellation)**:
> - Gain: Drops old network packets so late responses don't corrupt the screen layout.
> - Trade-off: Increases code complexity and still hits server resources if fired too late.

![System Design for Autocomplete](/searchAutoComplete_FR_NFR.png) 


### ⚠️ Traps to Avoid: Blending FR and NFR
* **The Illusion**: An NFR will often reference a functional feature (like typing in a search box), which makes it sound like an FR.
* **The Dissection**:
  * **FR Component**: "The user types and suggestions drop down." (The visible feature capability).
  * **NFR Component**: "Must appear in <150ms and reduce network traffic by 60%." (The strict technical performance constraint).
* **The System Impact**: The FR tells you what component to create; the NFR dictates the necessary architecture (Debouncing, Caching) required to prevent a backend crash at scale.


> ⚠️ **Warning:** Non-Functional Requirements are frequently in direct conflict with each other. For example, adding deep end-to-end payload encryption enhances your **Security NFR** but adds mathematical overhead that degrades your **Performance/Latency NFR**. Your core engineering responsibility is to intentionally balance these trade-offs based on business goals.
