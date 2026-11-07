import { PORTFOLIO_DATA } from '../data/portfolio-data.mjs';
import {
  filterProjects,
  sortBenchmarks,
  getKnowledgeNodeById,
  executeTerminalCommand,
  computePortfolioSummary
} from '../core/explorer.mjs';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderHeroArchitectureSceneSvg() {
  return `<svg class="hero-scene-svg" viewBox="0 0 540 460" role="img" aria-labelledby="heroSceneTitle heroSceneDesc">
    <title id="heroSceneTitle">Interactive Systems Architecture Scene</title>
    <desc id="heroSceneDesc">Connected engineering nodes representing AI Systems, Cybersecurity, Cloud Infrastructure, Fintech Ledgers, and Full-Stack Architecture with animated data signals.</desc>
    <defs>
      <radialGradient id="sceneOrb" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#387BFA" stop-opacity="0.34" />
        <stop offset="60%" stop-color="#53C9EE" stop-opacity="0.10" />
        <stop offset="100%" stop-color="#070B16" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="signalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#53C9EE" />
        <stop offset="50%" stop-color="#387BFA" />
        <stop offset="100%" stop-color="#F4B94C" />
      </linearGradient>
      <filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <circle cx="270" cy="230" r="205" fill="url(#sceneOrb)" />

    <!-- Outer & Inner Orbital Rings -->
    <g class="scene-orbit-outer">
      <circle cx="270" cy="230" r="172" fill="none" stroke="#387BFA" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="3 11" />
      <circle cx="270" cy="58" r="5" fill="#53C9EE" />
      <circle cx="442" cy="230" r="4" fill="#F4B94C" />
    </g>
    <g class="scene-orbit-inner">
      <circle cx="270" cy="230" r="134" fill="none" stroke="#53C9EE" stroke-opacity="0.32" stroke-width="1" stroke-dasharray="22 10 4 10" />
      <circle cx="136" cy="230" r="4" fill="#53C9EE" />
    </g>

    <!-- Delicate Connected Signal Lines -->
    <g stroke="#387BFA" stroke-opacity="0.38" stroke-width="1.2">
      <line x1="270" y1="132" x2="365" y2="182" />
      <line x1="365" y1="182" x2="365" y2="278" />
      <line x1="365" y1="278" x2="270" y2="328" />
      <line x1="270" y1="328" x2="175" y2="278" />
      <line x1="175" y1="278" x2="175" y2="182" />
      <line x1="175" y1="182" x2="270" y2="132" />
      <line x1="270" y1="132" x2="270" y2="328" stroke-dasharray="4 6" />
      <line x1="175" y1="182" x2="365" y2="278" stroke-dasharray="4 6" />
      <line x1="365" y1="182" x2="175" y2="278" stroke-dasharray="4 6" />
    </g>

    <!-- Moving Data Signal Path -->
    <polygon class="scene-signal-path" points="270,132 365,182 365,278 270,328 175,278 175,182" fill="#101B2E" fill-opacity="0.62" stroke="url(#signalGrad)" stroke-width="2" />

    <!-- Core Architecture Hub -->
    <circle cx="270" cy="230" r="64" fill="#070B16" stroke="#53C9EE" stroke-width="1.5" stroke-opacity="0.8" />
    <text x="270" y="216" text-anchor="middle" class="scene-mono" font-size="11" font-weight="700" fill="#53C9EE" letter-spacing="2">DESIGN</text>
    <text x="270" y="235" text-anchor="middle" class="scene-mono" font-size="13" font-weight="800" fill="#F7FAFF" letter-spacing="2.5">BUILD</text>
    <text x="270" y="254" text-anchor="middle" class="scene-mono" font-size="11" font-weight="700" fill="#F4B94C" letter-spacing="2">SECURE</text>

    <!-- Perimeter Architecture Nodes -->
    <g class="scene-node-pulse">
      <circle cx="270" cy="132" r="7" fill="#53C9EE" filter="url(#nodeGlow)" />
      <circle cx="270" cy="132" r="3.5" fill="#F7FAFF" />
    </g>
    <circle cx="365" cy="182" r="5.5" fill="#F4B94C" />
    <circle cx="365" cy="278" r="5.5" fill="#53C9EE" />
    <circle cx="270" cy="328" r="5.5" fill="#387BFA" />
    <circle cx="175" cy="278" r="5.5" fill="#F4B94C" />
    <circle cx="175" cy="182" r="5.5" fill="#53C9EE" />

    <!-- Floating Technical Annotation Badges -->
    <g class="scene-mono" font-size="10.5" font-weight="600">
      <rect x="195" y="76" width="150" height="28" rx="6" fill="#101B2E" stroke="#53C9EE" stroke-opacity="0.5" />
      <text x="270" y="94" text-anchor="middle" fill="#F7FAFF">01 / AI &amp; AGENTS</text>

      <rect x="382" y="160" width="142" height="28" rx="6" fill="#101B2E" stroke="#F4B94C" stroke-opacity="0.55" />
      <text x="453" y="178" text-anchor="middle" fill="#F4B94C">02 / CYBERSECURITY</text>

      <rect x="382" y="268" width="142" height="28" rx="6" fill="#101B2E" stroke="#53C9EE" stroke-opacity="0.5" />
      <text x="453" y="286" text-anchor="middle" fill="#53C9EE">03 / CLOUD &amp; SRE</text>

      <rect x="195" y="352" width="150" height="28" rx="6" fill="#101B2E" stroke="#387BFA" stroke-opacity="0.55" />
      <text x="270" y="370" text-anchor="middle" fill="#98AFC8">04 / FINTECH LEDGERS</text>

      <rect x="14" y="268" width="146" height="28" rx="6" fill="#101B2E" stroke="#F4B94C" stroke-opacity="0.5" />
      <text x="87" y="286" text-anchor="middle" fill="#F4B94C">05 / REAL-TIME APPS</text>

      <rect x="14" y="160" width="146" height="28" rx="6" fill="#101B2E" stroke="#53C9EE" stroke-opacity="0.5" />
      <text x="87" y="178" text-anchor="middle" fill="#F7FAFF">06 / OPEN SOURCE</text>
    </g>
  </svg>`;
}

