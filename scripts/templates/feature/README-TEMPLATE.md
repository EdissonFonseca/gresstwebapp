# Feature template

This folder is the **template** for new features. Do not use it directly.

## Create a new feature

From project root:

```bash
npm run feature:new <feature-name> [route]
```

Examples:

- `npm run feature:new order-detail /orders/:id`
- `npm run feature:new settings /settings`

**feature-name:** kebab-case (e.g. `order-detail`). Prefer a short noun; the main component will be named `<PascalCase>Page` (e.g. OrderDetailPage). Avoid names ending in `-page` to prevent double "Page" in the component name.

**route:** Optional. Defaults to `/<feature-name>`.

## What you get

- Feature-Driven structure: `components/`, `hooks/`, `services/`, `types/`, `tests/`
- A page component, a hook (with load/state), and a service (API) stub
- Tests from the start: component, hook, and service tests
- README and a per-feature **MIGRATION-WEBFORMS.md** for WebForms migration

## After creating

1. Add route in `src/core/routing/routes.ts` and in `AppRouter.tsx`.
2. Export in `src/features/index.ts`.
3. Run `npm run docs:generate`.
4. Implement types, hook return value, and UI. Use the feature’s MIGRATION-WEBFORMS.md as the migration checklist.

See [docs/MIGRATION-WEBFORMS.md](../../../docs/MIGRATION-WEBFORMS.md).
