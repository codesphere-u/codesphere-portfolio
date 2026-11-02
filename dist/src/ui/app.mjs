import { PORTFOLIO_DATA } from '../data/portfolio-data.mjs';
import {
  filterProjects,
  getProjectById,
  computePortfolioSummary,
  sortBenchmarks
} from '../core/explorer.mjs';

const state = {
  activeDomain: 'All',
  searchQuery: '',
  benchmarkSort: 'tests-desc',
  activeDrawerProjectId: null,
  theme: 'dark'
};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderProjectCardHtml(project) {
  const domainBadges = project.domains
    .map((d) => `<span class="badge">${escapeHtml(d)}</span>`)
    .join('');

  const flagshipBadge = project.isPrimaryFlagship
    ? `<span class="badge badge-gold">★ Primary Flagship</span>`
    : `<span class="badge badge-version">${escapeHtml(project.version)}</span>`;

  const langBadges = project.languages
    .map((l) => `<span class="badge badge-version">${escapeHtml(l)}</span>`)
    .join('');

  const secondaryHtml = project.secondaryMetrics
    .map(
      (m) => `
      <div class="mini-metric">
        <span class="mini-metric-label">${escapeHtml(m.label)}</span>
        <span class="mini-metric-val">${escapeHtml(m.value)}</span>
      </div>`
    )
    .join('');

  const liveDemoButton = project.liveDemoUrl
    ? `<a class="btn" href="${escapeHtml(project.liveDemoUrl)}" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>`
    : '';

  return `
    <article class="project-card" data-project-id="${escapeHtml(project.id)}" data-domains="${escapeHtml(project.domains.join(','))}">
      <div>
        <div class="card-top-row">
          <div class="domain-badges">${domainBadges}</div>
          ${flagshipBadge}
        </div>
        <h3 class="project-title">${escapeHtml(project.name)}</h3>
        <p class="project-tagline">${escapeHtml(project.tagline)}</p>
        <p class="project-summary">${escapeHtml(project.summary)}</p>

        <div class="headline-metric-box">
          <div class="metric-box-label">${escapeHtml(project.headlineMetric.label)}</div>
          <div class="metric-box-value">${escapeHtml(project.headlineMetric.value)}</div>
          <div class="metric-box-detail">${escapeHtml(project.headlineMetric.detail)}</div>
        </div>

        <div class="secondary-metrics-grid">
          ${secondaryHtml}
        </div>
      </div>

      <div>
        <div class="domain-badges" style="margin-bottom: 12px;">
          ${langBadges}
        </div>
        <div class="card-actions">
          <button type="button" class="btn btn-primary js-open-drawer" data-project-id="${escapeHtml(project.id)}">
            Architecture &amp; ADRs (${project.adrs.length})
          </button>
          <a class="btn" href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener noreferrer">
            GitHub Repo ↗
          </a>
          ${liveDemoButton}
        </div>
      </div>
    </article>
  `;
}

export function renderExperienceCardHtml(item) {
  const statusClass = item.isCurrent ? 'badge-gold' : 'badge-version';
  const websiteLink = item.websiteUrl
    ? `<a class="btn" href="${escapeHtml(item.websiteUrl)}" target="_blank" rel="noopener noreferrer" style="padding: 4px 10px; font-size: 0.78rem;">${escapeHtml(item.websiteUrl.replace(/^https?:\/\//, ''))} ↗</a>`
    : '';

  const ownershipBanner = item.ownershipNote
    ? `<div class="ownership-callout" role="note">
         <strong>Organizational Boundary:</strong> ${escapeHtml(item.ownershipNote)}
       </div>`
    : '';

  const highlightsHtml = item.highlights
    .map((h) => `<li>${escapeHtml(h)}</li>`)
    .join('');

  const techBadges = item.technologies
    .map((t) => `<span class="badge badge-version">${escapeHtml(t)}</span>`)
    .join('');

  return `
    <article class="experience-card" data-experience-id="${escapeHtml(item.id)}">
      <div class="experience-header">
        <div>
          <div class="domain-badges" style="margin-bottom: 8px;">
            <span class="badge ${statusClass}">${escapeHtml(item.status)}</span>
            <span class="badge">${escapeHtml(item.location)}</span>
          </div>
          <h3 class="experience-role">${escapeHtml(item.role)}</h3>
          <div class="experience-org">${escapeHtml(item.organization)}</div>
        </div>
        ${websiteLink}
      </div>

      ${ownershipBanner}

      <p class="project-summary" style="margin-bottom: 12px;">${escapeHtml(item.summary)}</p>

      <ul class="experience-highlights">
        ${highlightsHtml}
      </ul>

      <div class="domain-badges" style="margin-top: 14px;">
        ${techBadges}
      </div>
    </article>
  `;
}

