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
  - `dashboard/categories/` — `/dashboard/categorias`, full category CRUD (see "Categories" below).
  - `dashboard/businesses/` — `/dashboard/negocios`, full business (línea de negocio) CRUD (see
    "Businesses (Negocios)" below).
  - `dashboard/sales/` — `/dashboard/ventas`, the POS-style checkout screen (see "Sales (Ventas)" below).
  - `dashboard/suppliers/` — `/dashboard/proveedores`, full supplier CRUD (see "Suppliers (Proveedores)
    and Purchases (Compras)" below).
  - `dashboard/purchases/` — `/dashboard/compras`, the purchase-invoice screen (see "Suppliers
    (Proveedores) and Purchases (Compras)" below).
  - `dashboard/recharges/` — `/dashboard/recargas`, the daily electronic-recharge balance screen (see
    "Recargas Electrónicas" below).
  - `dashboard/reports/sales/`, `dashboard/reports/purchases/`, `dashboard/reports/recharges/` —
    `/dashboard/reportes-ventas`, `/dashboard/reportes-compras`, `/dashboard/reportes-recargas`,
    admin-only (see "Reportería" below).
  - `dashboard/users/` — `/dashboard/usuarios`, admin-only user CRUD (see "Users & Roles administration" below).
  - `dashboard/roles/` — `/dashboard/roles`, admin-only role CRUD (see "Users & Roles administration" below).
  - Every route is lazy-loaded via `loadComponent` in `app.routes.ts`.

### Auth

`AuthService` (`core/services/auth.service.ts`) talks to the real backend at
`${environment.apiUrl}/auth/*` (see `../comercial-jhoel-api/CLAUDE.md` for the backend contract). Its
public surface — `currentUser` signal, `isAuthenticated` computed, `login()`, `logout()`,
`changePassword()` — is the contract the rest of the app depends on; don't reach into
`localStorage`/`HttpClient` directly from a component.

- **Login is by `identifier`** (username or phone), not email — `login(identifier, password)` posts
  `{ identifier, password }` to `/auth/login`. `AuthUser` is `{ id, username, phone, role }`; there's no
  `name`/`email` on it anymore (that was the phase-1 fake-auth shape). `role` is
  `'SUPER_ADMIN' | 'ADMIN' | 'USER'` — `AuthService.isAdmin` (a computed signal) is `true` for the first
  two. It's UI-only: it hides admin-only controls (see "Inventory" below) for a better experience, but
  every write endpoint re-checks the role from the JWT server-side regardless of what this signal says.
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
CRUD screen, wired to the real backend — **no mock data left**. `InventoryService`
(`core/services/inventory.service.ts`) calls `${environment.apiUrl}/products`; `CategoryService`
(`core/services/category.service.ts`) calls `${environment.apiUrl}/categories` for the form's dropdown.

- **`Product.sku` is the barcode field** (`core/models/product.model.ts`), `string | null` — optional
  everywhere: the create/edit form's SKU input has no `required` validator (only `maxLength(64)` +
  a `[a-zA-Z0-9-]+` pattern, mirroring the backend's `CreateProductRequestDto`/`UpdateProductRequestDto`),
  and `ProductFormModalComponent.submit()` explicitly converts a blank field to `null`
  (`sku.trim() || null`) before sending — the backend's DTOs only skip validation for `null`/omitted, not
  an empty string, so sending `""` would fail the pattern check. `ProductTableComponent` sorts/searches
  null-safely by falling back to `''`. The inventory search box (`InventoryPageComponent.filteredProducts`)
  matches `sku` alongside `name`/`category`, so scanning or typing a barcode finds the product — same
  reason `GET /products`'s server-side `search` also matches `sku` now.
- **`Product` has both `category` (display name) and `categoryId`** (`core/models/product.model.ts`) — the
  backend's `categoryName` is what the table/cards show, `categoryId` is what `ProductInput` actually
  sends on create/update. `InventoryService`'s private `toProduct()` maps the API's
  `{ categoryId, categoryName, ... }` shape into that flat `Product`. `ProductInput` no longer has a
  `category` string field at all — `ProductFormModalComponent`'s category control is `categoryId`, bound
  to a real `<select>` populated from `CategoryService.getCategories()` (via
  `InventoryPageComponent.categoryOptions`), not a free-text/datalist field anymore.
- **`getProducts()` asks for `limit=100`** and still returns the full active list in one call —
  `InventoryPageComponent` keeps doing its own client-side search/filter/sort over that list (see below),
  even though the backend actually supports `search`/`categoryId`/`sortBy`/`sortDirection`/`page`/`limit`
  query params now. Wiring the toolbar to those instead of filtering client-side is a real future
  improvement, not done here — this was a deliberate "swap the data source, don't rearchitect the already-
  working filter UI" call.
- `getStockStatus(stock)` / `LOW_STOCK_THRESHOLD` / `STOCK_STATUS_LABEL` / `formatCurrency` (all in
  `core/models/product.model.ts`) are the single source of truth for "in-stock / low-stock / out-of-stock"
  classification and `Q`-prefixed price formatting — the summary tiles, the stock filter, and the table's
  badges all call the same functions, so the threshold only has one place to change. This is a *display*
  concept, unrelated to the backend's `isActive` (soft-delete flag) — `GET /products` only ever returns
  active products by default, so everything in this list is implicitly "not deleted" already.
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
- Filtering/search is entirely client-side (`InventoryPageComponent.filteredProducts` computed signal).
- **Column sorting** lives entirely inside `ProductTableComponent` (`sortColumn`/`sortDirection` signals,
  `sortedProducts` computed) — `@Input() products` is a signal-backed setter for this reason, not a plain
  field. Clicking a `<th>`'s `.sort-btn` toggles `asc`/`desc` on the same column or switches column
  (defaulting to `asc`); both the desktop `<table>` and the mobile `.card-list` iterate the same
  `sortedProducts()`, so sorting applies to both without duplicated logic. It's local-only (like the
  filtering above) — no column/direction params sent anywhere.
- **`canManage` (`AuthService.isAdmin`) gates the admin actions** — `InventoryToolbarComponent` hides
  "Agregar producto" and `ProductTableComponent` hides the entire Acciones column (desktop) / edit-delete
  buttons (mobile cards) when `false`. This is UX only: the backend's `RolesGuard` is the actual
  enforcement, and rejects a `USER`-role token with `403` even if these components are bypassed.
- **`DeleteConfirmModalComponent`'s copy says "se desactivará"**, not "se eliminará permanentemente" — the
  backend does a soft delete (`isActive=false`), the product stays in the DB and can be restored later.
  Don't revert this wording; it was deliberately fixed to stop lying to the user about what the action
  does.
- Error handling (all three mutations): `ProductFormModalComponent.submit()` and
  `InventoryPageComponent.confirmDelete()` extract the backend's real message via
  `core/utils/extract-error-message.ts` (shared with `AuthService`) rather than a generic string — a 409
  (duplicate active name), 400 (invalid/inactive category, bad price/stock), or 403 (role check, though the
  button shouldn't be visible to trigger this) all surface their actual backend message to the user.
- **Inventario is a sidebar sub-item of Librería**, not a top-level nav entry — `DashboardNavItem` has an
  optional `children` array (`core/models/dashboard-nav-item.model.ts`), and `DashboardSidebarComponent`
  renders any item's `children` as an indented `.sidebar__submenu` block right under it. Librería's own
  link still behaves exactly as before (navigates to its placeholder page); the submenu is purely
  additive. This is a general mechanism, not inventory-specific — any future nav item can get `children`
  the same way.

### Categories

`/dashboard/categorias` (`features/dashboard/categories/categories-page.component.ts`) is the
admin management screen for categories, wired to the real backend — mirrors the Inventory module's
structure exactly (component split, soft-delete pattern, `canManage` gating), per an explicit
"sigue el patrón ya establecido" instruction. `CategoryService` (`core/services/category.service.ts`)
now has full CRUD (`getCategories`, `getCategoryById`, `createCategory`, `updateCategory`,
`deleteCategory`) against `${environment.apiUrl}/categories` — the same service the Inventory form's
dropdown already used for `getCategories()` (default `includeInactive=false`).

- **This screen calls `getCategories(true)`** (`includeInactive=true`), unlike the Inventory dropdown's
  default call — it's the admin management view, so inactive categories must stay visible (with a
  status badge and filter chip) rather than disappearing. Don't change the default on
  `CategoryService.getCategories()` itself; pass `true` explicitly where inactive rows are wanted.
- **Soft delete keeps the row in the list, not removed** — `CategoriesPageComponent.confirmDelete()`
  updates the item in place to `{ ...c, isActive: false }` rather than filtering it out (contrast with
  a screen that only shows active items, where a delete would just drop the row). The table's delete
  action button is `[disabled]="!category.isActive"` so an already-inactive row can't be deleted again.
- Component split (`features/dashboard/categories/components/`): `CategorySummaryComponent` (3 KPI
  tiles — Total/Activas/Inactivas), `CategoryToolbarComponent` (search + `all`/`active`/`inactive`
  status chips + "Agregar categoría" gated by `canManage`), `CategoryTableComponent` (sortable by
  name/description/isActive, desktop `<table>` + mobile `.card-list`, pastel-blue header, loading
  skeleton, `EmptyStateComponent`), `CategoryFormModalComponent` (name + description textarea,
  create/edit via `[category]` being `null` or not, calls `CategoryService` directly), and
  `DeleteConfirmModalComponent` (selector `app-category-delete-confirm-modal`; copy says
  "se desactivará", never "eliminará permanentemente" — same non-lying wording rule as Inventory's).
- **"Categorías" is a sidebar sub-item of "Sistema"**, using the same `DashboardNavItem.children`
  mechanism documented under Inventory above — no new nav code was needed.
- `canManage`/`isAdmin` gating and error handling (`extractErrorMessage`) follow the identical pattern
  described under Inventory; see that section rather than duplicating it here.

### Businesses (Negocios)

`/dashboard/negocios` (`features/dashboard/businesses/businesses-page.component.ts`) manages the "Negocio"
lookup table a product belongs to (Librería, Tienda, Heladería, ...) — structurally an exact clone of the
Categories screen (same component split, same soft-delete confirm copy, same sortable table, same
`canManage`/`isAdmin` gating — visible read-only to `USER`, full CRUD for `ADMIN`/`SUPER_ADMIN`, not
admin-route-gated the way Usuarios/Roles are). `BusinessService` (`core/services/business.service.ts`)
mirrors `CategoryService` method-for-method against `${environment.apiUrl}/businesses`. "Negocios" sits in
the sidebar under "Sistema" next to "Categorías" via the same `DASHBOARD_NAV_ITEMS` children mechanism.

- **Every product now carries a required `businessId`** (`Product.businessId`/`business` display name in
  `core/models/product.model.ts`, `ProductInput.businessId`) — the product create/edit form
  (`ProductFormModalComponent`) has a second required `<select>` next to the category one, populated from
  `InventoryPageComponent.businessOptions` (`BusinessService.getBusinesses()`, active-only — fetched
  alongside `categoryOptions` in the same constructor, same pattern).
- **The inventory toolbar's business filter is derived from loaded products**, not fetched separately —
  `InventoryPageComponent.businesses` is `[...new Set(products().map(p => p.business))]`, the identical
  pattern `categories` already used. Don't confuse this with `businessOptions`: the filter dropdown shows
  only businesses *currently in use*, the form's dropdown shows every *active* business (a newly created
  business with no products yet won't appear in the filter until a product uses it — same asymmetry the
  category filter already has, not a bug).
- **`ProductTableComponent` sorts by `business` like any other column** (`ProductSortColumn` includes it);
  the desktop table has a dedicated "Negocio" column, the mobile card shows it appended to the category
  line (`{{ product.category }} · {{ product.business }}`) rather than as a separate row, to keep the card
  compact.

### Sales (Ventas)

`/dashboard/ventas` (`features/dashboard/sales/sales-page.component.ts`) is a POS-style checkout screen —
`SalesService` (`core/services/sales.service.ts`) talks to `${environment.apiUrl}/sales`. Unlike every
other module in this app, it's **not** a list/create/edit/delete management table — it's a single
receipt-building workflow: search → add → adjust quantity → save. "Ventas" sits under "Finanzas" in the
sidebar via the same `DashboardNavItem.children` mechanism Categorías/Inventario already use — `Finanzas`
itself still opens its own (unbuilt) placeholder page, exactly like `Librería` does above `Inventario`.

- **No route guard beyond `authGuard`** — any authenticated role (`SUPER_ADMIN`/`ADMIN`/`USER`) can reach
  this screen and register a sale. This mirrors the backend's own permission decision (see the backend
  `CLAUDE.md`'s Sales section): a cashier is realistically a `USER`-role account, so this can't be
  admin-gated the way Usuarios/Roles are. Don't add `adminGuard` here without also changing the backend.
- **The in-progress receipt is pure component state, not persisted anywhere** —
  `SalesPageComponent.items: signal<SaleDraftItem[]>([])`. Nothing is written to the backend until
  "Guardar venta" is pressed; removing a line only ever mutates this local array, never calls an API
  (per the ticket's explicit rule: inventory changes only on confirmed save, never on cart edits).
- **`core/models/sale.model.ts` centralizes all receipt math** — `calculateItemTotal`,
  `calculateSaleSubtotal`, `calculateSaleTotal` — exactly one place to change if discounts/taxes are added
  later (today `calculateSaleTotal` just calls `calculateSaleSubtotal`; it's kept as its own function
  specifically so that future rule lives in one function body, not a search-and-replace across
  components). `SaleItemsTableComponent`/`SaleSummaryComponent` both call these rather than computing
  inline — never duplicate the multiplication/reduction in a template.
- **Adding a product merges into the existing draft row instead of creating a new one**
  (`SalesPageComponent.onProductSelected`) — looks up by `productId` first; if found, increments quantity
  (capped at `product.stock`, with a toast if already at the cap); if not, pushes a new `SaleDraftItem`.
  This is the "no duplicate rows for the same product" rule from the ticket, enforced purely in this one
  method — no component needs to re-implement it.
- **`SaleDraftItem.availableStock` is a client-side UX guardrail only** — it's the `stock` value the
  product had *at search time*, used to cap the quantity stepper/input so the UI never lets you type past
  what you last saw available. It is not authoritative: the backend's `confirm_sale` Postgres function
  re-checks live stock (with row locking) at save time regardless, and a stale `availableStock` just means
  the save can still fail with a real "insufficient stock" error if the true stock dropped in the
  meantime — the UI cap is convenience, not the actual guarantee.
- **`ProductSearchComponent` is a debounced, server-side live search** (`debounceTime(250)` +
  `distinctUntilChanged()` + `switchMap` into `InventoryService.searchProducts()`, `takeUntilDestroyed()`)
  — the *first* component in this app to actually call the backend's `search=` query param on `/products`;
  every other product list (Inventario) still filters client-side over a full fetched list. Don't copy the
  Inventario pattern for a POS-style picker — a live incremental search against the server is the correct
  shape here, and `InventoryService.searchProducts()` (small `limit`, e.g. 8) exists specifically for it,
  separate from `getProducts()`'s full-list `limit=100` call.
  - A product already at zero stock still appears in results (so the cashier can see it exists) but its
    button is `disabled` and shows "Sin stock" — `select()` also hard-refuses if `stock <= 0`, so even a
    stale/race-y click can't add an out-of-stock item to the draft.
- **After a successful save, the draft resets to `[]`** and a success toast fires — the next search starts
  from an empty receipt. The "Guardar venta" button is disabled whenever the draft is empty **or**
  `isSaving()` is true, which is what prevents a double-submit from a second click while the request is
  in flight (per the ticket's explicit "no duplicar ventas" requirement) — this is the same
  `isSubmitting`-gates-the-button pattern every other create/edit modal in this app already uses.
- **No sales-history/list page was built** — the backend's `GET /sales`/`GET /sales/:id` exist and are
  tested (see backend `CLAUDE.md`), but the ticket's frontend section only specified the receipt-building
  screen; `SalesService.getSales()`/`getSaleById()` are implemented and ready for a future history view,
  just not wired into any route yet. Don't assume a "Ventas" history page exists elsewhere in the app.
- **New `minus` icon** was added to `shared/ui/icon/icon-registry.ts` for the quantity stepper's decrement
  button — nothing else in the app needed it before this module.

#### Real-time inventory reservation (follow-up change — read this before touching the receipt flow)

The component tree/file layout above is unchanged, but **the receipt is no longer purely local component
state** — it's a real, server-persisted `OPEN` sale (see the backend `CLAUDE.md`'s matching section) that's
mutated on every cart action, not just submitted once at the end. This was a deliberate architecture change
requested after the module first shipped; don't revert to the old "build locally, submit once" model.

- **`SalesPageComponent.items`/`total` are never computed locally** — they're always exactly the `Sale`
  object the last successful API call returned (`applySale()`). There is no client-side receipt-math
  (`calculateItemTotal`/`calculateSaleSubtotal`/`calculateSaleTotal` were removed from
  `core/models/sale.model.ts` entirely) and no optimistic update: a rejected change (insufficient stock,
  product deactivated mid-session) just leaves `items`/`total` untouched, because nothing was mutated ahead
  of the response in the first place — the previous quantity is still what's bound in the template.
- **Every add/+/−/direct-edit/remove calls `SalesService.adjustSaleItem(productId, quantityDelta)`**
  (`POST /sales/items`), computing the delta from the *last known server quantity* (`onQuantityChange`/
  `onRemoveItem` in `SalesPageComponent` look up the current item in `items()` first) — never send an
  absolute target quantity, the backend's `adjust_sale_item` function only understands deltas against its
  own authoritative row.
- **`pendingProductIds: Set<string>`** tracks which product's row has an in-flight request — `adjustItem()`
  refuses to start a second request for the same product while one is pending (prevents a rapid double-click
  on `+` from racing itself) and `SaleItemsTableComponent` renders that row visually disabled
  (`.sale-table__row--pending`/`.sale-card--pending`) via a `pendingProductIds` input passed straight through
  from the signal.
- **No more client-side stock ceiling** — `SaleItem` (the real API shape) carries no `availableStock`
  field, unlike the old `SaleDraftItem` it replaced. The quantity stepper's `+` button and direct-edit input
  have no upper clamp anymore; only a floor of 1 (removing is the separate, explicit "Quitar" action). The
  backend is now the live authority on every single change, so an over-limit attempt is simply rejected with
  a real error (toasted via `extractErrorMessage`) instead of being silently capped client-side against a
  number that could already be stale.
- **`SalesPageComponent`'s constructor calls `SalesService.getCurrentSale()`** to restore an in-progress
  receipt after a reload or re-navigation to `/dashboard/ventas` — this isn't just a UX nicety, it's
  necessary correctness: the stock for those items is *already* reserved server-side, so silently starting
  from an empty cart would make that reservation invisible (and un-cancelable) to the user. `getCurrentSale()`
  never throws — a 404 (no draft) or any other failure both resolve to `null`, so the page always just falls
  back to an empty receipt rather than needing special-case error handling for the common "nothing in
  progress" case.
- **New "Cancelar venta" action** (`SaleSummaryComponent`'s `cancel` output → `SalesPageComponent.cancelSale()`
  → `DELETE /sales/current`) — discards the whole receipt and restores every reserved line's stock in one
  call. Disabled whenever the receipt is empty or a save/cancel is already in flight, same `isBusy` gating
  pattern as every other create/edit modal's submit button in this app.
- **`SaleSummaryComponent` dropped the separate "Subtotal" row** — it used to show `Subtotal`/`Total` as two
  identical numbers (no discounts existed to make them differ); now only `Total` is shown, sourced directly
  from `Sale.total`, plus a small hint ("Inventario ya reservado — se confirma al guardar.") explaining that
  saving is a confirmation step, not the moment stock actually changes. If real subtotal/discount/tax logic
  is added later, that's the natural place to reintroduce a distinct subtotal row.
- **"Guardar venta" now calls `SalesService.confirmSale()`** (`POST /sales/confirm`, no body) instead of the
  old bulk `createSale(input)` — the draft's items already exist server-side, so there's nothing left to
  send. `SalesService.createSale()` (bulk, one-shot) is still implemented and exported for any other future
  caller; the Ventas screen itself no longer calls it.

### Suppliers (Proveedores) and Purchases (Compras)

`/dashboard/proveedores` (`features/dashboard/suppliers/`) is a structural clone of the
Categories/Businesses admin screen (same component split, same soft-delete confirm copy
— "se desactivará", never "eliminará permanentemente" — same sortable table, same `canManage`/`isAdmin`
gating). `SupplierService` (`core/services/supplier.service.ts`) mirrors `BusinessService`
method-for-method against `${environment.apiUrl}/suppliers`. `/dashboard/compras`
(`features/dashboard/purchases/`) is a receipt-building workflow shaped like Ventas' original one-shot
model (search → add → adjust → save-as-one-call) rather than its newer real-time reservation model — see
"Why one-shot, not real-time" below. Both sit under the sidebar via the existing
`DashboardNavItem.children` mechanism: "Proveedores" under "Sistema" (a reference table, like
Categorías/Negocios), "Compras" under "Finanzas" next to "Ventas" (an operational screen).

- **Why one-shot, not real-time**: Ventas reserves stock the instant a product is added because
  overselling is a real risk while a cashier is still building the receipt (see the Sales section above).
  Compras has no equivalent risk — increasing stock can't be "oversold" — and the ticket that built this
  screen explicitly requires that "Cancelar" never touch the database at all. A one-shot model gives that
  for free (there's nothing to roll back, because nothing was ever sent to the backend until "Guardar
  compra"), so `PurchaseDraftItem` (`core/models/purchase.model.ts`) is a genuine local-only draft type,
  unlike Sales' now-removed `SaleDraftItem` — Compras really does build its receipt client-side with zero
  round-trips until the final save, and that's a deliberate difference from Ventas' current architecture,
  not a regression back to Ventas' old one.
- **`calculatePurchaseItemTotal`/`calculatePurchaseSubtotal`/`calculatePurchaseTotal`**
  (`core/models/purchase.model.ts`) always multiply by `costPrice`, **never** `publicPrice` — a purchase
  invoice's total is what you paid, not what you'll sell for. `PurchaseItemsTableComponent` and
  `PurchasesPageComponent`'s `total` computed signal both call these rather than computing inline.
- **Adding a product merges into the existing draft row instead of creating a new one**
  (`PurchasesPageComponent.onProductSelected`), identical rule to Ventas — looks up by `productId` first,
  increments quantity on a match, otherwise pushes a new `PurchaseDraftItem` pre-filled with the product's
  *current* `costPrice`/`publicPrice`.
- **`quantity`, `costPrice`, and `publicPrice` are all independently editable per row**, unlike Ventas
  (which only lets you adjust quantity) — `PurchaseItemsTableComponent` emits `quantityChange`/
  `costPriceChange`/`publicPriceChange`, each clamped (`Math.max(...)`, quantity floor 1, prices floor 0)
  in the page component's handlers, with the row's total recalculating live off whichever field just
  changed. This is what lets the invoice's actual paid price differ from the product's last-known price —
  the whole point of the screen is to *set* that price for future purchases/sales.
- **`PurchaseProductSearchComponent` is its own copy of Ventas' `ProductSearchComponent`** (same
  `debounceTime(250)` + `distinctUntilChanged()` + `switchMap` + `takeUntilDestroyed()` shape, same
  `InventoryService.searchProducts()` call), not a shared/imported component — this repo's established
  convention (see Ventas' own note above) is a near-identical copy per feature folder rather than a
  cross-feature import, so each screen can diverge independently. The one real behavioral difference:
  **no out-of-stock disabling** — buying more of a zero-stock product is exactly the normal case for this
  screen, unlike Ventas where zero stock blocks the add.
- **The date picker is a plain native `<input type="date">`**, not a new library — there was no existing
  date-picker component anywhere in this codebase to reuse, and the ticket explicitly forbade adding a new
  dependency for it, so this was the minimal, no-new-dependency choice, not an oversight.
  `PurchasesPageComponent.purchaseDate` is a `signal<string>` in the exact `yyyy-MM-dd` shape the native
  input reads/writes; `purchaseDateAsDate` is a small derived `computed(() => new Date(...))` that exists
  solely so `SaveConfirmModalComponent`'s `@Input() purchaseDate: Date | null` gets a real `Date` rather
  than a string forced through `$any()` — introduced specifically to avoid that type-checker-bypassing
  hack. The `<input>`'s `[max]` is bound to `purchaseDate()` itself (today), so a future date can't be
  picked from the UI at all — the backend's 24-hour grace window (see the backend `CLAUDE.md`) exists for
  timezone-offset edge cases, not because the frontend allows picking tomorrow.
- **"Cancelar" only opens a confirmation dialog if the draft has items** (`requestCancel()` returns early
  otherwise) and, once confirmed, **calls no API at all** — `confirmCancel()` only resets local signals
  (`items`, `supplierId`, `purchaseDate` back to today). This is the one action in the entire dashboard
  that is guaranteed side-effect-free by construction (not just by convention) — there is no service call
  in that code path for a network layer to even intercept.
- **"Guardar compra" shows a second confirmation modal** (`SaveConfirmModalComponent`) summarizing
  Proveedor/Fecha/Productos count/Total *before* the real `PurchasesService.createPurchase()` call — a
  deliberate two-step confirmation (unlike Ventas, which saves on a single click) because a purchase
  invoice both changes stock and overwrites the product's current price, a bigger/harder-to-undo effect
  than a sale. `PurchasesService.createPurchase()` is a single bulk call (unlike Sales' many small
  `adjustSaleItem` calls) — Compras has no server-side draft to keep in sync, so there's nothing to send
  until this one moment.
- **After a successful save, the draft resets** (`resetDraft()`: empty items, cleared supplier, date back
  to today) and a success toast fires — mirrors Ventas' post-save reset.
- **No purchase-history list page was built**, same situation as Sales — `PurchasesService.getPurchases()`/
  `getPurchaseById()` exist and are ready for a future history view, just not wired into any route yet.
- **`SupplierFormModalComponent` has no uniqueness lock on `name`** (unlike `RoleFormModalComponent`'s
  system-role name lock) — only `taxId` is unique on the backend, and only among active suppliers, so
  there's no client-side rule to proactively enforce beyond normal required-field validation; a duplicate
  `taxId` surfaces via the real backend 409 through the same `extractErrorMessage` pattern every other
  form in this app uses.
- **New `truck` icon** was added to `shared/ui/icon/icon-registry.ts` for the Proveedores nav entry —
  nothing else in the app needed it before this module.

#### Draft persistence across navigation (follow-up change — read this before touching either receipt flow)

Both `PurchasesPageComponent` and `SalesPageComponent` used to own their receipt state directly as local
signals — which meant navigating away (e.g. to Inventario to check something) and back destroyed and
recreated the component, losing everything for Compras and forcing an extra network refetch for Ventas.
That state now lives in two root-provided singleton services instead — `PurchaseDraftStore` and
`SalesDraftStore` (`core/services/`) — and the two page components are thin views over them. **No new
state-management library was added**: Angular's own `providedIn: 'root'` singleton + signals is already
the right tool here, since a root service is never destroyed by route navigation, only by a full page
reload — exactly the persistence boundary this needed. `AuthService`'s existing `localStorage`-based
session persistence was the only prior precedent for "survive more than component lifetime" in this app;
the same reasoning (browser storage, scoped correctly) extends naturally to `sessionStorage` for Compras
below.

- **`PurchaseDraftStore` is the actual fix** — Compras has no server-side draft (see "Suppliers
  (Proveedores) and Purchases (Compras)" above: nothing is sent to the backend until "Guardar compra"), so
  before this change there was nothing anywhere holding the in-progress invoice except the doomed page
  component. The store now holds `supplierId`/`purchaseDate`/`items` as signals, exposes the same
  `onProductSelected`/`updateQuantity`/`updateCostPrice`/`updatePublicPrice`/`removeItem`/`setSupplier`/
  `setPurchaseDate`/`reset` surface the page component used to implement inline, and mirrors every mutation
  to `sessionStorage` under a key scoped by the current user's id
  (`cj_purchase_draft:<userId>`) — **`sessionStorage`, not `localStorage`**, was a deliberate choice: it
  survives a reload (the concrete "F5 accidental refresh" scenario) but clears itself when the tab closes,
  so an abandoned draft carrying real cost/price data doesn't linger indefinitely on a shared machine the
  way `localStorage` would. `PurchasesPageComponent` no longer owns `supplierId`/`purchaseDate`/`items` at
  all — every template binding reads `draft.*()` and every handler forwards straight to a store method.
- **`SalesDraftStore` doesn't need `sessionStorage` at all** — Ventas' receipt was already a real,
  server-persisted `OPEN` sale before this change (see the Sales section above: `GET /sales/current`,
  `adjust_sale_item`), so the *only* thing missing was somewhere for that state to live besides the page
  component that kept getting destroyed. Moving the exact same `items`/`total`/`pendingProductIds`/
  `isSaving`/`isCancelling` signals and the exact same `adjustItem`/`confirmSale`/`cancelSale` logic into a
  root singleton means revisiting Ventas after navigating away no longer needs to refetch
  `GET /sales/current` — the state that call would return is already sitting in the store, kept live by
  every mutation. A reload still goes through the constructor's one `getCurrentSale()` call, same as
  before this change.
- **Backend needed no changes for this ticket** — verified explicitly, not assumed: Ventas' `OPEN` sale
  mechanism already satisfied every persistence/validation requirement (survives navigation and reload by
  construction, is inherently scoped to the JWT's user, and `POST /sales/confirm` already re-validates
  stock/product state at save time), and Compras' one-shot `confirm_purchase` model already satisfies "no
  DB writes and no inventory changes while it's still a draft" by never being called until "Guardar
  compra". The only gap was purely a frontend one (state tied to a component's lifetime instead of the
  browser tab's), so only `comercial-jhoel-app` changed.
- **Sales gained a cancel confirmation it didn't have before** — this ticket's "mostrar confirmación al
  cancelar" requirement exposed a real gap: `SalesSummaryComponent`'s cancel button used to call
  `cancelSale()` directly, no confirmation step, unlike Compras which already had one. Fixed by adding
  `SaleCancelConfirmModalComponent` (`features/dashboard/sales/components/cancel-confirm-modal/`, selector
  `app-sale-cancel-confirm-modal`), an exact structural clone of Compras' own cancel modal (same
  `alert-triangle` icon, same "Volver"/danger-button shape), with wording that reflects Ventas' real
  effect: "el inventario reservado se restaurará" rather than Compras' "el inventario no se ha modificado
  todavía" — the two screens have opposite states at cancel time (Ventas has already reserved stock in
  real time; Compras never touched anything), so the copy is deliberately different even though the flow
  is now identical.
- **"Borrador en progreso" indicator**: `DashboardSidebarComponent` injects both stores and renders a
  small `.sidebar__draft-dot` (a plain gold `--color-accent-gold` dot, not a text badge — kept deliberately
  minimal per the ticket's "no debe ser invasivo") next to the "Ventas"/"Compras" sub-links whenever that
  store's `hasActiveDraft()` is `true`. Because the sidebar is part of `DashboardLayoutComponent`, which is
  mounted for every `/dashboard/*` route, both stores end up constructed as soon as any authenticated user
  reaches the dashboard — for `SalesDraftStore` this means its one `getCurrentSale()` call fires on
  dashboard load rather than waiting for the user to open Ventas, a deliberate trade-off (one extra request
  per session) in exchange for the indicator being visible from anywhere, not just the Ventas page itself.
- **`beforeunload` warning is Compras-only, and lives on `DashboardLayoutComponent`** (not on
  `PurchasesPageComponent`) specifically so it's still armed even if the user is on a *different* page (say
  Inventario) with a Compras draft pending — a page-component-scoped listener would have detached the
  moment they navigated away from Compras, which is exactly the scenario most likely to end in an
  accidental tab close. Guarded by `purchaseDraftStore.hasActiveDraft()` only: Ventas never gets this
  warning, deliberately, because its data literally cannot be lost by closing the tab (it's already a real
  DB row) — warning about a data-loss risk that doesn't exist would just be noise. Verified directly: with
  an active Compras draft, attempting to navigate away triggers the browser's native "leave site" prompt;
  with an empty draft (or only a Ventas draft), navigation proceeds unprompted.
- **Logout cleanup, and why the ordering matters**: `DashboardLayoutComponent.logout()` calls
  `salesDraftStore.resetOnLogout()` (clears only the in-memory signals — the real `OPEN` sale stays
  reserved server-side for that user, restored correctly next time they log in) and
  `purchaseDraftStore.reset()` (clears signals *and* removes the `sessionStorage` entry) **before**
  calling `authService.logout()`, not after — `PurchaseDraftStore`'s storage key is derived from
  `authService.currentUser()?.id` at call time, so clearing it after the session was already torn down
  would silently target nothing and leave the draft sitting in `sessionStorage` for whoever uses the tab
  next. Verified directly: building a Compras draft, confirming its `sessionStorage` key exists, logging
  out, and re-checking `sessionStorage` shows the key removed.
- **Cross-user isolation is structural, not just a logout side effect**: the `sessionStorage` key itself is
  scoped by user id (`cj_purchase_draft:<userId>`), so even without the logout cleanup above, a different
  user logging in on the same tab would read their *own* key, never the previous user's — the explicit
  clear-on-logout is hygiene (don't leave stale data sitting around) on top of an isolation guarantee that
  already exists independent of it. `SalesDraftStore` needs no equivalent scoping of its own: it holds
  nothing sensitive beyond what `GET /sales/current` already scopes to the caller's JWT.
- **No speculative re-validation of a restored draft** — the ticket raises the case of a draft referencing
  a product that's since gone inactive, changed price, or a supplier that's been deactivated, and asks
  that nothing be silently rewritten. Rather than pinging the backend per line item every time a draft is
  restored (extra requests, and a race against the very save it's trying to protect), both flows lean on
  the validation that already existed and is guaranteed to run at the one moment it actually matters:
  `POST /sales/confirm` and `POST /purchases` both fully re-validate product/supplier/stock state
  server-side, and any rejection surfaces through the existing `extractErrorMessage`/toast path — the user
  sees a real error naming the actual problem, and can then edit the offending row and retry, rather than
  the app guessing at a "fix" on their behalf.

### Reportería

`/dashboard/reportes-ventas` and `/dashboard/reportes-compras` (`features/dashboard/reports/`) are
admin-only analytics screens over Ventas/Compras history — filter, summarize, view detail, and export a
PDF. Both routes carry `canActivate: [adminGuard]` (same guard as Usuarios/Roles) and the sidebar's
"Reportería" entry (and its two children) carries `roles: ['SUPER_ADMIN', 'ADMIN']`, matching the
backend's own `@Roles('ADMIN', 'SUPER_ADMIN')` on every `/reports/*` route — a `USER` account never sees
the menu entry and gets a real `403` if it calls the API directly regardless.

- **Component split**: `SalesReportPageComponent`/`PurchasesReportPageComponent` are the orchestrators —
  own the filter/pagination/sort/view-mode signals, call `ReportsService`, and own the detail-modal
  open/loading/data state. Three components are genuinely shared between both reports (not duplicated,
  because both reports use them identically): `ReportSummaryComponent` (generic KPI-tile row — checked
  first that no existing summary component was generic enough to reuse directly; every other module's
  summary is bespoke to its own domain shape), `ReportPaginationComponent` (this app had *no* pagination
  component anywhere before this — every other paginated list filters/sorts client-side over a full
  fetched page — so this is the first one, deliberately generic since a future paginated screen can reuse
  it), and `ProductFilterSearchComponent` (`app-report-product-filter`) — adapted from Ventas'/Compras'
  own product-search dropdowns, but for a *filter*: no out-of-stock disabling (a report can reasonably
  filter by a product that's since sold out), and a persistent "selected" chip replaces the search box
  until cleared, since a filter selection sticks around instead of firing once per click like an
  add-to-receipt action does.
- **The results table and detail modal are NOT shared between the two reports** — `SalesReportTableComponent`/
  `PurchasesReportTableComponent` and `SaleDetailModalComponent`/`PurchaseDetailModalComponent` are
  separate, near-identical copies, following this codebase's established convention (see Ventas/Compras'
  own product-search components) of a small per-feature copy over a cross-feature shared component once
  the shapes genuinely diverge (Compras' table has a Proveedor column and its detail modal shows
  cost *and* public price per line; Ventas' doesn't).
- **Desktop-only tables, deliberately** — unlike Inventory/Categories/Suppliers/etc., the report tables
  have no separate mobile card-list. Both wrap in their own `overflow-x: auto` container (this app's
  standing rule for wide content), so they're still usable on a narrow viewport, just not reflowed —
  a scope call for an admin-only analytics screen, not an oversight.
- **Filters apply on an explicit "Aplicar filtros" click, not live** — matches the ticket's own mockup
  (a dedicated apply button, plus a separate "Limpiar filtros"). The date/category/product/user/
  (supplier) fields are plain local signals the form binds to directly; nothing refetches until
  `applyFilters()` runs, which also resets to page 1. Changing the sort column, the page, or the
  Detalle/Por-producto toggle *does* refetch immediately (no separate "apply" step for those) — only the
  filter fields themselves are staged behind the button, consistent with the mockup's own distinction
  between "type into these fields" and "act now" controls (page/sort/tab are the latter).
  `hasActiveFilters()` (used to enable/disable "Limpiar filtros") compares every filter signal against the
  same defaults `clearFilters()` restores, not just "is anything non-empty" — so a date range that's back
  to the default month even after being touched doesn't leave the button stuck enabled.
- **Default filter window is "current month"** (first day of the current month through today), computed
  fresh each time via a small local `firstDayOfMonthIsoDate()`/`todayIsoDate()` pair (plain local-time
  `Date` field math, not the UTC-offset dance Compras' own date picker used to need) — chosen over either
  "no filters" (every sale/purchase ever, on a system that will only grow) or a blank form requiring the
  user to always pick dates first. Both reports use the identical default for consistency.
- **"Por producto" is a second table, not a second page** — a small segmented `Detalle`/`Por producto`
  toggle above the results switches between the per-sale/per-purchase table and the grouped-by-product
  one, sharing the same filter panel and summary tiles above it; switching re-fetches only the table
  (`fetchTable()`), not the summary. The grouped table is written inline in each report page's own
  template rather than as a separate component — it's four columns with no sort/actions, genuinely too
  small to be worth a fourth component pair.
- **PDF export downloads through a real `Blob`**, not a rendered link: `ReportsService.exportSalesReportPdf()`/
  `exportPurchasesReportPdf()` call their endpoint with `responseType: 'blob'`, and
  `core/utils/download-blob.ts`'s `downloadBlob()` does the standard `URL.createObjectURL` +
  synthetic-`<a download>`-click + `URL.revokeObjectURL` dance to trigger the browser's real save-as. A
  failed export needs its own error-message path — `core/utils/extract-blob-error-message.ts`
  (`extractBlobErrorMessage()`) — because Angular hands back a blob-typed error body for a `blob`-typed
  request even when the backend actually returned a normal JSON error (400 invalid date range, 403,
  etc.); it reads the blob back to text and parses it so the real backend message still reaches the user
  instead of a generic "export failed" string.
- **New icons** (`shared/ui/icon/icon-registry.ts`): `download` (the export button), `filter` (the filter
  panel's own header), `bar-chart` (the "Reportería" nav entry) — none of the existing icons fit any of
  these three uses.
- **`businessId` filter** (follow-up addition) — a "Negocio" `<select>` next to Categoría, populated from
  `BusinessService.getBusinesses()`, in both report pages' filter panels.
- **Every filter field is a draft/applied pair, not a single signal** (follow-up change — read this before
  adding another filter field to either page). Originally each filter (`startDate`, `categoryId`, the
  selected product, etc.) was one signal, bound directly to its form control *and* read directly by
  `exportPdf()`/`fetchAll()`. That meant editing a dropdown and immediately clicking "Exportar PDF" —
  without clicking "Aplicar filtros" first — could export different data than the table still on screen
  was showing, since the edited signal was already live even though nothing had been re-fetched yet. Each
  page now keeps two copies of every filter: `draftStartDate`/`draftCategoryId`/`draftBusinessId`/
  `draftSelectedProduct`/`draftUserId`(/`draftSupplierId` for Compras) are what the form inputs are bound
  to — editing a field only ever touches these. The plain-named signals (`startDate`, `categoryId`, etc.)
  are the *applied* filters: the only ones `currentFilters()` reads, so they're the only ones the table,
  the summary tiles, and the PDF export ever see. They change in exactly two places —
  `applyFilters()` (copies draft → applied, then re-fetches) and `clearFilters()` (resets both draft and
  applied to the same defaults) — never anywhere else. This is what makes "the PDF always matches what's
  filtered/displayed" an actual guarantee rather than a best-effort: there is no code path where
  `exportPdf()` can see a filter value the visible table hasn't already re-fetched against.

#### Reporte de Recargas (follow-up — a third report joins the Reportería submenu)

`/dashboard/reportes-recargas` (`features/dashboard/reports/recharges/recharges-report-page.component.ts`)
is the third Reportería screen, added as a new child under the sidebar's "Reportería" item (next to
Reporte de Ventas/Compras), same `roles: ['SUPER_ADMIN', 'ADMIN']` gate and `adminGuard`-guarded route.
**Deliberately simpler** than `SalesReportPageComponent`/`PurchasesReportPageComponent`: no `viewMode`
toggle, no detail modal, no separate sortable-table component — Recargas has no line items to drill into
and no by-product breakdown, so each table row already shows everything (saldo anterior, compra, saldo del
día, saldo final, venta) and the table is written as a plain inline `<table>` in the page's own template,
not a fourth component pair.

- **Reuses the two already-generic Reportería components as-is** — `ReportSummaryComponent` and
  `ReportPaginationComponent`, confirmed fully generic before writing this page (not assumed), zero
  modification needed. `ProductFilterSearchComponent` does **not** apply here — Recargas has no product
  dimension — so the filter panel is just two date inputs and a "Tipo de recarga" `<select>` populated from
  the already-existing `RechargesService.getTypes()` call (no new backend endpoint needed for the
  dropdown).
- **No new `RechargesReportRow` model** — the table binds directly to the existing `RechargeDailyBalance`
  interface from `core/models/recharge.model.ts`, the same shape `RechargesPageComponent`'s own table
  already uses. `RechargesReportFilters`/`RechargesReportSummary` (`core/models/report.model.ts`) are the
  only two new types this feature needed.
  `ReportsService.getRechargesReport()`/`getRechargesReportSummary()`/`exportRechargesReportPdf()`
  (`core/services/reports.service.ts`) mirror the Sales/Purchases report calls method-for-method, including
  `exportRechargesReportPdf()`'s `responseType: 'blob'`.
- **Same draft/applied filter-signal split as Sales/Purchases** (see the note above this section) —
  `draftStartDate`/`draftEndDate`/`draftRechargeTypeId` are what the form binds to; `startDate`/`endDate`/
  `rechargeTypeId` are what `currentFilters()`, the table, the summary tiles, and `exportPdf()` all read,
  changed only by `applyFilters()`/`clearFilters()`. This is the same guarantee the Sales/Purchases pages
  already have: "Exportar PDF" can never export a filter edit that wasn't applied yet.
- **Default filter window is "current month"**, identical `firstDayOfMonthIsoDate()`/`todayIsoDate()`
  helpers (plain local-time `Date` field math) redefined locally in this page's own file rather than
  imported from Sales'/Purchases' report pages — this codebase's established "small per-feature copy over
  cross-feature coupling" convention for a 5-line date helper, same reasoning already documented for
  Purchases'/Recargas' own date-picker helpers elsewhere in this file.
- **Summary tiles**: Total comprado, Total vendido (with "N días cerrados" as its description line),
  Registros, Promedio de venta — icons `shopping-bag`/`trending-up`/`smartphone`/`bar-chart`, all four
  already existing in `icon-registry.ts` from earlier modules; no new icon was needed for this page.
- **PDF export downloads through the same `Blob`/`downloadBlob()`/`extractBlobErrorMessage()` path** the
  Sales/Purchases exports already use — no new download mechanism.
- **New sidebar entry**: `{ label: 'Reporte de Recargas', icon: 'smartphone', path: 'reportes-recargas' }`
  as the third child of `DASHBOARD_NAV_ITEMS`'s "Reportería" item (`core/data/dashboard-nav.data.ts`),
  reusing the same `smartphone` icon the operational Recargas nav entry already uses.
- **Verified directly in the browser**: the page renders with correct sidebar highlighting under
  "Reportería", the default current-month filter loads real data into the summary tiles and table,
  switching "Tipo de recarga" to "Tigo" and clicking "Aplicar filtros" correctly re-filters both the table
  and the summary tiles (recalculated totals, not just a client-side row hide), and clicking "Exportar PDF"
  fires `GET /api/reports/recharges/export` with exactly the applied filters (confirmed via the browser's
  own network panel), returns `200`, and the downloaded PDF's own rows/totals matched the on-screen
  filtered table exactly.
- **Gotcha caught and fixed on review**: the `Fecha` column originally bound `{{ row.date }}` raw, showing
  `2026-08-29` instead of the `dd/MM/yyyy` format every other report table in this app uses
  (`SalesReportTableComponent`, `PurchasesReportTableComponent`) — fixed with `{{ row.date | date:
  'dd/MM/yyyy' }}` (plus importing `DatePipe` from `@angular/common`, not `@angular/common/http`). Angular's
  `DatePipe` parses a plain `yyyy-MM-dd` string correctly as ISO 8601, so no `Date` object conversion was
  needed — same one-line fix pattern already used elsewhere in this codebase for this exact oversight.

### Users & Roles administration

`/dashboard/usuarios` and `/dashboard/roles` are admin-only screens under the "Sistema" submenu —
`UsersPageComponent`/`RolesPageComponent`, structurally identical to Categories (same component split,
soft-delete pattern, sortable table, form/delete modals). `UserService`/`RoleService`
(`core/services/{user,role}.service.ts`) talk to `${environment.apiUrl}/users` and `/roles`.

- **Two-layer access control, both required**: the sidebar hides "Usuarios"/"Roles" for a non-admin (new
  `roles?: string[]` field on `DashboardNavItem`, filtered in `DashboardSidebarComponent.navItems` — a
  computed signal now, not a plain property, so the template calls `navItems()`); a new `adminGuard`
  (`core/guards/admin.guard.ts`) on both routes in `app.routes.ts` blocks direct-URL access and redirects
  to `/dashboard` instead of a blank/broken page. Both are UX only — `RolesController`'s `@Roles(...)` on
  every route (including `GET`) is the real enforcement, and rejects a `USER`-role token with `403` even if
  the frontend is bypassed entirely.
- **No `canManage` gating inside these two pages**, unlike Categories/Inventory — every admin action is
  always shown, because the page itself is already unreachable for a non-admin (route guard + hidden nav).
  Don't add a `canManage` input here "for consistency"; it would be dead code, since `USER` never sees
  these components render at all.
- **`UserFormModalComponent`'s `password` field is conditionally required** — `Validators.required` is
  added/removed on the control in `ngOnChanges` depending on create vs. edit mode (required on create,
  optional-but-validated-if-present on edit — "Nueva contraseña (opcional)"). The role `<select>` is
  populated from `RoleService.getRoles()` (active-only, matching the categories dropdown pattern in
  Inventory).
- **`UserTableComponent`'s own "Desactivar" button is disabled for the logged-in admin's own row**
  (`isSelf(user)`, comparing against a `currentUserId` input sourced from `AuthService.currentUser()?.id`)
  — a proactive UX echo of the backend's `CannotDeactivateSelfError`; the backend still rejects it
  independently if this were ever bypassed.
- **`RoleFormModalComponent` locks the `name` field for the three seeded roles** (`SYSTEM_ROLE_NAMES` in
  `core/models/role.model.ts`, checked via `isSystemRole`) and **locks the `isActive` checkbox whenever the
  role has any assigned users** (`canDeactivate` getter, `role.usersCount === 0`) — both mirror backend
  rules (`SystemRoleImmutableError`, `RoleHasAssignedUsersError`) so the form fails proactively instead of
  round-tripping to the API first.
  - **Gotcha already hit and fixed here**: a plain `[disabled]="someExpression"` template binding on an
    element that also has `formControlName` does **not** reliably control the native `disabled` state —
    `ReactiveFormsModule`'s `FormControlName` directive owns that property itself, and a value-only
    binding can end up cosmetically inert (Angular reflects the binding in `ng-reflect-is-disabled` in dev
    tools, but the checkbox stays genuinely clickable). The fix is to call
    `this.form.controls.x.enable()` / `.disable()` imperatively in `ngOnChanges` instead — which is also
    exactly how the `name` field's system-role lock was already implemented, so both fields now follow the
    same pattern. If a future form needs a conditionally-disabled reactive-forms control, use the
    `.enable()`/`.disable()` approach from the start, not a template `[disabled]` binding.
- **Role table's "Rol" column shows `usersCount`** — this comes straight from the backend's `RoleOutput`
  (a per-role count query, not computed client-side); the delete/desactivar button is disabled whenever
  `usersCount > 0` or the role is already inactive, with a `title` tooltip explaining which.
- **No ADMIN/SUPER_ADMIN distinction anywhere in this module** — `AuthService.isAdmin` already treats both
  as equal (`ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN']`), and nothing in Users/Roles introduces a finer split.
  This was a deliberate decision (see the backend `CLAUDE.md`'s note in the same section), not an oversight
  — don't add SUPER_ADMIN-only UI without a corresponding backend rule to enforce it.

### Recargas Electrónicas

`/dashboard/recargas` (`features/dashboard/recharges/recharges-page.component.ts`) is the daily
register screen for electronic-airtime balances (Claro, Tigo, extensible) — `RechargesService`
(`core/services/recharges.service.ts`) talks to `${environment.apiUrl}/recharges`. Unlike Categorías/
Negocios/Proveedores, it's **not** a create/edit/delete CRUD table — like Ventas/Compras it's an
operational daily workflow, with no `canManage`/`isAdmin` gating on visibility (any authenticated role
reaches the page; the one role-sensitive control is described below). "Recargas Electrónicas" sits under
"Finanzas" in the sidebar next to Ventas/Compras via the existing `DashboardNavItem.children` mechanism,
using the pre-existing `smartphone` icon (already in `icon-registry.ts`, unused elsewhere) — no new icon
was needed for this module.

- **Component split**: `RechargesPageComponent` is the orchestrator — fetches `RechargeType[]` and
  today's `RechargeDailyBalance[]` in parallel (`forkJoin`) on construction, and owns the final-balance
  confirmation modal's open/target/draft/saving state. `RechargeTableComponent` is the main table (Tipo |
  Saldo Anterior | Compra | Saldo del Día | Saldo Final | Venta) — dumb, `@Input() balances`, desktop
  `<table>` + mobile `.card-list` like every other data table in this app. `RegisterPurchaseFormComponent`
  is **self-contained**, like `CategoryFormModalComponent`/`ProductFormModalComponent` — it calls
  `RechargesService.registerPurchase()` directly and emits the updated `RechargeDailyBalance` row, rather
  than emitting raw form values for the page to submit; the page's only job is to merge that row into its
  `balances` signal by id. `FinalBalanceConfirmModalComponent` is **dumb**, like Compras'
  `SaveConfirmModalComponent` — it only computes the `sale` preview (`dailyBalance - finalBalance`) for
  display and emits `confirmed`/`cancelled`; the page owns the actual `registerFinalBalance()` call. This
  split (self-contained form vs. dumb confirm-then-page-calls-the-service) is the same one this app
  already uses elsewhere — followed here, not invented for this module.
- **The "Saldo Final" column is the only editable cell in the table** — `RechargeTableComponent` keeps a
  plain `draftFinalBalance: Partial<Record<string, string>>` keyed by balance id (not a two-way
  `[(ngModel)]`, mirrors Compras' `purchase-items-table` price-input `(change)`-handler pattern), seeded
  from each row's persisted `finalBalance` in `ngOnChanges` **only for ids not already tracked** — so a
  value the user is mid-typing is never clobbered by a `balances` refresh triggered by *another* row's
  save. "Compra" itself has no input in the table at all; it's `totalPurchases`, always
  backend-computed and read-only here — registering an actual purchase only happens through the separate
  "Registrar compra" form.
- **Client-side "Guardar" gating mirrors the backend's own validation** (`canSave()`): the typed value
  must parse as a finite number, `>= 0`, and `<= balance.dailyBalance` — the exact
  `FINAL_BALANCE_EXCEEDS_DAILY`/`INVALID_FINAL_BALANCE` rules the stored function enforces server-side.
  This is a proactive UX echo, not the real guarantee — the backend re-validates independently regardless
  of what this check allowed through.
- **Re-editing an already-closed day is disabled in the UI for a non-admin**
  (`canEditFinalBalance(balance) = balance.finalBalance === null || isAdmin`, `isAdmin` passed down from
  `AuthService.isAdmin`) — the input and "Guardar" button are both `[disabled]`, with a small
  `lock`-icon hint ("Día cerrado — solo un administrador puede corregirlo.") explaining why. This
  mirrors the backend's `FinalBalanceEditForbiddenError` (403) rule exactly (see the backend `CLAUDE.md`'s
  matching section) — proactive UX, not the actual enforcement; a bypassed/stale frontend still gets
  rejected server-side. Verified directly: as a `USER` account, a day already closed by another user shows
  the locked state immediately, while a still-open day (first close) remains fully editable for that same
  `USER` account — matching the backend's "first close is operational, re-edit is admin-only" split.
- **The confirmation modal shows the calculated venta before saving, per the ticket's explicit
  requirement** — `FinalBalanceConfirmModalComponent` displays Saldo del día / Saldo final / **Venta
  calculada** (`dailyBalance - finalBalance`, computed in the modal itself from its own inputs, not
  re-fetched) before the real `PATCH .../final-balance` call ever fires. Verified directly end-to-end:
  typing 300 against an 800 daily balance shows "Venta calculada: Q500.00" in the modal, and the saved
  row's `Venta` column matches exactly after confirming.
- **No client-side receipt/draft state, unlike Ventas/Compras** — there is nothing here analogous to
  `SalesDraftStore`/`PurchaseDraftStore` to persist across navigation, because every mutation
  (`registerPurchase`, `registerFinalBalance`) is a single, already-atomic backend call with no
  multi-step "building" phase beforehand; reloading the page just re-fetches `GET /recharges/daily`, which
  is idempotent and always reflects the true current state.
- **No history/filter screen was built**, same situation as Ventas/Compras — the backend's
  `GET /recharges/history` exists and is ready for a future screen, but `RechargesService` deliberately
  has no `getHistory()` method yet; add one alongside that future screen rather than speculatively now.

#### Resumen de Ventas y Cuadre (follow-up addition — daily cash reconciliation card)

`SalesSummaryCardComponent` (`features/dashboard/recharges/components/sales-summary-card/`, selector
`app-recharge-sales-summary-card`) is a new Card sitting next to "Registrar compra" in a second row below
the main table — `RechargesPageComponent`'s layout changed from a single `2fr 1fr` grid to the table full
width on its own row, then a `.recharges__cards-row` (`1fr 1fr` on `lg+`) holding the purchase-form Card
and this new summary Card side by side.

- **Self-contained, like `RegisterPurchaseFormComponent`** — calls `RechargesService.getSalesSummary()`/
  `.registerSalesClosure()` directly rather than routing through the page; it owns its own
  `summary`/`loading`/`isSaving`/`totalCollectedDraft` signals. **No confirmation modal** — unlike the
  final-balance flow (which does have one), the ticket for this Card specified none: the result/color
  preview already updates live as the user types, which *is* the confirmation before "Guardar cuadre" is
  even clicked.
- **`totalCollectedDraft` is a draft, separate from `summary().totalCollected`** — editing the input only
  ever touches the draft signal; `summary()` only changes on a successful fetch or save. `previewResult`/
  `previewStatus` are `computed()` off `summary().totalSales - totalCollectedDraft()`, so the whole
  Resultado block — number, color, badge — recalculates on every keystroke with **zero network calls**.
  Verified directly: typing 250/300/350 against a totalSales of 300 live-cycled the result through
  naranja (`+Q50.00`, "Diferencia pendiente") → verde (`Q0.00`, "Cuadre correcto") → rojo (`-Q50.00`, "Se
  recaudó de más") with no page or network activity between keystrokes.
- **Colors are never the only signal — icon + badge text is what the ticket's own accessibility
  requirement asked for**: `getSalesClosureStatus()` (`core/models/recharge.model.ts`, pure function,
  `difference > 0 → 'positive' | < 0 → 'negative' | === 0 → 'zero'`) drives three lookup maps
  (`STATUS_TONE`/`STATUS_ICON`/`STATUS_TEXT` in the component) that feed the reused `<app-badge>` —
  `tone="success"`+`check-circle` "Cuadre correcto" (verde), `tone="gold"`+`alert-circle` "Diferencia
  pendiente" (naranja — reuses this app's existing gold accent token rather than inventing a new orange
  one), `tone="danger"`+`x-circle` "Se recaudó de más" (rojo). The big Resultado number itself gets the
  same three-way color via `.result__value--zero/--positive/--negative` CSS classes, sourced from the
  identical `previewStatus()` signal — one status computation, two visual representations, never two
  separate color decisions that could drift. **New `check-circle` icon** added to
  `shared/ui/icon/icon-registry.ts` — the only genuinely new icon this feature needed (`alert-circle`/
  `x-circle`/`lock` already existed from Reportería/Recargas' own final-balance lock hint).
- **Re-saving an already-saved cuadre is disabled in the UI for a non-admin**
  (`canSave = ... !summary.savedClosure || isAdmin()`), mirroring `RechargeTableComponent`'s identical
  `canEditFinalBalance` pattern exactly — the input is `[disabled]`, "Guardar cuadre" is `[disabled]`, and
  a matching lock hint ("Cuadre ya guardado hoy — solo un administrador puede corregirlo.") is shown.
  Proactive UX only; the backend's `SalesClosureEditForbiddenError` (403) is the real enforcement. Verified
  directly: as a `USER` account viewing a day another user already closed, both Claro/Tigo's saldo-final
  cells *and* the summary Card's input/button all show the locked state simultaneously — the two lock
  hints are independent (one per backend rule) but visually consistent.
- **`@Input() refreshTrigger` is how the Card learns today's sale figures changed** — the only action on
  this page that moves `totalClaro`/`totalTigo` is registering a `finalBalance` (a purchase alone never
  does, since a type's `sale` stays `null`/uncounted until it's closed). `RechargesPageComponent` owns a
  `salesSummaryRefreshTick` signal, incremented once inside `confirmFinalBalance()`'s success handler, and
  passes it down as `[refreshTrigger]`; the Card's `ngOnChanges` refetches `getSalesSummary()` whenever
  that input changes (skipping the first, constructor-triggered fetch via `!changes['refreshTrigger'].
  firstChange`). No shared store was introduced for this — a single incrementing counter `@Input()` is the
  simplest correct fix for "one component needs to know when another component's write affects data it
  displays," and this app has no existing cross-component event-bus pattern to reuse instead. Verified
  directly: closing Claro's day updated the summary Card's `Total vendido Claro`/`Total ventas` figures
  immediately, with no manual page reload.
- **`RegisterRechargeSalesClosureInput`/`RechargeSalesSummary` models** (`core/models/recharge.model.ts`)
  and `RechargesService.getSalesSummary()`/`.registerSalesClosure()` mirror the backend's
  `GET /recharges/sales-summary`/`POST /recharges/sales-closure` contract exactly, including
  `totalCollected`/`difference` typed `number | null` (always present, `null` until `savedClosure` is
  `true`) rather than the backend ticket's own example JSON's conditionally-omitted keys — a stable shape
  is simpler to consume from a template than an optional-key one, and every other DTO in this app already
  follows that same stable-shape convention.

#### Operation-date picker (follow-up — every screen in this module now works against a chosen date)

`RechargesPageComponent` owns one new `operationDate` signal (`yyyy-MM-dd`, defaults to today via a
local `todayIsoDate()` — the same field-based, no-UTC-dance technique as Reports' own copy, defined as a
free function at the top of the page component file rather than imported from a shared util, matching
this codebase's established "small per-feature copy over cross-feature coupling" convention for this
exact kind of 5-line helper). A native `<input type="date">` in the page header
(`.recharges__date-field`, `[max]` bound to the browser's own today so a future date can never be picked
from the UI — same reasoning as Purchases' own date input) is the single source of truth; the table, the
purchase form, and the summary Card are all now driven by it instead of an implicit "today" baked into
each one separately.

- **`RechargeTableComponent` needed no changes at all** — it already only ever renders whatever
  `balances` array the page hands it and emits events carrying the target row's own id; it has no
  internal notion of "today" to update.
- **`RegisterPurchaseFormComponent` gained one new required `@Input() operationDate`**, forwarded
  straight into its own `RechargesService.registerPurchase()` call — no other change; its own draft
  reset (amount field clears after a successful save) already satisfied the ticket's reset requirement
  before this follow-up even started.
- **`SalesSummaryCardComponent` is where the real complexity landed** — it now takes `operationDate` as a
  required `@Input()` alongside its pre-existing `refreshTrigger`, and its `ngOnChanges` refetches on
  *either* changing (a date switch also resets `totalCollectedDraft` to `null` first — "no mezclar
  información de diferentes fechas" — so a value typed for one date can never be silently submitted
  against another).
  - **Gotcha caught and fixed here**: the component's constructor used to call `fetchSummary()` directly
    (`RegisterPurchaseFormComponent`-style "self-contained" pattern), but Angular does not set `@Input()`
    values until *after* the constructor runs — so that first fetch was silently firing with
    `operationDate` still at its class-field default (`''`), which `RechargesService.getSalesSummary()`
    then sent as *no* date parameter at all, letting the backend fall back to **its own** `todayIsoDate()`
    rather than the frontend's. This is invisible whenever the browser and the API server happen to
    agree on what day it is, but this session's own Docker dev setup exposed it directly: the API
    container runs on UTC while the host/browser is several hours behind, so "today" briefly disagreed
    between them and the Card loaded a different date's real figures than the table sitting right next to
    it. Fixed by moving the *first* fetch into `ngOnChanges`'s `firstChange` branch (which fires once
    `operationDate` is genuinely set) and removing the constructor call entirely — the general lesson,
    not specific to this component: **never fetch using an `@Input()` from inside a constructor**; the
    earliest a component may safely read a real `@Input()` value is `ngOnChanges`/`ngOnInit`.
  - **The "reset after saving" requirement is satisfied by never pre-filling the draft from the server in
    the first place**, rather than by an explicit clear-after-save step layered on top — `totalCollectedDraft`
    is `null` on every fresh load, every date switch, and every successful save (it used to be seeded
    from `summary().totalCollected` post-save; that line was removed). The just-saved figures are never
    lost, though: a new read-only `saved-closure` block (green, `check-circle`) renders whenever
    `summary().savedClosure` is `true`, showing Recaudado/Resultado from `summary()` itself independent of
    whatever the now-empty input currently holds — "Total recaudado" is relabeled "Corregir total
    recaudado" in that state as a small extra clarity cue for the admin who's allowed to re-save.
  - **Result-preview block is now conditionally rendered** (`@if (previewResult() !== null)`) instead of
    always showing an "—" empty state — since the draft is empty far more often now (right after every
    load/save/date-switch), a persistently-visible empty result card would be more visual noise than
    signal; it only appears once the user is actually typing a value to preview.
- **Duplicate-save protection verified directly at two independent layers**: the frontend's existing
  `isSaving()` guard (unchanged by this follow-up) blocks a second `save()` call while one is in flight,
  and — since JS is single-threaded but a triple `button.click()` fired synchronously in the same tick
  can still race ahead of Angular's own change-detection updating `[disabled]` — the backend's own
  race-handling (see the API's CLAUDE.md, `register_recharge_sales_closure`) is the real, unconditional
  guarantee: three rapid clicks against the same date produced exactly one `recharge_sales_closures` row,
  confirmed via a direct database count immediately after.

#### Cuadre cycles (follow-up — "Guardar cuadre" now also resets the table for a new one)

A second, closely-related follow-up landed right after the operation-date picker: saving a cuadre now
also resets Claro/Tigo's whole row (saldo anterior, compra, saldo del día, saldo final) so a *second*
cuadre can be registered on the same calendar date, with saldo anterior automatically equal to the
previous cuadre's saldo final. This needed no schema/DTO awareness on the frontend at all — the backend's
`GET`/`POST` contracts are byte-for-byte unchanged (see the API's CLAUDE.md's own "Cuadre cycles" section
for the `sequence`-based mechanism that makes it possible) — the only gap was that nothing on this side
was refetching the *table* after a cuadre save.

- **`SalesSummaryCardComponent` gained one new `@Output() closureSaved`**, emitted right after a
  successful save (alongside the pre-existing `summary.set(...)`/toast/draft-reset it already did — none
  of that changed). `RechargesPageComponent` listens via `(closureSaved)="onClosureSaved()"`, which just
  calls the already-existing private `fetchBalances()` — the same method `onDateChange()` already used to
  refetch the table when the user picks a different date. No new fetch logic was written; this follow-up
  only wired an existing capability to a new trigger.
- **Why the summary Card doesn't also need an explicit refetch**: `RegisterRechargeSalesClosureUseCase`
  (backend) already returns the POST response by re-running `GetRechargeSalesSummaryUseCase` *after* the
  reset — so the response the Card's `save()` handler receives already reflects the fresh, empty cycle.
  The Card updating from its own response and the page's table refetching via `closureSaved` are two
  independent reactions to the same one write, not two use cases of the same fetch.
- **Verified directly, end to end**: registering Q600 in Claro purchases and Q300 in Tigo, closing both
  (saldo final Q100/Q50, ventas Q500/Q250), and saving a Q750 cuadre immediately updated the table in
  place — Claro's own row went from `Saldo Anterior Q0.00 / Compra Q600.00 / Saldo Final Q100.00` to
  `Saldo Anterior Q100.00 / Compra Q0.00 / Saldo Final (empty)` with no page reload, and the summary Card
  simultaneously reset to `Total ventas Q0.00` / an empty "Total recaudado" input — both panels reflecting
  the new cycle in the same screenshot.

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
