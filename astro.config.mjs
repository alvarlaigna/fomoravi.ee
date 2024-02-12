import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import astropodConfig from "./.astropod/astropod.config.json";
import robotsTxt from "astro-robots-txt";
import remarkExternalLinks from "remark-external-links";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: astropodConfig.site,
  integrations: [robotsTxt({
    policy: [{
      userAgent: "*",
      allow: "/"
    }]
  }), mdx({
    // Configure remark plugins for MDX here
    remarkPlugins: [remarkExternalLinks]
  }), sitemap(), tailwind()],
  image: {
    domains: ["astro.build"]
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  output: "hybrid",
  adapter: vercel({
    edgeMiddleware: true,
    webAnalytics: {
      enabled: true,
    },
  }),
});