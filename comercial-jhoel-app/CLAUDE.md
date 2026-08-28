# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                        # ng serve — dev server on http://localhost:4200 (Vite/esbuild-based)
npm run build                    # production build → dist/comercial-jhoel-app
npm run watch                    # build --watch in development configuration
npm test                         # ng test (Karma/Jasmine) — no spec files exist yet in src/
```

There is no lint script configured (no ESLint set up in this project). To generate a new
standalone component/service in the existing structure, use `ng generate component <path> --skip-tests`
(the project schematics default to SCSS + `skipTests: true`, see `angular.json`).

## Architecture

Angular 19, standalone components only (no NgModules), built with the modern
`@angular-devkit/build-angular:application` builder — this is what makes `ng serve`/`ng build` run on
esbuild + Vite under the hood; there is no separate Vite config file to maintain.

### Layer structure (`src/app/`)

- **`core/`** — framework-agnostic app layer, no UI:
  - `models/` — plain interfaces (`ServiceItem`, `CatalogCategory`, `StatItem`, ...), barreled via `index.ts`.
  - `data/` — the actual editable content (nav links, services copy, stats, catalog categories,
    testimonials, contact channels, site-wide info in `site.data.ts`) as typed constants. Changing
    copy should almost always mean editing a file here, not a component template.
  - `services/` — one injectable per content resource (`CatalogService`, `OffersService`,
    `StatsService`, `TestimonialsService`, `BankAgentService`, `ContactService`). Each currently wraps
    its `data/*` constant in `of(...)` and carries a comment marking the exact line to swap for a real
    `HttpClient` call once that part of the NestJS/PostgreSQL backend exists. `AuthService` is the
    exception — it's already wired to the real backend (see "Auth" below), not a stub.
  - `services/fragment-scroll.service.ts` — see "Fragment scrolling" below; not content-related but
    lives in core because it's an app-wide cross-cutting concern.
  - `interceptors/auth.interceptor.ts` — functional `HttpInterceptorFn` registered in `app.config.ts`
    via `provideHttpClient(withInterceptors([authInterceptor]))`; see "Auth" below.

- **`shared/ui/`** — presentational, reusable atoms consumed everywhere: `ButtonComponent` (variants
  `primary`/`secondary`/`outline`/`ghost`/`danger` — `outline` and its dark border/text are for **dark**
  backgrounds only, e.g. the login page; use `ghost` for a secondary action on a light/white surface like
  a dashboard card or modal, or you'll ship unreadable light-on-light text), `CardComponent`,
  `BadgeComponent` (tones `brand`/`gold`/`success`/`danger`/`neutral-dark`/`neutral-light`),
  `IconComponent` (renders inline SVGs from a name→markup registry in `icon-registry.ts` — add new icons
  there, never inline raw `<svg>` in a feature template), `SectionComponent` (standard `<section>` shell:
  background tone, vertical spacing, container width, anchor id), `SectionHeadingComponent`,
  `StatCardComponent`, `ContainerComponent`, `EmptyStateComponent` (icon/title/description +
  content-projected action button, for "no results"/"nothing yet" states), `ToastContainerComponent`
  (mounted once in `app.component.html`; see "Notifications" below). Boolean `@Input()`s on these
  (`wide`, `fullWidth`, `disabled`, `hoverable`) use `booleanAttribute` transforms so they can be set as
  bare attributes (`<app-button fullWidth>`) under `strictTemplates`.

- **`layout/`** — `NavbarComponent` and `FooterComponent`, rendered once in `AppComponent` around
  `<router-outlet>` so they persist across all routes.

- **`features/`** — routed pages:
  - `landing/` — the home route (`/`). `LandingPageComponent` just composes one component per section
    from `landing/sections/*` (hero, credibility, services, catalog-preview, bank-agents, about,
    testimonials, contact) in order. Each section is self-contained (own `.html`/`.scss`, pulls its
    own data from a `core/services` injectable) so sections can be reordered, restyled, or removed
    independently.
  - `catalog/` — `/catalogo`, a category-listing placeholder page pending the real product catalog.
  - `auth/login/` — `/login`, a real login form (see "Auth" below).
  - `dashboard/inventory/` — `/dashboard/inventario`, full product CRUD (see "Inventory" below).
  - Every route is lazy-loaded via `loadComponent` in `app.routes.ts`.

### Auth

`AuthService` (`core/services/auth.service.ts`) talks to the real backend at
`${environment.apiUrl}/auth/*` (see `../comercial-jhoel-api/CLAUDE.md` for the backend contract). Its
public surface — `currentUser` signal, `isAuthenticated` computed, `login()`, `logout()`,
`changePassword()` — is the contract the rest of the app depends on; don't reach into
`localStorage`/`HttpClient` directly from a component.

- **Login is by `identifier`** (username or phone), not email — `login(identifier, password)` posts
  `{ identifier, password }` to `/auth/login`. `AuthUser` is `{ id, username, phone }`; there's no
  `name`/`email` on it anymore (that was the phase-1 fake-auth shape).
- **Response envelope**: the backend wraps every successful response as `{ success: true, data: T }`
  (`ResponseInterceptor` on the NestJS side) but returns error bodies flat
  (`{ success: false, statusCode, message }`). `AuthService` unwraps `.data` on the success path only —
  if you add a call to a new authenticated endpoint, remember the wrapper or you'll silently get
  `undefined` back (this bit us once: `tap(({ accessToken, user }) => ...)` on the raw response set both
  to `undefined` and `localStorage.setItem` coerced them to the literal string `"undefined"`).
- **Token storage**: JWT under `localStorage['cj_auth_token']`, user under `localStorage['cj_auth_session']`
  (both set together in `AuthService.setSession`, both cleared together in `logout()`). `restoreSession()`
  requires *both* to be present and parseable or it returns `null` — a session is never "half-restored".
- **`authInterceptor`** (`core/interceptors/auth.interceptor.ts`) attaches
  `Authorization: Bearer <token>` to any request whose URL starts with `environment.apiUrl` (never to
  third-party requests), and on a `401` from that same origin calls `authService.logout()` and navigates
  to `/login` — this is what handles an expired/invalid token network-wide, not per-component error
  handling.
- **`authGuard`** (`core/guards/auth.guard.ts`) is a `CanActivateFn` on the `/dashboard` route tree in
  `app.routes.ts`; it only checks `isAuthenticated()` (an in-memory signal seeded from `restoreSession()`
  at service construction), it doesn't re-validate the token against the backend — that happens lazily,
  the next time a request 401s.
- **Logout** (`DashboardLayoutComponent.logout()`) calls `authService.logout()` then navigates to
  `/login`.

### Inventory

`/dashboard/inventario` (`features/dashboard/inventory/inventory-page.component.ts`) is a full product
CRUD screen, still **mock-only** — `InventoryService` (`core/services/inventory.service.ts`) holds an
in-memory `Product[]` (seeded from `core/data/products.data.ts`) instead of calling the backend. It's
deliberately shaped like a real API client already:

- Every method (`getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`)
  returns an `Observable` via `of(...).pipe(delay(400))`, matching what `HttpClient` would give you —
  swapping the body for `this.http.get/post/patch/delete(\`${environment.apiUrl}/inventory/products\`, ...)`
  shouldn't require touching any component. Reads return a fresh snapshot, not a live stream: like a real
  GET, nothing pushes updates to already-subscribed callers, which is why `InventoryPageComponent` patches
  its own `products` signal locally from what `createProduct`/`updateProduct`/`deleteProduct` return
  rather than re-fetching the whole list after every mutation.
- `getStockStatus(stock)` / `LOW_STOCK_THRESHOLD` / `STOCK_STATUS_LABEL` / `formatCurrency` (all in
  `core/models/product.model.ts`) are the single source of truth for "in-stock / low-stock / out-of-stock"
  classification and `Q`-prefixed price formatting — the summary tiles, the stock filter, and the table's
  badges all call the same functions, so the threshold only has one place to change.
- Component split (`features/dashboard/inventory/components/`): `InventorySummaryComponent` (4 KPI
  tiles, computed from the product list — no separate summary endpoint), `InventoryToolbarComponent`
  (search + category `<select>` + stock filter chips + "Agregar producto", two-way bound via `FormsModule`
  since these are live filters, not a submitted form — the rest of the app uses `ReactiveFormsModule` for
  actual forms, keep that split), `ProductTableComponent` (a real `<table>` for `md`+ and a `.card-list`
  of cards below it, same markup rendered twice and toggled with `respond()`/plain `display:none` — no JS
  branching — plus the loading skeleton and empty state), `ProductFormModalComponent` (create **and**
  edit, distinguished by whether `[product]` is `null`; injects `InventoryService` directly and emits
  `saved`, mirroring `ChangePasswordModalComponent`'s self-contained pattern), `DeleteConfirmModalComponent`
  (dumb — parent owns the actual `deleteProduct()` call).
- Filtering/search is entirely client-side (`InventoryPageComponent.filteredProducts` computed signal) —
  fine for a mock array, but the comment on `InventoryService` is the reminder that a real backend should
  probably take `search`/`category`/`stock` as query params instead once this is wired up for real.
- **Column sorting** lives entirely inside `ProductTableComponent` (`sortColumn`/`sortDirection` signals,
  `sortedProducts` computed) — `@Input() products` is a signal-backed setter for this reason, not a plain
  field. Clicking a `<th>`'s `.sort-btn` toggles `asc`/`desc` on the same column or switches column
  (defaulting to `asc`); both the desktop `<table>` and the mobile `.card-list` iterate the same
  `sortedProducts()`, so sorting applies to both without duplicated logic. It's local-only (like the
  filtering above) — no column/direction params sent anywhere.
- **Inventario is a sidebar sub-item of Librería**, not a top-level nav entry — `DashboardNavItem` has an
  optional `children` array (`core/models/dashboard-nav-item.model.ts`), and `DashboardSidebarComponent`
  renders any item's `children` as an indented `.sidebar__submenu` block right under it. Librería's own
  link still behaves exactly as before (navigates to its placeholder page); the submenu is purely
  additive. This is a general mechanism, not inventory-specific — any future nav item can get `children`
  the same way.

### Notifications

`NotificationService` (`core/services/notification.service.ts`) is a global toast queue —
`success()`/`error()`/`info()` push onto a `signal<Toast[]>`, each auto-dismissing after 4s or on manual
close. `ToastContainerComponent` (`shared/ui/toast/`) renders that signal and is mounted once in
`app.component.html` (`--z-toast` already existed in `_tokens.scss` before this was built — nothing else
used it). Any feature needing create/update/delete feedback should inject `NotificationService` rather
than rolling its own inline success/error banner.

### Design tokens

All color/type/spacing/radius/shadow/motion values are CSS custom properties defined once in
`src/styles/_tokens.scss` (`:root`) — components consume `var(--color-primary)`, `var(--space-4)`,
etc., never hardcoded values, so the whole visual identity can be retuned from that one file (or live,
in devtools, while iterating). Breakpoints are SCSS variables in `src/styles/_breakpoints.scss`,
applied mobile-first through the `respond($name)` mixin in `_mixins.scss`
(`@include respond(lg) { ... }`). `angular.json` sets `stylePreprocessorOptions.includePaths` to
`src/styles`, so any component SCSS can `@use 'breakpoints' as bp;` / `@use 'mixins' as *;` without
relative-path climbing.

### Non-obvious gotchas already solved here

- **`ButtonComponent` conditionally renders `<a>` (routerLink), `<a>` (external href), or `<button>`**
  depending on which inputs are set. Content projected into `<app-button>` must go through a single
  `<ng-template #label><ng-content /></ng-template>` reused via `[ngTemplateOutlet]` in each branch —
  putting a separate `<ng-content>` in each `@if`/`@else if`/`@else` branch silently drops the
  projected content in two of the three branches. Follow the same pattern for any future
  polymorphic-element component.
- **Fragment (`#anchor`) scrolling is handled entirely by `FragmentScrollService`**, not by the
  router's `withInMemoryScrolling`. That router feature was removed from `app.config.ts` on purpose:
  its `scrollPositionRestoration` races with (and overwrites) a manually triggered scroll on the same
  navigation, and its `anchorScrolling` never fires for a fragment-only change on an already-active
  route (e.g. clicking "Contacto" while already on `/`) nor retries once a lazy-loaded route's DOM
  exists. `FragmentScrollService` instead subscribes to `router.routerState.root.fragment` directly and
  retries the `document.getElementById` lookup across animation frames. Any new anchor link just needs
  a matching `id`/`sectionId` on the target `SectionComponent` — no router config changes needed.
