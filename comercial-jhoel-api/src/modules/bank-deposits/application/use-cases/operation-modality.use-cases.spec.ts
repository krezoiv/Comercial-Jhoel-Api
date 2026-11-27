import { BankDepositOperation } from '../../domain/entities/bank-deposit-operation.entity';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import type { OperationPaymentGroupLink } from '../../domain/operation-modality';
import { GetBankDepositOperationByIdUseCase } from './get-bank-deposit-operation-by-id.use-case';
import { ListBankDepositOperationsUseCase } from './list-bank-deposit-operations.use-case';
import { ListTypeOperationsUseCase } from './list-type-operations.use-case';

function operation(id: string): BankDepositOperation {
  return BankDepositOperation.create({
    id,
    transactionBankId: 'bank-1',
    transactionBankName: 'BI',
    bankAccountId: null,
    bankAccountName: null,
    bankAccountNumber: null,
    transactionTypeId: 'pago-varios',
    transactionTypeName: 'Pago Varios',
    totalAmount: 500,
    transactionCount: 1,
    totalCash: 0,
    totalDistributed: 500,
    operationDate: '2026-11-26',
    changeGiven: 0,
    cashBreakdownEnabled: false,
    clientName: null,
    description: 'Pago grupal PG-000025 · #6 — Pagos del día',
    clientId: null,
    userId: 'user-1',
    username: 'cajero',
    createdAt: new Date('2026-11-26T15:00:00Z'),
    updatedAt: new Date('2026-11-26T15:00:00Z'),
    cashDetails: [],
    transactions: [],
    isVoided: false,
    voidedAt: null,
    voidedBy: null,
    voidedByUsername: null,
    voidReason: null,
  });
}

const LINK: OperationPaymentGroupLink = {
  groupId: 'g-25',
  code: 'PG-000025',
  description: 'Pagos del día',
  groupStatus: 'PENDIENTE',
  itemId: 'i-6',
  itemNumber: 6,
  itemCount: 10,
  itemStatus: 'PAGADO',
  expectedAmount: 500,
  paidAmount: 500,
};

function repository(): jest.Mocked<BankDepositRepository> {
  return {
    findById: jest
      .fn()
      .mockImplementation((id: string) => Promise.resolve(operation(id))),
    findAll: jest.fn().mockResolvedValue({
      items: [operation('op-group'), operation('op-normal')],
      total: 2,
      page: 1,
      limit: 20,
    }),
    findPaymentGroupLinks: jest
      .fn()
      .mockImplementation((ids: string[]) =>
        Promise.resolve(
          new Map(
            ids.filter((id) => id === 'op-group').map((id) => [id, LINK]),
          ),
        ),
      ),
    findTypeEntries: jest.fn().mockResolvedValue({
      items: [],
      total: 0,
      summary: {
        individualCount: 0,
        groupCount: 0,
        groupReserved: 0,
        groupPaid: 0,
        groupOutstanding: 0,
      },
    }),
  } as unknown as jest.Mocked<BankDepositRepository>;
}

describe('Pago individual / Pago grupal (modalidad de las operaciones)', () => {
  it('an operation of a group says so: group code, transaction n of N and status', async () => {
    const repo = repository();
    const grouped = await new GetBankDepositOperationByIdUseCase(repo).execute(
      'op-group',
    );
    expect(grouped).toMatchObject({
      modality: 'GRUPAL',
      paymentGroup: {
        code: 'PG-000025',
        itemNumber: 6,
        itemCount: 10,
        groupStatus: 'PENDIENTE',
      },
    });
    const normal = await new GetBankDepositOperationByIdUseCase(repo).execute(
      'op-normal',
    );
    expect(normal).toMatchObject({
      modality: 'INDIVIDUAL',
      paymentGroup: null,
    });
  });

  it('the operations report marks each row and passes the modality filter', async () => {
    const repo = repository();
    const result = await new ListBankDepositOperationsUseCase(repo).execute({
      modality: 'GRUPAL',
    });
    expect(repo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ modality: 'GRUPAL' }),
    );
    expect(result.items.map((item) => item.modality)).toEqual([
      'GRUPAL',
      'INDIVIDUAL',
    ]);
  });

  it('the per-type list validates dates, bounds the page size and forwards every filter', async () => {
    const repo = repository();
    const useCase = new ListTypeOperationsUseCase(repo);
    await expect(
      useCase.execute({
        transactionTypeId: 't',
        startDate: '2026-11-27',
        endDate: '2026-11-26',
      }),
    ).rejects.toThrow();
    await useCase.execute({
      transactionTypeId: 'pago-varios',
      modality: 'INDIVIDUAL',
      status: 'VIGENTE',
      search: '  PG-000025 ',
      limit: 500,
    });
    expect(repo.findTypeEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionTypeId: 'pago-varios',
        modality: 'INDIVIDUAL',
        status: 'VIGENTE',
        search: 'PG-000025',
        page: 1,
        limit: 100,
      }),
    );
  });
});
