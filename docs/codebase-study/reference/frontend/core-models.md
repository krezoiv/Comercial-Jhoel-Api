# Frontend `core-models`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [account-receivable-settlement.model.ts](#f-comercial-jhoel-app-src-app-core-models-account-receivable-settlement-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | How the client paid an account: physical cash or a deposit into a registered bank account. | 0 internas | 2 | Baja (2 consumidores) |
| [account-receivable.model.ts](#f-comercial-jhoel-app-src-app-core-models-account-receivable-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `AccountReceivable`, `AccountReceivableInput`, `AccountReceivableFilters`, `PaginatedAccountsReceivable` (sin comentario de documentación en el código). | 3 internas | 1 | Baja (1 consumidores) |
| [account-type.model.ts](#f-comercial-jhoel-app-src-app-core-models-account-type-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `AccountType`, `AccountTypeInput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [alert.model.ts](#f-comercial-jhoel-app-src-app-core-models-alert-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Always live/current state, never a historical log — see the API's CLAUDE.md "Alerts" section. | 0 internas | 1 | Baja (1 consumidores) |
| [api-response.model.ts](#f-comercial-jhoel-app-src-app-core-models-api-response-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Every successful NestJS response is wrapped by the API's global ResponseInterceptor as `{ success: true, data: T }` — error responses are NOT wrapped this way (GlobalExceptionFilter returns a flat `{ success: false, statusCode, message }` shape instead), so only success bodies need unwrapping. | 0 internas | 1 | Baja (1 consumidores) |
| [asset.model.ts](#f-comercial-jhoel-app-src-app-core-models-asset-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `Asset`, `AssetInput`, `AssetFilters`, `PaginatedAssets` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [bank-balance.model.ts](#f-comercial-jhoel-app-src-app-core-models-bank-balance-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | One row of the Agentes Bancarios → Bancos screen: an active bank plus its resolved previous balance and whatever final balance is already saved for the selected date (null if none yet). | 1 internas | 1 | Baja (1 consumidores) |
| [bank-deposit.model.ts](#f-comercial-jhoel-app-src-app-core-models-bank-deposit-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Fixed denominations offered by the cash-breakdown table — matches the ticket's own list, quetzales only. | 0 internas | 1 | Baja (1 consumidores) |
| [bank-movement.model.ts](#f-comercial-jhoel-app-src-app-core-models-bank-movement-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Espejo de `BANK_MOVEMENT_TYPES` del backend (`bank_account_movements.movement_type`). | 0 internas | 1 | Baja (1 consumidores) |
| [bank-operation.model.ts](#f-comercial-jhoel-app-src-app-core-models-bank-operation-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `BankOperation` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [bank.model.ts](#f-comercial-jhoel-app-src-app-core-models-bank-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | "Banco · Tipo · No. cuenta" — la etiqueta única de una cuenta en selectores (un mismo banco puede tener varias cuentas). | 1 internas | 2 | Baja (2 consumidores) |
| [business.model.ts](#f-comercial-jhoel-app-src-app-core-models-business-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `Business`, `BusinessInput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [cash-box.model.ts](#f-comercial-jhoel-app-src-app-core-models-cash-box-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | "Caja Contable" — an accumulated cash balance for Recargas Electrónicas y SIMs. | 0 internas | 1 | Baja (1 consumidores) |
| [cash-control.model.ts](#f-comercial-jhoel-app-src-app-core-models-cash-control-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Control de Efectivo — mirrors `modules/cash-control` of the API. | 0 internas | 1 | Baja (1 consumidores) |
| [cash-custody.model.ts](#f-comercial-jhoel-app-src-app-core-models-cash-custody-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Control de Efectivo → "Arqueo de Caja" and "Bodega" (cash under custody). | 0 internas | 1 | Baja (1 consumidores) |
| [catalog-bank.model.ts](#f-comercial-jhoel-app-src-app-core-models-catalog-bank-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Ficha completa de administración — catálogo público informativo, independiente del módulo financiero de Bancos (Agentes Bancarios/Cuadre). | 0 internas | 1 | Baja (1 consumidores) |
| [catalog-category.model.ts](#f-comercial-jhoel-app-src-app-core-models-catalog-category-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `CatalogCategory` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [catalog-phone.model.ts](#f-comercial-jhoel-app-src-app-core-models-catalog-phone-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Una fila "otra especificación" configurable desde el panel. | 0 internas | 1 | Baja (1 consumidores) |
| [catalog-product.model.ts](#f-comercial-jhoel-app-src-app-core-models-catalog-product-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Ficha completa de administración — nombre/precio/categoría/negocio se leen en vivo de Inventario, nunca se editan aquí. | 0 internas | 1 | Baja (1 consumidores) |
| [catalog-request.model.ts](#f-comercial-jhoel-app-src-app-core-models-catalog-request-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Solicitud de interés (compra o crédito Krediya) — snapshot congelado al momento de crearse, nunca releído del teléfono. | 0 internas | 1 | Baja (1 consumidores) |
| [category.model.ts](#f-comercial-jhoel-app-src-app-core-models-category-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `Category`, `CategoryInput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [client.model.ts](#f-comercial-jhoel-app-src-app-core-models-client-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `Client`, `ClientInput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [closed-day.model.ts](#f-comercial-jhoel-app-src-app-core-models-closed-day-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `ClosedDaysFilters`, `ClosedDayRow`, `DayAuditLogEntry`, `ClosedDayBankRow`, `ClosedDayReconciliation` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [company-settings.model.ts](#f-comercial-jhoel-app-src-app-core-models-company-settings-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | The one, always-existing "datos de la librería" row — never created or deleted, only updated. | 0 internas | 1 | Baja (1 consumidores) |
| [contact-channel.model.ts](#f-comercial-jhoel-app-src-app-core-models-contact-channel-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `ContactChannel`, `SocialLink`, `ContactFormPayload` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [cuadre-agentes.model.spec.ts](#f-comercial-jhoel-app-src-app-core-models-cuadre-agentes-model-spec-ts) | .ts | Prueba unitaria | Core (servicios, modelos, guards) | Prueba unitaria (sin comentario de documentación en el código). | 1 internas | 0 | Soporte (pruebas) |
| [cuadre-agentes.model.ts](#f-comercial-jhoel-app-src-app-core-models-cuadre-agentes-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Whether `finalBalance` adds to or subtracts from `totalBanks` — decided by the backend from the account type, never re-derived here from `accountTypeName`. | 0 internas | 3 | Media (3 consumidores) |
| [dashboard-metrics.model.ts](#f-comercial-jhoel-app-src-app-core-models-dashboard-metrics-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | `GET /dashboard/summary` — admin-only on the backend (`@Roles`), backs the Resumen dashboard's Ventas de Recargas / Ventas / Compras / Transacciones Bancarias sections. | 0 internas | 1 | Baja (1 consumidores) |
| [dashboard-nav-item.model.ts](#f-comercial-jhoel-app-src-app-core-models-dashboard-nav-item-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `DashboardNavItem` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [dashboard-summary-item.model.ts](#f-comercial-jhoel-app-src-app-core-models-dashboard-summary-item-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `DashboardSummaryItem` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [financial-day-review.model.ts](#f-comercial-jhoel-app-src-app-core-models-financial-day-review-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Sistema → Administración financiera → Revisión de días operativos. | 0 internas | 1 | Baja (1 consumidores) |
| [guayacan-cash-box.model.ts](#f-comercial-jhoel-app-src-app-core-models-guayacan-cash-box-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Tipos del Kardex de EFECTIVO. | 0 internas | 1 | Baja (1 consumidores) |
| [ice-cream-purchase.model.ts](#f-comercial-jhoel-app-src-app-core-models-ice-cream-purchase-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `calculateIceCreamPurchaseItemTotal`, `calculateIceCreamPurchaseTotal`, `IceCreamPurchaseItem`, `IceCreamPurchase`, `IceCreamPurchaseDraftItem` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [ice-cream-sale.model.ts](#f-comercial-jhoel-app-src-app-core-models-ice-cream-sale-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `calculateIceCreamSaleItemTotal`, `calculateIceCreamSaleTotal`, `IceCreamSaleItem`, `IceCreamSale`, `IceCreamSaleDraftItem` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [ice-cream.model.ts](#f-comercial-jhoel-app-src-app-core-models-ice-cream-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `getIceCreamStockStatus`, `IceCream`, `IceCreamInput`, `IceCreamStockStatus`, `ICE_CREAM_LOW_STOCK_THRESHOLD` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [index.ts](#f-comercial-jhoel-app-src-app-core-models-index-ts) | .ts | Barrel (re-exportación) | Core (servicios, modelos, guards) | Barrel (re-exportación) (sin comentario de documentación en el código). | 66 internas | 415 | Alta (415 consumidores) |
| [inventory.model.ts](#f-comercial-jhoel-app-src-app-core-models-inventory-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | An extensible stock location (Bodega, Vitrina, ...) — adding a new one is a backend admin action, never a frontend code change. | 0 internas | 1 | Baja (1 consumidores) |
| [kardex.model.ts](#f-comercial-jhoel-app-src-app-core-models-kardex-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `KardexMovement`, `KardexStatement`, `RegisterKardexMovementInput`, `KardexStatementFilters`, `ActiveBalanceSummary` (sin comentario de documentación en el código). | 0 internas; ext.: rxjs | 3 | Media (3 consumidores) |
| [keyboard-shortcut.model.ts](#f-comercial-jhoel-app-src-app-core-models-keyboard-shortcut-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | A global keyboard shortcut → dashboard route mapping, backed by `GET/POST/PATCH/DELETE /keyboard-shortcuts` — configurable from "Sistema → Atajos de Teclado". | 0 internas | 1 | Baja (1 consumidores) |
| [landing-background.model.ts](#f-comercial-jhoel-app-src-app-core-models-landing-background-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Las secciones reales de la landing pública — mismos `sectionId` que ya usa cada `&lt;app-section&gt;` (y `inicio` para el Hero). | 0 internas | 1 | Baja (1 consumidores) |
| [nav-link.model.ts](#f-comercial-jhoel-app-src-app-core-models-nav-link-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `NavLink` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [news-article.model.ts](#f-comercial-jhoel-app-src-app-core-models-news-article-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Ficha completa de administración — contenido editorial, no un producto. | 0 internas | 1 | Baja (1 consumidores) |
| [news-subscriber.model.ts](#f-comercial-jhoel-app-src-app-core-models-news-subscriber-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `NewsSubscriberTypeSummary`, `NewsSubscriber`, `NewsSubscriberAuditEntry`, `PushDeviceSummary`, `NewsSubscriberDetail` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [news-type.model.ts](#f-comercial-jhoel-app-src-app-core-models-news-type-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Ficha admin — catálogo configurable "Tipos de Noticias" (Sistema → Tipos de Noticias). | 0 internas | 1 | Baja (1 consumidores) |
| [phone.model.ts](#f-comercial-jhoel-app-src-app-core-models-phone-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | One individually-identified physical phone unit — mirrors the backend's `PhoneResponseDto` exactly. | 0 internas | 1 | Baja (1 consumidores) |
| [presentation-type.model.ts](#f-comercial-jhoel-app-src-app-core-models-presentation-type-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `PresentationType`, `PresentationTypeListItem`, `PresentationTypeInput`, `PresentationTypeFilters` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [product.model.ts](#f-comercial-jhoel-app-src-app-core-models-product-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Looks up one location's quantity from a product's breakdown — 0 (not undefined) when the location has no row yet, since "no row" and "zero stock" mean the same thing to a caller. | 1 internas | 1 | Baja (1 consumidores) |
| [purchase.model.ts](#f-comercial-jhoel-app-src-app-core-models-purchase-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Single source of truth for invoice math — the table row, the summary, and the save confirmation dialog all call these instead of computing inline. | 0 internas | 1 | Baja (1 consumidores) |
| [push-notification.model.ts](#f-comercial-jhoel-app-src-app-core-models-push-notification-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Estados reales que `PushNotificationService` puede distinguir — no los 6 nombrados en el pedido original tal cual, por una limitación genuina de la plataforma: la API `Notification.permission` del navegador solo expone `'default' \| 'granted' \| 'denied'`, y NUNCA distingue "el usuario lo negó una vez" de "el navegador lo bloqueó permanentemente" — ambos casos llegan como `'denied'`. | 0 internas | 1 | Baja (1 consumidores) |
| [quotation.model.ts](#f-comercial-jhoel-app-src-app-core-models-quotation-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Mirrors `create_quotation()`'s own math exactly, so the live cart preview always matches what gets saved. | 0 internas | 1 | Baja (1 consumidores) |
| [recharge-day.model.ts](#f-comercial-jhoel-app-src-app-core-models-recharge-day-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | "Apertura del Día"/"Cerrar Día" for Recargas Electrónicas — fully independent from Bancos/Cuadre Agentes' own `DayWorkStatus`/`DayStatus` (see `cuadre-agentes.model.ts`): separate table, separate lifecycle on the backend, so a separate type here too, never a shared one. | 0 internas | 1 | Baja (1 consumidores) |
| [recharge-sim.model.ts](#f-comercial-jhoel-app-src-app-core-models-recharge-sim-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | SIM Claro / SIM Tigo — physical, stock-tracked products administered exclusively from Recargas Electrónicas. | 0 internas | 1 | Baja (1 consumidores) |
| [recharge.model.ts](#f-comercial-jhoel-app-src-app-core-models-recharge-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | `currentBalance / balanceLimit * 100` — nunca `Math.min(pct, 100)`, el saldo puede superar el límite configurado (p. | 0 internas | 1 | Baja (1 consumidores) |
| [report.model.ts](#f-comercial-jhoel-app-src-app-core-models-report-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `PaginatedReport`, `SalesReportFilters`, `PurchasesReportFilters`, `SalesReportRow`, `SalesReportSummary` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [role.model.ts](#f-comercial-jhoel-app-src-app-core-models-role-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `Role`, `CreateRoleInput`, `UpdateRoleInput`, `SYSTEM_ROLE_NAMES` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [sale.model.ts](#f-comercial-jhoel-app-src-app-core-models-sale-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `SaleItem`, `Sale`, `CreateSaleItemInput`, `CreateSaleInput`, `SalesDailyStat` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [sales-cash-box.model.ts](#f-comercial-jhoel-app-src-app-core-models-sales-cash-box-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | One negocio's accumulated (all-time, never reset) balance — mirrors `SalesCashBoxBalanceOutput`. | 0 internas | 1 | Baja (1 consumidores) |
| [sales-register.model.ts](#f-comercial-jhoel-app-src-app-core-models-sales-register-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Mirrors `SalesRegisterProductOutput` — one product's totals within one negocio, for one business day. | 0 internas | 1 | Baja (1 consumidores) |
| [service-item.model.ts](#f-comercial-jhoel-app-src-app-core-models-service-item-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `ServiceItem` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [stat-item.model.ts](#f-comercial-jhoel-app-src-app-core-models-stat-item-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `StatItem` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [supplier.model.ts](#f-comercial-jhoel-app-src-app-core-models-supplier-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `Supplier`, `SupplierInput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [theme.model.ts](#f-comercial-jhoel-app-src-app-core-models-theme-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | "Modo Claro / Modo Oscuro" — preferencia individual del usuario, persistida en `users.theme` (backend). | 0 internas | 1 | Baja (1 consumidores) |
| [ticket.model.ts](#f-comercial-jhoel-app-src-app-core-models-ticket-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `calculateTicketDraftItemTotal`, `calculateTicketDraftTotal`, `TicketItem`, `Ticket`, `TicketSummary` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [toast.model.ts](#f-comercial-jhoel-app-src-app-core-models-toast-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `Toast`, `ToastType` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [transaction-bank.model.ts](#f-comercial-jhoel-app-src-app-core-models-transaction-bank-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | "Banco Agente" — the catalog Transaccionar's bank dropdown reads from. | 0 internas | 1 | Baja (1 consumidores) |
| [transaction-type.model.spec.ts](#f-comercial-jhoel-app-src-app-core-models-transaction-type-model-spec-ts) | .ts | Prueba unitaria | Core (servicios, modelos, guards) | Prueba unitaria (sin comentario de documentación en el código). | 1 internas | 0 | Soporte (pruebas) |
| [transaction-type.model.ts](#f-comercial-jhoel-app-src-app-core-models-transaction-type-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Curated subset of the shared icon registry — mirrors the backend's own `TRANSACTION_TYPE_ICONS` whitelist exactly (`transaction-types` module, `domain/entities/transaction-type.entity.ts`). | 0 internas | 2 | Baja (2 consumidores) |
| [unit-of-measure.model.ts](#f-comercial-jhoel-app-src-app-core-models-unit-of-measure-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `UnitOfMeasure`, `UnitOfMeasureListItem`, `UnitOfMeasureInput`, `UnitOfMeasureFilters` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [user.model.ts](#f-comercial-jhoel-app-src-app-core-models-user-model-ts) | .ts | Modelo / tipos | Core (servicios, modelos, guards) | Modelo / tipos: declara `User`, `CreateUserInput`, `UpdateUserInput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-core-models-account-receivable-settlement-model-ts"></a>

### account-receivable-settlement.model.ts

- **Ruta:** [account-receivable-settlement.model.ts](../../../../comercial-jhoel-app/src/app/core/models/account-receivable-settlement.model.ts) (`comercial-jhoel-app/src/app/core/models/account-receivable-settlement.model.ts`, 158 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** How the client paid an account: physical cash or a deposit into a registered bank account.
- **Consumidores:** [account-receivable.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-account-receivable-model-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface ChargeBalance` (L19): One account with its pending amount — always from the backend (`ar_charge_balances`). — miembros: `id`, `clientId`, `clientName`, `date`, `description`, `originalAmount`, `paidAmount`, `pendingAmount`, `status`, `createdAt`
- `interface ClientPendingCharges` (L32): sin documentación — miembros: `clientId`, `clientName`, `charges`, `totalPending`
- `interface SettlementItemInput` (L39): sin documentación — miembros: `accountReceivableId`, `amount`
- `interface SettlementPreviewInput` (L45): sin documentación — miembros: `clientId`, `items`, `paymentMethod`, `bankId`
- `interface SettlementPreviewLine` (L52) extends ChargeBalance: sin documentación — miembros: `amountToPay`, `pendingAfter`
- `interface SettlementPreview` (L57): sin documentación — miembros: `clientId`, `clientName`, `paymentMethod`, `lines`, `total`, `cash`, `bank`
- `interface SettleAccountsReceivableInput` (L67) extends SettlementPreviewInput: sin documentación — miembros: `referenceNumber`, `observations`, `expectedTotal`, `clientRequestId`
- `interface SettlementDetail` (L75): sin documentación — miembros: `id`, `accountReceivableId`, `accountDate`, `accountDescription`, `accountOriginalAmount`, `amountPaid`, `previousBalance`, `newBalance`
- `interface Settlement` (L86): sin documentación — miembros: `id`, `clientId`, `clientName`, `paymentMethod`, `bankId`, `bankName`, `bankAccountNumber`, `referenceNumber`, `totalAmount`, `accountsCount`, `status`, `observations`, `cashMovementId`, `cashBalanceAfter`, `bankMovementId`, `bankBalanceAfter`, `operationalDate`, `cutPeriodNumber`, `createdByUsername`, `createdAt`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface SettlementWithDetails` (L112) extends Settlement: sin documentación — miembros: `details`
- `interface SettlementResult` (L116): sin documentación — miembros: `operation`, `cashBalance`
- `interface ChargePayment` (L122): sin documentación — miembros: `operationId`, `amountPaid`, `previousBalance`, `newBalance`, `paymentMethod`, `bankName`, `referenceNumber`, `status`, `accountsCount`, `createdByUsername`, `createdAt`, `observations`
- `interface ChargePaymentHistory` (L137): sin documentación — miembros: `charge`, `payments`
- `interface SettlementFilters` (L142): sin documentación — miembros: `clientId`, `status`, `paymentMethod`, `dateFrom`, `dateTo`, `page`, `limit`
- `interface PaginatedSettlements` (L152): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `type SettlementPaymentMethod` (L2) = `'EFECTIVO' \| 'DEPOSITO_BANCARIO'` — How the client paid an account: physical cash or a deposit into a registered bank account.
- `type SettlementStatus` (L3) = `'APLICADO' \| 'ANULADO'`
- `type ChargePaymentStatus` (L5) = `'PENDIENTE' \| 'PARCIAL' \| 'CANCELADA'` — Collection state of one account (CARGO), computed by the backend.

**Constantes exportadas:**

- `SETTLEMENT_METHOD_LABEL` (L7) = `{ EFECTIVO: 'Efectivo', DEPOSITO_BANCARIO: 'Depósito bancario', }`
- `CHARGE_STATUS_LABEL` (L12) = `{ PENDIENTE: 'Pendiente', PARCIAL: 'Parcial', CANCELADA: 'Cancelada', }`
<a id="f-comercial-jhoel-app-src-app-core-models-account-receivable-model-ts"></a>

### account-receivable.model.ts

- **Ruta:** [account-receivable.model.ts](../../../../comercial-jhoel-app/src/app/core/models/account-receivable.model.ts) (`comercial-jhoel-app/src/app/core/models/account-receivable.model.ts`, 52 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `AccountReceivable`, `AccountReceivableInput`, `AccountReceivableFilters`, `PaginatedAccountsReceivable` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [account-receivable-settlement.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-account-receivable-settlement-model-ts), [kardex.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-kardex-model-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts)
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface AccountReceivable` (L4): sin documentación — miembros: `id`, `clientId`, `clientName`, `date`, `amount`, `movementType`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdByUsername`, `updatedByUsername`, `pendingAmount`, `paidAmount`, `paymentStatus`
- `interface AccountReceivableInput` (L24): Payload for create/update — the backend assigns id/isActive/timestamps/clientName. — miembros: `clientId`, `date`, `amount`, `description`
- `interface AccountReceivableFilters` (L31): sin documentación — miembros: `clientId`, `dateFrom`, `dateTo`, `minAmount`, `maxAmount`, `search`, `isActive`, `page`, `limit`
- `interface PaginatedAccountsReceivable` (L44): sin documentación — miembros: `items`, `total`, `page`, `limit`
<a id="f-comercial-jhoel-app-src-app-core-models-account-type-model-ts"></a>

### account-type.model.ts

- **Ruta:** [account-type.model.ts](../../../../comercial-jhoel-app/src/app/core/models/account-type.model.ts) (`comercial-jhoel-app/src/app/core/models/account-type.model.ts`, 13 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `AccountType`, `AccountTypeInput` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface AccountType` (L1): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`
- `interface AccountTypeInput` (L10): Payload for create/update — the backend assigns id/isActive/timestamps. — miembros: `name`
<a id="f-comercial-jhoel-app-src-app-core-models-alert-model-ts"></a>

### alert.model.ts

- **Ruta:** [alert.model.ts](../../../../comercial-jhoel-app/src/app/core/models/alert.model.ts) (`comercial-jhoel-app/src/app/core/models/alert.model.ts`, 70 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Always live/current state, never a historical log — see the API's CLAUDE.md "Alerts" section.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Alert` (L18): Always live/current state, never a historical log — see the API's CLAUDE.md "Alerts" section. — miembros: `key`, `type`, `priority`, `title`, `description`, `amount`, `date`, `route`, `referenceId`, `isRead`
- `interface AlertsResult` (L31): sin documentación — miembros: `count`, `total`, `items`
- `interface AlertSettings` (L61): The one global alert threshold — everything else (stock mínimo, saldo mínimo) lives on its own owning entity (product location, recharge type), not here. — miembros: `purchasePaymentAlertDays`, `updatedAt`, `updatedByUsername`
- `interface UpdateAlertSettingsInput` (L67): sin documentación — miembros: `purchasePaymentAlertDays`
- `type AlertType` (L1) = `\| 'PURCHASE_PAYMENT_DUE' \| 'PURCHASE_PAYMENT_OVERDUE' \| 'LOW_INVENTORY' \| 'LOW_RECHARGE_BALANCE' \| 'NEGATIVE_CASH_BOX_BALANCE' \| 'CATALOG_REQUEST_NEW'`
- `type AlertPriority` (L9) = `'CRITICAL' \| 'HIGH' \| 'MEDIUM'`

**Constantes exportadas:**

- `ALERT_PRIORITY_TONE` (L39): `tone` feeds `&lt;app-badge&gt;`; `icon` an `&lt;app-icon&gt;` — one lookup per priority, reused anywhere an alert is rendered. = `{ CRITICAL: 'danger', HIGH: 'gold', MEDIUM: 'neutral-dark', }`
- `ALERT_PRIORITY_ICON` (L45) = `{ CRITICAL: 'alert-circle', HIGH: 'alert-triangle', MEDIUM: 'alert-triangle', }`
- `ALERT_TYPE_ICON` (L51) = `{ PURCHASE_PAYMENT_DUE: 'credit-card', PURCHASE_PAYMENT_OVERDUE: 'credit-card', LOW_INVENTORY: 'package', LOW_`
<a id="f-comercial-jhoel-app-src-app-core-models-api-response-model-ts"></a>

### api-response.model.ts

- **Ruta:** [api-response.model.ts](../../../../comercial-jhoel-app/src/app/core/models/api-response.model.ts) (`comercial-jhoel-app/src/app/core/models/api-response.model.ts`, 18 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Every successful NestJS response is wrapped by the API's global ResponseInterceptor as `{ success: true, data: T }` — error responses are NOT wrapped this way (GlobalExceptionFilter returns a flat `{ success: false, statusCode, message }` shape instead), so only success bodies need unwrapping.
- **Descripción del autor (comentario del archivo):** Every successful NestJS response is wrapped by the API's global ResponseInterceptor as `{ success: true, data: T }` — error responses are NOT wrapped this way (GlobalExceptionFilter returns a flat `{ success: false, statusCode, message }` shape instead), so only success bodies need unwrapping.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface ApiSuccessResponse` (L8): Every successful NestJS response is wrapped by the API's global ResponseInterceptor as `{ success: true, data: T }` — error responses are NOT wrapped this way (GlobalExceptionFilter returns a flat `{ success: false, statusCode, message }` shape instead), so only success bodies need unwrapping. — miembros: `data`
- `interface PaginatedResponse` (L12): sin documentación — miembros: `items`, `total`, `page`, `limit`
<a id="f-comercial-jhoel-app-src-app-core-models-asset-model-ts"></a>

### asset.model.ts

- **Ruta:** [asset.model.ts](../../../../comercial-jhoel-app/src/app/core/models/asset.model.ts) (`comercial-jhoel-app/src/app/core/models/asset.model.ts`, 48 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `Asset`, `AssetInput`, `AssetFilters`, `PaginatedAssets` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [kardex.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-kardex-model-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts)
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Asset` (L3): sin documentación — miembros: `id`, `clientId`, `clientName`, `date`, `amount`, `movementType`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdByUsername`, `updatedByUsername`
- `interface AssetInput` (L20): Payload for create/update — the backend assigns id/isActive/timestamps/clientName. — miembros: `clientId`, `date`, `amount`, `description`
- `interface AssetFilters` (L27): sin documentación — miembros: `clientId`, `dateFrom`, `dateTo`, `minAmount`, `maxAmount`, `search`, `isActive`, `page`, `limit`
- `interface PaginatedAssets` (L40): sin documentación — miembros: `items`, `total`, `page`, `limit`
<a id="f-comercial-jhoel-app-src-app-core-models-bank-balance-model-ts"></a>

### bank-balance.model.ts

- **Ruta:** [bank-balance.model.ts](../../../../comercial-jhoel-app/src/app/core/models/bank-balance.model.ts) (`comercial-jhoel-app/src/app/core/models/bank-balance.model.ts`, 49 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** One row of the Agentes Bancarios → Bancos screen: an active bank plus its resolved previous balance and whatever final balance is already saved for the selected date (null if none yet).
- **Depende de (archivos del proyecto):** [bank.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-bank-model-ts)
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface BankBalanceView` (L4): One row of the Agentes Bancarios → Bancos screen: an active bank plus its resolved previous balance and whatever final balance is already saved for the selected date (null if none yet). — miembros: `bankId`, `bankName`, `accountNumber`, `accountTypeName`, `previousBalance`, `finalBalance`, `currentBalance`, `specialAccount`, `maxBalance`
- `interface SaveBankBalanceEntryInput` (L17): sin documentación — miembros: `bankId`, `finalBalance`
- `interface SaveBankBalancesInput` (L22): sin documentación — miembros: `operationDate`, `entries`
- `interface SaveBankBalancesResult` (L27): sin documentación — miembros: `savedCount`
- `interface BankBalanceStripItem` (L36): Un renglón de la tira de saldos (Transaccionar / Resumen) — `GET /banks/balance-strip`. — miembros: `bankId`, `bankName`, `accountNumber`, `accountTypeName`, `specialAccount`, `currentBalance`, `lastChange`, `lastMovementAt`, `trend`, `trendTone`
<a id="f-comercial-jhoel-app-src-app-core-models-bank-deposit-model-ts"></a>

### bank-deposit.model.ts

- **Ruta:** [bank-deposit.model.ts](../../../../comercial-jhoel-app/src/app/core/models/bank-deposit.model.ts) (`comercial-jhoel-app/src/app/core/models/bank-deposit.model.ts`, 233 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Fixed denominations offered by the cash-breakdown table — matches the ticket's own list, quetzales only.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositCashDetail` (L4): sin documentación — miembros: `id`, `denomination`, `quantity`, `subtotal`
- `interface BankDepositTransaction` (L11): sin documentación — miembros: `id`, `sequence`, `amount`
- `interface BankDepositOperation` (L18): Full shape returned by `POST /bank-deposits` and `GET /bank-deposits/:id`. — miembros: `id`, `transactionBankId`, `transactionBankName`, `bankAccountId`, `bankAccountName`, `bankAccountNumber`, `totalAmount`, `transactionCount`, `totalCash`, `totalDistributed`, `operationDate`, `changeGiven`, `netCashApplied`, `cashBreakdownEnabled`, `clientName`, `description`, `clientId`, `transactionTypeId`, `transactionTypeName`, `userId`, `username`, `cashDetails`, `transactions`, `createdAt`, `updatedAt`…
- `interface BankDepositOperationSummary` (L80): Lighter shape for listings (`GET /bank-deposits`/`GET /reports/bank-deposits`) — no cash-detail/transaction rows. — miembros: `id`, `transactionBankId`, `transactionBankName`, `bankAccountId`, `bankAccountName`, `bankAccountNumber`, `totalAmount`, `transactionCount`, `operationDate`, `clientName`, `description`, `clientId`, `transactionTypeId`, `transactionTypeName`, `userId`, `username`, `createdAt`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface BankDepositCashDetailInput` (L107): sin documentación — miembros: `denomination`, `quantity`
- `interface RegisterBankDepositInput` (L113): Payload for `POST /bank-deposits` — the backend recomputes/validates every total server-side regardless of what's sent. — miembros: `transactionBankId`, `bankAccountId`, `transactionTypeId`, `totalAmount`, `cashDetails`, `transactionAmounts`, `clientName`, `description`, `clientId`, `sendToAccountsReceivable`, `sendToAssets`, `changeGiven`, `cashBreakdownEnabled`
- `interface BankDepositMonthlyCount` (L138): `GET /bank-deposits/monthly-count` — backs the Resumen dashboard's "Bancos" tile. — miembros: `count`, `month`
- `interface BankDepositSummaryByBank` (L143): sin documentación — miembros: `transactionBankId`, `transactionBankName`, `transactions`
- `interface BankDepositPeriodSummary` (L149): sin documentación — miembros: `totalTransactions`, `byBank`
- `interface BankDepositTransactionSummary` (L155): `GET /bank-deposits/summary` — backs Transaccionar's "Resumen Diario"/"Resumen del Mes en Curso" cards and the Resumen dashboard's "Resumen Diario de Transacciones" section, all from the same call. — miembros: `daily`, `monthly`
- `interface BankDepositDailyStat` (L161): One entry per calendar day of the current month — a day with no non-voided operation is `transactionCount: 0`, never omitted. — miembros: `date`, `transactionCount`
- `interface BankDepositDailyStats` (L168): `GET /bank-deposits/daily-stats` — backs the "Transacciones del mes" chart shared by Resumen and Reporte de Transacciones. — miembros: `month`, `days`
- `interface BankDepositWeeklyStat` (L175): One 7-day bucket of the current month, día 1 en adelante (nunca semana ISO) — ver `BankDepositService.getWeeklyStats()`. — miembros: `weekNumber`, `label`, `startDate`, `endDate`, `transactionCount`
- `interface BankDepositWeeklyStats` (L187): `GET /bank-deposits/weekly-stats` — backs "Transacciones por semana" en Gráficas → Indicadores de Transacciones. — miembros: `month`, `weeks`
- `interface BankDepositMonthlyStat` (L194): Un mes del año actual — permanece en la lista aunque tenga 0 transacciones, nunca se oculta. — miembros: `month`, `label`, `transactionCount`
- `interface BankDepositYearlyStats` (L203): `GET /bank-deposits/yearly-stats` — backs "Transacciones por mes" en Gráficas → Indicadores de Transacciones. — miembros: `year`, `months`
- `interface BankDepositsReportFilters` (L208): sin documentación — miembros: `startDate`, `endDate`, `transactionBankId`, `transactionTypeId`, `userId`, `search`, `page`, `limit`
- `interface BankDepositsReportByBank` (L220): sin documentación — miembros: `transactionBankId`, `transactionBankName`, `operationCount`, `totalAmount`
- `interface BankDepositsReportSummary` (L227): sin documentación — miembros: `operationCount`, `transactionCount`, `totalAmount`, `byBank`

**Constantes exportadas:**

- `BANK_DEPOSIT_CASH_DENOMINATIONS` (L2): Fixed denominations offered by the cash-breakdown table — matches the ticket's own list, quetzales only. = `[200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01] as const`
<a id="f-comercial-jhoel-app-src-app-core-models-bank-movement-model-ts"></a>

### bank-movement.model.ts

- **Ruta:** [bank-movement.model.ts](../../../../comercial-jhoel-app/src/app/core/models/bank-movement.model.ts) (`comercial-jhoel-app/src/app/core/models/bank-movement.model.ts`, 199 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Espejo de `BANK_MOVEMENT_TYPES` del backend (`bank_account_movements.movement_type`).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface BankBalanceCreditInput` (L61): Datos que se envían al acreditar saldo — el backend calcula saldos y valida todo. — miembros: `bankId`, `amount`, `referenceText`, `observation`
- `interface BankMovement` (L69): Un renglón del historial de movimientos. — miembros: `id`, `sequence`, `bankId`, `bankName`, `accountNumber`, `accountTypeName`, `movementType`, `origin`, `amount`, `balanceBefore`, `balanceAfter`, `businessDate`, `createdAt`, `userId`, `username`, `referenceType`, `referenceId`, `referenceText`, `concept`, `observation`, `counterpartBankId`, `counterpartBankName`, `counterpartAccountNumber`, `status`, `reversalOfId`…
- `interface PaginatedBankMovements` (L100): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface BankMovementsFilters` (L107): sin documentación — miembros: `startDate`, `endDate`, `bankId`, `movementType`, `userId`, `page`, `limit`
- `interface BankTransferSide` (L117): sin documentación — miembros: `bankId`, `bankName`, `accountNumber`, `balanceBefore`, `balanceAfter`
- `interface BankTransfer` (L128): sin documentación — miembros: `id`, `kind`, `businessDate`, `createdAt`, `amount`, `userId`, `username`, `referenceText`, `concept`, `status`, `source`, `destination`
- `interface BankTransferInput` (L143): sin documentación — miembros: `sourceBankId`, `destinationBankId`, `cashWithdrawal`, `amount`, `referenceText`, `concept`
- `interface BankBalanceAdjustmentInput` (L153): sin documentación — miembros: `newBalance`, `reason`, `observation`
- `interface BankTransfersReportFilters` (L160): Filtros del Reporte de Transferencias Bancarias (`GET /reports/bank-transfers`). — miembros: `startDate`, `endDate`, `sourceBankId`, `destinationBankId`, `userId`, `status`, `kind`, `page`, `limit`
- `interface PaginatedBankTransfers` (L172): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface BankTransferRouteSummary` (L179): sin documentación — miembros: `sourceBankId`, `sourceBankName`, `sourceAccountNumber`, `destinationBankId`, `destinationBankName`, `destinationAccountNumber`, `transferCount`, `totalAmount`
- `interface BankTransfersSummary` (L192): `transferCount`/`totalAmount` excluyen las anuladas (se cuentan aparte en `voidedCount`/`voidedAmount`). — miembros: `transferCount`, `totalAmount`, `voidedCount`, `voidedAmount`, `byRoute`
- `type BankMovementType` (L2) = `\| 'DEPOSITO' \| 'RETIRO' \| 'DESEMBOLSO_GENESIS' \| 'PAGO_GENESIS' \| 'REINTEGRO' \| 'TRANSFERENCIA_SALIDA' \| 'TRANSFERENCIA_ENTRADA' \| 'RETIRO_EFECTIVO' \| 'AJUSTE_MANUAL' \| 'SALDO_INICIAL' \| 'ANULACION' /` — Espejo de `BANK_MOVEMENT_TYPES` del backend (`bank_account_movements.movement_type`).
- `type BankMovementOrigin` (L20) = `\| 'TRANSACCIONAR' \| 'TRANSFERENCIA' \| 'AJUSTE_MANUAL' \| 'SALDO_INICIAL' \| 'ANULACION' \| 'ACREDITACION_SALDO' \| 'CONTROL_EFECTIVO' \| 'CUENTAS_POR_COBRAR'`
- `type BankMovementStatus` (L30) = `'APLICADO' \| 'ANULADO'`
- `type BankTransferKind` (L126) = `'TRANSFER' \| 'CASH_WITHDRAWAL'` — `CASH_WITHDRAWAL` = retiro de efectivo en banco: solo sale del origen, `destination` es `null`.

**Constantes exportadas:**

- `BANK_MOVEMENT_TYPE_LABELS` (L32) = `{ DEPOSITO: 'Depósito', RETIRO: 'Retiro', DESEMBOLSO_GENESIS: 'Desembolso Génesis', PAGO_GENESIS: 'Pago Génesi`
- `BANK_MOVEMENT_ORIGIN_LABELS` (L49) = `{ TRANSACCIONAR: 'Transaccionar', TRANSFERENCIA: 'Transferencia', AJUSTE_MANUAL: 'Ajuste manual', SALDO_INICIA`
<a id="f-comercial-jhoel-app-src-app-core-models-bank-operation-model-ts"></a>

### bank-operation.model.ts

- **Ruta:** [bank-operation.model.ts](../../../../comercial-jhoel-app/src/app/core/models/bank-operation.model.ts) (`comercial-jhoel-app/src/app/core/models/bank-operation.model.ts`, 6 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `BankOperation` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface BankOperation` (L1): sin documentación — miembros: `id`, `icon`, `label`
<a id="f-comercial-jhoel-app-src-app-core-models-bank-model-ts"></a>

### bank.model.ts

- **Ruta:** [bank.model.ts](../../../../comercial-jhoel-app/src/app/core/models/bank.model.ts) (`comercial-jhoel-app/src/app/core/models/bank.model.ts`, 64 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** "Banco · Tipo · No. cuenta" — la etiqueta única de una cuenta en selectores (un mismo banco puede tener varias cuentas).
- **Depende de (archivos del proyecto):** [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts)
- **Consumidores:** [bank-balance.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-bank-balance-model-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Bank` (L1): sin documentación — miembros: `id`, `name`, `accountNumber`, `accountTypeId`, `accountTypeName`, `previousBalance`, `finalBalance`, `specialAccount`, `maxBalance`, `availableInTransaccionar`, `isActive`, `createdAt`, `updatedAt`
- `interface BankInput` (L22): Payload for create/update — the backend assigns id/isActive/timestamps. — miembros: `name`, `accountNumber`, `accountTypeId`, `previousBalance`, `finalBalance`, `specialAccount`, `maxBalance`, `availableInTransaccionar`
- `type BankSpecialAccount` (L35) = `'GENESIS' \| 'BI_CLUB' \| 'DISTRICOL' \| 'BANCO_INDUSTRIAL' \| 'BANCO_AGROMERCANTIL' \| 'GUAYACAN'` — Reglas especiales de saldo — espejo de `BANK_SPECIAL_ACCOUNTS` del backend (`banks.special_account`).

**Constantes exportadas:**

- `BANK_SPECIAL_ACCOUNT_OPTIONS` (L37) = `[ { value: 'GENESIS', label: 'Fundación Génesis — línea de crédito', hint: 'Desembolsos/Pagos Génesis la usan `
#### Función `bankAccountLabel` (L59–61)

- **Tipo:** función exportada
- **Firma:** `bankAccountLabel(bank: { name: string; accountTypeName: string; accountNumber: string }): string` — [bank.model.ts](../../../../comercial-jhoel-app/src/app/core/models/bank.model.ts#L59)
- **Propósito / descripción:** "Banco · Tipo · No. cuenta" — la etiqueta única de una cuenta en selectores (un mismo banco puede tener varias cuentas).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-business-model-ts"></a>

### business.model.ts

- **Ruta:** [business.model.ts](../../../../comercial-jhoel-app/src/app/core/models/business.model.ts) (`comercial-jhoel-app/src/app/core/models/business.model.ts`, 15 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `Business`, `BusinessInput` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Business` (L1): sin documentación — miembros: `id`, `name`, `description`, `isActive`, `createdAt`, `updatedAt`
- `interface BusinessInput` (L11): Payload for create/update — the backend assigns id/isActive/timestamps. — miembros: `name`, `description`
<a id="f-comercial-jhoel-app-src-app-core-models-cash-box-model-ts"></a>

### cash-box.model.ts

- **Ruta:** [cash-box.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cash-box.model.ts) (`comercial-jhoel-app/src/app/core/models/cash-box.model.ts`, 97 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** "Caja Contable" — an accumulated cash balance for Recargas Electrónicas y SIMs.
- **Descripción del autor (comentario del archivo):** "Caja Contable" — an accumulated cash balance for Recargas Electrónicas y SIMs. Ingresos/salidas from ventas/compras are never entered manually — they're always derived live on the backend from the real sale/purchase rows that already exist; the only two things an admin ever registers directly here are a manual "Aporte a Caja" (income) or "Salida de Ganancia" (expense) movement.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface CashBoxBalance` (L9): "Caja Contable" — an accumulated cash balance for Recargas Electrónicas y SIMs. — miembros: `date`, `previousBalance`, `incomeToday`, `expenseToday`, `currentBalance`, `detail`
- `interface CashBoxMovement` (L42): sin documentación — miembros: `date`, `type`, `concept`, `income`, `expense`, `balance`, `username`, `movementId`
- `interface PaginatedCashBoxMovements` (L56): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface CashBoxMovementsFilters` (L63): sin documentación — miembros: `startDate`, `endDate`, `type`, `page`, `limit`
- `interface CashBoxMovementRecord` (L72): A single registered manual movement (aporte or salida) — `movementType` tells them apart. — miembros: `id`, `amount`, `movementType`, `businessDate`, `concept`, `createdByUsername`, `createdAt`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface RegisterCashBoxWithdrawalInput` (L86): sin documentación — miembros: `amount`, `concept`, `businessDate`
- `interface RegisterCashBoxContributionInput` (L92): sin documentación — miembros: `amount`, `concept`, `businessDate`
- `type CashBoxMovementType` (L25) = `\| 'RECHARGE_SALE' \| 'SIM_SALE' \| 'RECHARGE_PURCHASE' \| 'SIM_PURCHASE' \| 'CONTRIBUTION' \| 'PROFIT_WITHDRAWAL'`

**Constantes exportadas:**

- `CASH_BOX_MOVEMENT_TYPE_LABEL` (L33) = `{ RECHARGE_SALE: 'Ventas de Recargas', SIM_SALE: 'Ventas de SIM', RECHARGE_PURCHASE: 'Compra de Recargas', SIM`
<a id="f-comercial-jhoel-app-src-app-core-models-cash-control-model-ts"></a>

### cash-control.model.ts

- **Ruta:** [cash-control.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cash-control.model.ts) (`comercial-jhoel-app/src/app/core/models/cash-control.model.ts`, 395 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Control de Efectivo — mirrors `modules/cash-control` of the API.
- **Descripción del autor (comentario del archivo):** Control de Efectivo — mirrors `modules/cash-control` of the API. Every balance on these types comes from the backend's official Kardex (`cash_movements`); the frontend never computes or stores a cash balance.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface CashMovement` (L64): One Kardex row: `previousBalance`/`newBalance` are the official cash before/after it. — miembros: `id`, `sequence`, `operationalDate`, `operationalDayId`, `cutPeriodId`, `cutPeriodNumber`, `movementType`, `originalMovementType`, `direction`, `amount`, `previousBalance`, `newBalance`, `referenceType`, `referenceId`, `description`, `bankName`, `reason`, `reversalOfId`, `status`, `voidedAt`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`…
- `interface RegisterCashBankDepositInput` (L95): `POST /cash-control/bank-deposits` — el backend valida desglose, efectivo suficiente y reglas de la cuenta. — miembros: `bankId`, `amount`, `details`, `description`, `clientRequestId`
- `interface CashBalanceSnapshot` (L103): sin documentación — miembros: `balance`, `lastSequence`, `lastMovementAt`
- `interface CashMovementBucket` (L109): sin documentación — miembros: `movementType`, `totalIn`, `totalOut`, `count`
- `interface CashDateSummary` (L116): sin documentación — miembros: `openingBalance`, `totalIn`, `totalOut`, `movementCount`, `buckets`
- `interface CashBankDayHeader` (L129): Daily indicators of one BANK operational day (Agentes Bancarios → "Aperturar día"): they restart at each opening and cover the Kardex movements up to the next opening. — miembros: `businessDate`, `dayOpeningId`, `agentDayStatus`, `startSequence`, `endSequence`, `isCurrent`, `openedAt`, `openedByUsername`, `source`, `closingBalance`, `lastMovementAt`
- `interface CashOperationalDay` (L154): sin documentación — miembros: `id`, `operationalDate`, `status`, `openingPolicy`, `previousDayId`, `previousCutId`, `previousClosingPhysicalCash`, `previousClosingSystemCash`, `inheritedDifference`, `openingSequence`, `openingSystemCash`, `openingPhysicalCash`, `openingReason`, `openedBy`, `openedByUsername`, `openedAt`, `closingSystemCash`, `closingPhysicalCash`, `closingDifference`, `totalIn`, `totalOut`, `movementCount`, `closingObservations`, `closedByUsername`, `closedAt`
- `interface CashBankBalance` (L182): sin documentación — miembros: `bankId`, `bankName`, `accountNumber`, `specialAccount`, `balance`
- `interface CashCutPeriod` (L203): sin documentación — miembros: `id`, `operationalDayId`, `operationalDate`, `periodNumber`, `status`, `scheduledStartAt`, `scheduledEndAt`, `actualStartedAt`, `actualFinishedAt`, `startSequence`, `closingSequence`, `openingSystemCash`, `openingPhysicalCash`, `inheritedDifference`, `closingSystemCash`, `closingPhysicalCash`, `cashDifference`, `totalIn`, `totalOut`, `movementCount`, `openingBankBalances`, `openedByUsername`, `closedByUsername`, `observations`, `reopenedCount`…
- `interface CashPosition` (L240): sin documentación — miembros: `date`, `balance`, `lastSequence`, `lastMovementAt`, `hasInitialBalance`, `dayState`, `day`, `periods`, `openPeriod`, `summary`, `warehouseBalance`, `custodyTotal`, `bankDay`, `canCloseDay`
- `interface CashMovementFilters` (L261): sin documentación — miembros: `dateFrom`, `dateTo`, `movementType`, `direction`, `userId`, `cutPeriodId`, `bankDate`, `page`, `limit`
- `interface PaginatedCashMovements` (L274): sin documentación — miembros: `items`, `total`, `page`, `limit`, `totalIn`, `totalOut`
- `interface RegisterCashMovementInput` (L283): sin documentación — miembros: `movementType`, `amount`, `description`, `reason`, `clientRequestId`
- `interface CashMovementResult` (L291): sin documentación — miembros: `movement`, `balance`
- `interface OpenCashDayInput` (L296): sin documentación — miembros: `manualPhysicalCash`, `reason`, `firstStart`, `firstEnd`, `secondStart`, `secondEnd`
- `interface CashDenominationCount` (L305): sin documentación — miembros: `denomination`, `quantity`
- `interface CashBankVerificationInput` (L310): sin documentación — miembros: `bankId`, `verifiedBalance`, `observations`
- `interface FinishCashCutInput` (L316): sin documentación — miembros: `details`, `banks`, `cashObservations`, `observations`
- `interface CashCutCount` (L323): sin documentación — miembros: `id`, `totalCounted`, `systemCash`, `difference`, `observations`, `isCurrent`, `createdByUsername`, `createdAt`, `details`
- `interface CashBankReconciliation` (L335): sin documentación — miembros: `id`, `countId`, `bankId`, `bankName`, `systemBalance`, `verifiedBalance`, `difference`, `observations`, `createdAt`
- `interface CashCutDetail` (L347): sin documentación — miembros: `period`, `day`, `counts`, `bankReconciliations`, `events`, `scheduleChanges`, `movements`
- `interface CashDayHistoryRow` (L366): sin documentación — miembros: `day`, `periods`
- `interface CashDayFilters` (L371): sin documentación — miembros: `dateFrom`, `dateTo`, `periodNumber`, `status`, `userId`, `page`, `limit`
- `interface PaginatedCashDays` (L381): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `type CashDirection` (L7) = `'IN' \| 'OUT' \| 'NONE'` — Control de Efectivo — mirrors `modules/cash-control` of the API.
- `type CashMovementType` (L9) = `\| 'DEPOSITO' \| 'RETIRO' \| 'DESEMBOLSO_GENESIS' \| 'PAGO_GENESIS' \| 'REINTEGRO' \| 'OTRA_TRANSACCION' \| 'GASTO_POR_COBRAR' \| 'ABONO_POR_COBRAR' \| 'ACTIVO' \| 'DEVOLUCION_ACTIVO' \| 'RETIRO_BANCARIO' \| 'ENT`
- `type ManualCashMovementType` (L33) = `'ENTRADA_MANUAL' \| 'SALIDA_MANUAL' \| 'AJUSTE' \| 'SALDO_INICIAL'`
- `type CashBankDaySummary` (L143) = `CashBankDayHeader & CashDateSummary`
- `type CashOpeningPolicy` (L145) = `'INHERITED_FROM_CLOSE' \| 'INHERITED_FROM_LAST_CUT' \| 'AUTHORIZED_MANUAL' \| 'SYSTEM_UNVERIFIED'`
- `type CashCutStatus` (L190) = `'PROGRAMADO' \| 'ABIERTO' \| 'FINALIZADO'`
- `type CashDayState` (L238) = `'SIN_APERTURA' \| 'ABIERTO' \| 'CERRADO'`

**Constantes exportadas:**

- `CASH_MOVEMENT_TYPE_LABEL` (L35) = `{ DEPOSITO: 'Depósito', RETIRO: 'Retiro de efectivo', DESEMBOLSO_GENESIS: 'Desembolso / renovación Génesis', P`
- `CASH_DIRECTION_LABEL` (L57) = `{ IN: 'Entrada', OUT: 'Salida', NONE: 'Sin efecto', }`
- `CASH_OPENING_POLICY_LABEL` (L147) = `{ INHERITED_FROM_CLOSE: 'Heredado del cierre anterior', INHERITED_FROM_LAST_CUT: 'Heredado del último corte (e`
- `CASH_CUT_STATUS_LABEL` (L192) = `{ PROGRAMADO: 'Programado', ABIERTO: 'Abierto', FINALIZADO: 'Finalizado', }`
- `CASH_CUT_NAME` (L198) = `{ 1: 'Primer corte · mediodía', 2: 'Segundo corte · final del día', }`
- `CASH_CUT_MANAGER_ROLES` (L389): Roles that may open the day and run the cuts (the backend re-checks). = `['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO']`
#### Función `cashSignedAmount` (L392–394)

- **Tipo:** función exportada
- **Firma:** `cashSignedAmount(movement: Pick<CashMovement, 'direction' \| 'amount'>): number` — [cash-control.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cash-control.model.ts#L392)
- **Propósito / descripción:** Signed effect of a movement for display: +amount, −amount or 0.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-cash-custody-model-ts"></a>

### cash-custody.model.ts

- **Ruta:** [cash-custody.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cash-custody.model.ts) (`comercial-jhoel-app/src/app/core/models/cash-custody.model.ts`, 182 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Control de Efectivo → "Arqueo de Caja" and "Bodega" (cash under custody).
- **Descripción del autor (comentario del archivo):** Control de Efectivo → "Arqueo de Caja" and "Bodega" (cash under custody). Caja and Bodega balances come from their own Kardex in the backend; the UI never computes them.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface CashCustody` (L9): sin documentación — miembros: `cashBalance`, `warehouseBalance`, `custodyTotal`, `warehouseHasInitialBalance`, `warehouseLastMovementAt`, `currentDay`, `deliveredToday`, `returnedToCashToday`, `depositedToBankToday`
- `interface WarehouseWithdrawal` (L26): "Retiro de Bodega": back to the caja or deposited into a bank account. — miembros: `id`, `referenceNumber`, `destination`, `amount`, `bankId`, `bankName`, `bankAccountNumber`, `deliveredBy`, `receivedBy`, `voucherReference`, `observations`, `hasBreakdown`, `businessDate`, `warehouseMovementId`, `warehouseMovementSequence`, `cashMovementId`, `cashMovementSequence`, `bankMovementId`, `status`, `voidedAt`, `voidedByUsername`, `voidReason`, `createdByUsername`, `createdAt`, `details`
- `interface RegisterWarehouseWithdrawalInput` (L54): sin documentación — miembros: `destination`, `amount`, `details`, `bankId`, `deliveredBy`, `receivedBy`, `voucherReference`, `observations`, `clientRequestId`
- `interface CashDenominationRow` (L66): sin documentación — miembros: `denomination`, `quantity`, `subtotal`
- `interface WarehouseTransfer` (L72): sin documentación — miembros: `id`, `referenceNumber`, `amount`, `deliveredBy`, `receivedBy`, `voucherReference`, `observations`, `hasBreakdown`, `businessDate`, `cashMovementId`, `cashMovementSequence`, `warehouseMovementId`, `warehouseMovementSequence`, `status`, `voidedAt`, `voidedByUsername`, `voidReason`, `createdByUsername`, `createdAt`, `details`
- `interface WarehouseMovement` (L95): sin documentación — miembros: `id`, `sequence`, `businessDate`, `movementType`, `direction`, `amount`, `previousBalance`, `newBalance`, `referenceType`, `referenceId`, `transferReference`, `description`, `counterpart`, `reason`, `status`, `createdByUsername`, `createdAt`
- `interface CashCountRecord` (L115): sin documentación — miembros: `id`, `number`, `businessDate`, `countedAt`, `systemCash`, `totalCounted`, `difference`, `result`, `warehouseBalance`, `warehouseCounted`, `warehouseDifference`, `custodyTheoretical`, `custodyCounted`, `custodyDifference`, `observations`, `status`, `replacesId`, `replacedById`, `correctionReason`, `createdByUsername`, `createdAt`, `details`
- `interface PaginatedResult` (L140): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface CashCountFilters` (L147): sin documentación — miembros: `dateFrom`, `dateTo`, `businessDate`, `userId`, `result`, `page`, `limit`
- `interface RegisterCashCountInput` (L157): sin documentación — miembros: `details`, `observations`, `warehouseCounted`, `clientRequestId`
- `interface RegisterWarehouseTransferInput` (L164): sin documentación — miembros: `amount`, `details`, `deliveredBy`, `receivedBy`, `voucherReference`, `observations`, `clientRequestId`
- `type CashCountResult` (L7) = `'CUADRADO' \| 'FALTANTE' \| 'SOBRANTE'` — Control de Efectivo → "Arqueo de Caja" and "Bodega" (cash under custody).
- `type WarehouseWithdrawalDestination` (L23) = `'CAJA' \| 'BANCO'`

**Constantes exportadas:**

- `CASH_COUNT_RESULT_LABEL` (L174) = `{ CUADRADO: 'Cuadrado', FALTANTE: 'Faltante', SOBRANTE: 'Sobrante', }`
- `CASH_CUSTODY_OPERATOR_ROLES` (L181): Roles that may view/register counts and deliveries (UX only — the backend re-checks). = `['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO']`
<a id="f-comercial-jhoel-app-src-app-core-models-catalog-bank-model-ts"></a>

### catalog-bank.model.ts

- **Ruta:** [catalog-bank.model.ts](../../../../comercial-jhoel-app/src/app/core/models/catalog-bank.model.ts) (`comercial-jhoel-app/src/app/core/models/catalog-bank.model.ts`, 38 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Ficha completa de administración — catálogo público informativo, independiente del módulo financiero de Bancos (Agentes Bancarios/Cuadre).
- **Descripción del autor (comentario del archivo):** Ficha completa de administración — catálogo público informativo, independiente del módulo financiero de Bancos (Agentes Bancarios/Cuadre).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface CatalogBank` (L2): Ficha completa de administración — catálogo público informativo, independiente del módulo financiero de Bancos (Agentes Bancarios/Cuadre). — miembros: `id`, `name`, `description`, `additionalInfo`, `isActive`, `sortOrder`, `hasImage`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface CreateCatalogBankInput` (L18): sin documentación — miembros: `name`, `description`, `additionalInfo`
- `interface UpdateCatalogBankInput` (L24): sin documentación — miembros: `name`, `description`, `additionalInfo`
- `interface PublicCatalogBank` (L31): Shape público — backs "Bancos" en la landing. — miembros: `id`, `name`, `description`, `additionalInfo`, `hasImage`
<a id="f-comercial-jhoel-app-src-app-core-models-catalog-category-model-ts"></a>

### catalog-category.model.ts

- **Ruta:** [catalog-category.model.ts](../../../../comercial-jhoel-app/src/app/core/models/catalog-category.model.ts) (`comercial-jhoel-app/src/app/core/models/catalog-category.model.ts`, 8 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `CatalogCategory` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface CatalogCategory` (L1): sin documentación — miembros: `id`, `icon`, `name`, `description`, `itemCount`
<a id="f-comercial-jhoel-app-src-app-core-models-catalog-phone-model-ts"></a>

### catalog-phone.model.ts

- **Ruta:** [catalog-phone.model.ts](../../../../comercial-jhoel-app/src/app/core/models/catalog-phone.model.ts) (`comercial-jhoel-app/src/app/core/models/catalog-phone.model.ts`, 80 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Una fila "otra especificación" configurable desde el panel.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface CatalogPhoneExtraSpec` (L2): Una fila "otra especificación" configurable desde el panel. — miembros: `label`, `value`
- `interface CatalogPhoneImage` (L7): sin documentación — miembros: `id`, `isPrimary`, `sortOrder`
- `interface CatalogPhone` (L14): Ficha completa de administración — incluye flags internos (`isActive`/`isPublished`/`sortOrder`) que el catálogo público nunca expone. — miembros: `id`, `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`, `isActive`, `isPublished`, `sortOrder`, `likesCount`, `creditAvailable`, `images`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface CatalogPhoneInput` (L44): Campos editables — sin id/timestamps/imágenes/flags de publicación (cada uno tiene su propia acción dedicada). — miembros: `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`
- `interface PublicCatalogPhone` (L60): Shape público — backs el carousel de la landing. — miembros: `id`, `brand`, `model`, `description`, `price`, `screen`, `ram`, `storage`, `camera`, `battery`, `processor`, `operatingSystem`, `extraSpecs`, `creditAvailable`, `likesCount`, `liked`, `images`
<a id="f-comercial-jhoel-app-src-app-core-models-catalog-product-model-ts"></a>

### catalog-product.model.ts

- **Ruta:** [catalog-product.model.ts](../../../../comercial-jhoel-app/src/app/core/models/catalog-product.model.ts) (`comercial-jhoel-app/src/app/core/models/catalog-product.model.ts`, 110 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Ficha completa de administración — nombre/precio/categoría/negocio se leen en vivo de Inventario, nunca se editan aquí.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface CatalogProduct` (L4): Ficha completa de administración — nombre/precio/categoría/negocio se leen en vivo de Inventario, nunca se editan aquí. — miembros: `id`, `productId`, `section`, `catalogDescription`, `hasImage`, `isActive`, `sortOrder`, `likesCount`, `productName`, `productPrice`, `productIsActive`, `categoryName`, `businessName`, `unitOfMeasureAbbreviation`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface CreateCatalogProductInput` (L27): sin documentación — miembros: `productId`, `section`, `catalogDescription`
- `interface UpdateCatalogProductInput` (L33): sin documentación — miembros: `catalogDescription`
- `interface PublicCatalogProduct` (L38): Shape público — backs Librería/Variedades en la landing. — miembros: `id`, `section`, `name`, `price`, `categoryName`, `description`, `hasImage`, `likesCount`, `liked`, `unitOfMeasureAbbreviation`
- `interface CatalogProductRequest` (L60): "Lo quiero" de Variedades y Accesorios — snapshot congelado, deliberadamente sin nada de Krediya/crédito. — miembros: `id`, `catalogProductId`, `productName`, `price`, `customerName`, `customerPhone`, `status`, `observation`, `createdAt`, `updatedAt`, `updatedBy`, `updatedByUsername`
- `interface CreateCatalogProductRequestPayload` (L75): sin documentación — miembros: `catalogProductId`, `customerName`, `customerPhone`
- `interface UpdateCatalogProductRequestStatusInput` (L81): sin documentación — miembros: `status`, `observation`
- `interface ListCatalogProductRequestsFilters` (L86): sin documentación — miembros: `status`, `startDate`, `endDate`
- `type CatalogProductSection` (L1) = `'LIBRERIA' \| 'VARIEDADES_ACCESORIOS'`
- `type CatalogProductRequestStatus` (L52) = `\| 'NUEVA' \| 'CONTACTADA' \| 'EN_PROCESO' \| 'ATENDIDA' \| 'CANCELADA'`

**Constantes exportadas:**

- `CATALOG_PRODUCT_REQUEST_STATUS_LABEL` (L92) = `{ NUEVA: 'Nueva', CONTACTADA: 'Contactada', EN_PROCESO: 'En proceso', ATENDIDA: 'Atendida', CANCELADA: 'Cancel`
- `CATALOG_PRODUCT_REQUEST_STATUS_TONE` (L100) = `{ NUEVA: 'gold', CONTACTADA: 'brand', EN_PROCESO: 'brand', ATENDIDA: 'success', CANCELADA: 'danger', }`
<a id="f-comercial-jhoel-app-src-app-core-models-catalog-request-model-ts"></a>

### catalog-request.model.ts

- **Ruta:** [catalog-request.model.ts](../../../../comercial-jhoel-app/src/app/core/models/catalog-request.model.ts) (`comercial-jhoel-app/src/app/core/models/catalog-request.model.ts`, 64 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Solicitud de interés (compra o crédito Krediya) — snapshot congelado al momento de crearse, nunca releído del teléfono.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface CatalogRequest` (L6): Solicitud de interés (compra o crédito Krediya) — snapshot congelado al momento de crearse, nunca releído del teléfono. — miembros: `id`, `catalogPhoneId`, `brand`, `model`, `price`, `creditAvailable`, `requestType`, `customerName`, `customerPhone`, `status`, `observation`, `createdAt`, `updatedAt`, `updatedBy`, `updatedByUsername`
- `interface UpdateCatalogRequestStatusInput` (L24): sin documentación — miembros: `status`, `observation`
- `interface ListCatalogRequestsFilters` (L29): sin documentación — miembros: `status`, `requestType`, `startDate`, `endDate`
- `interface CreateCatalogRequestPayload` (L37): Payload público — solo lo mínimo para registrar interés, nunca precio/creditAvailable (el backend los recalcula siempre). — miembros: `catalogPhoneId`, `requestType`, `customerName`, `customerPhone`
- `type CatalogRequestType` (L1) = `'INTERES_COMPRA' \| 'INTERES_CREDITO'`
- `type CatalogRequestStatus` (L3) = `'NUEVA' \| 'CONTACTADA' \| 'EN_PROCESO' \| 'ATENDIDA' \| 'CANCELADA'`

**Constantes exportadas:**

- `CATALOG_REQUEST_STATUS_LABEL` (L44) = `{ NUEVA: 'Nueva', CONTACTADA: 'Contactada', EN_PROCESO: 'En proceso', ATENDIDA: 'Atendida', CANCELADA: 'Cancel`
- `CATALOG_REQUEST_STATUS_TONE` (L52) = `{ NUEVA: 'gold', CONTACTADA: 'brand', EN_PROCESO: 'brand', ATENDIDA: 'success', CANCELADA: 'danger', }`
- `CATALOG_REQUEST_TYPE_LABEL` (L60) = `{ INTERES_COMPRA: 'Compra', INTERES_CREDITO: 'Crédito Krediya', }`
<a id="f-comercial-jhoel-app-src-app-core-models-category-model-ts"></a>

### category.model.ts

- **Ruta:** [category.model.ts](../../../../comercial-jhoel-app/src/app/core/models/category.model.ts) (`comercial-jhoel-app/src/app/core/models/category.model.ts`, 15 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `Category`, `CategoryInput` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Category` (L1): sin documentación — miembros: `id`, `name`, `description`, `isActive`, `createdAt`, `updatedAt`
- `interface CategoryInput` (L11): Payload for create/update — the backend assigns id/isActive/timestamps. — miembros: `name`, `description`
<a id="f-comercial-jhoel-app-src-app-core-models-client-model-ts"></a>

### client.model.ts

- **Ruta:** [client.model.ts](../../../../comercial-jhoel-app/src/app/core/models/client.model.ts) (`comercial-jhoel-app/src/app/core/models/client.model.ts`, 13 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `Client`, `ClientInput` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Client` (L1): sin documentación — miembros: `id`, `name`, `isActive`, `createdAt`, `updatedAt`
- `interface ClientInput` (L10): Payload for create/update — the backend assigns id/isActive/timestamps. — miembros: `name`
<a id="f-comercial-jhoel-app-src-app-core-models-closed-day-model-ts"></a>

### closed-day.model.ts

- **Ruta:** [closed-day.model.ts](../../../../comercial-jhoel-app/src/app/core/models/closed-day.model.ts) (`comercial-jhoel-app/src/app/core/models/closed-day.model.ts`, 106 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `ClosedDaysFilters`, `ClosedDayRow`, `DayAuditLogEntry`, `ClosedDayBankRow`, `ClosedDayReconciliation` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [cuadre-agentes.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-cuadre-agentes-model-ts)
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface ClosedDaysFilters` (L7): sin documentación — miembros: `dateFrom`, `dateTo`, `status`, `userId`, `resultSign`
- `interface ClosedDayRow` (L16): A row of "Sistema → Gestión de Días Cerrados". — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `totalBanks`, `totalCash`, `totalAccountsReceivable`, `totalAssets`, `result`
- `interface DayAuditLogEntry` (L38): sin documentación — miembros: `id`, `action`, `performedByUsername`, `performedAt`, `reason`, `previousStatus`, `newStatus`
- `interface ClosedDayBankRow` (L48): sin documentación — miembros: `bankId`, `bankName`, `accountNumber`, `accountTypeName`, `previousBalance`, `finalBalance`
- `interface ClosedDayReconciliation` (L57): sin documentación — miembros: `id`, `date`, `totalCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `createdAt`, `createdByUsername`
- `interface ClosedDayDetail` (L75): "Ver Detalle" — never includes a cash-denomination breakdown: this app never had a per-denomination count table, `reconciliation.totalCash` is the only cash figure the backend knows for an already-closed day (see the backend's own `DayDetailOutput`). — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `isCancelled`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `banks`, `reconciliation`, `auditLog`
- `type ClosedDayStatus` (L4) = `Extract<DayWorkStatus, 'CLOSED' \| 'REOPENED' \| 'CANCELLED'>` — Only the three terminal/managed states — a day still in progress (NOT_OPENED/OPENED/BANK_BALANCES_SAVED) isn't this module's concern.
- `type ResultSign` (L5) = `'positive' \| 'negative' \| 'zero'`
- `type DayAuditAction` (L36) = `'OPENED' \| 'CLOSED' \| 'REOPENED' \| 'CANCELLED'`

**Constantes exportadas:**

- `CLOSED_DAY_STATUS_LABEL` (L94) = `{ CLOSED: 'Cerrado', REOPENED: 'Reabierto', CANCELLED: 'Anulado', }`
- `DAY_AUDIT_ACTION_LABEL` (L100) = `{ OPENED: 'Apertura del día', CLOSED: 'Cierre del día', REOPENED: 'Reapertura', CANCELLED: 'Anulación', }`
<a id="f-comercial-jhoel-app-src-app-core-models-company-settings-model-ts"></a>

### company-settings.model.ts

- **Ruta:** [company-settings.model.ts](../../../../comercial-jhoel-app/src/app/core/models/company-settings.model.ts) (`comercial-jhoel-app/src/app/core/models/company-settings.model.ts`, 62 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** The one, always-existing "datos de la librería" row — never created or deleted, only updated.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface CompanySettings` (L2): The one, always-existing "datos de la librería" row — never created or deleted, only updated. — miembros: `id`, `businessName`, `address`, `phone`, `email`, `taxId`, `logoBase64`, `socialMedia`, `whatsapp`, `website`, `businessHours`, `facebookUrl`, `instagramUrl`, `tiktokUrl`, `krediyaMinAmount`, `updatedAt`, `updatedBy`, `updatedByUsername`
- `interface UpdateCompanySettingsPayload` (L27): All fields optional — `PATCH /company-settings` merges only what's provided. — miembros: `businessName`, `address`, `phone`, `email`, `taxId`, `logoBase64`, `socialMedia`, `whatsapp`, `website`, `businessHours`, `facebookUrl`, `instagramUrl`, `tiktokUrl`, `krediyaMinAmount`
- `interface PublicCompanyInfo` (L50): `GET /company-info` — el subconjunto deliberadamente angosto de `CompanySettings` que es seguro exponer sin autenticación en la landing pública. — miembros: `businessName`, `address`, `phone`, `whatsapp`, `email`, `website`, `businessHours`, `facebookUrl`, `instagramUrl`, `tiktokUrl`
<a id="f-comercial-jhoel-app-src-app-core-models-contact-channel-model-ts"></a>

### contact-channel.model.ts

- **Ruta:** [contact-channel.model.ts](../../../../comercial-jhoel-app/src/app/core/models/contact-channel.model.ts) (`comercial-jhoel-app/src/app/core/models/contact-channel.model.ts`, 23 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `ContactChannel`, `SocialLink`, `ContactFormPayload` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface ContactChannel` (L1): sin documentación — miembros: `id`, `icon`, `label`, `value`, `href`
- `interface SocialLink` (L10): sin documentación — miembros: `id`, `icon`, `label`, `href`
- `interface ContactFormPayload` (L17): sin documentación — miembros: `name`, `phone`, `message`, `interest`
<a id="f-comercial-jhoel-app-src-app-core-models-cuadre-agentes-model-spec-ts"></a>

### cuadre-agentes.model.spec.ts

- **Ruta:** [cuadre-agentes.model.spec.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.spec.ts) (`comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.spec.ts`, 63 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [cuadre-agentes.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-cuadre-agentes-model-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-core-models-cuadre-agentes-model-ts"></a>

### cuadre-agentes.model.ts

- **Ruta:** [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts) (`comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts`, 249 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Whether `finalBalance` adds to or subtracts from `totalBanks` — decided by the backend from the account type, never re-derived here from `accountTypeName`.
- **Descripción del autor (comentario del archivo):** Whether `finalBalance` adds to or subtracts from `totalBanks` — decided by the backend from the account type, never re-derived here from `accountTypeName`.
- **Consumidores:** [closed-day.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-closed-day-model-ts), [cuadre-agentes.model.spec.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-cuadre-agentes-model-spec-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface BankBalanceSummaryItem` (L4): sin documentación — miembros: `id`, `name`, `accountTypeId`, `accountTypeName`, `finalBalance`, `specialAccount`, `calculationType`
- `interface CuadreAgentesSummary` (L26): Cuadre Agentes' first stage — `finalBalance` is the static `banks.final_balance` column (the same one Sistema → Bancos manages), not Agentes Bancarios → Bancos' live daily cuadre. — miembros: `banks`, `totalBanks`, `totalPositiveAccounts`, `totalCreditLines`, `totalAssets`, `totalAccountsReceivable`, `totalWarehouseCash`
- `interface LoadedCashCountInfo` (L96): The single count record a breakdown was loaded from (reference only — never modified). — miembros: `source`, `id`, `number`, `cutNumber`, `countedAt`, `businessDate`, `createdByUsername`, `totalCounted`, `isFromReferenceDay`
- `interface CashBreakdownOrigin` (L113): `null` source = manual count; otherwise the loaded arqueo and whether it was edited afterwards. — miembros: `loadedCount`, `modifiedAfterLoad`
- `interface LatestCashCountResponse` (L119): `GET /cash-control/counts/latest` — ONE count record (the latest cut's arqueo or standalone arqueo), all 12 denominations. — miembros: `count`, `breakdown`, `referenceBusinessDate`, `isFromReferenceDay`
- `interface AgentReconciliation` (L142): Second stage — the historical record `POST /agent-reconciliations` returns. — miembros: `id`, `date`, `totalCash`, `totalWarehouseCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `createdAt`, `createdByUsername`
- `interface RegisterAgentReconciliationInput` (L157): `totalCash` is the only thing this frontend actually decides on save — everything else is recomputed by the backend. — miembros: `totalCash`, `date`, `cashDetails`, `cashBreakdownSource`, `sourceCashCountId`
- `interface MissingBankInfo` (L192): sin documentación — miembros: `id`, `name`
- `interface BankBalancesValidation` (L205): Answers "were this date's bank balances saved [in Agentes Bancarios → Bancos]?" — never "does the bank have a current balance?". — miembros: `date`, `canReconcile`, `totalActiveBanks`, `banksWithBalance`, `missingBanks`
- `interface DayStatus` (L239): sin documentación — miembros: `date`, `status`, `isOpened`, `bankBalancesSaved`, `canAccessReconciliation`, `reconciliationCompleted`, `isClosed`, `isCancelled`
- `type BankBalanceCalculationType` (L2) = `'sum' \| 'subtract'` — Whether `finalBalance` adds to or subtracts from `totalBanks` — decided by the backend from the account type, never re-derived here from `accountTypeName`.
- `type CashDenomination` (L39) = `(typeof CASH_DENOMINATIONS)[number]`
- `type CashCount` (L47) = `Record<CashDenomination, number>` — Count of bills/coins per denomination — always a whole number ≥ 0 (loose coins are counted in their own Q0.50 … Q0.01 rows, so Q1 no longer needs decimals).
- `type CuadreCashBreakdownSource` (L90) = `'MANUAL' \| 'ARQUEO_CAJA' \| 'CORTE_CAJA'` — Where the cash breakdown being edited comes from — sent with the cuadre and stored with it.
- `type LoadedCashCountSource` (L93) = `Exclude<CuadreCashBreakdownSource, 'MANUAL'>` — The kinds of individual count a breakdown can be loaded from: one cut's arqueo or a standalone Arqueo de Caja.
- `type CuadreResultStatus` (L168) = `'negative' \| 'zero' \| 'positive'` — Cuadre result = Cash + Banks + AccountsReceivable − Assets.
- `type DayWorkStatus` (L230) = `\| 'NOT_OPENED' \| 'OPENED' \| 'BANK_BALANCES_SAVED' \| 'RECONCILIATION_COMPLETED' \| 'CLOSED' \| 'REOPENED' \| 'CANCELLED'` — The questions of the mandatory "Apertura → Saldos → Cuadre → Cierre" sequence: 1.

**Constantes exportadas:**

- `CASH_DENOMINATIONS` (L38): Fixed bill/coin denominations for the cash count (Q200 … Q0.01) — in display order, same list as the backend. = `[200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01] as const`
#### Función `decimalPlacesFor` (L50–52)

- **Tipo:** función exportada
- **Firma:** `decimalPlacesFor(_denomination: CashDenomination): number` — [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts#L50)
- **Propósito / descripción:** Every denomination takes whole quantities (kept for the `appDecimalInput` binding).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `createEmptyCashCount` (L54–56)

- **Tipo:** función exportada
- **Firma:** `createEmptyCashCount(): CashCount` — [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts#L54)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Object.fromEntries`, `CASH_DENOMINATIONS.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toCents` (L59–61)

- **Tipo:** función local del archivo
- **Firma:** `toCents(value: number): number` — [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts#L59)
- **Propósito / descripción:** Denomination in whole centavos — cash math is done in integers to avoid float drift.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `denominationSubtotal` (L64–66)

- **Tipo:** función exportada
- **Firma:** `denominationSubtotal(denomination: number, quantity: number): number` — [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts#L64)
- **Propósito / descripción:** `denomination × quantity` of one row, exact to the centavo.
- **Dependencias:** `toCents`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculateTotalCash` (L69–72)

- **Tipo:** función exportada
- **Firma:** `calculateTotalCash(counts: CashCount): number` — [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts#L69)
- **Propósito / descripción:** `denomination × count`, summed across every denomination — the "Total Efectivo" (integer centavo math).
- **Dependencias:** `CASH_DENOMINATIONS.reduce`, `toCents`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `hasAnyQuantity` (L75–77)

- **Tipo:** función exportada
- **Firma:** `hasAnyQuantity(counts: CashCount): boolean` — [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts#L75)
- **Propósito / descripción:** Whether any denomination has a quantity entered.
- **Dependencias:** `CASH_DENOMINATIONS.some`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `cashCountFromRows` (L80–87)

- **Tipo:** función exportada
- **Firma:** `cashCountFromRows(rows: Array<{ denomination: number; quantity: number }>): CashCount` — [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts#L80)
- **Propósito / descripción:** Builds a full count from stored rows; a denomination missing in the rows (e.g. Q0.01 in old arqueos) becomes 0.
- **Dependencias:** `createEmptyCashCount`, `rows.find`, `toCents`, `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `getCuadreResultStatus` (L170–178)

- **Tipo:** función exportada
- **Firma:** `getCuadreResultStatus(result: number): CuadreResultStatus` — [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts#L170)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculateCuadreResult` (L182–190)

- **Tipo:** función exportada
- **Firma:** `calculateCuadreResult(totalCash: number, totalBanks: number, totalAccountsReceivable: number, totalAssets: number, totalWarehouseCash?): number` — [cuadre-agentes.model.ts](../../../../comercial-jhoel-app/src/app/core/models/cuadre-agentes.model.ts#L182)
- **Propósito / descripción:** Consolidated cuadre (same formula as the backend): caja count + Bodega + banks + CxC − assets.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-dashboard-metrics-model-ts"></a>

### dashboard-metrics.model.ts

- **Ruta:** [dashboard-metrics.model.ts](../../../../comercial-jhoel-app/src/app/core/models/dashboard-metrics.model.ts) (`comercial-jhoel-app/src/app/core/models/dashboard-metrics.model.ts`, 47 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** `GET /dashboard/summary` — admin-only on the backend (`@Roles`), backs the Resumen dashboard's Ventas de Recargas / Ventas / Compras / Transacciones Bancarias sections.
- **Descripción del autor (comentario del archivo):** `GET /dashboard/summary` — admin-only on the backend (`@Roles`), backs the Resumen dashboard's Ventas de Recargas / Ventas / Compras / Transacciones Bancarias sections. Always scoped to "the 1st of whatever the current month is, through today" — computed fresh on the server on every call, never a stored/reset counter. See the backend `CLAUDE.md`'s "Dashboard" section for the full query design.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface DashboardPeriod` (L9): `GET /dashboard/summary` — admin-only on the backend (`@Roles`), backs the Resumen dashboard's Ventas de Recargas / Ventas / Compras / Transacciones Bancarias sections. — miembros: `year`, `month`, `startDate`, `endDate`
- `interface DashboardDay` (L16): sin documentación — miembros: `date`, `amount`
- `interface DashboardDailySeries` (L22): `highestDay`/`lowestDay` are `null` when the month has no data yet for that series — render "N/A", never a fabricated date. — miembros: `highestDay`, `lowestDay`, `total`
- `interface DashboardBank` (L28): sin documentación — miembros: `bankId`, `bankName`, `transactions`
- `interface DashboardBankTransactions` (L34): sin documentación — miembros: `totalTransactions`, `highestBank`, `lowestBank`
- `interface DashboardMetrics` (L40): sin documentación — miembros: `period`, `rechargeSales`, `sales`, `purchases`, `bankTransactions`
<a id="f-comercial-jhoel-app-src-app-core-models-dashboard-nav-item-model-ts"></a>

### dashboard-nav-item.model.ts

- **Ruta:** [dashboard-nav-item.model.ts](../../../../comercial-jhoel-app/src/app/core/models/dashboard-nav-item.model.ts) (`comercial-jhoel-app/src/app/core/models/dashboard-nav-item.model.ts`, 11 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `DashboardNavItem` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface DashboardNavItem` (L1): sin documentación — miembros: `label`, `icon`, `path`, `children`, `roles`
<a id="f-comercial-jhoel-app-src-app-core-models-dashboard-summary-item-model-ts"></a>

### dashboard-summary-item.model.ts

- **Ruta:** [dashboard-summary-item.model.ts](../../../../comercial-jhoel-app/src/app/core/models/dashboard-summary-item.model.ts) (`comercial-jhoel-app/src/app/core/models/dashboard-summary-item.model.ts`, 10 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `DashboardSummaryItem` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface DashboardSummaryItem` (L1): sin documentación — miembros: `id`, `icon`, `title`, `value`, `description`, `path`
<a id="f-comercial-jhoel-app-src-app-core-models-financial-day-review-model-ts"></a>

### financial-day-review.model.ts

- **Ruta:** [financial-day-review.model.ts](../../../../comercial-jhoel-app/src/app/core/models/financial-day-review.model.ts) (`comercial-jhoel-app/src/app/core/models/financial-day-review.model.ts`, 428 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Sistema → Administración financiera → Revisión de días operativos.
- **Descripción del autor (comentario del archivo):** Sistema → Administración financiera → Revisión de días operativos. Mirrors the API (`/financial-day-reviews`). Every figure, difference and recalculation comes from the backend; the UI never recomputes balances.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface FinancialDayListItem` (L34): sin documentación — miembros: `date`, `agentDayStatus`, `cashDayStatus`, `cashOpening`, `cashClosing`, `totalBanks`, `totalAccountsReceivable`, `totalAssets`, `reconciliationResult`, `movementCount`, `cutCount`, `hasDifferences`, `activeSessionId`, `activeSessionUsername`, `reviewCount`
- `interface ReviewSession` (L52): sin documentación — miembros: `id`, `reviewDate`, `status`, `reason`, `openedById`, `openedByUsername`, `openedAt`, `closeRequestedAt`, `closedByUsername`, `closedAt`, `closeObservations`, `correctionsCount`, `hasPendingDifferences`, `differenceBefore`, `differenceAfter`
- `interface ReviewCorrection` (L70): sin documentación — miembros: `id`, `sessionId`, `reviewDate`, `module`, `correctionType`, `targetTable`, `targetId`, `field`, `originalValue`, `newValue`, `difference`, `reason`, `observations`, `originalReference`, `createdByUsername`, `createdAt`
- `interface RelatedMovement` (L92): sin documentación — miembros: `source`, `id`, `label`, `amount`, `date`, `match`, `pairWithId`
- `interface DifferenceItem` (L102): sin documentación — miembros: `key`, `module`, `account`, `type`, `label`, `expected`, `registered`, `difference`, `related`, `reference`, `target`
- `interface BankDiagnosis` (L121): sin documentación — miembros: `bankId`, `name`, `maskedAccount`, `specialAccount`, `accountTypeName`, `creditLine`, `outsideReconciliation`, `balanceRowId`, `openingRegistered`, `previousDayDate`, `previousDayFinal`, `openingMismatch`, `ledgerAvailable`, `ledgerOpening`, `totals`, `reviewAdjustments`, `movementsTotal`, `theoreticalClosing`, `registeredClosing`, `difference`, `nextDayDate`, `nextDayOpening`, `nextDayMismatch`, `movementCount`
- `interface CashDiagnosis` (L158): sin documentación — miembros: `available`, `dayId`, `status`, `openingPolicy`, `openingSystem`, `openingPhysical`, `previousDayDate`, `previousDayClosingPhysical`, `openingMismatch`, `totalIn`, `totalOut`, `reviewAdjustments`, `theoretical`, `registeredSystemClosing`, `kardexDifference`, `counted`, `physicalDifference`, `registeredClosingDifference`, `nextDayDate`, `nextDayOpeningPhysical`, `nextDayMismatch`, `movementCount`
- `interface CutDiagnosis` (L183): sin documentación — miembros: `id`, `periodNumber`, `status`, `scheduledStartAt`, `scheduledEndAt`, `actualStartedAt`, `actualFinishedAt`, `openingSystem`, `openingPhysical`, `closingSystem`, `closingPhysical`, `cashDifference`, `registeredIn`, `registeredOut`, `recomputedIn`, `recomputedOut`, `movementCount`, `reopenedCount`, `currentCount`, `previousCounts`, `bankReconciliations`
- `interface PortfolioRow` (L220): sin documentación — miembros: `id`, `sequence`, `clientId`, `clientName`, `date`, `amount`, `movementType`, `description`, `referenceType`, `isActive`, `createdAt`, `username`, `adjustment`
- `interface PortfolioDiagnosis` (L236): sin documentación — miembros: `clients`, `totals`, `rows`, `registeredTotal`, `difference`, `lateRows`
- `interface ReconciliationDiagnosis` (L268): sin documentación — miembros: `available`, `id`, `totalCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `recomputedResult`, `createdAt`, `username`, `rowsForDate`, `expectedBanks`, `expectedBanksPreviousRule`, `missingBankSnapshots`, `expectedAccountsReceivable`, `expectedAssets`, `expectedCash`
- `interface DayMovement` (L289): sin documentación — miembros: `source`, `id`, `at`, `type`, `label`, `amount`, `account`, `cashEffect`, `bankEffect`, `balanceBefore`, `balanceAfter`, `reference`, `username`, `status`, `adjustable`, `adjustment`
- `interface FinancialDayDiagnosis` (L308): sin documentación — miembros: `date`, `agentDay`, `banks`, `bankTotals`, `cash`, `cuts`, `receivables`, `assets`, `reconciliation`, `movements`, `differences`, `totalAbsoluteDifference`, `hasPendingDifferences`
- `interface FinancialDayDetail` (L338): sin documentación — miembros: `date`, `diagnosis`, `activeSession`, `sessions`, `corrections`, `permissions`
- `interface CloseReviewSummary` (L351): sin documentación — miembros: `session`, `totalCorrections`, `byModule`, `banksModified`, `cashCorrections`, `receivableCorrections`, `assetCorrections`, `differenceBefore`, `differenceAfter`, `hasPendingDifferences`, `pendingDifferences`
- `type ReviewSessionStatus` (L7) = `'OPEN' \| 'IN_REVIEW' \| 'PENDING_CONFIRMATION' \| 'CLOSED'` — Sistema → Administración financiera → Revisión de días operativos.
- `type ReviewModule` (L10) = `\| 'BANCOS' \| 'EFECTIVO' \| 'CORTES' \| 'CUENTAS_POR_COBRAR' \| 'ACTIVOS' \| 'TRANSACCIONES' \| 'CUADRE'`
- `type SnapshotTarget` (L19) = `\| 'BANK_BALANCE' \| 'AGENT_RECONCILIATION' \| 'CASH_DAY' \| 'CASH_CUT_PERIOD' \| 'CASH_CUT_COUNT' \| 'CASH_BANK_RECONCILIATION'`
- `type MovementSource` (L27) = `\| 'CASH_MOVEMENT' \| 'BANK_MOVEMENT' \| 'TRANSACTION' \| 'ACCOUNT_RECEIVABLE' \| 'ASSET'`
- `type MatchKind` (L89) = `'EXACT' \| 'SIGN_INVERTED' \| 'PAIR' \| 'ADJACENT_DAY' \| 'LATE_ROW'`
- `type CorrectionRequest` (L366) = `\| { kind: 'SNAPSHOT'; target: SnapshotTarget; targetId: string; field: string; module: ReviewModule; label: string; originalValue: number; allowNegative: boolean; } \| { kind: 'MOVEMENT'; source: Movem` — What the correction modal edits: a day snapshot value or a movement amount.

**Constantes exportadas:**

- `REVIEW_STATUS_LABEL` (L387) = `{ OPEN: 'Abierta', IN_REVIEW: 'En revisión', PENDING_CONFIRMATION: 'Pendiente de confirmación', CLOSED: 'Cerra`
- `REVIEW_MODULE_LABEL` (L394) = `{ BANCOS: 'Bancos', EFECTIVO: 'Efectivo', CORTES: 'Cortes', CUENTAS_POR_COBRAR: 'Cuentas por cobrar', ACTIVOS:`
- `MATCH_LABEL` (L404) = `{ EXACT: 'Mismo monto que la diferencia', SIGN_INVERTED: 'La mitad de la diferencia (posible signo invertido)'`
- `DIFFERENCE_TYPE_LABEL` (L412) = `{ SALDO_FINAL_NO_CUADRA: 'Saldo final no cuadra', APERTURA_DISTINTA_AL_CIERRE_ANTERIOR: 'Apertura ≠ cierre ant`
<a id="f-comercial-jhoel-app-src-app-core-models-guayacan-cash-box-model-ts"></a>

### guayacan-cash-box.model.ts

- **Ruta:** [guayacan-cash-box.model.ts](../../../../comercial-jhoel-app/src/app/core/models/guayacan-cash-box.model.ts) (`comercial-jhoel-app/src/app/core/models/guayacan-cash-box.model.ts`, 228 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Tipos del Kardex de EFECTIVO.
- **Descripción del autor (comentario del archivo):** Tipos del Kardex de EFECTIVO. INGRESO/EGRESO = manuales (botones de la caja); TRANSACCION_DEPOSITO/RETIRO = efectivo de Transaccionar. Las comisiones NO son efectivo (`GuayacanCommission`): COMISION_TRANSACCION / REVERSO_COMISION solo aparecen como historial previo a esa separación.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface GuayacanCashDenomination` (L40): sin documentación — miembros: `denomination`, `quantity`
- `interface GuayacanCashDenominationRow` (L45) extends GuayacanCashDenomination: sin documentación — miembros: `subtotal`
- `interface GuayacanCashMovement` (L50): Una fila del Kardex. `amount` con signo (+ ingreso / − egreso); `balanceBefore + amount = balanceAfter` lo garantiza el backend. — miembros: `id`, `sequence`, `movementType`, `amount`, `balanceBefore`, `balanceAfter`, `businessDate`, `concept`, `reason`, `notes`, `referenceType`, `referenceId`, `transactionCount`, `commissionRate`, `reversalOfId`, `status`, `voidedAt`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`
- `interface GuayacanCashMovementDetail` (L75) extends GuayacanCashMovement: sin documentación — miembros: `cashDetails`, `operation`
- `interface GuayacanPeriodSummary` (L91): sin documentación — miembros: `startDate`, `endDate`, `transactionCount`, `operationCount`, `commissionTotal`, `manualIncomeTotal`, `manualExpenseTotal`, `transactionInTotal`, `transactionOutTotal`, `adjustmentTotal`
- `interface GuayacanCashBoxSummary` (L106): sin documentación — miembros: `agent`, `balance`, `today`, `daily`, `weekly`, `monthly`
- `interface GuayacanCashCountSummary` (L124): Arqueo guardado — foto histórica e inmutable (saldo del sistema, contado y diferencia de ese momento). — miembros: `id`, `sequence`, `number`, `status`, `lastMovementId`, `lastMovementSequence`, `businessDate`, `totalCounted`, `systemBalance`, `difference`, `notes`, `createdBy`, `createdByUsername`, `createdAt`
- `interface GuayacanCashCount` (L143) extends GuayacanCashCountSummary: sin documentación — miembros: `details`
- `interface GuayacanCashCountFilters` (L148): sin documentación — miembros: `startDate`, `endDate`, `userId`, `number`, `page`, `limit`
- `interface PaginatedGuayacanCashCounts` (L157): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface GuayacanCommission` (L165): Comisión de una operación Guayacán — concepto propio, fuera del efectivo de caja. — miembros: `id`, `operationId`, `transactionTypeName`, `businessDate`, `transactionCount`, `commissionRate`, `amount`, `status`, `voidedAt`, `voidReason`, `createdByUsername`, `createdAt`
- `interface PaginatedGuayacanCommissions` (L180): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface PaginatedGuayacanCashMovements` (L187): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface GuayacanCashMovementFilters` (L194): sin documentación — miembros: `startDate`, `endDate`, `movementType`, `page`, `limit`
- `interface RegisterGuayacanCashMovementInput` (L202): sin documentación — miembros: `movementType`, `amount`, `businessDate`, `concept`, `reason`, `notes`, `cashDetails`, `clientRequestId`
- `interface RegisterGuayacanCashAdjustmentInput` (L213): sin documentación — miembros: `amount`, `businessDate`, `concept`, `reason`, `notes`, `clientRequestId`
- `interface RegisterGuayacanCashCountInput` (L223): sin documentación — miembros: `details`, `notes`, `clientRequestId`
- `type GuayacanCashMovementType` (L9) = `\| 'INGRESO' \| 'EGRESO' \| 'TRANSACCION_DEPOSITO' \| 'TRANSACCION_RETIRO' \| 'AJUSTE' \| 'ANULACION' \| 'COMISION_TRANSACCION' \| 'REVERSO_COMISION'` — Tipos del Kardex de EFECTIVO.
- `type GuayacanCashCountStatus` (L115) = `'CUADRADO' \| 'SOBRANTE' \| 'FALTANTE'`

**Constantes exportadas:**

- `GUAYACAN_MOVEMENT_TYPE_LABEL` (L19) = `{ INGRESO: 'Ingreso manual', EGRESO: 'Egreso manual', TRANSACCION_DEPOSITO: 'Depósito (Transaccionar)', TRANSA`
- `GUAYACAN_FILTER_MOVEMENT_TYPES` (L31): Tipos que se ofrecen en el filtro del Kardex (los históricos de comisión siguen visibles en "Todos"). = `[ 'INGRESO', 'EGRESO', 'TRANSACCION_DEPOSITO', 'TRANSACCION_RETIRO', 'AJUSTE', 'ANULACION', ]`
- `GUAYACAN_COUNT_STATUS_LABEL` (L117) = `{ CUADRADO: 'Cuadrado', SOBRANTE: 'Sobrante', FALTANTE: 'Faltante', }`
<a id="f-comercial-jhoel-app-src-app-core-models-ice-cream-purchase-model-ts"></a>

### ice-cream-purchase.model.ts

- **Ruta:** [ice-cream-purchase.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ice-cream-purchase.model.ts) (`comercial-jhoel-app/src/app/core/models/ice-cream-purchase.model.ts`, 56 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `calculateIceCreamPurchaseItemTotal`, `calculateIceCreamPurchaseTotal`, `IceCreamPurchaseItem`, `IceCreamPurchase`, `IceCreamPurchaseDraftItem` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamPurchaseItem` (L1): sin documentación — miembros: `id`, `iceCreamId`, `product`, `sku`, `quantity`, `costPrice`, `total`
- `interface IceCreamPurchase` (L11): sin documentación — miembros: `id`, `supplierId`, `supplierName`, `userId`, `username`, `purchaseDate`, `total`, `items`, `createdAt`, `updatedAt`
- `interface IceCreamPurchaseDraftItem` (L29): Row in the invoice being built — not yet persisted. — miembros: `iceCreamId`, `sku`, `product`, `quantity`, `costPrice`
- `interface CreateIceCreamPurchaseItemInput` (L37): sin documentación — miembros: `iceCreamId`, `quantity`, `costPrice`
- `interface CreateIceCreamPurchaseInput` (L43): sin documentación — miembros: `supplierId`, `purchaseDate`, `items`
#### Función `calculateIceCreamPurchaseItemTotal` (L49–51)

- **Tipo:** función exportada
- **Firma:** `calculateIceCreamPurchaseItemTotal(item: IceCreamPurchaseDraftItem): number` — [ice-cream-purchase.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ice-cream-purchase.model.ts#L49)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculateIceCreamPurchaseTotal` (L53–55)

- **Tipo:** función exportada
- **Firma:** `calculateIceCreamPurchaseTotal(items: IceCreamPurchaseDraftItem[]): number` — [ice-cream-purchase.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ice-cream-purchase.model.ts#L53)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `items.reduce`, `calculateIceCreamPurchaseItemTotal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-ice-cream-sale-model-ts"></a>

### ice-cream-sale.model.ts

- **Ruta:** [ice-cream-sale.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ice-cream-sale.model.ts) (`comercial-jhoel-app/src/app/core/models/ice-cream-sale.model.ts`, 54 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `calculateIceCreamSaleItemTotal`, `calculateIceCreamSaleTotal`, `IceCreamSaleItem`, `IceCreamSale`, `IceCreamSaleDraftItem` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamSaleItem` (L1): sin documentación — miembros: `id`, `iceCreamId`, `product`, `sku`, `quantity`, `unitPrice`, `total`
- `interface IceCreamSale` (L11): sin documentación — miembros: `id`, `userId`, `username`, `saleDate`, `total`, `items`, `createdAt`, `updatedAt`
- `interface IceCreamSaleDraftItem` (L28): Row in the receipt being built — not yet persisted. — miembros: `iceCreamId`, `sku`, `product`, `quantity`, `unitPrice`, `availableStock`
- `interface CreateIceCreamSaleItemInput` (L38): sin documentación — miembros: `iceCreamId`, `quantity`
- `interface CreateIceCreamSaleInput` (L43): sin documentación — miembros: `items`
#### Función `calculateIceCreamSaleItemTotal` (L47–49)

- **Tipo:** función exportada
- **Firma:** `calculateIceCreamSaleItemTotal(item: IceCreamSaleDraftItem): number` — [ice-cream-sale.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ice-cream-sale.model.ts#L47)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculateIceCreamSaleTotal` (L51–53)

- **Tipo:** función exportada
- **Firma:** `calculateIceCreamSaleTotal(items: IceCreamSaleDraftItem[]): number` — [ice-cream-sale.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ice-cream-sale.model.ts#L51)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `items.reduce`, `calculateIceCreamSaleItemTotal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-ice-cream-model-ts"></a>

### ice-cream.model.ts

- **Ruta:** [ice-cream.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ice-cream.model.ts) (`comercial-jhoel-app/src/app/core/models/ice-cream.model.ts`, 47 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `getIceCreamStockStatus`, `IceCream`, `IceCreamInput`, `IceCreamStockStatus`, `ICE_CREAM_LOW_STOCK_THRESHOLD` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts)
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface IceCream` (L1): sin documentación — miembros: `id`, `sku`, `product`, `costPrice`, `publicPrice`, `stock`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface IceCreamInput` (L18): Payload for create/update — the backend assigns id/stock(on create)/timestamps/audit fields. — miembros: `sku`, `product`, `costPrice`, `publicPrice`
- `type IceCreamStockStatus` (L25) = `'in-stock' \| 'low-stock' \| 'out-of-stock'`

**Constantes exportadas:**

- `ICE_CREAM_LOW_STOCK_THRESHOLD` (L28): Below this (and above zero) a helado is flagged as low stock — same threshold as Inventario's own rule. = `10`
- `ICE_CREAM_STOCK_STATUS_LABEL` (L30) = `{ 'in-stock': 'Disponible', 'low-stock': 'Stock bajo', 'out-of-stock': 'Sin stock', }`
#### Función `getIceCreamStockStatus` (L36–44)

- **Tipo:** función exportada
- **Firma:** `getIceCreamStockStatus(stock: number): IceCreamStockStatus` — [ice-cream.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ice-cream.model.ts#L36)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-index-ts"></a>

### index.ts

- **Ruta:** [index.ts](../../../../comercial-jhoel-app/src/app/core/models/index.ts) (`comercial-jhoel-app/src/app/core/models/index.ts`, 67 líneas)
- **Tipo:** Barrel (re-exportación) · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Barrel (re-exportación) (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [nav-link.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-nav-link-model-ts), [service-item.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-service-item-model-ts), [stat-item.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-stat-item-model-ts), [catalog-category.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-catalog-category-model-ts), [bank-operation.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-bank-operation-model-ts), [contact-channel.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-contact-channel-model-ts), [dashboard-nav-item.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-dashboard-nav-item-model-ts), [keyboard-shortcut.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-keyboard-shortcut-model-ts), [dashboard-summary-item.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-dashboard-summary-item-model-ts), [product.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-product-model-ts), [inventory.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-inventory-model-ts), [category.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-category-model-ts), [business.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-business-model-ts), [sale.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-sale-model-ts), [sales-register.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-sales-register-model-ts) y 51 más
- **Consumidores:** [bank-operations.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-bank-operations-data-ts), [catalog-categories.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-catalog-categories-data-ts), [dashboard-nav.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-dashboard-nav-data-ts), [dashboard-summary.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-dashboard-summary-data-ts), [nav-links.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-nav-links-data-ts), [services.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-services-data-ts), [stats.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-stats-data-ts), [account-receivable-payment.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-payment-service-ts), [account-receivable.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-service-ts), [account-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-type-service-ts), [alert-settings.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-alert-settings-service-ts), [alerts.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-alerts-service-ts), [asset.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-asset-service-ts), [assets-receivables-report-state.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-assets-receivables-report-state-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts) y 400 más
<a id="f-comercial-jhoel-app-src-app-core-models-inventory-model-ts"></a>

### inventory.model.ts

- **Ruta:** [inventory.model.ts](../../../../comercial-jhoel-app/src/app/core/models/inventory.model.ts) (`comercial-jhoel-app/src/app/core/models/inventory.model.ts`, 99 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** An extensible stock location (Bodega, Vitrina, ...) — adding a new one is a backend admin action, never a frontend code change.
- **Descripción del autor (comentario del archivo):** An extensible stock location (Bodega, Vitrina, ...) — adding a new one is a backend admin action, never a frontend code change.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface InventoryLocation` (L2): An extensible stock location (Bodega, Vitrina, ...) — adding a new one is a backend admin action, never a frontend code change. — miembros: `id`, `name`, `isActive`
- `interface ProductPresentation` (L9): A configurable unit of sale/purchase for one product (Unidad, Caja, Paquete...) — every product always has at least "Unidad" (factor 1, immutable). — miembros: `id`, `productId`, `presentationTypeId`, `name`, `conversionFactor`, `costPrice`, `publicPrice`, `barcode`, `isActive`
- `interface InventoryMovement` (L28): sin documentación — miembros: `id`, `presentationName`, `locationFromName`, `locationToName`, `movementType`, `quantityPresentation`, `conversionFactor`, `quantityBaseUnits`, `username`, `reason`, `createdAt`
- `interface ProductInventoryDetail` (L42): sin documentación — miembros: `productId`, `productName`, `sku`, `categoryName`, `totalStock`, `stockByLocation`, `presentations`, `recentMovements`
- `interface TransferInventoryInput` (L53): sin documentación — miembros: `productId`, `presentationId`, `fromLocationId`, `toLocationId`, `quantity`, `reason`
- `interface TransferBatchItemInput` (L63): "Transferencia rápida" — varios productos, un origen/destino, una sola operación atómica (ver `register_inventory_transfer_batch` / `POST /inventory/transfers/batch`). — miembros: `productId`, `presentationId`, `quantity`
- `interface TransferBatchInput` (L69): sin documentación — miembros: `fromLocationId`, `toLocationId`, `reason`, `items`
- `interface CreatePresentationInput` (L76): sin documentación — miembros: `presentationTypeId`, `conversionFactor`, `costPrice`, `publicPrice`, `barcode`
- `interface UpdatePresentationInput` (L84): sin documentación — miembros: `presentationTypeId`, `conversionFactor`, `costPrice`, `publicPrice`, `barcode`, `isActive`
- `type InventoryMovementType` (L22) = `\| 'ENTRADA_COMPRA' \| 'SALIDA_VENTA' \| 'TRASLADO_SALIDA' \| 'TRASLADO_ENTRADA'`

**Constantes exportadas:**

- `MOVEMENT_TYPE_LABEL` (L93) = `{ ENTRADA_COMPRA: 'Entrada por compra', SALIDA_VENTA: 'Salida por venta', TRASLADO_SALIDA: 'Salida por traslad`
<a id="f-comercial-jhoel-app-src-app-core-models-kardex-model-ts"></a>

### kardex.model.ts

- **Ruta:** [kardex.model.ts](../../../../comercial-jhoel-app/src/app/core/models/kardex.model.ts) (`comercial-jhoel-app/src/app/core/models/kardex.model.ts`, 56 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `KardexMovement`, `KardexStatement`, `RegisterKardexMovementInput`, `KardexStatementFilters`, `ActiveBalanceSummary` (sin comentario de documentación en el código).
- **Paquetes externos:** `rxjs`
- **Consumidores:** [account-receivable.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-account-receivable-model-ts), [asset.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-asset-model-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface KardexMovement` (L5): sin documentación — miembros: `id`, `date`, `movementType`, `description`, `amount`, `balanceAfter`, `createdByUsername`, `createdAt`
- `interface KardexStatement` (L16): sin documentación — miembros: `clientId`, `clientName`, `openingBalance`, `movements`, `totalCargos`, `totalAbonos`, `closingBalance`
- `interface RegisterKardexMovementInput` (L26): sin documentación — miembros: `date`, `amount`, `description`
- `interface KardexStatementFilters` (L32): sin documentación — miembros: `dateFrom`, `dateTo`
- `interface ActiveBalanceSummary` (L38): Backs the plain list screen's "Saldo total" tile — always scoped to active accounts only, independent of the list's own current filters. — miembros: `totalAmount`, `recordCount`
- `interface KardexAccountService` (L50): Structural contract both `AccountReceivableService` and `AssetService` satisfy — lets `AccountStatementModalComponent` stay one generic component shared by Cuentas por Cobrar and Activos, even though the two modules never share balances or movements (that separation is entirely backend-side: each service talks to its own table, scoped by clientId). — miembros: `getStatement`, `getCurrentBalance`, `registerCharge`, `registerPayment`
- `type KardexMovementType` (L3) = `'CARGO' \| 'ABONO'`
<a id="f-comercial-jhoel-app-src-app-core-models-keyboard-shortcut-model-ts"></a>

### keyboard-shortcut.model.ts

- **Ruta:** [keyboard-shortcut.model.ts](../../../../comercial-jhoel-app/src/app/core/models/keyboard-shortcut.model.ts) (`comercial-jhoel-app/src/app/core/models/keyboard-shortcut.model.ts`, 54 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** A global keyboard shortcut → dashboard route mapping, backed by `GET/POST/PATCH/DELETE /keyboard-shortcuts` — configurable from "Sistema → Atajos de Teclado".
- **Descripción del autor (comentario del archivo):** A global keyboard shortcut → dashboard route mapping, backed by `GET/POST/PATCH/DELETE /keyboard-shortcuts` — configurable from "Sistema → Atajos de Teclado". `KeyboardShortcutsService` (the listener) is the only consumer that matches these against real `keydown` events; this model has no awareness of navigation itself.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface KeyboardShortcut` (L8): A global keyboard shortcut → dashboard route mapping, backed by `GET/POST/PATCH/DELETE /keyboard-shortcuts` — configurable from "Sistema → Atajos de Teclado". — miembros: `id`, `label`, `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`, `route`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface CreateKeyboardShortcutInput` (L28): sin documentación — miembros: `label`, `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`, `route`
- `interface UpdateKeyboardShortcutInput` (L38): sin documentación — miembros: `label`, `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`, `route`, `isActive`
- `interface ShortcutRouteOption` (L50): One entry in the "Ruta destino" dropdown — built from `DASHBOARD_NAV_ITEMS` (the same list the sidebar itself renders from), never free text, so a shortcut can never point at a typo'd/nonexistent route. — miembros: `label`, `route`
<a id="f-comercial-jhoel-app-src-app-core-models-landing-background-model-ts"></a>

### landing-background.model.ts

- **Ruta:** [landing-background.model.ts](../../../../comercial-jhoel-app/src/app/core/models/landing-background.model.ts) (`comercial-jhoel-app/src/app/core/models/landing-background.model.ts`, 119 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Las secciones reales de la landing pública — mismos `sectionId` que ya usa cada `&lt;app-section&gt;` (y `inicio` para el Hero).
- **Descripción del autor (comentario del archivo):** Las secciones reales de la landing pública — mismos `sectionId` que ya usa cada `&lt;app-section&gt;` (y `inicio` para el Hero). Ver el backend `LANDING_SECTION_KEYS` — es la misma lista, nunca debe divergir.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface LandingBackground` (L65): Ficha completa de administración. — miembros: `id`, `name`, `sectionKey`, `opacity`, `overlay`, `position`, `size`, `depthEffect`, `parallax`, `movement`, `isActive`, `hasImage`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface LandingBackgroundVisualConfigInput` (L86): sin documentación — miembros: `opacity`, `overlay`, `position`, `size`, `depthEffect`, `parallax`, `movement`
- `interface CreateLandingBackgroundInput` (L96) extends LandingBackgroundVisualConfigInput: sin documentación — miembros: `name`, `sectionKey`
- `interface UpdateLandingBackgroundInput` (L101) extends LandingBackgroundVisualConfigInput: sin documentación — miembros: `name`, `sectionKey`
- `interface PublicLandingBackground` (L107): Shape público — backs la capa de fondos en la landing. — miembros: `id`, `sectionKey`, `hasImage`, `opacity`, `overlay`, `position`, `size`, `depthEffect`, `parallax`, `movement`
- `type OverlayLevel` (L14) = `'none' \| 'subtle' \| 'medium' \| 'strong'`
- `type BackgroundPosition` (L15) = `'center' \| 'center-left' \| 'center-right' \| 'top' \| 'bottom'`
- `type BackgroundSize` (L16) = `'small' \| 'medium' \| 'large' \| 'cover'`
- `type DepthEffect` (L17) = `'none' \| 'subtle' \| 'medium' \| 'deep'`
- `type ParallaxIntensity` (L18) = `'off' \| 'subtle' \| 'medium'`
- `type MovementMode` (L19) = `'static' \| 'floating' \| 'scroll' \| 'mouse' \| 'scroll_mouse'`

**Constantes exportadas:**

- `LANDING_SECTION_OPTIONS` (L2): Las secciones reales de la landing pública — mismos `sectionId` que ya usa cada `&lt;app-section&gt;` (y `inicio` para el Hero). = `[ { value: 'inicio', label: 'Inicio / Hero' }, { value: 'servicios', label: 'Servicios' }, { value: 'telefonos`
- `OVERLAY_OPTIONS` (L21) = `[ { value: 'none', label: 'Ninguno' }, { value: 'subtle', label: 'Sutil' }, { value: 'medium', label: 'Medio' `
- `POSITION_OPTIONS` (L28) = `[ { value: 'center', label: 'Centro' }, { value: 'center-left', label: 'Centro izquierda' }, { value: 'center-`
- `SIZE_OPTIONS` (L36) = `[ { value: 'small', label: 'Pequeño' }, { value: 'medium', label: 'Mediano' }, { value: 'large', label: 'Grand`
- `DEPTH_EFFECT_OPTIONS` (L43) = `[ { value: 'none', label: 'Sin efecto' }, { value: 'subtle', label: 'Sutil' }, { value: 'medium', label: 'Medi`
- `PARALLAX_OPTIONS` (L50) = `[ { value: 'off', label: 'Desactivado' }, { value: 'subtle', label: 'Sutil' }, { value: 'medium', label: 'Medi`
- `MOVEMENT_OPTIONS` (L56) = `[ { value: 'static', label: 'Estático' }, { value: 'floating', label: 'Floating' }, { value: 'scroll', label: `
<a id="f-comercial-jhoel-app-src-app-core-models-nav-link-model-ts"></a>

### nav-link.model.ts

- **Ruta:** [nav-link.model.ts](../../../../comercial-jhoel-app/src/app/core/models/nav-link.model.ts) (`comercial-jhoel-app/src/app/core/models/nav-link.model.ts`, 26 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `NavLink` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface NavLink` (L1): sin documentación — miembros: `label`, `path`, `fragment`, `isCta`, `icon`, `children`, `dividerBefore`, `action`
<a id="f-comercial-jhoel-app-src-app-core-models-news-article-model-ts"></a>

### news-article.model.ts

- **Ruta:** [news-article.model.ts](../../../../comercial-jhoel-app/src/app/core/models/news-article.model.ts) (`comercial-jhoel-app/src/app/core/models/news-article.model.ts`, 49 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Ficha completa de administración — contenido editorial, no un producto.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface NewsArticle` (L2): Ficha completa de administración — contenido editorial, no un producto. — miembros: `id`, `title`, `slug`, `description`, `publishedAt`, `newsTypeId`, `newsTypeName`, `isActive`, `sortOrder`, `likesCount`, `hasImage`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface CreateNewsArticleInput` (L22): sin documentación — miembros: `title`, `description`, `publishedAt`, `newsTypeId`
- `interface UpdateNewsArticleInput` (L29): sin documentación — miembros: `title`, `description`, `publishedAt`, `newsTypeId`
- `interface PublicNewsArticle` (L37): Shape público — backs "Noticias" en la landing. — miembros: `id`, `title`, `slug`, `description`, `publishedAt`, `newsTypeName`, `hasImage`, `likesCount`, `liked`
<a id="f-comercial-jhoel-app-src-app-core-models-news-subscriber-model-ts"></a>

### news-subscriber.model.ts

- **Ruta:** [news-subscriber.model.ts](../../../../comercial-jhoel-app/src/app/core/models/news-subscriber.model.ts) (`comercial-jhoel-app/src/app/core/models/news-subscriber.model.ts`, 64 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `NewsSubscriberTypeSummary`, `NewsSubscriber`, `NewsSubscriberAuditEntry`, `PushDeviceSummary`, `NewsSubscriberDetail` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface NewsSubscriberTypeSummary` (L1): sin documentación — miembros: `id`, `name`, `slug`, `isWildcard`
- `interface NewsSubscriber` (L14): Ficha admin — "Sistema → Suscriptores de Noticias". — miembros: `id`, `whatsappMasked`, `name`, `isActive`, `consentGiven`, `consentAt`, `createdAt`, `updatedAt`, `types`
- `interface NewsSubscriberAuditEntry` (L26): sin documentación — miembros: `id`, `action`, `previousTypeIds`, `newTypeIds`, `performedBy`, `performedByUsername`, `createdAt`
- `interface PushDeviceSummary` (L37): Un navegador/dispositivo con notificaciones push registradas para este suscriptor — nunca "1 usuario = 1 dispositivo". — miembros: `id`, `userAgent`, `isActive`, `lastSeenAt`, `createdAt`
- `interface NewsSubscriberDetail` (L45) extends NewsSubscriber: sin documentación — miembros: `auditLog`, `pushDevices`
- `interface Subscription` (L51): Shape público — solo para quien ya posee el `manageToken` (autoservicio de preferencias). — miembros: `whatsappNumber`, `name`, `manageToken`, `types`
- `interface SubscribeToNewsInput` (L58): sin documentación — miembros: `whatsappNumber`, `name`, `typeIds`, `consent`
<a id="f-comercial-jhoel-app-src-app-core-models-news-type-model-ts"></a>

### news-type.model.ts

- **Ruta:** [news-type.model.ts](../../../../comercial-jhoel-app/src/app/core/models/news-type.model.ts) (`comercial-jhoel-app/src/app/core/models/news-type.model.ts`, 38 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Ficha admin — catálogo configurable "Tipos de Noticias" (Sistema → Tipos de Noticias).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface NewsType` (L2): Ficha admin — catálogo configurable "Tipos de Noticias" (Sistema → Tipos de Noticias). — miembros: `id`, `name`, `slug`, `description`, `isWildcard`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`, `usageCount`
- `interface CreateNewsTypeInput` (L20): sin documentación — miembros: `name`, `description`
- `interface UpdateNewsTypeInput` (L25): sin documentación — miembros: `name`, `description`, `isActive`
- `interface PublicNewsType` (L32): Shape público mínimo — backs el formulario de suscripción y el selector "Tipo de noticia". — miembros: `id`, `name`, `slug`, `isWildcard`
<a id="f-comercial-jhoel-app-src-app-core-models-phone-model-ts"></a>

### phone.model.ts

- **Ruta:** [phone.model.ts](../../../../comercial-jhoel-app/src/app/core/models/phone.model.ts) (`comercial-jhoel-app/src/app/core/models/phone.model.ts`, 105 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** One individually-identified physical phone unit — mirrors the backend's `PhoneResponseDto` exactly.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Phone` (L20): One individually-identified physical phone unit — mirrors the backend's `PhoneResponseDto` exactly. — miembros: `id`, `operator`, `model`, `phoneNumber`, `imei`, `simNumber`, `costPrice`, `publicPrice`, `status`, `purchaseDate`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface CreatePhoneInput` (L41): No `phoneNumber` here — see `Phone`'s own doc comment. — miembros: `operator`, `model`, `imei`, `simNumber`, `costPrice`, `publicPrice`, `purchaseDate`
- `interface PhoneSale` (L61): Mirrors the backend's `PhoneSaleResponseDto` — `profit`/`phoneCostPrice`/ `salePrice` are server-computed (always the phone's `publicPrice` at the moment of sale), never recomputed or supplied by the frontend. — miembros: `id`, `phoneId`, `phoneOperator`, `phoneModel`, `phoneNumber`, `phoneImei`, `phoneSimNumber`, `phoneCostPrice`, `clientId`, `clientName`, `clientDpi`, `salePrice`, `profit`, `saleDate`, `hasDpiImage`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`
- `interface RegisterPhoneSaleInput` (L96): DPI photo (`dpiImage`) is optional — same real behavior as SIM sale, confirmed with the user rather than assumed from the literal spec. — miembros: `phoneId`, `clientId`, `clientDpi`, `phoneNumber`, `saleDate`, `dpiImage`
- `type PhoneOperator` (L1) = `'CLARO' \| 'TIGO'`
- `type PhoneStatus` (L2) = `'DISPONIBLE' \| 'VENDIDO'`

**Constantes exportadas:**

- `PHONE_OPERATOR_LABEL` (L4) = `{ CLARO: 'Claro', TIGO: 'Tigo', }`
- `PHONE_STATUS_LABEL` (L9) = `{ DISPONIBLE: 'Disponible', VENDIDO: 'Vendido', }`
<a id="f-comercial-jhoel-app-src-app-core-models-presentation-type-model-ts"></a>

### presentation-type.model.ts

- **Ruta:** [presentation-type.model.ts](../../../../comercial-jhoel-app/src/app/core/models/presentation-type.model.ts) (`comercial-jhoel-app/src/app/core/models/presentation-type.model.ts`, 32 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `PresentationType`, `PresentationTypeListItem`, `PresentationTypeInput`, `PresentationTypeFilters` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface PresentationType` (L1): sin documentación — miembros: `id`, `name`, `code`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface PresentationTypeListItem` (L16) extends PresentationType: List rows carry `usageCount` — how many `product_presentations` rows currently reference this type — the plain `PresentationType` shape (create/update responses) does not. — miembros: `usageCount`
- `interface PresentationTypeInput` (L21): Payload for create/update — the backend assigns id/timestamps/audit fields. — miembros: `name`, `code`, `description`, `isActive`
- `interface PresentationTypeFilters` (L28): sin documentación — miembros: `includeInactive`, `search`
<a id="f-comercial-jhoel-app-src-app-core-models-product-model-ts"></a>

### product.model.ts

- **Ruta:** [product.model.ts](../../../../comercial-jhoel-app/src/app/core/models/product.model.ts) (`comercial-jhoel-app/src/app/core/models/product.model.ts`, 118 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Looks up one location's quantity from a product's breakdown — 0 (not undefined) when the location has no row yet, since "no row" and "zero stock" mean the same thing to a caller.
- **Depende de (archivos del proyecto):** [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts)
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface StockByLocation` (L1): sin documentación — miembros: `locationId`, `locationName`, `quantity`
- `interface Product` (L7): sin documentación — miembros: `id`, `name`, `sku`, `category`, `categoryId`, `business`, `businessId`, `unitOfMeasure`, `unitOfMeasureAbbreviation`, `unitOfMeasureId`, `costPrice`, `publicPrice`, `wholesalePrice`, `stock`, `stockByLocation`, `matchedPresentation`, `isActive`, `createdAt`, `updatedAt`
- `interface ProductInput` (L43): Payload for create/update — the backend assigns id/timestamps/category name. — miembros: `name`, `sku`, `categoryId`, `businessId`, `unitOfMeasureId`, `costPrice`, `publicPrice`, `wholesalePrice`, `stock`
- `interface ImportProductsSkippedRow` (L87): One row from the uploaded Excel that couldn't be created, with a human-readable reason — the backend's `ImportProductsFromExcelUseCase` never aborts the whole file on a single bad row. — miembros: `row`, `name`, `reason`
- `interface ImportProductsResult` (L94): `POST /products/import`'s response shape — mirrors `ImportProductsResultResponseDto` on the backend exactly. — miembros: `totalRows`, `created`, `createdNames`, `skipped`, `presentationWarnings`
- `interface InventoryStats` (L110): `GET /products/stats`'s response shape — real SQL aggregates over the WHOLE active catalog, computed server-side. — miembros: `totalProducts`, `totalStock`, `lowStockCount`, `outOfStockCount`, `totalPublicValue`, `totalCostValue`
- `type StockStatus` (L62) = `'in-stock' \| 'low-stock' \| 'out-of-stock'`

**Constantes exportadas:**

- `LOW_STOCK_THRESHOLD` (L65): Below this (and above zero) a product is flagged as low stock. = `10`
- `STOCK_STATUS_LABEL` (L67) = `{ 'in-stock': 'Disponible', 'low-stock': 'Stock bajo', 'out-of-stock': 'Sin stock', }`
#### Función `stockAt` (L58–60)

- **Tipo:** función exportada
- **Firma:** `stockAt(product: Product, locationName: string): number` — [product.model.ts](../../../../comercial-jhoel-app/src/app/core/models/product.model.ts#L58)
- **Propósito / descripción:** Looks up one location's quantity from a product's breakdown — 0 (not undefined) when the location has no row yet, since "no row" and "zero stock" mean the same thing to a caller.
- **Dependencias:** `product.stockByLocation?.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `getStockStatus` (L74–82)

- **Tipo:** función exportada
- **Firma:** `getStockStatus(stock: number): StockStatus` — [product.model.ts](../../../../comercial-jhoel-app/src/app/core/models/product.model.ts#L74)
- **Propósito / descripción:** Single source of truth for stock classification — used by the table, the filters, and the summary cards.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-purchase-model-ts"></a>

### purchase.model.ts

- **Ruta:** [purchase.model.ts](../../../../comercial-jhoel-app/src/app/core/models/purchase.model.ts) (`comercial-jhoel-app/src/app/core/models/purchase.model.ts`, 174 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Single source of truth for invoice math — the table row, the summary, and the save confirmation dialog all call these instead of computing inline.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface PurchaseItem` (L1): sin documentación — miembros: `id`, `productId`, `productName`, `sku`, `quantity`, `costPrice`, `publicPrice`, `total`, `presentationName`
- `interface Purchase` (L16): sin documentación — miembros: `id`, `supplierId`, `supplierName`, `userId`, `username`, `purchaseDate`, `total`, `items`, `createdAt`, `updatedAt`, `paymentType`, `paymentDueDate`, `paymentStatus`, `paidAt`, `paidByUsername`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface PurchaseDraftItem` (L50): Row in the invoice being built — not yet persisted. — miembros: `productId`, `sku`, `name`, `presentationId`, `presentationName`, `quantity`, `costPrice`, `publicPrice`
- `interface CreatePurchaseItemInput` (L62): sin documentación — miembros: `productId`, `presentationId`, `quantity`, `costPrice`, `publicPrice`
- `interface CreatePurchaseInput` (L70): sin documentación — miembros: `supplierId`, `purchaseDate`, `items`, `paymentType`, `paymentDueDate`, `invoiceNumber`
- `interface ImportPurchaseSkippedRow` (L81): sin documentación — miembros: `row`, `identifier`, `reason`
- `interface ImportPurchaseResult` (L88): `POST /purchases/import`'s response shape ("Cargar stock inicial") — mirrors `ImportPurchaseResultResponseDto` on the backend exactly. — miembros: `totalRows`, `productsAffected`, `purchasesCreated`, `transfersToVitrina`, `skipped`, `transferWarnings`
- `interface PurchasesDailyStat` (L98): sin documentación — miembros: `date`, `amount`
- `interface PurchasesDailyStats` (L105): `GET /purchases/daily-stats` — backs "Compras del mes" en Gráficas → Indicadores de Compras. — miembros: `month`, `days`
- `interface PurchasesWeeklyStat` (L111): sin documentación — miembros: `weekNumber`, `label`, `startDate`, `endDate`, `amount`
- `interface PurchasesWeeklyStats` (L123): `GET /purchases/weekly-stats` — backs "Compras por semana". — miembros: `month`, `weeks`
- `interface PurchasesMonthlyStat` (L129): sin documentación — miembros: `month`, `label`, `amount`
- `interface PurchasesYearlyStats` (L137): `GET /purchases/yearly-stats` — backs "Compras por mes" (anual). — miembros: `year`, `months`
- `interface ListPurchasesFilters` (L145): Filters for "Administrar Facturas de Compras" — matches `GET /purchases`'s own query params exactly. — miembros: `supplierId`, `startDate`, `endDate`, `search`, `status`, `page`, `limit`
- `type PurchasePaymentType` (L13) = `'CONTADO' \| 'CREDITO'`
- `type PurchasePaymentStatus` (L14) = `'PENDING' \| 'PAID'`
- `type PurchaseStatusFilter` (L142) = `'ACTIVE' \| 'VOIDED'`
#### Función `calculatePurchaseItemTotal` (L162–164)

- **Tipo:** función exportada
- **Firma:** `calculatePurchaseItemTotal(item: PurchaseDraftItem): number` — [purchase.model.ts](../../../../comercial-jhoel-app/src/app/core/models/purchase.model.ts#L162)
- **Propósito / descripción:** Single source of truth for invoice math — the table row, the summary, and the save confirmation dialog all call these instead of computing inline. Uses cost price, never public price — a purchase's cost is what was paid to the supplier, not what it will later sell for.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculatePurchaseSubtotal` (L166–168)

- **Tipo:** función exportada
- **Firma:** `calculatePurchaseSubtotal(items: PurchaseDraftItem[]): number` — [purchase.model.ts](../../../../comercial-jhoel-app/src/app/core/models/purchase.model.ts#L166)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `items.reduce`, `calculatePurchaseItemTotal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculatePurchaseTotal` (L171–173)

- **Tipo:** función exportada
- **Firma:** `calculatePurchaseTotal(items: PurchaseDraftItem[]): number` — [purchase.model.ts](../../../../comercial-jhoel-app/src/app/core/models/purchase.model.ts#L171)
- **Propósito / descripción:** Currently identical to the subtotal — no discounts/taxes on a purchase invoice yet.
- **Dependencias:** `calculatePurchaseSubtotal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-push-notification-model-ts"></a>

### push-notification.model.ts

- **Ruta:** [push-notification.model.ts](../../../../comercial-jhoel-app/src/app/core/models/push-notification.model.ts) (`comercial-jhoel-app/src/app/core/models/push-notification.model.ts`, 45 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Estados reales que `PushNotificationService` puede distinguir — no los 6 nombrados en el pedido original tal cual, por una limitación genuina de la plataforma: la API `Notification.permission` del navegador solo expone `'default' \| 'granted' \| 'denied'`, y NUNCA distingue "el usuario lo negó una vez" de "el navegador lo bloqueó permanentemente" — ambos casos llegan como `'denied'`.
- **Descripción del autor (comentario del archivo):** Estados reales que `PushNotificationService` puede distinguir — no los 6 nombrados en el pedido original tal cual, por una limitación genuina de la plataforma: la API `Notification.permission` del navegador solo expone `'default' \| 'granted' \| 'denied'`, y NUNCA distingue "el usuario lo negó una vez" de "el navegador lo bloqueó permanentemente" — ambos casos llegan como `'denied'`. Prometer esa distinción sería mentirle al usuario sobre una capacidad que el navegador no ofrece. - `unsupported` → sin Service Worker / PushManager / Notification API. - `ios-needs-install` → iOS/iPadOS Safari en p
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface RegisterPushSubscriptionInput` (L36): sin documentación — miembros: `endpoint`, `keys`, `typeIds`, `existingManageToken`
- `type PushPermissionState` (L27) = `\| 'unsupported' \| 'ios-needs-install' \| 'sw-pending' \| 'not-requested' \| 'pending' \| 'granted' \| 'denied'` — Estados reales que `PushNotificationService` puede distinguir — no los 6 nombrados en el pedido original tal cual, por una limitación genuina de la plataforma: la API `Notification.permission` del navegador solo expone `'default' \| 'granted' \| 'denied'`, y NUNCA distingue "el usuario lo negó una vez" de "el navegador lo bloqueó permanentemente" — ambos casos llegan como `'denied'`.
<a id="f-comercial-jhoel-app-src-app-core-models-quotation-model-ts"></a>

### quotation.model.ts

- **Ruta:** [quotation.model.ts](../../../../comercial-jhoel-app/src/app/core/models/quotation.model.ts) (`comercial-jhoel-app/src/app/core/models/quotation.model.ts`, 138 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Mirrors `create_quotation()`'s own math exactly, so the live cart preview always matches what gets saved.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface QuotationItem` (L3): sin documentación — miembros: `id`, `productId`, `productName`, `presentationName`, `quantity`, `unitPrice`, `discount`, `subtotal`, `total`
- `interface Quotation` (L25): A Cotización is explicitly NOT a sale — it never affects inventory, reports, or the dashboard. — miembros: `id`, `quotationNumber`, `clientId`, `clientName`, `userId`, `username`, `quotationDate`, `expirationDate`, `subtotal`, `discount`, `total`, `observations`, `commercialTerms`, `status`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `convertedToSaleId`, `items`, `createdAt`, `updatedAt`
- `interface QuotationSummary` (L52): `GET /quotations` list rows — no line items, mirrors `TicketSummary`'s own shape. — miembros: `id`, `quotationNumber`, `clientId`, `clientName`, `userId`, `username`, `expirationDate`, `total`, `status`, `createdAt`
- `interface CreateQuotationItemInput` (L65): sin documentación — miembros: `productId`, `quantity`, `discount`
- `interface CreateQuotationInput` (L71): sin documentación — miembros: `clientId`, `expirationDate`, `observations`, `commercialTerms`, `items`
- `interface ListQuotationsQuery` (L79): sin documentación — miembros: `status`, `startDate`, `endDate`, `search`, `page`, `limit`
- `interface QuotationDraftItem` (L95): A cart line while a quotation is still being built on-screen — never sent to the backend as-is, only `{productId, quantity, discount}` is. — miembros: `productId`, `name`, `sku`, `unitPrice`, `quantity`, `discount`
- `type QuotationStatus` (L1) = `'PENDIENTE' \| 'ACEPTADA' \| 'ANULADA' \| 'VENCIDA'`

**Constantes exportadas:**

- `QUOTATION_STATUS_TONE` (L125) = `{ PENDIENTE: 'gold', ACEPTADA: 'success', VENCIDA: 'danger', ANULADA: 'neutral-dark', }`
- `QUOTATION_STATUS_LABEL` (L132) = `{ PENDIENTE: 'Pendiente', ACEPTADA: 'Aceptada', VENCIDA: 'Vencida', ANULADA: 'Anulada', }`
#### Función `calculateQuotationDraftItemSubtotal` (L105–107)

- **Tipo:** función exportada
- **Firma:** `calculateQuotationDraftItemSubtotal(item: QuotationDraftItem): number` — [quotation.model.ts](../../../../comercial-jhoel-app/src/app/core/models/quotation.model.ts#L105)
- **Propósito / descripción:** Mirrors `create_quotation()`'s own math exactly, so the live cart preview always matches what gets saved.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculateQuotationDraftItemTotal` (L109–111)

- **Tipo:** función exportada
- **Firma:** `calculateQuotationDraftItemTotal(item: QuotationDraftItem): number` — [quotation.model.ts](../../../../comercial-jhoel-app/src/app/core/models/quotation.model.ts#L109)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `calculateQuotationDraftItemSubtotal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculateQuotationDraftSubtotal` (L113–115)

- **Tipo:** función exportada
- **Firma:** `calculateQuotationDraftSubtotal(items: QuotationDraftItem[]): number` — [quotation.model.ts](../../../../comercial-jhoel-app/src/app/core/models/quotation.model.ts#L113)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `items.reduce`, `calculateQuotationDraftItemSubtotal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculateQuotationDraftDiscount` (L117–119)

- **Tipo:** función exportada
- **Firma:** `calculateQuotationDraftDiscount(items: QuotationDraftItem[]): number` — [quotation.model.ts](../../../../comercial-jhoel-app/src/app/core/models/quotation.model.ts#L117)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `items.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculateQuotationDraftTotal` (L121–123)

- **Tipo:** función exportada
- **Firma:** `calculateQuotationDraftTotal(items: QuotationDraftItem[]): number` — [quotation.model.ts](../../../../comercial-jhoel-app/src/app/core/models/quotation.model.ts#L121)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `calculateQuotationDraftSubtotal`, `calculateQuotationDraftDiscount`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-recharge-day-model-ts"></a>

### recharge-day.model.ts

- **Ruta:** [recharge-day.model.ts](../../../../comercial-jhoel-app/src/app/core/models/recharge-day.model.ts) (`comercial-jhoel-app/src/app/core/models/recharge-day.model.ts`, 115 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** "Apertura del Día"/"Cerrar Día" for Recargas Electrónicas — fully independent from Bancos/Cuadre Agentes' own `DayWorkStatus`/`DayStatus` (see `cuadre-agentes.model.ts`): separate table, separate lifecycle on the backend, so a separate type here too, never a shared one.
- **Descripción del autor (comentario del archivo):** "Apertura del Día"/"Cerrar Día" for Recargas Electrónicas — fully independent from Bancos/Cuadre Agentes' own `DayWorkStatus`/`DayStatus` (see `cuadre-agentes.model.ts`): separate table, separate lifecycle on the backend, so a separate type here too, never a shared one. Simpler than Bancos' 7-state union — there is no nested "balances saved"/ "reconciliation completed" concept here, only "has at least one cuadre been saved today" (`hasSavedCuadreToday`), since "Cerrar Día" is a standalone action that never saves a cuadre itself.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface RechargeDayStatus` (L13): sin documentación — miembros: `date`, `status`, `isOpened`, `isClosed`, `isCancelled`, `hasSavedCuadreToday`, `canCloseDay`
- `interface RechargeClosedDaysFilters` (L28): sin documentación — miembros: `dateFrom`, `dateTo`, `status`, `userId`, `resultSign`
- `interface RechargeClosedDayRow` (L43): A row of "Sistema → Gestión de Días de Recargas" — totals come from that date's LATEST saved cuadre (there can be several per date, since Recargas' own cuadre-cycles feature allows more than one cuadre to be saved on the same calendar date); `cycleCount` is how many were saved in total, a Recargas-specific signal Bancos' equivalent row has no need for. — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `totalSales`, `totalCollected`, `result`, `cycleCount`
- `interface RechargeDayAuditLogEntry` (L64): sin documentación — miembros: `id`, `action`, `performedByUsername`, `performedAt`, `reason`, `previousStatus`, `newStatus`
- `interface RechargeDayClosureSummary` (L75): One saved cuadre cycle for the date — the detail view shows EVERY cycle, not just the latest, unlike Bancos' single reconciliation block. — miembros: `id`, `sequence`, `totalSales`, `totalCollected`, `result`, `createdByUsername`, `createdAt`
- `interface RechargeDayDetail` (L85): sin documentación — miembros: `date`, `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenedByUsername`, `reopenReason`, `isCancelled`, `cancelledAt`, `cancelledByUsername`, `cancelReason`, `closures`, `auditLog`
- `type RechargeDayWorkStatus` (L11) = `'NOT_OPENED' \| 'OPENED' \| 'REOPENED' \| 'CLOSED' \| 'CANCELLED'` — "Apertura del Día"/"Cerrar Día" for Recargas Electrónicas — fully independent from Bancos/Cuadre Agentes' own `DayWorkStatus`/`DayStatus` (see `cuadre-agentes.model.ts`): separate table, separate lifecycle on the backend, so a separate type here too, never a shared one.
- `type RechargeClosedDayStatus` (L25) = `Extract<RechargeDayWorkStatus, 'CLOSED' \| 'REOPENED' \| 'CANCELLED'>` — Only the three terminal/managed states — a day still in progress isn't "Gestión de Días de Recargas"' concern, mirrors `ClosedDayStatus`.
- `type RechargeResultSign` (L26) = `'positive' \| 'negative' \| 'zero'`
- `type RechargeDayAuditAction` (L62) = `'OPENED' \| 'CLOSED' \| 'REOPENED' \| 'CANCELLED'`

**Constantes exportadas:**

- `RECHARGE_CLOSED_DAY_STATUS_LABEL` (L103) = `{ CLOSED: 'Cerrado', REOPENED: 'Reabierto', CANCELLED: 'Anulado', }`
- `RECHARGE_DAY_AUDIT_ACTION_LABEL` (L109) = `{ OPENED: 'Apertura del día', CLOSED: 'Cierre del día', REOPENED: 'Reapertura', CANCELLED: 'Anulación', }`
<a id="f-comercial-jhoel-app-src-app-core-models-recharge-sim-model-ts"></a>

### recharge-sim.model.ts

- **Ruta:** [recharge-sim.model.ts](../../../../comercial-jhoel-app/src/app/core/models/recharge-sim.model.ts) (`comercial-jhoel-app/src/app/core/models/recharge-sim.model.ts`, 131 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** SIM Claro / SIM Tigo — physical, stock-tracked products administered exclusively from Recargas Electrónicas.
- **Descripción del autor (comentario del archivo):** SIM Claro / SIM Tigo — physical, stock-tracked products administered exclusively from Recargas Electrónicas. Fully separate from `RechargeType` (electronic balance) — never mix the two.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface SimType` (L2): SIM Claro / SIM Tigo — physical, stock-tracked products administered exclusively from Recargas Electrónicas. — miembros: `id`, `name`, `costPrice`, `publicPrice`, `isActive`
- `interface SimDailyStock` (L17): One SIM type's stock row for a given day. — miembros: `id`, `simTypeId`, `simTypeName`, `date`, `previousStock`, `purchasedQuantity`, `purchasedTotal`, `soldQuantity`, `soldTotal`, `currentStock`, `createdByUsername`, `updatedByUsername`
- `interface RegisterSimPurchaseInput` (L32): sin documentación — miembros: `simTypeId`, `quantity`, `operationDate`
- `interface RegisterSimSaleInput` (L39): sin documentación — miembros: `simTypeId`, `quantity`, `operationDate`
- `interface RegisterSimSaleRegistrationInput` (L52): "Venta de SIM con registro de identidad" — deliberately separate from the by-quantity `RegisterSimSaleInput` above (still fully in use, no DPI capture): always exactly one physical SIM, with an optional client link and an optional DPI photo. — miembros: `simTypeId`, `simNumber`, `sku`, `clientDpi`, `clientId`, `salePrice`, `operationDate`, `dpiImage`
- `interface ListSimSaleRegistrationsFilters` (L63): sin documentación — miembros: `startDate`, `endDate`, `simTypeId`, `isVoided`, `page`, `limit`
- `interface SimSaleRegistration` (L73): One physical SIM sold with identity capture — void-only, same "anular con motivo, nunca editar/borrar" rule as Compras/Ventas/Depósitos. — miembros: `id`, `rechargeSimSaleId`, `simTypeId`, `simTypeName`, `simNumber`, `sku`, `clientDpi`, `clientId`, `clientName`, `salePrice`, `saleDate`, `hasDpiImage`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `createdBy`, `createdByUsername`, `createdAt`
- `interface PaginatedSimSaleRegistrations` (L96): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface SimSale` (L114): One by-quantity "Vender SIM" sale — the original quick-sale flow (no DPI capture), listed here only for "Administrar Ventas de SIM (por cantidad)". — miembros: `id`, `simTypeId`, `simTypeName`, `quantity`, `unitPrice`, `totalAmount`, `saleDate`, `hasActiveRegistration`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`, `canRevert`, `createdByUsername`
<a id="f-comercial-jhoel-app-src-app-core-models-recharge-model-ts"></a>

### recharge.model.ts

- **Ruta:** [recharge.model.ts](../../../../comercial-jhoel-app/src/app/core/models/recharge.model.ts) (`comercial-jhoel-app/src/app/core/models/recharge.model.ts`, 216 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** `currentBalance / balanceLimit * 100` — nunca `Math.min(pct, 100)`, el saldo puede superar el límite configurado (p.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface RechargeType` (L1): sin documentación — miembros: `id`, `name`, `isActive`, `minBalance`, `balanceLimit`
- `interface RechargeDailyBalance` (L17): One recharge type's row for a given day. — miembros: `id`, `rechargeTypeId`, `rechargeTypeName`, `date`, `previousBalance`, `totalPurchases`, `totalPurchaseAmount`, `dailyBalance`, `finalBalance`, `sale`, `createdByUsername`, `updatedByUsername`
- `interface RegisterRechargePurchaseInput` (L35): sin documentación — miembros: `rechargeTypeId`, `purchaseAmount`, `creditedAmount`, `operationDate`
- `interface RegisterRechargeFinalBalanceInput` (L45): sin documentación — miembros: `finalBalance`
- `interface RechargeSalesSummary` (L54): Always live-computed by the backend from today's real `RechargeDailyBalance` rows, never from client input — `totalCollected`/`difference` are `null` until a cuadre has been saved for today (`savedClosure`). — miembros: `date`, `totalClaro`, `totalTigo`, `totalSales`, `totalSimSales`, `totalRecaudado`, `totalCollected`, `difference`, `savedClosure`
- `interface RegisterRechargeSalesClosureInput` (L69): sin documentación — miembros: `totalCollected`, `operationDate`
- `interface RechargeSale` (L81): One individually-sold recharge (a customer's top-up) — the "ventas diarias" record. — miembros: `id`, `rechargeTypeId`, `rechargeTypeName`, `phoneNumber`, `amount`, `date`, `locked`, `createdByUsername`, `updatedByUsername`
- `interface RegisterRechargeSaleInput` (L93): sin documentación — miembros: `rechargeTypeId`, `phoneNumber`, `amount`, `operationDate`
- `interface UpdateRechargeSaleInput` (L101): sin documentación — miembros: `phoneNumber`, `amount`
- `interface RechargePurchase` (L113): One individually-registered recharge purchase — the "Compras de Recargas" audit trail. — miembros: `id`, `rechargeTypeId`, `rechargeTypeName`, `amount`, `creditedAmount`, `date`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`, `canRevert`, `createdByUsername`
- `interface RechargesDailyStat` (L131): sin documentación — miembros: `date`, `amount`
- `interface RechargesDailyStats` (L138): `GET /recharges/daily-stats` — backs "Recargas del mes" en Gráficas → Indicadores de Recargas. — miembros: `month`, `days`
- `interface RechargesWeeklyStat` (L144): sin documentación — miembros: `weekNumber`, `label`, `startDate`, `endDate`, `amount`
- `interface RechargesWeeklyStats` (L156): `GET /recharges/weekly-stats` — backs "Recargas por semana". — miembros: `month`, `weeks`
- `interface RechargesMonthlyStat` (L162): sin documentación — miembros: `month`, `label`, `amount`
- `interface RechargesYearlyStats` (L170): `GET /recharges/yearly-stats` — backs "Recargas por mes" (anual). — miembros: `year`, `months`
- `interface RechargeOperatorStat` (L175): sin documentación — miembros: `rechargeTypeId`, `rechargeTypeName`, `salesThisMonth`, `purchasesThisMonth`, `currentBalance`, `balanceLimit`
- `interface RechargeOperatorsSummaryResponse` (L188): `GET /recharges/operators-summary` — backs las 4 gráficas de anillo de "Indicadores de Recargas Electrónicas" en Resumen. — miembros: `month`, `operators`
- `type SalesClosureStatus` (L204) = `'zero' \| 'positive' \| 'negative'`
#### Función `calculateBalancePercentage` (L200–202)

- **Tipo:** función exportada
- **Firma:** `calculateBalancePercentage(currentBalance: number, balanceLimit: number): number` — [recharge.model.ts](../../../../comercial-jhoel-app/src/app/core/models/recharge.model.ts#L200)
- **Propósito / descripción:** `currentBalance / balanceLimit * 100` — nunca `Math.min(pct, 100)`, el saldo puede superar el límite configurado (p. ej. tras una compra grande) y el gauge debe mostrarlo tal cual. `limit &lt;= 0` (sin configurar) devuelve `0` en vez de `NaN`/`Infinity`.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `getSalesClosureStatus` (L207–215)

- **Tipo:** función exportada
- **Firma:** `getSalesClosureStatus(difference: number): SalesClosureStatus` — [recharge.model.ts](../../../../comercial-jhoel-app/src/app/core/models/recharge.model.ts#L207)
- **Propósito / descripción:** Zero = correct cuadre, positive = still owed/uncollected (pending difference), negative = over-collected.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-report-model-ts"></a>

### report.model.ts

- **Ruta:** [report.model.ts](../../../../comercial-jhoel-app/src/app/core/models/report.model.ts) (`comercial-jhoel-app/src/app/core/models/report.model.ts`, 266 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `PaginatedReport`, `SalesReportFilters`, `PurchasesReportFilters`, `SalesReportRow`, `SalesReportSummary` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface PaginatedReport` (L1): sin documentación — miembros: `items`, `total`, `page`, `limit`
- `interface SalesReportFilters` (L17): No `customerId`/client filter — this system has no customers/clients module yet (verified against the backend's real domain model before building this). — miembros: `startDate`, `endDate`, `categoryId`, `businessId`, `productId`, `userId`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface PurchasesReportFilters` (L30): sin documentación — miembros: `startDate`, `endDate`, `supplierId`, `categoryId`, `businessId`, `productId`, `userId`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface SalesReportRow` (L44): sin documentación — miembros: `id`, `saleNumber`, `saleDate`, `userId`, `username`, `itemCount`, `total`
- `interface SalesReportSummary` (L54): sin documentación — miembros: `totalAmount`, `salesCount`, `unitsSold`, `averageTicket`
- `interface SalesByProductRow` (L61): sin documentación — miembros: `productId`, `productName`, `sku`, `quantitySold`, `totalRevenue`
- `interface SaleReportDetailItem` (L69): sin documentación — miembros: `productId`, `productName`, `sku`, `quantity`, `unitPrice`, `total`
- `interface SaleReportDetail` (L78): sin documentación — miembros: `id`, `saleNumber`, `saleDate`, `userId`, `username`, `total`, `items`
- `interface PurchasesReportRow` (L88): sin documentación — miembros: `id`, `purchaseNumber`, `purchaseDate`, `supplierId`, `supplierName`, `userId`, `username`, `itemCount`, `total`
- `interface PurchasesReportSummary` (L100): sin documentación — miembros: `totalAmount`, `purchasesCount`, `unitsPurchased`, `averagePurchase`
- `interface PurchasesByProductRow` (L107): sin documentación — miembros: `productId`, `productName`, `sku`, `quantityPurchased`, `totalCost`
- `interface PurchaseReportDetailItem` (L115): sin documentación — miembros: `productId`, `productName`, `sku`, `quantity`, `costPrice`, `publicPrice`, `total`
- `interface PurchaseReportDetail` (L125): sin documentación — miembros: `id`, `purchaseNumber`, `purchaseDate`, `supplierId`, `supplierName`, `userId`, `username`, `total`, `items`
- `interface RechargesReportFilters` (L143): No `sortBy`/`sortDirection` — unlike Sales/Purchases, the recharges report has no line-item join to reorder; `GET /reports/recharges` reuses the recharges module's own `GetRechargeHistoryUseCase`, which always orders by date desc then type name asc (see the API's CLAUDE.md). — miembros: `startDate`, `endDate`, `rechargeTypeId`, `page`, `limit`
- `interface RechargesReportSummary` (L151): sin documentación — miembros: `recordCount`, `closedCount`, `totalPurchases`, `totalSales`, `averageSale`
- `interface AgentReconciliationsReportFilters` (L160): No `rechargeTypeId`-style filter — `agent_reconciliations` has no product/category/business dimension, same reasoning as the Recargas report's own minimal filter set. — miembros: `startDate`, `endDate`, `page`, `limit`
- `interface AgentReconciliationsReportRow` (L167): sin documentación — miembros: `id`, `date`, `totalCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `createdAt`, `createdByUsername`
- `interface AgentReconciliationsReportSummary` (L179): sin documentación — miembros: `recordCount`, `totalCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `totalResult`, `averageResult`
- `interface AssetsReceivablesReportFilters` (L199): sin documentación — miembros: `types`, `clientId`, `startDate`, `endDate`, `status`, `search`, `page`, `limit`
- `interface AssetsReceivablesReportRow` (L210): sin documentación — miembros: `id`, `type`, `clientId`, `clientName`, `date`, `amount`, `description`, `isActive`
- `interface AssetsReceivablesReportSummary` (L221): sin documentación — miembros: `totalAssets`, `totalAccountsReceivable`, `totalGeneral`, `recordCount`
- `interface IceCreamReportFilters` (L236): sin documentación — miembros: `types`, `startDate`, `endDate`, `iceCreamId`, `userId`, `page`, `limit`
- `interface IceCreamReportRow` (L247): One row per line item across every venta/compra in range — not one row per sale/purchase. — miembros: `id`, `type`, `date`, `product`, `sku`, `quantity`, `unitPrice`, `total`, `userId`, `username`
- `interface IceCreamReportSummary` (L260): sin documentación — miembros: `totalSales`, `totalPurchases`, `difference`, `recordCount`
- `type ReportSortField` (L8) = `'date' \| 'total'`
- `type ReportSortDirection` (L9) = `'asc' \| 'desc'`
- `type ReportStatusFilter` (L189) = `'all' \| 'active' \| 'inactive'`
- `type AssetsReceivablesReportType` (L197) = `'assets' \| 'accounts_receivable'` — Unified Reportería de Activos y Cuentas por Cobrar — replaces the former separate `AccountsReceivableReportFilters`/`AssetsReportFilters` (and their own summary types), consolidated per the checkbox-driven `types` selection the backend's `AssetsReceivablesReportController` now expects.
- `type IceCreamReportType` (L234) = `'sales' \| 'purchases'` — Unified Reportería de Heladería — replaces the former separate `IceCreamSalesReportFilters`/`IceCreamPurchasesReportFilters` (and their own row/summary types), consolidated per the checkbox-driven `types` selection the backend's `IceCreamReportController` now expects.
<a id="f-comercial-jhoel-app-src-app-core-models-role-model-ts"></a>

### role.model.ts

- **Ruta:** [role.model.ts](../../../../comercial-jhoel-app/src/app/core/models/role.model.ts) (`comercial-jhoel-app/src/app/core/models/role.model.ts`, 24 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `Role`, `CreateRoleInput`, `UpdateRoleInput`, `SYSTEM_ROLE_NAMES` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Role` (L1): sin documentación — miembros: `id`, `name`, `description`, `isActive`, `usersCount`, `createdAt`, `updatedAt`
- `interface CreateRoleInput` (L14): sin documentación — miembros: `name`, `description`
- `interface UpdateRoleInput` (L19): sin documentación — miembros: `name`, `description`, `isActive`

**Constantes exportadas:**

- `SYSTEM_ROLE_NAMES` (L12): The three seeded roles — the backend rejects renaming any of these, so the UI locks the name field for them too. = `['SUPER_ADMIN', 'ADMIN', 'USER']`
<a id="f-comercial-jhoel-app-src-app-core-models-sale-model-ts"></a>

### sale.model.ts

- **Ruta:** [sale.model.ts](../../../../comercial-jhoel-app/src/app/core/models/sale.model.ts) (`comercial-jhoel-app/src/app/core/models/sale.model.ts`, 121 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `SaleItem`, `Sale`, `CreateSaleItemInput`, `CreateSaleInput`, `SalesDailyStat` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface SaleItem` (L1): sin documentación — miembros: `id`, `productId`, `productName`, `sku`, `quantity`, `unitPrice`, `total`, `presentationName`
- `interface Sale` (L21): `status` distinguishes an in-progress receipt from a completed one — the Ventas screen only ever deals with `OPEN` sales (its own current draft, fetched/mutated via `GET/POST /sales/current`, `/sales/items`); a `CONFIRMED` sale is a real, completed transaction and never mutates again. — miembros: `id`, `userId`, `username`, `saleDate`, `total`, `status`, `clientId`, `clientName`, `priceList`, `draftKey`, `items`, `createdAt`, `updatedAt`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface CreateSaleItemInput` (L52): Payload for the bulk, one-shot `POST /sales` (unchanged, pre-existing endpoint) — builds and confirms a complete sale in a single call. — miembros: `productId`, `quantity`
- `interface CreateSaleInput` (L57): sin documentación — miembros: `items`, `clientId`, `priceList`, `invoiceNumber`
- `interface SalesDailyStat` (L64): sin documentación — miembros: `date`, `amount`
- `interface SalesDailyStats` (L71): `GET /sales/daily-stats` — backs "Ventas del mes" en Gráficas → Indicadores de Ventas. — miembros: `month`, `days`
- `interface SalesWeeklyStat` (L77): sin documentación — miembros: `weekNumber`, `label`, `startDate`, `endDate`, `amount`
- `interface SalesWeeklyStats` (L89): `GET /sales/weekly-stats` — backs "Ventas por semana". — miembros: `month`, `weeks`
- `interface SalesMonthlyStat` (L95): sin documentación — miembros: `month`, `label`, `amount`
- `interface SalesYearlyStats` (L103): `GET /sales/yearly-stats` — backs "Ventas por mes" (anual). — miembros: `year`, `months`
- `interface ListSalesFilters` (L111): Filters for "Administrar Facturas de Ventas" — matches `GET /sales`'s own query params exactly. — miembros: `clientId`, `startDate`, `endDate`, `search`, `status`, `page`, `limit`
- `type PriceListType` (L13) = `'PUBLIC' \| 'WHOLESALE'` — 'PUBLIC' (default) or 'WHOLESALE' — chosen once at the start of a sale, locked once the receipt has any line item.
- `type SaleStatusFilter` (L108) = `'ACTIVE' \| 'VOIDED'`
<a id="f-comercial-jhoel-app-src-app-core-models-sales-cash-box-model-ts"></a>

### sales-cash-box.model.ts

- **Ruta:** [sales-cash-box.model.ts](../../../../comercial-jhoel-app/src/app/core/models/sales-cash-box.model.ts) (`comercial-jhoel-app/src/app/core/models/sales-cash-box.model.ts`, 30 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** One negocio's accumulated (all-time, never reset) balance — mirrors `SalesCashBoxBalanceOutput`.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface SalesCashBoxBalance` (L4): One negocio's accumulated (all-time, never reset) balance — mirrors `SalesCashBoxBalanceOutput`. — miembros: `businessId`, `businessName`, `balance`
- `interface SalesCashBoxMovement` (L11): Mirrors `SalesCashBoxMovementOutput` — one "Aporte"/"Retiro" for one negocio. — miembros: `id`, `businessId`, `amount`, `movementType`, `concept`, `createdByUsername`, `createdAt`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
- `interface RegisterSalesCashBoxMovementInput` (L25): sin documentación — miembros: `businessId`, `amount`, `concept`
- `type SalesCashBoxMovementType` (L1) = `'CONTRIBUTION' \| 'WITHDRAWAL'`
<a id="f-comercial-jhoel-app-src-app-core-models-sales-register-model-ts"></a>

### sales-register.model.ts

- **Ruta:** [sales-register.model.ts](../../../../comercial-jhoel-app/src/app/core/models/sales-register.model.ts) (`comercial-jhoel-app/src/app/core/models/sales-register.model.ts`, 33 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Mirrors `SalesRegisterProductOutput` — one product's totals within one negocio, for one business day.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface SalesRegisterProduct` (L2): Mirrors `SalesRegisterProductOutput` — one product's totals within one negocio, for one business day. — miembros: `productId`, `productName`, `sku`, `quantitySold`, `totalRevenue`
- `interface SalesRegisterBusiness` (L11): Mirrors `SalesRegisterBusinessOutput` — one negocio's totals for one business day, plus its own product breakdown. — miembros: `businessId`, `businessName`, `totalAmount`, `salesCount`, `productsCount`, `topProduct`, `products`
- `interface SalesRegisterSummary` (L23): `GET /sales-register/summary`'s response shape — "Gestión de Caja de Ventas". — miembros: `date`, `totalAmount`, `salesCount`, `productsCount`, `businessesActive`, `businesses`
<a id="f-comercial-jhoel-app-src-app-core-models-service-item-model-ts"></a>

### service-item.model.ts

- **Ruta:** [service-item.model.ts](../../../../comercial-jhoel-app/src/app/core/models/service-item.model.ts) (`comercial-jhoel-app/src/app/core/models/service-item.model.ts`, 13 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `ServiceItem` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface ServiceItem` (L1): sin documentación — miembros: `id`, `icon`, `title`, `description`, `tag`, `fragment`, `ctaLabel`
<a id="f-comercial-jhoel-app-src-app-core-models-stat-item-model-ts"></a>

### stat-item.model.ts

- **Ruta:** [stat-item.model.ts](../../../../comercial-jhoel-app/src/app/core/models/stat-item.model.ts) (`comercial-jhoel-app/src/app/core/models/stat-item.model.ts`, 7 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `StatItem` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface StatItem` (L1): sin documentación — miembros: `id`, `value`, `label`, `icon`
<a id="f-comercial-jhoel-app-src-app-core-models-supplier-model-ts"></a>

### supplier.model.ts

- **Ruta:** [supplier.model.ts](../../../../comercial-jhoel-app/src/app/core/models/supplier.model.ts) (`comercial-jhoel-app/src/app/core/models/supplier.model.ts`, 21 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `Supplier`, `SupplierInput` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Supplier` (L1): sin documentación — miembros: `id`, `name`, `phone`, `email`, `address`, `taxId`, `isActive`, `createdAt`, `updatedAt`
- `interface SupplierInput` (L14): Payload for create/update — the backend assigns id/isActive/timestamps. — miembros: `name`, `phone`, `email`, `address`, `taxId`
<a id="f-comercial-jhoel-app-src-app-core-models-theme-model-ts"></a>

### theme.model.ts

- **Ruta:** [theme.model.ts](../../../../comercial-jhoel-app/src/app/core/models/theme.model.ts) (`comercial-jhoel-app/src/app/core/models/theme.model.ts`, 7 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** "Modo Claro / Modo Oscuro" — preferencia individual del usuario, persistida en `users.theme` (backend).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface ThemePreferencesResponse` (L4): sin documentación — miembros: `theme`
- `type ThemePreference` (L2) = `'LIGHT' \| 'DARK'` — "Modo Claro / Modo Oscuro" — preferencia individual del usuario, persistida en `users.theme` (backend).
<a id="f-comercial-jhoel-app-src-app-core-models-ticket-model-ts"></a>

### ticket.model.ts

- **Ruta:** [ticket.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ticket.model.ts) (`comercial-jhoel-app/src/app/core/models/ticket.model.ts`, 90 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `calculateTicketDraftItemTotal`, `calculateTicketDraftTotal`, `TicketItem`, `Ticket`, `TicketSummary` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface TicketItem` (L1): sin documentación — miembros: `id`, `productId`, `productName`, `presentationName`, `quantity`, `unitPrice`, `total`, `observation`
- `interface Ticket` (L13): A Ticket is explicitly NOT a real sale — it never affects inventory, reports, or the dashboard. — miembros: `id`, `ticketNumber`, `clientId`, `clientName`, `userId`, `username`, `subtotal`, `discount`, `total`, `isVoided`, `voidedAt`, `voidedBy`, `voidedByUsername`, `voidReason`, `items`, `createdAt`, `updatedAt`
- `interface TicketSummary` (L34): `GET /tickets` list rows — no line items, mirrors `SaleSummary`'s own shape. — miembros: `id`, `ticketNumber`, `clientId`, `clientName`, `userId`, `username`, `total`, `isVoided`, `createdAt`
- `interface CreateTicketItemInput` (L46): sin documentación — miembros: `productId`, `quantity`, `observation`, `unitPrice`
- `interface CreateTicketInput` (L54): sin documentación — miembros: `clientId`, `clientName`, `items`
- `interface ListTicketsQuery` (L63): sin documentación — miembros: `startDate`, `endDate`, `search`, `status`, `page`, `limit`
- `interface TicketDraftItem` (L74): A cart line while a ticket is still being built on-screen — never sent to the backend as-is, only `{productId, quantity}` is. — miembros: `productId`, `name`, `sku`, `unitPrice`, `quantity`, `observation`
- `type TicketStatusFilter` (L61) = `'ACTIVE' \| 'VOIDED'`
#### Función `calculateTicketDraftItemTotal` (L83–85)

- **Tipo:** función exportada
- **Firma:** `calculateTicketDraftItemTotal(item: TicketDraftItem): number` — [ticket.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ticket.model.ts#L83)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `calculateTicketDraftTotal` (L87–89)

- **Tipo:** función exportada
- **Firma:** `calculateTicketDraftTotal(items: TicketDraftItem[]): number` — [ticket.model.ts](../../../../comercial-jhoel-app/src/app/core/models/ticket.model.ts#L87)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `items.reduce`, `calculateTicketDraftItemTotal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-toast-model-ts"></a>

### toast.model.ts

- **Ruta:** [toast.model.ts](../../../../comercial-jhoel-app/src/app/core/models/toast.model.ts) (`comercial-jhoel-app/src/app/core/models/toast.model.ts`, 8 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `Toast`, `ToastType` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface Toast` (L3): sin documentación — miembros: `id`, `type`, `message`
- `type ToastType` (L1) = `'success' \| 'error' \| 'warning' \| 'info'`
<a id="f-comercial-jhoel-app-src-app-core-models-transaction-bank-model-ts"></a>

### transaction-bank.model.ts

- **Ruta:** [transaction-bank.model.ts](../../../../comercial-jhoel-app/src/app/core/models/transaction-bank.model.ts) (`comercial-jhoel-app/src/app/core/models/transaction-bank.model.ts`, 23 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** "Banco Agente" — the catalog Transaccionar's bank dropdown reads from.
- **Descripción del autor (comentario del archivo):** "Banco Agente" — the catalog Transaccionar's bank dropdown reads from. Deliberately separate from `Bank` (Agentes Bancarios/Bancos, coupled to Cuadre de Agentes).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface TransactionBank` (L2): "Banco Agente" — the catalog Transaccionar's bank dropdown reads from. — miembros: `id`, `name`, `isActive`, `hasImage`, `cashBoxCode`, `commissionPerTransaction`, `createdAt`, `updatedAt`
- `interface TransactionBankInput` (L17): Payload for create/update — the backend assigns id/isActive/timestamps. — miembros: `name`, `isGuayacan`, `commissionPerTransaction`
<a id="f-comercial-jhoel-app-src-app-core-models-transaction-type-model-spec-ts"></a>

### transaction-type.model.spec.ts

- **Ruta:** [transaction-type.model.spec.ts](../../../../comercial-jhoel-app/src/app/core/models/transaction-type.model.spec.ts) (`comercial-jhoel-app/src/app/core/models/transaction-type.model.spec.ts`, 23 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [transaction-type.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-transaction-type-model-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-core-models-transaction-type-model-ts"></a>

### transaction-type.model.ts

- **Ruta:** [transaction-type.model.ts](../../../../comercial-jhoel-app/src/app/core/models/transaction-type.model.ts) (`comercial-jhoel-app/src/app/core/models/transaction-type.model.ts`, 117 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Curated subset of the shared icon registry — mirrors the backend's own `TRANSACTION_TYPE_ICONS` whitelist exactly (`transaction-types` module, `domain/entities/transaction-type.entity.ts`).
- **Descripción del autor (comentario del archivo):** Curated subset of the shared icon registry — mirrors the backend's own `TRANSACTION_TYPE_ICONS` whitelist exactly (`transaction-types` module, `domain/entities/transaction-type.entity.ts`). Kept in sync by hand: this is the one icon picker in the app, not worth a shared package for.
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [transaction-type.model.spec.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-transaction-type-model-spec-ts)

**Interfaces, tipos y enums:**

- `interface TransactionType` (L27): "Tipo de Transacción" — Depósito, Retiro, Desembolso Préstamo, Pago Cheque, etc. — miembros: `id`, `name`, `icon`, `balanceEffect`, `cashEffect`, `isActive`, `createdAt`, `updatedAt`
- `interface TransactionTypeInput` (L41): Payload for create/update — the backend assigns id/isActive/timestamps. — miembros: `name`, `icon`, `balanceEffect`, `cashEffect`
- `type TransactionTypeIcon` (L24) = `(typeof TRANSACTION_TYPE_ICONS)[number]`
- `type TransactionTypeCashEffect` (L49) = `'IN' \| 'OUT' \| 'NONE'` — Espejo de `TRANSACTION_TYPE_CASH_EFFECTS` del backend: entrada, salida o sin efecto sobre el efectivo físico.
- `type TransactionTypeBalanceEffect` (L65) = `'DEPOSITO' \| 'RETIRO' \| 'DESEMBOLSO_GENESIS' \| 'PAGO_GENESIS' \| 'REINTEGRO'` — Espejo de `TRANSACTION_TYPE_BALANCE_EFFECTS` del backend.

**Constantes exportadas:**

- `TRANSACTION_TYPE_ICONS` (L7): Curated subset of the shared icon registry — mirrors the backend's own `TRANSACTION_TYPE_ICONS` whitelist exactly (`transaction-types` module, `domain/entities/transaction-type.entity.ts`). = `[ 'bank', 'arrow-down-circle', 'arrow-up-circle', 'arrow-left-right', 'credit-card', 'wallet', 'receipt', 'fil`
- `TRANSACTION_TYPE_CASH_EFFECT_OPTIONS` (L51) = `[ { value: 'IN', label: 'Entrada de efectivo', hint: 'El cliente entrega efectivo: suma al efectivo físico dis`
- `TRANSACTION_TYPE_BALANCE_EFFECT_OPTIONS` (L67) = `[ { value: 'DEPOSITO', label: 'Depósito', hint: 'Resta del saldo de la cuenta seleccionada (no puede exceder e`
#### Función `defaultCashEffect` (L58–62)

- **Tipo:** función exportada
- **Firma:** `defaultCashEffect(effect: TransactionTypeBalanceEffect \| null \| undefined): TransactionTypeCashEffect` — [transaction-type.model.ts](../../../../comercial-jhoel-app/src/app/core/models/transaction-type.model.ts#L58)
- **Propósito / descripción:** Sugerencia al elegir el efecto bancario — la misma derivación que usa el backend si no se indica.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `isGenesisBalanceEffect` (L92–94)

- **Tipo:** función exportada
- **Firma:** `isGenesisBalanceEffect(effect: TransactionTypeBalanceEffect \| null \| undefined): boolean` — [transaction-type.model.ts](../../../../comercial-jhoel-app/src/app/core/models/transaction-type.model.ts#L92)
- **Propósito / descripción:** Desembolsos/Pagos Génesis: sin selector de banco — la cuenta es siempre la línea de crédito de Génesis (la resuelve el backend).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `requiresBankAccount` (L97–99)

- **Tipo:** función exportada
- **Firma:** `requiresBankAccount(effect: TransactionTypeBalanceEffect \| null \| undefined): boolean` — [transaction-type.model.ts](../../../../comercial-jhoel-app/src/app/core/models/transaction-type.model.ts#L97)
- **Propósito / descripción:** Tipos que exigen elegir la cuenta bancaria afectada.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `balanceEffectDirection` (L108–116)

- **Tipo:** función exportada
- **Firma:** `balanceEffectDirection(effect: TransactionTypeBalanceEffect \| null \| undefined, agentCashBoxCode?: string \| null): 1 \| -1 \| 0` — [transaction-type.model.ts](../../../../comercial-jhoel-app/src/app/core/models/transaction-type.model.ts#L108)
- **Propósito / descripción:** `+1` suma al saldo, `-1` resta, `0` no lo mueve — solo para la vista previa; el backend recalcula siempre. Con el banco agente Cooperativa Guayacán (`agentCashBoxCode = 'GUAYACAN'`) Depósito y Retiro van al revés (el depósito suma, el retiro resta) — misma regla que `register_bank_deposit_operation` (migración `GuayacanInvertsDepositWithdrawal`).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-models-unit-of-measure-model-ts"></a>

### unit-of-measure.model.ts

- **Ruta:** [unit-of-measure.model.ts](../../../../comercial-jhoel-app/src/app/core/models/unit-of-measure.model.ts) (`comercial-jhoel-app/src/app/core/models/unit-of-measure.model.ts`, 32 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `UnitOfMeasure`, `UnitOfMeasureListItem`, `UnitOfMeasureInput`, `UnitOfMeasureFilters` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface UnitOfMeasure` (L1): sin documentación — miembros: `id`, `name`, `abbreviation`, `description`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
- `interface UnitOfMeasureListItem` (L16) extends UnitOfMeasure: List rows carry `usageCount` — how many `products` rows currently reference this unit — the plain `UnitOfMeasure` shape (create/update responses) does not. — miembros: `usageCount`
- `interface UnitOfMeasureInput` (L21): Payload for create/update — the backend assigns id/timestamps/audit fields. — miembros: `name`, `abbreviation`, `description`, `isActive`
- `interface UnitOfMeasureFilters` (L28): sin documentación — miembros: `includeInactive`, `search`
<a id="f-comercial-jhoel-app-src-app-core-models-user-model-ts"></a>

### user.model.ts

- **Ruta:** [user.model.ts](../../../../comercial-jhoel-app/src/app/core/models/user.model.ts) (`comercial-jhoel-app/src/app/core/models/user.model.ts`, 27 líneas)
- **Tipo:** Modelo / tipos · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-models`
- **Responsabilidad:** Modelo / tipos: declara `User`, `CreateUserInput`, `UpdateUserInput` (sin comentario de documentación en el código).
- **Consumidores:** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)

**Interfaces, tipos y enums:**

- `interface User` (L1): sin documentación — miembros: `id`, `username`, `phone`, `roleId`, `roleName`, `isActive`, `createdAt`, `updatedAt`
- `interface CreateUserInput` (L12): sin documentación — miembros: `username`, `phone`, `password`, `roleId`
- `interface UpdateUserInput` (L20): All fields optional — PATCH only sends what changed. — miembros: `username`, `phone`, `roleId`, `isActive`, `password`
