import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';
import {
  filterProjects,
  getProjectById,
  getKnowledgeNodeById,
  executeTerminalCommand,
  computePortfolioSummary,
  sortBenchmarks,
  validatePortfolioIntegrity
} from '../src/core/explorer.mjs';
import { renderLeadershipPage, sitePages } from '../scripts/profile.mjs';
import { generatePortfolioHtml } from '../scripts/build.mjs';
import defaultServerHandler, { createPortfolioServer } from '../server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

describe("Codesphere Portfolio v2.0 — THE BUILDER'S JOURNEY Identity, Career & Strict Accuracy Rules", () => {
  it('validates overall portfolio schema and 856 verified automated tests/suites across 15 repositories', () => {
    const check = validatePortfolioIntegrity(PORTFOLIO_DATA);
    assert.equal(check.valid, true, `Errors: ${check.errors.join(', ')}`);
    assert.equal(
      check.totalTests,
      856,
      `Expected exactly 856 verified automated tests/suites across the 15 repos, got ${check.totalTests}`
    );
  });

  it('presents the portfolio owner, role, portrait and work entry point', () => {
    const { profile } = PORTFOLIO_DATA;
    assert.equal(profile.name, 'Akandwanaho Ivan');
    assert.equal(profile.displayNameUpper, 'AKANDWANAHO IVAN');
    assert.equal(profile.shortName, 'Alvin');
    assert.equal(profile.heroEditorialHeadline, 'Engineering what comes next.');
    assert.deepEqual(profile.heroSpecialties, [
      'Software Engineering',
      'Artificial Intelligence',
      'Cybersecurity',
      'Cloud Systems',
      'Technical Entrepreneurship'
    ]);
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

    const { html } = generatePortfolioHtml();
    assert.match(html, /<h1 id="hero-heading"><span>Akandwanaho<\/span> <span>Ivan<\/span><\/h1>/);
    assert.match(html, /Software engineer &amp; founder/);
    assert.match(html, /src\/media\/alvin\.webp/);
    assert.match(html, /Explore my work/);
    assert.match(html, /"alternateName":"Alvin"/);
    assert.match(html, /akandwanaho-ivan\.svg/);
  });

  it('enforces education & repository accuracy: ISBAT University present, zero Makerere/NEWS2/whitehathackerpr', () => {
    const { html } = generatePortfolioHtml();
    assert.equal(PORTFOLIO_DATA.profile.education.institution, 'ISBAT University');
    assert.match(renderLeadershipPage(), /ISBAT University in Kampala/);
    assert.doesNotMatch(html, /Makerere/i);
    assert.doesNotMatch(JSON.stringify(PORTFOLIO_DATA), /Makerere/i);
    assert.doesNotMatch(html, /whitehathackerpr/i);
    assert.doesNotMatch(html, /NEWS2/i);
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
    assert.match(funaGigs.ownershipNote, /separate from Codesphere Innovations/);

    const waanverse = PORTFOLIO_DATA.experience.find(
      (e) => e.id === 'waanverse-labs'
    );
    assert.ok(waanverse);
    assert.equal(waanverse.isCurrent, false);
    assert.match(waanverse.status, /Former Role — Departed March 2025/);

    const fourCodex = PORTFOLIO_DATA.experience.find(
      (e) => e.id === '4codex-technologies'
    );
    assert.ok(fourCodex);
    assert.equal(fourCodex.isCurrent, false);
    assert.match(fourCodex.organization, /4codex Technologies/);

    assert.match(html, /Akandwanaho Ivan/);
    assert.match(html, /Jaminsa Ventures Limited/);
    const leadership = renderLeadershipPage();
    assert.match(leadership, /March 2025/);
    assert.match(leadership, /https:\/\/www\.codesphereug\.com/);
  });

  it('preserves all six career milestones in the data', () => {
    assert.equal(PORTFOLIO_DATA.journey.length, 6);
    const codes = PORTFOLIO_DATA.journey.map((j) => j.chapterCode);
    assert.deepEqual(codes, ['01', '02', '03', '04', '05', '06']);

    const themes = PORTFOLIO_DATA.journey.map((j) => j.theme);
    assert.deepEqual(themes, [
      'Engineering Foundations',
      'Building 4codex Technologies',
      'Technical Leadership',
      'Founding Codesphere Innovations',
      'Building Funa Gigs',
      'Advanced Systems and Open Source'
    ]);


  });

  it('verifies Experience 03 — all 15 open-source systems with custom SVG motifs and verified metrics', () => {
    const expectedSlugs = [
      'cyber-dragon',
      'auralis-local',
      'ARGUS-AI',
      'agentshield',
      'nexus-aegis',
      'cortex-mcp',
      'agentflight',
      'patchpilot',
      'synapse-router',
      'swarmweaver',
      'truthgate',
      'flowledger',
      'stackpulse',
      'agrisignal',
      'Clinical-Virtual-Health-Platform'
    ];
    assert.equal(PORTFOLIO_DATA.projects.length, 15);
    const primaryCount = PORTFOLIO_DATA.projects.filter(
      (p) => p.isPrimaryFlagship
    ).length;
    assert.equal(primaryCount, 13);

    for (const slug of expectedSlugs) {
      const project = getProjectById(slug);
      assert.ok(project, `Missing flagship system: ${slug}`);
      assert.equal(project.repoUrl, `https://github.com/codesphere-u/${slug}`);
      assert.ok(project.visualMotif);
      assert.ok(project.problemStatement);
      assert.ok(project.technicalChallenges.length >= 2);
      assert.ok(project.securityConsiderations.length >= 2);
    }

    const nexusAegis = getProjectById('nexus-aegis');
    assert.equal(nexusAegis.automatedTests, 77);
    assert.equal(nexusAegis.visualMotif, 'aegis');

    const cortexMcp = getProjectById('cortex-mcp');
    assert.equal(cortexMcp.automatedTests, 84);
    assert.equal(cortexMcp.visualMotif, 'graph');

    const agentflight = getProjectById('agentflight');
    assert.equal(agentflight.automatedTests, 90);
    assert.equal(agentflight.visualMotif, 'cassette');

    const patchpilot = getProjectById('patchpilot');
    assert.equal(patchpilot.automatedTests, 73);
    assert.equal(patchpilot.visualMotif, 'ast');

    const synapseRouter = getProjectById('synapse-router');
    assert.equal(synapseRouter.automatedTests, 77);
    assert.equal(synapseRouter.visualMotif, 'router');

    const swarmweaver = getProjectById('swarmweaver');
    assert.equal(swarmweaver.automatedTests, 65);
    assert.equal(swarmweaver.visualMotif, 'swarm');

    const truthgate = getProjectById('truthgate');
    assert.equal(truthgate.automatedTests, 67);
    assert.equal(truthgate.visualMotif, 'truth');

    const cyberDragon = getProjectById('cyber-dragon');
    assert.equal(cyberDragon.automatedTests, 21);
    assert.equal(cyberDragon.liveDemoUrl, 'https://cyber-dragon-ivory.vercel.app');

    const auralis = getProjectById('auralis-local');
    assert.equal(auralis.automatedTests, 36);

    const argus = getProjectById('ARGUS-AI');
    assert.equal(argus.automatedTests, 61);

    const agentshield = getProjectById('agentshield');
    assert.equal(agentshield.automatedTests, 42);

    const flowledger = getProjectById('flowledger');
    assert.equal(flowledger.automatedTests, 51);

    const stackpulse = getProjectById('stackpulse');
    assert.equal(stackpulse.automatedTests, 47);

    const agrisignal = getProjectById('agrisignal');
    assert.equal(agrisignal.automatedTests, 60);

    const clinical = getProjectById('Clinical-Virtual-Health-Platform');
    assert.equal(clinical.automatedTests, 5);
    assert.match(clinical.architectureBlueprint.diagram, /@docaas\/domain/);
    assert.match(clinical.architectureBlueprint.diagram, /LiveKit/);
  });
});

