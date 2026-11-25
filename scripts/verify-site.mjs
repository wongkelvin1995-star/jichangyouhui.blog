import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const SRC_BRANDS_DIR = path.resolve(process.cwd(), 'src/data/brands');
const BANNED_STRINGS = [
  '待核实',
  '待验证',
  '待填写',
  '暂无资料',
  '数据缺失',
  '测试数据',
  '测试中',
  'Lorem Ipsum',
];

function walkHtml(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, list);
    else if (entry.name.endsWith('.html')) list.push(full);
  }
  return list;
}

function getExpectedBrandAffs() {
  const map = new Map();
  for (const f of fs.readdirSync(SRC_BRANDS_DIR)) {
    if (!f.startsWith('group') || !f.endsWith('.ts')) continue;
    const txt = fs.readFileSync(path.join(SRC_BRANDS_DIR, f), 'utf8');
    const blocks = txt.split(/slug:\s*'([^']+)'/);
    for (let i = 1; i < blocks.length; i += 2) {
      const slug = blocks[i];
      const body = blocks[i + 1];
      const m = body.match(/affLink:\s*'([^']+)'/);
      if (m) map.set(slug, m[1]);
    }
  }
  return map;
}

function checkDistPathExists(hrefPath) {
  const clean = hrefPath.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(DIST_DIR, 'index.html'));
  const rel = clean.replace(/^\/+/, '');
  const asDir = path.join(DIST_DIR, rel, 'index.html');
  const asFile = path.join(DIST_DIR, rel);
  return fs.existsSync(asDir) || fs.existsSync(asFile);
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist/ does not exist. Run `npm run build` first.');
    process.exit(1);
  }

  const errors = [];
  const htmlFiles = walkHtml(DIST_DIR);
  const titles = new Map();
  const brandAffs = getExpectedBrandAffs();
  const publishedUrls = [];

  for (const file of htmlFiles) {
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
    const html = fs.readFileSync(file, 'utf8');
    const route = rel === 'index.html' ? '/' : `/${rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '')}`;

    // 1. Banned strings (case-insensitive for DEMO/Lorem Ipsum)
    for (const term of BANNED_STRINGS) {
      if (html.includes(term)) {
        errors.push(`[BANNED] "${term}" found in ${rel}`);
      }
    }
    if (/\bDEMO\b/i.test(html.replace(/<script[\s\S]*?<\/script>/gi, ''))) {
      errors.push(`[BANNED] "DEMO" found in ${rel}`);
    }

    // 2. Single H1 check
    const h1Matches = html.match(/<h1\b[^>]*>/gi) ?? [];
    if (h1Matches.length !== 1) {
      errors.push(`[H1] Expected 1 H1, found ${h1Matches.length} in ${rel}`);
    }

    // 3. Unique title check for indexable pages
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    const isNoindex = /<meta name="robots" content="noindex/i.test(html);
    if (!title) {
      errors.push(`[TITLE] Missing title in ${rel}`);
    } else if (!isNoindex) {
      if (titles.has(title)) {
        errors.push(`[TITLE-DUP] Duplicate title "${title}" in ${rel} and ${titles.get(title)}`);
      }
      titles.set(title, rel);
      publishedUrls.push(`https://jichangyouhui.blog${route}`);
    }

    // 4. Canonical & noindex check
    if (!/<link rel="canonical" href="https:\/\/jichangyouhui\.blog\//i.test(html)) {
      errors.push(`[CANONICAL] Missing or invalid canonical in ${rel}`);
    }
    if ((route === '/search/' || route === '/404/' || route === '/404') && !isNoindex) {
      errors.push(`[NOINDEX] Expected noindex on ${rel}`);
    }

    // 5. Internal link integrity + zero href="#"
    if (/href=["']#["']/i.test(html)) {
      errors.push(`[HREF-#] Found prohibited href="#" in ${rel}`);
    }
    const hrefRe = /href=["'](\/[^"']*)["']/g;
    let m;
    while ((m = hrefRe.exec(html)) !== null) {
      const target = m[1];
      if (target.startsWith('/_astro/') || target === '/favicon.svg' || target === '/og-cover.svg') continue;
      if (!checkDistPathExists(target)) {
        errors.push(`[BROKEN-LINK] "${target}" referenced in ${rel} does not exist in dist/`);
      }
    }

    // 6. JSON-LD validation
    const jsonLdRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    while ((m = jsonLdRe.exec(html)) !== null) {
      try {
        JSON.parse(m[1]);
      } catch (e) {
        errors.push(`[JSON-LD] Invalid JSON-LD in ${rel}: ${e.message}`);
      }
    }

    // 7. Brand AFF link exact match check
    const brandRouteMatch = route.match(/^\/(?:brands|coupons|plans)\/([^/]+)\/$/);
    if (brandRouteMatch) {
      const slug = brandRouteMatch[1];
      const expectedAff = brandAffs.get(slug);
      if (!expectedAff) {
        errors.push(`[AFF] Missing expected AFF for ${slug}`);
      } else if (!html.includes(expectedAff)) {
        errors.push(`[AFF-MISMATCH] ${rel} does not contain exact AFF ${expectedAff}`);
      }
    }
  }

  // 8. Robots & Sitemaps check
  for (const reqFile of [
    'robots.txt',
    'sitemap.xml',
    'sitemap-index.xml',
    'sitemap-brands.xml',
    'sitemap-articles.xml',
    'sitemap-categories.xml',
    'search-index.json',
  ]) {
    if (!fs.existsSync(path.join(DIST_DIR, reqFile))) {
      errors.push(`[MISSING-FILE] dist/${reqFile} not generated`);
    }
  }

  if (fs.existsSync(path.join(DIST_DIR, 'sitemap.xml'))) {
    const sm = fs.readFileSync(path.join(DIST_DIR, 'sitemap.xml'), 'utf8');
    if (sm.includes('/search/') || sm.includes('/404')) {
      errors.push('[SITEMAP] sitemap.xml must not include /search/ or /404');
    }
  }

  // 9. Search Index Chinese Keyword & Synonym Verification
  if (fs.existsSync(path.join(DIST_DIR, 'search-index.json'))) {
    const searchRaw = fs.readFileSync(path.join(DIST_DIR, 'search-index.json'), 'utf8');
    for (const term of BANNED_STRINGS) {
      if (searchRaw.includes(term)) {
        errors.push(`[SEARCH-BANNED] "${term}" found in search-index.json`);
      }
    }
    const docs = JSON.parse(searchRaw);
    const requiredQueries = [
      '灵动云',
      '大佬云',
      '优惠码',
      '机场优惠',
      '机场推荐',
      '便宜机场',
      '年付',
      '100GB',
      '不限时流量',
      'AI',
      'ChatGPT',
      'Netflix',
      'Clash',
      '科学上网',
      '魔法上网',
    ];
    // Verify synonym + text coverage
    const synRaw = fs.readFileSync(path.resolve(process.cwd(), 'src/utils/search-synonyms.ts'), 'utf8');
    for (const q of requiredQueries) {
      const ql = q.toLowerCase();
      const directHit = docs.some(
        (d) =>
          d.title.toLowerCase().includes(ql) ||
          d.summary.toLowerCase().includes(ql) ||
          d.body.toLowerCase().includes(ql) ||
          (d.keywords || []).some((k) => k.toLowerCase().includes(ql)) ||
          (d.couponCodes || []).some((c) => c.toLowerCase().includes(ql))
      );
      const synHit = synRaw.toLowerCase().includes(ql);
      if (!directHit && !synHit) {
        errors.push(`[SEARCH-QUERY] Query "${q}" has neither direct doc hit nor synonym mapping`);
      }
    }
    console.log(`Search index verified: ${docs.length} documents indexed.`);
  }

  // Save published URLs list to internal docs
  publishedUrls.sort();
  const docsDir = path.resolve(process.cwd(), 'docs');
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(
    path.join(docsDir, 'PUBLISHED-URLS.md'),
    `# 已发布可收录页面 URL 清单（共 ${publishedUrls.length} 页）\n\n` +
      publishedUrls.map((u, i) => `${i + 1}. ${u}`).join('\n') +
      '\n'
  );

  if (errors.length) {
    console.error(`\nVerification FAILED with ${errors.length} error(s):`);
    for (const err of errors) console.error(' -', err);
    process.exit(1);
  }

  console.log(`\nVerification PASSED! Audited ${htmlFiles.length} HTML files (${publishedUrls.length} indexable URLs), 0 errors.`);
}

main();