export function renderJourneyStageHtml(stage) {
  return `
    <div class="journey-stage" data-stage="${stage.stageNumber}">
      <div class="journey-step-header">
        <span class="journey-step-num">0${stage.stageNumber}</span>
        <span class="badge badge-gold">${escapeHtml(stage.theme)}</span>
      </div>
      <h3 class="journey-title">${escapeHtml(stage.title)}</h3>
      <p class="journey-desc">${escapeHtml(stage.description)}</p>
    </div>
  `;
}

export function renderBroaderProjectCardHtml(project) {
  const highlightsHtml = project.highlights
    .map((h) => `<li>${escapeHtml(h)}</li>`)
    .join('');

  const techBadges = project.technologies
    .map((t) => `<span class="badge badge-version">${escapeHtml(t)}</span>`)
    .join('');

  return `
    <article class="project-card broader-project-card" data-broader-id="${escapeHtml(project.id)}">
      <div>
        <div class="card-top-row">
          <span class="badge badge-gold">${escapeHtml(project.status)}</span>
          <span class="badge badge-version">${escapeHtml(project.category)}</span>
        </div>
        <h3 class="project-title">${escapeHtml(project.name)}</h3>
        ${
          project.organization
            ? `<p class="project-tagline">${escapeHtml(project.organization)}</p>`
            : ''
        }
        <p class="project-summary">${escapeHtml(project.summary)}</p>
        <ul class="experience-highlights" style="margin-bottom: 16px;">
          ${highlightsHtml}
        </ul>
      </div>
      <div class="domain-badges">
        ${techBadges}
      </div>
    </article>
  `;
}

export function renderBenchmarkRowsHtml(benchmarks, summary) {
  return benchmarks
    .map((row) => {
      const testPct = Math.min(
        100,
        Math.round((row.automatedTests / summary.maxTestsInRepo) * 100)
      );
      const speedScorePct = Math.max(
        12,
        Math.min(
          100,
          Math.round(
            (1 - row.primaryLatencyMs / (summary.maxLatencyMs * 1.15)) * 100
          )
        )
      );

      return `
      <tr>
        <td>
          <strong>${escapeHtml(row.projectName)}</strong>
          <div style="font-size: 0.76rem; color: var(--text-muted); font-family: var(--font-mono);">
            <a href="https://github.com/codesphere-u/${escapeHtml(row.repoSlug)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); text-decoration: none;">
              codesphere-u/${escapeHtml(row.repoSlug)} ↗
            </a>
          </div>
        </td>
        <td><span class="badge">${escapeHtml(row.domain)}</span></td>
        <td class="mono-cell">
          <strong>${row.automatedTests}</strong> passing
          <div class="bar-track" aria-hidden="true">
            <div class="bar-fill" style="width: ${testPct}%"></div>
          </div>
        </td>
        <td class="mono-cell">
          ${escapeHtml(row.primaryLatencyLabel)}
          <div class="bar-track" aria-hidden="true">
            <div class="bar-fill" style="width: ${speedScorePct}%"></div>
          </div>
        </td>
        <td class="mono-cell">${escapeHtml(row.throughputOrAccuracyLabel)}</td>
        <td>${escapeHtml(row.determinismGuarantee)}</td>
        <td>
          <button type="button" class="btn js-open-drawer" data-project-id="${escapeHtml(row.projectId)}" style="padding: 5px 10px; font-size: 0.78rem;">
            Inspect ADR
          </button>
        </td>
      </tr>
    `;
    })
    .join('');
}

