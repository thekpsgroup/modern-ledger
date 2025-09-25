#!/usr/bin/env node
import { access, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const log = (...args: unknown[]) => console.log('[qa:lighthouse]', ...args);

async function runCommand(command: string, args: string[], options: { cwd?: string; stdio?: 'inherit' } = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: options.stdio ?? 'inherit',
      cwd: options.cwd ?? process.cwd(),
      env: process.env,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

async function ensureDistBuild(distDir: string) {
  try {
    await access(distDir, constants.F_OK);
    log('Found existing dist build.');
  } catch {
    log('dist folder not found, running `npm run build`...');
    await runCommand('npm', ['run', 'build'], { stdio: 'inherit' });
  }
}

async function main() {
  const projectRoot = process.cwd();
  const distDir = path.resolve(projectRoot, 'dist');

  await ensureDistBuild(distDir);

  const urlsToCheck = [
    '/',
    '/pricing',
    '/services/bookkeeping',
    '/services/clean-books',
    '/roi-calculator',
  ];

  const lhciConfig = {
    ci: {
      collect: {
        staticDistDir: distDir,
        url: urlsToCheck,
        numberOfRuns: 1,
        settings: {
          preset: 'desktop',
        },
      },
      assert: {
        // keep default assertions, can be extended later
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'modern-ledger-lhci-'));
  const configPath = path.join(tmpDir, 'lighthouserc.json');
  await writeFile(configPath, JSON.stringify(lhciConfig, null, 2));

  log('Running Lighthouse CI...');
  try {
    const lhciCliEntry = (() => {
      try {
        return require.resolve('@lhci/cli/src/cli.js');
      } catch {
        throw new Error('Unable to locate @lhci/cli. Run `npm install` to install project dependencies.');
      }
    })();

    await runCommand(process.execPath, [lhciCliEntry, 'autorun', '--config', configPath], {
      stdio: 'inherit',
    });
    log('Lighthouse checks completed successfully.');
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error('\n[qa:lighthouse] Error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
