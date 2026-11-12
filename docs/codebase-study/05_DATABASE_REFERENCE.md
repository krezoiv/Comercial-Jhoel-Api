# Referencia de la base de datos (PostgreSQL)

Generada del **esquema real** de la base de desarrollo (consulta de solo lectura a `pg_catalog`), con 110 tablas, 202 funciones y 112 migraciones aplicadas. Si producción tiene migraciones pendientes, puede diferir. Explicación conceptual en [02_ARCHITECTURE.md](02_ARCHITECTURE.md#7-base-de-datos-y-transacciones).

## Tablas por dominio

Cada tabla se agrupa en el módulo del backend que más la menciona. Las fichas incluyen columnas, llaves, índices, restricciones, triggers, la entidad TypeORM (si existe), la migración que la creó y los archivos que la consultan o modifican.

| Dominio | Tablas | Documento |
|---|---|---|
| account-types | `account_types` | [abrir](database/account-types.md) |
| accounts-receivable | `account_receivable_payment_details`, `account_receivable_payment_operations`, `accounts_receivable`, `cash_cut_periods`, `cash_operational_days`, `clients`, `users` | [abrir](database/accounts-receivable.md) |
| alert-settings | `alert_settings` | [abrir](database/alert-settings.md) |
| alerts | `alert_read_marks` | [abrir](database/alerts.md) |
| assets | `assets` | [abrir](database/assets.md) |
| bank-deposits | `bank_deposit_cash_details`, `bank_deposit_operations`, `bank_deposit_transactions`, `transaction_banks`, `transaction_types` | [abrir](database/bank-deposits.md) |
| banks | `agent_reconciliations`, `bank_account_movements`, `bank_balances`, `banks`, `day_audit_logs`, `day_openings`, `guayacan_cash_movements` | [abrir](database/banks.md) |
| businesses | `businesses` | [abrir](database/businesses.md) |
| cash-control | `cash_count_details`, `cash_counts`, `cash_cut_bank_reconciliations`, `cash_cut_count_details`, `cash_cut_counts`, `cash_cut_events`, `cash_cut_schedule_changes`, `cash_movement_details`, `cash_movements`, `cash_warehouse_transfers`, `warehouse_cash_movement_details`, `warehouse_cash_movements`, `warehouse_cash_withdrawals` | [abrir](database/cash-control.md) |
| catalog | `catalog_phone_images`, `catalog_phones`, `catalog_requests` | [abrir](database/catalog.md) |
| catalog-banks | `catalog_banks` | [abrir](database/catalog-banks.md) |
| categories | `categories` | [abrir](database/categories.md) |
| company-settings | `company_settings` | [abrir](database/company-settings.md) |
| financial-day-review | `financial_day_adjustment_effects`, `financial_day_adjustments`, `financial_day_corrections`, `financial_day_review_sessions` | [abrir](database/financial-day-review.md) |
| guayacan-cash-box | `guayacan_cash_count_details`, `guayacan_cash_counts`, `guayacan_cash_movement_details`, `guayacan_commissions` | [abrir](database/guayacan-cash-box.md) |
| ice-creams | `ice_cream_purchase_details`, `ice_cream_purchases`, `ice_cream_sale_details`, `ice_cream_sales`, `ice_creams` | [abrir](database/ice-creams.md) |
| inventory | `inventory_locations`, `inventory_movements`, `inventory_stock`, `product_presentations` | [abrir](database/inventory.md) |
| keyboard-shortcuts | `keyboard_shortcuts` | [abrir](database/keyboard-shortcuts.md) |
| landing-backgrounds | `landing_backgrounds` | [abrir](database/landing-backgrounds.md) |
| likes | `catalog_likes` | [abrir](database/likes.md) |
| news | `news_articles` | [abrir](database/news.md) |
| news-subscriptions | `news_push_deliveries`, `news_push_subscriptions`, `news_subscriber_audit_log`, `news_subscriber_types`, `news_subscribers`, `news_types` | [abrir](database/news-subscriptions.md) |
| otros | `agent_reconciliation_cash_breakdowns`, `agent_reconciliation_cash_details`, `cash_bank_day_openings`, `financial_day_snapshot_versions`, `migrations`, `news_notifications` | [abrir](database/otros.md) |
| phones | `phone_sale_dpi_images`, `phone_sales`, `phones` | [abrir](database/phones.md) |
| presentation-types | `presentation_types` | [abrir](database/presentation-types.md) |
| product-catalog | `catalog_product_requests`, `catalog_products` | [abrir](database/product-catalog.md) |
| products | `products` | [abrir](database/products.md) |
| purchases | `purchase_details`, `purchases` | [abrir](database/purchases.md) |
| quotations | `quotation_details`, `quotations` | [abrir](database/quotations.md) |
| recharge-cash-box | `recharge_cash_box_movements`, `recharge_purchases`, `recharge_sim_purchases` | [abrir](database/recharge-cash-box.md) |
| recharges | `recharge_daily_balances`, `recharge_day_audit_logs`, `recharge_day_openings`, `recharge_sales`, `recharge_sales_closures`, `recharge_sim_daily_stock`, `recharge_sim_dpi_images`, `recharge_sim_sale_registrations`, `recharge_sim_sales`, `recharge_sim_types`, `recharge_types` | [abrir](database/recharges.md) |
| roles | `roles` | [abrir](database/roles.md) |
| sales | `sale_details`, `sales` | [abrir](database/sales.md) |
| sales-cash-box | `sales_cash_box_movements` | [abrir](database/sales-cash-box.md) |
| site-visits | `site_visits` | [abrir](database/site-visits.md) |
| suppliers | `suppliers` | [abrir](database/suppliers.md) |
| tickets | `ticket_details`, `tickets` | [abrir](database/tickets.md) |
| units-of-measure | `units_of_measure` | [abrir](database/units-of-measure.md) |

## Funciones SQL (PL/pgSQL)

La lógica financiera crítica vive en funciones de PostgreSQL que se llaman con un `SELECT funcion(...)` desde los repositorios. Para cada una: argumentos, retorno, tablas que escribe, otras funciones que llama, locks consultivos (`pg_advisory_xact_lock`), códigos de error que lanza (`RAISE EXCEPTION 'CODIGO:...'`), migración que la define y métodos TypeScript que la invocan.

| Función | Argumentos → retorno | Escribe | Llama | Locks | Errores | Definida en | Llamada desde |
|---|---|---|---|---|---|---|---|
| `adjust_bank_balance` | p_bank_id uuid, p_new_balance numeric, p_business_date date, p_user_id uuid, p_reason character varying, p_observation text DEFAULT NULL::text → uuid | — | — | — | `BALANCE_UNCHANGED`, `BANK_NOT_FOUND`, `INVALID_MOVEMENT_AMOUNT`, `REASON_REQUIRED` | `1760005100000-CreateBankAccountMovements` | `TypeOrmBankMovementRepository.adjustBalance` |
| `adjust_financial_day_movement` | p_session_id uuid, p_source character varying, p_source_id uuid, p_corrected_amount numeric, p_reason character varying, p_observations character varying, p_user_id uuid, p_request_id character varying → uuid | `financial_day_adjustment_effects`, `financial_day_adjustments`, `financial_day_corrections`, `financial_day_review_sessions` | `abs`, `financial_review_assert_role`, `financial_review_existing_request`, `financial_review_lock_session`, `financial_review_validate_request`, `gen_random_uuid` | — | `FINANCIAL_REVIEW_INVALID_TARGET`, `FINANCIAL_REVIEW_INVALID_VALUE`, `FINANCIAL_REVIEW_MOVEMENT_HAS_SOURCE`, `FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE`, `FINANCIAL_REVIEW_NO_CHANGE`, `FINANCIAL_REVIEW_OUTSIDE_DAY`, `FINANCIAL_REVIEW_TARGET_NOT_FOUND` | `1760007100000-FinancialDayReview` | `TypeOrmFinancialDayReviewRepository.adjustMovement` |
| `adjust_sale_item` | p_user_id uuid, p_product_id uuid, p_quantity_delta integer, p_presentation_id uuid DEFAULT NULL::uuid, p_location_id uuid DEFAULT NULL::uuid, p_draft_key character varying DEFAULT 'default'::character varying → uuid | `inventory_stock`, `products`, `sale_details`, `sales` | `ensure_inventory_stock_row`, `ensure_product_presentation` | — | `INSUFFICIENT_STOCK`, `INVALID_QUANTITY`, `LOCATION_NOT_FOUND`, `PRODUCT_INACTIVE`, `PRODUCT_NOT_FOUND` | `1759500000000-AddWholesalePricingToSales`, `1760000500000-AddDraftKeyToSales`, `1760004300000-AddBusinessSnapshotToSaleDetails` | `TypeOrmSaleRepository.adjustItem` |
| `apply_bank_account_movement` | p_bank_id uuid, p_movement_type character varying, p_origin character varying, p_delta numeric, p_business_date date, p_user_id uuid, p_reference_type character varying DEFAULT NULL::character varying, p_reference_id uui → uuid | `bank_account_movements`, `banks` | — | — | `BALANCE_LIMIT_EXCEEDED`, `BANK_INACTIVE`, `BANK_NOT_FOUND`, `CREDIT_LINE_LIMIT_EXCEEDED`, `CREDIT_LINE_NO_DEBT`, `CREDIT_LINE_OVERPAYMENT`, `INSUFFICIENT_BALANCE`, `INVALID_MOVEMENT_AMOUNT`, `INVALID_OPERATION_DATE` | `1760005700000-BiClubCreditLine`, `1760005900000-BiClubAvailableCredit`, `1760006000000-BiClubDebtModel` | — |
| `apply_cash_movement` | p_movement_type character varying, p_direction character varying, p_amount numeric, p_user_id uuid, p_description character varying, p_reference_type character varying, p_reference_id uuid, p_bank_name character varying, → uuid | `cash_movements` | `cash_balance`, `pg_advisory_xact_lock` | `cash_control_main` | `CASH_IDEMPOTENCY_KEY_REQUIRED`, `CASH_INVALID_AMOUNT`, `CASH_INVALID_DIRECTION` | `1760006800000-CreateCashControlKardexAndCuts` | — |
| `apply_guayacan_cash_movement` | p_movement_type character varying, p_amount numeric, p_business_date date, p_user_id uuid, p_concept character varying, p_reason character varying, p_notes character varying, p_reference_type character varying, p_referen → uuid | `guayacan_cash_movement_details`, `guayacan_cash_movements` | `pg_advisory_xact_lock` | `guayacan_cash_box` | `CASH_BOX_INSUFFICIENT_BALANCE`, `CASH_BREAKDOWN_MISMATCH`, `INVALID_CASH_DENOMINATION`, `INVALID_CASH_MOVEMENT_AMOUNT`, `INVALID_CASH_MOVEMENT_CONCEPT`, `INVALID_CASH_MOVEMENT_DATE` | `1760006300000-CreateGuayacanCashBox` | — |
| `apply_warehouse_cash_movement` | p_type character varying, p_direction character varying, p_amount numeric, p_user_id uuid, p_description character varying, p_reference_type character varying, p_reference_id uuid, p_counterpart character varying, p_reas → uuid | `warehouse_cash_movements` | `pg_advisory_xact_lock`, `warehouse_cash_balance` | `warehouse_cash_main` | `CASH_IDEMPOTENCY_KEY_REQUIRED`, `CASH_INVALID_AMOUNT`, `WAREHOUSE_INSUFFICIENT_BALANCE` | `1760007400000-CashCountsAndWarehouseCustody` | — |
| `ar_charge_balances` | p_client_ids uuid[] → TABLE(charge_id uuid, client_id uuid, original_amount numeric, allocated_paid numeric, general_applied numeric, pending numeric) | — | `sum` | — | — | `1760007000000-AccountsReceivableSettlements` | — |
| `ar_payment_guard` (trigger) |  → trigger | — | — | — | `AR_CHARGE_HAS_PAYMENTS`, `AR_PAYMENT_ROW_LOCKED` | `1760007000000-AccountsReceivableSettlements` | — |
| `armor` | bytea → text | — | — | — | — | — | — |
| `armor` | bytea, text[], text[] → text | — | — | — | — | — | — |
| `cancel_agent_day` | p_date date, p_user_id uuid, p_reason text → uuid | `day_audit_logs`, `day_openings` | — | — | `CANCEL_REASON_REQUIRED`, `DAY_ALREADY_CANCELLED`, `DAY_NOT_CLOSED`, `DAY_NOT_FOUND`, `LATER_DAY_EXISTS` | `1758900000000-AddDayReopeningAndAudit`, `1758900100000-FixLaterDayCheckIncludesReopened` | `TypeOrmDayOpeningRepository.cancel` |
| `cancel_open_sale` | p_user_id uuid, p_draft_key character varying DEFAULT 'default'::character varying → boolean | `inventory_stock`, `products`, `sale_details`, `sales` | — | — | — | `1757200000000-AddDraftSalesSupport`, `1759400000000-CreateInventoryLocationsAndPresentations`, `1760000500000-AddDraftKeyToSales` | `TypeOrmSaleRepository.cancelOpenSale` |
| `cancel_recharge_day` | p_date date, p_user_id uuid, p_reason text → uuid | `recharge_day_audit_logs`, `recharge_day_openings` | — | — | `RECHARGE_CANCEL_REASON_REQUIRED`, `RECHARGE_DAY_ALREADY_CANCELLED`, `RECHARGE_DAY_NOT_CLOSED`, `RECHARGE_DAY_NOT_FOUND`, `RECHARGE_LATER_DAY_EXISTS` | `1759000000000-CreateRechargeDayOpenings` | `TypeOrmRechargeDayOpeningRepository.cancel` |
| `cash_balance` |  → numeric | — | — | — | — | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmAccountReceivableSettlementRepository.getCashBalance`, `TypeOrmCashCustodyRepository.getCustody` |
| `cash_balance_at` | p_sequence bigint → numeric | — | — | — | — | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmCashControlRepository.getDateSummary` |
| `cash_bank_balances_snapshot` |  → jsonb | — | — | — | — | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmCashControlRepository.getBankBalances` |
| `cash_bank_day_on_opening` (trigger) |  → trigger | `cash_bank_day_openings` | `pg_advisory_xact_lock` | `cash_control_main` | — | `1760007300000-CashDailyIndicatorsFromBankDayOpening` | — |
| `cash_bank_day_openings_immutable` (trigger) |  → trigger | — | — | — | `CASH_BANK_DAY_OPENING_IMMUTABLE` | `1760007300000-CashDailyIndicatorsFromBankDayOpening` | — |
| `cash_current_bank_day` | OUT day_opening_id uuid, OUT business_date date, OUT is_open boolean → record | — | — | — | — | `1760007400000-CashCountsAndWarehouseCustody` | `TypeOrmCashCustodyRepository.getCustody`, `TypeOrmCashCustodyRepository.findLatestValidCount` |
| `cash_custody_assert_role` | p_user_id uuid, p_permission text → void | — | — | — | `CASH_CUSTODY_FORBIDDEN` | `1760007400000-CashCountsAndWarehouseCustody` | — |
| `cash_custody_status_only_guard` (trigger) |  → trigger | — | — | — | `CASH_CUSTODY_IMMUTABLE` | `1760007400000-CashCountsAndWarehouseCustody` | — |
| `cash_guatemala_ts` | p_date date, p_time time without time zone → timestamp with time zone | — | — | — | — | `1760006800000-CreateCashControlKardexAndCuts` | — |
| `cash_latest_count_candidate` | p_reference_date date → TABLE(source text, id uuid, number bigint, cut_period_id uuid, cut_number smallint, business_date date, counted_at timestamp with time zone, total_counted numeric, username text, details json) | — | `json_agg` | — | — | `1760007700000-CuadreBreakdownFromLatestCut` | `TypeOrmCashCustodyRepository.findLatestValidCount` |
| `cash_on_bank_deposit_insert` (trigger) |  → trigger | — | `apply_cash_movement` | — | — | `1760006800000-CreateCashControlKardexAndCuts` | — |
| `cash_on_bank_deposit_void` (trigger) |  → trigger | — | `reverse_cash_movements_for_reference` | — | — | `1760006800000-CreateCashControlKardexAndCuts` | — |
| `cash_on_bank_movement_insert` (trigger) |  → trigger | — | `apply_cash_movement` | — | — | `1760006800000-CreateCashControlKardexAndCuts` | — |
| `cash_on_bank_movement_void` (trigger) |  → trigger | — | `reverse_cash_movements_for_reference` | — | — | `1760006800000-CreateCashControlKardexAndCuts` | — |
| `cash_on_portfolio_row` (trigger) |  → trigger | — | `apply_cash_movement`, `count`, `reverse_cash_movements_for_reference` | — | — | `1760006800000-CreateCashControlKardexAndCuts`, `1760007000000-AccountsReceivableSettlements` | — |
| `cash_valid_denomination` | p_value numeric → boolean | — | — | — | — | `1760006800000-CreateCashControlKardexAndCuts` | — |
| `close_agent_day` | p_date date, p_total_cash numeric, p_total_banks numeric, p_total_assets numeric, p_total_accounts_receivable numeric, p_result numeric, p_user_id uuid, p_total_warehouse_cash numeric DEFAULT 0 → uuid | `agent_reconciliations`, `day_audit_logs`, `day_openings` | — | — | `BANK_BALANCES_NOT_REGISTERED`, `DAY_ALREADY_CLOSED`, `DAY_NOT_OPENED` | `1758700000000-AddDayClosingToDayOpenings`, `1758900000000-AddDayReopeningAndAudit`, `1758900000000-AddDayReopeningAndAudit` | `TypeOrmAgentReconciliationRepository.closeDayWithReconciliation` |
| `close_agent_day_with_cash_breakdown` | p_date date, p_total_cash numeric, p_total_banks numeric, p_total_assets numeric, p_total_accounts_receivable numeric, p_result numeric, p_user_id uuid, p_total_warehouse_cash numeric, p_cash_details jsonb, p_source char → uuid | `agent_reconciliation_cash_breakdowns`, `agent_reconciliation_cash_details` | `cash_custody_assert_role`, `close_agent_day` | — | `CUADRE_CASH_BREAKDOWN_INVALID`, `CUADRE_CASH_BREAKDOWN_MISMATCH`, `CUADRE_SOURCE_COUNT_INVALID` | `1760007600000-CuadreCashBreakdownAndCentDenomination`, `1760007700000-CuadreBreakdownFromLatestCut` | `TypeOrmAgentReconciliationRepository.closeDayWithReconciliation` |
| `close_cash_operational_day` | p_day_id uuid, p_user_id uuid, p_observations character varying → uuid | `cash_operational_days` | `pg_advisory_xact_lock` | `cash_control_main` | `CASH_DAY_ALREADY_CLOSED`, `CASH_DAY_CUTS_PENDING`, `CASH_DAY_NOT_FOUND` | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmCashControlRepository.closeDay` |
| `close_financial_day_review` | p_session_id uuid, p_user_id uuid, p_observations character varying, p_has_pending boolean, p_accept_pending boolean, p_difference_after numeric, p_snapshot_after jsonb → void | `financial_day_review_sessions` | `financial_review_assert_role`, `financial_review_lock_session` | — | `FINANCIAL_REVIEW_CONFIRMATION_REQUIRED`, `FINANCIAL_REVIEW_PENDING_DIFFERENCES` | `1760007100000-FinancialDayReview` | `TypeOrmFinancialDayReviewRepository.closeSession` |
| `close_recharge_day` | p_date date, p_user_id uuid → uuid | `recharge_day_audit_logs`, `recharge_day_openings` | — | — | `RECHARGE_DAY_ALREADY_CLOSED`, `RECHARGE_DAY_CANCELLED`, `RECHARGE_DAY_NOT_OPENED`, `RECHARGE_DAY_NOT_READY_TO_CLOSE` | `1759000000000-CreateRechargeDayOpenings` | `TypeOrmRechargeDayOpeningRepository.close` |
| `configure_open_sale` | p_user_id uuid, p_client_id uuid DEFAULT NULL::uuid, p_price_list character varying DEFAULT 'PUBLIC'::character varying, p_draft_key character varying DEFAULT 'default'::character varying → uuid | `sales` | — | — | `PRICE_LIST_LOCKED` | `1759500000000-AddWholesalePricingToSales`, `1760000500000-AddDraftKeyToSales` | `TypeOrmSaleRepository.configureOpenSale` |
| `confirm_ice_cream_purchase` | p_supplier_id uuid, p_user_id uuid, p_purchase_date timestamp with time zone, p_items jsonb → uuid | `ice_cream_purchase_details`, `ice_cream_purchases`, `ice_creams` | — | — | `ICE_CREAM_INACTIVE`, `ICE_CREAM_NOT_FOUND`, `INVALID_PRICE`, `INVALID_QUANTITY`, `PURCHASE_EMPTY`, `SUPPLIER_INACTIVE`, `SUPPLIER_NOT_FOUND` | `1757800000000-CreateIceCreamsModule` | `TypeOrmIceCreamPurchaseRepository.confirmPurchase` |
| `confirm_ice_cream_sale` | p_user_id uuid, p_items jsonb → uuid | `ice_cream_sale_details`, `ice_cream_sales`, `ice_creams` | — | — | `ICE_CREAM_INACTIVE`, `ICE_CREAM_NOT_FOUND`, `INSUFFICIENT_STOCK`, `INVALID_QUANTITY`, `SALE_EMPTY` | `1757800000000-CreateIceCreamsModule` | `TypeOrmIceCreamSaleRepository.confirmSale` |
| `confirm_open_sale` | p_user_id uuid, p_draft_key character varying DEFAULT 'default'::character varying → uuid | `inventory_movements`, `sales` | — | — | — | `1759400000000-CreateInventoryLocationsAndPresentations`, `1760000500000-AddDraftKeyToSales` | `TypeOrmSaleRepository.confirmOpenSale` |
| `confirm_purchase` | p_supplier_id uuid, p_user_id uuid, p_purchase_date timestamp with time zone, p_items jsonb, p_payment_type character varying DEFAULT 'CONTADO'::character varying, p_payment_due_date date DEFAULT NULL::date → uuid | `inventory_movements`, `inventory_stock`, `product_presentations`, `products`, `purchase_details`, `purchases` | `ensure_inventory_stock_row`, `ensure_product_presentation`, `now` | — | `INVALID_PAYMENT_TYPE`, `INVALID_PRICE`, `INVALID_QUANTITY`, `LOCATION_NOT_FOUND`, `PAYMENT_DUE_DATE_REQUIRED`, `PRODUCT_INACTIVE`, `PRODUCT_NOT_FOUND`, `PURCHASE_EMPTY`, `SUPPLIER_INACTIVE`, `SUPPLIER_NOT_FOUND` | `1759400000000-CreateInventoryLocationsAndPresentations`, `1760000000000-AddCreditPaymentToPurchases`, `1760000000000-AddCreditPaymentToPurchases` | `TypeOrmPurchaseRepository.confirmPurchase` |
| `confirm_sale` | p_user_id uuid, p_items jsonb, p_client_id uuid DEFAULT NULL::uuid, p_price_list character varying DEFAULT 'PUBLIC'::character varying → uuid | `inventory_movements`, `inventory_stock`, `products`, `sale_details`, `sales` | `ensure_inventory_stock_row`, `ensure_product_presentation` | — | `INSUFFICIENT_STOCK`, `INVALID_QUANTITY`, `LOCATION_NOT_FOUND`, `PRODUCT_INACTIVE`, `PRODUCT_NOT_FOUND`, `SALE_EMPTY` | `1759400000000-CreateInventoryLocationsAndPresentations`, `1759500000000-AddWholesalePricingToSales`, `1760004300000-AddBusinessSnapshotToSaleDetails` | `TypeOrmSaleRepository.confirmSale` |
| `confirm_sale` | p_user_id uuid, p_items jsonb → uuid | `inventory_movements`, `inventory_stock`, `products`, `sale_details`, `sales` | `ensure_inventory_stock_row`, `ensure_product_presentation` | — | `INSUFFICIENT_STOCK`, `INVALID_QUANTITY`, `LOCATION_NOT_FOUND`, `PRODUCT_INACTIVE`, `PRODUCT_NOT_FOUND`, `SALE_EMPTY` | `1759400000000-CreateInventoryLocationsAndPresentations`, `1759500000000-AddWholesalePricingToSales`, `1760004300000-AddBusinessSnapshotToSaleDetails` | `TypeOrmSaleRepository.confirmSale` |
| `correct_financial_day_snapshot` | p_session_id uuid, p_target character varying, p_target_id uuid, p_field character varying, p_new_value numeric, p_reason character varying, p_observations character varying, p_user_id uuid, p_request_id character varyin → uuid | `agent_reconciliations`, `bank_balances`, `cash_cut_bank_reconciliations`, `cash_cut_counts`, `cash_cut_periods`, `cash_operational_days`, `financial_day_corrections`, `financial_day_review_sessions` | `financial_review_assert_role`, `financial_review_existing_request`, `financial_review_lock_session`, `financial_review_record_version`, `financial_review_validate_request`, `gen_random_uuid`, `set_config` | — | `FINANCIAL_REVIEW_INVALID_FIELD`, `FINANCIAL_REVIEW_INVALID_TARGET`, `FINANCIAL_REVIEW_INVALID_VALUE`, `FINANCIAL_REVIEW_NO_CHANGE`, `FINANCIAL_REVIEW_OUTSIDE_DAY`, `FINANCIAL_REVIEW_TARGET_NOT_CORRECTABLE`, `FINANCIAL_REVIEW_TARGET_NOT_FOUND` | `1760007100000-FinancialDayReview` | `TypeOrmFinancialDayReviewRepository.correctSnapshot` |
| `create_quotation` | p_user_id uuid, p_client_id uuid, p_expiration_date date, p_items jsonb, p_observations character varying, p_commercial_terms character varying → uuid | `quotation_details`, `quotations` | — | — | `CLIENT_NOT_FOUND`, `INVALID_DISCOUNT`, `INVALID_EXPIRATION_DATE`, `INVALID_QUANTITY`, `PRODUCT_INACTIVE`, `PRODUCT_NOT_FOUND`, `QUOTATION_EMPTY` | — | `TypeOrmQuotationRepository.createQuotation` |
| `create_ticket` | p_user_id uuid, p_client_id uuid, p_items jsonb, p_client_name character varying DEFAULT NULL::character varying → uuid | `ticket_details`, `tickets` | — | — | `CLIENT_NOT_FOUND`, `INVALID_QUANTITY`, `INVALID_UNIT_PRICE`, `PRODUCT_INACTIVE`, `PRODUCT_NOT_FOUND`, `TICKET_EMPTY` | — | `TypeOrmTicketRepository.createTicket` |
| `crypt` | text, text → text | — | — | — | — | — | — |
| `dearmor` | text → bytea | — | — | — | — | — | — |
| `decrypt` | bytea, bytea, text → bytea | — | — | — | — | — | — |
| `decrypt_iv` | bytea, bytea, bytea, text → bytea | — | — | — | — | — | — |
| `delete_recharge_sale` | p_id uuid → void | `recharge_sales` | — | — | `RECHARGE_DAY_CLOSED`, `RECHARGE_SALE_LOCKED`, `RECHARGE_SALE_NOT_FOUND` | `1757800000000-CreateRechargeSales`, `1759000100000-AddRechargeDayGateToWriteFunctions` | `TypeOrmRechargeSaleRepository.delete` |
| `digest` | text, text → bytea | — | — | — | — | — | — |
| `digest` | bytea, text → bytea | — | — | — | — | — | — |
| `encrypt` | bytea, bytea, text → bytea | — | — | — | — | — | — |
| `encrypt_iv` | bytea, bytea, bytea, text → bytea | — | — | — | — | — | — |
| `ensure_inventory_stock_row` | p_product_id uuid, p_location_id uuid → void | `inventory_stock` | — | — | — | `1759400000000-CreateInventoryLocationsAndPresentations` | — |
| `ensure_product_presentation` | p_product_id uuid, p_presentation_id uuid → product_presentations | — | — | — | `PRESENTATION_INACTIVE`, `PRESENTATION_NOT_FOUND` | `1759400000000-CreateInventoryLocationsAndPresentations` | — |
| `ensure_recharge_daily_balance` | p_recharge_type_id uuid, p_date date, p_user_id uuid → uuid | `recharge_daily_balances` | — | — | — | `1757500000000-CreateRechargesModule`, `1757700000000-AddRechargeCuadreCycles`, `1757700000000-AddRechargeCuadreCycles` | `TypeOrmRechargeDailyBalanceRepository.ensureDailyBalance` |
| `ensure_recharge_sim_daily_stock` | p_sim_type_id uuid, p_date date, p_user_id uuid → uuid | `recharge_sim_daily_stock` | — | — | — | `1759300000000-CreateRechargeSims` | `TypeOrmRechargeSimDailyStockRepository.ensureDailyStock` |
| `financial_review_adjustment_guard` (trigger) |  → trigger | — | — | — | `FINANCIAL_REVIEW_AUDIT_IMMUTABLE` | `1760007100000-FinancialDayReview` | — |
| `financial_review_assert_role` | p_user_id uuid, p_permission text → void | — | — | — | `FINANCIAL_REVIEW_FORBIDDEN` | `1760007100000-FinancialDayReview` | — |
| `financial_review_audit_immutable` (trigger) |  → trigger | — | — | — | `FINANCIAL_REVIEW_AUDIT_IMMUTABLE` | `1760007100000-FinancialDayReview` | — |
| `financial_review_day_guard` (trigger) |  → trigger | — | — | — | `FINANCIAL_REVIEW_DAY_LOCKED`, `FINANCIAL_REVIEW_OUTSIDE_DAY` | `1760007100000-FinancialDayReview` | — |
| `financial_review_existing_request` | p_request_id character varying, p_session_id uuid → uuid | — | `pg_advisory_xact_lock` | — | `FINANCIAL_REVIEW_IDEMPOTENCY_CONFLICT` | `1760007100000-FinancialDayReview` | — |
| `financial_review_lock_session` | p_session_id uuid, p_user_id uuid, p_owner_only boolean → financial_day_review_sessions | — | — | — | `FINANCIAL_REVIEW_NOT_OWNER`, `FINANCIAL_REVIEW_SESSION_CLOSED`, `FINANCIAL_REVIEW_SESSION_NOT_FOUND` | `1760007100000-FinancialDayReview` | — |
| `financial_review_record_version` | p_correction_id uuid, p_session financial_day_review_sessions, p_table text, p_target_id uuid, p_field text, p_previous numeric, p_value numeric, p_user_id uuid → void | `financial_day_snapshot_versions` | — | — | — | `1760007100000-FinancialDayReview` | — |
| `financial_review_row_date` | p_mode text, p_row jsonb → date | — | — | — | — | `1760007100000-FinancialDayReview` | — |
| `financial_review_session_guard` (trigger) |  → trigger | — | — | — | `FINANCIAL_REVIEW_AUDIT_IMMUTABLE` | `1760007100000-FinancialDayReview` | — |
| `financial_review_validate_request` | p_reason character varying, p_request_id character varying → void | — | — | — | `FINANCIAL_REVIEW_REASON_REQUIRED`, `FINANCIAL_REVIEW_REQUEST_ID_REQUIRED` | `1760007100000-FinancialDayReview` | — |
| `finish_cash_cut_period` | p_period_id uuid, p_user_id uuid, p_details jsonb, p_banks jsonb, p_cash_observations character varying, p_observations character varying → uuid | `cash_cut_bank_reconciliations`, `cash_cut_count_details`, `cash_cut_counts`, `cash_cut_events`, `cash_cut_periods` | `cash_balance`, `count`, `max`, `pg_advisory_xact_lock` | `cash_control_main` | `CASH_CUT_BANKS_INCOMPLETE`, `CASH_CUT_INVALID_BANK`, `CASH_CUT_NOT_FOUND`, `CASH_CUT_NOT_OPEN`, `CASH_INVALID_DENOMINATION` | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmCashControlRepository.finishPeriod` |
| `gen_random_bytes` | integer → bytea | — | — | — | — | — | — |
| `gen_random_uuid` |  → uuid | — | — | — | — | — | — |
| `gen_salt` | text, integer → text | — | — | — | — | — | — |
| `gen_salt` | text → text | — | — | — | — | — | — |
| `gin_extract_query_trgm` | text, internal, smallint, internal, internal, internal, internal → internal | — | — | — | — | — | — |
| `gin_extract_value_trgm` | text, internal → internal | — | — | — | — | — | — |
| `gin_trgm_consistent` | internal, smallint, text, integer, internal, internal, internal, internal → boolean | — | — | — | — | — | — |
| `gin_trgm_triconsistent` | internal, smallint, text, integer, internal, internal, internal → "char" | — | — | — | — | — | — |
| `gtrgm_compress` | internal → internal | — | — | — | — | — | — |
| `gtrgm_consistent` | internal, text, smallint, oid, internal → boolean | — | — | — | — | — | — |
| `gtrgm_decompress` | internal → internal | — | — | — | — | — | — |
| `gtrgm_distance` | internal, text, smallint, oid, internal → double precision | — | — | — | — | — | — |
| `gtrgm_in` | cstring → gtrgm | — | — | — | — | — | — |
| `gtrgm_options` | internal → void | — | — | — | — | — | — |
| `gtrgm_out` | gtrgm → cstring | — | — | — | — | — | — |
| `gtrgm_penalty` | internal, internal, internal → internal | — | — | — | — | — | — |
| `gtrgm_picksplit` | internal, internal → internal | — | — | — | — | — | — |
| `gtrgm_same` | gtrgm, gtrgm, internal → internal | — | — | — | — | — | — |
| `gtrgm_union` | internal, internal → gtrgm | — | — | — | — | — | — |
| `guard_guayacan_bank_account_movement` (trigger) |  → trigger | — | — | — | `GUAYACAN_BALANCE_IN_CASH_BOX` | `1760006700000-GuayacanSingleBalanceFromCashBox` | — |
| `guayacan_cash_balance` |  → numeric | — | — | — | — | `1760006700000-GuayacanSingleBalanceFromCashBox` | `TypeOrmBankRepository.guayacanCashBalance` |
| `guayacan_commission_on_operation_insert` (trigger) |  → trigger | `guayacan_commissions` | `apply_guayacan_cash_movement` | — | — | `1760006600000-GuayacanCashSeparateCommissionsAndTransactions`, `1760006600000-GuayacanCashSeparateCommissionsAndTransactions`, `1760006700000-GuayacanSingleBalanceFromCashBox` | — |
| `guayacan_commission_on_operation_void` (trigger) |  → trigger | `guayacan_cash_movements`, `guayacan_commissions` | `apply_guayacan_cash_movement`, `pg_advisory_xact_lock` | `guayacan_cash_box` | — | `1760006600000-GuayacanCashSeparateCommissionsAndTransactions`, `1760006600000-GuayacanCashSeparateCommissionsAndTransactions`, `1760006700000-GuayacanSingleBalanceFromCashBox` | — |
| `guayacan_valid_denomination` | p_value numeric → boolean | — | — | — | — | `1760006300000-CreateGuayacanCashBox` | — |
| `hmac` | text, text, text → bytea | — | — | — | — | — | — |
| `hmac` | bytea, bytea, text → bytea | — | — | — | — | — | — |
| `immutable_unaccent` | text → text | — | — | — | — | — | — |
| `open_cash_operational_day` | p_date date, p_user_id uuid, p_manual_physical numeric, p_reason character varying, p_first_start time without time zone, p_first_end time without time zone, p_second_start time without time zone, p_second_end time witho → uuid | `cash_cut_periods`, `cash_operational_days` | `cash_balance_at`, `max`, `pg_advisory_xact_lock` | `cash_control_main` | `CASH_CUT_ANOTHER_OPEN`, `CASH_CUT_INVALID_SCHEDULE`, `CASH_CUT_SCHEDULE_OVERLAP`, `CASH_DAY_LATER_EXISTS`, `CASH_INVALID_AMOUNT`, `CASH_REASON_REQUIRED` | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmCashControlRepository.openDay` |
| `open_financial_day_review` | p_date date, p_user_id uuid, p_reason character varying → uuid | `financial_day_review_sessions` | `financial_review_assert_role`, `pg_advisory_xact_lock` | — | `FINANCIAL_REVIEW_ALREADY_OPEN`, `FINANCIAL_REVIEW_DATE_NOT_HISTORICAL`, `FINANCIAL_REVIEW_DAY_NOT_FOUND`, `FINANCIAL_REVIEW_DAY_STILL_OPEN`, `FINANCIAL_REVIEW_REASON_REQUIRED` | `1760007100000-FinancialDayReview` | `TypeOrmFinancialDayReviewRepository.openSession` |
| `pgp_armor_headers` | text, OUT key text, OUT value text → SETOF record | — | — | — | — | — | — |
| `pgp_key_id` | bytea → text | — | — | — | — | — | — |
| `pgp_pub_decrypt` | bytea, bytea, text → text | — | — | — | — | — | — |
| `pgp_pub_decrypt` | bytea, bytea, text, text → text | — | — | — | — | — | — |
| `pgp_pub_decrypt` | bytea, bytea → text | — | — | — | — | — | — |
| `pgp_pub_decrypt_bytea` | bytea, bytea → bytea | — | — | — | — | — | — |
| `pgp_pub_decrypt_bytea` | bytea, bytea, text, text → bytea | — | — | — | — | — | — |
| `pgp_pub_decrypt_bytea` | bytea, bytea, text → bytea | — | — | — | — | — | — |
| `pgp_pub_encrypt` | text, bytea → bytea | — | — | — | — | — | — |
| `pgp_pub_encrypt` | text, bytea, text → bytea | — | — | — | — | — | — |
| `pgp_pub_encrypt_bytea` | bytea, bytea → bytea | — | — | — | — | — | — |
| `pgp_pub_encrypt_bytea` | bytea, bytea, text → bytea | — | — | — | — | — | — |
| `pgp_sym_decrypt` | bytea, text → text | — | — | — | — | — | — |
| `pgp_sym_decrypt` | bytea, text, text → text | — | — | — | — | — | — |
| `pgp_sym_decrypt_bytea` | bytea, text, text → bytea | — | — | — | — | — | — |
| `pgp_sym_decrypt_bytea` | bytea, text → bytea | — | — | — | — | — | — |
| `pgp_sym_encrypt` | text, text, text → bytea | — | — | — | — | — | — |
| `pgp_sym_encrypt` | text, text → bytea | — | — | — | — | — | — |
| `pgp_sym_encrypt_bytea` | bytea, text, text → bytea | — | — | — | — | — | — |
| `pgp_sym_encrypt_bytea` | bytea, text → bytea | — | — | — | — | — | — |
| `register_account_receivable_movement` | p_client_id uuid, p_type character varying, p_amount numeric, p_date date, p_description character varying, p_user_id uuid, p_reference_type character varying DEFAULT NULL::character varying, p_reference_id uuid DEFAULT  → uuid | `accounts_receivable` | `pg_advisory_xact_lock` | — | `ABONO_EXCEEDS_BALANCE`, `INVALID_AMOUNT`, `INVALID_MOVEMENT_TYPE` | `1760000600000-CreateFinancialKardexColumns`, `1760002100000-AddClientAndReferenceForBankDepositReceivables`, `1760002100000-AddClientAndReferenceForBankDepositReceivables` | `TypeOrmAccountReceivableRepository.registerMovement` |
| `register_asset_movement` | p_client_id uuid, p_type character varying, p_amount numeric, p_date date, p_description character varying, p_user_id uuid, p_reference_type character varying DEFAULT NULL::character varying, p_reference_id uuid DEFAULT  → uuid | `assets` | `pg_advisory_xact_lock` | — | `INVALID_AMOUNT`, `INVALID_MOVEMENT_TYPE` | `1760000600000-CreateFinancialKardexColumns`, `1760005500000-AddReferenceToAssets`, `1760005500000-AddReferenceToAssets` | `TypeOrmAssetRepository.registerMovement` |
| `register_bank_balance_credit` | p_bank_id uuid, p_amount numeric, p_business_date date, p_user_id uuid, p_reference_text character varying DEFAULT NULL::character varying, p_observation text DEFAULT NULL::text → TABLE(out_operation_id uuid, out_movement_id uuid, out_balance_before numeric, out_amount numeric, out_balance_after numeric) | — | `apply_bank_account_movement`, `gen_random_uuid` | — | `INVALID_MOVEMENT_AMOUNT` | `1760005600000-AddBankBalanceCredit` | `TypeOrmBankMovementRepository.registerBalanceCredit` |
| `register_bank_deposit_operation` | p_transaction_bank_id uuid, p_total_amount numeric, p_operation_date date, p_cash_details jsonb, p_transaction_amounts jsonb, p_user_id uuid, p_transaction_type_id uuid, p_client_name character varying DEFAULT NULL::char → uuid | `bank_deposit_cash_details`, `bank_deposit_operations`, `bank_deposit_transactions` | `apply_bank_account_movement` | — | `BANK_ACCOUNT_NOT_AVAILABLE`, `BANK_ACCOUNT_REQUIRED`, `BANK_DEPOSIT_CLIENT_INVALID`, `BANK_DEPOSIT_DESCRIPTION_TOO_LONG`, `CASH_BREAKDOWN_NOT_EXPECTED`, `CASH_BREAKDOWN_REQUIRED`, `CASH_TOTAL_MISMATCH`, `GENESIS_ACCOUNT_NOT_CONFIGURED`, `INVALID_CASH_QUANTITY`, `INVALID_CHANGE_GIVEN` | `1760006200000-OptionalCashBreakdownInTransaccionar`, `1760006400000-GuayacanInvertsDepositWithdrawal`, `1760006700000-GuayacanSingleBalanceFromCashBox` | `TypeOrmBankDepositRepository.registerOperation` |
| `register_bank_transfer` | p_source_bank_id uuid, p_destination_bank_id uuid, p_amount numeric, p_business_date date, p_user_id uuid, p_reference_text character varying DEFAULT NULL::character varying, p_concept character varying DEFAULT NULL::cha → uuid | — | `apply_bank_account_movement`, `gen_random_uuid` | — | `BANK_NOT_FOUND`, `INVALID_MOVEMENT_AMOUNT`, `SAME_ACCOUNT_TRANSFER`, `TRANSFER_DESTINATION_NOT_ALLOWED`, `TRANSFER_ORIGIN_NOT_ALLOWED` | `1760005700000-BiClubCreditLine`, `1760005700000-BiClubCreditLine`, `1760005800000-BiClubCreditLineDirection` | `TypeOrmBankMovementRepository.registerTransfer` |
| `register_cash_bank_deposit` | p_bank_id uuid, p_amount numeric, p_details jsonb, p_user_id uuid, p_description character varying, p_idempotency_key character varying → uuid | `cash_movement_details` | `apply_bank_account_movement`, `apply_cash_movement`, `gen_random_uuid`, `pg_advisory_xact_lock` | `cash_control_main` | `CASH_BREAKDOWN_MISMATCH`, `CASH_BREAKDOWN_REQUIRED`, `CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED`, `CASH_DEPOSIT_INVALID_BANK`, `CASH_IDEMPOTENCY_KEY_REQUIRED`, `CASH_INSUFFICIENT_BALANCE`, `CASH_INVALID_AMOUNT`, `CASH_INVALID_DENOMINATION` | `1760006900000-CashBankDeposit` | `TypeOrmCashControlRepository.registerBankDeposit` |
| `register_cash_count` | p_details jsonb, p_observations character varying, p_warehouse_counted numeric, p_user_id uuid, p_idempotency_key character varying, p_replaces_id uuid, p_correction_reason character varying → uuid | `cash_count_details`, `cash_counts` | `cash_balance`, `cash_custody_assert_role`, `gen_random_uuid`, `now`, `pg_advisory_xact_lock`, `warehouse_cash_balance` | `cash_control_main`, `warehouse_cash_main` | `CASH_BREAKDOWN_REQUIRED`, `CASH_COUNT_ALREADY_REPLACED`, `CASH_COUNT_NOT_FOUND`, `CASH_CUSTODY_DAY_NOT_OPEN`, `CASH_IDEMPOTENCY_KEY_REQUIRED`, `CASH_INVALID_AMOUNT`, `CASH_INVALID_DENOMINATION`, `CASH_REASON_REQUIRED` | `1760007400000-CashCountsAndWarehouseCustody` | `TypeOrmCashCustodyRepository.registerCount` |
| `register_cash_warehouse_transfer` | p_amount numeric, p_details jsonb, p_delivered_by character varying, p_received_by character varying, p_voucher_reference character varying, p_observations character varying, p_user_id uuid, p_idempotency_key character v → uuid | `cash_movement_details`, `cash_warehouse_transfers` | `apply_cash_movement`, `apply_warehouse_cash_movement`, `cash_custody_assert_role`, `gen_random_uuid`, `nextval`, `pg_advisory_xact_lock` | `cash_control_main`, `warehouse_cash_main` | `CASH_BREAKDOWN_MISMATCH`, `CASH_CUSTODY_DAY_NOT_OPEN`, `CASH_IDEMPOTENCY_KEY_REQUIRED`, `CASH_INSUFFICIENT_BALANCE`, `CASH_INVALID_AMOUNT`, `CASH_INVALID_DENOMINATION`, `CASH_WAREHOUSE_PEOPLE_REQUIRED` | `1760007400000-CashCountsAndWarehouseCustody` | `TypeOrmCashCustodyRepository.registerTransfer` |
| `register_guayacan_cash_movement` | p_movement_type character varying, p_amount numeric, p_business_date date, p_user_id uuid, p_concept character varying, p_reason character varying, p_notes character varying, p_cash_details jsonb, p_client_request_id uui → uuid | — | — | — | `CASH_MOVEMENT_REASON_REQUIRED`, `INVALID_CASH_MOVEMENT_AMOUNT`, `INVALID_CASH_MOVEMENT_TYPE` | `1760006300000-CreateGuayacanCashBox` | `TypeOrmGuayacanCashBoxRepository.registerMovement` |
| `register_inventory_transfer` | p_product_id uuid, p_presentation_id uuid, p_from_location_id uuid, p_to_location_id uuid, p_quantity_presentation integer, p_user_id uuid, p_reason text DEFAULT NULL::text → uuid | `inventory_movements`, `inventory_stock` | `ensure_inventory_stock_row`, `ensure_product_presentation`, `gen_random_uuid` | — | `INSUFFICIENT_STOCK`, `INVALID_QUANTITY`, `LOCATION_INACTIVE`, `LOCATION_NOT_FOUND`, `PRODUCT_INACTIVE`, `PRODUCT_NOT_FOUND`, `SAME_LOCATION` | `1759400000000-CreateInventoryLocationsAndPresentations` | `TypeOrmInventoryTransferRepository.runTransfer` |
| `register_manual_cash_movement` | p_movement_type character varying, p_amount numeric, p_user_id uuid, p_description character varying, p_reason character varying, p_idempotency_key character varying → uuid | — | `pg_advisory_xact_lock` | `cash_control_main` | `CASH_INITIAL_BALANCE_EXISTS`, `CASH_INVALID_AMOUNT`, `CASH_INVALID_MOVEMENT_TYPE`, `CASH_REASON_REQUIRED` | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmCashControlRepository.registerManualMovement` |
| `register_phone_sale` | p_phone_id uuid, p_client_id uuid, p_client_dpi character varying, p_phone_number character varying, p_sale_date date, p_dpi_image_data bytea, p_dpi_mime_type character varying, p_dpi_size_bytes integer, p_created_by uui → uuid | `phone_sale_dpi_images`, `phone_sales`, `phones` | — | — | `CLIENT_DPI_REQUIRED`, `PHONE_ALREADY_SOLD`, `PHONE_NOT_FOUND`, `PHONE_NUMBER_ALREADY_ASSIGNED`, `PHONE_NUMBER_REQUIRED`, `PHONE_SALE_CLIENT_INVALID` | `1760002800000-CreatePhones`, `1760003000000-MovePhoneNumberToSale`, `1760003000000-MovePhoneNumberToSale` | `TypeOrmPhoneSaleRepository.create` |
| `register_recharge_cash_box_movement` | p_amount numeric, p_movement_type character varying, p_business_date date, p_concept character varying, p_user_id uuid → uuid | `recharge_cash_box_movements` | `pg_advisory_xact_lock` | `recharge_cash_box` | `INVALID_CASH_BOX_MOVEMENT_TYPE`, `INVALID_WITHDRAWAL_AMOUNT`, `INVALID_WITHDRAWAL_CONCEPT`, `INVALID_WITHDRAWAL_DATE`, `WITHDRAWAL_EXCEEDS_BALANCE` | `1760001700000-AddCashBoxContributionMovementType` | `TypeOrmRechargeCashBoxRepository.registerMovement` |
| `register_recharge_final_balance` | p_daily_balance_id uuid, p_final_balance numeric, p_user_id uuid → void | `recharge_daily_balances` | — | — | `DAILY_BALANCE_NOT_FOUND`, `FINAL_BALANCE_EXCEEDS_DAILY`, `INVALID_FINAL_BALANCE`, `RECHARGE_DAY_CLOSED` | `1757500000000-CreateRechargesModule`, `1759000100000-AddRechargeDayGateToWriteFunctions` | `TypeOrmRechargeDailyBalanceRepository.registerFinalBalance` |
| `register_recharge_purchase` | p_recharge_type_id uuid, p_date date, p_purchase_amount numeric, p_credited_amount numeric, p_user_id uuid → uuid | `recharge_daily_balances`, `recharge_purchases` | `ensure_recharge_daily_balance` | — | `DAY_ALREADY_CLOSED`, `INVALID_AMOUNT`, `RECHARGE_DAY_CLOSED`, `RECHARGE_TYPE_INACTIVE`, `RECHARGE_TYPE_NOT_FOUND` | `1759000100000-AddRechargeDayGateToWriteFunctions`, `1759200000000-SplitRechargePurchaseCreditedAmount`, `1759200000000-SplitRechargePurchaseCreditedAmount` | `TypeOrmRechargeDailyBalanceRepository.registerPurchase` |
| `register_recharge_sale` | p_recharge_type_id uuid, p_date date, p_phone_number character varying, p_amount numeric, p_user_id uuid → uuid | `recharge_sales` | `ensure_recharge_daily_balance` | — | `DAY_ALREADY_CLOSED`, `INVALID_AMOUNT`, `INVALID_PHONE_NUMBER`, `RECHARGE_DAY_CLOSED`, `RECHARGE_TYPE_INACTIVE`, `RECHARGE_TYPE_NOT_FOUND` | `1757800000000-CreateRechargeSales`, `1759000100000-AddRechargeDayGateToWriteFunctions` | `TypeOrmRechargeSaleRepository.create` |
| `register_recharge_sales_closure` | p_date date, p_total_collected numeric, p_user_id uuid, p_is_admin boolean → uuid | `recharge_daily_balances`, `recharge_sales_closures` | — | — | `INVALID_TOTAL_COLLECTED`, `PENDING_TYPE_CLOSURE`, `RECHARGE_DAY_CLOSED`, `SALES_CLOSURE_EDIT_FORBIDDEN` | `1760002200000-AddRechargeSimSaleRegistrations`, `1760002300000-AddVoidToRechargeSimSales`, `1760002300000-AddVoidToRechargeSimSales` | `TypeOrmRechargeSalesClosureRepository.registerClosure` |
| `register_recharge_sim_purchase` | p_sim_type_id uuid, p_date date, p_quantity integer, p_user_id uuid → uuid | `recharge_sim_daily_stock`, `recharge_sim_purchases` | `ensure_recharge_sim_daily_stock` | — | `INVALID_SIM_QUANTITY`, `RECHARGE_DAY_CLOSED`, `SIM_TYPE_INACTIVE`, `SIM_TYPE_NOT_FOUND` | `1759300000000-CreateRechargeSims` | `TypeOrmRechargeSimDailyStockRepository.registerPurchase` |
| `register_recharge_sim_sale` | p_sim_type_id uuid, p_date date, p_quantity integer, p_user_id uuid → uuid | `recharge_sim_daily_stock`, `recharge_sim_sales` | `ensure_recharge_sim_daily_stock` | — | `INSUFFICIENT_SIM_STOCK`, `INVALID_SIM_QUANTITY`, `RECHARGE_DAY_CLOSED`, `SIM_TYPE_INACTIVE`, `SIM_TYPE_NOT_FOUND` | `1759300000000-CreateRechargeSims` | `TypeOrmRechargeSimDailyStockRepository.registerSale` |
| `register_recharge_sim_sale_registration` | p_recharge_sim_sale_id uuid, p_sim_number character varying, p_sku character varying, p_client_dpi character varying, p_client_id uuid, p_sale_price numeric, p_dpi_image_id uuid, p_sale_date date, p_user_id uuid → uuid | `recharge_sim_sale_registrations` | — | — | `CLIENT_DPI_REQUIRED`, `INVALID_SIM_SALE_PRICE`, `RECHARGE_DAY_CLOSED`, `RECHARGE_SIM_SALE_NOT_FOUND`, `SIM_NUMBER_REQUIRED`, `SIM_SALE_CLIENT_INVALID`, `SIM_SALE_SKU_REQUIRED` | `1760002200000-AddRechargeSimSaleRegistrations` | `TypeOrmRechargeSimSaleRegistrationRepository.create` |
| `register_recharge_sim_sale_unit` | p_sim_type_id uuid, p_date date, p_user_id uuid → uuid | `recharge_sim_daily_stock`, `recharge_sim_sales` | `ensure_recharge_sim_daily_stock` | — | `INSUFFICIENT_SIM_STOCK`, `RECHARGE_DAY_CLOSED`, `SIM_TYPE_INACTIVE`, `SIM_TYPE_NOT_FOUND` | `1760002200000-AddRechargeSimSaleRegistrations` | `TypeOrmRechargeSimDailyStockRepository.registerSingleUnitSale` |
| `register_sales_cash_box_movement` | p_business_id uuid, p_amount numeric, p_movement_type character varying, p_concept character varying, p_user_id uuid → uuid | `sales_cash_box_movements` | `pg_advisory_xact_lock` | — | `BUSINESS_NOT_FOUND`, `INVALID_CASH_BOX_MOVEMENT_TYPE`, `INVALID_MOVEMENT_AMOUNT`, `INVALID_MOVEMENT_CONCEPT`, `WITHDRAWAL_EXCEEDS_BALANCE` | `1760004400000-CreateSalesCashBoxMovements` | `TypeOrmSalesCashBoxRepository.registerMovement` |
| `register_warehouse_initial_balance` | p_amount numeric, p_user_id uuid, p_reason character varying, p_idempotency_key character varying → uuid | — | `cash_custody_assert_role`, `pg_advisory_xact_lock` | `warehouse_cash_main` | `CASH_REASON_REQUIRED`, `WAREHOUSE_INITIAL_BALANCE_EXISTS` | `1760007400000-CashCountsAndWarehouseCustody` | `TypeOrmCashCustodyRepository.registerWarehouseInitialBalance` |
| `register_warehouse_withdrawal` | p_destination character varying, p_amount numeric, p_details jsonb, p_bank_id uuid, p_delivered_by character varying, p_received_by character varying, p_voucher_reference character varying, p_observations character varyi → uuid | `warehouse_cash_movement_details`, `warehouse_cash_withdrawals` | `apply_bank_account_movement`, `apply_cash_movement`, `apply_warehouse_cash_movement`, `cash_custody_assert_role`, `gen_random_uuid`, `nextval`, `pg_advisory_xact_lock` | `cash_control_main`, `warehouse_cash_main` | `CASH_BREAKDOWN_MISMATCH`, `CASH_CUSTODY_DAY_NOT_OPEN`, `CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED`, `CASH_DEPOSIT_INVALID_BANK`, `CASH_IDEMPOTENCY_KEY_REQUIRED`, `CASH_INVALID_AMOUNT`, `CASH_INVALID_DENOMINATION`, `CASH_WAREHOUSE_PEOPLE_REQUIRED`, `WAREHOUSE_INSUFFICIENT_BALANCE`, `WAREHOUSE_WITHDRAWAL_BANK_REQUIRED` | `1760007500000-WarehouseWithdrawals` | `TypeOrmCashCustodyRepository.registerWithdrawal` |
| `reopen_agent_day` | p_date date, p_user_id uuid, p_reason text → uuid | `day_audit_logs`, `day_openings` | — | — | `DAY_CANCELLED`, `DAY_NOT_CLOSED`, `DAY_NOT_FOUND`, `LATER_DAY_EXISTS`, `REOPEN_REASON_REQUIRED` | `1758900000000-AddDayReopeningAndAudit`, `1758900100000-FixLaterDayCheckIncludesReopened` | `TypeOrmDayOpeningRepository.reopen` |
| `reopen_cash_cut_period` | p_period_id uuid, p_user_id uuid, p_reason character varying → uuid | `cash_cut_counts`, `cash_cut_events`, `cash_cut_periods` | `pg_advisory_xact_lock` | `cash_control_main` | `CASH_CUT_ANOTHER_OPEN`, `CASH_CUT_LATER_EXISTS`, `CASH_CUT_NOT_FINISHED`, `CASH_CUT_NOT_FOUND`, `CASH_DAY_ALREADY_CLOSED`, `CASH_REASON_REQUIRED` | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmCashControlRepository.reopenPeriod` |
| `reopen_recharge_day` | p_date date, p_user_id uuid, p_reason text → uuid | `recharge_day_audit_logs`, `recharge_day_openings` | — | — | `RECHARGE_DAY_CANCELLED`, `RECHARGE_DAY_NOT_CLOSED`, `RECHARGE_DAY_NOT_FOUND`, `RECHARGE_LATER_DAY_EXISTS`, `RECHARGE_REOPEN_REASON_REQUIRED` | `1759000000000-CreateRechargeDayOpenings` | `TypeOrmRechargeDayOpeningRepository.reopen` |
| `request_financial_day_review_close` | p_session_id uuid, p_user_id uuid → void | `financial_day_review_sessions` | `financial_review_assert_role`, `financial_review_lock_session` | — | — | `1760007100000-FinancialDayReview` | `TypeOrmFinancialDayReviewRepository.requestClose` |
| `reverse_bank_account_movements` | p_reference_type character varying, p_reference_id uuid, p_business_date date, p_user_id uuid, p_reason text → integer | `bank_account_movements` | `apply_bank_account_movement` | — | — | `1760005100000-CreateBankAccountMovements` | — |
| `reverse_cash_movement` | p_movement_id uuid, p_user_id uuid, p_reason character varying → uuid | `cash_movements` | `pg_advisory_xact_lock` | `cash_control_main` | `CASH_MOVEMENT_ALREADY_VOIDED`, `CASH_MOVEMENT_NOT_FOUND`, `CASH_MOVEMENT_NOT_VOIDABLE` | `1760006800000-CreateCashControlKardexAndCuts` | — |
| `reverse_cash_movements_for_reference` | p_reference_type character varying, p_reference_id uuid, p_user_id uuid, p_reason character varying → integer | — | `pg_advisory_xact_lock`, `reverse_cash_movement` | `cash_control_main` | — | `1760006800000-CreateCashControlKardexAndCuts` | — |
| `save_bank_balance` | p_bank_id uuid, p_operation_date date, p_final_balance numeric, p_user_id uuid → uuid | `bank_balances` | — | — | `BANK_INACTIVE`, `BANK_NOT_FOUND`, `INVALID_FINAL_BALANCE`, `INVALID_OPERATION_DATE` | `1758500000000-OnlySyncBanksFinalBalanceForLatestDate`, `1760005100000-CreateBankAccountMovements`, `1760005700000-BiClubCreditLine` | `TypeOrmBankBalanceRepository.saveBalances` |
| `search_normalize` | text → text | — | `lower` | — | — | — | — |
| `set_limit` | real → real | — | — | — | — | — | — |
| `settle_accounts_receivable` | p_client_id uuid, p_items jsonb, p_payment_method character varying, p_bank_id uuid, p_reference_number character varying, p_observations character varying, p_expected_total numeric, p_user_id uuid, p_idempotency_key cha → uuid | `account_receivable_payment_details`, `account_receivable_payment_operations` | `apply_bank_account_movement`, `count`, `gen_random_uuid`, `jsonb_array_length`, `left`, `pg_advisory_xact_lock`, `register_account_receivable_movement` | `cash_control_main` | `AR_SETTLEMENT_ACCOUNT_NOT_FOUND`, `AR_SETTLEMENT_ACCOUNT_NOT_PAYABLE`, `AR_SETTLEMENT_ALREADY_SETTLED`, `AR_SETTLEMENT_AMOUNT_EXCEEDS_PENDING`, `AR_SETTLEMENT_BANK_NOT_ALLOWED`, `AR_SETTLEMENT_BANK_REQUIRED`, `AR_SETTLEMENT_CASH_NOT_RECORDED`, `AR_SETTLEMENT_CLIENT_NOT_FOUND`, `AR_SETTLEMENT_DUPLICATE_ITEM`, `AR_SETTLEMENT_GUAYACAN_NOT_ALLOWED` | `1760007000000-AccountsReceivableSettlements` | `TypeOrmAccountReceivableSettlementRepository.settle` |
| `show_limit` |  → real | — | — | — | — | — | — |
| `show_trgm` | text → text[] | — | — | — | — | — | — |
| `similarity` | text, text → real | — | — | — | — | — | — |
| `similarity_dist` | text, text → real | — | — | — | — | — | — |
| `similarity_op` | text, text → boolean | — | — | — | — | — | — |
| `start_cash_cut_period` | p_period_id uuid, p_user_id uuid → uuid | `cash_cut_events`, `cash_cut_periods` | `pg_advisory_xact_lock` | `cash_control_main` | `CASH_CUT_ALREADY_FINISHED`, `CASH_CUT_ALREADY_STARTED`, `CASH_CUT_ANOTHER_OPEN`, `CASH_CUT_FIRST_NOT_FINISHED`, `CASH_CUT_NOT_FOUND`, `CASH_DAY_ALREADY_CLOSED` | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmCashControlRepository.startPeriod` |
| `strict_word_similarity` | text, text → real | — | — | — | — | — | — |
| `strict_word_similarity_commutator_op` | text, text → boolean | — | — | — | — | — | — |
| `strict_word_similarity_dist_commutator_op` | text, text → real | — | — | — | — | — | — |
| `strict_word_similarity_dist_op` | text, text → real | — | — | — | — | — | — |
| `strict_word_similarity_op` | text, text → boolean | — | — | — | — | — | — |
| `unaccent` | text → text | — | — | — | — | — | — |
| `unaccent` | regdictionary, text → text | — | — | — | — | — | — |
| `unaccent_init` | internal → internal | — | — | — | — | — | — |
| `unaccent_lexize` | internal, internal, internal, internal → internal | — | — | — | — | — | — |
| `update_cash_cut_schedule` | p_period_id uuid, p_start time without time zone, p_end time without time zone, p_reason character varying, p_user_id uuid → uuid | `cash_cut_periods`, `cash_cut_schedule_changes` | `cash_guatemala_ts`, `pg_advisory_xact_lock` | `cash_control_main` | `CASH_CUT_ALREADY_FINISHED`, `CASH_CUT_INVALID_SCHEDULE`, `CASH_CUT_NOT_FOUND`, `CASH_CUT_SCHEDULE_OVERLAP`, `CASH_REASON_REQUIRED` | `1760006800000-CreateCashControlKardexAndCuts` | `TypeOrmCashControlRepository.updateSchedule` |
| `update_recharge_sale` | p_id uuid, p_phone_number character varying, p_amount numeric, p_user_id uuid → void | `recharge_sales` | — | — | `INVALID_AMOUNT`, `INVALID_PHONE_NUMBER`, `RECHARGE_DAY_CLOSED`, `RECHARGE_SALE_LOCKED`, `RECHARGE_SALE_NOT_FOUND` | `1757800000000-CreateRechargeSales`, `1759000100000-AddRechargeDayGateToWriteFunctions` | `TypeOrmRechargeSaleRepository.update` |
| `uuid_generate_v1` |  → uuid | — | — | — | — | — | — |
| `uuid_generate_v1mc` |  → uuid | — | — | — | — | — | — |
| `uuid_generate_v3` | namespace uuid, name text → uuid | — | — | — | — | — | — |
| `uuid_generate_v4` |  → uuid | — | — | — | — | — | — |
| `uuid_generate_v5` | namespace uuid, name text → uuid | — | — | — | — | — | — |
| `uuid_nil` |  → uuid | — | — | — | — | — | — |
| `uuid_ns_dns` |  → uuid | — | — | — | — | — | — |
| `uuid_ns_oid` |  → uuid | — | — | — | — | — | — |
| `uuid_ns_url` |  → uuid | — | — | — | — | — | — |
| `uuid_ns_x500` |  → uuid | — | — | — | — | — | — |
| `void_account_receivable_payment` | p_operation_id uuid, p_user_id uuid, p_reason character varying → uuid | `account_receivable_payment_operations`, `accounts_receivable` | `pg_advisory_xact_lock`, `reverse_bank_account_movements`, `set_config` | `cash_control_main` | `AR_SETTLEMENT_ALREADY_VOIDED`, `AR_SETTLEMENT_NOT_FOUND`, `AR_SETTLEMENT_REASON_REQUIRED` | `1760007000000-AccountsReceivableSettlements` | `TypeOrmAccountReceivableSettlementRepository.void` |
| `void_bank_balance_credit` | p_operation_id uuid, p_business_date date, p_user_id uuid, p_reason text → integer | `dentro` | `reverse_bank_account_movements` | — | `BALANCE_CREDIT_ALREADY_VOIDED`, `BALANCE_CREDIT_NOT_FOUND`, `REASON_REQUIRED` | `1760005600000-AddBankBalanceCredit` | `TypeOrmBankMovementRepository.voidBalanceCredit` |
| `void_bank_deposit_operation` | p_operation_id uuid, p_business_date date, p_user_id uuid, p_reason text → void | `bank_deposit_operations` | `reverse_bank_account_movements` | — | `BANK_DEPOSIT_OPERATION_ALREADY_VOIDED`, `BANK_DEPOSIT_OPERATION_NOT_FOUND` | `1760005100000-CreateBankAccountMovements` | `TypeOrmBankDepositRepository.voidOperation` |
| `void_bank_transfer` | p_transfer_id uuid, p_business_date date, p_user_id uuid, p_reason text → void | — | `reverse_bank_account_movements` | — | `LEGACY_CREDIT_LINE_TRANSFER`, `REASON_REQUIRED`, `TRANSFER_ALREADY_VOIDED`, `TRANSFER_NOT_FOUND` | `1760005800000-BiClubCreditLineDirection`, `1760005900000-BiClubAvailableCredit`, `1760006000000-BiClubDebtModel` | `TypeOrmBankMovementRepository.voidTransfer` |
| `void_cash_bank_deposit` | p_movement_id uuid, p_user_id uuid, p_reason character varying → uuid | — | `reverse_bank_account_movements` | — | `CASH_MOVEMENT_ALREADY_VOIDED`, `CASH_MOVEMENT_NOT_FOUND`, `CASH_REASON_REQUIRED` | `1760006900000-CashBankDeposit` | — |
| `void_cash_warehouse_transfer` | p_transfer_id uuid, p_user_id uuid, p_reason character varying → uuid | `cash_warehouse_transfers`, `warehouse_cash_movements` | `apply_warehouse_cash_movement`, `cash_custody_assert_role`, `pg_advisory_xact_lock`, `reverse_cash_movement` | `cash_control_main`, `warehouse_cash_main` | `CASH_REASON_REQUIRED`, `CASH_WAREHOUSE_TRANSFER_ALREADY_VOIDED`, `CASH_WAREHOUSE_TRANSFER_NOT_FOUND` | `1760007400000-CashCountsAndWarehouseCustody` | `TypeOrmCashCustodyRepository.voidTransfer` |
| `void_guayacan_cash_movement` | p_movement_id uuid, p_business_date date, p_user_id uuid, p_reason character varying → uuid | `guayacan_cash_movements` | `pg_advisory_xact_lock` | `guayacan_cash_box` | `CASH_MOVEMENT_ALREADY_VOIDED`, `CASH_MOVEMENT_NOT_FOUND`, `CASH_MOVEMENT_NOT_VOIDABLE`, `CASH_MOVEMENT_REASON_REQUIRED` | `1760006300000-CreateGuayacanCashBox` | `TypeOrmGuayacanCashBoxRepository.voidMovement` |
| `void_manual_cash_movement` | p_movement_id uuid, p_user_id uuid, p_reason character varying → uuid | — | `void_cash_warehouse_transfer`, `void_warehouse_withdrawal` | — | `CASH_MOVEMENT_NOT_FOUND`, `CASH_MOVEMENT_NOT_VOIDABLE`, `CASH_REASON_REQUIRED` | `1760006800000-CreateCashControlKardexAndCuts`, `1760006900000-CashBankDeposit`, `1760007400000-CashCountsAndWarehouseCustody` | `TypeOrmCashControlRepository.voidManualMovement` |
| `void_phone_sale` | p_sale_id uuid, p_voided_by uuid, p_reason character varying → uuid | `phone_sales`, `phones` | — | — | `PHONE_SALE_ALREADY_VOIDED`, `PHONE_SALE_NOT_FOUND`, `VOID_REASON_REQUIRED` | `1760002800000-CreatePhones`, `1760003000000-MovePhoneNumberToSale`, `1760003000000-MovePhoneNumberToSale` | `TypeOrmPhoneSaleRepository.voidSale` |
| `void_purchase` | p_purchase_id uuid, p_user_id uuid, p_reason character varying → uuid | `inventory_movements`, `inventory_stock`, `products`, `purchases` | — | — | `INSUFFICIENT_STOCK_TO_REVERT`, `PURCHASE_ALREADY_VOIDED`, `PURCHASE_HAS_PAYMENT`, `PURCHASE_NOT_FOUND`, `VOID_REASON_REQUIRED` | `1760001900000-AddVoidToPurchases` | `TypeOrmPurchaseRepository.voidPurchase` |
| `void_recharge_purchase` | p_purchase_id uuid, p_user_id uuid, p_reason character varying → uuid | `recharge_daily_balances`, `recharge_purchases` | — | — | `INSUFFICIENT_BALANCE_TO_REVERT`, `PURCHASE_ALREADY_VOIDED`, `PURCHASE_CYCLE_ALREADY_CLOSED`, `PURCHASE_NOT_FOUND`, `RECHARGE_DAY_CLOSED`, `VOID_REASON_REQUIRED` | `1760001800000-AddVoidToRechargePurchases` | `TypeOrmRechargePurchaseRepository.voidPurchase` |
| `void_recharge_sim_sale` | p_sale_id uuid, p_user_id uuid, p_reason character varying → uuid | `recharge_sim_daily_stock`, `recharge_sim_sales` | — | — | `RECHARGE_DAY_CLOSED`, `SIM_SALE_ALREADY_VOIDED`, `SIM_SALE_HAS_REGISTRATION`, `SIM_SALE_NOT_FOUND`, `VOID_REASON_REQUIRED` | `1760002300000-AddVoidToRechargeSimSales` | `TypeOrmRechargeSimSaleRepository.voidSale` |
| `void_recharge_sim_sale_registration` | p_id uuid, p_user_id uuid, p_reason character varying → uuid | `recharge_sim_daily_stock`, `recharge_sim_sale_registrations` | — | — | `RECHARGE_DAY_CLOSED`, `SIM_SALE_REGISTRATION_ALREADY_VOIDED`, `SIM_SALE_REGISTRATION_NOT_FOUND`, `VOID_REASON_REQUIRED` | `1760002200000-AddRechargeSimSaleRegistrations` | `TypeOrmRechargeSimSaleRegistrationRepository.voidRegistration` |
| `void_sale` | p_sale_id uuid, p_user_id uuid, p_reason character varying → uuid | `inventory_movements`, `inventory_stock`, `products`, `sales` | `ensure_inventory_stock_row` | — | `SALE_ALREADY_VOIDED`, `SALE_NOT_CONFIRMED`, `SALE_NOT_FOUND`, `VOID_REASON_REQUIRED` | `1760002000000-AddVoidToSales` | `TypeOrmSaleRepository.voidSale` |
| `void_warehouse_withdrawal` | p_withdrawal_id uuid, p_user_id uuid, p_reason character varying → uuid | `warehouse_cash_movements`, `warehouse_cash_withdrawals` | `apply_warehouse_cash_movement`, `cash_custody_assert_role`, `pg_advisory_xact_lock`, `reverse_bank_account_movements`, `reverse_cash_movement` | `cash_control_main`, `warehouse_cash_main` | `CASH_INSUFFICIENT_BALANCE`, `CASH_REASON_REQUIRED`, `WAREHOUSE_WITHDRAWAL_ALREADY_VOIDED`, `WAREHOUSE_WITHDRAWAL_NOT_FOUND` | `1760007500000-WarehouseWithdrawals` | `TypeOrmCashCustodyRepository.voidWithdrawal` |
| `warehouse_cash_balance` |  → numeric | — | — | — | — | `1760007400000-CashCountsAndWarehouseCustody` | `TypeOrmWarehouseCashReader.getBalance`, `TypeOrmCashControlRepository.getWarehouseBalance` |
| `warehouse_cash_balance_at_time` | p_at timestamp with time zone → numeric | — | — | — | — | `1760007400000-CashCountsAndWarehouseCustody` | — |
| `word_similarity` | text, text → real | — | — | — | — | — | — |
| `word_similarity_commutator_op` | text, text → boolean | — | — | — | — | — | — |
| `word_similarity_dist_commutator_op` | text, text → real | — | — | — | — | — | — |
| `word_similarity_dist_op` | text, text → real | — | — | — | — | — | — |
| `word_similarity_op` | text, text → boolean | — | — | — | — | — | — |

## Migraciones aplicadas (orden de ejecución)

Fuente: tabla `migrations`. Cada archivo está en `comercial-jhoel-api/src/database/migrations/` y su ficha en la [referencia de migraciones](reference/backend/migrations.md).

1. `CreateUsersTable1756310000000`
2. `AddUsernameAndPhoneToUsers1756400000000`
3. `CreateRolesAndUserRoles1756500000000`
4. `CreateCategoriesTable1756600000000`
5. `CreateProductsTable1756700000000`
6. `AddIsActiveToUsers1756800000000`
7. `AddSkuToProducts1756900000000`
8. `CreateBusinessesTable1757000000000`
9. `CreateSalesTables1757100000000`
10. `AddDraftSalesSupport1757200000000`
11. `CreateSuppliersAndPurchases1757300000000`
12. `CreateRechargesModule1757500000000`
13. `CreateRechargeSalesClosures1757600000000`
14. `AddRechargeCuadreCycles1757700000000`
15. `CreateIceCreamsModule1757800000000`
16. `CreateBankAgentsModule1757900000000`
17. `CreateClientsTable1758000000000`
18. `CreateAccountsReceivableAndAssets1758100000000`
19. `CreateRechargeSales1757800000000`
20. `AllowNegativeAssetAmount1758200000000`
21. `CreateAgentReconciliations1758300000000`
22. `SyncBanksFinalBalanceOnSave1758400000000`
23. `OnlySyncBanksFinalBalanceForLatestDate1758500000000`
24. `CreateDayOpenings1758600000000`
25. `AddDayClosingToDayOpenings1758700000000`
26. `AddThemeToUsers1758800000000`
27. `AddDayReopeningAndAudit1758900000000`
28. `FixLaterDayCheckIncludesReopened1758900100000`
29. `CreateRechargeDayOpenings1759000000000`
30. `AddRechargeDayGateToWriteFunctions1759000100000`
31. `SetDatabaseTimezone1759100000000`
32. `SplitRechargePurchaseCreditedAmount1759200000000`
33. `CreateRechargeSims1759300000000`
34. `CreateInventoryLocationsAndPresentations1759400000000`
35. `AddWholesalePricingToSales1759500000000`
36. `CreateTransactionBanksAndBankDeposits1759600000000`
37. `AddClientNameToBankDepositOperations1759700000000`
38. `AddTransactionTypesToBankDeposits1759800000000`
39. `AddVoidToBankDepositOperations1759900000000`
40. `AddCreditPaymentToPurchases1760000000000`
41. `AddMinStockToInventoryStock1760000100000`
42. `AddMinBalanceToRechargeTypes1760000200000`
43. `CreateAlertSettings1760000300000`
44. `CreateAlertReadMarks1760000400000`
45. `AddDraftKeyToSales1760000500000`
46. `CreateFinancialKardexColumns1760000600000`
47. `CreatePresentationTypesTable1760000700000`
48. `CreateUnitsOfMeasureTable1760000800000`
49. `FixPresentationTypeNameInStoredFunctions1760000900000`
50. `CreateDocumentsModule1760001000000`
51. `AddObservationToTicketDetails1760001100000`
52. `AddUnitPriceOverrideToCreateTicket1760001200000`
53. `CreateKeyboardShortcuts1760001300000`
54. `AddChangeGivenToBankDepositOperations1760001400000`
55. `AddClientNameToTickets1760001500000`
56. `CreateRechargeCashBoxWithdrawals1760001600000`
57. `AddCashBoxContributionMovementType1760001700000`
58. `AddVoidToRechargePurchases1760001800000`
59. `AddVoidToPurchases1760001900000`
60. `AddVoidToSales1760002000000`
61. `AddClientAndReferenceForBankDepositReceivables1760002100000`
62. `AddRechargeSimSaleRegistrations1760002200000`
63. `AddVoidToRechargeSimSales1760002300000`
64. `AddBarcodeToProductPresentations1760002400000`
65. `SeedInitialStockSupplier1760002500000`
66. `AddBalanceLimitToRechargeTypes1760002600000`
67. `AddPublicContactFieldsToCompanySettings1760002700000`
68. `CreatePhones1760002800000`
69. `MovePhoneNumberToSale1760003000000`
70. `CreateCatalogModule1760003100000`
71. `AddKrediyaMinAmountToCompanySettings1760003200000`
72. `CreateProductCatalogModule1760003300000`
73. `CreateNewsModule1760003400000`
74. `AddLikesToPublicCatalogEntities1760003500000`
75. `CreateCatalogLikes1760003600000`
76. `CreateNewsTypes1760003700000`
77. `AddNewsTypeAndSlugToNewsArticles1760003800000`
78. `CreateNewsSubscriptions1760003900000`
79. `CreateCatalogBanks1760004000000`
80. `CreateNewsPushSubscriptions1760004100000`
81. `CreateSiteVisits1760004200000`
82. `AddBusinessSnapshotToSaleDetails1760004300000`
83. `CreateSalesCashBoxMovements1760004400000`
84. `AddSearchNormalizationSupport1760004500000`
85. `CreateLandingBackgrounds1760005000000`
86. `CreateBankAccountMovements1760005100000`
87. `AddAvailableInTransaccionarToBanks1760005200000`
88. `AddCashWithdrawalToBankTransfers1760005300000`
89. `ReintegroAlsoDebitsGenesis1760005400000`
90. `AddReferenceToAssets1760005500000`
91. `AddBankBalanceCredit1760005600000`
92. `BiClubCreditLine1760005700000`
93. `BiClubCreditLineDirection1760005800000`
94. `BiClubAvailableCredit1760005900000`
95. `BiClubDebtModel1760006000000`
96. `TransactionBankImageAndAzteca1760006100000`
97. `OptionalCashBreakdownInTransaccionar1760006200000`
98. `CreateGuayacanCashBox1760006300000`
99. `GuayacanInvertsDepositWithdrawal1760006400000`
100. `GuayacanAccountOutsideAgentReconciliation1760006500000`
101. `GuayacanCashSeparateCommissionsAndTransactions1760006600000`
102. `GuayacanSingleBalanceFromCashBox1760006700000`
103. `CreateCashControlKardexAndCuts1760006800000`
104. `CashBankDeposit1760006900000`
105. `AccountsReceivableSettlements1760007000000`
106. `FinancialDayReview1760007100000`
107. `AddDescriptionToBankDepositOperations1760007200000`
108. `CashDailyIndicatorsFromBankDayOpening1760007300000`
109. `CashCountsAndWarehouseCustody1760007400000`
110. `WarehouseWithdrawals1760007500000`
111. `CuadreCashBreakdownAndCentDenomination1760007600000`
112. `CuadreBreakdownFromLatestCut1760007700000`
