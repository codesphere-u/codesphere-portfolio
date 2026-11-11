// "The Exhibition": the home page's selected work.
// The markup reads as three ordinary project articles; showcase.mjs pins them into a
// scroll-driven stage on large screens and turns each demo's options into tabs.

function switcher(id, label, items, className) {
  return `<div class="${className}" data-switcher>
    <div class="switcher-controls" data-switcher-controls aria-label="${label}" hidden>
      ${items.map(({ label: name }, index) => `<button type="button" id="${id}-tab-${index + 1}" aria-controls="${id}-panel-${index + 1}">
        <span class="switcher-number" aria-hidden="true">0${index + 1}</span><span>${name}</span>
      </button>`).join('\n      ')}
    </div>
    ${items.map(({ content }, index) => `<div id="${id}-panel-${index + 1}" data-switcher-panel>${content}</div>`).join('\n    ')}
  </div>`;
}

// Funa Gigs: the real Google Play screenshots in a phone, with a radar behind it.
const radar = '<div class="funa-radar" aria-hidden="true"><i></i><i></i><i></i><b style="--a: 32deg; --d: 128px"></b><b style="--a: 148deg; --d: 152px"></b><b style="--a: 251deg; --d: 112px"></b><b style="--a: 318deg; --d: 170px"></b></div>';

function funaStep({ name, image, alt, note, searching = false }) {
  return `<figure class="funa-step${searching ? ' funa-searching' : ''}">
    <div class="funa-phone-wrap">${searching ? radar : '<span class="funa-glow" aria-hidden="true"></span>'}<div class="funa-phone"><img src="./src/media/${image}.webp" width="352" height="760" loading="lazy" decoding="async" alt="${alt}"></div></div>
    <figcaption><strong>${name}</strong><span>${note}</span></figcaption>
  </figure>`;
}

const funa = `<div class="funa-demo" data-demo="funa">
  ${switcher('funa-flow', 'Funa Gigs hiring flow', [
    {
      label: 'Choose a service',
      content: funaStep({
        name: 'Choose a service', image: 'funa-home',
        alt: 'Funa Gigs Android home screen showing Instant Hire and service categories',
        note: 'Instant Hire starts from the home screen. Customers can also browse categories or post a job for later.'
      })
    },
    {
      label: 'Find a worker',
      content: funaStep({
        name: 'Find a worker', image: 'funa-work',
        alt: 'Funa Gigs Android matching screen showing a search for a nearby worker',
        note: 'The matching screen shows what the app is doing while it looks for an available tasker nearby.',
        searching: true
      })
    }
  ], 'demo-switcher')}
</div>`;

// Cyber Dragon: results from its built-in presets at 9d519b8. Excerpts omit the example phone number.
// Highlights show where each reported signal appears in the message text.
function scan({ message, score, level, signals, caution }) {
  const risk = score >= 50 ? 'high' : 'low';
  return `<div class="scan-result scan-${risk}" data-scan style="--score: ${score}">
    <p class="demo-kicker">Message excerpt</p>
    <div class="scan-message"><p>${message}</p><span class="scan-beam" aria-hidden="true"></span></div>
    <div class="scan-readout">
      <div class="scan-gauge">
        <svg viewBox="0 0 120 68" aria-hidden="true" focusable="false"><path class="gauge-track" d="M10 62 A50 50 0 0 1 110 62" pathLength="100"/><path class="gauge-value" d="M10 62 A50 50 0 0 1 110 62" pathLength="100"/></svg>
        <p><strong data-score="${score}">${score}</strong><small>/100</small></p>
        <span>${level}</span>
      </div>
      <ul class="scan-signals">${signals.map((signal, index) => `<li data-signal="${index}">${signal}</li>`).join('')}</ul>
    </div>
    <p class="demo-caution">${caution}</p>
  </div>`;
}

const cyber = switcher('cyber-sample', 'Cyber Dragon sample messages', [
  {
    label: 'Fake reversal',
    content: scan({
      message: '“Please approve the <mark data-signal="2">reversal</mark> prompt with your <mark data-signal="1">MoMo</mark> <mark data-signal="0">PIN</mark> <mark data-signal="3">immediately</mark>…”',
      score: 92, level: 'High risk',
      signals: ['Credential request', 'Mobile-money context', 'Reversal pattern', 'Urgency'],
      caution: 'The heuristic engine flags signals in the text without opening a link. Highlights show where each signal appears.'
    })
  },
  {
    label: 'Meeting reminder',
    content: scan({
      message: '“Hi team, our sprint planning meeting starts at 10:00 AM tomorrow…”',
      score: 0, level: 'Low indicators',
      signals: ['No strong indicators found'],
      caution: 'A low score does not establish that a message is safe.'
    })
  }
], 'demo-switcher');

// AgentFlight: recorded replay output from the README's simulated incident.
function replay({ window, changed, lines, note }) {
  return `<div class="replay-run${changed ? ' replay-diverged' : ''}" data-replay>
    <ol class="console-lines">
      <li class="line-recorded"><span class="line-tag">recorded</span><code>prometheus.query_metrics({ "service": "payment-api", "window": "15m" })</code></li>
      <li><span class="line-tag">replay</span><code data-type>prometheus.query_metrics({ "service": "payment-api", "window": ${changed ? `<mark>"${window}"</mark>` : `"${window}"`} })</code></li>
      ${lines}
    </ol>
    <p class="demo-caution">${note}</p>
  </div>`;
}

