#!/usr/bin/env node

/**
 * SEO Title Fixer for Modern Ledger Location Pages
 * Fixes titles that exceed 60 characters for better SEO
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const LOCATIONS_DIR = join(__dirname, '..', 'src', 'pages', 'locations');

function shortenLocationTitle(title) {
  // Pattern: "Bookkeeping Services in [City], Texas | Modern Ledger"
  // Target: "Bookkeeping in [City], TX | Modern Ledger"

  const pattern = /^Bookkeeping Services in ([^,]+), Texas \| Modern Ledger$/;
  const match = title.match(pattern);

  if (match) {
    const city = match[1];
    return `Bookkeeping in ${city}, TX | Modern Ledger`;
  }

  // If no match, try to truncate if still too long
  if (title.length > 60) {
    // Try to truncate at word boundary
    const words = title.split(' ');
    let result = '';
    for (const word of words) {
      if ((result + ' ' + word).length > 55) { // Leave room for "..."
        break;
      }
      result += (result ? ' ' : '') + word;
    }
    return result + '...';
  }

  return title;
}

function fixLocationTitles() {
  console.log('Scanning location pages for title optimization...');

  const files = readdirSync(LOCATIONS_DIR).filter(file => file.endsWith('.astro') && file !== 'index.astro' && file !== '[slug].astro');
  let fixedCount = 0;

  for (const file of files) {
    const filePath = join(LOCATIONS_DIR, file);

    try {
      const content = readFileSync(filePath, 'utf-8');

      // Extract title from frontmatter
      const titleMatch = content.match(/title="([^"]+)"/);
      if (!titleMatch) continue;

      const originalTitle = titleMatch[1];
      const originalLength = originalTitle.length;

      if (originalLength <= 60) {
        continue; // Already good
      }

      const newTitle = shortenLocationTitle(originalTitle);
      const newLength = newTitle.length;

      if (newLength > 60) {
        console.log(`⚠️  Still too long (${newLength} chars): ${file}`);
        console.log(`   Original: "${originalTitle}"`);
        console.log(`   Shortened: "${newTitle}"`);
        continue;
      }

      // Update the file
      const newContent = content.replace(
        `title="${originalTitle}"`,
        `title="${newTitle}"`
      );

      writeFileSync(filePath, newContent, 'utf-8');

      console.log(`✅ Fixed: ${file}`);
      console.log(`   "${originalTitle}" (${originalLength} chars)`);
      console.log(`   → "${newTitle}" (${newLength} chars)`);

      fixedCount++;

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log(`\n🎉 Location title optimization complete!`);
  console.log(`   Fixed ${fixedCount} location page titles`);
}

// CLI execution
fixLocationTitles();