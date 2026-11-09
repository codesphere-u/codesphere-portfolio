import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PORTFOLIO_DATA } from './src/data/portfolio-data.mjs';
import {
  filterProjects,
  computePortfolioSummary,
  sortBenchmarks
} from './src/core/explorer.mjs';
import { generateCaseStudyHtml, generatePortfolioHtml } from './scripts/build.mjs';

import { renderFunaCaseStudy } from './scripts/profile.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

// Explicit literal path reads so Vercel's Node File Trace (@vercel/nft) always bundles assets
const STATIC_ASSET_PATHS = {
  '/src/ui/profile.css': path.join(__dirname, 'src', 'ui', 'profile.css'),
  '/src/ui/styles.css': path.join(__dirname, 'src', 'ui', 'styles.css'),
  '/src/ui/editorial.css': path.join(__dirname, 'src', 'ui', 'editorial.css'),
  '/src/ui/polish.css': path.join(__dirname, 'src', 'ui', 'polish.css'),
  '/src/ui/app.mjs': path.join(__dirname, 'src', 'ui', 'app.mjs'),
  '/src/core/explorer.mjs': path.join(__dirname, 'src', 'core', 'explorer.mjs'),
  '/src/data/portfolio-data.mjs': path.join(__dirname, 'src', 'data', 'portfolio-data.mjs'),
  '/src/data/portfolio-data.d.ts': path.join(__dirname, 'src', 'data', 'portfolio-data.d.ts')
};

let cachedHtml = null;

function getIndexHtml() {
  const diskIndex = path.join(__dirname, 'index.html');
  if (fs.existsSync(diskIndex)) {
    try {
      return fs.readFileSync(diskIndex, 'utf8');
    } catch {
      // Fall through to in-memory generator
    }
  }
  if (!cachedHtml) {
    cachedHtml = generatePortfolioHtml().html;
  }
  return cachedHtml;
}

export function handlePortfolioRequest(req, res) {
  try {
    const url = new URL(req.url || '/', 'http://localhost');

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (url.pathname === '/api/health') {
      const summary = computePortfolioSummary(PORTFOLIO_DATA);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(
        JSON.stringify({
          status: 'ok',
          service: 'codesphere-portfolio',
          version: '2.0.0',
          concept: "THE BUILDER'S JOURNEY",
          owner: PORTFOLIO_DATA.profile.name,
          totalProjects: summary.totalProjects,
          totalBroaderProjects: summary.totalBroaderProjects,
          totalAutomatedTests: summary.totalAutomatedTests
        })
      );
      return;
    }

    if (url.pathname === '/api/projects') {
      const domain = url.searchParams.get('domain') || 'All';
      const query = url.searchParams.get('q') || '';
      const results = filterProjects({ domain, query });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(
        JSON.stringify({
          domain,
          query,
          count: results.length,
          projects: results
        })
      );
      return;
    }

    if (url.pathname === '/api/benchmarks') {
      const sort = url.searchParams.get('sort') || 'tests-desc';
      const benchmarks = sortBenchmarks(PORTFOLIO_DATA.benchmarks, sort);
      const summary = computePortfolioSummary(PORTFOLIO_DATA);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(
        JSON.stringify({
          totalAutomatedTests: summary.totalAutomatedTests,
          benchmarks
        })
      );
      return;
    }

    if (url.pathname === '/' || url.pathname === '/index.html') {
      const html = getIndexHtml();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (url.pathname === '/archive.html' || url.pathname === '/archive') {
      res.writeHead(301, { Location: '/#projects' });
      res.end();
      return;
    }

    if (url.pathname === '/cases/funa-gigs.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderFunaCaseStudy());
      return;
    }

    const caseMatch = /^\/cases\/([a-z0-9-]+)\.html$/.exec(url.pathname);
    if (caseMatch) {
      const project = PORTFOLIO_DATA.projects.find(({ id }) => id === caseMatch[1]);
      res.writeHead(project ? 200 : 404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(project ? generateCaseStudyHtml(project) : '<!doctype html><title>Case study not found</title><h1>Case study not found</h1><a href="/#projects">Selected work</a>');
      return;
    }

    if (STATIC_ASSET_PATHS[url.pathname] && fs.existsSync(STATIC_ASSET_PATHS[url.pathname])) {
      const assetPath = STATIC_ASSET_PATHS[url.pathname];
      const ext = path.extname(assetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fs.readFileSync(assetPath));
      return;
    }

    const safePath = path.normalize(url.pathname).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(__dirname, safePath);

    if (!fullPath.startsWith(__dirname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(fullPath));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Internal Server Error', message: err?.message }));
  }
}

export function createPortfolioServer() {
  return http.createServer(handlePortfolioRequest);
}

// Default export for Vercel Serverless Function entrypoint (`Using server.mjs as the root entrypoint`)
export default handlePortfolioRequest;

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 4173);
  const host = process.env.HOST || '127.0.0.1';
  const server = createPortfolioServer();
  server.listen(port, host, () => {
    console.log(
      `codesphere-portfolio server running at http://${host}:${port}`
    );
  });
}
