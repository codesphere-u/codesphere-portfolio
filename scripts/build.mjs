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
  const { profile, domains, projects, benchmarks } = PORTFOLIO_DATA;

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

  const cardsHtml = projects.map(renderProjectCardHtml).join('\n');
  const sortedBenchmarks = sortBenchmarks(benchmarks, 'tests-desc');
  const benchmarkRowsHtml = renderBenchmarkRowsHtml(sortedBenchmarks, summary);
  const initialDrawerHtml = renderDrawerContentHtml(projects[0]);

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Codesphere-u | ${escapeHtml(profile.headline)}</title>
  <meta name="description" content="${escapeHtml(profile.missionStatement)}" />
  <meta name="author" content="codesphere-u (Kampala, Uganda)" />

  <!-- OpenGraph / Social Metadata -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Codesphere-u — Interactive Engineering Portfolio &amp; Architecture Case Studies" />
  <meta property="og:description" content="${escapeHtml(profile.headline)} — ${summary.totalAutomatedTests}+ automated tests across 7 flagship systems." />
  <meta property="og:url" content="${escapeHtml(profile.portfolioRepoUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Codesphere-u — Staff Engineering Portfolio" />
  <meta name="twitter:description" content="${escapeHtml(profile.missionStatement)}" />

  <link rel="stylesheet" href="./src/ui/styles.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="#" class="brand-link" aria-label="Codesphere-u Engineering Portfolio Home">
        <span class="brand-mark">CS</span>
        <span>codesphere-u</span>
      </a>

      <nav class="nav-links" aria-label="Primary Portfolio Navigation">
        <a href="#flagship-explorer" class="nav-link">Flagship Systems (${summary.totalProjects})</a>
        <a href="#benchmarks-matrix" class="nav-link">Verified Benchmarks (${summary.totalAutomatedTests}+ Tests)</a>
        <a href="#architecture-principles" class="nav-link">ADR Principles</a>
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
    <!-- Hero & Positioning -->
    <section class="hero-section" aria-labelledby="hero-heading">
      <div class="container">
        <div class="hero-eyebrow">
          <span class="status-dot" aria-hidden="true"></span>
          <span>${escapeHtml(profile.location)}</span>
        </div>

        <h1 id="hero-heading" class="hero-title">
          ${escapeHtml(profile.headline)}
        </h1>

        <p class="hero-mission">
          ${escapeHtml(profile.missionStatement)}
        </p>

        <div class="hero-meta-row">
          <a href="#flagship-explorer" class="btn btn-primary">Explore 7 Flagship Systems</a>
          <a href="${escapeHtml(profile.githubUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
            GitHub Profile (github.com/codesphere-u) ↗
          </a>
          <span class="meta-pill">📍 Kampala, Uganda · Global Remote</span>
          <span class="meta-pill">✓ Zero Unverified Metrics</span>
        </div>

        <div class="telemetry-grid" aria-label="Verified Portfolio Aggregates">
          <div class="telemetry-card">
            <div class="telemetry-value">${summary.totalProjects}</div>
            <div class="telemetry-label">Production-Grade Flagship Systems</div>
          </div>
          <div class="telemetry-card">
            <div class="telemetry-value">${summary.totalAutomatedTests}+</div>
            <div class="telemetry-label">Automated Tests Passing in CI</div>
          </div>
          <div class="telemetry-card">
            <div class="telemetry-value">0.05–0.28 ms</div>
            <div class="telemetry-label">Core Engine P50 / Mean Latencies</div>
          </div>
          <div class="telemetry-card">
            <div class="telemetry-value">${summary.totalAdrs} ADRs</div>
            <div class="telemetry-label">Documented Architectural Trade-Offs</div>
          </div>
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
              Showing ${projects.length} of ${projects.length} verified flagship systems — click any system to inspect its Architecture Blueprint &amp; ADRs.
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

    <!-- Verified Engineering Benchmarks Matrix -->
    <section id="benchmarks-matrix" class="section" aria-labelledby="benchmarks-heading">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 id="benchmarks-heading" class="section-title">Verified Engineering Benchmarks Matrix</h2>
            <p class="section-subtitle">
              Real measured latencies, throughput, determinism guarantees, and automated test counts across all repositories (${summary.totalAutomatedTests} automated tests passing).
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
        <strong>codesphere-u</strong> · ${escapeHtml(profile.location)}
      </div>
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <a href="${escapeHtml(profile.githubUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
        <a href="${escapeHtml(profile.portfolioRepoUrl)}" class="nav-link" target="_blank" rel="noopener noreferrer">Source Code</a>
        <a href="https://cyber-dragon-ivory.vercel.app" class="nav-link" target="_blank" rel="noopener noreferrer">Cyber Dragon Live Demo</a>
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
    `[build] Built codesphere-portfolio (${summary.totalProjects} systems, ${summary.totalAutomatedTests} verified tests) in ${elapsedMs} ms -> index.html & dist/`
  );
}
