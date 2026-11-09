import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';
import { computePortfolioSummary } from '../src/core/explorer.mjs';
import { renderShowcase } from './showcase.mjs';
import { CV, cvPdf } from './cv-data.mjs';

const { profile, projects, experience } = PORTFOLIO_DATA;
const storeUrl = 'https://play.google.com/store/apps/details?id=com.codesphereinnovations.funa_giggs';
const funaUrl = 'https://www.funagigs.com/';
const logo = 'src/media/akandwanaho-ivan.svg';

// Short editorial descriptions lead into the architecture and evidence stored with each project.
const projectLeads = {
  'funa-gigs': ['Funa Gigs', 'Product leadership', 'Hire nearby. Pay after approval.', 'A Ugandan marketplace for matching with local taskers, coordinating the job, and paying in UGX.'],
  'cyber-dragon': ['Cyber Dragon', 'Defensive security', 'Inspect suspicious messages without opening the link.', 'A browser workbench that explains the signs of mobile-money scams, lookalike domains, and USSD traps.'],
  agentflight: ['AgentFlight', 'Developer tools', 'Replay an AI agent’s failure in a test.', 'A recorder and replay tool for comparing AI agent runs without repeating live model or tool calls.'],
  agentshield: ['AgentShield', 'AI security', 'Check permissions before an agent acts.'],
  flowledger: ['FlowLedger', 'Financial infrastructure', 'Keep balances exact through payment retries.'],
  stackpulse: ['StackPulse', 'Cloud observability', 'See where a request spent its time.'],
  'auralis-local': ['Auralis Local', 'Local AI', 'Search private documents on your own machine.'],
  'argus-ai': ['ARGUS AI', 'Research tooling', 'Challenge a proposed trade before it enters the simulation.'],
  'nexus-aegis': ['Nexus Aegis', 'AI verification', 'Attach verifiable evidence to an agent’s proposed change.'],
  'cortex-mcp': ['Cortex MCP', 'Agent memory', 'Keep a history of what an agent knew and when.'],
  patchpilot: ['PatchPilot', 'Developer tools', 'Trace a failing test to a repair you can verify.'],
  'synapse-router': ['Synapse Router', 'AI infrastructure', 'Escalate to a stronger model when confidence drops.'],
  swarmweaver: ['SwarmWeaver', 'Agent orchestration', 'Coordinate parallel work without competing file edits.'],
  truthgate: ['TruthGate', 'AI verification', 'Check an agent’s claims against sources and code.'],
  agrisignal: ['AgriSignal', 'Offline-first systems', 'Deliver farm advisories over short multilingual SMS.'],
  'clinical-virtual-health-platform': ['Clinical Virtual Health Platform', 'Digital health', 'Coordinate virtual appointments across web, mobile, and video.'],
};

const featuredIds = ['funa-gigs', 'cyber-dragon', 'agentflight'];
const engineeringIds = ['agentshield', 'flowledger', 'stackpulse'];
const projectIds = [...new Set([...featuredIds, ...engineeringIds, ...projects.map(({ id }) => id)])];
const nav = [
  ['home', 'Home', 'index.html'],
  ['work', 'Work', 'work.html'],
  ['leadership', 'Leadership', 'leadership.html'],
  ['cv', 'CV', 'cv.html']
];

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

const casePath = id => `work/${id}.html`;

function action(href, label, { secondary = false, arrow = '↗' } = {}) {
  return `<a class="folio-action${secondary ? ' folio-action-secondary' : ''}" href="${escapeHtml(href)}">${escapeHtml(label)}<span aria-hidden="true">${arrow}</span></a>`;
}

function projectThumb(id, prefix) {
  if (id === 'funa-gigs') return `<img src="${prefix}src/media/funa-home.webp" width="352" height="760" alt="" loading="lazy" decoding="async">`;
  if (id === 'cyber-dragon') return `<img src="${prefix}src/media/cyber-dragon.webp" width="960" height="932" alt="" loading="lazy" decoding="async">`;
  return '<span class="hero-trace" aria-hidden="true"><span>15m → replay</span><span>30m → diff</span></span>';
}