const agentflight = `<div class="replay-console">
  <div class="console-bar" aria-hidden="true"><i></i><i></i><i></i><span>agentflight · replay</span></div>
  ${switcher('agent-replay', 'AgentFlight replay inputs', [
    {
      label: 'window: "15m"',
      content: replay({
        window: '15m', changed: false,
        lines: `<li class="line-ok"><span class="line-tag">✓ match</span><span>Matched the recorded tool call</span></li>
      <li class="line-output"><pre><code>{
  "anomaly": true,
  "p99_latency_ms": 1840.0
}</code></pre></li>`,
        note: 'A matching call returns the recorded response without calling the live tool.'
      })
    },
    {
      label: 'window: "30m"',
      content: replay({
        window: '30m', changed: true,
        lines: `<li class="line-error"><span class="line-tag">✗ fail</span><strong>TrajectoryDivergenceError</strong></li>
      <li class="line-output"><pre><code>changed_values.window
<del>- expected: "15m"</del>
<ins>+ actual:   "30m"</ins></code></pre></li>`,
        note: 'The tool name still matches, but the changed argument is enough to fail the replay.'
      })
    }
  ], 'demo-switcher')}
</div>`;

const chapters = [
  {
    id: 'funa-gigs', category: 'Product leadership', name: 'Funa Gigs',
    headline: 'From looking for help to finding someone nearby.',
    intro: 'Walk through the opening steps of Instant Hire, part of the marketplace I lead under Jaminsa Ventures Limited.',
    demo: funa, footnote: 'Official Funa Gigs Android screenshots · Google Play'
  },
  {
    id: 'cyber-dragon', category: 'Defensive security', name: 'Cyber Dragon',
    headline: 'See why a message raises a flag.',
    intro: 'Compare a mobile-money reversal lure with an ordinary meeting reminder to see how the heuristic engine explains the difference.',
    demo: cyber, footnote: 'Recorded analyzer output · Two built-in Cyber Dragon presets'
  },
  {
    id: 'agentflight', category: 'Developer tools', name: 'AgentFlight',
    headline: 'Change one input. See exactly what broke.',
    intro: 'Replay a recorded tool call from a simulated incident, then change the time window and inspect the mismatch.',
    demo: agentflight, footnote: 'Recorded replay output · AgentFlight README’s simulated incident'
  }
];

function chapter({ id, category, name, headline, intro, demo, footnote }, index) {
  const number = String(index + 1).padStart(2, '0');
  return `<article id="portfolio-showcase-panel-${index + 1}" class="chapter chapter-${id}" data-chapter="${id}" aria-labelledby="chapter-title-${index + 1}">
      <div class="chapter-inner">
        <span class="chapter-numeral" aria-hidden="true">${number}</span>
        <div class="chapter-copy">
          <p class="chapter-label"><span>${number}</span>${category}</p>
          <h3 id="chapter-title-${index + 1}">${name}</h3>
          <p class="chapter-headline">${headline}</p>
          <p class="chapter-intro">${intro}</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-top: 14px;">
            <a class="chapter-link" href="./work/${id}.html"><span>Read the ${name} case study</span><span class="chapter-link-arrow" aria-hidden="true">↗</span></a>
            ${id === 'agentflight' ? `<a class="chapter-link" href="https://agentflight-tau.vercel.app/" target="_blank" rel="noopener" style="color: var(--gold, #f4b94c); font-weight: 600;"><span>🚀 Launch Mission Control</span><span class="chapter-link-arrow" aria-hidden="true">↗</span></a>` : ''}
            ${id === 'cyber-dragon' ? `<a class="chapter-link" href="https://cyber-dragon-ivory.vercel.app/" target="_blank" rel="noopener" style="color: var(--gold, #f4b94c); font-weight: 600;"><span>🛡️ Launch Live App</span><span class="chapter-link-arrow" aria-hidden="true">↗</span></a>` : ''}
          </div>
        </div>
        <div class="chapter-stage">
          ${demo}
          <p class="chapter-note">${footnote}</p>
        </div>
      </div>
    </article>`;
}

export function renderShowcase() {
  return `<div class="exhibition" data-exhibition style="--chapters: ${chapters.length}">
    <div class="exhibition-frame">
    ${chapters.map(chapter).join('\n    ')}
      <nav class="exhibition-rail" aria-label="Featured projects">
        <ol>${chapters.map(({ name }, index) => `
          <li><button type="button" aria-controls="portfolio-showcase-panel-${index + 1}" data-chapter-link="${index}"><span aria-hidden="true">0${index + 1}</span>${name}</button></li>`).join('')}
        </ol>
        <span class="rail-progress" aria-hidden="true"><i></i></span>
        <p class="rail-counter" aria-hidden="true"><span data-counter>01</span> / 0${chapters.length}</p>
      </nav>
    </div>
  </div>`;
}
