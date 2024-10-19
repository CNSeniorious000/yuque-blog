import type { RequestHandler } from "./$types";

import { text } from "@sveltejs/kit";
import { apiBaseurl, headers } from "$lib/serverConstants";
import { namespace } from "$lib/utils";

interface Document {
  id: number;
  slug: string;
  title: string;
  description: string;
  created_at: string;
  content_updated_at: string;
}

export const GET: RequestHandler = async ({ fetch, url: { origin } }) => {
  const res = await fetch(`${apiBaseurl}/repos/${namespace}/docs`, { headers });
  const { data: articles }: { data: Document[] } = await res.json();

  const entries = articles.map(({ slug, content_updated_at }) => `
    <url>
      <loc>${origin}/blog/${slug}</loc>
      <lastmod>${content_updated_at}</lastmod>
      <priority>0.8</priority>
    </url>`).join("\n");

  return text(`
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      <url>
        <loc>${origin}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${origin}/blog</loc>
        <lastmod>${articles.map(({ content_updated_at: date }) => date).reduce((a, b) => a > b ? a : b)}</lastmod>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
      </url>
      ${entries}
    </urlset>
  `.trim(), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
