# Migrating from WebForms to React (page by page)

This app uses a **Feature-Driven** structure. Each WebForms page becomes **one feature** folder under `src/features/`. Migrate one page at a time.

## One page = one feature

| WebForms | This app |
|----------|----------|
| One .aspx + code-behind | One feature folder (e.g. `src/features/order-detail/`) |
| Page_Load | Hook (e.g. `useOrderDetail`) — load in `useEffect`, call service |
| Button / PostBack handlers | Callbacks in hook, passed as props to components |
| GridView / Repeater | Types in `types/`, data from service, render in React components |
| ViewState | React state in hook (or derive from API) |
| Session | `@core/auth` for user; other data via services |
| Query string / route params | `useSearchParams()` or route params in hook |

## Creating a new feature (migration target)

Use the template so the feature has structure, tests, and a migration checklist from the start:

```bash
npm run feature:new <feature-name> [route]
# Example: npm run feature:new order-detail /orders/:id
```

Then:

1. Add the route in `src/core/routing/routes.ts` and in `AppRouter.tsx`.
2. Export the feature in `src/features/index.ts`.
3. Run `npm run docs:generate`.
4. Fill in types, service (API), hook (state + load), and component (UI). Use the feature’s `MIGRATION-WEBFORMS.md` as the per-page checklist.

## Per-feature migration checklist

Each feature created from the template includes a **MIGRATION-WEBFORMS.md** with:

- Source .aspx and URL
- Mapping table (Page_Load → hook, events → callbacks, etc.)
- Checklist: types, service, hook, presentational component, route, tests, docs

Use it to track what’s been moved from the WebForms page into the feature.

## Tips

- **No business logic in components** — Keep UI presentational; put logic in hooks and services.
- **API first** — If the WebForms page calls a backend, add a service method and call it from the hook.
- **Incremental** — You can ship the new app with some routes still pointing to the old WebForms (e.g. via proxy or subpath) and migrate route by route.
