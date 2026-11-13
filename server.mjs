import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PORTFOLIO_DATA } from './src/data/portfolio-data.mjs';
import {
  filterProjects,
  computePortfolioSummary,
  sortBenchmarks
} from './src/core/explorer.mjs';
import { renderNotFoundPage, sitePages } from './scripts/profile.mjs';
import { cvPdf } from './scripts/cv-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pages = new Map(sitePages().map(([name, html]) => ['/' + name, html]));
pages.set('/', pages.get('/index.html'));

const staticAssets = new Map([
  ['/' + cvPdf, 'application/pdf'],
  ['/src/ui/cv.css', 'text/css; charset=utf-8'],
  ['/src/ui/hero.css', 'text/css; charset=utf-8'],
  ['/src/ui/hero.mjs', 'text/javascript; charset=utf-8'],
  ['/src/ui/motion.mjs', 'text/javascript; charset=utf-8'],
  ['/src/ui/site.css', 'text/css; charset=utf-8'],
  ['/src/ui/profile.css', 'text/css; charset=utf-8'],
  ['/src/ui/showcase.css', 'text/css; charset=utf-8'],
  ['/src/ui/showcase.mjs', 'text/javascript; charset=utf-8'],
  ['/src/ui/site-nav.mjs', 'text/javascript; charset=utf-8'],
  ['/src/media/akandwanaho-ivan.svg', 'image/svg+xml'],
  ...['alvin', 'cyber-dragon', 'funa-home', 'funa-work'].map(name => ['/src/media/' + name + '.webp', 'image/webp'])
]);

export function handlePortfolioRequest(req, res) {
  const method = (req.method || 'GET').toUpperCase();
  const isHead = method === 'HEAD';
  const finish = (status, headers, body) => {
    res.writeHead(status, headers);
    res.end(isHead ? undefined : body);
  };

  try {
    const url = new URL(req.url || '/', 'http://localhost');

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (method !== 'GET' && !isHead) {
      finish(
        405,
        {
          'Content-Type': 'application/json; charset=utf-8',
          Allow: 'GET, HEAD',
          'Cache-Control': 'no-store'
        },
        JSON.stringify({ error: 'Method Not Allowed', allowed: ['GET', 'HEAD'] })
      );
      return;
    }

    if (url.pathname === '/api/health' || url.pathname === '/health') {
      const summary = computePortfolioSummary(PORTFOLIO_DATA);
      finish(
        200,
        {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        },
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
      finish(
        200,
        {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        },
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
      finish(
        200,
        {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        },
        JSON.stringify({
          totalAutomatedTests: summary.totalAutomatedTests,
          benchmarks
        })
      );
      return;
    }

    const page = pages.get(url.pathname);
    if (page) {
      finish(200, { 'Content-Type': 'text/html; charset=utf-8' }, page);
      return;
    }

    const contentType = staticAssets.get(url.pathname);
    if (contentType) {
      const file = fs.readFileSync(path.join(__dirname, url.pathname.slice(1)));
      if (url.pathname === '/' + cvPdf) {
        res.setHeader('Content-Disposition', 'attachment; filename="akandwanaho-ivan-cv.pdf"');
      }
      finish(200, { 'Content-Type': contentType }, file);
      return;
    }

    finish(404, { 'Content-Type': 'text/html; charset=utf-8' }, renderNotFoundPage('/'));
  } catch (err) {
    console.error('[codesphere-portfolio] Unhandled request error:', err);
    finish(
      500,
      {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      },
      JSON.stringify({ error: 'Internal Server Error' })
    );
  }
}

export function createPortfolioServer() {
  return http.createServer(handlePortfolioRequest);
}

// Default export for Vercel Serverless Function entrypoint (`Using server.mjs as the root entrypoint`)
export default handlePortfolioRequest;

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4173);
  const host = process.env.HOST || '127.0.0.1';
  const server = createPortfolioServer();
  let closing = false;
  const shutdown = (signal) => {
    if (closing) return;
    closing = true;
    console.log(`[codesphere-portfolio] Received ${signal}; closing server`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  };
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));

  server.listen(port, host, () => {
    console.log(
      `codesphere-portfolio server running at http://${host}:${port}`
    );
  });
}
