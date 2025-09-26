#!/usr/bin/env node

/**
 * SEO Title Fixer for Modern Ledger Blog Posts
 * Fixes titles that exceed 60 characters for better SEO
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const BLOG_DIR = join(__dirname, '..', 'src', 'pages', 'blog');

function shortenTitle(title) {
  // Common patterns that make titles too long
  const patterns = [
    {
      regex: /: Complete Guide for Texas Businesses?$/,
      replacement: ' for Texas Businesses'
    },
    {
      regex: /: Essential Guide for Texas Businesses?$/,
      replacement: ' for Texas Businesses'
    },
    {
      regex: /: Complete Guide$/,
      replacement: ' Guide'
    },
    {
      regex: /: Essential Guide$/,
      replacement: ' Guide'
    },
    {
      regex: /: Best Practices for Texas Businesses?$/,
      replacement: ' Best Practices'
    },
    {
      regex: /: Complete Checklist$/,
      replacement: ' Checklist'
    },
    {
      regex: /: Step-by-Step Guide$/,
      replacement: ' Guide'
    },
    {
      regex: / for Small Businesses$/,
      replacement: ' for Businesses'
    },
    {
      regex: / for Texas Small Businesses$/,
      replacement: ' for Texas Businesses'
    }
  ];

  let shortened = title;

  // Apply patterns
  for (const pattern of patterns) {
    if (pattern.regex.test(shortened)) {
      shortened = shortened.replace(pattern.regex, pattern.replacement);
      if (shortened.length <= 60) {
        return shortened;
      }
    }
  }

  // If still too long, truncate with ellipsis
  if (shortened.length > 60) {
    // Try to truncate at word boundary
    const words = shortened.split(' ');
    let result = '';
    for (const word of words) {
      if ((result + ' ' + word).length > 55) { // Leave room for "..."
        break;
      }
      result += (result ? ' ' : '') + word;
    }
    return result + '...';
  }

  return shortened;
}

function fixBlogPostTitles() {
  console.log('Scanning blog posts for title optimization...');

  const files = readdirSync(BLOG_DIR).filter(file => file.endsWith('.astro'));
  let fixedCount = 0;

  for (const file of files) {
    const filePath = join(BLOG_DIR, file);

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

      const newTitle = shortenTitle(originalTitle);
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

  console.log(`\n🎉 Title optimization complete!`);
  console.log(`   Fixed ${fixedCount} blog post titles`);
}

// CLI execution
fixBlogPostTitles().catch(console.error);