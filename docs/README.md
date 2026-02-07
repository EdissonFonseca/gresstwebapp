# Project documentation

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
| [Migration from WebForms](MIGRATION-WEBFORMS.md) | Page-by-page migration, one .aspx = one feature |

## New features (template)

Create a feature from the template (structure + tests + docs): **`npm run feature:new <name> [route]`**. See `scripts/templates/feature/README-TEMPLATE.md`.

## Features (auto-generated)

Each feature has a README in `src/features/<name>/README.md`.

- [Home](../src/features/home/README.md)
- [User Profile](../src/features/user-profile/README.md)

---

Run `npm run docs:generate` to regenerate feature READMEs and this index.
