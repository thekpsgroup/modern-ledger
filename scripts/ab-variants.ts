#!/usr/bin/env ts-node

import { readFileSync, writeFileSync } from 'fs';
import { getEnv } from '../src/lib/env';

const env = getEnv();

interface ABFlags {
  hero_copy_variant: 'A' | 'B';
  cta_style: 'solid' | 'outline';
  sticky_bar: boolean;
  [key: string]: any;
}

function loadFlags(): ABFlags {
  try {
    const flagsPath = env.AB_FLAGS_PATH;
    const content = readFileSync(flagsPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn('Could not load A/B flags, using defaults');
    return {
      hero_copy_variant: 'A',
      cta_style: 'solid',
      sticky_bar: true
    };
  }
}

function saveFlags(flags: ABFlags): void {
  const flagsPath = env.AB_FLAGS_PATH;
  writeFileSync(flagsPath, JSON.stringify(flags, null, 2));
}

function validateFlag(key: string, value: any): boolean {
  const schema: Record<string, any[]> = {
    hero_copy_variant: ['A', 'B'],
    cta_style: ['solid', 'outline'],
    sticky_bar: [true, false]
  };

  if (!schema[key]) {
    console.error(`Unknown flag: ${key}`);
    return false;
  }

  if (!schema[key].includes(value)) {
    console.error(`Invalid value for ${key}: ${value}. Allowed: ${schema[key].join(', ')}`);
    return false;
  }

  return true;
}

function updateFlags(updates: Partial<ABFlags>): ABFlags {
  const currentFlags = loadFlags();
  const newFlags = { ...currentFlags, ...updates };

  // Validate all updates
  for (const [key, value] of Object.entries(updates)) {
    if (!validateFlag(key, value)) {
      throw new Error(`Invalid flag update: ${key}=${value}`);
    }
  }

  saveFlags(newFlags);
  return newFlags;
}

function displayFlags(flags: ABFlags): void {
  console.log('Current A/B Flags:');
  Object.entries(flags).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Display current flags
    const flags = loadFlags();
    displayFlags(flags);
    return;
  }

  // Parse flag updates
  const updates: Partial<ABFlags> = {};

  for (const arg of args) {
    const [key, valueStr] = arg.split('=');
    if (!key || !valueStr) {
      console.error(`Invalid argument format: ${arg}. Use key=value`);
      process.exit(1);
    }

    // Parse value
    let value: any;
    if (valueStr === 'true') value = true;
    else if (valueStr === 'false') value = false;
    else if (!isNaN(Number(valueStr))) value = Number(valueStr);
    else value = valueStr;

    updates[key as keyof ABFlags] = value;
  }

  try {
    const newFlags = updateFlags(updates);
    console.log('A/B flags updated successfully');
    displayFlags(newFlags);
  } catch (error) {
    console.error('Failed to update flags:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// CLI execution
main().catch(console.error);