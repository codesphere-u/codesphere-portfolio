const portfolioName = 'Akandwanaho Ivan Alvin';
const storeUrl = 'https://play.google.com/store/apps/details?id=com.codesphereinnovations.funa_giggs';

function action(href, label, { secondary = false, arrow = '↗' } = {}) {
  return `<a class="folio-action${secondary ? ' folio-action-secondary' : ''}" href="${href}">${label}<span aria-hidden="true">${arrow}</span></a>`;
}

function frame({ title, description, body, prefix = './', sectionPrefix = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#f6f4ee">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta name="twitter:card" content="summary">
  <link rel="stylesheet" href="${prefix}src/ui/profile.css">
</head>
<body class="folio">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="folio-header" role="banner">
    <div class="folio-container folio-header-inner">
      <a class="folio-brand" href="${prefix}index.html"><span aria-hidden="true" class="folio-monogram">IA</span><span>Ivan Alvin</span></a>
      <nav aria-label="Main navigation">
        <a href="${sectionPrefix}#projects">Work</a>
        <a href="${sectionPrefix}#experience">Leadership</a>
        <a href="${sectionPrefix}#engineering">Engineering</a>
        <a href="${sectionPrefix}#contact">Contact <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
  </header>
${body}
  <footer class="folio-footer"><div class="folio-container">
    <span>${portfolioName} · Kampala, Uganda</span>
    <a href="https://github.com/codesphere-u/codesphere-portfolio">Source on GitHub ↗</a>
  </div></footer>
</body>
</html>`;
}

function funaMedia(prefix) {
  return `<figure class="project-media funa-media">
    <div class="funa-screens">
      <img src="${prefix}src/media/funa-home.webp" width="352" height="760" loading="lazy" decoding="async" alt="Funa Gigs app home screen">
      <img src="${prefix}src/media/funa-work.webp" width="352" height="760" loading="lazy" decoding="async" alt="Funa Gigs app matching a client with a nearby worker">
    </div>
    <figcaption>Official Android app previews · Google Play</figcaption>
  </figure>`;
}

export function renderProfile(profile) {
  const description = 'Akandwanaho Ivan Alvin is a software engineer, cybersecurity practitioner and founder based in Kampala, Uganda.';
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
    title: `${portfolioName} | Software Engineer &amp; Founder`,
    description,
    body: `
  <script type="application/ld+json">${structured}</script>
  <main id="main-content" tabindex="-1" role="main">
    <section class="folio-opening" aria-labelledby="hero-heading">
      <div class="folio-container folio-hero">
      <div class="hero-copy">
        <p class="folio-label hero-location"><span aria-hidden="true"></span> Kampala, Uganda</p>
        <h1 id="hero-heading"><span>Akandwanaho</span> <span>Ivan Alvin</span></h1>
        <p class="hero-role">Software engineer &amp; founder</p>
        <p class="hero-intro">I lead Codesphere Innovations in Kampala. My work spans a marketplace for hiring local workers, tools for spotting mobile-money scams, and infrastructure for testing AI agents.</p>
        <div class="folio-actions">
          ${action('#projects', 'See selected work', { arrow: '↓' })}
          ${action('#experience', 'My leadership roles', { secondary: true, arrow: '→' })}
        </div>
      </div>
      <figure class="hero-portrait">
        <div class="hero-photo"><img src="./src/media/alvin.webp" width="1254" height="1254" alt="Portrait of Akandwanaho Ivan Alvin" fetchpriority="high"></div>
        <figcaption><span>Akandwanaho Ivan Alvin</span><span>Based in Kampala</span></figcaption>
      </figure>
      </div>
      <nav class="folio-container work-shortcuts" aria-label="Jump to a featured project">
        <a href="#funa-gigs"><span class="folio-label">01 / Product leadership</span><strong>Funa Gigs</strong><span class="shortcut-arrow" aria-hidden="true">↓</span></a>
        <a href="#cyber-dragon"><span class="folio-label">02 / Defensive security</span><strong>Cyber Dragon</strong><span class="shortcut-arrow" aria-hidden="true">↓</span></a>
        <a href="#agentflight"><span class="folio-label">03 / Developer tools</span><strong>AgentFlight</strong><span class="shortcut-arrow" aria-hidden="true">↓</span></a>
      </nav>
    </section>
    <section id="projects" class="folio-work" aria-labelledby="work-heading">
      <div class="folio-container">
        <div class="folio-section-heading">
          <div><p class="folio-label">01 / Projects</p><h2 id="work-heading">Selected work</h2></div>
          <p>Three projects that show how I lead a product and engineer for trust, safety, and reproducibility.</p>
        </div>

        <article id="funa-gigs" class="folio-project folio-project-featured">
          ${funaMedia('./')}
          <div class="project-copy">
            <p class="folio-label">01 / Product leadership</p>
            <h3>Funa Gigs</h3>
            <p class="project-deck">Hire nearby. Pay after the work is approved.</p>
            <p>As founder and project lead under Jaminsa Ventures Limited, I lead a marketplace for clients who need help now and those who want to compare applicants for planned work.</p>
            <ol class="funa-flow" aria-label="Funa Gigs hiring flow">
              <li><span>01</span> Match with a tasker</li>
              <li><span>02</span> Approve the work</li>
              <li><span>03</span> Release payment in UGX</li>
            </ol>
            <div class="folio-actions">
              ${action('./cases/funa-gigs.html', 'Read the case study', { arrow: '→' })}
              ${action('https://www.funagigs.com/', 'Live product', { secondary: true })}
            </div>
          </div>
        </article>

        <div class="folio-project-pair">
          <article id="cyber-dragon" class="folio-project">
            <figure class="project-media cyber-media">
              <img src="./src/media/cyber-dragon.webp" width="960" height="932" loading="lazy" decoding="async" alt="Cyber Dragon workbench with scam inspection modes and built-in scenarios">
              <figcaption>Live inspection workbench</figcaption>
            </figure>
            <div class="project-copy">
              <p class="folio-label">02 / Cybersecurity</p>
              <h3>Cyber Dragon</h3>
              <p class="project-deck">Inspect a suspicious message before acting on it.</p>
              <p>Opening a suspicious link to investigate it can create another risk. Cyber Dragon inspects text, lookalike URLs, and USSD codes locally and explains which signals triggered its assessment.</p>
              <p class="project-proof"><strong>Try it</strong> Load the built-in MTN MoMo reversal scenario in the workbench.</p>
              <div class="folio-actions">
                ${action('./cases/cyber-dragon.html', 'Read the case study', { arrow: '→' })}
                ${action(profile.liveDemoUrl, 'Try a sample', { secondary: true })}
              </div>
            </div>
          </article>

          <article id="agentflight" class="folio-project">
            <figure class="project-media replay-media">
              <div class="replay-window">
                <div class="replay-bar"><span class="replay-dot" aria-hidden="true"></span><span>incident.flight.json</span></div>
                <div class="replay-content">
                  <p class="replay-file">Recorded tool call · payment-api · 15m</p>
                  <pre aria-label="Recorded AgentFlight response"><code>{
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
              <figcaption>AgentFlight README example · simulated incident</figcaption>
            </figure>
            <div class="project-copy">
              <p class="folio-label">03 / Open-source engineering</p>
              <h3>AgentFlight</h3>
              <p class="project-deck">Replay an AI agent’s failure in a test.</p>
              <p>Live model calls make regressions hard to reproduce. AgentFlight records model turns and tool calls so developers can replay the same run and catch changed arguments.</p>
              <p class="project-proof"><strong>Inspect it</strong> Open the replay comparison above to see a real mismatch.</p>
              <div class="folio-actions">
                ${action('./cases/agentflight.html', 'Read the case study', { arrow: '→' })}
                ${action('https://github.com/codesphere-u/agentflight', 'GitHub', { secondary: true })}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="experience" class="folio-leadership" aria-labelledby="leadership-heading">
      <div class="folio-container leadership-grid">
        <div>
          <p class="folio-label">02 / Experience</p>
          <h2 id="leadership-heading">Building teams<br>and products</h2>
          <p>My work spans product direction, architecture, and hands-on engineering. I studied at ISBAT University in Kampala.</p>
          ${action(profile.companyWebsiteUrl, 'Visit Codesphere Innovations', { secondary: true })}
        </div>
        <ol class="leadership-list">
          <li><span class="folio-label">Current</span><div><h3>Codesphere Innovations</h3><p>Founder &amp; Managing Director</p></div><a href="${profile.companyWebsiteUrl}" aria-label="Visit Codesphere Innovations">↗</a></li>
          <li><span class="folio-label">Current</span><div><h3>Funa Gigs</h3><p>Founder &amp; Project Lead · Jaminsa Ventures Limited</p></div><a href="./cases/funa-gigs.html" aria-label="Read the Funa Gigs case study">↗</a></li>
          <li><span class="folio-label">Until March 2025</span><div><h3>Waanverse Labs Inc.</h3><p>CTO &amp; Head of Engineering</p></div></li>
          <li><span class="folio-label">Earlier</span><div><h3>4codex Technologies</h3><p>Founder</p></div></li>
        </ol>
      </div>
    </section>

    <section id="engineering" class="folio-engineering" aria-labelledby="engineering-heading">
      <div class="folio-container">
        <div class="folio-section-heading">
          <div><p class="folio-label">03 / Engineering decisions</p><h2 id="engineering-heading">Inside the systems</h2></div>
          <p>Three examples of how I design for accountability, from AI permissions to ledger integrity and incident diagnosis.</p>
        </div>
        <div class="decision-list">
          <article><p class="folio-label">AI security</p><h3>Put a policy in front of every tool call.</h3><p>AgentShield checks what an agent is allowed to do and records policy decisions in a hash-chained audit log.</p><a href="./cases/agentshield.html">AgentShield case study <span aria-hidden="true">↗</span></a></article>
          <article><p class="folio-label">Financial infrastructure</p><h3>Keep every ledger entry balanced.</h3><p>FlowLedger uses double-entry accounting and integer minor units to keep floating-point rounding out of balances.</p><a href="./cases/flowledger.html">FlowLedger case study <span aria-hidden="true">↗</span></a></article>
          <article><p class="folio-label">Cloud observability</p><h3>Measure where the time went.</h3><p>StackPulse accounts for overlapping spans so a trace can distinguish time spent in a service from time spent waiting on its dependencies.</p><a href="./cases/stackpulse.html">StackPulse case study <span aria-hidden="true">↗</span></a></article>
        </div>
      </div>
    </section>

    <section id="contact" class="folio-contact" aria-labelledby="contact-heading">
      <div class="folio-container">
        <p class="folio-label">04 / Contact</p>
        <h2 id="contact-heading">Let’s talk.</h2>
        <p>Have a product to build, a system to secure, or an engineering team to grow? Tell me what you’re working on.</p>
        <div class="folio-actions">${action(profile.linkedinUrl, 'Message me on LinkedIn')}${action(profile.githubUrl, 'Explore my GitHub', { secondary: true })}</div>
      </div>
    </section>
  </main>`
  });
}

export function renderFunaCaseStudy() {
  return frame({
    title: `Funa Gigs | ${portfolioName}`,
    description: 'How Funa Gigs brings local hiring, job approval, and mobile-money payments together in Uganda.',
    prefix: '../',
    sectionPrefix: '../index.html',
    body: `
  <main id="main-content" class="folio-case" tabindex="-1" role="main">
    <div class="folio-container">
      <a class="folio-back" href="../index.html#funa-gigs">← Selected work</a>
      <p class="folio-label">Product case study / Uganda</p>
      <h1>Funa Gigs</h1>
      <p class="case-deck">From finding a nearby tasker to releasing payment after the job.</p>
      <dl class="case-facts"><div><dt>My role</dt><dd>Founder &amp; Project Lead</dd></div><div><dt>Company</dt><dd>Jaminsa Ventures Limited</dd></div><div><dt>Market</dt><dd>Uganda</dd></div></dl>
      ${funaMedia('../')}
      <div class="case-story">
        <section aria-labelledby="hiring-heading"><p class="folio-label">01 / Discovery</p><h2 id="hiring-heading">Two ways to hire</h2><p>Someone with an urgent repair needs a different hiring flow from someone planning a project. Instant Hire helps clients find available nearby taskers. Marketplace jobs let clients describe the work and compare applicants.</p></section>
        <section aria-labelledby="handoff-heading"><p class="folio-label">02 / Coordination</p><h2 id="handoff-heading">From match to completion</h2><p>Clients and taskers can coordinate in the app, track the work, and approve completion before the payment is released.</p></section>
        <section aria-labelledby="payment-heading"><p class="folio-label">03 / Payment</p><h2 id="payment-heading">Mobile money after approval</h2><p>Funa Vault holds payment until the job is approved. Taskers can withdraw in UGX through MTN or Airtel Money.</p></section>
        <div class="folio-actions">${action('https://www.funagigs.com/', 'Visit Funa Gigs')}${action(storeUrl, 'View on Google Play', { secondary: true })}</div>
      </div>
    </div>
  </main>`
  });
}
