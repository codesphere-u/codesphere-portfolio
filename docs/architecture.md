# Codesphere Portfolio - Technical Architecture

## 1. System Overview

**Codesphere Portfolio** (`codesphere-portfolio`) is a zero-dependency, ultra-fast engineering portfolio, showcase platform, and headless API built with modern standards-compliant ES Modules (Node.js 20+). It renders an editorial presentation of 16 production software systems, 931 verified automated tests across 15 repositories, interactive architecture benchmarks, and an in-browser safe terminal emulator.

---

## 2. Architecture Blueprint

```text
+-----------------------------------------------------------------------------------+
|                        Client Layer (Browsers & API Consumers)                    |
+-----------------------------------------+-----------------------------------------+
                                          |
                              HTTP / HTTPS (Port 4173)
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                       Node.js HTTP Server (server.mjs)                            |
|                                                                                   |
|  Static Asset Router                   REST API Endpoints                         |
|  - Content-Type detection              - GET /api/health (status, 931 tests, sha) |
|  - Security headers (CSP, HSTS)        - GET /api/projects?domain=&q=             |
|  - Clean URL routing (/work, /about)   - GET /api/benchmarks (latency sorted)     |
+-------------------+-------------------------------------------+-------------------+
                    |                                           |
                    | Hydrated via Build Output                 | Reads Structured
                    v                                           v Datasets
+---------------------------------------+   +---------------------------------------+
|         dist/ Static Bundle           |   |       src/data/ (Data Layer)          |
|                                       |   |                                       |
| - index.html (Homepage)               |   | - projects.mjs (16 verified systems)  |
| - work/index.html + 16 case studies   |   | - career.mjs (Accurate roles & dates) |
| - leadership/index.html               |   | - specialties.mjs                     |
| - contact/index.html                  |   | - philosophy.mjs                      |
| - Shared Shell & Monogram SVG         |   | - terminal-commands.mjs (Safe REPL)   |
+-------------------+-------------------+   +-------------------+-------------------+
                    ^                                           |
                    |                 Static Generation         |
                    +-------------------------------------------+
                                   scripts/build.mjs
```

---

## 3. Core Architectural Subsystems

### 3.1 Zero-Dependency Build Pipeline (`scripts/build.mjs`)
- Renders 100% semantic, accessible HTML using pure Node.js template functions without webpack, Vite, or external bundlers.
- Pre-compiles 16 distinct project case studies into static files under `dist/work/`.
- Inlines critical CSS and custom SVG iconography for sub-10ms First Contentful Paint (FCP).

### 3.2 Dual-Mode Delivery (Static + API Server)
- **Static Hosting**: The compiled `dist/` directory can be deployed directly to Vercel, Cloudflare Pages, or GitHub Pages.
- **Dynamic Node Server (`server.mjs`)**: Lightweight HTTP/1.1 server serving both static HTML and three live JSON endpoints:
  - `/api/health`: System health, total verified test counts (931), active git commit SHA, and uptime.
  - `/api/projects`: Query and domain category filtering across projects, problem statements, and ADR citations.
  - `/api/benchmarks`: Latency and throughput comparisons across the open-source flagships.

### 3.3 Safe In-Browser Terminal Emulator
- Exposes a controlled interactive CLI experience for visitors.
- Parses safe virtual commands (`help`, `projects`, `benchmarks`, `skills`, `clear`, `contact`) without executing shell processes or invoking OS system calls.

---

## 4. Truthfulness and Factual Boundaries

The data layer enforces strict real-world identity boundaries verified by unit tests:
- **Education**: ISBAT University, Kampala (Bachelor of Science in Information Technology, 2022–2025). Never Makerere.
- **Career Roles**:
  - Codesphere Innovations (Lead Systems Architect & Founder, May 2024 – Present).
  - Funa Gigs under Jaminsa Ventures Limited (Principal Platform & Security Architect, Sept 2024 – Feb 2025).
  - Waanverse Labs (Co-Founder & Chief Technology Officer, Jan 2024 – March 2025).
  - 4codex Technologies (Core Backend Engineer, Aug 2023 – April 2024).
- **Test Metric Verification**: Exactly 931 automated tests across 15 flagship repositories, validated via automated test assertions.
