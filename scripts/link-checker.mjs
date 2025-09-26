#!/usr/bin/env node

import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { JSDOM } from 'jsdom';

const log = (...args) => console.log('[qa:links]', ...args);

async function runCommand(command, args, options = {}) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			shell: process.platform === 'win32',
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

async function ensureDist(distDir) {
	try {
		await access(distDir, constants.F_OK);
		log('Found existing dist build.');
	} catch {
		log('dist folder not found, building site first...');
		await runCommand('npm', ['run', 'build']);
	}
}

async function walkHtmlFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		if (entry.name.startsWith('.')) continue;
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walkHtmlFiles(fullPath)));
		} else if (entry.isFile() && entry.name.endsWith('.html')) {
			files.push(fullPath);
		}
	}
	return files;
}

function normalizeInternalHref(href) {
	const clean = href.split('#')[0].split('?')[0];
	if (!clean) return null;
	if (clean.endsWith('.xml') || clean.endsWith('.json') || clean.endsWith('.pdf') || clean.endsWith('.txt')) return clean;
	if (clean.endsWith('/')) return `${clean}index.html`;
	if (clean.endsWith('.html')) return clean;
	return `${clean.replace(/\/$/, '')}/index.html`;
}

function resolveRelativeHref(filePath, href) {
	const docDir = path.dirname(filePath);
	const normalized = href.split('#')[0].split('?')[0];
	if (!normalized) return null;
	return path.normalize(path.join(docDir, normalized)).replace(/\\/g, '/');
}

async function checkInternalLink(distDir, sourceFile, href) {
	const normalized = normalizeInternalHref(href);
	if (!normalized) return null;
	const filePath = path.join(distDir, normalized.startsWith('/') ? normalized.slice(1) : normalized);
	try {
		await access(filePath, constants.F_OK);
		return null;
	} catch {
		return {
			type: 'internal',
			message: `Broken internal link -> ${href}`,
			source: sourceFile,
		};
	}
}

async function checkRelativeLink(sourceFile, href) {
	const candidate = resolveRelativeHref(sourceFile, href);
	if (!candidate) return null;

	const attempts = [];
	const normalized = path.isAbsolute(candidate) ? candidate : path.resolve(candidate);
	if (normalized.endsWith('.html')) {
		attempts.push(normalized);
	} else {
		const trimmed = normalized.replace(/\/$/, '');
		attempts.push(`${trimmed}.html`);
		attempts.push(path.join(trimmed, 'index.html'));
	}

	for (const attempt of attempts) {
		try {
			await access(attempt, constants.F_OK);
			return null;
		} catch {
			continue;
		}
	}

	return {
		type: 'internal',
		message: `Broken relative link -> ${href}`,
		source: sourceFile,
	};
}

async function probeExternal(url) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);
	try {
		const head = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
		if (head.ok) return null;
		const getResponse = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
		if (!getResponse.ok) {
			return `${getResponse.status} ${getResponse.statusText}`;
		}
		return null;
	} catch (error) {
		return error instanceof Error ? error.message : 'Unknown fetch error';
	} finally {
		clearTimeout(timeout);
	}
}

async function main() {
	const projectRoot = process.cwd();
	const distDir = path.join(projectRoot, 'dist');
	await ensureDist(distDir);

	const htmlFiles = await walkHtmlFiles(distDir);
	if (htmlFiles.length === 0) {
		log('No HTML files found in dist; nothing to check.');
		return;
	}

	const issues = [];
	const externalMap = new Map();

	for (const filePath of htmlFiles) {
		const html = await readFile(filePath, 'utf-8');
		const dom = new JSDOM(html);
		const anchors = Array.from(dom.window.document.querySelectorAll('a[href]'));

		for (const anchor of anchors) {
			const href = (anchor.getAttribute('href') || '').trim();
			if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
				continue;
			}

			if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
				const absoluteUrl = href.startsWith('//') ? `https:${href}` : href;
				if (!externalMap.has(absoluteUrl)) {
					externalMap.set(absoluteUrl, new Set());
				}
				externalMap.get(absoluteUrl).add(filePath);
				continue;
			}

			if (href.startsWith('/')) {
				const result = await checkInternalLink(distDir, filePath, href);
				if (result) issues.push(result);
				continue;
			}

			const result = await checkRelativeLink(filePath, href);
			if (result) issues.push(result);
		}
	}

	log(`Checking ${externalMap.size} external links...`);
	const externalIssues = [];
	const externalEntries = Array.from(externalMap.entries());
	const concurrency = 5;
	let index = 0;

	async function worker() {
		while (index < externalEntries.length) {
			const currentIndex = index++;
			const [url, sources] = externalEntries[currentIndex];
			const status = await probeExternal(url);
			if (status) {
				externalIssues.push({
					type: 'external',
					message: `External link failed -> ${url} (${status})`,
					sources: Array.from(sources),
				});
			} else {
				log(`OK ${url}`);
			}
			await delay(50);
		}
	}

	await Promise.all(Array.from({ length: Math.min(concurrency, externalEntries.length) }, worker));

	if (externalIssues.length) {
		issues.push(...externalIssues);
	}

	if (issues.length === 0) {
		log(`All links look good across ${htmlFiles.length} pages.`);
		return;
	}

	log(`Found ${issues.length} issues:`);
	for (const issue of issues) {
		if (issue.type === 'external') {
			console.warn(` - ${issue.message}`);
			console.warn(`   Referenced from:`);
			for (const source of issue.sources) {
				console.warn(`     • ${source}`);
			}
		} else {
			console.warn(` - ${issue.message}`);
			console.warn(`   Source: ${issue.source}`);
		}
	}
	process.exitCode = 1;
}

main().catch((err) => {
	console.error('\n[qa:links] Error:', err instanceof Error ? err.message : err);
	process.exit(1);
});