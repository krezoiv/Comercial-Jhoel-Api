import type {
  CashCustodyRepository,
  CashCustodySnapshot,
} from '../../domain/repositories/cash-custody.repository';
import {
  GetCashCustodyUseCase,
  ListCashCountsUseCase,
  RegisterCashCountUseCase,
  RegisterWarehouseInitialBalanceUseCase,
  RegisterWarehouseTransferUseCase,
  VoidWarehouseTransferUseCase,
} from './cash-custody.use-cases';

const SUPER = { userId: 'u-super', role: 'SUPER_ADMIN' };
const SUPERVISOR = { userId: 'u-sup', role: 'SUPERVISOR_DE_TURNO' };
const USER = { userId: 'u-user', role: 'USER' };

const custody: CashCustodySnapshot = {
  cashBalance: 85000,
  warehouseBalance: 35000,
  custodyTotal: 120000,
  warehouseHasInitialBalance: true,
  warehouseLastMovementAt: null,
  currentDay: { businessDate: '2026-11-11', isOpen: true },
  deliveredToday: 15000,
};

function repository(): jest.Mocked<CashCustodyRepository> {
  return {
    getCustody: jest.fn().mockResolvedValue(custody),
    registerTransfer: jest.fn().mockResolvedValue('t1'),
    voidTransfer: jest.fn().mockResolvedValue('t1'),
    findTransfers: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0, page: 1, limit: 25 }),
    findTransferById: jest.fn().mockResolvedValue({ id: 't1', amount: 15000 }),
    registerWarehouseInitialBalance: jest.fn().mockResolvedValue('w1'),
    findWarehouseMovements: jest.fn(),
    registerCount: jest.fn().mockResolvedValue('c1'),
    findCounts: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0, page: 1, limit: 25 }),
    findCountById: jest.fn().mockResolvedValue({
      id: 'c1',
      difference: -500,
      result: 'FALTANTE',
    }),
  };
}

async function expectCode(promise: Promise<unknown>, code: string) {
  await expect(promise).rejects.toMatchObject({ code });
}