export function renderJourneyStageHtml(chapter, isActive = false) {
  const techBadges = (chapter.technologies || [])
    .map((t) => `<span class="tech-pill">${escapeHtml(t)}</span>`)
    .join('');

  return `<article class="journey-chapter-card ${isActive ? 'is-active' : ''}" data-chapter-panel="${chapter.stageNumber}" id="journey-panel-${chapter.stageNumber}" role="tabpanel" aria-labelledby="journey-tab-${chapter.stageNumber}" ${isActive ? '' : 'hidden'}>
    <div class="journey-chapter-header">
      <div class="journey-chapter-eyebrow">
        <span class="chapter-code-badge">CHAPTER ${escapeHtml(chapter.chapterCode)}</span>
        <span class="chapter-theme-tag">${escapeHtml(chapter.theme)}</span>
      </div>
      <h3 class="journey-chapter-title">${escapeHtml(chapter.title)}</h3>
      <p class="journey-chapter-subtitle">${escapeHtml(chapter.subtitle)}</p>
      <p class="journey-chapter-lead">${escapeHtml(chapter.description)}</p>
    </div>

    <div class="journey-story-grid">
      <div class="journey-story-box">
        <span class="story-box-label">01 / THE CHALLENGE</span>
        <p>${escapeHtml(chapter.challenge)}</p>
      </div>
      <div class="journey-story-box">
        <span class="story-box-label">02 / MY RESPONSIBILITY</span>
        <p>${escapeHtml(chapter.responsibility)}</p>
      </div>
      <div class="journey-story-box">
        <span class="story-box-label">03 / WHAT I LEARNED</span>
        <p>${escapeHtml(chapter.learned)}</p>
      </div>
      <div class="journey-story-box highlight-gold">
        <span class="story-box-label">04 / HOW IT SHAPED THE NEXT STAGE</span>
        <p>${escapeHtml(chapter.shapedNext)}</p>
      </div>
    </div>

    <div class="journey-tech-footer">
      <span class="story-box-label">TECHNOLOGIES &amp; PRACTICES INVOLVED</span>
      <div class="tech-pill-row">${techBadges}</div>
    </div>
  </article>`;
}

