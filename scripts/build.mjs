import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';
import {
  computePortfolioSummary,
  sortBenchmarks,
  validatePortfolioIntegrity
} from '../src/core/explorer.mjs';
import {
  renderProjectCardHtml,
  renderExperienceCardHtml,
  renderJourneyStageHtml,
  renderBroaderProjectCardHtml,
  renderBenchmarkRowsHtml,
  renderDrawerContentHtml
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
    projects,
    broaderProjects,
    benchmarks
  } = PORTFOLIO_DATA;

  const domainTabsHtml = domains
    .map((domain) => {
      const pressed = domain === 'All' ? 'true' : 'false';
      const count = summary.domainCounts[domain] ?? 0;
      return `
        <button type="button" class="domain-tab" data-domain="${escapeHtml(domain)}" aria-pressed="${pressed}">
          <span>${escapeHtml(domain)}</span>
          <span class="domain-count">(${count})</span>
        </button>`;
    })
    .join('');

  const aboutParagraphsHtml = profile.aboutParagraphs
    .map((p) => `<p class="about-paragraph">${escapeHtml(p)}</p>`)
    .join('\n');

  const experienceCardsHtml = experience.map(renderExperienceCardHtml).join('\n');
  const journeyStagesHtml = journey.map(renderJourneyStageHtml).join('\n');
  const cardsHtml = projects.map(renderProjectCardHtml).join('\n');
  const broaderCardsHtml = broaderProjects.map(renderBroaderProjectCardHtml).join('\n');
  const sortedBenchmarks = sortBenchmarks(benchmarks, 'tests-desc');
  const benchmarkRowsHtml = renderBenchmarkRowsHtml(sortedBenchmarks, summary);
  const initialDrawerHtml = renderDrawerContentHtml(projects[0]);

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(profile.name)} (${escapeHtml(profile.shortName)}) | ${escapeHtml(profile.headline)}</title>
  <meta name="description" content="${escapeHtml(profile.name)} — ${escapeHtml(profile.subtitle)}. ${escapeHtml(profile.tagline)}" />
  <meta name="author" content="${escapeHtml(profile.name)} (Kampala, Uganda)" />

  <!-- OpenGraph / Social Metadata -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(profile.name)} — ${escapeHtml(profile.subtitle)}" />
  <meta property="og:description" content="${escapeHtml(profile.headline)} — ${summary.totalAutomatedTests}+ automated tests across ${summary.totalProjects} open-source systems &amp; commercial platforms." />
  <meta property="og:url" content="${escapeHtml(profile.portfolioRepoUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(profile.name)} — Executive Engineering Portfolio" />
  <meta name="twitter:description" content="${escapeHtml(profile.tagline)}" />

  <link rel="stylesheet" href="./src/ui/styles.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="#" class="brand-link" aria-label="Akandwanaho Ivan Alvin Engineering Portfolio Home">
        <span class="brand-mark">AIA</span>
        <span>${escapeHtml(profile.name)}</span>
      </a>

      <nav class="nav-links" aria-label="Primary Portfolio Navigation">
        <a href="#about" class="nav-link">About &amp; Education</a>
        <a href="#experience" class="nav-link">Leadership &amp; Experience</a>
        <a href="#journey" class="nav-link">7-Stage Journey</a>
        <a href="#flagship-explorer" class="nav-link">Open-Source Flagships (${summary.totalProjects})</a>
        <a href="#broader-archive" class="nav-link">Product Archive (${summary.totalBroaderProjects})</a>
        <a href="#benchmarks-matrix" class="nav-link">Benchmarks (${summary.totalAutomatedTests}+ Tests)</a>
        <a href="${escapeHtml(profile.companyWebsiteUrl)}" class="btn btn-gold" target="_blank" rel="noopener noreferrer">
          codesphereug.com ↗
        </a>
        <a href="${escapeHtml(profile.githubUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
          GitHub @codesphere-u ↗
        </a>
        <button type="button" id="theme-toggle" class="btn" aria-label="Toggle color theme">
          ☀ Light Mode
        </button>
      </nav>
    </div>
  </header>

  <main id="main-content" role="main">
    <!-- Hero & Executive Positioning -->
    <section class="hero-section" aria-labelledby="hero-heading">
      <div class="container">
        <div class="hero-eyebrow">
          <span class="status-dot" aria-hidden="true"></span>
          <span>📍 ${escapeHtml(profile.location)}</span>
        </div>

        <h1 id="hero-heading" class="hero-name">
          ${escapeHtml(profile.name)} <span style="font-weight: 500; color: var(--text-secondary); font-size: 0.62em;">(“${escapeHtml(profile.shortName)}”)</span>
        </h1>

        <p class="hero-subtitle-role">
          ${escapeHtml(profile.subtitle)}
        </p>

        <h2 class="hero-title">
          ${escapeHtml(profile.headline)}
        </h2>

        <p class="hero-tagline">
          “${escapeHtml(profile.tagline)}”
        </p>

        <p class="hero-mission">
          ${escapeHtml(profile.missionStatement)}
        </p>

        <div class="hero-meta-row">
          <a href="#flagship-explorer" class="btn btn-primary">Explore Flagship Systems</a>
          <a href="${escapeHtml(profile.companyWebsiteUrl)}" class="btn btn-gold" target="_blank" rel="noopener noreferrer">
            Codesphere Innovations (codesphereug.com) ↗
          </a>
          <a href="${escapeHtml(profile.linkedinUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
            LinkedIn (in/the4codex) ↗
          </a>
          <a href="${escapeHtml(profile.githubUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
            GitHub (@codesphere-u) ↗
          </a>
          <a href="${escapeHtml(profile.liveDemoUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
            Cyber Dragon Live Demo ↗
          </a>
        </div>

        <div class="telemetry-grid" aria-label="Verified Portfolio Aggregates">
          <div class="telemetry-card">
            <div class="telemetry-value">${summary.primaryFlagshipsCount} Flagships</div>
            <div class="telemetry-label">+ 2 Specialized Open-Source Platforms (${summary.totalProjects} Total)</div>
          </div>
          <div class="telemetry-card">
            <div class="telemetry-value">${summary.totalAutomatedTests}+</div>
            <div class="telemetry-label">Automated Tests Passing Across Repos</div>
          </div>
          <div class="telemetry-card">
            <div class="telemetry-value">0.05–0.42 ms</div>
            <div class="telemetry-label">Core Engine P50 / Mean Latencies</div>
          </div>
          <div class="telemetry-card">
            <div class="telemetry-value">${summary.totalAdrs} ADRs</div>
            <div class="telemetry-label">Documented Architectural Trade-Offs</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Long-Form About Me & Education Section -->
    <section id="about" class="section" aria-labelledby="about-heading">
      <div class="container">
        <div class="section-header">
          <div>
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
              <h3 class="education-institution">${escapeHtml(profile.education.institution)}</h3>
              <p style="font-size: 0.84rem; color: var(--accent-primary); font-family: var(--font-mono); margin: 0 0 10px;">
                📍 ${escapeHtml(profile.education.location)}
              </p>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">
                ${escapeHtml(profile.education.summary)}
              </p>
            </div>

            <div class="telemetry-card">
              <span class="badge">Principal Verified Profiles</span>
              <ul class="experience-highlights" style="margin-top: 12px;">
                <li><strong>Company:</strong> <a href="${escapeHtml(profile.companyWebsiteUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary);">Codesphere Innovations (U) Limited (codesphereug.com)</a></li>
                <li><strong>Product Venture:</strong> Funa Gigs (<em>Jaminsa Ventures Limited</em>)</li>
                <li><strong>LinkedIn:</strong> <a href="${escapeHtml(profile.linkedinUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary);">linkedin.com/in/the4codex</a></li>
                <li><strong>GitHub:</strong> <a href="${escapeHtml(profile.githubUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary);">github.com/codesphere-u</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Professional Experience & Leadership Section -->
    <section id="experience" class="section" aria-labelledby="experience-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 id="experience-heading" class="section-title">Executive Leadership &amp; Career Experience</h2>
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

    <!-- 7-Stage Thematic Engineering Journey Section -->
    <section id="journey" class="section" aria-labelledby="journey-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 id="journey-heading" class="section-title">Thematic Engineering Journey</h2>
            <p class="section-subtitle">
              Seven stages of technical growth — from foundational business systems and ISBAT University studies to executive leadership, marketplace engineering, and open-source AI/security platforms.
            </p>
          </div>
        </div>

        <div class="journey-grid">
          ${journeyStagesHtml}
        </div>
      </div>
    </section>

    <!-- Interactive Flagship Systems Explorer -->
    <section id="flagship-explorer" class="section" aria-labelledby="explorer-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 id="explorer-heading" class="section-title">Interactive Flagship Systems Explorer</h2>
            <p class="section-subtitle" id="projects-visible-count">
              Showing ${projects.length} of ${projects.length} verified open-source systems (${summary.primaryFlagshipsCount} Primary Flagships + 2 Domain Platforms) — click any system to inspect its Architecture Blueprint &amp; ADRs.
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

    <!-- Broader Product & Commercial Engineering Archive -->
    <section id="broader-archive" class="section" aria-labelledby="archive-heading">
      <div class="container">
        <div class="section-header">
          <div>
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

    <!-- Verified Engineering Benchmarks Matrix -->
    <section id="benchmarks-matrix" class="section" aria-labelledby="benchmarks-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 id="benchmarks-heading" class="section-title">Verified Engineering Benchmarks Matrix</h2>
            <p class="section-subtitle">
              Real measured latencies, throughput, determinism guarantees, and automated test counts across all open-source repositories (${summary.totalAutomatedTests} automated tests passing).
            </p>
          </div>

          <div class="benchmark-controls" role="toolbar" aria-label="Sort benchmarks table">
            <button type="button" class="btn js-sort-benchmarks" data-sort="tests-desc" aria-pressed="true">
              Sort by Test Count
            </button>
            <button type="button" class="btn js-sort-benchmarks" data-sort="latency-asc" aria-pressed="false">
              Sort by Fastest Latency
            </button>
            <button type="button" class="btn js-sort-benchmarks" data-sort="name-asc" aria-pressed="false">
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
                <th scope="col">Deep-Dive</th>
              </tr>
            </thead>
            <tbody id="benchmark-tbody">
              ${benchmarkRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Architectural Trade-Off Highlights -->
    <section id="architecture-principles" class="section" aria-labelledby="principles-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 id="principles-heading" class="section-title">Signature Architectural Decisions &amp; Engineering Rigor</h2>
            <p class="section-subtitle">
              Why every repository prioritizes deterministic invariants, threat modeling, and reproducible benchmarks over fragile black-box wrappers.
            </p>
          </div>
        </div>

        <div class="projects-grid">
          <article class="telemetry-card">
            <h3 style="margin-top: 0; font-size: 1.05rem;">Why Cyber Dragon Refuses to Fetch URLs</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
              URL scanners that perform outbound HTTP fetches become SSRF proxies and trigger attacker tracking beacons. Cyber Dragon scores phishing domains, IDN homographs, and predatory USSD strings (<code>*165#</code>, <code>*185#</code>, <code>*334#</code>) 100% lexically in <strong>0.28 ms</strong> with zero network egress.
            </p>
          </article>

          <article class="telemetry-card">
            <h3 style="margin-top: 0; font-size: 1.05rem;">Why FlowLedger Bans IEEE-754 Floats</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
              Floating-point arithmetic silently drops cents and shillings during fee splits. FlowLedger enforces <code>bigint</code> minor-unit double-entry postings across UGX, KES, and USD with SHA-256 hash-chained journal entries (97 entries verified with 0 imbalance).
            </p>
          </article>

          <article class="telemetry-card">
            <h3 style="margin-top: 0; font-size: 1.05rem;">Why Auralis Binds Only to 127.0.0.1 with Single-Use Tokens</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
              Local AI workspaces that bind to <code>0.0.0.0</code> expose developer filesystems to LAN and DNS-rebinding attacks. Auralis enforces strict loopback binding, symlink-safe <code>realpath</code> jails, and single-use HMAC approval tokens while indexing at 3,110 docs/sec.
            </p>
          </article>
        </div>
      </div>
    </section>
  </main>

  <!-- Interactive Architecture & ADR Deep-Dive Drawer -->
  <aside
    id="architecture-drawer"
    class="drawer-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="drawer-title"
    hidden
  >
    <div id="architecture-drawer-panel" class="drawer-panel">
      ${initialDrawerHtml}
    </div>
  </aside>

  <footer class="site-footer" role="contentinfo">
    <div class="container footer-inner">
      <div>
        <strong>${escapeHtml(profile.name)}</strong> · ${escapeHtml(profile.subtitle)} · ${escapeHtml(profile.location)}
      </div>
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <a href="${escapeHtml(profile.companyWebsiteUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">Codesphere Innovations (codesphereug.com)</a>
        <a href="${escapeHtml(profile.linkedinUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="${escapeHtml(profile.githubUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">GitHub (@codesphere-u)</a>
        <a href="${escapeHtml(profile.portfolioRepoUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">Source Code</a>
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

  // Write root index.html for instant zero-config static serving
  fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html, 'utf8');

  // Write self-contained dist/ folder for Vercel/Netlify/GitHub Pages artifact publishing
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html, 'utf8');
  copyDirectoryRecursive(path.join(ROOT_DIR, 'src'), path.join(DIST_DIR, 'src'));

  console.log(
    `[build] Built codesphere-portfolio v1.1 for ${PORTFOLIO_DATA.profile.name} (${summary.totalProjects} open-source systems, ${summary.totalBroaderProjects} commercial archive entries, ${summary.totalAutomatedTests} verified tests) in ${elapsedMs} ms -> index.html & dist/`
  );
}
