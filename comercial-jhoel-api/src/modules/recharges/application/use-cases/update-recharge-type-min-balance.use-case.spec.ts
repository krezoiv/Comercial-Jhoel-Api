import { UpdateRechargeTypeMinBalanceUseCase } from './update-recharge-type-min-balance.use-case';
import { RechargeTypeRepository } from '../../domain/repositories/recharge-type.repository';
import { InvalidMinBalanceError } from '../../domain/errors/invalid-min-balance.error';
import { RechargeType } from '../../domain/entities/recharge-type.entity';

function makeType(minBalance: number): RechargeType {
  return RechargeType.create({
    id: 'type-claro',
    name: 'Claro',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    minBalance,
  });
}

describe('UpdateRechargeTypeMinBalanceUseCase', () => {
  let repository: jest.Mocked<RechargeTypeRepository>;
  let useCase: UpdateRechargeTypeMinBalanceUseCase;

  beforeEach(() => {
    repository = {
      updateMinBalance: jest.fn(),
    } as unknown as jest.Mocked<RechargeTypeRepository>;
    useCase = new UpdateRechargeTypeMinBalanceUseCase(repository);
  });

  it('rejects a negative minBalance', async () => {
    await expect(
      useCase.execute({ id: 'type-claro', minBalance: -10 }),
    ).rejects.toThrow(InvalidMinBalanceError);
    expect(repository.updateMinBalance).not.toHaveBeenCalled();
  });

  it('accepts zero (means "no threshold configured")', async () => {
    repository.updateMinBalance.mockResolvedValue(makeType(0));

    const result = await useCase.execute({ id: 'type-claro', minBalance: 0 });

    expect(repository.updateMinBalance).toHaveBeenCalledWith('type-claro', 0);
    expect(result.minBalance).toBe(0);
  });

  it('persists a valid positive threshold', async () => {
    repository.updateMinBalance.mockResolvedValue(makeType(100));

    const result = await useCase.execute({ id: 'type-claro', minBalance: 100 });

    expect(result.minBalance).toBe(100);
  });
});
