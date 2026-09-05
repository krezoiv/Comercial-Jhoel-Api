import { GetAlertSettingsUseCase } from './get-alert-settings.use-case';
import { AlertSettingsRepository } from '../../domain/repositories/alert-settings.repository';
import { AlertSettings } from '../../domain/entities/alert-settings.entity';

describe('GetAlertSettingsUseCase', () => {
  it('returns the singleton settings row', async () => {
    const repository = {
      get: jest.fn().mockResolvedValue(
        AlertSettings.create({
          id: 'settings-1',
          purchasePaymentAlertDays: 5,
          updatedAt: new Date('2026-09-01T00:00:00Z'),
          updatedBy: 'user-1',
          updatedByUsername: 'admin1',
        }),
      ),
    } as unknown as jest.Mocked<AlertSettingsRepository>;
    const useCase = new GetAlertSettingsUseCase(repository);

    const result = await useCase.execute();

    expect(result.purchasePaymentAlertDays).toBe(5);
    expect(result.updatedByUsername).toBe('admin1');
  });
});
