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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

export function createPortfolioServer() {
  return http.createServer((req, res) => {
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

    // Serve static files from root directory (prevent path traversal)
    const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const safePath = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
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
    fs.createReadStream(fullPath).pipe(res);
  });
}

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
