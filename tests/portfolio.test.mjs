import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';
import {
  filterProjects,
  getProjectById,
  computePortfolioSummary,
  sortBenchmarks,
  validatePortfolioIntegrity
} from '../src/core/explorer.mjs';
import {
  renderProjectCardHtml,
  renderDrawerContentHtml
} from '../src/ui/app.mjs';
import { generatePortfolioHtml } from '../scripts/build.mjs';
import { createPortfolioServer } from '../server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Codesphere Portfolio v1.1 — Executive Identity, Career & Strict Accuracy Rules', () => {
  it('validates overall portfolio schema and 340+ automated test threshold', () => {
    const check = validatePortfolioIntegrity(PORTFOLIO_DATA);
    assert.equal(check.valid, true, `Errors: ${check.errors.join(', ')}`);
    assert.ok(
      check.totalTests >= 340,
      `Expected at least 340 automated tests across portfolio, got ${check.totalTests}`
    );
  });

  it('includes exact verified identity, positioning, and principal links for Akandwanaho Ivan Alvin', () => {
    const { profile } = PORTFOLIO_DATA;
    assert.equal(profile.name, 'Akandwanaho Ivan Alvin');
    assert.equal(profile.shortName, 'Alvin');
    assert.equal(
      profile.headline,
      'Software Engineer · AI Systems Builder · Cybersecurity · Full-Stack & Cloud Engineering'
    );
    assert.equal(
      profile.subtitle,
      'Founder & Managing Director, Codesphere Innovations (U) Limited'
    );
    assert.equal(
      profile.tagline,
      'Building intelligent, secure, and scalable software — from Uganda to the world.'
    );
    assert.match(profile.location, /Kampala, Uganda/);
    assert.equal(profile.companyWebsiteUrl, 'https://www.codesphereug.com');
    assert.equal(profile.linkedinUrl, 'https://www.linkedin.com/in/the4codex');
    assert.equal(profile.githubUrl, 'https://github.com/codesphere-u');
    assert.equal(profile.liveDemoUrl, 'https://cyber-dragon-ivory.vercel.app');
  });

  it('enforces education accuracy: ISBAT University — Uganda is present and Makerere is never mentioned', () => {
    const { html } = generatePortfolioHtml();
    assert.match(PORTFOLIO_DATA.profile.education.institution, /ISBAT University/);
    assert.match(html, /ISBAT University — Uganda/);
    assert.doesNotMatch(html, /Makerere/i);
    assert.doesNotMatch(JSON.stringify(PORTFOLIO_DATA), /Makerere/i);
    assert.doesNotMatch(html, /whitehathackerpr/i);
  });

  it('verifies career leadership roles and strict organizational boundaries (Codesphere, Funa Gigs / Jaminsa Ventures, Waanverse Labs, 4codex)', () => {
    const { html } = generatePortfolioHtml();

    const codesphere = PORTFOLIO_DATA.experience.find(
      (e) => e.id === 'codesphere-innovations'
    );
    assert.ok(codesphere);
    assert.equal(codesphere.isCurrent, true);
    assert.equal(codesphere.websiteUrl, 'https://www.codesphereug.com');
    assert.match(codesphere.organization, /CODESPHERE INNOVATIONS \(U\) LIMITED/);

    const funaGigs = PORTFOLIO_DATA.experience.find(
      (e) => e.id === 'funa-gigs-jaminsa'
    );
    assert.ok(funaGigs);
    assert.equal(funaGigs.isCurrent, true);
    assert.match(funaGigs.organization, /Jaminsa Ventures Limited/);
    assert.match(funaGigs.ownershipNote, /Jaminsa Ventures Limited/);
    assert.match(funaGigs.ownershipNote, /distinct from Codesphere Innovations/);

    const waanverse = PORTFOLIO_DATA.experience.find(
      (e) => e.id === 'waanverse-labs'
    );
    assert.ok(waanverse);
    assert.equal(waanverse.isCurrent, false);
    assert.match(waanverse.status, /Former — Departed March 2025/);

    const fourCodex = PORTFOLIO_DATA.experience.find(
      (e) => e.id === '4codex-technologies'
    );
    assert.ok(fourCodex);
    assert.equal(fourCodex.isCurrent, false);
    assert.match(fourCodex.organization, /4codex Technologies/);

    assert.match(html, /Akandwanaho Ivan Alvin/);
    assert.match(html, /Jaminsa Ventures Limited/);
    assert.match(html, /Departed March 2025/);
    assert.match(html, /https:\/\/www\.codesphereug\.com/);
  });

  it('renders the 7-stage thematic engineering journey and broader commercial archive', () => {
    assert.equal(PORTFOLIO_DATA.journey.length, 7);
    const themes = PORTFOLIO_DATA.journey.map((j) => j.theme);
    assert.deepEqual(themes, [
      'Foundation',
      'Entrepreneurship',
      'Technical Leadership',
      'Business Leadership',
      'Product Engineering',
      'Advanced Engineering',
      'Open Source'
    ]);

    const broaderNames = PORTFOLIO_DATA.broaderProjects.map((p) => p.name);
    assert.ok(broaderNames.includes('Funa Gigs'));
    assert.ok(broaderNames.includes('BizManage Pro'));
    assert.ok(broaderNames.includes('PesaFlow'));
    assert.ok(broaderNames.includes('AI Energy Efficiency Tool'));
    assert.ok(broaderNames.includes('Trip Planner & Electronic Logging Application'));

    const { html } = generatePortfolioHtml();
    assert.match(html, /2K Restaurant Management/);
    assert.match(html, /BKK Pharmacy Management/);
    assert.match(html, /City Star Supermarket Management/);
    assert.match(html, /OM SAI Hardware Software/);
  });

  it('verifies all 8 open-source systems (6 Primary Flagships + AgriSignal + Clinical Virtual Health Platform)', () => {
    const expectedSlugs = [
      'cyber-dragon',
      'auralis-local',
      'agentshield',
      'ARGUS-AI',
      'flowledger',
      'stackpulse',
      'agrisignal',
      'Clinical-Virtual-Health-Platform'
    ];
    assert.equal(PORTFOLIO_DATA.projects.length, 8);
    const primaryCount = PORTFOLIO_DATA.projects.filter(
      (p) => p.isPrimaryFlagship
    ).length;
    assert.equal(primaryCount, 6);

    for (const slug of expectedSlugs) {
      const project = getProjectById(slug);
      assert.ok(project, `Missing flagship system: ${slug}`);
      assert.equal(project.repoUrl, `https://github.com/codesphere-u/${slug}`);
    }
  });

  it('verifies exact measured metrics for AgentShield (42 tests, 25-scenario red-team, 100% recall, 0% FPR)', () => {
    const agentshield = getProjectById('agentshield');
    assert.equal(agentshield.automatedTests, 42);
    assert.match(agentshield.headlineMetric.value, /100% Recall/);
    assert.match(agentshield.headlineMetric.value, /0% FPR/);
    assert.match(agentshield.headlineMetric.detail, /25-scenario/);
    assert.match(agentshield.summary, /SHA-256/);
  });

  it('verifies exact measured metrics for Cyber Dragon v1.0 (21 tests, 0.28 ms mean latency, 8/8 corpus, live Vercel demo)', () => {
    const cyberDragon = getProjectById('cyber-dragon');
    assert.equal(cyberDragon.automatedTests, 21);
    assert.match(cyberDragon.headlineMetric.value, /0\.28 ms/);
    assert.match(cyberDragon.headlineMetric.value, /8\/8/);
    assert.equal(cyberDragon.liveDemoUrl, 'https://cyber-dragon-ivory.vercel.app');
  });

  it('verifies exact measured metrics for Auralis Local v0.2 (36 tests, 0.245 ms P50 BM25, 3,110 docs/sec)', () => {
    const auralis = getProjectById('auralis-local');
    assert.equal(auralis.automatedTests, 36);
    assert.match(auralis.headlineMetric.value, /0\.245 ms P50/);
    assert.match(auralis.headlineMetric.value, /3,110 docs\/s/);
  });

  it('verifies exact measured metrics for FlowLedger v1.0 (51 tests, 97 hash-chained entries, 0 imbalance, 50-tx 3-way reconciliation)', () => {
    const flowledger = getProjectById('flowledger');
    assert.equal(flowledger.automatedTests, 51);
    assert.match(flowledger.headlineMetric.value, /0 Imbalance/);
    assert.match(flowledger.headlineMetric.value, /97 Chained Entries/);
    assert.match(flowledger.headlineMetric.detail, /50-tx 3-way reconciliation/);
  });

  it('verifies exact measured metrics for ARGUS AI v2.1 (61 tests, 3 trap trades vetoed, leakage guard, MCP)', () => {
    const argus = getProjectById('ARGUS-AI');
    assert.equal(argus.automatedTests, 61);
    assert.match(argus.headlineMetric.value, /3 Trap Trades Vetoed/);
    assert.match(argus.summary, /MCP/);
  });

  it('verifies exact measured metrics for StackPulse v1.0 (47 tests, 19,525 traces/sec, 51.2 µs/trace)', () => {
    const stackpulse = getProjectById('stackpulse');
    assert.equal(stackpulse.automatedTests, 47);
    assert.match(stackpulse.headlineMetric.value, /19,525 traces\/s/);
    assert.match(stackpulse.headlineMetric.value, /51\.2 µs\/trace/);
  });

  it('verifies exact measured metrics for AgriSignal v1.0 (60 passing pytest tests, ≤160-char SMS advisories in en, lg, sw)', () => {
    const agrisignal = getProjectById('agrisignal');
    assert.equal(agrisignal.automatedTests, 60);
    assert.match(agrisignal.headlineMetric.value, /160 Chars/);
    assert.match(agrisignal.summary, /`en`/);
    assert.match(agrisignal.summary, /`lg`/);
    assert.match(agrisignal.summary, /`sw`/);
  });
});

