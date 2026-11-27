import { Asset } from '../../domain/entities/asset.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { DeactivateAssetUseCase } from './deactivate-asset.use-case';
import { RegisterAssetChargeUseCase } from './register-asset-charge.use-case';
import { UpdateAssetUseCase } from './update-asset.use-case';

const CLIENT = '11111111-1111-1111-1111-111111111111';

function asset(over: Partial<Parameters<typeof Asset.create>[0]> = {}): Asset {
  return Asset.create({
    id: 'a-1',
    clientId: CLIENT,
    clientName: 'Cliente C',
    date: '2026-11-26',
    amount: 700,
    movementType: 'CARGO',
    sequence: 1,
    description: 'Activo',
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

function repository(): jest.Mocked<AssetRepository> {
  return {
    findAll: jest.fn(),
    getReportSummary: jest.fn(),
    findById: jest.fn().mockResolvedValue(asset()),
    create: jest.fn(),
    update: jest.fn().mockResolvedValue(asset({ amount: 650 })),
    deactivate: jest.fn().mockResolvedValue(undefined),
    registerMovement: jest.fn().mockResolvedValue(asset()),
    getCurrentBalance: jest.fn(),
    getTrace: jest.fn().mockResolvedValue(null),
    getStatement: jest.fn(),
  };
}

const clients = {
  findById: jest.fn().mockResolvedValue({ id: CLIENT, isActive: true }),
} as unknown as ClientRepository;

describe('Activos — trazabilidad con Caja', () => {
  it('changing the amount needs a reason; the same amount does not', async () => {
    const repo = repository();
    const useCase = new UpdateAssetUseCase(repo, clients);
    await expect(
      useCase.execute('a-1', { amount: 650, updatedBy: 'u-2' }),
    ).rejects.toMatchObject({ code: 'PORTFOLIO_CHANGE_REASON_REQUIRED' });
    await useCase.execute('a-1', {
      amount: 650,
      reason: 'Se recibieron Q650',
      updatedBy: 'u-2',
    });
    expect(repo.update).toHaveBeenLastCalledWith(
      'a-1',
      expect.objectContaining({ amount: 650, reason: 'Se recibieron Q650' }),
    );
    await useCase.execute('a-1', { amount: 700, updatedBy: 'u-2' });
    expect(repo.update).toHaveBeenLastCalledWith(
      'a-1',
      expect.objectContaining({ amount: 700, reason: null }),
    );
  });

  it('deleting requires the reason and the user who did it', async () => {
    const repo = repository();
    const useCase = new DeactivateAssetUseCase(repo);
    await expect(
      useCase.execute('a-1', { reason: '', userId: 'u-2' }),
    ).rejects.toMatchObject({ code: 'PORTFOLIO_CHANGE_REASON_REQUIRED' });
    await useCase.execute('a-1', {
      reason: 'Devolución no realizada',
      userId: 'u-2',
    });
    expect(repo.deactivate).toHaveBeenCalledWith(
      'a-1',
      'Devolución no realizada',
      'u-2',
    );
  });

  it('an asset received by bank carries its payment method', async () => {
    const repo = repository();
    await new RegisterAssetChargeUseCase(repo, clients).execute({
      clientId: CLIENT,
      amount: 900,
      date: '2026-11-26',
      paymentMethod: 'BANCO',
      createdBy: 'u-1',
    });
    expect(repo.registerMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        movementType: 'CARGO',
        paymentMethod: 'BANCO',
      }),
      undefined,
    );
  });
});
