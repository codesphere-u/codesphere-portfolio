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
import { renderNotFoundPage, sitePages } from './scripts/profile.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pages = new Map(sitePages().map(([name, html]) => ['/' + name, html]));
pages.set('/', pages.get('/index.html'));

const staticAssets = new Map([
  ['/src/ui/profile.css', 'text/css; charset=utf-8'],
  ['/src/ui/site-nav.mjs', 'text/javascript; charset=utf-8'],
  ['/src/media/akandwanaho-ivan.svg', 'image/svg+xml'],
  ...['alvin', 'cyber-dragon', 'funa-home', 'funa-work'].map(name => ['/src/media/' + name + '.webp', 'image/webp'])
]);

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

    const page = pages.get(url.pathname);
    if (page) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(page);
      return;
    }

    const contentType = staticAssets.get(url.pathname);
    if (contentType) {
      const file = fs.readFileSync(path.join(__dirname, url.pathname.slice(1)));
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(file);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderNotFoundPage('/'));
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
