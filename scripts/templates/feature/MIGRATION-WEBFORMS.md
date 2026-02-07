# WebForms → React: __FEATURE_TITLE__

Use this as a per-feature migration checklist. One WebForms page = one feature.

## Source page

| Item | Value |
|------|--------|
| Original .aspx | _e.g. OrderDetail.aspx_ |
| Original URL | _e.g. /orders/OrderDetail.aspx?id=123_ |
| Route in this app | `__FEATURE_ROUTE__` |

## Mapping

| WebForms | This feature |
|----------|----------------|
| Page_Load / OnInit | `use__FEATURE_PASCAL__` — load in `useEffect`, call service |
| Button click / PostBack | Handler in hook, pass to component as `onClick` / callback |
| GridView / Repeater data | Type in `types/`, fetch in service, state in hook, render in component |
| ViewState | React state in hook (or remove if derived from API) |
| Session | Auth/session from `@core/auth`; other data via services |
| Query string | `useSearchParams()` or route params in hook |

## Checklist

- [ ] Types defined in `types/index.ts` (DTOs, page props)
- [ ] API/service in `services/` calling backend (or mock for now)
- [ ] Hook loads data and exposes props for the page component
- [ ] Page component is presentational only (no direct API calls)
- [ ] Route registered in `@core/routing` and AppRouter
- [ ] Tests added for component, hook, and service
- [ ] Run `npm run docs:generate` after migration
