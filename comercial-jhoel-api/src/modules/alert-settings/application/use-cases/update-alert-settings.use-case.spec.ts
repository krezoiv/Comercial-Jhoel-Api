import { UpdateAlertSettingsUseCase } from './update-alert-settings.use-case';
import { AlertSettingsRepository } from '../../domain/repositories/alert-settings.repository';
import { InvalidAlertSettingsError } from '../../domain/errors/invalid-alert-settings.error';
import { AlertSettings } from '../../domain/entities/alert-settings.entity';

function makeSettings(purchasePaymentAlertDays: number): AlertSettings {
  return AlertSettings.create({
    id: 'settings-1',
    purchasePaymentAlertDays,
    updatedAt: new Date(),
    updatedBy: 'user-1',
    updatedByUsername: 'admin1',
  });
}

describe('UpdateAlertSettingsUseCase', () => {
  let repository: jest.Mocked<AlertSettingsRepository>;
  let useCase: UpdateAlertSettingsUseCase;

  beforeEach(() => {
    repository = {
      update: jest.fn(),
    } as unknown as jest.Mocked<AlertSettingsRepository>;
    useCase = new UpdateAlertSettingsUseCase(repository);
  });

  it('rejects a negative purchasePaymentAlertDays', async () => {
    await expect(
      useCase.execute({ purchasePaymentAlertDays: -1, updatedBy: 'user-1' }),
    ).rejects.toThrow(InvalidAlertSettingsError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('rejects a non-integer purchasePaymentAlertDays', async () => {
    await expect(
      useCase.execute({ purchasePaymentAlertDays: 2.5, updatedBy: 'user-1' }),
    ).rejects.toThrow(InvalidAlertSettingsError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('accepts zero (alert immediately on the due date, no advance window)', async () => {
    repository.update.mockResolvedValue(makeSettings(0));

    const result = await useCase.execute({
      purchasePaymentAlertDays: 0,
      updatedBy: 'user-1',
    });

    expect(repository.update).toHaveBeenCalledWith({
      purchasePaymentAlertDays: 0,
      updatedBy: 'user-1',
    });
    expect(result.purchasePaymentAlertDays).toBe(0);
  });

  it('persists a valid positive threshold', async () => {
    repository.update.mockResolvedValue(makeSettings(7));

    const result = await useCase.execute({
      purchasePaymentAlertDays: 7,
      updatedBy: 'user-1',
    });

    expect(result.purchasePaymentAlertDays).toBe(7);
  });
});
