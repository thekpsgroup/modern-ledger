import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.modernledger.co',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap({
      customPages: [
        'https://www.modernledger.co/locations/royse-city-tx',
        'https://www.modernledger.co/locations/fate-tx',
        'https://www.modernledger.co/locations/rockwall-tx',
        'https://www.modernledger.co/locations/caddo-mills-tx',
        'https://www.modernledger.co/locations/greenville-tx',
        'https://www.modernledger.co/locations/quinlan-tx',
        'https://www.modernledger.co/locations/rowlett-tx',
        'https://www.modernledger.co/locations/wylie-tx',
        'https://www.modernledger.co/locations/heath-tx',
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