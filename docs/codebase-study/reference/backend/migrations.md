# Migraciones TypeORM (esquema de base de datos)

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [1756310000000-CreateUsersTable.ts](#f-comercial-jhoel-api-src-database-migrations-1756310000000-createuserstable-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateUsersTable1756310000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1756400000000-AddUsernameAndPhoneToUsers.ts](#f-comercial-jhoel-api-src-database-migrations-1756400000000-addusernameandphonetousers-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `AddUsernameAndPhoneToUsers1756400000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1756500000000-CreateRolesAndUserRoles.ts](#f-comercial-jhoel-api-src-database-migrations-1756500000000-createrolesanduserroles-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateRolesAndUserRoles1756500000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1756600000000-CreateCategoriesTable.ts](#f-comercial-jhoel-api-src-database-migrations-1756600000000-createcategoriestable-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateCategoriesTable1756600000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1756700000000-CreateProductsTable.ts](#f-comercial-jhoel-api-src-database-migrations-1756700000000-createproductstable-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateProductsTable1756700000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1756800000000-AddIsActiveToUsers.ts](#f-comercial-jhoel-api-src-database-migrations-1756800000000-addisactivetousers-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `AddIsActiveToUsers1756800000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1756900000000-AddSkuToProducts.ts](#f-comercial-jhoel-api-src-database-migrations-1756900000000-addskutoproducts-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `AddSkuToProducts1756900000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757000000000-CreateBusinessesTable.ts](#f-comercial-jhoel-api-src-database-migrations-1757000000000-createbusinessestable-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateBusinessesTable1757000000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757100000000-CreateSalesTables.ts](#f-comercial-jhoel-api-src-database-migrations-1757100000000-createsalestables-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateSalesTables1757100000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757200000000-AddDraftSalesSupport.ts](#f-comercial-jhoel-api-src-database-migrations-1757200000000-adddraftsalessupport-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `AddDraftSalesSupport1757200000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757300000000-CreateSuppliersAndPurchases.ts](#f-comercial-jhoel-api-src-database-migrations-1757300000000-createsuppliersandpurchases-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateSuppliersAndPurchases1757300000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757500000000-CreateRechargesModule.ts](#f-comercial-jhoel-api-src-database-migrations-1757500000000-createrechargesmodule-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateRechargesModule1757500000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757600000000-CreateRechargeSalesClosures.ts](#f-comercial-jhoel-api-src-database-migrations-1757600000000-createrechargesalesclosures-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateRechargeSalesClosures1757600000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757700000000-AddRechargeCuadreCycles.ts](#f-comercial-jhoel-api-src-database-migrations-1757700000000-addrechargecuadrecycles-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `AddRechargeCuadreCycles1757700000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757800000000-CreateIceCreamsModule.ts](#f-comercial-jhoel-api-src-database-migrations-1757800000000-createicecreamsmodule-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateIceCreamsModule1757800000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757800000000-CreateRechargeSales.ts](#f-comercial-jhoel-api-src-database-migrations-1757800000000-createrechargesales-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateRechargeSales1757800000000`, `PREVIOUS_CLOSURE_FUNCTION` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1757900000000-CreateBankAgentsModule.ts](#f-comercial-jhoel-api-src-database-migrations-1757900000000-createbankagentsmodule-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateBankAgentsModule1757900000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758000000000-CreateClientsTable.ts](#f-comercial-jhoel-api-src-database-migrations-1758000000000-createclientstable-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateClientsTable1758000000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758100000000-CreateAccountsReceivableAndAssets.ts](#f-comercial-jhoel-api-src-database-migrations-1758100000000-createaccountsreceivableandassets-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateAccountsReceivableAndAssets1758100000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758200000000-AllowNegativeAssetAmount.ts](#f-comercial-jhoel-api-src-database-migrations-1758200000000-allownegativeassetamount-ts) | .ts | Migración TypeORM | Base de datos (migración) | Drops the `assets.amount &gt; 0` guardrail — and only that one, on only that one table. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758300000000-CreateAgentReconciliations.ts](#f-comercial-jhoel-api-src-database-migrations-1758300000000-createagentreconciliations-ts) | .ts | Migración TypeORM | Base de datos (migración) | Cuadre Agentes, segunda etapa — "Guardar Cuadre". | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758400000000-SyncBanksFinalBalanceOnSave.ts](#f-comercial-jhoel-api-src-database-migrations-1758400000000-syncbanksfinalbalanceonsave-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Guardar Cambios" (Agentes Bancarios → Bancos) was only ever upserting `bank_balances` (the daily cuadre history) — `banks.final_balance` (the static reference value Sistema → Bancos and the Cuadre Agentes → "Resumen de Bancos" summary read) was never touched by it. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758500000000-OnlySyncBanksFinalBalanceForLatestDate.ts](#f-comercial-jhoel-api-src-database-migrations-1758500000000-onlysyncbanksfinalbalanceforlatestdate-ts) | .ts | Migración TypeORM | Base de datos (migración) | Corrige un defecto real de la migración anterior (`SyncBanksFinalBalanceOnSave`): esa versión de `save_bank_balance` actualizaba `banks.final_balance` (el valor "actual" que Sistema → Bancos y Cuadre Agentes → Resumen de Bancos leen) sin importar qué fecha se estuviera guardando. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758600000000-CreateDayOpenings.ts](#f-comercial-jhoel-api-src-database-migrations-1758600000000-createdayopenings-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Apertura del Día" — Agentes Bancarios &gt; Bancos. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758700000000-AddDayClosingToDayOpenings.ts](#f-comercial-jhoel-api-src-database-migrations-1758700000000-adddayclosingtodayopenings-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Cierre del Día" — Agentes Bancarios &gt; Cuadre Agentes. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758800000000-AddThemeToUsers.ts](#f-comercial-jhoel-api-src-database-migrations-1758800000000-addthemetousers-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Modo Claro / Modo Oscuro por usuario" — preferencia individual de tema, persistida en la propia fila de `users` (no se creó una tabla aparte: es un único valor controlado, exactamente el caso que esta app ya modela como una columna simple — ver `is_active`, `role_id`). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758900000000-AddDayReopeningAndAudit.ts](#f-comercial-jhoel-api-src-database-migrations-1758900000000-adddayreopeningandaudit-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Gestión de Días Cerrados" — reapertura controlada, recierre y anulación de un ciclo ya cerrado, más su auditoría. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1758900100000-FixLaterDayCheckIncludesReopened.ts](#f-comercial-jhoel-api-src-database-migrations-1758900100000-fixlaterdaycheckincludesreopened-ts) | .ts | Migración TypeORM | Base de datos (migración) | Corrige `reopen_agent_day`/`cancel_agent_day`: la regla de días posteriores (Opción A) comparaba solo `closed_at IS NOT NULL`, lo que dejaba pasar una fecha posterior que está actualmente `REOPENED` (`closed_at` vuelve a `NULL` mientras está reabierta) como si no existiera ningún día posterior gestionado — exactamente el hueco que esta regla existe para cerrar. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759000000000-CreateRechargeDayOpenings.ts](#f-comercial-jhoel-api-src-database-migrations-1759000000000-createrechargedayopenings-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Apertura del Día" / "Cierre del Día" / "Gestión de Días Cerrados" para Recargas Electrónicas — a fully independent day-lifecycle cycle for this module, deliberately NOT sharing Banks' own `day_openings`/ `day_audit_logs` tables. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759000100000-AddRechargeDayGateToWriteFunctions.ts](#f-comercial-jhoel-api-src-database-migrations-1759000100000-addrechargedaygatetowritefunctions-ts) | .ts | Migración TypeORM | Base de datos (migración) | Gates every Recargas write function behind `recharge_day_openings` being open for that date — see `1759000000000-CreateRechargeDayOpenings`'s own doc comment for the full day-lifecycle design. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759100000000-SetDatabaseTimezone.ts](#f-comercial-jhoel-api-src-database-migrations-1759100000000-setdatabasetimezone-ts) | .ts | Migración TypeORM | Base de datos (migración) | Sets the database's own default session timezone to `America/Guatemala` — until now, nothing anywhere in this stack (this migration, `data-source.ts`, `app.module.ts`'s `TypeOrmModule.forRootAsync`, or `docker-compose.yml`) ever configured a timezone, so both the `postgres:16-alpine` container and the `api` container ran on their bare-image default, UTC. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759200000000-SplitRechargePurchaseCreditedAmount.ts](#f-comercial-jhoel-api-src-database-migrations-1759200000000-splitrechargepurchasecreditedamount-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Registrar Compra" separa el monto en dos conceptos: `amount` (ya existente, ahora "monto de compra" — puramente informativo, NUNCA afecta el saldo) y el nuevo `credited_amount` ("monto acreditado" — el único valor que suma a `recharge_daily_balances.daily_balance`). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759300000000-CreateRechargeSims.ts](#f-comercial-jhoel-api-src-database-migrations-1759300000000-createrechargesims-ts) | .ts | Migración TypeORM | Base de datos (migración) | SIM Claro / SIM Tigo — physical, stock-tracked products administered EXCLUSIVELY from Recargas Electrónicas, never from the general `products`/Inventario/Compras/Ventas modules (confirmed by direct code read before writing this migration: `GET /products` has no default exclusion, `InventoryPageCompo | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759400000000-CreateInventoryLocationsAndPresentations.ts](#f-comercial-jhoel-api-src-database-migrations-1759400000000-createinventorylocationsandpresentations-ts) | .ts | Migración TypeORM | Base de datos (migración) | Evolves Inventario from "producto → stock global" to "producto → presentaciones → ubicaciones → stock". | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759500000000-AddWholesalePricingToSales.ts](#f-comercial-jhoel-api-src-database-migrations-1759500000000-addwholesalepricingtosales-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Venta por mayor" — lets a sale be tagged with an optional client and a price list (`PUBLIC`/`WHOLESALE`), chosen once at the start of the sale and locked once the receipt has any line item. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759600000000-CreateTransactionBanksAndBankDeposits.ts](#f-comercial-jhoel-api-src-database-migrations-1759600000000-createtransactionbanksandbankdeposits-ts) | .ts | Migración TypeORM | Base de datos (migración) | Migración TypeORM: declara `CreateTransactionBanksAndBankDeposits1759600000000` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759700000000-AddClientNameToBankDepositOperations.ts](#f-comercial-jhoel-api-src-database-migrations-1759700000000-addclientnametobankdepositoperations-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Nombre de Cliente" — a free-text field on a Transaccionar deposit, typed by whoever registers it, never looked up against `clients` (that table models accounts-receivable customers, a different concept entirely — Transaccionar's "cliente" is just a label for whose deposit this was). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759800000000-AddTransactionTypesToBankDeposits.ts](#f-comercial-jhoel-api-src-database-migrations-1759800000000-addtransactiontypestobankdeposits-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Tipo de Transacción" — Depósito, Retiro, Desembolso Préstamo, Pago Cheque, Pago Préstamos, Pago Tarjeta de Crédito, etc. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1759900000000-AddVoidToBankDepositOperations.ts](#f-comercial-jhoel-api-src-database-migrations-1759900000000-addvoidtobankdepositoperations-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Anular" a Transaccionar operation — the correction mechanism for a mistaken registration, deliberately NOT an edit and NOT a physical DELETE (same philosophy as `cancel_agent_day`/every other soft-delete in this codebase: a financial record is never rewritten or removed, only marked). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000000000-AddCreditPaymentToPurchases.ts](#f-comercial-jhoel-api-src-database-migrations-1760000000000-addcreditpaymenttopurchases-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Tipo de compra" — Contado / Crédito — the prerequisite for the new payment-due alert. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000100000-AddMinStockToInventoryStock.ts](#f-comercial-jhoel-api-src-database-migrations-1760000100000-addminstocktoinventorystock-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Stock mínimo" per (product, location) — the prerequisite for the low-inventory alert. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000200000-AddMinBalanceToRechargeTypes.ts](#f-comercial-jhoel-api-src-database-migrations-1760000200000-addminbalancetorechargetypes-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Saldo mínimo" per recharge type (Claro/Tigo, extensible) — the prerequisite for the low-recharge-balance alert. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000300000-CreateAlertSettings.ts](#f-comercial-jhoel-api-src-database-migrations-1760000300000-createalertsettings-ts) | .ts | Migración TypeORM | Base de datos (migración) | A genuine singleton table — always exactly one row, seeded here. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000400000-CreateAlertReadMarks.ts](#f-comercial-jhoel-api-src-database-migrations-1760000400000-createalertreadmarks-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Leída" state for the centralized alerts panel. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000500000-AddDraftKeyToSales.ts](#f-comercial-jhoel-api-src-database-migrations-1760000500000-adddraftkeytosales-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Varias ventas a la vez" — Ventas gets the same multiple-simultaneous-draft capability Compras already has (`PurchaseDraftStore`, purely a frontend change since a Compra draft was never server-side). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000600000-CreateFinancialKardexColumns.ts](#f-comercial-jhoel-api-src-database-migrations-1760000600000-createfinancialkardexcolumns-ts) | .ts | Migración TypeORM | Base de datos (migración) | Evolves `accounts_receivable` and `assets` from flat, independently-summed entries into a real Kardex/ledger: every row is now an explicit `CARGO` or `ABONO` movement, and a client's balance is the signed running sum of their own movements. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000700000-CreatePresentationTypesTable.ts](#f-comercial-jhoel-api-src-database-migrations-1760000700000-createpresentationtypestable-ts) | .ts | Migración TypeORM | Base de datos (migración) | Introduces the master "Tipos de Presentación" catalog (Sistema → Presentaciones y Medidas) and migrates `product_presentations.name` — a plain, per-product free-text column with no cross-product normalization — into a real FK against it. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000800000-CreateUnitsOfMeasureTable.ts](#f-comercial-jhoel-api-src-database-migrations-1760000800000-createunitsofmeasuretable-ts) | .ts | Migración TypeORM | Base de datos (migración) | Introduces the master "Unidades de Medida" catalog (Sistema → Presentaciones y Medidas) and gives every product a required `unit_of_measure_id` FK — a genuinely new concept, since no unit-of- measure column, enum, or table existed anywhere in this project before (confirmed by a full-project search before writing this migration, not assumed). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760000900000-FixPresentationTypeNameInStoredFunctions.ts](#f-comercial-jhoel-api-src-database-migrations-1760000900000-fixpresentationtypenameinstoredfunctions-ts) | .ts | Migración TypeORM | Base de datos (migración) | Hotfix: `CreatePresentationTypesTable` dropped `product_presentations.name` (replaced by `presentation_type_id`, resolved via join — see that migration's own doc comment), but three live Postgres functions still queried `product_presentations WHERE ... | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001000000-CreateDocumentsModule.ts](#f-comercial-jhoel-api-src-database-migrations-1760001000000-createdocumentsmodule-ts) | .ts | Migración TypeORM | Base de datos (migración) | Foundational schema for three independent, additive features: `company_settings` (a singleton, same shape as `alert_settings`, holding the branding/contact data every document PDF's letterhead needs), and two brand-new document types — `tickets`/`ticket_details` and `quotations`/`quotation_details` | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001100000-AddObservationToTicketDetails.ts](#f-comercial-jhoel-api-src-database-migrations-1760001100000-addobservationtoticketdetails-ts) | .ts | Migración TypeORM | Base de datos (migración) | Adds an optional free-text `observation` per ticket line item (e.g. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001200000-AddUnitPriceOverrideToCreateTicket.ts](#f-comercial-jhoel-api-src-database-migrations-1760001200000-addunitpriceoverridetocreateticket-ts) | .ts | Migración TypeORM | Base de datos (migración) | Lets a caller optionally override a ticket line's unit price at creation time (e.g. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001300000-CreateKeyboardShortcuts.ts](#f-comercial-jhoel-api-src-database-migrations-1760001300000-createkeyboardshortcuts-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Atajos de Teclado" — a new Sistema catalog, structurally a clone of `transaction_types`/`account_types` (flat CRUD, partial-unique-active name-equivalent, admin-only mutation, read open to any authenticated account — the shortcuts must be readable by every role so `KeyboardShortcutsService` can actually use them, not just admins who can manage them). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001400000-AddChangeGivenToBankDepositOperations.ts](#f-comercial-jhoel-api-src-database-migrations-1760001400000-addchangegiventobankdepositoperations-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Vuelto" (change given back to the client) for Transaccionar — lets a deposit register correctly when the client hands over more cash than the operation amount (e.g. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001500000-AddClientNameToTickets.ts](#f-comercial-jhoel-api-src-database-migrations-1760001500000-addclientnametotickets-ts) | .ts | Migración TypeORM | Base de datos (migración) | Tickets' "Cliente" field becomes free text: any name can be recorded (including one that doesn't match a real `clients` row), and — critically — it must stay frozen as historical information even if the real client's name is edited later in the Clientes catalog. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001600000-CreateRechargeCashBoxWithdrawals.ts](#f-comercial-jhoel-api-src-database-migrations-1760001600000-createrechargecashboxwithdrawals-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Caja Contable" — an accumulated cash balance for the Recargas Electrónicas y SIMs business line. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001700000-AddCashBoxContributionMovementType.ts](#f-comercial-jhoel-api-src-database-migrations-1760001700000-addcashboxcontributionmovementtype-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Aporte a Caja" — a manual cash contribution, the mirror-image income counterpart to "Salida de Ganancia" (expense). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001800000-AddVoidToRechargePurchases.ts](#f-comercial-jhoel-api-src-database-migrations-1760001800000-addvoidtorechargepurchases-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Revertir compra" — a correction path for a mistaken recharge purchase (wrong operator, duplicate, wrong amount). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760001900000-AddVoidToPurchases.ts](#f-comercial-jhoel-api-src-database-migrations-1760001900000-addvoidtopurchases-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Anular factura de compra" — the correction path for a mistaken purchase invoice, built for the new "Administrar Facturas de Compras" module (Sistema). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760002000000-AddVoidToSales.ts](#f-comercial-jhoel-api-src-database-migrations-1760002000000-addvoidtosales-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Anular venta" — the correction path for a mistaken CONFIRMED sale, for the new "Administrar Facturas de Ventas" module (Sistema). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760002100000-AddClientAndReferenceForBankDepositReceivables.ts](#f-comercial-jhoel-api-src-database-migrations-1760002100000-addclientandreferenceforbankdepositreceivables-ts) | .ts | Migración TypeORM | Base de datos (migración) | Lets a Transaccionar "Depósito" optionally link to a REGISTERED client (the same `clients` table Cuentas por Cobrar/Activos already use — see `bank_deposit_operations.client_name`'s own doc comment: that column is deliberately free-text, never looked up against `clients`) and, optionally, atomically | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760002200000-AddRechargeSimSaleRegistrations.ts](#f-comercial-jhoel-api-src-database-migrations-1760002200000-addrechargesimsaleregistrations-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Venta de SIM con registro de identidad" — a per-unit compliance record layered on top of the EXISTING, already-live "Venta de SIM" feature (`CreateRechargeSims1759300000000`): that feature sells physical SIM inventory by quantity (`recharge_sim_sales`, no identity capture). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760002300000-AddVoidToRechargeSimSales.ts](#f-comercial-jhoel-api-src-database-migrations-1760002300000-addvoidtorechargesimsales-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Revertir" for the by-quantity "Vender SIM" quick-sale flow (`recharge_sim_sales`), which never had any void/revert mechanism since it was first built — a real, pre-existing gap, not a regression from the later `recharge_sim_sale_registrations` (identity-capture) feature. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760002400000-AddBarcodeToProductPresentations.ts](#f-comercial-jhoel-api-src-database-migrations-1760002400000-addbarcodetoproductpresentations-ts) | .ts | Migración TypeORM | Base de datos (migración) | Gives each product PRESENTATION its own optional barcode — separate from `products.sku`, which stays exactly as-is. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760002500000-SeedInitialStockSupplier.ts](#f-comercial-jhoel-api-src-database-migrations-1760002500000-seedinitialstocksupplier-ts) | .ts | Migración TypeORM | Base de datos (migración) | Seeds a fixed supplier ("Carga Inicial de Inventario") that the bulk initial-stock Excel import (`POST /purchases/import`) attributes every purchase it creates to — so that stock loaded this way is identifiable in Reportería/Kardex as coming from the initial catalog load, not a real supplier invoice. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760002600000-AddBalanceLimitToRechargeTypes.ts](#f-comercial-jhoel-api-src-database-migrations-1760002600000-addbalancelimittorechargetypes-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Límite de saldo" per recharge type (Claro/Tigo) — the 100% reference point for the Resumen dashboard's saldo gauge charts. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760002700000-AddPublicContactFieldsToCompanySettings.ts](#f-comercial-jhoel-api-src-database-migrations-1760002700000-addpubliccontactfieldstocompanysettings-ts) | .ts | Migración TypeORM | Base de datos (migración) | Adds the fields the public landing page's "Contacto" section needs that `company_settings` didn't have yet: `whatsapp` (deliberately separate from `phone` — a business can call one number and answer WhatsApp on another), `website`, `business_hours` (free multiline text, not a structured day-by-day m | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760002800000-CreatePhones.ts](#f-comercial-jhoel-api-src-database-migrations-1760002800000-createphones-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Venta de Teléfonos" — a new, independent module for buying and selling individual phone units (Claro/Tigo), modeled after the "Venta de SIM con registro de identidad" flow (`recharge_sim_sale_registrations`) rather than the generic `products`/`purchases` machinery: a phone is one individually-ident | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003000000-MovePhoneNumberToSale.ts](#f-comercial-jhoel-api-src-database-migrations-1760003000000-movephonenumbertosale-ts) | .ts | Migración TypeORM | Base de datos (migración) | A phone bought into inventory has no active line yet — the número telefónico is only assigned at the moment it's sold (the SIM gets activated then, not at purchase time). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003100000-CreateCatalogModule.ts](#f-comercial-jhoel-api-src-database-migrations-1760003100000-createcatalogmodule-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Catálogo de Teléfonos" — a public-facing marketing catalog (landing page carousel + admin management), deliberately independent from `modules/phones/` (Venta de Teléfonos): that module tracks individually serialized physical units (IMEI/SIM, activation, one row per device), while this one is a per- | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003200000-AddKrediyaMinAmountToCompanySettings.ts](#f-comercial-jhoel-api-src-database-migrations-1760003200000-addkrediyaminamounttocompanysettings-ts) | .ts | Migración TypeORM | Base de datos (migración) | `company_settings.krediya_min_amount` — the one global, singleton business parameter the "Catálogo de Teléfonos" credit rule reads: a phone qualifies for "Crédito con Krediya" when its price is `&gt;= krediya_min_amount`. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003300000-CreateProductCatalogModule.ts](#f-comercial-jhoel-api-src-database-migrations-1760003300000-createproductcatalogmodule-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Catálogo de Librería" y "Variedades y Accesorios" — dos catálogos públicos de la landing que NUNCA duplican un producto: `catalog_products` es puramente la capa de "publicación" (INVENTARIO → PRODUCTO → PUBLICACIÓN EN CATÁLOGO), con `product_id` como única fuente de verdad para nombre/precio/catego | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003400000-CreateNewsModule.ts](#f-comercial-jhoel-api-src-database-migrations-1760003400000-createnewsmodule-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Noticias" — contenido informativo de la landing, deliberadamente NO modelado como producto: sin `product_id`, sin precio, sin negocio/ categoría, sin WhatsApp, sin Krediya. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003500000-AddLikesToPublicCatalogEntities.ts](#f-comercial-jhoel-api-src-database-migrations-1760003500000-addlikestopubliccatalogentities-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Me gusta" público para Teléfonos, Librería/Variedades y Noticias — un contador simple (`likes_count`), incrementado/decrementado atómicamente por `UPDATE ... | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003600000-CreateCatalogLikes.ts](#f-comercial-jhoel-api-src-database-migrations-1760003600000-createcataloglikes-ts) | .ts | Migración TypeORM | Base de datos (migración) | Reemplaza el contador ciego (`likes_count`, incrementado por un delta que el frontend decide a partir de `localStorage`) por una tabla real de "quién le dio like a qué": un visitante anónimo (identificado por un UUID opaco que el propio frontend genera y persiste, mandado como header `X-Visitor-Id`) | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003700000-CreateNewsTypes.ts](#f-comercial-jhoel-api-src-database-migrations-1760003700000-createnewstypes-ts) | .ts | Migración TypeORM | Base de datos (migración) | Catálogo maestro y configurable de "Tipos de Noticias" — nunca un enum rígido: el admin puede crear/editar/activar/desactivar/ordenar filas nuevas (Eventos, Avisos, ...) sin ninguna migración ni cambio de código. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003800000-AddNewsTypeAndSlugToNewsArticles.ts](#f-comercial-jhoel-api-src-database-migrations-1760003800000-addnewstypeandslugtonewsarticles-ts) | .ts | Migración TypeORM | Base de datos (migración) | Toda noticia debe tener UNA clasificación obligatoria (`news_type_id`) y una URL pública real (`slug`) — ninguna de las dos existía hasta ahora. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760003900000-CreateNewsSubscriptions.ts](#f-comercial-jhoel-api-src-database-migrations-1760003900000-createnewssubscriptions-ts) | .ts | Migración TypeORM | Base de datos (migración) | Suscripción de clientes a noticias por WhatsApp — cuatro tablas nuevas: - `news_subscribers`: un registro por número de WhatsApp. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760004000000-CreateCatalogBanks.ts](#f-comercial-jhoel-api-src-database-migrations-1760004000000-createcatalogbanks-ts) | .ts | Migración TypeORM | Base de datos (migración) | Catálogo público informativo "Bancos" (Sistema → Catálogo de Bancos) — imagen, nombre, descripción, información adicional. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760004100000-CreateNewsPushSubscriptions.ts](#f-comercial-jhoel-api-src-database-migrations-1760004100000-createnewspushsubscriptions-ts) | .ts | Migración TypeORM | Base de datos (migración) | Web Push (VAPID) para Noticias — reemplaza el envío automático por WhatsApp (removido en 693299a) sin duplicar nada del módulo de suscriptores/preferencias/clasificación ya existente: - `news_subscribers.whatsapp_number` pasa a ser NULLABLE. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760004200000-CreateSiteVisits.ts](#f-comercial-jhoel-api-src-database-migrations-1760004200000-createsitevisits-ts) | .ts | Migración TypeORM | Base de datos (migración) | Contador agregado y anónimo de visitas a la landing pública — una sola fila (`id = 1`, forzado por el CHECK, mismo patrón singleton que `alert_settings`/`company_settings`), nunca una fila por visita: el pedido original es explícito en que solo se necesita el TOTAL, no un historial. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760004300000-AddBusinessSnapshotToSaleDetails.ts](#f-comercial-jhoel-api-src-database-migrations-1760004300000-addbusinesssnapshottosaledetails-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Caja de Ventas por negocio" — before this migration, the only way to know which `business` a sold line belonged to was joining out to the *current* `products.business_id`, which silently rewrites history if a product's business classification ever changes later (exactly the historical-accuracy gap the ticket that built this flagged explicitly). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760004400000-CreateSalesCashBoxMovements.ts](#f-comercial-jhoel-api-src-database-migrations-1760004400000-createsalescashboxmovements-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Caja de Ventas" por negocio — el equivalente de la Caja Contable de Recargas (`recharge_cash_box_movements`, ver `AddCashBoxContributionMovementType`), pero con saldo INDEPENDIENTE por `business_id` en vez de uno solo global. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760004500000-AddSearchNormalizationSupport.ts](#f-comercial-jhoel-api-src-database-migrations-1760004500000-addsearchnormalizationsupport-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Buscador profesional" — infraestructura centralizada de normalización de texto para TODAS las búsquedas del sistema (productos, clientes, proveedores, usuarios, bancos, noticias, catálogos, tickets, cotizaciones, facturas). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760005000000-CreateLandingBackgrounds.ts](#f-comercial-jhoel-api-src-database-migrations-1760005000000-createlandingbackgrounds-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Fondos de Landing" (Sistema → Fondos de Landing) — capas visuales de profundidad (imagen + opacidad + overlay + posición/tamaño + efecto 3D + parallax + movimiento) asignadas a una sección real de la landing pública. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760005100000-CreateBankAccountMovements.ts](#f-comercial-jhoel-api-src-database-migrations-1760005100000-createbankaccountmovements-ts) | .ts | Migración TypeORM | Base de datos (migración) | Saldos bancarios dinámicos — `banks.final_balance` deja de ser un valor que se escribe a mano cada día ("Guardar Cambios" en Agentes Bancarios → Bancos) y pasa a ser el saldo ACTUAL materializado de cada cuenta, movido únicamente por operaciones financieras registradas en un ledger nuevo, `bank_account_movements`. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760005200000-AddAvailableInTransaccionarToBanks.ts](#f-comercial-jhoel-api-src-database-migrations-1760005200000-addavailableintransaccionartobanks-ts) | .ts | Migración TypeORM | Base de datos (migración) | "Cuentas visibles en Transaccionar" — `banks.available_in_transaccionar` decide qué cuentas aparecen en el selector "Cuenta bancaria afectada" (Depósito/Retiro/Reintegro). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760005300000-AddCashWithdrawalToBankTransfers.ts](#f-comercial-jhoel-api-src-database-migrations-1760005300000-addcashwithdrawaltobanktransfers-ts) | .ts | Migración TypeORM | Base de datos (migración) | Transferencias Bancarias — dos reglas nuevas, puramente incrementales: 1. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760005400000-ReintegroAlsoDebitsGenesis.ts](#f-comercial-jhoel-api-src-database-migrations-1760005400000-reintegroalsodebitsgenesis-ts) | .ts | Migración TypeORM | Base de datos (migración) | Reintegro Génesis = abono a la línea de crédito de Fundación Génesis Empresarial. | 0 internas; ext.: typeorm | 1 | Media (historial de esquema) |
| [1760005500000-AddReferenceToAssets.ts](#f-comercial-jhoel-api-src-database-migrations-1760005500000-addreferencetoassets-ts) | .ts | Migración TypeORM | Base de datos (migración) | Transaccionar "Enviar a Activos" (Retiros y Desembolsos Génesis): el CARGO en Activos queda ligado a la operación que lo originó, igual que Cuentas por Cobrar desde `AddClientAndReferenceForBankDepositReceivables`. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760005600000-AddBankBalanceCredit.ts](#f-comercial-jhoel-api-src-database-migrations-1760005600000-addbankbalancecredit-ts) | .ts | Migración TypeORM | Base de datos (migración) | Finanzas → Transferencias Bancarias → "Acreditar saldo": suma un monto directamente al saldo de UNA cuenta, sin contrapartida (no toca otra cuenta, caja ni efectivo). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760005700000-BiClubCreditLine.ts](#f-comercial-jhoel-api-src-database-migrations-1760005700000-biclubcreditline-ts) | .ts | Migración TypeORM | Base de datos (migración) | BI Club Empresarial pasa a comportarse como LÍNEA DE CRÉDITO: su saldo (`banks.final_balance`) es el saldo de la línea — Q0.00 = nada utilizado, negativo = monto utilizado/adeudado. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760005800000-BiClubCreditLineDirection.ts](#f-comercial-jhoel-api-src-database-migrations-1760005800000-biclubcreditlinedirection-ts) | .ts | Migración TypeORM | Base de datos (migración) | Corrige el SENTIDO de la línea de crédito de BI Club Empresarial (`BiClubCreditLine`, 1760005700000). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760005900000-BiClubAvailableCredit.ts](#f-comercial-jhoel-api-src-database-migrations-1760005900000-biclubavailablecredit-ts) | .ts | Migración TypeORM | Base de datos (migración) | BI Club Empresarial — modelo definitivo confirmado con el negocio: su saldo es el DISPONIBLE de la línea de crédito con signo negativo. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760006000000-BiClubDebtModel.ts](#f-comercial-jhoel-api-src-database-migrations-1760006000000-biclubdebtmodel-ts) | .ts | Migración TypeORM | Base de datos (migración) | BI Club Empresarial — REGLA DEFINITIVA (reemplaza el modelo de `1760005900000-BiClubAvailableCredit`): el saldo es la DEUDA de la línea. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760006100000-TransactionBankImageAndAzteca.ts](#f-comercial-jhoel-api-src-database-migrations-1760006100000-transactionbankimageandazteca-ts) | .ts | Migración TypeORM | Base de datos (migración) | Banco Agente (`transaction_banks`): 1. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760006200000-OptionalCashBreakdownInTransaccionar.ts](#f-comercial-jhoel-api-src-database-migrations-1760006200000-optionalcashbreakdownintransaccionar-ts) | .ts | Migración TypeORM | Base de datos (migración) | Transaccionar — desglose de efectivo OPCIONAL + "Últimas transacciones". | 1 internas; ext.: typeorm | 1 | Media (historial de esquema) |
| [1760006300000-CreateGuayacanCashBox.ts](#f-comercial-jhoel-api-src-database-migrations-1760006300000-createguayacancashbox-ts) | .ts | Migración TypeORM | Base de datos (migración) | Cooperativa Guayacán — comisión por transacción + Caja (Kardex) propia. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760006400000-GuayacanInvertsDepositWithdrawal.ts](#f-comercial-jhoel-api-src-database-migrations-1760006400000-guayacaninvertsdepositwithdrawal-ts) | .ts | Migración TypeORM | Base de datos (migración) | Cooperativa Guayacán: Depósito y Retiro mueven su cuenta al REVÉS que los demás bancos agente — el Depósito SUMA al saldo de la cuenta y el Retiro RESTA (en el resto, Depósito resta y Retiro suma). | 1 internas; ext.: typeorm | 1 | Media (historial de esquema) |
| [1760006500000-GuayacanAccountOutsideAgentReconciliation.ts](#f-comercial-jhoel-api-src-database-migrations-1760006500000-guayacanaccountoutsideagentreconciliation-ts) | .ts | Migración TypeORM | Base de datos (migración) | La cuenta de Cooperativa Guayacán tiene su propio cuadre (Cuadre de Caja Guayacán): NO entra en Cuadre de Agentes — ni en el desglose de bancos ni en sus totales, ni se exige su saldo del día para cerrar. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760006600000-GuayacanCashSeparateCommissionsAndTransactions.ts](#f-comercial-jhoel-api-src-database-migrations-1760006600000-guayacancashseparatecommissionsandtransactions-ts) | .ts | Migración TypeORM | Base de datos (migración) | Caja Guayacán — comisiones fuera del efectivo; Depósitos/Retiros de Transaccionar dentro. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760006700000-GuayacanSingleBalanceFromCashBox.ts](#f-comercial-jhoel-api-src-database-migrations-1760006700000-guayacansinglebalancefromcashbox-ts) | .ts | Migración TypeORM | Base de datos (migración) | Un solo saldo para Cooperativa Guayacán: el efectivo del Kardex de Cuadre de Caja Guayacán. | 1 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760006800000-CreateCashControlKardexAndCuts.ts](#f-comercial-jhoel-api-src-database-migrations-1760006800000-createcashcontrolkardexandcuts-ts) | .ts | Migración TypeORM | Base de datos (migración) | Control de Efectivo — single official physical-cash Kardex + two daily cuts. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760006900000-CashBankDeposit.ts](#f-comercial-jhoel-api-src-database-migrations-1760006900000-cashbankdeposit-ts) | .ts | Migración TypeORM | Base de datos (migración) | Control de Efectivo → "Depósito bancario": cash leaves the caja and is deposited into one of the registered bank accounts. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760007000000-AccountsReceivableSettlements.ts](#f-comercial-jhoel-api-src-database-migrations-1760007000000-accountsreceivablesettlements-ts) | .ts | Migración TypeORM | Base de datos (migración) | Cuentas por Cobrar → "Cancelar cuenta(s)": collect one or several CARGO rows of the SAME client in one atomic operation, paid in cash or by a deposit into one of the registered bank accounts. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760007100000-FinancialDayReview.ts](#f-comercial-jhoel-api-src-database-migrations-1760007100000-financialdayreview-ts) | .ts | Migración TypeORM | Base de datos (migración) | Sistema → Administración financiera → Revisión de días operativos. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760007200000-AddDescriptionToBankDepositOperations.ts](#f-comercial-jhoel-api-src-database-migrations-1760007200000-adddescriptiontobankdepositoperations-ts) | .ts | Migración TypeORM | Base de datos (migración) | Transaccionar → "Descripción / Beneficiario": a free-text description (who the operation was for, or its purpose) stored on the operation itself. | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760007300000-CashDailyIndicatorsFromBankDayOpening.ts](#f-comercial-jhoel-api-src-database-migrations-1760007300000-cashdailyindicatorsfrombankdayopening-ts) | .ts | Migración TypeORM | Base de datos (migración) | Control de Efectivo — daily indicators restart on every bank-day opening (Agentes Bancarios → Bancos → "Aperturar día"). | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760007400000-CashCountsAndWarehouseCustody.ts](#f-comercial-jhoel-api-src-database-migrations-1760007400000-cashcountsandwarehousecustody-ts) | .ts | Migración TypeORM | Base de datos (migración) | Control de Efectivo → "Arqueo de Caja" and "Entrega de Efectivo a Bodega". | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760007500000-WarehouseWithdrawals.ts](#f-comercial-jhoel-api-src-database-migrations-1760007500000-warehousewithdrawals-ts) | .ts | Migración TypeORM | Base de datos (migración) | Bodega → "Retiro de Bodega": cash leaves Bodega and goes either - back to the caja (`DEVOLUCION_A_CAJA` in Bodega + `DEVOLUCION_BODEGA` IN in the caja Kardex: an internal transfer, total custody unchanged), or - to a registered bank account (`DEPOSITO_BANCARIO` in Bodega + the existing bank type `DE | 0 internas; ext.: typeorm | 0 | Media (historial de esquema) |
| [1760007600000-CuadreCashBreakdownAndCentDenomination.ts](#f-comercial-jhoel-api-src-database-migrations-1760007600000-cuadrecashbreakdownandcentdenomination-ts) | .ts | Migración TypeORM | Base de datos (migración) | 1. Q0.01 ("un centavo") becomes a valid denomination everywhere the cash is counted: `cash_valid_denomination` (Arqueo de Caja, Bodega deliveries and withdrawals, cash bank deposits, cut counts) and `guayacan_valid_denomination` (Caja Guayacán). | 0 internas; ext.: typeorm | 1 | Media (historial de esquema) |
| [1760007700000-CuadreBreakdownFromLatestCut.ts](#f-comercial-jhoel-api-src-database-migrations-1760007700000-cuadrebreakdownfromlatestcut-ts) | .ts | Migración TypeORM | Base de datos (migración) | Cuadre de Agentes → "Cargar último arqueo de Caja" loads the arqueo of the "Segundo corte · final del día" of Control de Efectivo (`cash_cut_counts` of `period_number = 2`) — exactly that one cut's breakdown, never the first cut, never a standalone Arqueo de Caja and never an aggregate of both cuts. | 1 internas; ext.: typeorm | 0 | Media (historial de esquema) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1756310000000-createuserstable-ts"></a>

### 1756310000000-CreateUsersTable.ts

- **Ruta:** [1756310000000-CreateUsersTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1756310000000-CreateUsersTable.ts) (`comercial-jhoel-api/src/database/migrations/1756310000000-CreateUsersTable.ts`, 32 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateUsersTable1756310000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateUsersTable1756310000000` (L3–31)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–26 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 28–30 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateUsersTable1756310000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1756310000000-CreateUsersTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1756310000000-CreateUsersTable.ts#L6) (L6–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.createTable`, `new Table`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateUsersTable1756310000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1756310000000-CreateUsersTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1756310000000-CreateUsersTable.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1756400000000-addusernameandphonetousers-ts"></a>

### 1756400000000-AddUsernameAndPhoneToUsers.ts

- **Ruta:** [1756400000000-AddUsernameAndPhoneToUsers.ts](../../../../comercial-jhoel-api/src/database/migrations/1756400000000-AddUsernameAndPhoneToUsers.ts) (`comercial-jhoel-api/src/database/migrations/1756400000000-AddUsernameAndPhoneToUsers.ts`, 59 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `AddUsernameAndPhoneToUsers1756400000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddUsernameAndPhoneToUsers1756400000000` (L8–58)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 11–44 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 46–57 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddUsernameAndPhoneToUsers1756400000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1756400000000-AddUsernameAndPhoneToUsers.ts](../../../../comercial-jhoel-api/src/database/migrations/1756400000000-AddUsernameAndPhoneToUsers.ts#L11) (L11–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.addColumns`, `new TableColumn`, `queryRunner.createUniqueConstraint`, `new TableUnique`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddUsernameAndPhoneToUsers1756400000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1756400000000-AddUsernameAndPhoneToUsers.ts](../../../../comercial-jhoel-api/src/database/migrations/1756400000000-AddUsernameAndPhoneToUsers.ts#L46) (L46–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropUniqueConstraint`, `queryRunner.dropColumn`, `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1756500000000-createrolesanduserroles-ts"></a>

### 1756500000000-CreateRolesAndUserRoles.ts

- **Ruta:** [1756500000000-CreateRolesAndUserRoles.ts](../../../../comercial-jhoel-api/src/database/migrations/1756500000000-CreateRolesAndUserRoles.ts) (`comercial-jhoel-api/src/database/migrations/1756500000000-CreateRolesAndUserRoles.ts`, 82 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateRolesAndUserRoles1756500000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateRolesAndUserRoles1756500000000` (L9–81)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 12–74 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 76–80 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateRolesAndUserRoles1756500000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1756500000000-CreateRolesAndUserRoles.ts](../../../../comercial-jhoel-api/src/database/migrations/1756500000000-CreateRolesAndUserRoles.ts#L12) (L12–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.query`, `queryRunner.addColumn`, `new TableColumn`, `queryRunner.createForeignKey`, `new TableForeignKey`
- **Efectos secundarios:** Tablas en su SQL: `roles`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateRolesAndUserRoles1756500000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1756500000000-CreateRolesAndUserRoles.ts](../../../../comercial-jhoel-api/src/database/migrations/1756500000000-CreateRolesAndUserRoles.ts#L76) (L76–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropForeignKey`, `queryRunner.dropColumn`, `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1756600000000-createcategoriestable-ts"></a>

### 1756600000000-CreateCategoriesTable.ts

- **Ruta:** [1756600000000-CreateCategoriesTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1756600000000-CreateCategoriesTable.ts) (`comercial-jhoel-api/src/database/migrations/1756600000000-CreateCategoriesTable.ts`, 37 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateCategoriesTable1756600000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateCategoriesTable1756600000000` (L3–36)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–31 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 33–35 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateCategoriesTable1756600000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1756600000000-CreateCategoriesTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1756600000000-CreateCategoriesTable.ts#L6) (L6–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateCategoriesTable1756600000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1756600000000-CreateCategoriesTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1756600000000-CreateCategoriesTable.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1756700000000-createproductstable-ts"></a>

### 1756700000000-CreateProductsTable.ts

- **Ruta:** [1756700000000-CreateProductsTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1756700000000-CreateProductsTable.ts) (`comercial-jhoel-api/src/database/migrations/1756700000000-CreateProductsTable.ts`, 73 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateProductsTable1756700000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateProductsTable1756700000000` (L3–72)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–67 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 69–71 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateProductsTable1756700000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1756700000000-CreateProductsTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1756700000000-CreateProductsTable.ts#L6) (L6–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateProductsTable1756700000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1756700000000-CreateProductsTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1756700000000-CreateProductsTable.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1756800000000-addisactivetousers-ts"></a>

### 1756800000000-AddIsActiveToUsers.ts

- **Ruta:** [1756800000000-AddIsActiveToUsers.ts](../../../../comercial-jhoel-api/src/database/migrations/1756800000000-AddIsActiveToUsers.ts) (`comercial-jhoel-api/src/database/migrations/1756800000000-AddIsActiveToUsers.ts`, 21 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `AddIsActiveToUsers1756800000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddIsActiveToUsers1756800000000` (L3–20)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–15 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 17–19 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddIsActiveToUsers1756800000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1756800000000-AddIsActiveToUsers.ts](../../../../comercial-jhoel-api/src/database/migrations/1756800000000-AddIsActiveToUsers.ts#L6) (L6–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumn`, `new TableColumn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddIsActiveToUsers1756800000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1756800000000-AddIsActiveToUsers.ts](../../../../comercial-jhoel-api/src/database/migrations/1756800000000-AddIsActiveToUsers.ts#L17) (L17–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropColumn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1756900000000-addskutoproducts-ts"></a>

### 1756900000000-AddSkuToProducts.ts

- **Ruta:** [1756900000000-AddSkuToProducts.ts](../../../../comercial-jhoel-api/src/database/migrations/1756900000000-AddSkuToProducts.ts) (`comercial-jhoel-api/src/database/migrations/1756900000000-AddSkuToProducts.ts`, 42 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `AddSkuToProducts1756900000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddSkuToProducts1756900000000` (L8–41)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 11–35 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 37–40 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddSkuToProducts1756900000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1756900000000-AddSkuToProducts.ts](../../../../comercial-jhoel-api/src/database/migrations/1756900000000-AddSkuToProducts.ts#L11) (L11–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumn`, `new TableColumn`, `queryRunner.createIndex`, `new TableIndex`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddSkuToProducts1756900000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1756900000000-AddSkuToProducts.ts](../../../../comercial-jhoel-api/src/database/migrations/1756900000000-AddSkuToProducts.ts#L37) (L37–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropIndex`, `queryRunner.dropColumn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757000000000-createbusinessestable-ts"></a>

### 1757000000000-CreateBusinessesTable.ts

- **Ruta:** [1757000000000-CreateBusinessesTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1757000000000-CreateBusinessesTable.ts) (`comercial-jhoel-api/src/database/migrations/1757000000000-CreateBusinessesTable.ts`, 89 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateBusinessesTable1757000000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateBusinessesTable1757000000000` (L10–88)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 13–80 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 82–87 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateBusinessesTable1757000000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757000000000-CreateBusinessesTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1757000000000-CreateBusinessesTable.ts#L13) (L13–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.query`, `queryRunner.addColumn`, `new TableColumn`, `queryRunner.createForeignKey`, `new TableForeignKey`, `queryRunner.createIndex`, `new TableIndex`
- **Efectos secundarios:** Tablas en su SQL: `businesses`, `products`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateBusinessesTable1757000000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757000000000-CreateBusinessesTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1757000000000-CreateBusinessesTable.ts#L82) (L82–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropIndex`, `queryRunner.dropForeignKey`, `queryRunner.dropColumn`, `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757100000000-createsalestables-ts"></a>

### 1757100000000-CreateSalesTables.ts

- **Ruta:** [1757100000000-CreateSalesTables.ts](../../../../comercial-jhoel-api/src/database/migrations/1757100000000-CreateSalesTables.ts) (`comercial-jhoel-api/src/database/migrations/1757100000000-CreateSalesTables.ts`, 217 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateSalesTables1757100000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `confirm_sale`; 

#### Clase `CreateSalesTables1757100000000` (L3–216)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–207 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 209–215 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateSalesTables1757100000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757100000000-CreateSalesTables.ts](../../../../comercial-jhoel-api/src/database/migrations/1757100000000-CreateSalesTables.ts#L6) (L6–207)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`; Tablas en su SQL: `v_sale_id`, `v_product`, `products`, `sales`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateSalesTables1757100000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757100000000-CreateSalesTables.ts](../../../../comercial-jhoel-api/src/database/migrations/1757100000000-CreateSalesTables.ts#L209) (L209–215)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757200000000-adddraftsalessupport-ts"></a>

### 1757200000000-AddDraftSalesSupport.ts

- **Ruta:** [1757200000000-AddDraftSalesSupport.ts](../../../../comercial-jhoel-api/src/database/migrations/1757200000000-AddDraftSalesSupport.ts) (`comercial-jhoel-api/src/database/migrations/1757200000000-AddDraftSalesSupport.ts`, 199 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `AddDraftSalesSupport1757200000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `adjust_sale_item`, `cancel_open_sale`; 

#### Clase `AddDraftSalesSupport1757200000000` (L8–198)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 11–188 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 190–197 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddDraftSalesSupport1757200000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757200000000-AddDraftSalesSupport.ts](../../../../comercial-jhoel-api/src/database/migrations/1757200000000-AddDraftSalesSupport.ts#L11) (L11–188)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumn`, `new TableColumn`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_sale_id`, `sales`, `v_product`, `products`, `v_detail`, `sale_details`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddDraftSalesSupport1757200000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757200000000-AddDraftSalesSupport.ts](../../../../comercial-jhoel-api/src/database/migrations/1757200000000-AddDraftSalesSupport.ts#L190) (L190–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropIndex`, `queryRunner.dropColumn`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757300000000-createsuppliersandpurchases-ts"></a>

### 1757300000000-CreateSuppliersAndPurchases.ts

- **Ruta:** [1757300000000-CreateSuppliersAndPurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1757300000000-CreateSuppliersAndPurchases.ts) (`comercial-jhoel-api/src/database/migrations/1757300000000-CreateSuppliersAndPurchases.ts`, 285 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateSuppliersAndPurchases1757300000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `confirm_purchase`; 

#### Clase `CreateSuppliersAndPurchases1757300000000` (L3–284)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–274 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 276–283 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateSuppliersAndPurchases1757300000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757300000000-CreateSuppliersAndPurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1757300000000-CreateSuppliersAndPurchases.ts#L6) (L6–274)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`; Tablas en su SQL: `v_supplier`, `suppliers`, `v_purchase_id`, `v_product`, `products`, `purchases`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateSuppliersAndPurchases1757300000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757300000000-CreateSuppliersAndPurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1757300000000-CreateSuppliersAndPurchases.ts#L276) (L276–283)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757500000000-createrechargesmodule-ts"></a>

### 1757500000000-CreateRechargesModule.ts

- **Ruta:** [1757500000000-CreateRechargesModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1757500000000-CreateRechargesModule.ts) (`comercial-jhoel-api/src/database/migrations/1757500000000-CreateRechargesModule.ts`, 393 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateRechargesModule1757500000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `ensure_recharge_daily_balance`, `register_recharge_purchase`, `register_recharge_final_balance`; 

#### Clase `CreateRechargesModule1757500000000` (L3–392)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–376 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 378–391 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateRechargesModule1757500000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757500000000-CreateRechargesModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1757500000000-CreateRechargesModule.ts#L6) (L6–376)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_id`, `recharge_daily_balances`, `v_previous`, `v_type`, `recharge_types`, `v_final_balance`, `v_daily_balance`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateRechargesModule1757500000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757500000000-CreateRechargesModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1757500000000-CreateRechargesModule.ts#L378) (L378–391)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757600000000-createrechargesalesclosures-ts"></a>

### 1757600000000-CreateRechargeSalesClosures.ts

- **Ruta:** [1757600000000-CreateRechargeSalesClosures.ts](../../../../comercial-jhoel-api/src/database/migrations/1757600000000-CreateRechargeSalesClosures.ts) (`comercial-jhoel-api/src/database/migrations/1757600000000-CreateRechargeSalesClosures.ts`, 153 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateRechargeSalesClosures1757600000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_recharge_sales_closure`; 

#### Clase `CreateRechargeSalesClosures1757600000000` (L3–152)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–144 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 146–151 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateRechargeSalesClosures1757600000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757600000000-CreateRechargeSalesClosures.ts](../../../../comercial-jhoel-api/src/database/migrations/1757600000000-CreateRechargeSalesClosures.ts#L6) (L6–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `recharge_daily_balances`, `v_closure_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateRechargeSalesClosures1757600000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757600000000-CreateRechargeSalesClosures.ts](../../../../comercial-jhoel-api/src/database/migrations/1757600000000-CreateRechargeSalesClosures.ts#L146) (L146–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757700000000-addrechargecuadrecycles-ts"></a>

### 1757700000000-AddRechargeCuadreCycles.ts

- **Ruta:** [1757700000000-AddRechargeCuadreCycles.ts](../../../../comercial-jhoel-api/src/database/migrations/1757700000000-AddRechargeCuadreCycles.ts) (`comercial-jhoel-api/src/database/migrations/1757700000000-AddRechargeCuadreCycles.ts`, 382 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `AddRechargeCuadreCycles1757700000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `ensure_recharge_daily_balance`, `register_recharge_sales_closure`; 

#### Clase `AddRechargeCuadreCycles1757700000000` (L8–381)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 11–247 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 249–380 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddRechargeCuadreCycles1757700000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757700000000-AddRechargeCuadreCycles.ts](../../../../comercial-jhoel-api/src/database/migrations/1757700000000-AddRechargeCuadreCycles.ts#L11) (L11–247)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumn`, `new TableColumn`, `queryRunner.dropIndex`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_id`, `recharge_daily_balances`, `v_previous`, `combined`, `v_closure_id`, `recharge_sales_closures`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddRechargeCuadreCycles1757700000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757700000000-AddRechargeCuadreCycles.ts](../../../../comercial-jhoel-api/src/database/migrations/1757700000000-AddRechargeCuadreCycles.ts#L249) (L249–380)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropIndex`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.dropColumn`
- **Efectos secundarios:** Tablas en su SQL: `recharge_daily_balances`, `v_closure_id`, `v_id`, `v_previous`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757800000000-createicecreamsmodule-ts"></a>

### 1757800000000-CreateIceCreamsModule.ts

- **Ruta:** [1757800000000-CreateIceCreamsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1757800000000-CreateIceCreamsModule.ts) (`comercial-jhoel-api/src/database/migrations/1757800000000-CreateIceCreamsModule.ts`, 482 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateIceCreamsModule1757800000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `confirm_ice_cream_purchase`, `confirm_ice_cream_sale`; 

#### Clase `CreateIceCreamsModule1757800000000` (L3–481)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–466 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 468–480 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateIceCreamsModule1757800000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757800000000-CreateIceCreamsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1757800000000-CreateIceCreamsModule.ts#L6) (L6–466)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`; Tablas en su SQL: `v_supplier`, `suppliers`, `v_purchase_id`, `v_ice_cream`, `ice_creams`, `ice_cream_purchases`, `v_sale_id`, `ice_cream_sales`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateIceCreamsModule1757800000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757800000000-CreateIceCreamsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1757800000000-CreateIceCreamsModule.ts#L468) (L468–480)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757800000000-createrechargesales-ts"></a>

### 1757800000000-CreateRechargeSales.ts

- **Ruta:** [1757800000000-CreateRechargeSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1757800000000-CreateRechargeSales.ts) (`comercial-jhoel-api/src/database/migrations/1757800000000-CreateRechargeSales.ts`, 454 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateRechargeSales1757800000000`, `PREVIOUS_CLOSURE_FUNCTION` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_recharge_sales_closure`, `register_recharge_sale`, `update_recharge_sale`, `delete_recharge_sale`; 

#### Clase `CreateRechargeSales1757800000000` (L87–453)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 90–438 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 440–452 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateRechargeSales1757800000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757800000000-CreateRechargeSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1757800000000-CreateRechargeSales.ts#L90) (L90–438)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_type`, `recharge_types`, `v_final_balance`, `recharge_daily_balances`, `v_sale_id`, `v_daily_balance_id`, `recharge_sales`, `v_type_sales`, `v_closure_id`, `recharge_sales_closures`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateRechargeSales1757800000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757800000000-CreateRechargeSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1757800000000-CreateRechargeSales.ts#L440) (L440–452)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1757900000000-createbankagentsmodule-ts"></a>

### 1757900000000-CreateBankAgentsModule.ts

- **Ruta:** [1757900000000-CreateBankAgentsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1757900000000-CreateBankAgentsModule.ts) (`comercial-jhoel-api/src/database/migrations/1757900000000-CreateBankAgentsModule.ts`, 299 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateBankAgentsModule1757900000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `save_bank_balance`; 

#### Clase `CreateBankAgentsModule1757900000000` (L3–298)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–288 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 290–297 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateBankAgentsModule1757900000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1757900000000-CreateBankAgentsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1757900000000-CreateBankAgentsModule.ts#L6) (L6–288)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_bank`, `banks`, `v_previous_balance`, `bank_balances`, `v_balance_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateBankAgentsModule1757900000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1757900000000-CreateBankAgentsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1757900000000-CreateBankAgentsModule.ts#L290) (L290–297)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758000000000-createclientstable-ts"></a>

### 1758000000000-CreateClientsTable.ts

- **Ruta:** [1758000000000-CreateClientsTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1758000000000-CreateClientsTable.ts) (`comercial-jhoel-api/src/database/migrations/1758000000000-CreateClientsTable.ts`, 62 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateClientsTable1758000000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateClientsTable1758000000000` (L3–61)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–55 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 57–60 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateClientsTable1758000000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758000000000-CreateClientsTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1758000000000-CreateClientsTable.ts#L6) (L6–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateClientsTable1758000000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758000000000-CreateClientsTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1758000000000-CreateClientsTable.ts#L57) (L57–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758100000000-createaccountsreceivableandassets-ts"></a>

### 1758100000000-CreateAccountsReceivableAndAssets.ts

- **Ruta:** [1758100000000-CreateAccountsReceivableAndAssets.ts](../../../../comercial-jhoel-api/src/database/migrations/1758100000000-CreateAccountsReceivableAndAssets.ts) (`comercial-jhoel-api/src/database/migrations/1758100000000-CreateAccountsReceivableAndAssets.ts`, 180 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateAccountsReceivableAndAssets1758100000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateAccountsReceivableAndAssets1758100000000` (L11–179)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 14–173 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 175–178 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateAccountsReceivableAndAssets1758100000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758100000000-CreateAccountsReceivableAndAssets.ts](../../../../comercial-jhoel-api/src/database/migrations/1758100000000-CreateAccountsReceivableAndAssets.ts#L14) (L14–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.query`, `queryRunner.createIndex`, `new TableIndex`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateAccountsReceivableAndAssets1758100000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758100000000-CreateAccountsReceivableAndAssets.ts](../../../../comercial-jhoel-api/src/database/migrations/1758100000000-CreateAccountsReceivableAndAssets.ts#L175) (L175–178)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758200000000-allownegativeassetamount-ts"></a>

### 1758200000000-AllowNegativeAssetAmount.ts

- **Ruta:** [1758200000000-AllowNegativeAssetAmount.ts](../../../../comercial-jhoel-api/src/database/migrations/1758200000000-AllowNegativeAssetAmount.ts) (`comercial-jhoel-api/src/database/migrations/1758200000000-AllowNegativeAssetAmount.ts`, 32 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Drops the `assets.amount &gt; 0` guardrail — and only that one, on only that one table.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AllowNegativeAssetAmount1758200000000` (L17–31)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Drops the `assets.amount &gt; 0` guardrail — and only that one, on only that one table. `accounts_receivable`'s identical-looking `CHK_accounts_receivable_amount_positive` is untouched, per this ticket's explicit "únicamente para este input" scope. This is a schema change (dropping a CHECK constraint), but a purely additive/permissive one: it removes a restriction, never a column, table, or row — every existing `assets` row (all of them already positive, since the constraint held until now) is completely unaffected. No `numeric` type change needed: `numeric(12,2)` already stores negative values natively — the constraint was the only thing rejecting them.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 20–24 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 26–30 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AllowNegativeAssetAmount1758200000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758200000000-AllowNegativeAssetAmount.ts](../../../../comercial-jhoel-api/src/database/migrations/1758200000000-AllowNegativeAssetAmount.ts#L20) (L20–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AllowNegativeAssetAmount1758200000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758200000000-AllowNegativeAssetAmount.ts](../../../../comercial-jhoel-api/src/database/migrations/1758200000000-AllowNegativeAssetAmount.ts#L26) (L26–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758300000000-createagentreconciliations-ts"></a>

### 1758300000000-CreateAgentReconciliations.ts

- **Ruta:** [1758300000000-CreateAgentReconciliations.ts](../../../../comercial-jhoel-api/src/database/migrations/1758300000000-CreateAgentReconciliations.ts) (`comercial-jhoel-api/src/database/migrations/1758300000000-CreateAgentReconciliations.ts`, 77 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Cuadre Agentes, segunda etapa — "Guardar Cuadre".
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateAgentReconciliations1758300000000` (L24–76)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Cuadre Agentes, segunda etapa — "Guardar Cuadre". Purely additive: a brand new table, no existing table/column touched. `numeric(14,2)` (wider than this app's usual `numeric(12,2)`) per the ticket's own explicit spec, since these are aggregated totals across every bank/ asset/cuenta-por-cobrar rather than a single transaction's amount. Deliberately no CHECK constraint on `result` (unlike assets/ accounts_receivable's `amount &gt; 0`) — the whole point of this column is that it can be negative (the ticket's own "ROJO" state), so a positivity guardrail here would actively break the feature. No uniqueness constraint on `date` either — unlike `recharge_sales_closures` (one row per calendar day), this ticket's own wording treats every save as a new historical record ("el resultado histórico de cada cuadre"), with no cycle/reset concept requested for this table. Duplicate-submission protection (a

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 27–71 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 73–75 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateAgentReconciliations1758300000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758300000000-CreateAgentReconciliations.ts](../../../../comercial-jhoel-api/src/database/migrations/1758300000000-CreateAgentReconciliations.ts#L27) (L27–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateAgentReconciliations1758300000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758300000000-CreateAgentReconciliations.ts](../../../../comercial-jhoel-api/src/database/migrations/1758300000000-CreateAgentReconciliations.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758400000000-syncbanksfinalbalanceonsave-ts"></a>

### 1758400000000-SyncBanksFinalBalanceOnSave.ts

- **Ruta:** [1758400000000-SyncBanksFinalBalanceOnSave.ts](../../../../comercial-jhoel-api/src/database/migrations/1758400000000-SyncBanksFinalBalanceOnSave.ts) (`comercial-jhoel-api/src/database/migrations/1758400000000-SyncBanksFinalBalanceOnSave.ts`, 153 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Guardar Cambios" (Agentes Bancarios → Bancos) was only ever upserting `bank_balances` (the daily cuadre history) — `banks.final_balance` (the static reference value Sistema → Bancos and the Cuadre Agentes → "Resumen de Bancos" summary read) was never touched by it.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `save_bank_balance`; 

#### Clase `SyncBanksFinalBalanceOnSave1758400000000` (L32–152)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Guardar Cambios" (Agentes Bancarios → Bancos) was only ever upserting `bank_balances` (the daily cuadre history) — `banks.final_balance` (the static reference value Sistema → Bancos and the Cuadre Agentes → "Resumen de Bancos" summary read) was never touched by it. This is exactly the ticket's own explicit requirement ("actualizar el saldo correspondiente del banco en la tabla banks... Actualizar el final_balance correspondiente"), and the concrete source of the "guardé pero no veo el cambio" confusion — a save was landing in `bank_balances` correctly, but whoever checked `banks.final_balance` directly (or the Cuadre Agentes summary, which reads that same column) never saw it move. Purely additive: `CREATE OR REPLACE FUNCTION` on the exact same `save_bank_balance` signature already in use — no table/column changes, no existing row touched by this migration itself. The one new statement 

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 35–93 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 95–151 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `SyncBanksFinalBalanceOnSave1758400000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758400000000-SyncBanksFinalBalanceOnSave.ts](../../../../comercial-jhoel-api/src/database/migrations/1758400000000-SyncBanksFinalBalanceOnSave.ts#L35) (L35–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_bank`, `banks`, `v_previous_balance`, `bank_balances`, `v_balance_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SyncBanksFinalBalanceOnSave1758400000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758400000000-SyncBanksFinalBalanceOnSave.ts](../../../../comercial-jhoel-api/src/database/migrations/1758400000000-SyncBanksFinalBalanceOnSave.ts#L95) (L95–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_bank`, `banks`, `v_previous_balance`, `bank_balances`, `v_balance_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758500000000-onlysyncbanksfinalbalanceforlatestdate-ts"></a>

### 1758500000000-OnlySyncBanksFinalBalanceForLatestDate.ts

- **Ruta:** [1758500000000-OnlySyncBanksFinalBalanceForLatestDate.ts](../../../../comercial-jhoel-api/src/database/migrations/1758500000000-OnlySyncBanksFinalBalanceForLatestDate.ts) (`comercial-jhoel-api/src/database/migrations/1758500000000-OnlySyncBanksFinalBalanceForLatestDate.ts`, 155 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Corrige un defecto real de la migración anterior (`SyncBanksFinalBalanceOnSave`): esa versión de `save_bank_balance` actualizaba `banks.final_balance` (el valor "actual" que Sistema → Bancos y Cuadre Agentes → Resumen de Bancos leen) sin importar qué fecha se estuviera guardando.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `save_bank_balance`; 

#### Clase `OnlySyncBanksFinalBalanceForLatestDate1758500000000` (L23–154)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Corrige un defecto real de la migración anterior (`SyncBanksFinalBalanceOnSave`): esa versión de `save_bank_balance` actualizaba `banks.final_balance` (el valor "actual" que Sistema → Bancos y Cuadre Agentes → Resumen de Bancos leen) sin importar qué fecha se estuviera guardando. Eso funciona bien cuando se guarda el día más reciente, pero corrompe el valor "actual" cuando se guarda (o corrige) una fecha *pasada*, anterior a un cuadre ya existente para ese banco — se descubrió exactamente así, probando esta ticket con una fecha de prueba distinta a hoy. La corrección: solo sincronizar `banks.final_balance` cuando la fecha que se está guardando es la más reciente conocida para ese banco (no existe ningún otro `bank_balances` posterior para el mismo `bank_id`). Guardar una fecha pasada sigue actualizando el histórico normalmente, pero ya no toca el valor "actual" si un día más reciente ya 

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 26–93 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 95–153 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `OnlySyncBanksFinalBalanceForLatestDate1758500000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758500000000-OnlySyncBanksFinalBalanceForLatestDate.ts](../../../../comercial-jhoel-api/src/database/migrations/1758500000000-OnlySyncBanksFinalBalanceForLatestDate.ts#L26) (L26–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_bank`, `banks`, `v_previous_balance`, `bank_balances`, `v_balance_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `OnlySyncBanksFinalBalanceForLatestDate1758500000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758500000000-OnlySyncBanksFinalBalanceForLatestDate.ts](../../../../comercial-jhoel-api/src/database/migrations/1758500000000-OnlySyncBanksFinalBalanceForLatestDate.ts#L95) (L95–153)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_bank`, `banks`, `v_previous_balance`, `bank_balances`, `v_balance_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758600000000-createdayopenings-ts"></a>

### 1758600000000-CreateDayOpenings.ts

- **Ruta:** [1758600000000-CreateDayOpenings.ts](../../../../comercial-jhoel-api/src/database/migrations/1758600000000-CreateDayOpenings.ts) (`comercial-jhoel-api/src/database/migrations/1758600000000-CreateDayOpenings.ts`, 54 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Apertura del Día" — Agentes Bancarios &gt; Bancos.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateDayOpenings1758600000000` (L19–53)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Apertura del Día" — Agentes Bancarios &gt; Bancos. Antes de esta migración no existía ninguna estructura que representara "el usuario confirmó que quiere empezar a trabajar en esta fecha" independientemente de si ya se guardó algún saldo: `bank_balances.final_balance` es `NOT NULL`, así que no puede representar "abierto pero sin saldos todavía" sin violar su propio esquema — de ahí que se necesite esta tabla nueva, mínima, en vez de reutilizar `bank_balances` con un valor centinela. Una fila por fecha (`UNIQUE (date)`): "aperturar" un día ya aperturado es una operación idempotente (ver `TypeOrmDayOpeningRepository.open`), nunca crea una segunda fila ni falla. Puramente aditiva — tabla nueva, ninguna existente se toca.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 22–48 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 50–52 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateDayOpenings1758600000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758600000000-CreateDayOpenings.ts](../../../../comercial-jhoel-api/src/database/migrations/1758600000000-CreateDayOpenings.ts#L22) (L22–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateDayOpenings1758600000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758600000000-CreateDayOpenings.ts](../../../../comercial-jhoel-api/src/database/migrations/1758600000000-CreateDayOpenings.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758700000000-adddayclosingtodayopenings-ts"></a>

### 1758700000000-AddDayClosingToDayOpenings.ts

- **Ruta:** [1758700000000-AddDayClosingToDayOpenings.ts](../../../../comercial-jhoel-api/src/database/migrations/1758700000000-AddDayClosingToDayOpenings.ts) (`comercial-jhoel-api/src/database/migrations/1758700000000-AddDayClosingToDayOpenings.ts`, 117 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Cierre del Día" — Agentes Bancarios &gt; Cuadre Agentes.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `close_agent_day`; 

#### Clase `AddDayClosingToDayOpenings1758700000000` (L31–116)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Cierre del Día" — Agentes Bancarios &gt; Cuadre Agentes. Antes de esta migración `day_openings` solo sabía representar "aperturado" (una fila existe) o "no aperturado" (no existe); no había forma de distinguir un día aperturado-y-en-curso de uno ya cerrado. `closed_at`/`closed_by` son NULLABLE y puramente aditivos — cada fila existente (todos los días ya aperturados hasta hoy, incluido el real 2026-08-30) queda con `closed_at = NULL`, es decir "aperturado pero no cerrado", que es exactamente su estado real actual. Ningún dato existente se modifica. `close_agent_day(...)` es la operación atómica "Guardar Cuadre + Cerrar Día" — mismo patrón ya establecido en esta base de código que `register_recharge_sales_closure`/`save_bank_balance`: una única función PL/pgSQL (no un PROCEDURE con BEGIN/COMMIT explícito) para que un `RAISE EXCEPTION` en cualquier punto revierta *todo* lo que la función ya 

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 34–104 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 106–115 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddDayClosingToDayOpenings1758700000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758700000000-AddDayClosingToDayOpenings.ts](../../../../comercial-jhoel-api/src/database/migrations/1758700000000-AddDayClosingToDayOpenings.ts#L34) (L34–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumns`, `new TableColumn`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_day_opening`, `day_openings`, `v_active_banks_count`, `banks`, `v_balances_count`, `bank_balances`, `v_reconciliation_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddDayClosingToDayOpenings1758700000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758700000000-AddDayClosingToDayOpenings.ts](../../../../comercial-jhoel-api/src/database/migrations/1758700000000-AddDayClosingToDayOpenings.ts#L106) (L106–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropColumn`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758800000000-addthemetousers-ts"></a>

### 1758800000000-AddThemeToUsers.ts

- **Ruta:** [1758800000000-AddThemeToUsers.ts](../../../../comercial-jhoel-api/src/database/migrations/1758800000000-AddThemeToUsers.ts) (`comercial-jhoel-api/src/database/migrations/1758800000000-AddThemeToUsers.ts`, 48 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Modo Claro / Modo Oscuro por usuario" — preferencia individual de tema, persistida en la propia fila de `users` (no se creó una tabla aparte: es un único valor controlado, exactamente el caso que esta app ya modela como una columna simple — ver `is_active`, `role_id`).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddThemeToUsers1758800000000` (L20–47)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Modo Claro / Modo Oscuro por usuario" — preferencia individual de tema, persistida en la propia fila de `users` (no se creó una tabla aparte: es un único valor controlado, exactamente el caso que esta app ya modela como una columna simple — ver `is_active`, `role_id`). Puramente aditiva: `ADD COLUMN ... NOT NULL DEFAULT 'LIGHT'` puebla automáticamente la columna en cada fila existente con el valor por defecto (comportamiento estándar de Postgres para un `DEFAULT` constante) — ningún usuario existente queda con esta columna nula ni pierde datos. El `CHECK` constraint es el mismo patrón de "enum como varchar + constraint" que esta base de datos no había usado literal (roles usa una tabla propia), pero es la solución más simple y suficiente para dos valores fijos, reforzando a nivel de base de datos la misma validación que ya hace `UpdateThemeRequestDto` en la capa de presentación (defensa

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 23–39 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 41–46 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddThemeToUsers1758800000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758800000000-AddThemeToUsers.ts](../../../../comercial-jhoel-api/src/database/migrations/1758800000000-AddThemeToUsers.ts#L23) (L23–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumn`, `new TableColumn`, `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddThemeToUsers1758800000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758800000000-AddThemeToUsers.ts](../../../../comercial-jhoel-api/src/database/migrations/1758800000000-AddThemeToUsers.ts#L41) (L41–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropColumn`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758900000000-adddayreopeningandaudit-ts"></a>

### 1758900000000-AddDayReopeningAndAudit.ts

- **Ruta:** [1758900000000-AddDayReopeningAndAudit.ts](../../../../comercial-jhoel-api/src/database/migrations/1758900000000-AddDayReopeningAndAudit.ts) (`comercial-jhoel-api/src/database/migrations/1758900000000-AddDayReopeningAndAudit.ts`, 400 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Gestión de Días Cerrados" — reapertura controlada, recierre y anulación de un ciclo ya cerrado, más su auditoría.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `reopen_agent_day`, `cancel_agent_day`, `close_agent_day`; 

#### Clase `AddDayReopeningAndAudit1758900000000` (L30–399)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Gestión de Días Cerrados" — reapertura controlada, recierre y anulación de un ciclo ya cerrado, más su auditoría. Puramente aditivo: columnas nuevas NULLABLE (o `DEFAULT false`) en `day_openings`, tabla nueva `day_audit_logs`. Ningún dato existente se toca ni se borra. `reopened_at`/`reopened_by`/`reopen_reason` NUNCA se limpian al volver a cerrar — quedan como marca permanente de "este ciclo fue reabierto al menos una vez", que es exactamente lo que `GetDayStatusUseCase` necesita para distinguir `REOPENED` de `OPENED` sin un estado paralelo. Reabrir simplemente vuelve a poner `closed_at = NULL`, así que `SaveBankBalancesUseCase`/`CloseAgentDayUseCase` (que solo preguntan `closed_at IS NOT NULL`) vuelven a permitir edición/cierre sin ningún cambio en su propia lógica — ver `reopen_agent_day` más abajo. `is_cancelled`/`cancelled_at`/`cancelled_by`/`cancel_reason` son el soft delete de "A

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 33–321 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 323–398 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddDayReopeningAndAudit1758900000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758900000000-AddDayReopeningAndAudit.ts](../../../../comercial-jhoel-api/src/database/migrations/1758900000000-AddDayReopeningAndAudit.ts#L33) (L33–321)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumns`, `new TableColumn`, `queryRunner.query`, `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`
- **Efectos secundarios:** Tablas en su SQL: `v_day`, `day_openings`, `v_later_count`, `v_log_id`, `v_day_opening`, `v_active_banks_count`, `banks`, `v_balances_count`, `bank_balances`, `v_reconciliation_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddDayReopeningAndAudit1758900000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1758900000000-AddDayReopeningAndAudit.ts](../../../../comercial-jhoel-api/src/database/migrations/1758900000000-AddDayReopeningAndAudit.ts#L323) (L323–398)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`, `queryRunner.dropColumns`
- **Efectos secundarios:** Tablas en su SQL: `v_day_opening`, `day_openings`, `v_active_banks_count`, `banks`, `v_balances_count`, `bank_balances`, `v_reconciliation_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1758900100000-fixlaterdaycheckincludesreopened-ts"></a>

### 1758900100000-FixLaterDayCheckIncludesReopened.ts

- **Ruta:** [1758900100000-FixLaterDayCheckIncludesReopened.ts](../../../../comercial-jhoel-api/src/database/migrations/1758900100000-FixLaterDayCheckIncludesReopened.ts) (`comercial-jhoel-api/src/database/migrations/1758900100000-FixLaterDayCheckIncludesReopened.ts`, 142 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Corrige `reopen_agent_day`/`cancel_agent_day`: la regla de días posteriores (Opción A) comparaba solo `closed_at IS NOT NULL`, lo que dejaba pasar una fecha posterior que está actualmente `REOPENED` (`closed_at` vuelve a `NULL` mientras está reabierta) como si no existiera ningún día posterior gestionado — exactamente el hueco que esta regla existe para cerrar.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `reopen_agent_day`, `cancel_agent_day`; 

#### Clase `FixLaterDayCheckIncludesReopened1758900100000` (L15–141)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Corrige `reopen_agent_day`/`cancel_agent_day`: la regla de días posteriores (Opción A) comparaba solo `closed_at IS NOT NULL`, lo que dejaba pasar una fecha posterior que está actualmente `REOPENED` (`closed_at` vuelve a `NULL` mientras está reabierta) como si no existiera ningún día posterior gestionado — exactamente el hueco que esta regla existe para cerrar. Un día `REOPENED` sigue representando un ciclo ya completado en algún momento (tiene `reopened_at` seteado), así que también debe bloquear. Encontrado durante las pruebas de este mismo ticket, antes de que ningún dato real dependiera del comportamiento anterior — `CREATE OR REPLACE FUNCTION`, sin tocar ninguna tabla ni dato.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 18–133 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 135–140 | — | `Promise<void>` |

##### `FixLaterDayCheckIncludesReopened1758900100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1758900100000-FixLaterDayCheckIncludesReopened.ts](../../../../comercial-jhoel-api/src/database/migrations/1758900100000-FixLaterDayCheckIncludesReopened.ts#L18) (L18–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_day`, `day_openings`, `v_later_count`, `v_log_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FixLaterDayCheckIncludesReopened1758900100000.down`

- **Firma:** `down(): Promise<void>` — [1758900100000-FixLaterDayCheckIncludesReopened.ts](../../../../comercial-jhoel-api/src/database/migrations/1758900100000-FixLaterDayCheckIncludesReopened.ts#L135) (L135–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759000000000-createrechargedayopenings-ts"></a>

### 1759000000000-CreateRechargeDayOpenings.ts

- **Ruta:** [1759000000000-CreateRechargeDayOpenings.ts](../../../../comercial-jhoel-api/src/database/migrations/1759000000000-CreateRechargeDayOpenings.ts) (`comercial-jhoel-api/src/database/migrations/1759000000000-CreateRechargeDayOpenings.ts`, 343 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Apertura del Día" / "Cierre del Día" / "Gestión de Días Cerrados" para Recargas Electrónicas — a fully independent day-lifecycle cycle for this module, deliberately NOT sharing Banks' own `day_openings`/ `day_audit_logs` tables.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `close_recharge_day`, `reopen_recharge_day`, `cancel_recharge_day`; 

#### Clase `CreateRechargeDayOpenings1759000000000` (L29–342)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Apertura del Día" / "Cierre del Día" / "Gestión de Días Cerrados" para Recargas Electrónicas — a fully independent day-lifecycle cycle for this module, deliberately NOT sharing Banks' own `day_openings`/ `day_audit_logs` tables. Reuse was considered and rejected: `day_openings` has a bare `UNIQUE (date)` with no module discriminator column, so a Recargas "day open" for a given date would collide with a Banks "day open" for that same date if the same row were shared — the two modules must be able to open/close independently for the same calendar date. This migration is the greenfield equivalent of Banks' own three historical migrations (`CreateDayOpenings`, `AddDayClosingToDayOpenings`, `AddDayReopeningAndAudit`) combined into one, since there's no existing data here to migrate incrementally. One deliberate design difference from Banks, confirmed with the product owner before implementin

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 32–327 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 329–341 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateRechargeDayOpenings1759000000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759000000000-CreateRechargeDayOpenings.ts](../../../../comercial-jhoel-api/src/database/migrations/1759000000000-CreateRechargeDayOpenings.ts#L32) (L32–327)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_day`, `recharge_day_openings`, `v_closure_count`, `recharge_sales_closures`, `v_later_count`, `v_log_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateRechargeDayOpenings1759000000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1759000000000-CreateRechargeDayOpenings.ts](../../../../comercial-jhoel-api/src/database/migrations/1759000000000-CreateRechargeDayOpenings.ts#L329) (L329–341)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759000100000-addrechargedaygatetowritefunctions-ts"></a>

### 1759000100000-AddRechargeDayGateToWriteFunctions.ts

- **Ruta:** [1759000100000-AddRechargeDayGateToWriteFunctions.ts](../../../../comercial-jhoel-api/src/database/migrations/1759000100000-AddRechargeDayGateToWriteFunctions.ts) (`comercial-jhoel-api/src/database/migrations/1759000100000-AddRechargeDayGateToWriteFunctions.ts`, 397 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Gates every Recargas write function behind `recharge_day_openings` being open for that date — see `1759000000000-CreateRechargeDayOpenings`'s own doc comment for the full day-lifecycle design.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_recharge_purchase`, `register_recharge_sale`, `update_recharge_sale`, `delete_recharge_sale`, `register_recharge_final_balance`, `register_recharge_sales_closure`; 

#### Clase `AddRechargeDayGateToWriteFunctions1759000100000` (L29–396)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Gates every Recargas write function behind `recharge_day_openings` being open for that date — see `1759000000000-CreateRechargeDayOpenings`'s own doc comment for the full day-lifecycle design. Each function below gets `CREATE OR REPLACE` with exactly one new guard clause added (`RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%'` when that date's `recharge_day_openings.closed_at IS NOT NULL`); every other line is byte-for-byte unchanged from the current, already-shipped version. This is the *sole* enforcement for `update_recharge_sale`/ `delete_recharge_sale` — those two use cases deliberately have no application-layer pre-check today (see their own doc comments: relying entirely on the SQL function's row lock avoids a TOCTOU gap), so the guard is added here rather than retrofitting a pre-check that would change that intentional design. The other four functions also get an equivalent pre-check in t

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 32–384 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 386–395 | — | `Promise<void>` |

##### `AddRechargeDayGateToWriteFunctions1759000100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759000100000-AddRechargeDayGateToWriteFunctions.ts](../../../../comercial-jhoel-api/src/database/migrations/1759000100000-AddRechargeDayGateToWriteFunctions.ts#L32) (L32–384)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_type`, `recharge_types`, `v_day_closed_at`, `recharge_day_openings`, `v_final_balance`, `recharge_daily_balances`, `v_sale_id`, `v_daily_balance_id`, `recharge_sales`, `v_daily_balance`, `v_type_sales`, `v_closure_id`, `recharge_sales_closures`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddRechargeDayGateToWriteFunctions1759000100000.down`

- **Firma:** `down(): Promise<void>` — [1759000100000-AddRechargeDayGateToWriteFunctions.ts](../../../../comercial-jhoel-api/src/database/migrations/1759000100000-AddRechargeDayGateToWriteFunctions.ts#L386) (L386–395)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759100000000-setdatabasetimezone-ts"></a>

### 1759100000000-SetDatabaseTimezone.ts

- **Ruta:** [1759100000000-SetDatabaseTimezone.ts](../../../../comercial-jhoel-api/src/database/migrations/1759100000000-SetDatabaseTimezone.ts) (`comercial-jhoel-api/src/database/migrations/1759100000000-SetDatabaseTimezone.ts`, 49 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Sets the database's own default session timezone to `America/Guatemala` — until now, nothing anywhere in this stack (this migration, `data-source.ts`, `app.module.ts`'s `TypeOrmModule.forRootAsync`, or `docker-compose.yml`) ever configured a timezone, so both the `postgres:16-alpine` container and the `api` container ran on their bare-image default, UTC.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `SetDatabaseTimezone1759100000000` (L32–48)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sets the database's own default session timezone to `America/Guatemala` — until now, nothing anywhere in this stack (this migration, `data-source.ts`, `app.module.ts`'s `TypeOrmModule.forRootAsync`, or `docker-compose.yml`) ever configured a timezone, so both the `postgres:16-alpine` container and the `api` container ran on their bare-image default, UTC. Every date-lifecycle module (Banks, Recargas) computes "today" via a `todayIsoDate()` helper that correctly uses LOCAL `Date` getters (never `getUTC*`) specifically so it would follow the server's real timezone — but with no timezone actually configured, "local" silently meant UTC, six hours ahead of `America/Guatemala`. That created a real, reproducible ~6-hour daily window (18:00–23:59 Guatemala time) where the backend and Postgres had already rolled to the next calendar day while a Guatemala-based user still considered it "today" — ve

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 35–40 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 42–47 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `SetDatabaseTimezone1759100000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759100000000-SetDatabaseTimezone.ts](../../../../comercial-jhoel-api/src/database/migrations/1759100000000-SetDatabaseTimezone.ts#L35) (L35–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SetDatabaseTimezone1759100000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1759100000000-SetDatabaseTimezone.ts](../../../../comercial-jhoel-api/src/database/migrations/1759100000000-SetDatabaseTimezone.ts#L42) (L42–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759200000000-splitrechargepurchasecreditedamount-ts"></a>

### 1759200000000-SplitRechargePurchaseCreditedAmount.ts

- **Ruta:** [1759200000000-SplitRechargePurchaseCreditedAmount.ts](../../../../comercial-jhoel-api/src/database/migrations/1759200000000-SplitRechargePurchaseCreditedAmount.ts) (`comercial-jhoel-api/src/database/migrations/1759200000000-SplitRechargePurchaseCreditedAmount.ts`, 184 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Registrar Compra" separa el monto en dos conceptos: `amount` (ya existente, ahora "monto de compra" — puramente informativo, NUNCA afecta el saldo) y el nuevo `credited_amount` ("monto acreditado" — el único valor que suma a `recharge_daily_balances.daily_balance`).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_recharge_purchase`; 

#### Clase `SplitRechargePurchaseCreditedAmount1759200000000` (L30–183)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Registrar Compra" separa el monto en dos conceptos: `amount` (ya existente, ahora "monto de compra" — puramente informativo, NUNCA afecta el saldo) y el nuevo `credited_amount` ("monto acreditado" — el único valor que suma a `recharge_daily_balances.daily_balance`). Puramente aditivo: no se renombra ni se elimina ninguna columna existente, y todo registro histórico se conserva intacto. Backfill: para cada fila ya existente, `credited_amount = amount` — esto es exacto, no un placeholder arbitrario, porque antes de este ticket el monto completo de cada compra SÍ era lo que se acreditaba al saldo (no existía la distinción). El saldo (`daily_balance`) de cada ciclo ya refleja exactamente esa suma histórica, así que este backfill no cambia ningún cálculo pasado. `register_recharge_purchase` cambia de firma (4 parámetros → 5) — un `CREATE OR REPLACE` con distinto número de parámetros crearía 

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 33–112 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 114–182 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `SplitRechargePurchaseCreditedAmount1759200000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759200000000-SplitRechargePurchaseCreditedAmount.ts](../../../../comercial-jhoel-api/src/database/migrations/1759200000000-SplitRechargePurchaseCreditedAmount.ts#L33) (L33–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `recharge_purchases`, `v_type`, `recharge_types`, `v_day_closed_at`, `recharge_day_openings`, `v_final_balance`, `recharge_daily_balances`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SplitRechargePurchaseCreditedAmount1759200000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1759200000000-SplitRechargePurchaseCreditedAmount.ts](../../../../comercial-jhoel-api/src/database/migrations/1759200000000-SplitRechargePurchaseCreditedAmount.ts#L114) (L114–182)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_type`, `recharge_types`, `v_day_closed_at`, `recharge_day_openings`, `v_final_balance`, `recharge_daily_balances`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759300000000-createrechargesims-ts"></a>

### 1759300000000-CreateRechargeSims.ts

- **Ruta:** [1759300000000-CreateRechargeSims.ts](../../../../comercial-jhoel-api/src/database/migrations/1759300000000-CreateRechargeSims.ts) (`comercial-jhoel-api/src/database/migrations/1759300000000-CreateRechargeSims.ts`, 430 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** SIM Claro / SIM Tigo — physical, stock-tracked products administered EXCLUSIVELY from Recargas Electrónicas, never from the general `products`/Inventario/Compras/Ventas modules (confirmed by direct code read before writing this migration: `GET /products` has no default exclusion, `InventoryPageCompo
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `ensure_recharge_sim_daily_stock`, `register_recharge_sim_purchase`, `register_recharge_sim_sale`; 

#### Clase `CreateRechargeSims1759300000000` (L33–429)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** SIM Claro / SIM Tigo — physical, stock-tracked products administered EXCLUSIVELY from Recargas Electrónicas, never from the general `products`/Inventario/Compras/Ventas modules (confirmed by direct code read before writing this migration: `GET /products` has no default exclusion, `InventoryPageComponent` fetches unconditionally, and `confirm_sale`/`confirm_purchase` operate on `products.stock` with no business/category scoping — a SIM row living in `products` would be exposed to all of that with zero extra code. See Heladería's `ice_creams` table for the proven precedent of a fully independent physical-product family with its own stock/stored functions). Deliberately lives inside THIS module (not a new one) so it can reuse, with zero new code, the exact same day-lifecycle gate every other Recargas write function already uses: `recharge_day_openings.closed_at`. This means "Gestión de Días

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 36–412 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 414–428 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateRechargeSims1759300000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759300000000-CreateRechargeSims.ts](../../../../comercial-jhoel-api/src/database/migrations/1759300000000-CreateRechargeSims.ts#L36) (L36–412)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_id`, `recharge_sim_daily_stock`, `v_previous`, `v_type`, `recharge_sim_types`, `v_day_closed_at`, `recharge_day_openings`, `v_current_stock`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateRechargeSims1759300000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1759300000000-CreateRechargeSims.ts](../../../../comercial-jhoel-api/src/database/migrations/1759300000000-CreateRechargeSims.ts#L414) (L414–428)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759400000000-createinventorylocationsandpresentations-ts"></a>

### 1759400000000-CreateInventoryLocationsAndPresentations.ts

- **Ruta:** [1759400000000-CreateInventoryLocationsAndPresentations.ts](../../../../comercial-jhoel-api/src/database/migrations/1759400000000-CreateInventoryLocationsAndPresentations.ts) (`comercial-jhoel-api/src/database/migrations/1759400000000-CreateInventoryLocationsAndPresentations.ts`, 936 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Evolves Inventario from "producto → stock global" to "producto → presentaciones → ubicaciones → stock".
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `ensure_product_presentation`, `ensure_inventory_stock_row`, `confirm_purchase`, `adjust_sale_item`, `cancel_open_sale`, `confirm_open_sale`, `confirm_sale`, `register_inventory_transfer`; 

#### Clase `CreateInventoryLocationsAndPresentations1759400000000` (L43–935)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Evolves Inventario from "producto → stock global" to "producto → presentaciones → ubicaciones → stock". Purely additive: no existing table is dropped, no existing row is deleted or overwritten destructively. `products.stock` is KEPT — it remains the running total, now equal to `SUM(inventory_stock.quantity)` for that product, updated in lockstep by every function below — so every existing reader of `products.stock` (GET /products, Reportería's product-name resolution, etc.) keeps working unchanged. New tables: - `inventory_locations` — extensible list of stock locations, seeded with "Bodega"/"Vitrina". Adding a third location later is a plain INSERT, never a code/migration change. - `product_presentations` — per-product configurable unit ("Unidad", "Caja", "Paquete", ...), each with its own conversion factor to base units and its own cost/public price. Every existing product gets an auto

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 46–925 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 927–934 | — | `Promise<void>` |

##### `CreateInventoryLocationsAndPresentations1759400000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759400000000-CreateInventoryLocationsAndPresentations.ts](../../../../comercial-jhoel-api/src/database/migrations/1759400000000-CreateInventoryLocationsAndPresentations.ts#L46) (L46–925)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `ensure_inventory_stock_row`; Tablas en su SQL: `products`, `inventory_locations`, `v_presentation`, `product_presentations`, `v_bodega_id`, `v_supplier`, `suppliers`, `v_purchase_id`, `v_product`, `v_unidad_id`, `inventory_stock`, `purchases`, `v_sale_id`, `sales`, `v_location_id`, `v_detail`, `sale_details`, `v_current_location_stock`, `v_vitrina_id`, `v_from`, `v_to`, `v_from_stock`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateInventoryLocationsAndPresentations1759400000000.down`

- **Firma:** `down(): Promise<void>` — [1759400000000-CreateInventoryLocationsAndPresentations.ts](../../../../comercial-jhoel-api/src/database/migrations/1759400000000-CreateInventoryLocationsAndPresentations.ts#L927) (L927–934)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759500000000-addwholesalepricingtosales-ts"></a>

### 1759500000000-AddWholesalePricingToSales.ts

- **Ruta:** [1759500000000-AddWholesalePricingToSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1759500000000-AddWholesalePricingToSales.ts) (`comercial-jhoel-api/src/database/migrations/1759500000000-AddWholesalePricingToSales.ts`, 330 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Venta por mayor" — lets a sale be tagged with an optional client and a price list (`PUBLIC`/`WHOLESALE`), chosen once at the start of the sale and locked once the receipt has any line item.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `configure_open_sale`, `adjust_sale_item`, `confirm_sale`; 

#### Clase `AddWholesalePricingToSales1759500000000` (L21–329)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Venta por mayor" — lets a sale be tagged with an optional client and a price list (`PUBLIC`/`WHOLESALE`), chosen once at the start of the sale and locked once the receipt has any line item. Purely additive: no existing table is dropped, no existing row is touched — historical and in-progress sales default to `price_list = 'PUBLIC'`, `client_id = NULL`, byte-identical to today's actual (implicit) behavior. `products.wholesale_price` already existed (required at product creation) but was never read by any sale function — `adjust_sale_item` and `confirm_sale` only ever charged `public_price`. This migration is what makes `wholesale_price` actually mean something, and only for the base "Unidad" presentation — a line sold by a presentation (Caja, Paquete...) keeps using that presentation's own `public_price` regardless of the sale's price list, by deliberate scope decision (presentations are

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 24–320 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 322–328 | — | `Promise<void>` |

##### `AddWholesalePricingToSales1759500000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759500000000-AddWholesalePricingToSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1759500000000-AddWholesalePricingToSales.ts#L24) (L24–320)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `ensure_inventory_stock_row`, `jsonb_array_elements`; Tablas en su SQL: `v_sale_id`, `sales`, `sale_details`, `v_has_items`, `p_price_list`, `v_product`, `products`, `v_location_id`, `inventory_locations`, `v_detail`, `v_current_location_stock`, `inventory_stock`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddWholesalePricingToSales1759500000000.down`

- **Firma:** `down(): Promise<void>` — [1759500000000-AddWholesalePricingToSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1759500000000-AddWholesalePricingToSales.ts#L322) (L322–328)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759600000000-createtransactionbanksandbankdeposits-ts"></a>

### 1759600000000-CreateTransactionBanksAndBankDeposits.ts

- **Ruta:** [1759600000000-CreateTransactionBanksAndBankDeposits.ts](../../../../comercial-jhoel-api/src/database/migrations/1759600000000-CreateTransactionBanksAndBankDeposits.ts) (`comercial-jhoel-api/src/database/migrations/1759600000000-CreateTransactionBanksAndBankDeposits.ts`, 373 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Migración TypeORM: declara `CreateTransactionBanksAndBankDeposits1759600000000` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_bank_deposit_operation`; 

#### Clase `CreateTransactionBanksAndBankDeposits1759600000000` (L3–372)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 6–361 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 363–371 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateTransactionBanksAndBankDeposits1759600000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759600000000-CreateTransactionBanksAndBankDeposits.ts](../../../../comercial-jhoel-api/src/database/migrations/1759600000000-CreateTransactionBanksAndBankDeposits.ts#L6) (L6–361)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`; Tablas en su SQL: `v_bank`, `transaction_banks`, `v_operation_id`, `bank_deposit_operations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateTransactionBanksAndBankDeposits1759600000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1759600000000-CreateTransactionBanksAndBankDeposits.ts](../../../../comercial-jhoel-api/src/database/migrations/1759600000000-CreateTransactionBanksAndBankDeposits.ts#L363) (L363–371)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759700000000-addclientnametobankdepositoperations-ts"></a>

### 1759700000000-AddClientNameToBankDepositOperations.ts

- **Ruta:** [1759700000000-AddClientNameToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1759700000000-AddClientNameToBankDepositOperations.ts) (`comercial-jhoel-api/src/database/migrations/1759700000000-AddClientNameToBankDepositOperations.ts`, 259 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Nombre de Cliente" — a free-text field on a Transaccionar deposit, typed by whoever registers it, never looked up against `clients` (that table models accounts-receivable customers, a different concept entirely — Transaccionar's "cliente" is just a label for whose deposit this was).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_bank_deposit_operation`; 

#### Clase `AddClientNameToBankDepositOperations1759700000000` (L11–258)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Nombre de Cliente" — a free-text field on a Transaccionar deposit, typed by whoever registers it, never looked up against `clients` (that table models accounts-receivable customers, a different concept entirely — Transaccionar's "cliente" is just a label for whose deposit this was). Nullable and optional everywhere, same as `products.sku`: not every deposit will have one recorded.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 14–142 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 144–257 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddClientNameToBankDepositOperations1759700000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759700000000-AddClientNameToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1759700000000-AddClientNameToBankDepositOperations.ts#L14) (L14–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumn`, `new TableColumn`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`; Tablas en su SQL: `v_bank`, `transaction_banks`, `v_operation_id`, `bank_deposit_operations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddClientNameToBankDepositOperations1759700000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1759700000000-AddClientNameToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1759700000000-AddClientNameToBankDepositOperations.ts#L144) (L144–257)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropColumn`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`; Tablas en su SQL: `v_bank`, `transaction_banks`, `v_operation_id`, `bank_deposit_operations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759800000000-addtransactiontypestobankdeposits-ts"></a>

### 1759800000000-AddTransactionTypesToBankDeposits.ts

- **Ruta:** [1759800000000-AddTransactionTypesToBankDeposits.ts](../../../../comercial-jhoel-api/src/database/migrations/1759800000000-AddTransactionTypesToBankDeposits.ts) (`comercial-jhoel-api/src/database/migrations/1759800000000-AddTransactionTypesToBankDeposits.ts`, 362 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Tipo de Transacción" — Depósito, Retiro, Desembolso Préstamo, Pago Cheque, Pago Préstamos, Pago Tarjeta de Crédito, etc.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_bank_deposit_operation`; 

#### Clase `AddTransactionTypesToBankDeposits1759800000000` (L19–361)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Tipo de Transacción" — Depósito, Retiro, Desembolso Préstamo, Pago Cheque, Pago Préstamos, Pago Tarjeta de Crédito, etc. Picked on Transaccionar's own dashboard *before* a deposit registration begins — every `bank_deposit_operations` row from here on must carry one (`transaction_type_id NOT NULL`), same reasoning as `transaction_bank_id`. A flat clone of `transaction_banks`/`account_types`, plus one addition: `icon`, a key into the frontend's shared icon registry, rendered on the dashboard's type cards.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 22–232 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 234–360 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddTransactionTypesToBankDeposits1759800000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759800000000-AddTransactionTypesToBankDeposits.ts](../../../../comercial-jhoel-api/src/database/migrations/1759800000000-AddTransactionTypesToBankDeposits.ts#L22) (L22–232)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.addColumn`, `new TableColumn`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`; Tablas en su SQL: `v_bank`, `transaction_banks`, `v_transaction_type`, `transaction_types`, `v_operation_id`, `bank_deposit_operations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddTransactionTypesToBankDeposits1759800000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1759800000000-AddTransactionTypesToBankDeposits.ts](../../../../comercial-jhoel-api/src/database/migrations/1759800000000-AddTransactionTypesToBankDeposits.ts#L234) (L234–360)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropIndex`, `queryRunner.dropColumn`, `queryRunner.dropTable`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`; Tablas en su SQL: `v_bank`, `transaction_banks`, `v_operation_id`, `bank_deposit_operations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1759900000000-addvoidtobankdepositoperations-ts"></a>

### 1759900000000-AddVoidToBankDepositOperations.ts

- **Ruta:** [1759900000000-AddVoidToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1759900000000-AddVoidToBankDepositOperations.ts) (`comercial-jhoel-api/src/database/migrations/1759900000000-AddVoidToBankDepositOperations.ts`, 63 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Anular" a Transaccionar operation — the correction mechanism for a mistaken registration, deliberately NOT an edit and NOT a physical DELETE (same philosophy as `cancel_agent_day`/every other soft-delete in this codebase: a financial record is never rewritten or removed, only marked).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddVoidToBankDepositOperations1759900000000` (L24–62)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Anular" a Transaccionar operation — the correction mechanism for a mistaken registration, deliberately NOT an edit and NOT a physical DELETE (same philosophy as `cancel_agent_day`/every other soft-delete in this codebase: a financial record is never rewritten or removed, only marked). Purely additive: every existing row defaults to `is_voided = false`, byte-identical to today's actual (implicit) behavior — nothing is backfilled beyond that default. A voided operation is NOT deleted and NOT hidden from the operations list — it stays visible (with a status badge on the frontend) for audit purposes, it is only excluded from Reportería's summary/aggregate totals (see `TypeOrmBankDepositRepository.getReportSummary`), the same way a CANCELLED day doesn't count toward Cuadre de Agentes' own totals. No stored function needed for the void action itself — "does this operation exist, is it already

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 27–46 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 48–61 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddVoidToBankDepositOperations1759900000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1759900000000-AddVoidToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1759900000000-AddVoidToBankDepositOperations.ts#L27) (L27–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddVoidToBankDepositOperations1759900000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1759900000000-AddVoidToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1759900000000-AddVoidToBankDepositOperations.ts#L48) (L48–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000000000-addcreditpaymenttopurchases-ts"></a>

### 1760000000000-AddCreditPaymentToPurchases.ts

- **Ruta:** [1760000000000-AddCreditPaymentToPurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000000000-AddCreditPaymentToPurchases.ts) (`comercial-jhoel-api/src/database/migrations/1760000000000-AddCreditPaymentToPurchases.ts`, 353 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Tipo de compra" — Contado / Crédito — the prerequisite for the new payment-due alert.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `confirm_purchase`; 

#### Clase `AddCreditPaymentToPurchases1760000000000` (L23–352)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Tipo de compra" — Contado / Crédito — the prerequisite for the new payment-due alert. Purely additive: every existing purchase is backfilled to `payment_type = 'CONTADO'`, `payment_status = 'PAID'`, `payment_due_date = NULL` — a historical purchase with no credit information was, in fact, paid in full at the time (there is no real "unspecified" state to invent), so this is the one honest default rather than a fabricated "NO_ESPECIFICADO" status. No row's `total`/items/dates are touched. `payment_status` deliberately only ever stores `'PENDING' \| 'PAID'` — "VENCIDA" (overdue) is NEVER a stored value. It's derived at read time (`payment_status = 'PENDING' AND payment_due_date &lt; today`) by the Alerts module — same "derive, don't duplicate" choice this codebase already makes for Recargas' own `totalPurchases`/`sale` getters. Storing a third "OVERDUE" status would need a daily cron/job to fl

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 26–222 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 224–351 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddCreditPaymentToPurchases1760000000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000000000-AddCreditPaymentToPurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000000000-AddCreditPaymentToPurchases.ts#L26) (L26–222)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.createIndex`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `ensure_inventory_stock_row`; Tablas en su SQL: `purchases`, `v_bodega_id`, `inventory_locations`, `v_supplier`, `suppliers`, `v_purchase_id`, `v_product`, `products`, `v_unidad_id`, `product_presentations`, `inventory_stock`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddCreditPaymentToPurchases1760000000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760000000000-AddCreditPaymentToPurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000000000-AddCreditPaymentToPurchases.ts#L224) (L224–351)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropIndex`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `ensure_inventory_stock_row`; Tablas en su SQL: `v_bodega_id`, `inventory_locations`, `v_supplier`, `suppliers`, `v_purchase_id`, `v_product`, `products`, `v_unidad_id`, `product_presentations`, `inventory_stock`, `purchases`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000100000-addminstocktoinventorystock-ts"></a>

### 1760000100000-AddMinStockToInventoryStock.ts

- **Ruta:** [1760000100000-AddMinStockToInventoryStock.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000100000-AddMinStockToInventoryStock.ts) (`comercial-jhoel-api/src/database/migrations/1760000100000-AddMinStockToInventoryStock.ts`, 34 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Stock mínimo" per (product, location) — the prerequisite for the low-inventory alert.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddMinStockToInventoryStock1760000100000` (L15–33)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Stock mínimo" per (product, location) — the prerequisite for the low-inventory alert. Added directly to `inventory_stock` rather than a new table: that table is already exactly the grain needed (one row per product×location, guaranteed to exist for every active product via `InventoryStockRepository.createInitial()`), so a new table would just be a redundant one-to-one shadow of an existing one. Every existing row defaults to `min_stock = 0`, which the Alerts module treats as "no threshold configured, never alert for this row" — byte-identical to today's actual (no alert) behavior for every product until an admin explicitly sets a real minimum.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 18–24 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 26–32 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddMinStockToInventoryStock1760000100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000100000-AddMinStockToInventoryStock.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000100000-AddMinStockToInventoryStock.ts#L18) (L18–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddMinStockToInventoryStock1760000100000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760000100000-AddMinStockToInventoryStock.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000100000-AddMinStockToInventoryStock.ts#L26) (L26–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000200000-addminbalancetorechargetypes-ts"></a>

### 1760000200000-AddMinBalanceToRechargeTypes.ts

- **Ruta:** [1760000200000-AddMinBalanceToRechargeTypes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000200000-AddMinBalanceToRechargeTypes.ts) (`comercial-jhoel-api/src/database/migrations/1760000200000-AddMinBalanceToRechargeTypes.ts`, 33 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Saldo mínimo" per recharge type (Claro/Tigo, extensible) — the prerequisite for the low-recharge-balance alert.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddMinBalanceToRechargeTypes1760000200000` (L14–32)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Saldo mínimo" per recharge type (Claro/Tigo, extensible) — the prerequisite for the low-recharge-balance alert. Added directly to `recharge_types` rather than a separate settings table: it's already the one row per operator, and a third operator later just gets its own `min_balance` on its own seeded row, no schema change needed — same "config lives on the entity it configures" choice already made for `inventory_stock.min_stock`. Defaults to `0`, which the Alerts module treats as "no threshold configured, never alert" — identical to today's actual (no alert) behavior until an admin sets a real minimum.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 17–23 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 25–31 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddMinBalanceToRechargeTypes1760000200000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000200000-AddMinBalanceToRechargeTypes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000200000-AddMinBalanceToRechargeTypes.ts#L17) (L17–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddMinBalanceToRechargeTypes1760000200000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760000200000-AddMinBalanceToRechargeTypes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000200000-AddMinBalanceToRechargeTypes.ts#L25) (L25–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000300000-createalertsettings-ts"></a>

### 1760000300000-CreateAlertSettings.ts

- **Ruta:** [1760000300000-CreateAlertSettings.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000300000-CreateAlertSettings.ts) (`comercial-jhoel-api/src/database/migrations/1760000300000-CreateAlertSettings.ts`, 61 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** A genuine singleton table — always exactly one row, seeded here.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateAlertSettings1760000300000` (L13–60)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** A genuine singleton table — always exactly one row, seeded here. Holds the ONE truly-global alert setting this ticket needs (`purchase_payment_alert_days`, no per-entity home to live on the way `min_stock`/`min_balance` live on their own owning tables). Deliberately NOT a generic key-value settings table — that would be solving a problem this ticket doesn't have yet (only one global scalar exists today); a second global setting later is just one more column on this same row, not a schema redesign.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 16–55 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 57–59 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateAlertSettings1760000300000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000300000-CreateAlertSettings.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000300000-CreateAlertSettings.ts#L16) (L16–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateAlertSettings1760000300000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760000300000-CreateAlertSettings.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000300000-CreateAlertSettings.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000400000-createalertreadmarks-ts"></a>

### 1760000400000-CreateAlertReadMarks.ts

- **Ruta:** [1760000400000-CreateAlertReadMarks.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000400000-CreateAlertReadMarks.ts) (`comercial-jhoel-api/src/database/migrations/1760000400000-CreateAlertReadMarks.ts`, 56 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Leída" state for the centralized alerts panel.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateAlertReadMarks1760000400000` (L22–55)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Leída" state for the centralized alerts panel. Alerts themselves are NEVER persisted rows — they're computed live, every request, from `purchases`/`inventory_stock`/`recharge_types`+`recharge_daily_balances` (see `modules/alerts/`'s own doc comment) — so there is nothing here to store about an alert except "did this user already see this one." Each alert has a stable, deterministic `alert_key` (e.g. `purchase:&lt;purchaseId&gt;`, `inventory:&lt;productId&gt;:&lt;locationId&gt;`, `recharge:&lt;rechargeTypeId&gt;`) derived from its own source row, so marking one read survives across requests even though the alert list itself is rebuilt from scratch every time. A row here becoming orphaned (its condition resolved — the purchase got paid, the stock got restocked, the balance recovered) is harmless and expected: the alert simply stops being generated, so the row is never looked up again. No cleanup job exists for t

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 25–50 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 52–54 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateAlertReadMarks1760000400000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000400000-CreateAlertReadMarks.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000400000-CreateAlertReadMarks.ts#L25) (L25–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateAlertReadMarks1760000400000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760000400000-CreateAlertReadMarks.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000400000-CreateAlertReadMarks.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropTable`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000500000-adddraftkeytosales-ts"></a>

### 1760000500000-AddDraftKeyToSales.ts

- **Ruta:** [1760000500000-AddDraftKeyToSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000500000-AddDraftKeyToSales.ts) (`comercial-jhoel-api/src/database/migrations/1760000500000-AddDraftKeyToSales.ts`, 376 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Varias ventas a la vez" — Ventas gets the same multiple-simultaneous-draft capability Compras already has (`PurchaseDraftStore`, purely a frontend change since a Compra draft was never server-side).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `adjust_sale_item`, `cancel_open_sale`, `configure_open_sale`, `confirm_open_sale`; 

#### Clase `AddDraftKeyToSales1760000500000` (L51–375)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Varias ventas a la vez" — Ventas gets the same multiple-simultaneous-draft capability Compras already has (`PurchaseDraftStore`, purely a frontend change since a Compra draft was never server-side). Ventas is different: its draft IS a real, server-persisted `OPEN` sale, gated by `UQ_sales_open_per_user` (see `AddDraftSalesSupport`) to at most one per user — the mechanism behind real-time stock reservation. Supporting several open receipts per user therefore needs a real backend change, not just a frontend one: every "find my open sale" lookup across `adjust_sale_item`/`cancel_open_sale`/`configure_open_sale`/ `confirm_open_sale` has to disambiguate WHICH open sale, not just whose. `sales.draft_key` is a client-generated, opaque string (the frontend uses a UUID per open tab) — NULL for every `CONFIRMED` row (meaningless once a sale is real; a draft_key only ever matters while `status = '

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 54–364 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 366–374 | — | `Promise<void>` |

##### `AddDraftKeyToSales1760000500000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000500000-AddDraftKeyToSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000500000-AddDraftKeyToSales.ts#L54) (L54–364)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `ensure_inventory_stock_row`; Tablas en su SQL: `sales`, `v_sale_id`, `v_product`, `products`, `v_location_id`, `inventory_locations`, `v_detail`, `sale_details`, `v_current_location_stock`, `inventory_stock`, `v_vitrina_id`, `v_has_items`, `p_price_list`, `v_unidad_id`, `product_presentations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddDraftKeyToSales1760000500000.down`

- **Firma:** `down(): Promise<void>` — [1760000500000-AddDraftKeyToSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000500000-AddDraftKeyToSales.ts#L366) (L366–374)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000600000-createfinancialkardexcolumns-ts"></a>

### 1760000600000-CreateFinancialKardexColumns.ts

- **Ruta:** [1760000600000-CreateFinancialKardexColumns.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000600000-CreateFinancialKardexColumns.ts) (`comercial-jhoel-api/src/database/migrations/1760000600000-CreateFinancialKardexColumns.ts`, 238 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Evolves `accounts_receivable` and `assets` from flat, independently-summed entries into a real Kardex/ledger: every row is now an explicit `CARGO` or `ABONO` movement, and a client's balance is the signed running sum of their own movements.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_account_receivable_movement`, `register_asset_movement`; 

#### Clase `CreateFinancialKardexColumns1760000600000` (L40–237)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Evolves `accounts_receivable` and `assets` from flat, independently-summed entries into a real Kardex/ledger: every row is now an explicit `CARGO` or `ABONO` movement, and a client's balance is the signed running sum of their own movements. Deliberately additive to the **existing** tables — no new `_movements`/`_kardex` table — a movement already *is* a row here, it just gains a type. **`amount` stays an always-positive magnitude** (never re-interpreted) — the sign comes from `movement_type` at query time (`CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END`), never from the stored value. This is what lets a Kardex table show separate Cargo/Abono columns with zero extra computation. **No `balance_after` column, on purpose.** A stored running balance would require the history to be strictly append-only to stay correct — but `UpdateAccountReceivableUseCase`/`UpdateAssetUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 45–200 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 202–236 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateFinancialKardexColumns1760000600000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000600000-CreateFinancialKardexColumns.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000600000-CreateFinancialKardexColumns.ts#L45) (L45–200)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`; Tablas en su SQL: `assets`, `v_current_balance`, `accounts_receivable`, `v_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateFinancialKardexColumns1760000600000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760000600000-CreateFinancialKardexColumns.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000600000-CreateFinancialKardexColumns.ts#L202) (L202–236)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000700000-createpresentationtypestable-ts"></a>

### 1760000700000-CreatePresentationTypesTable.ts

- **Ruta:** [1760000700000-CreatePresentationTypesTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000700000-CreatePresentationTypesTable.ts) (`comercial-jhoel-api/src/database/migrations/1760000700000-CreatePresentationTypesTable.ts`, 165 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Introduces the master "Tipos de Presentación" catalog (Sistema → Presentaciones y Medidas) and migrates `product_presentations.name` — a plain, per-product free-text column with no cross-product normalization — into a real FK against it.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `presentation_types`; 

#### Clase `CreatePresentationTypesTable1760000700000` (L26–164)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Introduces the master "Tipos de Presentación" catalog (Sistema → Presentaciones y Medidas) and migrates `product_presentations.name` — a plain, per-product free-text column with no cross-product normalization — into a real FK against it. This is what stops "Caja"/"caja"/" CAJA "/ "Cajas" from ever becoming separate, uncoordinated values again. **Non-destructive by construction**: every existing `product_presentations` row already has a `name`; this migration groups those names case-insensitively (trimmed), creates exactly one `presentation_types` row per distinct group (never inventing a name that didn't already exist), relates every row to its group's new id, and only then drops the now- redundant `name` column — the FK carries the exact same information the text column did, just normalized and reusable across products. No `DROP TABLE`/`TRUNCATE`/mass `DELETE` anywhere in this file. A `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 31–143 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 145–163 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreatePresentationTypesTable1760000700000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000700000-CreatePresentationTypesTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000700000-CreatePresentationTypesTable.ts#L31) (L31–143)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `presentation_types`, `users`, `product_presentations`, `v_unmapped`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreatePresentationTypesTable1760000700000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760000700000-CreatePresentationTypesTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000700000-CreatePresentationTypesTable.ts#L145) (L145–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000800000-createunitsofmeasuretable-ts"></a>

### 1760000800000-CreateUnitsOfMeasureTable.ts

- **Ruta:** [1760000800000-CreateUnitsOfMeasureTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000800000-CreateUnitsOfMeasureTable.ts) (`comercial-jhoel-api/src/database/migrations/1760000800000-CreateUnitsOfMeasureTable.ts`, 107 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Introduces the master "Unidades de Medida" catalog (Sistema → Presentaciones y Medidas) and gives every product a required `unit_of_measure_id` FK — a genuinely new concept, since no unit-of- measure column, enum, or table existed anywhere in this project before (confirmed by a full-project search before writing this migration, not assumed).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `units_of_measure`; 

#### Clase `CreateUnitsOfMeasureTable1760000800000` (L22–106)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Introduces the master "Unidades de Medida" catalog (Sistema → Presentaciones y Medidas) and gives every product a required `unit_of_measure_id` FK — a genuinely new concept, since no unit-of- measure column, enum, or table existed anywhere in this project before (confirmed by a full-project search before writing this migration, not assumed). Deliberately separate from `presentation_types` (`CreatePresentationTypesTable`) — a unit of measure describes the physical unit a product is measured in (kg, L, unidad), not how it's grouped/commercialized (Caja, Paquete); the two catalogs are never mixed, per the ticket's own explicit requirement. Same non-destructive shape as `CreateBusinessesTable`'s own `business_id` rollout: seed one default row ("Unidad", every existing product had no unit before, so there is nothing to reconcile — no grouping/ambiguity question here, unlike the presentation-n

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 27–92 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 94–105 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateUnitsOfMeasureTable1760000800000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000800000-CreateUnitsOfMeasureTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000800000-CreateUnitsOfMeasureTable.ts#L27) (L27–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `units_of_measure`, `users`, `products`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateUnitsOfMeasureTable1760000800000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760000800000-CreateUnitsOfMeasureTable.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000800000-CreateUnitsOfMeasureTable.ts#L94) (L94–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760000900000-fixpresentationtypenameinstoredfunctions-ts"></a>

### 1760000900000-FixPresentationTypeNameInStoredFunctions.ts

- **Ruta:** [1760000900000-FixPresentationTypeNameInStoredFunctions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000900000-FixPresentationTypeNameInStoredFunctions.ts) (`comercial-jhoel-api/src/database/migrations/1760000900000-FixPresentationTypeNameInStoredFunctions.ts`, 255 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Hotfix: `CreatePresentationTypesTable` dropped `product_presentations.name` (replaced by `presentation_type_id`, resolved via join — see that migration's own doc comment), but three live Postgres functions still queried `product_presentations WHERE ...
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `public`; 

#### Clase `FixPresentationTypeNameInStoredFunctions1760000900000` (L28–254)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Hotfix: `CreatePresentationTypesTable` dropped `product_presentations.name` (replaced by `presentation_type_id`, resolved via join — see that migration's own doc comment), but three live Postgres functions still queried `product_presentations WHERE ... AND name = 'Unidad'` directly, a plain column reference this migration missed entirely. Confirmed live: `POST /purchases` (`confirm_purchase`) failed with `QueryFailedError: column "name" does not exist` on every attempt — caught from the real `GlobalExceptionFilter` log, not assumed. Fix: each of the three now resolves "the product's Unidad presentation" via a join to `presentation_types` instead of a bare column. Verified beforehand which functions were actually affected — `SELECT prosrc FROM pg_proc WHERE prosrc ILIKE '%product_presentations%'` — rather than guessing: `ensure_product_presentation` (the shared resolver `adjust_sale_item`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 33–244 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 253–253 | — | `Promise<void>` |

##### `FixPresentationTypeNameInStoredFunctions1760000900000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760000900000-FixPresentationTypeNameInStoredFunctions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000900000-FixPresentationTypeNameInStoredFunctions.ts#L33) (L33–244)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `ensure_inventory_stock_row`; Tablas en su SQL: `v_presentation`, `product_presentations`, `presentation_types`, `v_sale_id`, `sales`, `v_vitrina_id`, `inventory_locations`, `sale_details`, `v_unidad_id`, `v_bodega_id`, `v_supplier`, `suppliers`, `v_purchase_id`, `v_product`, `products`, `inventory_stock`, `purchases`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FixPresentationTypeNameInStoredFunctions1760000900000.down`

- **Firma:** `down(): Promise<void>` — [1760000900000-FixPresentationTypeNameInStoredFunctions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760000900000-FixPresentationTypeNameInStoredFunctions.ts#L253) (L253–253)
- **Propósito / descripción:** No down-migration — reverting would mean putting back a function body that reads a column (`product_presentations.name`) this project's own schema no longer has, which would just reintroduce the exact bug this migration exists to fix. Same "no downgrade for a correctness fix" precedent already used elsewhere in this codebase.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001000000-createdocumentsmodule-ts"></a>

### 1760001000000-CreateDocumentsModule.ts

- **Ruta:** [1760001000000-CreateDocumentsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001000000-CreateDocumentsModule.ts) (`comercial-jhoel-api/src/database/migrations/1760001000000-CreateDocumentsModule.ts`, 539 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Foundational schema for three independent, additive features: `company_settings` (a singleton, same shape as `alert_settings`, holding the branding/contact data every document PDF's letterhead needs), and two brand-new document types — `tickets`/`ticket_details` and `quotations`/`quotation_details`
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `public`; 

#### Clase `CreateDocumentsModule1760001000000` (L25–538)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Foundational schema for three independent, additive features: `company_settings` (a singleton, same shape as `alert_settings`, holding the branding/contact data every document PDF's letterhead needs), and two brand-new document types — `tickets`/`ticket_details` and `quotations`/`quotation_details` — neither of which is a real sale: no column here, and no statement in either stored function below, ever touches `products.stock`, `inventory_stock`, or `inventory_movements`. That structural absence is the entire mechanism by which a Ticket/ Cotización is guaranteed not to affect inventory — not an application-layer promise. `ticket_number`/`quotation_number` are real, persisted sequential folios (`T-000001`, `COT-000001`, via a dedicated Postgres SEQUENCE per type, atomic under concurrency by construction) — deliberately different from Sales/Purchases' own computed, non-stored `V-XXXXXXXX`/

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 28–519 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 521–537 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateDocumentsModule1760001000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001000000-CreateDocumentsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001000000-CreateDocumentsModule.ts#L28) (L28–519)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.query`, `queryRunner.createIndex`, `new TableIndex`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`; Tablas en su SQL: `clients`, `v_ticket_id`, `v_product`, `products`, `tickets`, `v_quotation_id`, `quotations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateDocumentsModule1760001000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760001000000-CreateDocumentsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001000000-CreateDocumentsModule.ts#L521) (L521–537)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001100000-addobservationtoticketdetails-ts"></a>

### 1760001100000-AddObservationToTicketDetails.ts

- **Ruta:** [1760001100000-AddObservationToTicketDetails.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001100000-AddObservationToTicketDetails.ts) (`comercial-jhoel-api/src/database/migrations/1760001100000-AddObservationToTicketDetails.ts`, 160 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Adds an optional free-text `observation` per ticket line item (e.g.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `public`; 

#### Clase `AddObservationToTicketDetails1760001100000` (L13–159)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Adds an optional free-text `observation` per ticket line item (e.g. "sin hielo", "entregar en caja 2") — purely additive, no existing column changes. `create_ticket`'s parameter list is unchanged (`p_items` already a `jsonb` array where each element can simply carry one more optional key), so a plain `CREATE OR REPLACE FUNCTION` is safe here — no `DROP FUNCTION` needed first, per this codebase's own established rule that a `DROP FUNCTION` is only required when the parameter *list* itself changes.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 18–92 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 94–158 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddObservationToTicketDetails1760001100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001100000-AddObservationToTicketDetails.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001100000-AddObservationToTicketDetails.ts#L18) (L18–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumn`, `new TableColumn`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`; Tablas en su SQL: `clients`, `v_ticket_id`, `v_product`, `products`, `tickets`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddObservationToTicketDetails1760001100000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760001100000-AddObservationToTicketDetails.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001100000-AddObservationToTicketDetails.ts#L94) (L94–158)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropColumn`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`; Tablas en su SQL: `clients`, `v_ticket_id`, `v_product`, `products`, `tickets`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001200000-addunitpriceoverridetocreateticket-ts"></a>

### 1760001200000-AddUnitPriceOverrideToCreateTicket.ts

- **Ruta:** [1760001200000-AddUnitPriceOverrideToCreateTicket.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001200000-AddUnitPriceOverrideToCreateTicket.ts) (`comercial-jhoel-api/src/database/migrations/1760001200000-AddUnitPriceOverrideToCreateTicket.ts`, 108 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Lets a caller optionally override a ticket line's unit price at creation time (e.g.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `public`; 

#### Clase `AddUnitPriceOverrideToCreateTicket1760001200000` (L18–107)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Lets a caller optionally override a ticket line's unit price at creation time (e.g. a manual discount negotiated at the counter) — the override is written only into `ticket_details.unit_price` (already its own, fully independent column, same "frozen snapshot" pattern as `sale_details`/ `purchase_details`). This function never writes to `products` in any branch — the live `products.public_price` is read only as the *default* when no override is supplied, never overwritten. `create_ticket`'s parameter list is unchanged (`p_items` already a `jsonb` array where each element can simply carry one more optional key), so a plain `CREATE OR REPLACE FUNCTION` is safe here — no `DROP FUNCTION` needed first, per this codebase's own established rule that a `DROP FUNCTION` is only required when the parameter *list* itself changes.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 23–97 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 106–106 | — | `Promise<void>` |

##### `AddUnitPriceOverrideToCreateTicket1760001200000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001200000-AddUnitPriceOverrideToCreateTicket.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001200000-AddUnitPriceOverrideToCreateTicket.ts#L23) (L23–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`; Tablas en su SQL: `clients`, `v_ticket_id`, `v_product`, `products`, `tickets`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddUnitPriceOverrideToCreateTicket1760001200000.down`

- **Firma:** `down(): Promise<void>` — [1760001200000-AddUnitPriceOverrideToCreateTicket.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001200000-AddUnitPriceOverrideToCreateTicket.ts#L106) (L106–106)
- **Propósito / descripción:** Reverting would mean silently dropping support for a `unitPrice` any caller may have already started sending — not a real rollback need for an additive, backward-compatible optional field. Same "no downgrade" precedent already used elsewhere in this codebase for purely additive function changes.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001300000-createkeyboardshortcuts-ts"></a>

### 1760001300000-CreateKeyboardShortcuts.ts

- **Ruta:** [1760001300000-CreateKeyboardShortcuts.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001300000-CreateKeyboardShortcuts.ts) (`comercial-jhoel-api/src/database/migrations/1760001300000-CreateKeyboardShortcuts.ts`, 122 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Atajos de Teclado" — a new Sistema catalog, structurally a clone of `transaction_types`/`account_types` (flat CRUD, partial-unique-active name-equivalent, admin-only mutation, read open to any authenticated account — the shortcuts must be readable by every role so `KeyboardShortcutsService` can actually use them, not just admins who can manage them).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `CreateKeyboardShortcuts1760001300000` (L18–121)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Atajos de Teclado" — a new Sistema catalog, structurally a clone of `transaction_types`/`account_types` (flat CRUD, partial-unique-active name-equivalent, admin-only mutation, read open to any authenticated account — the shortcuts must be readable by every role so `KeyboardShortcutsService` can actually use them, not just admins who can manage them). Purely additive: a brand-new table, no existing table touched, no destructive change of any kind. Replaces the previous purely-frontend, hardcoded `KEYBOARD_SHORTCUTS` constant (`core/data/keyboard-shortcuts.data.ts`) as the source of truth — the one shortcut that constant declared (Alt+F12 → Inventario) is seeded here as a real row so existing behavior is preserved byte-for-byte after the frontend switches to reading from `GET /keyboard-shortcuts`.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 21–111 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 113–120 | — | `Promise<void>` |

##### `CreateKeyboardShortcuts1760001300000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001300000-CreateKeyboardShortcuts.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001300000-CreateKeyboardShortcuts.ts#L21) (L21–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `keyboard_shortcuts`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateKeyboardShortcuts1760001300000.down`

- **Firma:** `down(): Promise<void>` — [1760001300000-CreateKeyboardShortcuts.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001300000-CreateKeyboardShortcuts.ts#L113) (L113–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001400000-addchangegiventobankdepositoperations-ts"></a>

### 1760001400000-AddChangeGivenToBankDepositOperations.ts

- **Ruta:** [1760001400000-AddChangeGivenToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001400000-AddChangeGivenToBankDepositOperations.ts) (`comercial-jhoel-api/src/database/migrations/1760001400000-AddChangeGivenToBankDepositOperations.ts`, 204 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Vuelto" (change given back to the client) for Transaccionar — lets a deposit register correctly when the client hands over more cash than the operation amount (e.g.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_bank_deposit_operation`; 

#### Clase `AddChangeGivenToBankDepositOperations1760001400000` (L26–203)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Vuelto" (change given back to the client) for Transaccionar — lets a deposit register correctly when the client hands over more cash than the operation amount (e.g. a Q890 deposit paid with 9×Q100 = Q900, Q10 vuelto). Purely additive: one nullable-safe column with a `DEFAULT 0`, so every existing row is instantly and correctly `change_given = 0` — mathematically identical to "no vuelto ever existed for this row", which was already true for 100% of historical data (the old cuadre rule required `total_cash = total_amount` exactly, so no historical row could have had a real excess in the first place). `register_bank_deposit_operation` gains one new, defaulted trailing parameter (`p_change_given NUMERIC DEFAULT 0`) — its cuadre check changes from `total_cash &lt;&gt; total_amount` to `(total_cash - change_given) &lt;&gt; total_amount`, which is the *exact same* equation as before whenever `change_given

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 29–191 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 193–202 | — | `Promise<void>` |

##### `AddChangeGivenToBankDepositOperations1760001400000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001400000-AddChangeGivenToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001400000-AddChangeGivenToBankDepositOperations.ts#L29) (L29–191)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumn`, `new TableColumn`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`; Tablas en su SQL: `v_bank`, `transaction_banks`, `v_transaction_type`, `transaction_types`, `v_operation_id`, `bank_deposit_operations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddChangeGivenToBankDepositOperations1760001400000.down`

- **Firma:** `down(): Promise<void>` — [1760001400000-AddChangeGivenToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001400000-AddChangeGivenToBankDepositOperations.ts#L193) (L193–202)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001500000-addclientnametotickets-ts"></a>

### 1760001500000-AddClientNameToTickets.ts

- **Ruta:** [1760001500000-AddClientNameToTickets.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001500000-AddClientNameToTickets.ts) (`comercial-jhoel-api/src/database/migrations/1760001500000-AddClientNameToTickets.ts`, 214 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Tickets' "Cliente" field becomes free text: any name can be recorded (including one that doesn't match a real `clients` row), and — critically — it must stay frozen as historical information even if the real client's name is edited later in the Clientes catalog.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `public`; 

#### Clase `AddClientNameToTickets1760001500000` (L22–213)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Tickets' "Cliente" field becomes free text: any name can be recorded (including one that doesn't match a real `clients` row), and — critically — it must stay frozen as historical information even if the real client's name is edited later in the Clientes catalog. `TicketMapper.toDomain()` used to derive `clientName` live from the eager `client` relation (`orm.client?.name`), which violated that requirement by design: editing a client's name would silently change what every past ticket displayed. This mirrors the exact precedent already used for `ticket_details.product_name`/ `presentation_name` (frozen at creation time, never re-derived) — applied here to `tickets.client_name` instead. `create_ticket`'s parameter list changes (`p_client_name` is a new scalar parameter, not an existing jsonb key), so per this codebase's own established rule, the old 3-parameter signature must be dropped ex

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 27–128 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 130–212 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddClientNameToTickets1760001500000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001500000-AddClientNameToTickets.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001500000-AddClientNameToTickets.ts#L27) (L27–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`; Tablas en su SQL: `tickets`, `clients`, `v_client`, `v_ticket_id`, `v_product`, `products`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddClientNameToTickets1760001500000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760001500000-AddClientNameToTickets.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001500000-AddClientNameToTickets.ts#L130) (L130–212)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`; Tablas en su SQL: `clients`, `v_ticket_id`, `v_product`, `products`, `tickets`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001600000-createrechargecashboxwithdrawals-ts"></a>

### 1760001600000-CreateRechargeCashBoxWithdrawals.ts

- **Ruta:** [1760001600000-CreateRechargeCashBoxWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001600000-CreateRechargeCashBoxWithdrawals.ts) (`comercial-jhoel-api/src/database/migrations/1760001600000-CreateRechargeCashBoxWithdrawals.ts`, 189 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Caja Contable" — an accumulated cash balance for the Recargas Electrónicas y SIMs business line.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_recharge_cash_box_withdrawal`; 

#### Clase `CreateRechargeCashBoxWithdrawals1760001600000` (L27–188)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Caja Contable" — an accumulated cash balance for the Recargas Electrónicas y SIMs business line. Deliberately does NOT create a ledger table copying sales/purchases: those already exist as real, individual rows (`recharge_sales`, `recharge_sim_sales`, `recharge_purchases`, `recharge_sim_purchases`) and are read LIVE at query time by `TypeOrmRechargeCashBoxRepository` — nothing is ever duplicated into a second copy, so there is no possibility of a sale/purchase producing two Caja Contable movements. The only genuinely new kind of event is a manual "Salida de Ganancia" withdrawal, which has no other source of truth anywhere in the system — that's the only table this migration adds. `recharge_purchases.amount` ("Monto de Compra") is the column read for this — never `credited_amount` ("Monto Acreditado"), which only affects `recharge_daily_balances` and is never read by this module. Same se

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 32–180 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 182–187 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateRechargeCashBoxWithdrawals1760001600000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001600000-CreateRechargeCashBoxWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001600000-CreateRechargeCashBoxWithdrawals.ts#L32) (L32–180)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`; Tablas en su SQL: `recharge_sales`, `recharge_sim_sales`, `v_income`, `recharge_purchases`, `recharge_sim_purchases`, `recharge_cash_box_withdrawals`, `v_expense`, `v_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateRechargeCashBoxWithdrawals1760001600000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760001600000-CreateRechargeCashBoxWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001600000-CreateRechargeCashBoxWithdrawals.ts#L182) (L182–187)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001700000-addcashboxcontributionmovementtype-ts"></a>

### 1760001700000-AddCashBoxContributionMovementType.ts

- **Ruta:** [1760001700000-AddCashBoxContributionMovementType.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001700000-AddCashBoxContributionMovementType.ts) (`comercial-jhoel-api/src/database/migrations/1760001700000-AddCashBoxContributionMovementType.ts`, 210 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Aporte a Caja" — a manual cash contribution, the mirror-image income counterpart to "Salida de Ganancia" (expense).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_recharge_cash_box_movement`, `register_recharge_cash_box_withdrawal`; 

#### Clase `AddCashBoxContributionMovementType1760001700000` (L37–209)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Aporte a Caja" — a manual cash contribution, the mirror-image income counterpart to "Salida de Ganancia" (expense). Rather than a second, parallel table, this generalizes the existing withdrawals table into a single manual-movements table distinguished by `movement_type` (`CONTRIBUTION` \| `WITHDRAWAL`) — the exact same pattern already established in this codebase for Kardex financiero (`accounts_receivable`/`assets`: one table, `movement_type: 'CARGO' \| 'ABONO'`, sign derived from type — never stored as a signed amount). This table has zero rows in every environment it's been deployed to so far (built and tested only in local dev this session, never reached production), so there is nothing to backfill beyond the default. `amount` stays an always-positive magnitude (unchanged) — the sign is now determined by `movement_type` at read time (see `TypeOrmRechargeCashBoxRepository.getDailyTota

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 42–131 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 133–208 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddCashBoxContributionMovementType1760001700000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001700000-AddCashBoxContributionMovementType.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001700000-AddCashBoxContributionMovementType.ts#L42) (L42–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`; Tablas en su SQL: `recharge_sales`, `recharge_sim_sales`, `recharge_cash_box_movements`, `v_income`, `recharge_purchases`, `recharge_sim_purchases`, `v_expense`, `v_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddCashBoxContributionMovementType1760001700000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760001700000-AddCashBoxContributionMovementType.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001700000-AddCashBoxContributionMovementType.ts#L133) (L133–208)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`; Tablas en su SQL: `recharge_sales`, `recharge_sim_sales`, `v_income`, `recharge_purchases`, `recharge_sim_purchases`, `recharge_cash_box_movements`, `v_expense`, `v_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001800000-addvoidtorechargepurchases-ts"></a>

### 1760001800000-AddVoidToRechargePurchases.ts

- **Ruta:** [1760001800000-AddVoidToRechargePurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001800000-AddVoidToRechargePurchases.ts) (`comercial-jhoel-api/src/database/migrations/1760001800000-AddVoidToRechargePurchases.ts`, 158 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Revertir compra" — a correction path for a mistaken recharge purchase (wrong operator, duplicate, wrong amount).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `void_recharge_purchase`; 

#### Clase `AddVoidToRechargePurchases1760001800000` (L34–157)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Revertir compra" — a correction path for a mistaken recharge purchase (wrong operator, duplicate, wrong amount). Same `is_voided`/`voided_at`/ `voided_by`/`void_reason` + all-or-nothing CHECK pattern as `bank_deposit_operations`/`recharge_cash_box_movements`/`tickets`/ `quotations` — never a physical `DELETE`. Purely additive: every pre-existing row defaults to `is_voided = false`, byte-identical to today's actual behavior. `void_recharge_purchase()` reverses EXACTLY what `register_recharge_purchase` did — decrements `daily_balance` by `credited_amount` (never `amount`, the "Monto de Compra"/"Monto Acreditado" distinction is never mixed) — and is blocked entirely (no admin override, no backdoor) whenever: - the purchase's business day is closed (`recharge_day_openings.closed_at`), or - the purchase's specific cuadre cycle already has a `final_balance` (verified directly: `reopen_recharg

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 39–135 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 137–156 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddVoidToRechargePurchases1760001800000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001800000-AddVoidToRechargePurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001800000-AddVoidToRechargePurchases.ts#L39) (L39–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_purchase`, `recharge_purchases`, `v_day_closed_at`, `recharge_day_openings`, `v_balance`, `recharge_daily_balances`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddVoidToRechargePurchases1760001800000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760001800000-AddVoidToRechargePurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001800000-AddVoidToRechargePurchases.ts#L137) (L137–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760001900000-addvoidtopurchases-ts"></a>

### 1760001900000-AddVoidToPurchases.ts

- **Ruta:** [1760001900000-AddVoidToPurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001900000-AddVoidToPurchases.ts) (`comercial-jhoel-api/src/database/migrations/1760001900000-AddVoidToPurchases.ts`, 169 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Anular factura de compra" — the correction path for a mistaken purchase invoice, built for the new "Administrar Facturas de Compras" module (Sistema).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `void_purchase`; 

#### Clase `AddVoidToPurchases1760001900000` (L40–168)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Anular factura de compra" — the correction path for a mistaken purchase invoice, built for the new "Administrar Facturas de Compras" module (Sistema). Same philosophy as every other financial correction in this codebase (`void_recharge_purchase`, `AddVoidToBankDepositOperations`, tickets, cotizaciones): never a physical DELETE, never an in-place edit — the original row stays exactly as registered, marked `ANULADA` forever, with full audit trail. There is deliberately NO "editar factura" that touches products/cantidades/costos (see this ticket's own decision): the correction path is always anular + registrar una compra nueva y correcta. Also adds `invoice_number` — purchases never stored a real invoice/folio number before this (the `C-XXXXXXXX` shown in Reportería is only derived from the id at read time, never persisted). Nullable, no uniqueness constraint — a supplier's own folio can l

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 43–152 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 154–167 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddVoidToPurchases1760001900000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760001900000-AddVoidToPurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001900000-AddVoidToPurchases.ts#L43) (L43–152)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_purchase`, `purchases`, `v_bodega_id`, `inventory_locations`, `purchase_details`, `products`, `v_current_stock`, `v_current_location_stock`, `inventory_stock`, `v_presentation_id`, `product_presentations`, `presentation_types`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddVoidToPurchases1760001900000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760001900000-AddVoidToPurchases.ts](../../../../comercial-jhoel-api/src/database/migrations/1760001900000-AddVoidToPurchases.ts#L154) (L154–167)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760002000000-addvoidtosales-ts"></a>

### 1760002000000-AddVoidToSales.ts

- **Ruta:** [1760002000000-AddVoidToSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002000000-AddVoidToSales.ts) (`comercial-jhoel-api/src/database/migrations/1760002000000-AddVoidToSales.ts`, 148 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Anular venta" — the correction path for a mistaken CONFIRMED sale, for the new "Administrar Facturas de Ventas" module (Sistema).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `void_sale`; 

#### Clase `AddVoidToSales1760002000000` (L35–147)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Anular venta" — the correction path for a mistaken CONFIRMED sale, for the new "Administrar Facturas de Ventas" module (Sistema). Mirrors `AddVoidToPurchases` exactly: never a physical DELETE, never an in-place edit — the original row stays exactly as it was, marked `ANULADA` forever, with full audit trail. No "editar venta" exists — the correction path is always anular + registrar una venta nueva y correcta. Also adds `invoice_number` — same free-text, optional, non-unique search aid as `purchases.invoice_number`. `void_sale()` only ever targets a `CONFIRMED` sale — an `OPEN` draft already has its own correction mechanism (`cancel_open_sale`, which discards it entirely since it was never a real transaction). It restores the exact inventory effect `confirm_sale`/`confirm_open_sale` applied (stock/inventory_stock incremented back by each line's own `quantity_base_units`, at whichever loc

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 38–131 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 133–146 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddVoidToSales1760002000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760002000000-AddVoidToSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002000000-AddVoidToSales.ts#L38) (L38–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `ensure_inventory_stock_row`; Tablas en su SQL: `v_sale`, `sales`, `v_vitrina_id`, `inventory_locations`, `sale_details`, `products`, `inventory_stock`, `v_presentation_id`, `product_presentations`, `presentation_types`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddVoidToSales1760002000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760002000000-AddVoidToSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002000000-AddVoidToSales.ts#L133) (L133–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760002100000-addclientandreferenceforbankdepositreceivables-ts"></a>

### 1760002100000-AddClientAndReferenceForBankDepositReceivables.ts

- **Ruta:** [1760002100000-AddClientAndReferenceForBankDepositReceivables.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002100000-AddClientAndReferenceForBankDepositReceivables.ts) (`comercial-jhoel-api/src/database/migrations/1760002100000-AddClientAndReferenceForBankDepositReceivables.ts`, 506 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Lets a Transaccionar "Depósito" optionally link to a REGISTERED client (the same `clients` table Cuentas por Cobrar/Activos already use — see `bank_deposit_operations.client_name`'s own doc comment: that column is deliberately free-text, never looked up against `clients`) and, optionally, atomically
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_bank_deposit_operation`, `register_account_receivable_movement`; 

#### Clase `AddClientAndReferenceForBankDepositReceivables1760002100000` (L39–505)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Lets a Transaccionar "Depósito" optionally link to a REGISTERED client (the same `clients` table Cuentas por Cobrar/Activos already use — see `bank_deposit_operations.client_name`'s own doc comment: that column is deliberately free-text, never looked up against `clients`) and, optionally, atomically register a Cuentas por Cobrar CARGO for that same client and amount — with a traceable link back to the deposit. Two independent, additive changes: 1. `bank_deposit_operations.client_id` (nullable FK → `clients.id`, RESTRICT) — set whenever the user picked a real registered client in Transaccionar, independent of whether a CxC cargo was also requested. `client_name` is untouched and keeps working exactly as before for every other transaction type and for a depósito with no registered client. 2. `accounts_receivable.reference_type` / `reference_id` (both nullable, paired — either both null or 

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 44–297 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 299–504 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddClientAndReferenceForBankDepositReceivables1760002100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760002100000-AddClientAndReferenceForBankDepositReceivables.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002100000-AddClientAndReferenceForBankDepositReceivables.ts#L44) (L44–297)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`, `pg_advisory_xact_lock`; Tablas en su SQL: `v_bank`, `transaction_banks`, `v_transaction_type`, `transaction_types`, `clients`, `v_operation_id`, `bank_deposit_operations`, `v_current_balance`, `accounts_receivable`, `v_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddClientAndReferenceForBankDepositReceivables1760002100000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760002100000-AddClientAndReferenceForBankDepositReceivables.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002100000-AddClientAndReferenceForBankDepositReceivables.ts#L299) (L299–504)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`, `jsonb_array_elements`, `jsonb_array_elements_text`; Tablas en su SQL: `v_current_balance`, `accounts_receivable`, `v_id`, `v_bank`, `transaction_banks`, `v_transaction_type`, `transaction_types`, `v_operation_id`, `bank_deposit_operations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760002200000-addrechargesimsaleregistrations-ts"></a>

### 1760002200000-AddRechargeSimSaleRegistrations.ts

- **Ruta:** [1760002200000-AddRechargeSimSaleRegistrations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002200000-AddRechargeSimSaleRegistrations.ts) (`comercial-jhoel-api/src/database/migrations/1760002200000-AddRechargeSimSaleRegistrations.ts`, 544 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Venta de SIM con registro de identidad" — a per-unit compliance record layered on top of the EXISTING, already-live "Venta de SIM" feature (`CreateRechargeSims1759300000000`): that feature sells physical SIM inventory by quantity (`recharge_sim_sales`, no identity capture).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `recharge_sim_dpi_images`, `recharge_sim_sale_registrations`; funciones `register_recharge_sim_sale_unit`, `register_recharge_sim_sale_registration`, `void_recharge_sim_sale_registration`, `register_recharge_sales_closure`; 

#### Clase `AddRechargeSimSaleRegistrations1760002200000` (L35–543)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Venta de SIM con registro de identidad" — a per-unit compliance record layered on top of the EXISTING, already-live "Venta de SIM" feature (`CreateRechargeSims1759300000000`): that feature sells physical SIM inventory by quantity (`recharge_sim_sales`, no identity capture). This migration does NOT replace or duplicate it — both flows keep working side by side (confirmed with the user): the quick by-quantity sale stays for cases where no identity registration is needed, and this new, detailed flow is for when it is. A detailed sale always registers exactly ONE physical SIM (`recharge_sim_sales.quantity = 1`), created by `RegisterRechargeSimSaleWithRegistrationUseCase` in the same transaction as this registration row — every physical unit sold this way needs its own número de SIM/DPI, so quantity &gt; 1 was never a fit for this table. `recharge_sim_dpi_images` holds the actual photo bytes, i

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 40–429 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 431–542 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddRechargeSimSaleRegistrations1760002200000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760002200000-AddRechargeSimSaleRegistrations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002200000-AddRechargeSimSaleRegistrations.ts#L40) (L40–429)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_type`, `recharge_sim_types`, `v_day_closed_at`, `recharge_day_openings`, `v_current_stock`, `recharge_sim_daily_stock`, `v_sale_id`, `recharge_sim_sales`, `clients`, `v_id`, `v_registration`, `recharge_sim_sale_registrations`, `v_sale`, `recharge_daily_balances`, `v_type_sales`, `recharge_sales`, `v_sim_sales_total`, `v_closure_id`, `recharge_sales_closures`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddRechargeSimSaleRegistrations1760002200000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760002200000-AddRechargeSimSaleRegistrations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002200000-AddRechargeSimSaleRegistrations.ts#L431) (L431–542)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_day_closed_at`, `recharge_day_openings`, `recharge_daily_balances`, `v_type_sales`, `recharge_sales`, `v_closure_id`, `recharge_sales_closures`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760002300000-addvoidtorechargesimsales-ts"></a>

### 1760002300000-AddVoidToRechargeSimSales.ts

- **Ruta:** [1760002300000-AddVoidToRechargeSimSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002300000-AddVoidToRechargeSimSales.ts) (`comercial-jhoel-api/src/database/migrations/1760002300000-AddVoidToRechargeSimSales.ts`, 375 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Revertir" for the by-quantity "Vender SIM" quick-sale flow (`recharge_sim_sales`), which never had any void/revert mechanism since it was first built — a real, pre-existing gap, not a regression from the later `recharge_sim_sale_registrations` (identity-capture) feature.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `void_recharge_sim_sale`, `register_recharge_sales_closure`; 

#### Clase `AddVoidToRechargeSimSales1760002300000` (L36–374)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Revertir" for the by-quantity "Vender SIM" quick-sale flow (`recharge_sim_sales`), which never had any void/revert mechanism since it was first built — a real, pre-existing gap, not a regression from the later `recharge_sim_sale_registrations` (identity-capture) feature. Same `is_voided`/`voided_at`/`voided_by`/`void_reason` + all-or-nothing CHECK pattern as `recharge_purchases`/`bank_deposit_operations`/`sales` — never a physical `DELETE`. Purely additive: every pre-existing row defaults to `is_voided = false`, byte-identical to today's actual behavior. `void_recharge_sim_sale()` mirrors `void_recharge_purchase()`'s structure (reason required, row lock, not-found/already-voided checks, restores stock) with one deliberate omission and one deliberate addition: - Omission: no cycle/`final_balance`-style lock check — SIM stock has no cuadre cycle/sequence concept at all (confirmed earlier 

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 41–242 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 244–373 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddVoidToRechargeSimSales1760002300000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760002300000-AddVoidToRechargeSimSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002300000-AddVoidToRechargeSimSales.ts#L41) (L41–242)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_sale`, `recharge_sim_sales`, `recharge_sim_sale_registrations`, `v_has_active_registration`, `v_day_closed_at`, `recharge_day_openings`, `recharge_sim_daily_stock`, `recharge_daily_balances`, `v_type_sales`, `recharge_sales`, `v_sim_sales_total`, `v_closure_id`, `recharge_sales_closures`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddVoidToRechargeSimSales1760002300000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760002300000-AddVoidToRechargeSimSales.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002300000-AddVoidToRechargeSimSales.ts#L244) (L244–373)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_day_closed_at`, `recharge_day_openings`, `recharge_daily_balances`, `v_type_sales`, `recharge_sales`, `v_sim_sales_total`, `recharge_sim_sales`, `recharge_sim_sale_registrations`, `v_closure_id`, `recharge_sales_closures`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760002400000-addbarcodetoproductpresentations-ts"></a>

### 1760002400000-AddBarcodeToProductPresentations.ts

- **Ruta:** [1760002400000-AddBarcodeToProductPresentations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002400000-AddBarcodeToProductPresentations.ts) (`comercial-jhoel-api/src/database/migrations/1760002400000-AddBarcodeToProductPresentations.ts`, 81 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Gives each product PRESENTATION its own optional barcode — separate from `products.sku`, which stays exactly as-is.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddBarcodeToProductPresentations1760002400000` (L34–80)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Gives each product PRESENTATION its own optional barcode — separate from `products.sku`, which stays exactly as-is. Real, requested scenario: a box of 12 has its own barcode (123456), the individual unit inside has a different one (678900); scanning either must resolve to the same product, with the right presentation pre-selected. `barcode` lives on `product_presentations` (the per-product INSTANCE), never on `presentation_types` (the shared catalog "Caja" name) — a box barcode is specific to one product's actual box, never shared across every product that happens to use the "Caja" type. Same partial-unique-index pattern as `UQ_products_sku_active` (`AddSkuToProducts`) — global uniqueness (two products' presentations must never share a barcode), unique only among *active* presentations, nullable (not every presentation needs one). Backfill: every existing product's own "Unidad" presentat

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 39–71 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 73–79 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddBarcodeToProductPresentations1760002400000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760002400000-AddBarcodeToProductPresentations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002400000-AddBarcodeToProductPresentations.ts#L39) (L39–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.addColumn`, `new TableColumn`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `product_presentations`, `products`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddBarcodeToProductPresentations1760002400000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760002400000-AddBarcodeToProductPresentations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002400000-AddBarcodeToProductPresentations.ts#L73) (L73–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.dropIndex`, `queryRunner.dropColumn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760002500000-seedinitialstocksupplier-ts"></a>

### 1760002500000-SeedInitialStockSupplier.ts

- **Ruta:** [1760002500000-SeedInitialStockSupplier.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002500000-SeedInitialStockSupplier.ts) (`comercial-jhoel-api/src/database/migrations/1760002500000-SeedInitialStockSupplier.ts`, 29 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Seeds a fixed supplier ("Carga Inicial de Inventario") that the bulk initial-stock Excel import (`POST /purchases/import`) attributes every purchase it creates to — so that stock loaded this way is identifiable in Reportería/Kardex as coming from the initial catalog load, not a real supplier invoice.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `SeedInitialStockSupplier1760002500000` (L11–28)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Seeds a fixed supplier ("Carga Inicial de Inventario") that the bulk initial-stock Excel import (`POST /purchases/import`) attributes every purchase it creates to — so that stock loaded this way is identifiable in Reportería/Kardex as coming from the initial catalog load, not a real supplier invoice. Same "seed inside the migration, no separate script" pattern as the roles/businesses seeds.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 16–21 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 23–27 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `SeedInitialStockSupplier1760002500000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760002500000-SeedInitialStockSupplier.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002500000-SeedInitialStockSupplier.ts#L16) (L16–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `suppliers`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SeedInitialStockSupplier1760002500000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760002500000-SeedInitialStockSupplier.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002500000-SeedInitialStockSupplier.ts#L23) (L23–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `suppliers`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760002600000-addbalancelimittorechargetypes-ts"></a>

### 1760002600000-AddBalanceLimitToRechargeTypes.ts

- **Ruta:** [1760002600000-AddBalanceLimitToRechargeTypes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002600000-AddBalanceLimitToRechargeTypes.ts) (`comercial-jhoel-api/src/database/migrations/1760002600000-AddBalanceLimitToRechargeTypes.ts`, 48 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Límite de saldo" per recharge type (Claro/Tigo) — the 100% reference point for the Resumen dashboard's saldo gauge charts.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddBalanceLimitToRechargeTypes1760002600000` (L22–47)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Límite de saldo" per recharge type (Claro/Tigo) — the 100% reference point for the Resumen dashboard's saldo gauge charts. Added directly to `recharge_types`, same pattern as `min_balance`: it's already the one row per operator, so a third operator later just gets its own `balance_limit` on its own seeded row, no schema change needed. Deliberately a SEPARATE column from `min_balance`, not a reuse of it — `min_balance` is the Alerts module's "alert me when balance falls below this" floor (already live in production); `balance_limit` is the opposite concept, a ceiling/target the balance is expected to normally sit under but is explicitly allowed to exceed (100%+). Sharing one column between the two would break the Alerts module's existing semantics. Initial values (Claro Q1,000, Tigo Q600) are set for the two seeded rows only — any other/future recharge type simply defaults to `0` until a

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 25–38 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 40–46 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddBalanceLimitToRechargeTypes1760002600000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760002600000-AddBalanceLimitToRechargeTypes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002600000-AddBalanceLimitToRechargeTypes.ts#L25) (L25–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `recharge_types`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddBalanceLimitToRechargeTypes1760002600000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760002600000-AddBalanceLimitToRechargeTypes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002600000-AddBalanceLimitToRechargeTypes.ts#L40) (L40–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760002700000-addpubliccontactfieldstocompanysettings-ts"></a>

### 1760002700000-AddPublicContactFieldsToCompanySettings.ts

- **Ruta:** [1760002700000-AddPublicContactFieldsToCompanySettings.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002700000-AddPublicContactFieldsToCompanySettings.ts) (`comercial-jhoel-api/src/database/migrations/1760002700000-AddPublicContactFieldsToCompanySettings.ts`, 45 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Adds the fields the public landing page's "Contacto" section needs that `company_settings` didn't have yet: `whatsapp` (deliberately separate from `phone` — a business can call one number and answer WhatsApp on another), `website`, `business_hours` (free multiline text, not a structured day-by-day m
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddPublicContactFieldsToCompanySettings1760002700000` (L18–44)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Adds the fields the public landing page's "Contacto" section needs that `company_settings` didn't have yet: `whatsapp` (deliberately separate from `phone` — a business can call one number and answer WhatsApp on another), `website`, `business_hours` (free multiline text, not a structured day-by-day model — the admin types exactly what they want shown), and `facebook_url`/`instagram_url`/`tiktok_url` (structured, one URL per platform — supersedes the older free-text `social_media` column for this purpose; that column is left untouched, still editable, not migrated/renamed). All six are nullable with no default — the table's one existing row simply gets `NULL` for each until an admin fills them in via "Configuración de Empresa". Zero impact on existing data.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 21–31 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 33–43 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddPublicContactFieldsToCompanySettings1760002700000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760002700000-AddPublicContactFieldsToCompanySettings.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002700000-AddPublicContactFieldsToCompanySettings.ts#L21) (L21–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddPublicContactFieldsToCompanySettings1760002700000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760002700000-AddPublicContactFieldsToCompanySettings.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002700000-AddPublicContactFieldsToCompanySettings.ts#L33) (L33–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760002800000-createphones-ts"></a>

### 1760002800000-CreatePhones.ts

- **Ruta:** [1760002800000-CreatePhones.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002800000-CreatePhones.ts) (`comercial-jhoel-api/src/database/migrations/1760002800000-CreatePhones.ts`, 260 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Venta de Teléfonos" — a new, independent module for buying and selling individual phone units (Claro/Tigo), modeled after the "Venta de SIM con registro de identidad" flow (`recharge_sim_sale_registrations`) rather than the generic `products`/`purchases` machinery: a phone is one individually-ident
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `phones`, `phone_sale_dpi_images`, `phone_sales`; funciones `register_phone_sale`, `void_phone_sale`; 

#### Clase `CreatePhones1760002800000` (L60–259)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Venta de Teléfonos" — a new, independent module for buying and selling individual phone units (Claro/Tigo), modeled after the "Venta de SIM con registro de identidad" flow (`recharge_sim_sale_registrations`) rather than the generic `products`/`purchases` machinery: a phone is one individually-identified physical unit (own IMEI, own status), never a fungible product with a numeric stock — confirmed with the user as an explicit requirement. `phones` doubles as both "inventory row" and "purchase record" — unlike SIM (a fungible daily-stock counter, identity only captured at sale time), a phone's identity (IMEI/número) exists from the moment it's bought, so there is no separate quantity-based purchase table to layer identity on top of afterward. `status` starts `DISPONIBLE` and flips to `VENDIDO` exactly once `register_phone_sale` succeeds; it can flip back to `DISPONIBLE` if that sale is l

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 63–246 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 248–258 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreatePhones1760002800000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760002800000-CreatePhones.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002800000-CreatePhones.ts#L63) (L63–246)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_phone`, `phones`, `clients`, `v_dpi_image_id`, `v_sale_id`, `v_sale`, `phone_sales`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreatePhones1760002800000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760002800000-CreatePhones.ts](../../../../comercial-jhoel-api/src/database/migrations/1760002800000-CreatePhones.ts#L248) (L248–258)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760003000000-movephonenumbertosale-ts"></a>

### 1760003000000-MovePhoneNumberToSale.ts

- **Ruta:** [1760003000000-MovePhoneNumberToSale.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003000000-MovePhoneNumberToSale.ts) (`comercial-jhoel-api/src/database/migrations/1760003000000-MovePhoneNumberToSale.ts`, 326 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** A phone bought into inventory has no active line yet — the número telefónico is only assigned at the moment it's sold (the SIM gets activated then, not at purchase time).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_phone_sale`, `void_phone_sale`; 

#### Clase `MovePhoneNumberToSale1760003000000` (L37–325)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** A phone bought into inventory has no active line yet — the número telefónico is only assigned at the moment it's sold (the SIM gets activated then, not at purchase time). This migration moves `phone_number` from "required at purchase" to "assigned at sale": - `phones.phone_number` becomes nullable — `NULL` for every `DISPONIBLE` unit, populated only by `register_phone_sale` when it's sold, cleared again by `void_phone_sale` if that sale is later voided (full reversal of the "activation"). - `phones` gains `model` (what used to identify a unit informally now needs a real field the purchase form can show/search on) and `sim_number` (the physical SIM that ships with the phone, captured at purchase — distinct from the phone number, which is assigned later). Both are `NOT NULL`; `sim_number` is globally unique, same reasoning as `UQ_phones_imei` (a physical SIM is as unique as a device serial

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 40–190 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 192–324 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `MovePhoneNumberToSale1760003000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003000000-MovePhoneNumberToSale.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003000000-MovePhoneNumberToSale.ts#L40) (L40–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_phone`, `phones`, `clients`, `v_dpi_image_id`, `v_sale_id`, `v_sale`, `phone_sales`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `MovePhoneNumberToSale1760003000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003000000-MovePhoneNumberToSale.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003000000-MovePhoneNumberToSale.ts#L192) (L192–324)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `v_phone`, `phones`, `clients`, `v_dpi_image_id`, `v_sale_id`, `v_sale`, `phone_sales`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760003100000-createcatalogmodule-ts"></a>

### 1760003100000-CreateCatalogModule.ts

- **Ruta:** [1760003100000-CreateCatalogModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003100000-CreateCatalogModule.ts) (`comercial-jhoel-api/src/database/migrations/1760003100000-CreateCatalogModule.ts`, 137 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Catálogo de Teléfonos" — a public-facing marketing catalog (landing page carousel + admin management), deliberately independent from `modules/phones/` (Venta de Teléfonos): that module tracks individually serialized physical units (IMEI/SIM, activation, one row per device), while this one is a per-
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `catalog_phones`, `catalog_phone_images`, `catalog_requests`; 

#### Clase `CreateCatalogModule1760003100000` (L51–136)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Catálogo de Teléfonos" — a public-facing marketing catalog (landing page carousel + admin management), deliberately independent from `modules/phones/` (Venta de Teléfonos): that module tracks individually serialized physical units (IMEI/SIM, activation, one row per device), while this one is a per-MODEL commercial listing (brand/model, specs, photos, list price) meant to be browsed publicly — the two domains don't share a table or a repository, confirmed as the correct shape after reviewing `phones`' own entity (no image field, no "published" concept, one row per physical device rather than per model). `catalog_phones` — one row per publishable model. `is_active` (soft delete, never a physical row removal, same convention as every other reference table in this codebase) and `is_published` (whether it's currently visible on the public landing) are independent flags: an admin can stage a 

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 54–129 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 131–135 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateCatalogModule1760003100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003100000-CreateCatalogModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003100000-CreateCatalogModule.ts#L54) (L54–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateCatalogModule1760003100000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003100000-CreateCatalogModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003100000-CreateCatalogModule.ts#L131) (L131–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760003200000-addkrediyaminamounttocompanysettings-ts"></a>

### 1760003200000-AddKrediyaMinAmountToCompanySettings.ts

- **Ruta:** [1760003200000-AddKrediyaMinAmountToCompanySettings.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003200000-AddKrediyaMinAmountToCompanySettings.ts) (`comercial-jhoel-api/src/database/migrations/1760003200000-AddKrediyaMinAmountToCompanySettings.ts`, 38 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** `company_settings.krediya_min_amount` — the one global, singleton business parameter the "Catálogo de Teléfonos" credit rule reads: a phone qualifies for "Crédito con Krediya" when its price is `&gt;= krediya_min_amount`.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddKrediyaMinAmountToCompanySettings1760003200000` (L20–37)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** `company_settings.krediya_min_amount` — the one global, singleton business parameter the "Catálogo de Teléfonos" credit rule reads: a phone qualifies for "Crédito con Krediya" when its price is `&gt;= krediya_min_amount`. Lives here (not a new config table) following this codebase's own documented convention — a genuinely global threshold belongs on the one true settings singleton, same home as `whatsapp`/ `businessHours`, while a *per-entity* threshold (stock mínimo, saldo mínimo) lives on its own owning row instead. Nullable, no default constraint on the column itself — `NULL` or `&lt;= 0` both mean "crédito Krediya no ofrecido" (see `isKrediyaCreditAvailable`), which lets the business turn the whole offer off later without losing the previously configured number. The `UPDATE` below only seeds the initial value (Q1,000) onto the existing singleton row so the feature has a sane default from d

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 23–30 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 32–36 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddKrediyaMinAmountToCompanySettings1760003200000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003200000-AddKrediyaMinAmountToCompanySettings.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003200000-AddKrediyaMinAmountToCompanySettings.ts#L23) (L23–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `company_settings`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddKrediyaMinAmountToCompanySettings1760003200000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003200000-AddKrediyaMinAmountToCompanySettings.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003200000-AddKrediyaMinAmountToCompanySettings.ts#L32) (L32–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760003300000-createproductcatalogmodule-ts"></a>

### 1760003300000-CreateProductCatalogModule.ts

- **Ruta:** [1760003300000-CreateProductCatalogModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003300000-CreateProductCatalogModule.ts) (`comercial-jhoel-api/src/database/migrations/1760003300000-CreateProductCatalogModule.ts`, 93 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Catálogo de Librería" y "Variedades y Accesorios" — dos catálogos públicos de la landing que NUNCA duplican un producto: `catalog_products` es puramente la capa de "publicación" (INVENTARIO → PRODUCTO → PUBLICACIÓN EN CATÁLOGO), con `product_id` como única fuente de verdad para nombre/precio/catego
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `catalog_products`, `catalog_product_requests`; 

#### Clase `CreateProductCatalogModule1760003300000` (L37–92)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Catálogo de Librería" y "Variedades y Accesorios" — dos catálogos públicos de la landing que NUNCA duplican un producto: `catalog_products` es puramente la capa de "publicación" (INVENTARIO → PRODUCTO → PUBLICACIÓN EN CATÁLOGO), con `product_id` como única fuente de verdad para nombre/precio/categoría/negocio — esos siguen viviendo y gestionándose por completo en `modules/products` (Inventario), sin ningún cambio ahí. Una sola tabla para ambas secciones (`section` distingue `LIBRERIA`/`VARIEDADES_ACCESORIOS`) — comparten ~95% de la forma (imagen, descripción de catálogo, orden, activo/inactivo); lo que NO comparten (WhatsApp/solicitudes solo en Variedades) se aplica como regla de negocio en la capa de aplicación/presentación, nunca en el esquema. `image_data` BYTEA — mismo precedente ya usado por `catalog_phone_images` (no existe almacenamiento de archivos en este proyecto; el contenedo

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 42–86 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 88–91 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateProductCatalogModule1760003300000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003300000-CreateProductCatalogModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003300000-CreateProductCatalogModule.ts#L42) (L42–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateProductCatalogModule1760003300000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003300000-CreateProductCatalogModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003300000-CreateProductCatalogModule.ts#L88) (L88–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760003400000-createnewsmodule-ts"></a>

### 1760003400000-CreateNewsModule.ts

- **Ruta:** [1760003400000-CreateNewsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003400000-CreateNewsModule.ts) (`comercial-jhoel-api/src/database/migrations/1760003400000-CreateNewsModule.ts`, 55 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Noticias" — contenido informativo de la landing, deliberadamente NO modelado como producto: sin `product_id`, sin precio, sin negocio/ categoría, sin WhatsApp, sin Krediya.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `news_articles`; 

#### Clase `CreateNewsModule1760003400000` (L25–54)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Noticias" — contenido informativo de la landing, deliberadamente NO modelado como producto: sin `product_id`, sin precio, sin negocio/ categoría, sin WhatsApp, sin Krediya. Campos mínimos pedidos explícitamente ("no agregar campos innecesarios si no aportan valor") — sin `summary`/`category` propios: el extracto de la tarjeta pública se deriva truncando `description` en el frontend, no se duplica en una segunda columna. `description` es siempre texto plano — nunca HTML enriquecido. Angular interpola texto de forma segura por defecto (nunca lo interpreta como markup), así que esto es lo que hace innecesaria cualquier sanitización: no hay superficie de XSS que cerrar porque nunca se acepta/renderiza HTML en absoluto, en ningún punto del flujo. `image_data` BYTEA — mismo precedente que `catalog_phone_images`/ `catalog_products.image_data` (sin almacenamiento de archivos en este proyecto). 

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 28–49 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 51–53 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateNewsModule1760003400000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003400000-CreateNewsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003400000-CreateNewsModule.ts#L28) (L28–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateNewsModule1760003400000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003400000-CreateNewsModule.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003400000-CreateNewsModule.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760003500000-addlikestopubliccatalogentities-ts"></a>

### 1760003500000-AddLikesToPublicCatalogEntities.ts

- **Ruta:** [1760003500000-AddLikesToPublicCatalogEntities.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003500000-AddLikesToPublicCatalogEntities.ts) (`comercial-jhoel-api/src/database/migrations/1760003500000-AddLikesToPublicCatalogEntities.ts`, 37 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Me gusta" público para Teléfonos, Librería/Variedades y Noticias — un contador simple (`likes_count`), incrementado/decrementado atómicamente por `UPDATE ...
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddLikesToPublicCatalogEntities1760003500000` (L14–36)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Me gusta" público para Teléfonos, Librería/Variedades y Noticias — un contador simple (`likes_count`), incrementado/decrementado atómicamente por `UPDATE ... SET likes_count = GREATEST(0, likes_count + $delta)` en cada repositorio (nunca leído-luego-escrito desde la aplicación, así que dos likes concurrentes nunca se pisan). Sin tabla de "quién dio like" — no hay cuentas de visitante en la landing pública; el frontend recuerda localmente (localStorage) si ese navegador ya dio like, para poder alternar el botón, pero el conteo real siempre vive aquí. Puramente aditivo, `DEFAULT 0` respalda cada fila existente.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 19–29 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 31–35 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddLikesToPublicCatalogEntities1760003500000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003500000-AddLikesToPublicCatalogEntities.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003500000-AddLikesToPublicCatalogEntities.ts#L19) (L19–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddLikesToPublicCatalogEntities1760003500000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003500000-AddLikesToPublicCatalogEntities.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003500000-AddLikesToPublicCatalogEntities.ts#L31) (L31–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760003600000-createcataloglikes-ts"></a>

### 1760003600000-CreateCatalogLikes.ts

- **Ruta:** [1760003600000-CreateCatalogLikes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003600000-CreateCatalogLikes.ts) (`comercial-jhoel-api/src/database/migrations/1760003600000-CreateCatalogLikes.ts`, 40 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Reemplaza el contador ciego (`likes_count`, incrementado por un delta que el frontend decide a partir de `localStorage`) por una tabla real de "quién le dio like a qué": un visitante anónimo (identificado por un UUID opaco que el propio frontend genera y persiste, mandado como header `X-Visitor-Id`)
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `catalog_likes`; 

#### Clase `CreateCatalogLikes1760003600000` (L21–39)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Reemplaza el contador ciego (`likes_count`, incrementado por un delta que el frontend decide a partir de `localStorage`) por una tabla real de "quién le dio like a qué": un visitante anónimo (identificado por un UUID opaco que el propio frontend genera y persiste, mandado como header `X-Visitor-Id`) puede tener a lo sumo un like por ítem — la PK compuesta es la restricción anti-duplicado, no una revisión desde la aplicación. La PK también sirve de índice para `COUNT(*) WHERE entity_type=$1 AND entity_id=$2` (coincide con su prefijo), así que no hace falta un índice aparte. Sin FK polimórfica hacia `catalog_phones`/`catalog_products`/ `news_articles` — la existencia/estado del ítem se valida en la capa de aplicación, igual que ya hacen los use cases existentes de like. Las columnas `likes_count` de `catalog_phones`/`catalog_products`/ `news_articles` (migración `AddLikesToPublicCatalogEnt

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 24–34 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 36–38 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateCatalogLikes1760003600000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003600000-CreateCatalogLikes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003600000-CreateCatalogLikes.ts#L24) (L24–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateCatalogLikes1760003600000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003600000-CreateCatalogLikes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003600000-CreateCatalogLikes.ts#L36) (L36–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760003700000-createnewstypes-ts"></a>

### 1760003700000-CreateNewsTypes.ts

- **Ruta:** [1760003700000-CreateNewsTypes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003700000-CreateNewsTypes.ts) (`comercial-jhoel-api/src/database/migrations/1760003700000-CreateNewsTypes.ts`, 75 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Catálogo maestro y configurable de "Tipos de Noticias" — nunca un enum rígido: el admin puede crear/editar/activar/desactivar/ordenar filas nuevas (Eventos, Avisos, ...) sin ninguna migración ni cambio de código.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `news_types`; 

#### Clase `CreateNewsTypes1760003700000` (L16–74)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Catálogo maestro y configurable de "Tipos de Noticias" — nunca un enum rígido: el admin puede crear/editar/activar/desactivar/ordenar filas nuevas (Eventos, Avisos, ...) sin ninguna migración ni cambio de código. Mismo escape hatch `LOWER(...) WHERE is_active` de `presentation_types`/ `clients` para unicidad case-insensitive de `name`/`slug`. `is_wildcard` es el mecanismo central de la regla "Comercial = recibe todas las noticias" (ver `CreateNewsSubscriptions`) — el frontend público lo usa para preseleccionar "Todas las noticias" en el formulario de suscripción. Puesto en `true` únicamente aquí, para la fila semilla "Comercial". Ningún endpoint permite editarlo después.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 19–69 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 71–73 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateNewsTypes1760003700000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003700000-CreateNewsTypes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003700000-CreateNewsTypes.ts#L19) (L19–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `news_types`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateNewsTypes1760003700000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003700000-CreateNewsTypes.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003700000-CreateNewsTypes.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760003800000-addnewstypeandslugtonewsarticles-ts"></a>

### 1760003800000-AddNewsTypeAndSlugToNewsArticles.ts

- **Ruta:** [1760003800000-AddNewsTypeAndSlugToNewsArticles.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003800000-AddNewsTypeAndSlugToNewsArticles.ts) (`comercial-jhoel-api/src/database/migrations/1760003800000-AddNewsTypeAndSlugToNewsArticles.ts`, 79 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Toda noticia debe tener UNA clasificación obligatoria (`news_type_id`) y una URL pública real (`slug`) — ninguna de las dos existía hasta ahora.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddNewsTypeAndSlugToNewsArticles1760003800000` (L27–78)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Toda noticia debe tener UNA clasificación obligatoria (`news_type_id`) y una URL pública real (`slug`) — ninguna de las dos existía hasta ahora. Backfill no destructivo: cada noticia existente se asigna al tipo semilla "Comercial" (creado por la migración anterior) — la opción más segura, ya que "Comercial" está diseñado para representar exactamente "aplica a todas las noticias". El slug se genera una sola vez a partir del título real de cada noticia, con sufijo `-2`/`-3`... si colisiona — nunca se inventa un título nuevo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 30–70 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 72–77 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddNewsTypeAndSlugToNewsArticles1760003800000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003800000-AddNewsTypeAndSlugToNewsArticles.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003800000-AddNewsTypeAndSlugToNewsArticles.ts#L30) (L30–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `new Error`, `new Set`, `slugify`, `usedSlugs.has`, `usedSlugs.add`
- **Efectos secundarios:** Tablas en su SQL: `news_types`, `news_articles`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `new Error( 'AddNewsTypeAndSlugToNewsArticles: no se encontró el tipo semilla "Comercial" — ¿corrió CreateNewsTypes antes`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddNewsTypeAndSlugToNewsArticles1760003800000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003800000-AddNewsTypeAndSlugToNewsArticles.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003800000-AddNewsTypeAndSlugToNewsArticles.ts#L72) (L72–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `slugify` (L6–14)

- **Tipo:** función local del archivo
- **Firma:** `slugify(text: string): string` — [1760003800000-AddNewsTypeAndSlugToNewsArticles.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003800000-AddNewsTypeAndSlugToNewsArticles.ts#L6)
- **Propósito / descripción:** Copia local del slugify de `modules/news-types` — mismo criterio de "pequeña copia por módulo" ya usado en el resto del proyecto, para que el backfill de esta migración no dependa de código de aplicación que puede cambiar después.
- **Dependencias:** `text.normalize('NFD').replace(COMBINING_DIACRITICAL_MARKS, '').toLowerCase().trim`, `text.normalize('NFD').replace(COMBINING_DIACRITICAL_MARKS, '').toLowerCase`, `text.normalize('NFD').replace`, `text.normalize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1760003900000-createnewssubscriptions-ts"></a>

### 1760003900000-CreateNewsSubscriptions.ts

- **Ruta:** [1760003900000-CreateNewsSubscriptions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003900000-CreateNewsSubscriptions.ts) (`comercial-jhoel-api/src/database/migrations/1760003900000-CreateNewsSubscriptions.ts`, 104 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Suscripción de clientes a noticias por WhatsApp — cuatro tablas nuevas: - `news_subscribers`: un registro por número de WhatsApp.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `news_subscribers`, `news_subscriber_types`, `news_subscriber_audit_log`, `news_notifications`; 

#### Clase `CreateNewsSubscriptions1760003900000` (L27–103)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Suscripción de clientes a noticias por WhatsApp — cuatro tablas nuevas: - `news_subscribers`: un registro por número de WhatsApp. Sin `created_by`/`updated_by` (dato enviado por un visitante público sin sesión, igual que `catalog_requests`/`catalog_product_requests`). `manage_token` es el mecanismo de "cancelar/editar preferencias" sin usar el número como autenticación (punto 19 del pedido) — mucho más difícil de adivinar. - `news_subscriber_types`: relación M:N normalizada suscriptor↔tipo (nunca texto separado por comas) — PK compuesta, mismo idioma `INSERT...ON CONFLICT DO NOTHING` que `catalog_likes`. - `news_subscriber_audit_log`: línea de tiempo de consentimiento/ cambios de preferencias/cancelación — mismo patrón que `day_audit_logs` (evento + estado anterior/nuevo), no columnas `created_by`/`updated_by` sueltas, porque lo que hace falta aquí es un historial, no solo "quién tocó la

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 30–95 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 97–102 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateNewsSubscriptions1760003900000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760003900000-CreateNewsSubscriptions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003900000-CreateNewsSubscriptions.ts#L30) (L30–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateNewsSubscriptions1760003900000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760003900000-CreateNewsSubscriptions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760003900000-CreateNewsSubscriptions.ts#L97) (L97–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760004000000-createcatalogbanks-ts"></a>

### 1760004000000-CreateCatalogBanks.ts

- **Ruta:** [1760004000000-CreateCatalogBanks.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004000000-CreateCatalogBanks.ts) (`comercial-jhoel-api/src/database/migrations/1760004000000-CreateCatalogBanks.ts`, 45 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Catálogo público informativo "Bancos" (Sistema → Catálogo de Bancos) — imagen, nombre, descripción, información adicional.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `catalog_banks`; 

#### Clase `CreateCatalogBanks1760004000000` (L15–44)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Catálogo público informativo "Bancos" (Sistema → Catálogo de Bancos) — imagen, nombre, descripción, información adicional. Mismo shape que `news_articles` (contenido editorial autónomo, sin FK a otra entidad de negocio), con `additional_info` agregado. IMPORTANTE: completamente independiente de la tabla financiera `banks` (Cuadre de Agentes — `previous_balance`/`final_balance`) y de `transaction_banks`/`bank_deposit_operations` — esta migración no toca ninguna de esas tablas, y `catalog_banks` no tiene ninguna FK hacia ellas. Puramente aditiva.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 18–39 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 41–43 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateCatalogBanks1760004000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760004000000-CreateCatalogBanks.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004000000-CreateCatalogBanks.ts#L18) (L18–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateCatalogBanks1760004000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760004000000-CreateCatalogBanks.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004000000-CreateCatalogBanks.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760004100000-createnewspushsubscriptions-ts"></a>

### 1760004100000-CreateNewsPushSubscriptions.ts

- **Ruta:** [1760004100000-CreateNewsPushSubscriptions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004100000-CreateNewsPushSubscriptions.ts) (`comercial-jhoel-api/src/database/migrations/1760004100000-CreateNewsPushSubscriptions.ts`, 85 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Web Push (VAPID) para Noticias — reemplaza el envío automático por WhatsApp (removido en 693299a) sin duplicar nada del módulo de suscriptores/preferencias/clasificación ya existente: - `news_subscribers.whatsapp_number` pasa a ser NULLABLE.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `news_push_subscriptions`, `news_push_deliveries`; 

#### Clase `CreateNewsPushSubscriptions1760004100000` (L27–84)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Web Push (VAPID) para Noticias — reemplaza el envío automático por WhatsApp (removido en 693299a) sin duplicar nada del módulo de suscriptores/preferencias/clasificación ya existente: - `news_subscribers.whatsapp_number` pasa a ser NULLABLE. Un suscriptor que solo activa notificaciones push (sin pasar por el formulario de WhatsApp) no tiene número — sigue siendo la MISMA tabla, el mismo `manage_token`, las MISMAS categorías vía `news_subscriber_types`. `UQ_news_subscribers_whatsapp_active` (índice único parcial) no se ve afectado: Postgres nunca considera dos NULL como duplicados bajo un índice único. - `news_push_subscriptions`: un dispositivo/navegador por fila — "1 suscriptor = N dispositivos". `endpoint` es la clave natural de deduplicación (el mismo navegador reintentando la suscripción produce siempre el mismo endpoint), de ahí el índice único sobre esa columna — nunca sobre `subsc

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 30–69 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 80–83 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateNewsPushSubscriptions1760004100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760004100000-CreateNewsPushSubscriptions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004100000-CreateNewsPushSubscriptions.ts#L30) (L30–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateNewsPushSubscriptions1760004100000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760004100000-CreateNewsPushSubscriptions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004100000-CreateNewsPushSubscriptions.ts#L80) (L80–83)
- **Propósito / descripción:** Reversión parcial, a propósito: las dos tablas nuevas siempre se pueden borrar limpio, pero volver a poner `whatsapp_number` como NOT NULL fallaría en cuanto exista un solo suscriptor real registrado solo por push (columna NULL genuina, no un dato corrupto) — mismo criterio ya documentado en otras migraciones de este proyecto para cambios estructurales que datos reales pueden llegar a depender de ellos.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760004200000-createsitevisits-ts"></a>

### 1760004200000-CreateSiteVisits.ts

- **Ruta:** [1760004200000-CreateSiteVisits.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004200000-CreateSiteVisits.ts) (`comercial-jhoel-api/src/database/migrations/1760004200000-CreateSiteVisits.ts`, 38 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Contador agregado y anónimo de visitas a la landing pública — una sola fila (`id = 1`, forzado por el CHECK, mismo patrón singleton que `alert_settings`/`company_settings`), nunca una fila por visita: el pedido original es explícito en que solo se necesita el TOTAL, no un historial.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `site_visits`; 

#### Clase `CreateSiteVisits1760004200000` (L18–37)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Contador agregado y anónimo de visitas a la landing pública — una sola fila (`id = 1`, forzado por el CHECK, mismo patrón singleton que `alert_settings`/`company_settings`), nunca una fila por visita: el pedido original es explícito en que solo se necesita el TOTAL, no un historial. Sin datos personales, sin IP, sin identificador de dispositivo — el backend solo sabe "ocurrió una visita más". El incremento (`UPDATE site_visits SET total_count = total_count + 1 WHERE id = 1`) es atómico por sí mismo — un `UPDATE` de una sola fila ya es atómico en PostgreSQL, sin necesidad de una función almacenada (mismo criterio ya documentado en este proyecto para `confirm_open_sale`'s propia transición de estado: no crear un procedimiento donde una sentencia simple ya es correcta).

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 21–32 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 34–36 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateSiteVisits1760004200000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760004200000-CreateSiteVisits.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004200000-CreateSiteVisits.ts#L21) (L21–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `site_visits`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateSiteVisits1760004200000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760004200000-CreateSiteVisits.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004200000-CreateSiteVisits.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760004300000-addbusinesssnapshottosaledetails-ts"></a>

### 1760004300000-AddBusinessSnapshotToSaleDetails.ts

- **Ruta:** [1760004300000-AddBusinessSnapshotToSaleDetails.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004300000-AddBusinessSnapshotToSaleDetails.ts) (`comercial-jhoel-api/src/database/migrations/1760004300000-AddBusinessSnapshotToSaleDetails.ts`, 298 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Caja de Ventas por negocio" — before this migration, the only way to know which `business` a sold line belonged to was joining out to the *current* `products.business_id`, which silently rewrites history if a product's business classification ever changes later (exactly the historical-accuracy gap the ticket that built this flagged explicitly).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `confirm_sale`, `adjust_sale_item`; 

#### Clase `AddBusinessSnapshotToSaleDetails1760004300000` (L23–297)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Caja de Ventas por negocio" — before this migration, the only way to know which `business` a sold line belonged to was joining out to the *current* `products.business_id`, which silently rewrites history if a product's business classification ever changes later (exactly the historical-accuracy gap the ticket that built this flagged explicitly). `sale_details.business_id` is a permanent snapshot, taken once at the moment of sale — reusing `products.business_id` (the existing, real "línea de negocio" classification this app already has, see `CreateBusinessesTable`) as the single source of truth, never inventing a second one. Backfill uses each row's product's *current* business — the best (and only) information actually available for historical rows, per the ticket's own "no inventar datos" instruction. Going forward, `confirm_sale`/ `adjust_sale_item` both snapshot it at insert time (see

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 26–286 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 288–296 | — | `Promise<void>` |

##### `AddBusinessSnapshotToSaleDetails1760004300000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760004300000-AddBusinessSnapshotToSaleDetails.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004300000-AddBusinessSnapshotToSaleDetails.ts#L26) (L26–286)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `ensure_inventory_stock_row`; Tablas en su SQL: `sale_details`, `products`, `v_sale_id`, `v_product`, `v_location_id`, `inventory_locations`, `v_current_location_stock`, `inventory_stock`, `sales`, `v_detail`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddBusinessSnapshotToSaleDetails1760004300000.down`

- **Firma:** `down(): Promise<void>` — [1760004300000-AddBusinessSnapshotToSaleDetails.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004300000-AddBusinessSnapshotToSaleDetails.ts#L288) (L288–296)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760004400000-createsalescashboxmovements-ts"></a>

### 1760004400000-CreateSalesCashBoxMovements.ts

- **Ruta:** [1760004400000-CreateSalesCashBoxMovements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004400000-CreateSalesCashBoxMovements.ts) (`comercial-jhoel-api/src/database/migrations/1760004400000-CreateSalesCashBoxMovements.ts`, 204 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Caja de Ventas" por negocio — el equivalente de la Caja Contable de Recargas (`recharge_cash_box_movements`, ver `AddCashBoxContributionMovementType`), pero con saldo INDEPENDIENTE por `business_id` en vez de uno solo global.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_sales_cash_box_movement`; 

#### Clase `CreateSalesCashBoxMovements1760004400000` (L19–203)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Caja de Ventas" por negocio — el equivalente de la Caja Contable de Recargas (`recharge_cash_box_movements`, ver `AddCashBoxContributionMovementType`), pero con saldo INDEPENDIENTE por `business_id` en vez de uno solo global. Mismo diseño deliberado: nunca duplica las ventas reales (esas ya existen en `sales`/`sale_details`, separadas por negocio desde `AddBusinessSnapshotToSaleDetails`) — la única fila nueva por negocio es un "Aporte" o "Retiro" manual de efectivo, que no tiene ninguna otra fuente de verdad en el sistema. Sin `business_date` (a diferencia de Recargas) — el ticket que pidió esto es explícito en que el saldo es "acumulado", no un cuadre por día; `created_at` ya es el registro de auditoría real. Si un futuro cuadre diario por negocio se necesita, esa es una extensión posterior, no algo a inventar aquí.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 24–195 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 197–202 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateSalesCashBoxMovements1760004400000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760004400000-CreateSalesCashBoxMovements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004400000-CreateSalesCashBoxMovements.ts#L24) (L24–195)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.createTable`, `new Table`, `queryRunner.createIndex`, `new TableIndex`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`; Tablas en su SQL: `businesses`, `sale_details`, `sales`, `sales_cash_box_movements`, `v_income`, `v_expense`, `v_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateSalesCashBoxMovements1760004400000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760004400000-CreateSalesCashBoxMovements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004400000-CreateSalesCashBoxMovements.ts#L197) (L197–202)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `queryRunner.dropTable`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760004500000-addsearchnormalizationsupport-ts"></a>

### 1760004500000-AddSearchNormalizationSupport.ts

- **Ruta:** [1760004500000-AddSearchNormalizationSupport.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004500000-AddSearchNormalizationSupport.ts) (`comercial-jhoel-api/src/database/migrations/1760004500000-AddSearchNormalizationSupport.ts`, 101 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Buscador profesional" — infraestructura centralizada de normalización de texto para TODAS las búsquedas del sistema (productos, clientes, proveedores, usuarios, bancos, noticias, catálogos, tickets, cotizaciones, facturas).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `public`; 

#### Clase `AddSearchNormalizationSupport1760004500000` (L40–100)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Buscador profesional" — infraestructura centralizada de normalización de texto para TODAS las búsquedas del sistema (productos, clientes, proveedores, usuarios, bancos, noticias, catálogos, tickets, cotizaciones, facturas). Ninguna otra migración/tabla existente se toca — esto es puramente aditivo: dos extensiones (verificadas como NO instaladas antes de agregarlas, ver `pg_extension` en la doc de este cambio), dos funciones SQL, y dos índices funcionales sobre `products` (la tabla más grande y con más búsquedas del sistema). Por qué una función `IMMUTABLE` envolviendo `unaccent()`: la función `unaccent()` de PostgreSQL está marcada `STABLE`, no `IMMUTABLE` (depende de un diccionario que en teoría podría cambiar), lo que PostgreSQL rechaza usar dentro de un índice funcional. El patrón estándar y documentado de PostgreSQL para resolver esto es envolverla en una función SQL propia que fij

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 45–80 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 82–99 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddSearchNormalizationSupport1760004500000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760004500000-AddSearchNormalizationSupport.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004500000-AddSearchNormalizationSupport.ts#L45) (L45–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddSearchNormalizationSupport1760004500000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760004500000-AddSearchNormalizationSupport.ts](../../../../comercial-jhoel-api/src/database/migrations/1760004500000-AddSearchNormalizationSupport.ts#L82) (L82–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760005000000-createlandingbackgrounds-ts"></a>

### 1760005000000-CreateLandingBackgrounds.ts

- **Ruta:** [1760005000000-CreateLandingBackgrounds.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005000000-CreateLandingBackgrounds.ts) (`comercial-jhoel-api/src/database/migrations/1760005000000-CreateLandingBackgrounds.ts`, 61 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Fondos de Landing" (Sistema → Fondos de Landing) — capas visuales de profundidad (imagen + opacidad + overlay + posición/tamaño + efecto 3D + parallax + movimiento) asignadas a una sección real de la landing pública.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `landing_backgrounds`; 

#### Clase `CreateLandingBackgrounds1760005000000` (L21–60)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Fondos de Landing" (Sistema → Fondos de Landing) — capas visuales de profundidad (imagen + opacidad + overlay + posición/tamaño + efecto 3D + parallax + movimiento) asignadas a una sección real de la landing pública. Mismo shape BYTEA de imagen que `catalog_banks`/`news_articles` (contenido editorial autónomo, sin FK a otra entidad de negocio) con las columnas de configuración visual agregadas. `UQ_landing_backgrounds_section_active` (índice único parcial, `WHERE is_active = true`) es la garantía real de "una sección solo puede tener un fondo activo a la vez" — mismo patrón que `UQ_products_sku_active`/`UQ_sales_open_per_user`; el pre-check en `CreateLandingBackgroundUseCase`/`SetLandingBackgroundActiveUseCase` es el rechazo rápido y amigable, esto es lo que lo hace correcto incluso bajo una carrera. Puramente aditiva — no toca ninguna tabla existente.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 24–55 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 57–59 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateLandingBackgrounds1760005000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005000000-CreateLandingBackgrounds.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005000000-CreateLandingBackgrounds.ts#L24) (L24–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateLandingBackgrounds1760005000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760005000000-CreateLandingBackgrounds.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005000000-CreateLandingBackgrounds.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760005100000-createbankaccountmovements-ts"></a>

### 1760005100000-CreateBankAccountMovements.ts

- **Ruta:** [1760005100000-CreateBankAccountMovements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005100000-CreateBankAccountMovements.ts) (`comercial-jhoel-api/src/database/migrations/1760005100000-CreateBankAccountMovements.ts`, 872 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Saldos bancarios dinámicos — `banks.final_balance` deja de ser un valor que se escribe a mano cada día ("Guardar Cambios" en Agentes Bancarios → Bancos) y pasa a ser el saldo ACTUAL materializado de cada cuenta, movido únicamente por operaciones financieras registradas en un ledger nuevo, `bank_account_movements`.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `bank_account_movements`; funciones `apply_bank_account_movement`, `reverse_bank_account_movements`, `register_bank_transfer`, `void_bank_transfer`, `adjust_bank_balance`, `register_bank_deposit_operation`, `void_bank_deposit_operation`, `save_bank_balance`; 

#### Clase `CreateBankAccountMovements1760005100000` (L42–871)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Saldos bancarios dinámicos — `banks.final_balance` deja de ser un valor que se escribe a mano cada día ("Guardar Cambios" en Agentes Bancarios → Bancos) y pasa a ser el saldo ACTUAL materializado de cada cuenta, movido únicamente por operaciones financieras registradas en un ledger nuevo, `bank_account_movements`. Toda modificación de saldo pasa por UNA sola función (`apply_bank_account_movement`), que bloquea la fila de `banks` (`SELECT ... FOR UPDATE`), valida, escribe el movimiento (saldo anterior / monto / saldo posterior) y actualiza `banks.final_balance` en la misma transacción — dos operaciones concurrentes sobre la misma cuenta quedan serializadas y nunca usan el mismo saldo viejo. Estrictamente incremental — no se borra ni reescribe ningún dato: - `banks`: dos columnas nuevas NULLABLE (`special_account`, `max_balance`) rellenadas por nombre (reglas de Génesis / BI Club / Distric

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 45–861 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 863–870 | — | `Promise<void>` |

##### `CreateBankAccountMovements1760005100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005100000-CreateBankAccountMovements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005100000-CreateBankAccountMovements.ts#L45) (L45–861)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `apply_bank_account_movement`, `jsonb_array_elements`, `jsonb_array_elements_text`, `reverse_bank_account_movements`; Tablas en su SQL: `banks`, `transaction_types`, `users`, `roles`, `v_bank`, `v_movement_id`, `bank_account_movements`, `v_source`, `v_destination`, `v_total`, `v_current`, `v_transaction_type`, `v_bank_account_id`, `transaction_banks`, `clients`, `v_operation_id`, `bank_deposit_operations`, `v_transaction_bank_name`, `v_operation`, `v_previous_balance`, `bank_balances`, `v_balance_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateBankAccountMovements1760005100000.down`

- **Firma:** `down(): Promise<void>` — [1760005100000-CreateBankAccountMovements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005100000-CreateBankAccountMovements.ts#L863) (L863–870)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760005200000-addavailableintransaccionartobanks-ts"></a>

### 1760005200000-AddAvailableInTransaccionarToBanks.ts

- **Ruta:** [1760005200000-AddAvailableInTransaccionarToBanks.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005200000-AddAvailableInTransaccionarToBanks.ts) (`comercial-jhoel-api/src/database/migrations/1760005200000-AddAvailableInTransaccionarToBanks.ts`, 426 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** "Cuentas visibles en Transaccionar" — `banks.available_in_transaccionar` decide qué cuentas aparecen en el selector "Cuenta bancaria afectada" (Depósito/Retiro/Reintegro).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_bank_deposit_operation`; 

#### Clase `AddAvailableInTransaccionarToBanks1760005200000` (L19–425)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** "Cuentas visibles en Transaccionar" — `banks.available_in_transaccionar` decide qué cuentas aparecen en el selector "Cuenta bancaria afectada" (Depósito/Retiro/Reintegro). Se configura por cuenta en Sistema → Bancos. Puramente aditiva: `DEFAULT true`, así que cada cuenta existente sigue disponible exactamente como hoy hasta que un admin la desmarque. La línea de crédito de Génesis no depende de este flag (Desembolsos/Pagos Génesis la resuelven solos). Transferencias Bancarias tampoco — ahí siguen apareciendo todas las cuentas activas. `register_bank_deposit_operation` (misma firma, `CREATE OR REPLACE`) gana una sola validación: la cuenta elegida debe estar habilitada, de lo contrario `BANK_ACCOUNT_NOT_AVAILABLE` y se revierte todo. Cuerpo idéntico al de `CreateBankAccountMovements` en todo lo demás.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 22–227 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 229–424 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddAvailableInTransaccionarToBanks1760005200000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005200000-AddAvailableInTransaccionarToBanks.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005200000-AddAvailableInTransaccionarToBanks.ts#L22) (L22–227)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`, `apply_bank_account_movement`; Tablas en su SQL: `v_transaction_type`, `transaction_types`, `v_bank_account_id`, `banks`, `v_bank`, `transaction_banks`, `clients`, `v_operation_id`, `bank_deposit_operations`, `v_transaction_bank_name`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddAvailableInTransaccionarToBanks1760005200000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760005200000-AddAvailableInTransaccionarToBanks.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005200000-AddAvailableInTransaccionarToBanks.ts#L229) (L229–424)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`, `apply_bank_account_movement`; Tablas en su SQL: `v_transaction_type`, `transaction_types`, `v_bank_account_id`, `banks`, `v_bank`, `transaction_banks`, `clients`, `v_operation_id`, `bank_deposit_operations`, `v_transaction_bank_name`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760005300000-addcashwithdrawaltobanktransfers-ts"></a>

### 1760005300000-AddCashWithdrawalToBankTransfers.ts

- **Ruta:** [1760005300000-AddCashWithdrawalToBankTransfers.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005300000-AddCashWithdrawalToBankTransfers.ts) (`comercial-jhoel-api/src/database/migrations/1760005300000-AddCashWithdrawalToBankTransfers.ts`, 247 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Transferencias Bancarias — dos reglas nuevas, puramente incrementales: 1.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `apply_bank_account_movement`, `register_bank_transfer`, `void_bank_transfer`; 

#### Clase `AddCashWithdrawalToBankTransfers1760005300000` (L23–246)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Transferencias Bancarias — dos reglas nuevas, puramente incrementales: 1. **Retiro de efectivo en banco**: `register_bank_transfer` acepta `p_destination_bank_id = NULL`, que registra UN solo movimiento `RETIRO_EFECTIVO` (resta el saldo del origen; nada se acredita a otra cuenta). Mismas validaciones que una transferencia (monto &gt; 0, saldo suficiente — ni Génesis puede quedar negativo por esto). Queda con `reference_type = 'BANK_TRANSFER'`, así que se lista, se reporta y se anula (movimiento inverso) igual que una transferencia. 2. **BI Club Empresarial como origen solo traslada a Banco Industrial** (`TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB`), incluido el retiro de efectivo. La regla anterior (BI Club solo RECIBE de Banco Industrial) se conserva. El CHECK de `movement_type` se reemplaza (DROP CONSTRAINT + ADD) solo para añadir `RETIRO_EFECTIVO`: ninguna fila cambia y todos los valores e

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 26–239 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 241–245 | — | `Promise<void>` |

##### `AddCashWithdrawalToBankTransfers1760005300000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005300000-AddCashWithdrawalToBankTransfers.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005300000-AddCashWithdrawalToBankTransfers.ts#L26) (L26–239)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `apply_bank_account_movement`; Tablas en su SQL: `v_bank`, `banks`, `v_movement_id`, `v_source`, `v_destination`, `v_total`, `bank_account_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddCashWithdrawalToBankTransfers1760005300000.down`

- **Firma:** `down(): Promise<void>` — [1760005300000-AddCashWithdrawalToBankTransfers.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005300000-AddCashWithdrawalToBankTransfers.ts#L241) (L241–245)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760005400000-reintegroalsodebitsgenesis-ts"></a>

### 1760005400000-ReintegroAlsoDebitsGenesis.ts

- **Ruta:** [1760005400000-ReintegroAlsoDebitsGenesis.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005400000-ReintegroAlsoDebitsGenesis.ts) (`comercial-jhoel-api/src/database/migrations/1760005400000-ReintegroAlsoDebitsGenesis.ts`, 469 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Reintegro Génesis = abono a la línea de crédito de Fundación Génesis Empresarial.
- **Paquetes externos:** `typeorm`
- **Consumidores:** [1760006200000-OptionalCashBreakdownInTransaccionar.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760006200000-optionalcashbreakdownintransaccionar-ts)
- **Define en la base de datos:** funciones `register_bank_deposit_operation`; 

#### Clase `ReintegroAlsoDebitsGenesis1760005400000` (L21–468)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Reintegro Génesis = abono a la línea de crédito de Fundación Génesis Empresarial. Hasta ahora `register_bank_deposit_operation` solo restaba el monto de la cuenta origen elegida; ahora, en la misma transacción, también resta el mismo monto de la cuenta `special_account = 'GENESIS'`: - Dos movimientos `REINTEGRO` con el mismo `reference_id` (la operación) y `counterpart_bank_id` cruzado, así `void_bank_deposit_operation` revierte ambos sin cambios. - Bloquea las dos filas en orden de id antes de aplicarlos (igual que `register_bank_transfer`). - Sin línea Génesis activa → `GENESIS_ACCOUNT_NOT_CONFIGURED`; elegir la propia línea Génesis como origen → `REINTEGRO_SOURCE_IS_GENESIS`. - Génesis puede quedar en negativo igual que con un Desembolso (regla de `apply_bank_account_movement`, sin cambios). Misma firma → `CREATE OR REPLACE`. Solo afecta operaciones nuevas.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 24–263 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 265–467 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `ReintegroAlsoDebitsGenesis1760005400000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005400000-ReintegroAlsoDebitsGenesis.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005400000-ReintegroAlsoDebitsGenesis.ts#L24) (L24–263)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`, `apply_bank_account_movement`; Tablas en su SQL: `v_transaction_type`, `transaction_types`, `v_bank_account_id`, `banks`, `v_bank`, `transaction_banks`, `v_genesis_account_id`, `clients`, `v_operation_id`, `bank_deposit_operations`, `v_transaction_bank_name`, `v_source_account_name`; Ejecuta SQL crudo (`query`)
- **Consumidores:** [1760006200000-OptionalCashBreakdownInTransaccionar.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760006200000-optionalcashbreakdownintransaccionar-ts)

##### `ReintegroAlsoDebitsGenesis1760005400000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760005400000-ReintegroAlsoDebitsGenesis.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005400000-ReintegroAlsoDebitsGenesis.ts#L265) (L265–467)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`, `apply_bank_account_movement`; Tablas en su SQL: `v_transaction_type`, `transaction_types`, `v_bank_account_id`, `banks`, `v_bank`, `transaction_banks`, `clients`, `v_operation_id`, `bank_deposit_operations`, `v_transaction_bank_name`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760005500000-addreferencetoassets-ts"></a>

### 1760005500000-AddReferenceToAssets.ts

- **Ruta:** [1760005500000-AddReferenceToAssets.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005500000-AddReferenceToAssets.ts) (`comercial-jhoel-api/src/database/migrations/1760005500000-AddReferenceToAssets.ts`, 127 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Transaccionar "Enviar a Activos" (Retiros y Desembolsos Génesis): el CARGO en Activos queda ligado a la operación que lo originó, igual que Cuentas por Cobrar desde `AddClientAndReferenceForBankDepositReceivables`.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_asset_movement`; 

#### Clase `AddReferenceToAssets1760005500000` (L16–126)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Transaccionar "Enviar a Activos" (Retiros y Desembolsos Génesis): el CARGO en Activos queda ligado a la operación que lo originó, igual que Cuentas por Cobrar desde `AddClientAndReferenceForBankDepositReceivables`. - `assets.reference_type` / `reference_id` (nullables, en pareja — mismo CHECK `all-or-nothing` que `accounts_receivable`). Hoy el único escritor es Transaccionar con `reference_type = 'BANK_DEPOSIT'`. - `register_asset_movement` gana `p_reference_type`/`p_reference_id` (DEFAULT NULL). Postgres identifica la función por sus tipos, así que se borra la firma anterior antes de crear la nueva. Cuerpo idéntico en todo lo demás; los llamadores existentes (Registrar Cargo/Abono) no cambian.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 19–77 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 79–125 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddReferenceToAssets1760005500000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005500000-AddReferenceToAssets.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005500000-AddReferenceToAssets.ts#L19) (L19–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`; Tablas en su SQL: `v_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddReferenceToAssets1760005500000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760005500000-AddReferenceToAssets.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005500000-AddReferenceToAssets.ts#L79) (L79–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`; Tablas en su SQL: `v_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760005600000-addbankbalancecredit-ts"></a>

### 1760005600000-AddBankBalanceCredit.ts

- **Ruta:** [1760005600000-AddBankBalanceCredit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005600000-AddBankBalanceCredit.ts) (`comercial-jhoel-api/src/database/migrations/1760005600000-AddBankBalanceCredit.ts`, 140 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Finanzas → Transferencias Bancarias → "Acreditar saldo": suma un monto directamente al saldo de UNA cuenta, sin contrapartida (no toca otra cuenta, caja ni efectivo).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_bank_balance_credit`, `void_bank_balance_credit`; 

#### Clase `AddBankBalanceCredit1760005600000` (L25–139)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Finanzas → Transferencias Bancarias → "Acreditar saldo": suma un monto directamente al saldo de UNA cuenta, sin contrapartida (no toca otra cuenta, caja ni efectivo). Distinta del Depósito de Transaccionar y de una transferencia — por eso tiene su propio tipo de movimiento. Estrictamente incremental — ninguna tabla nueva, ningún dato cambia: - `bank_account_movements`: los CHECK de `movement_type` y `origin` aceptan además `ACREDITACION_SALDO` (todos los valores existentes siguen siendo válidos). - `register_bank_balance_credit`: valida el monto (&gt; 0, máx. 2 decimales) y delega en `apply_bank_account_movement` — el ÚNICO punto que modifica `banks.final_balance` (lock `FOR UPDATE`, ledger con saldo anterior/posterior, límite `max_balance`). Cada acreditación recibe un id de operación propio como referencia (`reference_type = 'ACREDITACION_SALDO'`), lo que permite anularla con el mecanismo

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 28–125 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 127–138 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AddBankBalanceCredit1760005600000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005600000-AddBankBalanceCredit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005600000-AddBankBalanceCredit.ts#L28) (L28–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `bank_account_movements`, `dentro`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddBankBalanceCredit1760005600000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760005600000-AddBankBalanceCredit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005600000-AddBankBalanceCredit.ts#L127) (L127–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760005700000-biclubcreditline-ts"></a>

### 1760005700000-BiClubCreditLine.ts

- **Ruta:** [1760005700000-BiClubCreditLine.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005700000-BiClubCreditLine.ts) (`comercial-jhoel-api/src/database/migrations/1760005700000-BiClubCreditLine.ts`, 586 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** BI Club Empresarial pasa a comportarse como LÍNEA DE CRÉDITO: su saldo (`banks.final_balance`) es el saldo de la línea — Q0.00 = nada utilizado, negativo = monto utilizado/adeudado.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `apply_bank_account_movement`, `register_bank_transfer`, `void_bank_transfer`, `save_bank_balance`; 

#### Clase `BiClubCreditLine1760005700000` (L47–518)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** BI Club Empresarial pasa a comportarse como LÍNEA DE CRÉDITO: su saldo (`banks.final_balance`) es el saldo de la línea — Q0.00 = nada utilizado, negativo = monto utilizado/adeudado. Siempre `-max_balance &lt;= saldo &lt;= 0`. Banco Industrial → BI Club (uso de la línea): Banco Industrial saldo − monto (regla normal: saldo suficiente) BI Club saldo − monto (nuevo ≥ −límite) BI Club → Banco Industrial (pago / devolución): BI Club saldo + monto (nuevo ≤ 0; si no hay deuda, se rechaza) Banco Industrial saldo + monto Estrictamente incremental — ninguna tabla, columna ni fila existente se borra o reescribe; solo `CREATE OR REPLACE` de funciones con la MISMA firma: - `apply_bank_account_movement` (el único punto que modifica `banks.final_balance`, con `FOR UPDATE`): para `special_account = 'BI_CLUB'` reemplaza las reglas de cuenta normal (no negativo / `max_balance` como techo) por las de la línea: u

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 50–309 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 311–517 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `BiClubCreditLine1760005700000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005700000-BiClubCreditLine.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005700000-BiClubCreditLine.ts#L50) (L50–309)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `saveBankBalanceSql`
- **Efectos secundarios:** Llama funciones SQL: `apply_bank_account_movement`; Tablas en su SQL: `v_bank`, `banks`, `v_movement_id`, `v_source`, `v_destination`, `v_total`, `bank_account_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BiClubCreditLine1760005700000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760005700000-BiClubCreditLine.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005700000-BiClubCreditLine.ts#L311) (L311–517)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `saveBankBalanceSql`
- **Efectos secundarios:** Llama funciones SQL: `apply_bank_account_movement`; Tablas en su SQL: `v_bank`, `banks`, `v_movement_id`, `v_source`, `v_destination`, `v_total`, `bank_account_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `saveBankBalanceSql` (L524–585)

- **Tipo:** función local del archivo
- **Firma:** `saveBankBalanceSql(negativeAllowed: string[]): string` — [1760005700000-BiClubCreditLine.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005700000-BiClubCreditLine.ts#L524)
- **Propósito / descripción:** `save_bank_balance` — cuerpo idéntico al de `CreateBankAccountMovements`; solo varía qué cuentas especiales admiten una foto diaria negativa.
- **Dependencias:** `negativeAllowed.map((value) => ''${value}'').join`, `negativeAllowed.map`
- **Efectos secundarios:** Tablas en su SQL: `v_bank`, `banks`, `v_previous_balance`, `bank_balances`, `v_balance_id`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1760005800000-biclubcreditlinedirection-ts"></a>

### 1760005800000-BiClubCreditLineDirection.ts

- **Ruta:** [1760005800000-BiClubCreditLineDirection.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005800000-BiClubCreditLineDirection.ts) (`comercial-jhoel-api/src/database/migrations/1760005800000-BiClubCreditLineDirection.ts`, 207 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Corrige el SENTIDO de la línea de crédito de BI Club Empresarial (`BiClubCreditLine`, 1760005700000).
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `register_bank_transfer`, `void_bank_transfer`; 

#### Clase `BiClubCreditLineDirection1760005800000` (L27–40)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Corrige el SENTIDO de la línea de crédito de BI Club Empresarial (`BiClubCreditLine`, 1760005700000). El flujo real del negocio es: Uso de la línea: BI Club → Banco Industrial BI Club saldo − monto (nuevo ≥ −límite) Banco Industrial saldo + monto (recibe el dinero) Pago (fin del día): Banco Industrial → BI Club Banco Industrial saldo − monto (regla normal: saldo suficiente) BI Club saldo + monto (nuevo ≤ 0; sin deuda se rechaza) Es decir, en una transferencia TODAS las cuentas usan la regla normal (origen resta, destino suma); lo único especial de BI Club son sus límites, que ya aplica `apply_bank_account_movement` (sin cambios aquí). Solo `CREATE OR REPLACE` de dos funciones con la misma firma; ninguna tabla ni fila cambia: - `register_bank_transfer`: se retira la inversión de signo de BI Club. Reglas de dirección sin cambios (BI Club solo ↔ Banco Industrial, sin retiro de efectivo desd

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 30–33 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 35–39 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `BiClubCreditLineDirection1760005800000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005800000-BiClubCreditLineDirection.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005800000-BiClubCreditLineDirection.ts#L30) (L30–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `registerBankTransferSql`, `voidBankTransferSql`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BiClubCreditLineDirection1760005800000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760005800000-BiClubCreditLineDirection.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005800000-BiClubCreditLineDirection.ts#L35) (L35–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `registerBankTransferSql`, `voidBankTransferSql`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `registerBankTransferSql` (L46–147)

- **Tipo:** función local del archivo
- **Firma:** `registerBankTransferSql(invertBiClub: boolean): string` — [1760005800000-BiClubCreditLineDirection.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005800000-BiClubCreditLineDirection.ts#L46)
- **Propósito / descripción:** `register_bank_transfer`; `invertBiClub = true` es la versión de 1760005700000 (BI Club resta al recibir y suma al enviar).
- **Efectos secundarios:** Llama funciones SQL: `apply_bank_account_movement`; Tablas en su SQL: `banks`, `v_source`, `v_destination`
- **Consumidores:** uso interno del archivo

#### Función `voidBankTransferSql` (L154–206)

- **Tipo:** función local del archivo
- **Firma:** `voidBankTransferSql(version: 'new' \| 'previous'): string` — [1760005800000-BiClubCreditLineDirection.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005800000-BiClubCreditLineDirection.ts#L154)
- **Propósito / descripción:** `void_bank_transfer`. `new`: bloquea las transferencias de BI Club con el sentido invertido de 1760005700000 (entrada negativa / salida positiva). `previous`: la versión de 1760005700000 (bloqueaba el signo contrario).
- **Efectos secundarios:** Tablas en su SQL: `v_total`, `bank_account_movements`, `banks`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1760005900000-biclubavailablecredit-ts"></a>

### 1760005900000-BiClubAvailableCredit.ts

- **Ruta:** [1760005900000-BiClubAvailableCredit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005900000-BiClubAvailableCredit.ts) (`comercial-jhoel-api/src/database/migrations/1760005900000-BiClubAvailableCredit.ts`, 258 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** BI Club Empresarial — modelo definitivo confirmado con el negocio: su saldo es el DISPONIBLE de la línea de crédito con signo negativo.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `apply_bank_account_movement`, `void_bank_transfer`; 

#### Clase `BiClubAvailableCredit1760005900000` (L37–68)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** BI Club Empresarial — modelo definitivo confirmado con el negocio: su saldo es el DISPONIBLE de la línea de crédito con signo negativo. −Q75,000 = Q75,000 disponibles (línea sin usar) Q0.00 = nada disponible (línea agotada; ya no puede enviar) Uso: BI Club → Banco Industrial 75,000 BI Club −75,000 → 0 Banco Industrial + 75,000 Pago (fin de día): Banco Industrial → BI Club 75,000 BI Club 0 → −75,000 Banco Industrial − 75,000 Regla única en `apply_bank_account_movement` (el único punto que modifica `banks.final_balance`): para BI Club, todo movimiento OPERATIVO tiene el efecto contrario al de una cuenta normal (enviar/depositar consume disponible → el saldo SUBE hacia 0; recibir/acreditar lo repone → BAJA hacia −límite). No se invierten `AJUSTE_MANUAL` (fija un saldo objetivo), `ANULACION` (ya revierte el monto guardado) ni `SALDO_INICIAL`. `register_bank_transfer`, Transaccionar y Acredit

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 40–60 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 62–67 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `BiClubAvailableCredit1760005900000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760005900000-BiClubAvailableCredit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005900000-BiClubAvailableCredit.ts#L40) (L40–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `applyBankAccountMovementSql`, `voidBankTransferSql`
- **Efectos secundarios:** Llama funciones SQL: `apply_bank_account_movement`; Tablas en su SQL: `banks`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BiClubAvailableCredit1760005900000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760005900000-BiClubAvailableCredit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005900000-BiClubAvailableCredit.ts#L62) (L62–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `applyBankAccountMovementSql`, `voidBankTransferSql`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `applyBankAccountMovementSql` (L74–199)

- **Tipo:** función local del archivo
- **Firma:** `applyBankAccountMovementSql(availableModel: boolean): string` — [1760005900000-BiClubAvailableCredit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005900000-BiClubAvailableCredit.ts#L74)
- **Propósito / descripción:** `availableModel = true`: BI Club invierte los movimientos operativos y usa los códigos de disponible. `false`: versión de 1760005700000.
- **Efectos secundarios:** Tablas en su SQL: `v_bank`, `banks`, `v_movement_id`
- **Consumidores:** uso interno del archivo

#### Función `voidBankTransferSql` (L206–257)

- **Tipo:** función local del archivo
- **Firma:** `voidBankTransferSql(availableModel: boolean): string` — [1760005900000-BiClubAvailableCredit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760005900000-BiClubAvailableCredit.ts#L206)
- **Propósito / descripción:** `availableModel = true`: bloquea anular transferencias de BI Club con entrada positiva / salida negativa (signo contrario a este modelo). `false`: versión de 1760005800000 (bloqueaba el signo opuesto).
- **Efectos secundarios:** Tablas en su SQL: `v_total`, `bank_account_movements`, `banks`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1760006000000-biclubdebtmodel-ts"></a>

### 1760006000000-BiClubDebtModel.ts

- **Ruta:** [1760006000000-BiClubDebtModel.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006000000-BiClubDebtModel.ts) (`comercial-jhoel-api/src/database/migrations/1760006000000-BiClubDebtModel.ts`, 266 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** BI Club Empresarial — REGLA DEFINITIVA (reemplaza el modelo de `1760005900000-BiClubAvailableCredit`): el saldo es la DEUDA de la línea.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `apply_bank_account_movement`, `void_bank_transfer`; 

#### Clase `BiClubDebtModel1760006000000` (L33–76)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** BI Club Empresarial — REGLA DEFINITIVA (reemplaza el modelo de `1760005900000-BiClubAvailableCredit`): el saldo es la DEUDA de la línea. Q0.00 = no se debe nada (Q75,000 disponibles) −Q50,000 = se deben Q50,000 (disponible = límite + saldo = Q25,000) Rango: −max_balance ≤ saldo ≤ 0 Uso: BI Club → Banco Industrial BI Club − monto Industrial + monto Pago: Banco Industrial → BI Club Industrial − monto BI Club + monto En una transferencia todas las cuentas usan la regla normal (origen resta, destino suma) — `register_bank_transfer` ya lo hace desde 1760005800000 y no cambia aquí. Solo `CREATE OR REPLACE` (misma firma): - `apply_bank_account_movement`: se retira la inversión de signo de BI Club que agregó 1760005900000; quedan sus límites con los códigos `CREDIT_LINE_LIMIT_EXCEEDED` (saldo &lt; −límite), `CREDIT_LINE_NO_DEBT` (pago sin deuda) y `CREDIT_LINE_OVERPAYMENT` (pago &gt; deuda), para todo

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 36–69 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 71–75 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `BiClubDebtModel1760006000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006000000-BiClubDebtModel.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006000000-BiClubDebtModel.ts#L36) (L36–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `applyBankAccountMovementSql`, `voidBankTransferSql`
- **Efectos secundarios:** Llama funciones SQL: `apply_bank_account_movement`; Tablas en su SQL: `banks`, `bank_account_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BiClubDebtModel1760006000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006000000-BiClubDebtModel.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006000000-BiClubDebtModel.ts#L71) (L71–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `applyBankAccountMovementSql`, `voidBankTransferSql`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `applyBankAccountMovementSql` (L82–207)

- **Tipo:** función local del archivo
- **Firma:** `applyBankAccountMovementSql(availableModel: boolean): string` — [1760006000000-BiClubDebtModel.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006000000-BiClubDebtModel.ts#L82)
- **Propósito / descripción:** `availableModel = false`: regla definitiva (saldo = deuda, sin inversión). `true`: versión de 1760005900000 (saldo = −disponible, delta invertido).
- **Efectos secundarios:** Tablas en su SQL: `v_bank`, `banks`, `v_movement_id`
- **Consumidores:** uso interno del archivo

#### Función `voidBankTransferSql` (L214–265)

- **Tipo:** función local del archivo
- **Firma:** `voidBankTransferSql(availableModel: boolean): string` — [1760006000000-BiClubDebtModel.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006000000-BiClubDebtModel.ts#L214)
- **Propósito / descripción:** `availableModel = false`: bloquea anular transferencias de BI Club con entrada negativa / salida positiva (signo contrario a la regla definitiva). `true`: versión de 1760005900000.
- **Efectos secundarios:** Tablas en su SQL: `v_total`, `bank_account_movements`, `banks`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1760006100000-transactionbankimageandazteca-ts"></a>

### 1760006100000-TransactionBankImageAndAzteca.ts

- **Ruta:** [1760006100000-TransactionBankImageAndAzteca.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006100000-TransactionBankImageAndAzteca.ts) (`comercial-jhoel-api/src/database/migrations/1760006100000-TransactionBankImageAndAzteca.ts`, 57 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Banco Agente (`transaction_banks`): 1.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `TransactionBankImageAndAzteca1760006100000` (L19–56)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Banco Agente (`transaction_banks`): 1. Logo opcional para identificar el banco en el modal "Selecciona el banco" de Transaccionar — mismas columnas que `catalog_banks` (`image_data` BYTEA + mime + tamaño). Solo visual: ninguna función financiera las lee. 2. Alta del banco agente "Banco Azteca" si todavía no hay uno activo cuyo nombre contenga "azteca" (idempotente). `created_by` = el SUPER_ADMIN activo más antiguo; si no existe ninguno, no se inserta nada (se puede crear a mano en Sistema → Banco Agente). La CUENTA "Banco Azteca" en Sistema → Bancos no se crea aquí: requiere su número de cuenta real. `down` solo quita las columnas: el banco agente puede ya tener operaciones registradas, así que nunca se borra.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 22–46 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 48–55 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `TransactionBankImageAndAzteca1760006100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006100000-TransactionBankImageAndAzteca.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006100000-TransactionBankImageAndAzteca.ts#L22) (L22–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `users`, `roles`, `transaction_banks`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBankImageAndAzteca1760006100000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006100000-TransactionBankImageAndAzteca.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006100000-TransactionBankImageAndAzteca.ts#L48) (L48–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760006200000-optionalcashbreakdownintransaccionar-ts"></a>

### 1760006200000-OptionalCashBreakdownInTransaccionar.ts

- **Ruta:** [1760006200000-OptionalCashBreakdownInTransaccionar.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006200000-OptionalCashBreakdownInTransaccionar.ts) (`comercial-jhoel-api/src/database/migrations/1760006200000-OptionalCashBreakdownInTransaccionar.ts`, 317 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Transaccionar — desglose de efectivo OPCIONAL + "Últimas transacciones".
- **Depende de (archivos del proyecto):** [1760005400000-ReintegroAlsoDebitsGenesis.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760005400000-reintegroalsodebitsgenesis-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [1760006400000-GuayacanInvertsDepositWithdrawal.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760006400000-guayacaninvertsdepositwithdrawal-ts)
- **Define en la base de datos:** funciones `register_bank_deposit_operation`; 

#### Clase `OptionalCashBreakdownInTransaccionar1760006200000` (L29–316)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Transaccionar — desglose de efectivo OPCIONAL + "Últimas transacciones". 1. `bank_deposit_operations.cash_breakdown_enabled` (`NOT NULL DEFAULT true`): cada operación histórica se registró con desglose, así que el default las describe tal cual — no hay backfill. 2. `register_bank_deposit_operation` gana `p_cash_breakdown_enabled BOOLEAN DEFAULT TRUE` (último parámetro). Con `TRUE` el cuerpo es el de `ReintegroAlsoDebitsGenesis` sin cambios (efectivo − vuelto = monto). Con `FALSE` NO hay desglose: `p_cash_details` debe venir vacío (`CASH_BREAKDOWN_NOT_EXPECTED`), no se acepta vuelto (`INVALID_CHANGE_GIVEN`) y `total_cash` queda en 0 — nunca un desglose ficticio. La distribución (suma = monto), los saldos, Génesis/BI Club y Reintegro son idénticos en ambos modos. Con desglose activo y sin denominaciones → `CASH_BREAKDOWN_REQUIRED` (antes `CASH_TOTAL_MISMATCH`; mismo rechazo, mensaje más cl

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 32–305 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 307–315 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `OptionalCashBreakdownInTransaccionar1760006200000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006200000-OptionalCashBreakdownInTransaccionar.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006200000-OptionalCashBreakdownInTransaccionar.ts#L32) (L32–305)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`, `apply_bank_account_movement`; Tablas en su SQL: `v_transaction_type`, `transaction_types`, `v_bank_account_id`, `banks`, `v_bank`, `transaction_banks`, `v_genesis_account_id`, `clients`, `v_operation_id`, `bank_deposit_operations`, `v_transaction_bank_name`, `v_source_account_name`; Ejecuta SQL crudo (`query`)
- **Consumidores:** [1760006400000-GuayacanInvertsDepositWithdrawal.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760006400000-guayacaninvertsdepositwithdrawal-ts)

##### `OptionalCashBreakdownInTransaccionar1760006200000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006200000-OptionalCashBreakdownInTransaccionar.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006200000-OptionalCashBreakdownInTransaccionar.ts#L307) (L307–315)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `new ReintegroAlsoDebitsGenesis1760005400000().up`, `new ReintegroAlsoDebitsGenesis1760005400000`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760006300000-createguayacancashbox-ts"></a>

### 1760006300000-CreateGuayacanCashBox.ts

- **Ruta:** [1760006300000-CreateGuayacanCashBox.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006300000-CreateGuayacanCashBox.ts) (`comercial-jhoel-api/src/database/migrations/1760006300000-CreateGuayacanCashBox.ts`, 481 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Cooperativa Guayacán — comisión por transacción + Caja (Kardex) propia.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `guayacan_cash_movements`, `guayacan_cash_movement_details`, `guayacan_cash_counts`, `guayacan_cash_count_details`; funciones `guayacan_valid_denomination`, `apply_guayacan_cash_movement`, `register_guayacan_cash_movement`, `void_guayacan_cash_movement`, `guayacan_commission_on_operation_insert`, `guayacan_commission_on_operation_void`; triggers `trg_guayacan_commission_insert`, `trg_guayacan_commission_void`

#### Clase `CreateGuayacanCashBox1760006300000` (L39–480)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Cooperativa Guayacán — comisión por transacción + Caja (Kardex) propia. 1. `transaction_banks.cash_box_code` ('GUAYACAN') identifica al banco agente — nunca por nombre en el código — y `transaction_banks.commission_per_transaction` es la ÚNICA fuente de la tarifa (Q3.00). Ambas NULL en cualquier otro banco agente: ninguno más genera comisión. Se marca solo si hay exactamente UN banco agente activo cuyo nombre normalizado contiene "guayacan" o es "cooperativa"; si no, se marca desde Sistema → Banco Agente (no se adivina). 2. `guayacan_cash_movements`: ledger de la caja (saldo anterior / monto con signo / saldo posterior, `sequence` estricta). Saldo inicial = 0 (no se inventa). Tipos: INGRESO, EGRESO, AJUSTE (admin), COMISION_TRANSACCION, REVERSO_COMISION, ANULACION. Nada se edita ni se borra: anular marca el original ANULADO y agrega el movimiento inverso (`reversal_of_id`). `client_reque

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 42–454 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 456–479 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateGuayacanCashBox1760006300000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006300000-CreateGuayacanCashBox.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006300000-CreateGuayacanCashBox.ts#L42) (L42–454)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`, `jsonb_array_elements`, `apply_guayacan_cash_movement`; Tablas en su SQL: `transaction_banks`, `candidates`, `v_id`, `guayacan_cash_movements`, `v_before`, `v_movement`, `v_agent`, `v_commission`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateGuayacanCashBox1760006300000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006300000-CreateGuayacanCashBox.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006300000-CreateGuayacanCashBox.ts#L456) (L456–479)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760006400000-guayacaninvertsdepositwithdrawal-ts"></a>

### 1760006400000-GuayacanInvertsDepositWithdrawal.ts

- **Ruta:** [1760006400000-GuayacanInvertsDepositWithdrawal.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006400000-GuayacanInvertsDepositWithdrawal.ts) (`comercial-jhoel-api/src/database/migrations/1760006400000-GuayacanInvertsDepositWithdrawal.ts`, 300 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Cooperativa Guayacán: Depósito y Retiro mueven su cuenta al REVÉS que los demás bancos agente — el Depósito SUMA al saldo de la cuenta y el Retiro RESTA (en el resto, Depósito resta y Retiro suma).
- **Depende de (archivos del proyecto):** [1760006200000-OptionalCashBreakdownInTransaccionar.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760006200000-optionalcashbreakdownintransaccionar-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [1760006700000-GuayacanSingleBalanceFromCashBox.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760006700000-guayacansinglebalancefromcashbox-ts)
- **Define en la base de datos:** funciones `register_bank_deposit_operation`; 

#### Clase `GuayacanInvertsDepositWithdrawal1760006400000` (L21–299)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Cooperativa Guayacán: Depósito y Retiro mueven su cuenta al REVÉS que los demás bancos agente — el Depósito SUMA al saldo de la cuenta y el Retiro RESTA (en el resto, Depósito resta y Retiro suma). Se decide por el banco agente de la operación (`transaction_banks.cash_box_code = 'GUAYACAN'`), nunca por nombre. Reintegro, Génesis y todos los demás bancos no cambian. Solo cambia el signo de `v_delta` en `register_bank_deposit_operation` (misma firma de 12 parámetros → `CREATE OR REPLACE`). Las reglas de saldo siguen en `apply_bank_account_movement` (un Retiro Guayacán exige saldo suficiente; un Depósito respeta `max_balance`). Anular sigue igual: `reverse_bank_account_movements` invierte el movimiento realmente aplicado, así que operaciones anteriores a este cambio se revierten bien. No toca movimientos históricos. `down` restaura el cuerpo de `OptionalCashBreakdownInTransaccionar`.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 24–291 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 293–298 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `GuayacanInvertsDepositWithdrawal1760006400000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006400000-GuayacanInvertsDepositWithdrawal.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006400000-GuayacanInvertsDepositWithdrawal.ts#L24) (L24–291)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`, `apply_bank_account_movement`; Tablas en su SQL: `v_transaction_type`, `transaction_types`, `v_bank_account_id`, `banks`, `v_bank`, `transaction_banks`, `v_genesis_account_id`, `clients`, `v_operation_id`, `bank_deposit_operations`, `v_is_guayacan_agent`, `v_transaction_bank_name`, `v_source_account_name`; Ejecuta SQL crudo (`query`)
- **Consumidores:** [1760006700000-GuayacanSingleBalanceFromCashBox.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760006700000-guayacansinglebalancefromcashbox-ts)

##### `GuayacanInvertsDepositWithdrawal1760006400000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006400000-GuayacanInvertsDepositWithdrawal.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006400000-GuayacanInvertsDepositWithdrawal.ts#L293) (L293–298)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new OptionalCashBreakdownInTransaccionar1760006200000().up`, `new OptionalCashBreakdownInTransaccionar1760006200000`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760006500000-guayacanaccountoutsideagentreconciliation-ts"></a>

### 1760006500000-GuayacanAccountOutsideAgentReconciliation.ts

- **Ruta:** [1760006500000-GuayacanAccountOutsideAgentReconciliation.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006500000-GuayacanAccountOutsideAgentReconciliation.ts) (`comercial-jhoel-api/src/database/migrations/1760006500000-GuayacanAccountOutsideAgentReconciliation.ts`, 77 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** La cuenta de Cooperativa Guayacán tiene su propio cuadre (Cuadre de Caja Guayacán): NO entra en Cuadre de Agentes — ni en el desglose de bancos ni en sus totales, ni se exige su saldo del día para cerrar.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `GuayacanAccountOutsideAgentReconciliation1760006500000` (L21–76)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** La cuenta de Cooperativa Guayacán tiene su propio cuadre (Cuadre de Caja Guayacán): NO entra en Cuadre de Agentes — ni en el desglose de bancos ni en sus totales, ni se exige su saldo del día para cerrar. Se identifica con una cuenta especial nueva, `banks.special_account = 'GUAYACAN'` (seleccionable en Sistema → Bancos), nunca por nombre en el código. Esta migración la marca sola solo si hay exactamente UNA cuenta activa sin cuenta especial cuyo nombre normalizado contiene "guayacan"; si no, se marca a mano en Sistema → Bancos. `GUAYACAN` no cambia ninguna regla de saldo (`apply_bank_account_movement` la trata como una cuenta normal) ni de transferencias. Solo se amplían el CHECK y el índice de "una sola activa" — DDL, ningún saldo ni movimiento se toca. `down` quita la marca (vuelve a cuenta normal) y restaura el CHECK/índice.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 24–52 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 54–75 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `GuayacanAccountOutsideAgentReconciliation1760006500000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006500000-GuayacanAccountOutsideAgentReconciliation.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006500000-GuayacanAccountOutsideAgentReconciliation.ts#L24) (L24–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `banks`, `candidates`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanAccountOutsideAgentReconciliation1760006500000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006500000-GuayacanAccountOutsideAgentReconciliation.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006500000-GuayacanAccountOutsideAgentReconciliation.ts#L54) (L54–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Tablas en su SQL: `banks`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760006600000-guayacancashseparatecommissionsandtransactions-ts"></a>

### 1760006600000-GuayacanCashSeparateCommissionsAndTransactions.ts

- **Ruta:** [1760006600000-GuayacanCashSeparateCommissionsAndTransactions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006600000-GuayacanCashSeparateCommissionsAndTransactions.ts) (`comercial-jhoel-api/src/database/migrations/1760006600000-GuayacanCashSeparateCommissionsAndTransactions.ts`, 299 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Caja Guayacán — comisiones fuera del efectivo; Depósitos/Retiros de Transaccionar dentro.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `guayacan_commissions`; funciones `guayacan_commission_on_operation_insert`, `guayacan_commission_on_operation_void`; 

#### Clase `GuayacanCashSeparateCommissionsAndTransactions1760006600000` (L29–298)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Caja Guayacán — comisiones fuera del efectivo; Depósitos/Retiros de Transaccionar dentro. 1. Comisiones: nueva tabla `guayacan_commissions` (una por operación, `UNIQUE(operation_id)`, tarifa y cantidad históricas, VIGENTE/ANULADO). Dejan de escribirse en el ledger de efectivo. Las que ya estaban en el ledger se COPIAN a la tabla nueva y se RECLASIFICAN sin borrar nada: cada `COMISION_TRANSACCION` vigente queda ANULADO y se registra su `REVERSO_COMISION` (mecanismo existente), así el efectivo deja de incluirlas con trazabilidad completa. 2. Efectivo de Transaccionar (banco agente GUAYACAN): Depósito = el cliente entrega efectivo → `TRANSACCION_DEPOSITO` (+monto aplicado); Retiro = el agente paga efectivo → `TRANSACCION_RETIRO` (−monto). Es el efecto FÍSICO en caja, independiente del signo del saldo bancario (que no se toca). Un movimiento por operación (índice único), en la misma transacc

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 32–233 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 235–297 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `GuayacanCashSeparateCommissionsAndTransactions1760006600000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006600000-GuayacanCashSeparateCommissionsAndTransactions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006600000-GuayacanCashSeparateCommissionsAndTransactions.ts#L32) (L32–233)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `apply_guayacan_cash_movement`, `pg_advisory_xact_lock`; Tablas en su SQL: `guayacan_cash_movements`, `bank_deposit_operations`, `v_agent`, `transaction_banks`, `v_effect`, `transaction_types`, `guayacan_commissions`, `v_movement`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashSeparateCommissionsAndTransactions1760006600000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006600000-GuayacanCashSeparateCommissionsAndTransactions.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006600000-GuayacanCashSeparateCommissionsAndTransactions.ts#L235) (L235–297)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `apply_guayacan_cash_movement`, `pg_advisory_xact_lock`; Tablas en su SQL: `v_agent`, `transaction_banks`, `v_commission`, `guayacan_cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760006700000-guayacansinglebalancefromcashbox-ts"></a>

### 1760006700000-GuayacanSingleBalanceFromCashBox.ts

- **Ruta:** [1760006700000-GuayacanSingleBalanceFromCashBox.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006700000-GuayacanSingleBalanceFromCashBox.ts) (`comercial-jhoel-api/src/database/migrations/1760006700000-GuayacanSingleBalanceFromCashBox.ts`, 473 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Un solo saldo para Cooperativa Guayacán: el efectivo del Kardex de Cuadre de Caja Guayacán.
- **Depende de (archivos del proyecto):** [1760006400000-GuayacanInvertsDepositWithdrawal.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760006400000-guayacaninvertsdepositwithdrawal-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `guayacan_cash_balance`, `register_bank_deposit_operation`, `guayacan_commission_on_operation_insert`, `guayacan_commission_on_operation_void`, `guard_guayacan_bank_account_movement`; triggers `trg_guard_guayacan_bank_account_movement`

#### Clase `GuayacanSingleBalanceFromCashBox1760006700000` (L32–472)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Un solo saldo para Cooperativa Guayacán: el efectivo del Kardex de Cuadre de Caja Guayacán. Antes había dos fuentes: Transaccionar leía `banks.final_balance` de la cuenta GUAYACAN (movida por `apply_bank_account_movement`) y la caja leía `guayacan_cash_movements`. Ahora: 1. `guayacan_cash_balance()` — ÚNICA fuente: último `balance_after` del Kardex (0 sin movimientos). El backend la usa al leer la cuenta GUAYACAN (listado de bancos, tira de saldos, vista de saldos diarios). 2. `register_bank_deposit_operation`: con el banco agente GUAYACAN ya no mueve la cuenta (misma firma → CREATE OR REPLACE). El efecto lo registra el trigger de caja: Depósito +, Retiro −, y Reintegro − (nuevo `TRANSACCION_REINTEGRO`; Génesis se sigue moviendo igual). 3. Retiro/Reintegro Guayacán sin efectivo suficiente en la caja se rechaza (`CASH_BOX_INSUFFICIENT_BALANCE`) — es la regla de saldo suficiente que ya ten

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 35–458 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 460–471 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `GuayacanSingleBalanceFromCashBox1760006700000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006700000-GuayacanSingleBalanceFromCashBox.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006700000-GuayacanSingleBalanceFromCashBox.ts#L35) (L35–458)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_array_elements`, `jsonb_array_elements_text`, `apply_bank_account_movement`, `apply_guayacan_cash_movement`, `pg_advisory_xact_lock`; Tablas en su SQL: `guayacan_cash_movements`, `v_transaction_type`, `transaction_types`, `v_bank_account_id`, `banks`, `v_bank`, `transaction_banks`, `v_genesis_account_id`, `clients`, `v_operation_id`, `bank_deposit_operations`, `v_is_guayacan_agent`, `v_transaction_bank_name`, `v_source_account_name`, `v_agent`, `v_effect`, `guayacan_commissions`, `v_movement`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanSingleBalanceFromCashBox1760006700000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006700000-GuayacanSingleBalanceFromCashBox.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006700000-GuayacanSingleBalanceFromCashBox.ts#L460) (L460–471)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `new GuayacanInvertsDepositWithdrawal1760006400000().up`, `new GuayacanInvertsDepositWithdrawal1760006400000`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760006800000-createcashcontrolkardexandcuts-ts"></a>

### 1760006800000-CreateCashControlKardexAndCuts.ts

- **Ruta:** [1760006800000-CreateCashControlKardexAndCuts.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006800000-CreateCashControlKardexAndCuts.ts) (`comercial-jhoel-api/src/database/migrations/1760006800000-CreateCashControlKardexAndCuts.ts`, 1308 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Control de Efectivo — single official physical-cash Kardex + two daily cuts.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `cash_operational_days`, `cash_cut_periods`, `cash_movements`, `cash_cut_counts`, `cash_cut_count_details`, `cash_cut_bank_reconciliations`, `cash_cut_schedule_changes`, `cash_cut_events`; funciones `cash_balance`, `cash_balance_at`, `cash_guatemala_ts`, `cash_valid_denomination`, `apply_cash_movement`, `reverse_cash_movement`, `reverse_cash_movements_for_reference`, `cash_on_bank_deposit_insert`, `cash_on_bank_deposit_void`, `cash_on_portfolio_row`, `cash_on_bank_movement_insert`, `cash_on_bank_movement_void`, `register_manual_cash_movement`, `void_manual_cash_movement`, `cash_bank_balances_snapshot`, `open_cash_operational_day`, `update_cash_cut_schedule`, `start_cash_cut_period`, `finish_cash_cut_period`, `reopen_cash_cut_period`, `close_cash_operational_day`; triggers `trg_cash_bank_deposit_insert`, `trg_cash_bank_deposit_void`, `trg_cash_`, `trg_cash_bank_movement_insert`, `trg_cash_bank_movement_void`

#### Clase `CreateCashControlKardexAndCuts1760006800000` (L42–1307)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Control de Efectivo — single official physical-cash Kardex + two daily cuts. 1. `transaction_types.cash_effect` (IN/OUT/NONE): explicit classification of each Transaccionar type's effect on PHYSICAL cash, independent of `balance_effect` (bank). Backfilled from `balance_effect`: Depósito and Pago Génesis = IN, Retiro and Desembolso Génesis = OUT, everything else (Reintegro, Pago de Cheque, Remesas...) = NONE until an admin sets it. 2. `cash_movements`: the ONLY source of the physical cash balance (`cash_balance()` = `new_balance` of the last row). Only writer: `apply_cash_movement` (advisory lock `cash_control_main`, previous balance read under the lock, `idempotency_key` UNIQUE → a retried request returns the existing row instead of a second movement). Rows are never deleted or edited: a void marks the row ANULADO and appends the inverse ANULACION (`reversal_of_id`). NONE rows (operation

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 45–1261 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 1263–1306 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CreateCashControlKardexAndCuts1760006800000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006800000-CreateCashControlKardexAndCuts.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006800000-CreateCashControlKardexAndCuts.ts#L45) (L45–1261)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`, `reverse_cash_movement`, `apply_cash_movement`, `reverse_cash_movements_for_reference`, `jsonb_array_elements`; Tablas en su SQL: `transaction_types`, `cash_movements`, `v_existing`, `v_day_id`, `cash_operational_days`, `v_period_id`, `cash_cut_periods`, `v_id`, `v_movement`, `v_type_name`, `v_agent_name`, `transaction_banks`, `v_account_name`, `banks`, `v_client`, `clients`, `v_version`, `v_bank_name`, `v_type`, `v_prev_day`, `v_first_start`, `v_last_cut`, `v_period`, `v_date`, `v_sibling`, `v_day`, `v_first`, `v_in`, `cash_cut_counts`, `v_count_id`, `v_active_banks`, `v_bank_system`, `v_second`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CreateCashControlKardexAndCuts1760006800000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006800000-CreateCashControlKardexAndCuts.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006800000-CreateCashControlKardexAndCuts.ts#L1263) (L1263–1306)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760006900000-cashbankdeposit-ts"></a>

### 1760006900000-CashBankDeposit.ts

- **Ruta:** [1760006900000-CashBankDeposit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006900000-CashBankDeposit.ts) (`comercial-jhoel-api/src/database/migrations/1760006900000-CashBankDeposit.ts`, 218 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Control de Efectivo → "Depósito bancario": cash leaves the caja and is deposited into one of the registered bank accounts.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `cash_movement_details`; funciones `register_cash_bank_deposit`, `void_cash_bank_deposit`, `void_manual_cash_movement`; 

#### Clase `CashBankDeposit1760006900000` (L25–217)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Control de Efectivo → "Depósito bancario": cash leaves the caja and is deposited into one of the registered bank accounts. - Bank side: new movement type `DEPOSITO_CAJA` (origin `CONTROL_EFECTIVO`) applied through `apply_bank_account_movement` — the single writer of `banks.final_balance` — so the account's own rules still apply (row lock, active account, `max_balance`, BI Club range). Cooperativa Guayacán is rejected by its existing guard trigger (its balance is its own caja). - Cash side: new Kardex type `DEPOSITO_BANCARIO` (OUT), same transaction. Rejected when the official cash is lower than the amount (`CASH_INSUFFICIENT_BALANCE`). - Mandatory denomination breakdown in the new `cash_movement_details` (must add up to the amount exactly). - Both sides share one operation id (`reference_id`); voiding (admin, reason) reverses the bank movement and appends the cash ANULACION. Lock order i

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 28–206 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 208–216 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CashBankDeposit1760006900000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760006900000-CashBankDeposit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006900000-CashBankDeposit.ts#L28) (L28–206)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`, `apply_bank_account_movement`, `jsonb_array_elements`, `reverse_bank_account_movements`; Tablas en su SQL: `v_existing`, `cash_movements`, `v_bank`, `banks`, `v_movement`, `v_type`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBankDeposit1760006900000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760006900000-CashBankDeposit.ts](../../../../comercial-jhoel-api/src/database/migrations/1760006900000-CashBankDeposit.ts#L208) (L208–216)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760007000000-accountsreceivablesettlements-ts"></a>

### 1760007000000-AccountsReceivableSettlements.ts

- **Ruta:** [1760007000000-AccountsReceivableSettlements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007000000-AccountsReceivableSettlements.ts) (`comercial-jhoel-api/src/database/migrations/1760007000000-AccountsReceivableSettlements.ts`, 579 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Cuentas por Cobrar → "Cancelar cuenta(s)": collect one or several CARGO rows of the SAME client in one atomic operation, paid in cash or by a deposit into one of the registered bank accounts.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `account_receivable_payment_operations`, `account_receivable_payment_details`; funciones `ar_charge_balances`, `ar_payment_guard`, `settle_accounts_receivable`, `void_account_receivable_payment`, `cash_on_portfolio_row`; triggers `trg_ar_payment_guard`

#### Clase `AccountsReceivableSettlements1760007000000` (L37–497)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Cuentas por Cobrar → "Cancelar cuenta(s)": collect one or several CARGO rows of the SAME client in one atomic operation, paid in cash or by a deposit into one of the registered bank accounts. Model (reuses the existing Kardex, adds only what was missing): - `account_receivable_payment_operations` — the consolidated payment (client, method, bank, deposit reference, total, status, cut/day). - `account_receivable_payment_details` — one row per CARGO paid (amount, pending before/after): each account keeps its own history. - The money itself is ONE consolidated `ABONO` row in `accounts_receivable` (reference `AR_PAYMENT` → operation), so the client's balance, the statement, Cuadre de Agentes and reports keep working unchanged. - Cash: that ABONO fires the existing `cash_on_portfolio_row` trigger (ABONO_POR_COBRAR, IN) — no second cash writer. Bank deposit: the trigger now skips ABONOs of a `D

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 40–478 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 480–496 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `AccountsReceivableSettlements1760007000000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760007000000-AccountsReceivableSettlements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007000000-AccountsReceivableSettlements.ts#L40) (L40–478)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `cashOnPortfolioRowSql`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`, `jsonb_array_elements`, `set_config`, `reverse_bank_account_movements`; Tablas en su SQL: `account_receivable_payment_details`, `account_receivable_payment_operations`, `accounts_receivable`, `charges`, `remaining`, `pool`, `v_paid`, `v_existing`, `v_client_name`, `clients`, `v_bank`, `banks`, `v_row`, `v_day_id`, `cash_operational_days`, `v_period_id`, `cash_cut_periods`, `v_cash_id`, `cash_movements`, `v_operation`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountsReceivableSettlements1760007000000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760007000000-AccountsReceivableSettlements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007000000-AccountsReceivableSettlements.ts#L480) (L480–496)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `cashOnPortfolioRowSql`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `cashOnPortfolioRowSql` (L504–578)

- **Tipo:** función local del archivo
- **Firma:** `cashOnPortfolioRowSql(skipBankSettlements: boolean): string` — [1760007000000-AccountsReceivableSettlements.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007000000-AccountsReceivableSettlements.ts#L504)
- **Propósito / descripción:** Body of the existing `cash_on_portfolio_row` trigger (migration 1760006800000). `skipBankSettlements` adds the only change: an ABONO of a "Depósito bancario" settlement never enters the physical cash.
- **Efectos secundarios:** Llama funciones SQL: `reverse_cash_movements_for_reference`, `apply_cash_movement`; Tablas en su SQL: `account_receivable_payment_operations`, `cash_movements`, `v_client`, `clients`, `v_version`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1760007100000-financialdayreview-ts"></a>

### 1760007100000-FinancialDayReview.ts

- **Ruta:** [1760007100000-FinancialDayReview.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007100000-FinancialDayReview.ts) (`comercial-jhoel-api/src/database/migrations/1760007100000-FinancialDayReview.ts`, 951 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Sistema → Administración financiera → Revisión de días operativos.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `financial_day_review_sessions`, `financial_day_corrections`, `financial_day_snapshot_versions`, `financial_day_adjustments`, `financial_day_adjustment_effects`; funciones `financial_review_audit_immutable`, `financial_review_adjustment_guard`, `financial_review_session_guard`, `financial_review_row_date`, `financial_review_day_guard`, `financial_review_assert_role`, `financial_review_lock_session`, `financial_review_validate_request`, `financial_review_existing_request`, `financial_review_record_version`, `open_financial_day_review`, `correct_financial_day_snapshot`, `adjust_financial_day_movement`, `request_financial_day_review_close`, `close_financial_day_review`; triggers `trg_`, `trg_financial_day_adjustments_guard`, `trg_financial_day_review_sessions_guard`, `trg_financial_review_guard`

#### Clase `FinancialDayReview1760007100000` (L40–934)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Sistema → Administración financiera → Revisión de días operativos. An administrator opens a past operational day in REVIEW MODE (an audited session), inspects every financial figure of that day, diagnoses differences, corrects that day's data and closes the review. Absolute rule: a correction touches ONLY the reviewed day. That is why the two kinds of data are corrected differently: 1. Day-owned snapshot rows (`bank_balances` of that date, `agent_reconciliations` of that date, the cash day / cut / count / bank-verification rows of that date) are corrected IN PLACE, and each change is versioned in `financial_day_snapshot_versions` (previous value kept) and audited in `financial_day_corrections`. Same-row derived fields (a reconciliation's `result`, a count's `difference`) are recalculated; rows of any other day — including the next day's opening and the second cut of the same day — are ne

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 43–908 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 910–933 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `FinancialDayReview1760007100000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760007100000-FinancialDayReview.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007100000-FinancialDayReview.ts#L43) (L43–908)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`, `financial_review_assert_role`, `financial_review_validate_request`, `financial_review_record_version`, `set_config`, `financial_review_lock_session`; Tablas en su SQL: `v_date`, `cash_cut_periods`, `cash_operational_days`, `financial_day_review_sessions`, `v_role`, `users`, `roles`, `v_session`, `v_existing`, `financial_day_corrections`, `financial_day_snapshot_versions`, `day_openings`, `bank_balances`, `agent_reconciliations`, `v_id`, `v_row`, `banks`, `cash_cut_counts`, `cash_cut_bank_reconciliations`, `v_new_result`, `cash_movements`, `bank_account_movements`, `bank_deposit_operations`, `transaction_types`, `accounts_receivable`, `assets`, `v_previous`, `financial_day_adjustments`, `v_cash`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReview1760007100000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760007100000-FinancialDayReview.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007100000-FinancialDayReview.ts#L910) (L910–933)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760007200000-adddescriptiontobankdepositoperations-ts"></a>

### 1760007200000-AddDescriptionToBankDepositOperations.ts

- **Ruta:** [1760007200000-AddDescriptionToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007200000-AddDescriptionToBankDepositOperations.ts) (`comercial-jhoel-api/src/database/migrations/1760007200000-AddDescriptionToBankDepositOperations.ts`, 134 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Transaccionar → "Descripción / Beneficiario": a free-text description (who the operation was for, or its purpose) stored on the operation itself.
- **Paquetes externos:** `typeorm`
- **Consumidores:** —

#### Clase `AddDescriptionToBankDepositOperations1760007200000` (L23–121)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Transaccionar → "Descripción / Beneficiario": a free-text description (who the operation was for, or its purpose) stored on the operation itself. - `bank_deposit_operations.description VARCHAR(250) NULL` — historical rows keep NULL (shown as "Sin descripción registrada"); never backfilled. - `register_bank_deposit_operation` gains a trailing `p_description` (DEFAULT NULL, so internal/automatic callers keep working) and writes it in the SAME INSERT as the operation — no second statement that could get out of sync. It is sanitized in SQL too (control characters removed, whitespace collapsed, trimmed) and rejected above 250 characters. Nothing else in the function changes: amounts, bank/cash effects and commissions are untouched. - A trigram index on the normalized text backs the report search. The function body is patched from its live definition (asserting each anchor exists) instead of b

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 26–76 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 78–107 | `queryRunner: QueryRunner` | `Promise<void>` |
| `currentDefinition` | método private async | 109–120 | `queryRunner: QueryRunner` | `Promise<string>` |

##### `AddDescriptionToBankDepositOperations1760007200000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760007200000-AddDescriptionToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007200000-AddDescriptionToBankDepositOperations.ts#L26) (L26–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `this.currentDefinition`, `patch`
- **Efectos secundarios:** Tablas en su SQL: `v_operation_id`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddDescriptionToBankDepositOperations1760007200000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760007200000-AddDescriptionToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007200000-AddDescriptionToBankDepositOperations.ts#L78) (L78–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.currentDefinition`, `patch`, `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AddDescriptionToBankDepositOperations1760007200000.currentDefinition`

- **Firma:** `currentDefinition(queryRunner: QueryRunner): Promise<string>` — [1760007200000-AddDescriptionToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007200000-AddDescriptionToBankDepositOperations.ts#L109) (L109–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `new Error`
- **Efectos secundarios:** Llama funciones SQL: `pg_get_functiondef`; Tablas en su SQL: `pg_proc`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `new Error( 'Expected exactly one register_bank_deposit_operation, found ${rows.length}', )`
- **Consumidores:** (mismo archivo)

#### Función `patch` (L124–133)

- **Tipo:** función local del archivo
- **Firma:** `patch(source: string, replacements: Array<[string, string]>): string` — [1760007200000-AddDescriptionToBankDepositOperations.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007200000-AddDescriptionToBankDepositOperations.ts#L124)
- **Propósito / descripción:** Applies literal replacements, failing loudly if an anchor is missing (never a silent half-patch).
- **Dependencias:** `replacements.reduce`, `text.includes`, `new Error`, `from.slice`, `text.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new Error( 'register_bank_deposit_operation: anchor not found: ${from.slice(0, 80)}', )`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1760007300000-cashdailyindicatorsfrombankdayopening-ts"></a>

### 1760007300000-CashDailyIndicatorsFromBankDayOpening.ts

- **Ruta:** [1760007300000-CashDailyIndicatorsFromBankDayOpening.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007300000-CashDailyIndicatorsFromBankDayOpening.ts) (`comercial-jhoel-api/src/database/migrations/1760007300000-CashDailyIndicatorsFromBankDayOpening.ts`, 138 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Control de Efectivo — daily indicators restart on every bank-day opening (Agentes Bancarios → Bancos → "Aperturar día").
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `cash_bank_day_openings`; funciones `cash_bank_day_openings_immutable`, `cash_bank_day_on_opening`; triggers `trg_cash_bank_day_openings_immutable`, `trg_cash_bank_day_on_opening`

#### Clase `CashDailyIndicatorsFromBankDayOpening1760007300000` (L31–137)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Control de Efectivo — daily indicators restart on every bank-day opening (Agentes Bancarios → Bancos → "Aperturar día"). The cash Kardex (`cash_movements`) is NOT touched: no row is added, changed or re-dated, and the physical cash balance keeps its continuity (it is still the last `new_balance` of the Kardex). What is added is one ANCHOR per bank day, `cash_bank_day_openings`: the Kardex sequence and the official cash balance at the exact moment the bank day was opened. It is written by an AFTER INSERT trigger on `day_openings`, i.e. in the same transaction as the opening itself (atomic), under the same advisory lock as `apply_cash_movement` (no movement can slip between reading the sequence and the balance), and only once per date (UNIQUE; re-opening or a double click never resets anything). A bank day's indicators are therefore the Kardex movements with opening_sequence &lt; sequence &lt;= 

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 34–125 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 127–136 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CashDailyIndicatorsFromBankDayOpening1760007300000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760007300000-CashDailyIndicatorsFromBankDayOpening.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007300000-CashDailyIndicatorsFromBankDayOpening.ts#L34) (L34–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`; Tablas en su SQL: `v_sequence`, `cash_movements`, `day_openings`, `cash_bank_day_openings`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashDailyIndicatorsFromBankDayOpening1760007300000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760007300000-CashDailyIndicatorsFromBankDayOpening.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007300000-CashDailyIndicatorsFromBankDayOpening.ts#L127) (L127–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-database-migrations-1760007400000-cashcountsandwarehousecustody-ts"></a>

### 1760007400000-CashCountsAndWarehouseCustody.ts

- **Ruta:** [1760007400000-CashCountsAndWarehouseCustody.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts) (`comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts`, 792 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Control de Efectivo → "Arqueo de Caja" and "Entrega de Efectivo a Bodega".
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `warehouse_cash_movements`, `cash_warehouse_transfers`, `cash_counts`, `cash_count_details`; funciones `cash_custody_assert_role`, `cash_current_bank_day`, `cash_custody_status_only_guard`, `warehouse_cash_balance`, `warehouse_cash_balance_at_time`, `apply_warehouse_cash_movement`, `register_warehouse_initial_balance`, `register_cash_warehouse_transfer`, `void_cash_warehouse_transfer`, `register_cash_count`, `void_manual_cash_movement`; triggers `trg_`

#### Clase `CashCountsAndWarehouseCustody1760007400000` (L40–669)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Control de Efectivo → "Arqueo de Caja" and "Entrega de Efectivo a Bodega". Custody model (one source of truth per location, never a second cash Kardex): - Caja = the existing cash Kardex (`cash_movements`, `cash_balance()`). - Bodega = new Kardex `warehouse_cash_movements` (`warehouse_cash_balance()`), same shape and rules: previous/new balance CHECK, strict sequence, single writer under its own advisory lock, idempotency key, voids by reversal, never negative. - Total bajo custodia = caja + Bodega. Entrega a Bodega (`cash_warehouse_transfers`): ONE transaction writes the caja OUT (`ENTREGA_BODEGA`, reference `WAREHOUSE_TRANSFER`) and the Bodega IN (`ENTREGA_DESDE_CAJA`, same reference) for the same amount. Lock order caja → Bodega everywhere; the caja balance is checked under the caja lock, so two simultaneous deliveries can never leave caja negative. It is an internal transfer: total c

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 43–627 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 629–654 | `queryRunner: QueryRunner` | `Promise<void>` |
| `guard` | método private async | 656–668 | `queryRunner: QueryRunner`, `table: string`, `mutable: string[]` | `Promise<void>` |

##### `CashCountsAndWarehouseCustody1760007400000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760007400000-CashCountsAndWarehouseCustody.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts#L43) (L43–627)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `CASH_TYPES.concat( 'ENTREGA_BODEGA', ).map((t) => ''${t}'').join`, `CASH_TYPES.concat( 'ENTREGA_BODEGA', ).map`, `CASH_TYPES.concat`, `this.guard`, `voidManualCashMovementSql`, `patchFunction`, `rewriteFunction`
- **Efectos secundarios:** Llama funciones SQL: `pg_advisory_xact_lock`, `cash_current_bank_day`, `cash_custody_assert_role`, `jsonb_array_elements`, `apply_warehouse_cash_movement`, `reverse_cash_movement`; Tablas en su SQL: `v_role`, `users`, `roles`, `cash_bank_day_ranges`, `day_openings`, `warehouse_cash_movements`, `v_existing`, `v_day`, `v_id`, `cash_warehouse_transfers`, `v_transfer`, `v_wh`, `cash_counts`, `v_original`, `v_sequence`, `cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCountsAndWarehouseCustody1760007400000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760007400000-CashCountsAndWarehouseCustody.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts#L629) (L629–654)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `rewriteFunction`, `CLOSE_AGENT_DAY_PATCH.map`, `patchFunction`, `queryRunner.query`, `voidManualCashMovementSql`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCountsAndWarehouseCustody1760007400000.guard`

- **Firma:** `guard(queryRunner: QueryRunner, table: string, mutable: string[]): Promise<void>` — [1760007400000-CashCountsAndWarehouseCustody.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts#L656) (L656–668)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `mutable.map((c) => ''${c}'').join`, `mutable.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

#### Función `voidManualCashMovementSql` (L692–728)

- **Tipo:** función local del archivo
- **Firma:** `voidManualCashMovementSql(withWarehouse: boolean): string` — [1760007400000-CashCountsAndWarehouseCustody.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts#L692)
- **Propósito / descripción:** `void_manual_cash_movement`; `withWarehouse` adds the route of a delivery to Bodega.
- **Efectos secundarios:** Llama funciones SQL: `void_cash_warehouse_transfer`; Tablas en su SQL: `cash_movements`, `v_type`
- **Consumidores:** uso interno del archivo

#### Función `patchFunction` (L731–746)

- **Tipo:** función local del archivo, async
- **Firma:** `patchFunction(queryRunner: QueryRunner, name: string, from: string, to: string): Promise<void>` — [1760007400000-CashCountsAndWarehouseCustody.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts#L731)
- **Propósito / descripción:** Replaces one literal fragment of a live function definition (fails if the anchor is missing).
- **Dependencias:** `queryRunner.query`, `rows[0].def.includes`, `new Error`, `rows[0].def.replace`
- **Efectos secundarios:** Llama funciones SQL: `pg_get_functiondef`; Tablas en su SQL: `pg_proc`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `new Error('${name}: anchor not found (${from})')`
- **Consumidores:** uso interno del archivo

#### Función `rewriteFunction` (L764–791)

- **Tipo:** función local del archivo, async
- **Firma:** `rewriteFunction(queryRunner: QueryRunner, name: string, dropSignature: string, replacements: Array<[string, string]>, onlyIfPatched?): Promise<void>` — [1760007400000-CashCountsAndWarehouseCustody.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007400000-CashCountsAndWarehouseCustody.ts#L764)
- **Propósito / descripción:** Drops a function by its exact signature and recreates it from its live definition with literal replacements.
- **Dependencias:** `queryRunner.query`, `new Error`, `rows[0].def.includes`, `replacements.reduce`, `text.includes`, `text.replace`
- **Efectos secundarios:** Llama funciones SQL: `pg_get_functiondef`; Tablas en su SQL: `pg_proc`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `new Error('${name}: expected exactly one definition')`, `new Error('${name}: anchor not found (${from})')`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1760007500000-warehousewithdrawals-ts"></a>

### 1760007500000-WarehouseWithdrawals.ts

- **Ruta:** [1760007500000-WarehouseWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts) (`comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts`, 407 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Bodega → "Retiro de Bodega": cash leaves Bodega and goes either - back to the caja (`DEVOLUCION_A_CAJA` in Bodega + `DEVOLUCION_BODEGA` IN in the caja Kardex: an internal transfer, total custody unchanged), or - to a registered bank account (`DEPOSITO_BANCARIO` in Bodega + the existing bank type `DE
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** tablas `warehouse_cash_movement_details`, `warehouse_cash_withdrawals`; funciones `register_warehouse_withdrawal`, `void_warehouse_withdrawal`; triggers `trg_`

#### Clase `WarehouseWithdrawals1760007500000` (L24–352)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Bodega → "Retiro de Bodega": cash leaves Bodega and goes either - back to the caja (`DEVOLUCION_A_CAJA` in Bodega + `DEVOLUCION_BODEGA` IN in the caja Kardex: an internal transfer, total custody unchanged), or - to a registered bank account (`DEPOSITO_BANCARIO` in Bodega + the existing bank type `DEPOSITO_CAJA` / origin `CONTROL_EFECTIVO` through the single bank writer `apply_bank_account_movement`; Bodega down, bank up, so the consolidated Cuadre de Agentes does not change). One transaction per withdrawal (`warehouse_cash_withdrawals`, reference `RET-000001`), same guarantees as the caja → Bodega delivery: open bank day, Bodega balance checked under its lock (lock order bank → caja → Bodega, the same order every flow already uses), people identified, optional breakdown (without it only administrators) stored in `warehouse_cash_movement_details`, idempotency key, audited void that revers

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 27–297 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 299–313 | `queryRunner: QueryRunner` | `Promise<void>` |
| `setCashTypes` | método private async | 315–325 | `queryRunner: QueryRunner`, `types: string[]` | `Promise<void>` |
| `setWarehouseTypes` | método private async | 327–337 | `queryRunner: QueryRunner`, `types: string[]` | `Promise<void>` |
| `guard` | método private async | 339–351 | `queryRunner: QueryRunner`, `table: string`, `mutable: string[]` | `Promise<void>` |

##### `WarehouseWithdrawals1760007500000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760007500000-WarehouseWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts#L27) (L27–297)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.setCashTypes`, `this.setWarehouseTypes`, `queryRunner.query`, `this.guard`, `patchFunction`
- **Efectos secundarios:** Llama funciones SQL: `cash_custody_assert_role`, `pg_advisory_xact_lock`, `cash_current_bank_day`, `jsonb_array_elements`, `reverse_bank_account_movements`, `apply_warehouse_cash_movement`, `reverse_cash_movement`; Tablas en su SQL: `v_existing`, `warehouse_cash_withdrawals`, `v_day`, `v_bank`, `banks`, `v_w`, `warehouse_cash_movements`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `WarehouseWithdrawals1760007500000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760007500000-WarehouseWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts#L299) (L299–313)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `patchFunction`, `queryRunner.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `WarehouseWithdrawals1760007500000.setCashTypes`

- **Firma:** `setCashTypes(queryRunner: QueryRunner, types: string[]): Promise<void>` — [1760007500000-WarehouseWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts#L315) (L315–325)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `types.map((t) => ''${t}'').join`, `types.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `WarehouseWithdrawals1760007500000.setWarehouseTypes`

- **Firma:** `setWarehouseTypes(queryRunner: QueryRunner, types: string[]): Promise<void>` — [1760007500000-WarehouseWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts#L327) (L327–337)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `types.map((t) => ''${t}'').join`, `types.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `WarehouseWithdrawals1760007500000.guard`

- **Firma:** `guard(queryRunner: QueryRunner, table: string, mutable: string[]): Promise<void>` — [1760007500000-WarehouseWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts#L339) (L339–351)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `mutable.map((c) => ''${c}'').join`, `mutable.map`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

#### Función `patchFunction` (L391–406)

- **Tipo:** función local del archivo, async
- **Firma:** `patchFunction(queryRunner: QueryRunner, name: string, from: string, to: string): Promise<void>` — [1760007500000-WarehouseWithdrawals.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007500000-WarehouseWithdrawals.ts#L391)
- **Propósito / descripción:** Replaces one literal fragment of a live function definition (fails if the anchor is missing).
- **Dependencias:** `queryRunner.query`, `rows[0].def.includes`, `new Error`, `rows[0].def.replace`
- **Efectos secundarios:** Llama funciones SQL: `pg_get_functiondef`; Tablas en su SQL: `pg_proc`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `new Error('${name}: anchor not found')`
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-database-migrations-1760007600000-cuadrecashbreakdownandcentdenomination-ts"></a>

### 1760007600000-CuadreCashBreakdownAndCentDenomination.ts

- **Ruta:** [1760007600000-CuadreCashBreakdownAndCentDenomination.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007600000-CuadreCashBreakdownAndCentDenomination.ts) (`comercial-jhoel-api/src/database/migrations/1760007600000-CuadreCashBreakdownAndCentDenomination.ts`, 243 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** 1. Q0.01 ("un centavo") becomes a valid denomination everywhere the cash is counted: `cash_valid_denomination` (Arqueo de Caja, Bodega deliveries and withdrawals, cash bank deposits, cut counts) and `guayacan_valid_denomination` (Caja Guayacán).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [1760007700000-CuadreBreakdownFromLatestCut.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760007700000-cuadrebreakdownfromlatestcut-ts)
- **Define en la base de datos:** tablas `agent_reconciliation_cash_breakdowns`, `agent_reconciliation_cash_details`; funciones `close_agent_day_with_cash_breakdown`; triggers `trg_`

#### Clase `CuadreCashBreakdownAndCentDenomination1760007600000` (L28–228)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** 1. Q0.01 ("un centavo") becomes a valid denomination everywhere the cash is counted: `cash_valid_denomination` (Arqueo de Caja, Bodega deliveries and withdrawals, cash bank deposits, cut counts) and `guayacan_valid_denomination` (Caja Guayacán). Transaccionar already accepts any positive denomination in SQL. Historical rows are untouched: a count saved without Q0.01 simply has no row for it (= 0). 2. Cuadre de Agentes keeps an independent photograph of the cash breakdown it was saved with (`agent_reconciliation_cash_breakdowns` + details): origin MANUAL or ARQUEO_CAJA, the source Arqueo de Caja (id, number, date/time, bank day, user, counted total) and whether the loaded breakdown was modified before saving. The source count is only read — `cash_counts` is never written here. `close_agent_day_with_cash_breakdown` validates the breakdown (denominations, whole quantities ≥ 0, no duplicates

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 31–201 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 203–209 | `queryRunner: QueryRunner` | `Promise<void>` |
| `setDenominations` | método private async | 211–227 | `queryRunner: QueryRunner`, `values: string[]` | `Promise<void>` |

##### `CuadreCashBreakdownAndCentDenomination1760007600000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760007600000-CuadreCashBreakdownAndCentDenomination.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007600000-CuadreCashBreakdownAndCentDenomination.ts#L31) (L31–201)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.setDenominations`, `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_to_recordset`, `cash_custody_assert_role`, `jsonb_array_elements`; Tablas en su SQL: `v_distinct`, `v_count`, `cash_counts`, `cash_count_details`, `v_modified`; Ejecuta SQL crudo (`query`)
- **Consumidores:** [1760007700000-CuadreBreakdownFromLatestCut.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760007700000-cuadrebreakdownfromlatestcut-ts)

##### `CuadreCashBreakdownAndCentDenomination1760007600000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760007600000-CuadreCashBreakdownAndCentDenomination.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007600000-CuadreCashBreakdownAndCentDenomination.ts#L203) (L203–209)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `this.setDenominations`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CuadreCashBreakdownAndCentDenomination1760007600000.setDenominations`

- **Firma:** `setDenominations(queryRunner: QueryRunner, values: string[]): Promise<void>` — [1760007600000-CuadreCashBreakdownAndCentDenomination.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007600000-CuadreCashBreakdownAndCentDenomination.ts#L211) (L211–227)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `values.join`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-database-migrations-1760007700000-cuadrebreakdownfromlatestcut-ts"></a>

### 1760007700000-CuadreBreakdownFromLatestCut.ts

- **Ruta:** [1760007700000-CuadreBreakdownFromLatestCut.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007700000-CuadreBreakdownFromLatestCut.ts) (`comercial-jhoel-api/src/database/migrations/1760007700000-CuadreBreakdownFromLatestCut.ts`, 277 líneas)
- **Tipo:** Migración TypeORM · **Capa:** Base de datos (migración) · **Módulo:** Migraciones TypeORM (esquema de base de datos)
- **Responsabilidad:** Cuadre de Agentes → "Cargar último arqueo de Caja" loads the arqueo of the "Segundo corte · final del día" of Control de Efectivo (`cash_cut_counts` of `period_number = 2`) — exactly that one cut's breakdown, never the first cut, never a standalone Arqueo de Caja and never an aggregate of both cuts.
- **Depende de (archivos del proyecto):** [1760007600000-CuadreCashBreakdownAndCentDenomination.ts](migrations.md#f-comercial-jhoel-api-src-database-migrations-1760007600000-cuadrecashbreakdownandcentdenomination-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** —
- **Define en la base de datos:** funciones `cash_latest_count_candidate`, `close_agent_day_with_cash_breakdown`; 

#### Clase `CuadreBreakdownFromLatestCut1760007700000` (L25–276)

- **Herencia / contratos:** implements MigrationInterface
- **Propósito:** Cuadre de Agentes → "Cargar último arqueo de Caja" loads the arqueo of the "Segundo corte · final del día" of Control de Efectivo (`cash_cut_counts` of `period_number = 2`) — exactly that one cut's breakdown, never the first cut, never a standalone Arqueo de Caja and never an aggregate of both cuts. The reference day's second cut comes first; otherwise the most recent finished second cut of an earlier day (the UI warns it is from before). A second cut's arqueo is valid only when it is the current count of the cut (`is_current`, a reopened cut leaves the old one `false`) and the cut is FINALIZADO. The cuadre photograph gains origin `CORTE_CAJA` with the exact cut used (`source_cut_count_id`, `source_cut_period_id`, `source_cut_number`) plus the same date/user/total snapshot; `modified_after_load` is derived against that cut's own details. The cut and its arqueo are only read. `close_agent

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `up` | método public async | 28–240 | `queryRunner: QueryRunner` | `Promise<void>` |
| `down` | método public async | 242–275 | `queryRunner: QueryRunner` | `Promise<void>` |

##### `CuadreBreakdownFromLatestCut1760007700000.up`

- **Firma:** `up(queryRunner: QueryRunner): Promise<void>` — [1760007700000-CuadreBreakdownFromLatestCut.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007700000-CuadreBreakdownFromLatestCut.ts#L28) (L28–240)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`
- **Efectos secundarios:** Llama funciones SQL: `jsonb_to_recordset`, `cash_custody_assert_role`, `jsonb_array_elements`; Tablas en su SQL: `cash_cut_count_details`, `cash_cut_counts`, `cash_cut_periods`, `cash_operational_days`, `users`, `candidates`, `v_distinct`, `v_count`, `cash_counts`, `cash_count_details`, `v_modified`, `v_cut`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CuadreBreakdownFromLatestCut1760007700000.down`

- **Firma:** `down(queryRunner: QueryRunner): Promise<void>` — [1760007700000-CuadreBreakdownFromLatestCut.ts](../../../../comercial-jhoel-api/src/database/migrations/1760007700000-CuadreBreakdownFromLatestCut.ts#L242) (L242–275)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `queryRunner.query`, `new Error`, `new CuadreCashBreakdownAndCentDenomination1760007600000().up`, `new CuadreCashBreakdownAndCentDenomination1760007600000`
- **Efectos secundarios:** Tablas en su SQL: `agent_reconciliation_cash_breakdowns`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `new Error( 'Cannot revert: cuadres saved from a cut arqueo (CORTE_CAJA) exist and must be kept.', )`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

