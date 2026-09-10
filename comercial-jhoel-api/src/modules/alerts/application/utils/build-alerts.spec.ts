import { Purchase } from '../../../purchases/domain/entities/purchase.entity';
import { LowStockRow } from '../../../inventory/domain/repositories/inventory-stock.repository';
import { RechargeType } from '../../../recharges/domain/entities/recharge-type.entity';
import { RechargeDailyBalance } from '../../../recharges/domain/entities/recharge-daily-balance.entity';
import {
  buildCashBoxBalanceAlert,
  buildInventoryAlert,
  buildPurchaseAlert,
  buildRechargeBalanceAlert,
} from './build-alerts';

function makePurchase(overrides: {
  id?: string;
  paymentDueDate: string | null;
  total?: number;
}): Purchase {
  return Purchase.create({
    id: overrides.id ?? 'purchase-1',
    supplierId: 'supplier-1',
    supplierName: 'Distribuidora Central',
    userId: 'user-1',
    username: 'cajero1',
    purchaseDate: new Date('2026-09-01T00:00:00Z'),
    total: overrides.total ?? 1500,
    items: [],
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
    paymentType: 'CREDITO',
    paymentDueDate: overrides.paymentDueDate,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidBy: null,
    paidByUsername: null,
  });
}

function makeLowStockRow(overrides: Partial<LowStockRow>): LowStockRow {
  return {
    productId: 'product-1',
    productName: 'Coca-Cola 600ml',
    locationId: 'location-1',
    locationName: 'Bodega',
    quantity: 3,
    minStock: 10,
    ...overrides,
  };
}

function makeRechargeType(
  overrides: Partial<{ id: string; name: string; minBalance: number }>,
): RechargeType {
  return RechargeType.create({
    id: overrides.id ?? 'type-claro',
    name: overrides.name ?? 'Claro',
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    minBalance: overrides.minBalance ?? 100,
  });
}

function makeBalance(
  overrides: Partial<{ rechargeTypeId: string; dailyBalance: number }>,
): RechargeDailyBalance {
  return RechargeDailyBalance.create({
    id: 'balance-1',
    rechargeTypeId: overrides.rechargeTypeId ?? 'type-claro',
    rechargeTypeName: 'Claro',
    date: '2026-09-03',
    sequence: 1,
    previousBalance: 500,
    dailyBalance: overrides.dailyBalance ?? 50,
    finalBalance: null,
    totalPurchaseAmount: 0,
    createdByUserId: 'user-1',
    createdByUsername: 'cajero1',
    updatedByUserId: null,
    updatedByUsername: null,
    createdAt: new Date('2026-09-03T00:00:00Z'),
    updatedAt: new Date('2026-09-03T00:00:00Z'),
  });
}

describe('buildPurchaseAlert', () => {
  const today = '2026-09-03';
  const alertDays = 3;

  it('returns a CRITICAL/PURCHASE_PAYMENT_OVERDUE alert when the due date already passed', () => {
    const purchase = makePurchase({ paymentDueDate: '2026-09-01' });
    const alert = buildPurchaseAlert(purchase, today, alertDays);
    expect(alert).not.toBeNull();
    expect(alert?.type).toBe('PURCHASE_PAYMENT_OVERDUE');
    expect(alert?.priority).toBe('CRITICAL');
    expect(alert?.description).toContain('2 días');
  });

  it('returns a HIGH/PURCHASE_PAYMENT_DUE alert when the due date is today', () => {
    const purchase = makePurchase({ paymentDueDate: today });
    const alert = buildPurchaseAlert(purchase, today, alertDays);
    expect(alert?.type).toBe('PURCHASE_PAYMENT_DUE');
    expect(alert?.priority).toBe('HIGH');
  });

  it('returns a MEDIUM/PURCHASE_PAYMENT_DUE alert when within the configured alert window', () => {
    const purchase = makePurchase({ paymentDueDate: '2026-09-06' }); // 3 days out
    const alert = buildPurchaseAlert(purchase, today, alertDays);
    expect(alert?.type).toBe('PURCHASE_PAYMENT_DUE');
    expect(alert?.priority).toBe('MEDIUM');
  });

  it('returns null when the due date is further out than the configured alert window', () => {
    const purchase = makePurchase({ paymentDueDate: '2026-09-07' }); // 4 days out
    expect(buildPurchaseAlert(purchase, today, alertDays)).toBeNull();
  });

  it('returns null when there is no due date at all (defensive — CONTADO never reaches this function)', () => {
    const purchase = makePurchase({ paymentDueDate: null });
    expect(buildPurchaseAlert(purchase, today, alertDays)).toBeNull();
  });
});

