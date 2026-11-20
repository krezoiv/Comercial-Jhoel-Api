import type {
  CashCustodyRepository,
  CashCustodySnapshot,
} from '../../domain/repositories/cash-custody.repository';
import {
  RegisterWarehouseWithdrawalUseCase,
  VoidWarehouseWithdrawalUseCase,
  GetCashCustodyUseCase,
  GetLatestCashCountUseCase,
  GetCashInventoryUseCase,
  RegisterWarehouseCashCountUseCase,
  GetCashCountDraftUseCase,
  SaveCashCountDraftUseCase,
  DiscardCashCountDraftUseCase,
  ListCustodyTransfersUseCase,
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
  returnedToCashToday: 0,
  depositedToBankToday: 0,
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
    registerWithdrawal: jest.fn().mockResolvedValue('w1'),
    voidWithdrawal: jest.fn().mockResolvedValue('w1'),
    findWithdrawals: jest.fn(),
    findWithdrawalById: jest
      .fn()
      .mockResolvedValue({ id: 'w1', referenceNumber: 'RET-000001' }),
    findCountById: jest.fn().mockResolvedValue({
      id: 'c1',
      difference: -500,
      result: 'FALTANTE',
    }),
    findLatestValidCount: jest
      .fn()
      .mockResolvedValue({ count: null, referenceBusinessDate: '2026-11-11' }),
    getInventory: jest
      .fn()
      .mockImplementation((location: string) =>
        Promise.resolve({ location, hasAnchor: true, lines: [] }),
      ),
    registerWarehouseCount: jest.fn().mockResolvedValue('wc1'),
    findWarehouseCounts: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0, page: 1, limit: 25 }),
    findWarehouseCountById: jest.fn().mockResolvedValue({ id: 'wc1' }),
    getCountDraft: jest.fn().mockResolvedValue(null),
    saveCountDraft: jest
      .fn()
      .mockImplementation((_u: string, payload: unknown) =>
        Promise.resolve({
          businessDate: '2026-11-16',
          payload,
          version: 1,
          updatedAt: new Date(),
        }),
      ),
    deleteCountDraft: jest.fn().mockResolvedValue(undefined),
    findCustodyTransfers: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0, page: 1, limit: 25 }),
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

  it('a delivery always needs its breakdown — also for administrators (per-denomination inventory)', async () => {
    const repo = repository();
    const base = {
      amount: 100,
      deliveredBy: 'Juan Caja',
      receivedBy: 'Ana Bodega',
      clientRequestId: 'req-2',
    };
    for (const actor of [SUPERVISOR, SUPER]) {
      await expectCode(
        new RegisterWarehouseTransferUseCase(repo).execute({
          ...base,
          ...actor,
        }),
        'CASH_CUSTODY_BREAKDOWN_REQUIRED',
      );
      await expectCode(
        new RegisterWarehouseTransferUseCase(repo).execute({
          ...base,
          details: [{ denomination: 100, quantity: 0 }],
          ...actor,
        }),
        'CASH_CUSTODY_BREAKDOWN_REQUIRED',
      );
    }
    await expectCode(
      new RegisterWarehouseTransferUseCase(repo).execute({
        ...base,
        details: [{ denomination: 100, quantity: 1.5 }],
        ...SUPER,
      }),
      'CASH_INVALID_DENOMINATION',
    );
    expect(repo.registerTransfer).not.toHaveBeenCalled();
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
    // Only the caja is counted: no Bodega amount ever reaches the database.
    expect(repo.registerCount.mock.calls[0][0]).not.toHaveProperty(
      'warehouseCounted',
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

  it('withdrawal: to caja or bank, bank required for a deposit, namespaced key', async () => {
    const repo = repository();
    const base = {
      amount: 5000,
      details: [{ denomination: 100, quantity: 50 }],
      deliveredBy: 'Ana Bodega',
      receivedBy: 'Juan Caja',
      clientRequestId: 'w-1',
    };
    await new RegisterWarehouseWithdrawalUseCase(repo).execute({
      ...base,
      destination: 'CAJA',
      bankId: 'ignored',
      ...SUPERVISOR,
    });
    expect(repo.registerWithdrawal).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: 'CAJA',
        bankId: null,
        idempotencyKey: 'WHW:w-1',
      }),
    );
    await expectCode(
      new RegisterWarehouseWithdrawalUseCase(repo).execute({
        ...base,
        destination: 'BANCO',
        ...SUPERVISOR,
      }),
      'WAREHOUSE_WITHDRAWAL_BANK_REQUIRED',
    );
    await new RegisterWarehouseWithdrawalUseCase(repo).execute({
      ...base,
      destination: 'BANCO',
      bankId: 'b1',
      ...SUPERVISOR,
    });
    expect(repo.registerWithdrawal).toHaveBeenLastCalledWith(
      expect.objectContaining({ destination: 'BANCO', bankId: 'b1' }),
    );
  });

  it('withdrawal: breakdown always required; cashiers cannot withdraw; voids need authorize', async () => {
    const repo = repository();
    const base = {
      amount: 100,
      deliveredBy: 'Ana Bodega',
      receivedBy: 'Juan Caja',
      clientRequestId: 'w-2',
      destination: 'CAJA' as const,
    };
    for (const actor of [SUPERVISOR, SUPER]) {
      await expectCode(
        new RegisterWarehouseWithdrawalUseCase(repo).execute({
          ...base,
          ...actor,
        }),
        'CASH_CUSTODY_BREAKDOWN_REQUIRED',
      );
    }
    await expectCode(
      new RegisterWarehouseWithdrawalUseCase(repo).execute({
        ...base,
        details: [{ denomination: 100, quantity: 1 }],
        ...USER,
      }),
      'CASH_CUSTODY_FORBIDDEN',
    );
    await expectCode(
      new VoidWarehouseWithdrawalUseCase(repo).execute({
        id: 'w1',
        reason: 'Error de registro',
        ...SUPERVISOR,
      }),
      'CASH_CUSTODY_FORBIDDEN',
    );
    await new VoidWarehouseWithdrawalUseCase(repo).execute({
      id: 'w1',
      reason: 'Error de registro',
      ...SUPER,
    });
    expect(repo.voidWithdrawal).toHaveBeenCalledWith(
      'w1',
      SUPER.userId,
      'Error de registro',
    );
  });

  describe('último arqueo de Caja (Cuadre de Agentes)', () => {
    /** The arqueo of one cut, saved before Q0.01 existed: no row for it. */
    const legacyCount = {
      source: 'CORTE_CAJA',
      id: 'cut-count-2',
      number: null,
      cutPeriodId: 'cut-2',
      cutNumber: 2,
      businessDate: '2026-11-10',
      totalCounted: 4430,
      details: [
        { denomination: 200, quantity: 10, subtotal: 2000 },
        { denomination: 100, quantity: 20, subtotal: 2000 },
        { denomination: 50, quantity: 8, subtotal: 400 },
        { denomination: 0.05, quantity: 600, subtotal: 30 },
      ],
    };

    it('requires cash_custody.view', async () => {
      await expectCode(
        new GetLatestCashCountUseCase(repository()).execute({ role: 'USER' }),
        'CASH_CUSTODY_FORBIDDEN',
      );
    });

    it('no counts → null count, empty breakdown (manual entry stays possible)', async () => {
      const result = await new GetLatestCashCountUseCase(repository()).execute({
        role: 'SUPERVISOR_DE_TURNO',
      });
      expect(result).toEqual({
        count: null,
        breakdown: [],
        referenceBusinessDate: '2026-11-11',
        isFromReferenceDay: false,
      });
    });

    it('an earlier-day count is flagged and its breakdown completed with Q0.01 = 0 without touching the stored rows', async () => {
      const repo = repository();
      repo.findLatestValidCount.mockResolvedValue({
        count: legacyCount as never,
        referenceBusinessDate: '2026-11-11',
      });
      const result = await new GetLatestCashCountUseCase(repo).execute({
        businessDate: '2026-11-11',
        role: 'ADMIN',
      });
      expect(repo.findLatestValidCount).toHaveBeenCalledWith('2026-11-11');
      expect(result.isFromReferenceDay).toBe(false);
      expect(result.breakdown.map((r) => r.denomination)).toEqual([
        200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01,
      ]);
      expect(result.breakdown.at(-1)).toEqual({
        denomination: 0.01,
        quantity: 0,
        subtotal: 0,
      });
      expect(result.breakdown.reduce((s, r) => s + r.subtotal, 0)).toBe(4430);
      expect(legacyCount.details).toHaveLength(4);
      // The record used is returned as-is (the exact cut), never merged with another.
      expect(result.count).toBe(legacyCount as never);
      expect(result.count?.cutNumber).toBe(2);
    });

    it('a count of the reference day is flagged as such', async () => {
      const repo = repository();
      repo.findLatestValidCount.mockResolvedValue({
        count: { ...legacyCount, businessDate: '2026-11-11' } as never,
        referenceBusinessDate: '2026-11-11',
      });
      const result = await new GetLatestCashCountUseCase(repo).execute({
        role: 'ADMIN',
      });
      expect(result.isFromReferenceDay).toBe(true);
    });

    it('rejects a malformed businessDate', async () => {
      await expectCode(
        new GetLatestCashCountUseCase(repository()).execute({
          businessDate: '11/11/2026',
          role: 'ADMIN',
        }),
        'CASH_INVALID_DATE_RANGE',
      );
    });
  });

  describe('inventario por denominación, conteo de Bodega y borradores del arqueo', () => {
    it('inventory of both locations requires cash_custody.view', async () => {
      const repo = repository();
      await expectCode(
        new GetCashInventoryUseCase(repo).execute(USER),
        'CASH_CUSTODY_FORBIDDEN',
      );
      const result = await new GetCashInventoryUseCase(repo).execute(
        SUPERVISOR,
      );
      expect(repo.getInventory).toHaveBeenCalledWith('CAJA');
      expect(repo.getInventory).toHaveBeenCalledWith('BODEGA');
      expect(result.cash.location).toBe('CAJA');
      expect(result.warehouse.location).toBe('BODEGA');
    });

    it('the Bodega count is admin-only, needs a breakdown and namespaces its key', async () => {
      const repo = repository();
      const input = {
        details: [{ denomination: 200, quantity: 5 }],
        clientRequestId: 'c-1',
      };
      await expectCode(
        new RegisterWarehouseCashCountUseCase(repo).execute({
          ...input,
          ...SUPERVISOR,
        }),
        'CASH_CUSTODY_FORBIDDEN',
      );
      await expectCode(
        new RegisterWarehouseCashCountUseCase(repo).execute({
          ...input,
          details: [],
          ...SUPER,
        }),
        'CASH_CUSTODY_BREAKDOWN_REQUIRED',
      );
      await new RegisterWarehouseCashCountUseCase(repo).execute({
        ...input,
        ...SUPER,
      });
      expect(repo.registerWarehouseCount).toHaveBeenCalledWith(
        expect.objectContaining({
          idempotencyKey: 'WHC:c-1',
          userId: 'u-super',
        }),
      );
    });

    it('a draft is always the caller own (JWT user) and validates quantities', async () => {
      const repo = repository();
      await expectCode(
        new GetCashCountDraftUseCase(repo).execute(USER),
        'CASH_CUSTODY_FORBIDDEN',
      );
      await new GetCashCountDraftUseCase(repo).execute(SUPERVISOR);
      expect(repo.getCountDraft).toHaveBeenCalledWith('u-sup');
      await expectCode(
        new SaveCashCountDraftUseCase(repo).execute({
          details: [{ denomination: 200, quantity: -1 }],
          ...SUPERVISOR,
        }),
        'CASH_COUNT_DRAFT_INVALID',
      );
      await expectCode(
        new SaveCashCountDraftUseCase(repo).execute({
          details: [{ denomination: 200, quantity: 1.5 }],
          ...SUPERVISOR,
        }),
        'CASH_COUNT_DRAFT_INVALID',
      );
      const saved = await new SaveCashCountDraftUseCase(repo).execute({
        details: [
          { denomination: 200, quantity: 3 },
          { denomination: 0.01, quantity: 0 },
        ],
        observations: 'Medio conteo',
        ...SUPERVISOR,
      });
      expect(repo.saveCountDraft).toHaveBeenCalledWith('u-sup', {
        details: [
          { denomination: 200, quantity: 3 },
          { denomination: 0.01, quantity: 0 },
        ],
        observations: 'Medio conteo',
      });
      expect(saved.version).toBe(1);
    });

    it('saving a draft without an open bank day fails clearly', async () => {
      const repo = repository();
      repo.saveCountDraft.mockResolvedValue(null);
      await expectCode(
        new SaveCashCountDraftUseCase(repo).execute({
          details: [],
          ...SUPERVISOR,
        }),
        'CASH_CUSTODY_DAY_NOT_OPEN',
      );
    });

    it('confirming a count clears the caller draft; an admin correction does not; discarding is explicit', async () => {
      const repo = repository();
      await new RegisterCashCountUseCase(repo).execute({
        details: [{ denomination: 200, quantity: 1 }],
        clientRequestId: 'a-1',
        ...SUPERVISOR,
      });
      expect(repo.deleteCountDraft).toHaveBeenCalledWith('u-sup');
      repo.deleteCountDraft.mockClear();
      await new RegisterCashCountUseCase(repo).execute({
        details: [{ denomination: 200, quantity: 1 }],
        clientRequestId: 'a-2',
        replacesId: 'c1',
        correctionReason: 'Conteo equivocado',
        ...SUPER,
      });
      expect(repo.deleteCountDraft).not.toHaveBeenCalled();
      await new DiscardCashCountDraftUseCase(repo).execute(SUPERVISOR);
      expect(repo.deleteCountDraft).toHaveBeenCalledWith('u-sup');
    });

    it('a failed count keeps the draft (nothing is cleared before a valid confirmation)', async () => {
      const repo = repository();
      repo.registerCount.mockRejectedValue(
        new Error('CASH_CUSTODY_DAY_NOT_OPEN'),
      );
      await expect(
        new RegisterCashCountUseCase(repo).execute({
          details: [{ denomination: 200, quantity: 1 }],
          clientRequestId: 'a-3',
          ...SUPERVISOR,
        }),
      ).rejects.toThrow();
      expect(repo.deleteCountDraft).not.toHaveBeenCalled();
    });

    it('transfer history requires view and validates the range', async () => {
      const repo = repository();
      await expectCode(
        new ListCustodyTransfersUseCase(repo).execute({ role: 'USER' }),
        'CASH_CUSTODY_FORBIDDEN',
      );
      await expectCode(
        new ListCustodyTransfersUseCase(repo).execute({
          dateFrom: '2026-11-10',
          dateTo: '2026-11-01',
          role: 'ADMIN',
        }),
        'CASH_INVALID_DATE_RANGE',
      );
      await new ListCustodyTransfersUseCase(repo).execute({
        kind: 'BODEGA_A_CAJA',
        userId: 'u1',
        role: 'ADMIN',
      });
      expect(repo.findCustodyTransfers).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'BODEGA_A_CAJA',
          userId: 'u1',
          page: 1,
          limit: 25,
        }),
      );
    });
  });
});
