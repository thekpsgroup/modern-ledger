#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import glob from 'glob';

function globAsync(pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, (error, matches) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(matches ?? []);
    });
  });
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DIST_DIR = path.join(process.cwd(), 'dist');

// Convert images to WebP and create responsive sizes
async function optimizeImages() {
  console.log('🔍 Finding images to optimize...');

  const imageExtensions = ['*.jpg', '*.jpeg', '*.png'];
  const imageFiles = [];

  for (const ext of imageExtensions) {
    const files = await globAsync(path.join(PUBLIC_DIR, '**', ext));
    imageFiles.push(...files);
  }

  console.log(`📸 Found ${imageFiles.length} images to optimize`);

  for (const imagePath of imageFiles) {
    const relativePath = path.relative(PUBLIC_DIR, imagePath);
    const outputDir = path.join(DIST_DIR, path.dirname(relativePath));
    const filename = path.basename(imagePath, path.extname(imagePath));

    // Ensure output directory exists
    await fs.promises.mkdir(outputDir, { recursive: true });

    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      // Skip hero images and logos for now (they need special handling)
      if (filename.includes('hero') || filename.includes('logo') || filename.includes('og-')) {
        console.log(`⏭️  Skipping ${relativePath} (special handling needed)`);
        continue;
      }

      // Convert to WebP with 1x and 2x sizes
      const webp1x = path.join(outputDir, `${filename}.webp`);
      const webp2x = path.join(outputDir, `${filename}@2x.webp`);

      await image
        .webp({ quality: 82 })
        .toFile(webp1x);

      // Create 2x version if original is large enough
      if (metadata.width >= 800) {
        await image
          .resize(Math.round(metadata.width * 0.5))
          .webp({ quality: 82 })
          .toFile(webp2x);
      }

      console.log(`✅ Optimized ${relativePath}`);
    } catch (error) {
      console.error(`❌ Failed to optimize ${relativePath}:`, error instanceof Error ? error.message : String(error));
    }
  }
}

// Generate critical CSS for homepage
async function generateCriticalCSS() {
  console.log('🎨 Generating critical CSS...');

  // This is a simplified version - in production you'd use a tool like critical
  // For now, we'll extract the most important styles
  const criticalCSS = `
/* Critical CSS for above-the-fold content */
:root {
  --brand-navy: #1e3a8a;
  --brand-gold: #fbbf24;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
}

.hero-section {
  background: linear-gradient(135deg, var(--brand-navy), #3b82f6);
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background: var(--brand-gold);
  color: var(--brand-navy);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
}
`;

  const outputPath = path.join(DIST_DIR, 'critical.css');
  await fs.promises.writeFile(outputPath, criticalCSS);
  console.log('✅ Critical CSS generated');
}

// Update HTML files to add lazy loading and critical CSS
async function updateHTMLFiles() {
  console.log('📄 Updating HTML files...');

  const htmlFiles = await globAsync(path.join(DIST_DIR, '**', '*.html'));

  for (const htmlFile of htmlFiles) {
    let content = await fs.promises.readFile(htmlFile, 'utf-8');

    // Add critical CSS link for homepage
    if (htmlFile.includes('index.html')) {
      const criticalCSSLink = '<link rel="preload" href="/critical.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">';
      const noscriptFallback = '<noscript><link rel="stylesheet" href="/critical.css"></noscript>';

      // Insert after the last link tag in head
      content = content.replace(/(<\/head>)/, `  ${criticalCSSLink}\n  ${noscriptFallback}\n$1`);
    }

    // Add lazy loading to images (skip hero images)
    content = content.replace(
      /<img([^>]*src="[^"]*(?!\.webp)[^"]*\.(jpg|jpeg|png)"[^>]*)>/g,
      (match, attrs) => {
        // Skip if already has loading attribute
        if (attrs.includes('loading=')) return match;

        // Skip hero images
        if (attrs.includes('hero')) return match;

        return `<img${attrs} loading="lazy" decoding="async">`;
      }
    );

    // Defer non-critical scripts
    content = content.replace(
      /<script([^>]*src="[^"]*")([^>]*)>(<\/script>)?/g,
      (match, src, attrs) => {
        // Skip if already deferred or async
        if (attrs.includes('defer') || attrs.includes('async')) return match;

        // Skip critical scripts (like those with data-critical)
        if (attrs.includes('data-critical')) return match;

        return `<script${src}${attrs} defer></script>`;
      }
    );

    await fs.promises.writeFile(htmlFile, content);
  }

  console.log('✅ HTML files updated');
}

// Main optimization function
async function optimizeAssets() {
  console.log('🚀 Starting asset optimization...');

  try {
    await optimizeImages();
    await generateCriticalCSS();
    await updateHTMLFiles();

    console.log('🎉 Asset optimization complete!');
  } catch (error) {
    console.error('❌ Asset optimization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeAssets();
}

export { optimizeAssets };