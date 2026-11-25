import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SITE_HOST = 'jichangyouhui.blog';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const MANIFEST_PATH = path.resolve(process.cwd(), '.indexnow-manifest.json');

function collectIndexablePages(dir) {
  const results = new Map();
  if (!fs.existsSync(dir)) return results;

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '_astro') continue;
        walk(fullPath);
      } else if (entry.name === 'index.html') {
        const relDir = path.relative(dir, currentDir).replace(/\\/g, '/');
        const urlPath = relDir ? `/${relDir}/` : '/';
        if (urlPath === '/search/' || urlPath === '/404/') continue;
        const html = fs.readFileSync(fullPath, 'utf8');
        if (/<meta name="robots" content="noindex/i.test(html)) continue;
        const hash = crypto.createHash('sha256').update(html).digest('hex');
        results.set(`${SITE_ORIGIN}${urlPath}`, hash);
      }
    }
  }

  walk(dir);
  return results;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const currentMap = collectIndexablePages(DIST_DIR);

  if (!currentMap.size) {
    console.error('Error: dist/ has no indexable HTML files. Run `npm run build` first.');
    process.exit(1);
  }

  let prevManifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    prevManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  }

  const changedUrls = [];
  for (const [url, hash] of currentMap.entries()) {
    if (prevManifest[url] !== hash) {
      changedUrls.push(url);
    }
  }
  for (const oldUrl of Object.keys(prevManifest)) {
    if (!currentMap.has(oldUrl)) {
      changedUrls.push(oldUrl);
    }
  }

  if (!changedUrls.length) {
    console.log('IndexNow: 0 URLs changed since last manifest. Skipping submission.');
    return;
  }

  console.log(`IndexNow: Detected ${changedUrls.length} changed/new/removed URLs.`);

  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    console.log(
      'IndexNow 未配置 INDEXNOW_KEY 环境变量。请按 README.md 步骤：\n' +
        '1. 生成 32 位十六进制 IndexNow Key，并创建 public/<KEY>.txt（内容为该 Key）；\n' +
        '2. 部署站点确认 https://jichangyouhui.blog/<KEY>.txt 可访问；\n' +
        '3. 设置环境变量 INDEXNOW_KEY=<KEY> 后运行 `npm run indexnow`。'
    );
    if (dryRun) {
      console.log('Dry-run changed URLs sample:', changedUrls.slice(0, 10));
    }
    return;
  }

  const keyFile = path.join(PUBLIC_DIR, `${key}.txt`);
  if (!fs.existsSync(keyFile)) {
    console.error(`Error: Verification file missing at public/${key}.txt`);
    process.exit(1);
  }

  if (dryRun) {
    console.log('Dry-run mode: would submit', changedUrls.length, 'URLs to Bing IndexNow.');
    return;
  }

  const payload = {
    host: SITE_HOST,
    key,
    keyLocation: `${SITE_ORIGIN}/${key}.txt`,
    urlList: changedUrls.slice(0, 10000),
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`IndexNow submission failed: HTTP ${res.status} - ${body}`);
    process.exit(1);
  }

  const nextManifest = Object.fromEntries(currentMap.entries());
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(nextManifest, null, 2));
  console.log(`IndexNow submission succeeded (HTTP ${res.status}) for ${changedUrls.length} URLs.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