describe('Codesphere Portfolio — Interactive Domain Filtering & Search', () => {
  it('supports all 6 required domain filter categories', () => {
    const expectedDomains = [
      'All',
      'AI & Agents',
      'Cybersecurity',
      'Fintech & Ledgers',
      'Cloud & SRE',
      'AgriTech & HealthTech'
    ];
    assert.deepEqual(PORTFOLIO_DATA.domains, expectedDomains);

    assert.equal(filterProjects({ domain: 'All' }).length, 8);
    assert.ok(filterProjects({ domain: 'AI & Agents' }).length >= 3);
    assert.ok(filterProjects({ domain: 'Cybersecurity' }).length >= 3);
    assert.ok(filterProjects({ domain: 'Fintech & Ledgers' }).length >= 2);
    assert.equal(filterProjects({ domain: 'Cloud & SRE' }).length, 1);
    assert.equal(filterProjects({ domain: 'AgriTech & HealthTech' }).length, 2);
  });

  it('filters projects by search query across ADRs and architectural trade-offs', () => {
    const ssrfResults = filterProjects({ query: 'SSRF' });
    assert.ok(ssrfResults.some((p) => p.slug === 'cyber-dragon'));
    assert.ok(ssrfResults.some((p) => p.slug === 'agentshield'));

    const floatResults = filterProjects({ query: 'IEEE-754' });
    assert.equal(floatResults.length, 1);
    assert.equal(floatResults[0].slug, 'flowledger');

    const lugandaResults = filterProjects({ query: 'Luganda' });
    assert.equal(lugandaResults.length, 1);
    assert.equal(lugandaResults[0].slug, 'agrisignal');
  });

  it('returns empty array when search query matches no project', () => {
    const none = filterProjects({ query: 'nonexistent-quantum-blockchain-xyz' });
    assert.equal(none.length, 0);
  });

  it('sorts benchmark matrix rows by test count, latency, and name', () => {
    const byTests = sortBenchmarks(PORTFOLIO_DATA.benchmarks, 'tests-desc');
    assert.equal(byTests[0].repoSlug, 'ARGUS-AI');
    assert.equal(byTests[0].automatedTests, 61);

    const byLatency = sortBenchmarks(PORTFOLIO_DATA.benchmarks, 'latency-asc');
    assert.equal(byLatency[0].repoSlug, 'stackpulse');
    assert.equal(byLatency[0].primaryLatencyMs, 0.0512);

    const byName = sortBenchmarks(PORTFOLIO_DATA.benchmarks, 'name-asc');
    assert.equal(byName[0].repoSlug, 'agentshield');
  });
});

