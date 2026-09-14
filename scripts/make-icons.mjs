// Renders src/app/icon1.svg to the PNG/ICO sizes Next.js and browsers expect.
// Needs Playwright Chromium: `npx playwright install chromium`.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const svg = await readFile(path.join(ROOT, 'src/app/icon1.svg'), 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
async function png(size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`
  );
  return page.locator('svg').screenshot({ omitBackground: true, type: 'png' });
}

// ICO container holding PNG-encoded images (supported by every current browser / OS).
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = header.length + dir.length;
  images.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir[o] = size === 256 ? 0 : size;
    dir[o + 1] = size === 256 ? 0 : size;
    dir[o + 2] = 0; // colour count
    dir[o + 3] = 0; // reserved
    dir.writeUInt16LE(1, o + 4); // planes
    dir.writeUInt16LE(32, o + 6); // bit depth
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...images.map((i) => i.data)]);
}

const out = {
  'src/app/icon2.png': await png(192),
  'src/app/apple-icon.png': await png(180),
  'public/icons/icon-192.png': await png(192),
  'public/icons/icon-512.png': await png(512),
};
const icoSizes = [16, 32, 48];
out['src/app/favicon.ico'] = ico(
  await Promise.all(icoSizes.map(async (size) => ({ size, data: await png(size) })))
);
await browser.close();

for (const [rel, data] of Object.entries(out)) {
  await writeFile(path.join(ROOT, rel), data);
  console.log(`${rel}  ${data.length} bytes`);
}
