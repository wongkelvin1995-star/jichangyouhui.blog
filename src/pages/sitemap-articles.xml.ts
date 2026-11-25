import type { APIRoute } from 'astro';
import { getArticleEntries, renderUrlSet } from './sitemap.xml';

export const GET: APIRoute = async () => {
  return new Response(renderUrlSet(await getArticleEntries()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