describe('Codesphere Portfolio v2.0 — Domain Filtering, Knowledge Map, Terminal & Philosophy', () => {
  it('supports all 7 required domain filter categories (All, AI, Cybersecurity, Backend, Fintech, Cloud, Full-Stack)', () => {
    const expectedDomains = [
      'All',
      'AI',
      'Cybersecurity',
      'Backend',
      'Fintech',
      'Cloud',
      'Full-Stack'
    ];
    assert.deepEqual(PORTFOLIO_DATA.domains, expectedDomains);

    assert.equal(filterProjects({ domain: 'All' }).length, 15);
    assert.ok(filterProjects({ domain: 'AI' }).length >= 10);
    assert.ok(filterProjects({ domain: 'Cybersecurity' }).length >= 7);
    assert.ok(filterProjects({ domain: 'Backend' }).length >= 11);
    assert.ok(filterProjects({ domain: 'Fintech' }).length >= 2);
    assert.ok(filterProjects({ domain: 'Cloud' }).length >= 3);
    assert.ok(filterProjects({ domain: 'Full-Stack' }).length >= 5);
  });

  it('filters projects by search query across ADRs, problem statements, and technical challenges', () => {
    const ssrfResults = filterProjects({ query: 'SSRF' });
    assert.ok(ssrfResults.some((p) => p.slug === 'cyber-dragon'));
    assert.ok(ssrfResults.some((p) => p.slug === 'agentshield'));

    const floatResults = filterProjects({ query: 'IEEE-754' });
    assert.equal(floatResults.length, 1);
    assert.equal(floatResults[0].slug === 'flowledger' || floatResults[0].id === 'flowledger', true);

    const lugandaResults = filterProjects({ query: 'Luganda' });
    assert.equal(lugandaResults.length, 1);
    assert.equal(lugandaResults[0].id, 'agrisignal');

    const empty = filterProjects({ query: 'nonexistent-quantum-blockchain-xyz' });
    assert.equal(empty.length, 0);
  });

  it('preserves eight engineering specialty records', () => {
    assert.equal(PORTFOLIO_DATA.knowledgeMap.length, 8);
    const expectedIds = [
      'ai-systems',
      'cybersecurity',
      'backend-architecture',
      'databases',
      'distributed-systems',
      'cloud-infrastructure',
      'devops',
      'flutter'
    ];
    assert.deepEqual(
      PORTFOLIO_DATA.knowledgeMap.map((n) => n.id),
      expectedIds
    );

    const secNode = getKnowledgeNodeById(PORTFOLIO_DATA.knowledgeMap, 'cybersecurity');
    assert.equal(secNode.label, 'Cybersecurity');

  });

  it('executes Experience 05 — Controlled Engineering Terminal commands safely without OS execution', () => {
    const helpRes = executeTerminalCommand('help', PORTFOLIO_DATA);
    assert.equal(helpRes.status, 'ok');
    assert.ok(helpRes.lines.some((l) => l.includes('projects')));

    const aboutRes = executeTerminalCommand('about', PORTFOLIO_DATA);
    assert.equal(aboutRes.status, 'ok');
    assert.ok(aboutRes.lines.some((l) => l.includes('ISBAT University')));
    assert.equal(aboutRes.targetSectionId, 'journey');

    const journeyRes = executeTerminalCommand('journey', PORTFOLIO_DATA);
    assert.equal(journeyRes.status, 'ok');
    assert.equal(journeyRes.lines.length, 6);

    const projectsRes = executeTerminalCommand('projects', PORTFOLIO_DATA);
    assert.equal(projectsRes.status, 'ok');
    assert.equal(projectsRes.lines.length, 15);

    const skillsRes = executeTerminalCommand('skills', PORTFOLIO_DATA);
    assert.equal(skillsRes.status, 'ok');
    assert.equal(skillsRes.lines.length, 8);

    const githubRes = executeTerminalCommand('github', PORTFOLIO_DATA);
    assert.equal(githubRes.status, 'ok');
    assert.ok(githubRes.lines.some((l) => l.includes('https://github.com/codesphere-u')));

    const contactRes = executeTerminalCommand('contact', PORTFOLIO_DATA);
    assert.equal(contactRes.status, 'ok');
    assert.ok(contactRes.lines.some((l) => l.includes('https://www.codesphereug.com')));

    const clearRes = executeTerminalCommand('clear', PORTFOLIO_DATA);
    assert.equal(clearRes.status, 'clear');

    const unknownRes = executeTerminalCommand('rm -rf /', PORTFOLIO_DATA);
    assert.equal(unknownRes.status, 'unknown');
    assert.ok(unknownRes.lines.some((l) => l.includes('no OS shell commands are executed')));
  });

  it('preserves all five engineering philosophy records', () => {
    assert.equal(PORTFOLIO_DATA.philosophy.length, 5);
    const statements = PORTFOLIO_DATA.philosophy.map((p) => p.statement);
    assert.deepEqual(statements, [
      'Build for real problems.',
      'Security is part of the architecture.',
      'Make complex systems understandable.',
      'Measure what matters.',
      'Build technology that creates opportunity.'
    ]);


  });
});

