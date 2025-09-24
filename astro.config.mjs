import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://modernledger.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap({
      customPages: [
        'https://modernledger.com/locations/royse-city-tx',
        'https://modernledger.com/locations/fate-tx',
        'https://modernledger.com/locations/rockwall-tx',
        'https://modernledger.com/locations/caddo-mills-tx',
        'https://modernledger.com/locations/greenville-tx',
        'https://modernledger.com/locations/quinlan-tx',
        'https://modernledger.com/locations/rowlett-tx',
        'https://modernledger.com/locations/wylie-tx',
        'https://modernledger.com/locations/heath-tx',
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