# Módulo backend `reports`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/reports/agent-reconciliations` | [agent-reconciliations-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/agent-reconciliations-report.controller.ts#L29) `AgentReconciliationsReportController.findAll` | [GetAgentReconciliationsReportUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-use-case-ts) | `AgentReconciliationsReportRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getAgentReconciliationsReport` |
| `GET /api/reports/agent-reconciliations/summary` | [agent-reconciliations-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/agent-reconciliations-report.controller.ts#L34) `AgentReconciliationsReportController.getSummary` | [GetAgentReconciliationsReportSummaryUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-summary-use-case-ts) | `AgentReconciliationsReportRepository`.getSummary | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getAgentReconciliationsReportSummary` |
| `GET /api/reports/agent-reconciliations/export` | [agent-reconciliations-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/agent-reconciliations-report.controller.ts#L44) `AgentReconciliationsReportController.export` | [ExportAgentReconciliationsReportPdfUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts) | `AgentReconciliationsReportRepository`.findAll/getSummary | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.exportAgentReconciliationsReportPdf` |
| `GET /api/reports/assets-receivables` | [assets-receivables-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/assets-receivables-report.controller.ts#L38) `AssetsReceivablesReportController.findAll` | [GetAssetsReceivablesReportUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts) | `ListAccountsReceivableUseCase`.execute<br>`ListAssetsUseCase`.execute | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getAssetsReceivablesReport` |
| `GET /api/reports/assets-receivables/summary` | [assets-receivables-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/assets-receivables-report.controller.ts#L43) `AssetsReceivablesReportController.getSummary` | [GetAssetsReceivablesReportSummaryUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts) | `GetAssetsReportSummaryUseCase`.execute<br>`GetAccountsReceivableReportSummaryUseCase`.execute | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getAssetsReceivablesReportSummary` |
| `GET /api/reports/assets-receivables/export` | [assets-receivables-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/assets-receivables-report.controller.ts#L49) `AssetsReceivablesReportController.export` | [ExportAssetsReceivablesReportPdfUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts) | `ListAssetsUseCase`.execute<br>`ListAccountsReceivableUseCase`.execute<br>`GetAssetsReportSummaryUseCase`.execute<br>`GetAccountsReceivableReportSummaryUseCase`.execute<br>`ClientRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.exportAssetsReceivablesReportPdf` |
| `GET /api/reports/bank-deposits` | [bank-deposits-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-deposits-report.controller.ts#L34) `BankDepositsReportController.findAll` | [ListBankDepositOperationsUseCase](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-bank-deposit-operations-use-case-ts) | `BankDepositRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getBankDepositsReport` |
| `GET /api/reports/bank-deposits/summary` | [bank-deposits-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-deposits-report.controller.ts#L39) `BankDepositsReportController.getSummary` | [GetBankDepositsReportSummaryUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-deposits-report-summary-use-case-ts) | `BankDepositRepository`.getReportSummary | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getBankDepositsReportSummary` |
| `GET /api/reports/bank-deposits/export` | [bank-deposits-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-deposits-report.controller.ts#L50) `BankDepositsReportController.export` | [ExportBankDepositsReportPdfUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts) | `BankDepositRepository`.findAll/getReportSummary<br>`TransactionBankRepository`.findById<br>`TransactionTypeRepository`.findById<br>`UserRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.exportBankDepositsReportPdf` |
| `GET /api/reports/bank-movements` | [bank-movements-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-movements-report.controller.ts#L25) `BankMovementsReportController.findAll` | [ListBankMovementsUseCase](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts) | `BankMovementRepository`.findMovements [bank_account_movements] | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getBankMovementsReport` |
| `GET /api/reports/bank-movements/export` | [bank-movements-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-movements-report.controller.ts#L31) `BankMovementsReportController.export` | [ExportBankMovementsReportPdfUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts) | `ListBankMovementsUseCase`.execute<br>`BankRepository`.findById<br>`UserRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.exportBankMovementsReportPdf` |
| `GET /api/reports/bank-transfers` | [bank-transfers-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-transfers-report.controller.ts#L25) `BankTransfersReportController.findAll` | [GetBankTransfersReportUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-ts) | `BankMovementRepository`.findTransfers | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getBankTransfersReport` |
| `GET /api/reports/bank-transfers/summary` | [bank-transfers-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-transfers-report.controller.ts#L30) `BankTransfersReportController.getSummary` | [GetBankTransfersReportSummaryUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-ts) | `BankMovementRepository`.getTransfersSummary | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getBankTransfersReportSummary` |
| `GET /api/reports/bank-transfers/export` | [bank-transfers-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-transfers-report.controller.ts#L36) `BankTransfersReportController.export` | [ExportBankTransfersReportPdfUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts) | `GetBankTransfersReportUseCase`.execute<br>`GetBankTransfersReportSummaryUseCase`.execute<br>`BankRepository`.findById<br>`UserRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.exportBankTransfersReportPdf` |
| `GET /api/reports/ice-cream` | [ice-cream-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts#L37) `IceCreamReportController.findAll` | [GetIceCreamReportUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts) | `GetIceCreamSalesReportUseCase`.execute<br>`GetIceCreamPurchasesReportUseCase`.execute | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getIceCreamReport` |
| `GET /api/reports/ice-cream/summary` | [ice-cream-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts#L42) `IceCreamReportController.getSummary` | [GetIceCreamReportSummaryUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts) | `GetIceCreamSalesReportSummaryUseCase`.execute<br>`GetIceCreamPurchasesReportSummaryUseCase`.execute | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getIceCreamReportSummary` |
| `GET /api/reports/ice-cream/export` | [ice-cream-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts#L48) `IceCreamReportController.export` | [ExportIceCreamReportPdfUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts) | `GetIceCreamSalesReportUseCase`.execute<br>`GetIceCreamPurchasesReportUseCase`.execute<br>`GetIceCreamSalesReportSummaryUseCase`.execute<br>`GetIceCreamPurchasesReportSummaryUseCase`.execute<br>`IceCreamRepository`.findById<br>`UserRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.exportIceCreamReportPdf` |
| `GET /api/reports/purchases` | [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L35) `PurchasesReportController.findAll` | [GetPurchasesReportUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-use-case-ts) | `PurchasesReportRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getPurchasesReport` |
| `GET /api/reports/purchases/summary` | [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L40) `PurchasesReportController.getSummary` | [GetPurchasesReportSummaryUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-summary-use-case-ts) | `PurchasesReportRepository`.getSummary | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getPurchasesReportSummary` |
| `GET /api/reports/purchases/by-product` | [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L45) `PurchasesReportController.getByProduct` | [GetPurchasesByProductReportUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-by-product-report-use-case-ts) | `PurchasesReportRepository`.getByProduct | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getPurchasesByProductReport` |
| `GET /api/reports/purchases/export` | [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L51) `PurchasesReportController.export` | [ExportPurchasesReportPdfUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts) | `PurchasesReportRepository`.findAll/getSummary<br>`CategoryRepository`.findById<br>`BusinessRepository`.findById<br>`ProductRepository`.findById<br>`UserRepository`.findById<br>`SupplierRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.exportPurchasesReportPdf` |
| `GET /api/reports/purchases/:id` | [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L69) `PurchasesReportController.findOne` | [GetPurchaseReportDetailUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchase-report-detail-use-case-ts) | `PurchaseRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getPurchaseReportDetail` |
| `GET /api/reports/recharges` | [recharges-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/recharges-report.controller.ts#L37) `RechargesReportController.findAll` | [GetRechargeHistoryUseCase](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-history-use-case-ts) | `RechargeDailyBalanceRepository`.findHistory [recharge_day_openings] | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getRechargesReport` |
| `GET /api/reports/recharges/summary` | [recharges-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/recharges-report.controller.ts#L50) `RechargesReportController.getSummary` | [GetRechargesReportSummaryUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-recharges-report-summary-use-case-ts) | `RechargeDailyBalanceRepository`.getReportSummary [recharge_day_openings] | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getRechargesReportSummary` |
| `GET /api/reports/recharges/export` | [recharges-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/recharges-report.controller.ts#L61) `RechargesReportController.export` | [ExportRechargesReportPdfUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts) | `RechargeDailyBalanceRepository`.findHistory/getReportSummary [recharge_day_openings]<br>`RechargeTypeRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.exportRechargesReportPdf` |
| `GET /api/reports/sales` | [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L46) `SalesReportController.findAll` | [GetSalesReportUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-use-case-ts) | `SalesReportRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getSalesReport` |
| `GET /api/reports/sales/summary` | [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L51) `SalesReportController.getSummary` | [GetSalesReportSummaryUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-summary-use-case-ts) | `SalesReportRepository`.getSummary | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getSalesReportSummary` |
| `GET /api/reports/sales/by-product` | [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L56) `SalesReportController.getByProduct` | [GetSalesByProductReportUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-by-product-report-use-case-ts) | `SalesReportRepository`.getByProduct | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getSalesByProductReport` |
| `GET /api/reports/sales/export` | [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L67) `SalesReportController.export` | [ExportSalesReportPdfUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts) | `SalesReportRepository`.findAll/getSummary<br>`CategoryRepository`.findById<br>`BusinessRepository`.findById<br>`ProductRepository`.findById<br>`UserRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.exportSalesReportPdf` |
| `GET /api/reports/sales/:id` | [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L85) `SalesReportController.findOne` | [GetSaleReportDetailUseCase](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sale-report-detail-use-case-ts) | `SaleRepository`.findById | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `ReportsService.getSaleReportDetail` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [accounts-receivable-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-accounts-receivable-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `AccountsReceivableReportSummaryOutput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [agent-reconciliations-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-agent-reconciliations-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toAgentReconciliationsReportRowOutput`, `toAgentReconciliationsReportSummaryOutput`, `AgentReconciliationsReportRowOutput`, `AgentReconciliationsReportSummaryOutput` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [assets-receivables-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-assets-receivables-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `AssetsReceivablesReportRowOutput`, `AssetsReceivablesReportSummaryOutput`, `AssetsReceivablesReportType` (sin comentario de documentación en el código). | 0 internas | 4 | Media (4 consumidores) |
| [assets-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-assets-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `AssetsReportSummaryOutput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [bank-deposits-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-bank-deposits-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `BankDepositsReportByBankOutput`, `BankDepositsReportSummaryOutput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [ice-cream-purchases-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-purchases-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toIceCreamPurchasesReportRowOutput`, `toIceCreamPurchasesReportSummaryOutput`, `IceCreamPurchasesReportRowOutput`, `IceCreamPurchasesReportSummaryOutput` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [ice-cream-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `IceCreamReportRowOutput`, `IceCreamReportSummaryOutput`, `IceCreamReportType` (sin comentario de documentación en el código). | 0 internas | 4 | Media (4 consumidores) |
| [ice-cream-sales-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-sales-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toIceCreamSalesReportRowOutput`, `toIceCreamSalesReportSummaryOutput`, `IceCreamSalesReportRowOutput`, `IceCreamSalesReportSummaryOutput` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [purchases-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-purchases-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toPurchasesReportRowOutput`, `toPurchasesReportSummaryOutput`, `toPurchasesByProductRowOutput`, `toPurchaseReportDetailOutput`, `PurchasesReportRowOutput` (sin comentario de documentación en el código). | 2 internas | 4 | Media (4 consumidores) |
| [recharges-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-recharges-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `RechargesReportSummaryOutput` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [sales-report-output.ts](#f-comercial-jhoel-api-src-modules-reports-application-dtos-sales-report-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toSalesReportRowOutput`, `toSalesReportSummaryOutput`, `toSalesByProductRowOutput`, `toSaleReportDetailOutput`, `SalesReportRowOutput` (sin comentario de documentación en el código). | 2 internas | 4 | Media (4 consumidores) |
| [export-agent-reconciliations-report-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing — same technique as `ExportRechargesReportPdfUseCase`, no `Date` round-trip needed for an unambiguous calendar day. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-assets-receivables-report-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ExportAssetsReceivablesReportPdfUseCase`, `formatRecordDate`, `formatPeriodLabel`, `reportTitle`, `ExportAssetsReceivablesReportPdfInput` (sin comentario de documentación en el código). | 11 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-bank-deposits-report-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing, same as `formatRechargeDate` — `operationDate` is already an unambiguous calendar day, no `Date` round-trip needed. | 7 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-bank-movements-report-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Exportación PDF del historial de movimientos — reutiliza el mismo `buildReportPdf` de toda la Reportería. | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-bank-transfers-report-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | PDF del Reporte de Transferencias — mismo `buildReportPdf` y tope de filas que el resto de la Reportería. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-ice-cream-report-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Title varies by selection, per the ticket's explicit requirement. | 11 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-purchases-report-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ExportPurchasesReportPdfUseCase`, `ExportPurchasesReportPdfInput`, `EXPORT_ROW_LIMIT` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-recharges-report-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing — no `Date` object round-trip, avoiding any timezone-parsing risk for a value that's already an unambiguous calendar day. | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [export-sales-report-pdf.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ExportSalesReportPdfUseCase`, `ExportSalesReportPdfInput`, `EXPORT_ROW_LIMIT` (sin comentario de documentación en el código). | 8 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-accounts-receivable-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-accounts-receivable-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | `date` is a plain DATE column on `accounts_receivable` (see the module's own migration comment), so — like Recargas' own report summary — a lexicographic `yyyy-MM-dd` string comparison is already correct; no `parseReportDateRange` start/end-of-day widening (needed for Sales'/ Purchases' `timestamptz` columns) applies here. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-agent-reconciliations-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetAgentReconciliationsReportSummaryUseCase`, `GetAgentReconciliationsReportSummaryInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-agent-reconciliations-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetAgentReconciliationsReportUseCase`, `GetAgentReconciliationsReportInput`, `GetAgentReconciliationsReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-assets-receivables-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Each requested type's total is always a real SQL aggregate (via `GetAssetsReportSummaryUseCase`/`GetAccountsReceivableReportSummaryUseCase`, both already backed by `getReportSummary()` — see those use cases' own doc comments) — never derived from whatever the list use case happened to paginate/cap, so the Cards are always exactly correct regardless of how the table is windowed. | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-assets-receivables-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts) | .ts | Caso de uso | Aplicación | Orchestrates `ListAccountsReceivableUseCase`/`ListAssetsUseCase` — the exact same use cases the operational Cuentas por Cobrar/Activos screens and their own (now-removed) standalone reports already used — rather than querying either repository directly, so there is exactly one place that knows how to filter/paginate each table. | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-assets-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | `date` is a plain DATE column on `assets` — same lexicographic-comparison reasoning as `GetAccountsReceivableReportSummaryUseCase`. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-bank-deposits-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-deposits-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | `operationDate` is a plain DATE column, so a lexicographic string comparison is already correct — same reasoning as `GetRechargesReportSummaryUseCase`. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-bank-transfers-report.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `mockRepository` (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [get-bank-transfers-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-ts) | .ts | Caso de uso | Aplicación | Reporte de Transferencias Bancarias — listado paginado. | 2 internas; ext.: @nestjs/common | 4 | Media (4 consumidores) |
| [get-ice-cream-purchases-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetIceCreamPurchasesReportSummaryUseCase`, `GetIceCreamPurchasesReportSummaryInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-ice-cream-purchases-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetIceCreamPurchasesReportUseCase`, `GetIceCreamPurchasesReportInput`, `GetIceCreamPurchasesReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-ice-cream-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Each requested type's total is always a real SQL aggregate, via the same summary use cases the two now-removed standalone reports already used — never derived from a paginated/capped list. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-ice-cream-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts) | .ts | Caso de uso | Aplicación | Orchestrates `GetIceCreamSalesReportUseCase`/`GetIceCreamPurchasesReportUseCase` — the exact same use cases the two now-removed standalone reports already used — rather than querying either repository directly. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-ice-cream-sales-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetIceCreamSalesReportSummaryUseCase`, `GetIceCreamSalesReportSummaryInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-ice-cream-sales-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-use-case-ts) | .ts | Caso de uso | Aplicación | Structural clone of `GetSalesReportUseCase` — see that use case for the pattern; `GetIceCreamPurchasesReportUseCase`/both modules' own `*ReportSummaryUseCase` are the same clone relationship to their Sales/Purchases counterparts. | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [get-purchase-report-detail.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchase-report-detail-use-case-ts) | .ts | Caso de uso | Aplicación | Reuses `PurchasesModule`'s own `PURCHASE_REPOSITORY.findById` — same reasoning as `GetSaleReportDetailUseCase`: avoids re-querying rows that already have a correct, tested fetch path, and adds only the report's `purchaseNumber` folio. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-purchases-by-product-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-by-product-report-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetPurchasesByProductReportUseCase`, `GetPurchasesByProductReportInput`, `GetPurchasesByProductReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-purchases-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetPurchasesReportSummaryUseCase`, `GetPurchasesReportSummaryInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-purchases-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetPurchasesReportUseCase`, `GetPurchasesReportInput`, `GetPurchasesReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-recharges-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-recharges-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Unlike the daily-summary card (`GetRechargeSalesSummaryUseCase`, scoped to one date's CURRENT cycle only), this aggregates across every cycle matching the filters — a report over a date range needs the full historical picture, not just "today". | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sale-report-detail.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sale-report-detail-use-case-ts) | .ts | Caso de uso | Aplicación | Reuses `SalesModule`'s own `SALE_REPOSITORY.findById` — a full sale with every line item already exists there, tested and correct, so this only adds the report-specific `saleNumber` folio rather than re-querying the same rows a second time. | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sales-by-product-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-by-product-report-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetSalesByProductReportUseCase`, `GetSalesByProductReportInput`, `GetSalesByProductReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sales-report-summary.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-summary-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetSalesReportSummaryUseCase`, `GetSalesReportSummaryInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-sales-report.use-case.ts](#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetSalesReportUseCase`, `GetSalesReportInput`, `GetSalesReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [parse-report-date-range.ts](#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts) | .ts | Utilidad | Aplicación | Query params arrive as plain `yyyy-MM-dd` (a date picker has no time component) — `startDate` is widened to 00:00:00.000 of that day and `endDate` to 23:59:59.999, so a same-day range still captures every sale/ purchase recorded that day instead of matching nothing. | 1 internas | 13 | Alta (13 consumidores) |
| [parse-report-status.ts](#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-status-ts) | .ts | Utilidad | Aplicación | Maps the reports module's own `status` query convention to the `isActive` tri-state the Cuentas por Cobrar/Activos repositories expect. | 0 internas | 6 | Media (6 consumidores) |
| [report-format.util.ts](#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts) | .ts | Utilidad | Aplicación | Utilidad: declara `formatReportDate`, `formatReportCurrency`, `formatReportQuantity`, `formatReportPeriodLabel` (sin comentario de documentación en el código). | 0 internas | 9 | Media (9 consumidores) |
| [invalid-date-range.error.ts](#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidDateRangeError` (sin comentario de documentación en el código). | 1 internas | 9 | Media (9 consumidores) |
| [no-ice-cream-movement-type-selected.error.ts](#f-comercial-jhoel-api-src-modules-reports-domain-errors-no-ice-cream-movement-type-selected-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `NoIceCreamMovementTypeSelectedError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [no-report-type-selected.error.ts](#f-comercial-jhoel-api-src-modules-reports-domain-errors-no-report-type-selected-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `NoReportTypeSelectedError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [purchase-report-not-found.error.ts](#f-comercial-jhoel-api-src-modules-reports-domain-errors-purchase-report-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `PurchaseReportNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [sale-report-not-found.error.ts](#f-comercial-jhoel-api-src-modules-reports-domain-errors-sale-report-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `SaleReportNotFoundError` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [agent-reconciliations-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-domain-repositories-agent-reconciliations-report-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `AgentReconciliationsReportFilters`, `AgentReconciliationsReportRow`, `AgentReconciliationsReportSummary`, `PaginatedAgentReconciliationsReportResult`, `AgentReconciliationsReportRepository` (sin comentario de documentación en el código). | 0 internas | 6 | Media (6 consumidores) |
| [ice-cream-purchases-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-purchases-report-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `IceCreamPurchasesReportFilters`, `IceCreamPurchasesReportRow`, `IceCreamPurchasesReportSummary`, `PaginatedReportResult`, `IceCreamPurchasesReportRepository` (sin comentario de documentación en el código). | 0 internas | 5 | Media (5 consumidores) |
| [ice-cream-sales-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-sales-report-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `IceCreamSalesReportFilters`, `IceCreamSalesReportRow`, `IceCreamSalesReportSummary`, `PaginatedReportResult`, `IceCreamSalesReportRepository` (sin comentario de documentación en el código). | 0 internas | 5 | Media (5 consumidores) |
| [purchases-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-domain-repositories-purchases-report-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `PurchasesReportFilters`, `PurchasesReportRow`, `PurchasesReportSummary`, `PurchasesByProductRow`, `PaginatedReportResult` (sin comentario de documentación en el código). | 0 internas | 8 | Media (8 consumidores) |
| [sales-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-domain-repositories-sales-report-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Shared shape across every sales-report query — `findAll`, `getSummary`, and `getByProduct` all accept the same filter set so the three numbers on screen (list, KPI tiles, product breakdown) always describe the exact same slice of data. | 0 internas | 8 | Media (8 consumidores) |
| [report-pdf.builder.ts](#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts) | .ts | Builder | Infraestructura | A single, generic builder shared by both the sales and purchases PDF exports — the two reports differ only in title/columns/rows, never in layout, so there's exactly one place that knows how to lay out a page, paginate a table, or number pages. | 1 internas; ext.: fs, path, pdfkit | 10 | Alta (10 consumidores) |
| [typeorm-agent-reconciliations-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-agent-reconciliations-report-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | `agent_reconciliations.date` is a plain Postgres `DATE` column — filtering uses the same safe lexicographic string comparison `GET /recharges/history` already relies on, no `Date` object start/end-of-day widening needed, unlike Sales'/Purchases' `timestamptz` filters. | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-ice-cream-purchases-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-ice-cream-purchases-report-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Structural clone of `TypeOrmIceCreamSalesReportRepository` — see that repository's own doc comment for why this is deliberately rooted on the detail (line-item) table rather than the purchase header. | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-ice-cream-sales-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-ice-cream-sales-report-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Deliberately rooted on `IceCreamSaleDetailOrmEntity` (one row per line item sold), unlike `TypeOrmSalesReportRepository` (rooted on the sale header, one row per sale, specifically to avoid a `sale.items` join fanning out the row count/pagination — see that repository's own doc comment). | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-purchases-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-purchases-report-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmPurchasesReportRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-sales-report.repository.ts](#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-sales-report-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmSalesReportRepository`, `SORT_COLUMN` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [agent-reconciliations-report.controller.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-agent-reconciliations-report-controller-ts) | .ts | Controlador | Presentación | Structural clone of `RechargesReportController` — a management view, not an operational one: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `AgentReconciliationsController`/`BanksController`, which leave the daily cuadre operation open to any authenticated account. | 8 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [assets-receivables-report.controller.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-assets-receivables-report-controller-ts) | .ts | Controlador | Presentación | Replaces the two former standalone controllers (`AccountsReceivableReportController`/`AssetsReportController`, both removed) with a single unified one — the checkbox-selected `types` query param decides whether one or both tables are queried, per the ticket's explicit consolidation requirement. | 8 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [bank-deposits-report.controller.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-deposits-report-controller-ts) | .ts | Controlador | Presentación | Reportería is a management view, not an operational one — same rule as `RechargesReportController`/`SalesReportController`: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `BankDepositsController` itself, which deliberately leaves registering a deposit open to any authenticated account. | 8 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [bank-movements-report.controller.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-movements-report-controller-ts) | .ts | Controlador | Presentación | Historial de movimientos de saldo bancario — admin-only, igual que toda la Reportería. | 7 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [bank-transfers-report.controller.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-transfers-report-controller-ts) | .ts | Controlador | Presentación | Reporte de Transferencias Bancarias — admin-only, igual que toda la Reportería. | 7 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [ice-cream-report.controller.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-ice-cream-report-controller-ts) | .ts | Controlador | Presentación | Replaces the two former standalone controllers (`IceCreamSalesReportController`/`IceCreamPurchasesReportController`, both removed) with a single unified one — the checkbox-selected `types` query param decides whether ventas, compras, or both are queried. | 8 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [purchases-report.controller.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts) | .ts | Controlador | Presentación | Same admin-only policy and route-ordering rule as `SalesReportController` — see that file's doc comment. | 10 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [recharges-report.controller.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-recharges-report-controller-ts) | .ts | Controlador | Presentación | Reportería is a management view, not an operational one — same rule as `SalesReportController`/`PurchasesReportController`: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `RechargesController` itself, which deliberately leaves the daily register (compras, saldo final, cuadre) open to any authenticated account. | 8 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [sales-report.controller.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts) | .ts | Controlador | Presentación | Reportería is a management view, not an operational one — every route here is `@Roles('ADMIN', 'SUPER_ADMIN')` (unlike `SalesController`, which deliberately leaves `POST /sales` open to any authenticated account because *registering* a sale is a cashier's job). | 10 internas; ext.: @nestjs/common, express | 1 | Media (controlador) |
| [agent-reconciliations-report-filter.query.dto.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-agent-reconciliations-report-filter-query-dto-ts) | .ts | DTO de consulta | Presentación | Shared across every agent-reconciliations-report route (`GET /reports/agent-reconciliations`, `/summary`, `/export`) — no product/category/business filter, since `agent_reconciliations` has no such dimension. | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [assets-receivables-report-filter.query.dto.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-assets-receivables-report-filter-query-dto-ts) | .ts | DTO de consulta | Presentación | Shared across every assets-receivables-report route (`GET /reports/assets-receivables`, `/summary`, `/export`). | 2 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [bank-deposits-report-filter.query.dto.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-bank-deposits-report-filter-query-dto-ts) | .ts | DTO de consulta | Presentación | Shared across every bank-deposits-report route (`GET /reports/bank-deposits`, `/summary`, `/export`) — each use case only reads the fields it actually needs. | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [bank-movements-report-filter.query.dto.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-bank-movements-report-filter-query-dto-ts) | .ts | DTO de consulta | Presentación | Filtros del historial de movimientos de saldo bancario (`GET /reports/bank-movements`, `/export`). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [bank-transfers-report-filter.query.dto.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-bank-transfers-report-filter-query-dto-ts) | .ts | DTO de consulta | Presentación | Filtros del Reporte de Transferencias Bancarias (`GET /reports/bank-transfers`, `/summary`, `/export`). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [ice-cream-report-filter.query.dto.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-ice-cream-report-filter-query-dto-ts) | .ts | DTO de consulta | Presentación | Shared across every ice-cream-report route (`GET /reports/ice-cream`, `/summary`, `/export`). | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [purchases-report-filter.query.dto.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-purchases-report-filter-query-dto-ts) | .ts | DTO de consulta | Presentación | Shared across every purchases-report route — same reasoning as `SalesReportFilterQueryDto`. | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [recharges-report-filter.query.dto.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-recharges-report-filter-query-dto-ts) | .ts | DTO de consulta | Presentación | Shared across every recharges-report route (`GET /reports/recharges`, `/summary`, `/export`) — each use case only reads the fields it actually needs. | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [sales-report-filter.query.dto.ts](#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-sales-report-filter-query-dto-ts) | .ts | DTO de consulta | Presentación | Shared across every sales-report route (`GET /reports/sales`, `/summary`, `/by-product`, `/export`) — each use case only reads the fields it actually needs (e.g. | 1 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [reports.module.ts](#f-comercial-jhoel-api-src-modules-reports-reports-module-ts) | .ts | Módulo | Arranque / configuración | Reportería is a pure read-side, cross-cutting module — it never writes to `sales`/`purchases`/`products`/etc., only queries them, so it registers their ORM entities directly via its own `TypeOrmModule.forFeature(...)` (safe: `autoLoadEntities: true` + the same entity class registered in two modules' | 74 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-accounts-receivable-report-output-ts"></a>

### accounts-receivable-report-output.ts

- **Ruta:** [accounts-receivable-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/accounts-receivable-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/accounts-receivable-report-output.ts`, 5 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `AccountsReceivableReportSummaryOutput` (sin comentario de documentación en el código).
- **Consumidores:** [get-accounts-receivable-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-accounts-receivable-report-summary-use-case-ts)

**Interfaces, tipos y enums:**

- `interface AccountsReceivableReportSummaryOutput` (L1): sin documentación — miembros: `recordCount`, `totalAmount`
<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-agent-reconciliations-report-output-ts"></a>

### agent-reconciliations-report-output.ts

- **Ruta:** [agent-reconciliations-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/agent-reconciliations-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/agent-reconciliations-report-output.ts`, 39 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `toAgentReconciliationsReportRowOutput`, `toAgentReconciliationsReportSummaryOutput`, `AgentReconciliationsReportRowOutput`, `AgentReconciliationsReportSummaryOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [agent-reconciliations-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-agent-reconciliations-report-repository-ts)
- **Consumidores:** [get-agent-reconciliations-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-summary-use-case-ts), [get-agent-reconciliations-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-use-case-ts)

**Interfaces, tipos y enums:**

- `interface AgentReconciliationsReportRowOutput` (L6): sin documentación — miembros: `id`, `date`, `totalCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `createdAt`, `createdByUsername`
- `interface AgentReconciliationsReportSummaryOutput` (L24): sin documentación — miembros: `recordCount`, `totalCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `totalResult`, `averageResult`
#### Función `toAgentReconciliationsReportRowOutput` (L18–22)

- **Tipo:** función exportada
- **Firma:** `toAgentReconciliationsReportRowOutput(row: AgentReconciliationsReportRow): AgentReconciliationsReportRowOutput` — [agent-reconciliations-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/agent-reconciliations-report-output.ts#L18)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toAgentReconciliationsReportSummaryOutput` (L34–38)

- **Tipo:** función exportada
- **Firma:** `toAgentReconciliationsReportSummaryOutput(summary: AgentReconciliationsReportSummary): AgentReconciliationsReportSummaryOutput` — [agent-reconciliations-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/agent-reconciliations-report-output.ts#L34)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-agent-reconciliations-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-summary-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-assets-receivables-report-output-ts"></a>

### assets-receivables-report-output.ts

- **Ruta:** [assets-receivables-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/assets-receivables-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/assets-receivables-report-output.ts`, 22 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `AssetsReceivablesReportRowOutput`, `AssetsReceivablesReportSummaryOutput`, `AssetsReceivablesReportType` (sin comentario de documentación en el código).
- **Consumidores:** [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts), [assets-receivables-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-assets-receivables-report-filter-query-dto-ts)

**Interfaces, tipos y enums:**

- `interface AssetsReceivablesReportRowOutput` (L3): sin documentación — miembros: `id`, `type`, `clientId`, `clientName`, `date`, `amount`, `movementType`, `description`, `isActive`
- `interface AssetsReceivablesReportSummaryOutput` (L16): sin documentación — miembros: `totalAssets`, `totalAccountsReceivable`, `totalGeneral`, `recordCount`
- `type AssetsReceivablesReportType` (L1) = `'assets' \| 'accounts_receivable'`
<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-assets-report-output-ts"></a>

### assets-report-output.ts

- **Ruta:** [assets-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/assets-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/assets-report-output.ts`, 5 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `AssetsReportSummaryOutput` (sin comentario de documentación en el código).
- **Consumidores:** [get-assets-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-report-summary-use-case-ts)

**Interfaces, tipos y enums:**

- `interface AssetsReportSummaryOutput` (L1): sin documentación — miembros: `recordCount`, `totalAmount`
<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-bank-deposits-report-output-ts"></a>

### bank-deposits-report-output.ts

- **Ruta:** [bank-deposits-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/bank-deposits-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/bank-deposits-report-output.ts`, 14 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `BankDepositsReportByBankOutput`, `BankDepositsReportSummaryOutput` (sin comentario de documentación en el código).
- **Consumidores:** [get-bank-deposits-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-deposits-report-summary-use-case-ts)

**Interfaces, tipos y enums:**

- `interface BankDepositsReportByBankOutput` (L1): sin documentación — miembros: `transactionBankId`, `transactionBankName`, `operationCount`, `totalAmount`
- `interface BankDepositsReportSummaryOutput` (L8): sin documentación — miembros: `operationCount`, `transactionCount`, `totalAmount`, `byBank`
<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-purchases-report-output-ts"></a>

### ice-cream-purchases-report-output.ts

- **Ruta:** [ice-cream-purchases-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-purchases-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-purchases-report-output.ts`, 39 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `toIceCreamPurchasesReportRowOutput`, `toIceCreamPurchasesReportSummaryOutput`, `IceCreamPurchasesReportRowOutput`, `IceCreamPurchasesReportSummaryOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-purchases-report-repository-ts)
- **Consumidores:** [get-ice-cream-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-summary-use-case-ts), [get-ice-cream-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-use-case-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamPurchasesReportRowOutput` (L6): sin documentación — miembros: `id`, `purchaseId`, `date`, `supplierId`, `supplierName`, `product`, `sku`, `quantity`, `costPrice`, `total`, `userId`, `username`
- `interface IceCreamPurchasesReportSummaryOutput` (L21): sin documentación — miembros: `totalPurchased`, `totalQuantity`, `recordCount`, `averageCost`
#### Función `toIceCreamPurchasesReportRowOutput` (L28–32)

- **Tipo:** función exportada
- **Firma:** `toIceCreamPurchasesReportRowOutput(row: IceCreamPurchasesReportRow): IceCreamPurchasesReportRowOutput` — [ice-cream-purchases-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-purchases-report-output.ts#L28)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toIceCreamPurchasesReportSummaryOutput` (L34–38)

- **Tipo:** función exportada
- **Firma:** `toIceCreamPurchasesReportSummaryOutput(summary: IceCreamPurchasesReportSummary): IceCreamPurchasesReportSummaryOutput` — [ice-cream-purchases-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-purchases-report-output.ts#L34)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-ice-cream-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-summary-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-report-output-ts"></a>

### ice-cream-report-output.ts

- **Ruta:** [ice-cream-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-report-output.ts`, 22 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `IceCreamReportRowOutput`, `IceCreamReportSummaryOutput`, `IceCreamReportType` (sin comentario de documentación en el código).
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts), [get-ice-cream-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts), [ice-cream-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-ice-cream-report-filter-query-dto-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamReportRowOutput` (L3): sin documentación — miembros: `id`, `type`, `date`, `product`, `sku`, `quantity`, `unitPrice`, `total`, `userId`, `username`
- `interface IceCreamReportSummaryOutput` (L16): sin documentación — miembros: `totalSales`, `totalPurchases`, `difference`, `recordCount`
- `type IceCreamReportType` (L1) = `'sales' \| 'purchases'`
<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-sales-report-output-ts"></a>

### ice-cream-sales-report-output.ts

- **Ruta:** [ice-cream-sales-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-sales-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-sales-report-output.ts`, 37 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `toIceCreamSalesReportRowOutput`, `toIceCreamSalesReportSummaryOutput`, `IceCreamSalesReportRowOutput`, `IceCreamSalesReportSummaryOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-sales-report-repository-ts)
- **Consumidores:** [get-ice-cream-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-summary-use-case-ts), [get-ice-cream-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-use-case-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamSalesReportRowOutput` (L6): sin documentación — miembros: `id`, `saleId`, `date`, `product`, `sku`, `quantity`, `unitPrice`, `total`, `userId`, `username`
- `interface IceCreamSalesReportSummaryOutput` (L19): sin documentación — miembros: `totalSold`, `totalQuantity`, `recordCount`, `averagePrice`
#### Función `toIceCreamSalesReportRowOutput` (L26–30)

- **Tipo:** función exportada
- **Firma:** `toIceCreamSalesReportRowOutput(row: IceCreamSalesReportRow): IceCreamSalesReportRowOutput` — [ice-cream-sales-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-sales-report-output.ts#L26)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toIceCreamSalesReportSummaryOutput` (L32–36)

- **Tipo:** función exportada
- **Firma:** `toIceCreamSalesReportSummaryOutput(summary: IceCreamSalesReportSummary): IceCreamSalesReportSummaryOutput` — [ice-cream-sales-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/ice-cream-sales-report-output.ts#L32)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-ice-cream-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-summary-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-purchases-report-output-ts"></a>

### purchases-report-output.ts

- **Ruta:** [purchases-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/purchases-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/purchases-report-output.ts`, 111 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `toPurchasesReportRowOutput`, `toPurchasesReportSummaryOutput`, `toPurchasesByProductRowOutput`, `toPurchaseReportDetailOutput`, `PurchasesReportRowOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-entities-purchase-entity-ts), [purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-purchases-report-repository-ts)
- **Consumidores:** [get-purchase-report-detail.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchase-report-detail-use-case-ts), [get-purchases-by-product-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-by-product-report-use-case-ts), [get-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-summary-use-case-ts), [get-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-use-case-ts)

**Interfaces, tipos y enums:**

- `interface PurchasesReportRowOutput` (L8): sin documentación — miembros: `id`, `purchaseNumber`, `purchaseDate`, `supplierId`, `supplierName`, `userId`, `username`, `itemCount`, `total`, `invoiceNumber`, `isVoided`
- `interface PurchasesReportSummaryOutput` (L28): sin documentación — miembros: `totalAmount`, `purchasesCount`, `unitsPurchased`, `averagePurchase`
- `interface PurchasesByProductRowOutput` (L41): sin documentación — miembros: `productId`, `productName`, `sku`, `quantityPurchased`, `totalCost`
- `interface PurchaseReportDetailItemOutput` (L55): sin documentación — miembros: `productId`, `productName`, `sku`, `quantity`, `costPrice`, `publicPrice`, `total`
- `interface PurchaseReportDetailOutput` (L65): sin documentación — miembros: `id`, `purchaseNumber`, `purchaseDate`, `supplierId`, `supplierName`, `userId`, `username`, `total`, `items`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
#### Función `toPurchasesReportRowOutput` (L22–26)

- **Tipo:** función exportada
- **Firma:** `toPurchasesReportRowOutput(row: PurchasesReportRow): PurchasesReportRowOutput` — [purchases-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/purchases-report-output.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toPurchasesReportSummaryOutput` (L35–39)

- **Tipo:** función exportada
- **Firma:** `toPurchasesReportSummaryOutput(summary: PurchasesReportSummary): PurchasesReportSummaryOutput` — [purchases-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/purchases-report-output.ts#L35)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-summary-use-case-ts)

#### Función `toPurchasesByProductRowOutput` (L49–53)

- **Tipo:** función exportada
- **Firma:** `toPurchasesByProductRowOutput(row: PurchasesByProductRow): PurchasesByProductRowOutput` — [purchases-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/purchases-report-output.ts#L49)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toPurchaseReportDetailOutput` (L83–110)

- **Tipo:** función exportada
- **Firma:** `toPurchaseReportDetailOutput(purchase: Purchase): PurchaseReportDetailOutput` — [purchases-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/purchases-report-output.ts#L83)
- **Propósito / descripción:** Folio is derived from the id, not stored — see `PurchasesReportRow.purchaseNumber`'s doc comment.
- **Dependencias:** `purchase.id.slice(0, 8).toUpperCase`, `purchase.id.slice`, `purchase.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-purchase-report-detail.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchase-report-detail-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-recharges-report-output-ts"></a>

### recharges-report-output.ts

- **Ruta:** [recharges-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/recharges-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/recharges-report-output.ts`, 8 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `RechargesReportSummaryOutput` (sin comentario de documentación en el código).
- **Consumidores:** [get-recharges-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-recharges-report-summary-use-case-ts)

**Interfaces, tipos y enums:**

- `interface RechargesReportSummaryOutput` (L1): sin documentación — miembros: `recordCount`, `closedCount`, `totalPurchases`, `totalSales`, `averageSale`
<a id="f-comercial-jhoel-api-src-modules-reports-application-dtos-sales-report-output-ts"></a>

### sales-report-output.ts

- **Ruta:** [sales-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/sales-report-output.ts) (`comercial-jhoel-api/src/modules/reports/application/dtos/sales-report-output.ts`, 101 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** DTO de salida (aplicación): declara `toSalesReportRowOutput`, `toSalesReportSummaryOutput`, `toSalesByProductRowOutput`, `toSaleReportDetailOutput`, `SalesReportRowOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-entities-sale-entity-ts), [sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-sales-report-repository-ts)
- **Consumidores:** [get-sale-report-detail.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sale-report-detail-use-case-ts), [get-sales-by-product-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-by-product-report-use-case-ts), [get-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-summary-use-case-ts), [get-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-use-case-ts)

**Interfaces, tipos y enums:**

- `interface SalesReportRowOutput` (L8): sin documentación — miembros: `id`, `saleNumber`, `saleDate`, `userId`, `username`, `itemCount`, `total`, `invoiceNumber`, `isVoided`
- `interface SalesReportSummaryOutput` (L26): sin documentación — miembros: `totalAmount`, `salesCount`, `unitsSold`, `averageTicket`
- `interface SalesByProductRowOutput` (L39): sin documentación — miembros: `productId`, `productName`, `sku`, `quantitySold`, `totalRevenue`
- `interface SaleReportDetailItemOutput` (L53): sin documentación — miembros: `productId`, `productName`, `sku`, `quantity`, `unitPrice`, `total`
- `interface SaleReportDetailOutput` (L62): sin documentación — miembros: `id`, `saleNumber`, `saleDate`, `userId`, `username`, `total`, `items`, `invoiceNumber`, `isVoided`, `voidedAt`, `voidedByUsername`, `voidReason`
#### Función `toSalesReportRowOutput` (L20–24)

- **Tipo:** función exportada
- **Firma:** `toSalesReportRowOutput(row: SalesReportRow): SalesReportRowOutput` — [sales-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/sales-report-output.ts#L20)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toSalesReportSummaryOutput` (L33–37)

- **Tipo:** función exportada
- **Firma:** `toSalesReportSummaryOutput(summary: SalesReportSummary): SalesReportSummaryOutput` — [sales-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/sales-report-output.ts#L33)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-summary-use-case-ts)

#### Función `toSalesByProductRowOutput` (L47–51)

- **Tipo:** función exportada
- **Firma:** `toSalesByProductRowOutput(row: SalesByProductRow): SalesByProductRowOutput` — [sales-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/sales-report-output.ts#L47)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toSaleReportDetailOutput` (L78–100)

- **Tipo:** función exportada
- **Firma:** `toSaleReportDetailOutput(sale: Sale): SaleReportDetailOutput` — [sales-report-output.ts](../../../../comercial-jhoel-api/src/modules/reports/application/dtos/sales-report-output.ts#L78)
- **Propósito / descripción:** Folio is derived from the id, not stored — see `SalesReportRow.saleNumber`'s doc comment.
- **Dependencias:** `sale.id.slice(0, 8).toUpperCase`, `sale.id.slice`, `sale.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-sale-report-detail.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sale-report-detail-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts"></a>

### export-agent-reconciliations-report-pdf.use-case.ts

- **Ruta:** [export-agent-reconciliations-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-agent-reconciliations-report-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/export-agent-reconciliations-report-pdf.use-case.ts`, 117 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing — same technique as `ExportRechargesReportPdfUseCase`, no `Date` round-trip needed for an unambiguous calendar day.
- **Depende de (archivos del proyecto):** [agent-reconciliations-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-agent-reconciliations-report-repository-ts), [invalid-date-range.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts), [report-format.util.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [agent-reconciliations-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-agent-reconciliations-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportAgentReconciliationsReportPdfInput` (L11): sin documentación — miembros: `startDate`, `endDate`, `generatedByUsername`

#### Clase `ExportAgentReconciliationsReportPdfUseCase` (L42–116)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(AGENT_RECONCILIATIONS_REPORT_REPOSITORY) repository: AgentReconciliationsReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 49–115 | `input: ExportAgentReconciliationsReportPdfInput` | `Promise<Buffer>` |

##### `ExportAgentReconciliationsReportPdfUseCase.execute`

- **Firma:** `execute(input: ExportAgentReconciliationsReportPdfInput): Promise<Buffer>` — [export-agent-reconciliations-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-agent-reconciliations-report-pdf.use-case.ts#L49) (L49–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidDateRangeError`, `Promise.all`, `this.repository.findAll`, `this.repository.getSummary`, `listResult.items.map`, `formatReconciliationDate`, `formatReportCurrency`, `buildReportPdf`, `formatReconciliationPeriodLabel`, `formatReportQuantity`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidDateRangeError()`
- **Consumidores:** [agent-reconciliations-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-agent-reconciliations-report-controller-ts)

#### Función `formatReconciliationDate` (L21–24)

- **Tipo:** función local del archivo
- **Firma:** `formatReconciliationDate(isoDate: string): string` — [export-agent-reconciliations-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-agent-reconciliations-report-pdf.use-case.ts#L21)
- **Propósito / descripción:** `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing — same technique as `ExportRechargesReportPdfUseCase`, no `Date` round-trip needed for an unambiguous calendar day.
- **Dependencias:** `isoDate.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `formatReconciliationPeriodLabel` (L26–40)

- **Tipo:** función local del archivo
- **Firma:** `formatReconciliationPeriodLabel(startDate?: string, endDate?: string): string` — [export-agent-reconciliations-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-agent-reconciliations-report-pdf.use-case.ts#L26)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `formatReconciliationDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts"></a>

### export-assets-receivables-report-pdf.use-case.ts

- **Ruta:** [export-assets-receivables-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-assets-receivables-report-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/export-assets-receivables-report-pdf.use-case.ts`, 254 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `ExportAssetsReceivablesReportPdfUseCase`, `formatRecordDate`, `formatPeriodLabel`, `reportTitle`, `ExportAssetsReceivablesReportPdfInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [list-accounts-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts), [list-assets.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-list-assets-use-case-ts), [get-assets-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-report-summary-use-case-ts), [get-accounts-receivable-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-accounts-receivable-report-summary-use-case-ts), [client.repository.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-domain-repositories-client-repository-ts), [invalid-date-range.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts), [no-report-type-selected.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-no-report-type-selected-error-ts), [report-format.util.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts), [parse-report-status.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-status-ts), [assets-receivables-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-assets-receivables-report-output-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets-receivables-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-assets-receivables-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportAssetsReceivablesReportPdfInput` (L24): sin documentación — miembros: `types`, `clientId`, `startDate`, `endDate`, `status`, `search`, `generatedByUsername`

#### Clase `ExportAssetsReceivablesReportPdfUseCase` (L79–253)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `listAssetsUseCase: ListAssetsUseCase`, `listAccountsReceivableUseCase: ListAccountsReceivableUseCase`, `getAssetsReportSummaryUseCase: GetAssetsReportSummaryUseCase`, `getAccountsReceivableReportSummaryUseCase: GetAccountsReceivableReportSummaryUseCase`, `@Inject(CLIENT_REPOSITORY) clientRepository: ClientRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 90–230 | `input: ExportAssetsReceivablesReportPdfInput` | `Promise<Buffer>` |
| `resolveFilterLines` | método private async | 232–252 | `input: ExportAssetsReceivablesReportPdfInput`, `types: AssetsReceivablesReportType[]` | `Promise<ReportPdfFilterLine[]>` |

##### `ExportAssetsReceivablesReportPdfUseCase.execute`

- **Firma:** `execute(input: ExportAssetsReceivablesReportPdfInput): Promise<Buffer>` — [export-assets-receivables-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-assets-receivables-report-pdf.use-case.ts#L90) (L90–230)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new NoReportTypeSelectedError`, `new InvalidDateRangeError`, `parseReportStatus`, `types.includes`, `Promise.all`, `this.listAssetsUseCase.execute`, `Promise.resolve`, `this.listAccountsReceivableUseCase.execute`, `this.getAssetsReportSummaryUseCase.execute`, `this.getAccountsReceivableReportSummaryUseCase.execute`, `this.resolveFilterLines`, `assetsResult.items.map`, `receivablesResult.items.map`, `merged.slice`, `limited.map`, `formatReportCurrency`, `formatRecordDate`, `formatReportQuantity`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NoReportTypeSelectedError()`, `new InvalidDateRangeError()`
- **Consumidores:** [assets-receivables-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-assets-receivables-report-controller-ts)

##### `ExportAssetsReceivablesReportPdfUseCase.resolveFilterLines`

- **Firma:** `resolveFilterLines(input: ExportAssetsReceivablesReportPdfInput, types: AssetsReceivablesReportType[]): Promise<ReportPdfFilterLine[]>` — [export-assets-receivables-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-assets-receivables-report-pdf.use-case.ts#L232) (L232–252)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `types.map((t) => TYPE_LABEL[t]).join`, `types.map`, `this.clientRepository.findById`, `lines.push`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `formatRecordDate` (L37–40)

- **Tipo:** función local del archivo
- **Firma:** `formatRecordDate(isoDate: string): string` — [export-assets-receivables-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-assets-receivables-report-pdf.use-case.ts#L37)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `isoDate.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `formatPeriodLabel` (L42–53)

- **Tipo:** función local del archivo
- **Firma:** `formatPeriodLabel(startDate?: string, endDate?: string): string` — [export-assets-receivables-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-assets-receivables-report-pdf.use-case.ts#L42)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `formatRecordDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `reportTitle` (L67–77)

- **Tipo:** función local del archivo
- **Firma:** `reportTitle(types: AssetsReceivablesReportType[]): string` — [export-assets-receivables-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-assets-receivables-report-pdf.use-case.ts#L67)
- **Propósito / descripción:** Title varies by selection, per the ticket's explicit requirement.
- **Dependencias:** `types.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts"></a>

### export-bank-deposits-report-pdf.use-case.ts

- **Ruta:** [export-bank-deposits-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-deposits-report-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-deposits-report-pdf.use-case.ts`, 193 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing, same as `formatRechargeDate` — `operationDate` is already an unambiguous calendar day, no `Date` round-trip needed.
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [transaction-bank.repository.ts](transaction-banks.md#f-comercial-jhoel-api-src-modules-transaction-banks-domain-repositories-transaction-bank-repository-ts), [transaction-type.repository.ts](transaction-types.md#f-comercial-jhoel-api-src-modules-transaction-types-domain-repositories-transaction-type-repository-ts), [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [invalid-bank-deposit-date-range.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-date-range-error-ts), [report-format.util.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-deposits-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-deposits-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportBankDepositsReportPdfInput` (L20): sin documentación — miembros: `startDate`, `endDate`, `transactionBankId`, `transactionTypeId`, `userId`, `search`, `generatedByUsername`

**Constantes exportadas:**

- `BANK_DEPOSIT_NO_DESCRIPTION_LABEL` (L35): Shown for operations registered before "Descripción / Beneficiario" existed — never an invented description. = `'Sin descripción registrada'`

#### Clase `ExportBankDepositsReportPdfUseCase` (L69–192)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`, `@Inject(TRANSACTION_BANK_REPOSITORY) transactionBankRepository: TransactionBankRepository`, `@Inject(TRANSACTION_TYPE_REPOSITORY) transactionTypeRepository: TransactionTypeRepository`, `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 82–156 | `input: ExportBankDepositsReportPdfInput` | `Promise<Buffer>` |
| `resolveFilterLines` | método private async | 159–191 | `input: ExportBankDepositsReportPdfInput` | `Promise<ReportPdfFilterLine[]>` |

##### `ExportBankDepositsReportPdfUseCase.execute`

- **Firma:** `execute(input: ExportBankDepositsReportPdfInput): Promise<Buffer>` — [export-bank-deposits-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-deposits-report-pdf.use-case.ts#L82) (L82–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidBankDepositDateRangeError`, `input.search?.trim`, `Promise.all`, `this.bankDepositRepository.findAll`, `this.bankDepositRepository.getReportSummary`, `this.resolveFilterLines`, `listResult.items.map`, `formatBankDepositDateTime`, `formatReportCurrency`, `formatReportQuantity`, `buildReportPdf`, `formatBankDepositPeriodLabel`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankDepositDateRangeError()`
- **Consumidores:** [bank-deposits-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-deposits-report-controller-ts)

##### `ExportBankDepositsReportPdfUseCase.resolveFilterLines`

- **Firma:** `resolveFilterLines(input: ExportBankDepositsReportPdfInput): Promise<ReportPdfFilterLine[]>` — [export-bank-deposits-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-deposits-report-pdf.use-case.ts#L159) (L159–191)
- **Propósito / descripción:** Resolves id filters to their display names — a PDF showing a raw UUID would be useless to a reader.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBankRepository.findById`, `lines.push`, `this.transactionTypeRepository.findById`, `input.search?.trim`, `input.search.trim`, `this.userRepository.findById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `formatBankDepositDate` (L38–41)

- **Tipo:** función local del archivo
- **Firma:** `formatBankDepositDate(isoDate: string): string` — [export-bank-deposits-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-deposits-report-pdf.use-case.ts#L38)
- **Propósito / descripción:** `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing, same as `formatRechargeDate` — `operationDate` is already an unambiguous calendar day, no `Date` round-trip needed.
- **Dependencias:** `isoDate.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `formatBankDepositDateTime` (L44–51)

- **Tipo:** función local del archivo
- **Firma:** `formatBankDepositDateTime(date: Date): string` — [export-bank-deposits-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-deposits-report-pdf.use-case.ts#L44)
- **Propósito / descripción:** `dd/MM/yyyy HH:mm` in server-local time — `createdAt` is the real instant the deposit was registered, down to the minute, unlike `operationDate` (a plain business day with no time component).
- **Dependencias:** `String(date.getDate()).padStart`, `String`, `date.getDate`, `String(date.getMonth() + 1).padStart`, `date.getMonth`, `date.getFullYear`, `String(date.getHours()).padStart`, `date.getHours`, `String(date.getMinutes()).padStart`, `date.getMinutes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `formatBankDepositPeriodLabel` (L53–67)

- **Tipo:** función local del archivo
- **Firma:** `formatBankDepositPeriodLabel(startDate?: string, endDate?: string): string` — [export-bank-deposits-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-deposits-report-pdf.use-case.ts#L53)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `formatBankDepositDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts"></a>

### export-bank-movements-report-pdf.use-case.ts

- **Ruta:** [export-bank-movements-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-movements-report-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-movements-report-pdf.use-case.ts`, 162 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Exportación PDF del historial de movimientos — reutiliza el mismo `buildReportPdf` de toda la Reportería.
- **Depende de (archivos del proyecto):** [list-bank-movements.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts), [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts), [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [report-format.util.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-movements-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-movements-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportBankMovementsReportPdfInput` (L14): sin documentación — miembros: `startDate`, `endDate`, `bankId`, `movementType`, `userId`, `generatedByUsername`

**Constantes exportadas:**

- `BANK_MOVEMENT_TYPE_LABELS` (L25) = `{ DEPOSITO: 'Depósito', RETIRO: 'Retiro', DESEMBOLSO_GENESIS: 'Desembolso Génesis', PAGO_GENESIS: 'Pago Génesi`

#### Clase `ExportBankMovementsReportPdfUseCase` (L65–161)

- **Decoradores:** `@Injectable()`
- **Propósito:** Exportación PDF del historial de movimientos — reutiliza el mismo `buildReportPdf` de toda la Reportería.
- **Dependencias inyectadas (constructor):** `listBankMovementsUseCase: ListBankMovementsUseCase`, `@Inject(BANK_REPOSITORY) bankRepository: BankRepository`, `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 75–133 | `input: ExportBankMovementsReportPdfInput` | `Promise<Buffer>` |
| `resolveFilterLines` | método private async | 135–160 | `input: ExportBankMovementsReportPdfInput` | `Promise<ReportPdfFilterLine[]>` |

##### `ExportBankMovementsReportPdfUseCase.execute`

- **Firma:** `execute(input: ExportBankMovementsReportPdfInput): Promise<Buffer>` — [export-bank-movements-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-movements-report-pdf.use-case.ts#L75) (L75–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.listBankMovementsUseCase.execute`, `this.resolveFilterLines`, `result.items.filter`, `applied.filter((item) => item.amount > 0).reduce`, `applied.filter`, `applied.filter((item) => item.amount < 0).reduce`, `result.items.map`, `formatIsoDate`, `formatSignedCurrency`, `buildReportPdf`, `formatPeriod`, `formatReportQuantity`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-movements-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-movements-report-controller-ts)

##### `ExportBankMovementsReportPdfUseCase.resolveFilterLines`

- **Firma:** `resolveFilterLines(input: ExportBankMovementsReportPdfInput): Promise<ReportPdfFilterLine[]>` — [export-bank-movements-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-movements-report-pdf.use-case.ts#L135) (L135–160)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankRepository.findById`, `lines.push`, `this.userRepository.findById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `formatSignedCurrency` (L43–49)

- **Tipo:** función local del archivo
- **Firma:** `formatSignedCurrency(amount: number): string` — [export-bank-movements-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-movements-report-pdf.use-case.ts#L43)
- **Propósito / descripción:** Conserva el signo real (−Q 5,000.00): un saldo negativo de Génesis nunca se muestra como positivo.
- **Dependencias:** `Math.abs(amount).toLocaleString`, `Math.abs`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `formatIsoDate` (L51–54)

- **Tipo:** función local del archivo
- **Firma:** `formatIsoDate(isoDate: string): string` — [export-bank-movements-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-movements-report-pdf.use-case.ts#L51)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `isoDate.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `formatPeriod` (L56–62)

- **Tipo:** función local del archivo
- **Firma:** `formatPeriod(startDate?: string, endDate?: string): string` — [export-bank-movements-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-movements-report-pdf.use-case.ts#L56)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `formatIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts"></a>

### export-bank-transfers-report-pdf.use-case.ts

- **Ruta:** [export-bank-transfers-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-transfers-report-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-transfers-report-pdf.use-case.ts`, 153 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** PDF del Reporte de Transferencias — mismo `buildReportPdf` y tope de filas que el resto de la Reportería.
- **Depende de (archivos del proyecto):** [bank.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-repository-ts), [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [report-format.util.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts), [get-bank-transfers-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-transfers-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-transfers-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportBankTransfersReportPdfInput` (L20) extends BankTransfersReportInput: sin documentación — miembros: `generatedByUsername`

#### Clase `ExportBankTransfersReportPdfUseCase` (L40–152)

- **Decoradores:** `@Injectable()`
- **Propósito:** PDF del Reporte de Transferencias — mismo `buildReportPdf` y tope de filas que el resto de la Reportería.
- **Dependencias inyectadas (constructor):** `getBankTransfersReportUseCase: GetBankTransfersReportUseCase`, `getBankTransfersReportSummaryUseCase: GetBankTransfersReportSummaryUseCase`, `@Inject(BANK_REPOSITORY) bankRepository: BankRepository`, `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 51–106 | `input: ExportBankTransfersReportPdfInput` | `Promise<Buffer>` |
| `resolveFilterLines` | método private async | 108–151 | `input: BankTransfersReportInput` | `Promise<ReportPdfFilterLine[]>` |

##### `ExportBankTransfersReportPdfUseCase.execute`

- **Firma:** `execute(input: ExportBankTransfersReportPdfInput): Promise<Buffer>` — [export-bank-transfers-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-transfers-report-pdf.use-case.ts#L51) (L51–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Promise.all`, `this.getBankTransfersReportUseCase.execute`, `this.getBankTransfersReportSummaryUseCase.execute`, `this.resolveFilterLines`, `page.items.map`, `formatIsoDate`, `formatReportCurrency`, `buildReportPdf`, `formatPeriod`, `formatReportQuantity`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-transfers-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-transfers-report-controller-ts)

##### `ExportBankTransfersReportPdfUseCase.resolveFilterLines`

- **Firma:** `resolveFilterLines(input: BankTransfersReportInput): Promise<ReportPdfFilterLine[]>` — [export-bank-transfers-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-transfers-report-pdf.use-case.ts#L108) (L108–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankRepository.findById`, `lines.push`, `accountLabel`, `this.userRepository.findById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `formatIsoDate` (L26–29)

- **Tipo:** función local del archivo
- **Firma:** `formatIsoDate(isoDate: string): string` — [export-bank-transfers-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-transfers-report-pdf.use-case.ts#L26)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `isoDate.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `formatPeriod` (L31–37)

- **Tipo:** función local del archivo
- **Firma:** `formatPeriod(startDate?: string, endDate?: string): string` — [export-bank-transfers-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-bank-transfers-report-pdf.use-case.ts#L31)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `formatIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts"></a>

### export-ice-cream-report-pdf.use-case.ts

- **Ruta:** [export-ice-cream-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-ice-cream-report-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/export-ice-cream-report-pdf.use-case.ts`, 253 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Title varies by selection, per the ticket's explicit requirement.
- **Depende de (archivos del proyecto):** [get-ice-cream-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-use-case-ts), [get-ice-cream-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-use-case-ts), [get-ice-cream-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-summary-use-case-ts), [get-ice-cream-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-summary-use-case-ts), [ice-cream.repository.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-domain-repositories-ice-cream-repository-ts), [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [no-ice-cream-movement-type-selected.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-no-ice-cream-movement-type-selected-error-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [report-format.util.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts), [ice-cream-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-report-output-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-cream-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-ice-cream-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportIceCreamReportPdfInput` (L23): sin documentación — miembros: `types`, `startDate`, `endDate`, `iceCreamId`, `userId`, `generatedByUsername`

#### Clase `ExportIceCreamReportPdfUseCase` (L53–252)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `getIceCreamSalesReportUseCase: GetIceCreamSalesReportUseCase`, `getIceCreamPurchasesReportUseCase: GetIceCreamPurchasesReportUseCase`, `getIceCreamSalesReportSummaryUseCase: GetIceCreamSalesReportSummaryUseCase`, `getIceCreamPurchasesReportSummaryUseCase: GetIceCreamPurchasesReportSummaryUseCase`, `@Inject(ICE_CREAM_REPOSITORY) iceCreamRepository: IceCreamRepository`, `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 66–220 | `input: ExportIceCreamReportPdfInput` | `Promise<Buffer>` |
| `resolveFilterLines` | método private async | 222–251 | `input: ExportIceCreamReportPdfInput`, `types: IceCreamReportType[]` | `Promise<ReportPdfFilterLine[]>` |

##### `ExportIceCreamReportPdfUseCase.execute`

- **Firma:** `execute(input: ExportIceCreamReportPdfInput): Promise<Buffer>` — [export-ice-cream-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-ice-cream-report-pdf.use-case.ts#L66) (L66–220)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new NoIceCreamMovementTypeSelectedError`, `parseReportDateRange`, `types.includes`, `Promise.all`, `this.getIceCreamSalesReportUseCase.execute`, `Promise.resolve`, `this.getIceCreamPurchasesReportUseCase.execute`, `this.getIceCreamSalesReportSummaryUseCase.execute`, `this.getIceCreamPurchasesReportSummaryUseCase.execute`, `this.resolveFilterLines`, `salesResult.items.map`, `purchasesResult.items.map`, `b.date.getTime`, `a.date.getTime`, `merged.slice`, `limited.map`, `new Date(item.date).toLocaleDateString`, `new Date`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NoIceCreamMovementTypeSelectedError()`
- **Consumidores:** [ice-cream-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-ice-cream-report-controller-ts)

##### `ExportIceCreamReportPdfUseCase.resolveFilterLines`

- **Firma:** `resolveFilterLines(input: ExportIceCreamReportPdfInput, types: IceCreamReportType[]): Promise<ReportPdfFilterLine[]>` — [export-ice-cream-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-ice-cream-report-pdf.use-case.ts#L222) (L222–251)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `types.map((t) => (t === 'sales' ? 'Ventas' : 'Compras')).join`, `types.map`, `this.iceCreamRepository.findById`, `lines.push`, `this.userRepository.findById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `reportTitle` (L41–51)

- **Tipo:** función local del archivo
- **Firma:** `reportTitle(types: IceCreamReportType[]): string` — [export-ice-cream-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-ice-cream-report-pdf.use-case.ts#L41)
- **Propósito / descripción:** Title varies by selection, per the ticket's explicit requirement.
- **Dependencias:** `types.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts"></a>

### export-purchases-report-pdf.use-case.ts

- **Ruta:** [export-purchases-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-purchases-report-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/export-purchases-report-pdf.use-case.ts`, 165 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `ExportPurchasesReportPdfUseCase`, `ExportPurchasesReportPdfInput`, `EXPORT_ROW_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-purchases-report-repository-ts), [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [supplier.repository.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-domain-repositories-supplier-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [report-format.util.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportPurchasesReportPdfInput` (L26): sin documentación — miembros: `startDate`, `endDate`, `supplierId`, `categoryId`, `businessId`, `productId`, `userId`, `generatedByUsername`

#### Clase `ExportPurchasesReportPdfUseCase` (L40–164)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASES_REPORT_REPOSITORY) purchasesReportRepository: PurchasesReportRepository`, `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`, `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`, `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(USER_REPOSITORY) userRepository: UserRepository`, `@Inject(SUPPLIER_REPOSITORY) supplierRepository: SupplierRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 57–131 | `input: ExportPurchasesReportPdfInput` | `Promise<Buffer>` |
| `resolveFilterLines` | método private async | 133–163 | `input: ExportPurchasesReportPdfInput` | `Promise<ReportPdfFilterLine[]>` |

##### `ExportPurchasesReportPdfUseCase.execute`

- **Firma:** `execute(input: ExportPurchasesReportPdfInput): Promise<Buffer>` — [export-purchases-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-purchases-report-pdf.use-case.ts#L57) (L57–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `Promise.all`, `this.purchasesReportRepository.findAll`, `this.purchasesReportRepository.getSummary`, `this.resolveFilterLines`, `listResult.items.map`, `formatReportDate`, `formatReportQuantity`, `formatReportCurrency`, `buildReportPdf`, `formatReportPeriodLabel`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts)

##### `ExportPurchasesReportPdfUseCase.resolveFilterLines`

- **Firma:** `resolveFilterLines(input: ExportPurchasesReportPdfInput): Promise<ReportPdfFilterLine[]>` — [export-purchases-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-purchases-report-pdf.use-case.ts#L133) (L133–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.supplierRepository.findById`, `lines.push`, `this.categoryRepository.findById`, `this.businessRepository.findById`, `this.productRepository.findById`, `this.userRepository.findById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts"></a>

### export-recharges-report-pdf.use-case.ts

- **Ruta:** [export-recharges-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-recharges-report-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/export-recharges-report-pdf.use-case.ts`, 157 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing — no `Date` object round-trip, avoiding any timezone-parsing risk for a value that's already an unambiguous calendar day.
- **Depende de (archivos del proyecto):** [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [recharge-type.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-type-repository-ts), [invalid-recharge-date-range.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-date-range-error-ts), [report-format.util.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-recharges-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportRechargesReportPdfInput` (L16): sin documentación — miembros: `startDate`, `endDate`, `rechargeTypeId`, `generatedByUsername`

#### Clase `ExportRechargesReportPdfUseCase` (L48–156)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) dailyBalanceRepository: RechargeDailyBalanceRepository`, `@Inject(RECHARGE_TYPE_REPOSITORY) rechargeTypeRepository: RechargeTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 57–139 | `input: ExportRechargesReportPdfInput` | `Promise<Buffer>` |
| `resolveFilterLines` | método private async | 142–155 | `input: ExportRechargesReportPdfInput` | `Promise<ReportPdfFilterLine[]>` |

##### `ExportRechargesReportPdfUseCase.execute`

- **Firma:** `execute(input: ExportRechargesReportPdfInput): Promise<Buffer>` — [export-recharges-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-recharges-report-pdf.use-case.ts#L57) (L57–139)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidRechargeDateRangeError`, `Promise.all`, `this.dailyBalanceRepository.findHistory`, `this.dailyBalanceRepository.getReportSummary`, `this.resolveFilterLines`, `listResult.items.map`, `formatRechargeDate`, `formatReportCurrency`, `buildReportPdf`, `formatRechargePeriodLabel`, `formatReportQuantity`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidRechargeDateRangeError()`
- **Consumidores:** [recharges-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-recharges-report-controller-ts)

##### `ExportRechargesReportPdfUseCase.resolveFilterLines`

- **Firma:** `resolveFilterLines(input: ExportRechargesReportPdfInput): Promise<ReportPdfFilterLine[]>` — [export-recharges-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-recharges-report-pdf.use-case.ts#L142) (L142–155)
- **Propósito / descripción:** Resolves the type id filter to its display name — a PDF showing a raw UUID would be useless to a reader.
- **Dependencias (llamadas en su cuerpo):** `this.rechargeTypeRepository.findById`, `lines.push`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `formatRechargeDate` (L27–30)

- **Tipo:** función local del archivo
- **Firma:** `formatRechargeDate(isoDate: string): string` — [export-recharges-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-recharges-report-pdf.use-case.ts#L27)
- **Propósito / descripción:** `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing — no `Date` object round-trip, avoiding any timezone-parsing risk for a value that's already an unambiguous calendar day.
- **Dependencias:** `isoDate.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `formatRechargePeriodLabel` (L32–46)

- **Tipo:** función local del archivo
- **Firma:** `formatRechargePeriodLabel(startDate?: string, endDate?: string): string` — [export-recharges-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-recharges-report-pdf.use-case.ts#L32)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `formatRechargeDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts"></a>

### export-sales-report-pdf.use-case.ts

- **Ruta:** [export-sales-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-sales-report-pdf.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/export-sales-report-pdf.use-case.ts`, 163 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `ExportSalesReportPdfUseCase`, `ExportSalesReportPdfInput`, `EXPORT_ROW_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-sales-report-repository-ts), [category.repository.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-domain-repositories-category-repository-ts), [business.repository.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-domain-repositories-business-repository-ts), [product.repository.ts](products.md#f-comercial-jhoel-api-src-modules-products-domain-repositories-product-repository-ts), [user.repository.ts](users.md#f-comercial-jhoel-api-src-modules-users-domain-repositories-user-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [report-format.util.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts), [report-pdf.builder.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface ExportSalesReportPdfInput` (L24): sin documentación — miembros: `startDate`, `endDate`, `categoryId`, `businessId`, `productId`, `userId`, `generatedByUsername`

#### Clase `ExportSalesReportPdfUseCase` (L43–162)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SALES_REPORT_REPOSITORY) salesReportRepository: SalesReportRepository`, `@Inject(CATEGORY_REPOSITORY) categoryRepository: CategoryRepository`, `@Inject(BUSINESS_REPOSITORY) businessRepository: BusinessRepository`, `@Inject(PRODUCT_REPOSITORY) productRepository: ProductRepository`, `@Inject(USER_REPOSITORY) userRepository: UserRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 58–132 | `input: ExportSalesReportPdfInput` | `Promise<Buffer>` |
| `resolveFilterLines` | método private async | 135–161 | `input: ExportSalesReportPdfInput` | `Promise<ReportPdfFilterLine[]>` |

##### `ExportSalesReportPdfUseCase.execute`

- **Firma:** `execute(input: ExportSalesReportPdfInput): Promise<Buffer>` — [export-sales-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-sales-report-pdf.use-case.ts#L58) (L58–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `Promise.all`, `this.salesReportRepository.findAll`, `this.salesReportRepository.getSummary`, `this.resolveFilterLines`, `listResult.items.map`, `formatReportDate`, `formatReportQuantity`, `formatReportCurrency`, `buildReportPdf`, `formatReportPeriodLabel`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts)

##### `ExportSalesReportPdfUseCase.resolveFilterLines`

- **Firma:** `resolveFilterLines(input: ExportSalesReportPdfInput): Promise<ReportPdfFilterLine[]>` — [export-sales-report-pdf.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-sales-report-pdf.use-case.ts#L135) (L135–161)
- **Propósito / descripción:** Resolves each filter id to its display name — a PDF showing a raw UUID would be useless to a reader.
- **Dependencias (llamadas en su cuerpo):** `this.categoryRepository.findById`, `lines.push`, `this.businessRepository.findById`, `this.productRepository.findById`, `this.userRepository.findById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-accounts-receivable-report-summary-use-case-ts"></a>

### get-accounts-receivable-report-summary.use-case.ts

- **Ruta:** [get-accounts-receivable-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-accounts-receivable-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-accounts-receivable-report-summary.use-case.ts`, 49 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** `date` is a plain DATE column on `accounts_receivable` (see the module's own migration comment), so — like Recargas' own report summary — a lexicographic `yyyy-MM-dd` string comparison is already correct; no `parseReportDateRange` start/end-of-day widening (needed for Sales'/ Purchases' `timestamptz` columns) applies here.
- **Depende de (archivos del proyecto):** [account-receivable.repository.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-domain-repositories-account-receivable-repository-ts), [invalid-date-range.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts), [accounts-receivable-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-accounts-receivable-report-output-ts), [parse-report-status.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-status-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetAccountsReceivableReportSummaryInput` (L11): sin documentación — miembros: `clientId`, `startDate`, `endDate`, `status`, `search`

#### Clase `GetAccountsReceivableReportSummaryUseCase` (L26–48)

- **Decoradores:** `@Injectable()`
- **Propósito:** `date` is a plain DATE column on `accounts_receivable` (see the module's own migration comment), so — like Recargas' own report summary — a lexicographic `yyyy-MM-dd` string comparison is already correct; no `parseReportDateRange` start/end-of-day widening (needed for Sales'/ Purchases' `timestamptz` columns) applies here.
- **Dependencias inyectadas (constructor):** `@Inject(ACCOUNT_RECEIVABLE_REPOSITORY) accountReceivableRepository: AccountReceivableRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 33–47 | `input: GetAccountsReceivableReportSummaryInput` | `Promise<AccountsReceivableReportSummaryOutput>` |

##### `GetAccountsReceivableReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetAccountsReceivableReportSummaryInput): Promise<AccountsReceivableReportSummaryOutput>` — [get-accounts-receivable-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-accounts-receivable-report-summary.use-case.ts#L33) (L33–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidDateRangeError`, `this.accountReceivableRepository.getReportSummary`, `parseReportStatus`, `input.search?.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidDateRangeError()`
- **Consumidores:** [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-summary-use-case-ts"></a>

### get-agent-reconciliations-report-summary.use-case.ts

- **Ruta:** [get-agent-reconciliations-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-agent-reconciliations-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-agent-reconciliations-report-summary.use-case.ts`, 37 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetAgentReconciliationsReportSummaryUseCase`, `GetAgentReconciliationsReportSummaryInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [agent-reconciliations-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-agent-reconciliations-report-repository-ts), [invalid-date-range.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts), [agent-reconciliations-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-agent-reconciliations-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [agent-reconciliations-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-agent-reconciliations-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetAgentReconciliationsReportSummaryInput` (L10): sin documentación — miembros: `startDate`, `endDate`

#### Clase `GetAgentReconciliationsReportSummaryUseCase` (L15–36)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(AGENT_RECONCILIATIONS_REPORT_REPOSITORY) repository: AgentReconciliationsReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 22–35 | `input: GetAgentReconciliationsReportSummaryInput` | `Promise<AgentReconciliationsReportSummaryOutput>` |

##### `GetAgentReconciliationsReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetAgentReconciliationsReportSummaryInput): Promise<AgentReconciliationsReportSummaryOutput>` — [get-agent-reconciliations-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-agent-reconciliations-report-summary.use-case.ts#L22) (L22–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidDateRangeError`, `this.repository.getSummary`, `toAgentReconciliationsReportSummaryOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidDateRangeError()`
- **Consumidores:** [agent-reconciliations-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-agent-reconciliations-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-use-case-ts"></a>

### get-agent-reconciliations-report.use-case.ts

- **Ruta:** [get-agent-reconciliations-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-agent-reconciliations-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-agent-reconciliations-report.use-case.ts`, 62 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetAgentReconciliationsReportUseCase`, `GetAgentReconciliationsReportInput`, `GetAgentReconciliationsReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [agent-reconciliations-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-agent-reconciliations-report-repository-ts), [invalid-date-range.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts), [agent-reconciliations-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-agent-reconciliations-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [agent-reconciliations-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-agent-reconciliations-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetAgentReconciliationsReportInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `page`, `limit`
- `interface GetAgentReconciliationsReportOutput` (L17): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetAgentReconciliationsReportUseCase` (L28–61)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(AGENT_RECONCILIATIONS_REPORT_REPOSITORY) repository: AgentReconciliationsReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 35–60 | `input: GetAgentReconciliationsReportInput` | `Promise<GetAgentReconciliationsReportOutput>` |

##### `GetAgentReconciliationsReportUseCase.execute`

- **Firma:** `execute(input: GetAgentReconciliationsReportInput): Promise<GetAgentReconciliationsReportOutput>` — [get-agent-reconciliations-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-agent-reconciliations-report.use-case.ts#L35) (L35–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidDateRangeError`, `Math.min`, `this.repository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidDateRangeError()`
- **Consumidores:** [agent-reconciliations-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-agent-reconciliations-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts"></a>

### get-assets-receivables-report-summary.use-case.ts

- **Ruta:** [get-assets-receivables-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-receivables-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-receivables-report-summary.use-case.ts`, 67 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Each requested type's total is always a real SQL aggregate (via `GetAssetsReportSummaryUseCase`/`GetAccountsReceivableReportSummaryUseCase`, both already backed by `getReportSummary()` — see those use cases' own doc comments) — never derived from whatever the list use case happened to paginate/cap, so the Cards are always exactly correct regardless of how the table is windowed.
- **Depende de (archivos del proyecto):** [get-assets-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-report-summary-use-case-ts), [get-accounts-receivable-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-accounts-receivable-report-summary-use-case-ts), [invalid-date-range.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts), [no-report-type-selected.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-no-report-type-selected-error-ts), [parse-report-status.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-status-ts), [assets-receivables-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-assets-receivables-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets-receivables-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-assets-receivables-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetAssetsReceivablesReportSummaryInput` (L12): sin documentación — miembros: `types`, `clientId`, `startDate`, `endDate`, `status`, `search`

#### Clase `GetAssetsReceivablesReportSummaryUseCase` (L29–66)

- **Decoradores:** `@Injectable()`
- **Propósito:** Each requested type's total is always a real SQL aggregate (via `GetAssetsReportSummaryUseCase`/`GetAccountsReceivableReportSummaryUseCase`, both already backed by `getReportSummary()` — see those use cases' own doc comments) — never derived from whatever the list use case happened to paginate/cap, so the Cards are always exactly correct regardless of how the table is windowed.
- **Dependencias inyectadas (constructor):** `getAssetsReportSummaryUseCase: GetAssetsReportSummaryUseCase`, `getAccountsReceivableReportSummaryUseCase: GetAccountsReceivableReportSummaryUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 36–65 | `input: GetAssetsReceivablesReportSummaryInput` | `Promise<AssetsReceivablesReportSummaryOutput>` |

##### `GetAssetsReceivablesReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetAssetsReceivablesReportSummaryInput): Promise<AssetsReceivablesReportSummaryOutput>` — [get-assets-receivables-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-receivables-report-summary.use-case.ts#L36) (L36–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new NoReportTypeSelectedError`, `new InvalidDateRangeError`, `types.includes`, `Promise.all`, `this.getAssetsReportSummaryUseCase.execute`, `Promise.resolve`, `this.getAccountsReceivableReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NoReportTypeSelectedError()`, `new InvalidDateRangeError()`
- **Consumidores:** [assets-receivables-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-assets-receivables-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts"></a>

### get-assets-receivables-report.use-case.ts

- **Ruta:** [get-assets-receivables-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-receivables-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-receivables-report.use-case.ts`, 182 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Orchestrates `ListAccountsReceivableUseCase`/`ListAssetsUseCase` — the exact same use cases the operational Cuentas por Cobrar/Activos screens and their own (now-removed) standalone reports already used — rather than querying either repository directly, so there is exactly one place that knows how to filter/paginate each table.
- **Depende de (archivos del proyecto):** [list-accounts-receivable.use-case.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-application-use-cases-list-accounts-receivable-use-case-ts), [list-assets.use-case.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-application-use-cases-list-assets-use-case-ts), [invalid-date-range.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts), [no-report-type-selected.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-no-report-type-selected-error-ts), [parse-report-status.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-status-ts), [assets-receivables-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-assets-receivables-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [assets-receivables-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-assets-receivables-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetAssetsReceivablesReportInput` (L15): sin documentación — miembros: `types`, `clientId`, `startDate`, `endDate`, `status`, `search`, `page`, `limit`
- `interface GetAssetsReceivablesReportOutput` (L26): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetAssetsReceivablesReportUseCase` (L53–181)

- **Decoradores:** `@Injectable()`
- **Propósito:** Orchestrates `ListAccountsReceivableUseCase`/`ListAssetsUseCase` — the exact same use cases the operational Cuentas por Cobrar/Activos screens and their own (now-removed) standalone reports already used — rather than querying either repository directly, so there is exactly one place that knows how to filter/paginate each table. When only one type is selected, this delegates straight through with real DB-level pagination (byte-identical behavior to before this ticket). When both are selected, true cross-table pagination would need a UNION query neither repository exposes; instead each type is fetched up to `PER_TYPE_FETCH_CAP` rows, tagged with `type`, merged, sorted by date desc, and paginated in memory — correct for this system's actual scale, and still bounded (never an unbounded fetch).
- **Dependencias inyectadas (constructor):** `listAccountsReceivableUseCase: ListAccountsReceivableUseCase`, `listAssetsUseCase: ListAssetsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 60–154 | `input: GetAssetsReceivablesReportInput` | `Promise<GetAssetsReceivablesReportOutput>` |
| `toRow` | método private | 156–180 | `item: { id: string; clientId: string; clientName: string; date: string; amount: number; movementType: 'CARGO' \| 'ABONO'; description: string \| null; isActive: boolean`, `type: AssetsReceivablesReportType` | `AssetsReceivablesReportRowOutput` |

##### `GetAssetsReceivablesReportUseCase.execute`

- **Firma:** `execute(input: GetAssetsReceivablesReportInput): Promise<GetAssetsReceivablesReportOutput>` — [get-assets-receivables-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-receivables-report.use-case.ts#L60) (L60–154)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new NoReportTypeSelectedError`, `new InvalidDateRangeError`, `Math.min`, `parseReportStatus`, `types.includes`, `this.listAssetsUseCase.execute`, `result.items.map`, `this.toRow`, `this.listAccountsReceivableUseCase.execute`, `Promise.all`, `assetsResult.items.map`, `receivablesResult.items.map`, `merged.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NoReportTypeSelectedError()`, `new InvalidDateRangeError()`
- **Consumidores:** [assets-receivables-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-assets-receivables-report-controller-ts)

##### `GetAssetsReceivablesReportUseCase.toRow`

- **Firma:** `toRow(item: { id: string; clientId: string; clientName: string; date: string; amount: number; movementType: 'CARGO' \| 'ABONO'; description: string \| null; isActive: boolean, type: AssetsReceivablesReportType): AssetsReceivablesReportRowOutput` — [get-assets-receivables-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-receivables-report.use-case.ts#L156) (L156–180)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-report-summary-use-case-ts"></a>

### get-assets-report-summary.use-case.ts

- **Ruta:** [get-assets-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-report-summary.use-case.ts`, 43 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** `date` is a plain DATE column on `assets` — same lexicographic-comparison reasoning as `GetAccountsReceivableReportSummaryUseCase`.
- **Depende de (archivos del proyecto):** [asset.repository.ts](assets.md#f-comercial-jhoel-api-src-modules-assets-domain-repositories-asset-repository-ts), [invalid-date-range.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts), [assets-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-assets-report-output-ts), [parse-report-status.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-status-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetAssetsReportSummaryInput` (L11): sin documentación — miembros: `clientId`, `startDate`, `endDate`, `status`, `search`

#### Clase `GetAssetsReportSummaryUseCase` (L20–42)

- **Decoradores:** `@Injectable()`
- **Propósito:** `date` is a plain DATE column on `assets` — same lexicographic-comparison reasoning as `GetAccountsReceivableReportSummaryUseCase`.
- **Dependencias inyectadas (constructor):** `@Inject(ASSET_REPOSITORY) assetRepository: AssetRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 27–41 | `input: GetAssetsReportSummaryInput` | `Promise<AssetsReportSummaryOutput>` |

##### `GetAssetsReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetAssetsReportSummaryInput): Promise<AssetsReportSummaryOutput>` — [get-assets-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-assets-report-summary.use-case.ts#L27) (L27–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidDateRangeError`, `this.assetRepository.getReportSummary`, `parseReportStatus`, `input.search?.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidDateRangeError()`
- **Consumidores:** [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-deposits-report-summary-use-case-ts"></a>

### get-bank-deposits-report-summary.use-case.ts

- **Ruta:** [get-bank-deposits-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-deposits-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-deposits-report-summary.use-case.ts`, 42 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** `operationDate` is a plain DATE column, so a lexicographic string comparison is already correct — same reasoning as `GetRechargesReportSummaryUseCase`.
- **Depende de (archivos del proyecto):** [bank-deposit.repository.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-repositories-bank-deposit-repository-ts), [invalid-bank-deposit-date-range.error.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-domain-errors-invalid-bank-deposit-date-range-error-ts), [bank-deposits-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-bank-deposits-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [bank-deposits-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-deposits-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetBankDepositsReportSummaryInput` (L7): sin documentación — miembros: `startDate`, `endDate`, `transactionBankId`, `transactionTypeId`, `userId`, `search`

#### Clase `GetBankDepositsReportSummaryUseCase` (L18–41)

- **Decoradores:** `@Injectable()`
- **Propósito:** `operationDate` is a plain DATE column, so a lexicographic string comparison is already correct — same reasoning as `GetRechargesReportSummaryUseCase`.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_DEPOSIT_REPOSITORY) bankDepositRepository: BankDepositRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–40 | `input: GetBankDepositsReportSummaryInput` | `Promise<BankDepositsReportSummaryOutput>` |

##### `GetBankDepositsReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetBankDepositsReportSummaryInput): Promise<BankDepositsReportSummaryOutput>` — [get-bank-deposits-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-deposits-report-summary.use-case.ts#L25) (L25–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidBankDepositDateRangeError`, `this.bankDepositRepository.getReportSummary`, `input.search?.trim`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankDepositDateRangeError()`
- **Consumidores:** [bank-deposits-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-deposits-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-spec-ts"></a>

### get-bank-transfers-report.use-case.spec.ts

- **Ruta:** [get-bank-transfers-report.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-transfers-report.use-case.spec.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-transfers-report.use-case.spec.ts`, 95 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Prueba unitaria: declara `mockRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-bank-transfers-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-ts), [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts)
- **Consumidores:** —
#### Función `mockRepository` (L8–21)

- **Tipo:** función local del archivo
- **Firma:** `mockRepository()` — [get-bank-transfers-report.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-transfers-report.use-case.spec.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn().mockResolvedValue`, `jest.fn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-ts"></a>

### get-bank-transfers-report.use-case.ts

- **Ruta:** [get-bank-transfers-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-transfers-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-transfers-report.use-case.ts`, 76 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Reporte de Transferencias Bancarias — listado paginado.
- **Depende de (archivos del proyecto):** [bank-movement.repository.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-repositories-bank-movement-repository-ts), [bank-movement.errors.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-errors-bank-movement-errors-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [get-bank-transfers-report.use-case.spec.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-spec-ts), [bank-transfers-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-transfers-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface BankTransfersReportInput` (L11) extends BankTransferFilters: sin documentación — miembros: `page`, `limit`

#### Clase `GetBankTransfersReportUseCase` (L42–59)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reporte de Transferencias Bancarias — listado paginado. Reutiliza el mismo `BANK_MOVEMENT_REPOSITORY.findTransfers` que la pantalla operativa de Transferencias (exportado por `BanksModule`): una sola consulta sobre el ledger, nunca una tabla ni un cálculo paralelo.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 49–58 | `input: BankTransfersReportInput` | `Promise<PaginatedBankTransfers>` |

##### `GetBankTransfersReportUseCase.execute`

- **Firma:** `execute(input: BankTransfersReportInput): Promise<PaginatedBankTransfers>` — [get-bank-transfers-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-transfers-report.use-case.ts#L49) (L49–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidRange`, `this.bankMovementRepository.findTransfers`, `toFilters`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [bank-transfers-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-transfers-report-controller-ts)


#### Clase `GetBankTransfersReportSummaryUseCase` (L62–75)

- **Decoradores:** `@Injectable()`
- **Propósito:** Totales (excluyen anuladas, que se cuentan aparte) y desglose por ruta origen → destino.
- **Dependencias inyectadas (constructor):** `@Inject(BANK_MOVEMENT_REPOSITORY) bankMovementRepository: BankMovementRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 69–74 | `input: BankTransfersReportInput` | `Promise<BankTransfersSummary>` |

##### `GetBankTransfersReportSummaryUseCase.execute`

- **Firma:** `execute(input: BankTransfersReportInput): Promise<BankTransfersSummary>` — [get-bank-transfers-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-transfers-report.use-case.ts#L69) (L69–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertValidRange`, `this.bankMovementRepository.getTransfersSummary`, `toFilters`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [bank-transfers-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-transfers-report-controller-ts)

#### Función `assertValidRange` (L18–22)

- **Tipo:** función local del archivo
- **Firma:** `assertValidRange(input: BankTransferFilters): void` — [get-bank-transfers-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-transfers-report.use-case.ts#L18)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new InvalidBankMovementDateRangeError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidBankMovementDateRangeError()`
- **Consumidores:** uso interno del archivo

#### Función `toFilters` (L24–34)

- **Tipo:** función local del archivo
- **Firma:** `toFilters(input: BankTransfersReportInput): BankTransferFilters` — [get-bank-transfers-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-bank-transfers-report.use-case.ts#L24)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-summary-use-case-ts"></a>

### get-ice-cream-purchases-report-summary.use-case.ts

- **Ruta:** [get-ice-cream-purchases-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-purchases-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-purchases-report-summary.use-case.ts`, 44 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetIceCreamPurchasesReportSummaryUseCase`, `GetIceCreamPurchasesReportSummaryInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-purchases-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [ice-cream-purchases-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-purchases-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetIceCreamPurchasesReportSummaryInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `iceCreamId`, `supplierId`, `userId`

#### Clase `GetIceCreamPurchasesReportSummaryUseCase` (L18–43)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_PURCHASES_REPORT_REPOSITORY) iceCreamPurchasesReportRepository: IceCreamPurchasesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–42 | `input: GetIceCreamPurchasesReportSummaryInput` | `Promise<IceCreamPurchasesReportSummaryOutput>` |

##### `GetIceCreamPurchasesReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetIceCreamPurchasesReportSummaryInput): Promise<IceCreamPurchasesReportSummaryOutput>` — [get-ice-cream-purchases-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-purchases-report-summary.use-case.ts#L25) (L25–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `this.iceCreamPurchasesReportRepository.getSummary`, `toIceCreamPurchasesReportSummaryOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-use-case-ts"></a>

### get-ice-cream-purchases-report.use-case.ts

- **Ruta:** [get-ice-cream-purchases-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-purchases-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-purchases-report.use-case.ts`, 71 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetIceCreamPurchasesReportUseCase`, `GetIceCreamPurchasesReportInput`, `GetIceCreamPurchasesReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-purchases-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [ice-cream-purchases-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-purchases-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetIceCreamPurchasesReportInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `iceCreamId`, `supplierId`, `userId`, `page`, `limit`
- `interface GetIceCreamPurchasesReportOutput` (L20): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetIceCreamPurchasesReportUseCase` (L31–70)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_PURCHASES_REPORT_REPOSITORY) iceCreamPurchasesReportRepository: IceCreamPurchasesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 38–69 | `input: GetIceCreamPurchasesReportInput` | `Promise<GetIceCreamPurchasesReportOutput>` |

##### `GetIceCreamPurchasesReportUseCase.execute`

- **Firma:** `execute(input: GetIceCreamPurchasesReportInput): Promise<GetIceCreamPurchasesReportOutput>` — [get-ice-cream-purchases-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-purchases-report.use-case.ts#L38) (L38–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `Math.min`, `this.iceCreamPurchasesReportRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts"></a>

### get-ice-cream-report-summary.use-case.ts

- **Ruta:** [get-ice-cream-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report-summary.use-case.ts`, 64 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Each requested type's total is always a real SQL aggregate, via the same summary use cases the two now-removed standalone reports already used — never derived from a paginated/capped list.
- **Depende de (archivos del proyecto):** [get-ice-cream-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-summary-use-case-ts), [get-ice-cream-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-summary-use-case-ts), [no-ice-cream-movement-type-selected.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-no-ice-cream-movement-type-selected-error-ts), [ice-cream-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-cream-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-ice-cream-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetIceCreamReportSummaryInput` (L10): sin documentación — miembros: `types`, `startDate`, `endDate`, `iceCreamId`, `userId`

#### Clase `GetIceCreamReportSummaryUseCase` (L19–63)

- **Decoradores:** `@Injectable()`
- **Propósito:** Each requested type's total is always a real SQL aggregate, via the same summary use cases the two now-removed standalone reports already used — never derived from a paginated/capped list.
- **Dependencias inyectadas (constructor):** `getIceCreamSalesReportSummaryUseCase: GetIceCreamSalesReportSummaryUseCase`, `getIceCreamPurchasesReportSummaryUseCase: GetIceCreamPurchasesReportSummaryUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–62 | `input: GetIceCreamReportSummaryInput` | `Promise<IceCreamReportSummaryOutput>` |

##### `GetIceCreamReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetIceCreamReportSummaryInput): Promise<IceCreamReportSummaryOutput>` — [get-ice-cream-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report-summary.use-case.ts#L26) (L26–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new NoIceCreamMovementTypeSelectedError`, `types.includes`, `Promise.all`, `this.getIceCreamSalesReportSummaryUseCase.execute`, `Promise.resolve`, `this.getIceCreamPurchasesReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NoIceCreamMovementTypeSelectedError()`
- **Consumidores:** [ice-cream-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-ice-cream-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts"></a>

### get-ice-cream-report.use-case.ts

- **Ruta:** [get-ice-cream-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report.use-case.ts`, 167 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Orchestrates `GetIceCreamSalesReportUseCase`/`GetIceCreamPurchasesReportUseCase` — the exact same use cases the two now-removed standalone reports already used — rather than querying either repository directly.
- **Depende de (archivos del proyecto):** [get-ice-cream-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-use-case-ts), [get-ice-cream-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-use-case-ts), [no-ice-cream-movement-type-selected.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-no-ice-cream-movement-type-selected-error-ts), [ice-cream-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [ice-cream-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-ice-cream-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetIceCreamReportInput` (L10): sin documentación — miembros: `types`, `startDate`, `endDate`, `iceCreamId`, `userId`, `page`, `limit`
- `interface GetIceCreamReportOutput` (L20): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetIceCreamReportUseCase` (L39–166)

- **Decoradores:** `@Injectable()`
- **Propósito:** Orchestrates `GetIceCreamSalesReportUseCase`/`GetIceCreamPurchasesReportUseCase` — the exact same use cases the two now-removed standalone reports already used — rather than querying either repository directly. Same single-type-delegates / both-types-merge-in-memory reasoning as `GetAssetsReceivablesReportUseCase` (see its own doc comment).
- **Dependencias inyectadas (constructor):** `getIceCreamSalesReportUseCase: GetIceCreamSalesReportUseCase`, `getIceCreamPurchasesReportUseCase: GetIceCreamPurchasesReportUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–126 | `input: GetIceCreamReportInput` | `Promise<GetIceCreamReportOutput>` |
| `toSaleRow` | método private | 128–140 | `item: { id: string; date: Date; product: string; sku: string; quantity: number; unitPrice: number; total: number; userId: string; username: string; }` | `IceCreamReportRowOutput` |
| `toPurchaseRow` | método private | 142–165 | `item: { id: string; date: Date; product: string; sku: string; quantity: number; costPrice: number; total: number; userId: string; username: string; }` | `IceCreamReportRowOutput` |

##### `GetIceCreamReportUseCase.execute`

- **Firma:** `execute(input: GetIceCreamReportInput): Promise<GetIceCreamReportOutput>` — [get-ice-cream-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report.use-case.ts#L46) (L46–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new NoIceCreamMovementTypeSelectedError`, `Math.min`, `types.includes`, `this.getIceCreamSalesReportUseCase.execute`, `result.items.map`, `this.toSaleRow`, `this.getIceCreamPurchasesReportUseCase.execute`, `this.toPurchaseRow`, `Promise.all`, `salesResult.items.map`, `purchasesResult.items.map`, `b.date.getTime`, `a.date.getTime`, `merged.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NoIceCreamMovementTypeSelectedError()`
- **Consumidores:** [ice-cream-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-ice-cream-report-controller-ts)

##### `GetIceCreamReportUseCase.toSaleRow`

- **Firma:** `toSaleRow(item: { id: string; date: Date; product: string; sku: string; quantity: number; unitPrice: number; total: number; userId: string; username: string; }): IceCreamReportRowOutput` — [get-ice-cream-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report.use-case.ts#L128) (L128–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `GetIceCreamReportUseCase.toPurchaseRow`

- **Firma:** `toPurchaseRow(item: { id: string; date: Date; product: string; sku: string; quantity: number; costPrice: number; total: number; userId: string; username: string; }): IceCreamReportRowOutput` — [get-ice-cream-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report.use-case.ts#L142) (L142–165)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-summary-use-case-ts"></a>

### get-ice-cream-sales-report-summary.use-case.ts

- **Ruta:** [get-ice-cream-sales-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-sales-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-sales-report-summary.use-case.ts`, 48 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetIceCreamSalesReportSummaryUseCase`, `GetIceCreamSalesReportSummaryInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [ice-cream-sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-sales-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [ice-cream-sales-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-sales-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetIceCreamSalesReportSummaryInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `iceCreamId`, `userId`, `minPrice`, `maxPrice`, `minQuantity`

#### Clase `GetIceCreamSalesReportSummaryUseCase` (L20–47)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_SALES_REPORT_REPOSITORY) iceCreamSalesReportRepository: IceCreamSalesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 27–46 | `input: GetIceCreamSalesReportSummaryInput` | `Promise<IceCreamSalesReportSummaryOutput>` |

##### `GetIceCreamSalesReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetIceCreamSalesReportSummaryInput): Promise<IceCreamSalesReportSummaryOutput>` — [get-ice-cream-sales-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-sales-report-summary.use-case.ts#L27) (L27–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `this.iceCreamSalesReportRepository.getSummary`, `toIceCreamSalesReportSummaryOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-use-case-ts"></a>

### get-ice-cream-sales-report.use-case.ts

- **Ruta:** [get-ice-cream-sales-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-sales-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-sales-report.use-case.ts`, 76 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Structural clone of `GetSalesReportUseCase` — see that use case for the pattern; `GetIceCreamPurchasesReportUseCase`/both modules' own `*ReportSummaryUseCase` are the same clone relationship to their Sales/Purchases counterparts.
- **Depende de (archivos del proyecto):** [ice-cream-sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-sales-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [ice-cream-sales-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-sales-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetIceCreamSalesReportInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `iceCreamId`, `userId`, `minPrice`, `maxPrice`, `minQuantity`, `page`, `limit`
- `interface GetIceCreamSalesReportOutput` (L22): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetIceCreamSalesReportUseCase` (L34–75)

- **Decoradores:** `@Injectable()`
- **Propósito:** Structural clone of `GetSalesReportUseCase` — see that use case for the pattern; `GetIceCreamPurchasesReportUseCase`/both modules' own `*ReportSummaryUseCase` are the same clone relationship to their Sales/Purchases counterparts.
- **Dependencias inyectadas (constructor):** `@Inject(ICE_CREAM_SALES_REPORT_REPOSITORY) iceCreamSalesReportRepository: IceCreamSalesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 41–74 | `input: GetIceCreamSalesReportInput` | `Promise<GetIceCreamSalesReportOutput>` |

##### `GetIceCreamSalesReportUseCase.execute`

- **Firma:** `execute(input: GetIceCreamSalesReportInput): Promise<GetIceCreamSalesReportOutput>` — [get-ice-cream-sales-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-sales-report.use-case.ts#L41) (L41–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `Math.min`, `this.iceCreamSalesReportRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchase-report-detail-use-case-ts"></a>

### get-purchase-report-detail.use-case.ts

- **Ruta:** [get-purchase-report-detail.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchase-report-detail.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchase-report-detail.use-case.ts`, 34 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Reuses `PurchasesModule`'s own `PURCHASE_REPOSITORY.findById` — same reasoning as `GetSaleReportDetailUseCase`: avoids re-querying rows that already have a correct, tested fetch path, and adds only the report's `purchaseNumber` folio.
- **Depende de (archivos del proyecto):** [purchase.repository.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-domain-repositories-purchase-repository-ts), [purchase-report-not-found.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-purchase-report-not-found-error-ts), [purchases-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-purchases-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `GetPurchaseReportDetailUseCase` (L18–33)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reuses `PurchasesModule`'s own `PURCHASE_REPOSITORY.findById` — same reasoning as `GetSaleReportDetailUseCase`: avoids re-querying rows that already have a correct, tested fetch path, and adds only the report's `purchaseNumber` folio. Purchases has no draft/status concept (unlike Sales), so every persisted purchase is already a completed one — no extra status check needed here.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASE_REPOSITORY) purchaseRepository: PurchaseRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–32 | `id: string` | `Promise<PurchaseReportDetailOutput>` |

##### `GetPurchaseReportDetailUseCase.execute`

- **Firma:** `execute(id: string): Promise<PurchaseReportDetailOutput>` — [get-purchase-report-detail.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchase-report-detail.use-case.ts#L25) (L25–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseRepository.findById`, `new PurchaseReportNotFoundError`, `toPurchaseReportDetailOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new PurchaseReportNotFoundError(id)`
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-by-product-report-use-case-ts"></a>

### get-purchases-by-product-report.use-case.ts

- **Ruta:** [get-purchases-by-product-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-by-product-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-by-product-report.use-case.ts`, 75 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetPurchasesByProductReportUseCase`, `GetPurchasesByProductReportInput`, `GetPurchasesByProductReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-purchases-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [purchases-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-purchases-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetPurchasesByProductReportInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `supplierId`, `categoryId`, `businessId`, `productId`, `userId`, `page`, `limit`
- `interface GetPurchasesByProductReportOutput` (L22): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetPurchasesByProductReportUseCase` (L33–74)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASES_REPORT_REPOSITORY) purchasesReportRepository: PurchasesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 40–73 | `input: GetPurchasesByProductReportInput` | `Promise<GetPurchasesByProductReportOutput>` |

##### `GetPurchasesByProductReportUseCase.execute`

- **Firma:** `execute(input: GetPurchasesByProductReportInput): Promise<GetPurchasesByProductReportOutput>` — [get-purchases-by-product-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-by-product-report.use-case.ts#L40) (L40–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `Math.min`, `this.purchasesReportRepository.getByProduct`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-summary-use-case-ts"></a>

### get-purchases-report-summary.use-case.ts

- **Ruta:** [get-purchases-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report-summary.use-case.ts`, 48 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetPurchasesReportSummaryUseCase`, `GetPurchasesReportSummaryInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-purchases-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [purchases-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-purchases-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetPurchasesReportSummaryInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `supplierId`, `categoryId`, `businessId`, `productId`, `userId`

#### Clase `GetPurchasesReportSummaryUseCase` (L20–47)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASES_REPORT_REPOSITORY) purchasesReportRepository: PurchasesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 27–46 | `input: GetPurchasesReportSummaryInput` | `Promise<PurchasesReportSummaryOutput>` |

##### `GetPurchasesReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetPurchasesReportSummaryInput): Promise<PurchasesReportSummaryOutput>` — [get-purchases-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report-summary.use-case.ts#L27) (L27–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `this.purchasesReportRepository.getSummary`, `toPurchasesReportSummaryOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-use-case-ts"></a>

### get-purchases-report.use-case.ts

- **Ruta:** [get-purchases-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report.use-case.ts`, 83 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetPurchasesReportUseCase`, `GetPurchasesReportInput`, `GetPurchasesReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-purchases-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [purchases-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-purchases-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetPurchasesReportInput` (L14): sin documentación — miembros: `startDate`, `endDate`, `supplierId`, `categoryId`, `businessId`, `productId`, `userId`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface GetPurchasesReportOutput` (L28): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetPurchasesReportUseCase` (L39–82)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(PURCHASES_REPORT_REPOSITORY) purchasesReportRepository: PurchasesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 46–81 | `input: GetPurchasesReportInput` | `Promise<GetPurchasesReportOutput>` |

##### `GetPurchasesReportUseCase.execute`

- **Firma:** `execute(input: GetPurchasesReportInput): Promise<GetPurchasesReportOutput>` — [get-purchases-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report.use-case.ts#L46) (L46–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `Math.min`, `this.purchasesReportRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-recharges-report-summary-use-case-ts"></a>

### get-recharges-report-summary.use-case.ts

- **Ruta:** [get-recharges-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-recharges-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-recharges-report-summary.use-case.ts`, 50 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Unlike the daily-summary card (`GetRechargeSalesSummaryUseCase`, scoped to one date's CURRENT cycle only), this aggregates across every cycle matching the filters — a report over a date range needs the full historical picture, not just "today".
- **Depende de (archivos del proyecto):** [recharge-daily-balance.repository.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-repositories-recharge-daily-balance-repository-ts), [invalid-recharge-date-range.error.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-domain-errors-invalid-recharge-date-range-error-ts), [recharges-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-recharges-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [recharges-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-recharges-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetRechargesReportSummaryInput` (L7): sin documentación — miembros: `startDate`, `endDate`, `rechargeTypeId`

#### Clase `GetRechargesReportSummaryUseCase` (L23–49)

- **Decoradores:** `@Injectable()`
- **Propósito:** Unlike the daily-summary card (`GetRechargeSalesSummaryUseCase`, scoped to one date's CURRENT cycle only), this aggregates across every cycle matching the filters — a report over a date range needs the full historical picture, not just "today". `date` is a plain DATE column, so (like `GetRechargeHistoryUseCase`) a lexicographic string comparison for the range check is already correct — no `parseReportDateRange` start/end-of-day widening needed the way Sales/Purchases' `timestamptz` columns require.
- **Dependencias inyectadas (constructor):** `@Inject(RECHARGE_DAILY_BALANCE_REPOSITORY) dailyBalanceRepository: RechargeDailyBalanceRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 30–48 | `input: GetRechargesReportSummaryInput` | `Promise<RechargesReportSummaryOutput>` |

##### `GetRechargesReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetRechargesReportSummaryInput): Promise<RechargesReportSummaryOutput>` — [get-recharges-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-recharges-report-summary.use-case.ts#L30) (L30–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidRechargeDateRangeError`, `this.dailyBalanceRepository.getReportSummary`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidRechargeDateRangeError()`
- **Consumidores:** [recharges-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-recharges-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sale-report-detail-use-case-ts"></a>

### get-sale-report-detail.use-case.ts

- **Ruta:** [get-sale-report-detail.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-sale-report-detail.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-sale-report-detail.use-case.ts`, 37 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Reuses `SalesModule`'s own `SALE_REPOSITORY.findById` — a full sale with every line item already exists there, tested and correct, so this only adds the report-specific `saleNumber` folio rather than re-querying the same rows a second time.
- **Depende de (archivos del proyecto):** [sale.repository.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-domain-repositories-sale-repository-ts), [sale-report-not-found.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-sale-report-not-found-error-ts), [sales-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-sales-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `GetSaleReportDetailUseCase` (L18–36)

- **Decoradores:** `@Injectable()`
- **Propósito:** Reuses `SalesModule`'s own `SALE_REPOSITORY.findById` — a full sale with every line item already exists there, tested and correct, so this only adds the report-specific `saleNumber` folio rather than re-querying the same rows a second time. Reports are admin-only (see `sales-report.controller.ts`'s guard), so there's no ownership check to apply the way `GetSaleByIdUseCase` needs for a `USER` account.
- **Dependencias inyectadas (constructor):** `@Inject(SALE_REPOSITORY) saleRepository: SaleRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 25–35 | `id: string` | `Promise<SaleReportDetailOutput>` |

##### `GetSaleReportDetailUseCase.execute`

- **Firma:** `execute(id: string): Promise<SaleReportDetailOutput>` — [get-sale-report-detail.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-sale-report-detail.use-case.ts#L25) (L25–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.findById`, `new SaleReportNotFoundError`, `toSaleReportDetailOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new SaleReportNotFoundError(id)`
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-by-product-report-use-case-ts"></a>

### get-sales-by-product-report.use-case.ts

- **Ruta:** [get-sales-by-product-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-sales-by-product-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-sales-by-product-report.use-case.ts`, 73 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetSalesByProductReportUseCase`, `GetSalesByProductReportInput`, `GetSalesByProductReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-sales-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [sales-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-sales-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetSalesByProductReportInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `categoryId`, `businessId`, `productId`, `userId`, `page`, `limit`
- `interface GetSalesByProductReportOutput` (L21): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetSalesByProductReportUseCase` (L32–72)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SALES_REPORT_REPOSITORY) salesReportRepository: SalesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 39–71 | `input: GetSalesByProductReportInput` | `Promise<GetSalesByProductReportOutput>` |

##### `GetSalesByProductReportUseCase.execute`

- **Firma:** `execute(input: GetSalesByProductReportInput): Promise<GetSalesByProductReportOutput>` — [get-sales-by-product-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-sales-by-product-report.use-case.ts#L39) (L39–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `Math.min`, `this.salesReportRepository.getByProduct`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-summary-use-case-ts"></a>

### get-sales-report-summary.use-case.ts

- **Ruta:** [get-sales-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-sales-report-summary.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-sales-report-summary.use-case.ts`, 46 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetSalesReportSummaryUseCase`, `GetSalesReportSummaryInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-sales-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [sales-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-sales-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetSalesReportSummaryInput` (L10): sin documentación — miembros: `startDate`, `endDate`, `categoryId`, `businessId`, `productId`, `userId`

#### Clase `GetSalesReportSummaryUseCase` (L19–45)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SALES_REPORT_REPOSITORY) salesReportRepository: SalesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–44 | `input: GetSalesReportSummaryInput` | `Promise<SalesReportSummaryOutput>` |

##### `GetSalesReportSummaryUseCase.execute`

- **Firma:** `execute(input: GetSalesReportSummaryInput): Promise<SalesReportSummaryOutput>` — [get-sales-report-summary.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-sales-report-summary.use-case.ts#L26) (L26–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `this.salesReportRepository.getSummary`, `toSalesReportSummaryOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-use-case-ts"></a>

### get-sales-report.use-case.ts

- **Ruta:** [get-sales-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-sales-report.use-case.ts) (`comercial-jhoel-api/src/modules/reports/application/use-cases/get-sales-report.use-case.ts`, 79 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Caso de uso: declara `GetSalesReportUseCase`, `GetSalesReportInput`, `GetSalesReportOutput`, `DEFAULT_PAGE`, `DEFAULT_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-sales-report-repository-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts), [sales-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-sales-report-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface GetSalesReportInput` (L14): sin documentación — miembros: `startDate`, `endDate`, `categoryId`, `businessId`, `productId`, `userId`, `sortBy`, `sortDirection`, `page`, `limit`
- `interface GetSalesReportOutput` (L27): sin documentación — miembros: `items`, `total`, `page`, `limit`

#### Clase `GetSalesReportUseCase` (L38–78)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(SALES_REPORT_REPOSITORY) salesReportRepository: SalesReportRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 45–77 | `input: GetSalesReportInput` | `Promise<GetSalesReportOutput>` |

##### `GetSalesReportUseCase.execute`

- **Firma:** `execute(input: GetSalesReportInput): Promise<GetSalesReportOutput>` — [get-sales-report.use-case.ts](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-sales-report.use-case.ts#L45) (L45–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parseReportDateRange`, `Math.min`, `this.salesReportRepository.findAll`, `result.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts"></a>

### parse-report-date-range.ts

- **Ruta:** [parse-report-date-range.ts](../../../../comercial-jhoel-api/src/modules/reports/application/utils/parse-report-date-range.ts) (`comercial-jhoel-api/src/modules/reports/application/utils/parse-report-date-range.ts`, 30 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Query params arrive as plain `yyyy-MM-dd` (a date picker has no time component) — `startDate` is widened to 00:00:00.000 of that day and `endDate` to 23:59:59.999, so a same-day range still captures every sale/ purchase recorded that day instead of matching nothing.
- **Depende de (archivos del proyecto):** [invalid-date-range.error.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts)
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts), [get-ice-cream-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-summary-use-case-ts), [get-ice-cream-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-use-case-ts), [get-ice-cream-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-summary-use-case-ts), [get-ice-cream-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-use-case-ts), [get-purchases-by-product-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-by-product-report-use-case-ts), [get-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-summary-use-case-ts), [get-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-use-case-ts), [get-sales-by-product-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-by-product-report-use-case-ts), [get-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-summary-use-case-ts), [get-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-use-case-ts)

**Interfaces, tipos y enums:**

- `interface ReportDateRange` (L3): sin documentación — miembros: `startDate`, `endDate`
#### Función `parseReportDateRange` (L17–29)

- **Tipo:** función exportada
- **Firma:** `parseReportDateRange(startDate?: string, endDate?: string): ReportDateRange` — [parse-report-date-range.ts](../../../../comercial-jhoel-api/src/modules/reports/application/utils/parse-report-date-range.ts#L17)
- **Propósito / descripción:** Query params arrive as plain `yyyy-MM-dd` (a date picker has no time component) — `startDate` is widened to 00:00:00.000 of that day and `endDate` to 23:59:59.999, so a same-day range still captures every sale/ purchase recorded that day instead of matching nothing. Local server time is used throughout, consistent with how `CreatePurchaseUseCase` already treats `purchaseDate` elsewhere in this codebase — no explicit UTC normalization.
- **Dependencias:** `new Date`, `start.getTime`, `end.getTime`, `new InvalidDateRangeError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidDateRangeError()`
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts), [get-ice-cream-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-summary-use-case-ts), [get-ice-cream-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-use-case-ts), [get-ice-cream-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-summary-use-case-ts), [get-ice-cream-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-use-case-ts), [get-purchases-by-product-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-by-product-report-use-case-ts), [get-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-summary-use-case-ts), [get-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-status-ts"></a>

### parse-report-status.ts

- **Ruta:** [parse-report-status.ts](../../../../comercial-jhoel-api/src/modules/reports/application/utils/parse-report-status.ts) (`comercial-jhoel-api/src/modules/reports/application/utils/parse-report-status.ts`, 15 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Maps the reports module's own `status` query convention to the `isActive` tri-state the Cuentas por Cobrar/Activos repositories expect.
- **Consumidores:** [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-accounts-receivable-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-accounts-receivable-report-summary-use-case-ts), [get-assets-receivables-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts), [get-assets-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-report-summary-use-case-ts), [assets-receivables-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-assets-receivables-report-filter-query-dto-ts)

**Interfaces, tipos y enums:**

- `type ReportStatusFilter` (L1) = `'all' \| 'active' \| 'inactive'`
#### Función `parseReportStatus` (L4–14)

- **Tipo:** función exportada
- **Firma:** `parseReportStatus(status?: ReportStatusFilter): boolean \| undefined` — [parse-report-status.ts](../../../../comercial-jhoel-api/src/modules/reports/application/utils/parse-report-status.ts#L4)
- **Propósito / descripción:** Maps the reports module's own `status` query convention to the `isActive` tri-state the Cuentas por Cobrar/Activos repositories expect.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-accounts-receivable-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-accounts-receivable-report-summary-use-case-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts), [get-assets-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-report-summary-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-application-utils-report-format-util-ts"></a>

### report-format.util.ts

- **Ruta:** [report-format.util.ts](../../../../comercial-jhoel-api/src/modules/reports/application/utils/report-format.util.ts) (`comercial-jhoel-api/src/modules/reports/application/utils/report-format.util.ts`, 41 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Utilidad: declara `formatReportDate`, `formatReportCurrency`, `formatReportQuantity`, `formatReportPeriodLabel` (sin comentario de documentación en el código).
- **Consumidores:** [export-agent-reconciliations-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [export-bank-movements-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts), [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-recharges-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts)
#### Función `formatReportDate` (L1–7)

- **Tipo:** función exportada
- **Firma:** `formatReportDate(date: Date): string` — [report-format.util.ts](../../../../comercial-jhoel-api/src/modules/reports/application/utils/report-format.util.ts#L1)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `date.toLocaleDateString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts)

#### Función `formatReportCurrency` (L17–19)

- **Tipo:** función exportada
- **Firma:** `formatReportCurrency(amount: number): string` — [report-format.util.ts](../../../../comercial-jhoel-api/src/modules/reports/application/utils/report-format.util.ts#L17)
- **Propósito / descripción:** The one money format every PDF export in this module uses (Ventas, Compras, Recargas, Heladería, Activos y Cuentas por Cobrar) — matches the frontend's own `formatCurrency` exactly (`Q 1,234.56`, comma thousands separator, always two decimals), which `` `Q ${amount.toFixed(2)}` `` did not: it printed `Q 1234.56` for any amount past a thousand, silently diverging from what the screen the PDF is meant to mirror already showed.
- **Dependencias:** `amount.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-agent-reconciliations-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-recharges-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts)

#### Función `formatReportQuantity` (L22–24)

- **Tipo:** función exportada
- **Firma:** `formatReportQuantity(value: number): string` — [report-format.util.ts](../../../../comercial-jhoel-api/src/modules/reports/application/utils/report-format.util.ts#L22)
- **Propósito / descripción:** `1500` → `"1,500"` — thousands-separated, no decimals, for integer quantities (cantidades, registros) in a PDF table/summary.
- **Dependencias:** `value.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-agent-reconciliations-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [export-bank-movements-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts), [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-recharges-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts)

#### Función `formatReportPeriodLabel` (L26–40)

- **Tipo:** función exportada
- **Firma:** `formatReportPeriodLabel(startDate?: Date, endDate?: Date): string` — [report-format.util.ts](../../../../comercial-jhoel-api/src/modules/reports/application/utils/report-format.util.ts#L26)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `formatReportDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-reports-domain-errors-invalid-date-range-error-ts"></a>

### invalid-date-range.error.ts

- **Ruta:** [invalid-date-range.error.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/errors/invalid-date-range.error.ts) (`comercial-jhoel-api/src/modules/reports/domain/errors/invalid-date-range.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Errores de dominio: declara `InvalidDateRangeError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [export-agent-reconciliations-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-accounts-receivable-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-accounts-receivable-report-summary-use-case-ts), [get-agent-reconciliations-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-summary-use-case-ts), [get-agent-reconciliations-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-use-case-ts), [get-assets-receivables-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts), [get-assets-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-report-summary-use-case-ts), [parse-report-date-range.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-date-range-ts)

#### Clase `InvalidDateRangeError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-reports-domain-errors-no-ice-cream-movement-type-selected-error-ts"></a>

### no-ice-cream-movement-type-selected.error.ts

- **Ruta:** [no-ice-cream-movement-type-selected.error.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/errors/no-ice-cream-movement-type-selected.error.ts) (`comercial-jhoel-api/src/modules/reports/domain/errors/no-ice-cream-movement-type-selected.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Errores de dominio: declara `NoIceCreamMovementTypeSelectedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [get-ice-cream-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts), [get-ice-cream-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts)

#### Clase `NoIceCreamMovementTypeSelectedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-reports-domain-errors-no-report-type-selected-error-ts"></a>

### no-report-type-selected.error.ts

- **Ruta:** [no-report-type-selected.error.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/errors/no-report-type-selected.error.ts) (`comercial-jhoel-api/src/modules/reports/domain/errors/no-report-type-selected.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Errores de dominio: declara `NoReportTypeSelectedError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [get-assets-receivables-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts)

#### Clase `NoReportTypeSelectedError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-reports-domain-errors-purchase-report-not-found-error-ts"></a>

### purchase-report-not-found.error.ts

- **Ruta:** [purchase-report-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/errors/purchase-report-not-found.error.ts) (`comercial-jhoel-api/src/modules/reports/domain/errors/purchase-report-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Errores de dominio: declara `PurchaseReportNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-purchase-report-detail.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchase-report-detail-use-case-ts)

#### Clase `PurchaseReportNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-reports-domain-errors-sale-report-not-found-error-ts"></a>

### sale-report-not-found.error.ts

- **Ruta:** [sale-report-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/errors/sale-report-not-found.error.ts) (`comercial-jhoel-api/src/modules/reports/domain/errors/sale-report-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Errores de dominio: declara `SaleReportNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-sale-report-detail.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sale-report-detail-use-case-ts)

#### Clase `SaleReportNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `id: string`
<a id="f-comercial-jhoel-api-src-modules-reports-domain-repositories-agent-reconciliations-report-repository-ts"></a>

### agent-reconciliations-report.repository.ts

- **Ruta:** [agent-reconciliations-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/repositories/agent-reconciliations-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/domain/repositories/agent-reconciliations-report.repository.ts`, 56 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `AgentReconciliationsReportFilters`, `AgentReconciliationsReportRow`, `AgentReconciliationsReportSummary`, `PaginatedAgentReconciliationsReportResult`, `AgentReconciliationsReportRepository` (sin comentario de documentación en el código).
- **Consumidores:** [agent-reconciliations-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-agent-reconciliations-report-output-ts), [export-agent-reconciliations-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts), [get-agent-reconciliations-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-summary-use-case-ts), [get-agent-reconciliations-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-use-case-ts), [typeorm-agent-reconciliations-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-agent-reconciliations-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface AgentReconciliationsReportFilters` (L5): sin documentación — miembros: `startDate`, `endDate`
- `interface AgentReconciliationsReportRow` (L17): One row per historical `agent_reconciliations` record — `date` is deliberately NOT unique here (a date can legitimately have more than one row across an admin reopen + recierre cycle, see `TypeOrmAgentReconciliationRepository`'s own doc comments), so this report must never dedupe by date or assume one row per day. — miembros: `id`, `date`, `totalCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `createdAt`, `createdByUsername`
- `interface AgentReconciliationsReportSummary` (L29): sin documentación — miembros: `recordCount`, `totalCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `totalResult`, `averageResult`
- `interface PaginatedAgentReconciliationsReportResult` (L39): sin documentación — miembros: `items`, `total`
- `interface AgentReconciliationsReportRepository` (L44): sin documentación — miembros: `findAll`, `getSummary`

**Constantes exportadas:**

- `AGENT_RECONCILIATIONS_REPORT_REPOSITORY` (L1) = `Symbol( 'AGENT_RECONCILIATIONS_REPORT_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-purchases-report-repository-ts"></a>

### ice-cream-purchases-report.repository.ts

- **Ruta:** [ice-cream-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/repositories/ice-cream-purchases-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/domain/repositories/ice-cream-purchases-report.repository.ts`, 51 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `IceCreamPurchasesReportFilters`, `IceCreamPurchasesReportRow`, `IceCreamPurchasesReportSummary`, `PaginatedReportResult`, `IceCreamPurchasesReportRepository` (sin comentario de documentación en el código).
- **Consumidores:** [ice-cream-purchases-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-purchases-report-output-ts), [get-ice-cream-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-summary-use-case-ts), [get-ice-cream-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-purchases-report-use-case-ts), [typeorm-ice-cream-purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-ice-cream-purchases-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamPurchasesReportFilters` (L5): sin documentación — miembros: `startDate`, `endDate`, `iceCreamId`, `supplierId`, `userId`
- `interface IceCreamPurchasesReportRow` (L14): One row per line item across every purchase in range — not one row per purchase — matching the flat table the report screen shows. — miembros: `id`, `purchaseId`, `date`, `supplierId`, `supplierName`, `product`, `sku`, `quantity`, `costPrice`, `total`, `userId`, `username`
- `interface IceCreamPurchasesReportSummary` (L29): sin documentación — miembros: `totalPurchased`, `totalQuantity`, `recordCount`, `averageCost`
- `interface PaginatedReportResult` (L36): sin documentación — miembros: `items`, `total`
- `interface IceCreamPurchasesReportRepository` (L41): sin documentación — miembros: `findAll`, `getSummary`

**Constantes exportadas:**

- `ICE_CREAM_PURCHASES_REPORT_REPOSITORY` (L1) = `Symbol( 'ICE_CREAM_PURCHASES_REPORT_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-sales-report-repository-ts"></a>

### ice-cream-sales-report.repository.ts

- **Ruta:** [ice-cream-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/repositories/ice-cream-sales-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/domain/repositories/ice-cream-sales-report.repository.ts`, 51 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `IceCreamSalesReportFilters`, `IceCreamSalesReportRow`, `IceCreamSalesReportSummary`, `PaginatedReportResult`, `IceCreamSalesReportRepository` (sin comentario de documentación en el código).
- **Consumidores:** [ice-cream-sales-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-sales-report-output-ts), [get-ice-cream-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-summary-use-case-ts), [get-ice-cream-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-sales-report-use-case-ts), [typeorm-ice-cream-sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-ice-cream-sales-report-repository-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface IceCreamSalesReportFilters` (L5): sin documentación — miembros: `startDate`, `endDate`, `iceCreamId`, `userId`, `minPrice`, `maxPrice`, `minQuantity`
- `interface IceCreamSalesReportRow` (L16): One row per line item across every sale in range — not one row per sale — matching the flat table the report screen shows. — miembros: `id`, `saleId`, `date`, `product`, `sku`, `quantity`, `unitPrice`, `total`, `userId`, `username`
- `interface IceCreamSalesReportSummary` (L29): sin documentación — miembros: `totalSold`, `totalQuantity`, `recordCount`, `averagePrice`
- `interface PaginatedReportResult` (L36): sin documentación — miembros: `items`, `total`
- `interface IceCreamSalesReportRepository` (L41): sin documentación — miembros: `findAll`, `getSummary`

**Constantes exportadas:**

- `ICE_CREAM_SALES_REPORT_REPOSITORY` (L1) = `Symbol( 'ICE_CREAM_SALES_REPORT_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-reports-domain-repositories-purchases-report-repository-ts"></a>

### purchases-report.repository.ts

- **Ruta:** [purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/repositories/purchases-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/domain/repositories/purchases-report.repository.ts`, 68 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `PurchasesReportFilters`, `PurchasesReportRow`, `PurchasesReportSummary`, `PurchasesByProductRow`, `PaginatedReportResult` (sin comentario de documentación en el código).
- **Consumidores:** [purchases-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-purchases-report-output-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [get-purchases-by-product-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-by-product-report-use-case-ts), [get-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-summary-use-case-ts), [get-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-use-case-ts), [typeorm-purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-purchases-report-repository-ts), [purchases-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-purchases-report-filter-query-dto-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface PurchasesReportFilters` (L8): sin documentación — miembros: `startDate`, `endDate`, `supplierId`, `categoryId`, `businessId`, `productId`, `userId`
- `interface PurchasesReportRow` (L18): sin documentación — miembros: `id`, `purchaseNumber`, `purchaseDate`, `supplierId`, `supplierName`, `userId`, `username`, `itemCount`, `total`, `invoiceNumber`, `isVoided`
- `interface PurchasesReportSummary` (L33): sin documentación — miembros: `totalAmount`, `purchasesCount`, `unitsPurchased`, `averagePurchase`
- `interface PurchasesByProductRow` (L40): sin documentación — miembros: `productId`, `productName`, `sku`, `quantityPurchased`, `totalCost`
- `interface PaginatedReportResult` (L48): sin documentación — miembros: `items`, `total`
- `interface PurchasesReportRepository` (L53): sin documentación — miembros: `findAll`, `getSummary`, `getByProduct`
- `type ReportSortField` (L5) = `'date' \| 'total'`
- `type SortDirection` (L6) = `'asc' \| 'desc'`

**Constantes exportadas:**

- `PURCHASES_REPORT_REPOSITORY` (L1) = `Symbol( 'PURCHASES_REPORT_REPOSITORY', )`
<a id="f-comercial-jhoel-api-src-modules-reports-domain-repositories-sales-report-repository-ts"></a>

### sales-report.repository.ts

- **Ruta:** [sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/domain/repositories/sales-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/domain/repositories/sales-report.repository.ts`, 73 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Shared shape across every sales-report query — `findAll`, `getSummary`, and `getByProduct` all accept the same filter set so the three numbers on screen (list, KPI tiles, product breakdown) always describe the exact same slice of data.
- **Consumidores:** [sales-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-sales-report-output-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts), [get-sales-by-product-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-by-product-report-use-case-ts), [get-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-summary-use-case-ts), [get-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-use-case-ts), [typeorm-sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-sales-report-repository-ts), [sales-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-sales-report-filter-query-dto-ts), [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

**Interfaces, tipos y enums:**

- `interface SalesReportFilters` (L14): Shared shape across every sales-report query — `findAll`, `getSummary`, and `getByProduct` all accept the same filter set so the three numbers on screen (list, KPI tiles, product breakdown) always describe the exact same slice of data. — miembros: `startDate`, `endDate`, `categoryId`, `businessId`, `productId`, `userId`
- `interface SalesReportRow` (L24): One row per sale — the "Productos" count is every line in that sale, regardless of whether a category/product filter is active (that filter only decides *which sales appear*, not which of their lines count). — miembros: `id`, `saleNumber`, `saleDate`, `userId`, `username`, `itemCount`, `total`, `invoiceNumber`, `isVoided`
- `interface SalesReportSummary` (L38): `unitsSold` DOES respect the category/product filter (unlike a row's `itemCount`) — it's a "how many units of what I filtered for" KPI, not "how many line items". — miembros: `totalAmount`, `salesCount`, `unitsSold`, `averageTicket`
- `interface SalesByProductRow` (L45): sin documentación — miembros: `productId`, `productName`, `sku`, `quantitySold`, `totalRevenue`
- `interface PaginatedReportResult` (L53): sin documentación — miembros: `items`, `total`
- `interface SalesReportRepository` (L58): sin documentación — miembros: `findAll`, `getSummary`, `getByProduct`
- `type ReportSortField` (L3) = `'date' \| 'total'`
- `type SortDirection` (L4) = `'asc' \| 'desc'`

**Constantes exportadas:**

- `SALES_REPORT_REPOSITORY` (L1) = `Symbol('SALES_REPORT_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-reports-infrastructure-pdf-report-pdf-builder-ts"></a>

### report-pdf.builder.ts

- **Ruta:** [report-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/pdf/report-pdf.builder.ts) (`comercial-jhoel-api/src/modules/reports/infrastructure/pdf/report-pdf.builder.ts`, 344 líneas)
- **Tipo:** Builder · **Capa:** Infraestructura · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** A single, generic builder shared by both the sales and purchases PDF exports — the two reports differ only in title/columns/rows, never in layout, so there's exactly one place that knows how to lay out a page, paginate a table, or number pages.
- **Depende de (archivos del proyecto):** [pdf-helpers.ts](shared.md#f-comercial-jhoel-api-src-shared-infrastructure-pdf-pdf-helpers-ts)
- **Paquetes externos:** `fs`, `path`, `pdfkit`
- **Consumidores:** [export-products-pdf.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts), [export-agent-reconciliations-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [export-bank-movements-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts), [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-recharges-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts)

**Interfaces, tipos y enums:**

- `interface ReportPdfFilterLine` (L11): sin documentación — miembros: `label`, `value`
- `interface ReportPdfSummaryTile` (L16): sin documentación — miembros: `label`, `value`
- `interface ReportPdfColumn` (L21): sin documentación — miembros: `header`, `width`, `align`, `wrap`
- `interface ReportPdfOptions` (L29): sin documentación — miembros: `reportTitle`, `periodLabel`, `filters`, `summary`, `columns`, `rows`, `generatedAt`, `generatedByUsername`, `truncationNotice`, `layout`
#### Función `buildReportPdf` (L56–87)

- **Tipo:** función exportada
- **Firma:** `buildReportPdf(options: ReportPdfOptions): Promise<Buffer>` — [report-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/pdf/report-pdf.builder.ts#L56)
- **Propósito / descripción:** A single, generic builder shared by both the sales and purchases PDF exports — the two reports differ only in title/columns/rows, never in layout, so there's exactly one place that knows how to lay out a page, paginate a table, or number pages.
- **Dependencias:** `new PDFDocument`, `doc.on`, `chunks.push`, `new Promise`, `resolve`, `Buffer.concat`, `drawHeader`, `drawFilters`, `drawSummary`, `drawTable`, `doc.moveDown(0.5).fontSize(8).fillColor('#94a3b8').text`, `doc.moveDown(0.5).fontSize(8).fillColor`, `doc.moveDown(0.5).fontSize`, `doc.moveDown`, `numberPages`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [export-products-pdf.use-case.ts](products.md#f-comercial-jhoel-api-src-modules-products-application-use-cases-export-products-pdf-use-case-ts), [export-agent-reconciliations-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [export-bank-movements-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts), [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [export-recharges-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts)

#### Función `drawHeader` (L89–152)

- **Tipo:** función local del archivo
- **Firma:** `drawHeader(doc: PDFKit.PDFDocument, options: ReportPdfOptions): void` — [report-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/pdf/report-pdf.builder.ts#L89)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `fs.existsSync`, `doc.image`, `doc.fontSize(10).fillColor('#64748b').text`, `doc.fontSize(10).fillColor`, `doc.fontSize`, `doc.fontSize(18).fillColor('#0f172a').text`, `doc.fontSize(18).fillColor`, `Math.max`, `doc.moveDown(0.3).fontSize(10).fillColor('#334155').text`, `doc.moveDown(0.3).fontSize(10).fillColor`, `doc.moveDown(0.3).fontSize`, `doc.moveDown`, `doc.fontSize(9).fillColor('#94a3b8').text`, `doc.fontSize(9).fillColor`, `formatDateTime`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawFilters` (L154–179)

- **Tipo:** función local del archivo
- **Firma:** `drawFilters(doc: PDFKit.PDFDocument, filters: ReportPdfFilterLine[]): void` — [report-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/pdf/report-pdf.builder.ts#L154)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(11).fillColor('#0f172a').text`, `doc.fontSize(11).fillColor`, `doc.fontSize`, `doc.fontSize(9).fillColor('#64748b').text`, `doc.fontSize(9).fillColor`, `doc.text`, `drawDivider`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawSummary` (L181–209)

- **Tipo:** función local del archivo
- **Firma:** `drawSummary(doc: PDFKit.PDFDocument, summary: ReportPdfSummaryTile[]): void` — [report-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/pdf/report-pdf.builder.ts#L181)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(11).fillColor('#0f172a').text`, `doc.fontSize(11).fillColor`, `doc.fontSize`, `Math.max`, `summary.forEach`, `doc.fontSize(8).fillColor('#64748b').text`, `doc.fontSize(8).fillColor`, `doc.fontSize(13).fillColor('#0f172a').text`, `doc.fontSize(13).fillColor`, `drawDivider`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `drawTable` (L211–313)

- **Tipo:** función local del archivo
- **Firma:** `drawTable(doc: PDFKit.PDFDocument, columns: ReportPdfColumn[], rows: string[][]): void` — [report-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/pdf/report-pdf.builder.ts#L211)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.moveDown`, `doc.fontSize(9).fillColor`, `doc.fontSize`, `doc.rect`, `columns.reduce`, `doc.fillColor`, `doc.text`, `doc.addPage`, `drawTableHeader`, `doc.fontSize(9).fillColor('#64748b').text`, `rows.forEach`, `Math.max`, `row.map`, `doc.heightOfString`, `ensureSpace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numberPages` (L315–343)

- **Tipo:** función local del archivo
- **Firma:** `numberPages(doc: PDFKit.PDFDocument): void` — [report-pdf.builder.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/pdf/report-pdf.builder.ts#L315)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `doc.bufferedPageRange`, `doc.switchToPage`, `doc.fontSize(8).fillColor('#94a3b8').text`, `doc.fontSize(8).fillColor`, `doc.fontSize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-agent-reconciliations-report-repository-ts"></a>

### typeorm-agent-reconciliations-report.repository.ts

- **Ruta:** [typeorm-agent-reconciliations-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-agent-reconciliations-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-agent-reconciliations-report.repository.ts`, 171 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** `agent_reconciliations.date` is a plain Postgres `DATE` column — filtering uses the same safe lexicographic string comparison `GET /recharges/history` already relies on, no `Date` object start/end-of-day widening needed, unlike Sales'/Purchases' `timestamptz` filters.
- **Depende de (archivos del proyecto):** [agent-reconciliation.orm-entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-infrastructure-persistence-agent-reconciliation-orm-entity-ts), [agent-reconciliations-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-agent-reconciliations-report-repository-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `TypeOrmAgentReconciliationsReportRepository` (L47–170)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements AgentReconciliationsReportRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(AgentReconciliationOrmEntity) repository: Repository<AgentReconciliationOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 54–108 | `filters: AgentReconciliationsReportFilters`, `page: number`, `limit: number` | `Promise< PaginatedAgentReconciliationsReportResult<AgentReconciliationsReportRow> >` |
| `getSummary` | método public async | 110–145 | `filters: AgentReconciliationsReportFilters` | `Promise<AgentReconciliationsReportSummary>` |
| `baseQuery` | método private | 147–169 | `filters: AgentReconciliationsReportFilters` | `SelectQueryBuilder<AgentReconciliationOrmEntity>` |

##### `TypeOrmAgentReconciliationsReportRepository.findAll`

- **Firma:** `findAll(filters: AgentReconciliationsReportFilters, page: number, limit: number): Promise< PaginatedAgentReconciliationsReportResult<AgentReconciliationsReportRow> >` — [typeorm-agent-reconciliations-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-agent-reconciliations-report.repository.ts#L54) (L54–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `qb.clone().getCount`, `qb.clone`, `qb.select('reconciliation.id', 'id').addSelect('reconciliation.date', 'date').addSelect`, `qb.select('reconciliation.id', 'id').addSelect`, `qb.select`, `qb.getRawMany`, `rows.map`, `normalizeDateString`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAgentReconciliationsReportRepository.getSummary`

- **Firma:** `getSummary(filters: AgentReconciliationsReportFilters): Promise<AgentReconciliationsReportSummary>` — [typeorm-agent-reconciliations-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-agent-reconciliations-report.repository.ts#L110) (L110–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `qb.select('COUNT(reconciliation.id)', 'recordCount').addSelect`, `qb.select`, `qb.getRawOne`, `parseInt`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmAgentReconciliationsReportRepository.baseQuery`

- **Firma:** `baseQuery(filters: AgentReconciliationsReportFilters): SelectQueryBuilder<AgentReconciliationOrmEntity>` — [typeorm-agent-reconciliations-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-agent-reconciliations-report.repository.ts#L147) (L147–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('reconciliation').innerJoin`, `this.repository.createQueryBuilder`, `qb.andWhere`
- **Efectos secundarios:** Tablas en su SQL: `day_openings`
- **Consumidores:** (mismo archivo)

#### Función `normalizeDateString` (L37–45)

- **Tipo:** función local del archivo
- **Firma:** `normalizeDateString(value: string \| Date): string` — [typeorm-agent-reconciliations-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-agent-reconciliations-report.repository.ts#L37)
- **Propósito / descripción:** `agent_reconciliations.date` is a plain Postgres `DATE` column — filtering uses the same safe lexicographic string comparison `GET /recharges/history` already relies on, no `Date` object start/end-of-day widening needed, unlike Sales'/Purchases' `timestamptz` filters. IMPORTANT: that "hydrates as a string" behavior only holds for TypeORM's own entity-level `find`/`findOne` hydration (which applies the `date` columntype's string coercion). `getRawMany()`/`getRawOne()` (used throughout this repository) bypass that entirely — the raw `pg` driver's own type parser for a `DATE` column returns a JS `Date` object instead (constructed in local time, e.g. `new Date(y, m-1, d)`), not a string. `normal
- **Dependencias:** `value.getFullYear`, `String(value.getMonth() + 1).padStart`, `String`, `value.getMonth`, `String(value.getDate()).padStart`, `value.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-ice-cream-purchases-report-repository-ts"></a>

### typeorm-ice-cream-purchases-report.repository.ts

- **Ruta:** [typeorm-ice-cream-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-purchases-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-purchases-report.repository.ts`, 144 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Structural clone of `TypeOrmIceCreamSalesReportRepository` — see that repository's own doc comment for why this is deliberately rooted on the detail (line-item) table rather than the purchase header.
- **Depende de (archivos del proyecto):** [ice-cream-purchase-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-purchase-detail-orm-entity-ts), [ice-cream-purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-purchases-report-repository-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `TypeOrmIceCreamPurchasesReportRepository` (L14–143)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements IceCreamPurchasesReportRepository
- **Propósito:** Structural clone of `TypeOrmIceCreamSalesReportRepository` — see that repository's own doc comment for why this is deliberately rooted on the detail (line-item) table rather than the purchase header.
- **Dependencias inyectadas (constructor):** `@InjectRepository(IceCreamPurchaseDetailOrmEntity) detailRepository: Repository<IceCreamPurchaseDetailOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 21–79 | `filters: IceCreamPurchasesReportFilters`, `page: number`, `limit: number` | `Promise<PaginatedReportResult<IceCreamPurchasesReportRow>>` |
| `getSummary` | método public async | 81–105 | `filters: IceCreamPurchasesReportFilters` | `Promise<IceCreamPurchasesReportSummary>` |
| `baseQuery` | método private | 107–142 | `filters: IceCreamPurchasesReportFilters` | `SelectQueryBuilder<IceCreamPurchaseDetailOrmEntity>` |

##### `TypeOrmIceCreamPurchasesReportRepository.findAll`

- **Firma:** `findAll(filters: IceCreamPurchasesReportFilters, page: number, limit: number): Promise<PaginatedReportResult<IceCreamPurchasesReportRow>>` — [typeorm-ice-cream-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-purchases-report.repository.ts#L21) (L21–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `qb.clone().getCount`, `qb.clone`, `qb.select('detail.id', 'id').addSelect('detail.purchaseId', 'purchaseId').addSelect`, `qb.select('detail.id', 'id').addSelect`, `qb.select`, `qb.getRawMany`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamPurchasesReportRepository.getSummary`

- **Firma:** `getSummary(filters: IceCreamPurchasesReportFilters): Promise<IceCreamPurchasesReportSummary>` — [typeorm-ice-cream-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-purchases-report.repository.ts#L81) (L81–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `qb.select('COALESCE(SUM(detail.subtotal), 0)', 'totalPurchased').addSelect`, `qb.select`, `qb.getRawOne`, `parseFloat`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamPurchasesReportRepository.baseQuery`

- **Firma:** `baseQuery(filters: IceCreamPurchasesReportFilters): SelectQueryBuilder<IceCreamPurchaseDetailOrmEntity>` — [typeorm-ice-cream-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-purchases-report.repository.ts#L107) (L107–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailRepository.createQueryBuilder('detail').innerJoin`, `this.detailRepository.createQueryBuilder`, `qb.andWhere`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-ice-cream-sales-report-repository-ts"></a>

### typeorm-ice-cream-sales-report.repository.ts

- **Ruta:** [typeorm-ice-cream-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-sales-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-sales-report.repository.ts`, 153 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Deliberately rooted on `IceCreamSaleDetailOrmEntity` (one row per line item sold), unlike `TypeOrmSalesReportRepository` (rooted on the sale header, one row per sale, specifically to avoid a `sale.items` join fanning out the row count/pagination — see that repository's own doc comment).
- **Depende de (archivos del proyecto):** [ice-cream-sale-detail.orm-entity.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-infrastructure-persistence-ice-cream-sale-detail-orm-entity-ts), [ice-cream-sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-ice-cream-sales-report-repository-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `TypeOrmIceCreamSalesReportRepository` (L22–152)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements IceCreamSalesReportRepository
- **Propósito:** Deliberately rooted on `IceCreamSaleDetailOrmEntity` (one row per line item sold), unlike `TypeOrmSalesReportRepository` (rooted on the sale header, one row per sale, specifically to avoid a `sale.items` join fanning out the row count/pagination — see that repository's own doc comment). This report's own ticket asked for one row per product movement, not per sale, so there's no fan-out to guard against here — `detail` already is the row granularity this report wants.
- **Dependencias inyectadas (constructor):** `@InjectRepository(IceCreamSaleDetailOrmEntity) detailRepository: Repository<IceCreamSaleDetailOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 29–81 | `filters: IceCreamSalesReportFilters`, `page: number`, `limit: number` | `Promise<PaginatedReportResult<IceCreamSalesReportRow>>` |
| `getSummary` | método public async | 83–107 | `filters: IceCreamSalesReportFilters` | `Promise<IceCreamSalesReportSummary>` |
| `baseQuery` | método private | 109–151 | `filters: IceCreamSalesReportFilters` | `SelectQueryBuilder<IceCreamSaleDetailOrmEntity>` |

##### `TypeOrmIceCreamSalesReportRepository.findAll`

- **Firma:** `findAll(filters: IceCreamSalesReportFilters, page: number, limit: number): Promise<PaginatedReportResult<IceCreamSalesReportRow>>` — [typeorm-ice-cream-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-sales-report.repository.ts#L29) (L29–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `qb.clone().getCount`, `qb.clone`, `qb.select('detail.id', 'id').addSelect('detail.saleId', 'saleId').addSelect`, `qb.select('detail.id', 'id').addSelect`, `qb.select`, `qb.getRawMany`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamSalesReportRepository.getSummary`

- **Firma:** `getSummary(filters: IceCreamSalesReportFilters): Promise<IceCreamSalesReportSummary>` — [typeorm-ice-cream-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-sales-report.repository.ts#L83) (L83–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.baseQuery`, `qb.select('COALESCE(SUM(detail.total), 0)', 'totalSold').addSelect`, `qb.select`, `qb.getRawOne`, `parseFloat`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmIceCreamSalesReportRepository.baseQuery`

- **Firma:** `baseQuery(filters: IceCreamSalesReportFilters): SelectQueryBuilder<IceCreamSaleDetailOrmEntity>` — [typeorm-ice-cream-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-ice-cream-sales-report.repository.ts#L109) (L109–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.detailRepository.createQueryBuilder('detail').innerJoin`, `this.detailRepository.createQueryBuilder`, `qb.andWhere`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-purchases-report-repository-ts"></a>

### typeorm-purchases-report.repository.ts

- **Ruta:** [typeorm-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts`, 288 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmPurchasesReportRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts), [purchase-detail.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-detail-orm-entity-ts), [purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-purchases-report-repository-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `TypeOrmPurchasesReportRepository` (L22–287)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements PurchasesReportRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(PurchaseOrmEntity) purchaseRepository: Repository<PurchaseOrmEntity>`, `@InjectRepository(PurchaseDetailOrmEntity) purchaseDetailRepository: Repository<PurchaseDetailOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 31–102 | `filters: PurchasesReportFilters`, `page: number`, `limit: number`, `sortBy: ReportSortField`, `sortDirection: SortDirection` | `Promise<PaginatedReportResult<PurchasesReportRow>>` |
| `getSummary` | método public async | 104–145 | `filters: PurchasesReportFilters` | `Promise<PurchasesReportSummary>` |
| `getByProduct` | método public async | 147–198 | `filters: PurchasesReportFilters`, `page: number`, `limit: number` | `Promise<PaginatedReportResult<PurchasesByProductRow>>` |
| `applyDateUserSupplierFilters` | método private | 201–226 | `qb: SelectQueryBuilder<any>`, `filters: PurchasesReportFilters`, `purchaseAlias?` | `void` |
| `applyProductExistsFilter` | método private | 229–262 | `qb: SelectQueryBuilder<any>`, `filters: PurchasesReportFilters`, `purchaseAlias?` | `void` |
| `applyProductFilters` | método private | 265–286 | `qb: SelectQueryBuilder<PurchaseDetailOrmEntity>`, `filters: PurchasesReportFilters`, `detailAlias: string`, `productAlias: string` | `void` |

##### `TypeOrmPurchasesReportRepository.findAll`

- **Firma:** `findAll(filters: PurchasesReportFilters, page: number, limit: number, sortBy: ReportSortField, sortDirection: SortDirection): Promise<PaginatedReportResult<PurchasesReportRow>>` — [typeorm-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts#L31) (L31–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseRepository.createQueryBuilder('purchase').leftJoin`, `this.purchaseRepository.createQueryBuilder`, `this.applyDateUserSupplierFilters`, `this.applyProductExistsFilter`, `qb.clone().getCount`, `qb.clone`, `qb.select('purchase.id', 'id').addSelect`, `qb.select`, `subQb.select('COUNT(*)', 'count').from(PurchaseDetailOrmEntity, 'pd').where`, `subQb.select('COUNT(*)', 'count').from`, `subQb.select`, `qb.getRawMany`, `rows.map`, `row.id.slice(0, 8).toUpperCase`, `row.id.slice`, `parseInt`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPurchasesReportRepository.getSummary`

- **Firma:** `getSummary(filters: PurchasesReportFilters): Promise<PurchasesReportSummary>` — [typeorm-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts#L104) (L104–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseRepository.createQueryBuilder('purchase').where`, `this.purchaseRepository.createQueryBuilder`, `this.applyDateUserSupplierFilters`, `this.applyProductExistsFilter`, `purchasesQb.select('COALESCE(SUM(purchase.total), 0)', 'totalAmount').addSelect`, `purchasesQb.select`, `purchasesQb.getRawOne`, `this.purchaseDetailRepository.createQueryBuilder('detail').innerJoin`, `this.purchaseDetailRepository.createQueryBuilder`, `this.applyProductFilters`, `detailsQb.select`, `detailsQb.getRawOne`, `parseFloat`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPurchasesReportRepository.getByProduct`

- **Firma:** `getByProduct(filters: PurchasesReportFilters, page: number, limit: number): Promise<PaginatedReportResult<PurchasesByProductRow>>` — [typeorm-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts#L147) (L147–198)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseDetailRepository.createQueryBuilder('detail').innerJoin`, `this.purchaseDetailRepository.createQueryBuilder`, `this.applyDateUserSupplierFilters`, `this.applyProductFilters`, `baseQb.clone().select`, `baseQb.clone`, `countQb.getRawOne`, `parseInt`, `baseQb.clone().select('product.id', 'productId').addSelect`, `rowsQb.getRawMany`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmPurchasesReportRepository.applyDateUserSupplierFilters`

- **Firma:** `applyDateUserSupplierFilters(qb: SelectQueryBuilder<any>, filters: PurchasesReportFilters, purchaseAlias?): void` — [typeorm-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts#L201) (L201–226)
- **Propósito / descripción:** Date range + user + supplier equality — applies cleanly whether `qb` is rooted on `purchases` or already joined out to `purchase_details`/`products`.
- **Dependencias (llamadas en su cuerpo):** `qb.andWhere`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmPurchasesReportRepository.applyProductExistsFilter`

- **Firma:** `applyProductExistsFilter(qb: SelectQueryBuilder<any>, filters: PurchasesReportFilters, purchaseAlias?): void` — [typeorm-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts#L229) (L229–262)
- **Propósito / descripción:** Same "at least one matching line" EXISTS approach as the sales report's `findAll`/`getSummary` — keeps a query rooted on `purchases` from fanning out.
- **Dependencias (llamadas en su cuerpo):** `qb.andWhere`, `subQb.subQuery().select('1').from(PurchaseDetailOrmEntity, 'pd').innerJoin`, `subQb.subQuery().select('1').from`, `subQb.subQuery().select`, `subQb.subQuery`, `sub.andWhere`, `sub.getQuery`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmPurchasesReportRepository.applyProductFilters`

- **Firma:** `applyProductFilters(qb: SelectQueryBuilder<PurchaseDetailOrmEntity>, filters: PurchasesReportFilters, detailAlias: string, productAlias: string): void` — [typeorm-purchases-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts#L265) (L265–286)
- **Propósito / descripción:** Direct equality filters for a query already joined to `purchase_details`/`products` — used by `getSummary`/`getByProduct`.
- **Dependencias (llamadas en su cuerpo):** `qb.andWhere`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-reports-infrastructure-persistence-typeorm-sales-report-repository-ts"></a>

### typeorm-sales-report.repository.ts

- **Ruta:** [typeorm-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-sales-report.repository.ts) (`comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-sales-report.repository.ts`, 295 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmSalesReportRepository`, `SORT_COLUMN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts), [sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-sales-report-repository-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `TypeOrmSalesReportRepository` (L22–294)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements SalesReportRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(SaleOrmEntity) saleRepository: Repository<SaleOrmEntity>`, `@InjectRepository(SaleDetailOrmEntity) saleDetailRepository: Repository<SaleDetailOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 31–100 | `filters: SalesReportFilters`, `page: number`, `limit: number`, `sortBy: ReportSortField`, `sortDirection: SortDirection` | `Promise<PaginatedReportResult<SalesReportRow>>` |
| `getSummary` | método public async | 102–143 | `filters: SalesReportFilters` | `Promise<SalesReportSummary>` |
| `getByProduct` | método public async | 145–197 | `filters: SalesReportFilters`, `page: number`, `limit: number` | `Promise<PaginatedReportResult<SalesByProductRow>>` |
| `applyDateUserFilters` | método private | 200–218 | `qb: SelectQueryBuilder<any>`, `filters: SalesReportFilters`, `saleAlias?` | `void` |
| `applyProductExistsFilter` | método private | 229–267 | `qb: SelectQueryBuilder<any>`, `filters: SalesReportFilters`, `saleAlias?` | `void` |
| `applyProductFilters` | método private | 270–293 | `qb: SelectQueryBuilder<SaleDetailOrmEntity>`, `filters: SalesReportFilters`, `detailAlias: string`, `productAlias: string` | `void` |

##### `TypeOrmSalesReportRepository.findAll`

- **Firma:** `findAll(filters: SalesReportFilters, page: number, limit: number, sortBy: ReportSortField, sortDirection: SortDirection): Promise<PaginatedReportResult<SalesReportRow>>` — [typeorm-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-sales-report.repository.ts#L31) (L31–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.createQueryBuilder('sale').leftJoin('sale.user', 'user').where`, `this.saleRepository.createQueryBuilder('sale').leftJoin`, `this.saleRepository.createQueryBuilder`, `this.applyDateUserFilters`, `this.applyProductExistsFilter`, `qb.clone().getCount`, `qb.clone`, `qb.select('sale.id', 'id').addSelect('sale.saleDate', 'saleDate').addSelect`, `qb.select('sale.id', 'id').addSelect`, `qb.select`, `subQb.select('COUNT(*)', 'count').from(SaleDetailOrmEntity, 'sd').where`, `subQb.select('COUNT(*)', 'count').from`, `subQb.select`, `qb.getRawMany`, `rows.map`, `row.id.slice(0, 8).toUpperCase`, `row.id.slice`, `parseInt`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSalesReportRepository.getSummary`

- **Firma:** `getSummary(filters: SalesReportFilters): Promise<SalesReportSummary>` — [typeorm-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-sales-report.repository.ts#L102) (L102–143)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleRepository.createQueryBuilder('sale').where`, `this.saleRepository.createQueryBuilder`, `this.applyDateUserFilters`, `this.applyProductExistsFilter`, `salesQb.select('COALESCE(SUM(sale.total), 0)', 'totalAmount').addSelect`, `salesQb.select`, `salesQb.getRawOne`, `this.saleDetailRepository.createQueryBuilder('detail').innerJoin`, `this.saleDetailRepository.createQueryBuilder`, `this.applyProductFilters`, `detailsQb.select`, `detailsQb.getRawOne`, `parseFloat`, `parseInt`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSalesReportRepository.getByProduct`

- **Firma:** `getByProduct(filters: SalesReportFilters, page: number, limit: number): Promise<PaginatedReportResult<SalesByProductRow>>` — [typeorm-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-sales-report.repository.ts#L145) (L145–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.saleDetailRepository.createQueryBuilder('detail').innerJoin`, `this.saleDetailRepository.createQueryBuilder`, `this.applyDateUserFilters`, `this.applyProductFilters`, `baseQb.clone().select`, `baseQb.clone`, `countQb.getRawOne`, `parseInt`, `baseQb.clone().select('product.id', 'productId').addSelect`, `rowsQb.getRawMany`, `rows.map`, `parseFloat`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmSalesReportRepository.applyDateUserFilters`

- **Firma:** `applyDateUserFilters(qb: SelectQueryBuilder<any>, filters: SalesReportFilters, saleAlias?): void` — [typeorm-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-sales-report.repository.ts#L200) (L200–218)
- **Propósito / descripción:** Date range + user equality — applies cleanly whether `qb` is rooted on `sales` or already joined out to `sale_details`/`products`.
- **Dependencias (llamadas en su cuerpo):** `qb.andWhere`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmSalesReportRepository.applyProductExistsFilter`

- **Firma:** `applyProductExistsFilter(qb: SelectQueryBuilder<any>, filters: SalesReportFilters, saleAlias?): void` — [typeorm-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-sales-report.repository.ts#L229) (L229–267)
- **Propósito / descripción:** "This sale has at least one line matching the category/product filter" — an `EXISTS` subquery, not a join, specifically so it can run against a query rooted on `sales` (`findAll`, `getSummary`'s total/count half) without fanning that query out to one row per matching line. Callers that are *already* joined to `sale_details`/`products` (`getSummary`'s units-sold half, `getByProduct`) use `applyProductFilters` instead — a plain equality check against the join that's already there.
- **Dependencias (llamadas en su cuerpo):** `qb.andWhere`, `subQb.subQuery().select('1').from(SaleDetailOrmEntity, 'sd').innerJoin`, `subQb.subQuery().select('1').from`, `subQb.subQuery().select`, `subQb.subQuery`, `sub.andWhere`, `sub.getQuery`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmSalesReportRepository.applyProductFilters`

- **Firma:** `applyProductFilters(qb: SelectQueryBuilder<SaleDetailOrmEntity>, filters: SalesReportFilters, detailAlias: string, productAlias: string): void` — [typeorm-sales-report.repository.ts](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-sales-report.repository.ts#L270) (L270–293)
- **Propósito / descripción:** Direct equality filters for a query already joined to `sale_details`/`products` — used by `getSummary`/`getByProduct`, which need the filter applied to the matching line itself, not via EXISTS.
- **Dependencias (llamadas en su cuerpo):** `qb.andWhere`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-controllers-agent-reconciliations-report-controller-ts"></a>

### agent-reconciliations-report.controller.ts

- **Ruta:** [agent-reconciliations-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/agent-reconciliations-report.controller.ts) (`comercial-jhoel-api/src/modules/reports/presentation/controllers/agent-reconciliations-report.controller.ts`, 63 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Structural clone of `RechargesReportController` — a management view, not an operational one: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `AgentReconciliationsController`/`BanksController`, which leave the daily cuadre operation open to any authenticated account.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-agent-reconciliations-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-use-case-ts), [get-agent-reconciliations-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-agent-reconciliations-report-summary-use-case-ts), [export-agent-reconciliations-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-agent-reconciliations-report-pdf-use-case-ts), [agent-reconciliations-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-agent-reconciliations-report-filter-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `AgentReconciliationsReportController` (L19–62)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('reports/agent-reconciliations')`
- **Propósito:** Structural clone of `RechargesReportController` — a management view, not an operational one: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `AgentReconciliationsController`/`BanksController`, which leave the daily cuadre operation open to any authenticated account. A `USER` token gets a real `403` here, not just a hidden sidebar entry.
- **Dependencias inyectadas (constructor):** `getAgentReconciliationsReportUseCase: GetAgentReconciliationsReportUseCase`, `getAgentReconciliationsReportSummaryUseCase: GetAgentReconciliationsReportSummaryUseCase`, `exportAgentReconciliationsReportPdfUseCase: ExportAgentReconciliationsReportPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 29–32 | `query: AgentReconciliationsReportFilterQueryDto` | (inferido) |
| `getSummary` | método public | 34–37 | `query: AgentReconciliationsReportFilterQueryDto` | (inferido) |
| `export` | método public async | 44–61 | `query: AgentReconciliationsReportFilterQueryDto`, `username: string`, `res: Response` | `Promise<void>` |

##### `AgentReconciliationsReportController.findAll`

- **Firma:** `findAll(query: AgentReconciliationsReportFilterQueryDto)` — [agent-reconciliations-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/agent-reconciliations-report.controller.ts#L29) (L29–32)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getAgentReconciliationsReportUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliationsReportController.getSummary`

- **Firma:** `getSummary(query: AgentReconciliationsReportFilterQueryDto)` — [agent-reconciliations-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/agent-reconciliations-report.controller.ts#L34) (L34–37)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getAgentReconciliationsReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AgentReconciliationsReportController.export`

- **Firma:** `export(query: AgentReconciliationsReportFilterQueryDto, username: string, res: Response): Promise<void>` — [agent-reconciliations-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/agent-reconciliations-report.controller.ts#L44) (L44–61)
- **Decoradores:** `@Get('export')`
- **Propósito / descripción:** Uses `@Res()` (not `{ passthrough: true }`) so the PDF `Buffer` is sent directly, bypassing the global `ResponseInterceptor` — same reasoning as every other export route in this module.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportAgentReconciliationsReportPdfUseCase.execute`, `res.set`, `Date.now`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-controllers-assets-receivables-report-controller-ts"></a>

### assets-receivables-report.controller.ts

- **Ruta:** [assets-receivables-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/assets-receivables-report.controller.ts) (`comercial-jhoel-api/src/modules/reports/presentation/controllers/assets-receivables-report.controller.ts`, 67 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Replaces the two former standalone controllers (`AccountsReceivableReportController`/`AssetsReportController`, both removed) with a single unified one — the checkbox-selected `types` query param decides whether one or both tables are queried, per the ticket's explicit consolidation requirement.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-assets-receivables-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-use-case-ts), [get-assets-receivables-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-assets-receivables-report-summary-use-case-ts), [export-assets-receivables-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-assets-receivables-report-pdf-use-case-ts), [assets-receivables-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-assets-receivables-report-filter-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `AssetsReceivablesReportController` (L28–66)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('reports/assets-receivables')`
- **Propósito:** Replaces the two former standalone controllers (`AccountsReceivableReportController`/`AssetsReportController`, both removed) with a single unified one — the checkbox-selected `types` query param decides whether one or both tables are queried, per the ticket's explicit consolidation requirement. Same admin-only policy as every other report controller in this module.
- **Dependencias inyectadas (constructor):** `getAssetsReceivablesReportUseCase: GetAssetsReceivablesReportUseCase`, `getAssetsReceivablesReportSummaryUseCase: GetAssetsReceivablesReportSummaryUseCase`, `exportAssetsReceivablesReportPdfUseCase: ExportAssetsReceivablesReportPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 38–41 | `query: AssetsReceivablesReportFilterQueryDto` | (inferido) |
| `getSummary` | método public | 43–46 | `query: AssetsReceivablesReportFilterQueryDto` | (inferido) |
| `export` | método public async | 49–65 | `query: AssetsReceivablesReportFilterQueryDto`, `username: string`, `res: Response` | `Promise<void>` |

##### `AssetsReceivablesReportController.findAll`

- **Firma:** `findAll(query: AssetsReceivablesReportFilterQueryDto)` — [assets-receivables-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/assets-receivables-report.controller.ts#L38) (L38–41)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getAssetsReceivablesReportUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsReceivablesReportController.getSummary`

- **Firma:** `getSummary(query: AssetsReceivablesReportFilterQueryDto)` — [assets-receivables-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/assets-receivables-report.controller.ts#L43) (L43–46)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getAssetsReceivablesReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetsReceivablesReportController.export`

- **Firma:** `export(query: AssetsReceivablesReportFilterQueryDto, username: string, res: Response): Promise<void>` — [assets-receivables-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/assets-receivables-report.controller.ts#L49) (L49–65)
- **Decoradores:** `@Get('export')`
- **Propósito / descripción:** Uses `@Res()` — see `SalesReportController.export`'s doc comment for why.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportAssetsReceivablesReportPdfUseCase.execute`, `res.set`, `buildExportFilename`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `buildExportFilename` (L12–18)

- **Tipo:** función local del archivo
- **Firma:** `buildExportFilename(startDate?: string, endDate?: string): string` — [assets-receivables-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/assets-receivables-report.controller.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date().toISOString().slice`, `new Date().toISOString`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-deposits-report-controller-ts"></a>

### bank-deposits-report.controller.ts

- **Ruta:** [bank-deposits-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-deposits-report.controller.ts) (`comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-deposits-report.controller.ts`, 68 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Reportería is a management view, not an operational one — same rule as `RechargesReportController`/`SalesReportController`: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `BankDepositsController` itself, which deliberately leaves registering a deposit open to any authenticated account.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-bank-deposit-operations.use-case.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-use-cases-list-bank-deposit-operations-use-case-ts), [get-bank-deposits-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-deposits-report-summary-use-case-ts), [export-bank-deposits-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-deposits-report-pdf-use-case-ts), [bank-deposits-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-bank-deposits-report-filter-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `BankDepositsReportController` (L24–67)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('reports/bank-deposits')`
- **Propósito:** Reportería is a management view, not an operational one — same rule as `RechargesReportController`/`SalesReportController`: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `BankDepositsController` itself, which deliberately leaves registering a deposit open to any authenticated account. `findAll` delegates straight to `ListBankDepositOperationsUseCase` (imported via `BankDepositsModule`) instead of a second, near-identical list use case living in this module — identical date-range validation and pagination, no reason to duplicate it.
- **Dependencias inyectadas (constructor):** `listBankDepositOperationsUseCase: ListBankDepositOperationsUseCase`, `getBankDepositsReportSummaryUseCase: GetBankDepositsReportSummaryUseCase`, `exportBankDepositsReportPdfUseCase: ExportBankDepositsReportPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 34–37 | `query: BankDepositsReportFilterQueryDto` | (inferido) |
| `getSummary` | método public | 39–42 | `query: BankDepositsReportFilterQueryDto` | (inferido) |
| `export` | método public async | 50–66 | `query: BankDepositsReportFilterQueryDto`, `username: string`, `res: Response` | `Promise<void>` |

##### `BankDepositsReportController.findAll`

- **Firma:** `findAll(query: BankDepositsReportFilterQueryDto)` — [bank-deposits-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-deposits-report.controller.ts#L34) (L34–37)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listBankDepositOperationsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsReportController.getSummary`

- **Firma:** `getSummary(query: BankDepositsReportFilterQueryDto)` — [bank-deposits-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-deposits-report.controller.ts#L39) (L39–42)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getBankDepositsReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositsReportController.export`

- **Firma:** `export(query: BankDepositsReportFilterQueryDto, username: string, res: Response): Promise<void>` — [bank-deposits-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-deposits-report.controller.ts#L50) (L50–66)
- **Decoradores:** `@Get('export')`
- **Propósito / descripción:** Uses `@Res()` (not `{ passthrough: true }`) so the PDF `Buffer` is sent directly via `res.send()` instead of passing through the global `ResponseInterceptor`, which would otherwise wrap it as `{ success, data }` JSON and corrupt the binary response.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportBankDepositsReportPdfUseCase.execute`, `res.set`, `Date.now`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-movements-report-controller-ts"></a>

### bank-movements-report.controller.ts

- **Ruta:** [bank-movements-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-movements-report.controller.ts) (`comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-movements-report.controller.ts`, 49 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Historial de movimientos de saldo bancario — admin-only, igual que toda la Reportería.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-bank-movements.use-case.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-application-use-cases-list-bank-movements-use-case-ts), [export-bank-movements-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-movements-report-pdf-use-case-ts), [bank-movements-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-bank-movements-report-filter-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `BankMovementsReportController` (L16–48)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('reports/bank-movements')`
- **Propósito:** Historial de movimientos de saldo bancario — admin-only, igual que toda la Reportería. `findAll` delega en `ListBankMovementsUseCase` (exportado por `BanksModule`), sin un segundo caso de uso duplicado.
- **Dependencias inyectadas (constructor):** `listBankMovementsUseCase: ListBankMovementsUseCase`, `exportBankMovementsReportPdfUseCase: ExportBankMovementsReportPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 25–28 | `query: BankMovementsReportFilterQueryDto` | (inferido) |
| `export` | método public async | 31–47 | `query: BankMovementsReportFilterQueryDto`, `username: string`, `res: Response` | `Promise<void>` |

##### `BankMovementsReportController.findAll`

- **Firma:** `findAll(query: BankMovementsReportFilterQueryDto)` — [bank-movements-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-movements-report.controller.ts#L25) (L25–28)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listBankMovementsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankMovementsReportController.export`

- **Firma:** `export(query: BankMovementsReportFilterQueryDto, username: string, res: Response): Promise<void>` — [bank-movements-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-movements-report.controller.ts#L31) (L31–47)
- **Decoradores:** `@Get('export')`
- **Propósito / descripción:** `@Res()` para enviar el PDF sin pasar por `ResponseInterceptor` — mismo motivo que los demás exports.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportBankMovementsReportPdfUseCase.execute`, `res.set`, `Date.now`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-transfers-report-controller-ts"></a>

### bank-transfers-report.controller.ts

- **Ruta:** [bank-transfers-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-transfers-report.controller.ts) (`comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-transfers-report.controller.ts`, 54 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Reporte de Transferencias Bancarias — admin-only, igual que toda la Reportería.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-bank-transfers-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-bank-transfers-report-use-case-ts), [export-bank-transfers-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-bank-transfers-report-pdf-use-case-ts), [bank-transfers-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-bank-transfers-report-filter-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `BankTransfersReportController` (L15–53)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('reports/bank-transfers')`
- **Propósito:** Reporte de Transferencias Bancarias — admin-only, igual que toda la Reportería.
- **Dependencias inyectadas (constructor):** `getBankTransfersReportUseCase: GetBankTransfersReportUseCase`, `getBankTransfersReportSummaryUseCase: GetBankTransfersReportSummaryUseCase`, `exportBankTransfersReportPdfUseCase: ExportBankTransfersReportPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 25–28 | `query: BankTransfersReportFilterQueryDto` | (inferido) |
| `getSummary` | método public | 30–33 | `query: BankTransfersReportFilterQueryDto` | (inferido) |
| `export` | método public async | 36–52 | `query: BankTransfersReportFilterQueryDto`, `username: string`, `res: Response` | `Promise<void>` |

##### `BankTransfersReportController.findAll`

- **Firma:** `findAll(query: BankTransfersReportFilterQueryDto)` — [bank-transfers-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-transfers-report.controller.ts#L25) (L25–28)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getBankTransfersReportUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankTransfersReportController.getSummary`

- **Firma:** `getSummary(query: BankTransfersReportFilterQueryDto)` — [bank-transfers-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-transfers-report.controller.ts#L30) (L30–33)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getBankTransfersReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankTransfersReportController.export`

- **Firma:** `export(query: BankTransfersReportFilterQueryDto, username: string, res: Response): Promise<void>` — [bank-transfers-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/bank-transfers-report.controller.ts#L36) (L36–52)
- **Decoradores:** `@Get('export')`
- **Propósito / descripción:** `@Res()` para enviar el PDF sin pasar por `ResponseInterceptor`, igual que los demás exports.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportBankTransfersReportPdfUseCase.execute`, `res.set`, `Date.now`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-controllers-ice-cream-report-controller-ts"></a>

### ice-cream-report.controller.ts

- **Ruta:** [ice-cream-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts) (`comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts`, 66 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Replaces the two former standalone controllers (`IceCreamSalesReportController`/`IceCreamPurchasesReportController`, both removed) with a single unified one — the checkbox-selected `types` query param decides whether ventas, compras, or both are queried.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-ice-cream-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-use-case-ts), [get-ice-cream-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-ice-cream-report-summary-use-case-ts), [export-ice-cream-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-ice-cream-report-pdf-use-case-ts), [ice-cream-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-ice-cream-report-filter-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `IceCreamReportController` (L27–65)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('reports/ice-cream')`
- **Propósito:** Replaces the two former standalone controllers (`IceCreamSalesReportController`/`IceCreamPurchasesReportController`, both removed) with a single unified one — the checkbox-selected `types` query param decides whether ventas, compras, or both are queried. Same admin-only policy as every other report controller in this module.
- **Dependencias inyectadas (constructor):** `getIceCreamReportUseCase: GetIceCreamReportUseCase`, `getIceCreamReportSummaryUseCase: GetIceCreamReportSummaryUseCase`, `exportIceCreamReportPdfUseCase: ExportIceCreamReportPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 37–40 | `query: IceCreamReportFilterQueryDto` | (inferido) |
| `getSummary` | método public | 42–45 | `query: IceCreamReportFilterQueryDto` | (inferido) |
| `export` | método public async | 48–64 | `query: IceCreamReportFilterQueryDto`, `username: string`, `res: Response` | `Promise<void>` |

##### `IceCreamReportController.findAll`

- **Firma:** `findAll(query: IceCreamReportFilterQueryDto)` — [ice-cream-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts#L37) (L37–40)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getIceCreamReportUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamReportController.getSummary`

- **Firma:** `getSummary(query: IceCreamReportFilterQueryDto)` — [ice-cream-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts#L42) (L42–45)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getIceCreamReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamReportController.export`

- **Firma:** `export(query: IceCreamReportFilterQueryDto, username: string, res: Response): Promise<void>` — [ice-cream-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts#L48) (L48–64)
- **Decoradores:** `@Get('export')`
- **Propósito / descripción:** Uses `@Res()` — see `SalesReportController.export`'s doc comment for why.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportIceCreamReportPdfUseCase.execute`, `res.set`, `buildExportFilename`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

#### Función `buildExportFilename` (L12–18)

- **Tipo:** función local del archivo
- **Firma:** `buildExportFilename(startDate?: string, endDate?: string): string` — [ice-cream-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date().toISOString().slice`, `new Date().toISOString`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts"></a>

### purchases-report.controller.ts

- **Ruta:** [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts) (`comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts`, 74 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Same admin-only policy and route-ordering rule as `SalesReportController` — see that file's doc comment.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-purchases-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-use-case-ts), [get-purchases-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-report-summary-use-case-ts), [get-purchases-by-product-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchases-by-product-report-use-case-ts), [get-purchase-report-detail.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-purchase-report-detail-use-case-ts), [export-purchases-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-purchases-report-pdf-use-case-ts), [purchases-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-purchases-report-filter-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `PurchasesReportController` (L23–73)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('reports/purchases')`
- **Propósito:** Same admin-only policy and route-ordering rule as `SalesReportController` — see that file's doc comment.
- **Dependencias inyectadas (constructor):** `getPurchasesReportUseCase: GetPurchasesReportUseCase`, `getPurchasesReportSummaryUseCase: GetPurchasesReportSummaryUseCase`, `getPurchasesByProductReportUseCase: GetPurchasesByProductReportUseCase`, `getPurchaseReportDetailUseCase: GetPurchaseReportDetailUseCase`, `exportPurchasesReportPdfUseCase: ExportPurchasesReportPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 35–38 | `query: PurchasesReportFilterQueryDto` | (inferido) |
| `getSummary` | método public | 40–43 | `query: PurchasesReportFilterQueryDto` | (inferido) |
| `getByProduct` | método public | 45–48 | `query: PurchasesReportFilterQueryDto` | (inferido) |
| `export` | método public async | 51–67 | `query: PurchasesReportFilterQueryDto`, `username: string`, `res: Response` | `Promise<void>` |
| `findOne` | método public | 69–72 | `id: string` | (inferido) |

##### `PurchasesReportController.findAll`

- **Firma:** `findAll(query: PurchasesReportFilterQueryDto)` — [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L35) (L35–38)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getPurchasesReportUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesReportController.getSummary`

- **Firma:** `getSummary(query: PurchasesReportFilterQueryDto)` — [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L40) (L40–43)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getPurchasesReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesReportController.getByProduct`

- **Firma:** `getByProduct(query: PurchasesReportFilterQueryDto)` — [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L45) (L45–48)
- **Decoradores:** `@Get('by-product')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getPurchasesByProductReportUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesReportController.export`

- **Firma:** `export(query: PurchasesReportFilterQueryDto, username: string, res: Response): Promise<void>` — [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L51) (L51–67)
- **Decoradores:** `@Get('export')`
- **Propósito / descripción:** See `SalesReportController.export`'s doc comment — same `@Res()` reasoning.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportPurchasesReportPdfUseCase.execute`, `res.set`, `Date.now`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchasesReportController.findOne`

- **Firma:** `findOne(id: string)` — [purchases-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts#L69) (L69–72)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getPurchaseReportDetailUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-controllers-recharges-report-controller-ts"></a>

### recharges-report.controller.ts

- **Ruta:** [recharges-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/recharges-report.controller.ts) (`comercial-jhoel-api/src/modules/reports/presentation/controllers/recharges-report.controller.ts`, 79 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Reportería is a management view, not an operational one — same rule as `SalesReportController`/`PurchasesReportController`: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `RechargesController` itself, which deliberately leaves the daily register (compras, saldo final, cuadre) open to any authenticated account.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-recharge-history.use-case.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-application-use-cases-get-recharge-history-use-case-ts), [get-recharges-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-recharges-report-summary-use-case-ts), [export-recharges-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-recharges-report-pdf-use-case-ts), [recharges-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-recharges-report-filter-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `RechargesReportController` (L27–78)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('reports/recharges')`
- **Propósito:** Reportería is a management view, not an operational one — same rule as `SalesReportController`/`PurchasesReportController`: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `RechargesController` itself, which deliberately leaves the daily register (compras, saldo final, cuadre) open to any authenticated account. A `USER` token gets a real `403` here, not just a hidden sidebar entry — reading the full historical record across every cycle is a management concern, the daily operational screen is not. `findAll` delegates straight to `GetRechargeHistoryUseCase` (imported via `RechargesModule`) instead of a second, near-identical list use case living in this module — identical date-range validation and pagination, no reason to duplicate it.
- **Dependencias inyectadas (constructor):** `getRechargeHistoryUseCase: GetRechargeHistoryUseCase`, `getRechargesReportSummaryUseCase: GetRechargesReportSummaryUseCase`, `exportRechargesReportPdfUseCase: ExportRechargesReportPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 37–48 | `query: RechargesReportFilterQueryDto` | (inferido) |
| `getSummary` | método public | 50–53 | `query: RechargesReportFilterQueryDto` | (inferido) |
| `export` | método public async | 61–77 | `query: RechargesReportFilterQueryDto`, `username: string`, `res: Response` | `Promise<void>` |

##### `RechargesReportController.findAll`

- **Firma:** `findAll(query: RechargesReportFilterQueryDto)` — [recharges-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/recharges-report.controller.ts#L37) (L37–48)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargeHistoryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesReportController.getSummary`

- **Firma:** `getSummary(query: RechargesReportFilterQueryDto)` — [recharges-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/recharges-report.controller.ts#L50) (L50–53)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getRechargesReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RechargesReportController.export`

- **Firma:** `export(query: RechargesReportFilterQueryDto, username: string, res: Response): Promise<void>` — [recharges-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/recharges-report.controller.ts#L61) (L61–77)
- **Decoradores:** `@Get('export')`
- **Propósito / descripción:** Uses `@Res()` (not `{ passthrough: true }`) so the PDF `Buffer` is sent directly via `res.send()` instead of passing through the global `ResponseInterceptor`, which would otherwise wrap it as `{ success, data }` JSON and corrupt the binary response.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportRechargesReportPdfUseCase.execute`, `res.set`, `Date.now`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts"></a>

### sales-report.controller.ts

- **Ruta:** [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts) (`comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts`, 90 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Reportería is a management view, not an operational one — every route here is `@Roles('ADMIN', 'SUPER_ADMIN')` (unlike `SalesController`, which deliberately leaves `POST /sales` open to any authenticated account because *registering* a sale is a cashier's job).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-sales-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-use-case-ts), [get-sales-report-summary.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-report-summary-use-case-ts), [get-sales-by-product-report.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sales-by-product-report-use-case-ts), [get-sale-report-detail.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-get-sale-report-detail-use-case-ts), [export-sales-report-pdf.use-case.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-use-cases-export-sales-report-pdf-use-case-ts), [sales-report-filter.query.dto.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-dtos-sales-report-filter-query-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `express`
- **Consumidores:** [reports.module.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-reports-module-ts)

#### Clase `SalesReportController` (L34–89)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('reports/sales')`
- **Propósito:** Reportería is a management view, not an operational one — every route here is `@Roles('ADMIN', 'SUPER_ADMIN')` (unlike `SalesController`, which deliberately leaves `POST /sales` open to any authenticated account because *registering* a sale is a cashier's job). A `USER` token gets a real `403`, not just a hidden sidebar entry. Route order matters, same lesson as `SalesController`: `summary`, `by-product`, and `export` must be declared before `:id`, or Nest would match them as `GET /reports/sales/:id` with `id="summary"` etc. and fail `ParseUUIDPipe` instead of reaching the intended handler.
- **Dependencias inyectadas (constructor):** `getSalesReportUseCase: GetSalesReportUseCase`, `getSalesReportSummaryUseCase: GetSalesReportSummaryUseCase`, `getSalesByProductReportUseCase: GetSalesByProductReportUseCase`, `getSaleReportDetailUseCase: GetSaleReportDetailUseCase`, `exportSalesReportPdfUseCase: ExportSalesReportPdfUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 46–49 | `query: SalesReportFilterQueryDto` | (inferido) |
| `getSummary` | método public | 51–54 | `query: SalesReportFilterQueryDto` | (inferido) |
| `getByProduct` | método public | 56–59 | `query: SalesReportFilterQueryDto` | (inferido) |
| `export` | método public async | 67–83 | `query: SalesReportFilterQueryDto`, `username: string`, `res: Response` | `Promise<void>` |
| `findOne` | método public | 85–88 | `id: string` | (inferido) |

##### `SalesReportController.findAll`

- **Firma:** `findAll(query: SalesReportFilterQueryDto)` — [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L46) (L46–49)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getSalesReportUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesReportController.getSummary`

- **Firma:** `getSummary(query: SalesReportFilterQueryDto)` — [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L51) (L51–54)
- **Decoradores:** `@Get('summary')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getSalesReportSummaryUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesReportController.getByProduct`

- **Firma:** `getByProduct(query: SalesReportFilterQueryDto)` — [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L56) (L56–59)
- **Decoradores:** `@Get('by-product')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.getSalesByProductReportUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesReportController.export`

- **Firma:** `export(query: SalesReportFilterQueryDto, username: string, res: Response): Promise<void>` — [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L67) (L67–83)
- **Decoradores:** `@Get('export')`
- **Propósito / descripción:** Uses `@Res()` (not `{ passthrough: true }`) so the PDF `Buffer` is sent directly via `res.send()` instead of passing through the global `ResponseInterceptor`, which would otherwise wrap it as `{ success, data }` JSON and corrupt the binary response.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser('username') username`, `@Res() res`
- **Dependencias (llamadas en su cuerpo):** `this.exportSalesReportPdfUseCase.execute`, `res.set`, `Date.now`, `String`, `res.send`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesReportController.findOne`

- **Firma:** `findOne(id: string)` — [sales-report.controller.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/sales-report.controller.ts#L85) (L85–88)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getSaleReportDetailUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-reports-presentation-dtos-agent-reconciliations-report-filter-query-dto-ts"></a>

### agent-reconciliations-report-filter.query.dto.ts

- **Ruta:** [agent-reconciliations-report-filter.query.dto.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/dtos/agent-reconciliations-report-filter.query.dto.ts) (`comercial-jhoel-api/src/modules/reports/presentation/dtos/agent-reconciliations-report-filter.query.dto.ts`, 27 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Shared across every agent-reconciliations-report route (`GET /reports/agent-reconciliations`, `/summary`, `/export`) — no product/category/business filter, since `agent_reconciliations` has no such dimension.
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [agent-reconciliations-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-agent-reconciliations-report-controller-ts)

#### Clase `AgentReconciliationsReportFilterQueryDto` (L5–26)

- **Propósito:** Shared across every agent-reconciliations-report route (`GET /reports/agent-reconciliations`, `/summary`, `/export`) — no product/category/business filter, since `agent_reconciliations` has no such dimension.
<a id="f-comercial-jhoel-api-src-modules-reports-presentation-dtos-assets-receivables-report-filter-query-dto-ts"></a>

### assets-receivables-report-filter.query.dto.ts

- **Ruta:** [assets-receivables-report-filter.query.dto.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/dtos/assets-receivables-report-filter.query.dto.ts) (`comercial-jhoel-api/src/modules/reports/presentation/dtos/assets-receivables-report-filter.query.dto.ts`, 66 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Shared across every assets-receivables-report route (`GET /reports/assets-receivables`, `/summary`, `/export`).
- **Depende de (archivos del proyecto):** [assets-receivables-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-assets-receivables-report-output-ts), [parse-report-status.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-utils-parse-report-status-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [assets-receivables-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-assets-receivables-report-controller-ts)

#### Clase `AssetsReceivablesReportFilterQueryDto` (L23–65)

- **Propósito:** Shared across every assets-receivables-report route (`GET /reports/assets-receivables`, `/summary`, `/export`).
<a id="f-comercial-jhoel-api-src-modules-reports-presentation-dtos-bank-deposits-report-filter-query-dto-ts"></a>

### bank-deposits-report-filter.query.dto.ts

- **Ruta:** [bank-deposits-report-filter.query.dto.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/dtos/bank-deposits-report-filter.query.dto.ts) (`comercial-jhoel-api/src/modules/reports/presentation/dtos/bank-deposits-report-filter.query.dto.ts`, 54 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Shared across every bank-deposits-report route (`GET /reports/bank-deposits`, `/summary`, `/export`) — each use case only reads the fields it actually needs.
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [bank-deposits-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-deposits-report-controller-ts)

#### Clase `BankDepositsReportFilterQueryDto` (L14–53)

- **Propósito:** Shared across every bank-deposits-report route (`GET /reports/bank-deposits`, `/summary`, `/export`) — each use case only reads the fields it actually needs.
<a id="f-comercial-jhoel-api-src-modules-reports-presentation-dtos-bank-movements-report-filter-query-dto-ts"></a>

### bank-movements-report-filter.query.dto.ts

- **Ruta:** [bank-movements-report-filter.query.dto.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/dtos/bank-movements-report-filter.query.dto.ts) (`comercial-jhoel-api/src/modules/reports/presentation/dtos/bank-movements-report-filter.query.dto.ts`, 49 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Filtros del historial de movimientos de saldo bancario (`GET /reports/bank-movements`, `/export`).
- **Depende de (archivos del proyecto):** [bank-account-movement.entity.ts](banks.md#f-comercial-jhoel-api-src-modules-banks-domain-entities-bank-account-movement-entity-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [bank-movements-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-movements-report-controller-ts)

#### Clase `BankMovementsReportFilterQueryDto` (L15–48)

- **Propósito:** Filtros del historial de movimientos de saldo bancario (`GET /reports/bank-movements`, `/export`).
<a id="f-comercial-jhoel-api-src-modules-reports-presentation-dtos-bank-transfers-report-filter-query-dto-ts"></a>

### bank-transfers-report-filter.query.dto.ts

- **Ruta:** [bank-transfers-report-filter.query.dto.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/dtos/bank-transfers-report-filter.query.dto.ts) (`comercial-jhoel-api/src/modules/reports/presentation/dtos/bank-transfers-report-filter.query.dto.ts`, 56 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Filtros del Reporte de Transferencias Bancarias (`GET /reports/bank-transfers`, `/summary`, `/export`).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [bank-transfers-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-bank-transfers-report-controller-ts)

#### Clase `BankTransfersReportFilterQueryDto` (L13–55)

- **Propósito:** Filtros del Reporte de Transferencias Bancarias (`GET /reports/bank-transfers`, `/summary`, `/export`).
<a id="f-comercial-jhoel-api-src-modules-reports-presentation-dtos-ice-cream-report-filter-query-dto-ts"></a>

### ice-cream-report-filter.query.dto.ts

- **Ruta:** [ice-cream-report-filter.query.dto.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/dtos/ice-cream-report-filter.query.dto.ts) (`comercial-jhoel-api/src/modules/reports/presentation/dtos/ice-cream-report-filter.query.dto.ts`, 56 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Shared across every ice-cream-report route (`GET /reports/ice-cream`, `/summary`, `/export`).
- **Depende de (archivos del proyecto):** [ice-cream-report-output.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-application-dtos-ice-cream-report-output-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [ice-cream-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-ice-cream-report-controller-ts)

#### Clase `IceCreamReportFilterQueryDto` (L17–55)

- **Propósito:** Shared across every ice-cream-report route (`GET /reports/ice-cream`, `/summary`, `/export`).
<a id="f-comercial-jhoel-api-src-modules-reports-presentation-dtos-purchases-report-filter-query-dto-ts"></a>

### purchases-report-filter.query.dto.ts

- **Ruta:** [purchases-report-filter.query.dto.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/dtos/purchases-report-filter.query.dto.ts) (`comercial-jhoel-api/src/modules/reports/presentation/dtos/purchases-report-filter.query.dto.ts`, 70 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Shared across every purchases-report route — same reasoning as `SalesReportFilterQueryDto`.
- **Depende de (archivos del proyecto):** [purchases-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-purchases-report-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [purchases-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-purchases-report-controller-ts)

#### Clase `PurchasesReportFilterQueryDto` (L20–69)

- **Propósito:** Shared across every purchases-report route — same reasoning as `SalesReportFilterQueryDto`.
<a id="f-comercial-jhoel-api-src-modules-reports-presentation-dtos-recharges-report-filter-query-dto-ts"></a>

### recharges-report-filter.query.dto.ts

- **Ruta:** [recharges-report-filter.query.dto.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/dtos/recharges-report-filter.query.dto.ts) (`comercial-jhoel-api/src/modules/reports/presentation/dtos/recharges-report-filter.query.dto.ts`, 38 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Shared across every recharges-report route (`GET /reports/recharges`, `/summary`, `/export`) — each use case only reads the fields it actually needs.
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [recharges-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-recharges-report-controller-ts)

#### Clase `RechargesReportFilterQueryDto` (L12–37)

- **Propósito:** Shared across every recharges-report route (`GET /reports/recharges`, `/summary`, `/export`) — each use case only reads the fields it actually needs.
<a id="f-comercial-jhoel-api-src-modules-reports-presentation-dtos-sales-report-filter-query-dto-ts"></a>

### sales-report-filter.query.dto.ts

- **Ruta:** [sales-report-filter.query.dto.ts](../../../../comercial-jhoel-api/src/modules/reports/presentation/dtos/sales-report-filter.query.dto.ts) (`comercial-jhoel-api/src/modules/reports/presentation/dtos/sales-report-filter.query.dto.ts`, 74 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Shared across every sales-report route (`GET /reports/sales`, `/summary`, `/by-product`, `/export`) — each use case only reads the fields it actually needs (e.g.
- **Depende de (archivos del proyecto):** [sales-report.repository.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-domain-repositories-sales-report-repository-ts)
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [sales-report.controller.ts](reports.md#f-comercial-jhoel-api-src-modules-reports-presentation-controllers-sales-report-controller-ts)

#### Clase `SalesReportFilterQueryDto` (L28–73)

- **Propósito:** Shared across every sales-report route (`GET /reports/sales`, `/summary`, `/by-product`, `/export`) — each use case only reads the fields it actually needs (e.g. `/summary` ignores `page`/`sortBy`), so one DTO covers all four without forcing a route-specific shape for no benefit. No `customerId`/client filter: this system has no customers/clients module yet (verified against the current domain model) — adding an unused query param here would be surface area for a feature that doesn't exist.
<a id="f-comercial-jhoel-api-src-modules-reports-reports-module-ts"></a>

### reports.module.ts

- **Ruta:** [reports.module.ts](../../../../comercial-jhoel-api/src/modules/reports/reports.module.ts) (`comercial-jhoel-api/src/modules/reports/reports.module.ts`, 205 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `reports`
- **Responsabilidad:** Reportería is a pure read-side, cross-cutting module — it never writes to `sales`/`purchases`/`products`/etc., only queries them, so it registers their ORM entities directly via its own `TypeOrmModule.forFeature(...)` (safe: `autoLoadEntities: true` + the same entity class registered in two modules'
- **Depende de (archivos del proyecto):** [sale.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-orm-entity-ts), [sale-detail.orm-entity.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-infrastructure-persistence-sale-detail-orm-entity-ts), [purchase.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-orm-entity-ts), [purchase-detail.orm-entity.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-infrastructure-persistence-purchase-detail-orm-entity-ts), [sales.module.ts](sales.md#f-comercial-jhoel-api-src-modules-sales-sales-module-ts), [purchases.module.ts](purchases.md#f-comercial-jhoel-api-src-modules-purchases-purchases-module-ts), [categories.module.ts](categories.md#f-comercial-jhoel-api-src-modules-categories-categories-module-ts), [businesses.module.ts](businesses.md#f-comercial-jhoel-api-src-modules-businesses-businesses-module-ts), [products.module.ts](products.md#f-comercial-jhoel-api-src-modules-products-products-module-ts), [users.module.ts](users.md#f-comercial-jhoel-api-src-modules-users-users-module-ts), [suppliers.module.ts](suppliers.md#f-comercial-jhoel-api-src-modules-suppliers-suppliers-module-ts), [recharges.module.ts](recharges.md#f-comercial-jhoel-api-src-modules-recharges-recharges-module-ts), [ice-creams.module.ts](ice-creams.md#f-comercial-jhoel-api-src-modules-ice-creams-ice-creams-module-ts), [clients.module.ts](clients.md#f-comercial-jhoel-api-src-modules-clients-clients-module-ts), [accounts-receivable.module.ts](accounts-receivable.md#f-comercial-jhoel-api-src-modules-accounts-receivable-accounts-receivable-module-ts) y 59 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `ReportsModule` (L108–204)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ SaleOrmEntity, SaleDetailOrmEntity, PurchaseOrmEntity, PurchaseDetailOrmEntity, IceCreamSaleDetailOrmEntity, IceC`
- **Propósito:** Reportería is a pure read-side, cross-cutting module — it never writes to `sales`/`purchases`/`products`/etc., only queries them, so it registers their ORM entities directly via its own `TypeOrmModule.forFeature(...)` (safe: `autoLoadEntities: true` + the same entity class registered in two modules' `forFeature` is a normal, supported TypeORM/Nest pattern — each module just gets its own injection-scoped `Repository&lt;T&gt;`) rather than importing the full `SalesModule`/`PurchasesModule` for that part. It does still import `SalesModule`/`PurchasesModule` for one thing each — reusing their already-correct `SALE_REPOSITORY`/`PURCHASE_REPOSITORY.findById` for the `:id` detail routes, instead of duplicating that query — and `CategoriesModule`/`BusinessesModule`/`ProductsModule`/`UsersModule`/`SuppliersModule` to resolve filter ids into display names for the PDF export. `AssetsReceivablesReportCont