export function renderDrawerContentHtml(project) {
  if (!project) return '';

  const layersHtml = project.architectureBlueprint.layers
    .map(
      (layer) => `
      <li class="layer-item">
        <div class="layer-name">${escapeHtml(layer.name)}</div>
        <div class="layer-desc">${escapeHtml(layer.responsibility)}</div>
      </li>`
    )
    .join('');

  const invariantsHtml = project.architectureBlueprint.invariants
    .map(
      (inv) => `
      <li class="layer-item">
        <div class="layer-desc">✓ ${escapeHtml(inv)}</div>
      </li>`
    )
    .join('');

  const adrsHtml = project.adrs
    .map(
      (adr) => `
      <div class="adr-card">
        <h4 class="adr-title">${escapeHtml(adr.id)}: ${escapeHtml(adr.title)}</h4>
        <p class="adr-field"><strong>CONTEXT:</strong> ${escapeHtml(adr.context)}</p>
        <p class="adr-field"><strong>DECISION:</strong> ${escapeHtml(adr.decision)}</p>
        <p class="adr-field"><strong>TRADE-OFFS:</strong> ${escapeHtml(adr.tradeOffs)}</p>
        <p class="adr-field"><strong>VERIFICATION:</strong> ${escapeHtml(adr.verification)}</p>
      </div>`
    )
    .join('');

  const cliText = project.cliQuickstart.join('\n');

  const sourceLinksHtml = project.sourceLinks
    .map(
      (link) => `
      <a class="btn" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(link.label)} (${escapeHtml(link.path)}) ↗
      </a>`
    )
    .join('');

  return `
    <div class="drawer-header">
      <div>
        <div class="domain-badges" style="margin-bottom: 8px;">
          <span class="badge">${escapeHtml(project.primaryDomain)}</span>
          <span class="badge badge-version">${escapeHtml(project.version)}</span>
          <span class="badge">${project.automatedTests} Automated Tests</span>
        </div>
        <h2 id="drawer-title" style="margin: 0 0 6px; font-size: 1.5rem;">${escapeHtml(project.name)}</h2>
        <p style="margin: 0; color: var(--accent-secondary); font-weight: 600; font-size: 0.92rem;">
          ${escapeHtml(project.tagline)}
        </p>
      </div>
      <button type="button" class="btn" id="js-close-drawer" aria-label="Close Architecture Drawer">
        ✕ Close (Esc)
      </button>
    </div>

    <div class="drawer-section">
      <h3 class="drawer-section-title">1. System Architecture Blueprint</h3>
      <pre class="ascii-diagram">${escapeHtml(project.architectureBlueprint.diagram)}</pre>
      <ul class="layer-list">${layersHtml}</ul>
    </div>

    <div class="drawer-section">
      <h3 class="drawer-section-title">2. Deterministic Invariants &amp; Safety Boundaries</h3>
      <ul class="invariant-list">${invariantsHtml}</ul>
    </div>

    <div class="drawer-section">
      <h3 class="drawer-section-title">3. Key Engineering Trade-Offs (Architecture Decision Records)</h3>
      ${adrsHtml}
    </div>

    <div class="drawer-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 class="drawer-section-title" style="margin: 0;">4. Reproducible CLI Quickstart</h3>
        <button type="button" class="btn" id="js-copy-cli" data-cli="${escapeHtml(cliText)}" style="padding: 4px 10px; font-size: 0.76rem;">
          Copy Commands
        </button>
      </div>
      <pre class="cli-box"><code>${escapeHtml(cliText)}</code></pre>
    </div>

    <div class="drawer-section">
      <h3 class="drawer-section-title">5. Direct Source &amp; Test Links</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        ${sourceLinksHtml}
      </div>
    </div>
  `;
}

