#!/usr/bin/env ts-node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { JSDOM } from 'jsdom';

interface SEOIssue {
  file: string;
  type: 'error' | 'warning';
  message: string;
  line?: number;
}

interface SEOReport {
  file: string;
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  h1Count: number;
  imagesWithoutAlt: number;
  hasCanonical: boolean;
  issues: SEOIssue[];
}

function analyzeHTML(filePath: string, content: string): SEOReport {
  const dom = new JSDOM(content);
  const document = dom.window.document;

  const title = document.querySelector('title')?.textContent?.trim() || '';
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  const canonical = document.querySelector('link[rel="canonical"]');
  const h1s = document.querySelectorAll('h1');
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter((img: any) => !img.getAttribute('alt')?.trim());

  const issues: SEOIssue[] = [];

  // Title checks
  if (!title) {
    issues.push({ file: filePath, type: 'error', message: 'Missing title tag' });
  } else if (title.length > 60) {
    issues.push({ file: filePath, type: 'warning', message: `Title too long: ${title.length} chars (max 60)` });
  } else if (title.length < 30) {
    issues.push({ file: filePath, type: 'warning', message: `Title too short: ${title.length} chars (min 30)` });
  }

  // Description checks
  if (!description) {
    issues.push({ file: filePath, type: 'error', message: 'Missing meta description' });
  } else if (description.length > 160) {
    issues.push({ file: filePath, type: 'warning', message: `Description too long: ${description.length} chars (max 160)` });
  } else if (description.length < 120) {
    issues.push({ file: filePath, type: 'warning', message: `Description too short: ${description.length} chars (min 120)` });
  }

  // H1 checks
  if (h1s.length === 0) {
    issues.push({ file: filePath, type: 'error', message: 'No H1 tag found' });
  } else if (h1s.length > 1) {
    issues.push({ file: filePath, type: 'warning', message: `Multiple H1 tags: ${h1s.length} (recommended: 1)` });
  }

  // Canonical check
  if (!canonical) {
    issues.push({ file: filePath, type: 'warning', message: 'Missing canonical URL' });
  }

  // Images alt check
  if (imagesWithoutAlt.length > 0) {
    issues.push({ file: filePath, type: 'error', message: `${imagesWithoutAlt.length} images missing alt text` });
  }

  return {
    file: filePath,
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    h1Count: h1s.length,
    imagesWithoutAlt: imagesWithoutAlt.length,
    hasCanonical: !!canonical,
    issues
  };
}

function findHTMLFiles(dir: string): string[] {
  const files: string[] = [];

  function scan(directory: string) {
    const items = readdirSync(directory);

    for (const item of items) {
      const fullPath = join(directory, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }

  scan(dir);
  return files;
}

async function main() {
  console.log('🔍 Running SEO audit...');

  const distDir = join(process.cwd(), 'dist');
  const files = findHTMLFiles(distDir);

  const reports: SEOReport[] = [];
  let totalIssues = 0;

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');

      const report = analyzeHTML(file, content);
      reports.push(report);
      totalIssues += report.issues.length;

      if (report.issues.length > 0) {
        console.log(`❌ ${file}: ${report.issues.length} issues`);
        report.issues.forEach(issue => {
          console.log(`   ${issue.type.toUpperCase()}: ${issue.message}`);
        });
      } else {
        console.log(`✅ ${file}: OK`);
      }
    } catch (error) {
      console.error(`❌ Error analyzing ${file}:`, error);
    }
  }

  // Summary
  const errorCount = reports.reduce((sum, r) => sum + r.issues.filter(i => i.type === 'error').length, 0);
  const warningCount = reports.reduce((sum, r) => sum + r.issues.filter(i => i.type === 'warning').length, 0);

  console.log(`\n📊 SEO Audit Summary:`);
  console.log(`   Files checked: ${reports.length}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Warnings: ${warningCount}`);

  if (errorCount > 0) {
    console.log(`❌ SEO audit failed with ${errorCount} errors`);
    process.exit(1);
  } else {
    console.log(`✅ SEO audit passed!`);
  }
}

// CLI execution
main().catch(console.error);