#!/usr/bin/env node

import http from 'http';
import https from 'https';
import { URL } from 'url';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

class LinkChecker {
  constructor(baseUrl = 'http://localhost:4321', distDir) {
    this.baseUrl = baseUrl;
    this.distDir = distDir;
    this.checked = new Set();
    this.broken = [];
    this.warnings = [];
  }

  async check(url) {
    if (this.checked.has(url)) return;
    this.checked.add(url);

    // Skip favicon files as they're not critical
    const urlObj = new URL(url);
    if (urlObj.pathname.includes('favicon') || urlObj.pathname.includes('apple-touch-icon')) {
      console.log(`⏭️  Skipping favicon: ${url}`);
      return;
    }

    try {
      // Convert URL to file path
      const urlObj = new URL(url);
      let filePath = urlObj.pathname;
      if (filePath === '/' || filePath === '') {
        filePath = '/index.html';
      } else if (!filePath.endsWith('.html') && !filePath.includes('.')) {
        filePath += '/index.html';
      }

      const fullPath = join(this.distDir, filePath.substring(1)); // Remove leading slash

      // Check if file exists
      try {
        statSync(fullPath);
        console.log(`✅ ${url} -> ${fullPath}`);
      } catch (error) {
        console.log(`❌ ${url} -> ${fullPath} (file not found)`);
        this.broken.push({ url, error: 'File not found', type: 'internal' });
        return;
      }

      // Read and parse HTML file
      const content = readFileSync(fullPath, 'utf-8');
      const links = this.extractLinks(content, url);

      for (const link of links) {
        if (link.startsWith('/')) {
          // Internal link
          const fullUrl = new URL(link, this.baseUrl).href;
          await this.check(fullUrl);
        } else if (link.startsWith('http') && !link.includes(this.baseUrl.replace('https://', '').replace('http://', ''))) {
          // External link - just log for now (we won't check external links in static mode)
          console.log(`🔗 External link: ${link}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${url} - ${error.message}`);
      this.broken.push({ url, error: error.message, type: 'internal' });
    }
  }

  async checkExternal(url) {
    if (this.checked.has(url)) return;
    this.checked.add(url);

    try {
      const response = await this.fetchUrl(url);
      if (response.status >= 400) {
        this.warnings.push({ url, status: response.status, type: 'external' });
      }
    } catch (error) {
      this.warnings.push({ url, error: error.message, type: 'external' });
    }
  }

  fetchUrl(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      const req = protocol.get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          if (body.length < 10000) { // Limit body size
            body += chunk;
          }
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            contentType: res.headers['content-type'],
            body
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }

  extractLinks(html, baseUrl) {
    const links = [];
    const linkRegex = /href=["']([^"']+)["']/g;
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const link = match[1];
      if (!link.startsWith('#') && !link.startsWith('mailto:') && !link.startsWith('tel:')) {
        links.push(link);
      }
    }

    return [...new Set(links)]; // Remove duplicates
  }

  async start() {
    console.log('🔗 Starting link checker...');
    console.log(`Base URL: ${this.baseUrl}`);
    console.log(`Dist directory: ${this.distDir}`);

    try {
      await this.check(this.baseUrl);

      console.log(`\n📊 Link Check Results:`);
      console.log(`   Total links checked: ${this.checked.size}`);
      console.log(`   Broken internal links: ${this.broken.filter(l => l.type === 'internal').length}`);

      if (this.broken.length > 0) {
        console.log(`\n❌ Broken Links:`);
        this.broken.forEach(link => {
          console.log(`   ${link.url} - ${link.error}`);
        });
      }

      if (this.broken.filter(l => l.type === 'internal').length > 0) {
        console.log(`\n❌ Link check failed - broken internal links found`);
        process.exit(1);
      } else {
        console.log(`\n✅ All internal links are working!`);
      }

    } catch (error) {
      console.error('❌ Link checker failed:', error);
      process.exit(1);
    }
  }
}

// Check if server is running
async function checkServer(url) {
  try {
    const response = await new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      protocol.get(url, (res) => {
        resolve(res);
      }).on('error', reject);
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:4321';
  const distDir = join(process.cwd(), 'dist');

  console.log('🔗 Checking links in built files...');

  // Check if dist directory exists
  try {
    statSync(distDir);
  } catch (error) {
    console.error(`❌ Dist directory not found: ${distDir}`);
    console.error('Please build the site first: npm run build');
    process.exit(1);
  }

  const checker = new LinkChecker(baseUrl, distDir);
  await checker.start();
}

// CLI execution
main().catch(console.error);