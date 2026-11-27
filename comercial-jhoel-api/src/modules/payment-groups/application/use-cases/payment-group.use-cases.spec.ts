import type { DayOpeningRepository } from '../../../banks/domain/repositories/day-opening.repository';
import type { PaymentGroupRepository } from '../../domain/repositories/payment-group.repository';
import {
  PaymentGroupSummaryRow,
  closeCheckOf,
  paymentGroupErrorFromMessage,
} from '../../domain/payment-group';
import {
  ClosePaymentGroupUseCase,
  CreatePaymentGroupUseCase,
  MarkPaymentGroupNoPaymentUseCase,
  RegisterPaymentGroupDeliveryUseCase,
  ResolvePaymentGroupItemUseCase,
  VoidPaymentGroupItemUseCase,
} from './payment-group.use-cases';

const CASHIER = { userId: 'u-cashier', role: 'USER' };
const ADMIN = { userId: 'u-admin', role: 'ADMIN' };

const group = (
  over: Partial<PaymentGroupSummaryRow> = {},
): PaymentGroupSummaryRow =>
  ({
    id: 'g-1',
    code: 'PG-000001',
    number: 1,
    transactionTypeId: 't-1',
    transactionTypeName: 'Pago Varios',
    cashDirection: 'OUT',
    description: 'Pagos varios del día',
    operationDate: '2026-11-26',
    authorizedAmount: 5000,
    lifecycle: 'ABIERTO',
    status: 'PARCIAL',
    itemCount: 10,
    paidCount: 3,
    partialCount: 1,
    noPaymentCount: 1,
    pendingCount: 5,
    voidedCount: 0,
    unresolvedCount: 2,
    paidAmount: 1800,
    releasedAmount: 0,
    reservedAmount: 3200,
    ...over,
  }) as PaymentGroupSummaryRow;

function repository(): jest.Mocked<PaymentGroupRepository> {
  return {
    findGroups: jest.fn(),
    findGroup: jest.fn().mockResolvedValue(group()),
    findItems: jest.fn().mockResolvedValue([]),
    findEvents: jest.fn().mockResolvedValue([]),
    getCashSnapshot: jest
      .fn()
      .mockResolvedValue({ balance: 8200, reserved: 3200, available: 5000 }),
    create: jest.fn().mockResolvedValue('g-1'),
    registerDelivery: jest.fn().mockResolvedValue('d-1'),
    markNoPayment: jest.fn(),
    addNote: jest.fn(),
    updateItem: jest.fn(),
    resolveItem: jest.fn(),
    voidItem: jest.fn(),
    close: jest.fn(),
    voidGroup: jest.fn(),
    updatePending: jest.fn(),
    approve: jest.fn(),
  };
}

const openDay = {
  findByDate: jest.fn().mockResolvedValue({ isClosed: false }),
} as unknown as DayOpeningRepository;