describe('Codesphere Portfolio — Architecture & ADR Deep-Dive Drawer Rendering', () => {
  it('renders complete ADR trade-offs, ASCII diagram, CLI quickstart, and GitHub links', () => {
    for (const project of PORTFOLIO_DATA.projects) {
      const cardHtml = renderProjectCardHtml(project);
      assert.match(cardHtml, new RegExp(project.name));
      assert.match(cardHtml, new RegExp(project.repoUrl));

      const drawerHtml = renderDrawerContentHtml(project);
      assert.match(drawerHtml, /System Architecture Blueprint/);
      assert.match(drawerHtml, /Key Engineering Trade-Offs/);
      assert.match(drawerHtml, /Reproducible CLI Quickstart/);
      assert.match(drawerHtml, /Direct Source &amp; Test Links/);
    }
  });

  it('documents key architectural trade-offs for Cyber Dragon, FlowLedger, and Auralis', () => {
    const cyberDrawer = renderDrawerContentHtml(getProjectById('cyber-dragon'));
    assert.match(cyberDrawer, /Refusal to Fetch User-Submitted URLs/);

    const flowDrawer = renderDrawerContentHtml(getProjectById('flowledger'));
    assert.match(flowDrawer, /Ban on IEEE-754 Floating Point/);

    const auralisDrawer = renderDrawerContentHtml(getProjectById('auralis-local'));
    assert.match(auralisDrawer, /Strict Loopback Binding and Single-Use Write Approval Tokens/);
  });
});