export function renderProjectVisualPreviewSvg(project) {
  const color = project.accentColor || '#53C9EE';
  switch (project.visualMotif) {
    case 'shield':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <path d="M42 16 L68 26 L68 48 C68 62 42 70 42 70 C42 70 16 62 16 48 L16 26 Z" fill="#101B2E" stroke="${color}" stroke-width="1.8" />
        <circle cx="42" cy="42" r="6" fill="${color}" />
        <line x1="88" y1="28" x2="256" y2="28" stroke="${color}" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="6 4" />
        <line x1="88" y1="44" x2="224" y2="44" stroke="#387BFA" stroke-opacity="0.5" stroke-width="2" />
        <line x1="88" y1="60" x2="196" y2="60" stroke="#F4B94C" stroke-opacity="0.6" stroke-width="2" />
        <text x="256" y="64" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9" fill="${color}">0 NETWORK FETCH</text>
      </svg>`;
    case 'waveform':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <path d="M18 42 Q 42 12, 66 42 T 114 42 T 162 42 T 210 42 T 258 42" fill="none" stroke="${color}" stroke-width="2" />
        <path d="M18 42 Q 42 68, 66 42 T 114 42 T 162 42 T 210 42 T 258 42" fill="none" stroke="#53C9EE" stroke-opacity="0.45" stroke-width="1.4" />
        <circle cx="114" cy="42" r="4" fill="#F4B94C" />
        <text x="258" y="72" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9" fill="#53C9EE">127.0.0.1 · BM25 RAG</text>
      </svg>`;
    case 'committee':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <circle cx="38" cy="26" r="7" fill="#101B2E" stroke="#53C9EE" stroke-width="1.5" />
        <circle cx="38" cy="58" r="7" fill="#101B2E" stroke="#53C9EE" stroke-width="1.5" />
        <circle cx="82" cy="42" r="7" fill="#101B2E" stroke="#387BFA" stroke-width="1.5" />
        <line x1="45" y1="26" x2="130" y2="42" stroke="#53C9EE" stroke-opacity="0.45" />
        <line x1="45" y1="58" x2="130" y2="42" stroke="#53C9EE" stroke-opacity="0.45" />
        <line x1="89" y1="42" x2="130" y2="42" stroke="#387BFA" stroke-opacity="0.6" />
        <polygon points="142,22 164,42 142,62 120,42" fill="#101B2E" stroke="${color}" stroke-width="1.8" />
        <line x1="164" y1="42" x2="232" y2="42" stroke="${color}" stroke-width="2" stroke-dasharray="4 4" />
        <rect x="232" y="28" width="32" height="28" rx="5" fill="#101B2E" stroke="#53C9EE" />
        <text x="142" y="76" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" fill="${color}">DEVIL'S ADVOCATE VETO</text>
      </svg>`;
    case 'firewall':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <rect x="22" y="18" width="54" height="48" rx="6" fill="#101B2E" stroke="#387BFA" />
        <line x1="76" y1="42" x2="122" y2="42" stroke="#53C9EE" stroke-width="2" />
        <rect x="122" y="14" width="36" height="56" rx="4" fill="#101B2E" stroke="${color}" stroke-width="2" />
        <line x1="158" y1="42" x2="206" y2="42" stroke="#F4B94C" stroke-width="2" stroke-dasharray="5 4" />
        <rect x="206" y="22" width="52" height="40" rx="6" fill="#101B2E" stroke="#F4B94C" />
        <text x="140" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="${color}">ALLOW/DENY</text>
      </svg>`;
    case 'graph':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <line x1="48" y1="26" x2="128" y2="42" stroke="#53C9EE" stroke-width="1.6" />
        <line x1="48" y1="58" x2="128" y2="42" stroke="#387BFA" stroke-width="1.6" stroke-dasharray="4 3" />
        <line x1="128" y1="42" x2="216" y2="28" stroke="#F4B94C" stroke-width="1.8" />
        <line x1="128" y1="42" x2="216" y2="58" stroke="#53C9EE" stroke-width="1.5" />
        <circle cx="48" cy="26" r="8" fill="#101B2E" stroke="#53C9EE" stroke-width="1.8" />
        <circle cx="48" cy="58" r="8" fill="#101B2E" stroke="#387BFA" stroke-width="1.5" />
        <circle cx="128" cy="42" r="11" fill="#101B2E" stroke="${color}" stroke-width="2" />
        <circle cx="216" cy="28" r="8" fill="#101B2E" stroke="#F4B94C" stroke-width="1.8" />
        <circle cx="216" cy="58" r="8" fill="#101B2E" stroke="#53C9EE" stroke-width="1.8" />
        <text x="262" y="74" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="8.5" fill="${color}">BI-TEMPORAL MCP</text>
      </svg>`;
    case 'cassette':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <rect x="24" y="16" width="232" height="52" rx="8" fill="#101B2E" stroke="${color}" stroke-width="1.6" />
        <circle cx="86" cy="42" r="14" fill="#070B16" stroke="#53C9EE" stroke-width="1.8" />
        <circle cx="86" cy="42" r="4" fill="#53C9EE" />
        <circle cx="194" cy="42" r="14" fill="#070B16" stroke="#F4B94C" stroke-width="1.8" />
        <circle cx="194" cy="42" r="4" fill="#F4B94C" />
        <line x1="100" y1="32" x2="180" y2="32" stroke="#53C9EE" stroke-width="1.5" stroke-dasharray="5 3" />
        <line x1="100" y1="52" x2="180" y2="52" stroke="#387BFA" stroke-width="1.5" />
        <text x="140" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="#F7FAFF">2.83 µs REPLAY</text>
      </svg>`;
    case 'ast':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <rect x="18" y="18" width="76" height="48" rx="6" fill="#101B2E" stroke="#387BFA" stroke-width="1.5" />
        <text x="56" y="38" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="#53C9EE">AST SLICE</text>
        <text x="56" y="52" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#98AFC8">-96.6% TOK</text>
        <line x1="94" y1="42" x2="132" y2="42" stroke="${color}" stroke-width="2" />
        <polygon points="154,16 182,42 154,68 126,42" fill="#101B2E" stroke="${color}" stroke-width="1.8" />
        <text x="154" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#F4B94C">RH01-08</text>
        <line x1="182" y1="42" x2="214" y2="42" stroke="#53C9EE" stroke-width="2" stroke-dasharray="4 3" />
        <rect x="214" y="22" width="48" height="40" rx="6" fill="#101B2E" stroke="#53C9EE" stroke-width="1.6" />
        <text x="238" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="#F7FAFF">TX OK</text>
      </svg>`;
    case 'router':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <circle cx="42" cy="42" r="14" fill="#101B2E" stroke="${color}" stroke-width="1.8" />
        <text x="42" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#F7FAFF">ROUTE</text>
        <line x1="56" y1="36" x2="136" y2="20" stroke="#53C9EE" stroke-width="1.8" />
        <line x1="56" y1="42" x2="136" y2="42" stroke="#387BFA" stroke-width="1.5" stroke-dasharray="4 3" />
        <line x1="56" y1="48" x2="136" y2="64" stroke="#F4B94C" stroke-width="1.5" stroke-dasharray="2 3" />
        <rect x="136" y="11" width="122" height="18" rx="4" fill="#101B2E" stroke="#53C9EE" />
        <text x="197" y="23" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#53C9EE">FAST_LOCAL · -90.6% $</text>
        <rect x="136" y="33" width="122" height="18" rx="4" fill="#101B2E" stroke="#387BFA" />
        <text x="197" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#98AFC8">BALANCED CASCADE</text>
        <rect x="136" y="55" width="122" height="18" rx="4" fill="#101B2E" stroke="#F4B94C" />
        <text x="197" y="67" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#F4B94C">FRONTIER REASONING</text>
      </svg>`;
    case 'swarm':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <rect x="18" y="14" width="54" height="22" rx="4" fill="#101B2E" stroke="#53C9EE" stroke-width="1.5" />
        <text x="45" y="28" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#53C9EE">WAVE 1A</text>
        <rect x="18" y="48" width="54" height="22" rx="4" fill="#101B2E" stroke="#387BFA" stroke-width="1.5" />
        <text x="45" y="62" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#98AFC8">WAVE 1B</text>
        <line x1="72" y1="25" x2="112" y2="42" stroke="#53C9EE" stroke-width="1.6" />
        <line x1="72" y1="59" x2="112" y2="42" stroke="#387BFA" stroke-width="1.6" />
        <rect x="112" y="26" width="66" height="32" rx="5" fill="#101B2E" stroke="${color}" stroke-width="1.8" />
        <text x="145" y="40" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#F7FAFF">RW LEASE</text>
        <text x="145" y="51" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="#F4B94C">0 RACE</text>
        <line x1="178" y1="42" x2="206" y2="42" stroke="#F4B94C" stroke-width="1.8" stroke-dasharray="4 3" />
        <rect x="206" y="24" width="56" height="36" rx="5" fill="#101B2E" stroke="#F4B94C" stroke-width="1.6" />
        <text x="234" y="40" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#F4B94C">RESUME</text>
        <text x="234" y="51" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="#53C9EE">-70% TOK</text>
      </svg>`;
    case 'truth':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <rect x="16" y="18" width="68" height="48" rx="6" fill="#101B2E" stroke="#387BFA" stroke-width="1.5" />
        <text x="50" y="38" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#F7FAFF">CLAIMS</text>
        <text x="50" y="51" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="#98AFC8">[doc#L12]</text>
        <line x1="84" y1="42" x2="116" y2="42" stroke="${color}" stroke-width="2" />
        <polygon points="144,14 174,42 144,70 114,42" fill="#101B2E" stroke="${color}" stroke-width="1.8" />
        <text x="144" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="${color}">TG01-08</text>
        <line x1="174" y1="42" x2="204" y2="42" stroke="#53C9EE" stroke-width="2" />
        <rect x="204" y="20" width="60" height="44" rx="6" fill="#101B2E" stroke="#53C9EE" stroke-width="1.6" />
        <text x="234" y="39" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#53C9EE">100% NLI</text>
        <text x="234" y="51" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="#F4B94C">0.115 ms</text>
      </svg>`;
    case 'aegis':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <circle cx="38" cy="24" r="7" fill="#101B2E" stroke="#53C9EE" stroke-width="1.5" />
        <circle cx="38" cy="42" r="7" fill="#101B2E" stroke="#387BFA" stroke-width="1.5" />
        <circle cx="38" cy="60" r="7" fill="#101B2E" stroke="#F4B94C" stroke-width="1.5" />
        <line x1="45" y1="24" x2="108" y2="42" stroke="#53C9EE" stroke-width="1.4" />
        <line x1="45" y1="42" x2="108" y2="42" stroke="#387BFA" stroke-width="1.4" />
        <line x1="45" y1="60" x2="108" y2="42" stroke="#F4B94C" stroke-width="1.4" />
        <polygon points="140,12 174,28 174,56 140,72 106,56 106,28" fill="#101B2E" stroke="${color}" stroke-width="1.8" />
        <text x="140" y="39" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#F7FAFF">7-GATE</text>
        <text x="140" y="51" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="${color}">RFC6962</text>
        <line x1="174" y1="42" x2="204" y2="42" stroke="#53C9EE" stroke-width="2" />
        <rect x="204" y="20" width="60" height="44" rx="6" fill="#101B2E" stroke="#53C9EE" stroke-width="1.6" />
        <text x="234" y="39" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#53C9EE">MERKLE</text>
        <text x="234" y="51" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="#F4B94C">0.27 ms</text>
      </svg>`;
    case 'ledger':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <rect x="20" y="22" width="66" height="40" rx="6" fill="#101B2E" stroke="${color}" stroke-width="1.6" />
        <rect x="107" y="22" width="66" height="40" rx="6" fill="#101B2E" stroke="#53C9EE" stroke-width="1.6" />
        <rect x="194" y="22" width="66" height="40" rx="6" fill="#101B2E" stroke="#387BFA" stroke-width="1.6" />
        <line x1="86" y1="42" x2="107" y2="42" stroke="${color}" stroke-width="2" />
        <line x1="173" y1="42" x2="194" y2="42" stroke="#53C9EE" stroke-width="2" />
        <text x="53" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" fill="${color}">DEBIT ==</text>
        <text x="140" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#53C9EE">CREDIT</text>
        <text x="227" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#F7FAFF">SHA-256</text>
      </svg>`;
    case 'trace':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <rect x="18" y="16" width="240" height="10" rx="3" fill="#387BFA" fill-opacity="0.85" />
        <rect x="44" y="32" width="120" height="10" rx="3" fill="#53C9EE" fill-opacity="0.85" />
        <rect x="92" y="48" width="152" height="10" rx="3" fill="#F4B94C" />
        <text x="258" y="74" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#F4B94C">CRITICAL PATH · 51.2 µs</text>
      </svg>`;
    case 'agro':
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <path d="M24 58 C 70 24, 130 24, 176 58" fill="none" stroke="${color}" stroke-width="2" />
        <path d="M24 66 C 70 12, 130 12, 176 66" fill="none" stroke="#F4B94C" stroke-opacity="0.5" stroke-width="1.2" stroke-dasharray="4 4" />
        <rect x="192" y="24" width="70" height="36" rx="6" fill="#101B2E" stroke="${color}" />
        <text x="227" y="46" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#F7FAFF">&lt;=160 SMS</text>
      </svg>`;
    case 'clinical':
    default:
      return `<svg viewBox="0 0 280 84" class="project-motif-svg" aria-hidden="true">
        <rect width="280" height="84" rx="8" fill="#070B16" />
        <polyline points="18,44 68,44 84,20 102,66 118,34 134,44 260,44" fill="none" stroke="${color}" stroke-width="2" />
        <circle cx="102" cy="66" r="3.5" fill="#F4B94C" />
        <text x="258" y="72" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#98AFC8">15 ADRs · TURBOREPO</text>
      </svg>`;
  }
}