describe('Arqueo de caja y Bodega — casos de uso', () => {
  it('custody indicators require cash_custody.view (cashiers excluded)', async () => {
    const repo = repository();
    await expectCode(
      new GetCashCustodyUseCase(repo).execute(USER),
      'CASH_CUSTODY_FORBIDDEN',
    );
    expect(await new GetCashCustodyUseCase(repo).execute(SUPERVISOR)).toEqual(
      custody,
    );
  });

  it('a supervisor delivers with breakdown; zero rows are dropped and the key is namespaced', async () => {
    const repo = repository();
    const result = await new RegisterWarehouseTransferUseCase(repo).execute({
      amount: 15000,
      details: [
        { denomination: 200, quantity: 75 },
        { denomination: 100, quantity: 0 },
      ],
      deliveredBy: ' Juan Caja ',
      receivedBy: 'Ana Bodega',
      clientRequestId: 'req-1',
      ...SUPERVISOR,
    });
    expect(repo.registerTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        details: [{ denomination: 200, quantity: 75 }],
        deliveredBy: 'Juan Caja',
        idempotencyKey: 'WHT:req-1',
      }),
    );
    expect(result.custody.custodyTotal).toBe(120000);
  });

  it('a delivery without breakdown needs an administrator (business policy)', async () => {
    const repo = repository();
    const base = {
      amount: 100,
      deliveredBy: 'Juan Caja',
      receivedBy: 'Ana Bodega',
      clientRequestId: 'req-2',
    };
    await expectCode(
      new RegisterWarehouseTransferUseCase(repo).execute({
        ...base,
        ...SUPERVISOR,
      }),
      'CASH_CUSTODY_FORBIDDEN',
    );
    expect(repo.registerTransfer).not.toHaveBeenCalled();
    await new RegisterWarehouseTransferUseCase(repo).execute({
      ...base,
      ...SUPER,
    });
    expect(repo.registerTransfer).toHaveBeenCalledWith(
      expect.objectContaining({ details: [] }),
    );
  });

  it('cashiers cannot deliver; voids need authorize and a reason', async () => {
    const repo = repository();
    await expectCode(
      new RegisterWarehouseTransferUseCase(repo).execute({
        amount: 100,
        details: [{ denomination: 100, quantity: 1 }],
        deliveredBy: 'Juan Caja',
        receivedBy: 'Ana Bodega',
        clientRequestId: 'req-3',
        ...USER,
      }),
      'CASH_CUSTODY_FORBIDDEN',
    );
    await expectCode(
      new VoidWarehouseTransferUseCase(repo).execute({
        id: 't1',
        reason: 'Error de registro',
        ...SUPERVISOR,
      }),
      'CASH_CUSTODY_FORBIDDEN',
    );
    await expectCode(
      new VoidWarehouseTransferUseCase(repo).execute({
        id: 't1',
        reason: 'x',
        ...SUPER,
      }),
      'CASH_REASON_REQUIRED',
    );
    await new VoidWarehouseTransferUseCase(repo).execute({
      id: 't1',
      reason: 'Entrega duplicada',
      ...SUPER,
    });
    expect(repo.voidTransfer).toHaveBeenCalledWith(
      't1',
      SUPER.userId,
      'Entrega duplicada',
    );
  });

  it('Bodega initial balance is admin-only', async () => {
    const repo = repository();
    await expectCode(
      new RegisterWarehouseInitialBalanceUseCase(repo).execute({
        amount: 20000,
        reason: 'Saldo inicial',
        clientRequestId: 'r',
        ...SUPERVISOR,
      }),
      'CASH_CUSTODY_FORBIDDEN',
    );
  });

  it('a count is stored as returned by the database (no client-side math) and never adjusts anything', async () => {
    const repo = repository();
    const count = await new RegisterCashCountUseCase(repo).execute({
      details: [
        { denomination: 200, quantity: 422 },
        { denomination: 100, quantity: 1 },
      ],
      clientRequestId: 'arq-1',
      ...SUPERVISOR,
    });
    expect(count.result).toBe('FALTANTE');
    expect(repo.registerCount).toHaveBeenCalledWith(
      expect.objectContaining({
        idempotencyKey: 'ARQ:arq-1',
        replacesId: null,
      }),
    );
    await expectCode(
      new RegisterCashCountUseCase(repo).execute({
        details: [],
        clientRequestId: 'arq-2',
        ...SUPERVISOR,
      }),
      'CASH_BREAKDOWN_REQUIRED',
    );
  });

  it('a correction needs authorize and a reason', async () => {
    const repo = repository();
    const base = {
      details: [{ denomination: 200, quantity: 425 }],
      clientRequestId: 'arq-3',
      replacesId: 'c1',
    };
    await expectCode(
      new RegisterCashCountUseCase(repo).execute({
        ...base,
        correctionReason: 'Fajo mal contado',
        ...SUPERVISOR,
      }),
      'CASH_CUSTODY_FORBIDDEN',
    );
    await expectCode(
      new RegisterCashCountUseCase(repo).execute({
        ...base,
        correctionReason: 'x',
        ...SUPER,
      }),
      'CASH_REASON_REQUIRED',
    );
    await new RegisterCashCountUseCase(repo).execute({
      ...base,
      correctionReason: 'Fajo mal contado',
      ...SUPER,
    });
    expect(repo.registerCount).toHaveBeenCalledWith(
      expect.objectContaining({
        replacesId: 'c1',
        correctionReason: 'Fajo mal contado',
      }),
    );
  });

  it('count history validates the date range', async () => {
    await expectCode(
      new ListCashCountsUseCase(repository()).execute({
        dateFrom: '2026-11-10',
        dateTo: '2026-11-01',
        ...SUPER,
      }),
      'CASH_INVALID_DATE_RANGE',
    );
  });
});
