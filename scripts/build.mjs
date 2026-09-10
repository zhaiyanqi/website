import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import { origin, pages } from '../site/render.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const documents = pages();
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'site/assets'), path.join(output, 'assets'), { recursive: true });
for (const [filename, html] of documents) {
  assert(/<title>[^<]+<\/title>/.test(html), `${filename}: missing page title`);
  const target = path.join(output, filename);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
}
const urls = [...documents.keys()].filter(file => file !== '404.html').map(file => `${origin}/${file.replace(/index\.html$/, '')}`);
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);

// Check published documents and local links before declaring the build deployable.
for (const [filename, html] of documents) {
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${filename}: expected one h1`);
  assert(html.includes('蜀ICP备2021018925号-1'), `${filename}: missing ICP number`);
  assert(html.includes('https://beian.miit.gov.cn/'), `${filename}: missing ICP link`);
  assert(html.includes('<html lang="zh-CN">'), `${filename}: missing language`);
  for (const [, reference] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!reference.startsWith('/') && !reference.startsWith('#')) continue;
    const url = new URL(reference, `${origin}/${filename}`);
    const targetFile = url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname;
    const localFile = path.join(output, targetFile);
    assert((await stat(localFile)).isFile(), `${filename}: missing ${reference}`);
    if (url.hash) {
      const targetHtml = await readFile(localFile, 'utf8');
      assert(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${filename}: missing anchor ${reference}`);
    }
  }
}
let count = 0;
let bytes = 0;
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { await inspect(full); continue; }
    assert(/\.(html|css|svg|xml|txt)$/.test(entry.name), `Unexpected public asset: ${entry.name}`);
    const info = await stat(full);
    count++;
    bytes += info.size;
  }
}
await inspect(output);
console.log(`Built ${documents.size} pages, ${count} public files (${(bytes / 1024).toFixed(1)} KiB) → dist/`);
console.log('Verified local links, anchors, titles, ICP links, and public assets.');