export function renderProjectCardHtml(project) {
  const domainBadges = (project.domains || [])
    .map((d) => `<span class="domain-pill">${escapeHtml(d)}</span>`)
    .join('');

  const langBadges = (project.languages || [])
    .map((l) => `<span class="lang-chip">${escapeHtml(l)}</span>`)
    .join('');

  const metricsHtml = (project.secondaryMetrics || [])
    .slice(0, 4)
    .map(
      (m) => `
      <div class="metric-cell">
        <span class="metric-cell-label">${escapeHtml(m.label)}</span>
        <span class="metric-cell-value">${escapeHtml(m.value)}</span>
      </div>`
    )
    .join('');

  const demoLinkHtml = project.liveDemoUrl
    ? `<a href="${escapeHtml(project.liveDemoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-link btn-live-demo">Live Workbench ↗</a>`
    : '';

  const flagshipBadge = project.isPrimaryFlagship
    ? `<span class="flagship-star-badge">★ PRIMARY FLAGSHIP</span>`
    : `<span class="version-badge">${escapeHtml(project.version)}</span>`;

  return `
    <article class="project-card motif-${escapeHtml(project.visualMotif)}" data-project-id="${escapeHtml(project.id)}" data-primary-domain="${escapeHtml(project.primaryDomain)}" style="--card-accent: ${escapeHtml(project.accentColor)}">
      <div class="project-card-visual">
        ${renderProjectVisualPreviewSvg(project)}
      </div>

      <div class="project-card-top">
        <div class="project-badge-row">
          <span class="slug-badge">${escapeHtml(project.slug)}</span>
          ${flagshipBadge}
        </div>
        <div class="domain-pill-group">${domainBadges}</div>
      </div>

      <h3 class="project-title">${escapeHtml(project.name)}</h3>
      <p class="project-tagline">${escapeHtml(project.tagline)}</p>
      <p class="project-summary">${escapeHtml(project.summary)}</p>

      <div class="headline-metric-box">
        <div class="headline-metric-header">
          <span class="headline-metric-label">${escapeHtml(project.headlineMetric.label)}</span>
          <strong class="headline-metric-value">${escapeHtml(project.headlineMetric.value)}</strong>
        </div>
        <p class="headline-metric-detail">${escapeHtml(project.headlineMetric.detail)}</p>
      </div>

      <div class="secondary-metrics-grid">
        ${metricsHtml}
      </div>

      <div class="lang-chip-row" aria-label="Technology stack">
        ${langBadges}
      </div>

      <div class="project-card-actions">
        <button type="button" class="btn-inspect-adr" data-open-drawer="${escapeHtml(project.id)}" aria-haspopup="dialog">
          <span>Open Full Case Study &amp; Architecture</span>
          <span aria-hidden="true">→</span>
        </button>
        <div class="project-external-links">
          ${demoLinkHtml}
          <a href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-link">
            GitHub Repo ↗
          </a>
        </div>
      </div>
    </article>`;
}

