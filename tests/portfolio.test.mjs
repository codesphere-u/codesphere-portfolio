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
import {
  renderHeroArchitectureSceneSvg,
  renderJourneyStageHtml,
  renderProjectCardHtml,
  renderDrawerContentHtml,
  renderKnowledgeMapSvg,
  renderKnowledgeNodeDetailHtml,
  renderPhilosophyCardHtml
} from '../src/ui/app.mjs';
import { generatePortfolioHtml } from '../scripts/build.mjs';
import defaultServerHandler, { createPortfolioServer } from '../server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

describe("Codesphere Portfolio v2.0 — THE BUILDER'S JOURNEY Identity, Career & Strict Accuracy Rules", () => {
  it('validates overall portfolio schema and 323 verified automated tests/suites across 8 repositories', () => {
    const check = validatePortfolioIntegrity(PORTFOLIO_DATA);
    assert.equal(check.valid, true, `Errors: ${check.errors.join(', ')}`);
    assert.equal(
      check.totalTests,
      323,
      `Expected exactly 323 verified automated tests/suites across the 8 repos, got ${check.totalTests}`
    );
  });

  it('includes Experience 01 Cinematic Opening identity, headline, specialties, and SVG scene', () => {
    const { profile } = PORTFOLIO_DATA;
    assert.equal(profile.name, 'Akandwanaho Ivan Alvin');
    assert.equal(profile.displayNameUpper, 'AKANDWANAHO IVAN ALVIN');
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

    const sceneSvg = renderHeroArchitectureSceneSvg();
    assert.match(sceneSvg, /<svg class="hero-scene-svg"/);
    assert.match(sceneSvg, /DESIGN/);
    assert.match(sceneSvg, /BUILD/);
    assert.match(sceneSvg, /SECURE/);

    const { html } = generatePortfolioHtml();
    assert.match(html, /AKANDWANAHO IVAN ALVIN/);
    assert.match(html, /Engineering what comes next\./);
    assert.match(html, /Explore My Journey/);
  });

  it('enforces education & repository accuracy: ISBAT University present, zero Makerere/NEWS2/whitehathackerpr', () => {
    const { html } = generatePortfolioHtml();
    assert.equal(PORTFOLIO_DATA.profile.education.institution, 'ISBAT University');
    assert.match(html, /ISBAT University — Uganda/);
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

    assert.match(html, /Akandwanaho Ivan Alvin/);
    assert.match(html, /Jaminsa Ventures Limited/);
    assert.match(html, /March 2025/);
    assert.match(html, /https:\/\/www\.codesphereug\.com/);
  });

  it('renders Experience 02 — 6 interactive chapters of My Journey with Challenge, Responsibility, Learned, ShapedNext & Technologies', () => {
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

    for (const ch of PORTFOLIO_DATA.journey) {
      const panelHtml = renderJourneyStageHtml(ch, ch.stageNumber === 1);
      assert.match(panelHtml, /01 \/ THE CHALLENGE/);
      assert.match(panelHtml, /02 \/ MY RESPONSIBILITY/);
      assert.match(panelHtml, /03 \/ WHAT I LEARNED/);
      assert.match(panelHtml, /04 \/ HOW IT SHAPED THE NEXT STAGE/);
      assert.match(panelHtml, /TECHNOLOGIES &amp; PRACTICES INVOLVED/);
    }
  });

  it('verifies Experience 03 — all 8 open-source systems with custom SVG motifs and verified metrics', () => {
    const expectedSlugs = [
      'cyber-dragon',
      'auralis-local',
      'ARGUS-AI',
      'agentshield',
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
      assert.ok(project.visualMotif);
      assert.ok(project.problemStatement);
      assert.ok(project.technicalChallenges.length >= 2);
      assert.ok(project.securityConsiderations.length >= 2);
    }

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

    assert.equal(filterProjects({ domain: 'All' }).length, 8);
    assert.ok(filterProjects({ domain: 'AI' }).length >= 3);
    assert.ok(filterProjects({ domain: 'Cybersecurity' }).length >= 3);
    assert.ok(filterProjects({ domain: 'Backend' }).length >= 4);
    assert.ok(filterProjects({ domain: 'Fintech' }).length >= 2);
    assert.ok(filterProjects({ domain: 'Cloud' }).length >= 1);
    assert.ok(filterProjects({ domain: 'Full-Stack' }).length >= 4);
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

  it('renders Experience 04 — 8-node Interactive Knowledge Map and node inspector', () => {
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

    const svg = renderKnowledgeMapSvg(PORTFOLIO_DATA.knowledgeMap, 'cybersecurity');
    assert.match(svg, /kmap-constellation-svg/);
    assert.match(svg, /data-kmap-node="cybersecurity"/);

    const secNode = getKnowledgeNodeById(PORTFOLIO_DATA.knowledgeMap, 'cybersecurity');
    const detailHtml = renderKnowledgeNodeDetailHtml(secNode, PORTFOLIO_DATA.projects);
    assert.match(detailHtml, /Cybersecurity/);
    assert.match(detailHtml, /Cyber Dragon/);
    assert.match(detailHtml, /AgentShield/);
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
    assert.equal(projectsRes.lines.length, 8);

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

  it('renders Experience 06 — all 5 Personal Engineering Philosophy principles', () => {
    assert.equal(PORTFOLIO_DATA.philosophy.length, 5);
    const statements = PORTFOLIO_DATA.philosophy.map((p) => p.statement);
    assert.deepEqual(statements, [
      'Build for real problems.',
      'Security is part of the architecture.',
      'Make complex systems understandable.',
      'Measure what matters.',
      'Build technology that creates opportunity.'
    ]);

    for (const p of PORTFOLIO_DATA.philosophy) {
      const card = renderPhilosophyCardHtml(p);
      assert.match(card, new RegExp(p.statement));
    }
  });
});

describe('Codesphere Portfolio v2.0 — Case Study Drawer, Static Build & Server', () => {
  it('renders complete Case Study Drawer with Problem Statement, Architecture Blueprint, Challenges, Security, ADRs, and CLI', () => {
    for (const project of PORTFOLIO_DATA.projects) {
      const cardHtml = renderProjectCardHtml(project);
      assert.match(cardHtml, new RegExp(project.name));
      assert.match(cardHtml, new RegExp(project.repoUrl));

      const drawerHtml = renderDrawerContentHtml(project);
      assert.match(drawerHtml, /1\. Problem Statement/);
      assert.match(drawerHtml, /2\. System Architecture Blueprint/);
      assert.match(drawerHtml, /3\. Difficult Technical Challenges Solved/);
      assert.match(drawerHtml, /4\. Security Considerations &amp; System Invariants/);
      assert.match(drawerHtml, /5\. Architectural Decision Records \(ADRs\)/);
      assert.match(drawerHtml, /6\. Reproducible Verification &amp; CLI Quickstart/);
      assert.match(drawerHtml, /7\. Direct Repository Source &amp; Test Inspection/);
    }
  });

  it('builds self-contained index.html and dist/index.html with v2.0 visual design system tokens', () => {
    const { html, elapsedMs, summary } = generatePortfolioHtml();
    assert.ok(Number(elapsedMs) < 500, `Build took too long: ${elapsedMs}ms`);
    assert.equal(summary.totalProjects, 8);
    assert.equal(summary.totalAutomatedTests, 323);

    assert.match(html, /class="skip-link"/);
    assert.match(html, /role="banner"/);
    assert.match(html, /role="main"/);
    assert.match(html, /role="dialog"/);
    assert.match(html, /Space\+Grotesk/);
    assert.match(html, /JetBrains\+Mono/);

    const css = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'ui', 'styles.css'),
      'utf8'
    );
    assert.match(css, /#070B16/i);
    assert.match(css, /#101B2E/i);
    assert.match(css, /#53C9EE/i);
    assert.match(css, /#387BFA/i);
    assert.match(css, /#F4B94C/i);
    assert.match(css, /#F7FAFF/i);
    assert.match(css, /#98AFC8/i);
    assert.match(css, /prefers-reduced-motion:\s*reduce/);
    assert.match(css, /\[data-theme="light"\]/);
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
      assert.equal(body.owner, 'Akandwanaho Ivan Alvin');
      assert.equal(body.totalProjects, 8);
      assert.equal(body.totalAutomatedTests, 323);
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
      assert.equal(body.benchmarks[0].repoSlug, 'codesphere-u/stackpulse');
    });

    it('serves static HTML at / with security headers', async () => {
      const res = await fetch(`${baseUrl}/`);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      const html = await res.text();
      assert.match(html, /AKANDWANAHO IVAN ALVIN/);
      assert.match(html, /Engineering what comes next\./);
    });

    it('exports a default (req, res) handler compatible with Vercel Serverless Function invocation and serves CSS/JS assets', async () => {
      assert.equal(typeof defaultServerHandler, 'function');

      const cssRes = await fetch(`${baseUrl}/src/ui/styles.css`);
      assert.equal(cssRes.status, 200);
      assert.match(cssRes.headers.get('content-type'), /text\/css/);

      const jsRes = await fetch(`${baseUrl}/src/ui/app.mjs`);
      assert.equal(jsRes.status, 200);
      assert.match(jsRes.headers.get('content-type'), /text\/javascript/);
    });
  });
});
