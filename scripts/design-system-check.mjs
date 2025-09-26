#!/usr/bin/env node

/**
 * Design System Enforcement Script
 * Checks for violations of the established design system rules
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Design system rules
const RULES = {
  // Prohibited colors that should never be used
  prohibitedColors: [
    '#22c55e', '#16a34a', '#15803d', // Green variants
    '#ec4899', '#db2777', '#be185d', // Pink variants
    '#a855f7', '#9333ea', '#7c3aed', // Purple variants
    'rainbow', 'linear-gradient.*45deg.*ff0000.*ff8000.*ffff00' // Rainbow gradients
  ],

  // Required H1 styling pattern
  requiredH1Classes: 'text-4xl md:text-6xl font-bold text-gray-900 mb-6',

  // Prohibited class patterns
  prohibitedClasses: [
    'text-green-', 'bg-green-',
    'text-pink-', 'bg-pink-',
    'text-purple-', 'bg-purple-',
    'rainbow'
  ]
};

async function checkFiles() {
  console.log('Checking design system compliance...\n');

  // Find all Astro and HTML files in src
  const sourceFiles = await glob('src/**/*.{astro,html}', { cwd: process.cwd() });

  // Find all HTML files in dist (built pages)
  const builtFiles = await glob('dist/**/*.html', { cwd: process.cwd() });

  const allFiles = [...sourceFiles, ...builtFiles];

  let violations = [];
  let totalFiles = 0;

  for (const file of allFiles) {
    totalFiles++;
    const content = fs.readFileSync(file, 'utf-8');
    const fileViolations = checkFile(file, content);
    violations.push(...fileViolations);
  }

  // Report results
  if (violations.length === 0) {
    console.log('All files pass design system checks!');
    console.log(`Checked ${totalFiles} files (${sourceFiles.length} source + ${builtFiles.length} built)`);
    process.exit(0);
  } else {
    console.log('Design system violations found:');
    console.log('');

    violations.forEach(violation => {
      console.log(`${violation.file}:${violation.line}`);
      console.log(`   ${violation.message}`);
      console.log('');
    });

    console.log(`Checked ${totalFiles} files (${sourceFiles.length} source + ${builtFiles.length} built), found ${violations.length} violations`);
    process.exit(1);
  }
}

function checkFile(filePath, content) {
  const violations = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for prohibited colors
    RULES.prohibitedColors.forEach(color => {
      if (line.includes(color)) {
        violations.push({
          file: filePath,
          line: lineNumber,
          message: `Prohibited color "${color}" found. Use only white/black backgrounds with brand-navy/brand-gold accents.`
        });
      }
    });

    // Check for prohibited classes
    RULES.prohibitedClasses.forEach(className => {
      if (line.includes(className)) {
        violations.push({
          file: filePath,
          line: lineNumber,
          message: `Prohibited class "${className}" found. Use only approved color classes.`
        });
      }
    });

    // Check H1 elements for proper styling
    const isAstroFile = filePath.endsWith('.astro');
    const isHtmlFile = filePath.endsWith('.html');

    if (line.includes('<h1') && !line.includes('class="text-4xl md:text-6xl font-bold text-gray-900 mb-6') && !line.includes('class="text-4xl md:text-6xl font-bold mb-6')) {
      // Skip if it's using the Heading component (Astro only)
      if (isAstroFile && !line.includes('<Heading level={1}')) {
        // Allow white text on dark backgrounds
        const hasWhiteText = line.includes('text-white') || line.includes('text-gray-900');
        if (!hasWhiteText) {
          violations.push({
            file: filePath,
            line: lineNumber,
            message: 'H1 element not using required styling. Use <Heading level={1}> or class="text-4xl md:text-6xl font-bold text-gray-900 mb-6" (or text-white on dark backgrounds)'
          });
        }
      }
      // For HTML files, check if they have proper styling (built pages should have the correct classes)
      else if (isHtmlFile && !line.includes('text-4xl') && !line.includes('md:text-6xl')) {
        violations.push({
          file: filePath,
          line: lineNumber,
          message: 'H1 element in built page missing required responsive text sizing classes'
        });
      }
    }
  });

  return violations;
}

// Run the check
checkFiles().catch(console.error);