describe('Codesphere Portfolio — Static Build, Visual Palette & Accessibility Output', () => {
  it('builds self-contained index.html and dist/index.html in under 500ms with executive color palette', () => {
    const { html, elapsedMs, summary } = generatePortfolioHtml();
    assert.ok(Number(elapsedMs) < 500, `Build took too long: ${elapsedMs}ms`);
    assert.equal(summary.totalProjects, 8);
    assert.ok(summary.totalAutomatedTests >= 340);

    // Check semantic landmarks & accessibility features
    assert.match(html, /class="skip-link"/);
    assert.match(html, /role="banner"/);
    assert.match(html, /role="main"/);
    assert.match(html, /role="dialog"/);
    assert.match(html, /property="og:title"/);

    // Verify dist files exist on disk
    assert.ok(fs.existsSync(path.join(ROOT_DIR, 'index.html')));
    assert.ok(fs.existsSync(path.join(ROOT_DIR, 'dist', 'index.html')));
    assert.ok(fs.existsSync(path.join(ROOT_DIR, 'dist', 'src', 'ui', 'styles.css')));
    assert.ok(fs.existsSync(path.join(ROOT_DIR, 'dist', 'src', 'ui', 'app.mjs')));

    const css = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'ui', 'styles.css'),
      'utf8'
    );
    assert.match(css, /#070d19/);
    assert.match(css, /#0b1528/);
    assert.match(css, /#111827/);
    assert.match(css, /#38bdf8/);
    assert.match(css, /#2563eb/);
    assert.match(css, /#fbbf24/);
    assert.match(css, /prefers-reduced-motion:\s*reduce/);
    assert.match(css, /\[data-theme="light"\]/);
  });
});

describe('Codesphere Portfolio — HTTP Server & API Endpoints', () => {
  let server;
  let baseUrl;

  before(async () => {
    server = createPortfolioServer();
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('serves /api/health with verified project and test counts', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.equal(body.owner, 'Akandwanaho Ivan Alvin');
    assert.equal(body.totalProjects, 8);
    assert.ok(body.totalAutomatedTests >= 340);
  });

  it('serves /api/projects with domain and query filtering', async () => {
    const res = await fetch(
      `${baseUrl}/api/projects?domain=${encodeURIComponent('Cybersecurity')}`
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.count >= 3);
    assert.ok(body.projects.some((p) => p.slug === 'agentshield'));
  });

  it('serves /api/benchmarks sorted by latency-asc', async () => {
    const res = await fetch(`${baseUrl}/api/benchmarks?sort=latency-asc`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.benchmarks[0].repoSlug, 'stackpulse');
  });

  it('serves static HTML at / with security headers', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    const html = await res.text();
    assert.match(html, /Akandwanaho Ivan Alvin/);
    assert.match(html, /Interactive Flagship Systems Explorer/);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await fetch(`${baseUrl}/nonexistent-file.html`);
    assert.equal(res.status, 404);
  });
});
