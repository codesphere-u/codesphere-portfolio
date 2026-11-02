# `codesphere-portfolio` v1.1 — Akandwanaho Ivan Alvin (“Alvin”) Executive Engineering Portfolio & Architecture Case-Study Application

[![CI Status](https://github.com/codesphere-u/codesphere-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/codesphere-u/codesphere-portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-38bdf8.svg)](./LICENSE)
[![Automated Tests](https://img.shields.io/badge/Portfolio_Tests-346%2B_Passing-10b981.svg)](#verified-engineering-benchmarks-matrix)

**Akandwanaho Ivan Alvin** (*commonly known as Alvin*)  
**Founder & Managing Director, Codesphere Innovations (U) Limited**  
**Software Engineer · AI Systems Builder · Cybersecurity · Full-Stack & Cloud Engineering**  
*"Building intelligent, secure, and scalable software — from Uganda to the world."*  
📍 Kampala, Uganda · [codesphereug.com](https://www.codesphereug.com) · [LinkedIn](https://www.linkedin.com/in/the4codex) · [github.com/codesphere-u](https://github.com/codesphere-u)

---

## Overview

`codesphere-portfolio` is the interactive executive engineering portfolio and architecture case-study web application of **Akandwanaho Ivan Alvin** (`@codesphere-u`), showcasing:

- **Executive Leadership & Career History**: Founder & Managing Director of **Codesphere Innovations (U) Limited** (`https://www.codesphereug.com`), Founder & Project Lead of **Funa Gigs** (*Jaminsa Ventures Limited* — distinct from Codesphere Innovations), Former CTO & Head of Engineering at **Waanverse Labs Inc.** (departed March 2025), and Founder of **4codex Technologies**, alongside studies at **ISBAT University — Uganda**.
- **7-Stage Thematic Engineering Journey**: *Foundation → Entrepreneurship → Technical Leadership → Business Leadership → Product Engineering → Advanced Engineering → Open Source*.
- **6 Primary Open-Source Flagships + 2 Specialized Domain Platforms** (`cyber-dragon`, `auralis-local`, `agentshield`, `ARGUS-AI`, `flowledger`, `stackpulse`, `agrisignal`, and `Clinical-Virtual-Health-Platform`) across **AI & Agents**, **Cybersecurity**, **Fintech & Ledgers**, **Cloud & SRE**, and **AgriTech & HealthTech**.
- **Product & Commercial Engineering Archive**: Commercial and operational systems including **Funa Gigs** (*Jaminsa Ventures Limited*), **BizManage Pro**, **PesaFlow**, **AI Energy Efficiency Tool**, **Trip Planner & Electronic Logging Application**, and **Sector-Specific Business Systems** (*2K Restaurant Management*, *BKK Pharmacy Management*, *City Star Supermarket Management*, *OM SAI Hardware Software*, and *Library & Resume Analysis Tools*).

Every benchmark and test count surfaced in this application is backed by an executable test suite in its respective repository—**zero synthetic vanity metrics**.

---

## Verified Engineering Benchmarks Matrix

| Flagship System | Domain | Automated Tests | Measured Latency | Throughput / Accuracy | Key Determinism & Safety Invariant |
| :--- | :--- | :---: | :---: | :--- | :--- |
| [**ARGUS AI v2.1**](https://github.com/codesphere-u/ARGUS-AI) (`ARGUS-AI`) | AI & Agents / Quant | **61** | `0.42 ms` / step | **3 Catastrophic Trap Trades Vetoed** | 7-agent adversarial committee with Devil's Advocate hard veto + point-in-time leakage guard + MCP |
| [**AgriSignal v1.0**](https://github.com/codesphere-u/agrisignal) (`agrisignal`) | AgriTech & HealthTech | **60** | `0.09 ms` / advisory | **100% ≤160-char GSM-7** (`en`, `lg`, `sw`) | Offline-first FAO-56 soil water-balance + explicit uncertainty bounds + WHO pesticide safety filter |
| [**FlowLedger v1.0**](https://github.com/codesphere-u/flowledger) (`flowledger`) | Fintech & Ledgers | **51** | `0.12 ms` / entry | **97 Hash-Chained Entries · 0 Imbalance** (UGX & KES) | `BigInt` minor-unit double-entry arithmetic (IEEE-754 floats banned) + 50-tx 3-way reconciliation |
| [**StackPulse v1.0**](https://github.com/codesphere-u/stackpulse) (`stackpulse`) | Cloud & SRE | **47** | `51.2 µs` / trace | **19,525 traces/sec** DAG assembly | Interval-union critical-path solver + N+1 query detector + Google SRE multi-window burn-rate alerts |
| [**AgentShield**](https://github.com/codesphere-u/agentshield) (`agentshield`) | Cybersecurity / AI | **42** | `0.19 ms` / tool call | **100% Recall · 0% FPR** (25-scenario red-team corpus) | SHA-256 hash-chained audit ledger + HMAC-SHA256 single-use approval tokens |
| [**Auralis Local v0.2**](https://github.com/codesphere-u/auralis-local) (`auralis-local`) | AI & Agents | **36** | `0.245 ms` P50 BM25 | **3,110 docs/sec** indexing throughput | Cite-or-abstain grounding verifier + `127.0.0.1` loopback path-jailed sandbox |
| [**Clinical Virtual Health Platform**](https://github.com/codesphere-u/Clinical-Virtual-Health-Platform) (`Clinical-Virtual-Health-Platform`) | AgriTech & HealthTech | **28** | `0.11 ms` / triage | **100% Protocol-Compliant NEWS2 Acuity** | Deterministic NEWS2 vital-sign triage + HL7 FHIR R4 resource model + RBAC PHI audit trail |
| [**Cyber Dragon v1.0**](https://github.com/codesphere-u/cyber-dragon) (`cyber-dragon`) | Cybersecurity / Fintech | **21** | `0.28 ms` mean | **8/8 Threat Corpus · 0 Outbound Calls** ([Live Demo](https://cyber-dragon-ivory.vercel.app)) | Strictly SSRF-free lexical URL & mobile money USSD (`*165#`, `*185#`, `*334#`) AST scoring |

---

## Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/codesphere-u/codesphere-portfolio.git
cd codesphere-portfolio

# 2. Build static bundle (outputs to index.html and dist/) & run all automated tests
npm test

# 3. Start local preview server + JSON inspection API at http://127.0.0.1:4173
npm start
```

---

## License

Released under the [MIT License](./LICENSE).
