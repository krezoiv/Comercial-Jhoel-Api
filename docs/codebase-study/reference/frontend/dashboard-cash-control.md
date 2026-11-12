# Frontend `dashboard-cash-control`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [cash-control-page.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `day`, `position` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 0 | Soporte (pruebas) |
| [cash-control-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Finance → Control de Efectivo. | 23 internas; ext.: @angular/core, @angular/common, @angular/forms, @angular/router | 2 | Baja (2 consumidores) |
| [cash-control.util.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [cash-control.util.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts) | .ts | Utilidad | Feature (pantalla) | `HH:mm` of a server instant in America/Guatemala (never the browser's zone). | 2 internas | 15 | Alta (15 consumidores) |
| [bank-day-card.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-bank-day-card-bank-day-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Acumulados del día operativo": daily indicators that restart at every Agentes Bancarios opening (the physical balance never does), with the selector to consult a past bank day. | 3 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [bank-day-history.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-bank-day-history-bank-day-history-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Historial por día operativo": the original indicators of each bank day (read only). | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [cash-bank-deposit-modal.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria (sin comentario de documentación en el código). | 4 internas; ext.: @angular/common, @angular/core, rxjs | 0 | Soporte (pruebas) |
| [cash-bank-deposit-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Depósito bancario": cash leaves the caja and is deposited into one of the registered bank accounts. | 10 internas; ext.: @angular/core, @angular/common, @angular/forms | 3 | Media (3 consumidores) |
| [cash-count-modal.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `custody` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/common, @angular/core, rxjs | 0 | Soporte (pruebas) |
| [cash-count-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Arqueo de Caja": count the bills and coins physically in the caja and compare them with the theoretical caja balance. | 10 internas; ext.: @angular/core, @angular/common, @angular/forms | 3 | Media (3 consumidores) |
| [cash-counts-panel.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-counts-panel-cash-counts-panel-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Historial de arqueos": every count exactly as recorded (theoretical photograph, counted total, difference, result, denominations). | 6 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [cash-movement-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Manual cash movement registered in Control de Efectivo: Entrada/Salida (cut managers) or Ajuste/Saldo inicial (admin). | 8 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [cut-control-panel.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Configuración y control de cortes": opening of the operational day (inherited cash, never invented), the two cuts with scheduled vs actual times, start/finish/reopen actions and the final close of the day. | 11 internas; ext.: @angular/core, @angular/common, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [cut-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-detail-modal-cut-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Read-only detail of one cut (`GET /cash-control/cuts/:id`): the stored snapshot (never recomputed), current and superseded arqueos, bank reconciliation, audit trail (started/finished/reopened), schedule changes and the Kardex movements of its range. | 4 internas; ext.: @angular/core | 4 | Media (4 consumidores) |
| [cut-finish-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Finalizar corte": arqueo by denomination (Q200 … Q0.05) compared live against the system cash of the Kardex, plus verification of every active bank account. | 10 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [cut-history.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts) | .ts | Componente Angular | Feature (pantalla) | Historial de Cortes — one block per operational day with its two cuts (scheduled/actual times, responsible users, status, opening/closing cash, difference of each cut, bank reconciliation). | 6 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [reason-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-reason-modal-reason-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Small "reason required" prompt shared by Control de Efectivo's audited actions (void a movement, reopen a cut, change a schedule). | 1 internas; ext.: @angular/core, @angular/forms | 6 | Media (6 consumidores) |
| [warehouse-panel.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts) | .ts | Componente Angular | Feature (pantalla) | Bodega: its balance (own Kardex), the deliveries received from the caja (each linked to its caja movement: both Kardex sequence numbers are shown) and the Bodega Kardex. | 9 internas; ext.: @angular/core, @angular/common, @angular/forms | 2 | Baja (2 consumidores) |
| [warehouse-transfer-modal.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `custody` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/common, @angular/core, rxjs | 0 | Soporte (pruebas) |
| [warehouse-transfer-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Entrega de Efectivo a Bodega": an internal transfer — caja goes down, Bodega goes up by the same amount, total custody unchanged; never an expense. | 11 internas; ext.: @angular/core, @angular/common, @angular/forms | 3 | Media (3 consumidores) |
| [warehouse-withdrawal-modal.component.spec.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-spec-ts) | .ts | Prueba unitaria | Feature (pantalla) | Prueba unitaria: declara `custody` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/common, @angular/core, rxjs | 0 | Soporte (pruebas) |
| [warehouse-withdrawal-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Retiro de Bodega": cash leaves Bodega and either goes back to the caja (internal transfer, total custody unchanged) or is deposited into a registered bank account (Bodega down, bank up). | 12 internas; ext.: @angular/core, @angular/common, @angular/forms | 3 | Media (3 consumidores) |
| [cash-control-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-control-page.component.ts`; usa 17 componentes hijos: `app-page-header`, `app-icon`, `app-card`, `app-button`, `app-cash-bank-day-card`, `app-cash-bank-day-history`. | — | — | Media |
| [cash-control-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-day-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-card/bank-day-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-day-card.component.ts`; usa 1 componentes hijos: `app-card`. | — | — | Media |
| [bank-day-card.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-card/bank-day-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-day-history.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-history/bank-day-history.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-day-history.component.ts`; usa 1 componentes hijos: `app-card`. | — | — | Media |
| [bank-day-history.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-history/bank-day-history.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cash-bank-deposit-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-bank-deposit-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-cash-breakdown-table`, `app-button`. | — | — | Media |
| [cash-bank-deposit-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cash-count-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-count-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-button`, `app-cash-breakdown-table`. | — | — | Media |
| [cash-count-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cash-counts-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-counts-panel/cash-counts-panel.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-counts-panel.component.ts`; usa 3 componentes hijos: `app-icon`, `app-button`, `app-report-pagination`. | — | — | Media |
| [cash-movement-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cash-movement-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [cash-movement-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cut-control-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cut-control-panel.component.ts`; usa 6 componentes hijos: `app-icon`, `app-card`, `app-button`, `app-cash-cut-finish-modal`, `app-cash-cut-detail-modal`, `app-cash-reason-modal`. | — | — | Media |
| [cut-control-panel.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cut-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-detail-modal/cut-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cut-detail-modal.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [cut-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-detail-modal/cut-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cut-finish-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cut-finish-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-cash-breakdown-table`, `app-button`. | — | — | Media |
| [cut-finish-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [cut-history.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `cut-history.component.ts`; usa 5 componentes hijos: `app-card`, `app-icon`, `app-button`, `app-report-pagination`, `app-cash-cut-detail-modal`. | — | — | Media |
| [cut-history.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [reason-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/reason-modal/reason-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [warehouse-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `warehouse-panel.component.ts`; usa 4 componentes hijos: `app-icon`, `app-button`, `app-report-pagination`, `app-cash-reason-modal`. | — | — | Media |
| [warehouse-panel.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [warehouse-transfer-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `warehouse-transfer-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-cash-breakdown-table`, `app-button`. | — | — | Media |
| [warehouse-withdrawal-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `warehouse-withdrawal-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-cash-breakdown-table`, `app-button`. | — | — | Media |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-spec-ts"></a>

### cash-control-page.component.spec.ts

- **Ruta:** [cash-control-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.spec.ts`, 113 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Prueba unitaria: declara `day`, `position` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** —
#### Función `day` (L11–34)

- **Tipo:** función local del archivo
- **Firma:** `day(date: string, overrides?: Partial<CashBankDaySummary>): CashBankDaySummary` — [cash-control-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.spec.ts#L11)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `position` (L37–54)

- **Tipo:** función local del archivo
- **Firma:** `position(): CashPosition` — [cash-control-page.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.spec.ts#L37)
- **Propósito / descripción:** Day 2 right after its bank opening: every daily indicator is zero, the balance is the day-1 close.
- **Dependencias:** `day`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts"></a>

### cash-control-page.component.ts

- **Ruta:** [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts`, 427 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Finance → Control de Efectivo.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [cash-control-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-sync-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [refetch-on-tab-visible.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-refetch-on-tab-visible-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts), [cash-movement-form-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts), [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts) y 8 más
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts), [cash-control-page.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-spec-ts)
- **Plantilla:** [cash-control-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [bank-day-card.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-bank-day-card-bank-day-card-component-ts), [bank-day-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-bank-day-history-bank-day-history-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts), [cash-counts-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-counts-panel-cash-counts-panel-component-ts), [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts), [cash-movement-form-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts), [reason-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-reason-modal-reason-modal-component-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts), [warehouse-transfer-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts) y 2 más
- **Eventos enlazados en la plantilla:** `(click)="setTab('efectivo')"`, `(click)="setTab('cortes')"`, `(click)="setTab('historial')"`, `(click)="setTab('arqueos')"`, `(click)="setTab('bodega')"`, `(click)="refresh()"`, `(click)="formMode.set('ENTRADA_MANUAL')"`, `(click)="formMode.set('SALIDA_MANUAL')"`, `(click)="depositOpen.set(true)"`, `(click)="openCount()"`, `(click)="openTransfer()"`, `(click)="openWithdrawal()"`, `(click)="formMode.set('AJUSTE')"`, `(click)="formMode.set('SALDO_INICIAL')"`, `(select)="selectBankDate($event)"`

**Interfaces, tipos y enums:**

- `type CashTab` (L57) = `'efectivo' \| 'cortes' \| 'historial' \| 'arqueos' \| 'bodega'`

#### Clase `CashControlPageComponent` (L68–426)

- **Decoradores:** `@Component({ selector: 'app-cash-control-page', standalone: true, imports: [ FormsModule, ButtonComponent, CardComponent, IconComponent, PageHeaderComponent, Rep`
- **Propósito:** Finance → Control de Efectivo. Shows the official physical cash (backend Kardex), today's totals by operation type, the Kardex itself with filters, the two daily cuts and their history. It updates in real time through `onCashChanged` (writes in this tab, other tabs, and polling for other users) and never computes a balance on its own.
- **Servicios inyectados con `inject()`:** `service = inject(CashControlService)`, `custodyService = inject(CashCustodyService)`, `authService = inject(AuthService)`, `notifications = inject(NotificationService)`, `route = inject(ActivatedRoute)`, `router = inject(Router)`
- **Datos / estado que administra:** `tab = signal<CashTab>(this.initialTab())`, `canManage = computed(() => canManageCuts(this.authService.curr`, `canCustody = computed(() => CASH_CUSTODY_OPERATOR_ROLES.include`, `custody = signal<CashCustody \| null>(null)`, `countOpen = signal(false)`, `countCorrection = signal<CashCountRecord \| null>(null)`, `transferOpen = signal(false)`, `withdrawalOpen = signal(false)`, `custodyRefresh = signal(0)`, `position = signal<CashPosition \| null>(null)`, `loadingPosition = signal(true)`, `positionFailed = signal(false)`, `bankDays = signal<CashBankDaySummary[]>([])`, `selectedBankDate = signal<string \| null>(null)`, `pastDay = signal<CashBankDaySummary \| null>(null)`, `viewedDay = computed<{ header: CashBankDayHeader \| null; summa`, `summaryCards = computed(() => buildSummaryCards(this.viewedDay()?`, `movements = signal<CashMovement[]>([])`, `totalMovements = signal(0)`, `pageTotals = signal({ totalIn: 0, totalOut: 0 })`, `page = signal(1)`, `loadingMovements = signal(true)`, `movementsFailed = signal(false)`, `users = signal<{ id: string; username: string }[]>([])`, `draft = signal<CashMovementFilters>({ ...EMPTY_FILTERS, da`, `hasFilters = computed(() => Object.values(this.draft()).some((v`, `formMode = signal<ManualCashMovementType \| null>(null)`, `depositOpen = signal(false)`, `breakdown = signal<CashMovement \| null>(null)`, `loadingBreakdown = signal(false)`…

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `setTab` | método public | 187–190 | `tab: CashTab` | `void` |
| `refresh` | método public | 192–197 | — | `void` |
| `loadCustody` | método public | 199–207 | — | `void` |
| `openCount` | método public | 209–213 | `correction?: CashCountRecord \| null` | `void` |
| `onCountSaved` | método public | 215–217 | — | `void` |
| `closeCount` | método public | 219–222 | — | `void` |
| `openTransfer` | método public | 224–227 | — | `void` |
| `onTransferSaved` | método public | 229–234 | `result: { custody: CashCustody }` | `void` |
| `openWithdrawal` | método public | 236–239 | — | `void` |
| `onWithdrawalSaved` | método public | 241–246 | `result: { custody: CashCustody }` | `void` |
| `onCustodyChanged` | método public | 248–251 | — | `void` |
| `loadBankDays` | método public | 253–258 | — | `void` |
| `selectBankDate` | método public | 264–284 | `date: string` | `void` |
| `loadPosition` | método public | 286–298 | — | `void` |
| `setPosition` | método public | 300–310 | `position: CashPosition` | `void` |
| `loadMovements` | método public | 312–327 | — | `void` |
| `setDraft` | método public | 329–334 | `patch: Partial<CashMovementFilters>` | `void` |
| `setSingleDate` | método public | 337–339 | `date: string` | `void` |
| `applyFilters` | método public | 341–345 | — | `void` |
| `clearFilters` | método public | 347–350 | — | `void` |
| `onPageChange` | método public | 352–355 | `page: number` | `void` |
| `signedLabel` | método public | 357–362 | `movement: CashMovement` | `string` |
| `onDepositSaved` | método public | 364–367 | — | `void` |
| `showBreakdown` | método public | 369–383 | `movement: CashMovement` | `void` |
| `voidMessage` | método public | 385–395 | — | `string` |
| `onMovementSaved` | método public | 397–400 | — | `void` |
| `voidMovement` | método public | 402–420 | `reason: string` | `void` |
| `initialTab` | método private | 422–425 | — | `CashTab` |

##### `CashControlPageComponent.setTab`

- **Firma:** `setTab(tab: CashTab): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L187) (L187–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.tab.set`, `this.router.navigate`
- **Efectos secundarios:** Actualiza estado (signals): `this.tab.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.refresh`

- **Firma:** `refresh(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L192) (L192–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadPosition`, `this.loadMovements`, `this.loadBankDays`, `this.loadCustody`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cash-control-page.component.html` (plantilla), (mismo archivo)

##### `CashControlPageComponent.loadCustody`

- **Firma:** `loadCustody(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L199) (L199–207)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canCustody`, `this.custodyService.getCustody().pipe(catchError(() => of(null))).subscribe`, `this.custodyService.getCustody().pipe`, `this.custodyService.getCustody`, `catchError`, `of`, `this.custody.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.custody.set`
- **Consumidores:** (mismo archivo)

##### `CashControlPageComponent.openCount`

- **Firma:** `openCount(correction?: CashCountRecord \| null): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L209) (L209–213)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.countCorrection.set`, `this.countOpen.set`, `this.loadCustody`
- **Efectos secundarios:** Actualiza estado (signals): `this.countCorrection.set`, `this.countOpen.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.onCountSaved`

- **Firma:** `onCountSaved(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L215) (L215–217)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.custodyRefresh.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.custodyRefresh.update`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.closeCount`

- **Firma:** `closeCount(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L219) (L219–222)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.countOpen.set`, `this.countCorrection.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.countOpen.set`, `this.countCorrection.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.openTransfer`

- **Firma:** `openTransfer(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L224) (L224–227)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadCustody`, `this.transferOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.transferOpen.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.onTransferSaved`

- **Firma:** `onTransferSaved(result: { custody: CashCustody }): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L229) (L229–234)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transferOpen.set`, `this.custody.set`, `this.custodyRefresh.update`, `this.refresh`
- **Efectos secundarios:** Actualiza estado (signals): `this.transferOpen.set`, `this.custody.set`, `this.custodyRefresh.update`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.openWithdrawal`

- **Firma:** `openWithdrawal(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L236) (L236–239)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadCustody`, `this.withdrawalOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.withdrawalOpen.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.onWithdrawalSaved`

- **Firma:** `onWithdrawalSaved(result: { custody: CashCustody }): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L241) (L241–246)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.withdrawalOpen.set`, `this.custody.set`, `this.custodyRefresh.update`, `this.refresh`
- **Efectos secundarios:** Actualiza estado (signals): `this.withdrawalOpen.set`, `this.custody.set`, `this.custodyRefresh.update`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.onCustodyChanged`

- **Firma:** `onCustodyChanged(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L248) (L248–251)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.custodyRefresh.update`, `this.refresh`
- **Efectos secundarios:** Actualiza estado (signals): `this.custodyRefresh.update`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.loadBankDays`

- **Firma:** `loadBankDays(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L253) (L253–258)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.service.getBankDays(60).pipe(catchError(() => of([]))).subscribe`, `this.service.getBankDays(60).pipe`, `this.service.getBankDays`, `catchError`, `of`, `this.bankDays.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankDays.set`
- **Consumidores:** (mismo archivo)

##### `CashControlPageComponent.selectBankDate`

- **Firma:** `selectBankDate(date: string): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L264) (L264–284)
- **Propósito / descripción:** Day selector: '' = current bank day (live); a date = that day's original indicators (read only). The Kardex below switches to the same bank day.
- **Dependencias (llamadas en su cuerpo):** `this.position`, `this.selectedBankDate.set`, `this.pastDay.set`, `this.service.getBankDay(target).subscribe`, `this.service.getBankDay`, `this.notifications.error`, `extractErrorMessage`, `this.draft.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedBankDate.set`, `this.pastDay.set`, `this.draft.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.loadPosition`

- **Firma:** `loadPosition(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L286) (L286–298)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.position`, `this.loadingPosition.set`, `this.positionFailed.set`, `this.service.getPosition().subscribe`, `this.service.getPosition`, `this.setPosition`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingPosition.set`, `this.positionFailed.set`
- **Consumidores:** (mismo archivo)

##### `CashControlPageComponent.setPosition`

- **Firma:** `setPosition(position: CashPosition): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L300) (L300–310)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.position`, `this.position.set`, `this.loadingPosition.set`, `this.lastRefresh.set`, `new Date().toISOString`, `new Date`, `this.selectedBankDate`, `this.draft.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.position.set`, `this.loadingPosition.set`, `this.lastRefresh.set`, `this.draft.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla), (mismo archivo)

##### `CashControlPageComponent.loadMovements`

- **Firma:** `loadMovements(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L312) (L312–327)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingMovements.set`, `this.movements`, `this.movementsFailed.set`, `this.service.getMovements`, `this.page`, `this.movements.set`, `this.totalMovements.set`, `this.pageTotals.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingMovements.set`, `this.movementsFailed.set`, `this.movements.set`, `this.totalMovements.set`, `this.pageTotals.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla), (mismo archivo)

##### `CashControlPageComponent.setDraft`

- **Firma:** `setDraft(patch: Partial<CashMovementFilters>): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L329) (L329–334)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.update`
- **Consumidores:** `cash-control-page.component.html` (plantilla), (mismo archivo)

##### `CashControlPageComponent.setSingleDate`

- **Firma:** `setSingleDate(date: string): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L337) (L337–339)
- **Propósito / descripción:** "Fecha" shortcut: a single day = same from/to.
- **Dependencias (llamadas en su cuerpo):** `this.setDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L341) (L341–345)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft`, `this.page.set`, `this.loadMovements`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla), (mismo archivo)

##### `CashControlPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L347) (L347–350)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L352) (L352–355)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.loadMovements`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.signedLabel`

- **Firma:** `signedLabel(movement: CashMovement): string` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L357) (L357–362)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.onDepositSaved`

- **Firma:** `onDepositSaved(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L364) (L364–367)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.depositOpen.set`, `this.refresh`
- **Efectos secundarios:** Actualiza estado (signals): `this.depositOpen.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.showBreakdown`

- **Firma:** `showBreakdown(movement: CashMovement): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L369) (L369–383)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingBreakdown.set`, `this.breakdown.set`, `this.service.getMovement(movement.id).subscribe`, `this.service.getMovement`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingBreakdown.set`, `this.breakdown.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.voidMessage`

- **Firma:** `voidMessage(): string` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L385) (L385–395)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.onMovementSaved`

- **Firma:** `onMovementSaved(): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L397) (L397–400)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.formMode.set`, `this.refresh`
- **Efectos secundarios:** Actualiza estado (signals): `this.formMode.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.voidMovement`

- **Firma:** `voidMovement(reason: string): void` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L402) (L402–420)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget`, `this.voiding.set`, `this.service.voidMovement(target.id, reason).subscribe`, `this.service.voidMovement`, `this.voidTarget.set`, `this.notifications.success`, `formatCurrency`, `this.refresh`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.voiding.set`, `this.voidTarget.set`
- **Consumidores:** `cash-control-page.component.html` (plantilla)

##### `CashControlPageComponent.initialTab`

- **Firma:** `initialTab(): CashTab` — [cash-control-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts#L422) (L422–425)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.route.snapshot.queryParamMap.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-spec-ts"></a>

### cash-control.util.spec.ts

- **Ruta:** [cash-control.util.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.spec.ts`, 60 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts"></a>

### cash-control.util.ts

- **Ruta:** [cash-control.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.ts`, 103 líneas)
- **Tipo:** Utilidad · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** `HH:mm` of a server instant in America/Guatemala (never the browser's zone).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control.util.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-spec-ts), [bank-day-card.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-bank-day-card-bank-day-card-component-ts), [bank-day-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-bank-day-history-bank-day-history-component-ts), [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts), [cash-counts-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-counts-panel-cash-counts-panel-component-ts), [cash-movement-form-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts), [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [cut-detail-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-detail-modal-cut-detail-modal-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts), [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts), [warehouse-transfer-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts), [warehouse-withdrawal-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts)

**Interfaces, tipos y enums:**

- `interface CashSummaryCard` (L46): sin documentación — miembros: `key`, `label`, `icon`, `totalIn`, `totalOut`, `count`

**Constantes exportadas:**

- `CASH_SUMMARY_CARDS` (L32): Summary cards of Control de Efectivo, in display order; everything else falls in "Otros". = `[ { key: 'DEPOSITO', label: 'Depósitos', icon: 'arrow-down-circle' }, { key: 'RETIRO', label: 'Retiros', icon:`
#### Función `formatGuatemalaTime` (L22–24)

- **Tipo:** función exportada
- **Firma:** `formatGuatemalaTime(iso: string \| null \| undefined): string` — [cash-control.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.ts#L22)
- **Propósito / descripción:** `HH:mm` of a server instant in America/Guatemala (never the browser's zone).
- **Dependencias:** `GUATEMALA_TIME.format`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts)

#### Función `canManageCuts` (L27–29)

- **Tipo:** función exportada
- **Firma:** `canManageCuts(role: string \| null \| undefined): boolean` — [cash-control.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.ts#L27)
- **Propósito / descripción:** True if the role may open the day and run the cuts (UX only — the backend re-checks).
- **Dependencias:** `CASH_CUT_MANAGER_ROLES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `buildSummaryCards` (L56–72)

- **Tipo:** función exportada
- **Firma:** `buildSummaryCards(buckets: CashMovementBucket[]): CashSummaryCard[]` — [cash-control.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.ts#L56)
- **Propósito / descripción:** Groups the backend's per-type buckets into the summary cards (no amount is recomputed, only grouped).
- **Dependencias:** `new Set`, `CASH_SUMMARY_CARDS.map`, `buckets.find`, `buckets.filter`, `known.has`, `cards.push`, `others.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `bucketAmount` (L75–78)

- **Tipo:** función exportada
- **Firma:** `bucketAmount(buckets: CashMovementBucket[], type: CashMovementType): number` — [cash-control.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.ts#L75)
- **Propósito / descripción:** Gross amount of one movement type in a day (entries + exits of that type), as reported by the backend.
- **Dependencias:** `buckets.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `isManualMovement` (L81–85)

- **Tipo:** función exportada
- **Firma:** `isManualMovement(movement: CashMovement): boolean` — [cash-control.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.ts#L81)
- **Propósito / descripción:** Movements registered in Control de Efectivo itself — the only ones voided from here (a bank deposit reverses both sides).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `referenceLabel` (L88–102)

- **Tipo:** función exportada
- **Firma:** `referenceLabel(movement: CashMovement): string` — [cash-control.util.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control.util.ts#L88)
- **Propósito / descripción:** Short reference to the source operation ("BANK_DEPOSIT · 1A2B3C4D").
- **Dependencias:** `movement.referenceId.slice(0, 8).toUpperCase`, `movement.referenceId.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-bank-day-card-bank-day-card-component-ts"></a>

### bank-day-card.component.ts

- **Ruta:** [bank-day-card.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-card/bank-day-card.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-card/bank-day-card.component.ts`, 47 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** "Acumulados del día operativo": daily indicators that restart at every Agentes Bancarios opening (the physical balance never does), with the selector to consult a past bank day.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [bank-day-card.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-card/bank-day-card.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="select.emit($event)"`

**Interfaces, tipos y enums:**

- `interface ViewedBankDay` (L9): The day shown by the card: the current bank day (live) or a past one (read only). — miembros: `header`, `summary`, `isPast`

#### Clase `CashBankDayCardComponent` (L21–46)

- **Decoradores:** `@Component({ selector: 'app-cash-bank-day-card', standalone: true, imports: [FormsModule, CardComponent], templateUrl: './bank-day-card.component.html', styleUrl`
- **Propósito:** "Acumulados del día operativo": daily indicators that restart at every Agentes Bancarios opening (the physical balance never does), with the selector to consult a past bank day. Presentational: every value comes from the backend through the page.
- **Datos / estado que administra:** `@Input view: ViewedBankDay`, `@Input bankDays = []`, `@Input currentBankDate = null`, `@Input selectedBankDate = null`, `@Input balance = 0`, `@Input lastRefresh = null`, `@Output select = new EventEmitter<string>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-bank-day-history-bank-day-history-component-ts"></a>

### bank-day-history.component.ts

- **Ruta:** [bank-day-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-history/bank-day-history.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-history/bank-day-history.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** "Historial por día operativo": the original indicators of each bank day (read only).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [bank-day-history.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/bank-day-history/bank-day-history.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="select.emit(day.isCurrent ? '' : day.businessDate)"`

#### Clase `CashBankDayHistoryComponent` (L11–30)

- **Decoradores:** `@Component({ selector: 'app-cash-bank-day-history', standalone: true, imports: [CardComponent], templateUrl: './bank-day-history.component.html', styleUrl: './ba`
- **Propósito:** "Historial por día operativo": the original indicators of each bank day (read only). Clicking a row consults that day.
- **Datos / estado que administra:** `@Input bankDays = []`, `@Input activeDate = null`, `@Output select = new EventEmitter<string>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-spec-ts"></a>

### cash-bank-deposit-modal.component.spec.ts

- **Ruta:** [cash-bank-deposit-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.spec.ts`, 84 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts"></a>

### cash-bank-deposit-modal.component.ts

- **Ruta:** [cash-bank-deposit-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts`, 156 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** "Depósito bancario": cash leaves the caja and is deposited into one of the registered bank accounts.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-bank-deposit-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-spec-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [cash-bank-deposit-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(click)="loadBanks()"`, `(ngModelChange)="bankId.set($event)"`, `(ngModelChange)="amount.set($event)"`, `(ngModelChange)="description.set($event)"`, `(click)="useCountedAsAmount()"`, `(quantityChange)="onQuantityChange($event)"`, `(click)="save()"`

#### Clase `CashBankDepositModalComponent` (L26–155)

- **Decoradores:** `@Component({ selector: 'app-cash-bank-deposit-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakdo`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Depósito bancario": cash leaves the caja and is deposited into one of the registered bank accounts. The denomination breakdown is mandatory and must add up exactly to the amount (same colour code as Transaccionar: green = matches, yellow = missing, red = exceeds). The "después" figures are a preview only — the backend applies both sides in one transaction, checks the cash available and the account's own rules, and returns the official balance. One `clientRequestId` per opening makes retries idempotent. Cooperativa Guayacán is not offered: its balance is its own caja.
- **Servicios inyectados con `inject()`:** `service = inject(CashControlService)`, `confirmDialog = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input currentBalance = 0`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<CashMovementResult>()`, `banks = signal<CashBankBalance[]>([])`, `loadingBanks = signal(false)`, `banksFailed = signal(false)`, `bankId = signal('')`, `amount = signal<number \| null>(null)`, `cashCounts = signal<Record<string, number>>(emptyCashCounts())`, `description = signal('')`, `isSaving = signal(false)`, `errorMessage = signal<string \| null>(null)`, `balanceSignal = signal(0)`, `selectedBank = computed(() => this.banks().find((bank) => bank.ba`, `totalCounted = computed(() => cashCountsTotal(this.cashCounts()))`, `breakdownStatus = computed<CuadreStatus>(() => { const total = this.`, `cashAfter = computed(() => round2(this.balanceSignal() - (this`, `bankAfter = computed(() => round2((this.selectedBank()?.balanc`, `insufficientCash = computed(() => (this.amount() ?? 0) > this.balance`, `canSave = computed( () => !this.isSaving() && !!this.selecte`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 80–91 | — | `void` |
| `loadBanks` | método public | 93–106 | — | `void` |
| `onQuantityChange` | método public | 108–110 | `change: { denomination: number; quantity: number }` | `void` |
| `useCountedAsAmount` | método public | 113–115 | — | `void` |
| `save` | método public async | 117–154 | — | `Promise<void>` |

##### `CashBankDepositModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [cash-bank-deposit-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts#L80) (L80–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.balanceSignal.set`, `this.isSaving`, `this.bankId.set`, `this.amount.set`, `this.cashCounts.set`, `emptyCashCounts`, `this.description.set`, `this.errorMessage.set`, `crypto.randomUUID`, `this.loadBanks`
- **Efectos secundarios:** Actualiza estado (signals): `this.balanceSignal.set`, `this.bankId.set`, `this.amount.set`, `this.cashCounts.set`, `this.description.set`, `this.errorMessage.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashBankDepositModalComponent.loadBanks`

- **Firma:** `loadBanks(): void` — [cash-bank-deposit-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts#L93) (L93–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingBanks.set`, `this.banksFailed.set`, `this.service.getBankBalances().subscribe`, `this.service.getBankBalances`, `this.banks.set`, `banks.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingBanks.set`, `this.banksFailed.set`, `this.banks.set`
- **Consumidores:** `cash-bank-deposit-modal.component.html` (plantilla), (mismo archivo)

##### `CashBankDepositModalComponent.onQuantityChange`

- **Firma:** `onQuantityChange(change: { denomination: number; quantity: number }): void` — [cash-bank-deposit-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts#L108) (L108–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.update`, `String`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.update`
- **Consumidores:** `cash-bank-deposit-modal.component.html` (plantilla)

##### `CashBankDepositModalComponent.useCountedAsAmount`

- **Firma:** `useCountedAsAmount(): void` — [cash-bank-deposit-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts#L113) (L113–115)
- **Propósito / descripción:** Fills the amount with what was counted (common case: count the bills first).
- **Dependencias (llamadas en su cuerpo):** `this.amount.set`, `this.totalCounted`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`
- **Consumidores:** `cash-bank-deposit-modal.component.html` (plantilla)

##### `CashBankDepositModalComponent.save`

- **Firma:** `save(): Promise<void>` — [cash-bank-deposit-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts#L117) (L117–154)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedBank`, `this.canSave`, `this.amount`, `this.confirmDialog.confirm`, `formatCurrency`, `this.cashAfter`, `this.bankAfter`, `this.isSaving.set`, `this.errorMessage.set`, `this.service.registerBankDeposit`, `cashCountsToDetails`, `this.cashCounts`, `this.description().trim`, `this.description`, `this.notifications.success`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.errorMessage.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `cash-bank-deposit-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-spec-ts"></a>

### cash-count-modal.component.spec.ts

- **Ruta:** [cash-count-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.spec.ts`, 101 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Prueba unitaria: declara `custody` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts"></a>

### cash-count-modal.component.ts

- **Ruta:** [cash-count-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts`, 154 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** "Arqueo de Caja": count the bills and coins physically in the caja and compare them with the theoretical caja balance.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-count-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-spec-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [cash-count-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(quantityChange)="onQuantityChange($event)"`, `(ngModelChange)="countWarehouse.set($event)"`, `(ngModelChange)="warehouseCounted.set($event)"`, `(ngModelChange)="observations.set($event)"`, `(ngModelChange)="reason.set($event)"`, `(click)="save()"`

#### Clase `CashCountModalComponent` (L29–153)

- **Decoradores:** `@Component({ selector: 'app-cash-count-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakdownTable`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Arqueo de Caja": count the bills and coins physically in the caja and compare them with the theoretical caja balance. The live difference is a preview; on save the backend reads the theoretical balance under its lock, stores the photograph and returns the official result (cuadrado / faltante / sobrante). It never adjusts the caja nor writes a Kardex movement. Bodega cash is shown separately and is never part of the caja count; it may be counted optionally for the consolidated view. With `correctionOf` it is the audited correction of an earlier count (admin): same photograph (theoretical values of that moment), new quantities and a mandatory reason; the original stays as "reemplazado".
- **Servicios inyectados con `inject()`:** `service = inject(CashCustodyService)`, `confirmDialog = inject(ConfirmDialogService)`, `auth = inject(AuthService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input custody = null`, `@Input correctionOf = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<CashCountRecord>()`, `cashCounts = signal<Record<string, number>>(emptyCashCounts())`, `observations = signal('')`, `countWarehouse = signal(false)`, `warehouseCounted = signal<number \| null>(null)`, `reason = signal('')`, `isSaving = signal(false)`, `errorMessage = signal<string \| null>(null)`, `result = signal<CashCountRecord \| null>(null)`, `openedAt = signal(new Date().toISOString())`, `theoreticalSignal = signal(0)`, `warehouseSignal = signal(0)`, `username = computed(() => this.auth.currentUser()?.username ?`, `totalCounted = computed(() => cashCountsTotal(this.cashCounts()))`, `previewDifference = computed(() => round2(this.totalCounted() - this.t`, `previewStatus = computed<CuadreStatus>(() => { const diff = this.p`, `theoretical = computed(() => this.theoreticalSignal())`, `warehouseTheoretical = computed(() => this.warehouseSignal())`, `canSave = computed( () => !this.isSaving() && (!this.correct`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 87–107 | — | `void` |
| `onQuantityChange` | método public | 109–112 | `change: { denomination: number; quantity: number }` | `void` |
| `save` | método public async | 114–152 | — | `Promise<void>` |

##### `CashCountModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [cash-count-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts#L87) (L87–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.theoreticalSignal.set`, `this.warehouseSignal.set`, `this.cashCounts.set`, `emptyCashCounts`, `Object.fromEntries`, `original.details.map`, `String`, `this.observations.set`, `this.countWarehouse.set`, `this.warehouseCounted.set`, `this.reason.set`, `this.errorMessage.set`, `this.result.set`, `this.openedAt.set`, `new Date().toISOString`, `new Date`, `crypto.randomUUID`
- **Efectos secundarios:** Actualiza estado (signals): `this.theoreticalSignal.set`, `this.warehouseSignal.set`, `this.cashCounts.set`, `this.observations.set`, `this.countWarehouse.set`, `this.warehouseCounted.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCountModalComponent.onQuantityChange`

- **Firma:** `onQuantityChange(change: { denomination: number; quantity: number }): void` — [cash-count-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts#L109) (L109–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `Math.trunc`, `Number`, `this.cashCounts.update`, `String`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.update`
- **Consumidores:** `cash-count-modal.component.html` (plantilla)

##### `CashCountModalComponent.save`

- **Firma:** `save(): Promise<void>` — [cash-count-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts#L114) (L114–152)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSave`, `this.previewDifference`, `this.confirmDialog.confirm`, `formatCurrency`, `this.totalCounted`, `this.theoretical`, `cashCountsToDetails`, `this.cashCounts`, `this.observations().trim`, `this.observations`, `this.countWarehouse`, `this.warehouseCounted`, `this.isSaving.set`, `this.errorMessage.set`, `this.service.correctCount`, `this.reason().trim`, `this.reason`, `this.service.registerCount`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.errorMessage.set`, `this.result.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `cash-count-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-counts-panel-cash-counts-panel-component-ts"></a>

### cash-counts-panel.component.ts

- **Ruta:** [cash-counts-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-counts-panel/cash-counts-panel.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-counts-panel/cash-counts-panel.component.ts`, 89 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** "Historial de arqueos": every count exactly as recorded (theoretical photograph, counted total, difference, result, denominations).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [cash-counts-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-counts-panel/cash-counts-panel.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="setFilter({ dateFrom: $event })"`, `(ngModelChange)="setFilter({ dateTo: $event })"`, `(ngModelChange)="setFilter({ businessDate: $event })"`, `(ngModelChange)="setFilter({ userId: $event })"`, `(ngModelChange)="setFilter({ result: $event })"`, `(click)="load()"`, `(click)="toggle(c.id)"`, `(click)="correct.emit(c); $event.stopPropagation()"`, `(pageChange)="onPageChange($event)"`

#### Clase `CashCountsPanelComponent` (L17–88)

- **Decoradores:** `@Component({ selector: 'app-cash-counts-panel', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, ReportPaginationComponent], templateUrl:`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Historial de arqueos": every count exactly as recorded (theoretical photograph, counted total, difference, result, denominations). Filters by date, bank day, user and result. Read only; administrators can start an audited correction of a current count (the original stays).
- **Servicios inyectados con `inject()`:** `service = inject(CashCustodyService)`, `cashService = inject(CashControlService)`
- **Datos / estado que administra:** `@Input refreshKey = 0`, `@Input canCorrect = false`, `@Output correct = new EventEmitter<CashCountRecord>()`, `filters = signal<CashCountFilters>({ dateFrom: '', dateTo: '`, `counts = signal<CashCountRecord[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(false)`, `failed = signal(false)`, `expanded = signal<string \| null>(null)`, `users = signal<{ id: string; username: string }[]>([])`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 54–56 | — | `void` |
| `setFilter` | método public | 58–62 | `patch: Partial<CashCountFilters>` | `void` |
| `onPageChange` | método public | 64–67 | `page: number` | `void` |
| `toggle` | método public | 69–71 | `id: string` | `void` |
| `load` | método public | 73–87 | — | `void` |

##### `CashCountsPanelComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [cash-counts-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-counts-panel/cash-counts-panel.component.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.load`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCountsPanelComponent.setFilter`

- **Firma:** `setFilter(patch: Partial<CashCountFilters>): void` — [cash-counts-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-counts-panel/cash-counts-panel.component.ts#L58) (L58–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.filters.update`, `this.page.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.filters.update`, `this.page.set`
- **Consumidores:** `cash-counts-panel.component.html` (plantilla)

##### `CashCountsPanelComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [cash-counts-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-counts-panel/cash-counts-panel.component.ts#L64) (L64–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `cash-counts-panel.component.html` (plantilla)

##### `CashCountsPanelComponent.toggle`

- **Firma:** `toggle(id: string): void` — [cash-counts-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-counts-panel/cash-counts-panel.component.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.expanded.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.expanded.update`
- **Consumidores:** `cash-counts-panel.component.html` (plantilla)

##### `CashCountsPanelComponent.load`

- **Firma:** `load(): void` — [cash-counts-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-counts-panel/cash-counts-panel.component.ts#L73) (L73–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.failed.set`, `this.service.getCounts`, `this.filters`, `this.page`, `this.counts.set`, `this.total.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.failed.set`, `this.counts.set`, `this.total.set`
- **Consumidores:** `cash-counts-panel.component.html` (plantilla), (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts"></a>

### cash-movement-form-modal.component.ts

- **Ruta:** [cash-movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts`, 114 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Manual cash movement registered in Control de Efectivo: Entrada/Salida (cut managers) or Ajuste/Saldo inicial (admin).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [cash-movement-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(click)="adjustmentDirection.set('IN')"`, `(click)="adjustmentDirection.set('OUT')"`, `(ngModelChange)="amount.set($event)"`, `(ngModelChange)="description.set($event)"`, `(ngModelChange)="reason.set($event)"`, `(click)="save()"`

#### Clase `CashMovementFormModalComponent` (L21–113)

- **Decoradores:** `@Component({ selector: 'app-cash-movement-form-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective], templateU`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Manual cash movement registered in Control de Efectivo: Entrada/Salida (cut managers) or Ajuste/Saldo inicial (admin). Reason is mandatory. The "saldo después" line is a preview only — the backend computes the real balance under its lock and returns it. One `clientRequestId` per opening makes a double click/retry return the same movement (idempotency).
- **Servicios inyectados con `inject()`:** `service = inject(CashControlService)`, `confirmDialog = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input mode = 'ENTRADA_MANUAL'`, `@Input currentBalance = 0`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<CashMovementResult>()`, `amount = signal<number \| null>(null)`, `adjustmentDirection = signal<'IN' \| 'OUT'>('IN')`, `description = signal('')`, `reason = signal('')`, `isSaving = signal(false)`, `errorMessage = signal<string \| null>(null)`, `modeSignal = signal<ManualCashMovementType>('ENTRADA_MANUAL')`, `balanceSignal = signal(0)`, `isOutflow = computed( () => this.modeSignal() === 'SALIDA_MANU`, `previewBalance = computed(() => { const amount = this.amount() ?? 0`, `canSave = computed(() => (this.amount() ?? 0) > 0 && this.re`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 65–76 | — | `void` |
| `save` | método public async | 78–112 | — | `Promise<void>` |

##### `CashMovementFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [cash-movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts#L65) (L65–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.modeSignal.set`, `this.balanceSignal.set`, `this.isSaving`, `this.amount.set`, `this.adjustmentDirection.set`, `this.description.set`, `this.reason.set`, `this.errorMessage.set`, `crypto.randomUUID`
- **Efectos secundarios:** Actualiza estado (signals): `this.modeSignal.set`, `this.balanceSignal.set`, `this.amount.set`, `this.adjustmentDirection.set`, `this.description.set`, `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashMovementFormModalComponent.save`

- **Firma:** `save(): Promise<void>` — [cash-movement-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts#L78) (L78–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSave`, `this.amount`, `this.confirmDialog.confirm`, `this.typeLabel[this.mode].toLowerCase`, `this.isOutflow`, `formatCurrency`, `this.previewBalance`, `this.isSaving.set`, `this.errorMessage.set`, `this.service.registerMovement`, `this.adjustmentDirection`, `this.description().trim`, `this.description`, `this.reason().trim`, `this.reason`, `this.notifications.success`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.errorMessage.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `cash-movement-form-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts"></a>

### cut-control-panel.component.ts

- **Ruta:** [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts`, 249 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** "Configuración y control de cortes": opening of the operational day (inherited cash, never invented), the two cuts with scheduled vs actual times, start/finish/reopen actions and the final close of the day.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts), [cut-detail-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-detail-modal-cut-detail-modal-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [reason-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-reason-modal-reason-modal-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`, `rxjs`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [cut-control-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [cut-detail-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-detail-modal-cut-detail-modal-component-ts), [reason-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-reason-modal-reason-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="firstStart.set($event)"`, `(ngModelChange)="firstEnd.set($event)"`, `(ngModelChange)="secondStart.set($event)"`, `(ngModelChange)="secondEnd.set($event)"`, `(ngModelChange)="manualOpening.set($event)"`, `(ngModelChange)="manualAmount.set($event)"`, `(ngModelChange)="manualReason.set($event)"`, `(click)="openDay()"`, `(ngModelChange)="updateScheduleDraft(period.id, 'start', $event)"`, `(ngModelChange)="updateScheduleDraft(period.id, 'end', $event)"`, `(click)="requestScheduleSave(period)"`, `(click)="startCut(period)"`, `(click)="finishPeriod.set(period)"`, `(click)="detailPeriodId.set(period.id)"`, `(click)="reasonAction.set({ kind: 'reopen', period: period })"`

**Interfaces, tipos y enums:**

- `type ReasonAction` (L25) = `{ kind: 'schedule'; period: CashCutPeriod } \| { kind: 'reopen'; period: CashCutPeriod }`

#### Clase `CashCutControlPanelComponent` (L35–248)

- **Decoradores:** `@Component({ selector: 'app-cash-cut-control-panel', standalone: true, imports: [ FormsModule, ButtonComponent, CardComponent, IconComponent, DecimalInputDirecti`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Configuración y control de cortes": opening of the operational day (inherited cash, never invented), the two cuts with scheduled vs actual times, start/finish/reopen actions and the final close of the day. Every action calls the backend and replaces the whole position with the response (`changed`) — no state is derived locally. Buttons are hidden by role for UX; the API enforces RBAC independently.
- **Servicios inyectados con `inject()`:** `service = inject(CashControlService)`, `confirmDialog = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `@Input position: CashPosition`, `@Input canManage = false`, `@Input isAdmin = false`, `@Output changed = new EventEmitter<CashPosition>()`, `firstStart = signal('07:00')`, `firstEnd = signal('13:00')`, `secondStart = signal('13:00')`, `secondEnd = signal('19:00')`, `manualOpening = signal(false)`, `manualAmount = signal<number \| null>(null)`, `manualReason = signal('')`, `scheduleDraft = signal<Record<string, { start: string; end: string`, `busy = signal(false)`, `finishPeriod = signal<CashCutPeriod \| null>(null)`, `detailPeriodId = signal<string \| null>(null)`, `reasonAction = signal<ReasonAction \| null>(null)`, `closeObservations = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatDateTime` | propiedad-función public | 69–69 | `iso: string \| null` | (inferido) |
| `ngOnChanges` | método public | 89–95 | — | `void` |
| `updateScheduleDraft` | método public | 97–99 | `periodId: string`, `field: 'start' \| 'end'`, `value: string` | `void` |
| `scheduleChanged` | método public | 101–107 | `period: CashCutPeriod` | `boolean` |
| `scheduleError` | método public | 110–129 | `period: CashCutPeriod` | `string \| null` |
| `openingScheduleError` | método public | 131–139 | — | `string \| null` |
| `canStart` | método public | 141–146 | `period: CashCutPeriod` | `boolean` |
| `canReopen` | método public | 149–154 | `period: CashCutPeriod` | `boolean` |
| `openDay` | método public async | 156–181 | — | `Promise<void>` |
| `startCut` | método public async | 183–192 | `period: CashCutPeriod` | `Promise<void>` |
| `requestScheduleSave` | método public | 194–198 | `period: CashCutPeriod` | `void` |
| `onReason` | método public | 200–211 | `reason: string` | `void` |
| `closeDay` | método public async | 213–226 | — | `Promise<void>` |
| `onFinished` | método public | 228–231 | `position: CashPosition` | `void` |
| `run` | método private | 233–247 | `request: Observable<CashPosition>`, `success: string` | `void` |

##### `CashCutControlPanelComponent.formatDateTime`

- **Firma:** `formatDateTime(iso: string \| null)` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L69) (L69–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatGuatemalaDateTime`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L89) (L89–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatGuatemalaTime`, `this.scheduleDraft.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.scheduleDraft.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCutControlPanelComponent.updateScheduleDraft`

- **Firma:** `updateScheduleDraft(periodId: string, field: 'start' \| 'end', value: string): void` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scheduleDraft.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.scheduleDraft.update`
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.scheduleChanged`

- **Firma:** `scheduleChanged(period: CashCutPeriod): boolean` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L101) (L101–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scheduleDraft`, `formatGuatemalaTime`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.scheduleError`

- **Firma:** `scheduleError(period: CashCutPeriod): string \| null` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L110) (L110–129)
- **Propósito / descripción:** Same rule as the backend, for an immediate hint.
- **Dependencias (llamadas en su cuerpo):** `this.scheduleDraft`, `this.position.periods.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla), (mismo archivo)

##### `CashCutControlPanelComponent.openingScheduleError`

- **Firma:** `openingScheduleError(): string \| null` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L131) (L131–139)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.firstEnd`, `this.firstStart`, `this.secondEnd`, `this.secondStart`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla), (mismo archivo)

##### `CashCutControlPanelComponent.canStart`

- **Firma:** `canStart(period: CashCutPeriod): boolean` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L141) (L141–146)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.position.periods.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.canReopen`

- **Firma:** `canReopen(period: CashCutPeriod): boolean` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L149) (L149–154)
- **Propósito / descripción:** Only the latest finalized cut of an open day can be reopened (admin).
- **Dependencias (llamadas en su cuerpo):** `this.position.periods.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.openDay`

- **Firma:** `openDay(): Promise<void>` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L156) (L156–181)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.openingScheduleError`, `this.manualOpening`, `this.confirmDialog.confirm`, `formatCurrency`, `this.manualAmount`, `this.run`, `this.service.openDay`, `this.firstStart`, `this.firstEnd`, `this.secondStart`, `this.secondEnd`, `this.manualReason().trim`, `this.manualReason`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.startCut`

- **Firma:** `startCut(period: CashCutPeriod): Promise<void>` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L183) (L183–192)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialog.confirm`, `this.cutName[period.periodNumber].toLowerCase`, `this.run`, `this.service.startCut`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.requestScheduleSave`

- **Firma:** `requestScheduleSave(period: CashCutPeriod): void` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L194) (L194–198)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scheduleError`, `this.reasonAction.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reasonAction.set`
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.onReason`

- **Firma:** `onReason(reason: string): void` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L200) (L200–211)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reasonAction`, `this.scheduleDraft`, `this.run`, `this.service.updateSchedule`, `this.service.reopenCut`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.closeDay`

- **Firma:** `closeDay(): Promise<void>` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L213) (L213–226)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialog.confirm`, `this.run`, `this.service.closeDay`, `this.closeObservations().trim`, `this.closeObservations`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.onFinished`

- **Firma:** `onFinished(position: CashPosition): void` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L228) (L228–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.finishPeriod.set`, `this.changed.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.finishPeriod.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** `cut-control-panel.component.html` (plantilla)

##### `CashCutControlPanelComponent.run`

- **Firma:** `run(request: Observable<CashPosition>, success: string): void` — [cut-control-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts#L233) (L233–247)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.busy.set`, `request.subscribe`, `this.reasonAction.set`, `this.notifications.success`, `this.changed.emit`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.busy.set`, `this.reasonAction.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-detail-modal-cut-detail-modal-component-ts"></a>

### cut-detail-modal.component.ts

- **Ruta:** [cut-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-detail-modal/cut-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-detail-modal/cut-detail-modal.component.ts`, 82 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Read-only detail of one cut (`GET /cash-control/cuts/:id`): the stored snapshot (never recomputed), current and superseded arqueos, bank reconciliation, audit trail (started/finished/reopened), schedule changes and the Kardex movements of its range.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts), [cut-control-panel.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts) (plantilla), [cut-history.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts) (plantilla)
- **Plantilla:** [cut-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-detail-modal/cut-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(click)="$event.stopPropagation()"`, `(click)="load(periodId)"`

#### Clase `CashCutDetailModalComponent` (L23–81)

- **Decoradores:** `@Component({ selector: 'app-cash-cut-detail-modal', standalone: true, imports: [IconComponent], templateUrl: './cut-detail-modal.component.html', styleUrl: './cu`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Read-only detail of one cut (`GET /cash-control/cuts/:id`): the stored snapshot (never recomputed), current and superseded arqueos, bank reconciliation, audit trail (started/finished/reopened), schedule changes and the Kardex movements of its range. Shared by the cut panel and the Historial de Cortes.
- **Servicios inyectados con `inject()`:** `service = inject(CashControlService)`
- **Datos / estado que administra:** `@Input periodId = null`, `@Output closed = new EventEmitter<void>()`, `detail = signal<CashCutDetail \| null>(null)`, `loading = signal(false)`, `failed = signal(false)`, `currentCount = computed(() => this.detail()?.counts.find((count) `, `currentBanks = computed(() => { const count = this.currentCount()`, `supersededCounts = computed(() => this.detail()?.counts.filter((count`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatDateTime` | propiedad-función public | 44–44 | `iso: string \| null` | (inferido) |
| `ngOnChanges` | método public | 59–65 | — | `void` |
| `load` | método public | 67–80 | `periodId: string` | `void` |

##### `CashCutDetailModalComponent.formatDateTime`

- **Firma:** `formatDateTime(iso: string \| null)` — [cut-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-detail-modal/cut-detail-modal.component.ts#L44) (L44–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatGuatemalaDateTime`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-detail-modal.component.html` (plantilla)

##### `CashCutDetailModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [cut-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-detail-modal/cut-detail-modal.component.ts#L59) (L59–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.load`, `this.detail.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.detail.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCutDetailModalComponent.load`

- **Firma:** `load(periodId: string): void` — [cut-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-detail-modal/cut-detail-modal.component.ts#L67) (L67–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.failed.set`, `this.service.getCutDetail(periodId).subscribe`, `this.service.getCutDetail`, `this.detail.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.failed.set`, `this.detail.set`
- **Consumidores:** [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts), [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts), `cut-detail-modal.component.html` (plantilla), (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts"></a>

### cut-finish-modal.component.ts

- **Ruta:** [cut-finish-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts`, 177 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** "Finalizar corte": arqueo by denomination (Q200 … Q0.05) compared live against the system cash of the Kardex, plus verification of every active bank account.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [cut-control-panel.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts) (plantilla)
- **Plantilla:** [cut-finish-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(quantityChange)="onQuantityChange($event)"`, `(ngModelChange)="cashObservations.set($event)"`, `(click)="loadBanks()"`, `(ngModelChange)="updateBank(bank.bankId, { verified: $event })"`, `(ngModelChange)="updateBank(bank.bankId, { observations: $event })"`, `(ngModelChange)="observations.set($event)"`, `(click)="save()"`

**Interfaces, tipos y enums:**

- `interface BankRow` (L23) extends CashBankBalance: sin documentación — miembros: `verified`, `observations`

#### Clase `CashCutFinishModalComponent` (L36–176)

- **Decoradores:** `@Component({ selector: 'app-cash-cut-finish-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakdown`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Finalizar corte": arqueo by denomination (Q200 … Q0.05) compared live against the system cash of the Kardex, plus verification of every active bank account. Difference = counted − system. All previews here are UX only: the backend recomputes the system cash and every difference under its lock and stores the permanent snapshot; nothing is "adjusted" to hide a difference.
- **Servicios inyectados con `inject()`:** `service = inject(CashControlService)`, `confirmDialog = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input period = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<CashPosition>()`, `cashCounts = signal<Record<string, number>>(emptyCashCounts())`, `cashObservations = signal('')`, `observations = signal('')`, `banks = signal<BankRow[]>([])`, `loadingBanks = signal(false)`, `banksFailed = signal(false)`, `isSaving = signal(false)`, `errorMessage = signal<string \| null>(null)`, `now = signal(new Date().toISOString())`, `systemCash = signal(0)`, `periodSignal = signal<CashCutPeriod \| null>(null)`, `expectedPhysical = computed(() => { const period = this.periodSignal(`, `totalCounted = computed(() => cashCountsTotal(this.cashCounts()))`, `difference = computed(() => round2(this.totalCounted() - this.s`, `status = computed<CuadreStatus>(() => { const difference = `, `bankDifferenceTotal = computed(() => round2(this.banks().reduce((sum, ba`, `canSave = computed( () => !this.isSaving() && !this.loadingB`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 94–106 | — | `void` |
| `loadBanks` | método public | 108–122 | — | `void` |
| `onQuantityChange` | método public | 124–126 | `change: { denomination: number; quantity: number }` | `void` |
| `updateBank` | método public | 128–130 | `bankId: string`, `patch: Partial<Pick<BankRow, 'verified' \| 'observations'>>` | `void` |
| `bankDifference` | método public | 132–134 | `bank: BankRow` | `number` |
| `save` | método public async | 136–175 | — | `Promise<void>` |

##### `CashCutFinishModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [cut-finish-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts#L94) (L94–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.systemCash.set`, `this.periodSignal.set`, `this.cashCounts.set`, `emptyCashCounts`, `this.cashObservations.set`, `this.observations.set`, `this.errorMessage.set`, `this.now.set`, `new Date().toISOString`, `new Date`, `this.loadBanks`
- **Efectos secundarios:** Actualiza estado (signals): `this.systemCash.set`, `this.periodSignal.set`, `this.cashCounts.set`, `this.cashObservations.set`, `this.observations.set`, `this.errorMessage.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCutFinishModalComponent.loadBanks`

- **Firma:** `loadBanks(): void` — [cut-finish-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts#L108) (L108–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingBanks.set`, `this.banksFailed.set`, `this.service.getBankBalances().subscribe`, `this.service.getBankBalances`, `this.banks.set`, `banks.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingBanks.set`, `this.banksFailed.set`, `this.banks.set`
- **Consumidores:** `cut-finish-modal.component.html` (plantilla), (mismo archivo)

##### `CashCutFinishModalComponent.onQuantityChange`

- **Firma:** `onQuantityChange(change: { denomination: number; quantity: number }): void` — [cut-finish-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts#L124) (L124–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.update`, `String`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.update`
- **Consumidores:** `cut-finish-modal.component.html` (plantilla)

##### `CashCutFinishModalComponent.updateBank`

- **Firma:** `updateBank(bankId: string, patch: Partial<Pick<BankRow, 'verified' \| 'observations'>>): void` — [cut-finish-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts#L128) (L128–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.banks.update`, `rows.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.banks.update`
- **Consumidores:** `cut-finish-modal.component.html` (plantilla)

##### `CashCutFinishModalComponent.bankDifference`

- **Firma:** `bankDifference(bank: BankRow): number` — [cut-finish-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts#L132) (L132–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `round2`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-finish-modal.component.html` (plantilla)

##### `CashCutFinishModalComponent.save`

- **Firma:** `save(): Promise<void>` — [cut-finish-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts#L136) (L136–175)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSave`, `this.difference`, `this.confirmDialog.confirm`, `this.cutName[this.period.periodNumber].toLowerCase`, `formatCurrency`, `this.totalCounted`, `this.systemCash`, `formatDifference`, `this.isSaving.set`, `this.errorMessage.set`, `this.service.finishCut`, `cashCountsToDetails`, `this.cashCounts`, `this.banks().map`, `this.banks`, `bank.observations.trim`, `this.cashObservations().trim`, `this.cashObservations`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.errorMessage.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `cut-finish-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts"></a>

### cut-history.component.ts

- **Ruta:** [cut-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.ts`, 102 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Historial de Cortes — one block per operational day with its two cuts (scheduled/actual times, responsible users, status, opening/closing cash, difference of each cut, bank reconciliation).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts), [cut-detail-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-detail-modal-cut-detail-modal-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [cut-history.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [cut-detail-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-detail-modal-cut-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(ngModelChange)="setDraft({ dateFrom: $event })"`, `(ngModelChange)="setDraft({ dateTo: $event })"`, `(ngModelChange)="setDraft({ periodNumber: $event })"`, `(ngModelChange)="setDraft({ status: $event })"`, `(ngModelChange)="setDraft({ userId: $event })"`, `(click)="applyFilters()"`, `(click)="clearFilters()"`, `(click)="load()"`, `(click)="detailPeriodId.set(period.id)"`, `(pageChange)="onPageChange($event)"`, `(closed)="detailPeriodId.set(null)"`

#### Clase `CashCutHistoryComponent` (L25–101)

- **Decoradores:** `@Component({ selector: 'app-cash-cut-history', standalone: true, imports: [FormsModule, ButtonComponent, CardComponent, IconComponent, ReportPaginationComponent,`
- **Propósito:** Historial de Cortes — one block per operational day with its two cuts (scheduled/actual times, responsible users, status, opening/closing cash, difference of each cut, bank reconciliation). Stored snapshots only: values are never recomputed. Filters use the draft/applied pattern of Reportería (nothing is fetched until "Aplicar").
- **Servicios inyectados con `inject()`:** `service = inject(CashControlService)`
- **Datos / estado que administra:** `users = signal<{ id: string; username: string }[]>([])`, `rows = signal<CashDayHistoryRow[]>([])`, `total = signal(0)`, `page = signal(1)`, `loading = signal(true)`, `failed = signal(false)`, `detailPeriodId = signal<string \| null>(null)`, `draft = signal<CashDayFilters>({ dateFrom: '', dateTo: '',`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `setDraft` | método public | 62–64 | `patch: Partial<CashDayFilters>` | `void` |
| `applyFilters` | método public | 66–70 | — | `void` |
| `clearFilters` | método public | 72–75 | — | `void` |
| `onPageChange` | método public | 77–80 | `page: number` | `void` |
| `load` | método public | 82–96 | — | `void` |
| `cut` | método public | 98–100 | `row: CashDayHistoryRow`, `number: 1 \| 2` | `CashCutPeriod \| undefined` |

##### `CashCutHistoryComponent.setDraft`

- **Firma:** `setDraft(patch: Partial<CashDayFilters>): void` — [cut-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.ts#L62) (L62–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.update`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), `cut-history.component.html` (plantilla)

##### `CashCutHistoryComponent.applyFilters`

- **Firma:** `applyFilters(): void` — [cut-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.ts#L66) (L66–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft`, `this.page.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), `cut-history.component.html` (plantilla), (mismo archivo)

##### `CashCutHistoryComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [cut-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.ts#L72) (L72–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draft.set`, `this.applyFilters`
- **Efectos secundarios:** Actualiza estado (signals): `this.draft.set`
- **Consumidores:** `cut-history.component.html` (plantilla)

##### `CashCutHistoryComponent.onPageChange`

- **Firma:** `onPageChange(page: number): void` — [cut-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.ts#L77) (L77–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.page.set`, `this.load`
- **Efectos secundarios:** Actualiza estado (signals): `this.page.set`
- **Consumidores:** `cut-history.component.html` (plantilla)

##### `CashCutHistoryComponent.load`

- **Firma:** `load(): void` — [cut-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.ts#L82) (L82–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.failed.set`, `this.service.getDays`, `this.page`, `this.rows.set`, `this.total.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.failed.set`, `this.rows.set`, `this.total.set`
- **Consumidores:** `cut-history.component.html` (plantilla), (mismo archivo)

##### `CashCutHistoryComponent.cut`

- **Firma:** `cut(row: CashDayHistoryRow, number: 1 \| 2): CashCutPeriod \| undefined` — [cut-history.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-history/cut-history.component.ts#L98) (L98–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `row.periods.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `cut-history.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-reason-modal-reason-modal-component-ts"></a>

### reason-modal.component.ts

- **Ruta:** [reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/reason-modal/reason-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/reason-modal/reason-modal.component.ts`, 65 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Small "reason required" prompt shared by Control de Efectivo's audited actions (void a movement, reopen a cut, change a schedule).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla), [cut-control-panel.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts) (plantilla), [warehouse-panel.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts) (plantilla)

#### Clase `CashReasonModalComponent` (L12–64)

- **Decoradores:** `@Component({ selector: 'app-cash-reason-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent], template: ' @if (open) { <div class="mo`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Small "reason required" prompt shared by Control de Efectivo's audited actions (void a movement, reopen a cut, change a schedule). Dumb: the parent performs the call and closes it. Minimum 5 characters, the same rule the backend enforces.
- **Datos / estado que administra:** `@Input open = false`, `@Input title = 'Indique el motivo'`, `@Input message = ''`, `@Input confirmText = 'Confirmar'`, `@Input danger = false`, `@Input busy = false`, `@Output confirmed = new EventEmitter<string>()`, `@Output cancelled = new EventEmitter<void>()`, `reason = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 59–63 | — | `void` |

##### `CashReasonModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [reason-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/reason-modal/reason-modal.component.ts#L59) (L59–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reason.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.reason.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts"></a>

### warehouse-panel.component.ts

- **Ruta:** [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts`, 192 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Bodega: its balance (own Kardex), the deliveries received from the caja (each linked to its caja movement: both Kardex sequence numbers are shown) and the Bodega Kardex.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts), [reason-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-reason-modal-reason-modal-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [warehouse-panel.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [report-pagination.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-report-pagination-report-pagination-component-ts), [reason-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-reason-modal-reason-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="deliver.emit()"`, `(click)="withdraw.emit()"`, `(ngModelChange)="initialAmount.set($event)"`, `(ngModelChange)="initialReason.set($event)"`, `(click)="saveInitialBalance()"`, `(click)="voidTarget.set(t)"`, `(pageChange)="onTransfersPage($event)"`, `(click)="voidWithdrawalTarget.set(w)"`, `(pageChange)="onWithdrawalsPage($event)"`, `(pageChange)="onMovementsPage($event)"`, `(confirmed)="confirmVoidWithdrawal($event)"`, `(cancelled)="voidWithdrawalTarget.set(null)"`, `(confirmed)="confirmVoid($event)"`, `(cancelled)="voidTarget.set(null)"`

#### Clase `WarehousePanelComponent` (L28–191)

- **Decoradores:** `@Component({ selector: 'app-warehouse-panel', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, ReportPaginationCom`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Bodega: its balance (own Kardex), the deliveries received from the caja (each linked to its caja movement: both Kardex sequence numbers are shown) and the Bodega Kardex. Administrators can void a delivery (both sides are reversed together, with a reason) and load Bodega's one-time initial balance. Nothing here computes a balance.
- **Servicios inyectados con `inject()`:** `service = inject(CashCustodyService)`, `notifications = inject(NotificationService)`
- **Datos / estado que administra:** `@Input custody = null`, `@Input isAdmin = false`, `@Input canOperate = false`, `@Input refreshKey = 0`, `@Output deliver = new EventEmitter<void>()`, `@Output withdraw = new EventEmitter<void>()`, `@Output changed = new EventEmitter<void>()`, `transfers = signal<WarehouseTransfer[]>([])`, `transfersTotal = signal(0)`, `transfersPage = signal(1)`, `withdrawals = signal<WarehouseWithdrawal[]>([])`, `withdrawalsTotal = signal(0)`, `withdrawalsPage = signal(1)`, `voidWithdrawalTarget = signal<WarehouseWithdrawal \| null>(null)`, `movements = signal<WarehouseMovement[]>([])`, `movementsTotal = signal(0)`, `movementsPage = signal(1)`, `failed = signal(false)`, `voidTarget = signal<WarehouseTransfer \| null>(null)`, `voiding = signal(false)`, `initialAmount = signal<number \| null>(null)`, `initialReason = signal('')`, `savingInitial = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 81–85 | — | `void` |
| `loadWithdrawals` | método public | 87–95 | — | `void` |
| `onWithdrawalsPage` | método public | 97–100 | `page: number` | `void` |
| `confirmVoidWithdrawal` | método public | 102–120 | `reason: string` | `void` |
| `loadTransfers` | método public | 122–130 | — | `void` |
| `loadMovements` | método public | 132–140 | — | `void` |
| `onTransfersPage` | método public | 142–145 | `page: number` | `void` |
| `onMovementsPage` | método public | 147–150 | `page: number` | `void` |
| `confirmVoid` | método public | 152–170 | `reason: string` | `void` |
| `saveInitialBalance` | método public | 172–190 | — | `void` |

##### `WarehousePanelComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L81) (L81–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadTransfers`, `this.loadWithdrawals`, `this.loadMovements`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `WarehousePanelComponent.loadWithdrawals`

- **Firma:** `loadWithdrawals(): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L87) (L87–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.service.getWithdrawals`, `this.withdrawalsPage`, `this.withdrawals.set`, `this.withdrawalsTotal.set`, `this.failed.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.withdrawals.set`, `this.withdrawalsTotal.set`, `this.failed.set`
- **Consumidores:** (mismo archivo)

##### `WarehousePanelComponent.onWithdrawalsPage`

- **Firma:** `onWithdrawalsPage(page: number): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L97) (L97–100)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.withdrawalsPage.set`, `this.loadWithdrawals`
- **Efectos secundarios:** Actualiza estado (signals): `this.withdrawalsPage.set`
- **Consumidores:** `warehouse-panel.component.html` (plantilla)

##### `WarehousePanelComponent.confirmVoidWithdrawal`

- **Firma:** `confirmVoidWithdrawal(reason: string): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L102) (L102–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidWithdrawalTarget`, `this.voiding`, `this.voiding.set`, `this.service.voidWithdrawal(target.id, reason).subscribe`, `this.service.voidWithdrawal`, `this.voidWithdrawalTarget.set`, `this.notifications.success`, `this.changed.emit`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.voiding.set`, `this.voidWithdrawalTarget.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** `warehouse-panel.component.html` (plantilla)

##### `WarehousePanelComponent.loadTransfers`

- **Firma:** `loadTransfers(): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L122) (L122–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.service.getTransfers({ page: this.transfersPage(), limit: this.pageSize }).subscribe`, `this.service.getTransfers`, `this.transfersPage`, `this.transfers.set`, `this.transfersTotal.set`, `this.failed.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.transfers.set`, `this.transfersTotal.set`, `this.failed.set`
- **Consumidores:** (mismo archivo)

##### `WarehousePanelComponent.loadMovements`

- **Firma:** `loadMovements(): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L132) (L132–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.service.getWarehouseMovements(this.movementsPage(), this.pageSize).subscribe`, `this.service.getWarehouseMovements`, `this.movementsPage`, `this.movements.set`, `this.movementsTotal.set`, `this.failed.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.movements.set`, `this.movementsTotal.set`, `this.failed.set`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), (mismo archivo)

##### `WarehousePanelComponent.onTransfersPage`

- **Firma:** `onTransfersPage(page: number): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L142) (L142–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transfersPage.set`, `this.loadTransfers`
- **Efectos secundarios:** Actualiza estado (signals): `this.transfersPage.set`
- **Consumidores:** `warehouse-panel.component.html` (plantilla)

##### `WarehousePanelComponent.onMovementsPage`

- **Firma:** `onMovementsPage(page: number): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L147) (L147–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.movementsPage.set`, `this.loadMovements`
- **Efectos secundarios:** Actualiza estado (signals): `this.movementsPage.set`
- **Consumidores:** `warehouse-panel.component.html` (plantilla)

##### `WarehousePanelComponent.confirmVoid`

- **Firma:** `confirmVoid(reason: string): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L152) (L152–170)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.voidTarget`, `this.voiding`, `this.voiding.set`, `this.service.voidTransfer(target.id, reason).subscribe`, `this.service.voidTransfer`, `this.voidTarget.set`, `this.notifications.success`, `this.changed.emit`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.voiding.set`, `this.voidTarget.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** `warehouse-panel.component.html` (plantilla)

##### `WarehousePanelComponent.saveInitialBalance`

- **Firma:** `saveInitialBalance(): void` — [warehouse-panel.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts#L172) (L172–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.initialAmount`, `this.initialReason().trim`, `this.initialReason`, `this.savingInitial`, `this.savingInitial.set`, `this.service.registerWarehouseInitialBalance`, `crypto.randomUUID`, `this.notifications.success`, `this.changed.emit`, `this.notifications.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.savingInitial.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** `warehouse-panel.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-spec-ts"></a>

### warehouse-transfer-modal.component.spec.ts

- **Ruta:** [warehouse-transfer-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.spec.ts`, 108 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Prueba unitaria: declara `custody` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [warehouse-transfer-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts"></a>

### warehouse-transfer-modal.component.ts

- **Ruta:** [warehouse-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.ts`, 151 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** "Entrega de Efectivo a Bodega": an internal transfer — caja goes down, Bodega goes up by the same amount, total custody unchanged; never an expense.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [warehouse-transfer-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-spec-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [warehouse-transfer-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(ngModelChange)="amount.set($event)"`, `(ngModelChange)="voucher.set($event)"`, `(ngModelChange)="deliveredBy.set($event)"`, `(ngModelChange)="receivedBy.set($event)"`, `(ngModelChange)="observations.set($event)"`, `(ngModelChange)="withBreakdown.set($event)"`, `(click)="useCountedAsAmount()"`, `(quantityChange)="onQuantityChange($event)"`, `(click)="save()"`

#### Clase `WarehouseTransferModalComponent` (L26–150)

- **Decoradores:** `@Component({ selector: 'app-warehouse-transfer-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakd`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Entrega de Efectivo a Bodega": an internal transfer — caja goes down, Bodega goes up by the same amount, total custody unchanged; never an expense. The breakdown is the default; registering only a total is allowed to administrators (business policy) and is flagged as such. The "después" figures are a preview: the backend checks the caja balance under its lock and applies both Kardex in one transaction. One `clientRequestId` per opening makes a double click harmless.
- **Servicios inyectados con `inject()`:** `service = inject(CashCustodyService)`, `confirmDialog = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`, `auth = inject(AuthService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input custody = null`, `@Input canSkipBreakdown = false`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<{ transfer: WarehouseTransfer; cu`, `amount = signal<number \| null>(null)`, `withBreakdown = signal(true)`, `cashCounts = signal<Record<string, number>>(emptyCashCounts())`, `deliveredBy = signal('')`, `receivedBy = signal('')`, `voucher = signal('')`, `observations = signal('')`, `isSaving = signal(false)`, `errorMessage = signal<string \| null>(null)`, `totalCounted = computed(() => cashCountsTotal(this.cashCounts()))`, `breakdownStatus = computed<CuadreStatus>(() => { const total = this.`, `cashBalance = computed(() => this.custody?.cashBalance ?? 0)`, `cashAfter = computed(() => round2(this.cashBalance() - (this.a`, `warehouseAfter = computed(() => round2((this.custody?.warehouseBala`, `insufficientCash = computed(() => (this.amount() ?? 0) > this.cashBal`, `dayOpen = computed(() => !!this.custody?.currentDay?.isOpen)`, `peopleValid = computed(() => this.deliveredBy().trim().length >=`, `canSave = computed( () => !this.isSaving() && this.dayOpen()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 85–97 | — | `void` |
| `onQuantityChange` | método public | 99–101 | `change: { denomination: number; quantity: number }` | `void` |
| `useCountedAsAmount` | método public | 103–105 | — | `void` |
| `save` | método public async | 107–149 | — | `Promise<void>` |

##### `WarehouseTransferModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [warehouse-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.ts#L85) (L85–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.amount.set`, `this.withBreakdown.set`, `this.cashCounts.set`, `emptyCashCounts`, `this.deliveredBy.set`, `this.auth.currentUser`, `this.receivedBy.set`, `this.voucher.set`, `this.observations.set`, `this.errorMessage.set`, `crypto.randomUUID`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`, `this.withBreakdown.set`, `this.cashCounts.set`, `this.deliveredBy.set`, `this.receivedBy.set`, `this.voucher.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `WarehouseTransferModalComponent.onQuantityChange`

- **Firma:** `onQuantityChange(change: { denomination: number; quantity: number }): void` — [warehouse-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.update`, `String`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.update`
- **Consumidores:** `warehouse-transfer-modal.component.html` (plantilla)

##### `WarehouseTransferModalComponent.useCountedAsAmount`

- **Firma:** `useCountedAsAmount(): void` — [warehouse-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.ts#L103) (L103–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.amount.set`, `this.totalCounted`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`
- **Consumidores:** `warehouse-transfer-modal.component.html` (plantilla)

##### `WarehouseTransferModalComponent.save`

- **Firma:** `save(): Promise<void>` — [warehouse-transfer-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-transfer-modal/warehouse-transfer-modal.component.ts#L107) (L107–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSave`, `this.amount`, `this.confirmDialog.confirm`, `formatCurrency`, `this.deliveredBy().trim`, `this.deliveredBy`, `this.receivedBy().trim`, `this.receivedBy`, `this.withBreakdown`, `this.cashAfter`, `this.warehouseAfter`, `this.isSaving.set`, `this.errorMessage.set`, `this.service.registerTransfer`, `cashCountsToDetails`, `this.cashCounts`, `this.voucher().trim`, `this.voucher`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.errorMessage.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `warehouse-transfer-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-spec-ts"></a>

### warehouse-withdrawal-modal.component.spec.ts

- **Ruta:** [warehouse-withdrawal-modal.component.spec.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.spec.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.spec.ts`, 102 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** Prueba unitaria: declara `custody` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [warehouse-withdrawal-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts"></a>

### warehouse-withdrawal-modal.component.ts

- **Ruta:** [warehouse-withdrawal-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts`, 172 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-cash-control`
- **Responsabilidad:** "Retiro de Bodega": cash leaves Bodega and either goes back to the caja (internal transfer, total custody unchanged) or is deposited into a registered bank account (Bodega down, bank up).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts), [cash-custody.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [cash-control.util.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-util-ts)
- **Paquetes externos:** `@angular/core`, `@angular/common`, `@angular/forms`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [warehouse-withdrawal-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-spec-ts), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla)
- **Plantilla:** [warehouse-withdrawal-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closed.emit()"`, `(click)="destination.set('CAJA')"`, `(click)="destination.set('BANCO')"`, `(ngModelChange)="bankId.set($event)"`, `(ngModelChange)="amount.set($event)"`, `(ngModelChange)="voucher.set($event)"`, `(ngModelChange)="deliveredBy.set($event)"`, `(ngModelChange)="receivedBy.set($event)"`, `(ngModelChange)="observations.set($event)"`, `(ngModelChange)="withBreakdown.set($event)"`, `(click)="useCountedAsAmount()"`, `(quantityChange)="onQuantityChange($event)"`, `(click)="save()"`

#### Clase `WarehouseWithdrawalModalComponent` (L32–171)

- **Decoradores:** `@Component({ selector: 'app-warehouse-withdrawal-modal', standalone: true, imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBrea`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** "Retiro de Bodega": cash leaves Bodega and either goes back to the caja (internal transfer, total custody unchanged) or is deposited into a registered bank account (Bodega down, bank up). Breakdown by default; without it only administrators (business policy). Previews only — the backend checks the Bodega balance under its lock and applies both sides in one transaction. One `clientRequestId` per opening (idempotent).
- **Servicios inyectados con `inject()`:** `service = inject(CashCustodyService)`, `cashService = inject(CashControlService)`, `confirmDialog = inject(ConfirmDialogService)`, `notifications = inject(NotificationService)`, `auth = inject(AuthService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input custody = null`, `@Input canSkipBreakdown = false`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<{ withdrawal: WarehouseWithdrawal`, `destination = signal<WarehouseWithdrawalDestination>('CAJA')`, `banks = signal<CashBankBalance[]>([])`, `bankId = signal('')`, `amount = signal<number \| null>(null)`, `withBreakdown = signal(true)`, `cashCounts = signal<Record<string, number>>(emptyCashCounts())`, `deliveredBy = signal('')`, `receivedBy = signal('')`, `voucher = signal('')`, `observations = signal('')`, `isSaving = signal(false)`, `errorMessage = signal<string \| null>(null)`, `selectedBank = computed(() => this.banks().find((bank) => bank.ba`, `totalCounted = computed(() => cashCountsTotal(this.cashCounts()))`, `breakdownStatus = computed<CuadreStatus>(() => { const total = this.`, `warehouseBalance = computed(() => this.custody?.warehouseBalance ?? 0`, `warehouseAfter = computed(() => round2(this.warehouseBalance() - (t`, `targetBefore = computed(() => this.destination() === 'CAJA' ? (th`, `targetAfter = computed(() => round2(this.targetBefore() + (this.`, `insufficient = computed(() => (this.amount() ?? 0) > this.warehou`, `dayOpen = computed(() => !!this.custody?.currentDay?.isOpen)`, `canSave = computed( () => !this.isSaving() && this.dayOpen()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 99–117 | — | `void` |
| `onQuantityChange` | método public | 119–121 | `change: { denomination: number; quantity: number }` | `void` |
| `useCountedAsAmount` | método public | 123–125 | — | `void` |
| `save` | método public async | 127–170 | — | `Promise<void>` |

##### `WarehouseWithdrawalModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(): void` — [warehouse-withdrawal-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts#L99) (L99–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.destination.set`, `this.bankId.set`, `this.amount.set`, `this.withBreakdown.set`, `this.cashCounts.set`, `emptyCashCounts`, `this.deliveredBy.set`, `this.receivedBy.set`, `this.auth.currentUser`, `this.voucher.set`, `this.observations.set`, `this.errorMessage.set`, `crypto.randomUUID`, `this.cashService.getBankBalances().subscribe`, `this.cashService.getBankBalances`, `this.banks.set`, `banks.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.destination.set`, `this.bankId.set`, `this.amount.set`, `this.withBreakdown.set`, `this.cashCounts.set`, `this.deliveredBy.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `WarehouseWithdrawalModalComponent.onQuantityChange`

- **Firma:** `onQuantityChange(change: { denomination: number; quantity: number }): void` — [warehouse-withdrawal-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts#L119) (L119–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.update`, `String`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.update`
- **Consumidores:** `warehouse-withdrawal-modal.component.html` (plantilla)

##### `WarehouseWithdrawalModalComponent.useCountedAsAmount`

- **Firma:** `useCountedAsAmount(): void` — [warehouse-withdrawal-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts#L123) (L123–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.amount.set`, `this.totalCounted`
- **Efectos secundarios:** Actualiza estado (signals): `this.amount.set`
- **Consumidores:** `warehouse-withdrawal-modal.component.html` (plantilla)

##### `WarehouseWithdrawalModalComponent.save`

- **Firma:** `save(): Promise<void>` — [warehouse-withdrawal-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts#L127) (L127–170)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSave`, `this.amount`, `this.destination`, `this.confirmDialog.confirm`, `formatCurrency`, `this.warehouseAfter`, `this.targetAfter`, `this.selectedBank`, `this.isSaving.set`, `this.errorMessage.set`, `this.service.registerWithdrawal`, `this.withBreakdown`, `cashCountsToDetails`, `this.cashCounts`, `this.bankId`, `this.deliveredBy().trim`, `this.deliveredBy`, `this.receivedBy().trim`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.errorMessage.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `warehouse-withdrawal-modal.component.html` (plantilla)

