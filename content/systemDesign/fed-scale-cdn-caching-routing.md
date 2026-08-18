---
title: "CDN Architecture & Routing Layers"
category: "system-design"
chapterId: "fed-edge-infrastructure"
slug: "fed-scale-cdn-caching-routing"
description: "Optimizing asset delivery networks via global Anycast routing, edge cache invalidations, and geographical proximity distribution."
playgroundTemplate: "cdn-topology"
---

# CDN Architecture & Routing Layers

## What is it?
A **Content Delivery Network (CDN)** is a globally **distributed network of proxy servers** (called **Points of Presence, or PoPs**) that store copies of web files/content and which later work together to deliver those web content quickly based on **geographical proximity to users**.

>  Instead of loading a site from just one main server, a CDN uses nearby "edge servers" to send files like images and videos much faster to users.

> For a Senior Frontend Engineer, the **CDN is the entry gate to your application infrastructure**. Instead of routing a user's browser directly to your central origin server (e.g., AWS `us-east-1` in Virginia), traffic is intercepted by an edge node located closest to the user's physical machine using **Anycast Routing**.

- **Anycast routing** is a ***network addressing and routing method*** where ***multiple physical servers*** spread across different locations share the exact ***same IP address***. When a user sends a request to that IP address, the ***network automatically routes*** it to the statistically ***closest or healthiest server***.

> **Analogy:** Imagine the website has just one IP address worldwide. When the Tokyo user types it in, ***Anycast routing*** tricks the internet into sending the request to the Tokyo node instead of the Dublin node. ***If the Tokyo node is not working***, the request is automatically routed to the ***next closest healthy node***. 
> - Once there, the ***CDN node*** serves the cached content. 
> - In case the requested content is not cached, the ***edge node fetches it from the origin*** server and ***caches it for future requests***.

![CDN Anycast Routing](/CDN_architecture_and_routing.png)

## What CDNs Do Beyond Caching
| Feature | What It Does | Everyday Analogy |
|---------|--------------|-----------------|
| **Security (WAF / DDoS)** | Blocks malicious bots and hackers at the edge. | Security guards at the regional branch blocking troublemakers. |
| **Dynamic Optimization** | Speeds up live data that cannot be cached (e.g., stock prices). | A dedicated express delivery lane between branches. |
| **Image & Code Optimization** | Resizes images and shrinks code files on the fly. | A local worker packing goods into smaller boxes to ship faster. |
| **Edge Computing** | Runs actual code and logic directly on the edge node. | The local branch making decisions without calling head office. |

## Architectural Layers
- **User Layer**: The device (browser or app) requesting content.
- **Edge Layer (Points of Presence / PoPs)**: Scattered data centers worldwide holding nodes closest to users.
- **Shield/Parent Layer**: Central regional caches that protect the origin from getting overwhelmed.
- **Origin Layer**: The main source server where the master copy of the website lives.
## Routing Layers (How Traffic Travels)
- **Domain Name System (DNS) Layer (The Map)**: Translates names (example.com) into Anycast IP addresses.
- **Anycast IP Layer (The Compass)**: Directs the user's connection to the physically closest Edge PoP.
- **Border Gateway Protocol (BGP) Routing Layer (The Highways)**: The backbone internet protocol that chooses the fastest path between routers.
- **Dynamic Route Optimization Layer (The Express Lane)**: Speeds up connection paths between Edge nodes and the Origin for live, un-cached data.

## Process to Implement a CDN 
***DevOps / Backend (BED)*** handles the below steps, but 
- ***Frontend Engineers*** ***all asset links*** (images, CSS, JS) ***point to your CDN domain*** instead of your local server domain.
![CDN Implementation Process](/CDN_process.png)

## Why CDN needed ?
A CDN is needed to solve two main problems: 
- **Distance and Traffic Spikes:** A CDN copies your website files to servers all over the world so global users can load your site instantly from a nearby node instead of waiting for data to travel across oceans.
- **Crash Protection:** A CDN absorbs massive waves of traffic across its global network, protecting your main backend server from getting overloaded and crashing.

> ## 🛒 Real-World Case Study: Shopify during Black Friday🏢
> - The CompanyShopify, the world’s leading e-commerce infrastructure platform, runs approximately 99.3% of its global merchant storefronts—representing over 6 million store domains—directly on Cloudflare's global Anycast CDN network.

- **The Problem**: Astronomical Black Friday traffic spikes (489 million requests per minute) threatened to crash central databases and cause catastrophic global checkout delays.
- **The Implementation**: Shopify moved checkout logic (Cloudflare Workers) and storefront assets directly onto global edge servers right next to local shoppers.
- **The Outcome**: The edge absorbed the massive traffic load, keeping core servers stable while flawlessly processing $9.3+ billion in sales with millisecond speeds.

> ⚠️ Critical Warnings
> - ***Never cache private data or static filenames without unique hashes***. Caching private pages leaks personal user data to strangers, while failing to hash filenames (like using main.js) locks old code across global servers and completely breaks your website's interface during updates.

> 💡 Pro Tips
> - ***To deliver your website content with extreme speed (lowest latency) and total reliability*** (uptime) globally by serving assets from a nearby server instead of a distant home server.