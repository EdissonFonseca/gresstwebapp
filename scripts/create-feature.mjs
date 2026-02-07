#!/usr/bin/env node
/**
 * Create a new feature from the template.
 * Usage: node scripts/create-feature.mjs <feature-name> [route]
 * Example: node scripts/create-feature.mjs order-detail /orders/:id
 * Run from project root. Then: add route to core/routing, run npm run docs:generate.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(__dirname, 'templates', 'feature');
const FEATURES_DIR = path.join(ROOT, 'src', 'features');

const PLACEHOLDERS = [
  ['__FEATURE_NAME__', (n) => n],
  ['__FEATURE_TITLE__', (n) => toTitleCase(n)],
  ['__FEATURE_PASCAL__', (n) => toPascalCase(n)],
  ['__FEATURE_ROUTE__', (n, r) => r || `/${n}`],
];

function toTitleCase(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
}

function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('');
}

function replaceInContent(content, featureName, route) {
  let out = content;
  for (const [placeholder, fn] of PLACEHOLDERS) {
    const value = fn.length === 2 ? fn(featureName, route) : fn(featureName);
    out = out.split(placeholder).join(value);
  }
  return out;
}

function getTargetPath(relativePath, featureName) {
  const replaced = relativePath
    .replace(/__FEATURE_PASCAL__/g, toPascalCase(featureName))
    .replace(/__FEATURE_NAME__/g, featureName);
  return path.join(FEATURES_DIR, featureName, replaced);
}

function copyTemplate(dir, relativePath, featureName, route) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = relativePath ? path.join(relativePath, entry.name) : entry.name;
    const src = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const targetDir = getTargetPath(rel, featureName);
      fs.mkdirSync(targetDir, { recursive: true });
      copyTemplate(src, rel, featureName, route);
    } else {
      const content = fs.readFileSync(src, 'utf8');
      const newContent = replaceInContent(content, featureName, route);
      const targetFile = getTargetPath(rel, featureName);
      fs.writeFileSync(targetFile, newContent, 'utf8');
      console.log('  +', path.relative(FEATURES_DIR, targetFile));
    }
  }
}

function main() {
  const featureName = process.argv[2];
  const route = process.argv[3];

  if (!featureName || !/^[a-z][a-z0-9-]*$/.test(featureName)) {
    console.error('Usage: node scripts/create-feature.mjs <feature-name> [route]');
    console.error('  feature-name: kebab-case (e.g. order-detail)');
    console.error('  route: optional (e.g. /order-detail or /orders/:id)');
    process.exit(1);
  }

  const targetFeatureDir = path.join(FEATURES_DIR, featureName);
  if (fs.existsSync(targetFeatureDir)) {
    console.error('Feature already exists:', targetFeatureDir);
    process.exit(1);
  }

  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error('Template not found:', TEMPLATE_DIR);
    process.exit(1);
  }

  fs.mkdirSync(targetFeatureDir, { recursive: true });
  console.log('Creating feature:', featureName, '| route:', route || `/${featureName}`);
  copyTemplate(TEMPLATE_DIR, '', featureName, route);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Add route to src/core/routing/routes.ts (e.g. myFeature: "/my-feature")');
  console.log('  2. Add route and component to src/core/routing/AppRouter.tsx');
  console.log('  3. Export feature in src/features/index.ts');
  console.log('  4. Run: npm run docs:generate');
  console.log('  5. Implement types, hook return value, and component UI.');
}

main();
