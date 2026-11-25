import type { APIRoute } from 'astro';
import { getCategoryEntries, renderUrlSet } from './sitemap.xml';

export const GET: APIRoute = async () => {
  return new Response(renderUrlSet(getCategoryEntries()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
