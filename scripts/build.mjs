import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderProfile, renderFunaCaseStudy } from './profile.mjs';
import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';
import { computePortfolioSummary, validatePortfolioIntegrity } from '../src/core/explorer.mjs';
import { renderDrawerContentHtml } from '../src/ui/app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getVerifiedSummary() {
  const integrity = validatePortfolioIntegrity(PORTFOLIO_DATA);
  if (!integrity.valid) {
    throw new Error(`Portfolio integrity check failed:\n${integrity.errors.join('\n')}`);
  }
  return computePortfolioSummary(PORTFOLIO_DATA);
}

export function generatePortfolioHtml() {
  const startMs = performance.now();
  const summary = getVerifiedSummary();
  const html = renderProfile(PORTFOLIO_DATA.profile);
  return { html, summary, elapsedMs: (performance.now() - startMs).toFixed(1) };
}

export function generateCaseStudyHtml(project) {
  const title = escapeHtml(project.name);
  const description = escapeHtml(project.tagline);
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Akandwanaho Ivan Alvin</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title} | Engineering case study" />
  <meta property="og:description" content="${description}" />
  <link rel="stylesheet" href="../src/ui/styles.css" />
  <link rel="stylesheet" href="../src/ui/editorial.css" />
  <link rel="stylesheet" href="../src/ui/polish.css" />
</head>
<body class="case-page">
  <a href="#case-content" class="skip-link">Skip to case study</a>
  <header class="case-header"><div class="container">
    <a href="../index.html#projects">← Selected work</a>
    <a href="../index.html">Akandwanaho Ivan Alvin</a>
  </div></header>
  <main class="container case-content" id="case-content" tabindex="-1">
    <p class="section-eyebrow">CASE STUDY / ${escapeHtml(project.primaryDomain)}</p>
    ${renderDrawerContentHtml(project, { standalone: true })}
  </main>
</body>
</html>`;
}

function copyDirectoryRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { html, elapsedMs, summary } = generatePortfolioHtml();

  fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html, 'utf8');

  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html, 'utf8');
  fs.rmSync(path.join(DIST_DIR, 'archive.html'), { force: true });
  copyDirectoryRecursive(path.join(ROOT_DIR, 'src'), path.join(DIST_DIR, 'src'));
  const casesDir = path.join(DIST_DIR, 'cases');
  fs.mkdirSync(casesDir, { recursive: true });
  fs.writeFileSync(path.join(casesDir, 'funa-gigs.html'), renderFunaCaseStudy());
  for (const project of PORTFOLIO_DATA.projects) {
    fs.writeFileSync(path.join(casesDir, project.id + '.html'), generateCaseStudyHtml(project));
  }

  console.log(
    `[build] Built codesphere-portfolio v2.0 ("THE BUILDER'S JOURNEY") for ${PORTFOLIO_DATA.profile.name} (${summary.totalProjects} open-source systems, ${summary.totalJourneyStages} journey chapters, ${summary.totalKnowledgeNodes} knowledge nodes, ${summary.totalAutomatedTests} verified tests/suites) in ${elapsedMs} ms -> index.html & dist/`
  );
}