export function renderDrawerContentHtml(project) {
  if (!project) return '';

  const challengesHtml = (project.technicalChallenges || [])
    .map((c) => `<li class="invariant-item">${escapeHtml(c)}</li>`)
    .join('');

  const securityHtml = (project.securityConsiderations || [])
    .map((s) => `<li class="invariant-item">${escapeHtml(s)}</li>`)
    .join('');

  const layersHtml = (project.architectureBlueprint?.layers || [])
    .map(
      (layer) => `
      <div class="blueprint-layer">
        <h5 class="blueprint-layer-name">${escapeHtml(layer.name)}</h5>
        <p class="blueprint-layer-desc">${escapeHtml(layer.responsibility)}</p>
      </div>`
    )
    .join('');

  const invariantsHtml = (project.architectureBlueprint?.invariants || [])
    .map((inv) => `<li class="invariant-item">${escapeHtml(inv)}</li>`)
    .join('');

  const adrsHtml = (project.adrs || [])
    .map(
      (adr) => `
      <div class="adr-card">
        <div class="adr-header">
          <span class="adr-id">${escapeHtml(adr.id)}</span>
          <h5 class="adr-title">${escapeHtml(adr.title)}</h5>
        </div>
        <div class="adr-body">
          <div class="adr-field">
            <strong>Context &amp; Problem:</strong>
            <p>${escapeHtml(adr.context)}</p>
          </div>
          <div class="adr-field">
            <strong>Architectural Decision:</strong>
            <p>${escapeHtml(adr.decision)}</p>
          </div>
          <div class="adr-field">
            <strong>Engineering Trade-Offs:</strong>
            <p>${escapeHtml(adr.tradeOffs)}</p>
          </div>
          <div class="adr-field adr-verification">
            <strong>Automated Verification:</strong>
            <p>${escapeHtml(adr.verification)}</p>
          </div>
        </div>
      </div>`
    )
    .join('');

  const cliText = (project.cliQuickstart || []).join('\n');

  const sourceLinksHtml = (project.sourceLinks || [])
    .map(
      (link) => `
      <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="source-file-link kind-${escapeHtml(link.kind)}">
        <span class="source-link-label">${escapeHtml(link.label)}</span>
        <code class="source-link-path">${escapeHtml(link.path)} ↗</code>
      </a>`
    )
    .join('');

  const liveDemoButton = project.liveDemoUrl
    ? `<a href="${escapeHtml(project.liveDemoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-primary">Launch Live Demo ↗</a>`
    : '';

  return `
    <div class="drawer-inner-content" data-drawer-project="${escapeHtml(project.id)}">
      <div class="drawer-top-meta">
        <span class="slug-badge">${escapeHtml(project.slug)} · ${escapeHtml(project.version)}</span>
        <span class="test-count-pill">✓ ${escapeHtml(project.automatedTests)} Verified Automated Tests / Suites</span>
      </div>

      <h3 id="drawer-title" class="drawer-project-title">${escapeHtml(project.name)}</h3>
      <p class="drawer-project-tagline">${escapeHtml(project.tagline)}</p>

      <section class="drawer-section">
        <h4 class="drawer-section-heading">1. Problem Statement</h4>
        <p class="drawer-prose">${escapeHtml(project.problemStatement)}</p>
      </section>

      <section class="drawer-section">
        <h4 class="drawer-section-heading">2. System Architecture Blueprint</h4>
        <pre class="ascii-diagram" tabindex="0" aria-label="System architecture diagram for ${escapeHtml(project.name)}"><code>${escapeHtml(project.architectureBlueprint?.diagram || '')}</code></pre>
        <div class="blueprint-layers-grid">
          ${layersHtml}
        </div>
      </section>

      <section class="drawer-section">
        <h4 class="drawer-section-heading">3. Difficult Technical Challenges Solved</h4>
        <ul class="invariants-list">
          ${challengesHtml}
        </ul>
      </section>

      <section class="drawer-section">
        <h4 class="drawer-section-heading">4. Security Considerations &amp; System Invariants</h4>
        <ul class="invariants-list">
          ${securityHtml}
          ${invariantsHtml}
        </ul>
      </section>

      <section class="drawer-section">
        <h4 class="drawer-section-heading">5. Architectural Decision Records (ADRs)</h4>
        <div class="adr-list">
          ${adrsHtml}
        </div>
      </section>

      <section class="drawer-section">
        <div class="cli-section-header">
          <h4 class="drawer-section-heading">6. Reproducible Verification &amp; CLI Quickstart</h4>
          <button type="button" class="btn-copy-cli" data-copy-text="${escapeHtml(cliText)}">
            Copy Commands
          </button>
        </div>
        <pre class="cli-code-block" tabindex="0"><code>${escapeHtml(cliText)}</code></pre>
      </section>

      <section class="drawer-section">
        <h4 class="drawer-section-heading">7. Direct Repository Source &amp; Test Inspection</h4>
        <div class="source-links-grid">
          ${sourceLinksHtml}
        </div>
      </section>

      <div class="drawer-footer-actions">
        <a href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
          Inspect GitHub Repository ↗
        </a>
        ${liveDemoButton}
      </div>
    </div>`;
}

export function renderKnowledgeMapSvg(knowledgeMap, activeNodeId = 'ai-systems') {
  const nodeMap = new Map(knowledgeMap.map((n) => [n.id, n]));
  const drawnPairs = new Set();
  const edgesSvg = [];

  for (const node of knowledgeMap) {
    for (const targetId of node.connectedNodeIds || []) {
      const target = nodeMap.get(targetId);
      if (!target) continue;
      const pairKey = [node.id, target.id].sort().join('--');
      if (drawnPairs.has(pairKey)) continue;
      drawnPairs.add(pairKey);

      const isHighlighted = node.id === activeNodeId || target.id === activeNodeId;
      edgesSvg.push(
        `<line x1="${node.x}" y1="${node.y}" x2="${target.x}" y2="${target.y}" class="kmap-edge ${isHighlighted ? 'is-highlighted' : ''}" data-edge-from="${escapeHtml(node.id)}" data-edge-to="${escapeHtml(target.id)}" />`
      );
    }
  }

  const nodesSvg = knowledgeMap
    .map((node) => {
      const isSelected = node.id === activeNodeId;
      return `
      <g class="kmap-svg-node ${isSelected ? 'is-selected' : ''}" data-kmap-node="${escapeHtml(node.id)}" transform="translate(${node.x}, ${node.y})" tabindex="0" role="button" aria-label="Select specialty node ${escapeHtml(node.label)}" aria-pressed="${isSelected ? 'true' : 'false'}">
        <circle r="34" class="kmap-node-halo" stroke="${escapeHtml(node.accentColor)}" />
        <circle r="24" class="kmap-node-core" stroke="${escapeHtml(node.accentColor)}" />
        <text y="-2" text-anchor="middle" class="kmap-node-code">${escapeHtml(node.shortCode)}</text>
        <text y="12" text-anchor="middle" class="kmap-node-title">${escapeHtml(node.label)}</text>
      </g>`;
    })
    .join('');

  return `<svg class="kmap-constellation-svg" viewBox="0 0 1000 520" role="img" aria-label="Interactive Engineering Knowledge Map showing 8 connected technical specialties">
    <g class="kmap-edges-layer">${edgesSvg.join('\n')}</g>
    <g class="kmap-nodes-layer">${nodesSvg}</g>
  </svg>`;
}

