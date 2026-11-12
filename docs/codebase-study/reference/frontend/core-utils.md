# Frontend `core-utils`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [bank-balance.util.spec.ts](#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-spec-ts) | .ts | Prueba unitaria | Core (servicios, modelos, guards) | Prueba unitaria (sin comentario de documentación en el código). | 1 internas | 0 | Soporte (pruebas) |
| [bank-balance.util.ts](#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts) | .ts | Utilidad | Core (servicios, modelos, guards) | Formato de un saldo bancario CONSERVANDO su signo real: `-5000` → `"-Q 5,000.00"`, nunca `"Q 5,000.00"`. | 1 internas | 14 | Alta (14 consumidores) |
| [download-blob.ts](#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts) | .ts | Utilidad | Core (servicios, modelos, guards) | Triggers a browser save-as for an in-memory `Blob` — the standard DOM pattern for a file that only exists as an HTTP response, never a real URL. | 0 internas | 15 | Alta (15 consumidores) |
| [extract-blob-error-message.ts](#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts) | .ts | Utilidad | Core (servicios, modelos, guards) | A `responseType: 'blob'` request (the PDF export calls) still gets the backend's real JSON error body on failure — Angular just hands it back as a `Blob` instead of parsed JSON, since the request's expected type was set before the response arrived. | 0 internas; ext.: @angular/common | 11 | Alta (11 consumidores) |
| [extract-error-message.ts](#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts) | .ts | Utilidad | Core (servicios, modelos, guards) | Backend error bodies are `{ success: false, statusCode, message }` — message is a string for domain/HTTP errors, or a string[] for class-validator failures. | 0 internas; ext.: @angular/common | 130 | Alta (130 consumidores) |
| [number-format.util.ts](#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts) | .ts | Utilidad | Core (servicios, modelos, guards) | `1234.5` → `"1,234.50"` — always exactly two decimals, comma thousands separator, no currency symbol. | 0 internas | 28 | Alta (28 consumidores) |
| [refetch-on-tab-visible.ts](#f-comercial-jhoel-app-src-app-core-utils-refetch-on-tab-visible-ts) | .ts | Utilidad | Core (servicios, modelos, guards) | Runs `callback` every time this browser tab regains visibility (switching back from another tab, or the OS switching windows/apps) — the standard "refetch on focus" behavior query-caching libraries like TanStack Query/SWR default to, applied by hand here since this app has no such library. | 0 internas; ext.: @angular/core | 6 | Media (6 consumidores) |
| [shortcut-route-options.ts](#f-comercial-jhoel-app-src-app-core-utils-shortcut-route-options-ts) | .ts | Utilidad | Core (servicios, modelos, guards) | Flattens `DASHBOARD_NAV_ITEMS` — the exact same list the sidebar itself renders from — into a flat `{ label, route }` list for the "Ruta destino" dropdown on "Sistema → Atajos de Teclado". | 2 internas | 1 | Baja (1 consumidores) |
| [transaction-bank-account.util.spec.ts](#f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-spec-ts) | .ts | Prueba unitaria | Core (servicios, modelos, guards) | Prueba unitaria: declara `account`, `resolvedIds`, `ACCOUNTS`, `EXPECTED` (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [transaction-bank-account.util.ts](#f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-ts) | .ts | Utilidad | Core (servicios, modelos, guards) | Sin acentos, minúsculas, cualquier puntuación/guion colapsado a un espacio: "Districol - BAM" → "districol bam". | 1 internas | 5 | Media (5 consumidores) |
| [visitor-id.util.ts](#f-comercial-jhoel-app-src-app-core-utils-visitor-id-util-ts) | .ts | Utilidad | Core (servicios, modelos, guards) | Identificador anónimo y opaco de este navegador — sin datos personales, sin cuenta, sin cookie — usado únicamente como clave de correlación para que el backend pueda evitar likes duplicados por visitante. | 0 internas | 3 | Media (3 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-spec-ts"></a>

### bank-balance.util.spec.ts

- **Ruta:** [bank-balance.util.spec.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.spec.ts) (`comercial-jhoel-app/src/app/core/utils/bank-balance.util.spec.ts`, 67 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts"></a>

### bank-balance.util.ts

- **Ruta:** [bank-balance.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts) (`comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts`, 85 líneas)
- **Tipo:** Utilidad · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** Formato de un saldo bancario CONSERVANDO su signo real: `-5000` → `"-Q 5,000.00"`, nunca `"Q 5,000.00"`.
- **Depende de (archivos del proyecto):** [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts)
- **Consumidores:** [bank-balance.util.spec.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-spec-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [adjust-balance-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-adjust-balance-modal-adjust-balance-modal-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts), [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [bank-picker-modal.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts), [credit-line-summary.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-credit-line-summary-credit-line-summary-component-ts)

**Interfaces, tipos y enums:**

- `interface CreditLineStatus` (L31): sin documentación — miembros: `limit`, `balance`, `used`, `available`

**Constantes exportadas:**

- `CREDIT_LINE_LIMIT_MESSAGE` (L63): Mensajes idénticos a los del backend (`bank-movement.errors.ts`). = `'El monto excede el saldo disponible de la línea de crédito.'`
- `CREDIT_LINE_NO_DEBT_MESSAGE` (L64) = `'No existe deuda pendiente en la línea de crédito para realizar esta devolución.'`
- `CREDIT_LINE_OVERPAYMENT_MESSAGE` (L65) = `'El monto a devolver excede el saldo pendiente de la línea de crédito.'`
#### Función `formatSignedBankBalance` (L8–10)

- **Tipo:** función exportada
- **Firma:** `formatSignedBankBalance(value: number): string` — [bank-balance.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts#L8)
- **Propósito / descripción:** Formato de un saldo bancario CONSERVANDO su signo real: `-5000` → `"-Q 5,000.00"`, nunca `"Q 5,000.00"`. El valor numérico nunca se transforma — solo cambia dónde se dibuja el signo (delante de la "Q").
- **Dependencias:** `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts), [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts)

#### Función `isFavorBalance` (L13–15)

- **Tipo:** función exportada
- **Firma:** `isFavorBalance(specialAccount: string \| null \| undefined, value: number): boolean` — [bank-balance.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts#L13)
- **Propósito / descripción:** Un saldo negativo de la línea de crédito de Génesis se muestra como "Saldo a favor" (sin ocultar el signo).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts)

#### Función `round2` (L17–19)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [bank-balance.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts#L17)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [adjust-balance-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-adjust-balance-modal-adjust-balance-modal-component-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)

#### Función `isCreditLineAccount` (L27–29)

- **Tipo:** función exportada
- **Firma:** `isCreditLineAccount(specialAccount: string \| null \| undefined): boolean` — [bank-balance.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts#L27)
- **Propósito / descripción:** BI Club Empresarial es una LÍNEA DE CRÉDITO (migración backend `BiClubCreditLine`): su saldo va de Q0.00 (nada utilizado) a `-maxBalance` (línea agotada). Todo lo de abajo es solo UX — el backend (`apply_bank_account_movement`) vuelve a validar bajo lock.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [adjust-balance-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-adjust-balance-modal-adjust-balance-modal-component-ts)

#### Función `creditLineStatus` (L42–50)

- **Tipo:** función exportada
- **Firma:** `creditLineStatus(balance: number, maxBalance: number \| null): CreditLineStatus` — [bank-balance.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts#L42)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `round2`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [credit-line-summary.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-credit-line-summary-credit-line-summary-component-ts)

#### Función `transferBalanceDelta` (L58–60)

- **Tipo:** función exportada
- **Firma:** `transferBalanceDelta(side: 'source' \| 'destination', amount: number): number` — [bank-balance.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts#L58)
- **Propósito / descripción:** Cuánto cambia el saldo de una cuenta en una transferencia: el origen resta y el destino suma, también BI Club (usar la línea = enviar a Banco Industrial; pagarla = recibir de Banco Industrial). Lo especial de BI Club son solo sus límites (`creditLineMovementError`).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `creditLineLimitMessage` (L68–72)

- **Tipo:** función exportada
- **Firma:** `creditLineLimitMessage(maxBalance: number \| null): string` — [bank-balance.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts#L68)
- **Propósito / descripción:** "El monto excede el saldo disponible de la línea de crédito de Q75,000.00." (mismo texto que el backend).
- **Dependencias:** `formatCurrency`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `creditLineMovementError` (L75–84)

- **Tipo:** función exportada
- **Firma:** `creditLineMovementError(before: number, delta: number, maxBalance: number \| null): string \| null` — [bank-balance.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/bank-balance.util.ts#L75)
- **Propósito / descripción:** Valida un movimiento (`delta` con signo) sobre la línea de crédito: `-límite ≤ saldo ≤ 0`.
- **Dependencias:** `round2`, `creditLineLimitMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-utils-download-blob-ts"></a>

### download-blob.ts

- **Ruta:** [download-blob.ts](../../../../comercial-jhoel-app/src/app/core/utils/download-blob.ts) (`comercial-jhoel-app/src/app/core/utils/download-blob.ts`, 12 líneas)
- **Tipo:** Utilidad · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** Triggers a browser save-as for an in-memory `Blob` — the standard DOM pattern for a file that only exists as an HTTP response, never a real URL.
- **Descripción del autor (comentario del archivo):** Triggers a browser save-as for an in-memory `Blob` — the standard DOM pattern for a file that only exists as an HTTP response, never a real URL.
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts), [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [recharges-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts), [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts), [create-ticket-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts), [ticket-history-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts), [pdf-prompt-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts)
#### Función `downloadBlob` (L2–11)

- **Tipo:** función exportada
- **Firma:** `downloadBlob(blob: Blob, filename: string): void` — [download-blob.ts](../../../../comercial-jhoel-app/src/app/core/utils/download-blob.ts#L2)
- **Propósito / descripción:** Triggers a browser save-as for an in-memory `Blob` — the standard DOM pattern for a file that only exists as an HTTP response, never a real URL.
- **Dependencias:** `URL.createObjectURL`, `document.createElement`, `document.body.appendChild`, `link.click`, `document.body.removeChild`, `URL.revokeObjectURL`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts), [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts), [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts"></a>

### extract-blob-error-message.ts

- **Ruta:** [extract-blob-error-message.ts](../../../../comercial-jhoel-app/src/app/core/utils/extract-blob-error-message.ts) (`comercial-jhoel-app/src/app/core/utils/extract-blob-error-message.ts`, 29 líneas)
- **Tipo:** Utilidad · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** A `responseType: 'blob'` request (the PDF export calls) still gets the backend's real JSON error body on failure — Angular just hands it back as a `Blob` instead of parsed JSON, since the request's expected type was set before the response arrived.
- **Paquetes externos:** `@angular/common`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts), [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [recharges-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts), [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts), [pdf-prompt-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts)
#### Función `extractBlobErrorMessage` (L11–28)

- **Tipo:** función exportada, async
- **Firma:** `extractBlobErrorMessage(error: HttpErrorResponse, fallback: string): Promise<string>` — [extract-blob-error-message.ts](../../../../comercial-jhoel-app/src/app/core/utils/extract-blob-error-message.ts#L11)
- **Propósito / descripción:** A `responseType: 'blob'` request (the PDF export calls) still gets the backend's real JSON error body on failure — Angular just hands it back as a `Blob` instead of parsed JSON, since the request's expected type was set before the response arrived. This reads that blob back to text and parses it, so an export failure can surface the same real backend message `extractErrorMessage` gives every other request instead of a generic string.
- **Dependencias:** `error.error.text`, `JSON.parse`, `Array.isArray`, `parsed.message.join`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts), [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [recharges-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts), [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts"></a>

### extract-error-message.ts

- **Ruta:** [extract-error-message.ts](../../../../comercial-jhoel-app/src/app/core/utils/extract-error-message.ts) (`comercial-jhoel-app/src/app/core/utils/extract-error-message.ts`, 19 líneas)
- **Tipo:** Utilidad · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** Backend error bodies are `{ success: false, statusCode, message }` — message is a string for domain/HTTP errors, or a string[] for class-validator failures.
- **Paquetes externos:** `@angular/common`
- **Consumidores:** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts), [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts) y 115 más
#### Función `extractErrorMessage` (L9–18)

- **Tipo:** función exportada
- **Firma:** `extractErrorMessage(error: HttpErrorResponse, fallback: string): string` — [extract-error-message.ts](../../../../comercial-jhoel-app/src/app/core/utils/extract-error-message.ts#L9)
- **Propósito / descripción:** Backend error bodies are `{ success: false, statusCode, message }` — message is a string for domain/HTTP errors, or a string[] for class-validator failures. Never surfaces the raw HttpErrorResponse (stack traces, internal details) to the user.
- **Dependencias:** `Array.isArray`, `message.join`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts), [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts"></a>

### number-format.util.ts

- **Ruta:** [number-format.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/number-format.util.ts) (`comercial-jhoel-app/src/app/core/utils/number-format.util.ts`, 49 líneas)
- **Tipo:** Utilidad · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** `1234.5` → `"1,234.50"` — always exactly two decimals, comma thousands separator, no currency symbol.
- **Consumidores:** [account-receivable.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-account-receivable-model-ts), [asset.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-asset-model-ts), [bank.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-bank-model-ts), [ice-cream.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-ice-cream-model-ts), [product.model.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-product-model-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [close-review-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-close-review-modal-close-review-modal-component-ts), [correction-modal.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-correction-modal-correction-modal-component-ts), [day-review-panel.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-day-review-panel-day-review-panel-component-ts), [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts), [purchases-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-daily-chart-purchases-daily-chart-component-ts), [purchases-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-weekly-chart-purchases-weekly-chart-component-ts), [purchases-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-yearly-chart-purchases-yearly-chart-component-ts) y 13 más
#### Función `formatDecimal` (L15–20)

- **Tipo:** función exportada
- **Firma:** `formatDecimal(value: number): string` — [number-format.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/number-format.util.ts#L15)
- **Propósito / descripción:** `1234.5` → `"1,234.50"` — always exactly two decimals, comma thousands separator, no currency symbol.
- **Dependencias:** `value.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `formatCurrency` (L23–25)

- **Tipo:** función exportada
- **Firma:** `formatCurrency(value: number): string` — [number-format.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/number-format.util.ts#L23)
- **Propósito / descripción:** `1234.5` → `"Q 1,234.50"` — the one money format used everywhere: precios, costos, saldos, totales, resúmenes, PDFs.
- **Dependencias:** `formatDecimal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [day-review-panel.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-components-day-review-panel-day-review-panel-component-ts), [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts), [phone-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-interest-modal-phone-interest-modal-component-ts), [product-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-components-product-interest-modal-product-interest-modal-component-ts), [account-statement-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-account-statement-modal-account-statement-modal-component-ts)

#### Función `formatQuantity` (L28–30)

- **Tipo:** función exportada
- **Firma:** `formatQuantity(value: number): string` — [number-format.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/number-format.util.ts#L28)
- **Propósito / descripción:** `1500` → `"1,500"` — thousands-separated, no decimals, for integer quantities (stock, unidades, registros) that should never show a fake ".00".
- **Dependencias:** `value.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `parseNumericValue` (L41–48)

- **Tipo:** función exportada
- **Firma:** `parseNumericValue(input: string): number \| null` — [number-format.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/number-format.util.ts#L41)
- **Propósito / descripción:** The inverse of the two formatters above — turns whatever a user typed or pasted (`"Q 1,250.50"`, `"1,250.50"`, `"1250.50"`) back into the plain numeric value the backend actually expects (`1250.5`). Never sent to an API as a formatted string; this is what a component calls right before that call, on the raw input value, not something the backend ever sees itself. Returns `null` for anything that isn't a real number once the formatting characters are stripped (an empty field, "abc", "1.2.3").
- **Dependencias:** `input.replace(/[Qq\s,]/g, '').trim`, `input.replace`, `Number`, `Number.isFinite`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-utils-refetch-on-tab-visible-ts"></a>

### refetch-on-tab-visible.ts

- **Ruta:** [refetch-on-tab-visible.ts](../../../../comercial-jhoel-app/src/app/core/utils/refetch-on-tab-visible.ts) (`comercial-jhoel-app/src/app/core/utils/refetch-on-tab-visible.ts`, 28 líneas)
- **Tipo:** Utilidad · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** Runs `callback` every time this browser tab regains visibility (switching back from another tab, or the OS switching windows/apps) — the standard "refetch on focus" behavior query-caching libraries like TanStack Query/SWR default to, applied by hand here since this app has no such library.
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [cash-box-card.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts), [cash-box-history.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-history-cash-box-history-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts)
#### Función `refetchOnTabVisible` (L19–27)

- **Tipo:** función exportada
- **Firma:** `refetchOnTabVisible(callback: () => void): void` — [refetch-on-tab-visible.ts](../../../../comercial-jhoel-app/src/app/core/utils/refetch-on-tab-visible.ts#L19)
- **Propósito / descripción:** Runs `callback` every time this browser tab regains visibility (switching back from another tab, or the OS switching windows/apps) — the standard "refetch on focus" behavior query-caching libraries like TanStack Query/SWR default to, applied by hand here since this app has no such library. Fixes the class of bug where a self-contained, fetch-once card (constructor/`ngOnChanges` fetch, no polling) goes stale while its own tab sits in the background and the underlying data changes elsewhere — another tab, another user, or simply time passing. Must be called from an injection context (a component's constructor, or a field initializer) — it captures `DestroyRef` itself to remove the `visibilityc
- **Dependencias:** `callback`, `document.addEventListener`, `inject(DestroyRef).onDestroy`, `inject`, `document.removeEventListener`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-utils-shortcut-route-options-ts"></a>

### shortcut-route-options.ts

- **Ruta:** [shortcut-route-options.ts](../../../../comercial-jhoel-app/src/app/core/utils/shortcut-route-options.ts) (`comercial-jhoel-app/src/app/core/utils/shortcut-route-options.ts`, 35 líneas)
- **Tipo:** Utilidad · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** Flattens `DASHBOARD_NAV_ITEMS` — the exact same list the sidebar itself renders from — into a flat `{ label, route }` list for the "Ruta destino" dropdown on "Sistema → Atajos de Teclado".
- **Depende de (archivos del proyecto):** [dashboard-nav.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-dashboard-nav-data-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Consumidores:** [keyboard-shortcuts-page.component.ts](dashboard-keyboard-shortcuts.md#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts)
#### Función `buildShortcutRouteOptions` (L16–34)

- **Tipo:** función exportada
- **Firma:** `buildShortcutRouteOptions(items?: DashboardNavItem[]): ShortcutRouteOption[]` — [shortcut-route-options.ts](../../../../comercial-jhoel-app/src/app/core/utils/shortcut-route-options.ts#L16)
- **Propósito / descripción:** Flattens `DASHBOARD_NAV_ITEMS` — the exact same list the sidebar itself renders from — into a flat `{ label, route }` list for the "Ruta destino" dropdown on "Sistema → Atajos de Teclado". A shortcut can only ever point at a route that's already a real, current sidebar destination — never free text a user could typo into a broken/nonexistent path. The root "Resumen" entry (`path: ''`) is excluded: its own absolute path would be `/dashboard/` (a trailing-slash edge case, not a clean `/dashboard/&lt;segment&gt;` route like every other entry), and this mechanism exists for jumping between *modules*, not the landing page itself.
- **Dependencias:** `visit`, `options.push`, `[...trail, item.label].join`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-spec-ts"></a>

### transaction-bank-account.util.spec.ts

- **Ruta:** [transaction-bank-account.util.spec.ts](../../../../comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.spec.ts) (`comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.spec.ts`, 142 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** Prueba unitaria: declara `account`, `resolvedIds`, `ACCOUNTS`, `EXPECTED` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [transaction-bank-account.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-ts)
- **Consumidores:** —
#### Función `account` (L4–21)

- **Tipo:** función local del archivo
- **Firma:** `account(id: string, name: string, specialAccount?: BankSpecialAccount \| null, overrides?: Partial<Bank>): Bank` — [transaction-bank-account.util.spec.ts](../../../../comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.spec.ts#L4)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `resolvedIds` (L47–50)

- **Tipo:** función local del archivo
- **Firma:** `resolvedIds(agentName: string, accounts: Bank[], effect: TransactionTypeBalanceEffect)` — [transaction-bank-account.util.spec.ts](../../../../comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.spec.ts#L47)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `resolveTransactionBankAccount`, `result.accounts.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-ts"></a>

### transaction-bank-account.util.ts

- **Ruta:** [transaction-bank-account.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.ts) (`comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.ts`, 187 líneas)
- **Tipo:** Utilidad · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** Sin acentos, minúsculas, cualquier puntuación/guion colapsado a un espacio: "Districol - BAM" → "districol bam".
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Consumidores:** [transaction-bank-account.util.spec.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-spec-ts), [bank-picker-modal.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaction-bank-image-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts), [transaction-bank-table.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-table-transaction-bank-table-component-ts)

**Interfaces, tipos y enums:**

- `interface TransactionBankAccountRule` (L16): Mapeo ÚNICO "Banco Agente (icono) → cuenta afectada" de Transaccionar (Depósito, Retiro y Reintegro). — miembros: `key`, `monogram`, `agentNames`, `agentCashBoxCode`, `account`, `accountName`
- `type AgentIdentity` (L103) = `Pick<TransactionBank, 'name'> & Partial<Pick<TransactionBank, 'cashBoxCode'>>`
- `type TransactionBankResolution` (L124) = `\| { status: 'ok'; rule: TransactionBankAccountRule; accounts: Bank[] } \| { status: 'unmapped' \| 'missing' \| 'unavailable' \| 'not-allowed'; rule: TransactionBankAccountRule \| null; message: string }`

**Constantes exportadas:**

- `TRANSACTION_BANK_ACCOUNT_RULES` (L30) = `[ { key: 'AKISI', monogram: 'AK', agentNames: ['akisi'], account: { specialAccount: 'GENESIS' }, accountName: `
#### Función `normalizeBankName` (L94–101)

- **Tipo:** función exportada
- **Firma:** `normalizeBankName(value: string): string` — [transaction-bank-account.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.ts#L94)
- **Propósito / descripción:** Sin acentos, minúsculas, cualquier puntuación/guion colapsado a un espacio: "Districol - BAM" → "districol bam".
- **Dependencias:** `value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace`, `value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase`, `value.normalize('NFD').replace`, `value.normalize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `findTransactionBankRule` (L105–114)

- **Tipo:** función exportada
- **Firma:** `findTransactionBankRule(agent: AgentIdentity): TransactionBankAccountRule \| null` — [transaction-bank-account.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.ts#L105)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `TRANSACTION_BANK_ACCOUNT_RULES.find`, `normalizeBankName`, `rule.agentNames.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `accountMatchesRule` (L116–122)

- **Tipo:** función local del archivo
- **Firma:** `accountMatchesRule(account: Bank, rule: TransactionBankAccountRule): boolean` — [transaction-bank-account.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.ts#L116)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `names?.includes`, `normalizeBankName`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `resolveTransactionBankAccount` (L133–172)

- **Tipo:** función exportada
- **Firma:** `resolveTransactionBankAccount(agent: AgentIdentity, bankAccounts: Bank[], effect: TransactionTypeBalanceEffect \| null): TransactionBankResolution` — [transaction-bank-account.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.ts#L133)
- **Propósito / descripción:** Resuelve la(s) cuenta(s) que afectará el banco elegido. `accounts` con más de un elemento (p. ej. varias cuentas GTC) obliga a elegir cuál dentro del propio modal — nunca se toma la primera por defecto.
- **Dependencias:** `findTransactionBankRule`, `bankAccounts.filter`, `accountMatchesRule`, `candidates.filter`, `enabled.filter`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [transaction-bank-account.util.spec.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-transaction-bank-account-util-spec-ts)

#### Función `transactionBankMonogram` (L175–186)

- **Tipo:** función exportada
- **Firma:** `transactionBankMonogram(agent: AgentIdentity): string` — [transaction-bank-account.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/transaction-bank-account.util.ts#L175)
- **Propósito / descripción:** Sigla del icono — la de la regla, o las iniciales del banco si no tiene regla.
- **Dependencias:** `findTransactionBankRule`, `normalizeBankName(agent.name).split(' ').filter`, `normalizeBankName(agent.name).split`, `normalizeBankName`, `words.slice(0, 2).map((word) => word[0]).join('').toUpperCase`, `words.slice(0, 2).map((word) => word[0]).join`, `words.slice(0, 2).map`, `words.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [transaction-bank-image-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-utils-visitor-id-util-ts"></a>

### visitor-id.util.ts

- **Ruta:** [visitor-id.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/visitor-id.util.ts) (`comercial-jhoel-app/src/app/core/utils/visitor-id.util.ts`, 35 líneas)
- **Tipo:** Utilidad · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-utils`
- **Responsabilidad:** Identificador anónimo y opaco de este navegador — sin datos personales, sin cuenta, sin cookie — usado únicamente como clave de correlación para que el backend pueda evitar likes duplicados por visitante.
- **Descripción del autor (comentario del archivo):** Identificador anónimo y opaco de este navegador — sin datos personales, sin cuenta, sin cookie — usado únicamente como clave de correlación para que el backend pueda evitar likes duplicados por visitante. Reemplaza a `local-likes.util.ts`: aquí NO se guarda si algo tiene like ni el contador — eso siempre se pregunta al backend (fuente de verdad real en PostgreSQL). Solo se persiste este UUID, generado una sola vez. Envuelto en try/catch: un visitante con `localStorage` bloqueado (modo privado estricto) simplemente recibe un id nuevo en cada visita — el like sigue funcionando, solo no se recuer
- **Consumidores:** [public-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-catalog-service-ts), [public-news.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-news-service-ts), [public-product-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-product-catalog-service-ts)
#### Función `getVisitorId` (L16–34)

- **Tipo:** función exportada
- **Firma:** `getVisitorId(): string` — [visitor-id.util.ts](../../../../comercial-jhoel-app/src/app/core/utils/visitor-id.util.ts#L16)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `localStorage.getItem`, `crypto.randomUUID`, `localStorage.setItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-catalog-service-ts), [public-news.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-news-service-ts), [public-product-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-product-catalog-service-ts)

