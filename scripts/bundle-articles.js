#!/usr/bin/env node
/**
 * Bundle articles/ into articles-bundle.json for tensorBIM3D-data repo.
 * Run from tensorBIM3D-data root: node scripts/bundle-articles.js
 * Reads: ./articles/  Output: ./articles-bundle.json
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const articlesDir = path.join(repoRoot, 'articles');
const outFile = path.join(repoRoot, 'articles-bundle.json');

if (!fs.existsSync(articlesDir)) {
  console.error('Articles directory not found:', articlesDir);
  process.exit(1);
}

const bundle = {};
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.')) {
      walk(full);
    } else if (e.isFile() && !e.name.startsWith('.')) {
      const ext = path.extname(e.name).toLowerCase();
      if (['.txt', '.md', ''].includes(ext)) {
        try {
          const content = fs.readFileSync(full, 'utf8');
          const rel = path.relative(articlesDir, full).replace(/\\/g, '/');
          bundle[rel] = content;
        } catch (_) {}
      }
    }
  }
}
walk(articlesDir);

fs.writeFileSync(outFile, JSON.stringify(bundle, null, 0), 'utf8');
console.log('Created', outFile, 'with', Object.keys(bundle).length, 'articles');
