import type {
  AccountReceivableSettlementRepository,
  ChargeBalance,
  SettlementWithDetails,
} from '../../domain/repositories/account-receivable-settlement.repository';
import {
  GetChargePaymentHistoryUseCase,
  GetClientPendingChargesUseCase,
  PreviewAccountReceivableSettlementUseCase,
  SettleAccountsReceivableUseCase,
  VoidAccountReceivableSettlementUseCase,
} from './account-receivable-settlement.use-cases';
import { ListAccountsReceivableUseCase } from './list-accounts-receivable.use-case';
import { AccountReceivable } from '../../domain/entities/account-receivable.entity';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';

const CLIENT = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';

function charge(
  id: string,
  pending: number,
  original = pending,
  clientId = CLIENT,
): ChargeBalance {
  return {
    id,
    clientId,
    clientName: clientId === CLIENT ? 'Cliente A' : 'Cliente B',
    date: '2026-11-10',
    description: `Cuenta ${id}`,
    originalAmount: original,
    paidAmount: original - pending,
    pendingAmount: pending,
    status:
      pending === 0
        ? 'CANCELADA'
        : pending < original
          ? 'PARCIAL'
          : 'PENDIENTE',
    createdAt: new Date(),
  };
}

const OPERATION = {
  id: 'op-1',
  totalAmount: 2250,
  details: [],
} as unknown as SettlementWithDetails;

function repository(
  overrides: Partial<AccountReceivableSettlementRepository> = {},
) {
  return {
    findChargeBalances: jest.fn().mockResolvedValue([]),
    findChargeBalancesByIds: jest.fn().mockResolvedValue([]),
    settle: jest.fn().mockResolvedValue('op-1'),
    void: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(OPERATION),
    findAll: jest.fn(),
    findChargePayments: jest.fn().mockResolvedValue([]),
    getCashBalance: jest.fn().mockResolvedValue(152250),
    findBank: jest.fn().mockResolvedValue({
      id: 'bank-1',
      name: 'Banco Industrial',
      accountNumber: '123',
      isActive: true,
      specialAccount: 'BANCO_INDUSTRIAL',
      balance: 50000,
    }),
    findClientName: jest.fn().mockResolvedValue('Cliente A'),
    ...overrides,
  } as jest.Mocked<AccountReceivableSettlementRepository>;
}

