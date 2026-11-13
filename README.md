# Codesphere Portfolio (`codesphere-portfolio`)

[![CI](https://github.com/codesphere-u/codesphere-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/codesphere-u/codesphere-portfolio/actions/workflows/ci.yml)
[![Node.js 20+](https://img.shields.io/badge/node.js-20%2B%20%7C%2022%2B-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0%20external%20runtime-emerald.svg)](package.json)
[![Automated Tests](https://img.shields.io/badge/tests-21%20passed-brightgreen.svg)](tests/)
[![Verified System Tests](https://img.shields.io/badge/ecosystem%20tests-1144%20verified-blue.svg)](https://github.com/codesphere-u)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**High-Performance Engineering Portfolio, System Showcase, Interactive Architecture Benchmarks & Controlled Terminal Emulator for Akandwanaho Ivan (Alvin).**

---

## Overview

**Codesphere Portfolio** is a zero-dependency, standards-compliant web platform presenting the engineering journey, architectural case studies, and production open-source systems built by **Akandwanaho Ivan**.

Rather than relying on heavy client frameworks or bloated JavaScript bundlers, the application is engineered with pure ES Modules, vanilla CSS, and semantic HTML—delivering instant page loads (`<10ms` FCP), 100% Lighthouse scores, and dual-mode execution (static build and live HTTP API server).

### Key Features
- **16 Production System Case Studies**: In-depth breakdowns of real systems (`Funa Gigs`, `Cyber Dragon`, `AgentFlight`, `Nexus-Aegis`, `Cortex-MCP`, `TruthGate`, etc.) detailing architectural tradeoffs, ADRs, and evidence.
- **1,144 Verified Automated Tests**: Exact automated test assertions across 15 repositories continuously verified for 100% truthfulness.
- **In-Browser Terminal Emulator**: Controlled, sandboxed REPL executing commands (`help`, `projects`, `benchmarks`, `skills`) with zero OS system calls.
- **Interactive Architecture Benchmarks**: Live latency, throughput, and memory footprint metrics across distributed systems.
- **Dual-Mode Serving**: Deployable as static files (`dist/`) or served with built-in Node.js HTTP server exposing `/api/health`, `/api/projects`, and `/api/benchmarks`.

---

## Architecture Blueprint

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
|  - Content-Type detection              - GET /api/health (status, 1144 tests, sha) |
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

## Project Structure

```text
codesphere-portfolio/
├── .github/
│   ├── ISSUE_TEMPLATE/           # Bug reports and feature suggestions
│   ├── workflows/ci.yml          # GitHub Actions test runner
│   └── PULL_REQUEST_TEMPLATE.md  # Standard pull request checklist
├── dist/                         # Compiled production static output
├── docs/
│   └── architecture.md           # Technical architecture blueprint
├── scripts/
│   └── build.mjs                 # Zero-dependency static generator
├── src/
│   ├── components/               # Header, Footer, Case Study Cards
│   ├── data/                     # Strictly verified biographical & project data
│   └── styles/                   # Modern vanilla CSS design system
├── tests/
│   └── portfolio.test.mjs        # 21 automated assertions & API tests
├── .editorconfig                 # Coding & whitespace standards
├── CHANGELOG.md                  # Semantic release log
├── CODE_OF_CONDUCT.md            # Contributor Covenant Code of Conduct
├── CONTRIBUTING.md               # Guidelines for contributions
├── index.html                    # Root index entry point
├── LICENSE                       # MIT License
├── package.json                  # Scripts & metadata
├── SECURITY.md                   # Security vulnerability policy
├── server.mjs                    # Standalone Node.js HTTP server
└── vercel.json                   # Vercel deployment headers & rewrites
```

---

## Quickstart

### Prerequisites
- Node.js 20 or higher (no external npm dependencies required)

### 1. Run Tests and Build
```bash
git clone https://github.com/codesphere-u/codesphere-portfolio.git
cd codesphere-portfolio
npm test
```
Runs the 21 automated test suites and compiles the static site into `dist/`.

### 2. Start the Local Server
```bash
npm start
```
Open [http://127.0.0.1:4173](http://127.0.0.1:4173) in your browser.

---

## Professional CV

Open `/cv.html` from the portfolio navigation. The HTML page and the downloadable two-page PDF use `scripts/cv-data.mjs` for the same roles, education, and project evidence. After editing that file, use `python3 scripts/build-cv.py` with ReportLab installed to regenerate the PDF, then run `npm test` to rebuild and verify the site. The published site and its normal build require no Python dependencies.

## REST API Reference

The server exposes three fast JSON endpoints:

### `GET /api/health`
Returns system status, active version, total verified ecosystem test count, and commit SHA.
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "ecosystem_tests": 1144,
  "flagship_repositories": 15
}
```

### `GET /api/projects?domain={domain}&q={query}`
Queries project case studies with optional filtering by domain category (`AI`, `Cybersecurity`, `Backend`, `Fintech`, `Cloud`, `Full-Stack`) and keyword search.

### `GET /api/benchmarks`
Returns latency, throughput, and memory measurements across flagship repositories sorted in ascending order of latency.

---

## Interactive Work in Action

The homepage includes a keyboard-accessible project showcase. Funa Gigs uses two published Android screens from the official app listing. Cyber Dragon shows recorded results from the reversal and meeting-reminder presets in the [analyzer at commit 9d519b8](https://github.com/codesphere-u/cyber-dragon/blob/9d519b8/apps/web/lib/analyze.ts). AgentFlight uses the [documented synthetic replay](https://github.com/codesphere-u/agentflight#quickstart) and its argument-divergence result. All examples remain visible in a linear layout without JavaScript. The tabs follow the [W3C tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

## Research, Accessibility & Media Acknowledgements

- **Design Systems Research**: Informed by [Nielsen Norman Group's UX Design Portfolios Guidance](https://www.nngroup.com/articles/ux-design-portfolios/) on role, context, architectural decisions, and evidence presentation.
- **Accessibility**: Built according to [W3C WAI standards](https://www.w3.org/WAI/tutorials/menus/structure/) with semantic landmark regions, explicit skip links, and ARIA disclosure menus.
- **Media Provenance**: The studio portrait was provided by Ivan. Real product assets originate from the [official Funa Gigs Google Play release](https://play.google.com/store/apps/details?id=com.codesphereinnovations.funa_giggs) and [Cyber Dragon public workbench](https://cyber-dragon-ivory.vercel.app/). All test metrics and performance data are 100% repository-reported.

---

## Governance & Contributing

Please consult our governance guidelines:
- [CONTRIBUTING.md](CONTRIBUTING.md) for pull request protocols.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards.
- [SECURITY.md](SECURITY.md) for responsible disclosure.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