export function renderKnowledgeNodeDetailHtml(node, allProjects) {
  if (!node) return '';
  const relatedRepos = (node.relatedProjectIds || [])
    .map((pid) => allProjects.find((p) => p.id === pid))
    .filter(Boolean);

  const repoCardsHtml = relatedRepos
    .map(
      (proj) => `
      <div class="kmap-proof-card">
        <div class="kmap-proof-top">
          <strong>${escapeHtml(proj.name)}</strong>
          <span class="slug-badge">${escapeHtml(proj.automatedTests)} tests</span>
        </div>
        <p>${escapeHtml(proj.tagline)}</p>
        <div class="kmap-proof-actions">
          <button type="button" class="btn-inline-case" data-open-drawer="${escapeHtml(proj.id)}">Inspect Case Study →</button>
          <a href="${escapeHtml(proj.repoUrl)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </div>`
    )
    .join('');

  const commercialBadges = (node.relatedCommercialNames || [])
    .map((name) => `<span class="commercial-proof-pill">◈ ${escapeHtml(name)}</span>`)
    .join('');

  const capabilitiesHtml = (node.capabilities || [])
    .map((cap) => `<li>${escapeHtml(cap)}</li>`)
    .join('');

  const techPillsHtml = (node.technologies || [])
    .map((t) => `<span class="tech-pill">${escapeHtml(t)}</span>`)
    .join('');

  return `
    <div class="kmap-detail-card" data-active-node="${escapeHtml(node.id)}">
      <div class="kmap-detail-header">
        <span class="chapter-code-badge">${escapeHtml(node.shortCode)}</span>
        <span class="chapter-theme-tag">${escapeHtml(node.category)}</span>
      </div>
      <h3 class="kmap-detail-title">${escapeHtml(node.label)}</h3>
      <p class="kmap-detail-summary">${escapeHtml(node.summary)}</p>

      <div class="kmap-detail-section">
        <span class="story-box-label">VERIFIED ARCHITECTURAL CAPABILITIES</span>
        <ul class="kmap-cap-list">${capabilitiesHtml}</ul>
      </div>

      <div class="kmap-detail-section">
        <span class="story-box-label">TECHNOLOGIES &amp; PROTOCOLS</span>
        <div class="tech-pill-row">${techPillsHtml}</div>
      </div>

      <div class="kmap-detail-section">
        <span class="story-box-label">PROVEN IN PUBLIC REPOSITORIES (${relatedRepos.length})</span>
        <div class="kmap-proof-grid">${repoCardsHtml}</div>
      </div>

      ${
        commercialBadges
          ? `<div class="kmap-detail-section">
              <span class="story-box-label">COMMERCIAL &amp; PRODUCT APPLICATION</span>
              <div class="tech-pill-row">${commercialBadges}</div>
            </div>`
          : ''
      }
    </div>`;
}

export function renderPhilosophyCardHtml(principle) {
  return `
    <article class="philosophy-card" data-philosophy-id="${escapeHtml(principle.id)}">
      <span class="philosophy-num">${escapeHtml(principle.number)}</span>
      <blockquote class="philosophy-quote">“${escapeHtml(principle.statement)}”</blockquote>
      <p class="philosophy-elaboration">${escapeHtml(principle.elaboration)}</p>
      <div class="philosophy-proof">
        <span>${escapeHtml(principle.proofPoint)}</span>
      </div>
    </article>`;
}

export function renderExperienceCardHtml(item) {
  const statusClass = item.isCurrent ? 'status-current' : 'status-former';
  const websiteLink = item.websiteUrl
    ? `<a href="${escapeHtml(item.websiteUrl)}" target="_blank" rel="noopener noreferrer" class="exp-website-link">${escapeHtml(item.websiteUrl)} ↗</a>`
    : '';
  const ownershipBanner = item.ownershipNote
    ? `<div class="exp-ownership-note" role="note">${escapeHtml(item.ownershipNote)}</div>`
    : '';
  const highlightsHtml = (item.highlights || [])
    .map((h) => `<li>${escapeHtml(h)}</li>`)
    .join('');
  const techHtml = (item.technologies || [])
    .map((t) => `<span class="lang-chip">${escapeHtml(t)}</span>`)
    .join('');

  return `
    <article class="experience-card ${statusClass}" data-experience-id="${escapeHtml(item.id)}">
      <div class="experience-card-header">
        <div>
          <span class="exp-status-badge ${statusClass}">${escapeHtml(item.status)}</span>
          <h3 class="exp-role-title">${escapeHtml(item.role)}</h3>
          <p class="exp-organization">${escapeHtml(item.organization)} · <span class="exp-location">${escapeHtml(item.location)}</span></p>
        </div>
        ${websiteLink}
      </div>
      ${ownershipBanner}
      <p class="exp-summary">${escapeHtml(item.summary)}</p>
      <ul class="exp-highlights-list">
        ${highlightsHtml}
      </ul>
      <div class="lang-chip-row">
        ${techHtml}
      </div>
    </article>`;
}

export function renderBroaderProjectCardHtml(item) {
  const highlightsHtml = (item.highlights || [])
    .map((h) => `<li>${escapeHtml(h)}</li>`)
    .join('');
  const techHtml = (item.technologies || [])
    .map((t) => `<span class="lang-chip">${escapeHtml(t)}</span>`)
    .join('');

  return `
    <article class="broader-project-card" data-broader-id="${escapeHtml(item.id)}">
      <div class="broader-card-top">
        <span class="broader-category-badge">${escapeHtml(item.category)}</span>
        <span class="broader-status-pill">${escapeHtml(item.status)}</span>
      </div>
      <h3 class="broader-project-title">${escapeHtml(item.name)}</h3>
      ${item.organization ? `<p class="broader-org-line">${escapeHtml(item.organization)}</p>` : ''}
      <p class="broader-project-summary">${escapeHtml(item.summary)}</p>
      <ul class="broader-highlights-list">
        ${highlightsHtml}
      </ul>
      <div class="lang-chip-row">
        ${techHtml}
      </div>
    </article>`;
}

export function renderBenchmarkRowsHtml(benchmarks, summary) {
  const maxTests = Math.max(...benchmarks.map((b) => b.automatedTests), 1);

  return benchmarks
    .map((row) => {
      const barWidthPct = Math.max(12, Math.round((row.automatedTests / maxTests) * 100));
      return `
        <tr class="benchmark-row" data-benchmark-project="${escapeHtml(row.projectId)}">
          <td class="bm-cell-project">
            <a href="https://github.com/${escapeHtml(row.repoSlug)}" target="_blank" rel="noopener noreferrer" class="bm-project-link">
              <strong>${escapeHtml(row.projectName)}</strong>
              <span class="bm-repo-slug">${escapeHtml(row.repoSlug)} ↗</span>
            </a>
          </td>
          <td class="bm-cell-domain">
            <span class="domain-pill">${escapeHtml(row.domain)}</span>
          </td>
          <td class="bm-cell-tests">
            <div class="bm-test-bar-wrap">
              <div class="bm-test-bar-Header">
                <strong class="tabular-nums">${escapeHtml(row.automatedTests)}</strong>
                <span>passing</span>
              </div>
              <div class="bm-bar-track" aria-hidden="true">
                <div class="bm-bar-fill" style="width: ${barWidthPct}%"></div>
              </div>
            </div>
          </td>
          <td class="bm-cell-latency">
            <strong class="tabular-nums">${escapeHtml(row.primaryLatencyMs)} ms</strong>
            <span class="bm-sub-label">${escapeHtml(row.primaryLatencyLabel)}</span>
          </td>
          <td class="bm-cell-throughput">
            <strong class="bm-throughput-val">${escapeHtml(row.throughputOrAccuracyValue)}</strong>
            <span class="bm-sub-label">${escapeHtml(row.throughputOrAccuracyLabel)}</span>
          </td>
          <td class="bm-cell-determinism">
            <span class="bm-guarantee-badge">${escapeHtml(row.determinismGuarantee)}</span>
          </td>
        </tr>`;
    })
    .join('');
}

