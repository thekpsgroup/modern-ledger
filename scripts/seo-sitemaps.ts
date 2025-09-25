#!/usr/bin/env ts-node

import { writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { getEnv } from '../src/lib/env';

const env = getEnv();

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

function generateSitemap(urls: SitemapUrl[]): string {
  const urlElements = urls.map(url => {
    let xml = `  <url>\n    <loc>${url.loc}</loc>`;
    if (url.lastmod) xml += `\n    <lastmod>${url.lastmod}</lastmod>`;
    if (url.changefreq) xml += `\n    <changefreq>${url.changefreq}</changefreq>`;
    if (url.priority) xml += `\n    <priority>${url.priority}</priority>`;
    xml += '\n  </url>';
    return xml;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

function generateSitemapIndex(sitemaps: string[]): string {
  const sitemapElements = sitemaps.map(sitemap => {
    return `  <sitemap>
    <loc>${env.SITE_URL}/${sitemap}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
}

function findPages(dir: string): string[] {
  const pages: string[] = [];

  function scan(directory: string, basePath = '') {
    const items = readdirSync(directory);

    for (const item of items) {
      const fullPath = join(directory, item);
      const stat = statSync(fullPath);
      const relativePath = join(basePath, item);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath, relativePath);
      } else if (stat.isFile() && item.endsWith('.astro')) {
        // Convert file path to URL path
        let urlPath = relativePath.replace(/\.astro$/, '').replace(/\\/g, '/');

        // Handle index files
        if (urlPath.endsWith('/index')) {
          urlPath = urlPath.slice(0, -6); // Remove '/index'
        }

        // Ensure leading slash
        if (!urlPath.startsWith('/')) {
          urlPath = '/' + urlPath;
        }

        pages.push(urlPath);
      }
    }
  }

  scan(dir);
  return pages;
}

async function main() {
  console.log('🗺️  Generating sitemaps...');

  const publicDir = join(process.cwd(), 'public');
  const srcDir = join(process.cwd(), 'src', 'pages');

  // Find all pages
  const pages = findPages(srcDir);

  // Main sitemap - static pages
  const mainUrls: SitemapUrl[] = [
    { loc: `${env.SITE_URL}/`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '1.0' },
    { loc: `${env.SITE_URL}/pricing`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${env.SITE_URL}/services`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${env.SITE_URL}/about`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${env.SITE_URL}/contact`, changefreq: 'monthly', priority: '0.7' },
  ];

  // Location pages
  const locationUrls: SitemapUrl[] = pages
    .filter(page => page.startsWith('/locations/'))
    .map(page => ({
      loc: `${env.SITE_URL}${page}`,
      changefreq: 'monthly' as const,
      priority: '0.6'
    }));

  // Blog pages (placeholder for now)
  const blogUrls: SitemapUrl[] = [
    // Will be populated when blog posts are added
  ];

  // Generate individual sitemaps
  const mainSitemap = generateSitemap(mainUrls);
  const locationsSitemap = generateSitemap(locationUrls);
  const blogSitemap = generateSitemap(blogUrls);

  // Write sitemaps
  writeFileSync(join(publicDir, 'sitemap.xml'), mainSitemap);
  writeFileSync(join(publicDir, 'sitemap-locations.xml'), locationsSitemap);
  writeFileSync(join(publicDir, 'sitemap-blog.xml'), blogSitemap);

  // Generate sitemap index
  const sitemapIndex = generateSitemapIndex([
    'sitemap.xml',
    'sitemap-locations.xml',
    'sitemap-blog.xml'
  ]);

  writeFileSync(join(publicDir, 'sitemap-index.xml'), sitemapIndex);

  console.log(`✅ Generated sitemaps:`);
  console.log(`   Main sitemap: ${mainUrls.length} URLs`);
  console.log(`   Locations sitemap: ${locationUrls.length} URLs`);
  console.log(`   Blog sitemap: ${blogUrls.length} URLs`);
  console.log(`   Sitemap index created`);
}

// CLI execution
main().catch(console.error);