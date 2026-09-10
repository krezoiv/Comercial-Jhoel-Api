import { Purchase } from '../../../purchases/domain/entities/purchase.entity';
import { LowStockRow } from '../../../inventory/domain/repositories/inventory-stock.repository';
import { RechargeType } from '../../../recharges/domain/entities/recharge-type.entity';
import { RechargeDailyBalance } from '../../../recharges/domain/entities/recharge-daily-balance.entity';
import { Alert } from '../../domain/entities/alert.entity';
import { daysBetweenIsoDates } from './today-iso-date';

/**
 * `PURCHASE_PAYMENT_DUE` (próximo/vence hoy) or `PURCHASE_PAYMENT_OVERDUE`
 * (vencido) — `null` when the due date is still further out than
 * `alertDays`, i.e. not yet within the alert window at all. The caller
 * (`GetAlertsUseCase`) already only passes `PENDING` `CREDITO` purchases
 * (see `PurchaseRepository.findPendingCreditPurchases`) — a `PAID` purchase
 * never reaches this function, which is the entire mechanism behind "una
 * compra pagada deja de generar alerta": there's nothing to mark inactive,
 * it simply stops being in the input list the next time alerts are computed.
 */
export function buildPurchaseAlert(
  purchase: Purchase,
  today: string,
  alertDays: number,
): Alert | null {
  const dueDate = purchase.paymentDueDate;
  if (!dueDate) {
    // Defensive only — `CHK_purchases_credit_has_due_date` guarantees a
    // PENDING/CREDITO purchase always has one.
    return null;
  }

  const daysUntilDue = daysBetweenIsoDates(today, dueDate);

  if (daysUntilDue < 0) {
    const overdueDays = Math.abs(daysUntilDue);
    return {
      key: `purchase:${purchase.id}`,
      type: 'PURCHASE_PAYMENT_OVERDUE',
      priority: 'CRITICAL',
      title: 'Pago vencido',
      description: `${purchase.supplierName} — vencido hace ${overdueDays} ${overdueDays === 1 ? 'día' : 'días'}`,
      amount: purchase.total,
      date: dueDate,
      route: '/dashboard/compras',
      referenceId: purchase.id,
    };
  }

  if (daysUntilDue === 0) {
    return {
      key: `purchase:${purchase.id}`,
      type: 'PURCHASE_PAYMENT_DUE',
      priority: 'HIGH',
      title: 'Pago vence hoy',
      description: purchase.supplierName,
      amount: purchase.total,
      date: dueDate,
      route: '/dashboard/compras',
      referenceId: purchase.id,
    };
  }

  if (daysUntilDue <= alertDays) {
    return {
      key: `purchase:${purchase.id}`,
      type: 'PURCHASE_PAYMENT_DUE',
      priority: 'MEDIUM',
      title: 'Pago próximo a vencer',
      description: `${purchase.supplierName} — faltan ${daysUntilDue} ${daysUntilDue === 1 ? 'día' : 'días'}`,
      amount: purchase.total,
      date: dueDate,
      route: '/dashboard/compras',
      referenceId: purchase.id,
    };
  }

  return null;
}

/**
 * `LOW_INVENTORY` — priority `CRITICAL` ("Producto agotado") only when
 * `quantity === 0`, otherwise `MEDIUM` ("Inventario bajo"). The caller only
 * ever passes rows `InventoryStockRepository.findLowStock()` already
 * filtered to `minStock > 0 AND quantity <= minStock` — a row with no
 * threshold configured, or with plenty of stock, never reaches this
 * function at all.
 */
export function buildInventoryAlert(row: LowStockRow): Alert {
  const isOutOfStock = row.quantity === 0;
  return {
    key: `inventory:${row.productId}:${row.locationId}`,
    type: 'LOW_INVENTORY',
    priority: isOutOfStock ? 'CRITICAL' : 'MEDIUM',
    title: isOutOfStock ? 'Producto agotado' : 'Inventario bajo',
    description: `${row.productName} — ${row.locationName}: ${row.quantity} ${row.quantity === 1 ? 'unidad' : 'unidades'} (mínimo ${row.minStock})`,
    amount: null,
    date: null,
    route: `/dashboard/inventario/${row.productId}`,
    referenceId: row.productId,
  };
}

/**
 * `LOW_RECHARGE_BALANCE` — priority `CRITICAL` ("Saldo agotado") only when
 * the current balance is exactly `0`, otherwise `MEDIUM` ("Saldo bajo").
 * `null` when the type has no threshold configured (`minBalance = 0`) or no
 * balance history at all yet — never a false alert for an untouched type.
 * Claro/Tigo are never mixed: each type is evaluated independently against
 * its own `minBalance` and its own latest `dailyBalance` row.
 */
export function buildRechargeBalanceAlert(
  type: RechargeType,
  latestBalance: RechargeDailyBalance | undefined,
): Alert | null {
  if (type.minBalance <= 0 || !latestBalance) {
    return null;
  }

  const balance = latestBalance.dailyBalance;
  if (balance > type.minBalance) {
    return null;
  }

  const isDepleted = balance <= 0;
  return {
    key: `recharge:${type.id}`,
    type: 'LOW_RECHARGE_BALANCE',
    priority: isDepleted ? 'CRITICAL' : 'MEDIUM',
    title: isDepleted ? 'Saldo de recargas agotado' : 'Saldo bajo de recargas',
    description: `Recargas ${type.name} — saldo actual: Q${balance.toFixed(2)} (mínimo Q${type.minBalance.toFixed(2)})`,
    amount: balance,
    date: null,
    route: '/dashboard/recargas',
    referenceId: type.id,
  };
}

/**
 * `NEGATIVE_CASH_BOX_BALANCE` — fires whenever Gestión Caja Recargas'
 * accumulated balance (today's `currentBalance`, see
 * `GetCashBoxBalanceUseCase`) is below zero. Unlike `LOW_RECHARGE_BALANCE`,
 * this has no configurable per-item threshold (there's only one Caja, not
 * one per recharge type) — the rule is simply "negative is always a real
 * problem", always `CRITICAL`. A single, fixed `key` (there is only ever
 * one Caja) — no `referenceId` row to point at, so it reuses the same
 * fixed string.
 */
export function buildCashBoxBalanceAlert(currentBalance: number): Alert | null {
  if (currentBalance >= 0) {
    return null;
  }

  return {
    key: 'recharge-cash-box:balance',
    type: 'NEGATIVE_CASH_BOX_BALANCE',
    priority: 'CRITICAL',
    title: 'Saldo negativo en Caja Recargas',
    description: `El saldo acumulado de Gestión Caja Recargas es Q${currentBalance.toFixed(2)}`,
    amount: currentBalance,
    date: null,
    route: '/dashboard/gestion-caja-recargas',
    referenceId: 'recharge-cash-box',
  };
}
