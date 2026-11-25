import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ALL_BRANDS } from '../data/brands';
import { SITE_CONFIG } from '../data/site-config';

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
}

export function getCategoryEntries(): SitemapEntry[] {
  const staticPages: [string, 'daily' | 'weekly' | 'monthly', string][] = [
    ['/', 'daily', '1.0'],
    ['/coupons/', 'daily', '0.95'],
    ['/brands/', 'weekly', '0.9'],
    ['/comparison/', 'weekly', '0.9'],
    ['/cheap-airports/', 'weekly', '0.85'],
    ['/best-value/', 'weekly', '0.85'],
    ['/annual-deals/', 'weekly', '0.85'],
    ['/guides/', 'weekly', '0.8'],
    ['/articles/', 'weekly', '0.8'],
    ['/about/', 'monthly', '0.5'],
    ['/editorial-policy/', 'monthly', '0.5'],
    ['/affiliate-disclosure/', 'monthly', '0.5'],
    ['/privacy/', 'monthly', '0.4'],
    ['/contact/', 'monthly', '0.5'],
  ];
  return staticPages.map(([path, changefreq, priority]) => ({
    loc: `${SITE_CONFIG.domain}${path}`,
    lastmod: '2026-11-25',
    changefreq,
    priority,
  }));
}

export function getBrandEntries(): SitemapEntry[] {
  const list: SitemapEntry[] = [];
  for (const b of ALL_BRANDS) {
    list.push({
      loc: `${SITE_CONFIG.domain}/brands/${b.slug}/`,
      lastmod: b.lastUpdatedDate,
      changefreq: 'weekly',
      priority: '0.9',
    });
    list.push({
      loc: `${SITE_CONFIG.domain}/coupons/${b.slug}/`,
      lastmod: b.lastUpdatedDate,
      changefreq: 'weekly',
      priority: '0.85',
    });
    list.push({
      loc: `${SITE_CONFIG.domain}/plans/${b.slug}/`,
      lastmod: b.lastUpdatedDate,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }
  return list;
}

export async function getArticleEntries(): Promise<SitemapEntry[]> {
  const guides = await getCollection('guides', (e) => !e.data.draft);
  const articles = await getCollection('articles', (e) => !e.data.draft);

  return [
    ...guides.map((g) => ({
      loc: `${SITE_CONFIG.domain}/guides/${g.data.slug ?? g.id}/`,
      lastmod: g.data.updatedDate,
      changefreq: 'monthly' as const,
      priority: '0.8',
    })),
    ...articles.map((a) => ({
      loc: `${SITE_CONFIG.domain}/articles/${a.data.slug ?? a.id}/`,
      lastmod: a.data.updatedDate,
      changefreq: 'monthly' as const,
      priority: '0.75',
    })),
  ];
}

export function renderUrlSet(entries: SitemapEntry[]): string {
  const body = entries
    .map(
      (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export const GET: APIRoute = async () => {
  const entries = [
    ...getCategoryEntries(),
    ...getBrandEntries(),
    ...(await getArticleEntries()),
  ];
  return new Response(renderUrlSet(entries), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
