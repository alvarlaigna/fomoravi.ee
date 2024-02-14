import { defineConfig, squooshImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import astropodConfig from "./.astropod/astropod.config.json";
import robotsTxt from "astro-robots-txt";
import remarkExternalLinks from "remark-external-links";
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import vercel from "@astrojs/vercel/serverless";
import Compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: astropodConfig.site,
  trailingSlash: "never",
  image: {
    domains: ["astro.build", "*.cloudfront.net"],
    remotePatterns: [{ protocol: "https" }],
    serviceEntryPoint: '@astrojs/image/sharp',
    service: squooshImageService(),
  },
  integrations: [
    robotsTxt(), 
    sitemap(), 
    mdx({    
      remarkPlugins: [remarkExternalLinks, remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],      
    }),     
    tailwind(),
    Compress(), 
  ],
  markdown: {
    remarkPlugins: [remarkExternalLinks, remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],      
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
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