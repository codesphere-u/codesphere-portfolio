// Each exhibit is inspectable as ordinary HTML and becomes a tab set when enhanced.
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

function exhibit({ id, category, name, headline, intro, evidence, footnote }) {
  return `<article class="showcase-exhibit showcase-${id}">
    <div class="showcase-copy">
      <p class="folio-label">${category}</p>
      <h3>${name}</h3>
      <p class="showcase-headline">${headline}</p>
      <p>${intro}</p>
      <a class="folio-action folio-action-secondary" href="./work/${id}.html">Read the ${name} case study <span aria-hidden="true">↗</span></a>
    </div>
    <div class="showcase-stage" data-scroll-reveal="media">
      ${evidence}
      <p class="showcase-note">${footnote}</p>
    </div>
  </article>`;
}

function funaScreen({ name, image, alt, note }) {
  return `<figure class="evidence-screen">
    <div class="evidence-device"><img src="./src/media/${image}.webp" width="352" height="760" loading="lazy" decoding="async" alt="${alt}"></div>
    <figcaption><strong>${name}</strong><span>${note}</span></figcaption>
  </figure>`;
}

const funa = switcher('funa-flow', 'Funa Gigs hiring flow', [
  {
    label: 'Choose a service',
    content: funaScreen({
      name: 'Choose a service',
      image: 'funa-home',
      alt: 'Funa Gigs Android home screen showing Instant Hire and service categories',
      note: 'Instant Hire starts from the home screen. Customers can also browse categories or post a job for later.'
    })
  },
  {
    label: 'Find a worker',
    content: funaScreen({
      name: 'Find a worker',
      image: 'funa-work',
      alt: 'Funa Gigs Android matching screen showing a search for a nearby worker',
      note: 'The matching screen shows what the app is doing while it looks for an available tasker nearby.'
    })
  }
], 'evidence-switcher');

// Results from Cyber Dragon's built-in presets at 9d519b8. Message excerpts omit the example phone number.
function threatResult({ label, message, score, level, signals, caution }) {
  return `<div class="evidence-result">
    <p class="evidence-kicker">${label} · Message excerpt</p>
    <blockquote>${message}</blockquote>
    <div class="threat-result ${score ? 'threat-high' : 'threat-low'}"><strong>${score}<span>/100</span></strong><span>${level}</span></div>
    <ul class="evidence-signals">${signals.map(signal => `<li>${signal}</li>`).join('')}</ul>
    <p class="evidence-caution">${caution}</p>
  </div>`;
}

const cyber = switcher('cyber-sample', 'Cyber Dragon sample messages', [
  {
    label: 'Fake reversal',
    content: threatResult({
      label: 'Fake reversal', message: '“Please approve the reversal prompt with your MoMo PIN immediately…”',
      score: 92, level: 'High risk',
      signals: ['Credential request', 'Mobile-money context', 'Reversal pattern', 'Urgency'],
      caution: 'The heuristic engine flags signals in the text without opening a link.'
    })
  },
  {
    label: 'Meeting reminder',
    content: threatResult({
      label: 'Meeting reminder', message: '“Hi team, our sprint planning meeting starts at 10:00 AM tomorrow…”',
      score: 0, level: 'Low indicators',
      signals: ['No strong indicators found'],
      caution: 'A low score does not establish that a message is safe.'
    })
  }
], 'evidence-switcher');

function replayResult({ window, status, result, note, changed = false }) {
  return `<div class="evidence-result replay-sample">
    <p class="evidence-kicker">prometheus.query_metrics</p>
    <pre><code>{ "service": "payment-api", "window": "${window}" }</code></pre>
    <p class="replay-status${changed ? ' replay-changed' : ''}">${status}</p>
    <pre><code>${result}</code></pre>
    <p class="evidence-caution">${note}</p>
  </div>`;
}

const agentflight = switcher('agent-replay', 'AgentFlight replay inputs', [
  {
    label: 'Replay 15 minutes',
    content: replayResult({
      window: '15m', status: 'Matched the recorded tool call',
      result: '{\n  "anomaly": true,\n  "p99_latency_ms": 1840.0\n}',
      note: 'A matching call returns the recorded response without calling the live tool.'
    })
  },
  {
    label: 'Change to 30 minutes',
    content: replayResult({
      window: '30m', status: 'TrajectoryDivergenceError', changed: true,
      result: 'changed_values.window\n  expected: "15m"\n  actual:   "30m"',
      note: 'The tool name still matches, but the changed argument is enough to fail the replay.'
    })
  }
], 'evidence-switcher');

export function renderShowcase() {
  return switcher('portfolio-showcase', 'Choose a featured project', [
    {
      label: 'Funa Gigs',
      content: exhibit({
        id: 'funa-gigs', category: 'Product leadership', name: 'Funa Gigs',
        headline: 'From looking for help to finding someone nearby.',
        intro: 'Walk through the opening steps of Instant Hire, part of the marketplace I lead under Jaminsa Ventures Limited.',
        evidence: funa, footnote: 'Official Funa Gigs Android screenshots · Google Play'
      })
    },
    {
      label: 'Cyber Dragon',
      content: exhibit({
        id: 'cyber-dragon', category: 'Defensive security', name: 'Cyber Dragon',
        headline: 'See why a message raises a flag.',
        intro: 'Compare a mobile-money reversal lure with an ordinary meeting reminder to see how the heuristic engine explains the difference.',
        evidence: cyber, footnote: 'Recorded analyzer output · Two built-in Cyber Dragon presets'
      })
    },
    {
      label: 'AgentFlight',
      content: exhibit({
        id: 'agentflight', category: 'Developer tools', name: 'AgentFlight',
        headline: 'Change one input. See exactly what broke.',
        intro: 'Replay a recorded tool call from a simulated incident, then change the time window and inspect the mismatch.',
        evidence: agentflight, footnote: 'Recorded replay output · AgentFlight README’s simulated incident'
      })
    }
  ], 'project-showcase');
}
