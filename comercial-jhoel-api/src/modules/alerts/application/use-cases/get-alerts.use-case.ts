import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../../purchases/domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../../purchases/domain/repositories/purchase.repository';
import { INVENTORY_STOCK_REPOSITORY } from '../../../inventory/domain/repositories/inventory-stock.repository';
import type { InventoryStockRepository } from '../../../inventory/domain/repositories/inventory-stock.repository';
import { RECHARGE_TYPE_REPOSITORY } from '../../../recharges/domain/repositories/recharge-type.repository';
import type { RechargeTypeRepository } from '../../../recharges/domain/repositories/recharge-type.repository';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../../recharges/domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../../recharges/domain/repositories/recharge-daily-balance.repository';
import { ALERT_SETTINGS_REPOSITORY } from '../../../alert-settings/domain/repositories/alert-settings.repository';
import type { AlertSettingsRepository } from '../../../alert-settings/domain/repositories/alert-settings.repository';
import { GetCashBoxBalanceUseCase } from '../../../recharge-cash-box/application/use-cases/get-cash-box-balance.use-case';
import { ALERT_READ_MARK_REPOSITORY } from '../../domain/repositories/alert-read-mark.repository';
import type { AlertReadMarkRepository } from '../../domain/repositories/alert-read-mark.repository';
import { Alert } from '../../domain/entities/alert.entity';
import { AlertsOutput, sortAlerts, toAlertOutput } from '../dtos/alerts-output';
import { todayIsoDate } from '../utils/today-iso-date';
import {
  buildCashBoxBalanceAlert,
  buildInventoryAlert,
  buildPurchaseAlert,
  buildRechargeBalanceAlert,
} from '../utils/build-alerts';

export interface GetAlertsInput {
  userId: string;
  isAdmin: boolean;
}

/**
 * Composes all 3 alert categories fresh on every call — never persisted,
 * never historical (see `Alert`'s own doc comment). An alert simply stops
 * being produced the instant its underlying condition resolves (a purchase
 * gets paid, stock rises above its minimum, a balance recovers) — there is
 * no "close"/"dismiss" mutation anywhere in this module, only read-tracking
 * (`AlertReadMarkRepository`) layered on top of whatever is currently active.
 *
 * Purchase alerts are ownership-scoped exactly like `ListPurchasesUseCase`:
 * a non-admin only ever sees their own pending credit purchases. Inventory
 * and recharge-balance alerts have no owner concept — they're operational
 * state of the business as a whole, so every authenticated account sees the
 * same set.
 */
@Injectable()
export class GetAlertsUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
    @Inject(INVENTORY_STOCK_REPOSITORY)
    private readonly inventoryStockRepository: InventoryStockRepository,
    @Inject(RECHARGE_TYPE_REPOSITORY)
    private readonly rechargeTypeRepository: RechargeTypeRepository,
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly rechargeDailyBalanceRepository: RechargeDailyBalanceRepository,
    @Inject(ALERT_SETTINGS_REPOSITORY)
    private readonly alertSettingsRepository: AlertSettingsRepository,
    @Inject(ALERT_READ_MARK_REPOSITORY)
    private readonly alertReadMarkRepository: AlertReadMarkRepository,
    private readonly getCashBoxBalanceUseCase: GetCashBoxBalanceUseCase,
  ) {}

  async execute(input: GetAlertsInput): Promise<AlertsOutput> {
    const today = todayIsoDate();

    const [
      settings,
      pendingCreditPurchases,
      lowStockRows,
      rechargeTypes,
      latestBalances,
      cashBoxBalance,
    ] = await Promise.all([
      this.alertSettingsRepository.get(),
      this.purchaseRepository.findPendingCreditPurchases(
        input.isAdmin ? undefined : { userId: input.userId },
      ),
      this.inventoryStockRepository.findLowStock(),
      this.rechargeTypeRepository.findAll({ activeOnly: true }),
      this.rechargeDailyBalanceRepository.findLatestPerType(),
      this.getCashBoxBalanceUseCase.execute({}),
    ]);

    const latestBalanceByType = new Map(
      latestBalances.map((balance) => [balance.rechargeTypeId, balance]),
    );

    const alerts: Alert[] = [
      ...pendingCreditPurchases
        .map((purchase) =>
          buildPurchaseAlert(
            purchase,
            today,
            settings.purchasePaymentAlertDays,
          ),
        )
        .filter((alert): alert is Alert => alert !== null),
      ...lowStockRows.map((row) => buildInventoryAlert(row)),
      ...rechargeTypes
        .map((type) =>
          buildRechargeBalanceAlert(type, latestBalanceByType.get(type.id)),
        )
        .filter((alert): alert is Alert => alert !== null),
      buildCashBoxBalanceAlert(cashBoxBalance.currentBalance),
    ].filter((alert): alert is Alert => alert !== null);

    const sorted = sortAlerts(alerts);
    const readKeys = await this.alertReadMarkRepository.findReadKeys(
      input.userId,
      sorted.map((alert) => alert.key),
    );

    const items = sorted.map((alert) =>
      toAlertOutput(alert, readKeys.has(alert.key)),
    );
    const unreadCount = items.filter((item) => !item.isRead).length;

    return {
      count: unreadCount,
      total: items.length,
      items,
    };
  }
}