export function initPortfolioBrowser() {
  if (typeof document === 'undefined') return;

  const summary = computePortfolioSummary(PORTFOLIO_DATA);
  const gridEl = document.getElementById('projects-grid');
  const countEl = document.getElementById('projects-visible-count');
  const searchEl = document.getElementById('project-search');
  const domainButtons = Array.from(document.querySelectorAll('.domain-tab'));
  const benchmarkBodyEl = document.getElementById('benchmark-tbody');
  const sortButtons = Array.from(document.querySelectorAll('.js-sort-benchmarks'));
  const drawerBackdrop = document.getElementById('architecture-drawer');
  const drawerPanel = document.getElementById('architecture-drawer-panel');
  const themeBtn = document.getElementById('theme-toggle');

  // Initialize theme
  const savedTheme =
    typeof localStorage !== 'undefined' ? localStorage.getItem('cs_theme') : null;
  if (savedTheme === 'light' || savedTheme === 'dark') {
    state.theme = savedTheme;
  }
  document.documentElement.setAttribute('data-theme', state.theme);
  if (themeBtn) {
    themeBtn.textContent = state.theme === 'dark' ? '☀ Light Mode' : '☾ Dark Mode';
  }

  function updateProjectsView() {
    const filtered = filterProjects({
      domain: state.activeDomain,
      query: state.searchQuery
    });
    if (gridEl) {
      gridEl.innerHTML =
        filtered.length > 0
          ? filtered.map(renderProjectCardHtml).join('')
          : `<div class="telemetry-card" style="grid-column: 1 / -1; text-align: center; padding: 36px;">
               <p style="margin: 0 0 12px; color: var(--text-secondary);">No flagship systems match the current filter criteria.</p>
               <button type="button" class="btn" id="js-reset-filters">Reset Filters</button>
             </div>`;
    }
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${PORTFOLIO_DATA.projects.length} verified open-source systems`;
    }
    domainButtons.forEach((btn) => {
      const isSelected = btn.getAttribute('data-domain') === state.activeDomain;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  }

  function updateBenchmarksView() {
    if (!benchmarkBodyEl) return;
    const sorted = sortBenchmarks(PORTFOLIO_DATA.benchmarks, state.benchmarkSort);
    benchmarkBodyEl.innerHTML = renderBenchmarkRowsHtml(sorted, summary);
    sortButtons.forEach((btn) => {
      const active = btn.getAttribute('data-sort') === state.benchmarkSort;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function openDrawer(projectId) {
    const project = getProjectById(projectId);
    if (!project || !drawerBackdrop || !drawerPanel) return;
    state.activeDrawerProjectId = project.id;
    drawerPanel.innerHTML = renderDrawerContentHtml(project);
    drawerBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = document.getElementById('js-close-drawer');
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    if (!drawerBackdrop) return;
    drawerBackdrop.hidden = true;
    state.activeDrawerProjectId = null;
    document.body.style.overflow = '';
  }

  // Event listeners
  domainButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeDomain = btn.getAttribute('data-domain') || 'All';
      updateProjectsView();
    });
  });

  if (searchEl) {
    searchEl.addEventListener('input', (e) => {
      state.searchQuery = e.target.value || '';
      updateProjectsView();
    });
  }

  sortButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.benchmarkSort = btn.getAttribute('data-sort') || 'tests-desc';
      updateBenchmarksView();
    });
  });

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      themeBtn.textContent =
        state.theme === 'dark' ? '☀ Light Mode' : '☾ Dark Mode';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('cs_theme', state.theme);
      }
    });
  }

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('.js-open-drawer');
    if (openBtn) {
      openDrawer(openBtn.getAttribute('data-project-id'));
      return;
    }

    if (e.target.closest('#js-close-drawer') || e.target === drawerBackdrop) {
      closeDrawer();
      return;
    }

    if (e.target.closest('#js-reset-filters')) {
      state.activeDomain = 'All';
      state.searchQuery = '';
      if (searchEl) searchEl.value = '';
      updateProjectsView();
      return;
    }

    const copyBtn = e.target.closest('#js-copy-cli');
    if (copyBtn && navigator.clipboard) {
      const cli = copyBtn.getAttribute('data-cli') || '';
      navigator.clipboard.writeText(cli).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy Commands';
        }, 1800);
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.activeDrawerProjectId) {
      closeDrawer();
    } else if (
      e.key === '/' &&
      document.activeElement !== searchEl &&
      !state.activeDrawerProjectId
    ) {
      e.preventDefault();
      if (searchEl) searchEl.focus();
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initPortfolioBrowser);
}
