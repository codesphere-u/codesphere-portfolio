import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderProfile, renderNotFoundPage, sitePages } from './profile.mjs';
import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';
import { computePortfolioSummary, validatePortfolioIntegrity } from '../src/core/explorer.mjs';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

export function generatePortfolioHtml() {
  const startMs = performance.now();
  const integrity = validatePortfolioIntegrity(PORTFOLIO_DATA);
  if (!integrity.valid) {
    throw new Error(`Portfolio integrity check failed:\n${integrity.errors.join('\n')}`);
  }
  const summary = computePortfolioSummary(PORTFOLIO_DATA);
  return { html: renderProfile(), summary, elapsedMs: (performance.now() - startMs).toFixed(1) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { html, summary } = generatePortfolioHtml();
  fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html, 'utf8');

  fs.mkdirSync(DIST_DIR, { recursive: true });
  for (const obsoletePath of ['archive.html', 'cases', 'work', 'src']) {
    fs.rmSync(path.join(DIST_DIR, obsoletePath), { force: true, recursive: true });
  }
  fs.cpSync(path.join(ROOT_DIR, 'src'), path.join(DIST_DIR, 'src'), { recursive: true });
  for (const [name, page] of [...sitePages(), ['404.html', renderNotFoundPage('/')]]) {
    const destination = path.join(DIST_DIR, name);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, page, 'utf8');
  }
  console.log(`[build] Generated the portfolio and ${summary.totalProjects + 1} project case studies in dist/`);
}
