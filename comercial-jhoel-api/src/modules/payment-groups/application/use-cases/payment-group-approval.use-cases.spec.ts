import type { DayOpeningRepository } from '../../../banks/domain/repositories/day-opening.repository';
import type { PaymentGroupRepository } from '../../domain/repositories/payment-group.repository';
import {
  PaymentGroupItemRow,
  PaymentGroupSummaryRow,
  approvalCheckOf,
  closeCheckOf,
  paymentGroupErrorFromMessage,
} from '../../domain/payment-group';
import {
  ApprovePaymentGroupUseCase,
  CreatePaymentGroupUseCase,
  UpdatePendingPaymentGroupUseCase,
} from './payment-group.use-cases';

const CREATOR = { userId: 'u-creator', role: 'USER' };
const OTHER = { userId: 'u-other', role: 'USER' };
const ADMIN = { userId: 'u-admin', role: 'ADMIN' };

/** EL GOLFO: 11 cuotas, Q9,284.00, pending approval. */
const golfo = (over: Partial<PaymentGroupSummaryRow> = {}) =>
  ({
    id: 'g-25',
    code: 'PG-000025',
    transactionTypeName: 'Pago Préstamos Génesis',
    cashDirection: 'IN',
    description: 'EL GOLFO',
    authorizedAmount: 9284,
    assignedAmount: 9284,
    lifecycle: 'ABIERTO',
    status: 'PENDIENTE_APROBACION',
    requiresApproval: true,
    itemCount: 11,
    pendingCount: 11,
    unresolvedCount: 0,
    paidAmount: 0,
    releasedAmount: 0,
    createdBy: 'u-creator',
    ...over,
  }) as PaymentGroupSummaryRow;

const cuota = (n: number, over: Partial<PaymentGroupItemRow> = {}) =>
  ({
    id: `i-${n}`,
    itemNumber: n,
    expectedAmount: n === 11 ? 784 : 850,
    reference: null,
    creditNumber: null,
    observation: null,
    status: 'PENDIENTE',
    ...over,
  }) as PaymentGroupItemRow;

const cuotas = () => Array.from({ length: 11 }, (_, i) => cuota(i + 1));

const openDay = {
  findByDate: jest.fn().mockResolvedValue({ isClosed: false }),
} as unknown as DayOpeningRepository;

function repository(current = golfo()): jest.Mocked<PaymentGroupRepository> {
  return {
    findGroups: jest.fn(),
    findGroup: jest.fn().mockResolvedValue(current),
    findItems: jest.fn().mockResolvedValue(cuotas()),
    findEvents: jest.fn().mockResolvedValue([]),
    getCashSnapshot: jest
      .fn()
      .mockResolvedValue({ balance: 1000, reserved: 0, available: 1000 }),
    create: jest.fn().mockResolvedValue('g-25'),
    registerDelivery: jest.fn(),
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

const rows = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    expectedAmount: 100,
    // A cuota is its amount and, only when needed, an observation.
    observation: i === 0 ? '  Pagó   en efectivo ' : '',
  }));