describe('Pagos grupales — casos de uso', () => {
  it('creating a group needs the open day and sends an idempotent request', async () => {
    const repo = repository();
    const closedDay = {
      findByDate: jest.fn().mockResolvedValue(null),
    } as unknown as DayOpeningRepository;
    const input = {
      transactionTypeId: 't-1',
      description: 'Pagos varios del día',
      authorizedAmount: 5000,
      items: [{ expectedAmount: 500, reference: ' Juan ' }],
      clientRequestId: 'req-1',
    };
    await expect(
      new CreatePaymentGroupUseCase(repo, closedDay).execute(input, CASHIER),
    ).rejects.toMatchObject({
      code: 'PAYMENT_GROUP_DAY_NOT_OPEN',
    });
    const detail = await new CreatePaymentGroupUseCase(repo, openDay).execute(
      input,
      CASHIER,
    );
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idempotencyKey: 'PG:req-1',
        userId: 'u-cashier',
        items: [
          {
            expectedAmount: 500,
            reference: 'Juan',
            creditNumber: null,
            observation: null,
          },
        ],
      }),
    );
    expect(detail.cash).toEqual({
      balance: 8200,
      reserved: 3200,
      available: 5000,
    });
  });

  it('a confirmation is idempotent by request and returns the refreshed group', async () => {
    const repo = repository();
    await new RegisterPaymentGroupDeliveryUseCase(repo, openDay).execute(
      'g-1',
      'i-6',
      { amount: 300, note: ' Faltan Q200.00 ', clientRequestId: 'req-6' },
      CASHIER,
    );
    expect(repo.registerDelivery).toHaveBeenCalledWith(
      'g-1',
      'i-6',
      300,
      'Faltan Q200.00',
      'u-cashier',
      'PGD:req-6',
    );
  });

  it('no payment needs its observation', async () => {
    const repo = repository();
    await expect(
      new MarkPaymentGroupNoPaymentUseCase(repo).execute(
        'g-1',
        'i-4',
        'no',
        CASHIER,
      ),
    ).rejects.toMatchObject({ code: 'PAYMENT_GROUP_NOTE_REQUIRED' });
    await new MarkPaymentGroupNoPaymentUseCase(repo).execute(
      'g-1',
      'i-4',
      'El beneficiario no recibió el pago',
      CASHIER,
    );
    expect(repo.markNoPayment).toHaveBeenCalled();
  });

  it('releasing, voiding and closing are admin-only; documenting is not', async () => {
    const repo = repository();
    await expect(
      new ResolvePaymentGroupItemUseCase(repo).execute(
        'g-1',
        'i-4',
        { resolution: 'No llegó', release: true },
        CASHIER,
      ),
    ).rejects.toMatchObject({ status: 403 });
    await new ResolvePaymentGroupItemUseCase(repo).execute(
      'g-1',
      'i-4',
      { resolution: 'No llegó', release: false },
      CASHIER,
    );
    await expect(
      new VoidPaymentGroupItemUseCase(repo).execute(
        'g-1',
        'i-8',
        { reason: 'Baja', moneyReturned: false },
        CASHIER,
      ),
    ).rejects.toMatchObject({ status: 403 });
    await expect(
      new ClosePaymentGroupUseCase(repo).execute('g-1', null, CASHIER),
    ).rejects.toMatchObject({ status: 403 });
    await new ClosePaymentGroupUseCase(repo).execute(
      'g-1',
      'Conciliado',
      ADMIN,
    );
    expect(repo.close).toHaveBeenCalledWith('g-1', 'Conciliado', 'u-admin');
  });

  it('the close check comes from the database figures', () => {
    expect(closeCheckOf(group())).toEqual({
      canClose: false,
      pendingCount: 5,
      unresolvedCount: 2,
      releaseOnClose: 3200,
    });
    expect(
      closeCheckOf(
        group({
          pendingCount: 0,
          unresolvedCount: 0,
          paidAmount: 2300,
          releasedAmount: 1500,
        }),
      ),
    ).toMatchObject({ canClose: true, releaseOnClose: 1200 });
    expect(closeCheckOf(group({ lifecycle: 'CERRADO' }))).toMatchObject({
      canClose: false,
      releaseOnClose: 0,
    });
  });

  it('maps the database rules to clear messages, never inventing money', () => {
    expect(
      paymentGroupErrorFromMessage(
        'PAYMENT_GROUP_INSUFFICIENT_AVAILABLE:4500.00',
      )?.message,
    ).toContain('Q4,500.00');
    expect(
      paymentGroupErrorFromMessage('PAYMENT_GROUP_AMOUNT_EXCEEDS:200.00')
        ?.message,
    ).toContain('Q200.00');
    expect(
      paymentGroupErrorFromMessage('PAYMENT_GROUP_ITEM_HAS_PAYMENTS:500.00')
        ?.message,
    ).toContain('realmente regresó');
    expect(
      paymentGroupErrorFromMessage(
        'PAYMENT_GROUP_OPERATION_LOCKED:PG-000001 #3',
      )?.message,
    ).toContain('PG-000001 #3');
    expect(paymentGroupErrorFromMessage('SOMETHING_ELSE')).toBeNull();
  });
});
