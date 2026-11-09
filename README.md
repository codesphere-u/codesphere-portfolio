# Akandwanaho Ivan · Portfolio

Akandwanaho Ivan, also known as Alvin, is a software engineer and founder based in Kampala, Uganda.

- **Home** introduces Ivan and three featured projects.
- **Work** collects 16 project case studies. Each shows the problem, design decisions, and evidence. Featured stories include the Funa Gigs hiring workflow, Cyber Dragon’s browser workbench, and a reproducible AgentFlight replay.
- **Leadership** covers the founder and engineering roles at Codesphere Innovations, Funa Gigs under Jaminsa Ventures Limited, Waanverse Labs, and 4codex Technologies.
- **Contact** links to LinkedIn, Codesphere Innovations, and GitHub.

The site uses one navigation system and one visual design for every page. The Akandwanaho Ivan monogram is available as an SVG via the footer. The current case studies live under `/work/`.

## Run locally

Use Node.js 22. The build has no package dependencies.

```sh
npm test
npm start
```

Open `http://127.0.0.1:4173/`. For static hosting, run `npm run build` and publish all of `dist/`. The Node server also exposes `/api/health`, `/api/projects`, and `/api/benchmarks`.

## Research and media

- [Nielsen Norman Group](https://www.nngroup.com/articles/ux-design-portfolios/) informed the problem, role, design, and evidence structure.
- [W3C WAI](https://www.w3.org/WAI/tutorials/menus/structure/) informed the shared navigation landmarks, link list, and current-page indication.
- [Jonnie Hallman’s homepage process](https://destroytoday.com/blog/homepage-concept) informed the placement of inspectable examples directly on the homepage.

The studio portrait was supplied by Ivan. The Funa Gigs images come from the [official Google Play listing](https://play.google.com/store/apps/details?id=com.codesphereinnovations.funa_giggs). The Cyber Dragon screenshot shows the [public workbench](https://cyber-dragon-ivory.vercel.app/). The AgentFlight replay illustrates the synthetic incident in its [project README](https://github.com/codesphere-u/agentflight#quickstart). Performance measurements and test counts are repository-reported.

Released under the [MIT License](./LICENSE).
