import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';

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
  ['leadership', 'Leadership', 'leadership.html']
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
</head>
<body class="folio">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="folio-header" data-site-header>
    <div class="folio-container folio-header-inner">
      <a class="folio-brand" href="${prefix}index.html">
        <img src="${prefix}${logo}" width="42" height="42" alt="">
        <span>Akandwanaho Ivan <small>Software engineer &amp; founder</small></span>
      </a>
      <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" hidden>Menu <span aria-hidden="true"></span></button>
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
                  return `<li><a href="${prefix}${casePath(id)}"><strong>${name}</strong><small>${area}</small><span aria-hidden="true">↗</span></a></li>`;
                }).join('')}</ul>
                <a class="nav-all-work" href="${prefix}work.html">View all case studies <span aria-hidden="true">→</span></a>
              </div>
            </details>
          </li>
          <li class="nav-contact"><a href="${prefix}contact.html"${page === 'contact' ? ' aria-current="page"' : ''}>Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <main id="main-content" tabindex="-1">
${body}
  </main>
  <footer class="folio-footer"><div class="folio-container">
    <span>Akandwanaho Ivan <span class="footer-alias">· Also known as Alvin</span></span>
    <div><a href="${prefix}${logo}" download="akandwanaho-ivan.svg">Download logo</a><a href="${profile.githubUrl}">GitHub ↗</a></div>
  </div></footer>
  <script type="module" src="${prefix}src/ui/site-nav.mjs"></script>
</body>
</html>`;
}

function funaMedia(prefix) {
  return `<figure class="project-media funa-media">
    <div class="funa-screens">
      <img src="${prefix}src/media/funa-home.webp" width="352" height="760" loading="lazy" decoding="async" alt="Funa Gigs Android home screen with Instant Hire and service categories">
      <img src="${prefix}src/media/funa-work.webp" width="352" height="760" loading="lazy" decoding="async" alt="Funa Gigs Android worker-matching screen showing a nearby search in progress">
    </div>
    <figcaption>Funa Gigs Android app · Official Google Play screenshots</figcaption>
  </figure>`;
}

function projectMedia(id, prefix) {
  if (id === 'funa-gigs') return funaMedia(prefix);
  if (id === 'cyber-dragon') return `<figure class="project-media cyber-media">
    <img src="${prefix}src/media/cyber-dragon.webp" width="960" height="932" loading="lazy" decoding="async" alt="Cyber Dragon workbench with fraud inspection modes and built-in sample scenarios">
    <figcaption>Cyber Dragon · Live inspection workbench</figcaption>
  </figure>`;
  return `<figure class="project-media replay-media">
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

function featuredCards(prefix = './') {
  return featuredIds.map((id, index) => {
    const [name, area, headline, summary] = projectLeads[id];
    return `<article class="feature-card feature-${id}">
      <div class="feature-copy">
        <p class="folio-label">0${index + 1} / ${area}</p>
        <h3>${name}</h3>
        <p class="feature-headline">${headline}</p>
        <p>${summary}</p>
        ${action(prefix + casePath(id), `Read the ${name} case study`, { secondary: true, arrow: '→' })}
      </div>
      ${projectMedia(id, prefix)}
    </article>`;
  }).join('\n');
}

function sectionHeading(label, title, intro, id) {
  return `<div class="folio-section-heading">
    <div><p class="folio-label">${label}</p><h2 id="${id}">${title}</h2></div>
    <p>${intro}</p>
  </div>`;
}

function pageIntro(label, title, intro, actions = '') {
  return `<section class="page-intro"><div class="folio-container">
    <p class="folio-label">${label}</p><h1>${title}</h1><p class="page-lead">${intro}</p>${actions}
  </div></section>`;
}