describe('PreviewAccountReceivableSettlementUseCase', () => {
  it('sums the pendings computed by the backend and projects the cash balance (cash)', async () => {
    const repo = repository({
      findChargeBalancesByIds: jest
        .fn()
        .mockResolvedValue([
          charge('a', 500),
          charge('b', 1000),
          charge('c', 750),
        ]),
      getCashBalance: jest.fn().mockResolvedValue(150000),
    });
    const result = await new PreviewAccountReceivableSettlementUseCase(
      repo,
    ).execute({
      clientId: CLIENT,
      paymentMethod: 'EFECTIVO',
      items: [
        { accountReceivableId: 'a' },
        { accountReceivableId: 'b' },
        { accountReceivableId: 'c' },
      ],
    });
    expect(result.total).toBe(2250);
    expect(result.cash).toEqual({ current: 150000, after: 152250 });
    expect(result.bank).toBeNull();
    expect(result.lines.map((line) => line.pendingAfter)).toEqual([0, 0, 0]);
  });

  it('projects the bank balance and leaves cash untouched (bank deposit)', async () => {
    const repo = repository({
      findChargeBalancesByIds: jest.fn().mockResolvedValue([charge('a', 2000)]),
    });
    const result = await new PreviewAccountReceivableSettlementUseCase(
      repo,
    ).execute({
      clientId: CLIENT,
      paymentMethod: 'DEPOSITO_BANCARIO',
      bankId: 'bank-1',
      items: [{ accountReceivableId: 'a' }],
    });
    expect(result.bank).toMatchObject({ current: 50000, after: 52000 });
    expect(result.cash).toBeNull();
    expect(repo.getCashBalance).not.toHaveBeenCalled();
  });

  it('rejects accounts of different clients', async () => {
    const repo = repository({
      findChargeBalancesByIds: jest
        .fn()
        .mockResolvedValue([charge('a', 100), charge('b', 100, 100, OTHER)]),
    });
    await expect(
      new PreviewAccountReceivableSettlementUseCase(repo).execute({
        clientId: CLIENT,
        paymentMethod: 'EFECTIVO',
        items: [{ accountReceivableId: 'a' }, { accountReceivableId: 'b' }],
      }),
    ).rejects.toMatchObject({ code: 'AR_SETTLEMENT_MIXED_CLIENTS' });
  });

  it('rejects an already cancelled account', async () => {
    const repo = repository({
      findChargeBalancesByIds: jest
        .fn()
        .mockResolvedValue([charge('a', 0, 500)]),
    });
    await expect(
      new PreviewAccountReceivableSettlementUseCase(repo).execute({
        clientId: CLIENT,
        paymentMethod: 'EFECTIVO',
        items: [{ accountReceivableId: 'a' }],
      }),
    ).rejects.toMatchObject({ code: 'AR_SETTLEMENT_ALREADY_SETTLED' });
  });

  it('allows a partial amount only for a single account', async () => {
    const repo = repository({
      findChargeBalancesByIds: jest
        .fn()
        .mockResolvedValue([charge('a', 1000), charge('b', 500)]),
    });
    const useCase = new PreviewAccountReceivableSettlementUseCase(repo);
    await expect(
      useCase.execute({
        clientId: CLIENT,
        paymentMethod: 'EFECTIVO',
        items: [
          { accountReceivableId: 'a', amount: 400 },
          { accountReceivableId: 'b' },
        ],
      }),
    ).rejects.toMatchObject({ code: 'AR_SETTLEMENT_PARTIAL_NOT_ALLOWED' });

    const single = await useCase.execute({
      clientId: CLIENT,
      paymentMethod: 'EFECTIVO',
      items: [{ accountReceivableId: 'a', amount: 400 }],
    });
    expect(single.total).toBe(400);
    expect(single.lines[0].pendingAfter).toBe(600);
  });

  it('rejects the Guayacán account and a missing bank', async () => {
    const repo = repository({
      findChargeBalancesByIds: jest.fn().mockResolvedValue([charge('a', 100)]),
      findBank: jest.fn().mockResolvedValue({
        id: 'g',
        name: 'Guayacán',
        accountNumber: null,
        isActive: true,
        specialAccount: 'GUAYACAN',
        balance: 0,
      }),
    });
    const useCase = new PreviewAccountReceivableSettlementUseCase(repo);
    await expect(
      useCase.execute({
        clientId: CLIENT,
        paymentMethod: 'DEPOSITO_BANCARIO',
        bankId: 'g',
        items: [{ accountReceivableId: 'a' }],
      }),
    ).rejects.toMatchObject({ code: 'AR_SETTLEMENT_GUAYACAN_NOT_ALLOWED' });
    await expect(
      useCase.execute({
        clientId: CLIENT,
        paymentMethod: 'DEPOSITO_BANCARIO',
        items: [{ accountReceivableId: 'a' }],
      }),
    ).rejects.toMatchObject({ code: 'AR_SETTLEMENT_BANK_REQUIRED' });
  });
});

describe('SettleAccountsReceivableUseCase', () => {
  it('rejects non-admin roles before touching the database', async () => {
    const repo = repository();
    await expect(
      new SettleAccountsReceivableUseCase(repo).execute({
        clientId: CLIENT,
        paymentMethod: 'EFECTIVO',
        items: [{ accountReceivableId: 'a' }],
        userId: 'u',
        role: 'USER',
      }),
    ).rejects.toMatchObject({ code: 'AR_SETTLEMENT_FORBIDDEN', status: 403 });
    expect(repo.settle).not.toHaveBeenCalled();
  });

  it('derives a stable idempotency key and never sends bank data for cash', async () => {
    const repo = repository();
    const result = await new SettleAccountsReceivableUseCase(repo).execute({
      clientId: CLIENT,
      paymentMethod: 'EFECTIVO',
      bankId: 'bank-1',
      referenceNumber: 'X',
      items: [{ accountReceivableId: 'a' }, { accountReceivableId: 'b' }],
      expectedTotal: 2250,
      clientRequestId: 'req-1',
      userId: 'u',
      role: 'ADMIN',
    });
    expect(repo.settle).toHaveBeenCalledWith(
      expect.objectContaining({
        idempotencyKey: 'ARP:req-1',
        bankId: null,
        referenceNumber: null,
        expectedTotal: 2250,
        items: [
          { accountReceivableId: 'a', amount: null },
          { accountReceivableId: 'b', amount: null },
        ],
      }),
    );
    expect(result).toEqual({ operation: OPERATION, cashBalance: 152250 });
  });

  it('keeps the bank and deposit reference for a bank deposit', async () => {
    const repo = repository();
    await new SettleAccountsReceivableUseCase(repo).execute({
      clientId: CLIENT,
      paymentMethod: 'DEPOSITO_BANCARIO',
      bankId: 'bank-1',
      referenceNumber: '  BOL-1  ',
      items: [{ accountReceivableId: 'a' }],
      userId: 'u',
      role: 'SUPER_ADMIN',
    });
    expect(repo.settle).toHaveBeenCalledWith(
      expect.objectContaining({
        bankId: 'bank-1',
        referenceNumber: 'BOL-1',
        paymentMethod: 'DEPOSITO_BANCARIO',
      }),
    );
  });
});

