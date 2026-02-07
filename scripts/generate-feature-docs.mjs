#!/usr/bin/env node
/**
 * Generates or updates README.md for each feature in src/features.
 * Run from project root: node scripts/generate-feature-docs.mjs
 * Used by: npm run docs:generate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FEATURES_DIR = path.join(ROOT, 'src', 'features');
const ROUTES_FILE = path.join(ROOT, 'src', 'core', 'routing', 'routes.ts');

const FEATURE_CONTRACT = ['components', 'hooks', 'services', 'types', 'tests'];

function toTitleCase(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
}

function folderToRouteKey(folderName) {
  return folderName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function getRoutesMap() {
  try {
    const content = fs.readFileSync(ROUTES_FILE, 'utf8');
    const map = {};
    const re = /(\w+):\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      map[m[1]] = m[2];
    }
    return map;
  } catch {
    return {};
  }
}

function listDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function getFeatureStructure(featurePath) {
  const structure = {};
  for (const section of FEATURE_CONTRACT) {
    const sectionPath = path.join(featurePath, section);
    const entries = listDir(sectionPath).filter(
      (e) =>
        e.isFile() &&
        !e.name.startsWith('.') &&
        e.name !== 'index.ts' &&
        e.name !== '.gitkeep'
    );
    structure[section] = entries.map((e) => e.name).sort();
  }
  return structure;
}

function getRouteForFeature(featureName, routesMap) {
  const key = folderToRouteKey(featureName);
  return routesMap[key] ?? null;
}

function generateFeatureReadme(featureName, structure, route) {
  const title = toTitleCase(featureName);
  const routeLine = route ? `- **Route:** \`${route}\`\n` : '';

  const sectionsList = FEATURE_CONTRACT.map((s) => {
    const files = structure[s]?.length ? structure[s].filter((f) => !f.endsWith('.css')).join(', ') : '—';
    return `| \`${s}/\` | ${files} |`;
  }).join('\n');

  return `# ${title}

Feature: **${featureName}**. One user-visible page or capability.

${routeLine}
## Structure

| Folder | Contents |
|--------|----------|
${sectionsList}

## Public API

Import from \`@features/${featureName}\` (see \`index.ts\`). Do not import from internal paths.

## Contract

- **components/** — Presentational UI; data and callbacks via props
- **hooks/** — Data fetching, local state, side effects
- **services/** — API calls and business workflows
- **types/** — Feature-specific TypeScript types
- **tests/** — Unit and integration tests

See [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md).
`;
}

function generateDocsIndex(featureNames) {
  const featureLinks = featureNames
    .map((name) => `- [${toTitleCase(name)}](../src/features/${name}/README.md)`)
    .join('\n');

  return `# Project documentation

## Architecture

- [Architecture & conventions](ARCHITECTURE.md) — Feature-driven layout, core/shared/features, page–feature mapping.

## Technical decisions (ADR)

- [ADR index](adr/README.md) — Lightweight Architecture Decision Records.
- [ADR template](adr/0000-template.md)

## Other docs

| Doc | Description |
|-----|-------------|
| [API integration](API-INTEGRATION.md) | HTTP client, JWT, interceptors, env |
| [Testing](TESTING.md) | Strategy, coverage, feature checklist |
| [CI/CD](CI-CD.md) | Build, deploy to IIS, rollback |

## Features (auto-generated)

Each feature has a README in \`src/features/<name>/README.md\`.

${featureLinks}

---

Run \`npm run docs:generate\` to regenerate feature READMEs and this index.
`;
}

function main() {
  const routesMap = getRoutesMap();
  const entries = listDir(FEATURES_DIR).filter((e) => e.isDirectory() && !e.name.startsWith('.'));

  const featureNames = [];

  for (const entry of entries) {
    const featureName = entry.name;
    featureNames.push(featureName);
    const featurePath = path.join(FEATURES_DIR, featureName);
    const structure = getFeatureStructure(featurePath);
    const route = getRouteForFeature(featureName, routesMap);
    const readme = generateFeatureReadme(featureName, structure, route);
    const readmePath = path.join(featurePath, 'README.md');
    fs.writeFileSync(readmePath, readme, 'utf8');
    console.log('Updated:', readmePath);
  }

  const docsDir = path.join(ROOT, 'docs');
  const indexPath = path.join(docsDir, 'README.md');
  fs.writeFileSync(indexPath, generateDocsIndex(featureNames.sort()), 'utf8');
  console.log('Updated:', indexPath);

  console.log('Feature docs and docs index generated.');
}

main();
