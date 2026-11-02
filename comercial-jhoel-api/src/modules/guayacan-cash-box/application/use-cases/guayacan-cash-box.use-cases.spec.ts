import { RegisterGuayacanCashMovementUseCase } from './register-guayacan-cash-movement.use-case';
import { RegisterGuayacanCashAdjustmentUseCase } from './register-guayacan-cash-adjustment.use-case';
import { VoidGuayacanCashMovementUseCase } from './void-guayacan-cash-movement.use-case';
import { ListGuayacanCashMovementsUseCase } from './list-guayacan-cash-movements.use-case';
import { RegisterGuayacanCashCountUseCase } from './register-guayacan-cash-count.use-case';
import {
  GuayacanCashBoxRepository,
  GuayacanCashMovementDetail,
} from '../../domain/repositories/guayacan-cash-box.repository';
import {
  GuayacanCashBreakdownMismatchError,
  GuayacanInvalidAmountError,
  GuayacanInvalidDateError,
  GuayacanInvalidDenominationError,
  GuayacanReasonRequiredError,
} from '../../domain/errors/guayacan-cash-box.errors';
import { todayIsoDate } from '../utils/today-iso-date';

const MOVEMENT = { id: 'mov-1' } as GuayacanCashMovementDetail;

function buildRepository(): jest.Mocked<GuayacanCashBoxRepository> {
  return {
    registerMovement: jest.fn().mockResolvedValue('mov-1'),
    voidMovement: jest.fn().mockResolvedValue('void-1'),
    findMovementById: jest.fn().mockResolvedValue(MOVEMENT),
    findMovements: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0, page: 1, limit: 20 }),
    getSummary: jest.fn(),
    registerCount: jest.fn().mockResolvedValue('count-1'),
    findLatestCount: jest.fn(),
    findCountById: jest.fn().mockResolvedValue({ id: 'count-1' }),
  };
}

describe('RegisterGuayacanCashMovementUseCase', () => {
  let repository: jest.Mocked<GuayacanCashBoxRepository>;
  let useCase: RegisterGuayacanCashMovementUseCase;

  beforeEach(() => {
    repository = buildRepository();
    useCase = new RegisterGuayacanCashMovementUseCase(repository);
  });

  it('registers an ingreso for today, trimming text and keeping the request id', async () => {
    await useCase.execute({
      movementType: 'INGRESO',
      amount: 500,
      concept: '  Fondo de caja ',
      reason: ' Apertura ',
      notes: '',
      clientRequestId: '6f8f2a3e-8a39-4b7c-9d4f-2a8f0d1c2b3a',
      userId: 'user-1',
    });

    expect(repository.registerMovement).toHaveBeenCalledWith({
      movementType: 'INGRESO',
      amount: 500,
      businessDate: todayIsoDate(),
      userId: 'user-1',
      concept: 'Fondo de caja',
      reason: 'Apertura',
      notes: null,
      cashDetails: [],
      clientRequestId: '6f8f2a3e-8a39-4b7c-9d4f-2a8f0d1c2b3a',
    });
  });

  it.each([0, -5])('rejects amount %p', async (amount) => {
    await expect(
      useCase.execute({
        movementType: 'EGRESO',
        amount,
        concept: 'x',
        userId: 'u',
      }),
    ).rejects.toThrow(GuayacanInvalidAmountError);
    expect(repository.registerMovement).not.toHaveBeenCalled();
  });

  it('accepts a matching breakdown and drops zero rows', async () => {
    await useCase.execute({
      movementType: 'INGRESO',
      amount: 250.5,
      concept: 'Con desglose',
      cashDetails: [
        { denomination: 200, quantity: 1 },
        { denomination: 50, quantity: 1 },
        { denomination: 0.5, quantity: 1 },
        { denomination: 100, quantity: 0 },
      ],
      userId: 'u',
    });

    expect(repository.registerMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        cashDetails: [
          { denomination: 200, quantity: 1 },
          { denomination: 50, quantity: 1 },
          { denomination: 0.5, quantity: 1 },
        ],
      }),
    );
  });

  it('rejects a breakdown that does not add up to the amount', async () => {
    await expect(
      useCase.execute({
        movementType: 'EGRESO',
        amount: 100,
        concept: 'x',
        cashDetails: [{ denomination: 50, quantity: 1 }],
        userId: 'u',
      }),
    ).rejects.toThrow(GuayacanCashBreakdownMismatchError);
  });

  it('rejects an unknown denomination', async () => {
    await expect(
      useCase.execute({
        movementType: 'INGRESO',
        amount: 3,
        concept: 'x',
        cashDetails: [{ denomination: 3, quantity: 1 }],
        userId: 'u',
      }),
    ).rejects.toThrow(GuayacanInvalidDenominationError);
  });

  it('rejects a future business date', async () => {
    await expect(
      useCase.execute({
        movementType: 'INGRESO',
        amount: 10,
        concept: 'x',
        businessDate: '2999-01-01',
        userId: 'u',
      }),
    ).rejects.toThrow(GuayacanInvalidDateError);
  });
});

