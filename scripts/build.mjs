import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderProfile, renderFunaCaseStudy } from './profile.mjs';
import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';
import {
  computePortfolioSummary,
  sortBenchmarks,
  executeTerminalCommand,
  validatePortfolioIntegrity
} from '../src/core/explorer.mjs';
import {
  renderJourneyStageHtml,
  renderProjectCardHtml,
  renderDrawerContentHtml,
  renderKnowledgeMapSvg,
  renderKnowledgeNodeDetailHtml,
  renderPhilosophyCardHtml,
  renderExperienceCardHtml,
  renderBroaderProjectCardHtml,
  renderBenchmarkRowsHtml
} from '../src/ui/app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getVerifiedSummary() {
  const integrity = validatePortfolioIntegrity(PORTFOLIO_DATA);
  if (!integrity.valid) {
    throw new Error(`Portfolio integrity check failed:\n${integrity.errors.join('\n')}`);
  }
  return computePortfolioSummary(PORTFOLIO_DATA);
}

export function generatePortfolioHtml() {
  const startMs = performance.now();
  const summary = getVerifiedSummary();
  const html = renderProfile(PORTFOLIO_DATA.profile, summary);
  return { html, summary, elapsedMs: (performance.now() - startMs).toFixed(1) };
}

export function generateArchiveHtml() {
  const summary = getVerifiedSummary();
  const {
    profile,
    domains,
    experience,
    journey,
    knowledgeMap,
    philosophy,
    projects,
    broaderProjects,
    benchmarks
  } = PORTFOLIO_DATA;

  // Experience 02: Interactive 6-Chapter Journey
  const journeyTabsHtml = journey
    .map((ch, idx) => {
      const isSelected = idx === 0;
      return `
        <button
          type="button"
          class="journey-tab-btn ${isSelected ? 'is-active' : ''}"
          id="journey-tab-${ch.stageNumber}"
          data-chapter-tab="${ch.stageNumber}"
          role="tab"
          tabindex="${isSelected ? 0 : -1}"
          aria-selected="${isSelected ? 'true' : 'false'}"
          aria-controls="journey-panel-${ch.stageNumber}"
        >
          <span class="journey-tab-num">${escapeHtml(ch.chapterCode)}</span>
          <span class="journey-tab-label">${escapeHtml(ch.theme)}</span>
        </button>`;
    })
    .join('\n');

  const journeyPanelsHtml = journey
    .map((ch, idx) => renderJourneyStageHtml(ch, idx === 0))
    .join('\n');

  // Experience 03: Domain filter tabs & project cards
  const domainTabsHtml = domains
    .map((domain) => {
      const pressed = domain === 'All' ? 'true' : 'false';
      const activeClass = domain === 'All' ? 'is-active' : '';
      const count = summary.domainCounts[domain] ?? 0;
      return `
        <button type="button" class="domain-tab ${activeClass}" data-domain="${escapeHtml(domain)}" aria-pressed="${pressed}">
          <span>${escapeHtml(domain)}</span>
          <span class="domain-count">(${count})</span>
        </button>`;
    })
    .join('');

  const cardsHtml = projects.map(renderProjectCardHtml).join('\n');
  // Experience 04: Interactive 8-Node Engineering Knowledge Map
  const firstNode = knowledgeMap[0];
  const kmapPillsHtml = knowledgeMap
    .map((node, idx) => {
      const isSel = idx === 0;
      return `
        <button
          type="button"
          class="kmap-pill-btn ${isSel ? 'is-active' : ''}"
          data-kmap-pill="${escapeHtml(node.id)}"
          aria-pressed="${isSel ? 'true' : 'false'}"
        >
          <span class="kmap-pill-code">${escapeHtml(node.shortCode)}</span>
          <span>${escapeHtml(node.label)}</span>
        </button>`;
    })
    .join('\n');

  const initialKmapSvg = renderKnowledgeMapSvg(knowledgeMap, firstNode.id);
  const initialKmapDetailHtml = renderKnowledgeNodeDetailHtml(firstNode, projects);
  const accessibleKmapMatrixHtml = knowledgeMap
    .map((node) => renderKnowledgeNodeDetailHtml(node, projects))
    .join('\n');

  // Experience 05: Controlled Engineering Terminal initial output
  const initialHelp = executeTerminalCommand('help', PORTFOLIO_DATA);
  const initialHelpLines = initialHelp.lines
    .map((l) => `<div class="term-line">${escapeHtml(l)}</div>`)
    .join('');

  const terminalCommands = [
    'help',
    'about',
    'journey',
    'projects',
    'skills',
    'github',
    'contact',
    'clear'
  ];
  const terminalChipsHtml = terminalCommands
    .map(
      (cmd) => `
      <button type="button" class="term-chip-btn" data-terminal-cmd="${cmd}">
        <code>${cmd}</code>
      </button>`
    )
    .join('');

  // Experience 06: How I approach the work.
  const philosophyCardsHtml = philosophy.map(renderPhilosophyCardHtml).join('\n');

  // Supporting Executive Sections
  const aboutParagraphsHtml = profile.aboutParagraphs
    .map((p) => `<p class="about-paragraph">${escapeHtml(p)}</p>`)
    .join('\n');
  const experienceCardsHtml = experience.map(renderExperienceCardHtml).join('\n');
  const broaderCardsHtml = broaderProjects.map(renderBroaderProjectCardHtml).join('\n');
  const sortedBenchmarks = sortBenchmarks(benchmarks, 'tests-desc');
  const benchmarkRowsHtml = renderBenchmarkRowsHtml(sortedBenchmarks, summary);

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Engineering Archive | ${escapeHtml(profile.name)}</title>
  <meta name="description" content="Public engineering projects, architecture case studies, benchmarks and career history for ${escapeHtml(profile.name)}." />

  <!-- Editorial & Technical Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..700&amp;family=Instrument+Serif:ital@1&amp;family=Space+Grotesk:wght@500..700&amp;display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="./src/ui/styles.css" />
  <link rel="stylesheet" href="./src/ui/editorial.css" />
  <link rel="stylesheet" href="./src/ui/polish.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="./index.html" class="brand-link">
        <span class="brand-mark" aria-hidden="true">IA.</span>
        <span class="brand-text-wrap">
          <span class="brand-name">${escapeHtml(profile.name)}</span>
          <span class="brand-sub" aria-hidden="true">ENGINEER / FOUNDER</span>
        </span>
      </a>

      <nav class="nav-links" aria-label="Primary Portfolio Navigation" id="desktop-nav">
        <a href="./index.html#projects" class="nav-link">Selected work</a>
        <a href="#journey" class="nav-link" data-section-link="journey">Journey</a>
        <a href="#experience" class="nav-link" data-section-link="experience">Leadership</a>
        <a href="#about" class="nav-link" data-section-link="about">About</a>
      </nav>
      <div class="header-actions">
        <a href="#contact" class="header-contact" data-section-link="contact">Let's connect <span aria-hidden="true">↗</span></a>
        <button type="button" class="menu-toggle" id="menu-toggle" hidden aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation menu"><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="page-progress" aria-hidden="true"><span id="page-progress-bar"></span></div>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile Navigation" hidden>
    <div class="mobile-menu-head"><span>PORTFOLIO INDEX</span><span>MENU</span></div>
    <a href="#projects" data-mobile-link data-section-link="projects"><span class="menu-index">01</span> Selected work <span aria-hidden="true">↗</span></a>
    <a href="#journey" data-mobile-link data-section-link="journey"><span class="menu-index">02</span> My journey <span aria-hidden="true">↗</span></a>
    <a href="#experience" data-mobile-link data-section-link="experience"><span class="menu-index">03</span> Experience <span aria-hidden="true">↗</span></a>
    <a href="#about" data-mobile-link data-section-link="about"><span class="menu-index">04</span> About me <span aria-hidden="true">↗</span></a>
    <a href="#mindmap" data-mobile-link data-section-link="mindmap"><span class="menu-index">05</span> Engineering mind <span aria-hidden="true">↗</span></a>
    <a href="#contact" data-mobile-link data-section-link="contact"><span class="menu-index">06</span> Let's connect <span aria-hidden="true">↗</span></a>
    <div class="mobile-menu-footer">AKANDWANAHO IVAN ALVIN · KAMPALA, UGANDA</div>
  </nav>

  <main id="main-content" role="main" tabindex="-1">
    <section id="hero" class="archive-intro" aria-labelledby="archive-title">
      <div class="container">
        <a href="./index.html">← Back to the portfolio</a>
        <p class="section-eyebrow">AKANDWANAHO IVAN ALVIN</p>
        <h1 id="archive-title" class="section-title">Engineering archive</h1>
        <p class="section-subtitle">Browse ${summary.totalProjects} public systems, from AI tooling and cybersecurity to financial and cloud infrastructure.</p>
        <nav aria-label="Archive contents">
          <a href="#project-index">Project index</a>
          <a href="#journey">Career journey</a>
          <a href="#mindmap">Knowledge map</a>
          <a href="#benchmarks-matrix">Benchmarks</a>
        </nav>
      </div>
    </section>

    <!-- EXPERIENCE 03 — INTERACTIVE PROJECT UNIVERSE -->
    <section id="projects" class="section" aria-labelledby="explorer-heading">
      <div id="flagship-explorer" class="container">
        <div class="section-header">
          <div>
            <h2 id="explorer-heading" class="section-title">Public systems</h2>
            <p class="section-subtitle">Search by technology or filter by engineering domain.</p>
          </div>
        </div>

        <div class="project-list-heading" id="project-index"><h3>Engineering project index</h3><p class="project-results" id="projects-results-count" role="status">${summary.totalProjects} projects</p></div>
        <div class="explorer-controls" hidden role="region" aria-label="Filter and search flagship systems">
          <div class="domain-tabs" role="group" aria-label="Filter by engineering domain">
            ${domainTabsHtml}
          </div>

          <div class="search-box">
            <span class="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              id="project-search"
              class="search-input"
              placeholder="Search projects, tools, technologies..."
              aria-label="Search flagship systems"
            />
          </div>
        </div>

        <div id="projects-grid" class="archive-projects">
          ${cardsHtml}
          <div class="empty-filter-state" id="project-empty" hidden>
            <p>No projects match those filters.</p>
            <button type="button" id="reset-filters-btn" class="btn-secondary">Reset filters</button>
          </div>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE 02 — MY JOURNEY (INTERACTIVE CAREER DOCUMENTARY) -->
    <section id="journey" class="section" aria-labelledby="journey-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">03 / MY JOURNEY</span>
            <h2 id="journey-heading" class="section-title">One system at a time. One chapter at a time.</h2>
            <p class="section-subtitle">
              From engineering foundations at ISBAT University and founding 4codex Technologies to leading engineering at Waanverse Labs (until March 2025), founding Codesphere Innovations (U) Limited, leading Funa Gigs under Jaminsa Ventures Limited, and architecting open-source AI and cybersecurity systems.
            </p>
          </div>

          <div class="journey-nav-controls" aria-label="Chapter progression controls">
            <button type="button" id="journey-prev-btn" class="btn" disabled>← Previous Chapter</button>
            <button type="button" id="journey-next-btn" class="btn btn-primary">Next Chapter →</button>
          </div>
        </div>

        <div class="journey-progress-track" aria-hidden="true">
          <div id="journey-progress-fill" class="journey-progress-fill" style="width: 17%"></div>
        </div>

        <div class="journey-tabs-bar" role="tablist" aria-label="Career journey chapters">
          ${journeyTabsHtml}
        </div>

        <div class="journey-panels-stage">
          ${journeyPanelsHtml}
        </div>
      </div>
    </section>

    <section id="experience" class="section" aria-labelledby="experience-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">EXECUTIVE &amp; FOUNDER ROLES</span>
            <h2 id="experience-heading" class="section-title">From writing code to leading teams.</h2>
            <p class="section-subtitle">
              Current leadership across Codesphere Innovations (U) Limited and Funa Gigs (Jaminsa Ventures Limited), alongside prior executive engineering roles.
            </p>
          </div>
        </div>

        <div class="experience-grid">
          ${experienceCardsHtml}
        </div>
      </div>
    </section>

    <!-- EXPERIENCE 04 — EXPLORE MY ENGINEERING MIND (KNOWLEDGE MAP) -->
    <section id="mindmap" class="section" aria-labelledby="mindmap-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">04 / EXPLORING IDEAS</span>
            <h2 id="mindmap-heading" class="section-title">How I think in systems.</h2>
            <p class="section-subtitle">
              Select any node in the constellation — AI Systems, Backend Architecture, Cybersecurity, Databases, Flutter, Cloud Infrastructure, Distributed Systems, or DevOps — to inspect the exact repositories and commercial systems that prove that capability.
            </p>
          </div>

          <div>
            <button type="button" id="kmap-view-toggle" class="btn" aria-pressed="false">
              Switch to Non-Animated Matrix View
            </button>
          </div>
        </div>

        <div class="kmap-pills-bar" role="group" aria-label="Select engineering specialty node">
          ${kmapPillsHtml}
        </div>

        <div id="kmap-visual-container" class="kmap-interactive-layout">
          <div id="kmap-canvas-wrap" class="kmap-canvas-card">
            ${initialKmapSvg}
          </div>
          <div id="kmap-detail-wrap" class="kmap-inspector-panel" aria-live="polite">
            ${initialKmapDetailHtml}
          </div>
        </div>

        <div id="kmap-accessible-list" class="kmap-accessible-matrix" hidden>
          ${accessibleKmapMatrixHtml}
        </div>
      </div>
    </section>

    <!-- EXPERIENCE 05 — CONTROLLED ENGINEERING TERMINAL -->
    <section id="terminal" class="section" aria-labelledby="terminal-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">05 / EXPERIMENTAL SPACE</span>
            <h2 id="terminal-heading" class="section-title">A different way to explore.</h2>
            <p class="section-subtitle">
              Inspect my biography, career chapters, open-source repositories, technical specialties, and contact channels using keyboard commands or one-click command chips.
            </p>
          </div>
        </div>

        <div class="terminal-window" role="region" aria-label="Controlled Portfolio Terminal">
          <div class="terminal-topbar">
            <div class="terminal-dots" aria-hidden="true">
              <span class="scene-dot dot-cyan"></span>
              <span class="scene-dot dot-blue"></span>
              <span class="scene-dot dot-gold"></span>
            </div>
            <div class="terminal-title-bar">alvin@codesphere-uganda: ~/builders-journey (sandboxed — read-only)</div>
          </div>

          <div class="terminal-chips-bar" aria-label="Quick terminal commands">
            <span class="term-chip-label">Quick Execute:</span>
            ${terminalChipsHtml}
          </div>

          <div id="terminal-output" class="terminal-output" role="log" aria-label="Terminal output" aria-live="polite" tabindex="0">
            <div class="term-entry status-ok">
              <div class="term-prompt-echo"><span class="term-user">alvin@codesphere-uganda:~$</span> <code>help</code></div>
              <div class="term-res-title">${escapeHtml(initialHelp.title)}</div>
              <div class="term-res-body">${initialHelpLines}</div>
            </div>
          </div>

          <form id="terminal-form" class="terminal-input-row" autocomplete="off">
            <label for="terminal-input" class="term-prompt-label">alvin@codesphere-uganda:~$</label>
            <input
              type="text"
              id="terminal-input"
              class="terminal-input"
              placeholder="Type a command (help, about, journey, projects, skills, github, contact, clear)..."
              aria-label="Terminal command input"
            />
            <button type="submit" class="btn btn-primary">Run ↵</button>
          </form>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE 06 — PERSONAL ENGINEERING PHILOSOPHY -->
    <section id="philosophy" class="section" aria-labelledby="philosophy-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">EXPERIENCE 06 // ARCHITECTURAL CONVICTIONS</span>
            <h2 id="philosophy-heading" class="section-title">Personal Engineering Philosophy</h2>
            <p class="section-subtitle">
              Five principles that govern how I design software systems, lead engineering teams, and build products for emerging and global markets.
            </p>
          </div>
        </div>

        <div class="philosophy-grid">
          ${philosophyCardsHtml}
        </div>
      </div>
    </section>

    <!-- ABOUT, EDUCATION & EXECUTIVE LEADERSHIP -->
    <section id="about" class="section" aria-labelledby="about-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">BIOGRAPHY &amp; ACADEMIC FOUNDATION</span>
            <h2 id="about-heading" class="section-title">The person behind the code.</h2>
            <p class="section-subtitle">
              Engineering leadership, technology entrepreneurship, and systems architecture from Kampala, Uganda to the global stage.
            </p>
          </div>
        </div>

        <div class="about-grid">
          <div class="about-narrative-card">
            ${aboutParagraphsHtml}
          </div>

          <div class="education-sidebar-stack">
            <div class="education-card">
              <span class="badge badge-gold">Academic &amp; Technical Foundation</span>
              <h3 class="education-institution">${escapeHtml(profile.education.institution)} — Uganda</h3>
              <p class="education-location">📍 ${escapeHtml(profile.education.location)}</p>
              <p class="education-summary">${escapeHtml(profile.education.summary)}</p>
            </div>

            <div class="telemetry-card">
              <span class="badge">Verified Organizational &amp; Profile Links</span>
              <ul class="verified-links-list">
                <li><strong>Company:</strong> <a href="${escapeHtml(profile.companyWebsiteUrl)}" target="_blank" rel="noopener noreferrer">Codesphere Innovations (U) Limited (codesphereug.com)</a></li>
                <li><strong>Marketplace Venture:</strong> Funa Gigs (<em>Jaminsa Ventures Limited</em> — separate entity)</li>
                <li><strong>Former Executive Role:</strong> CTO &amp; Head of Engineering, Waanverse Labs Inc. (Departed March 2025)</li>
                <li><strong>LinkedIn:</strong> <a href="${escapeHtml(profile.linkedinUrl)}" target="_blank" rel="noopener noreferrer">linkedin.com/in/the4codex</a></li>
                <li><strong>GitHub:</strong> <a href="${escapeHtml(profile.githubUrl)}" target="_blank" rel="noopener noreferrer">github.com/codesphere-u</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BROADER PRODUCT & COMMERCIAL ENGINEERING ARCHIVE -->
    <section id="broader-archive" class="section" aria-labelledby="archive-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">COMMERCIAL &amp; SECTOR SYSTEMS</span>
            <h2 id="archive-heading" class="section-title">Beyond the open source.</h2>
            <p class="section-subtitle">
              Commercial platforms, marketplace products, payment infrastructure, and sector-specific operational systems engineered across Uganda and beyond (distinct from public open-source repositories).
            </p>
          </div>
        </div>

        <p><a class="btn btn-primary" href="./cases/funa-gigs.html">Read the Funa Gigs case study →</a></p>
        <div class="projects-grid">
          ${broaderCardsHtml}
        </div>
      </div>
    </section>

    <!-- VERIFIED ENGINEERING BENCHMARKS MATRIX -->
    <section id="benchmarks-matrix" class="section" aria-labelledby="benchmarks-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">REPRODUCIBLE TELEMETRY</span>
            <h2 id="benchmarks-heading" class="section-title">Under the hood.</h2>
            <p class="section-subtitle">
              Measurements and test counts reported by the linked repositories. Each result reflects its own workload and test environment. See the case studies for verification commands.
            </p>
          </div>

          <div class="benchmark-controls" role="group" aria-label="Sort benchmarks table">
            <button type="button" class="btn is-active" data-sort-benchmarks="tests-desc" aria-pressed="true">
              Sort by Test Count
            </button>
            <button type="button" class="btn" data-sort-benchmarks="latency-asc" aria-pressed="false">
              Sort by Fastest Latency
            </button>
            <button type="button" class="btn" data-sort-benchmarks="name-asc" aria-pressed="false">
              Sort Alphabetically
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="benchmark-table">
            <thead>
              <tr>
                <th scope="col">System &amp; Repository</th>
                <th scope="col">Primary Domain</th>
                <th scope="col">Automated Tests</th>
                <th scope="col">Measured Latency</th>
                <th scope="col">Throughput / Accuracy</th>
                <th scope="col">Key Determinism &amp; Safety Invariant</th>
              </tr>
            </thead>
            <tbody id="benchmark-tbody">
              ${benchmarkRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- CONTACT & COLLABORATION -->
    <section id="contact" class="section" aria-labelledby="contact-heading">
      <div class="container">
        <div class="contact-banner-card">
          <div>
            <span class="section-eyebrow">COLLABORATION &amp; TECHNICAL LEADERSHIP</span>
            <h2 id="contact-heading" class="section-title">Have something ambitious in mind?</h2>
            <p class="section-subtitle">
              ${escapeHtml(profile.availability)}
            </p>
          </div>
          <div class="contact-cta-group">
            <a href="${escapeHtml(profile.companyWebsiteUrl)}" class="btn btn-gold" target="_blank" rel="noopener noreferrer">
              Codesphere Innovations (codesphereug.com) ↗
            </a>
            <a href="${escapeHtml(profile.linkedinUrl)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn (in/the4codex) ↗
            </a>
            <a href="${escapeHtml(profile.githubUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
              GitHub (@codesphere-u) ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <a class="back-to-top" id="back-to-top" hidden href="#hero" aria-label="Back to top">↑ <span>TOP</span></a>

  <!-- Interactive Case Study & ADR Deep-Dive Drawer -->
  <dialog
    id="adr-drawer"
    class="drawer-panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="drawer-title"
  >
    <div class="drawer-sticky-bar">
      <span class="drawer-bar-label">ENGINEERING CASE STUDY &amp; ARCHITECTURE BLUEPRINT</span>
      <button type="button" id="adr-drawer-close" class="btn-drawer-close" aria-label="Close case study drawer">
        ✕ Close (Esc)
      </button>
    </div>
    <div id="adr-drawer-body">
    </div>
  </dialog>

  <footer class="site-footer" role="contentinfo">
    <div class="container footer-inner">
      <div>
        <strong>${escapeHtml(profile.name)}</strong> · ${escapeHtml(profile.subtitle)} · ${escapeHtml(profile.location)}
      </div>
      <div class="footer-links">
        <a href="${escapeHtml(profile.companyWebsiteUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">Codesphere Innovations (codesphereug.com)</a>
        <a href="${escapeHtml(profile.linkedinUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="${escapeHtml(profile.githubUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">GitHub (@codesphere-u)</a>
        <a href="${escapeHtml(profile.portfolioRepoUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">Portfolio Source</a>
        <a href="${escapeHtml(profile.liveDemoUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">Cyber Dragon Live Demo</a>
      </div>
    </div>
  </footer>

  <script type="module" src="./src/ui/app.mjs"></script>
  <script type="module" src="./src/ui/navigation.mjs"></script>
</body>
</html>`;

  return html.replace(/[ \t]+$/gm, '');
}

export function generateCaseStudyHtml(project) {
  const title = escapeHtml(project.name);
  const description = escapeHtml(project.tagline);
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Akandwanaho Ivan Alvin</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title} | Engineering case study" />
  <meta property="og:description" content="${description}" />
  <link rel="stylesheet" href="../src/ui/styles.css" />
  <link rel="stylesheet" href="../src/ui/editorial.css" />
  <link rel="stylesheet" href="../src/ui/polish.css" />
</head>
<body class="case-page">
  <a href="#case-content" class="skip-link">Skip to case study</a>
  <header class="case-header"><div class="container">
    <a href="../archive.html#project-index">← Project index</a>
    <a href="../index.html">Akandwanaho Ivan Alvin</a>
  </div></header>
  <main class="container case-content" id="case-content" tabindex="-1">
    <p class="section-eyebrow">CASE STUDY / ${escapeHtml(project.primaryDomain)}</p>
    ${renderDrawerContentHtml(project, { standalone: true })}
  </main>
</body>
</html>`;
}

function copyDirectoryRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { html, elapsedMs, summary } = generatePortfolioHtml();

  fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html, 'utf8');

  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'archive.html'), generateArchiveHtml());
  copyDirectoryRecursive(path.join(ROOT_DIR, 'src'), path.join(DIST_DIR, 'src'));
  const casesDir = path.join(DIST_DIR, 'cases');
  fs.mkdirSync(casesDir, { recursive: true });
  fs.writeFileSync(path.join(casesDir, 'funa-gigs.html'), renderFunaCaseStudy());
  for (const project of PORTFOLIO_DATA.projects) {
    fs.writeFileSync(path.join(casesDir, project.id + '.html'), generateCaseStudyHtml(project));
  }

  console.log(
    `[build] Built codesphere-portfolio v2.0 ("THE BUILDER'S JOURNEY") for ${PORTFOLIO_DATA.profile.name} (${summary.totalProjects} open-source systems, ${summary.totalJourneyStages} journey chapters, ${summary.totalKnowledgeNodes} knowledge nodes, ${summary.totalAutomatedTests} verified tests/suites) in ${elapsedMs} ms -> index.html & dist/`
  );
}
