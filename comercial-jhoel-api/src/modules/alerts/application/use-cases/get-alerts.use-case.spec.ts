import { GetAlertsUseCase } from './get-alerts.use-case';
import { PurchaseRepository } from '../../../purchases/domain/repositories/purchase.repository';
import { InventoryStockRepository } from '../../../inventory/domain/repositories/inventory-stock.repository';
import { RechargeTypeRepository } from '../../../recharges/domain/repositories/recharge-type.repository';
import { RechargeDailyBalanceRepository } from '../../../recharges/domain/repositories/recharge-daily-balance.repository';
import { AlertSettingsRepository } from '../../../alert-settings/domain/repositories/alert-settings.repository';
import { AlertReadMarkRepository } from '../../domain/repositories/alert-read-mark.repository';
import { Purchase } from '../../../purchases/domain/entities/purchase.entity';
import { AlertSettings } from '../../../alert-settings/domain/entities/alert-settings.entity';
import { GetCashBoxBalanceUseCase } from '../../../recharge-cash-box/application/use-cases/get-cash-box-balance.use-case';

function makePurchase(paymentDueDate: string): Purchase {
  return Purchase.create({
    id: 'purchase-1',
    supplierId: 'supplier-1',
    supplierName: 'Distribuidora Central',
    userId: 'owner-1',
    username: 'cajero1',
    purchaseDate: new Date('2026-09-01T00:00:00Z'),
    total: 1500,
    items: [],
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
    paymentType: 'CREDITO',
    paymentDueDate,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidBy: null,
    paidByUsername: null,
  });
}

describe('GetAlertsUseCase', () => {
  let purchaseRepository: jest.Mocked<PurchaseRepository>;
  let inventoryStockRepository: jest.Mocked<InventoryStockRepository>;
  let rechargeTypeRepository: jest.Mocked<RechargeTypeRepository>;
  let rechargeDailyBalanceRepository: jest.Mocked<RechargeDailyBalanceRepository>;
  let alertSettingsRepository: jest.Mocked<AlertSettingsRepository>;
  let alertReadMarkRepository: jest.Mocked<AlertReadMarkRepository>;
  let getCashBoxBalanceUseCase: jest.Mocked<GetCashBoxBalanceUseCase>;
  let useCase: GetAlertsUseCase;

  beforeEach(() => {
    purchaseRepository = {
      findPendingCreditPurchases: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<PurchaseRepository>;
    inventoryStockRepository = {
      findLowStock: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<InventoryStockRepository>;
    rechargeTypeRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<RechargeTypeRepository>;
    rechargeDailyBalanceRepository = {
      findLatestPerType: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<RechargeDailyBalanceRepository>;
    alertSettingsRepository = {
      get: jest.fn().mockResolvedValue(
        AlertSettings.create({
          id: 'settings-1',
          purchasePaymentAlertDays: 3,
          updatedAt: new Date(),
          updatedBy: null,
          updatedByUsername: null,
        }),
      ),
    } as unknown as jest.Mocked<AlertSettingsRepository>;
    alertReadMarkRepository = {
      findReadKeys: jest.fn().mockResolvedValue(new Set()),
    } as unknown as jest.Mocked<AlertReadMarkRepository>;
    getCashBoxBalanceUseCase = {
      execute: jest.fn().mockResolvedValue({
        date: '2026-09-10',
        previousBalance: 0,
        incomeToday: 0,
        expenseToday: 0,
        currentBalance: 0,
        detail: {
          salesRecharges: 0,
          salesSim: 0,
          contributions: 0,
          purchasesRecharges: 0,
          purchasesSim: 0,
          profitWithdrawals: 0,
        },
      }),
    } as unknown as jest.Mocked<GetCashBoxBalanceUseCase>;

    useCase = new GetAlertsUseCase(
      purchaseRepository,
      inventoryStockRepository,
      rechargeTypeRepository,
      rechargeDailyBalanceRepository,
      alertSettingsRepository,
      alertReadMarkRepository,
      getCashBoxBalanceUseCase,
    );
  });

  it('returns an empty result when nothing is active anywhere (sin datos)', async () => {
    const result = await useCase.execute({ userId: 'user-1', isAdmin: false });
    expect(result).toEqual({ count: 0, total: 0, items: [] });
  });

  it('scopes purchase alerts to the caller for a non-admin', async () => {
    await useCase.execute({ userId: 'user-1', isAdmin: false });
    expect(purchaseRepository.findPendingCreditPurchases).toHaveBeenCalledWith({
      userId: 'user-1',
    });
  });

  it('does not scope purchase alerts for an admin', async () => {
    await useCase.execute({ userId: 'admin-1', isAdmin: true });
    expect(purchaseRepository.findPendingCreditPurchases).toHaveBeenCalledWith(
      undefined,
    );
  });

  it('marks an alert already read for this user as isRead: true and excludes it from the unread count', async () => {
    purchaseRepository.findPendingCreditPurchases.mockResolvedValue([
      makePurchase('2026-01-01'), // overdue relative to any "today"
    ]);
    alertReadMarkRepository.findReadKeys.mockResolvedValue(
      new Set(['purchase:purchase-1']),
    );

    const result = await useCase.execute({ userId: 'user-1', isAdmin: false });

    expect(result.total).toBe(1);
    expect(result.count).toBe(0);
    expect(result.items[0].isRead).toBe(true);
  });

  it('sorts CRITICAL alerts before MEDIUM ones in the returned items', async () => {
    purchaseRepository.findPendingCreditPurchases.mockResolvedValue([
      makePurchase('2026-01-01'), // overdue -> CRITICAL
    ]);
    inventoryStockRepository.findLowStock.mockResolvedValue([
      {
        productId: 'product-1',
        productName: 'Coca-Cola 600ml',
        locationId: 'location-1',
        locationName: 'Vitrina',
        quantity: 5,
        minStock: 10,
      }, // low but not zero -> MEDIUM
    ]);

    const result = await useCase.execute({ userId: 'user-1', isAdmin: true });

    expect(result.items.map((item) => item.priority)).toEqual([
      'CRITICAL',
      'MEDIUM',
    ]);
  });

  it('surfaces a CRITICAL alert when Caja Recargas balance is negative', async () => {
    getCashBoxBalanceUseCase.execute.mockResolvedValue({
      date: '2026-09-10',
      previousBalance: -50,
      incomeToday: 0,
      expenseToday: 0,
      currentBalance: -50,
      detail: {
        salesRecharges: 0,
        salesSim: 0,
        contributions: 0,
        purchasesRecharges: 50,
        purchasesSim: 0,
        profitWithdrawals: 0,
      },
    });

    const result = await useCase.execute({ userId: 'user-1', isAdmin: false });

    expect(result.total).toBe(1);
    expect(result.items[0]).toMatchObject({
      type: 'NEGATIVE_CASH_BOX_BALANCE',
      priority: 'CRITICAL',
    });
  });

  it('never surfaces a Caja Recargas alert when the balance is zero or positive', async () => {
    getCashBoxBalanceUseCase.execute.mockResolvedValue({
      date: '2026-09-10',
      previousBalance: 0,
      incomeToday: 100,
      expenseToday: 0,
      currentBalance: 100,
      detail: {
        salesRecharges: 100,
        salesSim: 0,
        contributions: 0,
        purchasesRecharges: 0,
        purchasesSim: 0,
        profitWithdrawals: 0,
      },
    });

    const result = await useCase.execute({ userId: 'user-1', isAdmin: false });

    expect(result.total).toBe(0);
  });
});
