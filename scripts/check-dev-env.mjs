#!/usr/bin/env node
/**
 * Cross-platform dev environment snapshot (Mac + Windows).
 * Does not install or upgrade anything — only reports versions.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const expectedPath = join(__dirname, 'dev-env-expected.json');

function loadExpected() {
  try {
    const raw = readFileSync(expectedPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function run(cmd, args, label) {
  const shell = process.platform === 'win32';
  const r = spawnSync(cmd, args, {
    encoding: 'utf8',
    shell,
    windowsHide: true,
  });
  if (r.error || r.status !== 0) {
    return { label, ok: false, value: r.error?.code === 'ENOENT' ? '(nicht installiert)' : '(Fehler)' };
  }
  const v = (r.stdout || r.stderr || '').trim().split('\n')[0];
  return { label, ok: true, value: v || '(leer)' };
}

function parseSemver(s) {
  const m = String(s).match(/(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function cmp(a, b) {
  if (!a || !b) return 0;
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
}

function checkMin(current, minimum, name) {
  if (!minimum) return null;
  const cur = parseSemver(current);
  const min = parseSemver(minimum);
  if (!cur || !min) return null;
  if (cmp(cur, min) < 0) {
    return `${name}: installiert ${current.trim()} — Minimum laut dev-env-expected.json: ${minimum}`;
  }
  return null;
}

const expected = loadExpected();
const rows = [
  run('node', ['-v'], 'node'),
  run('npm', ['-v'], 'npm'),
  run('git', ['--version'], 'git'),
  run('gh', ['--version'], 'gh'),
  run('npx', ['vercel', '--version'], 'vercel (npx)'),
];

console.log('DNM Blog Composer — Dev-Umgebung\n');
for (const { label, ok, value } of rows) {
  const pad = label.padEnd(18);
  console.log(`${pad} ${ok ? value : value}`);
}

const warnings = [];
const nodeRow = rows.find((r) => r.label === 'node');
const npmRow = rows.find((r) => r.label === 'npm');
const gitRow = rows.find((r) => r.label === 'git');

if (nodeRow?.ok) {
  const w = checkMin(nodeRow.value, expected.node, 'Node');
  if (w) warnings.push(w);
}
if (npmRow?.ok) {
  const w = checkMin(npmRow.value, expected.npm, 'npm');
  if (w) warnings.push(w);
}
if (gitRow?.ok) {
  const w = checkMin(gitRow.value, expected.git, 'Git');
  if (w) warnings.push(w);
}

if (warnings.length) {
  console.log('\nHinweise (Minimum-Version):');
  warnings.forEach((w) => console.log(`  - ${w}`));
}

console.log('\nDetails und Update-Schritte: docs/DEV_TOOLS_SYNC.md');
