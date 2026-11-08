# `codesphere-portfolio` v2.0 — THE BUILDER'S JOURNEY

[![CI Status](https://github.com/codesphere-u/codesphere-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/codesphere-u/codesphere-portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-53C9EE.svg)](./LICENSE)

**Akandwanaho Ivan Alvin** (*commonly known as Alvin*)  
**Founder & Managing Director, Codesphere Innovations (U) Limited**  
**Software Engineer · AI Systems Builder · Cybersecurity · Full-Stack & Cloud Engineering**  
*"Engineering what comes next. Building intelligent, secure, and scalable software — from Uganda to the world."*  
📍 Kampala, Uganda · [codesphereug.com](https://www.codesphereug.com) · [LinkedIn](https://www.linkedin.com/in/the4codex) · [github.com/codesphere-u](https://github.com/codesphere-u)

---

## Creative Vision: The Builder's Journey

`codesphere-portfolio` v2.0 transforms a static résumé into an interactive technology documentary about an engineer who built his skills at **ISBAT University** in Kampala, founded **4codex Technologies**, served as CTO & Head of Engineering at **Waanverse Labs Inc.** (until March 2025), founded **Codesphere Innovations (U) Limited**, leads **Funa Gigs** under **Jaminsa Ventures Limited**, and architects open-source AI, cybersecurity, fintech, and cloud observability systems.

### Explore the portfolio

- **Selected work** introduces AgentShield, AgentFlight and Funa Gigs. Use the project index to filter or search the complete set of public engineering projects.
- **Case studies** are standalone HTML pages under `/cases/`. Each includes architecture, security boundaries, decision records, source links and reproduction commands. The project index also supports a quick view.
- **Leadership and journey** cover founder roles, past engineering leadership, education and open-source work.
- **Engineering tools** include the knowledge map, read-only terminal and a benchmark table. The benchmark table is generated from `src/data/portfolio-data.mjs`. Measurements and test counts reflect the workloads and environments reported by the respective repositories.

### Run locally

Use Node.js 22. The build has no package dependencies.

```bash
npm test
npm start
```

Open `http://127.0.0.1:4173`. To publish to a static host, run `npm run build` and publish the entire `dist/` directory, including the generated case studies. The Node preview also exposes JSON under `/api/health`, `/api/projects` and `/api/benchmarks`.

## License

Released under the [MIT License](./LICENSE).