describe('RegisterGuayacanCashAdjustmentUseCase', () => {
  let repository: jest.Mocked<GuayacanCashBoxRepository>;
  let useCase: RegisterGuayacanCashAdjustmentUseCase;

  beforeEach(() => {
    repository = buildRepository();
    useCase = new RegisterGuayacanCashAdjustmentUseCase(repository);
  });

  it('requires a reason', async () => {
    await expect(
      useCase.execute({
        amount: -1,
        concept: 'Ajuste',
        reason: 'no',
        userId: 'admin',
      }),
    ).rejects.toThrow(GuayacanReasonRequiredError);
  });

  it('registers a signed AJUSTE with no breakdown', async () => {
    await useCase.execute({
      amount: -0.5,
      concept: 'Ajuste por arqueo',
      reason: 'Faltante en conteo',
      userId: 'admin',
    });

    expect(repository.registerMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        movementType: 'AJUSTE',
        amount: -0.5,
        cashDetails: [],
      }),
    );
  });
});

describe('VoidGuayacanCashMovementUseCase', () => {
  it('voids with today as the business date and returns the (now ANULADO) original', async () => {
    const repository = buildRepository();
    const useCase = new VoidGuayacanCashMovementUseCase(repository);

    const result = await useCase.execute({
      id: 'mov-1',
      reason: 'Registrado por error',
      userId: 'admin',
    });

    expect(repository.voidMovement).toHaveBeenCalledWith(
      'mov-1',
      todayIsoDate(),
      'admin',
      'Registrado por error',
    );
    expect(result).toBe(MOVEMENT);
  });

  it('requires a reason', async () => {
    const useCase = new VoidGuayacanCashMovementUseCase(buildRepository());
    await expect(
      useCase.execute({ id: 'mov-1', reason: ' ', userId: 'admin' }),
    ).rejects.toThrow(GuayacanReasonRequiredError);
  });
});

describe('ListGuayacanCashMovementsUseCase', () => {
  it('defaults to page 1 / 20 rows and caps the limit at 100', async () => {
    const repository = buildRepository();
    const useCase = new ListGuayacanCashMovementsUseCase(repository);

    await useCase.execute({});
    expect(repository.findMovements).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, limit: 20 }),
    );

    await useCase.execute({ page: 3, limit: 1000 });
    expect(repository.findMovements).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 3, limit: 100 }),
    );
  });

  it('rejects an inverted date range', () => {
    const useCase = new ListGuayacanCashMovementsUseCase(buildRepository());
    expect(() =>
      useCase.execute({ startDate: '2026-11-05', endDate: '2026-11-01' }),
    ).toThrow(GuayacanInvalidDateError);
  });
});

describe('RegisterGuayacanCashCountUseCase', () => {
  it('keeps zero rows (a full count) and never touches the Kardex', async () => {
    const repository = buildRepository();
    const useCase = new RegisterGuayacanCashCountUseCase(repository);

    await useCase.execute({
      details: [
        { denomination: 100, quantity: 2 },
        { denomination: 5, quantity: 0 },
      ],
      userId: 'u',
    });

    expect(repository.registerCount).toHaveBeenCalledWith(
      expect.objectContaining({
        details: [
          { denomination: 100, quantity: 2 },
          { denomination: 5, quantity: 0 },
        ],
      }),
    );
    expect(repository.registerMovement).not.toHaveBeenCalled();
  });

  it('rejects a duplicated denomination', async () => {
    const useCase = new RegisterGuayacanCashCountUseCase(buildRepository());
    await expect(
      useCase.execute({
        details: [
          { denomination: 100, quantity: 1 },
          { denomination: 100, quantity: 2 },
        ],
        userId: 'u',
      }),
    ).rejects.toThrow(GuayacanInvalidDenominationError);
  });
});
