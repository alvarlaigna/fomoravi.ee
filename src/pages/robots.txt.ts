import type { APIRoute } from "astro";
import astropodConfig from "../../.astropod/astropod.config.json";

const robots = `
User-agent: *
Disallow: 

Sitemap: ${new URL("sitemap-index.xml", astropodConfig.site).href}
`.trim();

export const GET: APIRoute = () =>
  new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