function frame({ page, title, description, body, prefix = './', type = 'website' }) {
  const fullTitle = title ? `${title} | ${profile.name}` : `${profile.name} | Software Engineer & Founder`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#f6f4ee">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="${prefix}${logo}" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}src/ui/profile.css">
  <link rel="stylesheet" href="${prefix}src/ui/site.css">${page === 'home' ? '\n  <link rel="stylesheet" href="./src/ui/showcase.css">\n  <link rel="stylesheet" href="./src/ui/hero.css">' : ''}${page === 'cv' ? '\n  <link rel="stylesheet" href="./src/ui/cv.css">' : ''}
</head>
<body class="folio">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="folio-header" data-site-header>
    <div class="folio-container folio-header-inner">
      <span class="header-skin" aria-hidden="true"></span>
      <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" hidden>Menu <span aria-hidden="true"></span></button>
      <button class="nav-orb" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open navigation" inert>
        <span class="nav-orb-core" aria-hidden="true">
          <svg class="nav-orb-ring" viewBox="0 0 62 62" focusable="false"><circle cx="31" cy="31" r="29.5" pathLength="1"/><circle class="nav-orb-progress" cx="31" cy="31" r="29.5" pathLength="1"/></svg>
          <span class="nav-orb-lines"><i></i><i></i></span>
        </span>
      </button>
      <nav id="site-nav" aria-label="Main navigation">
        <ul class="nav-pages">
          ${nav.map(([key, label, href]) => {
            const active = page === key;
            const section = page === 'project' && key === 'work';
            return `<li class="nav-${key}"><a href="${prefix}${href}"${active ? ' aria-current="page"' : ''}${section ? ' data-active-section' : ''}>${label}</a></li>`;
          }).join('\n          ')}
          <li class="nav-projects">
            <details class="project-disclosure">
              <summary>Projects <span aria-hidden="true"></span></summary>
              <div class="nav-panel">
                <p class="folio-label">Featured case studies</p>
                <ul>${featuredIds.map(id => {
                  const [name, area] = projectLeads[id];
                  return `<li><a href="${prefix}${casePath(id)}">
                    <span class="nav-project-thumb preview-${id}" aria-hidden="true">${projectThumb(id, prefix)}</span>
                    <span class="nav-project-label"><strong>${name}</strong><small>${area}</small></span>
                    <span aria-hidden="true">↗</span>
                  </a></li>`;
                }).join('')}</ul>
                <a class="nav-all-work" href="${prefix}work.html">View all case studies <span aria-hidden="true">→</span></a>
              </div>
            </details>
          </li>
          <li class="nav-contact"><a href="${prefix}contact.html"${page === 'contact' ? ' aria-current="page"' : ''}>Contact</a></li>
        </ul>
      </nav>
      <span class="reading-line" aria-hidden="true"></span>
    </div>
  </header>
  <main id="main-content" tabindex="-1">
${body}
  </main>
  ${siteFooter(page, prefix)}
  <script type="module" src="${prefix}src/ui/site-nav.mjs"></script>
  ${page === 'home' ? '<script type="module" src="./src/ui/showcase.mjs"></script>\n  <script type="module" src="./src/ui/hero.mjs"></script>' : ''}
</body>
</html>`;
}

// Shared footer. The closing call to action is left off pages that already end with one.
function siteFooter(page, prefix) {
  const offers = availability();
  const cta = ['contact', 'cv'].includes(page) ? '' : `<section class="footer-cta" aria-labelledby="footer-cta-title">
      <p class="folio-label">Open to</p>
      <h2 id="footer-cta-title" data-sort>Let’s build something <em>people can trust.</em></h2>
      <ul class="footer-offers">${offers.map(offer => `<li>${escapeHtml(offer)}</li>`).join('')}</ul>
      <div class="folio-actions">${action(prefix + 'contact.html', 'Start a conversation', { arrow: '→' })}${action(profile.linkedinUrl, 'Message me on LinkedIn', { secondary: true })}</div>
    </section>`;
  const column = (title, links) => `<div><p class="folio-label">${title}</p><ul>${links.map(([label, href, extra = '']) => `<li><a href="${href}"${extra}>${label}</a></li>`).join('')}</ul></div>`;
  return `<footer class="site-footer">
    <div class="folio-container">
      ${cta}
      <div class="footer-grid">
        <p class="footer-place"><span class="live-dot" aria-hidden="true"></span>Kampala, Uganda<br><span data-local-time>EAT</span></p>
        <nav class="footer-links" aria-label="Footer">
          ${column('Pages', [['Home', prefix + 'index.html'], ['Work', prefix + 'work.html'], ['Leadership', prefix + 'leadership.html'], ['CV', prefix + 'cv.html'], ['Contact', prefix + 'contact.html']])}
          ${column('Elsewhere', [['GitHub ↗', profile.githubUrl], ['LinkedIn ↗', profile.linkedinUrl], ['Codesphere ↗', profile.companyWebsiteUrl]])}
          ${column('Files', [['Download CV', prefix + cvPdf, ' download'], ['Download logo', prefix + logo, ' download="akandwanaho-ivan.svg"']])}
        </nav>
      </div>
      <p class="footer-wordmark" aria-hidden="true">Akandwanaho&nbsp;Ivan</p>
      <div class="footer-legal"><span>© 2026 · Also known as Alvin</span><a href="#main-content">Back to top <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>`;
}

// "Open to …" from the profile, as a list.
function availability() {
  return profile.availability.replace(/^Open to\s+/i, '').split(/,\s*/).map(item => item.trim()).filter(Boolean);
}

// Each project's colour world, from its accent colour (Funa Gigs keeps its own gold).
const worldByAccent = { '#53C9EE': 'cyan', '#387BFA': 'blue', '#F4B94C': 'gold' };
function worldOf(id) {
  if (id === 'funa-gigs') return 'world-funa';
  if (id === 'agentflight') return 'world-green';
  const project = projects.find(item => item.id === id);
  return `world-${worldByAccent[project?.accentColor] || 'blue'}`;
}

function funaMedia(prefix) {
  return `<figure class="project-media funa-media" data-scroll-reveal="media">
    <div class="funa-screens">
      <img src="${prefix}src/media/funa-home.webp" width="352" height="760" loading="lazy" decoding="async" alt="Funa Gigs Android home screen with Instant Hire and service categories">
      <img src="${prefix}src/media/funa-work.webp" width="352" height="760" loading="lazy" decoding="async" alt="Funa Gigs Android worker-matching screen showing a nearby search in progress">
    </div>
    <figcaption>Funa Gigs Android app · Official Google Play screenshots</figcaption>
  </figure>`;
}

function projectMedia(id, prefix) {
  if (id === 'funa-gigs') return funaMedia(prefix);
  if (id === 'cyber-dragon') return `<figure class="project-media cyber-media" data-scroll-reveal="media">
    <img src="${prefix}src/media/cyber-dragon.webp" width="960" height="932" loading="lazy" decoding="async" alt="Cyber Dragon workbench with fraud inspection modes and built-in sample scenarios">
    <figcaption>Cyber Dragon · Live inspection workbench</figcaption>
  </figure>`;
  return `<figure class="project-media replay-media" data-scroll-reveal="media">
    <div class="replay-window">
      <div class="replay-bar"><span class="replay-dot" aria-hidden="true"></span>incident.flight.json</div>
      <div class="replay-content">
        <p class="replay-file">Recorded tool call · payment-api · 15m</p>
        <pre><code>{
  "p99_latency_ms": 1840.0,
  "anomaly": true
}</code></pre>
        <p class="replay-result">✓ Matching input replays the recorded response</p>
        <details class="replay-compare">
          <summary>What if the call asks for 30 minutes?</summary>
          <div class="replay-diff"><strong>TrajectoryDivergenceError</strong><br><code>window: expected "15m", got "30m"</code></div>
        </details>
      </div>
    </div>
    <figcaption>AgentFlight replay · Simulated incident from the project README</figcaption>
  </figure>`;
}

function sectionHeading(label, title, intro, id) {
  return `<div class="folio-section-heading" data-scroll-reveal="copy">
    <div><p class="folio-label">${label}</p><h2 id="${id}">${title}</h2></div>
    <p>${intro}</p>
  </div>`;
}

// Every page opens on the same dark stage, with a title that sorts its letters into place.
function pageOpener({ eyebrow, title, lede, meta = '', actions = '', className = '' }) {
  return `<section class="opener ${className}"><div class="folio-container opener-inner">
    <p class="opener-eyebrow"><span aria-hidden="true"></span>${eyebrow}</p>
    <h1 data-sort>${title}</h1>
    <p class="opener-lede">${lede}</p>${meta}${actions}
  </div></section>`;
}

// The band between the opening and the work: the problem areas the case studies cover.
function marquee() {
  const areas = [...new Set(Object.values(projectLeads).map(([, area]) => area))];
  const run = areas.map((area, index) => `<span class="marquee-item${index % 2 ? ' marquee-item-alt' : ''}">${escapeHtml(area)}</span><span class="marquee-star">✦</span>`).join('');
  return `<div class="hero-marquee" aria-hidden="true"><div class="marquee-track" data-marquee>${run}${run}</div></div>`;
}

export function renderProfile() {
  const summary = computePortfolioSummary(PORTFOLIO_DATA);
  const description = 'Akandwanaho Ivan, also known as Alvin, is a software engineer and founder in Kampala, Uganda. Explore his product, security, and open-source engineering work.';
  const structured = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.name,
      alternateName: profile.shortName,
      jobTitle: 'Software Engineer and Founder',
      worksFor: { '@type': 'Organization', name: profile.companyName, url: profile.companyWebsiteUrl },
      sameAs: [profile.githubUrl, profile.linkedinUrl]
    }
  }).replace(/</g, '\\u003c');

  return frame({
    page: 'home', description,
    body: `<script type="application/ld+json">${structured}</script>
    <section class="folio-opening" aria-labelledby="hero-heading" data-hero>
      <div class="hero-stage">
        <div class="hero-visual">
          <img src="./src/media/alvin.webp" width="1254" height="1254" alt="Studio portrait of Akandwanaho Ivan" fetchpriority="high">
          <canvas class="hero-compile" aria-hidden="true" hidden></canvas>
        </div>
        <div class="folio-container folio-hero">
          <div class="hero-copy">
            <p class="folio-label hero-location"><span aria-hidden="true"></span> Kampala, Uganda · Also known as Alvin</p>
            <p class="hero-identity">Akandwanaho Ivan</p>
            <h1 id="hero-heading">I build systems <em>people can trust.</em></h1>
            <p class="hero-intro">I’m a software engineer and founder of Codesphere Innovations. I build for local hiring, mobile-money fraud defense, and AI agents that developers can test and audit.</p>
            <div class="folio-actions">
              ${action('#work-heading', 'Try the work', { arrow: '↓' })}
              ${action('./work.html', 'All case studies', { secondary: true, arrow: '→' })}
            </div>
          </div>
          <dl class="hero-proof">
              <div><dt>Automated tests</dt><dd data-count="${summary.totalAutomatedTests}">${summary.totalAutomatedTests}</dd></div>
              <div><dt>Open-source systems</dt><dd data-count="${summary.totalProjects}">${summary.totalProjects}</dd></div>
              <div><dt>Architecture decisions</dt><dd data-count="${summary.totalAdrs}">${summary.totalAdrs}</dd></div>
              <div class="hero-clock"><dt>Kampala time</dt><dd data-kampala-time>EAT</dd></div>
              <div class="hero-now"><dt>Currently</dt><dd>${escapeHtml(experience[0].role)} · ${escapeHtml(profile.companyName)}</dd></div>
            </dl>
        </div>
      </div>
    </section>
    ${marquee()}
    <section class="folio-work" aria-labelledby="work-heading">
      <div class="folio-container">
        ${sectionHeading('01 / Selected work', 'Work in action', 'Try a hiring flow, compare two fraud-analysis results, or change an AI tool call and see what breaks.', 'work-heading')}
      </div>
      ${renderShowcase()}
      <div class="folio-container">
        <div class="section-end">${action('./work.html', 'See all project case studies', { secondary: true, arrow: '→' })}</div>
      </div>
    </section>
    <section class="home-leadership" aria-labelledby="leadership-heading">
      <div class="folio-container">
        ${sectionHeading('02 / Leadership', 'Building teams and products', 'I founded Codesphere Innovations and lead Funa Gigs under Jaminsa Ventures Limited. Before that, I led engineering at Waanverse Labs.', 'leadership-heading')}
        <ol class="role-track">${experience.map(item => `
          <li data-scroll-reveal="copy">
            <p class="role-status${item.isCurrent ? ' is-current' : ''}">${escapeHtml(item.isCurrent ? 'Current' : item.status.replace(/^Former Role — /, ''))}</p>
            <h3>${escapeHtml(item.role)}</h3>
            <p class="role-org">${escapeHtml(item.organization)}</p>
          </li>`).join('')}
        </ol>
        <div class="section-end">${action('./leadership.html', 'See my leadership roles', { secondary: true, arrow: '→' })}<a class="folio-text-link" href="./cv.html">View my CV <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>`
  });
}

const domainLabels = { AI: 'AI', Cybersecurity: 'Security', Fintech: 'Fintech', Cloud: 'Cloud', Backend: 'Backend', 'Full-Stack': 'Full-stack' };

function workFeature(id, index) {
  const [name, area, headline, summary] = projectLeads[id];
  return `<article class="work-feature ${worldOf(id)}" data-scroll-reveal="copy">
      <div class="work-feature-copy">
        <p class="opener-eyebrow"><span aria-hidden="true"></span>0${index + 1} / ${area}</p>
        <h3>${name}</h3>
        <p class="work-feature-headline">${headline}</p>
        <p>${summary}</p>
        <a class="pill-link" href="./${casePath(id)}"><span>Read the ${name} case study</span><span class="pill-link-arrow" aria-hidden="true">↗</span></a>
      </div>
      ${projectMedia(id, './')}
    </article>`;
}

export function renderWorkPage() {
  const summary = computePortfolioSummary(PORTFOLIO_DATA);
  const systems = projectIds.filter(id => !featuredIds.includes(id));
  const domains = [...new Set(systems.flatMap(id => projects.find(item => item.id === id)?.domains || []))]
    .filter(domain => domainLabels[domain]);
  const rows = systems.map((id, index) => {
    const project = projects.find(item => item.id === id);
    const [name, area, headline] = projectLeads[id];
    const metric = project.headlineMetric;
    return `<li class="${worldOf(id)}" data-domains="${project.domains.join(' ')}">
        <a href="./${casePath(id)}">
          <span class="index-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="index-name"><strong>${name}</strong><span>${headline}</span></span>
          <span class="index-area">${area}</span>
          <span class="index-tests">${project.automatedTests} tests</span>
          <span class="index-arrow" aria-hidden="true">↗</span>
          <span class="index-preview" aria-hidden="true"><span class="folio-label">${escapeHtml(metric.label)}</span><strong>${escapeHtml(metric.value)}</strong><span>Repository-reported · ${project.automatedTests} automated tests</span></span>
        </a>
      </li>`;
  }).join('\n      ');
  return frame({
    page: 'work', title: 'Work', description: 'Product and engineering case studies by Akandwanaho Ivan.',
    body: `${pageOpener({
      eyebrow: 'Product · Security · Infrastructure', title: 'Selected work',
      lede: 'Start with three featured projects or explore the systems I’ve built for agent safety, payments, observability, and more.',
      meta: `<p class="opener-meta"><span><strong>${projectIds.length}</strong> case studies</span><span><strong>${summary.totalAutomatedTests}</strong> automated tests</span><span><strong>${summary.totalAdrs}</strong> architecture decisions</span></p>`
    })}
      <section class="folio-container work-features" aria-labelledby="featured-heading">
        <h2 id="featured-heading" class="section-kicker">Featured case studies</h2>
        ${featuredIds.map(workFeature).join('\n        ')}
      </section>
      <section class="work-index-section" aria-labelledby="systems-heading"><div class="folio-container">
        ${sectionHeading('Open source', 'Inside the systems', 'Each case study explains the problem, the design, and how to check the evidence.', 'systems-heading')}
        <div class="index-filters" data-index-filters hidden>
          <span class="folio-label" id="index-filter-label">Filter</span>
          <div role="group" aria-labelledby="index-filter-label">
            <button type="button" data-filter="" aria-pressed="true">All <span>${systems.length}</span></button>
            ${domains.map(domain => `<button type="button" data-filter="${domain}" aria-pressed="false">${domainLabels[domain]} <span>${systems.filter(id => projects.find(item => item.id === id).domains.includes(domain)).length}</span></button>`).join('\n            ')}
          </div>
        </div>
        <ol class="work-index" data-work-index>
      ${rows}
        </ol>
        <p class="index-empty" data-index-empty hidden>No systems match this filter.</p>
      </div></section>`
  });
}

export function renderLeadershipPage() {
  const current = experience.filter(item => item.isCurrent).length;
  return frame({
    page: 'leadership', title: 'Leadership', description: 'Akandwanaho Ivan’s founder and engineering leadership roles in Kampala.',
    body: `${pageOpener({
      eyebrow: 'Leadership / Kampala, Uganda', title: 'Building teams and products',
      lede: 'I lead product direction and stay close to architecture and implementation. My engineering foundations come from studying at ISBAT University in Kampala and building software for local businesses.',
      meta: `<p class="opener-meta"><span><strong>${experience.length}</strong> roles</span><span><strong>${current}</strong> current</span><span>Founder · CTO · Engineer</span></p>`
    })}
      <section class="folio-container role-section" aria-labelledby="roles-heading">
        ${sectionHeading('Experience', 'Where I’ve led', 'From the first software I built for local businesses to the companies I run today.', 'roles-heading')}
        <ol class="role-path">
          ${experience.map(item => `<li class="role-stop" data-scroll-reveal="copy">
            <div class="role-meta">
              <p class="role-status${item.isCurrent ? ' is-current' : ''}">${escapeHtml(item.status)}</p>
              <p class="role-org">${escapeHtml(item.organization)}</p>
              <p class="role-place">${escapeHtml(item.location || '')}</p>
            </div>
            <div class="role-detail">
              <h3>${escapeHtml(item.role)}</h3>
              <p>${escapeHtml(item.summary)}</p>
              <ul class="role-highlights">${item.highlights.map(highlight => `<li>${escapeHtml(highlight)}</li>`).join('')}</ul>
              ${item.technologies?.length ? `<ul class="role-tech" aria-label="Technologies">${item.technologies.slice(0, 8).map(tech => `<li>${escapeHtml(tech)}</li>`).join('')}</ul>` : ''}
              ${item.id === 'funa-gigs-jaminsa' ? action('./work/funa-gigs.html', 'Read the Funa Gigs case study', { secondary: true, arrow: '→' }) : ''}
              ${item.id === 'codesphere-innovations' ? action(item.websiteUrl, 'Visit Codesphere Innovations', { secondary: true }) : ''}
            </div>
          </li>`).join('\n          ')}
        </ol>
      </section>`
  });
}

export function renderCvPage() {
  const text = escapeHtml;
  const download = `<a class="folio-action cv-download" href="./${cvPdf}" download>Download CV <span aria-hidden="true">↓</span></a>`;
  const chapters = [
    ['cv-experience', 'Experience'],
    ['cv-projects', 'Selected engineering'],
    ['cv-skills', 'Technical skills'],
    ['cv-education', 'Education']
  ];
  const section = (index, body) => {
    const [id, title] = chapters[index];
    return `<section class="cv-section" aria-labelledby="${id}">
      <div class="cv-section-heading" data-scroll-reveal="copy"><span aria-hidden="true">0${index + 1}</span><h2 id="${id}">${title}</h2></div>
      ${body}
    </section>`;
  };
  const featured = [
    ['Product engineering', 'Funa Gigs', 'funa-gigs'],
    ['Defensive security', 'Cyber Dragon', 'cyber-dragon'],
    ['AI reliability', 'AgentFlight', 'agentflight']
  ];
  const sources = links => links.map(({ label, url }) =>
    `<a href="${text(url)}">${text(label)} <span aria-hidden="true">↗</span></a>`
  ).join('');
  return frame({
    page: 'cv', title: 'CV', type: 'profile', description: CV.summary,
    body: `<section class="cv-cover" aria-labelledby="cv-name">
      <div class="folio-container cv-cover-grid">
        <div class="cv-cover-copy">
          <p class="folio-label cv-location">Curriculum vitae</p>
          <h1 id="cv-name" data-sort>${text(CV.name)}</h1>
          <p class="cv-title">${text(CV.title)}</p>
          <p class="cv-byline">${text(CV.location)} <span aria-hidden="true">·</span> Also known as ${text(CV.alias)}</p>
          <p class="cv-summary">${text(CV.summary)}</p>
          <div class="cv-cover-actions">${download}<span>PDF · 2 pages</span></div>
          <div class="cv-cover-links">${sources(CV.links)}</div>
        </div>
        <figure class="cv-portrait">
          <img src="./src/media/alvin.webp" width="1254" height="1254" alt="Studio portrait of Akandwanaho Ivan" fetchpriority="high">
        </figure>
      </div>
      <div class="cv-featured"><div class="folio-container">
        <ul aria-label="Featured work">${featured.map(([area, name, id]) => `<li><a href="./${casePath(id)}"><div><span class="folio-label">${area}</span><strong>${name}</strong></div><span aria-hidden="true">↗</span></a></li>`).join('')}</ul>
      </div></div>
    </section>
    <div class="folio-container cv-content">
      <nav class="cv-index" aria-label="On this page">
        <p class="folio-label">On this page</p>
        <ol>${chapters.map(([id, title], i) => `<li><a href="#${id}"><span aria-hidden="true">0${i + 1}</span>${title}</a></li>`).join('')}</ol>
        <a class="cv-index-download" href="./${cvPdf}" download>Download PDF <span aria-hidden="true">↓</span></a>
      </nav>
      <div class="cv-sections">
        ${section(0, `<ol class="cv-roles">${CV.experience.map(item => `
          <li><article class="cv-role" data-scroll-reveal="copy">
            <div class="cv-role-heading"><div><h3>${text(item.organization)}</h3><p class="cv-role-title">${text(item.title)}</p></div><p class="cv-period">${text(item.period)}</p></div>
            <ul>${item.highlights.map(highlight => `<li>${text(highlight)}</li>`).join('')}</ul>
            ${item.links ? `<div class="cv-source-links">${sources(item.links)}</div>` : ''}
          </article></li>`).join('')}</ol>`)}
        ${section(1, `<ul class="cv-projects">${CV.projects.map(({ id, name, area, detail, evidence, repo }, index) => `
          <li><article class="cv-project" data-scroll-reveal="copy">
            <div class="cv-project-top"><p class="folio-label">${text(area)}</p><span aria-hidden="true">0${index + 1}</span></div>
            <h3>${text(name)}</h3>
            <p>${text(detail)}</p>
            <p class="cv-proof"><strong>How it works</strong> ${text(evidence)}</p>
            <div class="cv-source-links">${sources([
              { label: `${name} case study`, url: './' + casePath(id) },
              { label: `${name} source`, url: repo }
            ])}</div>
          </article></li>`).join('')}</ul>`)}
        ${section(2, `<dl class="cv-skills">${CV.skills.map(({ label, detail }) => `<div><dt>${text(label)}</dt><dd>${text(detail)}</dd></div>`).join('')}</dl>`)}
        ${section(3, `<div class="cv-education">
          <div><h3>${text(CV.education.institution)}</h3><p class="cv-period">${text(CV.education.location)}</p></div>
          <div class="cv-foundations">
            <p>${text(CV.education.detail)}</p>
            <p><strong>Additional training</strong> · ${text(CV.education.training)}</p>
            <p>${text(CV.education.earlyWork)}</p>
            <div class="cv-source-links">${sources(CV.education.links)}</div>
          </div>
        </div>`)}
        <div class="cv-close">
          <div><h2>Get in touch</h2><p>For engineering roles, technical leadership, and collaboration.</p></div>
          <div class="cv-close-actions">${download}${action('./contact.html', 'Contact me', { secondary: true, arrow: '→' })}</div>
        </div>
      </div>
    </div>`
  });
}

export function renderContactPage() {
  const channels = [
    ['Message', 'LinkedIn', 'Send me a message about a role, a product, or a collaboration.', profile.linkedinUrl],
    ['Open source', 'GitHub', 'Explore my repositories and source code.', profile.githubUrl],
    ['Company', 'Codesphere Innovations', 'For product engineering and company inquiries.', profile.companyWebsiteUrl]
  ];
  return frame({
    page: 'contact', title: 'Contact', description: 'Get in touch with Akandwanaho Ivan about engineering, technical leadership, or open-source work.',
    body: `${pageOpener({
      eyebrow: 'Contact · Kampala, Uganda', title: 'Let’s talk',
      lede: 'Have a product to build, a system to secure, or an engineering team to grow? Tell me what you’re working on.',
      meta: `<p class="opener-meta"><span><span class="live-dot" aria-hidden="true"></span>Kampala time <strong data-local-time>EAT</strong></span></p>`
    })}
      <section class="folio-container contact-section" aria-labelledby="channels-heading">
        <h2 id="channels-heading" class="section-kicker">Ways to reach me</h2>
        <ul class="channels">
          ${channels.map(([kind, name, note, url], index) => `<li><a class="channel" href="${url}">
            <span class="channel-kind"><span>0${index + 1}</span>${kind}</span>
            <span class="channel-name">${name}</span>
            <span class="channel-note">${note}</span>
            <span class="channel-arrow" aria-hidden="true">↗</span>
          </a></li>`).join('\n          ')}
        </ul>
        <div class="contact-open">
          <p class="folio-label">Open to</p>
          <ul class="footer-offers">${availability().map(offer => `<li>${escapeHtml(offer)}</li>`).join('')}</ul>
        </div>
      </section>`
  });
}

function caseSection(number, label, title, content) {
  return `<section class="case-chapter" aria-labelledby="chapter-${number}" data-scroll-reveal="copy">
    <div class="case-chapter-heading"><p class="folio-label">${number} / ${label}</p><h2 id="chapter-${number}">${title}</h2></div>
    <div class="chapter-body">${content}</div>
  </section>`;
}

function caseOpening(id, facts, visual) {
  const [name, area, headline, summary] = projectLeads[id];
  return `<section class="case-hero ${worldOf(id)}" aria-labelledby="case-title"><div class="folio-container">
    <a class="folio-back" href="../work.html"><span aria-hidden="true">←</span> All work</a>
    <div class="case-opening-grid">
      <div class="case-hero-copy">
        <p class="opener-eyebrow"><span aria-hidden="true"></span>${area} / Case study</p>
        <h1 id="case-title" data-sort>${name}</h1>
        <p class="case-headline">${headline}</p>
        ${summary ? `<p class="case-intro">${summary}</p>` : ''}
        <dl class="case-facts">${facts.map(([key, value]) => `<div><dt>${key}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>
      </div>
      ${visual}
    </div>
  </div></section>`;
}

// The chapters with a sticky rail beside them that tracks reading progress.
function caseBody(chapters, end) {
  return `<div class="folio-container case-body">
    <nav class="case-rail" aria-label="Case study chapters" data-case-rail>
      <p class="folio-label">On this page</p>
      <ol>${chapters.map(([number, , title]) => `<li><a href="#chapter-${number}"><span>${number}</span>${title}</a></li>`).join('')}</ol>
      <span class="case-rail-progress" aria-hidden="true"><i></i></span>
    </nav>
    <div class="case-story" data-case-story>
      ${chapters.map(([number, label, title, content]) => caseSection(number, label, title, content)).join('\n      ')}
      ${end}
    </div>
  </div>`;
}

function caseFooter(primary, nextId) {
  const [nextName, nextArea, nextHeadline] = projectLeads[nextId];
  return {
    end: `<div class="case-end"><div class="folio-actions">${primary}</div></div>`,
    next: `<a class="next-case ${worldOf(nextId)}" href="../${casePath(nextId)}"><span class="folio-container next-case-inner">
      <span class="folio-label">Next case study · ${nextArea}</span>
      <strong>${nextName}</strong>
      <span class="next-case-headline">${nextHeadline}</span>
      <span class="next-case-arrow" aria-hidden="true">→</span>
    </span></a>`
  };
}

function technicalVisual(project) {
  return `<figure class="project-media system-media" data-scroll-reveal="media">
    <div class="system-visual"><p class="folio-label">System architecture</p>
    <ol>${project.architectureBlueprint.layers.map(({ name }, index) => `<li><span aria-hidden="true">0${index + 1}</span>${escapeHtml(name)}</li>`).join('')}</ol></div>
    <figcaption>Three layers from the project’s architecture blueprint</figcaption>
  </figure>`;
}

function renderTechnicalCase(project) {
  const { id, name, version, languages, repoUrl, liveDemoUrl, architectureBlueprint, problemStatement, headlineMetric } = project;
  const [,, headline] = projectLeads[id];
  const leadDecision = project.adrs[0];
  const next = projectIds[(projectIds.indexOf(id) + 1) % projectIds.length];
  const sources = project.sourceLinks.map(({ url, label }) => `<li><a href="${escapeHtml(url)}">${escapeHtml(label)} ↗</a></li>`).join('');
  const decisions = project.adrs.map(adr => `<details>
    <summary>${escapeHtml(adr.title)}</summary>
    <dl class="decision-notes"><dt>Context</dt><dd>${escapeHtml(adr.context)}</dd><dt>Decision</dt><dd>${escapeHtml(adr.decision)}</dd><dt>Trade-offs</dt><dd>${escapeHtml(adr.tradeOffs)}</dd><dt>Verification</dt><dd>${escapeHtml(adr.verification)}</dd></dl>
  </details>`).join('');
  const constraints = [...new Set([...project.securityConsiderations, ...architectureBlueprint.invariants])];
  const visual = featuredIds.includes(id) ? projectMedia(id, '../') : technicalVisual(project);
  const { end, next: nextBand } = caseFooter(action(repoUrl, 'View source on GitHub') + (liveDemoUrl ? action(liveDemoUrl, 'Open the live demo', { secondary: true }) : ''), next);
  return frame({
    page: 'project', title: name, description: headline, prefix: '../', type: 'article',
    body: `${caseOpening(id, [['Type', 'Open-source engineering'], ['Release', version], ['Stack', languages.join(' · ')], ['Automated tests', String(project.automatedTests)]], visual)}
    ${caseBody([
      ['01', 'Problem', 'Why it exists', `<p class="case-lead">${escapeHtml(problemStatement)}</p>`],
      ['02', 'Design', 'How it works', `
        <p>${escapeHtml(leadDecision.decision)}</p>
        <ol class="case-layers">${architectureBlueprint.layers.map(({ name: layer, responsibility }) => `<li><h3>${escapeHtml(layer)}</h3><p>${escapeHtml(responsibility)}</p></li>`).join('')}</ol>
        ${decisions}
        <details><summary>Security and operational constraints</summary><ul>${constraints.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></details>`],
      ['03', 'Evidence', 'How to verify it', `
        <div class="case-evidence"><p class="folio-label">Repository-reported / ${escapeHtml(headlineMetric.label)}</p><strong>${escapeHtml(headlineMetric.value)}</strong><p>${escapeHtml(headlineMetric.detail)}</p></div>
        <ul class="case-sources">${sources}</ul>
        <details><summary>Reproduce from the command line</summary><pre tabindex="0" aria-label="Reproduction commands"><code>${escapeHtml(project.cliQuickstart.join('\n'))}</code></pre></details>`]
    ], end)}
    ${nextBand}`
  });
}

function renderFunaCaseStudy() {
  const { end, next } = caseFooter(action(funaUrl, 'Visit Funa Gigs') + action(storeUrl, 'View on Google Play', { secondary: true }), 'cyber-dragon');
  return frame({
    page: 'project', title: 'Funa Gigs', description: 'How Funa Gigs connects local hiring, job approval, and mobile-money payments in Uganda.', prefix: '../', type: 'article',
    body: `${caseOpening('funa-gigs', [['My role', 'Founder & Project Lead'], ['Company', 'Jaminsa Ventures Limited'], ['Market', 'Uganda']], funaMedia('../'))}
    ${caseBody([
      ['01', 'Discovery', 'Two ways to hire', '<p class="case-lead">Someone with an urgent repair needs a different hiring flow from someone planning a project. Instant Hire finds available nearby taskers. Marketplace jobs let clients describe planned work and compare applicants.</p>'],
      ['02', 'Coordination', 'From match to completion', '<p class="case-lead">Clients and taskers can coordinate in the app, track the job, and approve completion before releasing payment.</p>'],
      ['03', 'Payment', 'Mobile money after approval', '<p class="case-lead">Funa Vault holds payment until the job is approved. Taskers can withdraw in UGX through MTN or Airtel Money.</p>']
    ], end)}
    ${next}`
  });
}

export function sitePages() {
  return [
    ['index.html', renderProfile()],
    ['work.html', renderWorkPage()],
    ['leadership.html', renderLeadershipPage()],
    ['cv.html', renderCvPage()],
    ['contact.html', renderContactPage()],
    [casePath('funa-gigs'), renderFunaCaseStudy()],
    ...projects.map(project => [casePath(project.id), renderTechnicalCase(project)])
  ];
}

export function renderNotFoundPage(prefix = './') {
  return frame({
    page: '', prefix, title: 'Page not found', description: 'Return to the portfolio to find the work you were looking for.',
    body: pageOpener({
      eyebrow: 'Error 404', title: 'Page not found', className: 'opener-full',
      lede: 'This page may have moved. Browse the current projects and case studies instead.',
      actions: `<div class="folio-actions">${action(prefix + 'work.html', 'Explore work', { arrow: '→' })}${action(prefix + 'index.html', 'Back to home', { secondary: true, arrow: '←' })}</div>`
    })
  });
}
