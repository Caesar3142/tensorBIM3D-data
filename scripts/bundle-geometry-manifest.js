#!/usr/bin/env node
/**
 * Generate geometry-library-manifest.json for tensorBIM3D-data repo.
 * Run from tensorBIM3D-data root: node scripts/bundle-geometry-manifest.js
 * Reads: ./geometry-library/  Output: ./geometry-library-manifest.json
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const geometryDir = path.join(repoRoot, 'geometry-library');
const outFile = path.join(repoRoot, 'geometry-library-manifest.json');

if (!fs.existsSync(geometryDir)) {
  console.error('Geometry library directory not found:', geometryDir);
  process.exit(1);
}

const files = [];
function walk(dir, baseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.')) {
      walk(full, baseDir);
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.stl')) {
      const rel = path.relative(baseDir, full).replace(/\\/g, '/');
      files.push(rel);
    }
  }
}
walk(geometryDir, geometryDir);
files.sort();

fs.writeFileSync(outFile, JSON.stringify(files, null, 2), 'utf8');
console.log('Created', outFile, 'with', files.length, 'STL files');