describe('buildInventoryAlert', () => {
  it('returns CRITICAL/"Producto agotado" when quantity is exactly zero', () => {
    const row = makeLowStockRow({ quantity: 0, minStock: 10 });
    const alert = buildInventoryAlert(row);
    expect(alert.priority).toBe('CRITICAL');
    expect(alert.title).toBe('Producto agotado');
  });

  it('returns MEDIUM/"Inventario bajo" when quantity is below the minimum but not zero', () => {
    const row = makeLowStockRow({ quantity: 3, minStock: 10 });
    const alert = buildInventoryAlert(row);
    expect(alert.priority).toBe('MEDIUM');
    expect(alert.title).toBe('Inventario bajo');
  });

  it('keeps Bodega and Vitrina independent — same product, different keys', () => {
    const bodega = buildInventoryAlert(
      makeLowStockRow({
        locationId: 'loc-bodega',
        locationName: 'Bodega',
        quantity: 0,
      }),
    );
    const vitrina = buildInventoryAlert(
      makeLowStockRow({
        locationId: 'loc-vitrina',
        locationName: 'Vitrina',
        quantity: 5,
        minStock: 10,
      }),
    );
    expect(bodega.key).not.toBe(vitrina.key);
    expect(bodega.priority).toBe('CRITICAL');
    expect(vitrina.priority).toBe('MEDIUM');
  });
});

describe('buildRechargeBalanceAlert', () => {
  it('returns null when minBalance is 0 (no threshold configured)', () => {
    const type = makeRechargeType({ minBalance: 0 });
    const balance = makeBalance({ dailyBalance: 0 });
    expect(buildRechargeBalanceAlert(type, balance)).toBeNull();
  });

  it('returns null when there is no balance history yet', () => {
    const type = makeRechargeType({ minBalance: 100 });
    expect(buildRechargeBalanceAlert(type, undefined)).toBeNull();
  });

  it('returns null when the balance is comfortably above the minimum', () => {
    const type = makeRechargeType({ minBalance: 100 });
    const balance = makeBalance({ dailyBalance: 500 });
    expect(buildRechargeBalanceAlert(type, balance)).toBeNull();
  });

  it('returns CRITICAL/"Saldo de recargas agotado" when the balance is exactly zero', () => {
    const type = makeRechargeType({ minBalance: 100 });
    const balance = makeBalance({ dailyBalance: 0 });
    const alert = buildRechargeBalanceAlert(type, balance);
    expect(alert?.priority).toBe('CRITICAL');
    expect(alert?.title).toBe('Saldo de recargas agotado');
  });

  it('returns MEDIUM/"Saldo bajo de recargas" when at or below the minimum but not zero', () => {
    const type = makeRechargeType({ minBalance: 100 });
    const balance = makeBalance({ dailyBalance: 80 });
    const alert = buildRechargeBalanceAlert(type, balance);
    expect(alert?.priority).toBe('MEDIUM');
    expect(alert?.title).toBe('Saldo bajo de recargas');
  });

  it('evaluates Claro and Tigo fully independently', () => {
    const claro = makeRechargeType({
      id: 'type-claro',
      name: 'Claro',
      minBalance: 100,
    });
    const tigo = makeRechargeType({
      id: 'type-tigo',
      name: 'Tigo',
      minBalance: 50,
    });
    const claroBalance = makeBalance({
      rechargeTypeId: 'type-claro',
      dailyBalance: 20,
    });
    const tigoBalance = makeBalance({
      rechargeTypeId: 'type-tigo',
      dailyBalance: 500,
    });

    const claroAlert = buildRechargeBalanceAlert(claro, claroBalance);
    const tigoAlert = buildRechargeBalanceAlert(tigo, tigoBalance);

    expect(claroAlert?.priority).toBe('MEDIUM');
    expect(tigoAlert).toBeNull();
  });
});

describe('buildCashBoxBalanceAlert', () => {
  it('returns null when the balance is positive', () => {
    expect(buildCashBoxBalanceAlert(100)).toBeNull();
  });

  it('returns null when the balance is exactly zero', () => {
    expect(buildCashBoxBalanceAlert(0)).toBeNull();
  });

  it('returns a CRITICAL alert when the balance is negative', () => {
    const alert = buildCashBoxBalanceAlert(-50);
    expect(alert).toMatchObject({
      key: 'recharge-cash-box:balance',
      type: 'NEGATIVE_CASH_BOX_BALANCE',
      priority: 'CRITICAL',
      amount: -50,
      route: '/dashboard/gestion-caja-recargas',
    });
  });
});