describe('VoidAccountReceivableSettlementUseCase', () => {
  it('requires a reason and an admin role', async () => {
    const repo = repository();
    const useCase = new VoidAccountReceivableSettlementUseCase(repo);
    await expect(
      useCase.execute({ id: 'op-1', reason: 'no', userId: 'u', role: 'ADMIN' }),
    ).rejects.toMatchObject({
      code: 'AR_SETTLEMENT_REASON_REQUIRED',
    });
    await expect(
      useCase.execute({
        id: 'op-1',
        reason: 'Pago duplicado',
        userId: 'u',
        role: 'USER',
      }),
    ).rejects.toMatchObject({ code: 'AR_SETTLEMENT_FORBIDDEN' });
    await useCase.execute({
      id: 'op-1',
      reason: '  Pago duplicado ',
      userId: 'u',
      role: 'ADMIN',
    });
    expect(repo.void).toHaveBeenCalledWith('op-1', 'u', 'Pago duplicado');
  });
});

describe('queries', () => {
  it('lists only accounts with a pending amount and totals them', async () => {
    const repo = repository({
      findChargeBalances: jest
        .fn()
        .mockResolvedValue([
          charge('a', 0, 500),
          charge('b', 600, 1000),
          charge('c', 750),
        ]),
    });
    const result = await new GetClientPendingChargesUseCase(repo).execute(
      CLIENT,
    );
    expect(result.charges.map((row) => row.id)).toEqual(['b', 'c']);
    expect(result.totalPending).toBe(1350);
  });

  it('returns the payment history of one account', async () => {
    const repo = repository({
      findChargeBalancesByIds: jest
        .fn()
        .mockResolvedValue([charge('a', 600, 1000)]),
    });
    const result = await new GetChargePaymentHistoryUseCase(repo).execute('a');
    expect(result.charge?.status).toBe('PARCIAL');
    expect(repo.findChargePayments).toHaveBeenCalledWith('a');
  });

  it('adds pending/status of each CARGO to the Cuentas por Cobrar list', async () => {
    const record = AccountReceivable.create({
      id: 'a',
      clientId: CLIENT,
      clientName: 'Cliente A',
      date: '2026-11-10',
      amount: 1000,
      movementType: 'CARGO',
      sequence: 1,
      description: null,
      referenceType: null,
      referenceId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'u',
      createdByUsername: 'admin',
      updatedBy: null,
      updatedByUsername: null,
    });
    const listRepo = {
      findAll: jest
        .fn()
        .mockResolvedValue({ items: [record], total: 1, page: 1, limit: 20 }),
    } as unknown as AccountReceivableRepository;
    const repo = repository({
      findChargeBalances: jest.fn().mockResolvedValue([charge('a', 600, 1000)]),
    });
    const result = await new ListAccountsReceivableUseCase(
      listRepo,
      repo,
    ).execute({});
    expect(repo.findChargeBalances).toHaveBeenCalledWith([CLIENT]);
    expect(result.items[0]).toMatchObject({
      pendingAmount: 600,
      paidAmount: 400,
      paymentStatus: 'PARCIAL',
    });
  });
});
