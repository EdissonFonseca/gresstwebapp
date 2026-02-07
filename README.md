# Gresst WebApp

React + Vite + TypeScript application with Feature-Driven architecture.

## Stack

- **React 18** + **Vite 6**
- **TypeScript** (strict mode)
- **ESLint** + **Prettier**
- **Vitest** + **Testing Library**
- Path aliases: `@features`, `@shared`, `@core`

## Setup

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL and optional VITE_API_USE_CREDENTIALS
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build (output: `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage (min 70% by default; override with `COVERAGE_*` env) |
| `npm run test:coverage:strict` | Run tests with 80% coverage thresholds |
| `npm run feature:new` | Create a new feature from template: `npm run feature:new <name> [route]` |
| `npm run docs:generate` | Regenerate feature READMEs and docs index |

## Path aliases

- `@features/*` → `src/features/*`
- `@shared/*` → `src/shared/*`
- `@core/*` → `src/core/*`

## Static deployment

The app builds to static files in `dist/` (HTML, JS, CSS, assets). Deploy the contents of `dist/` to any static host (e.g. Vercel, Netlify, S3, GitHub Pages). For subpath deployment, set `base` in `vite.config.ts` (e.g. `base: '/app/'`).

## Project structure (Feature-Driven)

- **`src/features/`** — Complete functionalities; **each user-visible page maps to one feature**. Each feature has `components/`, `hooks/`, `services/`, `types/`, `tests/`.
- **`src/shared/`** — Reusable components and utilities **without business logic**.
- **`src/core/`** — Global **config**, **auth**, **http**, and **routing**.
- **`src/test/`** — Global test setup.

Full rules: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** and `.cursor/rules/project-architecture.mdc`.  
API integration: **[docs/API-INTEGRATION.md](docs/API-INTEGRATION.md)**.  
CI/CD: **[docs/CI-CD.md](docs/CI-CD.md)**.  
**Documentation index** (architecture, ADRs, feature READMEs): **[docs/README.md](docs/README.md)**.  
Generate feature READMEs and docs index: **`npm run docs:generate`**.
