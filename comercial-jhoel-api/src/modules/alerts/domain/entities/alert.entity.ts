/**
 * Extensible on purpose — a future alert (cuenta por cobrar vencida, banco,
 * stock agotado de SIMs, cierre de día, ...) is a new string here, never a
 * structural change to `Alert`/`GetAlertsUseCase` below.
 */
export type AlertType =
  | 'PURCHASE_PAYMENT_DUE'
  | 'PURCHASE_PAYMENT_OVERDUE'
  | 'LOW_INVENTORY'
  | 'LOW_RECHARGE_BALANCE'
  | 'NEGATIVE_CASH_BOX_BALANCE';

export type AlertPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM';

/**
 * Never a persisted row — always computed fresh, every request, from
 * `purchases`/`inventory_stock`/`recharge_types`+`recharge_daily_balances`
 * (see `GetAlertsUseCase`). `key` is the one stable, deterministic thing
 * about an alert: derived from its own source row
 * (`purchase:<id>`, `inventory:<productId>:<locationId>`,
 * `recharge:<rechargeTypeId>`), so "leída" state survives across requests
 * even though the alert itself is rebuilt from scratch every time — see
 * `AlertReadMarkRepository`.
 */
export interface Alert {
  key: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  description: string;
  /** Monetary amount relevant to the alert (compra pendiente, saldo actual) — `null` for alert types with no single amount. */
  amount: number | null;
  /** `yyyy-MM-dd` — the business date the alert is about (fecha de pago); `null` when not applicable (inventario, recargas). */
  date: string | null;
  /** Frontend route this alert should navigate to — resolved here, never hardcoded client-side. */
  route: string;
  /** The source row's own id — a purchase id, a product id, or a recharge type id, depending on `type`. */
  referenceId: string;
}