export function initPortfolioApp() {
  if (typeof document === 'undefined') return;

  const summary = computePortfolioSummary(PORTFOLIO_DATA);
  let activeDomain = 'All';
  let searchQuery = '';
  let activeSort = 'tests-desc';
  let activeChapter = 1;
  let activeKnowledgeNodeId = PORTFOLIO_DATA.knowledgeMap[0]?.id || 'ai-systems';
  const commandHistory = [];
  let historyIndex = -1;

  // 1. Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const htmlEl = document.documentElement;
      const current = htmlEl.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      themeToggleBtn.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
      const labelSpan = themeToggleBtn.querySelector('.theme-label');
      if (labelSpan) {
        labelSpan.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';
      }
    });
  }

  // 2. Experience 02 — Interactive Career Journey Chapters
  const chapterTabs = Array.from(document.querySelectorAll('[data-chapter-tab]'));
  const chapterPanels = Array.from(document.querySelectorAll('[data-chapter-panel]'));
  const progressBarFill = document.getElementById('journey-progress-fill');
  const prevChapterBtn = document.getElementById('journey-prev-btn');
  const nextChapterBtn = document.getElementById('journey-next-btn');

  function selectJourneyChapter(stageNum) {
    const total = PORTFOLIO_DATA.journey.length;
    activeChapter = Math.max(1, Math.min(total, Number(stageNum) || 1));

    chapterTabs.forEach((tab) => {
      const num = Number(tab.getAttribute('data-chapter-tab'));
      const isSelected = num === activeChapter;
      const isCompleted = num < activeChapter;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.classList.toggle('is-active', isSelected);
      tab.classList.toggle('is-completed', isCompleted);
    });

    chapterPanels.forEach((panel) => {
      const num = Number(panel.getAttribute('data-chapter-panel'));
      const isSelected = num === activeChapter;
      panel.hidden = !isSelected;
      panel.classList.toggle('is-active', isSelected);
    });

    if (progressBarFill) {
      const pct = Math.round((activeChapter / total) * 100);
      progressBarFill.style.width = `${pct}%`;
    }
    if (prevChapterBtn) prevChapterBtn.disabled = activeChapter <= 1;
    if (nextChapterBtn) nextChapterBtn.disabled = activeChapter >= total;
  }

  chapterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectJourneyChapter(Number(tab.getAttribute('data-chapter-tab')));
    });
  });
  if (prevChapterBtn) {
    prevChapterBtn.addEventListener('click', () => selectJourneyChapter(activeChapter - 1));
  }
  if (nextChapterBtn) {
    nextChapterBtn.addEventListener('click', () => selectJourneyChapter(activeChapter + 1));
  }

  // 3. Experience 03 — Project Filtering & Search
  const projectsGrid = document.getElementById('projects-grid');
  const resultsCounter = document.getElementById('projects-results-count');
  const domainButtons = Array.from(document.querySelectorAll('[data-domain]'));
  const searchInput = document.getElementById('project-search');

  function updateProjectsView() {
    if (!projectsGrid) return;
    const filtered = filterProjects(PORTFOLIO_DATA.projects, activeDomain, searchQuery);
    if (resultsCounter) {
      resultsCounter.textContent = `Showing ${filtered.length} of ${PORTFOLIO_DATA.projects.length} projects`;
    }
    // The featured collection is an editorial introduction to all projects.
    // Hide it while filters/search are active so search results are unambiguous.
    const featured = document.getElementById('featured-work');
    if (featured) featured.hidden = activeDomain !== 'All' || searchQuery.trim().length > 0;
    if (filtered.length === 0) {
      projectsGrid.innerHTML = `
        <div class="empty-filter-state" role="status">
          <p>No engineering systems matched <strong>"${escapeHtml(searchQuery)}"</strong> in category <strong>${escapeHtml(activeDomain)}</strong>.</p>
          <button type="button" id="reset-filters-btn" class="btn-secondary">Reset Filters</button>
        </div>`;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeDomain = 'All';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          syncDomainButtons();
          updateProjectsView();
        });
      }
      return;
    }
    projectsGrid.innerHTML = filtered.map(renderProjectCardHtml).join('\n');
    bindDrawerTriggers();
  }

  function syncDomainButtons() {
    for (const btn of domainButtons) {
      const dom = btn.getAttribute('data-domain');
      const isSelected = dom === activeDomain;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      btn.classList.toggle('is-active', isSelected);
    }
  }

  for (const btn of domainButtons) {
    btn.addEventListener('click', () => {
      activeDomain = btn.getAttribute('data-domain') || 'All';
      syncDomainButtons();
      updateProjectsView();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      updateProjectsView();
    });
  }

  // 4. Experience 04 — Interactive Knowledge Map
  const kmapCanvasWrap = document.getElementById('kmap-canvas-wrap');
  const kmapDetailWrap = document.getElementById('kmap-detail-wrap');
  const kmapNodeButtons = Array.from(document.querySelectorAll('[data-kmap-pill]'));
  const kmapViewToggleBtn = document.getElementById('kmap-view-toggle');
  const kmapVisualContainer = document.getElementById('kmap-visual-container');
  const kmapAccessibleList = document.getElementById('kmap-accessible-list');

  function selectKnowledgeNode(nodeId) {
    const node = getKnowledgeNodeById(PORTFOLIO_DATA.knowledgeMap, nodeId);
    if (!node) return;
    activeKnowledgeNodeId = node.id;

    kmapNodeButtons.forEach((btn) => {
      const isSel = btn.getAttribute('data-kmap-pill') === activeKnowledgeNodeId;
      btn.setAttribute('aria-pressed', isSel ? 'true' : 'false');
      btn.classList.toggle('is-active', isSel);
    });

    if (kmapCanvasWrap) {
      kmapCanvasWrap.innerHTML = renderKnowledgeMapSvg(
        PORTFOLIO_DATA.knowledgeMap,
        activeKnowledgeNodeId
      );
      bindSvgKnowledgeNodes();
    }
    if (kmapDetailWrap) {
      kmapDetailWrap.innerHTML = renderKnowledgeNodeDetailHtml(node, PORTFOLIO_DATA.projects);
      bindDrawerTriggers();
    }
  }

  function bindSvgKnowledgeNodes() {
    const svgNodes = Array.from(document.querySelectorAll('[data-kmap-node]'));
    svgNodes.forEach((g) => {
      const id = g.getAttribute('data-kmap-node');
      g.addEventListener('click', () => selectKnowledgeNode(id));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectKnowledgeNode(id);
        }
      });
    });
  }

  kmapNodeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectKnowledgeNode(btn.getAttribute('data-kmap-pill'));
    });
  });

  if (kmapViewToggleBtn && kmapVisualContainer && kmapAccessibleList) {
    kmapViewToggleBtn.addEventListener('click', () => {
      const showingMatrix = !kmapAccessibleList.hidden;
      kmapAccessibleList.hidden = showingMatrix;
      kmapVisualContainer.hidden = !showingMatrix;
      kmapViewToggleBtn.setAttribute('aria-pressed', showingMatrix ? 'false' : 'true');
      kmapViewToggleBtn.textContent = showingMatrix
        ? 'Switch to Non-Animated Matrix View'
        : 'Switch to Interactive Constellation View';
    });
  }

  bindSvgKnowledgeNodes();

  // 5. Experience 05 — Controlled Engineering Terminal
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalQuickBtns = Array.from(document.querySelectorAll('[data-terminal-cmd]'));

  function runTerminalCmd(cmdText, shouldScrollSection = false) {
    if (!terminalOutput) return;
    const res = executeTerminalCommand(cmdText, PORTFOLIO_DATA);
    if (cmdText.trim()) {
      commandHistory.push(cmdText.trim());
      historyIndex = commandHistory.length;
    }

    if (res.status === 'clear') {
      terminalOutput.innerHTML = `<div class="term-entry"><span class="term-muted">Buffer cleared. Type <code>help</code> to list available portfolio commands.</span></div>`;
      return;
    }

    const linesHtml = res.lines.map((l) => `<div class="term-line">${escapeHtml(l)}</div>`).join('');
    const jumpLink = res.targetSectionId
      ? `<a href="#${escapeHtml(res.targetSectionId)}" class="term-jump-link">Jump to #${escapeHtml(res.targetSectionId)} ↓</a>`
      : '';

    const block = document.createElement('div');
    block.className = `term-entry status-${res.status}`;
    block.innerHTML = `
      <div class="term-prompt-echo"><span class="term-user">alvin@codesphere-uganda:~$</span> <code>${escapeHtml(res.command)}</code></div>
      <div class="term-res-title">${escapeHtml(res.title)}</div>
      <div class="term-res-body">${linesHtml}</div>
      ${jumpLink}
    `;
    terminalOutput.appendChild(block);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    if (shouldScrollSection && res.targetSectionId) {
      const targetEl = document.getElementById(res.targetSectionId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = terminalInput.value || 'help';
      terminalInput.value = '';
      runTerminalCmd(val, false);
    });

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && commandHistory.length > 0) {
        e.preventDefault();
        historyIndex = Math.max(0, historyIndex - 1);
        terminalInput.value = commandHistory[historyIndex] || '';
      } else if (e.key === 'ArrowDown' && commandHistory.length > 0) {
        e.preventDefault();
        historyIndex = Math.min(commandHistory.length, historyIndex + 1);
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    });
  }

  terminalQuickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-terminal-cmd') || 'help';
      runTerminalCmd(cmd, false);
    });
  });

  // 6. Benchmark Sorting
  const benchmarkBody = document.getElementById('benchmark-tbody');
  const sortButtons = Array.from(document.querySelectorAll('[data-sort-benchmarks]'));

  for (const btn of sortButtons) {
    btn.addEventListener('click', () => {
      activeSort = btn.getAttribute('data-sort-benchmarks') || 'tests-desc';
      for (const b of sortButtons) {
        const active = b.getAttribute('data-sort-benchmarks') === activeSort;
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
        b.classList.toggle('is-active', active);
      }
      if (benchmarkBody) {
        const sorted = sortBenchmarks(PORTFOLIO_DATA.benchmarks, activeSort);
        benchmarkBody.innerHTML = renderBenchmarkRowsHtml(sorted, summary);
      }
    });
  }

  // 7. Case Study Drawer Modal
  const drawerBackdrop = document.getElementById('adr-drawer-backdrop');
  const drawerPanel = document.getElementById('adr-drawer');
  const drawerBody = document.getElementById('adr-drawer-body');
  const drawerCloseBtn = document.getElementById('adr-drawer-close');
  let lastFocusedTrigger = null;

  function openDrawer(projectId, triggerEl) {
    const project = PORTFOLIO_DATA.projects.find((p) => p.id === projectId);
    if (!project || !drawerPanel || !drawerBody) return;
    lastFocusedTrigger = triggerEl || document.activeElement;
    drawerBody.innerHTML = renderDrawerContentHtml(project);
    drawerPanel.classList.add('is-open');
    drawerPanel.setAttribute('aria-hidden', 'false');
    if (drawerBackdrop) {
      drawerBackdrop.classList.add('is-open');
      drawerBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
    bindCopyButtons();
    if (drawerCloseBtn) drawerCloseBtn.focus();
  }

  function closeDrawer() {
    if (!drawerPanel) return;
    drawerPanel.classList.remove('is-open');
    drawerPanel.setAttribute('aria-hidden', 'true');
    if (drawerBackdrop) {
      drawerBackdrop.classList.remove('is-open');
      drawerBackdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }

  function bindDrawerTriggers() {
    const triggers = Array.from(document.querySelectorAll('[data-open-drawer]'));
    for (const trigger of triggers) {
      trigger.onclick = () => {
        const pid = trigger.getAttribute('data-open-drawer');
        openDrawer(pid, trigger);
      };
    }
  }

  function bindCopyButtons() {
    const copyBtns = Array.from(document.querySelectorAll('[data-copy-text]'));
    for (const btn of copyBtns) {
      btn.onclick = async () => {
        const text = btn.getAttribute('data-copy-text') || '';
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          }
          const orig = btn.textContent;
          btn.textContent = '✓ Copied to Clipboard';
          setTimeout(() => {
            btn.textContent = orig;
          }, 1800);
        } catch {
          btn.textContent = 'Select & Copy Below';
        }
      };
    }
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (drawerPanel?.classList.contains('is-open')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = [...drawerPanel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
          .filter(el => el.getClientRects().length > 0);
        if (focusables.length) {
          const first = focusables[0], last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    }
    if (
      e.key === '/' &&
      document.activeElement !== searchInput &&
      document.activeElement !== terminalInput &&
      !drawerPanel?.classList.contains('is-open')
    ) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  bindDrawerTriggers();
  bindCopyButtons();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioApp);
  } else {
    initPortfolioApp();
  }
}
