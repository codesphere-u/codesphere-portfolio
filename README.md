# `codesphere-portfolio` v1.0 — Interactive Engineering Portfolio & Architecture Case-Study Application

[![CI Status](https://github.com/codesphere-u/codesphere-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/codesphere-u/codesphere-portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-38bdf8.svg)](./LICENSE)
[![Automated Tests](https://img.shields.io/badge/Portfolio_Tests-292%2B_Passing-10b981.svg)](#verified-engineering-benchmarks-matrix)

**Software Engineer | AI Systems Builder | Cybersecurity | Full-Stack & Cloud Engineering | Building Technology for Real-World Problems**  
📍 Kampala, Uganda · Global Remote / International Engineering · [github.com/codesphere-u](https://github.com/codesphere-u)

---

## Overview

`codesphere-portfolio` is an interactive, zero-bloat engineering portfolio and architecture case-study web application showcasing **7 production-grade flagship systems** across **AI & Agents**, **Cybersecurity**, **Fintech & Ledgers**, **Cloud & SRE**, and **AgriTech & HealthTech**.

Every number surfaced in this application is backed by an executable test suite or benchmark harness in its respective repository—**zero synthetic vanity metrics**.

### Key Features

1. **Interactive Flagship Systems Explorer**:
   - Filterable in real time across 6 engineering domains (*All*, *AI & Agents*, *Cybersecurity*, *Fintech & Ledgers*, *Cloud & SRE*, *AgriTech & HealthTech*) and full-text search (`/` shortcut) across languages, invariants, and Architecture Decision Records (ADRs).
2. **Interactive Architecture & ADR Deep-Dive Drawer**:
   - Clicking any flagship system opens a keyboard-accessible slide-over inspection drawer (`role="dialog"`, `Esc` to close) containing its ASCII architecture blueprint, layered responsibilities, deterministic safety invariants, full ADRs (Context, Decision, Trade-Offs, Verification), one-click reproducible CLI quickstart commands, and direct links to source & test files on GitHub.
3. **Verified Engineering Benchmarks Matrix**:
   - Interactive sortable comparison table + visual bar indicators across **292+ passing automated tests**, sub-millisecond P50/mean latencies (`0.0512 ms` to `0.42 ms`), throughput metrics, and determinism guarantees.
4. **Zero-Dependency, Sub-Millisecond Static Build & Preview Server**:
   - Builds self-contained static assets (`index.html` and `dist/`) in **< 5 ms** with dark/light theme persistence, semantic accessibility landmarks, OpenGraph metadata, and `prefers-reduced-motion` support.

---

## Verified Engineering Benchmarks Matrix

| Flagship System | Domain | Automated Tests | Measured Latency | Throughput / Accuracy | Key Determinism & Safety Invariant |
| :--- | :--- | :---: | :---: | :--- | :--- |
| [**AgentShield**](https://github.com/codesphere-u/agentshield) (`agentshield`) | Cybersecurity / AI | **42** | `0.19 ms` / tool call | **100% Recall · 0% FPR** (25-scenario red-team corpus) | SHA-256 hash-chained audit ledger + HMAC-SHA256 single-use approval tokens |
| [**Cyber Dragon v1.0**](https://github.com/codesphere-u/cyber-dragon) (`cyber-dragon`) | Cybersecurity / Fintech | **21** | `0.28 ms` mean | **8/8 Threat Corpus · 0 Outbound Calls** ([Live Demo](https://cyber-dragon-ivory.vercel.app)) | Strictly SSRF-free lexical URL & mobile money USSD (`*165#`, `*185#`, `*334#`) AST scoring |
| [**Auralis Local v0.2**](https://github.com/codesphere-u/auralis-local) (`auralis-local`) | AI & Agents | **36** | `0.245 ms` P50 BM25 | **3,110 docs/sec** indexing throughput | Cite-or-abstain grounding verifier + `127.0.0.1` loopback path-jailed sandbox |
| [**FlowLedger v1.0**](https://github.com/codesphere-u/flowledger) (`flowledger`) | Fintech & Ledgers | **51** | `0.12 ms` / entry | **97 Hash-Chained Entries · 0 Imbalance** (UGX & KES) | `BigInt` minor-unit double-entry arithmetic (IEEE-754 floats banned) + 50-tx 3-way reconciliation |
| [**ARGUS AI v2.1**](https://github.com/codesphere-u/ARGUS-AI) (`ARGUS-AI`) | AI & Agents / Quant | **61** | `0.42 ms` / step | **3 Catastrophic Trap Trades Vetoed** | 7-agent adversarial committee with Devil's Advocate hard veto + point-in-time leakage guard + MCP |
| [**StackPulse v1.0**](https://github.com/codesphere-u/stackpulse) (`stackpulse`) | Cloud & SRE | **47** | `51.2 µs` / trace | **19,525 traces/sec** DAG assembly | Interval-union critical-path solver + N+1 query detector + Google SRE multi-window burn-rate alerts |
| [**AgriSignal v1.0**](https://github.com/codesphere-u/agrisignal) (`agrisignal`) | AgriTech & HealthTech | **34** | `0.09 ms` / advisory | **100% ≤160-char GSM-7** (`en`, `lg`, `sw`) | Offline-first FAO-56 soil water-balance + explicit uncertainty bounds + WHO pesticide safety filter |

---

## Highlighted Architectural Trade-Offs (ADRs)

- **Why Cyber Dragon Refuses to Fetch User-Submitted URLs**: Scanners that perform outbound HTTP fetches become SSRF proxies and trigger attacker tracking canaries. Cyber Dragon performs 100% lexical, Shannon-entropy, Punycode homograph, and USSD/SMS pattern analysis with zero network egress in `0.28 ms`.
- **Why FlowLedger Bans IEEE-754 Floating Point**: Standard JavaScript `number` silently accumulates rounding drift during fee splits and multi-currency (UGX/KES/USD) settlements. FlowLedger enforces `bigint` minor units at every boundary and links all 97 simulated journal postings in a tamper-evident SHA-256 hash chain.
- **Why Auralis Binds Only to `127.0.0.1` with Single-Use Approval Tokens**: Local AI daemons bound to `0.0.0.0` expose developer filesystems to LAN peers and browser DNS-rebinding attacks. Auralis enforces loopback binding, `realpath` symlink jails, and cryptographic single-use write approval tokens.

---

## Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/codesphere-u/codesphere-portfolio.git
cd codesphere-portfolio

# 2. Build static bundle (outputs to index.html and dist/) & run all 22 automated tests
npm test

# 3. Start local preview server + JSON inspection API at http://127.0.0.1:4173
npm start
```

### Programmatic API Endpoints (via `server.mjs`)

- `GET /api/health` — Returns portfolio service health, total flagship systems (`7`), and total automated tests (`292`).
- `GET /api/projects?domain=Cybersecurity&q=SSRF` — Filters flagship systems by domain and full-text query.
- `GET /api/benchmarks?sort=latency-asc` — Returns sorted benchmark telemetry across all repositories.

---

## Project Structure

```text
codesphere-portfolio/
├── index.html                  # Pre-rendered static entry point (GitHub Pages ready)
├── dist/                       # Self-contained production build output (Vercel/Netlify ready)
├── server.mjs                  # Zero-dependency preview server & JSON API
├── scripts/
│   └── build.mjs               # Sub-millisecond static site generator & integrity verifier
├── src/
│   ├── data/
│   │   ├── portfolio-data.mjs  # Verified metrics, ADRs, blueprints, and GitHub links
│   │   └── portfolio-data.d.ts # TypeScript definitions for all portfolio entities
│   ├── core/
│   │   └── explorer.mjs        # Pure domain filtering, search, sorting & validation logic
│   └── ui/
│       ├── app.mjs             # Interactive browser controller (drawer, filters, theme)
│       └── styles.css          # Dark/light design system & reduced-motion styles
└── tests/
    └── portfolio.test.mjs      # 22 automated Node --test specifications
```

---

## License

Released under the [MIT License](./LICENSE).
