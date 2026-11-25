import type { APIRoute } from 'astro';
import { getBrandEntries, renderUrlSet } from './sitemap.xml';

export const GET: APIRoute = async () => {
  return new Response(renderUrlSet(getBrandEntries()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
