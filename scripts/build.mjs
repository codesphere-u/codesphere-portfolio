import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';
import {
  computePortfolioSummary,
  sortBenchmarks,
  executeTerminalCommand,
  validatePortfolioIntegrity
} from '../src/core/explorer.mjs';
import {
  renderHeroArchitectureSceneSvg,
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

export function generatePortfolioHtml() {
  const startMs = performance.now();
  const integrity = validatePortfolioIntegrity(PORTFOLIO_DATA);
  if (!integrity.valid) {
    throw new Error(`Portfolio integrity check failed:\n${integrity.errors.join('\n')}`);
  }

  const summary = computePortfolioSummary(PORTFOLIO_DATA);
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

  // Experience 01: Hero specialties strip
  const heroSpecialtiesHtml = (profile.heroSpecialties || [])
    .map((spec) => `<span class="hero-specialty-item">${escapeHtml(spec)}</span>`)
    .join('<span class="hero-specialty-sep" aria-hidden="true">/</span>');

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
  const initialDrawerHtml = renderDrawerContentHtml(projects[0]);

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

  // Experience 06: Personal Engineering Philosophy
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
  <title>${escapeHtml(profile.name)} (${escapeHtml(profile.shortName)}) — ${escapeHtml(profile.heroEditorialHeadline)} | The Builder's Journey</title>
  <meta name="description" content="${escapeHtml(profile.name)} — ${escapeHtml(profile.subtitle)}. ${escapeHtml(profile.tagline)}" />
  <meta name="author" content="${escapeHtml(profile.name)} (Kampala, Uganda)" />

  <!-- OpenGraph / Social Metadata -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(profile.name)} — ${escapeHtml(profile.heroEditorialHeadline)}" />
  <meta property="og:description" content="${escapeHtml(profile.headline)} — ${summary.totalAutomatedTests} verified automated tests across ${summary.totalProjects} open-source systems &amp; commercial platforms." />
  <meta property="og:url" content="${escapeHtml(profile.portfolioRepoUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(profile.name)} — The Builder's Journey" />
  <meta name="twitter:description" content="${escapeHtml(profile.tagline)}" />

  <!-- Editorial & Technical Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;600;700&amp;family=Space+Grotesk:wght@600;700;800&amp;display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="./src/ui/styles.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="#hero" class="brand-link" aria-label="Akandwanaho Ivan Alvin Engineering Portfolio Home">
        <span class="brand-mark">AIA</span>
        <span class="brand-text-wrap">
          <span class="brand-name">${escapeHtml(profile.name)}</span>
          <span class="brand-sub">THE BUILDER’S JOURNEY</span>
        </span>
      </a>

      <nav class="nav-links" aria-label="Primary Portfolio Navigation">
        <a href="#journey" class="nav-link">01. Journey</a>
        <a href="#projects" class="nav-link">02. Project Universe (${summary.totalProjects})</a>
        <a href="#mindmap" class="nav-link">03. Engineering Mind</a>
        <a href="#terminal" class="nav-link">04. Terminal</a>
        <a href="#philosophy" class="nav-link">05. Philosophy</a>
        <a href="#experience" class="nav-link">Leadership</a>
        <a href="#benchmarks-matrix" class="nav-link">Benchmarks</a>
        <a href="${escapeHtml(profile.companyWebsiteUrl)}" class="btn btn-gold" target="_blank" rel="noopener noreferrer">
          codesphereug.com ↗
        </a>
        <button type="button" id="theme-toggle" class="btn" aria-label="Switch to light theme">
          <span aria-hidden="true">◐</span>
          <span class="theme-label">Light Mode</span>
        </button>
      </nav>
    </div>
  </header>

  <main id="main-content" role="main">
    <!-- EXPERIENCE 01 — CINEMATIC OPENING -->
    <section id="hero" class="hero-section" aria-labelledby="hero-heading">
      <div class="container">
        <div class="hero-cinema-grid">
          <div class="hero-editorial-col">
            <div class="hero-eyebrow">
              <span class="status-dot" aria-hidden="true"></span>
              <span>EXPERIENCE 01 // INTERACTIVE TECHNOLOGY DOCUMENTARY · ${escapeHtml(profile.location)}</span>
            </div>

            <p class="hero-kicker-name">${escapeHtml(profile.displayNameUpper)}</p>

            <h1 id="hero-heading" class="hero-editorial-headline">
              ${escapeHtml(profile.heroEditorialHeadline)}
            </h1>

            <div class="hero-specialties-ribbon" aria-label="Core engineering specialties">
              ${heroSpecialtiesHtml}
            </div>

            <p class="hero-subtitle-role">
              ${escapeHtml(profile.subtitle)} · Founder &amp; Project Lead, Funa Gigs (Jaminsa Ventures Limited)
            </p>

            <p class="hero-tagline">
              “${escapeHtml(profile.tagline)}”
            </p>

            <p class="hero-mission">
              ${escapeHtml(profile.missionStatement)}
            </p>

            <div class="hero-cta-row">
              <a href="#journey" class="btn btn-primary btn-cta-hero">
                <span>Explore My Journey</span>
                <span aria-hidden="true">↓</span>
              </a>
              <a href="#projects" class="btn btn-secondary">
                Inspect Flagship Systems (${summary.totalProjects})
              </a>
              <a href="${escapeHtml(profile.companyWebsiteUrl)}" class="btn btn-gold" target="_blank" rel="noopener noreferrer">
                Codesphere Innovations ↗
              </a>
              <a href="${escapeHtml(profile.githubUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
                GitHub @codesphere-u ↗
              </a>
              <a href="${escapeHtml(profile.liveDemoUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
                Cyber Dragon Live ↗
              </a>
            </div>
          </div>

          <div class="hero-scene-col" aria-label="Interactive Systems Architecture Visualization">
            <div class="hero-scene-card">
              <div class="hero-scene-top-bar">
                <span class="scene-dot dot-cyan"></span>
                <span class="scene-dot dot-blue"></span>
                <span class="scene-dot dot-gold"></span>
                <span class="scene-top-label">SYS_TOPOLOGY // KAMPALA → GLOBAL</span>
              </div>
              ${renderHeroArchitectureSceneSvg()}
              <div class="hero-scene-caption">
                <span>6 Interactive Chapters</span>
                <span>·</span>
                <span>8 Verified Repos</span>
                <span>·</span>
                <span>${summary.totalAutomatedTests} Automated Tests</span>
              </div>
            </div>
          </div>
        </div>

        <div class="telemetry-grid" aria-label="Verified Portfolio Aggregates">
          <div class="telemetry-card">
            <div class="telemetry-value">${summary.primaryFlagshipsCount} Flagships</div>
            <div class="telemetry-label">+ 2 Specialized Domain Platforms (${summary.totalProjects} Verified Repos)</div>
          </div>
          <div class="telemetry-card">
            <div class="telemetry-value">${summary.totalAutomatedTests}</div>
            <div class="telemetry-label">Automated Tests &amp; Verification Suites Passing</div>
          </div>
          <div class="telemetry-card">
            <div class="telemetry-value">0.05–0.42 ms</div>
            <div class="telemetry-label">Measured Core Engine P50 / Mean Latencies</div>
          </div>
          <div class="telemetry-card">
            <div class="telemetry-value">${summary.totalAdrs} ADRs</div>
            <div class="telemetry-label">Documented Architectural Trade-Off Decisions</div>
          </div>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE 02 — MY JOURNEY (INTERACTIVE CAREER DOCUMENTARY) -->
    <section id="journey" class="section" aria-labelledby="journey-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">EXPERIENCE 02 // CAREER STORYTELLING SYSTEM</span>
            <h2 id="journey-heading" class="section-title">The Builder’s Journey: Six Chapters of Evolution</h2>
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

    <!-- EXPERIENCE 03 — INTERACTIVE PROJECT UNIVERSE -->
    <section id="projects" class="section" aria-labelledby="explorer-heading">
      <div id="flagship-explorer" class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">EXPERIENCE 03 // INTERACTIVE PROJECT UNIVERSE</span>
            <h2 id="explorer-heading" class="section-title">Interactive Flagship Systems Explorer</h2>
            <p class="section-subtitle" id="projects-results-count">
              Showing ${projects.length} of ${projects.length} verified repositories — each card features a custom architectural motif and opens an in-depth Case Study Drawer with ADRs, diagrams, and reproducible CLI benchmarks.
            </p>
          </div>
        </div>

        <div class="explorer-controls" role="region" aria-label="Filter and search flagship systems">
          <div class="domain-tabs" role="toolbar" aria-label="Filter by engineering domain">
            ${domainTabsHtml}
          </div>

          <div class="search-box">
            <input
              type="search"
              id="project-search"
              class="search-input"
              placeholder="Search systems, ADRs, languages (press /)..."
              aria-label="Search flagship systems"
            />
          </div>
        </div>

        <div id="projects-grid" class="projects-grid">
          ${cardsHtml}
        </div>
      </div>
    </section>

    <!-- EXPERIENCE 04 — EXPLORE MY ENGINEERING MIND (KNOWLEDGE MAP) -->
    <section id="mindmap" class="section" aria-labelledby="mindmap-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">EXPERIENCE 04 // EXPLORE MY ENGINEERING MIND</span>
            <h2 id="mindmap-heading" class="section-title">Interactive Engineering Knowledge Map</h2>
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

        <div class="kmap-pills-bar" role="toolbar" aria-label="Select engineering specialty node">
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
            <span class="section-eyebrow">EXPERIENCE 05 // SANDBOXED COMMAND INTERFACE</span>
            <h2 id="terminal-heading" class="section-title">Interactive Engineering Terminal</h2>
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

          <div id="terminal-output" class="terminal-output" role="log" aria-live="polite">
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
            <h2 id="about-heading" class="section-title">About Akandwanaho Ivan Alvin &amp; Education</h2>
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

    <section id="experience" class="section" aria-labelledby="experience-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">EXECUTIVE &amp; FOUNDER ROLES</span>
            <h2 id="experience-heading" class="section-title">Leadership &amp; Professional Career History</h2>
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

    <!-- BROADER PRODUCT & COMMERCIAL ENGINEERING ARCHIVE -->
    <section id="broader-archive" class="section" aria-labelledby="archive-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">COMMERCIAL &amp; SECTOR SYSTEMS</span>
            <h2 id="archive-heading" class="section-title">Product &amp; Commercial Engineering Archive</h2>
            <p class="section-subtitle">
              Commercial platforms, marketplace products, payment infrastructure, and sector-specific operational systems engineered across Uganda and beyond (distinct from public open-source repositories).
            </p>
          </div>
        </div>

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
            <h2 id="benchmarks-heading" class="section-title">Verified Engineering Benchmarks Matrix</h2>
            <p class="section-subtitle">
              Real measured latencies, throughput, determinism guarantees, and automated test counts across all open-source repositories (${summary.totalAutomatedTests} verified tests/suites).
            </p>
          </div>

          <div class="benchmark-controls" role="toolbar" aria-label="Sort benchmarks table">
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
            <h2 id="contact-heading" class="section-title">Let’s Build What Comes Next</h2>
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

  <!-- Interactive Case Study & ADR Deep-Dive Drawer -->
  <div id="adr-drawer-backdrop" class="drawer-backdrop" aria-hidden="true"></div>
  <aside
    id="adr-drawer"
    class="drawer-panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="drawer-title"
    aria-hidden="true"
  >
    <div class="drawer-sticky-bar">
      <span class="drawer-bar-label">ENGINEERING CASE STUDY &amp; ARCHITECTURE BLUEPRINT</span>
      <button type="button" id="adr-drawer-close" class="btn-drawer-close" aria-label="Close case study drawer">
        ✕ Close (Esc)
      </button>
    </div>
    <div id="adr-drawer-body">
      ${initialDrawerHtml}
    </div>
  </aside>

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
</body>
</html>`;

  const elapsedMs = (performance.now() - startMs).toFixed(1);
  return { html, elapsedMs, summary };
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
  copyDirectoryRecursive(path.join(ROOT_DIR, 'src'), path.join(DIST_DIR, 'src'));

  console.log(
    `[build] Built codesphere-portfolio v2.0 ("THE BUILDER'S JOURNEY") for ${PORTFOLIO_DATA.profile.name} (${summary.totalProjects} open-source systems, ${summary.totalJourneyStages} journey chapters, ${summary.totalKnowledgeNodes} knowledge nodes, ${summary.totalAutomatedTests} verified tests/suites) in ${elapsedMs} ms -> index.html & dist/`
  );
}
