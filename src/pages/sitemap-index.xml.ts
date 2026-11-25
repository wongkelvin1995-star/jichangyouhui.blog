import type { APIRoute } from 'astro';
import { SITE_CONFIG } from '../data/site-config';

export const GET: APIRoute = async () => {
  const sitemaps = [
    { loc: `${SITE_CONFIG.domain}/sitemap-categories.xml`, lastmod: '2026-11-25' },
    { loc: `${SITE_CONFIG.domain}/sitemap-brands.xml`, lastmod: '2026-11-25' },
    { loc: `${SITE_CONFIG.domain}/sitemap-articles.xml`, lastmod: '2026-11-25' },
  ];

  const body = sitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