describe('Pagos grupales Génesis — registro, corrección y aprobación', () => {
  it('the declared number of cuotas must match the rows before anything is saved', async () => {
    const repo = repository();
    await expect(
      new CreatePaymentGroupUseCase(repo, openDay).execute(
        {
          transactionTypeId: 't-genesis',
          description: 'EL GOLFO',
          authorizedAmount: 1000,
          declaredCount: 11,
          items: rows(10),
          clientRequestId: 'req-1',
        },
        CREATOR,
      ),
    ).rejects.toMatchObject({
      code: 'PAYMENT_GROUP_COUNT_MISMATCH',
      message: expect.stringContaining(
        'Hay 10 cuota(s) registrada(s) y se declararon 11',
      ) as string,
    });
    expect(repo.create).not.toHaveBeenCalled();

    await new CreatePaymentGroupUseCase(repo, openDay).execute(
      {
        transactionTypeId: 't-genesis',
        description: 'EL GOLFO',
        authorizedAmount: 1000,
        declaredCount: 10,
        items: rows(10),
        clientRequestId: 'req-1',
      },
      CREATOR,
    );
    expect(repo.create.mock.calls[0][0].items.slice(0, 2)).toEqual([
      {
        expectedAmount: 100,
        creditNumber: null,
        reference: null,
        observation: 'Pagó en efectivo',
      },
      {
        expectedAmount: 100,
        creditNumber: null,
        reference: null,
        observation: null,
      },
    ]);
  });

  it('only the creator or an admin corrects a pending group', async () => {
    const repo = repository();
    const input = {
      description: 'EL GOLFO',
      authorizedAmount: 1000,
      declaredCount: 10,
      items: rows(10),
      note: ' Faltaba una cuota ',
    };
    await expect(
      new UpdatePendingPaymentGroupUseCase(repo).execute('g-25', input, OTHER),
    ).rejects.toMatchObject({
      code: 'PAYMENT_GROUP_EDIT_FORBIDDEN',
      status: 403,
    });
    await new UpdatePendingPaymentGroupUseCase(repo).execute(
      'g-25',
      input,
      CREATOR,
    );
    await new UpdatePendingPaymentGroupUseCase(repo).execute(
      'g-25',
      input,
      ADMIN,
    );
    expect(repo.updatePending).toHaveBeenCalledTimes(2);
    expect(repo.updatePending.mock.calls[0][1].note).toBe('Faltaba una cuota');
    await expect(
      new UpdatePendingPaymentGroupUseCase(
        repository(golfo({ requiresApproval: false })),
      ).execute('g-25', input, ADMIN),
    ).rejects.toMatchObject({ code: 'PAYMENT_GROUP_NOT_EDITABLE' });
  });

  it('only an admin approves, on an open day, with an idempotent request', async () => {
    const repo = repository();
    const input = {
      expectedAmount: 9284,
      expectedCount: 11,
      clientRequestId: 'req-a',
    };
    await expect(
      new ApprovePaymentGroupUseCase(repo, openDay).execute(
        'g-25',
        input,
        CREATOR,
      ),
    ).rejects.toMatchObject({
      code: 'PAYMENT_GROUP_APPROVE_FORBIDDEN',
      status: 403,
    });
    const closedDay = {
      findByDate: jest.fn().mockResolvedValue({ isClosed: true }),
    } as unknown as DayOpeningRepository;
    await expect(
      new ApprovePaymentGroupUseCase(repo, closedDay).execute(
        'g-25',
        input,
        ADMIN,
      ),
    ).rejects.toMatchObject({ code: 'PAYMENT_GROUP_DAY_CLOSED' });
    await new ApprovePaymentGroupUseCase(repo, openDay).execute(
      'g-25',
      input,
      ADMIN,
    );
    expect(repo.approve).toHaveBeenCalledWith(
      'g-25',
      9284,
      11,
      'u-admin',
      'PGA:req-a',
    );
  });

  it('the approval check reports count, sum and difference from the database figures', () => {
    expect(approvalCheckOf(golfo(), cuotas())).toEqual({
      required: true,
      pending: true,
      canApprove: true,
      cuotaCount: 11,
      cuotasTotal: 9284,
      declaredTotal: 9284,
      difference: 0,
    });
    // Cuotas without credit number or client are complete (amount only).
    expect(approvalCheckOf(golfo(), cuotas()).canApprove).toBe(true);
    expect(
      approvalCheckOf(golfo({ assignedAmount: 9300 }), cuotas()),
    ).toMatchObject({
      canApprove: false,
      difference: -16,
    });
    expect(
      approvalCheckOf(
        golfo({ lifecycle: 'CERRADO', status: 'APROBADO' }),
        cuotas(),
      ),
    ).toMatchObject({ pending: false, canApprove: false });
    // An approval group is never closed by hand.
    expect(closeCheckOf(golfo({ pendingCount: 0 })).canClose).toBe(false);
  });

  it('maps the approval rules to clear messages', () => {
    expect(
      paymentGroupErrorFromMessage('PAYMENT_GROUP_TOTAL_MISMATCH:9300.00')
        ?.message,
    ).toContain('Q9,300.00');
    expect(
      paymentGroupErrorFromMessage('PAYMENT_GROUP_CUOTA_INCOMPLETE:5')?.message,
    ).toContain('#5');
    expect(paymentGroupErrorFromMessage('PAYMENT_GROUP_CHANGED')?.status).toBe(
      409,
    );
    expect(
      paymentGroupErrorFromMessage('PAYMENT_GROUP_PENDING_APPROVAL')?.message,
    ).toContain('pendiente de aprobación');
  });
});
