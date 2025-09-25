import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://modernledger.co',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap({
      customPages: [
        'https://modernledger.co/locations/royse-city-tx',
        'https://modernledger.co/locations/fate-tx',
        'https://modernledger.co/locations/rockwall-tx',
        'https://modernledger.co/locations/caddo-mills-tx',
        'https://modernledger.co/locations/greenville-tx',
        'https://modernledger.co/locations/quinlan-tx',
        'https://modernledger.co/locations/rowlett-tx',
        'https://modernledger.co/locations/wylie-tx',
        'https://modernledger.co/locations/heath-tx',
      ],
    }),
  ],
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});