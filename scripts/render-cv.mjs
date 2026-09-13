// Renders the static-exported /profile/print page to out/cv.pdf with Playwright Chromium.
// Run after `next build`: `npm run cv:pdf` (needs `npx playwright install chromium` once locally).
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'out');
const PORT = 4173;
const MAX_PAGES = 2;
const MAX_BYTES = 500 * 1024;

const { default: nextConfig } = await import(path.join(ROOT, 'next.config.mjs'));
const BASE = nextConfig.basePath ?? '';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
};

// Map /dev-blog/foo/ -> out/foo/index.html (what `output: 'export'` + trailingSlash emits).
function resolveFile(urlPath) {
  if (BASE && urlPath !== BASE && !urlPath.startsWith(`${BASE}/`)) return null;
  const rel = decodeURIComponent(urlPath.slice(BASE.length)) || '/';
  let file = path.normalize(path.join(OUT, rel));
  if (!file.startsWith(OUT)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  else if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  return existsSync(file) ? file : null;
}

if (!existsSync(OUT)) {
  console.error('out/ not found — run `npm run build` first.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const file = resolveFile(new URL(req.url, 'http://localhost').pathname);
  if (!file) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = `http://127.0.0.1:${PORT}${BASE}/profile/print/`;
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  if (!response?.ok()) throw new Error(`GET ${url} -> ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  const pdfPath = path.join(OUT, 'cv.pdf');
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();

  const bytes = (await stat(pdfPath)).size;
  const pages = ((await readFile(pdfPath, 'latin1')).match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length;
  console.log(`cv.pdf: ${pages} page(s), ${(bytes / 1024).toFixed(0)} KB -> ${path.relative(ROOT, pdfPath)}`);
  if (pages > MAX_PAGES) {
    console.error(`cv.pdf has ${pages} pages; limit is ${MAX_PAGES}. Trim data/cv.json or print.css.`);
    process.exitCode = 1;
  }
  if (bytes > MAX_BYTES) {
    console.error(`cv.pdf is ${bytes} bytes; limit is ${MAX_BYTES}.`);
    process.exitCode = 1;
  }
} finally {
  server.close();
}