describe('Portfolio pages and server', () => {
  it('uses the new shared shell for every case study and top-level page', () => {
    const pages = new Map(sitePages());
    assert.equal(pages.size, 20);
    for (const [name, html] of pages) {
      assert.match(html, /class="folio-header"/, name);
      assert.match(html, /src\/ui\/profile\.css/, name);
      assert.match(html, /aria-label="Main navigation"/, name);
      assert.doesNotMatch(html, /href="[^"]*(?:archive\.html|\/cases\/)/, name);
      assert.doesNotMatch(html, /Akandwanaho Ivan Alvin/, name);
    }
    for (const project of PORTFOLIO_DATA.projects) {
      const html = pages.get(`work/${project.id}.html`);
      assert.ok(html.includes(project.repoUrl), project.id);
      assert.match(html, /Why it exists/);
      assert.match(html, /How it works/);
      assert.match(html, /How to verify it/);
      assert.match(html, /Next case study/);
    }
  });

  it('builds the new navigation, identity, and standalone project pages', () => {
    const { html, elapsedMs, summary } = generatePortfolioHtml();
    assert.ok(Number(elapsedMs) < 500, `Build took too long: ${elapsedMs}ms`);
    assert.equal(summary.totalProjects, 15);
    assert.equal(summary.totalAutomatedTests, 856);
    assert.match(html, /class="skip-link"/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /href="\.\/index\.html" aria-current="page"/);
    for (const page of ['work', 'leadership', 'contact']) assert.ok(html.includes(`href="./${page}.html"`));
    assert.equal(fs.existsSync(path.join(ROOT_DIR, 'dist', 'archive.html')), false);
    assert.equal(fs.existsSync(path.join(ROOT_DIR, 'dist', 'cases')), false);
    const css = fs.readFileSync(path.join(ROOT_DIR, 'src', 'ui', 'profile.css'), 'utf8');
    assert.match(css, /prefers-reduced-motion:\s*reduce/);
  });

  describe('HTTP Server & API Endpoints', () => {
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

    it('serves /api/health with v2.0 metadata and verified counts', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert.equal(res.status, 200);
      const body = await res.json();
      assert.equal(body.status, 'ok');
      assert.equal(body.version, '2.0.0');
      assert.equal(body.owner, 'Akandwanaho Ivan');
      assert.equal(body.totalProjects, 15);
      assert.equal(body.totalAutomatedTests, 856);
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
      assert.equal(body.benchmarks[0].repoSlug, 'codesphere-u/agentflight');
    });

    it('serves static HTML at / with security headers', async () => {
      const res = await fetch(`${baseUrl}/`);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      const html = await res.text();
      assert.match(html, /Akandwanaho Ivan/);
      assert.match(html, /Selected work/);
    });

    it('serves all new pages with static-build parity and removes old paths', async () => {
      for (const [page] of sitePages()) {
        const response = await fetch(`${baseUrl}/${page}`);
        assert.equal(response.status, 200, page);
        assert.match(response.headers.get('content-type'), /text\/html/);
        assert.equal(await response.text(), fs.readFileSync(path.join(ROOT_DIR, 'dist', page), 'utf8'));
      }
      for (const page of ['/archive', '/archive.html', '/cases/funa-gigs.html', '/cases/agentflight.html', '/work/missing.html']) {
        const response = await fetch(baseUrl + page);
        assert.equal(response.status, 404, page);
        assert.match(await response.text(), /Page not found/);
      }
    });

    it('serves the new design, logo and locally hosted media', async () => {
      assert.equal(typeof defaultServerHandler, 'function');
      for (const [asset, type] of [
        ['/src/ui/profile.css', 'text/css; charset=utf-8'],
        ['/src/media/akandwanaho-ivan.svg', 'image/svg+xml'],
        ...['alvin', 'funa-home', 'funa-work', 'cyber-dragon'].map(name => [`/src/media/${name}.webp`, 'image/webp'])
      ]) {
        const response = await fetch(baseUrl + asset);
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('content-type'), type);
        assert.ok((await response.arrayBuffer()).byteLength > 0);
      }
    });
  });
});