function heroProjects() {
  const previews = {
    'funa-gigs': `<img src="./src/media/funa-home.webp" width="352" height="760" alt="" decoding="async">`,
    'cyber-dragon': `<img src="./src/media/cyber-dragon.webp" width="960" height="932" alt="" decoding="async">`,
    agentflight: `<span class="hero-trace" aria-hidden="true"><span>15m → replay</span><span>30m → diff</span></span>`
  };
  return featuredIds.map((id, index) => {
    const [name, area, headline] = projectLeads[id];
    return `<li><a class="hero-project preview-${id}" href="./${casePath(id)}">
      <div class="hero-project-copy"><span class="folio-label">0${index + 1} / ${area}</span><strong>${name}</strong><span class="hero-project-deck">${headline}</span></div>
      <span class="hero-project-image" aria-hidden="true">${previews[id]}</span>
      <span class="hero-project-arrow" aria-hidden="true">↗</span>
    </a></li>`;
  }).join('\n        ');
}

export function renderProfile() {
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
    <section class="folio-opening" aria-labelledby="hero-heading">
      <div class="hero-stage">
        <div class="hero-visual">
          <img src="./src/media/alvin.webp" width="1254" height="1254" alt="Studio portrait of Akandwanaho Ivan" fetchpriority="high">
        </div>
        <div class="folio-container folio-hero">
          <div class="hero-copy">
            <p class="folio-label hero-location"><span aria-hidden="true"></span> Kampala, Uganda · Also known as Alvin</p>
            <p class="hero-identity">Akandwanaho Ivan</p>
            <h1 id="hero-heading">I build systems <em>people can trust.</em></h1>
            <p class="hero-intro">I’m a software engineer and founder of Codesphere Innovations. I build for local hiring, mobile-money fraud defense, and AI agents that developers can test and audit.</p>
            <div class="folio-actions">
              ${action('./work.html', 'Explore my work', { arrow: '→' })}
              ${action('./leadership.html', 'Founder & engineering roles', { secondary: true, arrow: '→' })}
            </div>
          </div>
        </div>
      </div>
      <div class="hero-shelf"><div class="folio-container">
        <div class="hero-shelf-heading"><h2>Featured work</h2><a href="./work.html">All case studies <span aria-hidden="true">→</span></a></div>
        <ul class="hero-projects">${heroProjects()}</ul>
      </div></div>
    </section>
    <section class="folio-work" aria-labelledby="work-heading">
      <div class="folio-container">
        ${sectionHeading('01 / Selected work', 'Projects you can explore', 'See the product, the engineering decision behind it, and how to verify the result.', 'work-heading')}
        ${featuredCards()}
        <div class="section-end">${action('./work.html', 'See all project case studies', { secondary: true, arrow: '→' })}</div>
      </div>
    </section>
    <section class="home-leadership" aria-labelledby="leadership-heading">
      <div class="folio-container leadership-grid">
        <div><p class="folio-label">02 / Leadership</p><h2 id="leadership-heading">Building teams and products</h2></div>
        <div><p>I founded Codesphere Innovations and lead Funa Gigs under Jaminsa Ventures Limited. Before that, I led engineering at Waanverse Labs.</p>
        ${action('./leadership.html', 'See my leadership roles', { secondary: true, arrow: '→' })}</div>
      </div>
    </section>`
  });
}

export function renderWorkPage() {
  const list = projectIds.filter(id => !featuredIds.includes(id)).map(id => {
    const [name, area, headline] = projectLeads[id];
    return `<li><a href="./${casePath(id)}"><span class="folio-label">${area}</span><div><h3>${name}</h3><p>${headline}</p></div><span aria-hidden="true">↗</span></a></li>`;
  }).join('\n');
  return frame({
    page: 'work', title: 'Work', description: 'Product and engineering case studies by Akandwanaho Ivan.',
    body: `${pageIntro('Product · Security · Infrastructure', 'Selected work', 'Start with three featured projects or explore the systems I’ve built for agent safety, payments, observability, and more.')}
      <section class="folio-container work-page-section" aria-labelledby="featured-heading"><h2 id="featured-heading" class="work-feature-heading">Featured case studies</h2>
        ${featuredCards()}</section>
      <section class="folio-engineering" aria-labelledby="systems-heading"><div class="folio-container">
        ${sectionHeading('Open source', 'Inside the systems', 'Each case study explains the problem, the design, and how to check the evidence.', 'systems-heading')}
        <ul class="systems-list">${list}</ul>
      </div></section>`
  });
}

export function renderLeadershipPage() {
  return frame({
    page: 'leadership', title: 'Leadership', description: 'Akandwanaho Ivan’s founder and engineering leadership roles in Kampala.',
    body: `${pageIntro('Leadership / Kampala, Uganda', 'Building teams and products', 'I lead product direction and stay close to architecture and implementation. My engineering foundations come from studying at ISBAT University in Kampala and building software for local businesses.')}
      <section class="folio-container role-section" aria-labelledby="roles-heading">
        <p class="folio-label">Experience</p><h2 id="roles-heading">Where I’ve led</h2>
        <ol class="role-timeline">
          ${experience.map(item => `<li><p class="folio-label">${escapeHtml(item.status)}</p><div><h3>${escapeHtml(item.organization)}</h3><p class="role-title">${escapeHtml(item.role)}</p><p>${escapeHtml(item.summary)}</p>
            ${item.id === 'funa-gigs-jaminsa' ? action('./work/funa-gigs.html', 'Read the Funa Gigs case study', { secondary: true, arrow: '→' }) : ''}
            ${item.id === 'codesphere-innovations' ? action(item.websiteUrl, 'Visit Codesphere Innovations', { secondary: true }) : ''}
          </div></li>`).join('\n')}
        </ol>
      </section>`
  });
}

export function renderContactPage() {
  return frame({
    page: 'contact', title: 'Contact', description: 'Get in touch with Akandwanaho Ivan about engineering, technical leadership, or open-source work.',
    body: `${pageIntro('Kampala, Uganda', 'Let’s talk', 'Have a product to build, a system to secure, or an engineering team to grow? Tell me what you’re working on.', `<div class="folio-actions">${action(profile.linkedinUrl, 'Message me on LinkedIn')}</div>`)}
      <section class="folio-container contact-links" aria-label="Professional links">
        <article><p class="folio-label">Company</p><h2>Codesphere Innovations</h2><p>For product engineering and company inquiries.</p>${action(profile.companyWebsiteUrl, 'Visit Codesphere', { secondary: true })}</article>
        <article><p class="folio-label">Open source</p><h2>GitHub</h2><p>Explore my repositories and source code.</p>${action(profile.githubUrl, 'View GitHub profile', { secondary: true })}</article>
      </section>`
  });
}

function caseSection(number, label, title, content) {
  return `<section class="case-chapter" aria-labelledby="chapter-${number}">
    <div><p class="folio-label">${number} / ${label}</p><h2 id="chapter-${number}">${title}</h2></div>
    <div class="chapter-body">${content}</div>
  </section>`;
}

function caseOpening(id, facts, visual) {
  const [name, area, headline, summary] = projectLeads[id];
  return `<section class="folio-container case-opening" aria-labelledby="case-title">
    <a class="folio-back" href="../work.html">← All work</a>
    <div class="case-opening-grid">
      <div>
        <p class="folio-label">${area} / Case study</p>
        <h1 id="case-title">${name}</h1>
        <p class="case-headline">${headline}</p>
        ${summary ? `<p class="case-intro">${summary}</p>` : ''}
        <dl class="case-facts">${facts.map(([key, value]) => `<div><dt>${key}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>
      </div>
      ${visual}
    </div>
  </section>`;
}

function caseFooter(primary, nextId) {
  const [nextName] = projectLeads[nextId];
  return `<div class="case-end"><div class="folio-actions">${primary}</div>
    <a class="next-study" href="../${casePath(nextId)}"><span class="folio-label">Next case study</span><strong>${nextName}</strong><span aria-hidden="true">↗</span></a>
  </div>`;
}

function technicalVisual(project) {
  return `<figure class="project-media system-media">
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
  return frame({
    page: 'project', title: name, description: headline, prefix: '../', type: 'article',
    body: `${caseOpening(id, [['Type', 'Open-source engineering'], ['Release', version], ['Stack', languages.join(' · ')]], visual)}
    <div class="folio-container case-story">
      ${caseSection('01', 'Problem', 'Why it exists', `<p>${escapeHtml(problemStatement)}</p>`)}
      ${caseSection('02', 'Design', 'How it works', `
        <p>${escapeHtml(leadDecision.decision)}</p>
        <div class="case-layers">${architectureBlueprint.layers.map(({ name: layer, responsibility }) => `<article><h3>${escapeHtml(layer)}</h3><p>${escapeHtml(responsibility)}</p></article>`).join('')}</div>
        ${decisions}
        <details><summary>Security and operational constraints</summary><ul>${constraints.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></details>`)}
      ${caseSection('03', 'Evidence', 'How to verify it', `
        <div class="case-evidence"><p class="folio-label">Repository-reported / ${escapeHtml(headlineMetric.label)}</p><strong>${escapeHtml(headlineMetric.value)}</strong><p>${escapeHtml(headlineMetric.detail)}</p></div>
        <ul class="case-sources">${sources}</ul>
        <details><summary>Reproduce from the command line</summary><pre tabindex="0" aria-label="Reproduction commands"><code>${escapeHtml(project.cliQuickstart.join('\n'))}</code></pre></details>`)}
      ${caseFooter(action(repoUrl, 'View source on GitHub') + (liveDemoUrl ? action(liveDemoUrl, 'Open the live demo', { secondary: true }) : ''), next)}
    </div>`
  });
}

function renderFunaCaseStudy() {
  return frame({
    page: 'project', title: 'Funa Gigs', description: 'How Funa Gigs connects local hiring, job approval, and mobile-money payments in Uganda.', prefix: '../', type: 'article',
    body: `${caseOpening('funa-gigs', [['My role', 'Founder & Project Lead'], ['Company', 'Jaminsa Ventures Limited'], ['Market', 'Uganda']], funaMedia('../'))}
    <div class="folio-container case-story">
      ${caseSection('01', 'Discovery', 'Two ways to hire', '<p>Someone with an urgent repair needs a different hiring flow from someone planning a project. Instant Hire finds available nearby taskers. Marketplace jobs let clients describe planned work and compare applicants.</p>')}
      ${caseSection('02', 'Coordination', 'From match to completion', '<p>Clients and taskers can coordinate in the app, track the job, and approve completion before releasing payment.</p>')}
      ${caseSection('03', 'Payment', 'Mobile money after approval', '<p>Funa Vault holds payment until the job is approved. Taskers can withdraw in UGX through MTN or Airtel Money.</p>')}
      ${caseFooter(action(funaUrl, 'Visit Funa Gigs') + action(storeUrl, 'View on Google Play', { secondary: true }), 'cyber-dragon')}
    </div>`
  });
}

export function sitePages() {
  return [
    ['index.html', renderProfile()],
    ['work.html', renderWorkPage()],
    ['leadership.html', renderLeadershipPage()],
    ['contact.html', renderContactPage()],
    [casePath('funa-gigs'), renderFunaCaseStudy()],
    ...projects.map(project => [casePath(project.id), renderTechnicalCase(project)])
  ];
}

export function renderNotFoundPage(prefix = './') {
  return frame({
    page: '', prefix, title: 'Page not found', description: 'Return to the portfolio to find the work you were looking for.',
    body: pageIntro('404', 'Page not found', 'Browse the current projects and case studies.', `<div class="folio-actions">${action(prefix + 'work.html', 'Explore work', { arrow: '→' })}</div>`)
  });
}
