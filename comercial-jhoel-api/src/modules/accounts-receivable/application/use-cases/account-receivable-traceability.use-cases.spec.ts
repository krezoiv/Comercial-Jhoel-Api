import { AccountReceivable } from '../../domain/entities/account-receivable.entity';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { DeactivateAccountReceivableUseCase } from './deactivate-account-receivable.use-case';
import { GetAccountReceivableTraceUseCase } from './get-account-receivable-trace.use-case';
import { RegisterAccountReceivablePaymentUseCase } from './register-account-receivable-payment.use-case';
import { UpdateAccountReceivableUseCase } from './update-account-receivable.use-case';

const CLIENT = '11111111-1111-1111-1111-111111111111';

function record(
  over: Partial<Parameters<typeof AccountReceivable.create>[0]> = {},
): AccountReceivable {
  return AccountReceivable.create({
    id: 'r-1',
    clientId: CLIENT,
    clientName: 'Cliente A',
    date: '2026-11-26',
    amount: 150,
    movementType: 'ABONO',
    sequence: 1,
    description: 'Abono',
    referenceType: null,
    referenceId: null,
    paymentMethod: 'EFECTIVO',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'u-1',
    createdByUsername: 'admin',
    updatedBy: null,
    updatedByUsername: null,
    ...over,
  });
}

function repository(
  over: Partial<jest.Mocked<AccountReceivableRepository>> = {},
): jest.Mocked<AccountReceivableRepository> {
  return {
    findAll: jest.fn(),
    getReportSummary: jest.fn(),
    findById: jest.fn().mockResolvedValue(record()),
    create: jest.fn(),
    update: jest.fn().mockResolvedValue(record({ amount: 180 })),
    deactivate: jest.fn().mockResolvedValue(undefined),
    registerMovement: jest.fn().mockResolvedValue(record()),
    getCurrentBalance: jest.fn(),
    getTrace: jest.fn().mockResolvedValue(null),
    getStatement: jest.fn(),
    ...over,
  };
}

const clients = {
  findById: jest.fn().mockResolvedValue({ id: CLIENT, isActive: true }),
} as unknown as ClientRepository;

describe('Cuentas por Cobrar — trazabilidad con Caja', () => {
  it('changing the amount of a cash abono requires a reason, passed to the database', async () => {
    const repo = repository();
    const useCase = new UpdateAccountReceivableUseCase(repo, clients);
    await expect(
      useCase.execute('r-1', { amount: 180, updatedBy: 'u-2' }),
    ).rejects.toMatchObject({ code: 'PORTFOLIO_CHANGE_REASON_REQUIRED' });
    expect(repo.update).not.toHaveBeenCalled();

    await useCase.execute('r-1', {
      amount: 180,
      reason: ' El cliente entregó Q180 ',
      updatedBy: 'u-2',
    });
    expect(repo.update).toHaveBeenCalledWith(
      'r-1',
      expect.objectContaining({
        amount: 180,
        reason: 'El cliente entregó Q180',
        updatedBy: 'u-2',
      }),
    );
  });

  it('switching cash ↔ bank also needs a reason; administrative data does not', async () => {
    const repo = repository();
    const useCase = new UpdateAccountReceivableUseCase(repo, clients);
    await expect(
      useCase.execute('r-1', { paymentMethod: 'BANCO', updatedBy: 'u-2' }),
    ).rejects.toMatchObject({ code: 'PORTFOLIO_CHANGE_REASON_REQUIRED' });

    await useCase.execute('r-1', {
      description: 'Abono de la semana',
      date: '2026-11-25',
      amount: 150,
      updatedBy: 'u-2',
    });
    expect(repo.update).toHaveBeenCalledWith(
      'r-1',
      expect.objectContaining({
        description: 'Abono de la semana',
        reason: null,
      }),
    );
  });

  it('deleting asks for the reason and who did it; a voided record is never voided again', async () => {
    const repo = repository();
    const useCase = new DeactivateAccountReceivableUseCase(repo);
    await expect(
      useCase.execute('r-1', { reason: 'x', userId: 'u-2' }),
    ).rejects.toMatchObject({ code: 'PORTFOLIO_CHANGE_REASON_REQUIRED' });

    await useCase.execute('r-1', {
      reason: 'Abono registrado dos veces',
      userId: 'u-2',
    });
    expect(repo.deactivate).toHaveBeenCalledWith(
      'r-1',
      'Abono registrado dos veces',
      'u-2',
    );

    repo.findById.mockResolvedValue(record({ isActive: false }));
    repo.deactivate.mockClear();
    await expect(
      useCase.execute('r-1', { reason: 'Otra vez', userId: 'u-2' }),
    ).rejects.toMatchObject({
      code: 'PORTFOLIO_RECORD_ALREADY_VOIDED',
      status: 409,
    });
    expect(repo.deactivate).not.toHaveBeenCalled();
  });

  it('an abono by bank transfer carries its payment method', async () => {
    const repo = repository();
    await new RegisterAccountReceivablePaymentUseCase(repo, clients).execute({
      clientId: CLIENT,
      amount: 300,
      date: '2026-11-26',
      paymentMethod: 'BANCO',
      createdBy: 'u-1',
    });
    expect(repo.registerMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        movementType: 'ABONO',
        paymentMethod: 'BANCO',
      }),
    );
  });

  it('the trace of an unknown record is a 404', async () => {
    await expect(
      new GetAccountReceivableTraceUseCase(repository()).execute('nope'),
    ).rejects.toMatchObject({ status: 404 });
  });
});
