#!/usr/bin/env ts-node

import { statSync } from 'fs';
import { join } from 'path';
import { BRAND_ASSETS } from '../src/data/brand-assets.generated.ts';

const REQUIRED_ASSETS = [
  'modern_ledger_32x32.png',
  'modern_ledger_64x64.png',
  'modern_ledger_128x128.png',
  'modern_ledger_256x256.png',
  'modern_ledger_512x512.png',
  'modern_ledger_1200x630.png',
  'modern_ledger_1080x1080.png',
  'modern_ledger_1920x1080.png'
];

function verifyAssets() {
  const publicDir = join(process.cwd(), 'public');
  const missingAssets: string[] = [];
  const invalidAssets: string[] = [];

  // Check required assets exist in public/
  for (const assetName of REQUIRED_ASSETS) {
    try {
      statSync(join(publicDir, assetName));
    } catch (error) {
      missingAssets.push(assetName);
    }
  }

  // Check generated index includes all required assets
  for (const assetName of REQUIRED_ASSETS) {
    if (!(assetName in BRAND_ASSETS)) {
      invalidAssets.push(`${assetName} not found in BRAND_ASSETS`);
    }
  }

  return { missingAssets, invalidAssets };
}

async function main() {
  console.log('🔍 Verifying brand assets...');

  const { missingAssets, invalidAssets } = verifyAssets();

  if (missingAssets.length > 0) {
    console.error('❌ Missing required assets:');
    missingAssets.forEach(asset => console.error(`   ${asset}`));
  }

  if (invalidAssets.length > 0) {
    console.error('❌ Invalid asset index:');
    invalidAssets.forEach(error => console.error(`   ${error}`));
  }

  if (missingAssets.length === 0 && invalidAssets.length === 0) {
    console.log('✅ All required assets verified!');
    console.log(`   Found ${Object.keys(BRAND_ASSETS).length} assets in index`);
    process.exit(0);
  } else {
    console.error('❌ Asset verification failed');
    process.exit(1);
  }
}

// CLI execution
main().catch(console.error);