#!/usr/bin/env node

/**
 * Emoji Detection Script
 * Scans the codebase for emojis and fails if any are found
 * This prevents emojis from entering the website in the future
 */

import { glob } from 'glob';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';

// Emoji regex pattern - matches common Unicode emoji ranges but excludes checkmarks and allowed UI emojis
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FE}]|[\u{2700}-\u{27BF}]/gu;

// Allowed emojis for UI enhancement (professional/business context only)
const ALLOWED_EMOJIS = ['✔', '✓', '🔍', '💰', '📊', '⚡'];

// File extensions to check
const EXTENSIONS_TO_CHECK = [
  '.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs',
  '.json', '.md', '.txt', '.yml', '.yaml'
];

// Directories to exclude
const EXCLUDE_DIRS = [
  'node_modules',
  'dist',
  '.git',
  '.astro',
  '.vercel',
  'playwright-report',
  'test-results',
  '.lighthouseci'
];

async function checkFileForEmojis(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const matches = content.match(EMOJI_REGEX);

    if (matches) {
      // Filter out allowed characters like checkmarks and UI enhancement emojis
      const filteredMatches = matches.filter(emoji =>
        !ALLOWED_EMOJIS.includes(emoji)
      );

      if (filteredMatches.length > 0) {
        console.error(`[ERROR] Emojis found in ${filePath}:`);
        filteredMatches.forEach((emoji, index) => {
          const lines = content.split('\n');
          const lineNumber = lines.findIndex(line => line.includes(emoji)) + 1;
          console.error(`  Line ${lineNumber}: ${emoji}`);
        });
        return true;
      }
    }
  } catch (error) {
    console.warn(`[WARNING] Could not read file ${filePath}: ${error.message}`);
  }
  return false;
}

async function main() {
  console.log('Scanning codebase for emojis...');

  // Build glob pattern
  const patterns = EXTENSIONS_TO_CHECK.map(ext => `**/*${ext}`);
  const ignorePatterns = EXCLUDE_DIRS.map(dir => `**/${dir}/**`);

  let hasEmojis = false;
  let filesChecked = 0;

  for (const pattern of patterns) {
    const files = await glob(pattern, {
      ignore: ignorePatterns,
      cwd: process.cwd()
    });

    for (const file of files) {
      filesChecked++;
      if (await checkFileForEmojis(file)) {
        hasEmojis = true;
      }
    }
  }

  console.log(`Checked ${filesChecked} files`);

  if (hasEmojis) {
    console.error('\n[ERROR] Emojis detected! Please remove all emojis before committing.');
    console.error('Tip: Use traditional text formatting instead of emojis for a professional appearance.');
    process.exit(1);
  } else {
    console.log('No emojis found! Codebase is clean.');
  }
}

main().catch(error => {
  console.error('Error running emoji check:', error);
  process.exit(1);
});